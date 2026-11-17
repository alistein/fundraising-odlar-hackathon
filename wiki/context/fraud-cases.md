# Fraud cases

Documented cases of medical-fundraising fraud, used as evidence on the problem slide. Azerbaijan first, then neighbours and global examples.

## Azerbaijan

| Case | Loss | Victims / method | Date | Source |
|---|---|---|---|---|
| Nurida Seidova (Urmedhelp, My Doc Tour) and 2 others: promised bone-marrow transplants in Türkiye | ~1,000,000 AZN (~$588k) | Parents of 36 children with thalassemia. **3 children died** without the transplant; one father also died | Case opened Feb 2023; trial in the Baku Grave Crimes Court (as of 2 Jul 2024) | JAM News |
| Rəsul Həsənov, 30: Instagram pages ("Zəhra balama yardım", "Əli üçün yardım"…) with sick infants' photos and his own card number | **~200,000 AZN**, donations of 1–500 AZN each | Donors; families whose photos were used got nothing | 16 Dec 2025 | MIA via mia.az (official) |
| Orxan Hacıyev: stole the card details a family posted to raise money for their ill child | Not stated | One family | ~Oct 2026 **(unverified date)** | medicina.az |
| Rafiq Cəfərov: Instagram page with photos of a person needing treatment, his own card | Not stated | Followers | Not stated | oxu.az |
| Feyruz Qəhrəmanov (b. 2002): card linked to a sick-child page | ~10,000 AZN | Donors | Not stated | xeberaz.info |
| Elməddin Babayev, 23 (Naxçıvan): fake female profiles; posted disabled children as "his own" | Not stated | Donors | Not stated | lent.az |

**Fit with Safefund (re-read 2026-11-17):**

| Case | What it was | Which stage stops it |
|---|---|---|
| Həsənov (~200k AZN) | Fake Instagram appeals with other people's sick babies, his own cards | **Tool (MVP)**: clones, card blacklist, scam signals. Leads the problem slide |
| Seidova (~1M AZN) | Medical-travel intermediary (Urmedhelp, My Doc Tour) promised transplants in Türkiye and kept the money. The article doesn't mention public appeals, card numbers or how families paid | **Clinic verification + paying the clinic directly** (last roadmap stage). Not a donation-post scam: don't present it as one |

**The pattern:** a photo of a sick child, an emotional story, and **a personal card number**. This is exactly the input the [[scam-checker]] is built for. Since the transfer limits, appeals spread across more cards, so donors see unfamiliar card numbers more often ([[card-transfer-limits]]).

## Region and global

| Case | Loss | Date | Source |
|---|---|---|---|
| Kazakhstan, Shymkent: Instagram page with photos of children with cancer | >32M tenge, ~6,000 transfers | Sep 2024 | Tengrinews |
| Uzbekistan: appeals with photos of children who had already recovered; found when a father saw his child's photo | Not stated | Jan 2026 | Zamin.uz |
| Greece: unlicensed NGO raising money "for sick children" | ~€4M raised, ~€1.1M passed on | Nov 2026 | Keep Talking Greece |

## Gaps

- Court outcome of the Seidova case.
- Exact dates for the Cəfərov, Qəhrəmanov and Babayev cases.

Tracked in [[open-questions]]. Aggregate numbers: [[fraud-statistics]].

Used in: [[product-overview]], [[pitch]], [[judging-criteria]], [[jury-qa]].

Sources: [[idea-brief]], [[market-research-2026-11-17]]
