import { Composition, Folder } from "remotion";
import { Pillar1 } from "./compositions/2026-01/pillar-series/Pillar1";
import { dimensions, videoDefaults, secondsToFrames } from "./lib/brand";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="2026-01">
        <Folder name="pillar-series">
          <Composition
            id="Pillar1"
            component={Pillar1}
            durationInFrames={secondsToFrames(videoDefaults.durationInSeconds)}
            fps={videoDefaults.fps}
            width={dimensions.width}
            height={dimensions.height}
          />
          {/* Pillar 2-5 compositions will be added here */}
        </Folder>
      </Folder>
    </>
  );
};
