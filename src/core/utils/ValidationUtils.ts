// Validation Utilities
import { BlockDefinition, ModuleState, ValidationResult, ValidationRule } from '../types';
import { AppConfig } from '../config';

export class ValidationUtils {

  /**
   * Validate a block configuration
   */
  static validateBlockConfiguration(config: Partial<BlockDefinition>): ValidationResult {
    const errors: string[] = [];

    if (!config.id || typeof config.id !== 'string') {
      errors.push('Block must have a valid string ID');
    }

    if (!config.displayName || typeof config.displayName !== 'string') {
      errors.push('Block must have a valid display name');
    }

    if (!config.category || typeof config.category !== 'string') {
      errors.push('Block must have a valid category');
    }

    if (!config.codeTemplate) {
      errors.push('Block must have code templates');
    } else {
      if (!config.codeTemplate.javascript) {
        errors.push('Block must have JavaScript code template');
      }
      if (!config.codeTemplate.python) {
        errors.push('Block must have Python code template');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate module state
   */
  static validateModuleState(state: Partial<ModuleState>): ValidationResult {
    const errors: string[] = [];

    if (!state.moduleId || typeof state.moduleId !== 'string') {
      errors.push('Module state must have a valid module ID');
    }

    if (!state.state || typeof state.state !== 'object') {
      errors.push('Module state must have a state object');
    }

    if (typeof state.timestamp !== 'number') {
      errors.push('Module state must have a valid timestamp');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Apply validation rules to a value
   */
  static applyValidationRules(value: any, rules: ValidationRule[]): ValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      const result = this.applyValidationRule(value, rule);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Apply a single validation rule
   */
  private static applyValidationRule(value: any, rule: ValidationRule): ValidationResult {
    const errors: string[] = [];

    switch (rule.type) {
      case 'range':
        const { min, max } = rule.parameters;
        if (typeof value === 'number' && (value < min || value > max)) {
          errors.push(rule.message || `Value must be between ${min} and ${max}`);
        }
        break;

      case 'enum':
        const { values } = rule.parameters;
        if (!values.includes(value)) {
          errors.push(rule.message || `Value must be one of: ${values.join(', ')}`);
        }
        break;

      case 'pattern':
        const { pattern } = rule.parameters;
        const regex = new RegExp(pattern);
        if (typeof value === 'string' && !regex.test(value)) {
          errors.push(rule.message || 'Value does not match required pattern');
        }
        break;

      case 'custom':
        // Custom validation logic would be implemented here
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate configuration object against schema
   */
  static validateConfigSchema(config: any, schema: any): ValidationResult {
    // This would typically use a JSON schema validator
    // For now, basic validation
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
      errors.push('Configuration must be an object');
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      errors: []
    };
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate execution limits
   */
  static validateExecutionLimits(blockCount: number, executionTime: number): ValidationResult {
    const errors: string[] = [];

    if (blockCount > AppConfig.PLAYGROUND.MAX_BLOCKS_PER_PROGRAM) {
      errors.push(`Program exceeds maximum block limit of ${AppConfig.PLAYGROUND.MAX_BLOCKS_PER_PROGRAM}`);
    }

    if (executionTime > AppConfig.PLAYGROUND.MAX_EXECUTION_TIME) {
      errors.push(`Execution time exceeds limit of ${AppConfig.PLAYGROUND.MAX_EXECUTION_TIME}ms`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
