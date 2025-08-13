// Playground Type Definitions

export interface PlaygroundConfiguration {
  id: string;
  name: string;
  description: string;
  version: string;
  editor: EditorConfiguration;
  runner: RunnerConfiguration;
  hardware: string[]; // Module IDs
  testCases?: TestCaseDefinition[];
}

export interface EditorConfiguration {
  theme: EditorTheme;
  toolbox: ToolboxConfiguration;
  workspace: WorkspaceConfiguration;
  codeGeneration: CodeGenerationConfig;
}

export interface EditorTheme {
  name: string;
  colors: {
    workspace: string;
    toolbox: string;
    blocks: Record<string, string>;
  };
  fonts: {
    family: string;
    size: number;
  };
}

export interface ToolboxConfiguration {
  type: 'flyout' | 'category' | 'simple';
  categories: ToolboxCategory[];
  customBlocks?: string[]; // Block IDs
}

export interface ToolboxCategory {
  id: string;
  name: string;
  color: string;
  blocks: string[]; // Block IDs
  custom?: boolean;
}

export interface WorkspaceConfiguration {
  grid: {
    spacing: number;
    length: number;
    color: string;
    snap: boolean;
  };
  zoom: {
    controls: boolean;
    wheel: boolean;
    startScale: number;
    maxScale: number;
    minScale: number;
  };
  trashcan: boolean;
  sounds: boolean;
  scrollbars: boolean;
}

export interface CodeGenerationConfig {
  targetLanguages: ('javascript' | 'python' | 'micropython')[];
  optimization: boolean;
  includeComments: boolean;
  formatting: {
    indentation: string;
    lineEndings: string;
  };
}

export interface RunnerConfiguration {
  executionMode: 'simulation' | 'hardware' | 'hybrid';
  simulationSettings: SimulationSettings;
  hardwareSettings: HardwareSettings;
  validation: ValidationSettings;
}

export interface SimulationSettings {
  fps: number;
  realTimeExecution: boolean;
  visualEffects: boolean;
  debugMode: boolean;
}

export interface HardwareSettings {
  connectionType: 'serial' | 'websocket' | 'bluetooth';
  baudRate?: number;
  timeout: number;
  autoConnect: boolean;
  reconnectAttempts: number;
}

export interface ValidationSettings {
  enableTestCases: boolean;
  strictMode: boolean;
  timeLimit: number;
  memoryLimit: number;
}

export interface TestCaseDefinition {
  id: string;
  name: string;
  description: string;
  inputs: TestCaseInput[];
  expectedOutputs: TestCaseOutput[];
  validation: ValidationCriteria;
}

export interface TestCaseInput {
  type: 'initial_state' | 'user_action' | 'sensor_data';
  data: any;
  timestamp?: number;
}

export interface TestCaseOutput {
  type: 'module_state' | 'code_execution' | 'user_feedback';
  expected: any;
  tolerance?: number;
}

export interface ValidationCriteria {
  type: 'exact_match' | 'pattern_match' | 'custom_validator';
  parameters?: Record<string, any>;
  customValidator?: string; // Function name
}

export interface BlockInstance {
  id: string;
  type: string;
  position: { x: number; y: number };
  parameters: Record<string, any>;
  connections: {
    previous?: string;
    next?: string;
    inputs?: Record<string, string>;
    output?: string;
  };
}

export interface WorkspaceData {
  blocks: BlockInstance[];
  variables: Variable[];
  procedures: Procedure[];
  metadata: {
    version: string;
    created: string;
    modified: string;
    author?: string;
  };
}

export interface Variable {
  id: string;
  name: string;
  type: string;
  scope: 'global' | 'local';
}

export interface Procedure {
  id: string;
  name: string;
  parameters: string[];
  returnType?: string;
}
