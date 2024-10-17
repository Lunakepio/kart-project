/* eslint-disable react/no-unknown-property */
import { PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, BallCollider, vec3 } from "@react-three/rapier";
import { useRef } from "react";
import { Vector3, MathUtils } from "three";
import { Antenna } from "../models/Antenna";

export const PlayerController = () => {
  const rb = useRef();
  const character = useRef();
  const cameraPosition = useRef();
  const cameraLookAtPosition = useRef();
  const kart = useRef();
  const [, get] = useKeyboardControls();
  const isOnFloor = useRef(true);
  const isInTheAir = useRef(false);
  const jumpIsHeld = useRef(false);
  const driftDirection = useRef(undefined);

  const kartSettings = {
    maxRotationSpeed: 0.02,
    maxSpeed: 30,
    jumpForce: 1,
    accelerationFactor: 0.01,
  };

  const speed = useRef(0);
  const rotationSpeed = useRef(0);

  const driftForce = 0.025;
  useFrame(({ camera }) => {
    const { accelerate, brake, left, right, jump } = get();
    const driftStrength =
      driftDirection.current === "left"
        ? -0.2
        : driftDirection.current === "right"
        ? 0.2
        : 0;
    const kartRotation = character.current.rotation.y + driftStrength;
    const rbPosition = vec3(rb.current.translation());
    const forwardDirection = new Vector3(
      -Math.sin(kartRotation),
      0,
      -Math.cos(kartRotation)
    );

    if (accelerate) {
      speed.current = MathUtils.lerp(
        speed.current,
        kartSettings.maxSpeed,
        kartSettings.accelerationFactor
      );
    }
    if (!accelerate && !brake) {
      speed.current = MathUtils.lerp(speed.current, 0, 0.02);
    }
    rotationSpeed.current =
      Math.min(speed.current / kartSettings.maxSpeed, 1) *
      kartSettings.maxRotationSpeed;
    if (brake) {
      speed.current = MathUtils.lerp(
        speed.current,
        0,
        kartSettings.accelerationFactor * 4
      );
      if (speed.current < 0.1) {
        speed.current = MathUtils.lerp(
          speed.current,
          -kartSettings.maxSpeed,
          kartSettings.accelerationFactor
        );
      }
    }
    if (left) {
      character.current.rotation.y += rotationSpeed.current;
    }
    if (right) {
      character.current.rotation.y += -rotationSpeed.current;
    }
    if (jump && !jumpIsHeld.current) {
      rb.current.applyImpulse({ x: 0, y: kartSettings.jumpForce, z: 0 }, true);
      isOnFloor.current = false;
      jumpIsHeld.current = true;
      if (left) {
        driftDirection.current = "left";
      }
      if (right) {
        driftDirection.current = "right";
      }
    }
    if (!jump && isOnFloor.current) {
      jumpIsHeld.current = false;
      driftDirection.current = undefined;
    }
    if (driftDirection.current === "left") {
      character.current.rotation.y += driftForce;
      kart.current.rotation.y = MathUtils.lerp(
        kart.current.rotation.y,
        0.5 + (left ? 0.2 : right ? -0.2 : 0),
        0.1
      );
    }
    if (driftDirection.current === "right") {
      character.current.rotation.y -= driftForce;
      kart.current.rotation.y = MathUtils.lerp(
        kart.current.rotation.y,
        -0.5 + (right ? -0.2 : left ? 0.2 : 0),
        0.1
      );
    }
    if (driftDirection.current === undefined) {
      kart.current.rotation.y = MathUtils.lerp(kart.current.rotation.y, 0, 0.1);
    }

    rb.current.setLinvel({
      x: forwardDirection.x * speed.current,
      y: rb.current.linvel().y,
      z: forwardDirection.z * speed.current,
    });

    character.current.position.copy(rbPosition);
    // camera.position.lerp(
    //   cameraPosition.current.getWorldPosition(new Vector3()),
    //   0.4
    // );
    camera.lookAt(cameraLookAtPosition.current.getWorldPosition(new Vector3()));
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <RigidBody colliders={false} ref={rb} canSleep={false} ccd>
        <BallCollider
          args={[0.5]}
          onCollisionEnter={() => {
            isOnFloor.current = true;
          }}
        />
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
      </RigidBody>
      <group ref={character}>
        <mesh ref={cameraLookAtPosition} position={[0, 0, -10]}></mesh>

        <mesh ref={kart} castShadow receiveShadow>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial color="red" />
          <Antenna scale={0.1} position={[0.4, 0.2, 0.5]} />
        </mesh>
        
        <mesh position={[0, 1, 5]} ref={cameraPosition}></mesh>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} />
      </group>
    </>
  );
};
