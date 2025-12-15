'use client'

import { useState, Suspense, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, ArrowLeft, X, RotateCcw, Trophy, Star, Target, Zap, CheckCircle, Sparkles, Flame, Rocket } from 'lucide-react'
import Link from 'next/link'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Html, Text, PerspectiveCamera, Stars, Sparkles as Sparkles3D, Trail, Effects } from '@react-three/drei'
import * as THREE from 'three'

// Particle System Component
function ParticleSystem({ position, color, count = 50 }: { position: [number, number, number], color: string, count?: number }) {
  const particles = useRef<THREE.Points>(null)
  const particleGeometry = useRef<THREE.BufferGeometry>(null)
  
  useEffect(() => {
    if (particleGeometry.current) {
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3] = (Math.random() - 0.5) * 2
        positions[i3 + 1] = (Math.random() - 0.5) * 2
        positions[i3 + 2] = (Math.random() - 0.5) * 2
        
        velocities[i3] = (Math.random() - 0.5) * 0.02
        velocities[i3 + 1] = Math.random() * 0.02
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
      }
      
      particleGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particleGeometry.current.userData.velocities = velocities
    }
  }, [count])
  
  useFrame(() => {
    if (particles.current && particleGeometry.current) {
      const positions = particleGeometry.current.attributes.position.array as Float32Array
      const velocities = particleGeometry.current.userData.velocities as Float32Array
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]
        
        // Reset if out of bounds
        if (Math.abs(positions[i3]) > 1) velocities[i3] *= -1
        if (Math.abs(positions[i3 + 1]) > 1) velocities[i3 + 1] *= -1
        if (Math.abs(positions[i3 + 2]) > 1) velocities[i3 + 2] *= -1
      }
      
      particleGeometry.current.attributes.position.needsUpdate = true
      particles.current.rotation.y += 0.001
    }
  })
  
  return (
    <points ref={particles} position={position}>
      <bufferGeometry ref={particleGeometry} />
      <pointsMaterial size={0.05} color={color} transparent opacity={0.8} />
    </points>
  )
}

// Collectible with advanced effects
function Collectible({ position, onCollect, collected, index }: { position: [number, number, number], onCollect: () => void, collected: boolean, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.02
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.2
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3
      meshRef.current.scale.setScalar(hovered ? 1.3 : 1)
    }
  })

  if (collected) {
    // Explosion effect
    return (
      <group position={position}>
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onCollect()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <icosahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial 
          color="#ffd700" 
          emissive="#ffd700"
          emissiveIntensity={hovered ? 1.5 : 0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Glow effect */}
      <mesh>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
          color="#ffd700" 
          emissive="#ffd700"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Particle trail */}
      <ParticleSystem position={[0, 0, 0]} color="#ffd700" count={30} />
    </group>
  )
}

