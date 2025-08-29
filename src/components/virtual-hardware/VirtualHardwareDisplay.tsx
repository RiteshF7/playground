import React, { useState, useEffect } from 'react';
import { VirtualHardwareManager } from '@/core/virtual-hardware/manager';
import { PlaygroundConfig } from '@/types/playground';
import { HardwareComponent } from '@/types/hardware';
import { ComponentState } from '@/types/hardware';

interface VirtualHardwareDisplayProps {
  virtualHardware: VirtualHardwareManager | null;
  config: PlaygroundConfig;
}

export const VirtualHardwareDisplay: React.FC<VirtualHardwareDisplayProps> = ({
  virtualHardware,
  config
}) => {
  const [componentStates, setComponentStates] = useState<Map<string, ComponentState>>(new Map());

  useEffect(() => {
    if (!virtualHardware) return;

    const handleComponentUpdate = (event: CustomEvent) => {
      const { componentId, state } = event.detail;
      setComponentStates(prev => {
        const newStates = new Map(prev);
        const existingState = newStates.get(componentId);
        if (existingState) {
          existingState.state = state;
          existingState.lastUpdate = Date.now();
        }
        return newStates;
      });
    };

    window.addEventListener('component-state-update', handleComponentUpdate as EventListener);
    
    // Initialize component states
    setComponentStates(virtualHardware.getAllComponentStates());

    return () => {
      window.removeEventListener('component-state-update', handleComponentUpdate as EventListener);
    };
  }, [virtualHardware]);

  const renderComponent = (component: HardwareComponent) => {
    const state = componentStates.get(component.id);
    if (!state) return null;

    switch (component.type) {
      case 'led':
        return <LEDComponent component={component} state={state.state} />;
      case 'neopixel':
        return <NeoPixelComponent component={component} state={state.state} />;
      case 'servo':
        return <ServoComponent component={component} state={state.state} />;
      case 'buzzer':
        return <BuzzerComponent component={component} state={state.state} />;
      case 'button':
        return <ButtonComponent component={component} state={state.state} />;
      case 'sensor':
        return <SensorComponent component={component} state={state.state} />;
      default:
        return <GenericComponent component={component} state={state.state} />;
    }
  };

  return (
    <div className="virtual-hardware-display">
      <h3>Virtual Hardware</h3>
      <div className="hardware-components">
        {config.components.map(component => (
          <div key={component.id} className="hardware-component">
            <h4>{component.name}</h4>
            {renderComponent(component)}
          </div>
        ))}
      </div>
    </div>
  );
};

const LEDComponent: React.FC<{ component: HardwareComponent; state: any }> = ({ component, state }) => {
  const color = component.properties.find((p: any) => p.name === 'color')?.value || 'red';
  const brightness = state.brightness || 0;
  const isOn = state.isOn || false;

  return (
    <div className="led-component">
      <div 
        className="led-visual"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isOn ? color : '#333',
          opacity: isOn ? brightness / 255 : 0.3,
          border: '2px solid #000',
          transition: 'all 0.3s ease'
        }}
      />
      <div className="led-info">
        <p>Pin: {component.pins[0]?.number}</p>
        <p>State: {isOn ? 'ON' : 'OFF'}</p>
        <p>Brightness: {brightness}</p>
      </div>
    </div>
  );
};

const NeoPixelComponent: React.FC<{ component: HardwareComponent; state: any }> = ({ component, state }) => {
  const pixelCount = component.properties.find((p: any) => p.name === 'pixelCount')?.value || 8;
  const pixels = state.pixels || Array(pixelCount).fill({ r: 0, g: 0, b: 0 });

  return (
    <div className="neopixel-component">
      <div className="neopixel-strip">
        {pixels.map((pixel: any, index: number) => (
          <div
            key={index}
            className="neopixel-pixel"
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
              border: '1px solid #000',
              display: 'inline-block',
              margin: '1px'
            }}
          />
        ))}
      </div>
      <div className="neopixel-info">
        <p>Pin: {component.pins[0]?.number}</p>
        <p>Pixels: {pixelCount}</p>
      </div>
    </div>
  );
};

