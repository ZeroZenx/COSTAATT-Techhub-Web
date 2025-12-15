'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Network, 
  Layers, 
  ArrowRight, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle,
  Info,
  Zap,
  Code,
  Database,
  Cpu,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import toast from 'react-hot-toast'

// 3D Neural Network Visualization
function NeuralNetwork3D({ activeLayer, tokens }: { activeLayer: number, tokens: string[] }) {
  const layers = 4
  const nodesPerLayer = [8, 12, 8, 4]
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0071e3" />
      
      {Array.from({ length: layers }).map((_, layerIdx) => {
        const nodeCount = nodesPerLayer[layerIdx]
        const spacing = 2
        const startX = (layerIdx - (layers - 1) / 2) * 4
        
        return (
          <group key={layerIdx}>
            {/* Nodes */}
            {Array.from({ length: nodeCount }).map((_, nodeIdx) => {
              const y = (nodeIdx - (nodeCount - 1) / 2) * spacing
              const isActive = layerIdx === activeLayer
              const intensity = isActive ? 1 : 0.3
              
              return (
                <group key={nodeIdx} position={[startX, y, 0]}>
                  <mesh>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial
                      color={isActive ? '#0071e3' : '#4a5568'}
                      emissive={isActive ? '#0071e3' : '#000000'}
                      emissiveIntensity={intensity}
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </mesh>
                  
                  {/* Connections to next layer */}
                  {layerIdx < layers - 1 && (
                    Array.from({ length: nodesPerLayer[layerIdx + 1] }).map((_, nextNodeIdx) => {
                      const nextY = (nextNodeIdx - (nodesPerLayer[layerIdx + 1] - 1) / 2) * spacing
                      const nextX = ((layerIdx + 1) - (layers - 1) / 2) * 4
                      const isConnectionActive = isActive && Math.random() > 0.7
                      
                      return (
                        <line key={nextNodeIdx}>
                          <bufferGeometry>
                            <bufferAttribute
                              attach="attributes-position"
                              count={2}
                              array={new Float32Array([
                                startX, y, 0,
                                nextX, nextY, 0
                              ])}
                              itemSize={3}
                            />
                          </bufferGeometry>
                          <lineBasicMaterial
                            color={isConnectionActive ? '#0071e3' : '#2d3748'}
                            opacity={isConnectionActive ? 0.6 : 0.1}
                            transparent
                          />
                        </line>
                      )
                    })
                  )}
                </group>
              )
            })}
          </group>
        )
      })}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  )
}