// Vision Pro Experience - Enhanced Game
function VisionProScene({ score, setScore, onComplete, level }: { score: number, setScore: (s: number) => void, onComplete: () => void, level: number }) {
  const [collectibles, setCollectibles] = useState(
    Array.from({ length: 5 + level * 2 }, (_, i) => ({
      id: i + 1,
      position: [
        (Math.random() - 0.5) * 6,
        1.5 + Math.random() * 2,
        -2 - Math.random() * 3
      ] as [number, number, number],
      collected: false
    }))
  )
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [showCombo, setShowCombo] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [timeLeft, onComplete])

  const handleCollect = (id: number) => {
    setCollectibles(prev => prev.map(item => 
      item.id === id ? { ...item, collected: true } : item
    ))
    const newCombo = combo + 1
    setCombo(newCombo)
    const points = 10 + (newCombo * 2)
    setScore(score + points)
    setShowCombo(true)
    setTimeout(() => setShowCombo(false), 1000)
    
    const allCollected = collectibles.filter(c => c.id !== id).every(c => c.collected) && true
    if (allCollected || collectibles.filter(c => c.id !== id).every(c => c.collected)) {
      setTimeout(() => onComplete(), 500)
    }
  }

  const collectedCount = collectibles.filter(c => c.collected).length
  const totalCount = collectibles.length

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#0071e3" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color="#ffffff" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      
      {/* Animated floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          wireframe
          emissive="#0071e3"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Vision Pro Device with animation */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.2, 0.15]} />
          <meshStandardMaterial color="#1d1d1f" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
          <meshStandardMaterial color="#000000" opacity={0.7} transparent />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial 
            color="#0071e3" 
            emissive="#0071e3" 
            emissiveIntensity={0.8}
            opacity={0.5}
            transparent
          />
        </mesh>
      </group>
      
      {/* Collectible items */}
      {collectibles.map((item) => (
        <Collectible
          key={item.id}
          position={item.position}
          onCollect={() => handleCollect(item.id)}
          collected={item.collected}
          index={item.id}
        />
      ))}
      
      {/* Floating particles */}
      <Sparkles3D count={100} scale={10} size={2} speed={0.4} />
      
      {/* Enhanced UI */}
      <Html position={[0, 5, 0]} center>
        <div className="bg-black/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl text-center border border-white/20 shadow-2xl">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{score}</div>
          <div className="text-sm text-gray-300 mb-2">
            Collected: <span className="text-green-400 font-bold">{collectedCount}/{totalCount}</span>
          </div>
          <div className="text-xs text-gray-400">
            Time: <span className="text-red-400 font-bold">{timeLeft}s</span> | 
            Combo: <span className="text-purple-400 font-bold">x{combo}</span>
          </div>
        </div>
      </Html>
      
      {/* Combo indicator */}
      {showCombo && (
        <Html position={[0, 3, 0]} center>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-6xl font-bold text-yellow-400 drop-shadow-2xl"
          >
            COMBO x{combo}!
          </motion.div>
        </Html>
      )}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Environment preset="night" />
    </>
  )
}

