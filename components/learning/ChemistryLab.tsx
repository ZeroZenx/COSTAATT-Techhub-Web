'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FlaskConical, 
  Beaker, 
  TestTube, 
  Atom,
  CheckCircle,
  AlertTriangle,
  Info,
  Play,
  RotateCcw,
  Award,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Reaction {
  id: string
  name: string
  description: string
  reactants: { name: string; formula: string; amount: number }[]
  products: { name: string; formula: string }[]
  type: 'Synthesis' | 'Decomposition' | 'Single Replacement' | 'Double Replacement' | 'Combustion'
  safety: string[]
}

const reactions: Reaction[] = [
  {
    id: 'acid-base',
    name: 'Acid-Base Neutralization',
    description: 'React hydrochloric acid with sodium hydroxide to form salt and water',
    reactants: [
      { name: 'Hydrochloric Acid', formula: 'HCl', amount: 1 },
      { name: 'Sodium Hydroxide', formula: 'NaOH', amount: 1 }
    ],
    products: [
      { name: 'Sodium Chloride', formula: 'NaCl' },
      { name: 'Water', formula: 'H₂O' }
    ],
    type: 'Double Replacement',
    safety: ['Wear safety goggles', 'Use fume hood', 'Handle acids carefully']
  },
  {
    id: 'combustion',
    name: 'Combustion Reaction',
    description: 'Burn methane gas in the presence of oxygen',
    reactants: [
      { name: 'Methane', formula: 'CH₄', amount: 1 },
      { name: 'Oxygen', formula: 'O₂', amount: 2 }
    ],
    products: [
      { name: 'Carbon Dioxide', formula: 'CO₂' },
      { name: 'Water', formula: 'H₂O' }
    ],
    type: 'Combustion',
    safety: ['No open flames', 'Ventilation required', 'Fire extinguisher nearby']
  },
  {
    id: 'precipitation',
    name: 'Precipitation Reaction',
    description: 'Mix silver nitrate with sodium chloride to form a precipitate',
    reactants: [
      { name: 'Silver Nitrate', formula: 'AgNO₃', amount: 1 },
      { name: 'Sodium Chloride', formula: 'NaCl', amount: 1 }
    ],
    products: [
      { name: 'Silver Chloride', formula: 'AgCl' },
      { name: 'Sodium Nitrate', formula: 'NaNO₃' }
    ],
    type: 'Double Replacement',
    safety: ['Wear gloves', 'Avoid skin contact', 'Dispose properly']
  }
]