// Token Embedding Visualization
function TokenEmbedding({ tokens, activeToken }: { tokens: string[], activeToken: number }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {tokens.map((token, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: idx === activeToken ? 1.1 : 1,
            opacity: idx === activeToken ? 1 : 0.5
          }}
          className={`p-3 rounded-lg border-2 transition-all ${
            idx === activeToken 
              ? 'border-accent bg-accent/10' 
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <div className="text-xs font-semibold text-center text-gray-900">{token}</div>
          <div className="mt-2 flex flex-wrap gap-1 justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-accent/30"
                style={{
                  opacity: idx === activeToken ? 0.8 : 0.3,
                  transform: `scale(${idx === activeToken ? 1.2 : 1})`
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Attention Mechanism Visualization
function AttentionVisualization({ query, keys, values, attentionWeights }: {
  query: string,
  keys: string[],
  values: string[],
  attentionWeights: number[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="px-4 py-2 bg-blue-100 rounded-lg">
          <span className="text-sm font-semibold text-blue-900">Query: {query}</span>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400" />
        <div className="text-sm text-gray-600">Attention Scores</div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {keys.map((key, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <div className="p-3 bg-white border-2 border-gray-200 rounded-lg">
              <div className="text-xs font-medium text-gray-700 mb-1">Key: {key}</div>
              <div className="text-xs text-gray-500 mb-2">Value: {values[idx]}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-accent h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${attentionWeights[idx] * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1 text-right">
                {(attentionWeights[idx] * 100).toFixed(1)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Training Process Visualization
function TrainingVisualization({ epoch, loss, accuracy }: {
  epoch: number,
  loss: number,
  accuracy: number
}) {
  const lossHistory = useRef<number[]>([])
  const accuracyHistory = useRef<number[]>([])
  
  useEffect(() => {
    lossHistory.current.push(loss)
    accuracyHistory.current.push(accuracy)
    if (lossHistory.current.length > 20) {
      lossHistory.current.shift()
      accuracyHistory.current.shift()
    }
  }, [loss, accuracy])
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Epoch</div>
          <div className="text-2xl font-bold text-gray-900">{epoch}</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Loss</div>
          <div className="text-2xl font-bold text-red-600">{loss.toFixed(3)}</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Accuracy</div>
          <div className="text-2xl font-bold text-green-600">{(accuracy * 100).toFixed(1)}%</div>
        </div>
      </div>
      
      {/* Loss Chart */}
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="text-sm font-semibold text-gray-900 mb-3">Loss Over Time</div>
        <div className="h-32 relative">
          <svg className="w-full h-full">
            <polyline
              points={lossHistory.current.map((l, i) => 
                `${(i / (lossHistory.current.length - 1 || 1)) * 100},${100 - (l * 100)}`
              ).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      
      {/* Accuracy Chart */}
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="text-sm font-semibold text-gray-900 mb-3">Accuracy Over Time</div>
        <div className="h-32 relative">
          <svg className="w-full h-full">
            <polyline
              points={accuracyHistory.current.map((a, i) => 
                `${(i / (accuracyHistory.current.length - 1 || 1)) * 100},${100 - (a * 100)}`
              ).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

const concepts = [
  {
    id: 'intro',
    title: 'What is an LLM?',
    description: 'Large Language Models are AI systems trained on vast amounts of text data',
    icon: Brain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'tokenization',
    title: 'Tokenization',
    description: 'Breaking text into smaller pieces (tokens) that the model can process',
    icon: Code,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'embeddings',
    title: 'Word Embeddings',
    description: 'Converting tokens into numerical vectors that capture meaning',
    icon: Database,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'attention',
    title: 'Attention Mechanism',
    description: 'How the model focuses on relevant parts of the input when generating output',
    icon: Network,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'transformer',
    title: 'Transformer Architecture',
    description: 'The neural network architecture that powers modern LLMs',
    icon: Layers,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'training',
    title: 'Training Process',
    description: 'How LLMs learn from data through forward and backward propagation',
    icon: TrendingUp,
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function AILLM() {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [activeLayer, setActiveLayer] = useState(0)
  const [activeToken, setActiveToken] = useState(0)
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState(1.0)
  const [accuracy, setAccuracy] = useState(0.1)
  
  const tokens = ['The', 'cat', 'sat', 'on']
  const query = 'cat'
  const keys = ['The', 'cat', 'sat']
  const values = ['article', 'noun', 'verb']
  const attentionWeights = [0.1, 0.7, 0.2]
  
  // Animation loop for neural network
  useEffect(() => {
    if (!isPlaying || selectedConcept !== 'transformer') return
    
    const interval = setInterval(() => {
      setActiveLayer(prev => (prev + 1) % 4)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isPlaying, selectedConcept])
  
  // Animation loop for tokenization
  useEffect(() => {
    if (!isPlaying || selectedConcept !== 'tokenization') return
    
    const interval = setInterval(() => {
      setActiveToken(prev => (prev + 1) % tokens.length)
    }, 800)
    
    return () => clearInterval(interval)
  }, [isPlaying, selectedConcept, tokens.length])
  
  // Training simulation
  useEffect(() => {
    if (!isPlaying || selectedConcept !== 'training') return
    
    const interval = setInterval(() => {
      setEpoch(prev => prev + 1)
      setLoss(prev => Math.max(0.1, prev - Math.random() * 0.05))
      setAccuracy(prev => Math.min(0.95, prev + Math.random() * 0.02))
    }, 500)
    
    return () => clearInterval(interval)
  }, [isPlaying, selectedConcept])
  
  const handleConceptSelect = (conceptId: string) => {
    setSelectedConcept(conceptId)
    setIsPlaying(true)
    setCurrentStep(0)
    setActiveLayer(0)
    setActiveToken(0)
    setEpoch(0)
    setLoss(1.0)
    setAccuracy(0.1)
  }
  
  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setActiveLayer(0)
    setActiveToken(0)
    setEpoch(0)
    setLoss(1.0)
    setAccuracy(0.1)
  }
  
  if (selectedConcept) {
    const concept = concepts.find(c => c.id === selectedConcept)
    
    if (!concept) {
      return null
    }
    
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedConcept(null)}
              className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Concepts
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center"
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${concept.color} mb-4`}>
              <concept.icon className="h-5 w-5 mr-2 text-white" />
              <h2 className="text-title-sm font-semibold text-white">{concept.title}</h2>
            </div>
            <p className="text-body-md text-gray-600 mb-6">{concept.description}</p>
            
            {/* Concept-specific visualizations */}
            {selectedConcept === 'tokenization' && (
              <div className="mt-6">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">Tokenization Process</h3>
                <TokenEmbedding tokens={tokens} activeToken={activeToken} />
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Step {activeToken + 1}:</strong> Processing token "{tokens[activeToken]}" 
                    and converting it to a numerical embedding vector.
                  </p>
                </div>
              </div>
            )}
            
            {selectedConcept === 'embeddings' && (
              <div className="mt-6">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">Embedding Space</h3>
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                    style={{
                      backgroundImage: 'radial-gradient(circle, #0071e3 2px, transparent 2px)',
                      backgroundSize: '40px 40px'
                    }}
                  />
                  <div className="relative z-10 text-center">
                    <Database className="h-16 w-16 mx-auto text-accent mb-2" />
                    <p className="text-sm font-semibold text-gray-900">High-Dimensional Vector Space</p>
                    <p className="text-xs text-gray-600 mt-1">Each word is mapped to a point in this space</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Key Insight:</strong> Words with similar meanings are close together in this space.
                    The model learns these relationships during training.
                  </p>
                </div>
              </div>
            )}
            
            {selectedConcept === 'attention' && (
              <div className="mt-6">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">Attention Mechanism</h3>
                <AttentionVisualization 
                  query={query}
                  keys={keys}
                  values={values}
                  attentionWeights={attentionWeights}
                />
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>How it works:</strong> The model calculates attention scores to determine 
                    which parts of the input are most relevant when generating each output token.
                    Higher scores (darker bars) mean more attention.
                  </p>
                </div>
              </div>
            )}
            
            {selectedConcept === 'transformer' && (
              <div className="mt-6">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">Neural Network Architecture</h3>
                <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <NeuralNetwork3D activeLayer={activeLayer} tokens={tokens} />
                  </Canvas>
                </div>
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Layer {activeLayer + 1} Active:</strong> Data flows through multiple layers,
                    with each layer learning increasingly complex patterns. The highlighted layer shows
                    where computation is currently happening.
                  </p>
                </div>
              </div>
            )}
            
            {selectedConcept === 'training' && (
              <div className="mt-6">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">Training Progress</h3>
                <TrainingVisualization epoch={epoch} loss={loss} accuracy={accuracy} />
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Training Process:</strong> The model learns by adjusting weights to minimize loss
                    and maximize accuracy. Over many epochs, the model becomes better at predicting the next token.
                  </p>
                </div>
              </div>
            )}
            
            {selectedConcept === 'intro' && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <Cpu className="h-8 w-8 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Billions of Parameters</h4>
                    <p className="text-sm text-gray-600">Modern LLMs have 100B+ parameters</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                    <Database className="h-8 w-8 text-blue-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Massive Datasets</h4>
                    <p className="text-sm text-gray-600">Trained on terabytes of text</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                    <Zap className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Generative AI</h4>
                    <p className="text-sm text-gray-600">Creates new text, not just classification</p>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                  <h4 className="font-semibold mb-2">How LLMs Work</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Input text is tokenized into smaller pieces</li>
                    <li>Tokens are converted to numerical embeddings</li>
                    <li>Neural network processes embeddings through multiple layers</li>
                    <li>Attention mechanism focuses on relevant context</li>
                    <li>Output probabilities for next token are calculated</li>
                    <li>Most likely token is selected and added to response</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
            <Brain className="h-6 w-6 mr-2 text-white" />
            <h1 className="text-headline-sm md:text-headline font-semibold text-white">
              Understanding Large Language Models
            </h1>
          </div>
          <p className="text-title-sm text-gray-600 max-w-2xl mx-auto font-light mt-4">
            Explore how AI language models work through interactive visualizations and hands-on demonstrations
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleConceptSelect(concept.id)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200"
            >
              <div className={`h-32 bg-gradient-to-br ${concept.color} flex items-center justify-center`}>
                <concept.icon className="h-12 w-12 text-white/90 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-2">
                  {concept.title}
                </h3>
                <p className="text-body-sm text-gray-600 mb-4 font-light">
                  {concept.description}
                </p>
                
                <div className="flex items-center text-accent text-body-sm font-light group-hover:opacity-70 transition-opacity">
                  <Play className="h-4 w-4 mr-2" />
                  <span>Explore</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
        >
          <h2 className="text-title-sm font-semibold text-gray-900 mb-6 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-accent" />
            Key Concepts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Tokenization</h4>
              <p className="text-sm text-gray-600">
                Text is broken into tokens (words or subwords) that the model can process numerically.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Embeddings</h4>
              <p className="text-sm text-gray-600">
                Tokens are converted to high-dimensional vectors that capture semantic meaning.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Attention</h4>
              <p className="text-sm text-gray-600">
                The model learns which parts of the input to focus on when generating each output token.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Training</h4>
              <p className="text-sm text-gray-600">
                Models learn by predicting the next token in billions of text examples and adjusting weights.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

