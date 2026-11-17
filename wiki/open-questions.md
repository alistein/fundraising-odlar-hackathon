# Open questions

Unresolved items. Move a row to "Resolved" with the answer and date when settled.

## Needed today (blocks build or submission)

| Question | Needed by | Status |
|---|---|---|
| Clash check for "Safefund" (existing companies, domains) | Before pitch | Open |
| Which track(s) to declare — brief proposes 1 and 3 → [[tracks]] | 22:00 submission | Open |
| Whole team confirms the checker-first pivot → [[decisions]] | Before Sprint II work | Open |
| Add `ANTHROPIC_API_KEY` to Vercel env before deploying the checker (tested live locally 2026-11-17) → [[scam-checker]] | Before submission | Open |
| How the document check actually detects edit / reuse / AI generation in the MVP — proposed: hash reuse, metadata, AI verdict → [[scam-checker]] | Sprint III | Proposed |
| Who reviews scam reports before a card is blacklisted (false-report abuse) | Before pitch | Open |
| MyGov step is simulated: is there a real MyGov / ASAN login integration we could name, and what does it take? | Before pitch | Open |
| Rewrite the submission problem and solution statements for the pivot → [[schedule]], [[pitch]] | 22:00 submission | Open |

## From the idea brief (pitch and Q&A)

| Question | Status |
|---|---|
| **Legal:** who may receive and route donations; does the platform need a foundation or a payment licence? | Open |
| **Competition:** which donation platforms operate in Azerbaijan, and do any verify cases? | Open |
| **Clinics:** will one clinic agree to confirm cases for a pilot? | Open |
| **Evidence:** date of the thalassemia case; one or two more recent local cases → [[fraud-cases]] | Open |
| Verify card-limit figures against the Central Bank's official text → [[card-transfer-limits]] | Open |

## Resolved

| Question | Answer | Date |
|---|---|---|
| How clone detection matches a pasted link or card number | Exact match on campaign URL and clinic IBAN, then `pg_trgm` similarity on title and story; blacklist lookup for cards → [[scam-checker]] (design, not built) | 2026-11-17 |
| Product name | Safefund | 2026-11-17 |
| Deployment | Vercel + Neon + Blob, auto-deploy from GitHub → [[architecture]] | 2026-11-17 |
| Logo direction | Shield-face mascot with animated moods → [[branding]] | 2026-11-17 |
| Tech stack and hosting | Next.js API routes, Neon Postgres + Drizzle, Vercel Blob, Vercel → [[architecture]] | 2026-11-17 |
| How the ledger is made tamper-evident | SHA-256 hash chain in Postgres with a public verify endpoint → [[architecture]] | 2026-11-17 |

Sources: [[idea-brief]], [[hackathon-program]]
