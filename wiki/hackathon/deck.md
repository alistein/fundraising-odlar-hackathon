# Deck

Slide text and speaker script for the 18 Nov pitch, following the organisers' format: 5 min talk and demo, then 2 min Q&A. Each slide gives the on-screen text (short) and what to say (timed at ~140 words/min). Draft, 2026-11-17.

**Slides:** https://claude.ai/artifact/Li9v6gMuq5oXNTkm9X28cv (private until shared; 13 slides + 3 backup, click-by-click reveals, app tokens and mascot).

Format and criteria: [[pitch]], [[judging-criteria]]. Evidence: [[fraud-cases]], [[fraud-statistics]]. Stages: [[roadmap]].

| # | Part | Time | Words to say |
|---|---|---|---|
| 0 | Title | — (while walking up) | — |
| 1 | Problem | 45 s | ~100 |
| 2 | Solution | 45 s | ~100 |
| 3 | Product demo | 2 min | pre-recorded video |
| 4 | Target user | 30 s | ~65 |
| 5 | Impact / business potential | 45 s | ~100 |
| 6 | Future | 15 s | ~35 |
| — | Q&A | 2 min | backup slides A1–A5 |

---

## 0. Title

**On screen**

> **safefund** (mascot)
> Check before you give.

---

## 1. Problem — 45 s

*Criterion 1: problem relevance and cybersecurity impact (25 pts)*

**On screen**

> **36 children. 1,000,000 AZN. 3 deaths.**
> A sick child's photo + a personal card number = the perfect scam.
>
> 22.4M AZN stolen in 16,804 cyber-fraud cases in 2024 — MIA
> Charity fraud isn't even counted.

**Say**

> "In 2023, the parents of 36 children with thalassemia paid about one million manat for bone-marrow transplants in Türkiye. The transplants never happened, and three of those children died waiting.
> It isn't one case. Last December police detained a man who had collected almost 200,000 manat on Instagram with photos of other people's sick babies and his own card number.
> This is social engineering. A photo, a sad story, a card number — and the donor has no way to check. The Interior Ministry counted 22 million manat lost to cyber fraud in 2024, and donation scams aren't even counted separately.
> And since August, each card takes only five transfers a day, so appeals are spreading across even more unfamiliar cards."

---

## 2. Solution — 45 s

*Criterion 2: innovation and differentiation (15 pts)*

**On screen**

> Paste a link → get a verdict in seconds
> **Verified · Suspicious · Scam**, with the reasons
>
> AI reads the post · finds clones · checks the scam blacklist · flags edited documents

**Say**

> "Safefund is a scam checker for donation appeals. You paste an Instagram or LinkedIn link, and in seconds you get a verdict: verified, suspicious or scam, always with the reasons.
> AI reads the post and pulls out the claims: patient, diagnosis, clinic, amount, card number. Then we check them. Is this a copy of a known campaign with the card swapped? Is the card on our scam blacklist? Does the post use pressure tactics? Is the medical document edited or reused?
> Generic scam tools check links. We check the appeal itself, against a registry of known campaigns — and real campaigns live on our platform, where every donation sits on a tamper-proof public ledger."

---

## 3. Product demo — 2 min

*Criteria 3 + 4: technical execution and security (25) + MVP and demo quality (20)*

**On screen:** a **pre-recorded demo video** (decided 2026-11-17); the team prepares the flow. The table below is the suggested flow and voice-over; adjust it to the final recording.

| Time | Action | Say (short) |
|---|---|---|
| 0:00–0:25 | Paste the link to a real (synthetic) campaign post → **Verified** (mascot happy) | "A real campaign: it matches our registry, no scam signals." |
| 0:25–0:55 | Paste a cloned post: same photos and story, different card → **Scam**, original shown | "Same child, same story, different card. That's a clone, and here's the original." |
| 0:55–1:20 | Paste a post with a blacklisted card / pressure wording → **Scam / Suspicious**, reasons listed | "This card was reported before. And look at the reasons: urgency, a personal card, no clinic named." |
| 1:20–1:45 | Open the verified campaign on the platform → make a test donation → it appears on the public ledger | "Real campaigns live on the platform. Every donation goes on a public ledger." |
| 1:45–2:00 | Run the ledger tamper check → passes; (optional) show a tampered row being caught | "Each entry is hash-chained. Change one row, and we show exactly which one." |

