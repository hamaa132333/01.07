# Anniversary — A Romantic Mini Website 💌

A premium, animated anniversary surprise built with plain HTML5, CSS3, and vanilla JavaScript. No frameworks, no build step — just open `index.html`.

## How to view it

Because the site loads fonts and audio, it works best served over a local server rather than opened directly as a `file://` path (some browsers block audio autoplay/fetch from `file://`).

Easiest options:
- **VS Code**: install the "Live Server" extension, right-click `index.html` → "Open with Live Server".
- **Python**: run `python3 -m http.server 8000` from the `Anniversary/` folder, then visit `http://localhost:8000`.
- **Node**: `npx serve .` from the `Anniversary/` folder.

## What to customize

Everything you need to personalize lives in a few clearly marked spots:

### 1. The love letter
Open `index.html` and find the `#letter-scene` section. Each `<p class="letter-line" data-text="...">` holds one paragraph of the letter — edit the `data-text` attribute (that's what the typewriter animation reads from). Update the signature name too.

### 2. Photos (Memory Gallery)
Drop your images into `assets/images/` and update the `src` paths in the `#gallery` section of `index.html`. Add or remove `<div class="gallery-item">` blocks as needed — the masonry layout adjusts automatically.

### 3. Music
- Background music: replace `assets/music/background-song.mp3` with your track (keep the same filename, or update the `<source>` path in `index.html`'s `#bg-music` element).
- Browsers require a user interaction before audio can autoplay — the site starts music automatically on the visitor's first tap/click, per browser policy.

### 4. Anniversary date (countdown)
Open `js/script.js` and edit the `ANNIVERSARY_DATE` constant near the top:
```js
const ANNIVERSARY_DATE = new Date(2020, 5, 14, 18, 0, 0); // Year, Month-1, Day, Hour, Minute, Second
```
Note: JavaScript months are zero-indexed, so June = `5`.

### 5. Love quotes
Still in `js/script.js`, edit the `LOVE_QUOTES` array — add, remove, or rewrite any line. A new quote fades in every 20 seconds.

### 6. Colors & fonts
All theme colors and fonts are defined as CSS variables at the top of `css/style.css` under `:root`. Change `--pink-soft`, `--gold`, `--cream`, etc. to retheme the entire site in one place.

## Project structure

```
Anniversary/
│
├── index.html              → All page markup/sections
├── css/
│   ├── style.css            → Design tokens, layout, components
│   ├── animations.css       → All @keyframes
│   └── responsive.css       → Mobile/tablet breakpoints
├── js/
│   ├── script.js            → Main controller (countdown, quotes, gallery, final surprise)
│   ├── flowers.js           → Opening bloom, ambient petals/hearts/sparkles/bokeh, cursor
│   ├── envelope.js          → Envelope open + typewriter letter
│   └── music.js             → Background music + "Our Song" player
├── assets/
│   ├── images/               → Your gallery photos (memory-1.jpg … memory-6.jpg)
│   ├── flowers/               → Reserved for custom flower art, if you want to swap the SVG peonies
│   ├── icons/                 → Reserved for custom icons
│   ├── fonts/                  → Reserved if you'd rather self-host fonts instead of Google Fonts
│   └── music/                  → background-song.mp3, our-song.mp3
└── README.md
```

## The experience, step by step

1. **Opening bloom** — a white screen fills densely with falling petals, then a rich abundance of blooming peonies, over ~14 seconds, before parting like curtains.
2. **Envelope** — a luxurious cream-and-gold envelope with a pulsing wax seal. Click or tap to open it.
3. **Love letter** — a handwritten-style letter types itself out, line by line.
4. **Countdown** — a live "Together for" counter (years → seconds).
5. **Love quotes** — a new romantic quote fades in every 20 seconds.
6. **Memory gallery** — a masonry photo grid; click any photo to enlarge it.
7. **Final surprise** — a full-screen night scene with stars, floating petals, and a heart formed from glowing particles that gently beats, followed by a fading message.

Throughout the site, small peonies also drift by occasionally in the ambient background, alongside the petals, hearts, sparkles, and bokeh.

Throughout, subtle ambient petals, floating hearts, sparkles, and bokeh lights drift in the background, and the cursor is replaced with a tiny flower that bursts into petals on click.

## Performance notes

- All animations are transform/opacity based (GPU-accelerated) and respect `prefers-reduced-motion`.
- Ambient effects (petals, hearts, sparkles) are capped and self-cleaning (elements remove themselves after animating) to avoid DOM buildup.
- The final-surprise heart is drawn on a single `<canvas>` element for smooth 60fps particle motion instead of hundreds of DOM nodes.

Enjoy building the surprise — happy anniversary! ❤️
