// Playground Engine Hook
import { useState, useCallback, useEffect } from 'react';
import { PlaygroundEngine } from '../../playground/engine';
import {
  PlaygroundConfiguration,
  BlockInstance,
  ExecutionResult,
  ValidationResult,
  ModuleState
} from '../../core/types';

export const usePlaygroundEngine = () => {
  const [engine] = useState(() => new PlaygroundEngine());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);
  const [currentConfig, setCurrentConfig] = useState<PlaygroundConfiguration | null>(null);
  const [moduleStates, setModuleStates] = useState<Record<string, ModuleState | null>>({});

  useEffect(() => {
    const handleModuleStateChange = (newState: ModuleState) => {
      setModuleStates(prevStates => ({
        ...prevStates,
        [newState.moduleId]: newState,
      }));
    };

    engine.on('moduleStateChange', handleModuleStateChange);

    return () => {
      engine.off('moduleStateChange', handleModuleStateChange);
    };
  }, [engine]);

  const initialize = useCallback(async (config: PlaygroundConfiguration): Promise<ValidationResult> => {
    try {
      const result = await engine.initialize(config);

      if (result.isValid) {
        setCurrentConfig(config);
        setIsInitialized(true);
      }

      return result;
    } catch (error) {
      return {
        isValid: false,
        errors: [String(error)]
      };
    }
  }, [engine]);

  const executeCode = useCallback(async (code: string, language: 'javascript' | 'python'): Promise<ExecutionResult> => {
    if (!isInitialized) {
      const errorResult: ExecutionResult = {
        success: false,
        error: 'Playground not initialized',
        timestamp: Date.now()
      };
      setLastResult(errorResult);
      return errorResult;
    }

    setIsExecuting(true);
    try {
      const result = await (engine as any).executeCode(code, language);
      setLastResult(result);
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, [engine, isInitialized]);

  const stopExecution = useCallback(async (): Promise<void> => {
    await engine.stopExecution();
    setIsExecuting(false);
  }, [engine]);

  const getStatus = useCallback(() => {
    return engine.getStatus();
  }, [engine]);

  return {
    engine,
    initialize,
    executeCode,
    stopExecution,
    getStatus,
    isInitialized,
    isExecuting,
    lastResult,
    currentConfig,
    moduleStates,
  };
};
