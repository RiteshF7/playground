// Playground Engine Hook
import { useState, useCallback } from 'react';
import { PlaygroundEngine } from '../../playground/engine';
import {
  PlaygroundConfiguration,
  BlockInstance,
  ExecutionResult,
  ValidationResult
} from '../../core/types';

export const usePlaygroundEngine = () => {
  const [engine] = useState(() => new PlaygroundEngine());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);
  const [currentConfig, setCurrentConfig] = useState<PlaygroundConfiguration | null>(null);

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

  const executeBlocks = useCallback(async (blocks: BlockInstance[]): Promise<ExecutionResult> => {
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
      const result = await engine.executeBlocks(blocks);
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
    executeBlocks,
    stopExecution,
    getStatus,
    isInitialized,
    isExecuting,
    lastResult,
    currentConfig
  };
};
