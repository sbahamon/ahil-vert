import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { colors, fonts } from "../../lib/brand";

interface SpilloverMapProps {
  startDelay?: number;
}

/**
 * Stylized map of the Chicago metro area using real county boundaries
 * from US Census Bureau cartographic boundary files.
 *
 * viewBox: 0 0 850 900
 * Projection: Equirectangular with cos(41.83) correction
 */

// Real county boundary paths (simplified from Census Bureau GeoJSON)
const countyPaths = {
  cook: "M631.1,526.1L630.3,676L506.1,676.3L504.9,620.4L450.2,621.6L449,566.6L394.7,568.2L394,540.4L447.9,520.8L444.9,346.1L284.3,351.1L295.8,245.2L520.6,246.4L561.9,305.6L563,324L584.1,402.7L589.9,410.3L591,439.9L613.9,489.7L627.9,500.9L631.1,526.1Z",
  dupage:
    "M370,348.2L444.9,346.1L447.9,520.8L394,540.4L393.4,513.1L284.8,515.8L284.3,351.1L370,348.2Z",
  kane: "M284.2,460.6L284.8,515.8L125.2,519L125.5,354.1L131.4,245.7L295.8,245.2L284.3,351.1L284.2,460.6Z",
  lakeIL:
    "M384.3,30.4L501.3,32.6L499,100.1L491.8,114.7L485.2,152.5L495.8,196.4L520.6,246.4L314,245.2L314.1,30L384.3,30.4Z",
  mchenry:
    "M264.7,30.8L314.1,30L314,245.2L76.6,245.7L75.7,31.5L264.7,30.8Z",
  will: "M630.3,676L629.8,784.5L401.2,788L402.1,842.7L293.1,845.3L285,515.9L393.4,513.1L394.7,568.2L449,566.6L450.2,621.6L504.9,620.4L506.1,676.3L630.3,676Z",
  nwi: "M629.8,784.4L632.7,525.1L639.8,536.7L656.1,548.4L671.2,549.8L674.1,556.2L671,560.1L678.3,567.3L724.8,579.8L772.5,579.1L774.3,819.8L682.5,870L629.9,867.6L629.8,784.4Z",
  lakeMichigan:
    "M501.3,32.6L499,100.1L491.8,114.7L485.2,152.5L495.8,196.4L520.6,246.4L561.9,305.6L563,324L584.1,402.7L589.9,410.3L591,439.9L613.9,489.7L627.9,500.9L631.1,526.1L632.7,525.1L639.8,536.7L656.1,548.4L671.2,549.8L674.1,556.2L671,560.1L678.3,567.3L724.8,579.8L772.5,579.1L860,579.1L860,32.6Z",
};

// Collar county metadata (label positions from computed centroids)
const collarCounties = [
  { id: "mchenry", label: "McHenry", cx: 218, cy: 102 },
  { id: "lakeIL", label: "Lake", cx: 439, cy: 118 },
  { id: "kane", label: "Kane", cx: 227, cy: 394 },
  { id: "dupage", label: "DuPage", cx: 374, cy: 435 },
  { id: "will", label: "Will", cx: 459, cy: 669 },
] as const;

// Arrow paths — cubic beziers from each collar county centroid toward NWI
const arrowPaths = [
  {
    id: "mchenry",
    path: "M 218 102 C 340 200 490 350 645 540",
  },
  {
    id: "lakeIL",
    path: "M 439 118 C 500 250 570 400 650 545",
  },
  {
    id: "kane",
    path: "M 227 394 C 370 440 510 490 645 552",
  },
  {
    id: "dupage",
    path: "M 374 435 C 460 465 550 505 648 555",
  },
  {
    id: "will",
    path: "M 459 669 C 520 660 580 640 655 610",
  },
];

