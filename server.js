#!/usr/bin/env node

/**
 * claudeHQ WebSocket Server
 *
 * This server acts as a bridge between Claude Code events and the browser visualization.
 * It accepts events via HTTP POST and broadcasts them to all connected WebSocket clients.
 */

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const WS_PORT = 8081;

// Create HTTP server to serve the HTML file
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/event') {
        // Receive events via HTTP POST
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const event = JSON.parse(body);
                console.log('Event received:', event);
                broadcast(event);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error('Error parsing event:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (req.url === '/') {
        // Serve the HTML file
        const htmlPath = path.join(__dirname, 'claudeHQ.html');
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    // Send initial connection message
    ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to claudeHQ server',
        timestamp: new Date().toISOString()
    }));

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

function broadcast(event) {
    const message = JSON.stringify(event);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║         claudeHQ Server Running        ║
╚════════════════════════════════════════╝

📊 Visualization: http://localhost:${PORT}
🔌 WebSocket:     ws://localhost:${WS_PORT}
📡 Event POST:    http://localhost:${PORT}/event

Waiting for connections...
`);
});

// Demo mode - simulate events every few seconds for testing
if (process.argv.includes('--demo')) {
    console.log('🎮 Demo mode enabled - simulating events\n');

    const demoEvents = [
        { type: 'thinking', tool: 'thinking', message: 'Analyzing the problem...' },
        { type: 'tool', tool: 'Read', message: 'Reading file: main.js' },
        { type: 'tool', tool: 'Edit', message: 'Editing file at line 42' },
        { type: 'tool', tool: 'Grep', message: 'Searching for pattern' },
        { type: 'agent', message: 'Spawning sub-agent for research' },
        { type: 'skill', message: 'Skill: /commit invoked' },
        { type: 'tool', tool: 'Bash', message: 'Running tests...' },
        { type: 'complete', message: 'Task completed successfully' }
    ];

    let demoIndex = 0;
    setInterval(() => {
        const event = {
            ...demoEvents[demoIndex],
            timestamp: new Date().toISOString()
        };
        console.log('Demo event:', event.type);
        broadcast(event);
        demoIndex = (demoIndex + 1) % demoEvents.length;
    }, 4000);
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nShutting down gracefully...');
    wss.close();
    server.close();
    process.exit(0);
});
