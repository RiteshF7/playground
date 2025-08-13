// Block Builder Utility
import { BlockDefinition, BlockParameter, CodeTemplateMap, ValidationResult, ValidationRule } from '../../core/types';
import { ValidationUtils } from '../../core/utils';
import { AppConfig } from '../../core/config';

export class BlockBuilder {

  /**
   * Create a new block definition
   */
  createBlock(config: Partial<BlockDefinition>): BlockDefinition {
    const block: BlockDefinition = {
      id: config.id || '',
      displayName: config.displayName || '',
      category: config.category || 'default',
      parameters: config.parameters || [],
      codeTemplate: config.codeTemplate || { javascript: '', python: '' },
      description: config.description || '',
      color: config.color || this.getDefaultColor(config.category || 'default'),
      shape: config.shape || 'statement',
      validation: config.validation || []
    };

    // Validate the block
    const validation = ValidationUtils.validateBlockConfiguration(block);
    if (!validation.isValid) {
      throw new Error(`Invalid block configuration: ${validation.errors.join(', ')}`);
    }

    return block;
  }

  /**
   * Create a simple output block (no parameters)
   */
  createSimpleOutputBlock(
    id: string,
    displayName: string,
    category: string,
    codeTemplate: CodeTemplateMap
  ): BlockDefinition {
    return this.createBlock({
      id,
      displayName,
      category,
      codeTemplate,
      shape: 'statement'
    });
  }

  /**
   * Create a parameterized block
   */
  createParameterizedBlock(config: {
    id: string;
    displayName: string;
    category: string;
    parameters: BlockParameter[];
    codeTemplate: CodeTemplateMap;
    description?: string;
  }): BlockDefinition {
    return this.createBlock(config);
  }

  /**
   * Create a sensor input block
   */
  createSensorBlock(
    id: string,
    displayName: string,
    sensorType: string,
    codeTemplate: CodeTemplateMap
  ): BlockDefinition {
    return this.createBlock({
      id,
      displayName,
      category: 'sensors',
      codeTemplate,
      shape: 'expression',
      color: '#4CAF50'
    });
  }

  /**
   * Create a control flow block
   */
  createControlBlock(config: {
    id: string;
    displayName: string;
    parameters?: BlockParameter[];
    codeTemplate: CodeTemplateMap;
  }): BlockDefinition {
    return this.createBlock({
      ...config,
      category: 'control',
      color: '#FF9800',
      shape: 'statement'
    });
  }

  /**
   * Create standard parameter types
   */
  createNumberParameter(name: string, defaultValue: number = 0, min?: number, max?: number): BlockParameter {
    const validation: ValidationRule[] = [];

    if (min !== undefined || max !== undefined) {
      validation.push({
        type: 'range',
        parameters: { min: min ?? -Infinity, max: max ?? Infinity },
        message: `Value must be between ${min ?? '-∞'} and ${max ?? '∞'}`
      });
    }

    return {
      name,
      type: 'number',
      defaultValue,
      validation
    };
  }

  createStringParameter(name: string, defaultValue: string = '', pattern?: string): BlockParameter {
    const validation: ValidationRule[] = [];

    if (pattern) {
      validation.push({
        type: 'pattern',
        parameters: { pattern },
        message: 'Value does not match required pattern'
      });
    }

    return {
      name,
      type: 'string',
      defaultValue,
      validation
    };
  }

  createDropdownParameter(
    name: string,
    options: Array<{label: string; value: any}>,
    defaultValue?: any
  ): BlockParameter {
    return {
      name,
      type: 'dropdown',
      options,
      defaultValue: defaultValue ?? options[0]?.value
    };
  }

  createBooleanParameter(name: string, defaultValue: boolean = false): BlockParameter {
    return {
      name,
      type: 'boolean',
      defaultValue
    };
  }

  createColorParameter(name: string, defaultValue: string = '#FF0000'): BlockParameter {
    return {
      name,
      type: 'color',
      defaultValue
    };
  }

  /**
   * Create common code templates
   */
  createDelayTemplate(timeParam: string = 'time'): CodeTemplateMap {
    return {
      javascript: `await delay({{${timeParam}}});`,
      python: `time.sleep({{${timeParam}}} / 1000)`,
      micropython: `time.sleep_ms({{${timeParam}}})`
    };
  }

  createDigitalOutputTemplate(pinParam: string = 'pin', valueParam: string = 'value'): CodeTemplateMap {
    return {
      javascript: `await setDigitalPin({{${pinParam}}}, {{${valueParam}}});`,
      python: `Pin({{${pinParam}}}, Pin.OUT).value({{${valueParam}}})`,
      micropython: `Pin({{${pinParam}}}, Pin.OUT).value({{${valueParam}}})`
    };
  }

  createAnalogOutputTemplate(pinParam: string = 'pin', valueParam: string = 'value'): CodeTemplateMap {
    return {
      javascript: `await setAnalogPin({{${pinParam}}}, {{${valueParam}}});`,
      python: `PWM(Pin({{${pinParam}}})).duty({{${valueParam}}})`,
      micropython: `PWM(Pin({{${pinParam}}})).duty_u16({{${valueParam}}})`
    };
  }

  createSensorReadTemplate(pinParam: string = 'pin'): CodeTemplateMap {
    return {
      javascript: `await readSensorPin({{${pinParam}}})`,
      python: `Pin({{${pinParam}}}, Pin.IN).value()`,
      micropython: `Pin({{${pinParam}}}, Pin.IN).value()`
    };
  }

  /**
   * Get default color for category
   */
  private getDefaultColor(category: string): string {
    const colors = AppConfig.DEFAULT_THEME.colors.blocks;
    return colors[category as keyof typeof colors] || colors.hardware || '#999999';
  }

  /**
   * Validate block parameters
   */
  validateParameters(parameters: BlockParameter[]): ValidationResult {
    const errors: string[] = [];
    const paramNames = new Set<string>();

    for (const param of parameters) {
      // Check for duplicate names
      if (paramNames.has(param.name)) {
        errors.push(`Duplicate parameter name: ${param.name}`);
      }
      paramNames.add(param.name);

      // Validate parameter type
      if (!['number', 'string', 'boolean', 'dropdown', 'color'].includes(param.type)) {
        errors.push(`Invalid parameter type: ${param.type}`);
      }

      // Validate dropdown options
      if (param.type === 'dropdown' && (!param.options || param.options.length === 0)) {
        errors.push(`Dropdown parameter ${param.name} must have options`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