**Video notes:** cut to 1:50 so there's slack; narrate live over it or record the voice-over in. The organisers' brief says *canlı nümayiş* (live demonstration), so keep https://safefund.vercel.app open in a tab: if the jury asks, paste one link live in Q&A to prove it works.

All demo data is synthetic ([[rules]]). If the Platform part runs long, cut the tamper-break and keep the pass.

---

## 4. Target user — 30 s

*Criterion 5: user, market and startup potential (15 pts)*

**On screen**

> **Donors** — anyone who has seen a "help this child" post
> **Families** — who need to prove their campaign is real
> **Banks** — who want to stop scam cards before the transfer

**Say**

> "Our first user is the donor: anyone in Azerbaijan who has seen a 'help this child' post and wondered if it's real. That's almost everyone on Instagram. The checker is free for them.
> Second, honest families, who are hurt by scams most because people stop trusting appeals. Safefund gives them a way to prove they're real.
> Third, banks, who want to stop scam cards before money leaves."

---

## 5. Impact / business potential — 45 s

*Criterion 5 (15 pts)*

**On screen**

> **0% fee on donations.** Institutions pay.
> Banks: scam-card feed + pre-transfer check
> Corporates: verified CSR giving
>
> Azerbaijan → Kazakhstan, Uzbekistan → global API
> $442B lost to scams worldwide every year — GASA 2025

**Say**

> "We will never take a cut of money for sick children. Donors and families use Safefund free.
> Banks pay. Every check adds to a database of scam cards and cloned appeals, and banks need exactly that to warn a customer before a transfer. Companies pay for verified giving with a public record of where their charity money went.
> Azerbaijan is our starting market, because it's small enough to cover with one bank. The same scam — a child's photo and a card number — runs in Kazakhstan and Uzbekistan, and globally people lose 442 billion dollars a year to scams. The checker works in any language, so it can grow into an API for banks and platforms anywhere."

---

## 6. Future — 15 s

**On screen**

> Tool → Platform → myGov identity → clinic verification

**Say**

> "Next: the full platform, then identity checks through FIN code and myGov, so every organiser is a verified real person. And finally clinics confirming the diagnosis and receiving the money directly."

---

## Q&A backup slides

Keep them hidden and open one only if asked. Answers: [[jury-qa]].

| # | Slide | Content |
|---|---|---|
| A1 | Fraud numbers | MIA 2024 breakdown table; GASA $442B; 64% of scams end within a day → [[fraud-statistics]] |
| A2 | Competition | No local verified platform or appeal checker; GoFundMe "cannot verify"; generic checkers scan links only → [[market-azerbaijan]] |
| A3 | Legal | Only NGOs may take donations, each one registered; the checker moves no money; Platform pays the clinic through a licensed bank → [[fundraising-law]] |
| A4 | Business model + sizing | Five revenue lines; local ~0.4–0.9M AZN/yr (estimate); fraud-detection market $32B → [[business-model]] |
| A5 | Security architecture | Hash-chained ledger, AES-256-GCM for medical files, role checks, what's mocked (auth) and why → [[architecture]], [[threat-model]] |

## Open points

- Pitch language: this draft is in English. Translate to Azerbaijani if the jury or the team prefers ([[open-questions]]).
- The demo video depends on the post-link checker being finished and the demo posts being seeded; the team owns the flow.
- Whether to show clinic confirmation: currently left out (clinics are last on the [[roadmap]]).

Sources: [[hackathon-program]], [[market-research-2026-11-17]], [[idea-brief]]
