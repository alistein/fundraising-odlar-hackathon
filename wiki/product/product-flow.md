# Product flow

The six steps a campaign goes through, from creation to public verification.

| # | Step | What happens | Threat addressed |
|---|---|---|---|
| 1 | Organiser is identified | Person opening the campaign confirms identity and relation to the patient | Fake campaign |
| 2 | Clinic confirms the case | Clinic verifies diagnosis and treatment cost through its own account | Fake campaign |
| 3 | Documents are checked | Uploaded certificates and invoices tested for editing, reuse and AI generation | Forged documents |
| 4 | Donations go to the clinic | Money routed to the clinic's account, never a personal card | Diverted funds |
| 5 | Everything is public | Each donation and payout appears on a ledger that cannot be quietly changed | Altered records |
| 6 | Anyone can verify | Donor pastes a campaign link or card number and learns whether it is verified or a copy | Cloned campaign |

A campaign is only live (able to collect) after step 2. Medical files are encrypted and visible only to the verifying clinic throughout.

## Demo path (from the pitch plan)

1. Happy path: create campaign → clinic confirms → donate → see ledger.
2. Attack path: submit a **forged invoice** and a **cloned campaign**; show both being caught.

See [[threat-model]] for controls, [[mvp-scope]] for what is actually built, [[pitch]] for timing.

Sources: [[idea-brief]]
