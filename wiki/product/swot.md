# SWOT

Strengths, weaknesses, opportunities and threats from the idea brief — raw material for the pitch and for Q&A answers. Items marked *(pivot)* were added on 2026-11-17 with the checker-first pivot ([[decisions]]).

## Strengths

- **Clear "why now":** the transfer limit removed the existing channel. → [[card-transfer-limits]]
- **Proven local harm:** about 1M AZN and 3 children's deaths in one case; ~200k AZN in another (Dec 2025); 22.4M AZN cyber fraud in 2024 (MIA). → [[fraud-cases]], [[fraud-statistics]]
- **Trust by design:** the organiser never holds the funds, removing the fraud opportunity.
- **Simple story:** everyone has seen a "help this child" post and wondered whether it was real.
- **Buildable in a day:** campaign page, clinic confirmation, public ledger, verify check.
- **Useful from day one** *(pivot)*: the checker needs no signed clinic and no payment licence. → [[scam-checker]]

## Weaknesses

- **Can look like fintech or charity:** reduced by the pivot — the checker leads, the platform is its ground truth.
- **Depends on clinics:** none are signed. Clinic verification is now the last roadmap stage ([[roadmap]]); until then "verified" rests on the registry, then on FIN code / myGov identity.
- **Cannot move real money yet:** needs a licensed payment partner or a registered foundation. Same: limits the registry only.
- **Thin registry at launch** *(pivot)*: with few verified campaigns most appeals return "unknown", not "verified".
- **Wrong verdicts** *(pivot)*: a real appeal marked scam hurts a family; a scam marked safe hurts donors. Verdicts must show reasons and stay "suspicious" when unsure.
- **Thin revenue:** taking a cut of donations for sick children is sensitive. Answer: 0% fee; banks, clinics and corporates pay. → [[business-model]]
- **Treatment abroad:** clinics in Türkiye are harder to verify and pay directly.

## Opportunities

- **Regulatory tailwind:** the regulator's stated goal is transparency and less fraud.
- **Bank partnership:** verified campaign accounts exempt from the five-transfer cap.
- **Beyond medical:** community collections, disaster relief, student and sports fundraising.
- **Corporate giving:** companies need proof of where charity money went.
- **Public scam checker:** builds the brand before any money flows. Now the core product.
- **Scam-card intelligence for banks** *(pivot)*: the blacklist of reported cards is data banks want.
- **Messenger bots** *(pivot)*: forward a post to a Telegram or WhatsApp bot and get the verdict where the scam is seen.

## Threats

- **Legal uncertainty:** only registered NGOs may take donations, each registered with the MoJ (ICNL 2018); structure = pay the clinic's invoice via a licensed bank, needs a lawyer. → [[fundraising-law]]
- **Banks build it themselves.**
- **Workarounds:** families spread collections across relatives' cards and e-wallets.
- **One bad campaign** that passes verification damages trust in the whole service.
- **Existing platforms:** no verified medical platform found locally; layf.az to check. → [[market-azerbaijan]]
- **Sensitive data:** a leak of children's medical documents would be serious.
- **Blacklist abuse** *(pivot)*: false reports against a real family's card; reports need review before they count.
- **Scammers adapt** *(pivot)*: appeals rewritten to dodge similarity and language signals.

## Likely Q&A questions

The weaknesses and threats are what judges will ask in the 2-minute Q&A: revenue model, legal basis for routing money, how clinics get onboarded, what stops a colluding clinic, what if a bank copies it. Added by the pivot: how accurate the AI is, what happens on a false verdict, who reviews scam reports, why auth is mocked. Unresolved ones are tracked in [[open-questions]].

Prepared answers: [[jury-qa]].

Sources: [[idea-brief]], [[market-research-2026-11-17]]
