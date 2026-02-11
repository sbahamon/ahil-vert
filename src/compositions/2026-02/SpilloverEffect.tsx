import { AbsoluteFill, Sequence } from "remotion";
import { ContentCard } from "../../components/layouts/ContentCard";
import { FadeInText } from "../../components/animations/FadeInText";
import { SpilloverMap } from "../../components/maps/SpilloverMap";
import { colors, fonts, secondsToFrames } from "../../lib/brand";

/**
 * NWI Spillover Effect - Standalone Explainer
 * Duration: 45 seconds (1350 frames @ 30fps)
 *
 * How NIMBYism in collar counties displaces housing demand
 * into Northwest Indiana, driving up costs there too.
 *
 * Structure:
 * 0-3s (0-90):       Splash - opening question
 * 3-9s (90-270):     Hook - demand doesn't disappear
 * 9-15s (270-450):   Stakes - people still need homes
 * 15-30s (450-900):  Map - animated spillover visualization
 * 30-36s (900-1080): Impact - ContentCard with consequences
 * 36-45s (1080-1350): CTA - staggered closing message
 */
export const SpilloverEffect: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ backgroundColor: colors.navy, fontFamily: fonts.body }}
    >
      {/* Splash (0-3s) */}
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
            <h1
              style={{
                color: colors.white,
                fontSize: 60,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: fonts.heading,
                lineHeight: 1.3,
                maxWidth: 900,
              }}
            >
              Where does housing demand{" "}
              <span style={{ color: colors.orange }}>go?</span>
            </h1>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Hook (3-9s) */}
      <Sequence
        from={secondsToFrames(3)}
        durationInFrames={secondsToFrames(6)}
      >
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
                color: colors.orange,
                fontSize: 64,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              It doesn't disappear.
            </h2>
          </FadeInText>
          <FadeInText delay={45} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 42,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 850,
                lineHeight: 1.4,
              }}
            >
              Collar counties block new homes.
            </p>
          </FadeInText>
          <FadeInText delay={90} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 42,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 850,
                lineHeight: 1.4,
                fontWeight: 600,
              }}
            >
              NIMBYism shuts the door.
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Stakes (9-15s) */}
      <Sequence
        from={secondsToFrames(9)}
        durationInFrames={secondsToFrames(6)}
      >
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
            <p
              style={{
                color: colors.orange,
                fontSize: 44,
                fontStyle: "italic",
                fontWeight: 600,
                textAlign: "center",
                fontFamily: fonts.body,
              }}
            >
              Here's the thing:
            </p>
          </FadeInText>
          <FadeInText delay={50} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 52,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
                maxWidth: 850,
                lineHeight: 1.3,
              }}
            >
              People still need homes.
            </p>
          </FadeInText>
          <FadeInText delay={100} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 48,
                textAlign: "center",
                fontFamily: fonts.body,
                maxWidth: 850,
                lineHeight: 1.4,
              }}
            >
              Families still need to live{" "}
              <span style={{ color: colors.orange, fontWeight: 700 }}>
                somewhere
              </span>
              .
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Map Animation (15-30s) */}
      <Sequence
        from={secondsToFrames(15)}
        durationInFrames={secondsToFrames(15)}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 30px",
          }}
        >
          {/* Headline */}
          <FadeInText delay={0} direction="up">
            <h2
              style={{
                color: colors.orange,
                fontSize: 52,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: fonts.heading,
                marginBottom: 0,
              }}
            >
              So demand moves outward
            </h2>
          </FadeInText>

          {/* Map */}
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SpilloverMap startDelay={30} />
          </div>

          {/* Bottom text after arrows animate */}
          <FadeInText delay={300} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 40,
                fontWeight: 600,
                textAlign: "center",
                fontFamily: fonts.body,
                marginBottom: 20,
              }}
            >
              Northwest Indiana feels the pressure
            </p>
          </FadeInText>
        </AbsoluteFill>
      </Sequence>

      {/* Impact (30-36s) */}
      <Sequence
        from={secondsToFrames(30)}
        durationInFrames={secondsToFrames(6)}
      >
        <ContentCard
          headline="The result?"
          points={[
            { icon: "📈", text: "Rents rise in Gary and Hammond" },
            { icon: "💰", text: "Home values spike in East Chicago" },
            { icon: "🚫", text: "Affordability vanishes — there too" },
          ]}
          startDelay={0}
          staggerDelay={50}
        />
      </Sequence>

      {/* CTA (36-45s) */}
      <Sequence
        from={secondsToFrames(36)}
        durationInFrames={secondsToFrames(9)}
      >
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
            <p
              style={{
                color: colors.white,
                fontSize: 52,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              Blocking homes in one place
            </p>
          </FadeInText>
          <FadeInText delay={50} direction="up">
            <p
              style={{
                color: colors.white,
                fontSize: 52,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              doesn't solve anything.
            </p>
          </FadeInText>
          <FadeInText delay={100} direction="up">
            <p
              style={{
                color: colors.orange,
                fontSize: 56,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: fonts.heading,
              }}
            >
              It just moves the problem.
            </p>
          </FadeInText>
          <FadeInText delay={160} direction="up">
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
