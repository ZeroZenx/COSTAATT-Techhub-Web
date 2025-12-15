'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-white">
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.h1
            className="text-display-sm md:text-display font-semibold mb-6 text-black tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Welcome to COSTAATT
            <br />
            <span className="text-gray-600">Tech Hub</span>
          </motion.h1>
          
          <motion.p
            className="text-title-sm md:text-title text-gray-600 mb-12 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Empowering the next generation through cutting-edge technology, innovative learning experiences, and collaborative exploration.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link
              href="/tour"
              className="px-8 py-2.5 bg-accent text-white rounded-full text-body font-medium hover:bg-accent-700 transition-all duration-300 hover:scale-105"
            >
              Start Virtual Tour
            </Link>
            <Link
              href="/events"
              className="px-8 py-2.5 text-accent rounded-full text-body font-medium hover:bg-gray-100 transition-all duration-300"
            >
              Book a Visit
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

