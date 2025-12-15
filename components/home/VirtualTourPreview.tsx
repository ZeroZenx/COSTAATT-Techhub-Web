'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Eye, Play } from 'lucide-react'

export default function VirtualTourPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline-sm md:text-headline font-semibold text-black mb-6 tracking-tight">
              Take a 360° Virtual Tour
            </h2>
            <p className="text-title-sm text-gray-600 mb-10 font-light leading-relaxed">
              Explore our Tech Hub from anywhere. Click on hotspots to discover Apple Vision Pro, drones, 3D printers, IoT kits, and more. Each device comes with interactive demos and explainer videos.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                '360° immersive walkthrough',
                'Clickable device hotspots',
                'AR/VR demonstrations',
                'Interactive learning content',
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-600"
                >
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span className="text-body-sm font-light">{item}</span>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/tour"
              className="inline-flex items-center px-8 py-2.5 bg-accent text-white rounded-full text-body font-medium hover:bg-accent-700 transition-all duration-300"
            >
              Start Tour Now
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <Play className="h-10 w-10 text-black ml-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

