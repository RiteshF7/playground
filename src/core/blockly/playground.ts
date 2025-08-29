import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { javascriptGenerator } from 'blockly/javascript';
import { PlaygroundConfig } from '@/types/playground';
import { VirtualHardwareManager } from '@/core/virtual-hardware/manager';
import { SerialManager } from '@/core/serial/manager';
import { blockDefinitionsArray, forJsBlock, forPyBlock } from './blocks';

export class PlaygroundManager {
  private workspace!: Blockly.WorkspaceSvg;
  private config: PlaygroundConfig;
  private virtualHardware: VirtualHardwareManager;
  private serialManager: SerialManager;
  private isRunning: boolean = false;

  constructor(
    container: HTMLElement, 
    config: PlaygroundConfig,
    virtualHardware: VirtualHardwareManager,
    serialManager: SerialManager
  ) {
    this.config = config;
    this.virtualHardware = virtualHardware;
    this.serialManager = serialManager;
    
    this.initializeBlockly();
    this.initializeWorkspace(container);
    this.setupEventListeners();
  }

  private initializeBlockly(): void {
    // Define custom blocks
    Blockly.common.defineBlocks(blockDefinitionsArray);
    
    // Add code generators
    Object.assign(pythonGenerator.forBlock, forPyBlock);
    Object.assign(javascriptGenerator.forBlock, forJsBlock);
  }

  private initializeWorkspace(container: HTMLElement): void {
    const toolbox = this.generateToolbox();
    
    this.workspace = Blockly.inject(container, {
      toolbox: toolbox,
      theme: this.getTheme(),
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      trashcan: true,
      media: 'https://unpkg.com/blockly/media/'
    });
  }

  private generateToolbox(): any {
    const toolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Logic',
          colour: '210',
          contents: [
            { kind: 'block', type: 'controls_if' },
            { kind: 'block', type: 'logic_compare' },
            { kind: 'block', type: 'logic_operation' }
          ]
        },
        {
          kind: 'category',
          name: 'Loops',
          colour: '120',
          contents: [
            { kind: 'block', type: 'controls_repeat_ext' },
            { kind: 'block', type: 'controls_for' },
            { kind: 'block', type: 'controls_whileUntil' }
          ]
        },
        {
          kind: 'category',
          name: 'Hardware',
          colour: '290',
          contents: this.generateHardwareBlocks()
        }
      ]
    };

    return toolbox;
  }

  private generateHardwareBlocks(): any[] {
    const blocks: any[] = [];
    
    this.config.components.forEach(component => {
      switch (component.type) {
        case 'led':
          blocks.push({ kind: 'block', type: 'led_on' });
          blocks.push({ kind: 'block', type: 'led_off' });
          break;
        case 'neopixel':
          blocks.push({ kind: 'block', type: 'neopixel_set_color' });
          blocks.push({ kind: 'block', type: 'neopixel_clear' });
          break;
        case 'servo':
          blocks.push({ kind: 'block', type: 'servo_move' });
          break;
        case 'buzzer':
          blocks.push({ kind: 'block', type: 'buzzer_beep' });
          break;
      }
    });

    return blocks;
  }

  private getTheme(): Blockly.Theme {
    return new Blockly.Theme('default', {
      'blockStyles': {
        'logic_blocks': {
          'colourPrimary': '210',
          'colourSecondary': '160',
          'colourTertiary': '230'
        },
        'loop_blocks': {
          'colourPrimary': '120',
          'colourSecondary': '160',
          'colourTertiary': '230'
        },
        'hardware_blocks': {
          'colourPrimary': '290',
          'colourSecondary': '160',
          'colourTertiary': '230'
        }
      },
      'categoryStyles': {
        'logic_category': { 'colour': '210' },
        'loop_category': { 'colour': '120' },
        'hardware_category': { 'colour': '290' }
      }
    } as any);
  }

  private setupEventListeners(): void {
    this.workspace.addChangeListener((event) => {
      if (event.type === Blockly.Events.BLOCK_CREATE || 
          event.type === Blockly.Events.BLOCK_DELETE ||
          event.type === Blockly.Events.BLOCK_CHANGE) {
        this.onWorkspaceChange();
      }
    });
  }

  private onWorkspaceChange(): void {
    // Update virtual hardware simulation based on workspace changes
    this.virtualHardware.updateFromWorkspace(this.workspace);
  }

  public generatePythonCode(): string {
    return pythonGenerator.workspaceToCode(this.workspace);
  }

  public generateJavaScriptCode(): string {
    return javascriptGenerator.workspaceToCode(this.workspace);
  }

  public async runCode(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    try {
      const code = this.generatePythonCode();
      await this.executeCode(code);
    } finally {
      this.isRunning = false;
    }
  }

  private async executeCode(code: string): Promise<void> {
    // Execute code in virtual environment
    await this.virtualHardware.executeCode(code);
  }

  public async flashToHardware(): Promise<boolean> {
    if (!this.serialManager.isConnected()) {
      const connected = await this.serialManager.connect();
      if (!connected) return false;
    }

    const code = this.generatePythonCode();
    return await this.serialManager.sendCode(code);
  }

  public getWorkspace(): Blockly.WorkspaceSvg {
    return this.workspace;
  }

  public dispose(): void {
    if (this.workspace) {
      this.workspace.dispose();
    }
  }
}