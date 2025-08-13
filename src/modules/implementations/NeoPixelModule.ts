// NeoPixel Module Implementation
import { BaseHardwareModule } from '../base/BaseHardwareModule';
import { BlockDefinition } from '../../core/types';
import { AppConfig } from '../../core/config';

export class NeoPixelModule extends BaseHardwareModule {
  readonly id = AppConfig.HARDWARE_MODULES.NEOPIXEL;
  readonly name = 'NeoPixel Module';
  readonly description = 'Controls a strip of NeoPixel LEDs';
  readonly version = '1.0.0';
  readonly category = 'display';

  protected initializeCapabilities(): void {
    this.addCapability({
      type: 'display_matrix',
      parameters: {
        maxSize: 32,
        colorDepth: 24,
        refreshRate: 60
      },
      codeTemplates: {
        javascript: 'await setPixel({{x}}, {{y}}, {{color}});',
        python: 'matrix.set_pixel({{x}}, {{y}}, {{color}})'
      }
    });
  }

  protected createBlocks(): BlockDefinition[] {
    return [
      this.blockBuilder.createParameterizedBlock({
        id: 'neopixel-set-pixel',
        displayName: 'Set Pixel',
        category: 'display',
        description: 'Set a single pixel color',
        parameters: [
          this.blockBuilder.createNumberParameter('x', 0, 0, 31),
          this.blockBuilder.createNumberParameter('y', 0, 0, 31),
          this.blockBuilder.createColorParameter('color', '#FF0000')
        ],
        codeTemplate: {
          javascript: 'await setPixel({{x}}, {{y}}, "{{color}}");',
          python: 'matrix.set_pixel({{x}}, {{y}}, "{{color}}")'
        }
      }),

      this.blockBuilder.createSimpleOutputBlock(
        'neopixel-clear',
        'Clear Display',
        'display',
        {
          javascript: 'await clearDisplay();',
          python: 'matrix.clear()'
        }
      )
    ];
  }
}
