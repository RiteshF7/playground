// Playground Execution Engine
import {
  BlockInstance,
  PlaygroundConfiguration,
  ExecutionResult,
  CodeLanguage,
  TestCaseDefinition,
  ValidationResult,
  ModuleState
} from '../../core/types';
import { CodeGenerator, ErrorUtils, ValidationUtils } from '../../core/utils';
import { DeviceHandler } from '../communication';
import { moduleRegistry } from '../../modules/registry';
import { BaseHardwareModule } from '../../modules/base';

type EventListener = (data: any) => void;

export class PlaygroundEngine {
  private codeGenerator: CodeGenerator;
  private deviceHandler: DeviceHandler;
  private currentConfig: PlaygroundConfiguration | null = null;
  private isExecuting: boolean = false;
  private listeners: Map<string, EventListener[]> = new Map();

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

      // Generate code
      const code = javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());

      // Execute based on mode
      const result = await this.executeCode(code, language);

      return result;

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    } finally {
      this.isExecuting = false;
    }
  }

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
        const context = this.createSimulationContext();
        const result = await this.executeJavaScriptInContext(code, context);
        return { success: true, data: result, timestamp: Date.now() };
      } else {
        throw ErrorUtils.createError(`Simulation for ${language} not yet implemented`, 'SIMULATION_NOT_SUPPORTED');
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
      delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
      console: console,
      setLedState: async (pin: number, state: number) => {
        const ledModule = moduleRegistry.getModule('led-module') as BaseHardwareModule;
        if (ledModule) {
          await ledModule.executeCommand('set_state', { pin, state });
          this.emit('moduleStateChange', ledModule.currentState);
        }
      },
    };
    return context;
  }

  private async executeJavaScriptInContext(code: string, context: Record<string, any>): Promise<any> {
    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);
    const asyncFunction = new Function(...contextKeys, `return (async () => { ${code} })();`);
    try {
      return await asyncFunction(...contextValues);
    } catch (error) {
      throw ErrorUtils.createExecutionError(`JavaScript execution failed: ${error}`);
    }
  }

  private validateConfiguration(config: PlaygroundConfiguration): ValidationResult {
    const errors: string[] = [];
    if (!config.id || !config.name) {
      errors.push('Configuration must have id and name');
    }
    if (!config.hardware || config.hardware.length === 0) {
      errors.push('Configuration must specify hardware modules');
    }
    for (const moduleId of config.hardware) {
      if (!moduleRegistry.getModule(moduleId)) {
        errors.push(`Hardware module not found: ${moduleId}`);
      }
    }
    return { isValid: errors.length === 0, errors };
  }

  private async initializeModules(moduleIds: string[]): Promise<void> {
    for (const moduleId of moduleIds) {
      const module = moduleRegistry.getModule(moduleId);
      if (!module) {
        throw ErrorUtils.createError(`Module not found: ${moduleId}`, 'MODULE_NOT_FOUND');
      }
    }
  }

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

  // Event Emitter methods
  on(eventName: string, listener: EventListener) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
  }

  off(eventName: string, listener: EventListener) {
    if (this.listeners.has(eventName)) {
      const eventListeners = this.listeners.get(eventName)!;
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(eventName: string, data: any) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName)!.forEach(listener => listener(data));
    }
  }
}
