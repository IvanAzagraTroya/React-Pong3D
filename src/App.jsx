import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Physics } from "@react-three/cannon";
import { KeyboardControls } from "@react-three/drei";
import React from "react";

import Paddle from "./Models/Paddle";
import Ball from "./Models/Ball";
import Wall from "./Models/Wall";
import Sides from "./Models/Sides";

function App() {

  const paddle1Ref = useRef();
  const paddle2Ref = useRef();
  const ballRef = useRef();

  const top = useRef();
  const bottom = useRef();
  const left = useRef();
  const right = useRef();

  var ancho = window.innerWidth;
  var alto = window.innerHeight;
    
  return (
      <Canvas id="app_canvas">
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Physics gravity={[0, 0, 0]} iterations={20} tolerance={0.01}
        defaultContactMaterial={{
          friction: 0,
          restitution: 0.7,
          contactEquationStiffness: 1e7,
          contactEquationRelaxation: 1,
        }}>
          {/* Top */}
          <Sides ref={top} position = {[-10, 4.4, 0]} name={"top"} isTrigger={false} sizeX={ancho} sizeY = {.5} sizeZ={1}/>
          {/* Left */}
          <Wall ref={left} position={[-11, 0, 0]} name={"wall1"} sizeX={1} sizeY={alto} sizeZ={1}/>
          <KeyboardControls map = {[
            { name: "up", keys: ["w", "W"] },
            { name: "down", keys: ["s", "S"] }
          ]}>
          <Paddle ref={paddle1Ref} position={[-5, 0, 0]} id={"paddle1"}/>
          </KeyboardControls>
          <KeyboardControls map = {[
            { name: "up", keys: ["ArrowUp"] },
            { name: "down", keys: ["ArrowDown"] }
          ]}>
          <Paddle ref={paddle2Ref} position={[5, 0, 0]} id={"paddle2"}/>
          </KeyboardControls>
          <Ball ref = {ballRef}/>
          {/* Right */}
          <Wall ref={right} position={[11, 0, 0]} name={"wall2"} sizeX={1} sizeY={alto} sizeZ={1}/>
          {/* Bottom */}
          <Sides ref={bottom} position = {[-10, -4.4, 0]} name={"bottom"} isTrigger={false} sizeX={ancho/2} sizeY = {.5} sizeZ={1}/>
        </Physics>
      </Canvas>
  )
}

export default App;