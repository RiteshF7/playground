import React, { useState, useEffect, useCallback } from 'react';
import { BlocklyComponent, Block, Value, Field, Shadow } from '@blockly/react';
import Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';

import { PlaygroundConfiguration, BlockInstance } from '../../core/types';
import { moduleRegistry } from '../../modules/registry';
import { codeGenerator } from '../../core/utils';

export interface PlaygroundEditorProps {
  config: PlaygroundConfiguration;
  onCodeChange?: (code: string, language: 'javascript' | 'python') => void;
  onExecute?: (code: string, language: 'javascript' | 'python') => void;
  className?: string;
}

export const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({
  config,
  onCodeChange,
  onExecute,
  className = ''
}) => {
  const [toolbox, setToolbox] = useState<any>(null);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

  useEffect(() => {
    // Define custom blocks
    const allBlocks = moduleRegistry.getAllBlocks();
    for (const blockDef of allBlocks) {
      if (Blockly.Blocks[blockDef.id]) {
        continue;
      }
      Blockly.Blocks[blockDef.id] = {
        init: function() {
          this.jsonInit({
            type: blockDef.id,
            message0: blockDef.displayName,
            args0: blockDef.parameters.map(p => ({
              type: `field_${p.type === 'number' ? 'input' : p.type}`,
              name: p.name,
              text: p.name,
            })),
            previousStatement: null,
            nextStatement: null,
            colour: blockDef.color || 230,
            tooltip: blockDef.description || '',
            helpUrl: '',
          });
        }
      };

      javascriptGenerator.forBlock[blockDef.id] = function(block) {
        let code = blockDef.codeTemplate.javascript;
        for (const param of blockDef.parameters) {
          const value = block.getFieldValue(param.name);
          code = code.replace(new RegExp(`{{${param.name}}}`, 'g'), value);
        }
        return code;
      };

      pythonGenerator.forBlock[blockDef.id] = function(block) {
        let code = blockDef.codeTemplate.python;
        for (const param of blockDef.parameters) {
          const value = block.getFieldValue(param.name);
          code = code.replace(new RegExp(`{{${param.name}}}`, 'g'), value);
        }
        return code;
      };
    }

    // Generate toolbox configuration
    const toolboxConfig = {
      kind: 'flyoutToolbox',
      contents: config.editor.toolbox.categories.map(category => ({
        kind: 'category',
        name: category.name,
        colour: category.color,
        contents: category.blocks.map(blockId => ({
          kind: 'block',
          type: blockId,
        })),
      })),
    };
    setToolbox(toolboxConfig);
  }, [config]);

  const handleWorkspaceChange = (workspace: Blockly.Workspace) => {
    const code = language === 'javascript'
      ? javascriptGenerator.workspaceToCode(workspace)
      : pythonGenerator.workspaceToCode(workspace);
    if (onCodeChange) {
      onCodeChange(code, language);
    }
  };

  const handleExecute = () => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) {
        return;
    }
    const code = language === 'javascript'
      ? javascriptGenerator.workspaceToCode(workspace)
      : pythonGenerator.workspaceToCode(workspace);
    if (onExecute) {
      onExecute(code, language);
    }
  };

  if (!toolbox) {
    return <div>Loading Blockly Editor...</div>;
  }

  return (
    <div className={`playground-editor ${className}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="editor-toolbar" style={{ padding: '5px' }}>
        <button onClick={handleExecute} style={{ marginRight: '10px' }}>▶ Run Code</button>
        <select value={language} onChange={e => setLanguage(e.target.value as any)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <BlocklyComponent
            readOnly={false}
            trashcan={true}
            media={'/media/blockly'}
            move={{
                scrollbars: true,
                drag: true,
                wheel: true
            }}
            initialXml={`<xml xmlns="https://developers.google.com/blockly/xml"></xml>`}
            toolbox={toolbox}
            onWorkspaceChange={handleWorkspaceChange}
        >
        </BlocklyComponent>
      </div>
    </div>
  );
};
