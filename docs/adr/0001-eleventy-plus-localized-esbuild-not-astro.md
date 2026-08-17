---
status: accepted
date: 2026-08-17
---

# Stay on Eleventy with a localized esbuild bundle, not Astro

This site is one page (`index.njk`) plus a standalone `pitch.html` and `resume/`, rendered
by Eleventy with React 18 UMD and `@babel/standalone` loaded from unpkg — no build step
beyond `eleventy`. Adding streaming chat meant adopting `useChat` from `@ai-sdk/react`, an
ESM npm package that cannot run under in-browser Babel, so a bundler became necessary for
the first time. We added esbuild for the chat widget only (`js/chat.jsx` →
`js/chat.bundle.js`) and left Eleventy, the Nunjucks templates, and the other three `.jsx`
files as they were.

## Considered options

- **A. Localized esbuild bundle (chosen).** One new build step, blast radius of one file.
  `build/bundle.mjs` aliases `react` and `react/jsx-runtime` to `build/react-shim.mjs`,
  which re-exports `window.React`, so the page keeps a single React instance and does not
  ship a second ~40KB copy. Hooks therefore work when `<AskMikePanel/>` renders inside
  `app.jsx`'s tree.
- **B. Migrate to Astro.** Rejected. Astro's value is islands, SSR, and content
  collections; this repo has one page, no collections, and gets its chat endpoint from a
  platform function without an SSR adapter. Migration would touch `index.njk`, the
  `_data/*` files, all four `.jsx` files, the deploy config, and the standalone HTML pages
  — 100% of a working site, to fix one component.
- **C. Migrate the whole site to Vite.** Rejected for the same blast-radius reason as B,
  with none of Astro's upside to offset it.

## Consequences

- The repo has two JS pipelines on purpose: in-browser Babel for `app.jsx`,
  `components.jsx`, `tweaks-panel.jsx`, and an esbuild artifact for the chat widget. This
  looks inconsistent and is meant to be. Do not "fix" it by bundling everything.
- `js/chat.bundle.js` loads as a plain `<script defer>`, not `type="text/babel"`, and must
  load before `app.jsx` so `window.AskMikePanel` exists when the app tree renders.
- `npm run build` is no longer just Eleventy — it is `node build/bundle.mjs && eleventy`.
  The same step generates `lib/corpus.generated.mjs` from `_data/`, so the chat function
  imports its corpus as bundled code instead of reading the filesystem at request time.
- Revisit if a second page appears, if the other components need npm ESM dependencies, or
  if Babel-in-browser becomes a real performance problem. At that point B or C becomes the
  cheaper option.

## What this decision does not cover

The hosting and model provider moved after this decision was made — Netlify → Cloudflare
Pages, OpenRouter → Workers AI (`@cf/meta/llama-3.3-70b-instruct-fp8-fast` via
`functions/api/askmike.js`). None of that changes the reasoning above: the bundler question
is about the client, and every hosting option considered supplied a serverless endpoint
without an SSR framework.

## Correction on record

`useChat` ships in `@ai-sdk/react` (Vercel AI SDK, docs at ai-sdk.dev). It is not an OpenAI
package — OpenAI ships no such hook.
