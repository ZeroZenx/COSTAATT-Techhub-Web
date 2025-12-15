'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Eye } from 'lucide-react'

// Mock data - will be replaced with API call
const featuredProjects = [
  {
    id: '1',
    title: 'VR Art Gallery',
    student: 'Maria Rodriguez',
    school: 'Providence',
    description: 'An immersive virtual art gallery created using Apple Vision Pro',
    image: '/api/placeholder/400/300',
    type: 'VR_SKETCH',
  },
  {
    id: '2',
    title: 'Smart Home IoT System',
    student: 'Carlos Mendez',
    school: 'St Joseph Convent',
    description: 'Automated home system using IoT sensors and AI',
    image: '/api/placeholder/400/300',
    type: 'AI_DEMO',
  },
  {
    id: '3',
    title: '3D Printed Prosthetic Hand',
    student: 'Sofia Chen',
    school: 'Fatima College',
    description: 'Functional prosthetic hand designed and 3D printed',
    image: '/api/placeholder/400/300',
    type: 'DESIGN_3D',
  },
]

export default function StudentSpotlight() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            Student Innovation Showcase
          </h2>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Highlighting exceptional student projects and technological achievements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="group bg-white rounded-2xl overflow-hidden"
            >
              <div className="relative h-64 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="h-16 w-16 text-white/30" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-title-sm font-semibold text-black mb-2 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-body-sm text-gray-600 mb-4 font-light line-clamp-2">
                  {project.description}
                </p>
                <div className="text-body-sm text-gray-500 font-light">
                  <p>{project.student}</p>
                  <p className="text-gray-400">{project.school}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/spotlight"
            className="inline-flex items-center text-accent text-body font-light hover:opacity-70 transition-opacity"
          >
            View All Projects
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

