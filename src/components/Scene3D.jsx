import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Edges, RoundedBox } from '@react-three/drei'

// A warehouse crate floating in space — nods to logistics work
function Crate({ position, scale = 1, color, speed = 1 }) {
  const ref = useRef()
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.2 * speed
    ref.current.rotation.y += dt * 0.3 * speed
  })
  return (
    <Float speed={1.5 * speed} rotationIntensity={0.6} floatIntensity={1.4}>
      <RoundedBox ref={ref} args={[1, 1, 1]} radius={0.06} position={position} scale={scale}>
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.25} />
        <Edges color="#7dd3fc" threshold={15} />
      </RoundedBox>
    </Float>
  )
}

// Glowing distorted core — the "centerpiece"
function Core() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.15
  })
  return (
    <group ref={ref}>
      <Float speed={2} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.35, 8]} />
          <MeshDistortMaterial color="#6366f1" emissive="#312e81" distort={0.38} speed={2} roughness={0.15} metalness={0.6} />
        </mesh>
        <mesh scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.25} />
        </mesh>
      </Float>
    </group>
  )
}

// Orbit ring like a blueprint compass
function Ring({ radius, tilt, speed, color }) {
  const ref = useRef()
  useFrame((_, dt) => (ref.current.rotation.z += dt * speed))
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.012, 16, 160]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  )
}

// Rig: whole scene leans gently toward the mouse
function Rig({ children }) {
  const ref = useRef()
  const { size } = useThree()
  // On wide screens push the scene right so the hero text stays readable
  const shift = size.width > 900 ? 2.2 : 0
  useFrame(({ pointer }, dt) => {
    ref.current.position.x += (shift - ref.current.position.x) * dt * 3
    ref.current.rotation.y += (pointer.x * 0.35 - ref.current.rotation.y) * dt * 2
    ref.current.rotation.x += (-pointer.y * 0.2 - ref.current.rotation.x) * dt * 2
  })
  return <group ref={ref}>{children}</group>
}

export default function Scene3D() {
  const crates = useMemo(
    () => [
      { position: [-3.2, 1.4, -1], scale: 0.55, color: '#1e293b', speed: 1 },
      { position: [3.3, -1.2, -0.5], scale: 0.7, color: '#0f172a', speed: 0.8 },
      { position: [2.6, 1.9, -2], scale: 0.4, color: '#1e1b4b', speed: 1.3 },
      { position: [-2.7, -1.8, 0], scale: 0.45, color: '#172554', speed: 1.1 },
      { position: [0.2, 2.6, -3], scale: 0.3, color: '#1e293b', speed: 1.6 },
    ],
    []
  )

  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#a5b4fc" />
      <pointLight position={[-5, -3, 2]} intensity={30} color="#22d3ee" />
      <pointLight position={[4, 2, 3]} intensity={20} color="#c084fc" />
      <Rig>
        <Core />
        <Ring radius={2.6} tilt={[Math.PI / 2.4, 0, 0]} speed={0.3} color="#22d3ee" />
        <Ring radius={3.1} tilt={[Math.PI / 1.8, 0.4, 0]} speed={-0.2} color="#818cf8" />
        {crates.map((c, i) => (
          <Crate key={i} {...c} />
        ))}
        <Sparkles count={120} scale={[12, 8, 6]} size={2} speed={0.4} color="#a5f3fc" />
      </Rig>
    </Canvas>
  )
}
