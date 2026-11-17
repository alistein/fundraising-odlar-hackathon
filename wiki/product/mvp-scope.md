# MVP scope

What gets built on build day (17 Nov 2026), by sprint. Deadline: submission 22:00–22:30 with a demo/MVP link.

| Sprint | Time | What gets built |
|---|---|---|
| I | 11:00–14:00 | Data model and three roles (organiser, clinic, donor). Campaign creation and the clinic confirmation step. |
| II | 15:00–18:00 | Document check (reuse and tamper signals), donation flow with test payments, public ledger. |
| III | 19:00–22:00 | "Verify this campaign" page with clone detection, encryption of medical files, demo data and rehearsal. |

Mentor checkpoint 18:00–19:00 sits between II and III — have the happy path demoable by then. Full timetable: [[schedule]].

## Must work in the demo

1. Create a campaign (organiser).
2. Clinic confirms it.
3. Donate (test payment) and see it on the public ledger.
4. Forged invoice is caught.
5. Cloned campaign is caught on the verify page.

## Constraints

- All payments are test payments. No real clinic, patient or bank system is touched. See [[rules]].
- Synthetic demo data only.
- Localized for Azerbaijan (AZN, Azerbaijani UI) — team direction, 2026-11-17.
- Submission needs a reachable demo link, so the app must be deployed, not only local.

## Explicitly out of scope

- Real money movement (needs a licensed payment partner or registered foundation).
- Real clinic onboarding.
- Treatment-abroad clinics (e.g. Türkiye).

## Progress (2026-11-17)

Working: 1, 2, 3 of the must-work list, plus ledger tamper detection. Not built: 4 (document check), 5 (clone detection), file upload/encryption wiring, deployment. Details: [[architecture]].

Stack and other build choices: [[decisions]].

Sources: [[idea-brief]], [[hackathon-program]]
