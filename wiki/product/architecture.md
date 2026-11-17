# Architecture

Stack, code layout and API surface of the MVP in `product/`. Scaffolded 2026-11-17.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 16 (App Router, TypeScript), Tailwind 4, shadcn/ui, Hugeicons |
| Backend | API route handlers under `src/app/api/` (no server actions) |
| Database | Postgres via Drizzle ORM and the `pg` driver — Neon (Vercel Marketplace) in prod, local Postgres in dev |
| File storage | Vercel Blob, ciphertext only |
| Hosting | Vercel |
| Auth | **Mocked**: cookie `demo_user` holds a seeded user id; header dropdown switches role. No passwords. |
| Payments | Test only: a donation is written straight to the ledger |

`cacheComponents` is turned off in `next.config.ts`; every page renders at request time.

## Code layout (`product/src`)

| Path | What |
|---|---|
| `db/schema.ts` | Tables: `clinics`, `users`, `campaigns`, `documents`, `ledger_entries` |
| `db/seed.ts` | Synthetic demo data (2 clinics, 4 users, 2 campaigns, 2 donations) |
| `lib/auth.ts` | Mock session, `requireRole()` |
| `lib/ledger.ts` | Hash-chain append and `verifyChain()` |
| `lib/crypto.ts` | AES-256-GCM file encryption, `sha256()` |
| `lib/campaigns.ts` | Campaign queries with raised total |
| `lib/api.ts` | `handler()` wrapper: thrown errors → JSON |
| `styles/tokens.css` | Design tokens → [[design-system]] |
| `components/ui/` | shadcn/ui components; `components/icon.tsx` wraps Hugeicons |
| `app/` | Pages: `/`, `/campaigns/new`, `/campaigns/[id]`, `/clinic`, `/ledger`, `/verify` |

## API

| Method and path | Who | Status |
|---|---|---|
| `POST /api/auth/login`, `POST /api/auth/logout` | anyone (mock) | Working |
| `GET /api/campaigns` | public | Working |
| `POST /api/campaigns` | organiser | Working — creates as `pending` |
| `GET /api/campaigns/[id]` | public | Working |
| `POST /api/campaigns/[id]/confirm` | the campaign's clinic only | Working |
| `POST /api/campaigns/[id]/donate` | anyone; only if `verified` | Working (test payment) |
| `GET /api/ledger` | public | Working |
| `GET /api/ledger/verify` | public | Working |
| `POST /api/campaigns/[id]/documents` | organiser | **Stub (501)** — Sprint II |
| `POST /api/verify` | public | **Stub (501)** — Sprint III |

## Security mechanisms

- **Tamper-evident ledger:** each row stores `sha256(prevHash + [seq, campaignId, type, amount, label, createdAt])`. Appends take a Postgres advisory lock. `verifyChain()` recomputes from genesis and names the first broken entry. Tested: editing a row's amount in the DB is reported as "entry was altered" at that seq.
- **Role checks:** enforced in the API, not only the UI. A clinic can confirm only its own campaigns; an unverified campaign refuses donations.
- **File encryption:** AES-256-GCM helper exists, key in `FILE_ENCRYPTION_KEY`; not yet wired to an upload route.
- Money is stored as integer qəpik.

## Not built yet

- Document upload and forgery check (reuse, tamper, AI-generation signals)
- Clone detection behind the verify page
- Payout entries to the clinic

See [[mvp-scope]], [[threat-model]], [[decisions]].

## Planned for the checker-first pivot (2026-11-17, not built)

The scam checker becomes the product and the home page; design in [[scam-checker]].

| Piece | Change |
|---|---|
| `/` | Becomes the checker (today's `/verify` form plus a verdict view); the campaign list moves to its own page |
| `POST /api/verify` | Replace the 501 stub: AI claim extraction → registry match → `pg_trgm` clone detection → blacklist lookup → verdict with reasons |
| `POST /api/campaigns/[id]/documents` | Replace the 501 stub: `sha256()` reuse lookup, metadata signals, AI verdict, `encryptFile()`, ciphertext to Blob |
| Schema | New `scam_reports` and `checks` tables; `pg_trgm` extension on Neon. Campaigns have no card field today — the clinic IBAN and campaign URL are the identifiers to match |
| Seed | More verified campaigns, clones with swapped cards, blacklisted cards, clean and forged invoices |
| AI provider | Not chosen; needs an API key in Vercel env → [[open-questions]] |

Everything in the API table above stays as is.

## Deployment (2026-11-17)

| Piece | Setup |
|---|---|
| Vercel project | `safefund` (team mralialyev-5170s-projects), root directory `product/`, functions in `fra1` (Frankfurt) via `product/vercel.json` |
| Git | Connected to github.com/alistein/fundraising-odlar-hackathon — every push to `main` deploys to production |
| Production URL | https://safefund.vercel.app — public since 2026-11-17; Vercel protection still covers preview and per-deployment URLs |
| Database | Neon Postgres `safefund-db`, free plan, Frankfurt, via Vercel Marketplace; env vars `DATABASE_URL` (+ `_UNPOOLED`, `PG*`) set for all environments. Schema pushed and seeded 2026-11-17. |
| Blob | Private store `safefund-docs`, Frankfurt; `BLOB_READ_WRITE_TOKEN` set for all environments |
| Encryption | `FILE_ENCRYPTION_KEY`, one key shared by production, preview and development (non-sensitive so it can be pulled). Rotated 2026-11-17 before any file was encrypted. |

**Local uses production keys (decided 2026-11-17):** `product/.env.local` is pulled with `vercel env pull product/.env.local --environment=development` from the repo root, so local dev talks to the live Neon database and Blob store with the same encryption key. Anything done locally shows up on the live site. The old local-Postgres env is kept in `product/.env.local.local-postgres`. After pulling, restart `pnpm dev` (the DB pool is cached).

Tested on production 2026-11-17: pages and APIs return 200, a test donation was appended and the chain verified, an unverified campaign refused a donation.
