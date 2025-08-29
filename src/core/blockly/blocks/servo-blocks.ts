import { BlockConfig } from '@/types/blocks';

export const servoBlockConfig: BlockConfig = {
  blockDefinitions: {
    servo_move: {
      type: 'servo_move',
      message0: 'Move servo on pin %1 to angle %2 degrees',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 9,
          min: 1,
          max: 50
        },
        {
          type: 'field_number',
          name: 'ANGLE',
          value: 90,
          min: 0,
          max: 180
        }
      ],
      colour: 290,
      tooltip: 'Move a servo motor to a specific angle',
      helpUrl: '',
      previousStatement: null,
      nextStatement: null
    }
  },

  jsCodeGenerator: {
    servo_move: function(block: any) {
      const pin = block.getFieldValue('PIN');
      const angle = block.getFieldValue('ANGLE');
      return `servo_move(${pin}, ${angle});\n`;
    }
  },

  pyCodeGenerator: {
    servo_move: function(block: any) {
      const pin = block.getFieldValue('PIN');
      const angle = block.getFieldValue('ANGLE');
      return `servo_${pin}.angle(${angle})\n`;
    }
  },

  toolBox: [
    {
      kind: 'block',
      type: 'servo_move'
    }
  ]
};