import { PlaygroundConfig } from '@/types/playground';

export class ConfigLoader {
  private static configs: Map<string, PlaygroundConfig> = new Map();

  public static async loadConfig(configId: string): Promise<PlaygroundConfig> {
    if (this.configs.has(configId)) {
      return this.configs.get(configId)!;
    }

    try {
      const response = await fetch(`/configs/${configId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }

      const config: PlaygroundConfig = await response.json();
      this.validateConfig(config);
      
      this.configs.set(configId, config);
      return config;
    } catch (error) {
      console.error('Error loading config:', error);
      throw error;
    }
  }

  public static async loadConfigFromUrl(url: string): Promise<PlaygroundConfig> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load config from URL: ${response.statusText}`);
      }

      const config: PlaygroundConfig = await response.json();
      this.validateConfig(config);
      
      return config;
    } catch (error) {
      console.error('Error loading config from URL:', error);
      throw error;
    }
  }

  public static async loadConfigFromJson(jsonString: string): Promise<PlaygroundConfig> {
    try {
      const config: PlaygroundConfig = JSON.parse(jsonString);
      this.validateConfig(config);
      return config;
    } catch (error) {
      console.error('Error parsing config JSON:', error);
      throw error;
    }
  }

  public static async getAvailableConfigs(): Promise<string[]> {
    try {
      const response = await fetch('/configs/index.json');
      if (!response.ok) {
        throw new Error(`Failed to load config index: ${response.statusText}`);
      }

      const index = await response.json();
      return index.configs || [];
    } catch (error) {
      console.error('Error loading config index:', error);
      return [];
    }
  }

  private static validateConfig(config: PlaygroundConfig): void {
    const requiredFields = ['id', 'title', 'description', 'type', 'problemStatement', 'components'];
    
    for (const field of requiredFields) {
      if (!(field in config)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(config.components)) {
      throw new Error('Components must be an array');
    }

    if (!Array.isArray(config.testCases)) {
      throw new Error('Test cases must be an array');
    }

    // Validate components
    config.components.forEach((component, index) => {
      if (!component.id || !component.type || !component.name) {
        throw new Error(`Invalid component at index ${index}: missing required fields`);
      }
    });

    // Validate test cases
    config.testCases.forEach((testCase, index) => {
      if (!testCase.id || !testCase.description) {
        throw new Error(`Invalid test case at index ${index}: missing required fields`);
      }
    });
  }

  public static createDefaultConfig(): PlaygroundConfig {
    return {
      id: 'default',
      title: 'Default Playground',
      description: 'A default playground configuration',
      type: 'virtual',
      problemStatement: 'Create a simple program using the available blocks.',
      requiredBlocks: [],
      components: [
        {
          id: 'led1',
          type: 'led',
          name: 'LED 1',
          pins: [
            { id: 'pin1', type: 'digital', number: 13, mode: 'output' }
          ],
          properties: [
            { name: 'brightness', type: 'number', value: 255, min: 0, max: 255 }
          ]
        }
      ],
      testCases: [
        {
          id: 'test1',
          description: 'LED should turn on',
          expectedOutput: { led1: { isOn: true } }
        }
      ]
    };
  }

  public static clearCache(): void {
    this.configs.clear();
  }
}