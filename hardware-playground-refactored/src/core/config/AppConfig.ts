// Application Configuration
import { EditorTheme, WorkspaceConfiguration, HardwareCategory } from '../types';

export class AppConfig {
  // Hardware Module IDs
  static readonly HARDWARE_MODULES = {
    LED: 'led-module',
    NEOPIXEL: 'neopixel-module',
    SERVO: 'servo-module',
    BUZZER: 'buzzer-module'
  } as const;

  // Playground Constants
  static readonly PLAYGROUND = {
    DEFAULT_MATRIX_SIZE: 11,
    DEFAULT_DELAY: 200,
    MAX_EXECUTION_TIME: 30000,
    DEFAULT_FPS: 60,
    MAX_BLOCKS_PER_PROGRAM: 100
  } as const;

  // Communication Constants
  static readonly COMMUNICATION = {
    DEFAULT_BAUD_RATE: 115200,
    CONNECTION_TIMEOUT: 5000,
    COMMAND_TIMEOUT: 1000,
    MAX_RETRY_ATTEMPTS: 3,
    HEARTBEAT_INTERVAL: 1000
  } as const;

  // UI Constants
  static readonly UI = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 250,
    TOOLTIP_DELAY: 500
  } as const;

  // Default Editor Theme
  static readonly DEFAULT_THEME: EditorTheme = {
    name: 'default',
    colors: {
      workspace: '#f5f5f5',
      toolbox: '#ffffff',
      blocks: {
        logic: '#a2bdf2',
        loops: '#b6ddb1',
        math: '#93ccea',
        text: '#f9dd87',
        lists: '#aecbbd',
        variables: '#eaa8a8',
        functions: '#d3c2b8',
        hardware: '#ff9999'
      }
    },
    fonts: {
      family: 'Arial, sans-serif',
      size: 12
    }
  };

  // Default Workspace Configuration
  static readonly DEFAULT_WORKSPACE: WorkspaceConfiguration = {
    grid: {
      spacing: 20,
      length: 3,
      color: '#ccc',
      snap: true
    },
    zoom: {
      controls: true,
      wheel: false,
      startScale: 0.8,
      maxScale: 2,
      minScale: 0.5
    },
    trashcan: true,
    sounds: false,
    scrollbars: true
  };

  // Hardware Categories
  static readonly HARDWARE_CATEGORIES: Record<HardwareCategory, string> = {
    output: 'Output Devices',
    input: 'Input Devices',
    actuator: 'Actuators',
    sensor: 'Sensors',
    display: 'Displays',
    audio: 'Audio Devices',
    communication: 'Communication'
  };

  // Validation Rules
  static readonly VALIDATION = {
    MIN_MODULE_NAME_LENGTH: 3,
    MAX_MODULE_NAME_LENGTH: 50,
    MIN_LESSON_DURATION: 5,
    MAX_LESSON_DURATION: 180,
    MAX_HINT_COUNT: 5
  } as const;

  // File Paths (configurable via environment)
  static readonly PATHS = {
    CONFIG_DIR: process.env.CONFIG_DIR || './config',
    MODULES_DIR: process.env.MODULES_DIR || './modules',
    CONTENT_DIR: process.env.CONTENT_DIR || './content',
    ASSETS_DIR: process.env.ASSETS_DIR || './assets'
  } as const;

  // Environment-specific settings
  static readonly ENVIRONMENT = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEBUG: process.env.DEBUG === 'true',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000'
  } as const;
}

// Type-safe configuration access
export type HardwareModuleId = typeof AppConfig.HARDWARE_MODULES[keyof typeof AppConfig.HARDWARE_MODULES];
export type ConfigPath = typeof AppConfig.PATHS[keyof typeof AppConfig.PATHS];
