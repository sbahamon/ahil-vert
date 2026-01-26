# AHIL Vertical Video Content System

## Overview
Automated pipeline for creating 9:16 vertical videos for TikTok, Instagram Reels, and YouTube Shorts promoting housing abundance in Illinois. AHIL is a chapter of YIMBY Action.

## Core Components

### 1. Content Library
- Reusable data visualizations (CPS capacity, housing unit loss, tax burden)
- Brand assets (AHIL logo, colors, fonts from Canva brand kit)
- Personal footage + Creative Commons imagery (no stock subscriptions)
- Approved messaging/talking points based on YIMBY Action pillars

### 2. Video Templates
- **Data Drop** (15-30s) - Single shocking stat with visualization
- **Myth Buster** (30-60s) - Debunk common objections
- **Explainer** (60-90s) - Break down complex policy
- **Call to Action** (15s) - Urgent countdown/reminder
- **Pillar Series** (60s) - YIMBY Action principles introduction

### 3. Generation Workflow
- **Idea suggestion**: Claude proposes ideas based on campaigns, news, calendar, past performance
- **Cadence**: Batch weekly + on-demand
- **Spec interview**: Detailed questions via AskUserQuestion tool
- **Specs tracked**: Markdown files in `specs/` folder organized by date
- **Remotion rendering**: Preview in Remotion Studio, iterate, export MP4
- **Manual posting**: Add TikTok music post-render, manual upload to platforms

### 4. Publishing
- Multi-platform: TikTok, Instagram Reels, YouTube Shorts
- Audio: Text + music (TikTok library added post-render), voiceover optional per video
- Captions: Baked into video for accessibility
- Scheduling: Manual posting (no automation initially)

## Technical Requirements
- Remotion project with Tailwind CSS
- 1080x1920 vertical format (9:16)
- 30fps default
- Exported as MP4 (silent, music added per-platform)
- Simple project structure (not monorepo), compositions organized by date
- User comfortable with React/TypeScript

## Brand Guidelines

### Colors (from Canva Brand Kit)
- Primary Orange: `#ef5917`
- Primary Blue: `#004aad`
- Dark Blue: `#022452`
- Navy (backgrounds): `#0b162a`
- White: `#ffffff`

### Font
- **Nunito** (Google Fonts) - Rounded bold sans-serif matching AHIL logo
- Loaded via `@remotion/google-fonts` package

### Logo
- `public/logo/AHIL_Logo.png` - Exported from Canva brand kit
- Use `staticFile("logo/AHIL_Logo.png")` in Remotion components

### Tone
- Welcoming and inviting
- Community-focused
- Lead with shared values (community, affordability, opportunity)

## Content Guidelines
- Lead with shared values (community, affordability, opportunity)
- Data-driven but emotionally resonant
- Clear call to action
- Avoid developer-focused framing
- Address displacement concerns directly
- Use pro-housing messaging principles (see housing-copywriter skill)

### Terminology (per YIMBY messaging best practices)
- Say "homes" not "units"
- Say "housing shortage" not "housing crisis"
- Say "local homebuilders and property owners" not "developers"
- Avoid: density, infill, upzone, walkability, missing middle

## Accessibility Requirements
- Baked-in captions (always visible)
- High contrast text (white on navy, orange accents)
- Readable font sizes (minimum 48px body text)
- Reasonable text duration (3+ seconds per phrase)
- WCAG AA color contrast minimum
- Audio descriptions: Future enhancement (not initial release)

## First Deliverable: YIMBY Action Pillar Series

### Overview
5-part numbered video series introducing AHIL and the YIMBY Action pillars.
- **Duration**: 60 seconds each
- **Format**: Bold text + icons, numbered series (1/5 through 5/5)
- **Tone**: Welcoming/inviting
- **Audio**: Text only with minimal/ambient music (added via TikTok post-render)
- **CTA**: Series tease ("Part X of 5 - Follow for more")

### The Five Pillars (from yimbyaction.org/solutions/)

**Pillar 1: Legalize Housing**
- "Allow more housing in every neighborhood, especially historically affluent and exclusionary neighborhoods, removing barriers to both subsidized affordable and market rate housing."

**Pillar 2: Fund Affordable Housing**
- "Increase funding for subsidized affordable housing through a wide variety of mechanisms, including direct subsidies."

**Pillar 3: Increase Housing Stability**
- "Enact policies that support current residents having stable housing choices amid growth."

**Pillar 4: Streamline Permitting**
- "Make housing permits fast and fair, removing arbitrary barriers to both subsidized affordable and market rate housing."

**Pillar 5: Fix Incentives**
- "Reform structures that incentivize communities to say no to new homes, including tax systems and car centric transportation systems."

### Video Structure (each ~60s)
```
0-5s:   AHIL logo animation + "Part X of 5" badge
5-15s:  Hook text (bold, large, attention-grabbing)
15-45s: Pillar explanation (2-3 key points with icons)
45-55s: CTA card ("Follow for more" / final video: "Join us")
55-60s: Logo + social handle
```

## Project Structure
```
ahil-vert/
├── src/
│   ├── Root.tsx
│   ├── components/
│   │   ├── brand/
│   │   ├── animations/
│   │   └── layouts/
│   ├── compositions/
│   │   └── YYYY-MM/           # Organized by date
│   └── lib/
├── public/
│   ├── fonts/
│   ├── logo/
│   └── icons/
├── specs/                      # Video specifications
│   └── YYYY-MM/
└── ideas/                      # Idea backlog
```

## Cost Constraints
- Keep costs minimal
- Use free tier of Remotion
- No stock footage subscriptions (Creative Commons + personal footage)
- No AI voice services initially
- No music licensing (use TikTok's library)
- Local rendering (Remotion Cloud optional)

## Reusable Components

### Animation Components

**FadeInText** (`src/components/animations/FadeInText.tsx`)
```tsx
<FadeInText delay={0} direction="up" duration={20}>
  <h1>Animated text</h1>
</FadeInText>
```
- `delay` - Frames before animation starts
- `direction` - "up" | "down" | "left" | "right" | "none"
- `duration` - Animation length in frames

### Layout Components

**ContentCard** (`src/components/layouts/ContentCard.tsx`)
```tsx
<ContentCard
  headline="Section Title"
  points={[
    { icon: "🏘️", text: "Point with emoji icon" },
  ]}
  startDelay={0}
/>
```

**CTACard** (`src/components/layouts/CTACard.tsx`)
```tsx
<CTACard
  message="Call to action text"
  seriesNumber={1}
  totalInSeries={5}
  isFinalVideo={false}
/>
```

### Brand Constants (`src/lib/brand.ts`)
- `colors` - Brand color palette
- `fonts` - Nunito font family
- `dimensions` - 1080x1920
- `secondsToFrames(seconds)` - Convert timing to frames

## Lessons Learned

1. **Correct pillar source**: Use yimbyaction.org/solutions/ (not /about/) for the five pillars
2. **Font matching**: Nunito from Google Fonts closely matches the AHIL logo style
3. **Logo usage**: Export from Canva as PNG, use `staticFile()` in Remotion
4. **Workflow**: Interview → Spec → Build → Preview → Iterate works well
5. **Component reuse**: Build once, use across all videos in series

## Reference Links

- https://gist.github.com/ThariqS/3d446e7c7aa9eb94f468194deb73028f
- https://github.com/trycua/launchpad
- https://www.remotion.dev/docs/ai/claude-code
- https://yimbyaction.org/solutions/
