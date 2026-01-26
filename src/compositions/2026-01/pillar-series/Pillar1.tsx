import { AbsoluteFill, Sequence, Img, staticFile } from "remotion";
import { ContentCard } from "../../../components/layouts/ContentCard";
import { CTACard } from "../../../components/layouts/CTACard";
import { FadeInText } from "../../../components/animations/FadeInText";
import { colors, fonts, secondsToFrames } from "../../../lib/brand";

/**
 * Pillar 1: Legalize Housing
 * Duration: 60 seconds (1800 frames @ 30fps)
 *
 * Structure:
 * 0-5s (0-150):     Logo + series badge
 * 5-15s (150-450):  Hook text
 * 15-45s (450-1350): Content points
 * 45-55s (1350-1650): CTA
 * 55-60s (1650-1800): Logo + handle
 */
export const Pillar1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy, fontFamily: fonts.body }}>
      {/* Opening: Logo + Series Badge (0-5s) */}
      <Sequence from={0} durationInFrames={secondsToFrames(5)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 32,
          }}
        >
          <FadeInText delay={0}>
            <Img
              src={staticFile("logo/AHIL_Logo.png")}
              style={{
                width: 600,
                height: "auto",
              }}
            />
          </FadeInText>
          <FadeInText delay={15}>
            <div
              style={{
                backgroundColor: colors.orange,
                color: colors.white,
                padding: "12px 24px",
                borderRadius: 8,
                fontSize: 32,
                fontWeight: 700,
                fontFamily: fonts.heading,
              }}
            >
              Part 1 of 5
            </div>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Hook (5-15s) */}
      <Sequence from={secondsToFrames(5)} durationInFrames={secondsToFrames(10)}>
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
                fontSize: 72,
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.2,
                fontFamily: fonts.heading,
              }}
            >
              LEGALIZE
              <br />
              <span style={{ color: colors.orange }}>HOUSING</span>
            </h1>
          </FadeInText>
          <FadeInText delay={20} direction="up">
            <p
              style={{
                color: colors.blue,
                fontSize: 36,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 800,
              }}
            >
              Allow more housing in every neighborhood.
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Content Points (15-45s) */}
      <Sequence from={secondsToFrames(15)} durationInFrames={secondsToFrames(30)}>
        <ContentCard
          headline="What does this mean?"
          points={[
            {
              icon: "🏘️",
              text: "Allow more housing in every neighborhood",
            },
            {
              icon: "🏛️",
              text: "Especially historically affluent and exclusionary neighborhoods",
            },
            {
              icon: "🔓",
              text: "Remove barriers to both subsidized affordable and market rate housing",
            },
          ]}
          startDelay={0}
        />
      </Sequence>

      {/* CTA (45-55s) */}
      <Sequence from={secondsToFrames(45)} durationInFrames={secondsToFrames(10)}>
        <CTACard
          message="Every neighborhood should welcome new neighbors."
          seriesNumber={1}
          totalInSeries={5}
          startDelay={0}
        />
      </Sequence>

      {/* Closing: Logo + Handle (55-60s) */}
      <Sequence from={secondsToFrames(55)} durationInFrames={secondsToFrames(5)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <FadeInText delay={0}>
            <Img
              src={staticFile("logo/AHIL_Logo.png")}
              style={{
                width: 400,
                height: "auto",
              }}
            />
          </FadeInText>
          <FadeInText delay={15}>
            <p
              style={{
                color: colors.blue,
                fontSize: 32,
                fontFamily: fonts.body,
              }}
            >
              @abundanthousingillinois
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
