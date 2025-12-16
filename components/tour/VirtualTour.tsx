'use client'

import { useState, Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Html, Stars, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Info, ArrowLeft, Sparkles as SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import * as THREE from 'three'

interface Hotspot {
  id: string
  position: [number, number, number]
  title: string
  description: string
  videoUrl?: string
  type: 'device' | 'area'
}

const hotspots: Hotspot[] = [
  {
    id: 'vision-pro',
    position: [2, 1.5, 0],
    title: 'Apple Vision Pro',
    description: 'Experience immersive AR/VR with cutting-edge spatial computing technology. Explore virtual worlds and create stunning 3D experiences.',
    type: 'device',
  },
  {
    id: 'drones',
    position: [-2, 1, 1],
    title: 'Drone Fleet',
    description: 'Learn aerial photography and drone piloting with our professional drone collection. Master IoT integration and autonomous flight systems.',
    type: 'device',
  },
  {
    id: '3d-printer',
    position: [0, 0.5, -2],
    title: '3D Printers',
    description: 'Turn your digital designs into reality with our advanced 3D printing lab. Create prototypes and functional models with precision.',
    type: 'device',
  },
  {
    id: 'iot-kits',
    position: [-2, 0.5, -1],
    title: 'IoT Development Kits',
    description: 'Build smart devices and connected systems with our comprehensive IoT kits. Create automated solutions and smart home integrations.',
    type: 'device',
  },
  {
    id: 'ai-lab',
    position: [4, 1.2, -1],
    title: 'AI & LLM Lab',
    description: 'Explore Large Language Models and AI fundamentals. Learn how neural networks work through interactive visualizations.',
    type: 'area',
  },
  {
    id: 'bio-lab',
    position: [-3, 1, -2],
    title: 'Biology Laboratory',
    description: 'Conduct virtual biology experiments with 3D cell models, DNA extraction, and enzyme activity tests. Interactive microscope included.',
    type: 'area',
  },
  {
    id: 'chemistry-lab',
    position: [1, 1, -3],
    title: 'Chemistry Laboratory',
    description: 'Explore chemical reactions, balance equations, and understand molecular interactions with 3D atomic structure models.',
    type: 'area',
  },
  {
    id: 'nursing-lab',
    position: [-4, 1.2, 0],
    title: 'Nursing Lab Simulation',
    description: 'Practice clinical skills with virtual patients. Learn vital signs assessment, wound care, and patient monitoring with 3D anatomical models.',
    type: 'area',
  },
  {
    id: 'vr-lab',
    position: [3, 1, 2],
    title: 'VR Lab',
    description: 'Dedicated space for virtual reality experiences and development. Create immersive educational content and interactive simulations.',
    type: 'area',
  },
]

// Animated pulsing hotspot
function HotspotMarker({ 
  hotspot, 
  onClick, 
  isHovered = false 
}: { 
  hotspot: Hotspot
  onClick: () => void
  isHovered?: boolean
}) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Pulsing animation
    if (outerRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 0.25
      outerRef.current.scale.setScalar(pulse / 0.25)
      const material = outerRef.current.material as THREE.MeshStandardMaterial
      if (material && 'opacity' in material) {
        material.opacity = (Math.sin(time * 2) * 0.2 + 0.4)
      }
    }
    
    // Rotating core
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.5
      coreRef.current.rotation.y = time * 0.5
    }
    
    // Floating animation
    if (groupRef.current) {
      groupRef.current.position.y = hotspot.position[1] + Math.sin(time * 1.5) * 0.1
    }
    
    // Hover intensity
    if (innerRef.current) {
      const intensity = isHovered 
        ? 1.5 + Math.sin(time * 5) * 0.3 
        : 0.8 + Math.sin(time * 2) * 0.2
      ;(innerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity
    }
  })
  
  // Particle system around hotspot
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 0.4,
      speed: 0.5 + Math.random() * 0.3
    }))
  }, [])
  
  return (
    <group ref={groupRef} position={hotspot.position}>
      {/* Animated particles */}
      {particles.map((particle, i) => (
        <Particle key={i} angle={particle.angle} radius={particle.radius} speed={particle.speed} />
      ))}
      
      {/* Pulsing outer glow */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color="#0071e3" 
          emissive="#0071e3" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Main hotspot sphere */}
      <mesh 
        ref={innerRef}
        onClick={onClick} 
        onPointerOver={() => {}} 
        onPointerOut={() => {}}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={isHovered ? "#0071e3" : "#0ea5e9"} 
          emissive={isHovered ? "#0071e3" : "#0ea5e9"} 
          emissiveIntensity={isHovered ? 1.5 : 0.8}
        />
      </mesh>
      
      {/* Inner bright rotating core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Energy rings */}
      <EnergyRings isHovered={isHovered} />
      
      <Html distanceFactor={2} position={[0, 0.6, 0]} center>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -8 : 0
          }}
          transition={{ duration: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg text-sm font-medium text-gray-900 whitespace-nowrap border-2 border-accent/50 cursor-pointer hover:border-accent transition-all"
          style={{
            boxShadow: isHovered ? '0 0 20px rgba(0, 113, 227, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {hotspot.title}
        </motion.div>
      </Html>
    </group>
  )
}

// Floating particle component
function Particle({ angle, radius, speed }: { angle: number, radius: number, speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime() * speed
      ref.current.position.x = Math.cos(angle + time) * radius
      ref.current.position.z = Math.sin(angle + time) * radius
      ref.current.position.y = Math.sin(time * 2) * 0.2
      ref.current.rotation.y = time
    }
  })
  
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial 
        color="#0071e3" 
        emissive="#0071e3" 
        emissiveIntensity={1}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Energy rings around hotspot
function EnergyRings({ isHovered }: { isHovered: boolean }) {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.5
      ring1Ref.current.rotation.x = Math.sin(time) * 0.2
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.3
      ring2Ref.current.rotation.z = Math.cos(time) * 0.2
    }
  })
  
  if (!isHovered) return null
  
  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.3, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#0071e3" 
          emissive="#0071e3" 
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.35, 0.015, 16, 100]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          emissive="#0ea5e9" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </>
  )
}

