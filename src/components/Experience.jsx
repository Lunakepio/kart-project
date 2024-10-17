import { Environment } from "@react-three/drei";
import { Ground } from "./Ground";
import { PlayerController } from "./player/PlayerController";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";

export const Experience = () => {
  return (
    <>
      <ambientLight />
      <Environment preset="sunset" />
      <PlayerController />
      <Ground />
      <directionalLight
        position={[0, 5, -10]}
        intensity={2.5}
        shadow-bias={-0.0001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
        castShadow
      />

      {/* <OrbitControls /> */}
    </>
  );
};
