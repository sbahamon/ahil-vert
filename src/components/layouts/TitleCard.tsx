import { AbsoluteFill } from "remotion";
import { FadeInText } from "../animations/FadeInText";
import { colors } from "../../lib/brand";

interface TitleCardProps {
  title: string;
  subtitle?: string;
  seriesNumber?: number;
  totalInSeries?: number;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  seriesNumber,
  totalInSeries = 5,
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
      }}
    >
      {seriesNumber && (
        <FadeInText delay={0} className="mb-8">
          <div
            style={{
              backgroundColor: colors.orange,
              color: colors.white,
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 32,
              fontWeight: 600,
            }}
          >
            Part {seriesNumber} of {totalInSeries}
          </div>
        </FadeInText>
      )}

      <FadeInText delay={15} direction="up">
        <h1
          style={{
            color: colors.white,
            fontSize: 72,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>
      </FadeInText>

      {subtitle && (
        <FadeInText delay={30} direction="up">
          <p
            style={{
              color: colors.blue,
              fontSize: 36,
              marginTop: 24,
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            {subtitle}
          </p>
        </FadeInText>
      )}
    </AbsoluteFill>
  );
};
