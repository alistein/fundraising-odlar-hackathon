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

## [2026-11-17] decision | Verdict shown by mascot colour
- Verdict card mascot: green/happy = safe, yellow/thinking = neutral, red/alert = scam or AI-generated; header logo stays green.
- Linear: SAFEFUN-9, assigned to Ali. Updated scam-checker verdict table.

## [2026-11-17] decision | Deck in Azerbaijani
- Translated all slides and speaker notes to Azerbaijani; removed em dashes, middle dots and full stops on slide lines. Updated presentation/pitch-deck, deck, open-questions.

## [2026-11-17] decision | "Reyestr" nav becomes "Statistika"
- Nav item "Reyestr" replaced by a statistics page: money collected, verified campaigns, checks run, potential fraud detected, blacklisted identifiers, money protected.
- Campaign list stays, reached from the category grid (SAFEFUN-7).
- Linear: SAFEFUN-10, unassigned; depends on `checks` and `scam_reports` from SAFEFUN-5.

## [2026-11-17] decision | Checker core built (branch `checker`)
- Rules-based scam checker, appeal memory, campaign codes and declared card; home page is now the checker. Local only, not merged or deployed.
- Trust ladder adopted: declared level lets an organiser bind one card before clinic confirmation.
- Updated scam-checker (definitions, rules, demo inputs, limits), architecture, mvp-scope.

## [2026-11-17] decision | Document forgery check built (branch `checker`)
- Upload with reuse and metadata signals, AES-256-GCM storage, clinic-only download, public document check, synthetic sample invoices.
- Updated scam-checker, architecture, threat-model, mvp-scope. Local only; Vercel Blob path untested.

## [2026-11-17] decision | AI layer written (branch `checker`)
- Provider: Anthropic. Model reads appeals, screenshots and documents; rules keep deciding. Key-gated with rules fallback.
- Fallback verified; live model behaviour not tested (no key). Updated scam-checker, architecture, open-questions.

## [2026-11-17] decision | AI layer tested live
- 11 synthetic cases pass locally in 2.5–5 s each; fixed the AI gate so non-Latin (Russian) appeals reach the model.
- Results table and its limits recorded in scam-checker; added image demo files.

## [2026-11-17] decision | AI-generated document passed the first check; fixed
- Cause: messenger-stripped metadata plus a vision prompt that did not look for generation tells. Added clinic-registry check, missing-metadata note, sharper prompt, whole-file C2PA scan; unregistered documents now read "not verified" in a warning tone.
- Recorded in scam-checker with the limit that remains.

## [2026-11-17] decision | Clinic-confirmed document codes and pixel forensics (branch `checker`)
- Clinic confirms an exact file → `SD-` code, proof page with QR, code and file lookup in the checker.
- Compression-history and camera-noise checks with a heatmap; plain ELA tried and dropped (stamp false alarms).
- Recorded results and limits in scam-checker; updated architecture, threat-model.

## [2026-11-17] decision | Five-step pipeline, score, stepped loading (branch `checker`)
- One pipeline for text and files: AI check, edit traces, similar posts online (memory + live web search), MyGov (simulated), clinic registry; 0–100 score with caps.
- `/api/check` streams steps; home page shows them as they finish. `/api/verify` routes removed.
- MyGov step is a simulation and is labelled "(demo)" in the UI. Recorded scoring rules and measured scores in scam-checker.

## [2026-11-17] decision | Step 1: measured origin instead of "looks AI"
- Measured noise, spectrum and compression on 12 files; spectrum did not separate anything after WhatsApp. Built an origin classifier (camera / scan / screenshot / digital) and a two-sources rule for step 1.
- Recorded rules, the 14-file run, the photographed-generated-page case and the limits in scam-checker.

## [2026-11-17] decision | Step 1 reworked: manipulation, gaps, plausibility, second read
- Tone no longer fails an appeal by count; registered campaigns are not scored on tone; a second read guards unregistered appeals; quotes shown as evidence.
- Step 3 reports earlier checks of the same story. 15-case regression recorded in scam-checker with updated scores.

## [2026-11-17] lint | Generated "photo" passed step 1; origin claim corrected
- A Gemini image was classified "camera" and passed. Camera origin no longer earns points; the earlier 14-file result is marked unreliable.
- Added check-digit validation of official numbers with a confirming second read; the file now fails on its seal's ОГРН.

## [2026-11-17] decision | Self-hosted AI-image detector
- Looked at how DeepAI's detector works (closed classifier by TruthScan, one probability, uploads also sent for ad analysis). Team chose to host an open model instead.
- Added the local detector service and gated it to photo-like pictures after measuring that it calls every rendered page "AI". Results and the missing validation recorded in scam-checker.

## [2026-11-17] decision | Checker merged into main
- Branch `checker` merged with the team's roadmap, deck and research work. Conflicts in log, decisions and open-questions kept both sides.
- Open questions: dropped "team confirms the pivot" (the roadmap decisions adopt it) and "AI provider" (Anthropic, built); kept the Vercel key item.
- Production needs `ANTHROPIC_API_KEY`, `db:push` and `db:seed` before the deployed checker works.
## [2026-11-17] lint | Case fit re-checked
- Re-read sources: Həsənov (~200k AZN, Instagram) fits the Tool exactly; Seidova (~1M AZN) was a medical-travel intermediary with no stated donation posts, stopped only by clinic verification.
- Deck: problem slide now leads with the Instagram case; thalassemia case moved to the roadmap slide as the reason for clinic verification.
- Updated fraud-cases (fit table), product-overview, pitch, deck, jury-qa (new Q), fraud-statistics, swot, judging-criteria.

