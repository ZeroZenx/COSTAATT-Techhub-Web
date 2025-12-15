'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Upload, Filter, Eye, Heart, Share2 } from 'lucide-react'
import DragDropUpload from '@/components/interactive/DragDropUpload'
import LiveSearch from '@/components/interactive/LiveSearch'

// Mock data - will be replaced with API call
const projects = [
  {
    id: '1',
    title: 'VR Art Gallery',
    student: 'Maria Rodriguez',
    school: 'Providence',
    description: 'An immersive virtual art gallery created using Apple Vision Pro',
    type: 'VR_SKETCH',
    imageUrl: '/api/placeholder/600/400',
    likes: 42,
    views: 156,
    featured: true,
  },
  {
    id: '2',
    title: 'Smart Home IoT System',
    student: 'Carlos Mendez',
    school: 'St Joseph Convent',
    description: 'Automated home system using IoT sensors and AI',
    type: 'AI_DEMO',
    imageUrl: '/api/placeholder/600/400',
    likes: 38,
    views: 128,
    featured: true,
  },
  {
    id: '3',
    title: '3D Printed Prosthetic Hand',
    student: 'Sofia Chen',
    school: 'Fatima College',
    description: 'Functional prosthetic hand designed and 3D printed',
    type: 'DESIGN_3D',
    imageUrl: '/api/placeholder/600/400',
    likes: 55,
    views: 203,
    featured: false,
  },
]

export default function SpotlightPage() {
  const [filter, setFilter] = useState<string>('all')

  const filteredProjects = filter === 'all' 
    ? projects 
    : filter.length > 3 // If it's a search query
    ? projects.filter(p => 
        p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.student.toLowerCase().includes(filter.toLowerCase()) ||
        p.school.toLowerCase().includes(filter.toLowerCase())
      )
    : projects.filter(p => p.type === filter)

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 text-primary-600 font-semibold mb-4">
            <Sparkles className="h-5 w-5" />
            <span>Student Showcase</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student Spotlight
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrate student creativity and innovation. Share your projects and get featured!
          </p>
        </motion.div>

        {/* Interactive Search */}
        <div className="mb-8">
            <LiveSearch
            items={projects}
            onSelect={(project) => {
              // Scroll to project or navigate to detail page
              const element = document.getElementById(`project-${project.id}`)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }}
            onSearch={(query) => {
              // Filter projects based on search
              if (query.trim()) {
                setFilter(query.toLowerCase())
              } else {
                setFilter('all')
              }
            }}
            getItemLabel={(project) => `${project.title} - ${project.student}`}
            getItemKey={(project) => project.id}
            placeholder="Search projects by title, student, or school..."
            renderItem={(project) => (
              <div>
                <p className="font-medium text-gray-900">{project.title}</p>
                <p className="text-sm text-gray-500">{project.student} • {project.school}</p>
              </div>
            )}
          />
        </div>

        {/* Filters and Upload */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            {['all', 'VR_SKETCH', 'AI_DEMO', 'DESIGN_3D', 'CODE_PROJECT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === type
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {type === 'all' ? 'All Projects' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
          
          <Link
            href="/submit"
            className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-700 transition-colors"
          >
            <Upload className="h-5 w-5" />
            <span>Submit Your Project</span>
          </Link>
        </div>

        {/* Featured Projects */}
        {filteredProjects.filter(p => p.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.filter(p => p.featured).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-64 bg-gradient-to-br from-primary-400 to-accent-400">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <Eye className="h-24 w-24" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                      Featured
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                        {project.type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-4 text-gray-600 text-sm">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {project.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {project.likes}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">{project.student}</p>
                        <p className="text-sm text-gray-600">{project.school}</p>
                      </div>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-accent-400">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <Eye className="h-16 w-16" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                      {project.type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center text-gray-600 text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      {project.likes}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="text-xs text-gray-500">
                    <p className="font-semibold">{project.student}</p>
                    <p>{project.school}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

