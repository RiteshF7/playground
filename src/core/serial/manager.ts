// Web Serial API types
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  writable: WritableStream<Uint8Array> | null;
  addEventListener(type: string, listener: () => void): void;
}

interface Serial {
  requestPort(): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
}

declare global {
  interface Navigator {
    serial: Serial;
  }
}

export class SerialManager {
  private port: SerialPort | null = null;
  private writer: WritableStreamDefaultWriter<string> | null = null;
  private connected: boolean = false;
  private onDisconnectCallback?: () => void;

  public async connect(): Promise<boolean> {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API not supported');
      }

      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 115200 });

      if (!this.port.writable) {
        throw new Error('Port writable stream is not available');
      }

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(this.port.writable);
      this.writer = textEncoder.writable.getWriter();

      // Set up disconnect listener
      this.port.addEventListener('disconnect', () => {
        this.handleDisconnect();
      });

      this.connected = true;
      return true;
    } catch (error) {
      console.error('Serial connection failed:', error);
      this.connected = false;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.writer) {
      await this.writer.close();
      this.writer = null;
    }

    if (this.port) {
      await this.port.close();
      this.port = null;
    }

    this.connected = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async sendCode(code: string): Promise<boolean> {
    if (!this.connected || !this.writer) {
      throw new Error('Not connected to device');
    }

    try {
      // Convert code to MicroPython format
      const formattedCode = this.formatCodeForMicroPython(code);
      
      // Send code to device
      await this.writer.write(formattedCode);
      
      return true;
    } catch (error) {
      console.error('Failed to send code:', error);
      return false;
    }
  }

  private formatCodeForMicroPython(code: string): string {
    // Add necessary imports and setup
    const imports = `
import machine
import time
from machine import Pin, PWM
import neopixel
import servo
`;

    // Clean up the code
    const cleanCode = code
      .replace(/^import.*$/gm, '') // Remove existing imports
      .replace(/^from.*$/gm, '') // Remove existing from imports
      .trim();

    return imports + '\n\n' + cleanCode + '\n';
  }

  public async getAvailablePorts(): Promise<SerialPort[]> {
    try {
      if (!('serial' in navigator)) {
        return [];
      }
      return await navigator.serial.getPorts();
    } catch (error) {
      console.error('Failed to get available ports:', error);
      return [];
    }
  }

  public setOnDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  private handleDisconnect(): void {
    this.connected = false;
    this.port = null;
    this.writer = null;
    
    if (this.onDisconnectCallback) {
      this.onDisconnectCallback();
    }
  }

  public async sendCommand(command: string): Promise<string> {
    if (!this.connected || !this.writer) {
      throw new Error('Not connected to device');
    }

    try {
      await this.writer.write(command + '\n');
      
      // Read response (simplified - in real implementation you'd need proper response handling)
      return 'Command sent successfully';
    } catch (error) {
      console.error('Failed to send command:', error);
      throw error;
    }
  }
}