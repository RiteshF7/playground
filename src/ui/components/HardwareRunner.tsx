// Hardware Runner Component
import React, { useState, useEffect } from 'react';
import { ModuleState } from '../../core/types';
import { moduleRegistry } from '../../modules/registry';

export interface HardwareRunnerProps {
  moduleIds: string[];
  onStateChange?: (moduleId: string, state: ModuleState) => void;
  className?: string;
}

export const HardwareRunner: React.FC<HardwareRunnerProps> = ({
  moduleIds,
  onStateChange,
  className = ''
}) => {
  const [moduleStates, setModuleStates] = useState<Record<string, ModuleState | null>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize module states
    const initialStates: Record<string, ModuleState | null> = {};

    for (const moduleId of moduleIds) {
      const module = moduleRegistry.getModule(moduleId);
      if (module) {
        initialStates[moduleId] = module.currentState;
      }
    }

    setModuleStates(initialStates);
  }, [moduleIds]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const renderModuleVisualization = (moduleId: string, state: ModuleState | null) => {
    const module = moduleRegistry.getModule(moduleId);
    if (!module) return null;

    // Simple visualization based on module type
    switch (module.category) {
      case 'output':
        return (
          <div key={moduleId} style={{
            padding: '10px',
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: state ? '#4CAF50' : '#f5f5f5'
          }}>
            <h4>{module.name}</h4>
            <div>Status: {state ? 'Active' : 'Inactive'}</div>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: state ? '#FF5722' : '#ccc',
              display: 'inline-block',
              marginTop: '5px'
            }} />
          </div>
        );

      default:
        return (
          <div key={moduleId} style={{
            padding: '10px',
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}>
            <h4>{module.name}</h4>
            <pre style={{ fontSize: '10px' }}>
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className={`hardware-runner ${className}`}>
      <div className="runner-toolbar" style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={handleConnect}
          style={{
            padding: '6px 12px',
            backgroundColor: isConnected ? '#f44336' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {isConnected ? '🔌 Disconnect' : '🔗 Connect'}
        </button>

        <span style={{
          color: isConnected ? '#4CAF50' : '#f44336',
          fontWeight: 'bold'
        }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="hardware-modules" style={{ padding: '10px' }}>
        <h3>Hardware Modules ({moduleIds.length})</h3>

        {moduleIds.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            No hardware modules configured
          </div>
        ) : (
          <div className="modules-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {moduleIds.map(moduleId =>
              renderModuleVisualization(moduleId, moduleStates[moduleId])
            )}
          </div>
        )}
      </div>

      <div className="console" style={{
        padding: '10px',
        borderTop: '1px solid #ccc',
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: '12px',
        height: '150px',
        overflowY: 'auto'
      }}>
        <div>Hardware Runner Console</div>
        <div>Status: {isConnected ? 'Ready' : 'Waiting for connection'}</div>
        <div>Modules loaded: {moduleIds.length}</div>
      </div>
    </div>
  );
};
