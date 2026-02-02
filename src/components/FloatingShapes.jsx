import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating geometric shape
function FloatingShape({ position, color, shape, speed, scale }) {
  const meshRef = useRef();
  const initialY = position[1];
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle floating motion
    meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'torus':
        return <torusGeometry args={[0.7, 0.3, 16, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [shape]);

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial 
        color={color} 
        metalness={0.8} 
        roughness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Particle field for depth
function ParticleField({ count = 50 }) {
  const points = useRef();
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={0.04}
        color="#D4AF37"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#FFFFFF" />
      <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#D4AF37" />
      
      {/* Floating shapes */}
      <FloatingShape 
        position={[-4, 1, -3]} 
        color="#D4AF37" 
        shape="icosahedron" 
        speed={0.5}
        scale={0.8}
      />
      <FloatingShape 
        position={[4, -1, -4]} 
        color="#C9B037" 
        shape="octahedron" 
        speed={0.7}
        scale={0.6}
      />
      <FloatingShape 
        position={[-2, -2, -2]} 
        color="#F4E4BC" 
        shape="torus" 
        speed={0.4}
        scale={0.5}
      />
      <FloatingShape 
        position={[3, 2, -5]} 
        color="#B8941F" 
        shape="box" 
        speed={0.6}
        scale={0.4}
      />
      
      <ParticleField count={40} />
    </>
  );
}

// Background component for sections
export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
