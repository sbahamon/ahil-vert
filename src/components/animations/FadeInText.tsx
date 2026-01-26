import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface FadeInTextProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  children,
  delay = 0,
  duration = 20,
  direction = "up",
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - delay;

  const opacity = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const springValue = spring({
    fps,
    frame: adjustedFrame,
    config: {
      damping: 200,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const getTranslate = () => {
    const distance = 30;
    switch (direction) {
      case "up":
        return `translateY(${interpolate(springValue, [0, 1], [distance, 0])}px)`;
      case "down":
        return `translateY(${interpolate(springValue, [0, 1], [-distance, 0])}px)`;
      case "left":
        return `translateX(${interpolate(springValue, [0, 1], [distance, 0])}px)`;
      case "right":
        return `translateX(${interpolate(springValue, [0, 1], [-distance, 0])}px)`;
      default:
        return "none";
    }
  };

  return (
    <div
      style={{
        opacity,
        transform: getTranslate(),
      }}
      className={className}
    >
      {children}
    </div>
  );
};
