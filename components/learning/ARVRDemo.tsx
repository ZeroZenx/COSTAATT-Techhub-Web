'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Info, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const demos = [
  {
    id: 'vision-pro',
    title: 'Apple Vision Pro Experience',
    description: 'Explore spatial computing and immersive AR/VR experiences',
    videoUrl: '/api/placeholder/video',
    duration: '5 min',
  },
  {
    id: 'vr-design',
    title: 'VR Design Studio',
    description: 'Create 3D models and environments in virtual reality',
    videoUrl: '/api/placeholder/video',
    duration: '8 min',
  },
  {
    id: 'ar-overlay',
    title: 'AR Overlay Demo',
    description: 'See how AR overlays digital content onto the real world',
    videoUrl: '/api/placeholder/video',
    duration: '4 min',
  },
]

export default function ARVRDemo() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)

  if (selectedDemo) {
    const demo = demos.find((d) => d.id === selectedDemo)
    return (
      <div className="min-h-screen pt-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/learning"
            className="inline-flex items-center text-white hover:text-gray-300 mb-6 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning
          </Link>
          
          {demo && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">{demo.title}</h1>
              <p className="text-gray-300 text-lg">{demo.description}</p>
            </div>
          )}

          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-white text-lg">Loading AR/VR Experience...</p>
                <p className="text-gray-400 text-sm mt-2">
                  In a real implementation, this would load an interactive 3D/AR experience
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              About This Experience
            </h3>
            <p className="text-gray-300">
              This AR/VR demo showcases the capabilities of immersive technology. In a full implementation,
              you would be able to interact with 3D objects, navigate virtual spaces, and experience
              augmented reality overlays in real-time.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">AR/VR Experiences</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedDemo(demo.id)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {demo.duration}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{demo.title}</h3>
                <p className="text-gray-600">{demo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

