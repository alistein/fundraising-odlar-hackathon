# Fundraising — OYU CyberAI Hackathon 2026

Verified medical fundraising MVP for Azerbaijan. Build day: 17 Nov 2026, submission 22:00–22:30. Demo & pitch: 18 Nov.

- `wiki/` — LLM-maintained knowledge base (Karpathy LLM-wiki pattern). **Read `wiki/index.md` first** for any product, scope, or hackathon question.
- `product/` — the MVP code.

## Wiki schema

Three layers:

1. **Raw sources** — `wiki/raw/`. Immutable. Read, never edit. Source of truth.
2. **Wiki** — everything else under `wiki/`. Claude owns and maintains it; humans read it.
3. **Schema** — this file. Refine it as conventions change.

### Layout

```
wiki/
  index.md          catalog of every page, one line each — update on every change
  log.md            append-only chronological record
  raw/              original docs (PDFs, screenshots, exports)
  sources/          one summary page per raw source
  product/          what we are building: overview, flow, scope, threat model, decisions
  hackathon/        event facts: schedule, judging, pitch format, rules
  context/          Azerbaijan-specific facts: regulation, fraud cases, market
  open-questions.md unresolved items, with owner/status
```

### Page conventions

- Filenames: `kebab-case.md`. Links: Obsidian wikilinks `[[page-name]]` (filenames are unique across the wiki).
- Every page starts with a one-line summary under the H1, and ends with a `Sources:` line linking the `sources/` pages it draws on.
- Keep pages short and factual. One topic per page. Prefer tables for structured facts.
- Mark anything unverified with **(unverified)**; mark team decisions with the date.
- Write in English; keep Azerbaijani terms in original where they are proper names or UI copy.

### Operations

**Ingest** (user adds a doc or says "ingest X"):
1. Copy the file to `wiki/raw/` (kebab-case name).
2. Write `wiki/sources/<name>.md`: what it is, key takeaways, what it changes.
3. Update or create every affected page in `product/`, `hackathon/`, `context/`; note contradictions with existing pages explicitly rather than silently overwriting.
4. Move answered items out of `open-questions.md`; add new ones.
5. Update `index.md`.
6. Append to `log.md`.

**Query**: read `index.md`, open relevant pages, answer with page references. If the answer is a reusable synthesis, file it as a new page and index it.

**Decision** (team decides something in chat — stack, scope cut, name): record in `wiki/product/decisions.md` with date, update affected pages, log it.

**Lint** (on request): contradictions, stale claims, orphan pages, missing pages for mentioned concepts, missing cross-links.

### Log format

```
## [YYYY-MM-DD] ingest|query|decision|lint | Title
- what changed, in bullets
```

`grep "^## \[" wiki/log.md | tail -5` shows recent activity.

## Hard constraints (from hackathon rules)

- All payments are test payments. No real clinic, patient, or bank system is touched.
- No real personal or medical data in demo data — synthetic only.

## Product app (`product/`)

Next.js 16 — read `product/AGENTS.md` before writing Next code (bundled docs in `node_modules/next/dist/docs/`). Architecture and API status: `wiki/product/architecture.md`.

```
pnpm dev          # needs .env.local (see .env.example)
pnpm db:push      # apply src/db/schema.ts to the database
pnpm db:seed      # reset to synthetic demo data
pnpm typecheck && pnpm lint
```

Backend is API route handlers only (no server actions). Auth is mocked. Never UPDATE/DELETE `ledger_entries`.

## UI rules (strict) — full detail in `wiki/product/design-system.md`

- Build with shadcn/ui components from `product/src/components/ui/`; add new ones with `pnpm dlx shadcn@latest add <name>`.
- Colours, radii, shadows and easing come only from `product/src/styles/tokens.css` (GoFundMe-derived). No raw hex, no default Tailwind palette colours.
- Icons: Hugeicons only, through `components/icon.tsx`.
- Text: no taglines, helper text or secondary labels. If a screen needs them, fix the layout.
- Interaction: load the `apple-design` skill before UI work; press feedback on pointer-down, toast for every action, `transform`/`opacity` only.
- Logo: the Safefund mascot (`components/mascot.tsx`). Call `setMascotMood("happy"|"alert")` on success/failure of user actions. Kit and rules: `brand/logo/kit/README.md`.
- Pitch visuals: use the `stageshow` skill and the same tokens.
- Check UI changes in the browser at desktop and phone width.
