#!/usr/bin/env node

/**
 * claudeHQ Event Monitor
 *
 * This script monitors Claude Code activity and sends events to the visualization.
 *
 * Usage:
 *   1. Start a simple HTTP server: python3 -m http.server 8000
 *   2. Open claudeHQ.html in browser
 *   3. Run this script to simulate events (or pipe Claude logs to it)
 *
 * Future: Can be enhanced to:
 *   - Monitor actual Claude Code logs
 *   - Use WebSockets for real-time updates
 *   - Parse structured event data
 */

const readline = require('readline');

// Event patterns to detect from logs
const patterns = {
    thinking: /thinking|analyzing|considering/i,
    coding: /tool.*read|tool.*write|tool.*edit/i,
    skill: /skill|\/\w+/i,
    subagent: /agent.*spawn|parallel/i,
    complete: /complete|done|finished/i,
    bash: /tool.*bash|executing/i,
};

// Simple event classifier
function classifyEvent(line) {
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(line)) {
            return type;
        }
    }
    return null;
}

// Read from stdin
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log('claudeHQ Event Monitor started');
console.log('Paste Claude Code output or pipe logs here...\n');

rl.on('line', (line) => {
    const eventType = classifyEvent(line);

    if (eventType) {
        const timestamp = new Date().toISOString();
        const event = {
            type: eventType,
            message: line.substring(0, 80),
            timestamp
        };

        // Output as JSON for easy parsing
        console.log(JSON.stringify(event));
    }
});

// Example: Simulate some events for testing
if (process.argv.includes('--demo')) {
    console.log('Running demo mode...\n');

    const demoEvents = [
        { type: 'coding', message: 'Tool: Read - Reading main.js' },
        { type: 'thinking', message: 'Thinking about the best approach...' },
        { type: 'coding', message: 'Tool: Edit - Modifying function at line 42' },
        { type: 'subagent', message: 'Agent spawned for parallel task' },
        { type: 'skill', message: 'Skill: /commit invoked' },
        { type: 'complete', message: 'Task completed successfully' },
    ];

    let index = 0;
    const interval = setInterval(() => {
        if (index >= demoEvents.length) {
            clearInterval(interval);
            console.log('\nDemo complete!');
            return;
        }

        const event = {
            ...demoEvents[index],
            timestamp: new Date().toISOString()
        };

        console.log(JSON.stringify(event));
        index++;
    }, 2000);
}