// Animated floor grid
function AnimatedFloor() {
  const floorRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (floorRef.current) {
      const time = state.clock.getElapsedTime()
      const material = floorRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = Math.sin(time * 0.5) * 0.1 + 0.1
    }
  })
  
  return (
    <>
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial 
          color="#f5f5f5" 
          emissive="#e0e0e0"
          emissiveIntensity={0.1}
        />
      </mesh>
      <gridHelper args={[20, 20, '#0071e3', '#d0d0d0']} />
    </>
  )
}

// Floating tech icons
function FloatingIcon({ position, rotationSpeed }: { position: [number, number, number], rotationSpeed: number }) {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      ref.current.position.y = position[1] + Math.sin(time * 1.5) * 0.3
      ref.current.rotation.y = time * rotationSpeed
    }
  })
  
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial 
          color="#0071e3" 
          emissive="#0071e3" 
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

function Scene({ onHotspotClick }: { onHotspotClick: (hotspot: Hotspot) => void }) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)
  
  // Note: useState in Scene component requires 'use client' directive
  // This is handled by the parent component

  return (
    <>
      {/* Enhanced lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#0071e3" />
      <pointLight position={[10, 5, -5]} intensity={0.6} color="#0ea5e9" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} />
      
      {/* Starfield background */}
      <Stars radius={50} depth={50} count={1000} factor={2} fade speed={0.5} />
      
      {/* Sparkles effect */}
      <Sparkles count={50} scale={20} size={2} speed={0.4} opacity={0.6} color="#0071e3" />
      
      {/* Animated floor */}
      <AnimatedFloor />
      
      {/* Room walls with glow */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial 
          color="#e5e5e5" 
          emissive="#f0f0f0"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Floating tech icons */}
      <FloatingIcon position={[-5, 2, 3]} rotationSpeed={0.5} />
      <FloatingIcon position={[5, 2.5, -3]} rotationSpeed={-0.3} />
      <FloatingIcon position={[0, 3, 4]} rotationSpeed={0.4} />
      
      {/* Tech Hub objects representation with hover effects */}
      <group>
        {/* Vision Pro station - Animated */}
        <AnimatedDevice 
          position={[2, 0.5, 0]}
          hotspotId="vision-pro"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#1d1d1f"
          hoverColor="#0071e3"
        />
        
        {/* Drone area */}
        <AnimatedDevice 
          position={[-2, 0.3, 1]}
          hotspotId="drones"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#2563eb"
          hoverColor="#0071e3"
          size={[1.5, 0.6, 1.5]}
        />
        
        {/* 3D Printer */}
        <AnimatedDevice 
          position={[0, 0.4, -2]}
          hotspotId="3d-printer"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#10b981"
          hoverColor="#0071e3"
          size={[1.2, 0.8, 1.2]}
        />
        
        {/* IoT Station */}
        <AnimatedDevice 
          position={[-2, 0.3, -1]}
          hotspotId="iot-kits"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#f59e0b"
          hoverColor="#0071e3"
          size={[1, 0.6, 1]}
        />
        
        {/* AI Lab */}
        <AnimatedDevice 
          position={[4, 0.4, -1]}
          hotspotId="ai-lab"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#8b5cf6"
          hoverColor="#0071e3"
          size={[1.3, 0.8, 1.3]}
        />
        
        {/* Bio Lab */}
        <AnimatedDevice 
          position={[-3, 0.4, -2]}
          hotspotId="bio-lab"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#10b981"
          hoverColor="#0071e3"
          size={[1.2, 0.8, 1.2]}
        />
        
        {/* Chemistry Lab */}
        <AnimatedDevice 
          position={[1, 0.4, -3]}
          hotspotId="chemistry-lab"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#3b82f6"
          hoverColor="#0071e3"
          size={[1.2, 0.8, 1.2]}
        />
        
        {/* Nursing Lab */}
        <AnimatedDevice 
          position={[-4, 0.4, 0]}
          hotspotId="nursing-lab"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#ef4444"
          hoverColor="#0071e3"
          size={[1.2, 0.8, 1.2]}
        />
        
        {/* VR Lab */}
        <AnimatedDevice 
          position={[3, 0.4, 2]}
          hotspotId="vr-lab"
          hoveredHotspot={hoveredHotspot}
          onHover={setHoveredHotspot}
          color="#6366f1"
          hoverColor="#0071e3"
          size={[1.5, 0.8, 1.5]}
        />
      </group>
      
      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <HotspotMarker 
          key={hotspot.id} 
          hotspot={hotspot} 
          onClick={() => onHotspotClick(hotspot)}
          isHovered={hoveredHotspot === hotspot.id}
        />
      ))}
      
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        dampingFactor={0.05}
        enableDamping={true}
      />
      <Environment preset="city" />
    </>
  )
}

