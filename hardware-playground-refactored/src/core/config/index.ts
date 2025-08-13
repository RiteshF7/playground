// Core Config Export
export * from './AppConfig';

// Configuration validation
import { ValidationResult } from '../types';

export function validateConfiguration(config: any): ValidationResult {
  const errors: string[] = [];

  if (!config) {
    errors.push('Configuration is required');
    return { isValid: false, errors };
  }

  // Add more validation as needed

  return { isValid: errors.length === 0, errors };
}
