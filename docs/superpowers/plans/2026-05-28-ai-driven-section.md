# AI Driven Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "AI DRIVEN" FeaturedCard for Mr. Carson to the Today page, positioned after the hero and before the existing "OUR PICK OF THE WEEK" card.

**Architecture:** Extract hoopcam's FeaturedCard out of `today-page-grid` (which becomes hero-only), then render the new AI FeaturedCard and hoopcam FeaturedCard sequentially below the grid. Zero new components — reuses `FeaturedCard` exactly as-is.

**Tech Stack:** Eleventy 2.x, React 18 (CDN), JSX (Babel in-browser transpile), CSS custom properties.

---

## File Map

| File | Change |
|------|--------|
| `js/app.jsx` | Restructure `TodayPage` — extract hoopcam from grid, add AI card |
| `_data/projects.json` | Add `"ai": true` to mr-carson entry |

---

## Task 1: Tag mr-carson as an AI project

**Files:**
- Modify: `_data/projects.json`

- [ ] **Step 1: Add the `ai` flag to mr-carson**

Open `_data/projects.json`. Find the mr-carson entry (currently near the bottom, `"id": "mr-carson"`). Add `"ai": true` after the `"featured": ` line. The entry should look like:

```json
{
  "id": "mr-carson",
  "icon": "/assets/mr-carson/icon.svg",
  "screenshots": [],
  "name": "Mr. Carson",
  "tagline": "Your Private Telegram Expense Butler",
  "blurb": "A local-first Telegram bot that scans receipts, answers natural-language spending questions, and charts your budget — all inference runs via Ollama, so no data leaves your machine.",
  "platform": "Self-hosted",
  "language": "EN",
  "category": "Finance",
  "started": "May 2026",
  "funniness": 4,
  "stack": "TypeScript · Telegraf · Hono · Mastra · DuckDB · Ollama",
  "url": "https://github.com/mike623/mr-carson",
  "monogram": "MC",
  "tint": { "from": "#3B2F6B", "to": "#1A1235" },
  "hue": "#2C2258",
  "ai": true,
  "summary": "A private, local-first AI butler for your expenses."
}
```

- [ ] **Step 2: Commit**

```bash
git add _data/projects.json
git commit -m "feat: tag mr-carson as ai project"
```

---

## Task 2: Restructure TodayPage in app.jsx

**Files:**
- Modify: `js/app.jsx` (lines 26–62, the `TodayPage` function)

- [ ] **Step 1: Replace TodayPage with the new layout**

Replace the entire `TodayPage` function (lines 26–62 in `js/app.jsx`) with:

```jsx
function TodayPage({ onOpen, onAbout }) {
  return (
    <div className="page today-page">
      <PageHeader kicker={todayKicker()} title="Today" />
      <div className="today-page-grid">
        <TodayHero roles={window.ROLES} onPick={onAbout} />
      </div>

      <FeaturedCard
        project={window.PROJECTS.find((p) => p.id === 'mr-carson')}
        eyebrow="AI DRIVEN"
        onOpen={onOpen}
      />

      <FeaturedCard
        project={window.PROJECTS.find((p) => p.id === 'hoopcam')}
        eyebrow="OUR PICK OF THE WEEK"
        onOpen={onOpen}
      />

      <SectionHeader kicker="FROM MIKE" title="A handful of side quests" />
      <div className="mid-row">
        {window.PROJECTS.slice(0, 5).map((p, i) => (
          <MidCard key={p.id} project={p} rank={i + 1} onOpen={onOpen} />
        ))}
      </div>

      <FeaturedCard
        project={window.PROJECTS.find((p) => p.id === 'filmate')}
        eyebrow="WE LOVE"
        onOpen={onOpen}
      />

      <SectionHeader kicker="HONG KONG MADE" title="Local apps, local love" />
      <div className="row-list responsive-grid">
        {['eco-cycle', 'deadstock', 'filmate'].map((id, i, arr) => {
          const p = window.PROJECTS.find((x) => x.id === id);
          return <AppRow key={id} project={p} onOpen={onOpen} divider={i < arr.length - 1} />;
        })}
      </div>
      <FooterNote />
    </div>
  );
}
```

Key changes from original:
- `today-page-grid` now contains only `TodayHero` (no hoopcam FeaturedCard inside)
- New `FeaturedCard` for `mr-carson` added immediately after the grid, `eyebrow="AI DRIVEN"`
- Hoopcam `FeaturedCard` moved out of the grid, appears after mr-carson
- All other sections unchanged

- [ ] **Step 2: Start the dev server**

```bash
npm start
```

Expected output includes: `[11ty] Watching…` and a local URL (typically `http://localhost:8080`).

- [ ] **Step 3: Visually verify in browser**

Open `http://localhost:8080`. On the Today tab, confirm:

1. Hero card appears at the top (full-width on desktop, normal on mobile)
2. A dark purple/indigo FeaturedCard appears below the hero with eyebrow `"AI DRIVEN"`, title `"Mr. Carson"`, tagline `"Your Private Telegram Expense Butler"` and a GET button
3. The orange HoopCam FeaturedCard with eyebrow `"OUR PICK OF THE WEEK"` appears below mr-carson
4. The rest of the page (side quests, WE LOVE, HK Made) is unchanged
5. Clicking the Mr. Carson card opens the detail sheet correctly
6. Toggle to dark theme and desktop layout in Tweaks — verify mr-carson card looks correct

- [ ] **Step 4: Commit**

```bash
git add js/app.jsx
git commit -m "feat: add AI Driven section to Today page with mr-carson"
```
