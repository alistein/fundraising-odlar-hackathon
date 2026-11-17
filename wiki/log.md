# Log

Append-only. Format: `## [YYYY-MM-DD] ingest|query|decision|lint | Title`.

## [2026-11-17] decision | Wiki initialised
- Set up Karpathy LLM-wiki structure under `wiki/`; schema in root `CLAUDE.md`.
- Recorded: MVP localized for Azerbaijan.

## [2026-11-17] ingest | Idea brief — Verified medical fundraising
- Added `raw/idea-brief.pdf`, `sources/idea-brief.md`.
- Created product-overview, product-flow, threat-model, mvp-scope, swot, decisions.
- Created context pages card-transfer-limits, fraud-cases.
- Created open-questions with the brief's four questions.

## [2026-11-17] ingest | OYU CyberAI Hackathon 2026 programme
- Added `raw/hackathon-program.pdf`, `sources/hackathon-program.md`.
- Created schedule, judging-criteria, pitch, tracks, rules.
- Cross-linked judging criteria to threat-model and mvp-scope; added submission checklist.
- Added build-blocking questions (name, stack, track, detection approach) to open-questions.
- Noted: opening ceremony 11:00–11:30 overlaps Sprint I.

## [2026-11-17] decision | Stack chosen and app scaffolded
- Recorded stack and mock-auth decisions in decisions.
- Added architecture page (stack, layout, API status, security mechanisms).
- Resolved two open questions (stack, tamper-evident ledger); added deployment as an open item.
- Added progress note to mvp-scope.

## [2026-11-17] decision | UI priority, design tokens, skills
- Added design-system page: tokens, text rule, motion rules, skills.
- Recorded decision; linked from architecture, pitch and index.
- Installed `stageshow` skill at project level; Emil Kowalski skills were already installed globally.

## [2026-11-17] decision | UI rebuilt on shadcn + GoFundMe tokens + Hugeicons
- Team rejected the first UI pass; deleted it and rebuilt every page.
- Rewrote design-system; updated decisions, architecture, pitch, index and CLAUDE.md UI rules.

## [2026-11-17] decision | Name: Safefund; logo concepts
- Recorded name decision; resolved the name open question; added clash check and logo pick as open items.
- New branding page with three logo concepts (files in brand/logo/concepts/).

## [2026-11-17] decision | Logo kit and animated mascot
- Chose the shield-face mascot; built the kit in brand/logo/kit and wired it into the app (header, favicon, moods).
- Rewrote branding; updated decisions, open-questions, design-system, index and CLAUDE.md.

## [2026-11-17] decision | Font: Nunito Sans
- Replaced Inter/system font in the app and the logo wordmark; updated design-system, branding, decisions and the kit README.

## [2026-11-17] decision | Avatars: DiceBear Lorelei
- Added avatars to user menu, donor list and ledger; recorded in design-system and decisions.

## [2026-11-17] decision | Deployed to Vercel
- Vercel project, Neon database, private Blob store, encryption key; GitHub auto-deploy. Recorded in architecture and open-questions.

## [2026-11-17] decision | Production URL made public
- safefund.vercel.app opened to the public; previews stay protected. Submission checklist updated.

## [2026-11-17] decision | Local dev on production keys
- Rotated FILE_ENCRYPTION_KEY to one pullable key for all environments; pulled env into product/.env.local; updated architecture, decisions, CLAUDE.md.

## [2026-11-17] decision | Pivot: checker-first
- Scam and forgery checker becomes the product; verified-campaign platform becomes the registry behind it. Proposed by Emil, team confirmation pending.
- New page scam-checker (inputs, pipeline, verdicts, planned tables, demo data).
- Rewrote product-overview, product-flow, threat-model (added "scam appeal", status column), mvp-scope (sprints II–III re-planned), pitch, tracks.
- Updated judging-criteria, swot, architecture (planned changes), decisions, open-questions, index.
- Wiki only: no code changed; checker, clone detection and document check are still unbuilt.

## [2026-11-17] ingest | Market, fraud and legal research
- Technical work handed to a teammate; focus moves to business, market and GTM for the pitch and jury Q&A.
- New sources: market-research-2026-11-17 (web research), icnl-crowdfunding-2018 (PDF in raw/).
- New pages: fraud-statistics, fundraising-law, market-azerbaijan, market-global, business-model, go-to-market, jury-qa.
- Rewrote fraud-cases (Seidova case details, 5 more local cases, regional cases); updated card-transfer-limits (confirmed by CBA Governor; stated purpose contradicts idea brief), swot, open-questions, index.
- Business model and GTM are proposals pending team confirmation; local sizing is a team estimate.

## [2026-11-17] decision | Linear team SafeFund is the default
- Linear MCP configured in root `.mcp.json`; workspace "Z" has teams SafeFund (`SAFEFUN`) and Kintalks (`KIN`, unrelated).
- New page linear: SafeFund is the default team for agents; Kintalks is ignored.
- Updated decisions and index.

## [2026-11-17] decision | Post-link checker, synthetic posts only
- Linear: SAFEFUN-5 (AI features) and SAFEFUN-6 (post-link checker, blocked by SAFEFUN-5), both assigned to Emil, in Azerbaijani.
- Post-link checker: Instagram / LinkedIn link in, verdict out; demo uses only our own synthetic posts, real fetching is roadmap.
- Updated scam-checker (Link input), mvp-scope (out of scope note), decisions.

## [2026-11-17] decision | Roadmap: Tool, then Platform
- MVP = the Tool: paste an Instagram / LinkedIn post link into the Checker, see if the campaign is legit (built by a teammate).
- Then Platform (full product); then FIN code / myGov identity integration (not MVP, Azerbaijan only); clinic verification is the last roadmap item, not MVP.
- New page roadmap. Updated decisions, product-overview, mvp-scope, scam-checker, product-flow, go-to-market (phase order), business-model, market-global, jury-qa, swot, open-questions, index.

## [2026-11-17] decision | Platform is half-built in the MVP
- Correction: the Platform is not absent from the MVP; a half-built version (campaign pages, test donations, ledger) ships with it. Full Platform later.
- Updated roadmap, decisions, product-overview, mvp-scope, jury-qa, open-questions.

## [2026-11-17] decision | Mock myGov sandbox as gate 2
- MVP now has two gates: AI checker (SAFEFUN-5), then identity check against a mock myGov sandbox (SAFEFUN-8, unassigned, blocked by SAFEFUN-5).
- Contradicts the earlier "myGov not in MVP": real integration stays post-MVP, the mock is in.
- Also created SAFEFUN-7 (home page: checker section + category grid, unassigned).
- Updated roadmap, mvp-scope, decisions.

## [2026-11-17] query | Deck text
- New page deck: on-screen text and timed speaker script for Problem, Solution, Demo, Target user, Impact, Future; demo cue card with fallbacks; Q&A backup slides A1–A5.
- Linked from pitch and index; pitch language added to open-questions.

## [2026-11-17] decision | Demo as pre-recorded video
- Demo part of the pitch will be a video; team prepares the flow. Updated deck (demo section, notes), pitch, decisions.

## [2026-11-17] query | Pitch deck artifact
- Built the slide deck as a Slides artifact (13 slides + 3 backup), minimal, app tokens, step-by-step reveals; script in speaker notes. Linked from deck.
