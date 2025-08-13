// Hardware Module Type Definitions

export interface HardwareModule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly capabilities: ModuleCapability[];
  readonly category: HardwareCategory;
}

export interface ModuleCapability {
  type: CapabilityType;
  parameters: Record<string, any>;
  validation?: ValidationRule[];
  codeTemplates: CodeTemplateMap;
}

export type CapabilityType =
  | 'digital_output'
  | 'analog_output'
  | 'digital_input'
  | 'analog_input'
  | 'servo_control'
  | 'display_matrix'
  | 'audio_output';

export type HardwareCategory =
  | 'output'
  | 'input'
  | 'actuator'
  | 'sensor'
  | 'display'
  | 'audio'
  | 'communication';

export interface ValidationRule {
  type: 'range' | 'enum' | 'pattern' | 'custom';
  parameters: Record<string, any>;
  message: string;
}

export interface CodeTemplateMap {
  javascript: string;
  python: string;
  micropython?: string;
}

export interface BlockDefinition {
  id: string;
  category: string;
  displayName:string;
  description?: string;
  parameters: BlockParameter[];
  codeTemplate: CodeTemplateMap;
  validation?: ValidationRule[];
  color?: string;
  shape?: 'statement' | 'expression' | 'hat' | 'terminal';
}

export interface BlockParameter {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'dropdown' | 'color';
  defaultValue?: any;
  options?: Array<{label: string; value: any}>;
  validation?: ValidationRule[];
}

export interface ModuleState {
  moduleId: string;
  state: Record<string, any>;
  timestamp: number;
}

export interface HardwareConfiguration {
  modules: HardwareModuleConfig[];
  connections: ConnectionConfig[];
  globalSettings: Record<string, any>;
}

export interface HardwareModuleConfig {
  moduleId: string;
  instanceId: string;
  enabled: boolean;
  settings: Record<string, any>;
  pins?: PinConfiguration[];
}

export interface ConnectionConfig {
  from: { moduleId: string; pin: string };
  to: { moduleId: string; pin: string };
  type: 'digital' | 'analog' | 'i2c' | 'spi' | 'uart';
}

export interface PinConfiguration {
  id: string;
  type: 'digital' | 'analog' | 'pwm';
  direction: 'input' | 'output' | 'bidirectional';
  defaultValue?: number;
}
