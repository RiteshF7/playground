// Communication Type Definitions

export interface DeviceCommunicator {
  connect(): Promise<ConnectionResult>;
  disconnect(): Promise<void>;
  sendCode(code: string, language: CodeLanguage): Promise<ExecutionResult>;
  sendCommand(command: DeviceCommand): Promise<CommandResult>;
  isConnected(): boolean;
  getDeviceInfo(): Promise<DeviceInfo>;
  addEventListener(event: CommunicationEvent, handler: EventHandler): void;
  removeEventListener(event: CommunicationEvent, handler: EventHandler): void;
}

export interface ConnectionResult {
  success: boolean;
  deviceInfo?: DeviceInfo;
  error?: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  version: string;
  capabilities: string[];
  serialNumber?: string;
  manufacturer?: string;
}

export type DeviceType = 'microcontroller' | 'sensor_board' | 'robot' | 'simulator';

export type CodeLanguage = 'javascript' | 'python' | 'micropython' | 'c++';

export interface DeviceCommand {
  id: string;
  type: CommandType;
  target: string; // Module ID or pin
  parameters: Record<string, any>;
  timeout?: number;
}

export type CommandType =
  | 'set_pin_value'
  | 'get_pin_value'
  | 'reset_device'
  | 'get_status'
  | 'calibrate'
  | 'custom';

export interface CommandResult {
  commandId: string;
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

export type CommunicationEvent =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'data_received'
  | 'command_complete';

export type EventHandler = (data: any) => void;

export interface CommunicationChannel {
  name: string;
  type: ChannelType;
  config: ChannelConfig;
  isActive: boolean;
}

export type ChannelType = 'serial' | 'websocket' | 'bluetooth' | 'usb' | 'wifi';

export interface ChannelConfig {
  baudRate?: number;
  timeout: number;
  retryAttempts: number;
  bufferSize?: number;
  encoding?: string;
  [key: string]: any;
}

export interface MessageQueue {
  enqueue(message: QueuedMessage): void;
  dequeue(): QueuedMessage | null;
  clear(): void;
  size(): number;
  isPaused(): boolean;
  pause(): void;
  resume(): void;
}

export interface QueuedMessage {
  id: string;
  type: MessageType;
  payload: any;
  priority: number;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export type MessageType = 'command' | 'code' | 'data' | 'control' | 'heartbeat';

export interface CommunicationProtocol {
  name: string;
  version: string;
  frameMessage(data: any): Buffer | string;
  parseMessage(raw: Buffer | string): ParsedMessage;
  validateMessage(message: ParsedMessage): boolean;
}

export interface ParsedMessage {
  header: MessageHeader;
  payload: any;
  checksum?: string;
  timestamp: number;
}

export interface MessageHeader {
  type: MessageType;
  id: string;
  length: number;
  sequence?: number;
  flags?: number;
}
