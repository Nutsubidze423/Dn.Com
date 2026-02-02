import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Luxury gold colors
const LUXURY_COLORS = [
  '#C9A227', // Primary gold
  '#E5D4A1', // Champagne gold
  '#A08220', // Deep gold
  '#F4E4BC', // Light gold
  '#D4AF37', // Classic gold
];

// Fragment component for shattered pieces - LUXURY UPGRADE
function Fragment({ position, rotation, scale, color, exploded, progress }) {
  const meshRef = useRef();
  const initialPosition = useMemo(() => position.clone(), [position]);
  
  const explosionDirection = useMemo(() => {
    const dir = position.clone().normalize();
    // More controlled explosion direction
    dir.x += (Math.random() - 0.5) * 0.3;
    dir.y += (Math.random() - 0.5) * 0.3;
    dir.z += (Math.random() - 0.5) * 0.3;
    return dir.normalize();
  }, [position]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (exploded) {
      const targetTime = progress * 6; // Slightly more explosion
      if (meshRef.current.currentTime !== targetTime) {
        const newPos = initialPosition.clone().add(
          explosionDirection.clone().multiplyScalar(targetTime)
        );
        meshRef.current.position.copy(newPos);
        // Smoother rotation
        meshRef.current.rotation.x += 0.015;
        meshRef.current.rotation.y += 0.02;
        // Fade out more gracefully
        meshRef.current.material.opacity = Math.max(0, 1 - progress * 0.9);
        meshRef.current.currentTime = targetTime;
      }
    } else {
      // Smoother return to position
      meshRef.current.position.lerp(initialPosition, 0.08);
      meshRef.current.rotation.x *= 0.92;
      meshRef.current.rotation.y *= 0.92;
      meshRef.current.material.opacity = 1;
      meshRef.current.currentTime = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[0.12, 0.12, 0.12]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.8} 
        roughness={0.1}
        envMapIntensity={2}
        transparent
      />
    </mesh>
  );
}

// Main statue component - LUXURY UPGRADE
function Statue({ scrollProgress }) {
  const groupRef = useRef();
  
  // Generate fragments for head shape - MORE FRAGMENTS for luxury detail
  const fragments = useMemo(() => {
    const frags = [];
    
    // Create a head shape using spherical distribution - INCREASED COUNT
    for (let i = 0; i < 600; i++) {
      const phi = Math.acos(-1 + (2 * i) / 600);
      const theta = Math.sqrt(600 * Math.PI) * phi;
      
      const radius = 1.2;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.cos(phi) * 1.3 - 0.3;
      const z = radius * Math.sin(theta) * Math.sin(phi) * 0.9;
      
      if (y > -1.5 && y < 1.2 && Math.abs(x) < 1.1 && Math.abs(z) < 1.1) {
        frags.push({
          position: new THREE.Vector3(x, y, z),
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          scale: 0.4 + Math.random() * 0.6,
          color: LUXURY_COLORS[Math.floor(Math.random() * LUXURY_COLORS.length)],
          id: i
        });
      }
    }
    
    // Add shoulder/neck fragments - INCREASED COUNT
    for (let i = 0; i < 250; i++) {
      const angle = (i / 250) * Math.PI * 2;
      const radius = 1.3 + Math.random() * 0.3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.6;
      const y = -1.8 - Math.random() * 0.8;
      
      frags.push({
        position: new THREE.Vector3(x, y, z),
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.5 + Math.random() * 0.6,
        color: LUXURY_COLORS[Math.floor(Math.random() * LUXURY_COLORS.length)],
        id: i + 600
      });
    }
    
    return frags;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Subtle breathing animation when assembled
    if (scrollProgress < 0.1) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  const isExploded = scrollProgress > 0.15;

  return (
    <group ref={groupRef}>
      {fragments.map((frag) => (
        <Fragment
          key={frag.id}
          position={frag.position}
          rotation={frag.rotation}
          scale={frag.scale}
          color={frag.color}
          exploded={isExploded}
          progress={Math.max(0, (scrollProgress - 0.15) * 1.4)}
        />
      ))}
      
      {/* LUXURY LIGHTING SETUP */}
      {/* Ambient light for base illumination - BRIGHTER */}
      <ambientLight intensity={0.5} />
      
      {/* Main key light - warm gold - BRIGHTER */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={2} 
        color="#FFF8E7"
        castShadow
      />
      
      {/* Fill light - cool white - BRIGHTER */}
      <directionalLight 
        position={[-5, -5, 5]} 
        intensity={1.2} 
        color="#E8E8E8"
      />
      
      {/* Rim light - gold accent - BRIGHTER */}
      <directionalLight 
        position={[0, 5, -5]} 
        intensity={1.5} 
        color="#C9A227"
      />
      
      {/* Point lights for sparkle - BRIGHTER */}
      <pointLight 
        position={[2, 2, 3]} 
        intensity={2.5} 
        color="#E5D4A1" 
        distance={8}
        decay={2}
      />
      
      <pointLight 
        position={[-2, -1, 3]} 
        intensity={2} 
        color="#C9A227" 
        distance={8}
        decay={2}
      />
      
      <pointLight 
        position={[0, -2, 2]} 
        intensity={1.8} 
        color="#F4E4BC" 
        distance={6}
        decay={2}
      />
      
      {/* Additional fill light */}
      <pointLight 
        position={[0, 0, 4]} 
        intensity={1.5} 
        color="#FFFFFF" 
        distance={10}
        decay={2}
      />
    </group>
  );
}

// Floating particles for atmosphere - LUXURY UPGRADE
function Particles({ count = 150 }) {
  const points = useRef();
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.03;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.08;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#C9A227"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene component
function Scene({ scrollProgress }) {
  return (
    <>
      <Float
        speed={0.8}
        rotationIntensity={0.15}
        floatIntensity={0.2}
      >
        <Statue scrollProgress={scrollProgress} />
      </Float>
      
      <Particles count={150} />
    </>
  );
}

// Main export component
export default function ShatteringStatue({ scrollProgress }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
