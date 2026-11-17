# Safefund logo kit

The mark is a friendly face in a shield shape: safe, warm, and watching out for donors.

## Files

| File | Use |
|---|---|
| `safefund-mascot.svg` | Colour master |
| `safefund-mascot-mono.svg` / `-black` / `-white` | One colour: print, stamps, dark backgrounds |
| `safefund-mascot-small.svg` | 32 px and below (heavier outline, bigger eyes, no cheeks) |
| `safefund-horizontal.svg` (+ `-mono`, `-black`, `-white`) | Default lockup |
| `safefund-stacked.svg` (+ `-mono`) | Square spaces, slides, posters |
| `safefund-wordmark.svg` (+ `-mono`) | Wordmark alone |
| `web/` | `favicon.ico`, `favicon.svg`, app icon, Apple touch icon, PWA icons, `site.webmanifest`, `head-snippet.html` |
| `png/` | 1200 px PNG of the horizontal lockup |

All files are pure paths (no live text). Wordmark is Nunito Sans ExtraBold (weight 850), outlined; SIL Open Font License.

## Colour

| Name | HEX | Token |
|---|---|---|
| Face lime | `#ccf88e` | `--mascot-face` |
| Ink green | `#274a34` | `--mascot-ink` |
| Cheek lime | `#acf86c` | `--mascot-cheek` |
| Shine | `#ffffff` | `--mascot-shine` |

## Rules

- **Clear space:** the width of one eye (≈ 10 % of the mascot height) on every side.
- **Minimum size:** 24 px for the colour master; below that use `safefund-mascot-small.svg`. Horizontal lockup no smaller than 96 px wide.
- **Backgrounds:** colour version on white or warm off-white; white version on ink green or photos.
- **Don't** recolour the face, add outlines or shadows, stretch, rotate, or put the colour version on lime.

## Moods (in the app)

`<Mascot mood="idle|thinking|happy|alert" />` in `product/src/components/mascot.tsx`; styles in `product/src/styles/mascot.css`.

| Mood | Looks | Use |
|---|---|---|
| idle | Blinks every ~5 s | Default |
| thinking | Flat mouth, eyes scan left and right | Waiting, checking, typing in verify |
| happy | Closed smiling eyes, big smile, one hop | Donation made, campaign confirmed |
| alert | Wide eyes, "o" mouth, one shake | Error, rejected campaign, broken chain, caught fraud |

`setMascotMood("happy")` makes every mascot with `listen` react for 1.6 s. Animations use transform and opacity only and stop under `prefers-reduced-motion`. Preview all moods at `/kit`.
