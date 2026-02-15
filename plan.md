# Plan: Generalize to YouTube + AI Science Video Creation with Manim

## Goal

Transform this Remotion-based vertical video system into a multi-format, multi-brand platform that supports:
- **AHIL** vertical videos (existing, unchanged)
- **AI science** landscape YouTube videos (new) — e.g. "Last Week in Mechanistic Interpretability"
- **Manim** integration for 3b1b-style mathematical/scientific visualizations

---

## Phase 1: Theme System (decouple branding from components)

Currently, all components import directly from `src/lib/brand.ts` with AHIL-specific colors, fonts, and dimensions hardcoded. We need to make this swappable.

### 1a. Create a theme type system

**New file: `src/lib/themes/types.ts`**

Define a `Theme` interface:
```ts
interface Theme {
  colors: Record<string, string>;
  fonts: { heading: string; body: string; mono?: string };
  dimensions: { width: number; height: number };
  fps: number;
  name: string;
}
```

### 1b. Extract AHIL theme

**New file: `src/lib/themes/ahil.ts`**

Move the existing brand constants into an AHIL theme object that satisfies the `Theme` interface. Keep `src/lib/brand.ts` as a re-export of the AHIL theme for backwards compatibility — existing compositions don't need to change.

### 1c. Create AI Science theme

**New file: `src/lib/themes/ai-science.ts`**

New color palette, fonts (e.g. a monospace accent for code/math), and 16:9 landscape dimensions (1920x1080).

### 1d. Theme context provider

**New file: `src/lib/themes/ThemeContext.tsx`**

React context so components can read the active theme without prop drilling. Compositions wrap themselves in a `<ThemeProvider theme={aiScienceTheme}>`.

### 1e. Update existing components to use theme context

Modify `ContentCard`, `CTACard`, `TitleCard`, `FadeInText` to read colors/fonts from context instead of direct `brand.ts` imports. Fall back to AHIL theme as default so **all existing compositions continue working unchanged**.

**Files modified:**
- `src/components/layouts/ContentCard.tsx`
- `src/components/layouts/CTACard.tsx`
- `src/components/layouts/TitleCard.tsx`
- `src/components/animations/FadeInText.tsx`

---

## Phase 2: Multi-format composition support (9:16 + 16:9)

### 2a. Update Root.tsx for multiple format folders

Add a new top-level `<Folder>` for AI Science content alongside the existing AHIL folders. Register compositions with 1920x1080 dimensions.

```tsx
<Folder name="AI Science">
  <Folder name="2026-02">
    <Composition
      id="MechInterpWeekly-2026-02-15"
      component={MechInterpWeekly}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={secondsToFrames(300)} // 5 min
    />
  </Folder>
</Folder>
```

### 2b. Create landscape-aware layout components

**New file: `src/components/layouts/ChapterCard.tsx`**

A longer-form equivalent of ContentCard designed for landscape — supports section titles, body text, and an optional side panel for visuals/diagrams. Uses theme context for colors.

**New file: `src/components/layouts/PaperCitationCard.tsx`**

Shows paper title, authors, date, and a key figure/quote. Designed for the "weekly papers" use case.

---

## Phase 3: Manim integration pipeline

### 3a. Set up Manim in the project

- Add a `manim/` directory at the project root for Python scenes
- Add a `manim/requirements.txt` with `manim` (Community Edition)
- Add a `manim/README.md` with setup instructions (`pip install manim` or `uv pip install manim`)

### 3b. Create a Manim render script

**New file: `scripts/render-manim.sh`**

Shell script that:
1. Takes a Manim scene file and scene name as arguments
2. Renders to PNG frame sequence (`manim render -g -qh`) or MP4 clip
3. Outputs to `public/manim-clips/` where Remotion can access them via `staticFile()`

### 3c. Add the manim_skill to the project

Install the community Manim skill for Claude Code:
```bash
npx skills add adithya-s-k/manim_skill/skills/manimce-best-practices
```

This gives Claude Code best practices for writing Manim scenes.

### 3d. Create a Manim clip component for Remotion

**New file: `src/components/media/ManimClip.tsx`**

