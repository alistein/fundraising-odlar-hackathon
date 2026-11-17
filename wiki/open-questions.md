# Open questions

Unresolved items. Move a row to "Resolved" with the answer and date when settled.

## Needed today (blocks build or submission)

| Question | Needed by | Status |
|---|---|---|
| Clash check for "Safefund" (existing companies, domains) | Before pitch | Open |
| Which track(s) to declare — brief proposes 1 and 3 → [[tracks]] | 22:00 submission | Open |
| Show the clinic-confirmation step (built in Sprint I, but clinics are last on the roadmap) in the demo, or only the half-built Platform's donations + ledger? → [[roadmap]] | Before pitch | Open |
| What "verified" means in the MVP Tool without identity or clinic checks → [[roadmap]], [[scam-checker]] | Before pitch | Open |
| FIN code / myGov: which API or access route exists for third parties, and what consent is required? → [[roadmap]] | Roadmap | Open |
| Add `ANTHROPIC_API_KEY` to Vercel env before deploying the checker (tested live locally 2026-11-17) → [[scam-checker]] | Before submission | Open |
| How the document check actually detects edit / reuse / AI generation in the MVP — proposed: hash reuse, metadata, AI verdict → [[scam-checker]] | Sprint III | Proposed |
| Who reviews scam reports before a card is blacklisted (false-report abuse) | Before pitch | Open |
| MyGov step is simulated: is there a real MyGov / ASAN login integration we could name, and what does it take? | Before pitch | Open |
| Rewrite the submission problem and solution statements for the pivot → [[schedule]], [[pitch]] | 22:00 submission | Open |

## From the idea brief (pitch and Q&A)

| Question | Status |
|---|---|
| **Legal:** confirm with a lawyer that "pay the clinic's invoice via a licensed bank" avoids donation registration; ICNL review is from 2018 → [[fundraising-law]] | Proposed |
| Verify crowdfunding law No. 450-VIIQ (Jan 2027) and that donation crowdfunding is outside it → [[fundraising-law]] | Open |
| **Competition:** is layf.az live, at what scale, and does it verify with clinics? → [[market-azerbaijan]] | Open |
| Team confirms business model (0% fee, B2B revenue) and GTM phases → [[business-model]], [[go-to-market]] | Proposed |
| Number of licensed banks in Azerbaijan (for sizing) → [[market-azerbaijan]] | Open |
| US charity/crowdfunding fraud figure (~$96M) — check the IC3 2024 table → [[fraud-statistics]] | Open |
| **Clinics:** will one clinic agree to confirm cases for a pilot? (last roadmap stage, [[roadmap]]) | Deferred |
| **Evidence:** court outcome of the thalassemia (Seidova) case; dates of the Cəfərov, Qəhrəmanov, Babayev cases → [[fraud-cases]] | Open |
| Card-limit effective date (1 Aug 2026) against the CBA's official text → [[card-transfer-limits]] | Open |

## Resolved

| Question | Answer | Date |
|---|---|---|
| Pitch language | Azerbaijani → [[deck]] | 2026-11-17 |
| Product stages and what's in the MVP | MVP = Tool (Instagram / LinkedIn link checker) + half-built Platform; then full Platform; then FIN code / myGov; clinics last → [[roadmap]] | 2026-11-17 |
| Whole team confirms the checker-first pivot | Confirmed as the Tool stage → [[decisions]] | 2026-11-17 |
| Recent local fraud cases for the problem slide | Seidova case opened Feb 2023 (36 children, ~1M AZN, 3 deaths); Həsənov ~200k AZN, Dec 2025; more → [[fraud-cases]] | 2026-11-17 |
| Card-limit figures | Confirmed by CBA Governor, 29 Oct 2026 → [[card-transfer-limits]] | 2026-11-17 |
| Which platforms operate locally | None verified found; layf.az candidate → [[market-azerbaijan]] | 2026-11-17 |
| How clone detection matches a pasted link or card number | Exact match on campaign URL and clinic IBAN, then `pg_trgm` similarity on title and story; blacklist lookup for cards → [[scam-checker]] (design, not built) | 2026-11-17 |
| Product name | Safefund | 2026-11-17 |
| Deployment | Vercel + Neon + Blob, auto-deploy from GitHub → [[architecture]] | 2026-11-17 |
| Logo direction | Shield-face mascot with animated moods → [[branding]] | 2026-11-17 |
| Tech stack and hosting | Next.js API routes, Neon Postgres + Drizzle, Vercel Blob, Vercel → [[architecture]] | 2026-11-17 |
| How the ledger is made tamper-evident | SHA-256 hash chain in Postgres with a public verify endpoint → [[architecture]] | 2026-11-17 |

Sources: [[idea-brief]], [[hackathon-program]], [[market-research-2026-11-17]]
