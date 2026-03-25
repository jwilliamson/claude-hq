#!/bin/bash

# Claude Code Hook Script
# This script captures Claude Code events and sends them to claudeHQ server
#
# To install this hook, add to your Claude Code settings.json:
# "hooks": {
#   "tool_use": "~/.claude/hooks/claude-hook.sh tool {{tool_name}} {{status}}"
# }

SERVER="http://localhost:8080/event"

# Function to send event to server
send_event() {
    local event_type=$1
    local tool=$2
    local message=$3

    curl -s -X POST "$SERVER" \
        -H "Content-Type: application/json" \
        -d "{
            \"type\": \"$event_type\",
            \"tool\": \"$tool\",
            \"message\": \"$message\",
            \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
        }" > /dev/null 2>&1 &
}

# Parse command line arguments
ACTION=$1
TOOL=$2
STATUS=$3

case $ACTION in
    tool)
        # Map tool names to event types
        case $TOOL in
            Read|Edit|Write|NotebookEdit)
                send_event "tool" "$TOOL" "Using $TOOL tool"
                ;;
            Bash)
                send_event "tool" "Bash" "Executing command"
                ;;
            Grep|Glob)
                send_event "tool" "$TOOL" "Searching codebase"
                ;;
            Agent)
                send_event "agent" "Agent" "Spawning sub-agent"
                ;;
            Skill)
                send_event "skill" "Skill" "Running skill"
                ;;
            TaskCreate|TaskUpdate)
                send_event "task" "$TOOL" "Managing tasks"
                ;;
            *)
                send_event "tool" "$TOOL" "Using $TOOL"
                ;;
        esac
        ;;
    thinking)
        send_event "thinking" "thinking" "Analyzing..."
        ;;
    complete)
        send_event "complete" "complete" "Task finished"
        ;;
esac

exit 0
