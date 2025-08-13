// Playground Editor Component
import React, { useEffect, useRef } from 'react';
import { PlaygroundConfiguration, BlockInstance } from '../../core/types';

export interface PlaygroundEditorProps {
  config: PlaygroundConfiguration;
  onCodeChange?: (blocks: BlockInstance[]) => void;
  onExecute?: () => void;
  className?: string;
}

export const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({
  config,
  onCodeChange,
  onExecute,
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize Blockly editor would happen here
      // For now, just a placeholder
      console.log('Initializing Blockly editor with config:', config);
    }
  }, [config]);

  const handleExecute = () => {
    if (onExecute) {
      onExecute();
    }
  };

  return (
    <div className={`playground-editor ${className}`}>
      <div className="editor-toolbar">
        <button
          onClick={handleExecute}
          className="execute-btn"
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ▶ Run Code
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor-workspace"
        style={{
          width: '100%',
          height: '600px',
          border: '1px solid #ccc',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: '#666'
        }}
      >
        Blockly Editor Placeholder
        <br />
        <small>Toolbox: {config.editor.toolbox.categories.length} categories</small>
      </div>
    </div>
  );
};
