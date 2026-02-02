import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../lib/brand";
import { FadeInText } from "../animations/FadeInText";

interface PermitData {
  city: string;
  permits: number;
  isHighlighted?: boolean;
}

interface PermitBarChartProps {
  startDelay?: number;
  headline?: string;
  subtitle?: string;
  takeaway?: string;
}

const permitData: PermitData[] = [
  { city: "Houston", permits: 75000 },
  { city: "Dallas", permits: 68000 },
  { city: "Charlotte", permits: 26000 },
  { city: "Chicago", permits: 18000, isHighlighted: true },
];

const maxPermits = Math.max(...permitData.map((d) => d.permits));

export const PermitBarChart: React.FC<PermitBarChartProps> = ({
  startDelay = 0,
  headline = "These cities are building.",
  subtitle = "Chicago isn't.",
  takeaway = "More homes = lower prices",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const STAGGER_DELAY = 12; // frames between each bar
  const BAR_MAX_WIDTH = 680; // max width in pixels

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        backgroundColor: colors.navy,
      }}
    >
      {/* Headline */}
      <FadeInText delay={startDelay} direction="up">
        <h2
          style={{
            color: colors.white,
            fontSize: 52,
            fontWeight: 700,
            textAlign: "center",
            fontFamily: fonts.heading,
            marginBottom: 8,
          }}
        >
          {headline}
        </h2>
      </FadeInText>

      {/* Subtitle - dramatic pause */}
      <FadeInText delay={startDelay + 25} direction="up">
        <h2
          style={{
            color: colors.orange,
            fontSize: 52,
            fontWeight: 800,
            textAlign: "center",
            fontFamily: fonts.heading,
            marginBottom: 40,
          }}
        >
          {subtitle}
        </h2>
      </FadeInText>

      {/* Chart container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "100%",
          maxWidth: 900,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        {permitData.map((data, index) => {
          const barDelay = startDelay + 60 + index * STAGGER_DELAY;
          const barProgress = spring({
            frame: frame - barDelay,
            fps,
            config: { damping: 200 },
          });

          const barWidth = (data.permits / maxPermits) * BAR_MAX_WIDTH * barProgress;
          const barColor = data.isHighlighted ? colors.orange : colors.blue;

          // Number counter animation
          const displayNumber = Math.round(data.permits * barProgress);
          const formattedNumber = displayNumber.toLocaleString();

          return (
            <div
              key={data.city}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {/* City label and count */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: data.isHighlighted ? colors.orange : colors.white,
                    fontSize: data.isHighlighted ? 34 : 30,
                    fontWeight: data.isHighlighted ? 700 : 500,
                    fontFamily: fonts.body,
                  }}
                >
                  {data.city}
                </span>
                <span
                  style={{
                    color: data.isHighlighted ? colors.orange : colors.white,
                    fontSize: data.isHighlighted ? 30 : 26,
                    fontWeight: 600,
                    fontFamily: fonts.body,
                    opacity: barProgress,
                  }}
                >
                  {formattedNumber}
                </span>
              </div>

              {/* Bar */}
              <div
                style={{
                  height: data.isHighlighted ? 52 : 44,
                  backgroundColor: colors.darkBlue,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: barWidth,
                    backgroundColor: barColor,
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Takeaway */}
      <FadeInText delay={startDelay + 140} direction="up">
        <p
          style={{
            color: colors.white,
            fontSize: 36,
            fontWeight: 600,
            textAlign: "center",
            fontFamily: fonts.heading,
            marginTop: 36,
          }}
        >
          {takeaway}
        </p>
      </FadeInText>

      {/* Attribution */}
      <FadeInText delay={startDelay + 160} direction="up">
        <p
          style={{
            color: colors.white,
            fontSize: 18,
            opacity: 0.6,
            textAlign: "center",
            fontFamily: fonts.body,
            marginTop: 24,
          }}
        >
          New homes permitted annually | Source: US Census Bureau
        </p>
      </FadeInText>
    </AbsoluteFill>
  );
};
