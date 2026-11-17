# Deck

Slide text and speaker script for the 18 Nov pitch, following the organisers' format: 5 min talk and demo, then 2 min Q&A. Each slide gives the on-screen text (short) and what to say (timed at ~140 words/min). Draft, 2026-11-17.

**Slides:** https://claude.ai/artifact/Li9v6gMuq5oXNTkm9X28cv (private until shared; 14 slides + 3 backup, problem opens with an animated scene: donors' money flowing to a family, then diverted to a scammer's card; click-by-click reveals, app tokens and mascot). **Slides and speaker notes are in Azerbaijani** (2026-11-17); the English text below is the reference version.

> **Case fit (2026-11-17):** the Instagram case (Həsənov, ~200k AZN) is exactly what the Tool catches, so it leads the problem. The thalassemia case (Seidova, ~1M AZN) was a fake medical-travel intermediary, not a donation post; only clinic verification and paying the clinic directly would stop it, it was on the Future slide until 2026-11-17 and is now Q&A material only. See [[fraud-cases]].

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

> **200,000 AZN** collected with sick babies' photos on Instagram; the money went to the scammer's own card.
> A sick child's photo + an urgent story + a personal card number = the perfect scam.
>
> 22.4M AZN stolen in 16,804 cyber-fraud cases in 2024 — MIA
> Charity fraud isn't even counted.

**Say**

> "Last December police detained a man who had opened Instagram pages like 'Help for my baby Zahra', posted photos and videos of other people's sick babies, and collected almost 200,000 manat on his own cards.
> It isn't one case: police have detained others for the same scheme.
> This is social engineering. A photo, a sad story, a card number — and the donor has no way to check. The Interior Ministry counted 22 million manat lost to cyber fraud in 2024, and donation scams aren't even counted separately.
> And since August, each card takes only five transfers a day, so appeals are spreading across even more unfamiliar cards."

---

## 2. Solution — 45 s

*Criterion 2: innovation and differentiation (15 pts)*

**On screen** (animated scene, updated 2026-11-17 after the core moved to the platform, see [[decisions]])

> Title: "Hər kampaniya yoxlamadan keçir". Family on the left, donors on the right, three gates between: Sənədlər, Süni intellekt, MyGov.
> Click 1: a campaign card travels through the gates, each gate lights with a check, the card reaches the donors with a "Yayımda" badge.
> Click 2: a red fake card is stopped at the AI gate, shakes and drops.
> Click 3: coins flow from the donors through the Safefund mascot to the family.
> Click 4: "Başqa platformalar" row: a link is typed, Yoxla is pressed, "Dələduzluq" pops.

**Say**

> "Safefund is a platform where medical campaigns are created, and none goes live unchecked. First the medical documents are checked for forgery. Then AI checks whether the story was copied from another campaign and whether the card has appeared in scams. Then the organiser's identity is confirmed with a FIN code through MyGov. Only then does the campaign go live, and the money is paid through Safefund, not to a personal card.
> For campaigns posted elsewhere, on Instagram or LinkedIn, we have a free tool: paste the link and see the verdict."

Slide `how` (next) still explains the link checker's four checks; keep or cut it depending on time.

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

**Say**

> "We will never take a cut of money for sick children. Donors and families use Safefund free.
> Banks pay. Every check adds to a database of scam cards and cloned appeals, and banks need exactly that to warn a customer before a transfer. Companies pay for verified giving with a public record of where their charity money went."
> (Market expansion and the 442B figure moved to the Future slide on 2026-11-17.)

---

## 6. Future — 15 s

**On screen** (updated 2026-11-17: next steps are market expansion; clinic step and thalassemia line removed)

> İndi, MVP: Platforma və link aləti → Azərbaycan: real MyGov və bank tərəfdaşı → Mərkəzi Asiya: Qazaxıstan və Özbəkistan → Qlobal: banklar və platformalar üçün API
> Each click draws the track to the next step. Last click: **442 mlrd $** hər il dələduzlara itirilir (GASA and Feedzai 2025).
> The separate Market slide was merged in here and removed (2026-11-17).

**Say**

> "Today the platform and the link tool work. Next, in Azerbaijan, the real MyGov integration and a licensed bank partner for payouts. Then Kazakhstan and Uzbekistan, where the same sick-child scam runs. And finally our checks as an API for banks and donation platforms anywhere, because people lose 442 billion dollars a year to scams."

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

- Pitch language: Azerbaijani, decided 2026-11-17; the deck is translated, with no em dashes or middle dots and no full stops on slide lines.
- The demo video depends on the post-link checker being finished and the demo posts being seeded; the team owns the flow.
- Whether to show clinic confirmation: currently left out (clinics are last on the [[roadmap]]).

Sources: [[hackathon-program]], [[market-research-2026-11-17]], [[idea-brief]]
