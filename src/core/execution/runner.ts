import { PlaygroundConfig, TestCase, TestResult } from '@/types/playground';
import { VirtualHardwareManager } from '@/core/virtual-hardware/manager';

export class CodeRunner {
  private config: PlaygroundConfig;
  private virtualHardware: VirtualHardwareManager;
  private testResults: TestResult[] = [];

  constructor(config: PlaygroundConfig, virtualHardware: VirtualHardwareManager) {
    this.config = config;
    this.virtualHardware = virtualHardware;
  }

  public async runTests(code: string): Promise<TestResult[]> {
    this.testResults = [];
    
    for (const testCase of this.config.testCases) {
      const result = await this.runSingleTest(testCase, code);
      this.testResults.push(result);
    }

    return this.testResults;
  }

  private async runSingleTest(testCase: TestCase, code: string): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Reset virtual hardware state
      this.virtualHardware.reset();
      
      // Set up test input if provided
      if (testCase.input) {
        this.setupTestInput(testCase.input);
      }

      // Execute the code
      await this.virtualHardware.executeCode(code);
      
      // Wait for execution to complete
      await this.waitForExecution();
      
      // Check the result
      const actualOutput = this.getTestOutput();
      const passed = this.compareOutput(actualOutput, testCase.expectedOutput);
      
      const executionTime = Date.now() - startTime;
      
      return {
        testCaseId: testCase.id,
        passed,
        output: actualOutput,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      return {
        testCaseId: testCase.id,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime
      };
    }
  }

  private setupTestInput(input: any): void {
    // Set up virtual hardware state based on test input
    // This could include setting button states, sensor values, etc.
    if (input.buttons) {
      input.buttons.forEach((button: any) => {
        // Set button state in virtual hardware
        this.setButtonState(button.id, button.pressed);
      });
    }
    
    if (input.sensors) {
      input.sensors.forEach((sensor: any) => {
        // Set sensor values in virtual hardware
        this.setSensorValue(sensor.id, sensor.value);
      });
    }
  }

  private async waitForExecution(): Promise<void> {
    // Wait for code execution to complete
    // This could be based on a timeout or completion signal
    const timeout = 5000; // 5 seconds
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      // Check if execution is complete
      if (!this.virtualHardware.isSimulating) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private getTestOutput(): any {
    // Get the current state of virtual hardware as test output
    const componentStates = this.virtualHardware.getAllComponentStates();
    const output: any = {};
    
    componentStates.forEach((state, componentId) => {
      output[componentId] = state.state;
    });
    
    return output;
  }

  private compareOutput(actual: any, expected: any): boolean {
    // Simple comparison - in a real implementation, this would be more sophisticated
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  private setButtonState(buttonId: string, pressed: boolean): void {
    // Set button state in virtual hardware
    const componentState = this.virtualHardware.getComponentState(buttonId);
    if (componentState) {
      componentState.state.isPressed = pressed;
    }
  }

  private setSensorValue(sensorId: string, value: number): void {
    // Set sensor value in virtual hardware
    const componentState = this.virtualHardware.getComponentState(sensorId);
    if (componentState) {
      componentState.state.value = value;
    }
  }

  public getTestResults(): TestResult[] {
    return this.testResults;
  }

  public getPassedTests(): TestResult[] {
    return this.testResults.filter(result => result.passed);
  }

  public getFailedTests(): TestResult[] {
    return this.testResults.filter(result => !result.passed);
  }

  public getOverallScore(): number {
    if (this.testResults.length === 0) return 0;
    const passed = this.getPassedTests().length;
    return (passed / this.testResults.length) * 100;
  }
}