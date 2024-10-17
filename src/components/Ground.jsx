/* eslint-disable react/no-unknown-property */
// import gridTexture from "/textures/grid-texture.png";
import UVCheckGrid from "/textures/UVCheckGrid.png";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useEffect } from "react";
import { RigidBody } from "@react-three/rapier";

export const Ground = () => {
  const diffuse = useLoader(TextureLoader, UVCheckGrid);

  useEffect(() => {
    diffuse.wrapS = RepeatWrapping;
    diffuse.wrapT = RepeatWrapping;
    diffuse.anisotropy = 4;
    diffuse.repeat.set(40, 40);
    diffuse.offset.set(0, 0);
  }, [diffuse]);
  return (
    <RigidBody position={[0, -0.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial map={diffuse} />
      </mesh>
    </RigidBody>
  );
};
