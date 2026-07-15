# Zasady tego projektu

- **Zawsze merguj PR-y do brancha domyślnego (`claude/esperanta-aventuro-game-eepx44`), żeby zmiany wyszły na GitHub Pages.** Nie zostawiaj gotowych PR-ów w stanie draft/open czekających na ręczne zatwierdzenie — po zakończeniu pracy i przejściu testów PR ma być oznaczony jako gotowy i od razu zmergowany, chyba że użytkownik wyraźnie poprosi o wstrzymanie się z merge.
- **Jedno źródło prawdy.** `claude/esperanta-aventuro-game-eepx44` to JEDYNY branch, z którego wolno deployować na GitHub Pages (patrz `.github/workflows/pages.yml`, filtr `branches:`). Nie zmieniaj tego filtra na "każdy push" ani nie dodawaj innych gałęzi do niego — inaczej rozbieżne linie rozwoju znowu zaczną sobie nawzajem nadpisywać żywą stronę (tak się stało 2026-07-07: gałąź z 3 strefami nadpisała gałąź z 6 strefami). Jeśli gdzieś powstanie inny branch z niezależną pracą nad grą, scal go do tego jednego brancha zamiast zostawiać osobno wystawiony na deploy.

## Delegation

For small mechanical jobs — renames, simple lookups, one-line fixes, formatting — hand the work to a subagent on a smaller, cheaper model instead of doing it yourself, and review its work before it lands. Save your own effort for the thinking: planning, judgment, and anything ambiguous.

For heavy, exploratory work — reading lots of files, searching the codebase, digging through logs or docs — use a subagent instead of doing it in the main thread. Let it do the reading in its own context and report back just what it found, so the main conversation stays lean.
