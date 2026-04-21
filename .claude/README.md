# .claude/ — память и хуки проекта «Обиход»

Адаптированная под наш проект подмножество архитектуры памяти AI-агента
(edgelab guide). Не копируем всё — берём то, что реально снимает боль.

## Что внутри

```
.claude/
├── settings.json         # commit-able: конфиг хуков
├── settings.local.json   # local-only: permissions (уже был)
├── hooks/                # shell-скрипты принуждения (100% compliance vs CLAUDE.md 80%)
│   ├── protect-secrets.sh        — блок Write/Edit/Read/Bash для .env, *.key, credentials*
│   ├── block-dangerous-bash.sh   — блок rm -rf /, force push на main, reset --hard, DROP
│   ├── protect-immutable.sh      — блок запрещённых CMS и анти-TOV слов в site/ content/
│   └── session-bootstrap.sh      — на старте сессии выводит git-статус + handoff + уроки
├── memory/
│   ├── handoff.md        — что сделано / в работе / следующее (обновляю в конце сессии)
│   ├── learnings.md      — уроки из корректировок оператора (одна строка на урок)
│   └── logs/             — логи хуков (gitignored)
└── README.md             — этот файл
```

## Правило слоёв памяти

| Слой | Где | Когда обновляется | Когда читается |
|---|---|---|---|
| IDENTITY | `/CLAUDE.md` + `~/.claude/CLAUDE.md` | редко, с явного запроса | всегда в контексте |
| HANDOFF | `.claude/memory/handoff.md` | конец каждой сессии | SessionStart (автоматически) |
| LEARNINGS | `.claude/memory/learnings.md` | при корректировке оператора | SessionStart (последние 10 строк) |
| COLD | `contex/*.md` | при стратегических решениях | по запросу Claude |
| USER AUTO | `~/.claude/projects/-Users-a36-obikhod/memory/` | авто, глобально | глобально, всегда |

## Хуки: что делают и как обходить

- **protect-secrets.sh** — exit 2 на `.env`, `*.key`, `*.pem`, `credentials.json`,
  `secrets/`, `.ssh/`. Исключения: `*.example`, `*.sample`, `*.template`.
- **block-dangerous-bash.sh** — exit 2 на `rm -rf /`, `rm -rf /Users/a36/obikhod`,
  `git push --force` на `main/master`, `git reset --hard`, `git clean -f`, `DROP TABLE`,
  `--no-verify`, `--no-gpg-sign`.
- **protect-immutable.sh** — exit 2 если в `site/**`, `content/**`, `assets/**` появляются
  «Тильда/Bitrix/WordPress/Joomla/MODX» или анти-TOV («услуги населению», «имеем честь»,
  «от 1 000 ₽», «в кратчайшие сроки», «индивидуальный подход»).
  **Escape hatch:** добавь строку с `obikhod:ok` в контент (для осознанных цитат).
- **session-bootstrap.sh** — на старте сессии в контекст выводятся: git-статус,
  первые 40 строк handoff.md, последние 10 уроков из learnings.md.

## Как обновлять handoff

В конце сессии (или при /clear) перезаписать `.claude/memory/handoff.md` по секциям:
«Где мы сейчас», «В работе», «Следующий шаг», «Открытые вопросы».
Держать короче 50 строк — иначе bootstrap будет дуть контекст.

## Как добавить learning

При корректировке оператора (`не надо`, `не так`) или при подтверждённом удачном решении
(`да, отлично`, принятие нестандартного выбора) — добавить строку в `learnings.md`:
`- YYYY-MM-DD · тема · правило · **Why:** причина`.

## Против чего защищаемся

CLAUDE.md — рекомендация (~80% compliance). Хуки — принуждение (100%). Поэтому
immutable-блок (бренд, стек, TOV) и критичные вещи (секреты, rm -rf) — в хуках.

## graphify — knowledge graph проекта

Устанавливается через pipx (`pipx install graphifyy`). В проект встроены:

- **Slash-команда `/graphify .`** — собирает граф (AST + Claude-концепции) в `graphify-out/`.
  Первый прогон **стоит API-токенов** (docs/images/video идут через Claude). Запускается
  оператором или в новой сессии — skill подхватывается после рестарта.
- **PreToolUse hook на `Glob|Grep`** — если граф существует, Claude получает подсказку
  сначала прочитать `graphify-out/GRAPH_REPORT.md` вместо слепого grep.
- **Git-хуки** `.git/hooks/post-commit` и `post-checkout` — пересобирают граф по коду
  (AST only, без LLM → бесплатно) после каждого коммита и при смене ветки.
- **`.graphifyignore`** — исключения: node_modules, .next, dist, graphify-out,
  тесты, секреты. Без этого graphify проест API на node_modules.

### Выходные файлы (после первого прогона)

| Файл | Что | В git? |
|---|---|---|
| `graphify-out/graph.json` | персистентный граф для query/path/explain | да |
| `graphify-out/GRAPH_REPORT.md` | одностраничный отчёт для LLM-чтения | да |
| `graphify-out/graph.html` | интерактивная визуализация | да |
| `graphify-out/cache/` | SHA256-кэш, бьёт повторные API-вызовы | **нет** (gitignored) |

### Полезные команды после первого build

```bash
graphify query "как лендинг района связан с кейсами?"   # BFS по графу
graphify path "ServiceArborist" "DistrictRamenskoye"   # путь между концептами
graphify explain "PhotoEstimateForm"                   # объяснение узла
graphify update .                                      # пересчёт кода без LLM
graphify add https://<url>                             # втянуть внешний документ в граф
```

### Когда это даст отдачу

Сейчас проект маленький — граф будет тонкий. Реальная польза включится когда появится:
- 60+ programmatic посадочных (4 услуги × 15 районов)
- 10+ кейсов с фото и до/после
- Блог на 20+ статей
- Payload-коллекции (Services × Districts × LandingPages)

Тогда `graphify query` станет дешевле, чем кормить Claude всем корпусом.
