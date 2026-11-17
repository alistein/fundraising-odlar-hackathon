# Branding

Name, logo, mascot and its animated moods for Safefund. Colours and type come from [[design-system]].

## Name

**Safefund**, written lowercase as the wordmark: "safefund". Decided 2026-11-17. **(unverified)** — no trademark, company-name or domain check yet.

## Logo (decided 2026-11-17)

A friendly mascot face in a shield shape: lime face, ink-green outline and features, lime cheeks. Chosen over three geometric concepts (seal, two-link S, plus-lock), which stay in `brand/logo/concepts/` for reference. The team owns the Envite mascot that inspired the friendly style, but this mascot is a separate drawing, not a recolour of Envite's.

Wordmark: "safefund" in Nunito Sans ExtraBold, outlined, matching the app's type.

Kit in `brand/logo/kit/` (usage rules in its `README.md`): colour, one-colour, black, white, small-size cut, horizontal and stacked lockups, wordmark, favicon, app icon and PWA icons. Copies used by the app are in `product/public/brand/`, plus `src/app/favicon.ico`, `icon.svg` and `apple-icon.png`.

| Colour | HEX | Token |
|---|---|---|
| Face lime | `#ccf88e` | `--mascot-face` |
| Ink green | `#274a34` | `--mascot-ink` |
| Cheek lime | `#acf86c` | `--mascot-cheek` |
| Face / cheek yellow (check result only) | `#ffd75e` / `#ffbe3d` | `--mascot-face-warning` / `--mascot-cheek-warning` |
| Face / cheek coral (check result only) | `#ff8f7e` / `#ff6a57` | `--mascot-face-danger` / `--mascot-cheek-danger` |

## Mascot moods

Component: `product/src/components/mascot.tsx`; preview page `/kit`.

| Mood | Look | Where it appears |
|---|---|---|
| idle | Blinks | Header, verify page |
| thinking | Flat mouth, eyes scan | Verify page while typing |
| happy | Closed smiling eyes, one hop | After donating, creating a campaign, clinic confirming; clinic empty state |
| alert | Wide eyes, "o" mouth, one shake | Errors, clinic rejecting, broken ledger chain |

## Result faces (built 2026-11-17, SAFEFUN-9)

`<Mascot tone="safe|warning|danger" />` recolours the face only on the checker's result card; the header logo and every other mascot stay lime. Colour crossfades with opacity. Preview at `/kit`.

| Report tone | Face | Mood |
|---|---|---|
| ok (score ≥ 80) | lime | happy |
| neutral (60–79) | yellow | thinking |
| warn (40–59) | yellow | alert |
| danger (< 40) | coral | alert |

Demo inputs: `SF-4821` → lime, `4169 7388 1234 5678` → yellow, `SF-2210` → coral.

The header mascot listens to `setMascotMood()`, so any action on the page makes it react for 1.6 s. For the demo, the alert mood is the cue for caught fraud.

See [[decisions]], [[product-overview]], [[design-system]].
