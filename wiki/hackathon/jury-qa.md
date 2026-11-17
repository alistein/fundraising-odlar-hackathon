# Jury Q&A

Prepared answers for the 2-minute Q&A on business, market, GTM and evidence. Keep each answer under 20 seconds. Technical questions are in [[swot]] and [[threat-model]].

## Problem and evidence

| Question | Answer | Page |
|---|---|---|
| Is this a real problem or one case? | A pattern. A man arrested in Dec 2025 had collected ~200k AZN on Instagram with other people's sick babies' photos and his own cards; at least four more detentions for the same scheme. | [[fraud-cases]] |
| How big is fraud in Azerbaijan? | Official MIA figure: 22.4M AZN stolen in 16,804 cyber-fraud cases in 2024, plus 10,000+ others. Charity fraud isn't even counted separately — nobody measures it. | [[fraud-statistics]] |
| Why now? | Since August each card takes only 5 incoming transfers a day and 20k AZN a month. Collections are spreading across more cards, and donors can't tell which are real. | [[card-transfer-limits]] |
| And globally? | $442B lost to scams a year (GASA 2025); 64% of scams finish within a day, so the check has to happen before the transfer. | [[fraud-statistics]] |

## Market and competition

| Question | Answer | Page |
|---|---|---|
| Who are your competitors? | No verified medical-crowdfunding platform or appeal checker found in Azerbaijan. GoFundMe says in its terms it can't verify organisers. Generic scam checkers scan links, not appeals, cards or medical documents. | [[market-azerbaijan]] |
| Isn't Azerbaijan too small? | It's the beachhead: one bank and a few clinics cover a big share. The same "child photo + card number" scam runs in Kazakhstan and Uzbekistan, and Türkiye clinics serve all of them. | [[market-global]] |
| What's the market size? | Locally ~0.4–0.9M AZN/yr from banks, clinics and CSR (our estimate). Globally we sell into fraud detection: $32B in 2025; banks alone spend $21B. | [[market-azerbaijan]], [[market-global]] |
| What if a bank builds this? | A bank sees only its own cards. We see appeals across all banks and platforms, plus clinic-verified ground truth. Banks are our customers, not our competitors. | [[business-model]] |

## Business model and GTM

| Question | Answer | Page |
|---|---|---|
| How do you make money? | Not from donations: 0% fee. Banks pay for the scam-card feed and check API; clinics for the verified-case workflow; corporates for verified CSR giving. | [[business-model]] |
| How do you get users? | Free checker plus a Telegram/WhatsApp bot, where appeals are forwarded. "Check before you send" on Instagram and TikTok, where the scams live. | [[go-to-market]] |
| What's the roadmap? | Two stages. First the Tool: paste an Instagram or LinkedIn link and see if the campaign is legit (that's the MVP). Then the full Platform (a half-built version is already in the MVP). Then FIN code / myGov identity checks in Azerbaijan. Clinics don't confirm; they can report a fake that uses their name. | [[roadmap]] |
| How do you know a campaign is legit without clinics or ID checks? | Today: clone detection, a scam blacklist and scam signals, matched against our registry. In the MVP, "verified" = registered and passed the (mock) myGov gate. We say so openly. | [[roadmap]], [[scam-checker]] |
| How do you get clinics? | We don't depend on them. The flow is AI gate → myGov gate. A clinic can report a campaign that misuses its name, and we confirm through the clinic's own email. | [[go-to-market]] |
| Does myGov work outside Azerbaijan? | No. Abroad we plug in that country's e-ID or a KYC provider; the Tool itself works anywhere. | [[market-global]] |

## Legal

| Question | Answer | Page |
|---|---|---|
| Is it legal to collect donations? | Private people can't legally run donation drives, and NGOs must register each donation. So we don't collect donations: the checker handles no money, and verified campaigns pay the clinic's invoice through a licensed bank. | [[fundraising-law]] |
| What about the new crowdfunding law? | Law 450-VIIQ comes into force on 24 January 2027. It covers investment crowdfunding only (shares and bonds, under the Central Bank). Donation crowdfunding still has no regime of its own: that's the gap we fill. | [[fundraising-law]] |
| Do you need a licence? | Not for the checker. For money we partner with a licensed bank or payment institution; we never hold funds. | [[fundraising-law]] |
| What about personal data? | Synthetic data in the demo. In production, medical files are encrypted and only the clinic and the reviewer see them; banks get card-level signals only. | [[threat-model]] |

## Trust and accuracy

| Question | Answer | Page |
|---|---|---|
| What if you flag a real family as a scam? | A verdict always shows reasons; when unsure it says "suspicious", not "scam"; reports are reviewed before a card is blacklisted; families can get verified to clear it. | [[scam-checker]] |
| Would Safefund have stopped the 1M AZN thalassemia case? | Not the link checker: that was a medical-travel middleman, not a social post. Our last stage would, because the clinic confirms the patient and is paid directly, so no middleman holds the money. That's why it's on the roadmap. | [[fraud-cases]], [[roadmap]] |
| What stops a clinic colluding? (clinic stage) | The clinic is paid directly and is identifiable; payouts sit on a public, tamper-evident ledger; amounts are checked against typical treatment costs. | [[threat-model]] |

Sources: [[market-research-2026-11-17]], [[icnl-crowdfunding-2018]], [[idea-brief]]
