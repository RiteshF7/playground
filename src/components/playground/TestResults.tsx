import React from 'react';
import { TestResult } from '@/types/playground';

interface TestResultsProps {
  results: TestResult[];
  isRunning: boolean;
}

export const TestResults: React.FC<TestResultsProps> = ({ results, isRunning }) => {
  const passedTests = results.filter(result => result.passed);
  const failedTests = results.filter(result => !result.passed);
  const overallScore = results.length > 0 ? (passedTests.length / results.length) * 100 : 0;

  if (isRunning) {
    return (
      <div className="test-results">
        <h3>Test Results</h3>
        <div className="running">
          <div className="spinner" />
          <p>Running tests...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="test-results">
        <h3>Test Results</h3>
        <div className="no-tests">
          <p>No tests run yet. Click "Run Code" to execute tests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-results">
      <h3>Test Results</h3>
      
      <div className="test-summary">
        <div className="score">
          <span className="score-label">Score:</span>
          <span className={`score-value ${overallScore === 100 ? 'perfect' : overallScore >= 70 ? 'good' : 'poor'}`}>
            {overallScore.toFixed(0)}%
          </span>
        </div>
        <div className="test-counts">
          <span className="passed">✓ {passedTests.length} passed</span>
          <span className="failed">✗ {failedTests.length} failed</span>
        </div>
      </div>

      <div className="test-details">
        {results.map((result, index) => (
          <div key={result.testCaseId || index} className={`test-case ${result.passed ? 'passed' : 'failed'}`}>
            <div className="test-header">
              <span className="test-status">
                {result.passed ? '✓' : '✗'}
              </span>
              <span className="test-id">Test {index + 1}</span>
              <span className="test-time">{result.executionTime}ms</span>
            </div>
            
            {result.error && (
              <div className="test-error">
                <strong>Error:</strong> {result.error}
              </div>
            )}
            
            {result.output && (
              <div className="test-output">
                <strong>Output:</strong>
                <pre>{JSON.stringify(result.output, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};