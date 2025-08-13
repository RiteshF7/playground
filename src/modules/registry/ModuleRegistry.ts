// Module Registry System
import { BaseHardwareModule } from '../base';
import { BlockDefinition, ValidationResult } from '../../core/types';
import { ErrorUtils, ValidationUtils } from '../../core/utils';

export class ModuleRegistry {
  private static instance: ModuleRegistry;
  private modules: Map<string, BaseHardwareModule> = new Map();
  private blockIndex: Map<string, string> = new Map(); // blockId -> moduleId
  private categoryIndex: Map<string, string[]> = new Map(); // category -> moduleId[]

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  /**
   * Register a hardware module
   */
  register(module: BaseHardwareModule): ValidationResult {
    try {
      // Validate module
      const validation = this.validateModule(module);
      if (!validation.isValid) {
        return validation;
      }

      // Check for duplicate IDs
      if (this.modules.has(module.id)) {
        return {
          isValid: false,
          errors: [`Module with ID '${module.id}' is already registered`]
        };
      }

      // Register module
      this.modules.set(module.id, module);

      // Index blocks
      this.indexBlocks(module);

      // Index categories
      this.indexCategories(module);

      console.log(`✅ Registered module: ${module.name} (${module.id})`);

      return { isValid: true, errors: [] };

    } catch (error) {
      const appError = ErrorUtils.handleError(error);
      return {
        isValid: false,
        errors: [appError.message]
      };
    }
  }

  /**
   * Unregister a module
   */
  unregister(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module) {
      return false;
    }

    // Remove from indexes
    this.removeFromIndexes(module);

    // Remove from registry
    this.modules.delete(moduleId);

    console.log(`🗑️ Unregistered module: ${module.name} (${moduleId})`);
    return true;
  }

  /**
   * Get module by ID
   */
  getModule(id: string): BaseHardwareModule | null {
    return this.modules.get(id) || null;
  }

  /**
   * Get all registered modules
   */
  getAllModules(): BaseHardwareModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get modules by category
   */
  getModulesByCategory(category: string): BaseHardwareModule[] {
    const moduleIds = this.categoryIndex.get(category) || [];
    return moduleIds.map(id => this.modules.get(id)!).filter(Boolean);
  }

  /**
   * Get module that owns a specific block
   */
  getModuleForBlock(blockId: string): BaseHardwareModule | null {
    const moduleId = this.blockIndex.get(blockId);
    return moduleId ? this.modules.get(moduleId) || null : null;
  }

  /**
   * Get all blocks from all modules
   */
  getAllBlocks(): BlockDefinition[] {
    const blocks: BlockDefinition[] = [];

    for (const module of this.modules.values()) {
      blocks.push(...module.blocks);
    }

    return blocks;
  }

  /**
   * Get blocks by category
   */
  getBlocksByCategory(category: string): BlockDefinition[] {
    const blocks: BlockDefinition[] = [];

    for (const module of this.modules.values()) {
      blocks.push(...module.getBlocksByCategory(category));
    }

    return blocks;
  }

  /**
   * Get block by ID
   */
  getBlockById(blockId: string): BlockDefinition | null {
    const module = this.getModuleForBlock(blockId);
    return module ? module.getBlockById(blockId) || null : null;
  }

  /**
   * Search modules
   */
  searchModules(query: string): BaseHardwareModule[] {
    const lowerQuery = query.toLowerCase();

    return Array.from(this.modules.values()).filter(module =>
      module.name.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery) ||
      module.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    moduleCount: number;
    blockCount: number;
    categoryCounts: Record<string, number>;
  } {
    const stats = {
      moduleCount: this.modules.size,
      blockCount: 0,
      categoryCounts: {} as Record<string, number>
    };

    for (const module of this.modules.values()) {
      stats.blockCount += module.blocks.length;

      if (!stats.categoryCounts[module.category]) {
        stats.categoryCounts[module.category] = 0;
      }
      stats.categoryCounts[module.category]++;
    }

    return stats;
  }

  /**
   * Validate a module before registration
   */
  private validateModule(module: BaseHardwareModule): ValidationResult {
    const errors: string[] = [];

    // Basic validation
    if (!module.id || typeof module.id !== 'string') {
      errors.push('Module must have a valid ID');
    }

    if (!module.name || typeof module.name !== 'string') {
      errors.push('Module must have a valid name');
    }

    if (!module.version || typeof module.version !== 'string') {
      errors.push('Module must have a valid version');
    }

    if (!module.category || typeof module.category !== 'string') {
      errors.push('Module must have a valid category');
    }

    // Validate blocks
    for (const block of module.blocks) {
      const blockValidation = ValidationUtils.validateBlockConfiguration(block);
      if (!blockValidation.isValid) {
        errors.push(`Invalid block '${block.id}': ${blockValidation.errors.join(', ')}`);
      }
    }

    // Check for duplicate block IDs within module
    const blockIds = new Set<string>();
    for (const block of module.blocks) {
      if (blockIds.has(block.id)) {
        errors.push(`Duplicate block ID in module: ${block.id}`);
      }
      blockIds.add(block.id);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Index blocks for fast lookup
   */
  private indexBlocks(module: BaseHardwareModule): void {
    for (const block of module.blocks) {
      this.blockIndex.set(block.id, module.id);
    }
  }

  /**
   * Index categories for fast lookup
   */
  private indexCategories(module: BaseHardwareModule): void {
    if (!this.categoryIndex.has(module.category)) {
      this.categoryIndex.set(module.category, []);
    }
    this.categoryIndex.get(module.category)!.push(module.id);
  }

  /**
   * Remove module from all indexes
   */
  private removeFromIndexes(module: BaseHardwareModule): void {
    // Remove blocks from index
    for (const block of module.blocks) {
      this.blockIndex.delete(block.id);
    }

    // Remove from category index
    const categoryModules = this.categoryIndex.get(module.category);
    if (categoryModules) {
      const index = categoryModules.indexOf(module.id);
      if (index > -1) {
        categoryModules.splice(index, 1);
      }

      // Remove category if empty
      if (categoryModules.length === 0) {
        this.categoryIndex.delete(module.category);
      }
    }
  }

  /**
   * Clear all modules (for testing)
   */
  clear(): void {
    this.modules.clear();
    this.blockIndex.clear();
    this.categoryIndex.clear();
  }
}

// Export singleton instance
export const moduleRegistry = ModuleRegistry.getInstance();
