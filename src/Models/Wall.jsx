import { useBox } from "@react-three/cannon"
import { forwardRef } from "react"

window.points1 = 0;
window.points2 = 0;
const points1Element = document.getElementById('points1');
const points2Element = document.getElementById('points2');
const Wall = forwardRef(({position, name, sizeX, sizeY, sizeZ, ...props}, ref) => {
    const [wallRef] = useBox(() => (
        {
        onCollide: () => {
            if(name == "wall1"){
                points1++;
                points1Element.textContent = window.points1
                console.log("puntos1: ", window.points1);
            }
            if(name="wall2"){
                points2++;
                points2Element.textContent = window.points2
                console.log("puntos2: ", window.points2);
            }
            else {
                console.log("techo|suelo")
                return;
            }
        },
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

export default Wall;