// VR Design Studio - Enhanced
function VRDesignStudioScene({ score, setScore, onComplete, level }: { score: number, setScore: (s: number) => void, onComplete: () => void, level: number }) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [createdObjects, setCreatedObjects] = useState<Array<{ id: number, type: string, position: [number, number, number], rotation: [number, number, number] }>>([])
  const [targetCount] = useState(3 + level)
  const [powerUpActive, setPowerUpActive] = useState(false)
  
  const handleCreateObject = (type: string) => {
    const newObject = {
      id: Date.now(),
      type,
      position: [
        (Math.random() - 0.5) * 6,
        1 + Math.random(),
        (Math.random() - 0.5) * 6
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number]
    }
    
    setCreatedObjects(prev => [...prev, newObject])
    const points = powerUpActive ? 15 : 5
    setScore(score + points)
    
    if (createdObjects.length + 1 >= targetCount) {
      setTimeout(() => onComplete(), 500)
    }
  }

  const handlePowerUp = () => {
    setPowerUpActive(true)
    setTimeout(() => setPowerUpActive(false), 10000)
  }

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#ff3b30" />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#0071e3" />
      
      {/* Studio floor with pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          wireframe={false}
          emissive="#1a1a2e"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <gridHelper args={[20, 20, '#0071e3', '#1a1a2e']} />
      
      {/* Template objects with glow */}
      <group>
        {[
          { type: 'cube', pos: [-2, 1, 0], color: '#0071e3' },
          { type: 'sphere', pos: [0, 1, 0], color: '#ff3b30' },
          { type: 'torus', pos: [2, 1, 0], color: '#34c759' }
        ].map((obj) => (
          <group key={obj.type} position={obj.pos}>
            <mesh 
              onClick={() => {
                setSelectedTool(obj.type)
                handleCreateObject(obj.type)
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto'
              }}
            >
              {obj.type === 'cube' && <boxGeometry args={[1, 1, 1]} />}
              {obj.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
              {obj.type === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
              <meshStandardMaterial 
                color={obj.color} 
                emissive={obj.color}
                emissiveIntensity={0.5}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Glow effect */}
            <mesh>
              {obj.type === 'cube' && <boxGeometry args={[1.1, 1.1, 1.1]} />}
              {obj.type === 'sphere' && <sphereGeometry args={[0.55, 32, 32]} />}
              {obj.type === 'torus' && <torusGeometry args={[0.55, 0.25, 16, 100]} />}
              <meshStandardMaterial 
                color={obj.color}
                emissive={obj.color}
                emissiveIntensity={0.2}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Created objects with physics-like animation */}
      {createdObjects.map((obj) => {
        const meshRef = useRef<THREE.Mesh>(null)
        useFrame(() => {
          if (meshRef.current) {
            meshRef.current.rotation.x += 0.01
            meshRef.current.rotation.y += 0.01
          }
        })
        
        return (
          <mesh key={obj.id} ref={meshRef} position={obj.position} rotation={obj.rotation}>
            {obj.type === 'cube' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
            {obj.type === 'sphere' && <sphereGeometry args={[0.3, 32, 32]} />}
            {obj.type === 'torus' && <torusGeometry args={[0.3, 0.1, 16, 100]} />}
            <meshStandardMaterial 
              color={obj.type === 'cube' ? '#0071e3' : obj.type === 'sphere' ? '#ff3b30' : '#34c759'}
              emissive={obj.type === 'cube' ? '#0071e3' : obj.type === 'sphere' ? '#ff3b30' : '#34c759'}
              emissiveIntensity={powerUpActive ? 1 : 0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        )
      })}
      
      {/* Power-up button */}
      <Html position={[4, 3, 0]}>
        <button
          onClick={handlePowerUp}
          disabled={powerUpActive}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            powerUpActive 
              ? 'bg-yellow-500 text-white animate-pulse' 
              : 'bg-purple-500/90 text-white hover:bg-purple-600'
          }`}
        >
          {powerUpActive ? '2x Points!' : 'Power-Up'}
        </button>
      </Html>
      
      {/* Enhanced UI */}
      <Html position={[0, 4, 0]} center>
        <div className="bg-black/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl text-center border border-white/20 shadow-2xl">
          <div className="text-4xl font-bold text-green-400 mb-2">{score}</div>
          <div className="text-sm text-gray-300">
            Created: <span className="text-purple-400 font-bold">{createdObjects.length}/{targetCount}</span>
            {powerUpActive && <span className="ml-2 text-yellow-400 animate-pulse">2x ACTIVE!</span>}
          </div>
        </div>
      </Html>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Environment preset="sunset" />
    </>
  )
}

// AR Overlay Scene - Enhanced
function AROverlayScene({ score, setScore, onComplete, level }: { score: number, setScore: (s: number) => void, onComplete: () => void, level: number }) {
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [targetsFound, setTargetsFound] = useState(0)
  const [foundTargets, setFoundTargets] = useState<number[]>([])
  const [scanning, setScanning] = useState(false)
  
  const targets = Array.from({ length: 3 + level }, (_, i) => ({
    id: i + 1,
    position: [
      (Math.random() - 0.5) * 6,
      1 + Math.random() * 1.5,
      -2 - Math.random() * 3
    ] as [number, number, number],
    name: `Target ${i + 1}`
  }))

  const handleTargetClick = (id: number) => {
    if (foundTargets.includes(id)) return
    
    setFoundTargets(prev => [...prev, id])
    setTargetsFound(targetsFound + 1)
    setScore(score + 15)
    
    if (targetsFound + 1 >= targets.length) {
      setTimeout(() => onComplete(), 500)
    }
  }

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setOverlayVisible(true)
    }, 2000)
  }

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#0071e3" />
      
      {/* "Real world" background */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      
      {/* Scanning effect */}
      {scanning && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#0071e3" 
            transparent
            opacity={0.3}
            emissive="#0071e3"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      
      {/* Targets */}
      {targets.map((target) => (
        <group key={target.id} position={target.position}>
          <mesh 
            onClick={() => handleTargetClick(target.id)}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (!foundTargets.includes(target.id)) {
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial 
              color={foundTargets.includes(target.id) ? '#34c759' : '#718096'}
              emissive={foundTargets.includes(target.id) ? '#34c759' : '#000000'}
              emissiveIntensity={foundTargets.includes(target.id) ? 0.8 : 0}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Pulse effect for unfound targets */}
          {!foundTargets.includes(target.id) && overlayVisible && (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color="#0071e3"
                transparent
                opacity={0.2}
                emissive="#0071e3"
                emissiveIntensity={0.3}
              />
            </mesh>
          )}
        </group>
      ))}
      
      {/* AR Overlays */}
      {overlayVisible && !scanning && (
        <>
          {targets.map((target) => (
            <Html key={target.id} position={[target.position[0], target.position[1] + 1.5, target.position[2]]} center>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  foundTargets.includes(target.id) 
                    ? 'bg-green-500/90 scale-110' 
                    : 'bg-blue-500/90 hover:bg-blue-600/90'
                }`}
              >
                {foundTargets.includes(target.id) ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Found!
                  </span>
                ) : (
                  target.name
                )}
              </motion.div>
            </Html>
          ))}
        </>
      )}
      
      {/* Enhanced UI */}
      <Html position={[0, 4, 0]} center>
        <div className="bg-black/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl text-center border border-white/20 shadow-2xl">
          <div className="text-4xl font-bold text-blue-400 mb-2">{score}</div>
          <div className="text-sm text-gray-300">
            Targets: <span className="text-green-400 font-bold">{targetsFound}/{targets.length}</span>
          </div>
        </div>
      </Html>
      
      {/* Controls */}
      <Html position={[4, 3, 0]}>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setOverlayVisible(!overlayVisible)}
            className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-semibold hover:bg-white transition-colors"
          >
            {overlayVisible ? 'Hide AR' : 'Show AR'}
          </button>
          <button
            onClick={handleScan}
            disabled={scanning}
            className="bg-purple-500/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan Area'}
          </button>
        </div>
      </Html>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Environment preset="city" />
    </>
  )
}

