import React from 'react';
import { ModuleState } from '../../core/types';
import { moduleRegistry } from '../../modules/registry';

export interface HardwareRunnerProps {
  moduleIds: string[];
  moduleStates: Record<string, ModuleState | null>;
  className?: string;
}

export const HardwareRunner: React.FC<HardwareRunnerProps> = ({
  moduleIds,
  moduleStates,
  className = ''
}) => {
  const renderModuleVisualization = (moduleId: string) => {
    const module = moduleRegistry.getModule(moduleId);
    const state = moduleStates[moduleId];
    if (!module) return null;

    if (module.id === 'led-module' && state) {
      const ledState = Object.values(state.state)[0] as { active: boolean };
      return (
        <div key={moduleId} style={{ padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h4>{module.name}</h4>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: ledState.active ? 'red' : '#ccc',
            border: '2px solid #666'
          }} />
        </div>
      );
    }

    // Default visualization for other modules
    return (
      <div key={moduleId} style={{ padding: '10px', margin: '5px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h4>{module.name}</h4>
        <pre style={{ fontSize: '10px' }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className={`hardware-runner ${className}`}>
      <h3>Hardware Simulation</h3>
      <div className="modules-grid" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {moduleIds.map(moduleId => renderModuleVisualization(moduleId))}
      </div>
    </div>
  );
};
