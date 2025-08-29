import { BlockConfig } from '@/types/blocks';

export const neopixelBlockConfig: BlockConfig = {
  blockDefinitions: {
    neopixel_set_color: {
      type: 'neopixel_set_color',
      message0: 'Set NeoPixel pin %1 pixel %2 to color R:%3 G:%4 B:%5',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 2,
          min: 1,
          max: 50
        },
        {
          type: 'field_number',
          name: 'PIXEL',
          value: 0,
          min: 0,
          max: 144
        },
        {
          type: 'field_number',
          name: 'R',
          value: 255,
          min: 0,
          max: 255
        },
        {
          type: 'field_number',
          name: 'G',
          value: 0,
          min: 0,
          max: 255
        },
        {
          type: 'field_number',
          name: 'B',
          value: 0,
          min: 0,
          max: 255
        }
      ],
      colour: 290,
      tooltip: 'Set a specific pixel on a NeoPixel strip to a specific color',
      helpUrl: '',
      previousStatement: null,
      nextStatement: null
    },
    neopixel_clear: {
      type: 'neopixel_clear',
      message0: 'Clear all NeoPixel pixels on pin %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 2,
          min: 1,
          max: 50
        }
      ],
      colour: 290,
      tooltip: 'Turn off all pixels on a NeoPixel strip',
      helpUrl: '',
      previousStatement: null,
      nextStatement: null
    }
  },

  jsCodeGenerator: {
    neopixel_set_color: function(block: any) {
      const pin = block.getFieldValue('PIN');
      const pixel = block.getFieldValue('PIXEL');
      const r = block.getFieldValue('R');
      const g = block.getFieldValue('G');
      const b = block.getFieldValue('B');
      return `neopixel_set_color(${pin}, ${pixel}, ${r}, ${g}, ${b});\n`;
    },
    neopixel_clear: function(block: any) {
      const pin = block.getFieldValue('PIN');
      return `neopixel_clear(${pin});\n`;
    }
  },

  pyCodeGenerator: {
    neopixel_set_color: function(block: any) {
      const pin = block.getFieldValue('PIN');
      const pixel = block.getFieldValue('PIXEL');
      const r = block.getFieldValue('R');
      const g = block.getFieldValue('G');
      const b = block.getFieldValue('B');
      return `np_${pin}[${pixel}] = (${r}, ${g}, ${b})\nnp_${pin}.write()\n`;
    },
    neopixel_clear: function(block: any) {
      const pin = block.getFieldValue('PIN');
      return `np_${pin}.fill((0, 0, 0))\nnp_${pin}.write()\n`;
    }
  },

  toolBox: [
    {
      kind: 'block',
      type: 'neopixel_set_color'
    },
    {
      kind: 'block',
      type: 'neopixel_clear'
    }
  ]
};