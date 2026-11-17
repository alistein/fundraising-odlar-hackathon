# Product flow

Two flows since the 2026-11-17 pivot: the donor's check (hero) and the campaign's path to the verified registry (ground truth).

> **2026-11-17 (later):** core flow is **AI gate → myGov gate**. Clinics no longer confirm campaigns; optionally they can report a fake (step 7 below). → [[decisions]], [[roadmap]]

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

Changed 2026-11-17: myGov replaces clinic confirmation; clinic reports are an optional last stage.

| # | Step | What happens | Threat addressed |
|---|---|---|---|
| 1 | Organiser registers the campaign | Creator wizard `/campaigns/new` (no login, mock demo organiser): story, patient, clinic named, one declared card; gets a public SF code | Fake campaign |
| 1b | Documents + AI gate | Organiser uploads medical documents (forgery check on upload), then the AI gate checks: documents present and clean, story not cloned, card not reused or seen in scams, pressure tactics (when the model is on). Fail stops the campaign | Fake campaign, forged documents |
| 2 | MyGov gate | Organiser confirms identity through the mock myGov consent screen (FIN + name); the campaign goes live | Fake campaign |
| 3 | Documents are checked | Uploaded certificates and invoices tested for editing, reuse and AI generation | Forged documents |
| 4 | Donations go to the clinic | Money routed to the clinic's account, never a personal card | Diverted funds |
| 5 | Everything is public | Each donation and payout appears on a ledger that cannot be quietly changed | Altered records |
| 6 | Anyone can verify | The campaign's identifiers feed the checker in flow A | Cloned campaign |
| 7 | Clinic can report (optional) | A clinic whose name is misused reports the campaign; we confirm by writing to the clinic's own email; a confirmed report blocks it | Fake campaign using a real clinic's name |

A campaign is only live (able to collect) after step 2. Medical files are encrypted throughout.

## Demo path

1. Paste a real campaign → **verified**.
2. Paste a clone with a swapped card number → **scam**, original shown.
3. Upload a forged invoice → **flagged**, signals shown.
4. Short: how a campaign earns verification (myGov consent, donation, ledger tamper check); `SF-2210` shows a clinic-reported fake.

See [[threat-model]] for controls, [[mvp-scope]] for what is actually built, [[pitch]] for timing.

Sources: [[idea-brief]]
