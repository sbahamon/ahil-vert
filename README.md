# AHIL Vertical Video System

Automated video generation pipeline for Abundant Housing Illinois (AHIL), creating 9:16 vertical videos for TikTok, Instagram Reels, and YouTube Shorts.

## Quick Start

```bash
# Install dependencies
npm install

# Start Remotion Studio (preview videos)
npm start

# Render a video
npx remotion render src/index.ts Pillar1 out/pillar1.mp4
```

Open http://localhost:3001 to preview videos in Remotion Studio.

## Project Structure

```
ahil-vert/
├── src/
│   ├── index.ts                    # Entry point
│   ├── Root.tsx                    # Composition registry
│   ├── lib/
│   │   └── brand.ts                # Colors, fonts, dimensions
│   ├── components/
│   │   ├── animations/
│   │   │   └── FadeInText.tsx      # Animated text component
│   │   ├── layouts/
│   │   │   ├── ContentCard.tsx     # Multi-point content
│   │   │   ├── CTACard.tsx         # Call-to-action
│   │   │   └── TitleCard.tsx       # Title screens
│   │   └── maps/
│   │       └── SpilloverMap.tsx    # Animated Chicago metro map
│   └── compositions/
│       └── YYYY-MM/                # Organized by date
│           └── video-name/
│   └── data/
│       └── county-paths.json       # Census Bureau SVG paths
├── scripts/
│   └── generate-county-paths.mjs   # GeoJSON → SVG converter
├── public/
│   ├── logo/
│   │   └── AHIL_Logo.png           # Brand logo
│   └── maps/                       # Preview SVGs
├── specs/                          # Video specifications
│   └── YYYY-MM/
└── ideas/                          # Video idea backlog
```

## Creating a New Video

### 1. Create a Spec

Ask Claude to interview you about the video:
```
Create a spec for a new video about [topic]
```

Or manually create a spec file in `specs/YYYY-MM/video-name.md`.

### 2. Build the Composition

Create a new file in `src/compositions/YYYY-MM/`:

```tsx
import { AbsoluteFill, Sequence, Img, staticFile } from "remotion";
import { ContentCard } from "../../../components/layouts/ContentCard";
import { CTACard } from "../../../components/layouts/CTACard";
import { FadeInText } from "../../../components/animations/FadeInText";
import { colors, fonts, secondsToFrames } from "../../../lib/brand";

export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy, fontFamily: fonts.body }}>
      {/* Add sequences here */}
    </AbsoluteFill>
  );
};
```

### 3. Register in Root.tsx

Add your composition to `src/Root.tsx`:

```tsx
<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={secondsToFrames(45)}  // 30-45s recommended
  fps={30}
  width={1080}
  height={1920}
/>
```

### 4. Preview and Iterate

Open Remotion Studio and select your composition. Make adjustments based on preview.

### 5. Render

```bash
npx remotion render src/index.ts MyVideo out/my-video.mp4
```

## Available Components

### FadeInText

Animated text with directional entrance.

```tsx
<FadeInText delay={0} direction="up" duration={20}>
  <h1>Your text here</h1>
</FadeInText>
```

Props:
- `delay` - Frame delay before animation starts
- `direction` - "up" | "down" | "left" | "right" | "none"
- `duration` - Animation duration in frames

### ContentCard

Display multiple content points with icons.

```tsx
<ContentCard
  headline="Section Title"
  points={[
    { icon: "🏘️", text: "First point" },
    { icon: "🔓", text: "Second point" },
  ]}
  startDelay={0}
  staggerDelay={45}  // Frames between each point (default: 30)
/>
```

### CTACard

Call-to-action ending card.

```tsx
<CTACard
  message="Your call to action"
  seriesNumber={1}
  totalInSeries={5}
  isFinalVideo={false}
  startDelay={0}
/>
```

### SpilloverMap

Animated SVG map of the Chicago metro area using real US Census Bureau county boundaries.

```tsx
import { SpilloverMap } from "../../components/maps/SpilloverMap";

<SpilloverMap startDelay={0} />
```

Props:
- `startDelay` - Frame delay before animation begins

Animation phases: map fade-in → lock icons on collar counties → arrows draw toward NWI → NWI highlights → pulse.

## Geographic Maps

County boundary SVG paths are generated from US Census Bureau cartographic data. A reusable `geojson-to-svg` skill (at `~/.claude/skills/geojson-to-svg/`) provides a CLI for converting any US county boundaries into SVG paths:

```bash
node ~/.claude/skills/geojson-to-svg/scripts/geojson_to_svg.mjs \
  --fips 17031,17043,17089 \
  --names "Cook,DuPage,Kane" \
  --out-json ./src/data/county-paths.json \
  --out-svg ./public/maps/preview.svg
```

See `scripts/generate-county-paths.mjs` for the project-specific version used to generate Chicago metro county paths.

## Brand Guidelines

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Orange | `#ef5917` | Primary accent, CTAs |
| Blue | `#004aad` | Primary, links |
| Dark Blue | `#022452` | Secondary backgrounds |
| Navy | `#0b162a` | Main backgrounds |
| White | `#ffffff` | Text |

> ⚠️ **Contrast warning**: Don't use Blue text on Navy backgrounds — poor contrast. Use White or Orange text on Navy.

### Font

**Nunito** (Google Fonts) - Rounded bold sans-serif matching the AHIL logo.

### Dimensions

- **Width**: 1080px
- **Height**: 1920px
- **Aspect Ratio**: 9:16 (vertical)
- **FPS**: 30

## Video Formats

### Data Drop (15-30s)
Single shocking stat with animated visualization.

### Myth Buster (30-60s)
Debunk a common objection with evidence.

### Explainer (60-90s)
Break down complex policy simply.

### Pillar Series (30-45s)
YIMBY Action principles introduction. Shorter works better for social engagement.

## Workflow

1. **Idea** → Captured in `ideas/` folder
2. **Spec Interview** → Claude asks detailed questions
3. **Spec File** → Saved to `specs/YYYY-MM/`
4. **Build** → Create Remotion composition
5. **Preview** → Review in Remotion Studio
6. **Iterate** → Refine based on feedback
7. **Render** → Export MP4 (silent)
8. **Post** → Add music via TikTok, manual upload

## Reference

- [Remotion Docs](https://www.remotion.dev/docs)
- [YIMBY Action Solutions](https://yimbyaction.org/solutions/)
- [AHIL Website](https://abundanthousingillinois.org)
