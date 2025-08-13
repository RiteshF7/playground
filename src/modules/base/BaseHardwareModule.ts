// Base Hardware Module Class
import {
  HardwareModule,
  ModuleCapability,
  BlockDefinition,
  ModuleState,
  ValidationResult,
  ExecutionResult,
  HardwareCategory
} from '../../core/types';
import { ValidationUtils, ErrorUtils } from '../../core/utils';
import { BlockBuilder } from './BlockBuilder';

export abstract class BaseHardwareModule implements HardwareModule {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly version: string;
  abstract readonly category: HardwareCategory;

  protected _capabilities: ModuleCapability[] = [];
  protected _blocks: BlockDefinition[] = [];
  protected _currentState: ModuleState | null = null;
  protected blockBuilder: BlockBuilder;

  constructor() {
    this.blockBuilder = new BlockBuilder();
    this.initializeCapabilities();
    this.generateBlocks();
  }

  // Abstract methods that must be implemented
  protected abstract initializeCapabilities(): void;
  protected abstract createBlocks(): BlockDefinition[];

  // Optional methods that can be overridden
  protected validateModuleState(state: ModuleState): ValidationResult {
    return ValidationUtils.validateModuleState(state);
  }

  protected onStateChange(oldState: ModuleState | null, newState: ModuleState): void {
    // Override in subclasses for custom state change handling
  }

  // Public interface methods
  get capabilities(): ModuleCapability[] {
    return [...this._capabilities];
  }

  get blocks(): BlockDefinition[] {
    return [...this._blocks];
  }

  get currentState(): ModuleState | null {
    return this._currentState ? { ...this._currentState } : null;
  }

  /**
   * Add a capability to this module
   */
  protected addCapability(capability: ModuleCapability): void {
    this._capabilities.push(capability);
  }

  /**
   * Generate blocks for this module
   */
  private generateBlocks(): void {
    try {
      this._blocks = this.createBlocks();
      this.validateBlocks();
    } catch (error) {
      throw ErrorUtils.createError(
        `Failed to generate blocks for module ${this.id}`,
        'BLOCK_GENERATION_ERROR',
        'configuration',
        { moduleId: this.id, error }
      );
    }
  }

  /**
   * Validate all blocks for this module
   */
  private validateBlocks(): void {
    for (const block of this._blocks) {
      const validation = ValidationUtils.validateBlockConfiguration(block);
      if (!validation.isValid) {
        throw ErrorUtils.createValidationError(
          `Invalid block configuration for ${block.id}: ${validation.errors.join(', ')}`
        );
      }
    }
  }

  /**
   * Execute a command on this module
   */
  async executeCommand(command: string, parameters: Record<string, any>): Promise<ExecutionResult> {
    try {
      const result = await this.handleCommand(command, parameters);

      if (result.success && result.data) {
        this.updateState(result.data);
      }

      return result;
    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Handle module-specific commands
   */
  protected async handleCommand(command: string, parameters: Record<string, any>): Promise<ExecutionResult> {
    throw ErrorUtils.createError(
      `Command '${command}' not implemented for module ${this.id}`,
      'COMMAND_NOT_IMPLEMENTED',
      'execution'
    );
  }

  /**
   * Update module state
   */
  updateState(newState: Record<string, any>): void {
    const oldState = this._currentState;

    this._currentState = {
      moduleId: this.id,
      state: newState,
      timestamp: Date.now()
    };

    // Validate new state
    const validation = this.validateModuleState(this._currentState);
    if (!validation.isValid) {
      this._currentState = oldState; // Rollback
      throw ErrorUtils.createValidationError(
        `Invalid state for module ${this.id}: ${validation.errors.join(', ')}`
      );
    }

    // Notify state change
    this.onStateChange(oldState, this._currentState);
  }

  /**
   * Reset module to initial state
   */
  reset(): void {
    const oldState = this._currentState;
    this._currentState = null;
    this.onStateChange(oldState, null);
  }

  /**
   * Get module information
   */
  getInfo(): HardwareModule {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      category: this.category,
      capabilities: this.capabilities
    };
  }

  /**
   * Check if module supports a specific capability
   */
  hasCapability(type: string): boolean {
    return this._capabilities.some(cap => cap.type === type);
  }

  /**
   * Get blocks by category
   */
  getBlocksByCategory(category: string): BlockDefinition[] {
    return this._blocks.filter(block => block.category === category);
  }

  /**
   * Get block by ID
   */
  getBlockById(id: string): BlockDefinition | undefined {
    return this._blocks.find(block => block.id === id);
  }
}
