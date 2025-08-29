import { HardwareComponent } from '@/types/hardware';

export interface PlaygroundConfig {
  id: string;
  title: string;
  description: string;
  type: 'hardware' | 'virtual';
  problemStatement: string;
  requiredBlocks: string[];
  components: HardwareComponent[];
  testCases: TestCase[];
  expectedOutput?: string;
}

export interface TestCase {
  id: string;
  description: string;
  input?: any;
  expectedOutput: any;
  timeout?: number;
}

export interface PlaygroundState {
  config: PlaygroundConfig;
  code: string;
  isRunning: boolean;
  testResults: TestResult[];
  isConnected: boolean;
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  output?: any;
  error?: string;
  executionTime: number;
}