# Mike Wong — Portfolio

A personal portfolio built as an **Apple App Store**: browse projects like apps, read a "Today" editorial page, and tap any tile to open a full App Store-style product sheet with screenshots.

Static site generated with [Eleventy](https://www.11ty.dev/), rendered by a small React app that reads everything from JSON data files. No build step for the app itself, no framework tooling to learn — edit a JSON file, add an icon, and a new "app" appears.

- **Live:** deployed on Cloudflare Pages from `_site`
- **Aesthetic:** iOS / App Store — frosted glass, rounded tiles, tab bar, product sheets

## Features

- **Four tabs, App Store-style** — *Today* (editorial cards + weekly pick), *Apps* (the full catalogue), *Hacks* (hackathons & experiments), and *About*.
- **Product sheets** — tap any project for a full-screen sheet with icon, tagline, screenshot gallery, stack, and a link to the live app.
- **Data-driven** — every project, story, and site detail lives in `_data/*.json`. The React app reads them as `window` globals injected at build time. Adding a project never touches component code.
- **Weekly pick** — the Today page rotates a featured project deterministically by ISO week number. No manual updates.
- **Live Tweaks panel** — a draggable in-page control (`js/tweaks-panel.jsx`) to switch theme, density, and accent color while browsing.
- **Zero app-build** — React, ReactDOM, and Babel load from a CDN with SRI hashes; `.jsx` files are transpiled in the browser. Eleventy only copies assets and renders one template.

## Getting started

Requires [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm start
```

`npm start` runs `eleventy --serve` with live reload. Open the printed local URL (default `http://localhost:8080`).

To produce a static build in `_site/`:

```bash
npm run build
```

## Project structure

```
.
├── index.njk            # Single template — HTML shell + data injection
├── .eleventy.js         # Eleventy config (passthrough copy, json filter)
├── _headers             # Cloudflare Pages security headers + .jsx MIME
├── wrangler.jsonc       # Cloudflare Pages config + Workers AI binding
├── _data/
│   ├── projects.json    # The app catalogue (one object per project)
│   ├── stories.json     # Today-page editorial cards
│   ├── roles.json       # Rotating role labels
│   └── site.json        # Name, bio, stack, contact
├── js/
│   ├── app.jsx          # Tabs, sheet state, pages
│   ├── components.jsx    # Tiles, cards, product sheet
│   └── tweaks-panel.jsx  # Live theme/density/accent controls
├── css/styles.css       # All styling
└── assets/              # Per-project icons + screenshots
```

## Adding a project

1. Drop an icon and screenshots into `assets/<project-id>/`.
2. Add an entry to `_data/projects.json`:

```json
{
  "id": "scottish-tartan-finder",
  "icon": "/assets/scottish-tartan-finder/icon.svg",
  "screenshots": ["/assets/scottish-tartan-finder/screenshots/home.png"],
  "name": "Scottish Tartan Finder",
  "tagline": "Every Tartan in Scotland, in One Place",
  "blurb": "A calm, readable static catalogue of all 10,822 tartans…",
  "platform": "Web",
  "category": "Reference",
  "stack": "Astro · TypeScript · Fuse.js",
  "url": "https://mike623.github.io/scottish-tartan-finder/",
  "tint": { "from": "#3A6B4A", "to": "#1E3A28" },
  "featured": true
}
```

3. `npm start` — the new app shows up in *Apps* automatically. Set `"featured": true` to surface it on *Today*.

> [!TIP]
> Anthropic's Claude Code users: the repo ships an `add-portfolio-project` skill that explores a GitHub repo or live URL, derives the App Store-style entry, fetches the icon, and writes `_data/projects.json` for you.

## How it works

Eleventy renders `index.njk` once, injecting each data file as a `window` global:

```html
<script>
  window.PROJECTS = {{ projects | json | safe }};
  window.SITE     = {{ site | json | safe }};
</script>
```

The three `.jsx` files then run entirely in the browser via Babel standalone. This keeps the app dependency-free and instantly hackable — no bundler, no watch process beyond Eleventy's file copy.

> [!NOTE]
> In-browser Babel transpilation is great for a small personal site. For a larger app you'd want a real build step (Vite, esbuild) to avoid shipping the transpiler to visitors.

## Deployment

Cloudflare Pages builds with `npm run build` and publishes `_site/`, driven by GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`. The AskMike chat runs as a Pages Function (`functions/api/askmike.js`) backed by Workers AI. Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) and the correct MIME type for `.jsx` files are configured in `_headers`.
