import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <main style={{
      width: '100%',
      height: '100vh',
      background: '#0b0b0c'
    }}>
      <Canvas>
        <ambientLight intensity={2} />
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
      </Canvas>

      <h1 style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#d4af37'
      }}>
        AURELLE WEBGL TEST
      </h1>
    </main>
  )
}    
