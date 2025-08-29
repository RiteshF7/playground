export interface BlockDefinition {
  type: string;
  message0: string;
  args0?: any[];
  colour: number;
  tooltip?: string;
  helpUrl?: string;
  inputsInline?: boolean;
  previousStatement?: string | null;
  nextStatement?: string | null;
  output?: string;
  extensions?: string[];
}

export interface BlockConfig {
  blockDefinitions: { [key: string]: BlockDefinition };
  jsCodeGenerator: { [key: string]: (block: any, generator: any) => string };
  pyCodeGenerator: { [key: string]: (block: any, generator: any) => string };
  toolBox: any[];
}

export interface ToolboxCategory {
  kind: 'category';
  name: string;
  colour: string;
  contents: ToolboxItem[];
}

export interface ToolboxBlock {
  kind: 'block';
  type: string;
}

export type ToolboxItem = ToolboxCategory | ToolboxBlock;