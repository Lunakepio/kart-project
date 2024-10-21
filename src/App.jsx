/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Experience } from "./components/Experience";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import { HUD } from "./components/player/HUD";

function App() {

  const keyboardMap = [
    { name: "accelerate", keys: ["ArrowUp", "KeyW"] },
    { name: "brake", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: [" "] },
    { name: "reset", keys: ["KeyR"] },
    // { name: "run", keys: ["Shift"] },
  ];

  
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <HUD />
      <KeyboardControls map={keyboardMap}>
      <Canvas
      dpr={[0.5, 1]}
        camera={{
          position: [0, 10, 10],
          fov: 45,
        }}
        shadows
      >
        <color attach="background" args={['#1E1E1E']}/>
        <fog attach="fog" args={["#1E1E1E", 50, 100]} />
        <Suspense fallback={null}>
          <Physics timeStep={"vary"} gravity={[0, -90, 0]}>
            <Experience />
          </Physics>
        </Suspense>
      </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default App;
