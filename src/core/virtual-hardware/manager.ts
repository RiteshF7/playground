import { HardwareComponent, VirtualHardwareState, ComponentState } from '@/types/hardware';
import { PlaygroundConfig } from '@/types/playground';

export class VirtualHardwareManager {
  private state: VirtualHardwareState;
  private config: PlaygroundConfig;
  private executionContext: any;
  public isSimulating: boolean = false;

  constructor(config: PlaygroundConfig) {
    this.config = config;
    this.state = {
      components: new Map(),
      isSimulating: false
    };
    
    this.initializeComponents();
  }

  private initializeComponents(): void {
    this.config.components.forEach(component => {
      const componentState: ComponentState = {
        componentId: component.id,
        state: this.getInitialState(component),
        lastUpdate: Date.now()
      };
      this.state.components.set(component.id, componentState);
    });
  }

  private getInitialState(component: HardwareComponent): any {
    switch (component.type) {
      case 'led':
        return { isOn: false, brightness: 0 };
      case 'neopixel':
        return { pixels: Array(component.properties.find(p => p.name === 'pixelCount')?.value || 1).fill({ r: 0, g: 0, b: 0 }) };
      case 'servo':
        return { angle: 0 };
      case 'buzzer':
        return { isPlaying: false, frequency: 0 };
      case 'button':
        return { isPressed: false };
      case 'sensor':
        return { value: 0 };
      default:
        return {};
    }
  }

  public async executeCode(code: string): Promise<void> {
    this.isSimulating = true;
    this.state.isSimulating = true;
    
    try {
      // Create execution context with virtual hardware functions
      this.executionContext = this.createExecutionContext();
      
      // Execute the code with virtual hardware functions
      await this.runInContext(code);
    } catch (error) {
      console.error('Code execution error:', error);
      throw error;
    } finally {
      this.isSimulating = false;
      this.state.isSimulating = false;
    }
  }

  private createExecutionContext(): any {
    const context: any = {
      // LED functions
      led_on: (pin: number) => this.setLedState(pin, true),
      led_off: (pin: number) => this.setLedState(pin, false),
      
      // NeoPixel functions
      neopixel_set_color: (pin: number, pixel: number, r: number, g: number, b: number) => 
        this.setNeoPixelColor(pin, pixel, r, g, b),
      neopixel_clear: (pin: number) => this.clearNeoPixel(pin),
      
      // Servo functions
      servo_move: (pin: number, angle: number) => this.moveServo(pin, angle),
      
      // Buzzer functions
      buzzer_beep: (pin: number, frequency: number, duration: number) => 
        this.playBuzzer(pin, frequency, duration),
      
      // Utility functions
      delay: (ms: number) => this.delay(ms),
      
      // Print function for output
      print: (message: any) => this.print(message)
    };

    return context;
  }

  private async runInContext(code: string): Promise<void> {
    // Create a function with the code and execute it in our context
    const func = new Function(...Object.keys(this.executionContext), code);
    await func(...Object.values(this.executionContext));
  }

  private setLedState(pin: number, isOn: boolean): void {
    const component = this.findComponentByPin(pin, 'led');
    if (component) {
      const state = this.state.components.get(component.id);
      if (state) {
        state.state.isOn = isOn;
        state.state.brightness = isOn ? 255 : 0;
        state.lastUpdate = Date.now();
        this.notifyComponentUpdate(component.id, state.state);
      }
    }
  }

  private setNeoPixelColor(pin: number, pixel: number, r: number, g: number, b: number): void {
    const component = this.findComponentByPin(pin, 'neopixel');
    if (component) {
      const state = this.state.components.get(component.id);
      if (state && state.state.pixels) {
        if (pixel >= 0 && pixel < state.state.pixels.length) {
          state.state.pixels[pixel] = { r, g, b };
          state.lastUpdate = Date.now();
          this.notifyComponentUpdate(component.id, state.state);
        }
      }
    }
  }

  private clearNeoPixel(pin: number): void {
    const component = this.findComponentByPin(pin, 'neopixel');
    if (component) {
      const state = this.state.components.get(component.id);
      if (state && state.state.pixels) {
        state.state.pixels.fill({ r: 0, g: 0, b: 0 });
        state.lastUpdate = Date.now();
        this.notifyComponentUpdate(component.id, state.state);
      }
    }
  }

  private moveServo(pin: number, angle: number): void {
    const component = this.findComponentByPin(pin, 'servo');
    if (component) {
      const state = this.state.components.get(component.id);
      if (state) {
        state.state.angle = Math.max(0, Math.min(180, angle));
        state.lastUpdate = Date.now();
        this.notifyComponentUpdate(component.id, state.state);
      }
    }
  }

  private playBuzzer(pin: number, frequency: number, duration: number): void {
    const component = this.findComponentByPin(pin, 'buzzer');
    if (component) {
      const state = this.state.components.get(component.id);
      if (state) {
        state.state.isPlaying = true;
        state.state.frequency = frequency;
        state.lastUpdate = Date.now();
        this.notifyComponentUpdate(component.id, state.state);
        
        // Stop playing after duration
        setTimeout(() => {
          state.state.isPlaying = false;
          state.lastUpdate = Date.now();
          this.notifyComponentUpdate(component.id, state.state);
        }, duration);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private print(message: any): void {
    console.log('Virtual Hardware Output:', message);
    // Emit event for UI to display
    window.dispatchEvent(new CustomEvent('virtual-hardware-output', { 
      detail: { message, timestamp: Date.now() } 
    }));
  }

  private findComponentByPin(pin: number, type: string): HardwareComponent | undefined {
    return this.config.components.find(component => 
      component.type === type && 
      component.pins.some((p: any) => p.number === pin)
    );
  }

  private notifyComponentUpdate(componentId: string, state: any): void {
    window.dispatchEvent(new CustomEvent('component-state-update', {
      detail: { componentId, state, timestamp: Date.now() }
    }));
  }

  public updateFromWorkspace(_workspace: any): void {
    // Update virtual hardware based on workspace changes
    // This can be used for real-time preview
  }

  public getComponentState(componentId: string): ComponentState | undefined {
    return this.state.components.get(componentId);
  }

  public getAllComponentStates(): Map<string, ComponentState> {
    return this.state.components;
  }

  public reset(): void {
    this.initializeComponents();
  }
}