export default function ChemistryLab() {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)
  const [reactantAmounts, setReactantAmounts] = useState<{ [key: string]: number }>({})
  const [reactionStarted, setReactionStarted] = useState(false)
  const [reactionComplete, setReactionComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const reaction = reactions.find(r => r.id === selectedReaction)

  const handleStartReaction = () => {
    if (!reaction) return
    
    // Check if correct amounts
    const correct = reaction.reactants.every(r => 
      reactantAmounts[r.formula] === r.amount
    )
    
    if (correct) {
      setReactionStarted(true)
      setScore(score + 50)
      toast.success('Reaction started!', { icon: '⚗️' })
      
      setTimeout(() => {
        setReactionComplete(true)
        setScore(score + 100)
        toast.success('Reaction complete!', { icon: '✨' })
        setTimeout(() => setShowResults(true), 500)
      }, 2000)
    } else {
      toast.error('Incorrect reactant amounts! Check the balanced equation.')
    }
  }

  const handleReset = () => {
    setReactantAmounts({})
    setReactionStarted(false)
    setReactionComplete(false)
    setScore(0)
    setShowResults(false)
  }

  if (selectedReaction && reaction) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedReaction(null)}
              className="text-accent hover:text-accent-700 font-medium flex items-center"
            >
              ← Back to Chemistry Lab
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Score: <span className="font-bold text-accent">{score}</span>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Reset Reaction"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reaction Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 sticky top-24">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FlaskConical className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">{reaction.name}</h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 mt-1 inline-block">
                      {reaction.type}
                    </span>
                  </div>
                </div>
                <p className="text-body-sm text-gray-600 mb-4 font-light">{reaction.description}</p>
                
                <div className="mb-4">
                  <h3 className="text-body-sm font-semibold text-black mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                    Safety Precautions:
                  </h3>
                  <ul className="space-y-1">
                    {reaction.safety.map((precaution, i) => (
                      <li key={i} className="text-body-sm text-gray-600 font-light flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3D Atomic Structure Model */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Atom className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">3D Atomic Structure</h2>
                    <p className="text-xs text-gray-600 font-light">
                      Interactive molecular visualization
                    </p>
                  </div>
                </div>
                
                <div className="sketchfab-embed-wrapper rounded-xl overflow-hidden" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                  <iframe
                    title="Chemistry_Atomic structure"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/329e3e423749420db86334947999061f/embed"
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
                    href="https://sketchfab.com/3d-models/chemistry-atomic-structure-329e3e423749420db86334947999061f?utm_medium=embed&utm_campaign=share-popup&utm_content=329e3e423749420db86334947999061f"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Chemistry_Atomic structure
                  </a>
                  {' by '}
                  <a
                    href="https://sketchfab.com/pugar.wulandari?utm_medium=embed&utm_campaign=share-popup&utm_content=329e3e423749420db86334947999061f"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    pugar.wulandari
                  </a>
                  {' on '}
                  <a
                    href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=329e3e423749420db86334947999061f"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Sketchfab
                  </a>
                </p>
              </div>
            </div>

            {/* Reaction Simulation */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h3 className="text-title-sm font-semibold text-black mb-6">Chemical Reaction</h3>
                
                {/* Reactants */}
                <div className="mb-8">
                  <h4 className="text-body-sm font-semibold text-gray-700 mb-4">Reactants</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {reaction.reactants.map((reactant, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-body-sm font-medium text-black">{reactant.name}</span>
                          <span className="text-body-sm font-mono text-gray-600">{reactant.formula}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setReactantAmounts({
                              ...reactantAmounts,
                              [reactant.formula]: Math.max(0, (reactantAmounts[reactant.formula] || 0) - 1)
                            })}
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
                            disabled={reactionStarted}
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-black w-12 text-center">
                            {reactantAmounts[reactant.formula] || 0}
                          </span>
                          <button
                            onClick={() => setReactantAmounts({
                              ...reactantAmounts,
                              [reactant.formula]: (reactantAmounts[reactant.formula] || 0) + 1
                            })}
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
                            disabled={reactionStarted}
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Required: {reactant.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center mb-8">
                  <motion.div
                    animate={reactionStarted ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: reactionStarted ? Infinity : 0, duration: 0.5 }}
                    className="text-4xl text-gray-400"
                  >
                    →
                  </motion.div>
                </div>

                {/* Products */}
                <div className="mb-8">
                  <h4 className="text-body-sm font-semibold text-gray-700 mb-4">Products</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {reaction.products.map((product, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={reactionComplete ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.8 }}
                        className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-body-sm font-medium text-black">{product.name}</span>
                          <span className="text-body-sm font-mono text-blue-600">{product.formula}</span>
                        </div>
                        {reactionComplete && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-2 text-xs text-green-600 font-medium flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Formed
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                {!reactionStarted && (
                  <button
                    onClick={handleStartReaction}
                    className="w-full px-6 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Zap className="h-5 w-5" />
                    <span>Start Reaction</span>
                  </button>
                )}

                {/* Reaction Animation */}
                {reactionStarted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-white text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="inline-block mb-4"
                    >
                      <Atom className="h-16 w-16" />
                    </motion.div>
                    <p className="text-lg font-semibold">
                      {reactionComplete ? 'Reaction Complete!' : 'Reaction in progress...'}
                    </p>
                  </motion.div>
                )}
              </div>
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
                      <Award className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-title-sm font-semibold text-black mb-2">Reaction Successful!</h3>
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
    <div className="min-h-screen pt-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            Chemistry Laboratory
          </h1>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Explore chemical reactions, balance equations, and understand molecular interactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reactions.map((reaction, index) => (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedReaction(reaction.id)
                setReactantAmounts({})
                setReactionStarted(false)
                setReactionComplete(false)
                setScore(0)
              }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FlaskConical className="h-16 w-16 text-white/90 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-title-sm font-semibold text-black">{reaction.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {reaction.type}
                  </span>
                </div>
                <p className="text-body-sm text-gray-600 mb-4 font-light">{reaction.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="font-light">{reaction.reactants.length} reactants</span>
                  <span className="font-light">{reaction.products.length} products</span>
                </div>

                <div className="flex items-center text-accent text-body-sm font-light group-hover:opacity-70 transition-opacity">
                  <Play className="h-4 w-4 mr-2" />
                  <span>Start Reaction</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

