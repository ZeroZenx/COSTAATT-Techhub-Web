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
  CheckCircle,
  Microscope,
  FlaskConical,
  Stethoscope,
  Network,
  Plane
} from 'lucide-react'
import QuizModule from './QuizModule'
import ARVRDemo from './ARVRDemo'
import IoTSimulation from './IoTSimulation'
import BioLab from './BioLab'
import ChemistryLab from './ChemistryLab'
import NursingLab from './NursingLab'
import AILLM from './AILLM'
import DroneIoT from './DroneIoT'

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
  {
    id: 'bio-lab',
    title: 'Biology Laboratory',
    description: 'Conduct virtual biology experiments and learn about cells, DNA, and enzymes',
    icon: Microscope,
    color: 'from-green-500 to-teal-500',
    component: BioLab,
  },
  {
    id: 'chemistry-lab',
    title: 'Chemistry Laboratory',
    description: 'Explore chemical reactions, balance equations, and understand molecular interactions',
    icon: FlaskConical,
    color: 'from-blue-500 to-indigo-500',
    component: ChemistryLab,
  },
  {
    id: 'nursing-lab',
    title: 'Nursing Lab Simulation',
    description: 'Practice clinical skills, vital signs assessment, and patient care procedures',
    icon: Stethoscope,
    color: 'from-red-500 to-rose-500',
    component: NursingLab,
  },
  {
    id: 'ai-llm',
    title: 'AI & LLM Fundamentals',
    description: 'Understand how Large Language Models work through interactive visualizations',
    icon: Network,
    color: 'from-purple-500 to-pink-500',
    component: AILLM,
  },
  {
    id: 'drone-iot',
    title: 'Drone & IoT Integration',
    description: 'Explore how drones integrate with IoT systems for smart automation',
    icon: Plane,
    color: 'from-blue-500 to-cyan-500',
    component: DroneIoT,
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
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            Learn by Doing
          </h1>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Explore interactive modules, take quizzes, and experiment with cutting-edge technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => setSelectedModule(module.id)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200"
            >
              <div className={`h-48 bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                <module.icon className="h-16 w-16 text-white/90 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <h3 className="text-title-sm font-semibold text-black mb-2 tracking-tight">
                  {module.title}
                </h3>
                <p className="text-body-sm text-gray-600 mb-6 font-light">
                  {module.description}
                </p>
                
                <div className="flex items-center text-accent text-body-sm font-light group-hover:opacity-70 transition-opacity">
                  <Play className="h-4 w-4 mr-2" />
                  <span>Start Learning</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
        >
          <h2 className="text-title-sm font-semibold text-black mb-6 tracking-tight flex items-center">
            <Award className="h-5 w-5 mr-2 text-accent" />
            Your Learning Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm font-medium text-gray-900">{module.title}</span>
                  <span className="text-body-sm text-gray-600 font-light">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-accent h-1.5 rounded-full transition-all" style={{ width: '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

