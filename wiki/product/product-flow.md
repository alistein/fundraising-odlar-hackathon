# Product flow

Two flows since the 2026-11-17 pivot: the donor's check (hero) and the campaign's path to the verified registry (ground truth).

## A. Check flow — donor

| # | Step | What happens |
|---|---|---|
| 1 | Paste | Donor pastes appeal text, a link, a card number, a screenshot or a document |
| 2 | Extract | AI pulls out patient, diagnosis, clinic, amount and payment details |
| 3 | Match | Compared with the verified registry, the scam blacklist and known campaign texts |
| 4 | Verdict | Verified, suspicious or scam, with the reasons; a clone links to the original |
| 5 | Act | Donate to the verified campaign, or report the scam |

Pipeline detail: [[scam-checker]].

## B. Registry flow — how a campaign earns "verified"

The six steps from the idea brief, unchanged.

| # | Step | What happens | Threat addressed |
|---|---|---|---|
| 1 | Organiser is identified | Person opening the campaign confirms identity and relation to the patient | Fake campaign |
| 2 | Clinic confirms the case | Clinic verifies diagnosis and treatment cost through its own account | Fake campaign |
| 3 | Documents are checked | Uploaded certificates and invoices tested for editing, reuse and AI generation | Forged documents |
| 4 | Donations go to the clinic | Money routed to the clinic's account, never a personal card | Diverted funds |
| 5 | Everything is public | Each donation and payout appears on a ledger that cannot be quietly changed | Altered records |
| 6 | Anyone can verify | The campaign's identifiers feed the checker in flow A | Cloned campaign |

A campaign is only live (able to collect) after step 2. Medical files are encrypted and visible only to the verifying clinic throughout.

## Demo path

1. Paste a real campaign → **verified**.
2. Paste a clone with a swapped card number → **scam**, original shown.
3. Upload a forged invoice → **flagged**, signals shown.
4. Short: how a campaign earns verification (clinic confirms, donation, ledger tamper check).

See [[threat-model]] for controls, [[mvp-scope]] for what is actually built, [[pitch]] for timing.

Sources: [[idea-brief]]
