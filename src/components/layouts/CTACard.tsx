import { AbsoluteFill } from "remotion";
import { FadeInText } from "../animations/FadeInText";
import { colors, fonts } from "../../lib/brand";

interface CTACardProps {
  message: string;
  handle?: string;
  seriesNumber?: number;
  totalInSeries?: number;
  isFinalVideo?: boolean;
  startDelay?: number;
}

export const CTACard: React.FC<CTACardProps> = ({
  message,
  handle = "@abundanthousingillinois",
  seriesNumber,
  totalInSeries = 5,
  isFinalVideo = false,
  startDelay = 0,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.navy,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        fontFamily: fonts.body,
      }}
    >
      <FadeInText delay={startDelay} direction="up">
        <p
          style={{
            color: colors.white,
            fontSize: 48,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          {message}
        </p>
      </FadeInText>

      {!isFinalVideo && seriesNumber && (
        <FadeInText delay={startDelay + 15} direction="up">
          <div
            style={{
              backgroundColor: colors.orange,
              color: colors.white,
              padding: "16px 32px",
              borderRadius: 12,
              fontSize: 36,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Part {seriesNumber} of {totalInSeries} — Follow for more
          </div>
        </FadeInText>
      )}

      {isFinalVideo && (
        <FadeInText delay={startDelay + 15} direction="up">
          <div
            style={{
              backgroundColor: colors.blue,
              color: colors.white,
              padding: "16px 32px",
              borderRadius: 12,
              fontSize: 32,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Join us at abundanthousingillinois.org
          </div>
        </FadeInText>
      )}

      <FadeInText delay={startDelay + 30} direction="up">
        <p
          style={{
            color: colors.blue,
            fontSize: 32,
          }}
        >
          {handle}
        </p>
      </FadeInText>
    </AbsoluteFill>
  );
};
