// Code Generation Utilities
import { BlockInstance, CodeLanguage, CodeTemplateMap, ExecutionResult } from '../types';

export class CodeGenerator {
  private codeTemplates: Map<string, CodeTemplateMap> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Register a code template for a block
   */
  registerTemplate(blockId: string, template: CodeTemplateMap): void {
    this.codeTemplates.set(blockId, template);
  }

  /**
   * Generate code from block instances
   */
  generateCode(blocks: BlockInstance[], language: CodeLanguage): string {
    const codeLines: string[] = [];

    // Add language-specific header
    codeLines.push(this.getCodeHeader(language));

    // Process blocks in execution order
    const sortedBlocks = this.sortBlocksForExecution(blocks);

    for (const block of sortedBlocks) {
      const code = this.generateBlockCode(block, language);
      if (code) {
        codeLines.push(code);
      }
    }

    // Add language-specific footer
    codeLines.push(this.getCodeFooter(language));

    return codeLines.join('\\n');
  }

  /**
   * Generate code for a single block
   */
  private generateBlockCode(block: BlockInstance, language: CodeLanguage): string {
    const template = this.codeTemplates.get(block.type);
    if (!template) {
      console.warn(`No code template found for block type: ${block.type}`);
      return '';
    }

    let code = template[language] || '';

    // Replace parameter placeholders
    for (const [key, value] of Object.entries(block.parameters)) {
      const placeholder = `{{${key}}}`;
      code = code.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return this.formatCode(code, language);
  }

  /**
   * Sort blocks for proper execution order
   */
  private sortBlocksForExecution(blocks: BlockInstance[]): BlockInstance[] {
    // This would implement topological sorting based on block connections
    // For now, simple approach based on position
    return [...blocks].sort((a, b) => a.position.y - b.position.y);
  }

  /**
   * Get language-specific code header
   */
  private getCodeHeader(language: CodeLanguage): string {
    switch (language) {
      case 'javascript':
        return [
          '// Generated JavaScript Code',
          'const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));',
          '',
          'async function executeProgram() {',
          '  try {'
        ].join('\\n');

      case 'python':
      case 'micropython':
        return [
          '# Generated Python Code',
          'import time',
          'from machine import Pin',
          '',
          'def execute_program():',
          '    try:'
        ].join('\\n');

      default:
        return '';
    }
  }

  /**
   * Get language-specific code footer
   */
  private getCodeFooter(language: CodeLanguage): string {
    switch (language) {
      case 'javascript':
        return [
          '  } catch (error) {',
          '    console.error("Execution error:", error);',
          '  }',
          '}',
          '',
          'executeProgram();'
        ].join('\\n');

      case 'python':
      case 'micropython':
        return [
          '    except Exception as e:',
          '        print("Execution error:", e)',
          '',
          'execute_program()'
        ].join('\\n');

      default:
        return '';
    }
  }

  /**
   * Format code according to language conventions
   */
  private formatCode(code: string, language: CodeLanguage): string {
    switch (language) {
      case 'javascript':
        return `    ${code}`; // 4-space indentation

      case 'python':
      case 'micropython':
        return `        ${code}`; // 8-space indentation

      default:
        return code;
    }
  }

  /**
   * Initialize default code templates
   */
  private initializeTemplates(): void {
    // Delay template
    this.registerTemplate('delay', {
      javascript: 'await delay({{time}});',
      python: 'time.sleep({{time}} / 1000)',
      micropython: 'time.sleep_ms({{time}})'
    });

    // Digital output templates
    this.registerTemplate('digital_output', {
      javascript: 'await setDigitalPin({{pin}}, {{value}});',
      python: 'Pin({{pin}}, Pin.OUT).value({{value}})',
      micropython: 'Pin({{pin}}, Pin.OUT).value({{value}})'
    });
  }

  /**
   * Validate generated code
   */
  validateCode(code: string, language: CodeLanguage): ExecutionResult {
    try {
      switch (language) {
        case 'javascript':
          // Basic syntax check (in real implementation, use a proper parser)
          new Function(code);
          break;

        case 'python':
        case 'micropython':
          // Would use a Python AST parser in real implementation
          break;
      }

      return {
        success: true,
        data: code,
        timestamp: Date.now()
      };

    } catch (error) {
      return {
        success: false,
        error: `Code validation failed: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Optimize generated code
   */
  optimizeCode(code: string, language: CodeLanguage): string {
    // Remove empty lines
    let optimized = code.replace(/^\\s*\\n/gm, '');

    // Remove unnecessary delays (consecutive delays could be combined)
    if (language === 'javascript') {
      optimized = optimized.replace(
        /await delay\\((\\d+)\\);\\s*\\n\\s*await delay\\((\\d+)\\);/g,
        (match, delay1, delay2) => `await delay(${parseInt(delay1) + parseInt(delay2)});`
      );
    }

    return optimized;
  }
}

// Export singleton instance
export const codeGenerator = new CodeGenerator();
