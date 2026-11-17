"""Build a self-contained presenter page from the deck files.

Output: product/public/pitch/index.html plus its assets, served by the app at /pitch/index.html.
Run from the repo root:  python3 presentation/pitch-deck/build-player.py
Keys: Right / Space / click = next step, Left = back, F = fullscreen, Home / End.
"""
import json
import pathlib
import shutil

DECK = pathlib.Path(__file__).resolve().parent
OUT = DECK.parent.parent / "product" / "public" / "pitch"

deck = json.loads((DECK / "deck.json").read_text())
css = (DECK / "deck.css").read_text()
blob_map = json.loads((DECK / "assets" / "blob-map.json").read_text())

slides = []
for sid in deck["order"]:
    html = (DECK / "slides" / f"{sid}.html").read_text().strip()
    for blob, local in blob_map.items():
        html = html.replace(blob, local)
    slides.append(html)

LINK_ICON = (
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" '
    'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/>'
    '<path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
)
PLAY_ICON = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'

page = f"""<!doctype html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{deck.get("title", "Safefund pitch")}</title>
<style>
@font-face {{ font-family: 'Nunito Sans'; font-style: normal; font-weight: 200 1000; font-display: swap; src: url("assets/fonts/nunito-sans-latin-ext.woff2") format("woff2"); unicode-range: U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF; }}
@font-face {{ font-family: 'Nunito Sans'; font-style: normal; font-weight: 200 1000; font-display: swap; src: url("assets/fonts/nunito-sans-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }}
* {{ margin: 0 }}
html, body {{ height: 100%; background: #111; overflow: hidden; }}
#stage {{ position: absolute; left: 50%; top: 50%; width: 1920px; height: 1080px; transform-origin: 0 0; }}
#stage > section {{ position: absolute; inset: 0; width: 1920px; height: 1080px; overflow: hidden; display: none; isolation: isolate; }}
#stage > section.active {{ display: flex; }}
aside {{ display: none !important; }}
x-icon, x-shape {{ display: block; }}
table {{ border-collapse: separate; border-spacing: 0; }}
th, td {{ padding: .35em .6em; text-align: left; border-bottom: 2px solid #E6E5E1; }}
#count {{ position: fixed; right: 16px; bottom: 12px; font: 600 14px/1 sans-serif; color: #888; opacity: 0; transition: opacity .3s; }}
body:hover #count {{ opacity: 1; }}
video.deck-video {{ display: block; background: #000; }}
</style>
<style>
{css}
</style>
</head>
<body>
<div id="stage">
{chr(10).join(slides)}
</div>
<p id="count"></p>
<script>
(() => {{
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll(':scope > section')];
  const LINK = {json.dumps(LINK_ICON)}, PLAY = {json.dumps(PLAY_ICON)};
  document.querySelectorAll('x-icon').forEach(el => {{
    const n = el.getAttribute('name');
    if (n === 'Link') el.innerHTML = LINK; else if (n === 'Play') el.innerHTML = PLAY;
  }});
  // Clip frames become real videos, started by a click.
  document.querySelectorAll('img[data-video]').forEach(img => {{
    const v = document.createElement('video');
    v.className = 'deck-video ' + img.className;
    v.setAttribute('style', img.getAttribute('style') || '');
    v.src = img.dataset.video; v.poster = img.getAttribute('src');
    v.preload = 'auto'; v.playsInline = true;
    v.muted = img.dataset.videoSound !== 'on';
    v.dataset.start = img.dataset.videoStart || 'slide';
    v.addEventListener('click', e => {{ e.stopPropagation(); v.paused ? v.play() : v.pause(); }});
    img.replaceWith(v);
  }});
  // Fragment steps per slide: sorted by data-fragment-index, then document order.
  const steps = slides.map(s => {{
    const frs = [...s.querySelectorAll('.fragment')];
    const groups = new Map(); let auto = 1000;
    frs.forEach((f, i) => {{
      const k = f.dataset.fragmentIndex !== undefined ? +f.dataset.fragmentIndex : auto + i;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(f);
    }});
    return [...groups.keys()].sort((a, b) => a - b).map(k => groups.get(k));
  }});
  let cur = 0, step = 0;
  const fit = () => {{
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `scale(${{k}}) translate(-50%, -50%)`;
  }};
  const paint = () => {{
    steps[cur].forEach((g, i) => g.forEach(f => {{
      f.classList.toggle('visible', i < step);
      f.classList.toggle('current-fragment', i === step - 1);
    }}));
  }};
  const show = (n, atEnd) => {{
    slides[cur].querySelectorAll('video').forEach(v => v.pause());
    slides[cur].classList.remove('active');
    cur = Math.max(0, Math.min(slides.length - 1, n));
    step = atEnd ? steps[cur].length : 0;
    const s = slides[cur];
    s.classList.add('active');
    paint();
    s.querySelectorAll('video').forEach(v => {{ v.currentTime = 0; if (v.dataset.start !== 'click') v.play(); }});
    document.getElementById('count').textContent = (cur + 1) + ' / ' + slides.length;
    history.replaceState(null, '', '#' + (cur + 1));
  }};
  const next = () => {{ if (step < steps[cur].length) {{ step++; paint(); }} else if (cur < slides.length - 1) show(cur + 1); }};
  const prev = () => {{ if (step > 0) {{ step--; paint(); }} else if (cur > 0) show(cur - 1, true); }};
  addEventListener('keydown', e => {{
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(e.key)) {{ e.preventDefault(); next(); }}
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) {{ e.preventDefault(); prev(); }}
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
    else if (e.key === 'f' || e.key === 'F') {{ document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }}
  }});
  addEventListener('click', next);
  addEventListener('resize', fit);
  addEventListener('hashchange', () => show((parseInt(location.hash.slice(1), 10) || 1) - 1));
  fit();
  show(Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1));
}})();
</script>
</body>
</html>
"""

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "index.html").write_text(page)
(OUT / "assets").mkdir(exist_ok=True)
for local in set(blob_map.values()):
    shutil.copy(DECK / local, OUT / local)
shutil.copytree(DECK / "assets" / "fonts", OUT / "assets" / "fonts", dirs_exist_ok=True)
print(f"Wrote {OUT / 'index.html'} with {len(slides)} slides")
