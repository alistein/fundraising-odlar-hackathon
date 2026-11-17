# Judging criteria

Five criteria, 100 points total. The jury's stated focus: real working functionality, impact on a cybersecurity problem, and technical execution.

| # | Criterion | Pts | Jury's check questions | Our answer |
|---|---|---|---|---|
| 1 | Problem relevance and cybersecurity impact | 25 | Does it target a real, clearly defined cybersecurity problem? How much does it reduce risk, harm or likelihood? | Donation fraud: fake, forged, cloned campaigns. ~1M AZN case. Six threats ↔ six controls: [[threat-model]], [[fraud-cases]] |
| 2 | Innovation and differentiation | 15 | How does it differ from existing approaches? Is new tech/AI used purposefully? | Organiser never holds funds; clinic-side verification; AI forgery checks; clone detection. Competitors not yet checked: [[open-questions]] |
| 3 | Technical execution and security | 25 | Do architecture and core functions work? Secure design, data protection, technical justification? | Tamper-evident ledger, encrypted medical files, role separation — must be real, not mocked |
| 4 | MVP functionality and demo quality | 20 | Does it work in a real scenario? Core functions shown, usable, clear demo? | Happy path + two caught attacks: [[product-flow]], [[mvp-scope]] |
| 5 | User, market, startup potential; presentation | 15 | Clear target user and need? Commercialisation and scale? Clear presentation? | Families, donors, clinics; bank partnership, corporate giving: [[swot]], [[pitch]] |

## Implications for build priorities

- Criteria 1 + 3 + 4 = 70 pts, all rewarding a **working, visibly secure** product. A live caught-forgery moment is worth more than extra features.
- Criterion 3 explicitly asks for technical justification — be ready to explain how the ledger is tamper-evident and how files are encrypted.
- Criterion 2 is weakest until competition is checked.

Sources: [[hackathon-program]], [[idea-brief]]
