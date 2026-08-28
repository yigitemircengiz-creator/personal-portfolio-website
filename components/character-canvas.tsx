'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

function Avatar({ isReady = true }: { isReady?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const texture = useLoader(THREE.TextureLoader, '/avatar.png')
  const clock = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current || !matRef.current) return

    if (isReady) {
      clock.current += delta
      const progress = THREE.MathUtils.clamp(clock.current * 1.4, 0, 1)
      matRef.current.opacity = progress
      
      const currentScale = THREE.MathUtils.lerp(0.85, 1, progress)
      groupRef.current.scale.set(currentScale, currentScale, currentScale)
    } else {
      matRef.current.opacity = 0
      groupRef.current.scale.set(0.85, 0.85, 0.85)
    }

    const { x, y } = state.pointer
    const t = state.clock.elapsedTime
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x * 0.12, 0.04)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y * 0.08 + Math.sin(t * 0.8) * 0.015, 0.04)
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[3.7, 3.7]} />
        <meshStandardMaterial
          ref={matRef}
          map={texture}
          transparent
          opacity={0}
          roughness={0.6}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function CharacterCanvas({ isReady = true }: { isReady?: boolean }) {
  return (
    <Canvas
      dpr={[1, 4]}
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 4))
        gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false)
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color="#9ca3af" />
      <Suspense fallback={null}>
        <Avatar isReady={isReady} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  )
}