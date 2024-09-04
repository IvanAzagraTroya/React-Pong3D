import { useBox } from "@react-three/cannon"
import { forwardRef } from "react"

const Sides = forwardRef(({position, name, sizeX, sizeY, sizeZ, ...props}, ref) => {
    const [wallRef] = useBox(() => ({
        mass: 1,
        position: position,
        args: [sizeX, sizeY, sizeZ],
        collisionFilterGroup: 2,
        collisionFilterMask: 1,
        isTrigger: false,
        type: "Static"
    })
)
return(
    <mesh ref={wallRef} {...forwardRef} {...props}>
        <boxGeometry args={[sizeX, sizeY, sizeZ]} />
        <meshStandardMaterial />
    </mesh>
  )
})

export default Sides;