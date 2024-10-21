import { Environment } from "@react-three/drei";
import { Ground } from "./Ground";
import { PlayerController } from "./player/PlayerController";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./player/Track";
import { RigidBody } from "@react-three/rapier";
import { useStore } from "./player/store/store";

export const Experience = () => {
  const { incrementLapCount, lapNotValidated, setLapNotValidated, setCheckpoint, checkpoint } = useStore();
  return (
    <>
      <ambientLight />
      <Environment preset="sunset"/>
      <PlayerController />
      <Ground />
      <directionalLight
        position={[0, 5, 10]}
        intensity={2.5}
        shadow-bias={-0.01}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
        castShadow
      />
      <RigidBody type={"fixed"} sensor={true}
      onIntersectionEnter={()=>{
        if(!lapNotValidated && checkpoint){
          incrementLapCount();
          setCheckpoint(false);
        } else {
          setLapNotValidated(false);
        }

      }}>
        <mesh scale={1} position={[6.5, -0.48, -15]}>
          <boxGeometry args={[13, 0, 1]} />
          <meshStandardMaterial color={"#ffffff"} />
        </mesh>
      </RigidBody>
      <RigidBody type={"fixed"} sensor={true}
      onIntersectionEnter={()=>{
        setCheckpoint(true);
      }}>
        <mesh scale={1} position={[-52, -0.48, -40]}>
          <boxGeometry args={[13, 0, 0.1]} />
          <meshStandardMaterial color={"#ffff00"} />
        </mesh>
      </RigidBody>
      <Model />
    </>
  );
};