// Animated device component
function AnimatedDevice({ 
  position, 
  hotspotId, 
  hoveredHotspot, 
  onHover, 
  color, 
  hoverColor,
  size = [1, 1, 1] as [number, number, number]
}: { 
  position: [number, number, number]
  hotspotId: string
  hoveredHotspot: string | null
  onHover: (id: string | null) => void
  color: string
  hoverColor: string
  size?: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null)
  const isHovered = hoveredHotspot === hotspotId
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      // Floating animation
      ref.current.position.y = position[1] + Math.sin(time * 1.2) * 0.1
      // Rotation animation
      ref.current.rotation.y = time * 0.2
      
      // Hover pulse
      if (isHovered) {
        const pulse = Math.sin(time * 5) * 0.05 + 1
        ref.current.scale.setScalar(pulse)
      } else {
        ref.current.scale.setScalar(1)
      }
    }
  })
  
  return (
    <mesh 
      ref={ref}
      position={position}
      onPointerOver={() => onHover(hotspotId)}
      onPointerOut={() => onHover(null)}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={isHovered ? hoverColor : color}
        emissive={isHovered ? hoverColor : '#000000'}
        emissiveIntensity={isHovered ? 0.8 : 0}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default function VirtualTour() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)

  return (
    <div className="min-h-screen pt-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-accent hover:text-accent-700 mb-8 font-light"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            Interactive Virtual Tour
          </h1>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Click on the glowing hotspots to explore our cutting-edge technology
          </p>
        </div>

        <div className="relative h-[600px] md:h-[700px] rounded-2xl overflow-hidden shadow-2xl bg-black">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-white text-xl">Loading 3D environment...</div>
            </div>
          }>
            <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
              <Scene onHotspotClick={setSelectedHotspot} />
            </Canvas>
          </Suspense>
        </div>

        {/* Interactive Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-accent/20 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <SparklesIcon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-title-sm font-semibold text-black tracking-tight">How to Navigate:</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
            >
              <p className="text-body-sm text-gray-700 font-medium mb-1">🖱️ Mouse Controls</p>
              <p className="text-body-sm text-gray-600 font-light">Click and drag to rotate • Scroll to zoom</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
            >
              <p className="text-body-sm text-gray-700 font-medium mb-1">✨ Interactive Elements</p>
              <p className="text-body-sm text-gray-600 font-light">Hover devices • Click glowing hotspots</p>
            </motion.div>
          </div>
          <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
            <p className="text-xs text-gray-600 font-light flex items-center">
              <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
              <strong className="text-accent mr-1">Tip:</strong> Look for the pulsing blue hotspots with orbiting particles!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Hotspot Detail Modal */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedHotspot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-headline-sm font-semibold text-black mb-2 tracking-tight">
                    {selectedHotspot.title}
                  </h2>
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium">
                    {selectedHotspot.type === 'device' ? 'Device' : 'Area'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              
              <p className="text-body text-gray-600 mb-8 font-light leading-relaxed">
                {selectedHotspot.description}
              </p>
              
              {selectedHotspot.videoUrl && (
                <div className="mb-6">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-700 transition-colors font-medium">
                    <Play className="h-5 w-5" />
                    <span>Watch Demo Video</span>
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <Link
                  href="/learning"
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
                >
                  Learn More
                </Link>
                <Link
                  href="/events"
                  className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-700 transition-colors font-medium"
                >
                  Book Experience
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

