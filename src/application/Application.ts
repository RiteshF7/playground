// Main Application Class
import { PlaygroundEngine } from '../playground/engine';
import { CurriculumManager } from '../content/curriculum';
import { moduleRegistry } from '../modules/registry';
import { ConfigStorage } from '../services/storage';
import { ValidationResult, ExecutionResult } from '../core/types';
import { ErrorUtils } from '../core/utils';

// Import module implementations
import { LedModule } from '../modules/implementations';
// Add other modules as they're implemented

// Import configurations
import {
  defaultPlaygroundConfig,
  sampleCurriculum,
  defaultHardwareConfig
} from '../config/base';

export class Application {
  private playgroundEngine: PlaygroundEngine;
  private curriculumManager: CurriculumManager;
  private configStorage: ConfigStorage;
  private isInitialized: boolean = false;

  constructor() {
    this.playgroundEngine = new PlaygroundEngine();
    this.curriculumManager = new CurriculumManager();
    this.configStorage = new ConfigStorage('hardware-playground');
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<ValidationResult> {
    try {
      console.log('🚀 Initializing Hardware Playground Application...');

      // Register hardware modules
      await this.registerModules();

      // Load configurations
      await this.loadConfigurations();

      // Initialize playground engine
      const playgroundInit = await this.playgroundEngine.initialize(defaultPlaygroundConfig);
      if (!playgroundInit.isValid) {
        return playgroundInit;
      }

      // Load curriculum
      const curriculumInit = await this.curriculumManager.loadCurriculum(sampleCurriculum);
      if (!curriculumInit.isValid) {
        return curriculumInit;
      }

      this.isInitialized = true;
      console.log('✅ Application initialized successfully');

      return { isValid: true, errors: [] };

    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      return ErrorUtils.toValidationResult(error);
    }
  }

  /**
   * Register all hardware modules
   */
  private async registerModules(): Promise<void> {
    console.log('📦 Registering hardware modules...');

    const modules = [
      new LedModule(),
      // Add other modules here as they're implemented
    ];

    for (const module of modules) {
      const result = moduleRegistry.register(module);
      if (!result.isValid) {
        throw new Error(`Failed to register module ${module.id}: ${result.errors.join(', ')}`);
      }
    }

    const stats = moduleRegistry.getStats();
    console.log(`📊 Registered ${stats.moduleCount} modules with ${stats.blockCount} total blocks`);
  }

  /**
   * Load application configurations
   */
  private async loadConfigurations(): Promise<void> {
    console.log('⚙️ Loading configurations...');

    // Save default configurations if they don't exist
    const configs = [
      { key: 'playground-default', data: defaultPlaygroundConfig },
      { key: 'curriculum-sample', data: sampleCurriculum },
      { key: 'hardware-default', data: defaultHardwareConfig }
    ];

    for (const config of configs) {
      const exists = await this.configStorage.exists(config.key);
      if (!exists) {
        await this.configStorage.save(config.key, config.data);
        console.log(`💾 Saved default configuration: ${config.key}`);
      }
    }
  }

  /**
   * Get application status
   */
  getStatus(): {
    isInitialized: boolean;
    moduleCount: number;
    playgroundStatus: any;
    curriculumStats: any;
  } {
    const moduleStats = moduleRegistry.getStats();
    const curriculumStats = this.curriculumManager.getStats();
    const playgroundStatus = this.playgroundEngine.getStatus();

    return {
      isInitialized: this.isInitialized,
      moduleCount: moduleStats.moduleCount,
      playgroundStatus,
      curriculumStats
    };
  }

  /**
   * Get playground engine instance
   */
  getPlaygroundEngine(): PlaygroundEngine {
    return this.playgroundEngine;
  }

  /**
   * Get curriculum manager instance
   */
  getCurriculumManager(): CurriculumManager {
    return this.curriculumManager;
  }

  /**
   * Get module registry instance
   */
  getModuleRegistry(): typeof moduleRegistry {
    return moduleRegistry;
  }

  /**
   * Get config storage instance
   */
  getConfigStorage(): ConfigStorage {
    return this.configStorage;
  }

  /**
   * Shutdown the application
   */
  async shutdown(): Promise<ExecutionResult> {
    try {
      console.log('🔄 Shutting down application...');

      // Stop any running executions
      await this.playgroundEngine.stopExecution();

      // Clear module registry
      moduleRegistry.clear();

      this.isInitialized = false;
      console.log('✅ Application shutdown complete');

      return {
        success: true,
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }
}

// Export singleton instance
export const app = new Application();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  app.initialize().then(result => {
    if (result.isValid) {
      console.log('🎉 Hardware Playground ready!');

      // Make app available globally for debugging
      (window as any).hardwarePlaygroundApp = app;
    } else {
      console.error('❌ Failed to initialize:', result.errors);
    }
  });
}
