import React, { useEffect, useRef } from 'react';

interface CodeOutputProps {
  output: string[];
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ output }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  if (output.length === 0) {
    return (
      <div className="code-output">
        <h3>Output</h3>
        <div className="no-output">
          <p>No output yet. Run your code to see results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="code-output">
      <h3>Output</h3>
      <div className="output-container" ref={outputRef}>
        {output.map((line, index) => (
          <div key={index} className="output-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};