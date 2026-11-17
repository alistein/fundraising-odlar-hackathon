# Threat model

The six threats the product defends against and the control for each — the core of the "why this is cybersecurity" argument.

| Threat | Control in the product | MVP sprint |
|---|---|---|
| Fake campaign | Clinic-side confirmation before a campaign goes live; organiser identity check | I |
| Forged documents | Checks for edited, reused or AI-generated medical certificates and invoices | II |
| Cloned campaign | Detection of copies of a real campaign that swap in a different card number or link | III |
| Diverted funds | Direct payout to the clinic; organiser has no access to the money | II |
| Altered records | Tamper-evident ledger of donations and payouts | II |
| Data exposure | Medical files encrypted and visible only to the verifying clinic | III |

## Notes for judging

- Criterion 1 (25 pts) asks how far the approach reduces risk, harm or likelihood — this table is the answer; put it on a slide.
- Criterion 3 (25 pts) asks about secure design and data protection — the encryption and tamper-evident ledger must be real in the demo, not mocked. See [[judging-criteria]].
- Residual risk named in [[swot]]: one fraud that passes verification damages trust in the whole service; a leak of children's medical documents would be serious.

Sprint mapping from [[mvp-scope]].

Sources: [[idea-brief]], [[hackathon-program]]
