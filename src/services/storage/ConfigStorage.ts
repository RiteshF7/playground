// Configuration Storage Service
import { ExecutionResult } from '../../core/types';
import { ErrorUtils } from '../../core/utils';

export class ConfigStorage {
  private storageKey: string;
  private cache: Map<string, any> = new Map();

  constructor(namespace: string = 'hardware-playground') {
    this.storageKey = namespace;
  }

  /**
   * Save configuration to storage
   */
  async save(key: string, data: any): Promise<ExecutionResult> {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      const serialized = JSON.stringify(data);

      // In browser environment, use localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(fullKey, serialized);
      }

      // Update cache
      this.cache.set(key, data);

      return {
        success: true,
        data: { key, size: serialized.length },
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Load configuration from storage
   */
  async load<T = any>(key: string): Promise<ExecutionResult<T>> {
    try {
      // Check cache first
      if (this.cache.has(key)) {
        return {
          success: true,
          data: this.cache.get(key),
          timestamp: Date.now()
        };
      }

      const fullKey = `${this.storageKey}_${key}`;
      let serialized: string | null = null;

      // In browser environment, use localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        serialized = window.localStorage.getItem(fullKey);
      }

      if (!serialized) {
        return {
          success: false,
          error: `Configuration not found: ${key}`,
          timestamp: Date.now()
        };
      }

      const data = JSON.parse(serialized);
      this.cache.set(key, data);

      return {
        success: true,
        data,
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Check if configuration exists
   */
  async exists(key: string): Promise<boolean> {
    if (this.cache.has(key)) {
      return true;
    }

    const fullKey = `${this.storageKey}_${key}`;

    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(fullKey) !== null;
    }

    return false;
  }

  /**
   * Delete configuration
   */
  async delete(key: string): Promise<ExecutionResult> {
    try {
      const fullKey = `${this.storageKey}_${key}`;

      // Remove from browser storage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(fullKey);
      }

      // Remove from cache
      this.cache.delete(key);

      return {
        success: true,
        data: { key },
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * List all configuration keys
   */
  async list(): Promise<ExecutionResult<string[]>> {
    try {
      const keys: string[] = [];
      const prefix = `${this.storageKey}_`;

      // Get from browser storage
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keys.push(key.substring(prefix.length));
          }
        }
      }

      // Add cache-only keys
      for (const key of this.cache.keys()) {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      }

      return {
        success: true,
        data: keys,
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Clear all configurations
   */
  async clear(): Promise<ExecutionResult> {
    try {
      const prefix = `${this.storageKey}_`;

      // Clear browser storage
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];

        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => window.localStorage.removeItem(key));
      }

      // Clear cache
      this.cache.clear();

      return {
        success: true,
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<ExecutionResult<{
    totalKeys: number;
    totalSize: number;
    cacheSize: number;
  }>> {
    try {
      let totalKeys = 0;
      let totalSize = 0;
      const cacheSize = this.cache.size;
      const prefix = `${this.storageKey}_`;

      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            totalKeys++;
            const value = window.localStorage.getItem(key);
            if (value) {
              totalSize += value.length;
            }
          }
        }
      }

      return {
        success: true,
        data: { totalKeys, totalSize, cacheSize },
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }
}
