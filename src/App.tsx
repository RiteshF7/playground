import React, { useState } from 'react';
import { PlaygroundContainer } from '@/components/playground/PlaygroundContainer';
import { ConfigLoader } from '@/utils/config-loader';
import './App.css';

function App() {
  const [selectedConfig, setSelectedConfig] = useState<string>('led-basic');
  const [availableConfigs, setAvailableConfigs] = useState<any[]>([]);
  const [customConfig, setCustomConfig] = useState<string>('');
  const [useCustomConfig, setUseCustomConfig] = useState<boolean>(false);

  React.useEffect(() => {
    loadAvailableConfigs();
  }, []);

  const loadAvailableConfigs = async () => {
    try {
      const configs = await ConfigLoader.getAvailableConfigs();
      setAvailableConfigs(configs);
    } catch (error) {
      console.error('Failed to load available configs:', error);
    }
  };

  const handleConfigChange = (configId: string) => {
    setSelectedConfig(configId);
    setUseCustomConfig(false);
  };

  const handleCustomConfigSubmit = () => {
    if (customConfig.trim()) {
      setUseCustomConfig(true);
    }
  };

  const handleLoadFromUrl = () => {
    const url = prompt('Enter configuration URL:');
    if (url) {
      setUseCustomConfig(true);
      setCustomConfig(url);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>MicroPython Playground</h1>
        <p>Drag-and-drop visual programming for MicroPython with virtual hardware</p>
      </header>

      <div className="app-controls">
        <div className="config-selector">
          <label htmlFor="config-select">Select Playground:</label>
          <select 
            id="config-select"
            value={selectedConfig} 
            onChange={(e) => handleConfigChange(e.target.value)}
            disabled={useCustomConfig}
          >
            {availableConfigs.map(config => (
              <option key={config.id} value={config.id}>
                {config.title} - {config.difficulty}
              </option>
            ))}
          </select>
        </div>

        <div className="custom-config">
          <button onClick={handleLoadFromUrl}>
            Load from URL
          </button>
          <button onClick={() => setUseCustomConfig(!useCustomConfig)}>
            {useCustomConfig ? 'Use Preset' : 'Use Custom JSON'}
          </button>
        </div>

        {useCustomConfig && (
          <div className="custom-config-input">
            <label htmlFor="custom-config-textarea">Custom Configuration JSON:</label>
            <textarea
              id="custom-config-textarea"
              value={customConfig}
              onChange={(e) => setCustomConfig(e.target.value)}
              placeholder="Paste your playground configuration JSON here..."
              rows={10}
            />
            <button onClick={handleCustomConfigSubmit}>
              Load Custom Config
            </button>
          </div>
        )}
      </div>

      <main className="app-main">
        {useCustomConfig ? (
          <PlaygroundContainer configJson={customConfig} />
        ) : (
          <PlaygroundContainer configId={selectedConfig} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          MicroPython Playground - Visual programming for embedded systems
        </p>
      </footer>
    </div>
  );
}

export default App;