export const SpilloverMap: React.FC<SpilloverMapProps> = ({
  startDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - startDelay;

  // Phase 1: Map fade in (0-50f)
  const mapOpacity = interpolate(t, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Locks appear on collar counties (60-130f)
  const lockProgress = (index: number) =>
    spring({
      frame: t - 60 - index * 14,
      fps,
      config: { damping: 200, stiffness: 100, mass: 0.5 },
    });

  // Phase 3: Arrows draw from each county to NWI (130-260f)
  const arrowProgress = (index: number) =>
    interpolate(t - 130 - index * 20, [0, 50], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Phase 4: NWI highlight (260-320f)
  const nwiHighlight = spring({
    frame: t - 260,
    fps,
    config: { damping: 200, stiffness: 80, mass: 0.8 },
  });

  // Phase 5: NWI pulse (320+)
  const pulseT = t - 320;
  const nwiScale = pulseT > 0 ? 1 + Math.sin(pulseT * 0.08) * 0.04 : 1;

  // NWI color transitions
  const nwiFill = interpolate(nwiHighlight, [0, 1], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nwiBorder = interpolate(nwiHighlight, [0, 1], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: mapOpacity,
      }}
    >
      <svg viewBox="0 0 850 900" style={{ width: 900, height: 950 }}>
        <defs>
          <marker
            id="spillover-arrow"
            markerWidth="12"
            markerHeight="8"
            refX="11"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 12 4, 0 8" fill={colors.white} />
          </marker>
          <linearGradient id="lake-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.blue} stopOpacity={0.2} />
            <stop offset="100%" stopColor={colors.blue} stopOpacity={0.06} />
          </linearGradient>
          <filter id="nwi-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lake Michigan */}
        <path d={countyPaths.lakeMichigan} fill="url(#lake-grad)" />
        <text
          x="700"
          y="300"
          fill={colors.blue}
          fontSize="17"
          fontFamily={fonts.body}
          fontWeight={500}
          opacity={0.25}
          transform="rotate(75, 700, 300)"
        >
          Lake Michigan
        </text>

        {/* State border (IL | IN) — south of the lake */}
        <line
          x1="631"
          y1="530"
          x2="631"
          y2="900"
          stroke={colors.white}
          strokeWidth="1.5"
          strokeDasharray="8 6"
          opacity={0.2}
        />
        <text
          x="615"
          y="893"
          fill={colors.white}
          fontSize="18"
          fontFamily={fonts.body}
          fontWeight={600}
          opacity={0.3}
          textAnchor="end"
        >
          IL
        </text>
        <text
          x="647"
          y="893"
          fill={colors.white}
          fontSize="18"
          fontFamily={fonts.body}
          fontWeight={600}
          opacity={0.3}
          textAnchor="start"
        >
          IN
        </text>

        {/* Collar counties — real Census boundaries */}
        {collarCounties.map((county, index) => {
          const lp = lockProgress(index);
          const path =
            countyPaths[county.id as keyof typeof countyPaths];

          return (
            <g key={county.id}>
              <path
                d={path}
                fill={colors.darkBlue}
                stroke={colors.blue}
                strokeWidth={1.2}
                opacity={0.85}
              />
              <text
                x={county.cx}
                y={county.cy - 10}
                fill={colors.white}
                fontSize="22"
                fontFamily={fonts.body}
                fontWeight={600}
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={0.9}
              >
                {county.label}
              </text>
              <text
                x={county.cx}
                y={county.cy + 18}
                fontSize="24"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={lp}
                style={{
                  transform: `scale(${lp})`,
                  transformOrigin: `${county.cx}px ${county.cy + 18}px`,
                }}
              >
                🔒
              </text>
            </g>
          );
        })}

        {/* Cook County (Chicago) — orange highlight */}
        <path
          d={countyPaths.cook}
          fill={colors.orange}
          stroke={colors.orange}
          strokeWidth={1.5}
          opacity={0.9}
        />
        <text
          x="530"
          y="470"
          fill={colors.white}
          fontSize="30"
          fontFamily={fonts.heading}
          fontWeight={800}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Chicago
        </text>
        <text
          x="530"
          y="500"
          fill={colors.white}
          fontSize="17"
          fontFamily={fonts.body}
          fontWeight={500}
          textAnchor="middle"
          dominantBaseline="middle"
          opacity={0.7}
        >
          Cook County
        </text>

        {/* Animated arrows — one per collar county */}
        {arrowPaths.map((arrow, index) => {
          const progress = arrowProgress(index);
          const pathLen = 500;
          const offset = pathLen * (1 - progress);
          const opacity =
            progress > 0
              ? interpolate(progress, [0, 0.2, 1], [0, 0.6, 0.85], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;

          return (
            <path
              key={arrow.id}
              d={arrow.path}
              fill="none"
              stroke={colors.white}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={pathLen}
              strokeDashoffset={offset}
              markerEnd="url(#spillover-arrow)"
              opacity={opacity}
            />
          );
        })}

        {/* NWI (Lake County, IN) — spillover target */}
        <g
          style={{
            transform: `scale(${nwiScale})`,
            transformOrigin: "676px 652px",
          }}
          filter={nwiHighlight > 0.5 ? "url(#nwi-glow)" : undefined}
        >
          <path
            d={countyPaths.nwi}
            fill={colors.orange}
            fillOpacity={nwiFill}
            stroke={colors.orange}
            strokeWidth={nwiHighlight > 0.5 ? 2.5 : 1.2}
            opacity={nwiBorder}
          />
          <text
            x="690"
            y="640"
            fill={colors.white}
            fontSize="26"
            fontFamily={fonts.heading}
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            NWI
          </text>
          <text
            x="690"
            y="680"
            fill={colors.white}
            fontSize="17"
            fontFamily={fonts.body}
            textAnchor="middle"
            opacity={0.75}
          >
            Gary
          </text>
          <text
            x="690"
            y="710"
            fill={colors.white}
            fontSize="17"
            fontFamily={fonts.body}
            textAnchor="middle"
            opacity={0.75}
          >
            Hammond
          </text>
          <text
            x="690"
            y="740"
            fill={colors.white}
            fontSize="17"
            fontFamily={fonts.body}
            textAnchor="middle"
            opacity={0.75}
          >
            East Chicago
          </text>
        </g>
      </svg>
    </div>
  );
};
