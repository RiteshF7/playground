// LED Module Implementation
import { BaseHardwareModule } from '../base/BaseHardwareModule';
import { BlockDefinition, ExecutionResult } from '../../core/types';
import { AppConfig } from '../../core/config';

export class LedModule extends BaseHardwareModule {
  readonly id = AppConfig.HARDWARE_MODULES.LED;
  readonly name = 'LED Module';
  readonly description = 'Controls a standard LED';
  readonly version = '1.0.0';
  readonly category = 'output';

  protected initializeCapabilities(): void {
    this.addCapability({
      type: 'digital_output',
      parameters: {
        pins: [2, 13], // Common LED pins
        voltage: '3.3V/5V',
        currentLimit: '20mA'
      },
      codeTemplates: {
        javascript: 'await setLedState({{pin}}, {{state}});',
        python: 'Pin({{pin}}, Pin.OUT).value({{state}})'
      }
    });
  }

  protected createBlocks(): BlockDefinition[] {
    return [
      // Turn LED On
      this.blockBuilder.createSimpleOutputBlock(
        'led-on',
        'Turn LED On',
        'output',
        this.blockBuilder.createDigitalOutputTemplate('pin', '1')
      ),

      // Turn LED Off
      this.blockBuilder.createSimpleOutputBlock(
        'led-off',
        'Turn LED Off',
        'output',
        this.blockBuilder.createDigitalOutputTemplate('pin', '0')
      ),

      // Blink LED
      this.blockBuilder.createParameterizedBlock({
        id: 'led-blink',
        displayName: 'Blink LED',
        category: 'output',
        description: 'Blink an LED with specified timing',
        parameters: [
          this.blockBuilder.createNumberParameter('duration', 1000, 100, 10000),
          this.blockBuilder.createNumberParameter('pin', 2, 0, 50)
        ],
        codeTemplate: {
          javascript: `
            await setDigitalPin({{pin}}, 1);
            await delay({{duration}});
            await setDigitalPin({{pin}}, 0);
            await delay({{duration}});
          `,
          python: `
            Pin({{pin}}, Pin.OUT).value(1)
            time.sleep({{duration}} / 1000)
            Pin({{pin}}, Pin.OUT).value(0)
            time.sleep({{duration}} / 1000)
          `
        }
      }),

      // Set LED with Pin Selection
      this.blockBuilder.createParameterizedBlock({
        id: 'led-set-pin',
        displayName: 'Set LED',
        category: 'output',
        description: 'Control LED on specific pin',
        parameters: [
          this.blockBuilder.createDropdownParameter('pin', [
            { label: 'Pin 2', value: 2 },
            { label: 'Pin 13 (Built-in)', value: 13 },
            { label: 'Pin 4', value: 4 },
            { label: 'Pin 5', value: 5 }
          ]),
          this.blockBuilder.createDropdownParameter('state', [
            { label: 'On', value: 1 },
            { label: 'Off', value: 0 }
          ])
        ],
        codeTemplate: this.blockBuilder.createDigitalOutputTemplate()
      })
    ];
  }

  protected async handleCommand(command: string, parameters: Record<string, any>): Promise<ExecutionResult> {
    switch (command) {
      case 'turn_on':
        return this.turnOn(parameters.pin || 2);

      case 'turn_off':
        return this.turnOff(parameters.pin || 2);

      case 'blink':
        return this.blink(parameters.pin || 2, parameters.duration || 1000);

      case 'set_state':
        return this.setState(parameters.pin || 2, parameters.state || 0);

      default:
        return await super.handleCommand(command, parameters);
    }
  }

  private async turnOn(pin: number): Promise<ExecutionResult> {
    this.updateState({
      [`pin_${pin}`]: { active: true, pin }
    });

    return {
      success: true,
      data: { pin, state: 1 },
      timestamp: Date.now()
    };
  }

  private async turnOff(pin: number): Promise<ExecutionResult> {
    this.updateState({
      [`pin_${pin}`]: { active: false, pin }
    });

    return {
      success: true,
      data: { pin, state: 0 },
      timestamp: Date.now()
    };
  }

  private async blink(pin: number, duration: number): Promise<ExecutionResult> {
    // This would be handled by the code execution engine
    return {
      success: true,
      data: { pin, action: 'blink', duration },
      timestamp: Date.now()
    };
  }

  private async setState(pin: number, state: number): Promise<ExecutionResult> {
    const isActive = state === 1;

    this.updateState({
      [`pin_${pin}`]: { active: isActive, pin }
    });

    return {
      success: true,
      data: { pin, state },
      timestamp: Date.now()
    };
  }
}
