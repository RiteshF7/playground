// Playground Execution Engine
import {
  BlockInstance,
  PlaygroundConfiguration,
  ExecutionResult,
  CodeLanguage,
  TestCaseDefinition,
  ValidationResult
} from '../../core/types';
import { CodeGenerator, ErrorUtils, ValidationUtils } from '../../core/utils';
import { DeviceHandler } from '../communication';
import { moduleRegistry } from '../../modules/registry';

export class PlaygroundEngine {
  private codeGenerator: CodeGenerator;
  private deviceHandler: DeviceHandler;
  private currentConfig: PlaygroundConfiguration | null = null;
  private isExecuting: boolean = false;

  constructor() {
    this.codeGenerator = new CodeGenerator();
    this.deviceHandler = new DeviceHandler();
  }

  /**
   * Initialize playground with configuration
   */
  async initialize(config: PlaygroundConfiguration): Promise<ValidationResult> {
    try {
      // Validate configuration
      const validation = this.validateConfiguration(config);
      if (!validation.isValid) {
        return validation;
      }

      this.currentConfig = config;

      // Initialize required modules
      await this.initializeModules(config.hardware);

      // Setup device communication if needed
      if (config.runner.executionMode === 'hardware' || config.runner.executionMode === 'hybrid') {
        await this.deviceHandler.initialize(config.runner.hardwareSettings);
      }

      return { isValid: true, errors: [] };

    } catch (error) {
      return ErrorUtils.toValidationResult(error);
    }
  }

