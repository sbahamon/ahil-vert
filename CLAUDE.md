# AHIL Vertical Video System - Claude Code Instructions

## Project Overview

This is a Remotion-based video generation system for Abundant Housing Illinois (AHIL), a chapter of YIMBY Action. We create 9:16 vertical videos for TikTok, Instagram Reels, and YouTube Shorts.

**Always read `spec.md` first** for complete project requirements, brand guidelines, and content specifications.

## Skills to Use

- **remotion-best-practices**: Use for all Remotion code (animations, compositions, timing)
- **housing-copywriter**: Use for all messaging and copy (follow pro-housing terminology)
- **chicago-data-portal**: Use when pulling Chicago city data for visualizations
- **us-census-data**: Use for demographic/housing data visualizations
- **geojson-to-svg**: Use when creating geographic map visualizations (county boundaries, wards, districts). Converts Census Bureau GeoJSON into SVG paths by FIPS code. See `src/components/maps/SpilloverMap.tsx` for a working example.

## Brand Colors

```typescript
const brand = {
  orange: '#ef5917',    // Primary accent
  blue: '#004aad',      // Primary
  darkBlue: '#022452',  // Secondary
  navy: '#0b162a',      // Backgrounds
  white: '#ffffff',     // Text
};
```

## Pro-Housing Terminology

**Always use:**
- "homes" not "units"
- "housing shortage" not "housing crisis"
- "local homebuilders and property owners" not "developers"

**Avoid:**
- density, infill, upzone, walkability, missing middle, car dependence

## Project Organization

- **Compositions**: Organize by date in `src/compositions/YYYY-MM/`
- **Specs**: Track video specifications in `specs/YYYY-MM/`
- **Ideas**: Store video ideas in `ideas/`

## Video Defaults

- **Dimensions**: 1080x1920 (9:16 vertical)
- **FPS**: 30
- **Format**: MP4 (silent - music added per-platform)
- **Captions**: Baked into video for accessibility

## Accessibility Requirements

- High contrast (white on navy, orange accents)
- **Never use blue text on navy backgrounds** - poor contrast, hard to read
- Minimum 48px font for body text
- 3+ seconds display time per text phrase
- WCAG AA color contrast

## Workflow

1. Check `ideas/` for pending video ideas or suggest new ones
2. Interview user with AskUserQuestion to create detailed spec
3. Save spec to `specs/YYYY-MM/video-name.md`
4. Build Remotion composition
5. User previews in Remotion Studio
6. Iterate based on feedback
7. Render final MP4

## Reusable Components

When building new videos, use these existing components:

### FadeInText
```tsx
import { FadeInText } from "../components/animations/FadeInText";

<FadeInText delay={0} direction="up" duration={20}>
  <h1>Your text</h1>
</FadeInText>
```

### ContentCard
```tsx
import { ContentCard } from "../components/layouts/ContentCard";

<ContentCard
  headline="Section Title"
  points={[
    { icon: "🏘️", text: "First point" },
    { icon: "🔓", text: "Second point" },
  ]}
  startDelay={0}
  staggerDelay={45}  // Frames between each point (default: 30 = 1s)
/>
```

### CTACard
```tsx
import { CTACard } from "../components/layouts/CTACard";

<CTACard
  message="Your call to action"
  seriesNumber={1}
  totalInSeries={5}
  isFinalVideo={false}
/>
```

### SpilloverMap (Geographic Map)
```tsx
import { SpilloverMap } from "../components/maps/SpilloverMap";

<SpilloverMap startDelay={30} />
```
Uses real US Census Bureau county boundaries (Cook, DuPage, Kane, Lake IL, McHenry, Will, Lake County IN). Animated phases: map fade-in → lock icons on collar counties → arrows draw toward NWI → NWI highlights orange. County path data lives in `src/data/county-paths.json`. To generate paths for different regions, use the **geojson-to-svg** skill.

### Brand Constants
```tsx
import { colors, fonts, secondsToFrames } from "../lib/brand";

// Use colors.navy, colors.orange, etc.
// Use fonts.heading, fonts.body
// Use secondsToFrames(5) to convert 5 seconds to frames
```

### Logo
```tsx
import { Img, staticFile } from "remotion";

<Img
  src={staticFile("logo/AHIL_Logo.png")}
  style={{ width: 600, height: "auto" }}
/>
```

