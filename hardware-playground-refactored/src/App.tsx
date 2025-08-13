import React, { useEffect } from 'react';
import { usePlaygroundEngine } from './ui/hooks';
import { PlaygroundEditor } from './ui/components';
import { defaultPlaygroundConfig } from './config/base';

const App = () => {
  const { initialize, isInitialized, currentConfig } = usePlaygroundEngine();

  useEffect(() => {
    initialize(defaultPlaygroundConfig);
  }, [initialize]);

  if (!isInitialized || !currentConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hardware Playground</h1>
      <PlaygroundEditor config={currentConfig} />
    </div>
  );
};

export default App;
