# claudeHQ

> A fun pixel art office that visualizes Claude Code activity in real-time

Watch Claude work in a charming pixel art office environment! See a little character move around their workspace as Claude Code performs different tasks - coding at the desk, thinking at the whiteboard, accessing skills from the filing cabinet, and more.

## Features

- **Real-time visualization** of Claude Code activities
- **Pixel art animations** showing different work states
- **WebSocket-based** live updates
- **Demo mode** for testing without Claude integration
- **Manual controls** for triggering animations
- **Event logging** to track activity history
- **Automatic reconnection** if server disconnects

## What You'll See

The visualization shows a pixel art office with:
- **Desk & Computer**: Where Claude codes (Read, Edit, Write, Bash, Grep, Glob tools)
- **Whiteboard**: Where Claude thinks and plans
- **Filing Cabinet**: Where Claude accesses skills
- **Printer**: Prints completed tasks
- **Window**: Natural lighting for ambiance

Watch the character move between these areas based on Claude's activities!

## Requirements

- Node.js (v14 or higher)
- npm
- A modern web browser

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
# Normal mode (wait for events)
npm start

# Demo mode (auto-generates events every 4 seconds)
npm run demo
```

The server will start on:
- **Visualization**: http://localhost:8080
- **WebSocket**: ws://localhost:8081
- **Event API**: POST http://localhost:8080/event

### 3. Open the Visualization

Open your browser to http://localhost:8080 and watch the office come to life!

### 4. Test with Manual Events

In another terminal, run:

```bash
./test-events.sh
```

This will send a sequence of test events to see all the animations.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│ Claude Code │─────▶│   WebSocket  │─────▶│  Browser     │
│  (events)   │ POST │    Server    │  WS  │ claudeHQ UI  │
└─────────────┘      └──────────────┘      └──────────────┘
```

**Components:**
- **server.js**: WebSocket server that receives events and broadcasts to clients
- **claudeHQ.html**: Browser visualization with real-time WebSocket connection
- **claude-hook.sh**: Optional hook script for Claude Code integration
- **test-events.sh**: Manual event testing script

## Animation Mapping

| Claude Event | Animation | Location |
|-------------|-----------|----------|
| Tool: Read/Edit/Write | Typing at desk | Main desk |
| Thinking blocks | Sketching whiteboard | Whiteboard |
| Skill usage | Filing cabinet | Left side |
| Sub-agent spawn | New person walks in | Door |
| Task complete | Printer → delivery | Printer → desk |

## Integration with Claude Code

### Option 1: Manual Event Sending

Send events from any script:

```bash
curl -X POST http://localhost:8080/event \
  -H "Content-Type: application/json" \
  -d '{
    "type": "tool",
    "tool": "Read",
    "message": "Reading file.js",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'
```

### Option 2: Claude Code Hooks (Future)

The `claude-hook.sh` script template is provided for future Claude Code integration when hooks are supported.

### Option 3: Custom Monitoring

Create your own script to monitor Claude Code activity and POST events to the server.

## Event Format

All events should be JSON with this structure:

```json
{
  "type": "thinking",        // Event type: thinking, tool, agent, skill, complete
  "tool": "Read",            // Optional: specific tool name
  "message": "Reading...",   // Optional: descriptive message
  "timestamp": "2026-03-25T10:30:00Z"
}
```

**Event Types:**
- `thinking` - Character goes to whiteboard
- `tool` - Character works at desk (Read, Edit, Write, Bash, Grep, Glob)
- `agent` - New person walks in (sub-agent spawned)
- `skill` - Character accesses filing cabinet
- `complete` - Character prints and delivers report

## Next Steps

1. **Enhanced Visualizations**
   - More character animations
   - Different office themes
   - Sound effects
   - Multiple characters for parallel work

2. **Better Integration**
   - Direct Claude Code extension
   - Log file monitoring
   - Cloud sync for remote viewing

3. **Advanced Features**
   - Replay mode (time-lapse)
   - Statistics dashboard
   - Team mode (multiple developers)
   - Configurable office layouts

## Technical Notes

- WebSocket-based real-time updates
- Automatic reconnection on disconnect
- Falls back to manual mode if server unavailable
- Pixel art styling with CSS animations
- Event queue system for smooth transitions

## How It Works

1. **Server** (`server.js`) runs two services:
   - HTTP server on port 8080 (serves the HTML and receives events via POST)
   - WebSocket server on port 8081 (broadcasts events to connected clients)

2. **Client** (`claudeHQ.html`) connects via WebSocket and displays:
   - Animated pixel art office scene
   - Character that moves based on event types
   - Real-time event log
   - Manual control buttons for testing

3. **Events** are sent as JSON via HTTP POST and broadcast to all connected browsers in real-time

## Contributing

Contributions are welcome! Feel free to:
- Add new animations or office elements
- Improve the visualization
- Add sound effects
- Create new themes
- Enhance Claude Code integration

## License

MIT License - feel free to use and modify as you wish!
