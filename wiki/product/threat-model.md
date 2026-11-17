# Threat model

The threats the product defends against and the control for each — the core of the "why this is cybersecurity" argument. Reordered on 2026-11-17 so detection threats come first (see the pivot in [[decisions]]).

| Threat | Control in the product | Layer | Status |
|---|---|---|---|
| Cloned campaign | Similarity match against verified campaigns; a copy with a swapped card or link is flagged and the original shown | Checker | Working on branch `checker` |
| Scam appeal (never verified) | Memory of past checks: one card in several stories, one story with several cards. AI names the pressure tactics in an unregistered appeal | Checker | Working on branch `checker` |
| Forged documents | Reuse hash, editing-software trace, modified-after-creation, re-save trace, AI-generation marks; AI vision reads visible edits and checks name and amount against the campaign; pixel forensics mark pasted areas; only a clinic-confirmed file (code `SD-…`) is ever shown as genuine | Checker | Working on branch `checker` |
| Fake campaign | Clinic-side confirmation before a campaign goes live; organiser identity check | Registry | Working (identity mocked) |
| Diverted funds | Direct payout to the clinic; organiser has no access to the money | Registry | Working (test payments) |
| Altered records | Tamper-evident ledger of donations and payouts | Registry | Working |
| Data exposure | Medical files encrypted and visible only to the verifying clinic | Registry | Working on branch `checker` |

"Scam appeal" is new with the pivot; the other six are from the idea brief.

## Notes for judging

- Criterion 1 (25 pts) asks how far the approach reduces risk, harm or likelihood — this table is the answer; put it on a slide.
- Criterion 3 (25 pts) asks about secure design and data protection — the encryption and tamper-evident ledger must be real in the demo, not mocked. See [[judging-criteria]].
- The three checker rows carry the AI and human-centric track claims; until they work, the claims are empty. See [[tracks]].
- Residual risks: a colluding clinic; a false "verified" or false "scam" verdict; one fraud that passes verification damages trust in the whole service; a leak of children's medical documents would be serious. See [[swot]].

Pipeline: [[scam-checker]]. Build order: [[mvp-scope]].

Sources: [[idea-brief]], [[hackathon-program]]