const demos = [
  {
    id: 'vision-pro',
    title: 'Apple Vision Pro Experience',
    description: 'Collect spheres in space! Combo system, time limit, and particle effects!',
    content: 'Navigate the 3D space and collect all golden spheres. Build combos for bonus points! Time is limited - collect them all before time runs out!',
    features: [
      'Combo multiplier system',
      'Time challenge mode',
      'Particle effects',
      'Starfield background',
      'Advanced lighting',
    ],
    scene: VisionProScene,
    duration: '5 min',
    maxScore: 500,
    icon: Rocket,
  },
  {
    id: 'vr-design',
    title: 'VR Design Studio',
    description: 'Create objects with power-ups! 2x points and glowing effects!',
    content: 'Click template objects to create them in the scene. Activate power-ups for 2x points! Create all required objects to complete the challenge!',
    features: [
      'Power-up system',
      'Animated creations',
      'Glow effects',
      'Multi-light setup',
      'Pattern floor',
    ],
    scene: VRDesignStudioScene,
    duration: '8 min',
    maxScore: 150,
    icon: Sparkles,
  },
  {
    id: 'ar-overlay',
    title: 'AR Overlay Demo',
    description: 'Find targets with AR scanning! Pulse effects and discovery mode!',
    content: 'Use AR overlays and scanning to find hidden targets. Click each target to mark it as found. Use the scan feature to reveal hidden objects!',
    features: [
      'AR scanning mode',
      'Pulse detection',
      'Visual feedback',
      'Multi-target hunt',
      'Discovery system',
    ],
    scene: AROverlayScene,
    duration: '4 min',
    maxScore: 300,
    icon: Target,
  },
]

