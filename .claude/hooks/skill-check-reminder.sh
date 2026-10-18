#!/usr/bin/env bash
# UserPromptSubmit hook — injects skill-check reminder for task-related messages.
# Fires only when the user's message contains task keywords (specs/, US-, EPIC-, etc.)
# so it doesn't pollute conversational exchanges.
# Exit 0 always — this is a reminder, never a blocker.

set -euo pipefail

echo '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"⚡ Iron rule #1: первый tool call = Skill tool (frontmatter.skills роли). Потом skills_activated в артефакт."}}'
