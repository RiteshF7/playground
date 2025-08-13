// Buzzer Module Implementation
import { BaseHardwareModule } from '../base/BaseHardwareModule';
import { BlockDefinition } from '../../core/types';
import { AppConfig } from '../../core/config';

export class BuzzerModule extends BaseHardwareModule {
  readonly id = AppConfig.HARDWARE_MODULES.BUZZER;
  readonly name = 'Buzzer Module';
  readonly description = 'Controls a piezo buzzer';
  readonly version = '1.0.0';
  readonly category = 'audio';

  protected initializeCapabilities(): void {
    this.addCapability({
      type: 'audio_output',
      parameters: {
        frequencyRange: [100, 4000],
        volume: 'fixed',
        duration: 'variable'
      },
      codeTemplates: {
        javascript: 'await playTone({{frequency}}, {{duration}});',
        python: 'buzzer.play_tone({{frequency}}, {{duration}})'
      }
    });
  }

  protected createBlocks(): BlockDefinition[] {
    return [
      this.blockBuilder.createSimpleOutputBlock(
        'buzzer-beep',
        'Buzzer Beep',
        'audio',
        {
          javascript: 'await playTone(1000, 200);',
          python: 'buzzer.beep()'
        }
      ),

      this.blockBuilder.createParameterizedBlock({
        id: 'buzzer-tone',
        displayName: 'Play Tone',
        category: 'audio',
        parameters: [
          this.blockBuilder.createNumberParameter('frequency', 1000, 100, 4000),
          this.blockBuilder.createNumberParameter('duration', 500, 50, 5000)
        ],
        codeTemplate: {
          javascript: 'await playTone({{frequency}}, {{duration}});',
          python: 'buzzer.play_tone({{frequency}}, {{duration}})'
        }
      })
    ];
  }
}