export default function ARVRDemo() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [level, setLevel] = useState(1)
  const [achievements, setAchievements] = useState<string[]>([])

  const handleGameComplete = () => {
    setGameComplete(true)
    setShowCompletion(true)
    
    // Award achievements
    const newAchievements: string[] = []
    if (score >= 100) newAchievements.push('High Scorer')
    if (score >= 200) newAchievements.push('Master Player')
    if (score >= 300) newAchievements.push('Legendary')
    setAchievements(newAchievements)
  }

  const handleReset = () => {
    setScore(0)
    setGameComplete(false)
    setShowCompletion(false)
    setLevel(1)
    setAchievements([])
  }

  const handleNextLevel = () => {
    setLevel(level + 1)
    setScore(0)
    setGameComplete(false)
    setShowCompletion(false)
  }

  if (selectedDemo) {
    const demo = demos.find((d) => d.id === selectedDemo)
    const SceneComponent = demo?.scene

    return (
      <div className="min-h-screen pt-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/learning"
              className="inline-flex items-center text-white hover:text-gray-300 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                Level <span className="font-bold text-yellow-400">{level}</span>
              </div>
              <button
                onClick={handleReset}
                className="text-white hover:text-gray-300 transition-colors"
                title="Reset Game"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {demo && (
            <div className="text-center mb-8">
              <h1 className="text-headline-sm md:text-headline font-semibold text-white mb-4 tracking-tight">
                {demo.title}
              </h1>
              <p className="text-gray-300 text-title-sm font-light">{demo.description}</p>
            </div>
          )}

          {/* Completion Modal */}
          <AnimatePresence>
            {showCompletion && gameComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                onClick={() => setShowCompletion(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md mx-4 text-center border border-white/20 shadow-2xl"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 drop-shadow-2xl" />
                  </motion.div>
                  <h2 className="text-headline-sm font-semibold text-white mb-2 tracking-tight">
                    Level Complete!
                  </h2>
                  <p className="text-body text-gray-300 mb-4 font-light">
                    Final Score: <span className="font-semibold text-yellow-400 text-2xl">{score}</span>
                  </p>
                  
                  {/* Achievements */}
                  {achievements.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
                      <p className="text-sm font-semibold text-yellow-400 mb-2">Achievements Unlocked!</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {achievements.map((ach, i) => (
                          <span key={i} className="px-3 py-1 bg-yellow-500/30 rounded-full text-xs text-yellow-300">
                            {ach}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 transition-all ${
                          score >= (demo?.maxScore || 0) * (0.6 + i * 0.1) 
                            ? 'text-yellow-400 fill-yellow-400 scale-110' 
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                    >
                      Restart
                    </button>
                    <button
                      onClick={handleNextLevel}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      Next Level
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive 3D Canvas */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl mb-6">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
                    <p className="text-white text-lg font-light">Loading Game World...</p>
                    <p className="text-gray-400 text-sm mt-2">Preparing amazing experience...</p>
                  </div>
                </div>
              }
            >
              {SceneComponent && (
                <Canvas>
                  <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
                  <SceneComponent 
                    score={score} 
                    setScore={setScore}
                    onComplete={handleGameComplete}
                    level={level}
                  />
                </Canvas>
              )}
            </Suspense>
          </div>

          {/* Instructions */}
          <AnimatePresence>
            {showInstructions && demo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white mb-6 border border-white/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-title-sm font-semibold flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    How to Play
                  </h3>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-300 mb-4 font-light leading-relaxed">
                  {demo.content}
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Controls:</h4>
                  <ul className="space-y-1 text-gray-300 font-light text-sm">
                    <li>• <strong>Click & Drag:</strong> Rotate camera</li>
                    <li>• <strong>Scroll:</strong> Zoom in/out</li>
                    <li>• <strong>Right-click & Drag:</strong> Pan view</li>
                    <li>• <strong>Click objects:</strong> Interact/collect</li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {demo.features.map((feature, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="text-center mb-12">
          <h1 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            AR/VR Game Worlds
          </h1>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Experience mind-blowing interactive mini-games with advanced graphics, physics, and game mechanics!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demos.map((demo, index) => {
            const Icon = demo.icon || Play
            return (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedDemo(demo.id)
                  setScore(0)
                  setGameComplete(false)
                  setLevel(1)
                }}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-gray-200 hover:border-accent/50"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="h-16 w-16 text-white/90 group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                    {demo.duration}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium flex items-center">
                    <Trophy className="h-3 w-3 mr-1" />
                    {demo.maxScore} pts
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-title-sm font-semibold text-black mb-2 tracking-tight">
                    {demo.title}
                  </h3>
                  <p className="text-body-sm text-gray-600 mb-4 font-light">
                    {demo.description}
                  </p>
                  <div className="flex items-center text-accent text-body-sm font-light group-hover:opacity-70 transition-opacity">
                    <Play className="h-4 w-4 mr-2" />
                    <span>Start Game</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
