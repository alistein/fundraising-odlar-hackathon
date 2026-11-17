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

## Mascot moods

Component: `product/src/components/mascot.tsx`; preview page `/kit`.

| Mood | Look | Where it appears |
|---|---|---|
| idle | Blinks | Header, verify page |
| thinking | Flat mouth, eyes scan | Verify page while typing |
| happy | Closed smiling eyes, one hop | After donating, creating a campaign, clinic confirming; clinic empty state |
| alert | Wide eyes, "o" mouth, one shake | Errors, clinic rejecting, broken ledger chain |

The header mascot listens to `setMascotMood()`, so any action on the page makes it react for 1.6 s. For the demo, the alert mood is the cue for caught fraud.

See [[decisions]], [[product-overview]], [[design-system]].
