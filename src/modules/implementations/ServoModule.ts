// Servo Module Implementation
import { BaseHardwareModule } from '../base/BaseHardwareModule';
import { BlockDefinition } from '../../core/types';
import { AppConfig } from '../../core/config';

export class ServoModule extends BaseHardwareModule {
  readonly id = AppConfig.HARDWARE_MODULES.SERVO;
  readonly name = 'Servo Module';
  readonly description = 'Controls a servo motor';
  readonly version = '1.0.0';
  readonly category = 'actuator';

  protected initializeCapabilities(): void {
    this.addCapability({
      type: 'servo_control',
      parameters: {
        angleRange: [0, 180],
        precision: 1,
        speed: 'variable'
      },
      codeTemplates: {
        javascript: 'await setServoAngle({{pin}}, {{angle}});',
        python: 'servo.angle({{angle}})'
      }
    });
  }

  protected createBlocks(): BlockDefinition[] {
    return [
      this.blockBuilder.createParameterizedBlock({
        id: 'servo-set-angle',
        displayName: 'Set Servo Angle',
        category: 'actuator',
        parameters: [
          this.blockBuilder.createNumberParameter('angle', 90, 0, 180),
          this.blockBuilder.createDropdownParameter('pin', [
            { label: 'Pin 9', value: 9 },
            { label: 'Pin 10', value: 10 },
            { label: 'Pin 11', value: 11 }
          ])
        ],
        codeTemplate: {
          javascript: 'await setServoAngle({{pin}}, {{angle}});',
          python: 'Servo({{pin}}).angle({{angle}})'
        }
      })
    ];
  }
}
