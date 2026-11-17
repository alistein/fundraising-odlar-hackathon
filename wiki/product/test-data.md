# Test data

Synthetic inputs for trying the campaign creator, the MyGov gate, clinic reports and the link checker by hand.

Sample files are in `product/demo-docs/`. All data is made up. The live database is shared, so reseed (`pnpm db:seed`) after testing to remove test campaigns.

## 1. Campaign that passes (header → "Kampaniya yarat")

| Field | Value |
|---|---|
| Başlıq | Səbinənin diz əməliyyatı |
| Hekayə | On iki yaşlı Səbinə idmanda dizini zədələyib, bağ bərpası əməliyyatı lazımdır. Ailə vəsait toplayır. |
| Xəstə | Səbinə M. |
| Qohumluq | Ata |
| Diaqnoz | Ön çarpaz bağ zədəsi |
| Məbləğ | 7500 |
| Klinika | Demo Mərkəzi Klinika |
| Sənəd | `clean-invoice.pdf` (or `.png` / `.jpg`) |
| MyGov | any FIN, Ad, Soyad, e.g. `TEST123` / Test / İstifadəçi |

Expected: AI gate passes ("Fırıldaq əlaməti tapılmadı"), MyGov confirms, the campaign opens live with **AI** and **MyGov** badges and a donation form.

## 2. Campaigns the AI gate stops

| Case | What to do | Expected reason |
|---|---|---|
| Forged document | Upload `forged-invoice.pdf` (or `.png` / `.jpg`, `photo-forged.png`) | Document shows "Şübhəli"; gate fails with the file's signal |
| Copied story | Use the story of an existing campaign, e.g. "6 yaşlı Əlinin anadangəlmə ürək qüsuru var və təcili açıq ürək əməliyyatına ehtiyacı var. Həkimlər əməliyyatın yaxın aylarda edilməsini məsləhət görür. Ailə xərci təkbaşına ödəyə bilmir." | "Bu hekayə başqa kampaniyada var: Əlinin ürək əməliyyatı üçün yardım" |

The gate runs once per campaign and shows each step. A failed campaign can still go through MyGov, but then stays pending ("AI problem tapıb, yoxlanılır") instead of going live. ("No documents" is also a fail, but the wizard's button stays disabled until a file is uploaded.)

## 3. Existing demo campaigns

| Campaign | State | Try |
|---|---|---|
| Əli, `SF-4821` | Live, AI + MyGov | Donate (test payment) |
| Leyla, `SF-3307` | AI passed, waiting for MyGov | "MyGov ilə təsdiqlə" with any values → goes live |
| Aytac, `SF-2210` | Blocked: confirmed clinic report | Page shows "Klinika saxta kimi bildirib" |
| Any live campaign | — | "Klinika olaraq bildir": clinic name, `test@demo-klinika.test`, a reason → toast; the checker then shows a pending report (score capped at 70) |

## 4. Link checker (home page)

Only links are accepted, e.g. `https://instagram.com/p/demo123`. Until SAFEFUN-6 (Emil) adds post fetching, a link mostly returns "Təsdiqlənməyib". The file button accepts `clean-invoice.*`, `forged-invoice.*`, `photo-forged.png` and `appeal-screenshot.png`.

Related: [[product-flow]] · [[scam-checker]] · [[mvp-scope]]

Sources: team decisions in chat, 2026-11-17
