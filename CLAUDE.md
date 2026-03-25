# claudeHQ - Project Guide for Claude

## Project Overview

claudeHQ is a real-time pixel art visualization that shows Claude Code's activity in a charming office environment. It's a WebSocket-based system that displays a character moving around an office (desk, whiteboard, filing cabinet, printer) based on different types of events.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Events    │─────▶│   WebSocket  │─────▶│  Browser     │
│   (POST)    │ HTTP │    Server    │  WS  │ claudeHQ UI  │
└─────────────┘      └──────────────┘      └──────────────┘
```

### Core Components

1. **server.js** - Node.js server with two responsibilities:
   - HTTP server (port 8080): Serves HTML and receives events via POST
   - WebSocket server (port 8081): Broadcasts events to connected browsers

2. **claudeHQ.html** - Single-page visualization:
   - Pure HTML/CSS/JavaScript (no build step)
   - Pixel art office scene with CSS animations
   - WebSocket client for real-time updates
   - Manual control buttons for testing

3. **Supporting files**:
   - `test-events.sh` - Bash script to send test event sequences
   - `claude-hook.sh` - Template for future Claude Code integration
   - `event-monitor.js` - Event monitoring utility

## Running the Project

### Start the server
```bash
npm start              # Normal mode (waits for events)
npm run demo           # Demo mode (auto-generates events every 4s)
```

### View the visualization
Open http://localhost:8080 in a browser

### Send test events
```bash
./test-events.sh       # Sends sequence of different event types
```

### Send individual events
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

## Event System

### Event Format
All events are JSON with this structure:
```json
{
  "type": "thinking|tool|agent|skill|complete|task",
  "tool": "Read|Edit|Write|Bash|Grep|Glob|Agent|Skill",
  "message": "Optional description",
  "timestamp": "ISO 8601 timestamp"
}
```

### Event Type Mapping
- `thinking` → Character goes to whiteboard, draws diagrams
- `tool` → Character works at desk (Read, Edit, Write, Bash, Grep, Glob)
- `agent` → New sub-agent character walks in from left
- `skill` → Character accesses filing cabinet
- `complete` → Character goes to printer, paper flies to desk
- `task` → Logged but no specific animation

## Development Guidelines

### Code Style
- This is a simple, standalone project - avoid over-engineering
- No build tools or frameworks (keep it pure HTML/CSS/JS)
- Use vanilla Node.js (no Express or other frameworks)
- Pixel art aesthetics with CSS animations

### Adding New Animations
1. Add CSS keyframes in `<style>` section of claudeHQ.html
2. Create new character position class (e.g., `.character.at-newlocation`)
3. Add case in `simulateEvent()` function
4. Update `handleServerEvent()` to map event types to animations

### Adding New Event Types
1. Define event type in server.js demo events (if using demo mode)
2. Add handling in `handleServerEvent()` in claudeHQ.html
3. Map to existing or new animation
4. Update README.md documentation

### Testing
- Use demo mode for rapid iteration: `npm run demo`
- Use manual buttons in the UI to test individual animations
- Use `test-events.sh` for full sequence testing
- Test WebSocket reconnection by stopping/starting server

## File Purposes

- **server.js** - Core server logic, don't add complexity
- **claudeHQ.html** - All frontend code in one file, keep it that way
- **package.json** - Minimal dependencies (only `ws` package)
- **.gitignore** - Excludes node_modules, .claude settings, OS files
- **README.md** - User-facing documentation
- **CLAUDE.md** - This file, for Claude Code's understanding
- **test-events.sh** - Manual testing tool, keep simple
- **claude-hook.sh** - Template only, not currently functional

## Important Notes

### What NOT to do
- Don't add a build system or transpilation
- Don't add frameworks (React, Vue, etc.)
- Don't split the HTML into multiple files
- Don't add a database or persistence layer
- Don't add authentication or security layers (it's localhost only)
- Don't commit node_modules or .claude/settings.local.json

### Claude Code Hook Integration

Users can set up automatic event sending via hooks. The README contains prompts for users to configure this themselves. **Do not automatically add hooks** unless the user explicitly asks.

### Hook Setup Prompt (in README)
Users give Claude this prompt to set up hooks:
```
Add hooks to my Claude Code settings that POST to http://localhost:8080/event
when Claude uses tools. For each tool use, send a JSON event with type, tool
name, and timestamp. Use PreToolUse hook, curl with -s flag, and run in
background with async:true to avoid blocking Claude.
```

### Hook Removal Prompt (in README)
```
Remove the claudeHQ hooks from my Claude Code settings. Look for the PreToolUse
hook that posts to http://localhost:8080/event and remove it from settings.json.
```

## Current Limitations
- Single browser client only (no multi-user state)
- No event history or replay functionality
- Animations don't queue (rapid events may overlap)
- No "thinking" events (Claude Code doesn't have hooks for reasoning phases)

### Future Ideas (not implemented)
- Direct Claude Code hook integration
- Multiple characters for parallel work
- Event replay/time-lapse mode
- Statistics dashboard
- Different office themes
- Sound effects
- Multi-user/team mode

## Ports Used

- **8080** - HTTP (serves HTML, receives POST events)
- **8081** - WebSocket (broadcasts to connected browsers)

If these ports are in use, modify the constants at top of server.js.

## Dependencies

- **Node.js** (v14+)
- **ws** package (WebSocket library)
- No other runtime dependencies

## Git Workflow

- Single main branch
- Commits co-authored with Claude
- No hooks or pre-commit checks configured
- Push to https://github.com/jwilliamson/claude-hq

## Debugging

### Server won't start
- Check if ports 8080/8081 are in use: `lsof -ti:8080 -ti:8081`
- Kill processes: `kill $(lsof -ti:8080 -ti:8081)`

### Browser not updating
- Check browser console for WebSocket errors
- Verify server is running
- Refresh the page to reconnect
- Check that you're sending valid JSON to /event endpoint

### Events not showing
- Verify event JSON format is correct
- Check server console for parsing errors
- Ensure timestamp is valid ISO 8601 format
- Test with demo mode first to verify UI works

## Commands Reference

```bash
# Development
npm install          # Install dependencies
npm start            # Start server (normal mode)
npm run demo         # Start server (demo mode with auto-events)

# Testing
./test-events.sh     # Send test event sequence
node server.js       # Start without npm (same as npm start)

# Debugging
lsof -ti:8080        # Check what's using port 8080
lsof -ti:8081        # Check what's using port 8081
curl -X POST ...     # Send manual event (see examples above)

# Git
git status           # Check working tree
git add <files>      # Stage files
git commit -m "..."  # Create commit
git push             # Push to GitHub
```
