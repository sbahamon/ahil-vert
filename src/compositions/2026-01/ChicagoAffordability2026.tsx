import { AbsoluteFill, Sequence } from "remotion";
import { ContentCard } from "../../components/layouts/ContentCard";
import { FadeInText } from "../../components/animations/FadeInText";
import { PermitBarChart } from "../../components/charts/PermitBarChart";
import { colors, fonts, secondsToFrames } from "../../lib/brand";

/**
 * Chicago Affordability 2026 - News React Video
 * Duration: 45 seconds (1350 frames @ 30fps)
 *
 * Based on Chicago Sun-Times article (Jan 30, 2026):
 * "Affordability will define Chicago's housing market this year"
 *
 * Structure:
 * 0-4s (0-120):      News Hook - source citation + quote
 * 4-10s (120-300):   The Problem - competition driving prices
 * 10-14s (300-420):  Who It Hurts - real people affected
 * 14-26s (420-780):  Chart - Chicago vs peer cities permits
 * 26-36s (780-1080): The Solution - ContentCard with 3 points
 * 36-45s (1080-1350): CTA - staggered message + follow
 */
export const ChicagoAffordability2026: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy, fontFamily: fonts.body }}>
      {/* News Hook (0-4s) */}
      <Sequence from={0} durationInFrames={secondsToFrames(4)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
            gap: 32,
          }}
        >
          <FadeInText delay={0} direction="up">
            <p
              style={{
                color: colors.orange,
                fontSize: 32,
                fontWeight: 600,
                textAlign: "center",
                fontFamily: fonts.body,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Chicago Sun-Times, today:
            </p>
          </FadeInText>
          <FadeInText delay={25} direction="up">
            <h1
              style={{
                color: colors.white,
                fontSize: 52,
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.3,
                fontFamily: fonts.heading,
                maxWidth: 900,
              }}
            >
              "<span style={{ color: colors.orange }}>Affordability</span> will define Chicago's housing market in 2026"
            </h1>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* The Problem (4-10s) */}
      <Sequence from={secondsToFrames(4)} durationInFrames={secondsToFrames(6)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
            gap: 28,
          }}
        >
          <FadeInText delay={0} direction="up">
            <h2
              style={{
                color: colors.white,
                fontSize: 56,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              Fewer homes. More buyers.
            </h2>
          </FadeInText>
          <FadeInText delay={35} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 40,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 850,
                lineHeight: 1.4,
              }}
            >
              That's a recipe for{" "}
              <span style={{ color: colors.orange, fontWeight: 700 }}>
                cutthroat competition
              </span>.
            </p>
          </FadeInText>
          <FadeInText delay={70} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 36,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 800,
              }}
            >
              When there aren't enough homes, prices go up — for everyone.
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Who It Hurts (10-14s) */}
      <Sequence from={secondsToFrames(10)} durationInFrames={secondsToFrames(4)}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
            gap: 32,
          }}
        >
          <FadeInText delay={0} direction="up">
            <h2
              style={{
                color: colors.white,
                fontSize: 52,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              Teachers. Nurses. Young families.
            </h2>
          </FadeInText>
          <FadeInText delay={40} direction="up">
            <p
              style={{
                color: colors.orange,
                fontSize: 48,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              Outbid. Priced out. Pushed away.
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Chart: Chicago vs Peer Cities (14-26s) */}
      <Sequence from={secondsToFrames(14)} durationInFrames={secondsToFrames(12)}>
        <PermitBarChart startDelay={0} />
      </Sequence>

      {/* The Solution (26-36s) */}
      <Sequence from={secondsToFrames(26)} durationInFrames={secondsToFrames(10)}>
        <ContentCard
          headline="More homes means more choices"
          points={[
            {
              icon: "📉",
              text: "More choices = less competition = prices stabilize",
            },
            {
              icon: "🏘️",
              text: "Allow duplexes, townhomes, and apartments in more neighborhoods",
            },
            {
              icon: "💪",
              text: "Give buyers leverage, not bidding wars",
            },
          ]}
          startDelay={0}
          staggerDelay={50}
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
            gap: 20,
          }}
        >
          <FadeInText delay={0} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 52,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              More homes.
            </p>
          </FadeInText>
          <FadeInText delay={40} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 52,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              More neighbors.
            </p>
          </FadeInText>
          <FadeInText delay={80} direction="up">
            <p
              style={{
                color: colors.orange,
                fontSize: 52,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              More affordable Chicago.
            </p>
          </FadeInText>
          <FadeInText delay={130} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 32,
                textAlign: "center",
                fontFamily: fonts.body,
                marginTop: 24,
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
