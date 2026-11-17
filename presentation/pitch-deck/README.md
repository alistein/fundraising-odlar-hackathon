# Safefund pitch deck

Live deck (present mode, click-by-click reveals, speaker notes): https://claude.ai/artifact/Li9v6gMuq5oXNTkm9X28cv — private until shared from its Share menu.

- `deck.json`, `deck.css`, `slides/*.html` — source of the deck, one file per slide; speaker script in each slide's `<aside>`.
- `preview.html` — static copy of all slides on one page (no animations, every step shown). Icons and arrows don't draw here.

Slide text and script: `wiki/hackathon/deck.md`.

## Backup player (offline or on the live site)

`python3 presentation/pitch-deck/build-player.py` builds `product/public/pitch/index.html` with its assets. It plays the deck with all animations and the demo video:

- Live: `https://safefund.vercel.app/pitch/index.html` once deployed
- Offline: open `product/public/pitch/index.html` straight from disk (fonts need internet; without it the text falls back to a system font)
- Keys: Right, Space or click = next step; Left = back; F = fullscreen; `#7` in the URL jumps to slide 7
- Rebuild after changing slides here; images map from the deck's uploads through `assets/blob-map.json`
