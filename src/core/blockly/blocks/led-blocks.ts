import { BlockConfig } from '@/types/blocks';

export const ledBlockConfig: BlockConfig = {
  blockDefinitions: {
    led_on: {
      type: 'led_on',
      message0: 'Turn LED on pin %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 13,
          min: 1,
          max: 50
        }
      ],
      colour: 160,
      tooltip: 'Turn on an LED connected to the specified pin',
      helpUrl: '',
      previousStatement: null,
      nextStatement: null
    },
    led_off: {
      type: 'led_off',
      message0: 'Turn LED off pin %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 13,
          min: 1,
          max: 50
        }
      ],
      colour: 160,
      tooltip: 'Turn off an LED connected to the specified pin',
      helpUrl: '',
      previousStatement: null,
      nextStatement: null
    }
  },

  jsCodeGenerator: {
    led_on: function(block: any) {
      const pin = block.getFieldValue('PIN');
      return `led_on(${pin});\n`;
    },
    led_off: function(block: any) {
      const pin = block.getFieldValue('PIN');
      return `led_off(${pin});\n`;
    }
  },

  pyCodeGenerator: {
    led_on: function(block: any) {
      const pin = block.getFieldValue('PIN');
      return `led_pin_${pin} = Pin(${pin}, Pin.OUT)\nled_pin_${pin}.value(1)\n`;
    },
    led_off: function(block: any) {
      const pin = block.getFieldValue('PIN');
      return `led_pin_${pin} = Pin(${pin}, Pin.OUT)\nled_pin_${pin}.value(0)\n`;
    }
  },

  toolBox: [
    {
      kind: 'block',
      type: 'led_on'
    },
    {
      kind: 'block',
      type: 'led_off'
    }
  ]
};