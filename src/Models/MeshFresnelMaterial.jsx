import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color, TextureLoader } from "three";


export default function MeshFresnelMaterial(
    {
        fresnelColor = '#02feff', // fresnel color
        baseColor = '#0777fd', // base mesh color
        amount = 1.5, // how much fresnel
        offset = 0.05, // offset for fine grain control
        intensity = 1.5, // color threshold multiplier
        fresnelAlpha = 1, // alpha of the fresnel effect over the diffused color
        alpha = false, // used to have fresnel be all thats visible
        texture = ''

    }
)
{
    const uniforms =
    {
        uFresnelColor: new Color( fresnelColor ),
        uBaseColor: new Color( baseColor ),
        uFresnelAmt : amount,
        uFresnelOffset: offset,
        uFresnelIntensity: intensity,
        uFresnelAlpha: fresnelAlpha,
        uFresnelTexture: { value: new TextureLoader().load(texture) }
    }

    const vertexShader = /*glsl*/ `

    varying vec2 vUv;
    out vec3 vView;
    out vec3 vNormal;

    void main()
    {
        vUv = uv;
        vec3 objectPosition = ( modelMatrix * vec4( position, 1.0 ) ).xyz; // object space coordinates

        vView = normalize( cameraPosition - objectPosition ); // view direction in object space
        vNormal = normalize( ( modelMatrix * vec4( normal, 0.0 ) ).xyz ); // normalized object space normals

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }

    `
    const fragmentShader = /*glsl*/ `

        uniform sampler2D uFresnelTexture;
        uniform vec3 uFresnelColor;
        uniform vec3 uBaseColor;
        uniform float uFresnelAmt;
        uniform float uFresnelOffset;
        uniform float uFresnelIntensity;
        uniform float uFresnelAlpha;

        in vec3 vView;
        in vec3 vNormal;
        varying vec2 vUv;

        float lambertLighting( vec3 normal, vec3 viewDirection )
        {
            return max( dot( normal, viewDirection ), 0.0 );
        }

        float fresnelFunc( float amount, float offset, vec3 normal, vec3 view)
        {
            return offset + ( 1.0 - offset ) * pow( 1.0 - dot( normal , view ), amount );
        }

        void main()
        {
            vec4 texColor = texture2D(uFresnelTexture, vUv);

            // fresnel color
            float fresnel = fresnelFunc( uFresnelAmt, uFresnelOffset, vNormal, vView );
            vec3 fresnelColor = ( uFresnelColor * fresnel ) * uFresnelIntensity;

            // lambert color
            float diffuse = lambertLighting( vNormal, vView );
            vec3 diffuseColor = uBaseColor * diffuse;

            vec3 finalColor = mix( diffuseColor, fresnelColor, fresnel * uFresnelAlpha );

            float alpha = ${ alpha ? 'fresnel;': ' 1.0;'}

            gl_FragColor = ${ alpha ? 'vec4( fresnelColor, fresnel );': 'vec4( finalColor, 1.0 );' } 
        }
    
    `

    const MeshFresnelMaterial = shaderMaterial( uniforms, vertexShader, fragmentShader )

    extend({ MeshFresnelMaterial })

    return (
        <meshFresnelMaterial
            key={ MeshFresnelMaterial.key }
            transparent={ false }
        />
    )
}