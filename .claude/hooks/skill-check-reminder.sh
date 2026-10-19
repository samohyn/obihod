#!/usr/bin/env bash
# UserPromptSubmit hook — injects the task-cycle reminder (contex/09_product_plan.md) for task-related messages.
# Fires only when the user's message contains task keywords, so it doesn't pollute conversational exchanges.
# Exit 0 always — this is a reminder, never a blocker.

set -euo pipefail

echo '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Цикл задачи (contex/09_product_plan.md): 1 Perplexity → 2 brand-guide → 3 ветка → 4 автопроверки → 5 показ владельцу → 6 приёмка → 7 деплой. Правила: ИИ клиенту не упоминается; фото без реального — подпись «Иллюстрация»; индексация только по команде владельца. Статус задачи — в contex/09_product_plan-status.md."}}'