A Remotion component that imports a pre-rendered Manim video clip using `<Video>` or `<OffthreadVideo>` from Remotion. Props:
```ts
interface ManimClipProps {
  src: string;          // path in public/manim-clips/
  startFrom?: number;   // trim start (frames)
  endAt?: number;       // trim end (frames)
}
```

### 3e. Write a sample Manim scene

**New file: `manim/scenes/attention_head.py`**

A simple example scene — e.g. visualizing attention weights in a transformer head — to prove out the pipeline end to end.

---

## Phase 4: First AI Science composition (proof of concept)

### 4a. Create a spec for the first video

**New file: `specs/2026-02/mech-interp-weekly-pilot.md`**

Spec for a ~3-5 minute pilot episode covering 2-3 recent mech interp papers. Structure:

```
0-15s:    Intro splash + episode title
15s-1m:   Paper 1 — summary + Manim visualization
1m-2m:    Paper 2 — summary + Manim visualization
2m-3m:    Paper 3 — summary + diagram
3m-3:30s: Recap + CTA (subscribe, links in description)
```

### 4b. Build the composition

**New file: `src/compositions/2026-02/MechInterpWeeklyPilot.tsx`**

Uses:
- `<ThemeProvider theme={aiScienceTheme}>`
- `<ChapterCard>` for section breaks
- `<PaperCitationCard>` for paper intros
- `<ManimClip>` for embedded math visualizations
- `<FadeInText>` for animated text (already generic)

### 4c. Render and verify

- Render Manim scenes to `public/manim-clips/`
- Preview in Remotion Studio
- Render final MP4 at 1920x1080

---

## Phase 5: Update project documentation

### 5a. Update CLAUDE.md

Add sections for:
- AI Science theme and compositions
- Manim workflow (write scene → render → import into Remotion)
- New components (ChapterCard, PaperCitationCard, ManimClip)
- YouTube-specific defaults (16:9, longer duration, chapter structure)

### 5b. Update spec.md

Add AI Science video templates alongside existing AHIL templates.

---

## What stays the same

- **All existing AHIL compositions** — untouched, still work exactly as before
- **FadeInText** — already generic, just gains theme context as an enhancement
- **Folder structure convention** — `src/compositions/YYYY-MM/` still applies
- **Render workflow** — same Remotion CLI commands, just different composition IDs
- **Accessibility defaults** — high contrast, readable fonts carry over to new theme

## File summary

| Action | File |
|--------|------|
| **New** | `src/lib/themes/types.ts` |
| **New** | `src/lib/themes/ahil.ts` |
| **New** | `src/lib/themes/ai-science.ts` |
| **New** | `src/lib/themes/ThemeContext.tsx` |
| **Edit** | `src/lib/brand.ts` (re-export from ahil theme) |
| **Edit** | `src/components/layouts/ContentCard.tsx` (use theme context) |
| **Edit** | `src/components/layouts/CTACard.tsx` (use theme context) |
| **Edit** | `src/components/layouts/TitleCard.tsx` (use theme context) |
| **Edit** | `src/components/animations/FadeInText.tsx` (use theme context) |
| **Edit** | `src/Root.tsx` (add AI Science folder) |
| **New** | `src/components/layouts/ChapterCard.tsx` |
| **New** | `src/components/layouts/PaperCitationCard.tsx` |
| **New** | `src/components/media/ManimClip.tsx` |
| **New** | `manim/requirements.txt` |
| **New** | `manim/README.md` |
| **New** | `manim/scenes/attention_head.py` |
| **New** | `scripts/render-manim.sh` |
| **New** | `specs/2026-02/mech-interp-weekly-pilot.md` |
| **New** | `src/compositions/2026-02/MechInterpWeeklyPilot.tsx` |
| **Edit** | `CLAUDE.md` (add AI Science docs) |
| **Edit** | `spec.md` (add AI Science templates) |

## Risks and considerations

- **Manim is a Python dependency** — adds a second language runtime to the project. The render script bridges the gap, but contributors need both Node and Python installed.
- **Video file sizes** — Manim clips in `public/` could get large. May want to `.gitignore` them and render on demand.
- **No narration pipeline yet** — This plan covers visuals only. Voice narration (ElevenLabs, etc.) would be a future phase.
- **ManimCE is mid-refactor** — The community edition is undergoing a major rewrite. Pin the version in requirements.txt.
