// Web Serial Communication Implementation
import {
  DeviceCommunicator,
  ConnectionResult,
  ExecutionResult,
  DeviceCommand,
  CommandResult,
  CodeLanguage,
  DeviceInfo,
  CommunicationEvent,
  EventHandler,
  HardwareSettings
} from '../../core/types';
import { ErrorUtils } from '../../core/utils';

declare global {
  interface Navigator {
    serial: any;
  }
}

export class WebSerialCommunicator implements DeviceCommunicator {
  private settings: HardwareSettings;
  private port: any | null = null;
  private reader: any | null = null;
  private writer: any | null = null;
  private isConnected: boolean = false;
  private eventHandlers: Map<CommunicationEvent, EventHandler[]> = new Map();

  constructor(settings: HardwareSettings) {
    this.settings = settings;
  }

  async connect(): Promise<ConnectionResult> {
    try {
      if (!('serial' in navigator)) {
        return {
          success: false,
          error: 'Web Serial API not supported in this browser'
        };
      }

      // Request port from user
      this.port = await navigator.serial.requestPort();

      // Open connection
      await this.port.open({
        baudRate: this.settings.baudRate || 115200
      });

      // Setup streams
      if (this.port.readable) {
        this.reader = this.port.readable.getReader();
        this.startReading();
      }

      if (this.port.writable) {
        this.writer = this.port.writable.getWriter();
      }

      this.isConnected = true;
      this.emit('connected', { success: true });

      // Get device info
      const deviceInfo = await this.getDeviceInfo();

      return {
        success: true,
        deviceInfo
      };

    } catch (error) {
      this.emit('error', error);
      return {
        success: false,
        error: ErrorUtils.formatError(error)
      };
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }

      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }

      if (this.port) {
        await this.port.close();
        this.port = null;
      }

      this.isConnected = false;
      this.emit('disconnected', {});

    } catch (error) {
      this.emit('error', error);
    }
  }

  async sendCode(code: string, language: CodeLanguage): Promise<ExecutionResult> {
    if (!this.isConnected || !this.writer) {
      return {
        success: false,
        error: 'Device not connected',
        timestamp: Date.now()
      };
    }

    try {
      const command = this.formatCodeForDevice(code, language);
      await this.writer.write(new TextEncoder().encode(command));

      return {
        success: true,
        data: { language, codeSize: code.length },
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  async sendCommand(command: DeviceCommand): Promise<CommandResult> {
    const startTime = Date.now();

    if (!this.isConnected || !this.writer) {
      return {
        commandId: command.id,
        success: false,
        error: 'Device not connected',
        executionTime: Date.now() - startTime
      };
    }

    try {
      const serialCommand = this.formatCommandForDevice(command);
      await this.writer.write(new TextEncoder().encode(serialCommand));

      return {
        commandId: command.id,
        success: true,
        data: command.parameters,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        commandId: command.id,
        success: false,
        error: ErrorUtils.formatError(error),
        executionTime: Date.now() - startTime
      };
    }
  }

  isConnected(): boolean {
    return this.isConnected;
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    // This would typically query the device for its info
    return {
      id: 'web-serial-device',
      name: 'Web Serial Device',
      type: 'microcontroller',
      version: '1.0.0',
      capabilities: ['digital_io', 'analog_io', 'serial']
    };
  }

  addEventListener(event: CommunicationEvent, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  removeEventListener(event: CommunicationEvent, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: CommunicationEvent, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  private async startReading(): Promise<void> {
    if (!this.reader) return;

    try {
      while (this.isConnected) {
        const { value, done } = await this.reader.read();

        if (done) break;

        if (value) {
          const text = new TextDecoder().decode(value);
          this.emit('data_received', { data: text });
        }
      }
    } catch (error) {
      if (this.isConnected) {
        this.emit('error', error);
      }
    }
  }

  private formatCodeForDevice(code: string, language: CodeLanguage): string {
    // Format code for the specific device protocol
    switch (language) {
      case 'python':
      case 'micropython':
        return `exec('''${code}''')\\r\\n`;
      case 'javascript':
        // Convert to appropriate format for device
        return this.convertJavaScriptToPython(code) + '\\r\\n';
      default:
        return code + '\\r\\n';
    }
  }

  private formatCommandForDevice(command: DeviceCommand): string {
    // Format command for device protocol
    const cmdObj = {
      id: command.id,
      type: command.type,
      target: command.target,
      params: command.parameters
    };
    return JSON.stringify(cmdObj) + '\\r\\n';
  }

  private convertJavaScriptToPython(jsCode: string): string {
    // Basic JavaScript to Python conversion
    // This would be much more sophisticated in a real implementation
    return jsCode
      .replace(/await delay\\((\\d+)\\)/g, 'time.sleep($1/1000)')
      .replace(/await setDigitalPin\\((\\d+),\\s*(\\d+)\\)/g, 'Pin($1, Pin.OUT).value($2)')
      .replace(/console\\.log/g, 'print');
  }
}
