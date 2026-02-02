import { AbsoluteFill, Sequence } from "remotion";
import { ContentCard } from "../../../components/layouts/ContentCard";
import { FadeInText } from "../../../components/animations/FadeInText";
import { colors, fonts, secondsToFrames } from "../../../lib/brand";

/**
 * Pillar 1: Legalize Housing
 * Duration: 45 seconds (1350 frames @ 30fps)
 *
 * Structure:
 * 0-3s (0-90):       Splash - "What do we stand for?"
 * 3-9s (90-270):     Hook text
 * 9-15s (270-450):   Why it matters
 * 15-23s (450-690):  Content points (what we believe)
 * 23-36s (690-1080): Chicago in action (examples)
 * 36-45s (1080-1350): CTA
 */
export const Pillar1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy, fontFamily: fonts.body }}>
      {/* Splash: What We Stand For (0-3s) */}
      <Sequence from={0} durationInFrames={secondsToFrames(3)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
          }}
        >
          <FadeInText delay={0} direction="up">
            <h2
              style={{
                color: colors.white,
                fontSize: 56,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              What do we stand for?
            </h2>
          </FadeInText>
          <FadeInText delay={20} direction="up">
            <p
              style={{
                color: colors.orange,
                fontSize: 40,
                textAlign: "center",
                marginTop: 24,
                fontFamily: fonts.body,
              }}
            >
              5 pillars for Abundant Housing
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Hook (3-9s) */}
      <Sequence from={secondsToFrames(3)} durationInFrames={secondsToFrames(6)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
            gap: 24,
          }}
        >
          <FadeInText delay={0} direction="up">
            <h1
              style={{
                color: colors.white,
                fontSize: 64,
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.2,
                fontFamily: fonts.heading,
              }}
            >
              Most of Illinois
              <br />
              <span style={{ color: colors.orange }}>BANS</span>
              <br />
              two-flats and apartments
            </h1>
          </FadeInText>
          <FadeInText delay={60} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 36,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 800,
              }}
            >
              That makes housing expensive for EVERYONE.
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Why It Matters (9-15s) */}
      <Sequence from={secondsToFrames(9)} durationInFrames={secondsToFrames(6)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
            gap: 24,
          }}
        >
          <FadeInText delay={0} direction="up">
            <h2
              style={{
                color: colors.orange,
                fontSize: 48,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              Here's the thing:
            </h2>
          </FadeInText>
          <FadeInText delay={30} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 40,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 900,
                lineHeight: 1.4,
              }}
            >
              These rules weren't an accident. Wealthy neighborhoods wrote them
              to decide who gets to be their neighbor.
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Content Points (15-23s) */}
      <Sequence from={secondsToFrames(15)} durationInFrames={secondsToFrames(8)}>
        <ContentCard
          headline="We believe in open neighborhoods"
          points={[
            {
              icon: "🚫",
              text: "Right now, most neighborhoods ban anything but single-family homes",
            },
            {
              icon: "💸",
              text: "That drives up costs and prices out teachers, nurses, and young families",
            },
            {
              icon: "🏘️",
              text: "We support allowing duplexes, townhomes, and apartments in every neighborhood",
            },
          ]}
          startDelay={0}
          staggerDelay={40}
        />
      </Sequence>

      {/* Chicago In Action (23-36s) */}
      <Sequence from={secondsToFrames(23)} durationInFrames={secondsToFrames(13)}>
        <ContentCard
          headline="What we're doing in Chicago"
          points={[
            {
              icon: "🚇",
              text: "Broadway Corridor: Allowing more homes near Red Line stations from Devon to Montrose",
            },
            {
              icon: "🏠",
              text: "Coach Houses: Fighting to let homeowners build ADUs on their own property",
            },
            {
              icon: "🏗️",
              text: "New Homes: Supporting individual housing projects — like 349 new homes in Old Town",
            },
          ]}
          startDelay={0}
          staggerDelay={60}
        />
      </Sequence>

      {/* CTA (36-45s) */}
      <Sequence from={secondsToFrames(36)} durationInFrames={secondsToFrames(9)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
            gap: 16,
          }}
        >
          <FadeInText delay={0} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 48,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              More homes means more neighbors.
            </p>
          </FadeInText>
          <FadeInText delay={45} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 48,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              More opportunity.
            </p>
          </FadeInText>
          <FadeInText delay={90} direction="up">
            <p
              style={{
                color: colors.orange,
                fontSize: 48,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              More Illinois.
            </p>
          </FadeInText>
          <FadeInText delay={135} direction="up">
            <div
              style={{
                backgroundColor: colors.orange,
                color: colors.white,
                padding: "16px 32px",
                borderRadius: 12,
                fontSize: 36,
                fontWeight: 600,
                marginTop: 16,
              }}
            >
              Part 1 of 5 — Follow for more
            </div>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
