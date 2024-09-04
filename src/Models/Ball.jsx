import { useFrame } from "@react-three/fiber";
import React, {forwardRef } from "react";
import * as CANNON from '@react-three/cannon'
import { TextureLoader } from "three";

import MeshFresnelMaterial from "./MeshFresnelMaterial";

var velocity = 2;
var velocityY = 0;

const texture = new TextureLoader().load('src/assets/ball_texture.webp');

const Ball = forwardRef(({position, ...props}, ref) =>{
    const [ballRef, api] = CANNON.useSphere(
    () => ({
        onCollide: () => {   
            if(velocity >= 10){
                velocity = -10
                velocityY = window.rotationZ
                
                api.velocity.set(velocity, velocityY, 0)
            }else if (velocity <= -10){
                velocity = 10
                velocityY = window.rotationZ
                api.velocity.set(velocity, velocityY, 0)
            }
            else {
                velocity *= -1.5
                api.velocity.set(velocity, 0, 0)
            }
        },
        mass: 1,
        position: [0, 0, 0],
        args: [0.2, 0.2, 0.2],
        collisionFilterGroup: 1,
        collisionFilterMask: 2,
        type: "Dinamic",
        ccd: false
    }),
    )

    const { FresnelFactor, FresnelBias, FresnelIntensity, rimColor, bodyColor, fresnelAlpha, fresnelOnly, texture } =
        {
          FresnelFactor: 0.6,
          FresnelBias:0.05,
          FresnelIntensity:1.5,
          rimColor: '#02FEFF',
          bodyColor:
          {
            value: '#0777FD'
          },
          fresnelAlpha:1,
          fresnelOnly:
          {
            value: true
          },
          texture: 'src/assets/ball_texture.webp'
        }

    var start = true
    useFrame((state) => {
        if(start){
            console.log("Starting")
            api.velocity.set(-velocity, 0, 0)
            start = false
        }
    })
  
    return(
      <mesh ref={ballRef} {...props}>
            <sphereGeometry args={[0.2, 8]} />
            <MeshFresnelMaterial
              fresnelColor={ rimColor }
              baseColor={ bodyColor }
              amount={ FresnelFactor }
              offset={ FresnelBias }
              intensity={ FresnelIntensity }
              fresnelAlpha={ fresnelAlpha }
              alpha={ fresnelOnly }
              texture= {texture}
            />
      </mesh>
      
    )
  })
  export default Ball;