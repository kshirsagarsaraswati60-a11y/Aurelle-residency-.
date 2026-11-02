
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  useGLTF,
  useScroll
} from '@react-three/drei'
import * as THREE from 'three'
import './style.css'

const rooms = [
  ['01', 'The Living Room', 'An atmosphere of understated elegance.'],
  ['02', 'Signature Dining', 'A setting for memorable moments.'],
  ['03', 'Designer Kitchen', 'Craftsmanship meets contemporary living.'],
  ['04', 'Master Bedroom', 'Your private desert-view retreat.'],
  ['05', 'Master Bathroom', 'A sanctuary of stone and light.']
]

// Load the apartment model
function Apartment() {
  const { scene } = useGLTF('/models/Aurelle_Residency_Final.glb')

  return <primitive object={scene} />
}

useGLTF.preload('/models/Aurelle_Residency_Final.glb')

// Starting camera path.
// These coordinates must be tuned to the actual model.
const views = [
  { position: [12, 7, 16], target: [0, 2, 0] },
  { position: [7, 4, 9], target: [0, 1.5, 0] },
  { position: [3, 3, 5], target: [0, 1.5, 0] },
  { position: [-5, 3, 4], target: [-2, 1.5, 0] },
  { position: [-7, 3, -4], target: [-5, 1.5, -3] },
  { position: [3, 3, -6], target: [3, 1.5, -7] }
]

function TourCamera() {
  const scroll = useScroll()
  const position = useRef(new THREE.Vector3())
  const target = useRef(new THREE.Vector3())
  const nextPosition = useRef(new THREE.Vector3())
  const nextTarget = useRef(new THREE.Vector3())

  useFrame(({ camera }, delta) => {
    const progress = scroll.offset * (views.length - 1)
    const index = Math.min(
      Math.floor(progress),
      views.length - 2
    )
    const blend = THREE.MathUtils.smoothstep(
      progress - index,
      0,
      1
    )

    const current = views[index]
    const next = views[index + 1]

    position.current.set(...current.position)
    nextPosition.current.set(...next.position)
    position.current.lerp(nextPosition.current, blend)

    target.current.set(...current.target)
    nextTarget.current.set(...next.target)
    target.current.lerp(nextTarget.current, blend)

    const smooth = 1 - Math.exp(-3 * delta)

    camera.position.lerp(position.current, smooth)
    camera.lookAt(target.current)
  })

  return null
}

function TourSections() {
  return (
    <Scroll html>
      <header className="topbar">
        <span className="brand">AURELLE</span>
        <span className="topbar-label">PRIVATE RESIDENCES</span>
      </header>

      <section className="hero">
        <p className="eyebrow">A NEW STANDARD OF LIVING</p>
        <h1>AURELLE<br />RESIDENCY</h1>
        <p className="subtitle">
          Space. Serenity. Sophistication.
        </p>
        <span className="scroll-hint">
          SCROLL TO EXPLORE ↓
        </span>
      </section>

      {rooms.map(([number, name, description]) => (
        <section className="room-section" key={number}>
          <p className="eyebrow">
            AURELLE RESIDENCY / {number}
          </p>
          <h2>{name}</h2>
          <p>{description}</p>
        </section>
      ))}

      <section className="closing">
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2>Discover a different<br />kind of home.</h2>
        <p>Aurelle Residency</p>
      </section>

      <footer>© AURELLE RESIDENCY</footer>
    </Scroll>
  )
}

function Scene() {
  return (
    <ScrollControls pages={7} damping={0.2}>
      <Suspense fallback={null}>
        <Apartment />
        <TourCamera />
      </Suspense>
      <TourSections />
    </ScrollControls>
  )
}

export default function App() {
  return (
    <main className="experience">
      <Canvas
        camera={{ position: [12, 7, 16], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0b0b0c']} />
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={2}
        />
        <Scene />
      </Canvas>
    </main>
  )
}
