# Decisions

Dated log of team decisions (stack, scope cuts, naming). Newest first. Update affected pages when adding an entry.

| Date | Decision | Why | Affects |
|---|---|---|---|
| 2026-11-17 | Local dev uses the production keys (Neon, Blob, encryption key) | Team wants one set of keys everywhere; local and live share data | [[architecture]] |
| 2026-11-17 | Avatars: DiceBear Lorelei, generated locally | Team pick from DiceBear; CC0 licence, no attribution needed; local generation keeps donor names out of third-party requests | [[design-system]] |
| 2026-11-17 | Font: Nunito Sans for UI and wordmark | Team liked GoFundMe's playful type; GoFundMe Sans is proprietary, so an open-licence font with the same warm feel | [[design-system]], [[branding]] |
| 2026-11-17 | Logo: original shield-face mascot with four animated moods (idle, thinking, happy, alert); replaces the Hugeicons shield in the header | Team liked it over the geometric concepts; gives the demo a reactive, friendly cue | [[branding]] |
| 2026-11-17 | Product name: **Safefund** (wordmark lowercase "safefund") | Team pick after several rounds; reads as "safe fund" in English and "saf fond" (clean fund) to Azerbaijani ears. No trademark or domain check done yet. | [[product-overview]], [[branding]] |
| 2026-11-17 | UI rebuilt from scratch: shadcn/ui + GoFundMe-derived tokens + Hugeicons, `apple-design` interaction rules. Supersedes the first custom-token pass. | Team rejected the first UI as AI-looking | [[design-system]] |
| 2026-11-17 | UI is a first-class priority; shared tokens for app and pitch; strict text rule; `stageshow` for pitch visuals | UI weighs heavily in hackathon judging | [[design-system]] |
| 2026-11-17 | Stack: Next.js + API route handlers, Neon Postgres (via Vercel) + Drizzle, Vercel Blob, Vercel hosting | One repo, fast deploy; API routes give explicit endpoints and a clean frontend/backend split; Vercel-native DB over Supabase since auth is mocked | [[architecture]] |
| 2026-11-17 | Auth is mocked (seeded users + role switcher, no passwords) | Hackathon scope; saves time and speeds up the demo | [[architecture]] |
| 2026-11-17 | MVP is localized for Azerbaijan | Team direction at kickoff | [[mvp-scope]] |
| 2026-11-17 | Knowledge base uses the Karpathy LLM-wiki pattern under `wiki/` | Team direction at kickoff | schema in root `CLAUDE.md` |

## Pending

- Which track(s) to declare at submission — brief proposes two, see [[tracks]]

Tracked in [[open-questions]].