const ServoComponent: React.FC<{ component: HardwareComponent; state: any }> = ({ component, state }) => {
  const angle = state.angle || 0;

  return (
    <div className="servo-component">
      <div className="servo-visual">
        <div 
          className="servo-arm"
          style={{
            width: '4px',
            height: '30px',
            backgroundColor: '#000',
            transformOrigin: 'bottom center',
            transform: `rotate(${angle - 90}deg)`,
            transition: 'transform 0.5s ease',
            position: 'relative',
            left: '18px',
            top: '10px'
          }}
        />
        <div 
          className="servo-body"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#666',
            border: '2px solid #000',
            borderRadius: '4px'
          }}
        />
      </div>
      <div className="servo-info">
        <p>Pin: {component.pins[0]?.number}</p>
        <p>Angle: {angle}°</p>
      </div>
    </div>
  );
};

const BuzzerComponent: React.FC<{ component: HardwareComponent; state: any }> = ({ component, state }) => {
  const isPlaying = state.isPlaying || false;
  const frequency = state.frequency || 0;

  return (
    <div className="buzzer-component">
      <div 
        className="buzzer-visual"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isPlaying ? '#ff6b6b' : '#ccc',
          border: '2px solid #000',
          transition: 'all 0.3s ease',
          animation: isPlaying ? 'buzzer-pulse 0.5s infinite' : 'none'
        }}
      />
      <div className="buzzer-info">
        <p>Pin: {component.pins[0]?.number}</p>
        <p>Playing: {isPlaying ? 'YES' : 'NO'}</p>
        <p>Frequency: {frequency}Hz</p>
      </div>
    </div>
  );
};

const ButtonComponent: React.FC<{ component: HardwareComponent; state: any }> = ({ component, state }) => {
  const isPressed = state.isPressed || false;

  return (
    <div className="button-component">
      <div 
        className="button-visual"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: isPressed ? '#4CAF50' : '#f44336',
          border: '2px solid #000',
          transition: 'all 0.1s ease',
          transform: isPressed ? 'scale(0.95)' : 'scale(1)'
        }}
      />
      <div className="button-info">
        <p>Pin: {component.pins[0]?.number}</p>
        <p>Pressed: {isPressed ? 'YES' : 'NO'}</p>
      </div>
    </div>
  );
};

const SensorComponent: React.FC<{ component: HardwareComponent; state: any }> = ({ component, state }) => {
  const value = state.value || 0;

  return (
    <div className="sensor-component">
      <div className="sensor-visual">
        <div 
          className="sensor-bar"
          style={{
            width: '40px',
            height: '100px',
            backgroundColor: '#ddd',
            border: '2px solid #000',
            position: 'relative'
          }}
        >
          <div 
            className="sensor-fill"
            style={{
              width: '100%',
              height: `${(value / 1023) * 100}%`,
              backgroundColor: '#4CAF50',
              position: 'absolute',
              bottom: 0,
              transition: 'height 0.3s ease'
            }}
          />
        </div>
      </div>
      <div className="sensor-info">
        <p>Pin: {component.pins[0]?.number}</p>
        <p>Value: {value}</p>
      </div>
    </div>
  );
};

const GenericComponent: React.FC<{ component: HardwareComponent; state: any }> = ({ component, state }) => {
  return (
    <div className="generic-component">
      <div className="generic-visual">
        <div 
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#999',
            border: '2px solid #000',
            borderRadius: '4px'
          }}
        />
      </div>
      <div className="generic-info">
        <p>Type: {component.type}</p>
        <p>Pin: {component.pins[0]?.number}</p>
        <p>State: {JSON.stringify(state)}</p>
      </div>
    </div>
  );
};