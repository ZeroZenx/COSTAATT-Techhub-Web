'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Microscope, 
  FlaskConical, 
  Dna, 
  Beaker, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Info,
  Play,
  RotateCcw,
  Award,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  Ear,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Experiment {
  id: string
  name: string
  description: string
  steps: string[]
  materials: string[]
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

const experiments: Experiment[] = [
  {
    id: 'cell-observation',
    name: 'Cell Structure Observation',
    description: 'Observe plant and animal cells under a virtual microscope',
    steps: [
      'Prepare slide with sample',
      'Place slide on microscope stage',
      'Adjust magnification to 400x',
      'Focus using fine adjustment knob',
      'Identify cell structures (nucleus, cytoplasm, cell wall)',
      'Record observations'
    ],
    materials: ['Microscope', 'Slide', 'Sample (onion/cheek cells)', 'Stain', 'Cover slip'],
    duration: '15 min',
    difficulty: 'Beginner'
  },
  {
    id: 'dna-extraction',
    name: 'DNA Extraction',
    description: 'Extract DNA from strawberries using household materials',
    steps: [
      'Mash strawberries in a bag',
      'Add extraction buffer (salt + soap)',
      'Filter mixture through cheesecloth',
      'Add cold alcohol slowly',
      'Observe DNA precipitate',
      'Collect DNA strands'
    ],
    materials: ['Strawberries', 'Salt', 'Dish soap', 'Cold alcohol', 'Filter', 'Test tube'],
    duration: '20 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'enzyme-activity',
    name: 'Enzyme Activity Test',
    description: 'Test how temperature affects enzyme activity',
    steps: [
      'Prepare enzyme solution (catalase)',
      'Set up three test tubes at different temperatures',
      'Add hydrogen peroxide to each tube',
      'Measure reaction rate (bubbles produced)',
      'Record data at 0°C, 25°C, and 60°C',
      'Analyze results'
    ],
    materials: ['Catalase enzyme', 'Hydrogen peroxide', 'Test tubes', 'Thermometer', 'Water bath'],
    duration: '25 min',
    difficulty: 'Advanced'
  }
]

// Virtual Microscope Component
function VirtualMicroscope({ completedSteps, onStepComplete }: { completedSteps: number[], onStepComplete: (step: number) => void }) {
  const [magnification, setMagnification] = useState(40)
  const [focus, setFocus] = useState(50)
  const [stageX, setStageX] = useState(0)
  const [stageY, setStageY] = useState(0)
  const [lightIntensity, setLightIntensity] = useState(70)
  const [sampleType, setSampleType] = useState<'onion' | 'cheek' | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const magnifications = [40, 100, 400, 1000]
  const currentMagIndex = magnifications.indexOf(magnification)

  useEffect(() => {
    if (completedSteps.length >= 2 && !sampleType) {
      setSampleType('onion')
    }
  }, [completedSteps, sampleType])

  useEffect(() => {
    if (focus > 45 && focus < 55 && magnification >= 400 && sampleType) {
      setIsFocused(true)
      if (completedSteps.length === 2) {
        onStepComplete(2)
      }
    } else {
      setIsFocused(false)
    }
  }, [focus, magnification, sampleType, completedSteps.length, onStepComplete])

  useEffect(() => {
    if (!canvasRef.current || !sampleType) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (magnification >= 400 && isFocused) {
      const cellSize = magnification === 400 ? 200 : 300
      const cellX = canvas.width / 2 + stageX * 2
      const cellY = canvas.height / 2 + stageY * 2

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const offsetX = cellX + i * cellSize * 1.2
          const offsetY = cellY + j * cellSize * 1.2

          if (sampleType === 'onion') {
            ctx.strokeStyle = '#8B7355'
            ctx.lineWidth = 3
            ctx.strokeRect(offsetX - cellSize/2, offsetY - cellSize/2, cellSize, cellSize)
          }

          ctx.fillStyle = sampleType === 'onion' ? '#E8F5E9' : '#FFF9C4'
          ctx.fillRect(offsetX - cellSize/2 + 5, offsetY - cellSize/2 + 5, cellSize - 10, cellSize - 10)

          if (magnification >= 400) {
            const nucleusSize = cellSize * 0.3
            ctx.fillStyle = '#4A90E2'
            ctx.beginPath()
            ctx.arc(offsetX, offsetY, nucleusSize / 2, 0, Math.PI * 2)
            ctx.fill()

            if (magnification >= 1000) {
              ctx.fillStyle = '#2E5C8A'
              ctx.beginPath()
              ctx.arc(offsetX, offsetY, nucleusSize / 4, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          if (magnification >= 1000) {
            for (let m = 0; m < 3; m++) {
              const mx = offsetX + (Math.random() - 0.5) * cellSize * 0.6
              const my = offsetY + (Math.random() - 0.5) * cellSize * 0.6
              ctx.fillStyle = '#FF6B6B'
              ctx.beginPath()
              ctx.ellipse(mx, my, 8, 12, Math.PI / 4, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      if (magnification >= 400) {
        ctx.fillStyle = '#000'
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText('Nucleus', cellX + cellSize/2 + 10, cellY - cellSize/2)
        ctx.fillText('Cytoplasm', cellX, cellY + cellSize/2 + 20)
        if (sampleType === 'onion') {
          ctx.fillText('Cell Wall', cellX - cellSize/2 - 60, cellY)
        }
      }
    } else {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#666'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Adjust focus and magnification to view cells', canvas.width / 2, canvas.height / 2)
    }
  }, [magnification, focus, stageX, stageY, sampleType, isFocused])

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
      <h3 className="text-title-sm font-semibold text-black mb-4 flex items-center">
        <Microscope className="h-5 w-5 mr-2 text-green-600" />
        Virtual Microscope
      </h3>

      <div className="bg-gray-900 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 border-2 border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-12 bg-black rounded-t-lg border-2 border-gray-600 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full border border-gray-600"></div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="text-white text-xs mb-2">Objective: {magnification}x</div>
          </div>

          <div className="relative bg-gray-700 rounded-lg p-4 mb-4" style={{ minHeight: '400px' }}>
            <div className="absolute top-2 left-2 flex space-x-2">
              <button
                onClick={() => setStageX(Math.max(-50, stageX - 10))}
                className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs"
                title="Move Left"
              >
                ←
              </button>
              <button
                onClick={() => setStageX(Math.min(50, stageX + 10))}
                className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs"
                title="Move Right"
              >
                →
              </button>
              <button
                onClick={() => setStageY(Math.max(-50, stageY - 10))}
                className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs"
                title="Move Up"
              >
                ↑
              </button>
              <button
                onClick={() => setStageY(Math.min(50, stageY + 10))}
                className="p-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs"
                title="Move Down"
              >
                ↓
              </button>
            </div>

            <div className="flex items-center justify-center h-full">
              <canvas
                ref={canvasRef}
                className="bg-white rounded border-2 border-gray-600"
                style={{ 
                  width: '100%', 
                  maxWidth: '800px',
                  height: 'auto',
                  opacity: lightIntensity / 100,
                  filter: `brightness(${lightIntensity / 100}) contrast(${isFocused ? 1.2 : 0.8})`
                }}
              />
            </div>

            {magnification >= 400 && (
              <div className="absolute bottom-2 right-2">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isFocused ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {isFocused ? '✓ In Focus' : 'Out of Focus'}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-4">
            <span className="text-white text-xs">Light:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={lightIntensity}
              onChange={(e) => setLightIntensity(parseInt(e.target.value))}
              className="flex-1 max-w-xs"
            />
            <span className="text-white text-xs w-12">{lightIntensity}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-body-sm font-semibold text-black mb-3 flex items-center">
            <ZoomIn className="h-4 w-4 mr-2 text-green-600" />
            Magnification
          </h4>
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={() => {
                if (currentMagIndex > 0) {
                  setMagnification(magnifications[currentMagIndex - 1])
                  if (currentMagIndex === 1 && completedSteps.length === 1) {
                    onStepComplete(1)
                  }
                }
              }}
              disabled={currentMagIndex === 0}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="flex-1 flex items-center justify-center space-x-2">
              {magnifications.map((mag, idx) => (
                <button
                  key={mag}
                  onClick={() => {
                    setMagnification(mag)
                    if (idx === 2 && completedSteps.length === 1) {
                      onStepComplete(1)
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    magnification === mag
                      ? 'bg-accent text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {mag}x
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (currentMagIndex < magnifications.length - 1) {
                  setMagnification(magnifications[currentMagIndex + 1])
                  if (currentMagIndex === 1 && completedSteps.length === 1) {
                    onStepComplete(1)
                  }
                }
              }}
              disabled={currentMagIndex === magnifications.length - 1}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 font-light mt-2">
            Current: <span className="font-semibold">{magnification}x</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-body-sm font-semibold text-black mb-3 flex items-center">
            <RotateCw className="h-4 w-4 mr-2 text-blue-600" />
            Fine Focus Adjustment
          </h4>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFocus(Math.max(0, focus - 5))}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCw className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={focus}
                onChange={(e) => setFocus(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Coarse</span>
                <span className="font-semibold">{focus}</span>
                <span>Fine</span>
              </div>
            </div>
            <button
              onClick={() => setFocus(Math.min(100, focus + 5))}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
          {isFocused && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-green-600 font-medium mt-2 flex items-center"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Optimal focus achieved!
            </motion.p>
          )}
        </div>
      </div>

      {completedSteps.length >= 1 && !sampleType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <h4 className="text-body-sm font-semibold text-black mb-3">Select Sample</h4>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSampleType('onion')
                onStepComplete(0)
              }}
              className="p-4 bg-white rounded-lg border-2 border-blue-300 hover:border-blue-500 transition-colors text-left"
            >
              <div className="font-semibold text-black mb-1">Onion Cells</div>
              <div className="text-xs text-gray-600 font-light">Plant cells with cell walls</div>
            </button>
            <button
              onClick={() => {
                setSampleType('cheek')
                onStepComplete(0)
              }}
              className="p-4 bg-white rounded-lg border-2 border-blue-300 hover:border-blue-500 transition-colors text-left"
            >
              <div className="font-semibold text-black mb-1">Cheek Cells</div>
              <div className="text-xs text-gray-600 font-light">Animal cells without walls</div>
            </button>
          </div>
        </motion.div>
      )}

      {isFocused && magnification >= 400 && sampleType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-green-50 rounded-xl p-4 border border-green-200"
        >
          <h4 className="text-body-sm font-semibold text-black mb-2">Visible Structures:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Nucleus</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-xs text-gray-700">Cytoplasm</span>
            </div>
            {sampleType === 'onion' && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-amber-700"></div>
                <span className="text-xs text-gray-700">Cell Wall</span>
              </div>
            )}
            {magnification >= 1000 && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Mitochondria</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function BioLab() {
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const experiment = experiments.find(e => e.id === selectedExperiment)

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
      setScore(score + 10)
      toast.success(`Step ${stepIndex + 1} completed!`)
      
      if (stepIndex === experiment!.steps.length - 1) {
        setTimeout(() => {
          setShowResults(true)
          toast.success('Experiment completed!', { icon: '🎉' })
        }, 500)
      }
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setScore(0)
    setShowResults(false)
  }

  if (selectedExperiment && experiment) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedExperiment(null)}
              className="text-accent hover:text-accent-700 font-medium flex items-center"
            >
              ← Back to Bio Lab
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Score: <span className="font-bold text-accent">{score}</span>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Reset Experiment"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Experiment Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 sticky top-24">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Microscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">{experiment.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      experiment.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      experiment.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {experiment.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-body-sm text-gray-600 mb-4 font-light">{experiment.description}</p>
                
                <div className="mb-4">
                  <h3 className="text-body-sm font-semibold text-black mb-2">Materials Needed:</h3>
                  <ul className="space-y-1">
                    {experiment.materials.map((material, i) => (
                      <li key={i} className="text-body-sm text-gray-600 font-light flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-light">Duration:</span>
                    <span className="font-semibold text-black">{experiment.duration}</span>
                  </div>
                </div>
              </div>

              {/* 3D Eukaryotic Cell Model */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Dna className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">3D Cell Structure</h2>
                    <p className="text-xs text-gray-600 font-light">
                      Interactive eukaryotic cell visualization
                    </p>
                  </div>
                </div>
                
                <div className="sketchfab-embed-wrapper rounded-xl overflow-hidden" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                  <iframe
                    title="Eukaryotic cell cross-section"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/74f714127a8c4211bb1a2cac7195fb1a/embed"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    {...({
                      'mozallowfullscreen': 'true',
                      'webkitallowfullscreen': 'true',
                      'xr-spatial-tracking': 'true',
                      'execution-while-out-of-viewport': 'true',
                      'execution-while-not-rendered': 'true',
                      'web-share': 'true'
                    } as any)}
                  />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'normal', margin: '5px', color: '#4A4A4A', marginTop: '8px' }}>
                  <a
                    href="https://sketchfab.com/3d-models/eukaryotic-cell-cross-section-74f714127a8c4211bb1a2cac7195fb1a?utm_medium=embed&utm_campaign=share-popup&utm_content=74f714127a8c4211bb1a2cac7195fb1a"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Eukaryotic cell cross-section
                  </a>
                  {' by '}
                  <a
                    href="https://sketchfab.com/Ebers?utm_medium=embed&utm_campaign=share-popup&utm_content=74f714127a8c4211bb1a2cac7195fb1a"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Ebers
                  </a>
                  {' on '}
                  <a
                    href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=74f714127a8c4211bb1a2cac7195fb1a"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Sketchfab
                  </a>
                </p>
              </div>

              {/* 3D Auditory System (Ear) Model */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Ear className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">3D Auditory System</h2>
                    <p className="text-xs text-gray-600 font-light">
                      Interactive ear anatomy visualization
                    </p>
                  </div>
                </div>
                
                <div className="sketchfab-embed-wrapper rounded-xl overflow-hidden" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                  <iframe
                    title="Auditory system (Ear - Biology)"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/c5a0e016fe23493e912a34487251396c/embed"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    {...({
                      'mozallowfullscreen': 'true',
                      'webkitallowfullscreen': 'true',
                      'xr-spatial-tracking': 'true',
                      'execution-while-out-of-viewport': 'true',
                      'execution-while-not-rendered': 'true',
                      'web-share': 'true'
                    } as any)}
                  />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'normal', margin: '5px', color: '#4A4A4A', marginTop: '8px' }}>
                  <a
                    href="https://sketchfab.com/3d-models/auditory-system-ear-biology-c5a0e016fe23493e912a34487251396c?utm_medium=embed&utm_campaign=share-popup&utm_content=c5a0e016fe23493e912a34487251396c"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Auditory system (Ear - Biology)
                  </a>
                  {' by '}
                  <a
                    href="https://sketchfab.com/kifir?utm_medium=embed&utm_campaign=share-popup&utm_content=c5a0e016fe23493e912a34487251396c"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    KIFIR
                  </a>
                  {' on '}
                  <a
                    href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=c5a0e016fe23493e912a34487251396c"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Sketchfab
                  </a>
                </p>
              </div>

              {/* 3D Eye Model */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">3D Eye Anatomy</h2>
                    <p className="text-xs text-gray-600 font-light">
                      Interactive eye structure visualization
                    </p>
                  </div>
                </div>
                
                <div className="sketchfab-embed-wrapper rounded-xl overflow-hidden" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                  <iframe
                    title="Just an eye!"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/ac6d700dba9247f79f8bedc4410a9e11/embed"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    {...({
                      'mozallowfullscreen': 'true',
                      'webkitallowfullscreen': 'true',
                      'xr-spatial-tracking': 'true',
                      'execution-while-out-of-viewport': 'true',
                      'execution-while-not-rendered': 'true',
                      'web-share': 'true'
                    } as any)}
                  />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'normal', margin: '5px', color: '#4A4A4A', marginTop: '8px' }}>
                  <a
                    href="https://sketchfab.com/3d-models/just-an-eye-ac6d700dba9247f79f8bedc4410a9e11?utm_medium=embed&utm_campaign=share-popup&utm_content=ac6d700dba9247f79f8bedc4410a9e11"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Just an eye!
                  </a>
                  {' by '}
                  <a
                    href="https://sketchfab.com/henryrietra?utm_medium=embed&utm_campaign=share-popup&utm_content=ac6d700dba9247f79f8bedc4410a9e11"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Henry Rietra
                  </a>
                  {' on '}
                  <a
                    href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=ac6d700dba9247f79f8bedc4410a9e11"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Sketchfab
                  </a>
                </p>
              </div>
            </div>

            {/* Experiment Steps */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h3 className="text-title-sm font-semibold text-black mb-6">Experiment Steps</h3>
                
                <div className="space-y-4">
                  {experiment.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        completedSteps.includes(index)
                          ? 'border-green-500 bg-green-50'
                          : currentStep === index
                          ? 'border-accent bg-accent/5'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                            completedSteps.includes(index)
                              ? 'bg-green-500 text-white'
                              : currentStep === index
                              ? 'bg-accent text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {completedSteps.includes(index) ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-body-sm font-medium text-black mb-1">{step}</p>
                            {currentStep === index && !completedSteps.includes(index) && (
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => handleStepComplete(index)}
                                className="mt-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
                              >
                                Complete Step
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-body-sm font-medium text-gray-900">Progress</span>
                    <span className="text-body-sm text-gray-600 font-light">
                      {completedSteps.length}/{experiment.steps.length} steps
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-accent h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedSteps.length / experiment.steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Virtual Microscope */}
              {experiment.id === 'cell-observation' && (
                <VirtualMicroscope 
                  completedSteps={completedSteps}
                  onStepComplete={handleStepComplete}
                />
              )}
            </div>
          </div>

          {/* Completion Modal */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowResults(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Award className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-title-sm font-semibold text-black mb-2">Experiment Complete!</h3>
                    <p className="text-body-sm text-gray-600 mb-6 font-light">
                      You scored <span className="font-bold text-accent">{score} points</span>
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowResults(false)}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => {
                          setShowResults(false)
                          handleReset()
                        }}
                        className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            Biology Laboratory
          </h1>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Conduct virtual biology experiments and learn about cell structures, DNA, and enzymes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiments.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedExperiment(exp.id)
                setCurrentStep(0)
                setCompletedSteps([])
                setScore(0)
              }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Microscope className="h-16 w-16 text-white/90 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-title-sm font-semibold text-black">{exp.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    exp.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    exp.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {exp.difficulty}
                  </span>
                </div>
                <p className="text-body-sm text-gray-600 mb-4 font-light">{exp.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="font-light">{exp.duration}</span>
                  <span className="font-light">{exp.materials.length} materials</span>
                </div>

                <div className="flex items-center text-accent text-body-sm font-light group-hover:opacity-70 transition-opacity">
                  <Play className="h-4 w-4 mr-2" />
                  <span>Start Experiment</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

