import { Composition, Folder } from "remotion";
import { Pillar1 } from "./compositions/2026-01/pillar-series/Pillar1";
import { ChicagoAffordability2026 } from "./compositions/2026-01/ChicagoAffordability2026";
import { SpilloverEffect } from "./compositions/2026-02/SpilloverEffect";
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
            durationInFrames={secondsToFrames(45)}
            fps={videoDefaults.fps}
            width={dimensions.width}
            height={dimensions.height}
          />
          {/* Pillar 2-5 compositions will be added here */}
        </Folder>
        <Composition
          id="ChicagoAffordability2026"
          component={ChicagoAffordability2026}
          durationInFrames={secondsToFrames(45)}
          fps={videoDefaults.fps}
          width={dimensions.width}
          height={dimensions.height}
        />
      </Folder>
      <Folder name="2026-02">
        <Composition
          id="SpilloverEffect"
          component={SpilloverEffect}
          durationInFrames={secondsToFrames(45)}
          fps={videoDefaults.fps}
          width={dimensions.width}
          height={dimensions.height}
        />
      </Folder>
    </>
  );
};
