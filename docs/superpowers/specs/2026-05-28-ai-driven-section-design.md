# AI Driven Section — Design Spec

**Date:** 2026-05-28  
**Branch:** chrome-lancer  
**Status:** Approved

## Summary

Add an "AI DRIVEN" section to the Today page (home screen), positioned after the hero and before "OUR PICK OF THE WEEK". Uses the existing `FeaturedCard` component — zero new components required.

## Placement

Current `TodayPage` layout:
```
today-page-grid
  TodayHero
  FeaturedCard (hoopcam, "OUR PICK OF THE WEEK")   ← currently inside grid
SectionHeader + mid-row ("A handful of side quests")
FeaturedCard (filmate, "WE LOVE")
SectionHeader + row-list ("HONG KONG MADE")
```

New layout:
```
today-page-grid
  TodayHero                                          ← grid now hero-only
FeaturedCard (mr-carson, "AI DRIVEN")                ← new
FeaturedCard (hoopcam, "OUR PICK OF THE WEEK")       ← moved out of grid
SectionHeader + mid-row ("A handful of side quests")
FeaturedCard (filmate, "WE LOVE")
SectionHeader + row-list ("HONG KONG MADE")
```

## Implementation

### app.jsx changes
- Extract hoopcam `FeaturedCard` out of `today-page-grid` div
- `today-page-grid` contains only `TodayHero`
- Insert new `FeaturedCard` for `mr-carson` with `eyebrow="AI DRIVEN"` immediately after the grid

### projects.json
- Add `"ai": true` flag to `mr-carson` entry
- Add same flag to future AI projects as they ship

### Project selection
- For now: hardcode `mr-carson` as the FeaturedCard subject (single project, known)
- Future: when 2+ AI projects exist, add `SectionHeader kicker="AI DRIVEN" title="Built with intelligence"` + `AppRow` list below the FeaturedCard

## What's not changing
- `FeaturedCard` component — untouched
- CSS — `today-page-grid` already handles single-child gracefully (hero fills width)
- All other Today page sections — untouched

## Future expansion path
When more AI projects ship:
```
FeaturedCard (lead AI project, "AI DRIVEN")
SectionHeader kicker="AI DRIVEN" title="Built with intelligence"
AppRow (project 2)
AppRow (project 3)
...
```
No structural changes needed — just add rows.
