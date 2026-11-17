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
| `lib/categories.ts` | Category list and keyword matching for the home grid and campaign filter |
| `lib/stats.ts` | `getStats()`: platform totals for `/stats` and `GET /api/stats` |
| `lib/crypto.ts` | AES-256-GCM file encryption, `sha256()` |
| `lib/campaigns.ts` | Campaign queries with raised total |
| `lib/api.ts` | `handler()` wrapper: thrown errors → JSON |
| `styles/tokens.css` | Design tokens → [[design-system]] |
| `components/ui/` | shadcn/ui components; `components/icon.tsx` wraps Hugeicons |
| `app/` | Pages: `/`, `/campaigns/new`, `/campaigns/[id]`, `/clinic`, `/ledger`, `/stats`, `/verify` |

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
| `GET /api/stats` | public | Working |
| `POST /api/mock/mygov` | public, mock | Working |
| `POST /api/campaigns/[id]/ai-gate` | public (mock demo organiser) | Working |
| `POST /api/campaigns/[id]/report` | public (clinic report, unconfirmed until we email the clinic) | Working |
| `POST /api/campaigns/[id]/identity` | public (auth mocked) | Working |
| `POST /api/campaigns/[id]/documents` | the campaign's organiser | Working (branch `checker`) — forgery signals, reuse check, AES-256-GCM, ciphertext stored |
| `GET /api/documents/[id]` | the campaign's clinic only | Working (branch `checker`) — decrypts per request |
| `POST /api/documents/[id]/confirm` | the campaign's clinic only | Working (branch `checker`) — issues the `SD-` code |
| `POST /api/check` | public | Working (branch `checker`) — text or file in, stream of pipeline steps and a score out → [[scam-checker]]. Replaces `/api/verify` |

## Security mechanisms

- **Tamper-evident ledger:** each row stores `sha256(prevHash + [seq, campaignId, type, amount, label, createdAt])`. Appends take a Postgres advisory lock. `verifyChain()` recomputes from genesis and names the first broken entry. Tested: editing a row's amount in the DB is reported as "entry was altered" at that seq.
- **Role checks:** enforced in the API, not only the UI. A clinic can confirm only its own campaigns; an unverified campaign refuses donations.
- **File encryption:** AES-256-GCM, key in `FILE_ENCRYPTION_KEY`. Wired on branch `checker`: uploads are encrypted before storage and decrypted only for the campaign's clinic. Tested locally: stored file is ciphertext, decrypted bytes equal the original, organiser and other clinics get 403.
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

### Built on branch `checker` (2026-11-17, local only, not merged or deployed)

| Piece | What |
|---|---|
| `lib/checker/text.ts` | Pure helpers: identifier extraction (card, IBAN, SF code, campaign link, amount), Azerbaijani-folded story fingerprint, similarity, story clustering |
| `lib/checker/index.ts` | `checkAppeal()`: find the campaign (code/link → declared card → story or patient+diagnosis), apply rules, fall back to memory, store the check |
| `lib/crypto.ts` | `routeHash()`: HMAC-SHA256 of a card/IBAN with the server key; numbers are never stored |
| Schema | `campaigns.code`, `declared_route_hash`, `declared_route_last4`, `closed_at`; new `appeals` table (fingerprint, hashed routes, verdict). `code` is not UNIQUE because `drizzle-kit push` would offer to truncate the live table |
| UI | `/` is the checker with a verdict card; campaign list moved to `/campaigns`; `/verify` redirects to `/`; campaign page shows the code and declared card; new-campaign form takes an optional card |
| Seed | 5 campaigns (verified ×3 incl. one closed, pending with declared card, rejected) and 4 remembered appeals |

| `lib/checker/document.ts` | `inspectDocument()`: file type by magic bytes; editing-software trace in PDF Producer/Creator or image EXIF/XMP; AI-generation marks; PDF modified after creation; PDF re-saved on top (extra `%%EOF`) |
| `lib/checker/pipeline.ts` | `runCheck()`: the five steps, emitted as they finish, and `score()` |
| `lib/mygov.ts` | **Mock** MyGov sandbox: confirms any FIN and name (`lookupFin`) and per-campaign identity status (`campaigns.identity_verified_at`, FIN stored as HMAC only). `users.mygov_verified_at` is no longer read |
| `lib/checker/origin.ts` | `classifyOrigin()`: camera / scan / screenshot / digital from grain, light and aspect ratio; no model |
| `detector/server.py`, `lib/checker/detector.ts` | Self-hosted AI-image detector (open SigLIP classifier, local Python service on :8790) and its client; used only for photo-like pictures |
| `lib/checker/identifiers.ts` | Check digits for ОГРН, ИНН, IBAN and card numbers; pure arithmetic |
| `lib/checker/forensics.ts` | `analyseImage()` with `sharp`: compression-history ladder and camera-noise check, returns signals and a heatmap |
| `lib/documents.ts`, `app/d/[code]` | Clinic-confirmed document registry, code lookup, public proof page with QR (`qrcode`) |
| `lib/storage.ts` | Ciphertext to Vercel Blob (private) when `BLOB_READ_WRITE_TOKEN` is set, else to `product/.data/docs/` |
| Documents UI | Campaign page shows documents only to its organiser and its clinic; organiser uploads, clinic opens. Checker home has a "Sənəd yoxla" button |
| `product/demo-docs/` | Synthetic `clean-invoice.pdf` and `forged-invoice.pdf`, built by `make.py` |

| `lib/checker/ai.ts` | Optional AI layer (`@anthropic-ai/sdk`): `readAppeal()` and `readFile()` with structured output; returns null without `ANTHROPIC_API_KEY` or on any failure. Tested live locally 2026-11-17 → [[scam-checker]] |

The Vercel Blob path is untested (no token locally). Similarity runs in TypeScript, so `pg_trgm` is not needed. To go live: `pnpm db:push` then `pnpm db:seed` against production (the seed resets live data).

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
