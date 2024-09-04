import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import React, { forwardRef } from "react";
import { useKeyboardControls } from '@react-three/drei'; 
import * as THREE from 'three';

const direction = new THREE.Vector3();
const upVector = new THREE.Vector3();
const downVector = new THREE.Vector3();

window.rotationZ = 0;

const Paddle = forwardRef(({position, id, ...props}, ref) =>{
  const [boxRef, api] = useBox(() => ({
      onCollide: () => {   
        getZRotation()
        console.log("rotaciones:", rotationZ)
        if (api.position.copy != position){
          var posY;
          var posZ;
          api.position.subscribe((value) => {
             posY = value[1]
             posZ = value[2]

             api.position.set(position[0], posY, posZ)
          })
        }
      },
      mass: 1,
      position: position,
      args: [0.3, 1.2, 1.2],
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
      userData: {id: id}
  }))

  
  const [, get] = useKeyboardControls()
  useFrame((state) => {
    const { up, down} = get()
    upVector.set(0, up -down, 0)
    downVector.set(0, up - down, 0)
    direction.addVectors(upVector, downVector)
    api.velocity.set(direction.x, direction.y * 5, direction.z)
    
    
  })

  function getZRotation() {
    api.rotation.subscribe((value) => {
      rotationZ = value[2]
    })
    return window.rotationZ
  }

  return(
    <mesh ref={boxRef} {...forwardRef} {...props}>
        <boxGeometry args={[0.2, 1, 1]} />
        <meshStandardMaterial />
    </mesh>
  )
})
export default Paddle;
