# Pitch

Required format: 5 minutes pitch/demo + 2 minutes Q&A, 18 Nov 10:30–13:00. Section timings are fixed by the organisers; content rewritten on 2026-11-17 for the checker-first pivot (see [[decisions]]).

| Part | Time | Organiser's prompt | Our content |
|---|---|---|---|
| Problem | 45 s | What problem do you solve? | Donation scams are social engineering: fake, cloned and forged "help this child" appeals. One Instagram scammer collected about 200k AZN with other people's sick babies' photos. Since August the card limit pushes collections onto new cards, and donors cannot tell which are real. |
| Solution | 45 s | How does it work? | Safefund checks any appeal in seconds: AI extracts the claims, matches them against clinic-verified campaigns and a scam blacklist, and tests documents for forgery. Verified campaigns pay the clinic directly on a tamper-evident ledger. |
| Product demo | 2 min | Live demo of the working part | Paste a real campaign → verified. Paste a clone with a swapped card → scam, original shown. Upload a forged invoice → flagged. Then 20 s on how a campaign earns verification and the ledger tamper check. |
| Target user | 30 s | Who will use it? | Donors first; then families raising money, clinics, charities and banks. |
| Impact / business potential | 45 s | Impact and application/business potential | Free public checker builds the registry and brand; bank partnership (scam-card intelligence, verified campaign accounts exempt from the cap); corporate giving. |
| Future | 15 s | Next direction | Telegram / WhatsApp bot, first clinic pilot, licensed payment partner. |
| Q&A | 2 min | Jury questions | Prep from [[swot]] weaknesses/threats |

Full slide text and speaker script: [[deck]] (2026-11-17). The content column above predates the Tool/Platform roadmap; [[deck]] is current.

## Notes

- Open the demo with a scam being caught, not with a campaign being created. See [[product-overview]].
- Build the pitch as an HTML artifact using the app's `tokens.css` so slides and product match. See [[design-system]].
- Demo is a **pre-recorded video** (decided 2026-11-17); keep the live app open for a Q&A check. See [[deck]].
- The demo is 40% of the talk time and maps to 45 pts of criteria 3 and 4 — rehearse it in Sprint III, with cached verdicts as a fallback if the AI call is slow. See [[judging-criteria]], [[scam-checker]].
- Put the threat table on a slide. See [[threat-model]].
- Problem-slide numbers: ~200k AZN Instagram case (Dec 2025); thalassemia case (1M AZN, 3 deaths) moved to the Future slide as the reason for clinic verification; 22.4M AZN / 16,804 cyber-fraud cases in 2024 (MIA). See [[fraud-cases]], [[fraud-statistics]].
- Impact slide: [[business-model]], [[go-to-market]], [[market-global]]. Q&A prep: [[jury-qa]].
- Technical check is 10:00–10:30 on the day. See [[schedule]].

Sources: [[hackathon-program]], [[idea-brief]], [[market-research-2026-11-17]]