## Common Commands

```bash
# Start Remotion Studio
npm start

# Render a composition
npx remotion render src/index.ts CompositionId out/video.mp4

# Render specific composition at vertical dimensions
npx remotion render src/index.ts CompositionId --width=1080 --height=1920
```

## Key Learnings

- YIMBY Action pillars are at yimbyaction.org/solutions/ (not /about/)
- Font is Nunito from @remotion/google-fonts
- Logo at public/logo/AHIL_Logo.png
- Always use `staticFile()` for assets in public/
- **Copy tone**: Conversational beats formal. Use "Here's the thing:" not "Why does this matter?"
- **Stagger timing**: 40-60 frames (1.3-2s) between content points feels natural
- **CTA sentences**: Breaking into staggered lines ("More homes." / "More neighbors." / "More Illinois.") is more engaging than one block
- **Geographic maps**: Use the geojson-to-svg skill to generate real county boundaries from Census data. County path data goes in `src/data/`, map components in `src/components/maps/`

## Video Structure Template

**Recommended length: 30-45 seconds** (60s feels too long for social media)

**Persuasive structure:** Problem → Stakes → Solution → Proof → Action

```
0-3s:   Splash/intro
3-9s:   Hook (the problem)
9-15s:  Stakes (why it matters - conversational tone)
15-23s: Solution (what we believe)
23-36s: Proof (examples, data)
36-45s: CTA (call to action)
```

Code pattern:

```tsx
export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy, fontFamily: fonts.body }}>
      {/* Splash (0-3s) */}
      <Sequence from={0} durationInFrames={secondsToFrames(3)}>
        {/* Brief intro */}
      </Sequence>

      {/* Hook (3-9s) */}
      <Sequence from={secondsToFrames(3)} durationInFrames={secondsToFrames(6)}>
        {/* Bold statement about the problem */}
      </Sequence>

      {/* Stakes (9-15s) */}
      <Sequence from={secondsToFrames(9)} durationInFrames={secondsToFrames(6)}>
        {/* Why this matters - use conversational tone like "Here's the thing:" */}
      </Sequence>

      {/* Solution (15-23s) */}
      <Sequence from={secondsToFrames(15)} durationInFrames={secondsToFrames(8)}>
        <ContentCard headline="..." points={[...]} staggerDelay={40} />
      </Sequence>

      {/* Proof (23-36s) - optional */}
      <Sequence from={secondsToFrames(23)} durationInFrames={secondsToFrames(13)}>
        <ContentCard headline="..." points={[...]} staggerDelay={60} />
      </Sequence>

      {/* CTA (36-45s) */}
      <Sequence from={secondsToFrames(36)} durationInFrames={secondsToFrames(9)}>
        {/* Can use CTACard or custom staggered sentences */}
      </Sequence>
    </AbsoluteFill>
  );
};
```

## Series Pattern

For numbered series (like the 5-part pillar series):

1. **Consistent structure** - Each video follows the same template
2. **Series badge** - Show "Part X of Y" in opening
3. **Progressive CTAs**:
   - Videos 1-4: "Part X of 5 — Follow for more"
   - Video 5 (final): "Join us at abundanthousingillinois.org"

Use CTACard props:

```tsx
// For videos 1-4
<CTACard
  seriesNumber={1}
  totalInSeries={5}
  isFinalVideo={false}
/>

// For final video
<CTACard
  seriesNumber={5}
  totalInSeries={5}
  isFinalVideo={true}
/>
```

## Iteration Tips

**Common feedback types:**

1. **Timing** - "Make the hook longer" → Adjust `durationInFrames` in Sequence
2. **Wording** - "Change the CTA" → Update text props in components
3. **Visuals** - "Make text bigger" → Adjust `fontSize` in style objects
4. **Animation** - "Slower fade" → Increase `duration` prop on FadeInText

**Quick iteration workflow:**

1. Make changes in code
2. Remotion Studio auto-reloads (or refresh browser)
3. Scrub timeline to preview specific sections
4. Use frame counter to verify timing

**When to create new components vs adjust props:**

- **Adjust props**: Same layout, different content/timing
- **New component**: Different layout structure or animation pattern
- **Extract component**: When you repeat the same pattern 3+ times
