# MVP scope

What gets built on build day (17 Nov 2026), by sprint. Deadline: submission 22:00–22:30 with a demo/MVP link. Re-planned on 2026-11-17 after the pivot to checker-first (see [[decisions]]).

| Sprint | Time | What gets built |
|---|---|---|
| I | 11:00–14:00 | Done: data model and three roles, campaign creation, clinic confirmation, test donations, public ledger. |
| II | 15:00–18:00 | Scam checker core: `POST /api/verify` with AI extraction, registry match, clone detection and blacklist; checker as the home page with a verdict view. |
| III | 19:00–22:00 | Document forgery check with encrypted upload, demo data (campaigns, clones, scam cards, forged invoice), rehearsal. |

Mentor checkpoint 18:00–19:00 sits between II and III — have "paste a clone, see it caught" demoable by then. Full timetable: [[schedule]].

## Must work in the demo

In demo order:

1. Paste a verified campaign's link or account → verdict **verified**.
2. Paste a cloned appeal with a swapped card → verdict **scam**, original shown.
3. Upload a forged invoice → **flagged** with signals.
4. Clinic confirms a campaign; a test donation appears on the public ledger.
5. Ledger tamper check passes (and names the broken entry if a row is edited).

Items 1–3 are new work; 4–5 already work.

## Build order if time runs short

1. `/api/verify` with registry match and clone detection (no AI needed for the basic verdict).
2. AI extraction from free text, then scam-language signals.
3. Document check: hash reuse and metadata first, AI verdict second.
4. Screenshot input, report-a-scam form, Telegram bot — only if everything above works.

## Constraints

- All payments are test payments. No real clinic, patient or bank system is touched. See [[rules]].
- Synthetic demo data only — including the scam appeals and forged documents, which are our own fabricated samples.
- Localized for Azerbaijan (AZN, Azerbaijani UI) — team direction, 2026-11-17.
- Local dev runs against the live database; `pnpm db:seed` resets production. See [[architecture]].

## Explicitly out of scope

- Real money movement (needs a licensed payment partner or registered foundation).
- Real clinic onboarding.
- Treatment-abroad clinics (e.g. Türkiye).
- Scraping real social-media appeals.

## Progress (2026-11-17)

Working and deployed at https://safefund.vercel.app: must-work items 4 and 5. Working on branch `checker`, local only: items 1 and 2 (checker with clone, stale, altered, serial-card and multi-route verdicts). Also on that branch: item 3 (document forgery check with encrypted upload and clinic-only download). AI layer (appeal reading, screenshots, document vision) works there too, tested live locally. Not built: payout entries. Details: [[architecture]].

Stack and other build choices: [[decisions]]. Checker design: [[scam-checker]].

Sources: [[idea-brief]], [[hackathon-program]]
