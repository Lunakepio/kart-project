/* eslint-disable react/no-unknown-property */
import { PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, BallCollider, vec3 } from "@react-three/rapier";
import { useRef } from "react";
import { Vector3, MathUtils } from "three";
import { Antenna } from "../models/Antenna";
import { Car } from "./Car";

export const PlayerController = () => {
  const rb = useRef();
  const character = useRef();
  const cameraPosition = useRef();
  const cameraLookAtPosition = useRef();
  const kart = useRef();
  const [, get] = useKeyboardControls();
  const isOnFloor = useRef(true);
  const jumpIsHeld = useRef(false);
  const driftDirection = useRef(undefined);

  const kartSettings = {
    maxRotationSpeed: 0.015,
    maxSpeed: 30,
    jumpForce: 1,
    accelerationFactor: 0.005,
    deccelerationFactor : 0.002
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
      speed.current = MathUtils.lerp(speed.current, 0, kartSettings.deccelerationFactor);
    }
    if (brake) {
      kart.current.isBreaking = true;
      speed.current = MathUtils.lerp(
        speed.current,
        0,
        kartSettings.accelerationFactor * 4
      );
      if (speed.current < 0.1) {
        speed.current = MathUtils.lerp(
          speed.current,
          -kartSettings.maxSpeed * 2,
          kartSettings.accelerationFactor
        );
        kart.current.reverse = true;
      }
    } else {
      kart.current.isBreaking = false;
      kart.current.reverse = false;
    }
    if((speed.current > 1 || speed.current < -1) && (left || right)){
      rotationSpeed.current = MathUtils.lerp(rotationSpeed.current, left ? kartSettings.maxRotationSpeed : right ? -kartSettings.maxRotationSpeed : 0, 0.01);
    }
    if ((!left && !right) || !accelerate) {
      rotationSpeed.current = MathUtils.lerp(rotationSpeed.current, 0, 0.01);
    }
      character.current.rotation.y += rotationSpeed.current;
      kart.current.rotation.y = rotationSpeed.current * 15;
      
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
      // kart.current.rotation.y = MathUtils.lerp(
      //   kart.current.rotation.y,
      //   0.5 + (left ? 0.2 : right ? -0.2 : 0),
      //   0.1
      // );
    }
    if (driftDirection.current === "right") {
      character.current.rotation.y -= driftForce;
      // kart.current.rotation.y = MathUtils.lerp(
      //   kart.current.rotation.y,
      //   -0.5 + (right ? -0.2 : left ? 0.2 : 0),
      //   0.1
      // );
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
    kart.current.speed = speed.current;
    kart.current.rotationSpeed = rotationSpeed.current;
    camera.position.lerp(
      cameraPosition.current.getWorldPosition(new Vector3()),
      0.1
    );
    camera.lookAt(cameraLookAtPosition.current.getWorldPosition(new Vector3()));
    // camera.updateMatrixWorld();
    // camera.updateProjectionMatrix();
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

      </RigidBody>
      <group ref={character}>
        <mesh ref={cameraLookAtPosition} position={[0, 0, -10]}></mesh>

        <group ref={kart}>
          <Car kart={kart}/>
          {/* <Antenna scale={0.1} position={[0.4, 0.2, 0.5]} /> */}
        </group>
        
        <mesh position={[0, 1, 5]} ref={cameraPosition}></mesh>
        {/* <PerspectiveCamera makeDefault position={[0, 0.4, 5]} /> */}
      </group>
    </>
  );
};
