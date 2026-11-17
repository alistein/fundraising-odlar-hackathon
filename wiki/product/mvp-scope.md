# MVP scope

What gets built on build day (17 Nov 2026), by sprint. Deadline: submission 22:00–22:30 with a demo/MVP link. Re-planned on 2026-11-17 after the pivot to checker-first (see [[decisions]]).

> **2026-11-17:** the MVP is the **Tool**: paste an Instagram or LinkedIn post link into the Checker and get a legit/scam verdict. The Platform is in the MVP **half-built** (campaign pages, test donations, ledger); the full Platform, FIN code / myGov identity checks and clinic verification are post-MVP; clinic verification is last. → [[roadmap]]

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

Items 1–3 are new work; 4–5 already work. Item 5 and the test donation in item 4 are the half-built Platform in the MVP. The clinic-confirmation step in item 4 is ahead of the roadmap (clinics last); whether to show it is open ([[open-questions]]).

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
- Real clinic onboarding, and clinic verification as a product feature: the last roadmap stage ([[roadmap]]).
- Real FIN code / myGov integration (Azerbaijan only): roadmap stage 3. The MVP ships a **mock** myGov sandbox as gate 2 after the AI checker, with synthetic FIN codes only (2026-11-17, SAFEFUN-8).
- The full Platform (stage 2); only a half-built version ships with the MVP.
- Treatment-abroad clinics (e.g. Türkiye).
- Scraping real social-media appeals. The post-link checker fetches only our own synthetic demo posts; real Instagram / LinkedIn fetching is roadmap (2026-11-17).

## Progress (2026-11-17)

Working and deployed at https://safefund.vercel.app: must-work items 4 and 5. Not built: items 1–3 (checker, clone detection, document check), file upload and encryption wiring, payout entries. Details: [[architecture]].

Stack and other build choices: [[decisions]]. Checker design: [[scam-checker]].

Sources: [[idea-brief]], [[hackathon-program]]