  /**
   * Execute blocks as code
   */
  async executeBlocks(
    blocks: BlockInstance[],
    language: CodeLanguage = 'javascript'
  ): Promise<ExecutionResult> {

    if (this.isExecuting) {
      return {
        success: false,
        error: 'Execution already in progress',
        timestamp: Date.now()
      };
    }

    try {
      this.isExecuting = true;

      // Validate blocks
      const validation = this.validateBlocks(blocks);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Block validation failed: ${validation.errors.join(', ')}`,
          timestamp: Date.now()
        };
      }

      // Generate code
      const code = this.codeGenerator.generateCode(blocks, language);

      // Execute based on mode
      const result = await this.executeCode(code, language);

      return result;

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    } finally {
      this.isExecuting = false;
    }
  }

  /**
   * Execute generated code
   */
  private async executeCode(code: string, language: CodeLanguage): Promise<ExecutionResult> {
    if (!this.currentConfig) {
      throw ErrorUtils.createError('Playground not initialized', 'NOT_INITIALIZED');
    }

    const { executionMode } = this.currentConfig.runner;

    switch (executionMode) {
      case 'simulation':
        return this.executeInSimulation(code, language);

      case 'hardware':
        return this.executeOnHardware(code, language);

      case 'hybrid':
        // Execute on both simulation and hardware
        const [simResult, hwResult] = await Promise.allSettled([
          this.executeInSimulation(code, language),
          this.executeOnHardware(code, language)
        ]);

        return {
          success: simResult.status === 'fulfilled' && hwResult.status === 'fulfilled',
          data: {
            simulation: simResult.status === 'fulfilled' ? simResult.value : simResult.reason,
            hardware: hwResult.status === 'fulfilled' ? hwResult.value : hwResult.reason
          },
          timestamp: Date.now()
        };

      default:
        throw ErrorUtils.createError(`Unknown execution mode: ${executionMode}`, 'INVALID_EXECUTION_MODE');
    }
  }

  /**
   * Execute code in simulation
   */
  private async executeInSimulation(code: string, language: CodeLanguage): Promise<ExecutionResult> {
    try {
      if (language === 'javascript') {
        // Create execution context
        const context = this.createSimulationContext();

        // Execute code in controlled environment
        const result = await this.executeJavaScriptInContext(code, context);

        return {
          success: true,
          data: result,
          timestamp: Date.now()
        };
      } else {
        // For Python/MicroPython, we'd need a Python interpreter or converter
        throw ErrorUtils.createError(
          `Simulation for ${language} not yet implemented`,
          'SIMULATION_NOT_SUPPORTED'
        );
      }
    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Execute code on hardware
   */
  private async executeOnHardware(code: string, language: CodeLanguage): Promise<ExecutionResult> {
    try {
      if (!this.deviceHandler.isConnected()) {
        throw ErrorUtils.createCommunicationError('No hardware device connected');
      }

      return await this.deviceHandler.sendCode(code, language);
    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Create simulation context with hardware module APIs
   */
  private createSimulationContext(): Record<string, any> {
    const context: Record<string, any> = {
      // Standard utilities
      delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
      console: console,

      // Hardware simulation functions
      setDigitalPin: async (pin: number, value: number) => {
        const module = this.findModuleForPin(pin);
        if (module) {
          return await module.executeCommand('set_state', { pin, state: value });
        }
        throw new Error(`No module found for pin ${pin}`);
      },

      setAnalogPin: async (pin: number, value: number) => {
        const module = this.findModuleForPin(pin);
        if (module) {
          return await module.executeCommand('set_analog', { pin, value });
        }
        throw new Error(`No module found for pin ${pin}`);
      },

      readSensorPin: async (pin: number) => {
        const module = this.findModuleForPin(pin);
        if (module) {
          const result = await module.executeCommand('read_sensor', { pin });
          return result.data;
        }
        throw new Error(`No sensor module found for pin ${pin}`);
      }
    };

    // Add module-specific functions
    for (const moduleId of this.currentConfig?.hardware || []) {
      const module = moduleRegistry.getModule(moduleId);
      if (module) {
        // Add module-specific simulation functions
        context[`${moduleId}_execute`] = async (command: string, params: any) => {
          return await module.executeCommand(command, params);
        };
      }
    }

    return context;
  }

  /**
   * Execute JavaScript code in controlled context
   */
  private async executeJavaScriptInContext(code: string, context: Record<string, any>): Promise<any> {
    // Create function with context variables as parameters
    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);

    try {
      const asyncFunction = new Function(...contextKeys, `
        return (async () => {
          ${code}
        })();
      `);

      return await asyncFunction(...contextValues);
    } catch (error) {
      throw ErrorUtils.createExecutionError(`JavaScript execution failed: ${error}`);
    }
  }

  /**
   * Find module that handles a specific pin
   */
  private findModuleForPin(pin: number): any {
    // This would look up which module is configured for the given pin
    // For now, return first available module with digital output capability
    const modules = moduleRegistry.getAllModules();
    return modules.find(module => module.hasCapability('digital_output'));
  }

  /**
   * Validate blocks before execution
   */
  private validateBlocks(blocks: BlockInstance[]): ValidationResult {
    const errors: string[] = [];

    for (const block of blocks) {
      // Check if block type is registered
      const blockDef = moduleRegistry.getBlockById(block.type);
      if (!blockDef) {
        errors.push(`Unknown block type: ${block.type}`);
        continue;
      }

      // Validate block parameters
      for (const [paramName, paramValue] of Object.entries(block.parameters)) {
        const paramDef = blockDef.parameters.find(p => p.name === paramName);
        if (paramDef && paramDef.validation) {
          const validation = ValidationUtils.applyValidationRules(paramValue, paramDef.validation);
          if (!validation.isValid) {
            errors.push(`Invalid parameter ${paramName} in block ${block.type}: ${validation.errors.join(', ')}`);
          }
        }
      }
    }

    // Check execution limits
    const limitValidation = ValidationUtils.validateExecutionLimits(blocks.length, 0);
    if (!limitValidation.isValid) {
      errors.push(...limitValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate playground configuration
   */
  private validateConfiguration(config: PlaygroundConfiguration): ValidationResult {
    const errors: string[] = [];

    if (!config.id || !config.name) {
      errors.push('Configuration must have id and name');
    }

    if (!config.hardware || config.hardware.length === 0) {
      errors.push('Configuration must specify hardware modules');
    }

    // Validate that all specified modules are registered
    for (const moduleId of config.hardware) {
      if (!moduleRegistry.getModule(moduleId)) {
        errors.push(`Hardware module not found: ${moduleId}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Initialize required modules
   */
  private async initializeModules(moduleIds: string[]): Promise<void> {
    for (const moduleId of moduleIds) {
      const module = moduleRegistry.getModule(moduleId);
      if (!module) {
        throw ErrorUtils.createError(`Module not found: ${moduleId}`, 'MODULE_NOT_FOUND');
      }
      // Module initialization would happen here if needed
    }
  }

  /**
   * Run test cases
   */
  async runTestCases(blocks: BlockInstance[], testCases: TestCaseDefinition[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const testCase of testCases) {
      try {
        // Setup test case inputs
        this.setupTestCase(testCase);

        // Execute blocks
        const result = await this.executeBlocks(blocks);

        // Validate against expected outputs
        const validationResult = this.validateTestCaseResult(result, testCase);

        results.push({
          ...result,
          data: {
            ...result.data,
            testCaseId: testCase.id,
            passed: validationResult.isValid,
            validation: validationResult
          }
        });

      } catch (error) {
        results.push(ErrorUtils.toExecutionResult(error));
      }
    }

    return results;
  }

  /**
   * Setup test case environment
   */
  private setupTestCase(testCase: TestCaseDefinition): void {
    // Setup initial states, sensor values, etc.
    for (const input of testCase.inputs) {
      switch (input.type) {
        case 'initial_state':
          this.setInitialModuleStates(input.data);
          break;
        case 'sensor_data':
          this.setSensorValues(input.data);
          break;
      }
    }
  }

  /**
   * Validate test case result
   */
  private validateTestCaseResult(result: ExecutionResult, testCase: TestCaseDefinition): ValidationResult {
    // This would implement test case validation logic
    // For now, simple success check
    return {
      isValid: result.success,
      errors: result.success ? [] : [result.error || 'Execution failed']
    };
  }

  /**
   * Set initial module states for testing
   */
  private setInitialModuleStates(states: Record<string, any>): void {
    for (const [moduleId, state] of Object.entries(states)) {
      const module = moduleRegistry.getModule(moduleId);
      if (module) {
        module.updateState(state);
      }
    }
  }

  /**
   * Set sensor values for testing
   */
  private setSensorValues(sensorData: Record<string, any>): void {
    // Implementation would depend on sensor simulation system
  }

  /**
   * Stop current execution
   */
  async stopExecution(): Promise<void> {
    this.isExecuting = false;

    if (this.deviceHandler.isConnected()) {
      await this.deviceHandler.sendCommand({
        id: 'stop_execution',
        type: 'reset_device',
        target: 'system',
        parameters: {}
      });
    }
  }

  /**
   * Get execution status
   */
  getStatus(): {
    isExecuting: boolean;
    isConnected: boolean;
    currentConfig: PlaygroundConfiguration | null;
  } {
    return {
      isExecuting: this.isExecuting,
      isConnected: this.deviceHandler.isConnected(),
      currentConfig: this.currentConfig
    };
  }
}
