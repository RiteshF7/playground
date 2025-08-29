# Playground Test Wrapper

This directory contains a test wrapper for the PlaygroundContainer component that allows you to navigate through all available playground challenges.

## Components

### PlaygroundTestWrapper
A comprehensive test wrapper that provides:
- **Navigation Controls**: Previous/Next buttons
- **Challenge Selector**: Dropdown to jump to any challenge
- **Quick Navigation**: Grid of numbered buttons for quick access
- **Challenge Information**: Displays title, description, and metadata
- **Progress Indicator**: Shows current challenge number

### TestPage
A simple page component that renders the PlaygroundTestWrapper.

## Usage

### Option 1: Direct Import
```tsx
import { PlaygroundTestWrapper } from './playground/components/playground-container/PlaygroundTestWrapper';

function App() {
  return <PlaygroundTestWrapper />;
}
```

### Option 2: Using TestPage
```tsx
import TestPage from './playground/components/playground-container/TestPage';

function App() {
  return <TestPage />;
}
```

## Features

### Navigation
- **Previous/Next Buttons**: Navigate sequentially through challenges
- **Dropdown Selector**: Jump directly to any challenge (1-18)
- **Quick Navigation Grid**: Click any numbered button to go to that challenge
- **Disabled States**: Buttons are disabled when at first/last challenge

### Challenge Information
- **Title**: Challenge name
- **Description**: Detailed explanation
- **Metadata**: Chapter ID, type, and toolbox configuration
- **Progress**: Current challenge number and total count

### Responsive Design
- Clean, modern UI with Tailwind CSS
- Responsive grid layout for quick navigation
- Proper spacing and visual hierarchy

## Available Challenges

The wrapper cycles through all 18 challenges in `PlaygroundContainerContent`:

1. **Your First Pixel Move** - Basic left movement
2. **Pixels in Motion: Up and Down** - Vertical movement
3. **Downward Bound** - Down movement
4. **Triple Jump Right** - Multiple right movements
5. **Blink Repeat** - LED blinking with loops
6. **The L-Shape Challenge** - Creating L-shaped patterns
7. **L-Shape with Loops** - L-shape using loops
8. **Join the Dots** - Connecting pixels
9. **Perfect Square** - Creating square patterns
10. **Connect the Squares** - Complex square connections
11. **Light It Up!** - Basic LED control
12. **Precise Motion Control** - Servo motor control
13. **Light and Motion** - Combined LED and servo
14. **Smart Lighting** - Conditional LED control
15. **Responsive Blinking** - Sensor-based blinking
16. **Create Your Light Show** - Creative LED patterns
17. **Pixel Race Challenge** - Multi-pixel coordination
18. **Smart Environment Monitor** - Advanced sensor integration

## Testing

This wrapper is perfect for:
- Testing the PlaygroundContainer component
- Verifying all challenges render correctly
- Checking editor configurations
- Testing hardware simulation setups
- Validating the complete playground experience
