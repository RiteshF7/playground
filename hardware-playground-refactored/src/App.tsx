import React, { useEffect, useState } from 'react';
import { usePlaygroundEngine } from './ui/hooks';
import { PlaygroundEditor, HardwareRunner } from './ui/components';
import { availablePlaygrounds, defaultPlaygroundConfig } from './config/base';

const App = () => {
  const {
    initialize,
    isInitialized,
    currentConfig,
    executeCode,
    moduleStates,
  } = usePlaygroundEngine();
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState(defaultPlaygroundConfig.id);

  useEffect(() => {
    const selectedConfig = availablePlaygrounds.find(p => p.id === selectedPlaygroundId) || defaultPlaygroundConfig;
    initialize(selectedConfig);
  }, [initialize, selectedPlaygroundId]);

  if (!isInitialized || !currentConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <label htmlFor="playground-select">Select Playground: </label>
        <select
          id="playground-select"
          value={selectedPlaygroundId}
          onChange={e => setSelectedPlaygroundId(e.target.value)}
        >
          {availablePlaygrounds.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
        <div style={{ flex: 1, padding: '10px' }}>
          <PlaygroundEditor
            config={currentConfig}
            onExecute={executeCode as any}
          />
        </div>
        <div style={{ flex: 1, padding: '10px', borderLeft: '1px solid #ccc' }}>
          <HardwareRunner
            moduleIds={currentConfig.hardware}
            moduleStates={moduleStates}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
