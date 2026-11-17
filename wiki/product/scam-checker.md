# Scam checker

The hero feature after the 2026-11-17 pivot: anyone pastes a donation appeal and gets a verdict — verified, suspicious or scam — with the reasons. Design only; nothing on this page is built yet (see [[architecture]]).

MVP focus (2026-11-17): **Instagram and LinkedIn post links** are the primary input; the other inputs below are secondary. → [[roadmap]]

## Input

One box on the home page. Accepts any of:

| Input | Example |
|---|---|
| Appeal text | A copied Instagram / WhatsApp / Telegram post |
| Link | A Safefund campaign URL, a link from the post, or a social-post link (Instagram / LinkedIn); the post text and images are fetched and checked. Demo: our own synthetic posts only (decided 2026-11-17) |
| Card number or IBAN | The number the post asks donors to send money to |
| Screenshot | Image of the post |
| Document | Medical certificate or invoice attached to the appeal |

## Pipeline

| # | Step | How | AI? |
|---|---|---|---|
| 1 | Extract claims | LLM reads the text or screenshot and returns patient, diagnosis, clinic, amount, card / IBAN, links | Yes |
| 2 | Registry match | Exact match of link, card or IBAN against verified campaigns | No |
| 3 | Clone detection | Text similarity (`pg_trgm`) of title and story against verified campaigns; same story with a different card or link = clone | No |
| 4 | Blacklist | Card / IBAN / link looked up in reported scam identifiers | No |
| 5 | Scam-language signals | LLM scores urgency pressure, personal-card request, no clinic named, no documents | Yes |
| 6 | Document forgery check | Hash reuse, file metadata (editing software, dates), AI verdict on visual tampering or generation | Yes |

## Verdict

| Verdict | When | Mascot mood |
|---|---|---|
| Verified | Link or account belongs to a campaign in the registry (MVP: seeded; later identity- and clinic-checked) | happy |
| Suspicious | No registry match and scam signals present, or a document flagged | thinking |
| Scam | Clone of a verified campaign with swapped payment details, or a blacklisted identifier | alert |

Every verdict lists its reasons, and for a clone it links the original verified campaign.

## Where the ground truth comes from

- **Verified registry:** in the MVP, synthetic seeded campaigns. Later, organisers identity-checked through FIN code / myGov (Azerbaijan), and last, clinic-confirmed campaigns → [[roadmap]], [[product-flow]]. Each entry needs its public identifiers stored (post URL, account, card / IBAN).
- **Blacklist:** identifiers reported by users and confirmed as scams. Seeded with synthetic entries for the demo.

## Data model additions (planned)

| Table / column | Purpose |
|---|---|
| `scam_reports` (identifier, kind, note, created_at) | Blacklist of cards, IBANs and links |
| `checks` (input hash, verdict, signals, created_at) | Audit trail of checks; feeds a "scams caught" counter |
| `pg_trgm` extension | Similarity search on campaign title and story |

## Demo data needed

Five or six synthetic verified campaigns, two clones with swapped card numbers, three blacklisted cards, one clean and one forged invoice. Rules on synthetic data: [[rules]].

## Stage risk

The LLM call must answer in a few seconds. Cache the verdicts of the demo inputs as a fallback.

Related: [[threat-model]] · [[mvp-scope]] · [[pitch]] · [[open-questions]]

Sources: [[idea-brief]], [[hackathon-program]]
