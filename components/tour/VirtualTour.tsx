'use client'

import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Info, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
    description: 'Experience immersive AR/VR with cutting-edge spatial computing technology.',
    type: 'device',
  },
  {
    id: 'drones',
    position: [-2, 1, 1],
    title: 'Drone Fleet',
    description: 'Learn aerial photography and drone piloting with our professional drone collection.',
    type: 'device',
  },
  {
    id: '3d-printer',
    position: [0, 0.5, -2],
    title: '3D Printers',
    description: 'Turn your digital designs into reality with our advanced 3D printing lab.',
    type: 'device',
  },
  {
    id: 'iot-kits',
    position: [-2, 0.5, -1],
    title: 'IoT Development Kits',
    description: 'Build smart devices and connected systems with our comprehensive IoT kits.',
    type: 'device',
  },
  {
    id: 'vr-lab',
    position: [3, 1, 2],
    title: 'VR Lab',
    description: 'Dedicated space for virtual reality experiences and development.',
    type: 'area',
  },
]

function HotspotMarker({ 
  hotspot, 
  onClick, 
  isHovered = false 
}: { 
  hotspot: Hotspot
  onClick: () => void
  isHovered?: boolean
}) {
  return (
    <group position={hotspot.position}>
      <mesh onClick={onClick} onPointerOver={() => {}} onPointerOut={() => {}}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={isHovered ? "#0071e3" : "#0ea5e9"} 
          emissive={isHovered ? "#0071e3" : "#0ea5e9"} 
          emissiveIntensity={isHovered ? 0.8 : 0.5}
        />
      </mesh>
      <Html distanceFactor={2} position={[0, 0.4, 0]} center>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg text-sm font-medium text-gray-900 whitespace-nowrap border border-gray-200"
        >
          {hotspot.title}
        </motion.div>
      </Html>
    </group>
  )
}

function Scene({ onHotspotClick }: { onHotspotClick: (hotspot: Hotspot) => void }) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)
  
  // Note: useState in Scene component requires 'use client' directive
  // This is handled by the parent component

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
      
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Room walls */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      
      {/* Tech Hub objects representation with hover effects */}
      <group>
        {/* Vision Pro station */}
        <mesh 
          position={[2, 0.5, 0]}
          onPointerOver={() => setHoveredHotspot('vision-pro')}
          onPointerOut={() => setHoveredHotspot(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={hoveredHotspot === 'vision-pro' ? '#0071e3' : '#1d1d1f'}
            emissive={hoveredHotspot === 'vision-pro' ? '#0071e3' : '#000000'}
            emissiveIntensity={hoveredHotspot === 'vision-pro' ? 0.3 : 0}
          />
        </mesh>
        
        {/* Drone area */}
        <mesh 
          position={[-2, 0.3, 1]}
          onPointerOver={() => setHoveredHotspot('drones')}
          onPointerOut={() => setHoveredHotspot(null)}
        >
          <boxGeometry args={[1.5, 0.6, 1.5]} />
          <meshStandardMaterial 
            color={hoveredHotspot === 'drones' ? '#0071e3' : '#2563eb'}
            emissive={hoveredHotspot === 'drones' ? '#0071e3' : '#000000'}
            emissiveIntensity={hoveredHotspot === 'drones' ? 0.3 : 0}
          />
        </mesh>
        
        {/* 3D Printer */}
        <mesh 
          position={[0, 0.4, -2]}
          onPointerOver={() => setHoveredHotspot('3d-printer')}
          onPointerOut={() => setHoveredHotspot(null)}
        >
          <boxGeometry args={[1.2, 0.8, 1.2]} />
          <meshStandardMaterial 
            color={hoveredHotspot === '3d-printer' ? '#0071e3' : '#10b981'}
            emissive={hoveredHotspot === '3d-printer' ? '#0071e3' : '#000000'}
            emissiveIntensity={hoveredHotspot === '3d-printer' ? 0.3 : 0}
          />
        </mesh>
        
        {/* IoT Station */}
        <mesh 
          position={[-2, 0.3, -1]}
          onPointerOver={() => setHoveredHotspot('iot-kits')}
          onPointerOut={() => setHoveredHotspot(null)}
        >
          <boxGeometry args={[1, 0.6, 1]} />
          <meshStandardMaterial 
            color={hoveredHotspot === 'iot-kits' ? '#0071e3' : '#f59e0b'}
            emissive={hoveredHotspot === 'iot-kits' ? '#0071e3' : '#000000'}
            emissiveIntensity={hoveredHotspot === 'iot-kits' ? 0.3 : 0}
          />
        </mesh>
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
      />
      <Environment preset="city" />
    </>
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

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-title-sm font-semibold text-black mb-4 tracking-tight">How to Navigate:</h3>
          <ul className="space-y-2 text-body-sm text-gray-600 font-light">
            <li>• Click and drag to rotate the view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Hover over devices to see them highlight</li>
            <li>• Click on blue glowing hotspots to learn more</li>
          </ul>
        </div>
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
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium">
                  Learn More
                </button>
                <button className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-700 transition-colors font-medium">
                  Book Experience
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

