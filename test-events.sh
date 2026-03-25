#!/bin/bash

# Test script to send events to claudeHQ server
# Usage: ./test-events.sh

SERVER="http://localhost:8080/event"

send_event() {
    local type=$1
    local tool=$2
    local message=$3

    echo "Sending: $type - $message"
    curl -s -X POST "$SERVER" \
        -H "Content-Type: application/json" \
        -d "{
            \"type\": \"$type\",
            \"tool\": \"$tool\",
            \"message\": \"$message\",
            \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
        }"
    echo
    sleep 2
}

echo "Testing claudeHQ Event System"
echo "=============================="
echo

send_event "thinking" "thinking" "Analyzing the problem..."
send_event "tool" "Read" "Reading main.js"
send_event "tool" "Edit" "Editing function at line 42"
send_event "tool" "Grep" "Searching for pattern"
send_event "agent" "Agent" "Spawning research agent"
send_event "skill" "Skill" "Running /commit skill"
send_event "tool" "Bash" "Running test suite"
send_event "complete" "complete" "All tests passed!"

echo
echo "Test sequence complete!"
