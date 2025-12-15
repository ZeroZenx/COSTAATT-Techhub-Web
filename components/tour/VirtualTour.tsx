'use client'

import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html, Text } from '@react-three/drei'
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

function HotspotMarker({ hotspot, onClick }: { hotspot: Hotspot; onClick: () => void }) {
  return (
    <group position={hotspot.position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>
      <Html distanceFactor={2} position={[0, 0.3, 0]}>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg text-sm font-semibold text-gray-800 whitespace-nowrap">
          {hotspot.title}
        </div>
      </Html>
    </group>
  )
}

function Scene({ onHotspotClick }: { onHotspotClick: (hotspot: Hotspot) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Room walls */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Tech Hub objects representation */}
      <group>
        {/* Vision Pro station */}
        <mesh position={[2, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1d1d1f" />
        </mesh>
        
        {/* Drone area */}
        <mesh position={[-2, 0.3, 1]}>
          <boxGeometry args={[1.5, 0.6, 1.5]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        
        {/* 3D Printer */}
        <mesh position={[0, 0.4, -2]}>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        
        {/* IoT Station */}
        <mesh position={[-2, 0.3, -1]}>
          <boxGeometry args={[1, 0.6, 1]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>
      
      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <HotspotMarker key={hotspot.id} hotspot={hotspot} onClick={() => onHotspotClick(hotspot)} />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Environment preset="city" />
    </>
  )
}

export default function VirtualTour() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interactive Virtual Tour
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
        <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-2">How to Navigate:</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Click and drag to rotate the view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Click on blue glowing hotspots to learn more</li>
            <li>• Use arrow keys for fine control</li>
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedHotspot.title}
                  </h2>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
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
              
              <p className="text-gray-700 text-lg mb-6">
                {selectedHotspot.description}
              </p>
              
              {selectedHotspot.videoUrl && (
                <div className="mb-6">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Play className="h-5 w-5" />
                    <span>Watch Demo Video</span>
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Learn More
                </button>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
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