## [2026-11-17] query | Problem scene slide
- Added an animated scene slide before the 200k AZN case: donors → family (click 1), scammer intercepts, family gets 0 manat (click 2). Synced presentation/pitch-deck.

## [2026-11-17] decision | Profile switcher removed from the MVP
- Header no longer offers demo profiles (Qonaq, organiser, clinics, donor); everyone browses as a guest. Organiser and clinic pages still open by URL.

## [2026-11-17] decision | Live database migrated and reseeded
- Ran `db:push` and `db:seed` on the production database after the checker merge (tables `appeals` and campaign codes were missing, so `/api/check` failed). All prior live data replaced with synthetic demo data.

## [2026-11-17] decision | Mascot result faces built (SAFEFUN-9)
- Yellow and coral face tokens; result card shows a large mascot whose colour and mood follow the report tone. Header logo stays lime.
- Checked with SF-4821, 4169 7388 1234 5678 and SF-2210 at desktop and phone width, light and dark. Updated branding, scam-checker.

## [2026-11-17] ingest | Crowdfunding law 450-VIIQ (SAFEFUN-11)
- New source crowdfunding-law-2026 (EY July 2026 brief in raw/, law-firm summaries, press).
- Law adopted 14 Jul 2026, in force 24 Jan 2027; regulates only equity and debt crowdfunding under the CBA. No explicit donation exclusion found; statute text not read.
- Updated fundraising-law (Q&A table, pitch line), card-transfer-limits (MP Bayramov softening), jury-qa, open-questions (resolved one, added "read statute"), index.

## [2026-11-17] decision | Statistika page (SAFEFUN-10)
- Header "Reyestr" → "Statistika" (`/stats`, `GET /api/stats`); `/ledger` stays reachable by URL, campaigns via "Kampaniyalar".
- Tiles: donations raised, verified campaigns, checks, caught scams, blacklisted cards, protected amount, plus the six latest caught scams.
- No `checks`/`scam_reports` tables exist; numbers come from `appeals` (text checks only; file checks are not stored). Scam verdicts: route_mismatch, rejected, altered, serial_card, multi_route, pressure.
- New nullable `appeals.amount_qepik` (pushed to the live DB): amount the appeal asks for, else the matched campaign's. Repeated checks of the same appeal each count.

## [2026-11-17] decision | Statistika: rejected rows labelled "MyGov rədd edib"
- In "Son aşkarlananlar" only, `rejected` appeals read "MyGov rədd edib" instead of "Klinika rədd edib" (team choice). The checker result title is unchanged.

## [2026-11-17] decision | Home categories and campaign filter (SAFEFUN-7)
- Home page: checker first, then a category grid (6 columns desktop, 3 tablet, 2 phone). Categories: Xərçəng, Ürək, Transplantasiya, Uşaqlar, Əməliyyat, Reabilitasiya.
- A card opens `/campaigns?kateqoriya=<slug>`; the campaigns page gets a chip filter and an empty state.
- No schema change: categories are matched from title, diagnosis and clinic name by keyword (`lib/categories.ts`), so a campaign can sit in several. Seed has no cancer campaign, so Xərçəng shows the empty state.

## [2026-11-17] decision | Mock MyGov identity gate (SAFEFUN-8)
- `POST /api/mock/mygov`: synthetic FIN registry with four people; outcomes found / not_found / name_mismatch / inactive. Nothing leaves the server.
- Campaign page: "MyGov ilə təsdiqlə" → mock consent screen `/mygov?kampaniya=<id>` (FIN, Ad, Soyad) → `POST /api/campaigns/[id]/identity`. Stores `identity_verified_at` and an HMAC of the FIN; badge "MyGov" on the campaign.
- Checker MyGov step now reads the campaign's identity status. Seed confirms the three verified campaigns (FIN `5AZ7K2P`, Aysel Məmmədova); SF-3307 and SF-2210 start unconfirmed.
- Live DB pushed and reseeded. Demo: check `4169 7388 1234 5678` (MyGov warn) → confirm SF-3307 with `5AZ7K2P` / Aysel / Məmmədova → recheck (MyGov pass). Wrong name → "Ad FIN ilə uyğun gəlmir".
- Note: SF-3307 was confirmed during testing; reseed before the demo to reset it.

## [2026-11-17] decision | Clinic becomes an optional reporter
- Core flow is AI gate → myGov gate. Clinics no longer register or confirm campaigns; optionally they can report a campaign as fake and are contacted through their own email. Not part of the business plan.
- Updated decisions, roadmap (stage 4), product-overview (roles), open-questions (demo question resolved). Still to update once built: product-flow, scam-checker (clinic step and scoring), pitch, deck, jury-qa, business-model.

## [2026-11-17] decision | Clinic reporter built
- Checker: step 5 is now "Safefund reyestri" (registered + myGov gate passed); new step 6 "Klinika şikayəti" (confirmed report fails, unconfirmed warns and caps at 70).
- MyGov confirmation makes a pending campaign live. Clinic confirmation page `/clinic` and `POST /api/campaigns/[id]/confirm` removed.
- New `clinic_reports` table and `POST /api/campaigns/[id]/report`; "Klinika olaraq bildir" form on campaign pages (clinic, own email, reason).
- Live DB pushed and reseeded: SF-2210 carries a confirmed report from Demo Mərkəzi Klinika (score 0). SF-4821 95; Leyla card 40 before myGov, 95 after.
- Updated product-flow, scam-checker, architecture, jury-qa. Deck, pitch, business-model still argue for clinic verification: listed in open-questions.

## [2026-11-17] decision | Recent campaigns on the home page
- Home page order: checker → categories → "Son kampaniyalar" (newest 6, blocked campaigns left out) with a "Hamısı" link to `/campaigns`. Campaign card shared via `components/campaign-grid.tsx`.
