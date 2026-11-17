# Design system

UI is a first-class priority for this hackathon. The look is GoFundMe's tokens on shadcn/ui components, with Apple-style interaction craft and Hugeicons. Applies to the app **and** the pitch artifact.

> Rebuilt from scratch on 2026-11-17. The first pass (custom emerald tokens and hand-written `.btn`/`.card` classes) was rejected by the team as generic and AI-looking, and was deleted.

## Why it matters

Demo quality is judged directly (criterion 4, 20 pts) and colours every other score in a 5-minute pitch. A familiar, trustworthy fundraising look makes the security story credible. See [[judging-criteria]].

## Stack

| Layer | Choice |
|---|---|
| Components | shadcn/ui (`radix-nova` style, Radix primitives) in `product/src/components/ui/` |
| Icons | Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`), always through `components/icon.tsx` (stroke 1.75). No other icon set, no hand-drawn SVG. |
| Tokens | `product/src/styles/tokens.css` — shadcn variable names, GoFundMe-derived values |
| Tailwind mapping | `product/src/app/globals.css` |

`button`, `badge`, `input`, `textarea` and `progress` were rewritten to the tokens below; the other shadcn components are stock.

## Tokens — one source for app and pitch

`tokens.css` is plain CSS with no build step: paste it into the pitch HTML artifact as-is. The app is light-only (like GoFundMe); the file also carries a dark set under `.dark` / `[data-theme="dark"]` for the pitch.

Values were read from gofundme.com's live CSS on 2026-11-17 (`--hrt-*` variables and computed styles).

| Token | Value | From GoFundMe |
|---|---|---|
| `--background` / `--foreground` | `#ffffff` / `#232323` | Page and body text |
| `--primary` (+ `-hover`) | `#274a34` / `#1b3625` | Dark green CTA |
| `--lime` / `--lime-foreground` | `#ccf88e` / `#274a34` | Lime chip and banner |
| `--secondary`, `--muted` | `#f4f2ec`, `#f8f6f2` | Warm off-white surfaces |
| `--input` | `#b7b7b6` | Outline of pill buttons and fields |
| `--border` | `#e6e5e1` | Dividers |
| `--progress-from` → `--progress-to` | `#acf86c` → `#4a9d44` | Progress gradient |
| `--warning`, `--destructive` (+ soft) | `#fdefc3`, `#c8321f` | Ours: pending and fraud states |
| `--radius` | `0.75rem`; cards 16–24px; buttons fully round | Radius scale 4/8/12/16/20/24, pills |
| `--shadow-soft` / `-medium` / `-strong` | `0 1px 2px`, `0 2px 6px`, `0 6px 14px` at `rgb(35 35 35 / .1)` | Shadow scale |
| `--ease-default` | `cubic-bezier(0.3, 0.01, 0, 1)` | Their default easing |
| `--tracking-display` | `-0.02em`, heading leading 1.2 | Their heading type |

Not copied: the GoFundMe name, logo, photos, and their proprietary font "GoFundMe Sans". Type is **Nunito Sans** (Google Fonts, SIL Open Font License, decided 2026-11-17) as the open stand-in for GoFundMe Sans's warm, rounded feel; headings at weight 800. Chosen over Figtree, Onest, Rethink Sans and Bricolage Grotesque after comparing them on Azerbaijani text; its latin-ext subset covers ə, ğ, ı, ş.

Lime means **verified**. Red is reserved for caught fraud and a broken chain — keep it rare so the attack demo lands.

## Text rule (strict)

Adopted 2026-11-17 from a prompt the team shared (source: X post by @Voxyz_ai). In our words:

- Aim for Linear / Apple Notes level of simplicity: simple purpose, architecture, design and implementation.
- **No taglines, helper text or secondary labels.** If a screen does not make sense without them, fix the layout instead.
- Every decision should improve user, developer and agent experience together, without breaking anything.

In practice: one large heading per page, labels only on form fields and data, state shown by badges and toasts rather than sentences.

## Interaction rules (strict, from the `apple-design` skill)

- **Respond on press.** Buttons, cards and preset pills scale on `:active` in ~100ms (`press` utility, Button built-in). Never wait for release.
- **Feedback for every action:** toast (sonner) on donation, confirm, reject and errors.
- **Materials:** the header is a translucent layer (`backdrop-blur`) with content scrolling under it; honours `prefers-reduced-transparency`.
- **Type:** Nunito Sans everywhere (UI and logo wordmark). Large text gets negative tracking and tight leading (`display` utility); body stays at 0 tracking, 1.5 leading. Money uses `tabular-nums`.
- **Motion:** `transform` and `opacity` only, no `transition-all`, no bounce on non-gesture UI. Progress fills once with `--ease-default`. `prefers-reduced-motion` collapses durations.
- **Simplicity, not minimalism:** the most important thing on a screen is the most obvious (amount raised, donate button, chain status).

## Avatars

DiceBear **Lorelei** (CC0 1.0, by Lisa Wischofsky), generated locally with `@dicebear/core` in `product/src/components/user-avatar.tsx`, so names are never sent to DiceBear's API. Backgrounds cycle through our lime, off-white and pale-yellow tokens. Seed: user id for demo users, donor name for named donations, the ledger hash for anonymous ones (each anonymous donor gets a different face). Used in the user menu, the campaign donor list and the ledger. Decided 2026-11-17.

## Logo and mascot

The header uses the animated mascot, not an icon. Mascot colours are separate tokens (`--mascot-*`) that stay the same in dark mode. Moods and usage: [[branding]].

## Skills to use

| Purpose | Skill | Installed |
|---|---|---|
| Interaction and craft | `apple-design` (Emil Kowalski's set) | Globally |
| Animation work and review | `emil-design-eng`, `animate`, `review-animations`, `animation-performance` | Globally |
| Product-UI shots and animated demos for the pitch | `stageshow` (`benjitaylor/skills`) | Project: `.claude/skills/stageshow` |

## Status (2026-11-17)

Rebuilt: header, home, campaign, create form, clinic queue, ledger, verify. Checked in the browser at desktop and phone width; a test donation was made through the UI. Known gaps: on phones the donate card sits below the story instead of being pinned; no campaign photos; verify page has no verdict UI yet; pitch artifact not started.

See [[architecture]], [[pitch]], [[decisions]].
