/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useScroll,
  Scroll,
  ScrollControls,
  Environment,
  Float,
} from '@react-three/drei';

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function FluidGlass({
  children,
  mode = 'lens',
}: {
  children?: React.ReactNode;
  mode?: 'lens' | 'cube' | 'bar' | any;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundColor: '#050505',
        backgroundImage: `
          radial-gradient(circle at 20% 40%, rgba(122, 105, 249, 0.4) 0%, transparent 60%),
          radial-gradient(circle at 80% 60%, rgba(242, 99, 120, 0.4) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(245, 131, 63, 0.2) 0%, transparent 80%)
        `
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 15 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <Environment preset="city" />

        <ScrollControls damping={0.2} pages={4} distance={0.5}>
          <Scroll>
            <BackgroundObjects />
          </Scroll>

          <GlassLens mode={mode} />

          <Scroll html style={{ width: '100%' }}>
            <div style={{ pointerEvents: 'auto' }}>
              {children}
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

// ─── Glass Lens ───────────────────────────────────────────────────────────────

function GlassLens({ mode }: { mode: string }) {
  const ref = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    if (mode === 'cube') return new THREE.BoxGeometry(2, 2, 0.4);
    if (mode === 'bar')  return new THREE.BoxGeometry(6, 0.6, 0.3);
    return new THREE.CylinderGeometry(1, 1, 0.15, 64);
  }, [mode]);

  useFrame((state) => {
    if (!ref.current) return;
    const { viewport, pointer, camera } = state;
    
    // Defensive check for viewport
    if (!viewport) return;
    
    // Avoid getCurrentViewport which might be missing/different in some R3F versions
    // Using viewport properties directly or with fallback
    const v = (viewport as any).getCurrentViewport ? (viewport as any).getCurrentViewport(camera, new THREE.Vector3(0, 0, 15)) : viewport;
    if (!v) return;

    // Use fallback for pointer to prevent NaN errors
    const px = pointer?.x ?? 0;
    const py = pointer?.y ?? 0;

    const destX = (px * v.width) / 2;
    const destY = (py * v.height) / 2;
    
    ref.current.position.x += (destX - ref.current.position.x) * 0.1;
    ref.current.position.y += (destY - ref.current.position.y) * 0.1;
    ref.current.position.z = 15;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      rotation-x={Math.PI / 2}
      scale={0.13}
    >
      <meshPhysicalMaterial
        transmission={1}
        thickness={1}
        roughness={0.05}
        ior={1.2}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0}
        transparent={true}
        color="#ffffff"
      />
    </mesh>
  );
}

// ─── Background Shapes ────────────────────────────────────────────────────────

function BackgroundObjects() {
  const group = useRef<THREE.Group>(null!);
  const data = useScroll();

  useFrame((state, delta) => {
    if (!group.current || !data) return;
    const t = data.offset || 0;
    
    if (group.current.children) {
      group.current.children.forEach((child, i) => {
        if (child.rotation) {
          child.rotation.x += delta * 0.1 * (i % 2 === 0 ? 1 : -1);
          child.rotation.y += delta * 0.1 * (i % 3 === 0 ? 1 : -1);
        }
      });
    }
    group.current.position.y = t * 10;
  });

  return (
    <group ref={group}>
      <Float speed={2}>
        <mesh position={[-5, 2, -5]}>
          <sphereGeometry args={[2.5, 48, 48]} />
          <meshStandardMaterial color="#0026ff" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={1.5}>
        <mesh position={[5, 4, -8]}>
          <sphereGeometry args={[3, 48, 48]} />
          <meshStandardMaterial color="#7A69F9" roughness={0.3} metalness={0.6} />
        </mesh>
      </Float>

      <Float speed={2.5}>
        <mesh position={[-3, -4, -4]} rotation={[0.5, 0.2, 0]}>
          <torusGeometry args={[2, 0.6, 32, 64]} />
          <meshStandardMaterial color="#F5833F" roughness={0.1} metalness={0.9} />
        </mesh>
      </Float>

      <Float speed={2}>
        <mesh position={[4, -10, -6]}>
          <sphereGeometry args={[2.5, 48, 48]} />
          <meshStandardMaterial color="#F26378" roughness={0.2} metalness={0.7} />
        </mesh>
      </Float>

      <mesh position={[0, -18, -10]} rotation={[0.3, 0.5, 0]}>
        <octahedronGeometry args={[4]} />
        <meshStandardMaterial color="#0015b3" roughness={0.15} metalness={0.85} />
      </mesh>
    </group>
  );
}
