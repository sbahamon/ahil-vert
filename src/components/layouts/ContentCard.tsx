import { AbsoluteFill } from "remotion";
import { FadeInText } from "../animations/FadeInText";
import { colors, fonts } from "../../lib/brand";

interface ContentPoint {
  text: string;
  icon?: string;
}

interface ContentCardProps {
  headline: string;
  points: ContentPoint[];
  startDelay?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  headline,
  points,
  startDelay = 0,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.navy,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 60,
        fontFamily: fonts.body,
      }}
    >
      <FadeInText delay={startDelay} direction="up">
        <h2
          style={{
            color: colors.orange,
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 48,
            textAlign: "center",
          }}
        >
          {headline}
        </h2>
      </FadeInText>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {points.map((point, index) => (
          <FadeInText
            key={index}
            delay={startDelay + 20 + index * 30}
            direction="left"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                backgroundColor: colors.darkBlue,
                padding: 24,
                borderRadius: 12,
                borderLeft: `4px solid ${colors.blue}`,
              }}
            >
              {point.icon && (
                <span style={{ fontSize: 48 }}>{point.icon}</span>
              )}
              <p
                style={{
                  color: colors.white,
                  fontSize: 36,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {point.text}
              </p>
            </div>
          </FadeInText>
        ))}
      </div>
    </AbsoluteFill>
  );
};
