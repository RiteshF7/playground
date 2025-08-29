export interface HardwareComponent {
  id: string;
  type: ComponentType;
  name: string;
  pins: Pin[];
  properties: ComponentProperty[];
  simulation?: SimulationConfig;
}

export type ComponentType = 
  | 'led' 
  | 'neopixel' 
  | 'servo' 
  | 'buzzer' 
  | 'button' 
  | 'sensor' 
  | 'lcd' 
  | 'motor';

export interface Pin {
  id: string;
  type: 'digital' | 'analog' | 'power' | 'ground';
  number: number;
  mode?: 'input' | 'output';
}

export interface ComponentProperty {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'color';
  value: any;
  min?: number;
  max?: number;
  options?: string[];
}

export interface SimulationConfig {
  visualRepresentation: {
    type: 'svg' | 'canvas' | 'html';
    data: any;
  };
  behavior: {
    type: 'led' | 'servo' | 'buzzer' | 'sensor';
    parameters: any;
  };
}

export interface VirtualHardwareState {
  components: Map<string, ComponentState>;
  isSimulating: boolean;
}

export interface ComponentState {
  componentId: string;
  state: any;
  lastUpdate: number;
}