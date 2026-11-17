# Roadmap

> **2026-11-17 (later):** the core is now the **Platform** — campaigns created on Safefund through AI gate → myGov gate. The link checker (Tool) is a free extra for posts elsewhere. The stage table below predates this; see [[decisions]].

Safefund in two stages, Tool and then Platform, followed by identity checks (FIN code / myGov) and, last, clinic verification. Decided 2026-11-17 ([[decisions]]).

## Stages

| # | Stage | What it is | In MVP? | Market |
|---|---|---|---|---|
| 1 | **Tool** (the checker) | Paste an Instagram or LinkedIn link to a fundraising post into the Checker and see whether the campaign is legit, with the reasons | **Yes**: the hackathon MVP, being built now by a teammate | Any market |
| 2 | **Platform** | The full product: campaign pages, donations, public ledger, organiser accounts, reports | **Partly**: a half-built version (campaign pages, test donations, public ledger from Sprint I) ships with the MVP; the full Platform comes later | Any market |
| 3 | **Identity verification: FIN code / myGov** | Confirm the organiser's (and patient's) real identity through the Azerbaijani personal ID number (FIN code) and the myGov e-government portal | **Mocked**: the MVP has a mock myGov sandbox as gate 2 after the AI checker (2026-11-17, SAFEFUN-8); real integration is post-MVP | **Azerbaijan only**: myGov is Azerbaijani. Other countries need their own e-ID or KYC provider |
| 4 | **Clinic reports** (optional) | A clinic can report a campaign that misuses its name as fake, and is contacted through its own email. Clinics do not register or confirm campaigns (changed 2026-11-17) | Not part of the core flow or business plan | Azerbaijan first |

## What this means for "legit" in the MVP

With only a mocked myGov (gate 2, synthetic data) and no clinic in the MVP, the Tool's verdict (gate 1) rests on:

- **Clone detection:** the same story or photos with a different card or account.
- **Blacklist:** reported scam cards, IBANs and accounts.
- **Scam signals:** urgency pressure, a personal-card request, no clinic named, reused or edited documents.
- **The Safefund registry:** demo campaigns seeded as verified (synthetic).

A "verified" verdict in the MVP therefore means "matches a campaign in our registry, with no scam signals". It doesn't yet mean identity-checked or clinic-confirmed. Say this plainly if the jury asks. → [[jury-qa]]

## Relation to existing code

Clinic confirmation, test donations and the ledger were already built in Sprint I ([[mvp-scope]]). This is the half-built Platform that ships with the MVP (clarified 2026-11-17). The Tool is the headline; the Platform part is shown as working but unfinished. The clinic-confirmation step in that code no longer matches the product: since 2026-11-17 clinics only report fakes, they do not confirm ([[decisions]]). The core flow is AI gate → myGov gate.

Related: [[product-overview]] · [[scam-checker]] · [[go-to-market]] · [[business-model]]

Sources: team decision in chat, 2026-11-17
