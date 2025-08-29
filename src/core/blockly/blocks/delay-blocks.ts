import { BlockConfig } from '@/types/blocks';

export const delayBlockConfig: BlockConfig = {
  blockDefinitions: {
    delay: {
      type: 'delay',
      message0: 'Wait %1 milliseconds',
      args0: [
        {
          type: 'field_number',
          name: 'TIME',
          value: 1000,
          min: 1,
          max: 10000
        }
      ],
      colour: 120,
      tooltip: 'Wait for a specified amount of time',
      helpUrl: '',
      previousStatement: null,
      nextStatement: null
    }
  },

  jsCodeGenerator: {
    delay: function(block: any) {
      const time = block.getFieldValue('TIME');
      return `await delay(${time});\n`;
    }
  },

  pyCodeGenerator: {
    delay: function(block: any) {
      const time = block.getFieldValue('TIME');
      return `time.sleep(${time / 1000})\n`;
    }
  },

  toolBox: [
    {
      kind: 'block',
      type: 'delay'
    }
  ]
};