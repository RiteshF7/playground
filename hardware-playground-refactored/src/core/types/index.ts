// Core Type Definitions
export * from './Hardware';
export * from './Playground';
export * from './Content';
export * from './Communication';

// Common utility types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ExecutionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ConfigurableItem {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  config?: Record<string, any>;
}
