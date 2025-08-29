import React, { useState, useEffect, useRef } from 'react';
import { PlaygroundConfig } from '@/types/playground';
import { PlaygroundManager } from '@/core/blockly/playground';
import { VirtualHardwareManager } from '@/core/virtual-hardware/manager';
import { SerialManager } from '@/core/serial/manager';
import { CodeRunner } from '@/core/execution/runner';
import { ConfigLoader } from '@/utils/config-loader';
import { VirtualHardwareDisplay } from '../virtual-hardware/VirtualHardwareDisplay';
import { TestResults } from './TestResults';
import { CodeOutput } from './CodeOutput';

interface PlaygroundContainerProps {
  configId?: string;
  configUrl?: string;
  configJson?: string;
}

export const PlaygroundContainer: React.FC<PlaygroundContainerProps> = ({
  configId,
  configUrl,
  configJson
}) => {
  const [config, setConfig] = useState<PlaygroundConfig | null>(null);
  const [playgroundManager, setPlaygroundManager] = useState<PlaygroundManager | null>(null);
  const [virtualHardware, setVirtualHardware] = useState<VirtualHardwareManager | null>(null);
  const [serialManager] = useState<SerialManager>(new SerialManager());
  const [codeRunner, setCodeRunner] = useState<CodeRunner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [output, setOutput] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const playgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConfig();
  }, [configId, configUrl, configJson]);

  useEffect(() => {
    if (config && playgroundRef.current) {
      initializePlayground();
    }
  }, [config]);

  useEffect(() => {
    // Listen for virtual hardware output
    const handleOutput = (event: CustomEvent) => {
      setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${event.detail.message}`]);
    };

    window.addEventListener('virtual-hardware-output', handleOutput as EventListener);
    return () => {
      window.removeEventListener('virtual-hardware-output', handleOutput as EventListener);
    };
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let loadedConfig: PlaygroundConfig;

      if (configJson) {
        loadedConfig = await ConfigLoader.loadConfigFromJson(configJson);
      } else if (configUrl) {
        loadedConfig = await ConfigLoader.loadConfigFromUrl(configUrl);
      } else if (configId) {
        loadedConfig = await ConfigLoader.loadConfig(configId);
      } else {
        loadedConfig = ConfigLoader.createDefaultConfig();
      }

      setConfig(loadedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const initializePlayground = () => {
    if (!config || !playgroundRef.current) return;

    try {
      const vh = new VirtualHardwareManager(config);
      const pm = new PlaygroundManager(playgroundRef.current, config, vh, serialManager);
      const cr = new CodeRunner(config, vh);

      setVirtualHardware(vh);
      setPlaygroundManager(pm);
      setCodeRunner(cr);

      // Set up serial disconnect handler
      serialManager.setOnDisconnect(() => {
        setIsConnected(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize playground');
    }
  };

  const handleRunCode = async () => {
    if (!playgroundManager || !codeRunner || isRunning) return;

    try {
      setIsRunning(true);
      setTestResults([]);
      setOutput([]);

      const code = playgroundManager.generatePythonCode();
      const results = await codeRunner.runTests(code);
      
      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleFlashToHardware = async () => {
    if (!playgroundManager) return;

    try {
      const success = await playgroundManager.flashToHardware();
      if (success) {
        setIsConnected(true);
        setOutput(prev => [...prev, 'Code flashed to hardware successfully!']);
      } else {
        setError('Failed to flash code to hardware');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to flash to hardware');
    }
  };

  const handleConnectHardware = async () => {
    try {
      const connected = await serialManager.connect();
      setIsConnected(connected);
      if (connected) {
        setOutput(prev => [...prev, 'Connected to hardware successfully!']);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to hardware');
    }
  };

  if (isLoading) {
    return (
      <div className="playground-container">
        <div className="loading">Loading playground...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="playground-container">
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadConfig}>Retry</button>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="playground-container">
        <div className="error">No configuration loaded</div>
      </div>
    );
  }

  return (
    <div className="playground-container">
      <div className="playground-header">
        <h1>{config.title}</h1>
        <p>{config.description}</p>
        <div className="problem-statement">
          <h3>Problem Statement</h3>
          <p>{config.problemStatement}</p>
        </div>
      </div>

      <div className="playground-content">
        <div className="playground-workspace">
          <div className="workspace-toolbar">
            <button 
              onClick={handleRunCode} 
              disabled={isRunning}
              className="run-button"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button 
              onClick={handleConnectHardware}
              disabled={isConnected}
              className="connect-button"
            >
              {isConnected ? 'Connected' : 'Connect Hardware'}
            </button>
            <button 
              onClick={handleFlashToHardware}
              disabled={!isConnected}
              className="flash-button"
            >
              Flash to Hardware
            </button>
          </div>
          <div 
            ref={playgroundRef} 
            className="blockly-workspace"
            style={{ height: '500px', width: '100%' }}
          />
        </div>

        <div className="playground-sidebar">
          <VirtualHardwareDisplay 
            virtualHardware={virtualHardware}
            config={config}
          />
          
          <TestResults 
            results={testResults}
            isRunning={isRunning}
          />
          
          <CodeOutput 
            output={output}
          />
        </div>
      </div>
    </div>
  );
};