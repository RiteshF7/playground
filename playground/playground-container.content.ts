'use client'
import BlockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import blockKeys from "@/utils/playground/workspace/blocks/blockKeys";
import {
    ControllerType,
    MatrixType
} from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/types";
import {Modules} from "@/features/playground/components/simulated-hardwares/utils/modulesMap";
import NeopixelBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/neopixel-display/neopixelBlockConfig";
import LedModuleBlockConfig from "@/features/playground/components/simulated-hardwares/modules/led/ledModuleBlockConfig";
import BuzzerModuleBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/buzzer/buzzerModuleBlockConfig";
import ServoModuleBlockConfig
    from "@/features/playground/components/simulated-hardwares/modules/servo-motor/servoModuleBlockConfig";
import ModuleConfigConstants
    from "@/features/playground/components/simulated-hardwares/modules/common/moduleConfigConstants";

export const PlaygroundContainerContent = [

    // Introduction to Pixel Movement
    {
        chapterId: 1,
        type: 'content',
        content: {
            contentId: 0,
            title: "Your First Pixel Move",
            description: "Welcome to the playground! Let's start by moving a pixel one step to the left. This simple movement is your first step into the world of programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [BlockKeys.moveLeft],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[5, 4]],
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 2,
        type: 'content',
        content: {
            contentId: 0,
            title: "Pixels in Motion: Up and Down",
            description: "Let's explore more directions! Move your pixel one step up and see how coordinates change on the display. Understanding directional movement is a fundamental programming skill.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveUp],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[4, 5]],
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 3,
        type: 'content',
        content: {
            contentId: 0,
            title: "Downward Bound",
            description: "Now let's move in the opposite direction. Send your pixel one step down and observe how the position changes. Notice how we're using coordinates to track position!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveDown],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[6, 5]],
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 4,
        type: 'content',
        content: {
            contentId: 0,
            title: "Triple Jump Right",
            description: "Let's stretch our abilities! Move your pixel three steps to the right in one go. This challenge introduces the concept of moving multiple units at once.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveRight],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[5, 6], [5, 7], [5, 8]]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    // Loops and Patterns
    {
        chapterId: 5,
        type: 'content',
        content: {
            contentId: 0,
            title: "Blink Repeat",
            description: "Let's make an LED blink exactly twice! This introduces you to the power of repetition in programming - doing the same action multiple times without writing duplicate code.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.blinkLed],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}}, {
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}},]
                    },
                ]
            }
        }
    },

    {
        chapterId: 6,
        type: 'content',
        content: {
            contentId: 0,
            title: "The L-Shape Challenge",
            description: "Create an L-shape pattern by moving 5 steps down and then 5 steps right from your starting position. This pattern introduces sequential commands to create specific shapes.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveRight, blockKeys.moveDown],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10],]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 7,
        type: 'content',
        content: {
            contentId: 0,
            title: "L-Shape with Loops",
            description: "Now recreate the same L-shape pattern, but this time using loops to make your code more efficient. See how loops can simplify repetitive tasks!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.moveRight, blockKeys.moveDown, blockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5]],
                    expectedOutput: [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10],]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    // Multiple Pixels and Complex Patterns
    {
        chapterId: 8,
        type: 'content',
        content: {
            contentId: 0,
            title: "Join the Dots",
            description: "Connect two pixels with a continuous line. This introduces you to thinking about the path between two points - a fundamental concept in graphics programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5], [10, 10]],
                    expectedOutput: [
                        [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10]],
                        [[5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10]]
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 9,
        type: 'content',
        content: {
            contentId: 0,
            title: "Perfect Square",
            description: "Create a square by connecting two diagonal pixels. This challenge teaches you to think about closed shapes and how to track your position as you create a pattern.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5], [10, 10]],
                    expectedOutput: [
                        [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [9, 10], [8, 10], [7, 10], [6, 10], [5, 10], [5, 9], [5, 8], [5, 7], [5, 6], [5, 5]],
                        [[5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10], [10, 9], [10, 8], [10, 7], [10, 6], [10, 5], [9, 5], [8, 5], [7, 5], [6, 5], [5, 5]]
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 10,
        type: 'content',
        content: {
            contentId: 0,
            title: "Connect the Squares",
            description: "Join two adjacent squares by connecting their vertices. This advanced pattern challenges you to think about complex pathways and efficient movement strategies.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[5, 5], [10, 10], [0, 0]],
                    expectedOutput: [
                        [[6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [9, 10], [8, 10], [7, 10], [6, 10], [5, 10], [5, 9], [5, 8], [5, 7], [5, 6], [5, 5], [5, 4], [5, 3], [5, 2], [5, 1], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]],
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    // Hardware Control Basics
    {
        chapterId: 11,
        type: 'content',
        content: {
            contentId: 0,
            title: "Light It Up!",
            description: "Turn on an LED with a single command. This introduces you to controlling physical components - the foundation of electronics programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.turnOnLed],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{[Modules.LedModule]: {active: true, color: 'red'}}]
                    },
                ]
            }
        }
    },

    {
        chapterId: 12,
        type: 'content',
        content: {
            contentId: 0,
            title: "Precise Motion Control",
            description: "Rotate a servo motor right twice by 45 degrees each time. Learn how to control precise movements - essential for robotics and mechanical projects.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...ServoModuleBlockConfig.toolBox],
        },
        runnerConfig: {
            moduleNames: [Modules.ServoModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {degree: 0},
                        initialState: {[Modules.ServoModule]: {angle: 0}},
                        expectedOutput: [{[Modules.ServoModule]: {angle: 45}}, {[Modules.ServoModule]: {angle: 90}}]
                    },
                ]
            }
        }
    },

    {
        chapterId: 13,
        type: 'content',
        content: {
            contentId: 0,
            title: "Light and Motion",
            description: "Turn on an LED and then rotate a servo motor. This challenge teaches you to control multiple hardware components in sequence - a key skill for creating interactive projects.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...LedModuleBlockConfig.toolBox, ...ServoModuleBlockConfig.toolBox],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule, Modules.ServoModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {degree: 0},
                        initialState: {
                            [Modules.LedModule]: {active: false, color: 'red'},
                            [Modules.ServoModule]: {angle: 0}
                        },
                        expectedOutput: [{
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.ServoModule]: {angle: 45}}]
                    },
                ]
            }
        }
    },

    // Conditional Logic
    {
        chapterId: 14,
        type: 'content',
        content: {
            contentId: 0,
            title: "Smart Lighting",
            description: "Turn on an LED only when the light sensor reads above 60. This introduces conditional logic - making decisions based on sensor input, which is fundamental to responsive programming.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.controlsIf, blockKeys.turnOffLed, blockKeys.turnOnLed, blockKeys.lightValue, blockKeys.mathNumber, blockKeys.logicCompare],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {lightValue: 40},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{[Modules.LedModule]: {active: false, color: 'red'}}]
                    },
                    {
                        inputs: {lightValue: 80},
                        initialState: {[Modules.LedModule]: {active: false, color: 'red'}},
                        expectedOutput: [{[Modules.LedModule]: {active: true, color: 'red'}}]
                    },
                ]
            }
        }
    },

    {
        chapterId: 15,
        type: 'content',
        content: {
            contentId: 0,
            title: "Responsive Blinking",
            description: "Make an LED blink twice when light level falls below 10, and turn it off when light level is above 10. This challenge combines conditions with actions to create responsive behavior.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [blockKeys.controlsIf, blockKeys.turnOffLed, blockKeys.turnOnLed, blockKeys.blinkLed, blockKeys.lightValue, blockKeys.mathNumber, blockKeys.logicCompare],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule, Modules.LCDModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {lightValue: 20},
                        initialState: {
                            [Modules.LedModule]: {active: true, color: 'red'},
                            [Modules.LCDModule]: {text: '20'}
                        },
                        expectedOutput: [{[Modules.LedModule]: {active: false, color: 'red'}}]
                    },
                    {
                        inputs: {lightValue: 9},
                        initialState: {
                            [Modules.LedModule]: {active: true, color: 'red'},
                            [Modules.LCDModule]: {text: '9'}
                        },
                        expectedOutput: [{
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}}, {
                            [Modules.LedModule]: {
                                active: true,
                                color: 'red'
                            }
                        }, {[Modules.LedModule]: {active: false, color: 'red'}}]
                    },
                ]
            }
        }
    },

    // Creative Challenges (New)
    {
        chapterId: 16,
        type: 'content',
        content: {
            contentId: 0,
            title: "Create Your Light Show",
            description: "Design a sequence where the LED blinks in a pattern based on rotating the servo to different positions. This open-ended challenge lets you combine everything you've learned so far!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...LedModuleBlockConfig.toolBox, ...ServoModuleBlockConfig.toolBox, blockKeys.controlsRepeat, blockKeys.delay],
        },
        runnerConfig: {
            moduleNames: [Modules.LedModule, Modules.ServoModule],
            moduleConfig: {
                testCases: [
                    {
                        inputs: {degree: 0},
                        initialState: {
                            [Modules.LedModule]: {active: false, color: 'red'},
                            [Modules.ServoModule]: {angle: 0}
                        },
                        expectedOutput: [
                            {[Modules.ServoModule]: {angle: 45}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}},
                            {[Modules.ServoModule]: {angle: 90}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}},
                            {[Modules.ServoModule]: {angle: 135}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}}
                        ]
                    },
                ]
            }
        }
    },

    {
        chapterId: 17,
        type: 'content',
        content: {
            contentId: 0,
            title: "Pixel Race Challenge",
            description: "Move two pixels from opposite corners of the display and have them meet in the middle, then create a square expanding outward. This tests your ability to coordinate multiple moving elements.",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, BlockKeys.controlsRepeat],
        },
        runnerConfig: {
            moduleName: Modules.NeoPixelModule,
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.BI_DIRECTIONAL,
                testCase: {
                    initialState: [[0, 0], [10, 10]],
                    expectedOutput: [
                        // Path from [0,0] to [5,5]
                        [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
                        // Path from [10,10] to [5,5]
                        [[9, 9], [8, 8], [7, 7], [6, 6], [5, 5]],
                        // Square expanding from center
                        [[4, 4], [4, 5], [4, 6], [5, 6], [6, 6], [6, 5], [6, 4], [5, 4], [4, 4]]
                    ]
                },
                controllerType: ControllerType.blocks
            }
        }
    },

    {
        chapterId: 18,
        type: 'content',
        content: {
            contentId: 0,
            title: "Smart Environment Monitor",
            description: "Create a system that displays different patterns on the NeoPixel display based on light sensor readings. Use the LED as an alert for extreme readings. This challenge brings together sensors, displays, and conditional logic!",
            media: [
                {
                    type: "video",
                    url: "",
                    caption: ""
                }
            ]
        },
        editorConfig: {
            toolboxType: 'flyoutToolbox',
            toolboxContent: [...NeopixelBlockConfig.toolBox, ...LedModuleBlockConfig.toolBox, blockKeys.controlsIf, blockKeys.lightValue, blockKeys.mathNumber, blockKeys.logicCompare],
        },
        runnerConfig: {
            moduleNames: [Modules.NeoPixelModule, Modules.LedModule],
            moduleConfig: {
                matrixSize: 11,
                matrixType: MatrixType.UNI_DIRECTIONAL,
                testCases: [
                    // Low light scenario
                    {
                        inputs: {lightValue: 5},
                        initialState: {
                            [Modules.NeoPixelModule]: {pixels: []},
                            [Modules.LedModule]: {active: false, color: 'red'}
                        },
                        expectedOutput: [
                            // Display "L" on NeoPixel
                            {[Modules.NeoPixelModule]: {pixels: [[2, 2], [3, 2], [4, 2], [5, 2], [5, 3], [5, 4]]}},
                            // Blink LED for warning
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}},
                            {[Modules.LedModule]: {active: true, color: 'red'}},
                            {[Modules.LedModule]: {active: false, color: 'red'}}
                        ]
                    },
                    // Medium light scenario
                    {
                        inputs: {lightValue: 50},
                        initialState: {
                            [Modules.NeoPixelModule]: {pixels: []},
                            [Modules.LedModule]: {active: false, color: 'red'}
                        },
                        expectedOutput: [
                            // Display "M" on NeoPixel
                            {[Modules.NeoPixelModule]: {pixels: [[2, 2], [2, 3], [2, 4], [3, 3], [4, 2], [4, 3], [4, 4]]}},
                            // LED stays off
                            {[Modules.LedModule]: {active: false, color: 'red'}}
                        ]
                    },
                    // High light scenario
                    {
                        inputs: {lightValue: 90},
                        initialState: {
                            [Modules.NeoPixelModule]: {pixels: []},
                            [Modules.LedModule]: {active: false, color: 'red'}
                        },
                        expectedOutput: [
                            // Display "H" on NeoPixel
                            {[Modules.NeoPixelModule]: {pixels: [[2, 2], [2, 3], [2, 4], [3, 3], [4, 2], [4, 3], [4, 4]]}},
                            // Turn on LED for warning
                            {[Modules.LedModule]: {active: true, color: 'red'}}
                        ]
                    }
                ]
            }
        }
    }
];