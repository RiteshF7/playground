import { ledBlockConfig } from './led-blocks';
import { neopixelBlockConfig } from './neopixel-blocks';
import { servoBlockConfig } from './servo-blocks';
import { delayBlockConfig } from './delay-blocks';

export const blockConfigs = [
  ledBlockConfig,
  neopixelBlockConfig,
  servoBlockConfig,
  delayBlockConfig
];

export const forJsBlock: { [key: string]: (block: any, generator: any) => string } = Object.create(null);
export const forPyBlock: { [key: string]: (block: any, generator: any) => string } = Object.create(null);

// Combine all block generators
blockConfigs.forEach(config => {
  if (config.jsCodeGenerator) {
    Object.assign(forJsBlock, config.jsCodeGenerator);
  }
  if (config.pyCodeGenerator) {
    Object.assign(forPyBlock, config.pyCodeGenerator);
  }
});

// Generate block definitions array
export const blockDefinitionsArray: any[] = [];
blockConfigs.forEach(config => {
  if (config.blockDefinitions) {
    Object.values(config.blockDefinitions).forEach(blockDef => {
      blockDefinitionsArray.push(blockDef);
    });
  }
});