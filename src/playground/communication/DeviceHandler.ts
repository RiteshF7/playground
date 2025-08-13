// Device Communication Handler
import {
  DeviceCommunicator,
  ConnectionResult,
  ExecutionResult,
  DeviceCommand,
  CommandResult,
  CodeLanguage,
  HardwareSettings
} from '../../core/types';
import { WebSerialCommunicator } from './WebSerialCommunicator';
import { ErrorUtils } from '../../core/utils';

export class DeviceHandler {
  private communicator: DeviceCommunicator | null = null;
  private isInitialized: boolean = false;

  async initialize(settings: HardwareSettings): Promise<void> {
    try {
      // Create appropriate communicator based on settings
      switch (settings.connectionType) {
        case 'serial':
          this.communicator = new WebSerialCommunicator(settings);
          break;
        default:
          throw ErrorUtils.createError(
            `Unsupported connection type: ${settings.connectionType}`,
            'UNSUPPORTED_CONNECTION_TYPE'
          );
      }

      this.isInitialized = true;
    } catch (error) {
      throw ErrorUtils.handleError(error);
    }
  }

  async connect(): Promise<ConnectionResult> {
    if (!this.communicator) {
      return {
        success: false,
        error: 'Device handler not initialized'
      };
    }

    return await this.communicator.connect();
  }

  async disconnect(): Promise<void> {
    if (this.communicator) {
      await this.communicator.disconnect();
    }
  }

  async sendCode(code: string, language: CodeLanguage): Promise<ExecutionResult> {
    if (!this.communicator) {
      return {
        success: false,
        error: 'Device handler not initialized',
        timestamp: Date.now()
      };
    }

    return await this.communicator.sendCode(code, language);
  }

  async sendCommand(command: DeviceCommand): Promise<CommandResult> {
    if (!this.communicator) {
      return {
        commandId: command.id,
        success: false,
        error: 'Device handler not initialized',
        executionTime: 0
      };
    }

    return await this.communicator.sendCommand(command);
  }

  isConnected(): boolean {
    return this.communicator?.isConnected() || false;
  }

  async getDeviceInfo() {
    if (!this.communicator) {
      throw ErrorUtils.createError('Device handler not initialized', 'NOT_INITIALIZED');
    }

    return await this.communicator.getDeviceInfo();
  }
}
