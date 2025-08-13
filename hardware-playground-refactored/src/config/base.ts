// Base Configuration
import { AppConfig } from '../core/config';
import {
  PlaygroundConfiguration,
  Curriculum,
  HardwareConfiguration
} from '../core/types';

// Default Playground Configuration
export const defaultPlaygroundConfig: PlaygroundConfiguration = {
  id: 'default-playground',
  name: 'Default Hardware Playground',
  description: 'Basic playground configuration for getting started',
  version: '1.0.0',

  editor: {
    theme: AppConfig.DEFAULT_THEME,

    toolbox: {
      type: 'flyout',
      categories: [
        {
          id: 'output',
          name: 'Output',
          color: '#FF9999',
          blocks: ['led-on', 'led-off', 'led-blink'],
          custom: false
        },
        {
          id: 'control',
          name: 'Control',
          color: '#FFCC99',
          blocks: ['delay', 'controls_repeat'],
          custom: false
        }
      ],
      customBlocks: []
    },

    workspace: AppConfig.DEFAULT_WORKSPACE,

    codeGeneration: {
      targetLanguages: ['javascript', 'python'],
      optimization: false,
      includeComments: true,
      formatting: {
        indentation: '  ',
        lineEndings: '\\n'
      }
    }
  },

  runner: {
    executionMode: 'simulation',

    simulationSettings: {
      fps: 30,
      realTimeExecution: true,
      visualEffects: true,
      debugMode: false
    },

    hardwareSettings: {
      connectionType: 'serial',
      baudRate: 115200,
      timeout: 5000,
      autoConnect: false,
      reconnectAttempts: 3
    },

    validation: {
      enableTestCases: true,
      strictMode: false,
      timeLimit: 30000,
      memoryLimit: 1024 * 1024 // 1MB
    }
  },

  hardware: [
    AppConfig.HARDWARE_MODULES.LED,
    AppConfig.HARDWARE_MODULES.BUZZER
  ],

  testCases: [
    {
      id: 'basic-led-test',
      name: 'Basic LED Control',
      description: 'Test basic LED on/off functionality',
      inputs: [
        {
          type: 'initial_state',
          data: { led: { active: false, pin: 2 } }
        }
      ],
      expectedOutputs: [
        {
          type: 'module_state',
          expected: { led: { active: true, pin: 2 } }
        }
      ],
      validation: {
        type: 'exact_match',
        parameters: {}
      }
    }
  ]
};

// Sample Curriculum Configuration
export const sampleCurriculum: Curriculum = {
  id: 'beginner-electronics',
  name: 'Beginner Electronics with Visual Programming',
  description: 'Learn electronics fundamentals through visual programming',
  version: '1.0.0',
  targetAge: { min: 8, max: 16 },
  difficulty: 'beginner',
  prerequisites: [],
  learningObjectives: [
    'Understand basic electronics concepts',
    'Control LEDs with programming',
    'Create simple automation sequences',
    'Debug basic hardware issues'
  ],
  estimatedDuration: 180, // 3 hours

  lessons: [
    {
      id: 'lesson-1-led-basics',
      title: 'Your First LED',
      description: 'Learn to control an LED light',
      order: 1,
      type: 'tutorial',

      content: {
        introduction: [
          {
            id: 'intro-1',
            type: 'text',
            title: 'Welcome to Electronics!',
            content: 'In this lesson, you will learn how to control an LED (Light Emitting Diode) using visual programming blocks.'
          }
        ],
        explanation: [
          {
            id: 'explain-1',
            type: 'text',
            title: 'What is an LED?',
            content: 'An LED is a small electronic component that produces light when electricity flows through it.'
          }
        ],
        examples: [
          {
            id: 'example-1',
            type: 'interactive',
            title: 'Try It Yourself',
            content: 'Use the playground below to turn an LED on and off',
            interactive: {
              type: 'playground',
              configuration: {
                playgroundConfigId: 'led-basic-control'
              }
            }
          }
        ],
        summary: [
          {
            id: 'summary-1',
            type: 'text',
            title: 'What You Learned',
            content: 'You learned how to control an LED using programming blocks and understand the basics of digital output.'
          }
        ]
      },

      activities: [
        {
          id: 'activity-1',
          name: 'Turn on the LED',
          description: 'Use blocks to turn on the LED',
          type: 'guided_practice',
          instructions: [
            'Drag the "Turn LED On" block to the workspace',
            'Click the Run button to execute your program',
            'Observe the LED turning on in the simulation'
          ],
          playgroundConfig: 'led-basic-control',
          expectedOutcome: 'LED should turn on and stay on',
          hints: [
            {
              id: 'hint-1',
              trigger: { type: 'attempt_based', parameters: { attempts: 2 } },
              content: 'Make sure you have the "Turn LED On" block in your workspace',
              priority: 1
            }
          ],
          timeLimit: 300
        }
      ],

      assessments: [
        {
          id: 'quiz-1',
          name: 'LED Knowledge Check',
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              type: 'multiple_choice',
              question: 'What does LED stand for?',
              options: [
                { id: 'a', text: 'Light Emitting Diode', correct: true },
                { id: 'b', text: 'Low Energy Device', correct: false },
                { id: 'c', text: 'Logical Electronic Display', correct: false }
              ],
              correctAnswer: 'a',
              explanation: 'LED stands for Light Emitting Diode',
              points: 10
            }
          ],
          passingScore: 80,
          timeLimit: 300,
          attempts: 3
        }
      ],

      resources: [
        {
          id: 'resource-1',
          name: 'LED Basics Guide',
          type: 'reference',
          content: 'Comprehensive guide to LED basics and safety',
          downloadable: false,
          category: 'reference'
        }
      ],

      metadata: {
        author: 'Hardware Playground Team',
        created: '2024-01-01',
        modified: '2024-01-01',
        version: '1.0.0',
        tags: ['led', 'basic', 'output', 'digital'],
        difficulty: 'beginner',
        estimatedDuration: 30,
        prerequisites: [],
        learningObjectives: [
          'Control an LED using programming blocks',
          'Understand digital output concepts'
        ]
      }
    }
  ]
};

// Hardware Configuration
export const defaultHardwareConfig: HardwareConfiguration = {
  modules: [
    {
      moduleId: AppConfig.HARDWARE_MODULES.LED,
      instanceId: 'led-1',
      enabled: true,
      settings: {
        defaultPin: 2,
        voltage: '3.3V'
      },
      pins: [
        {
          id: 'pin-2',
          type: 'digital',
          direction: 'output',
          defaultValue: 0
        }
      ]
    },
    {
      moduleId: AppConfig.HARDWARE_MODULES.BUZZER,
      instanceId: 'buzzer-1',
      enabled: true,
      settings: {
        defaultPin: 8,
        frequency: 1000
      },
      pins: [
        {
          id: 'pin-8',
          type: 'digital',
          direction: 'output',
          defaultValue: 0
        }
      ]
    }
  ],
  connections: [],
  globalSettings: {
    debugMode: false,
    safetyChecks: true,
    maxExecutionTime: 30000
  }
};
