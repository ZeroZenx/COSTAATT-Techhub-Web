'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  Brain, 
  Code, 
  Zap, 
  Filter,
  Play,
  Award,
  CheckCircle
} from 'lucide-react'
import QuizModule from './QuizModule'
import ARVRDemo from './ARVRDemo'
import IoTSimulation from './IoTSimulation'

const modules = [
  {
    id: 'quiz',
    title: 'Tech Knowledge Quizzes',
    description: 'Test your knowledge with interactive quizzes on various tech topics',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    component: QuizModule,
  },
  {
    id: 'arvr',
    title: 'AR/VR Experiences',
    description: 'Explore immersive AR and VR demonstrations',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    component: ARVRDemo,
  },
  {
    id: 'iot',
    title: 'IoT Simulations',
    description: 'Build and experiment with IoT devices in a virtual environment',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    component: IoTSimulation,
  },
]

export default function LearningPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const ModuleComponent = selectedModule
    ? modules.find((m) => m.id === selectedModule)?.component
    : null

  if (ModuleComponent) {
    return (
      <div className="min-h-screen pt-16">
        <button
          onClick={() => setSelectedModule(null)}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Learning Modules
        </button>
        <ModuleComponent />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 text-primary-600 font-semibold mb-4">
            <GraduationCap className="h-5 w-5" />
            <span>Interactive Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn by Doing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore interactive modules, take quizzes, and experiment with cutting-edge technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedModule(module.id)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
            >
              <div className={`h-48 bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                <module.icon className="h-20 w-20 text-white/90 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {module.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {module.description}
                </p>
                
                <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                  <Play className="h-5 w-5 mr-2" />
                  <span>Start Learning</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-primary-600" />
            Your Learning Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{module.title}</span>
                  <span className="text-sm text-gray-600">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

