/* eslint-disable react/no-unknown-property */
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, BallCollider, vec3 } from "@react-three/rapier";
import { useRef } from "react";
import { Vector3, MathUtils } from "three";
import { Car } from "./Car";

export const PlayerController = () => {
  const rb = useRef();
  const character = useRef();
  const cameraPosition = useRef();
  const cameraLookAtPosition = useRef();
  const kart = useRef();
  const [, get] = useKeyboardControls();
  const isOnFloor = useRef(true);

  const kartSettings = {
    maxRotationSpeed: 0.02,
    maxSpeed: 45,
    jumpForce: 1,
    accelerationFactor: 0.002,
    deccelerationFactor: 0.002
  };

  const speed = useRef(0);
  const rotationSpeed = useRef(0);


  
  useFrame(({ camera }, delta) => {
    const { accelerate, brake, left, right, reset } = get();
    const kartRotation = character.current.rotation.y
    const rbPosition = vec3(rb.current.translation());
    const forwardDirection = new Vector3(
      -Math.sin(kartRotation),
      0,
      -Math.cos(kartRotation)
    );
    
    const deltaAdjusted = delta * 144;

    if (accelerate) {
      speed.current = MathUtils.lerp(
        speed.current,
        kartSettings.maxSpeed,
        kartSettings.accelerationFactor * deltaAdjusted
      );
    }
    if (!accelerate && !brake) {
      speed.current = MathUtils.lerp(speed.current, 0, kartSettings.deccelerationFactor * deltaAdjusted);
    }
    if (brake) {
      kart.current.isBreaking = true;
      speed.current = MathUtils.lerp(
        speed.current,
        0,
        kartSettings.accelerationFactor * 3 * deltaAdjusted
      );
      if (speed.current < 1) {
        speed.current = MathUtils.lerp(
          speed.current,
          -kartSettings.maxSpeed * 2,
          kartSettings.accelerationFactor * deltaAdjusted
        );
        kart.current.reverse = true;
        cameraPosition.current.position.z = -5;
        cameraLookAtPosition.current.position.z = 10;
      }
    } else {
      kart.current.isBreaking = false;
      kart.current.reverse = false;
      cameraPosition.current.position.z = 4;
      cameraLookAtPosition.current.position.z = -10;
    }
    if((speed.current > 1 || speed.current < -1) && (left || right)){
      rotationSpeed.current = MathUtils.lerp(rotationSpeed.current, left ? kartSettings.maxRotationSpeed : right ? -kartSettings.maxRotationSpeed : 0, 0.01 * deltaAdjusted);
    }
    if ((!left && !right) || !accelerate) {
      rotationSpeed.current = MathUtils.lerp(rotationSpeed.current, 0, 0.01 * deltaAdjusted);
    }
      character.current.rotation.y += rotationSpeed.current * deltaAdjusted;
      kart.current.rotation.y = rotationSpeed.current * 15;

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
      0.1 * deltaAdjusted
    );
    camera.lookAt(cameraLookAtPosition.current.getWorldPosition(new Vector3()));
    if(reset){
      character.current.position.set(6, 15, 0);
      rb.current.setLinvel({ x: 0, y: 0, z: 0 });
      rb.current.setAngvel({ x: 0, y: 0, z: 0 });
      rb.current.setTranslation({ x: 6, y: 5, z: 0 });
      rb.current.setRotation({ x: 0, y: 0, z: 0 })
      character.current.rotation.y = 0;
      kart.current.rotation.y = 0;
      speed.current = 0;
      rotationSpeed.current = 0;  
      
    }
  });

  return (
    <>
      <RigidBody position={[6, 15, 0]} colliders={false} ref={rb} canSleep={false} ccd>
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
        </group>
        <mesh position={[0, 1, 4]} ref={cameraPosition}></mesh>
      </group>
    </>
  );
};
