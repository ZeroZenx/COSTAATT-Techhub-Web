'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plane, 
  Wifi, 
  MapPin, 
  Camera, 
  Thermometer, 
  Droplets,
  Wind,
  Zap,
  Radio,
  Satellite,
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Navigation,
  Cloud
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import toast from 'react-hot-toast'

// 3D Drone Model
function DroneModel({ position, rotation, isFlying, battery }: {
  position: [number, number, number],
  rotation: [number, number, number],
  isFlying: boolean,
  battery: number
}) {
  const droneRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    if (!droneRef.current) return
    
    const animate = () => {
      if (isFlying && droneRef.current) {
        droneRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.1
        droneRef.current.rotation.z = rotation[2] + Math.sin(Date.now() * 0.005) * 0.05
      }
    }
    
    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [isFlying, position, rotation])
  
  return (
    <group ref={droneRef} position={position} rotation={rotation}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Arms */}
      {([
        [0.4, 0, 0],
        [-0.4, 0, 0],
        [0, 0, 0.4],
        [0, 0, -0.4]
      ] as [number, number, number][]).map((armPos, idx) => (
        <group key={idx} position={armPos}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Propeller */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.01, 8]} />
            <meshStandardMaterial 
              color={isFlying ? "#0071e3" : "#666"}
              emissive={isFlying ? "#0071e3" : "#000"}
              emissiveIntensity={isFlying ? 0.3 : 0}
            />
          </mesh>
        </group>
      ))}
      
      {/* Battery indicator */}
      <Html position={[0, 0.5, 0]} center>
        <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
          {battery}%
        </div>
      </Html>
    </group>
  )
}

// IoT Sensor Visualization
function IoTSensor({ type, value, position, unit }: {
  type: string,
  value: number,
  position: [number, number, number],
  unit: string
}) {
  const getIcon = () => {
    switch(type) {
      case 'temperature': return <Thermometer className="h-4 w-4" />
      case 'humidity': return <Droplets className="h-4 w-4" />
      case 'wind': return <Wind className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }
  
  const getColor = () => {
    switch(type) {
      case 'temperature': return value > 30 ? '#ef4444' : '#3b82f6'
      case 'humidity': return '#06b6d4'
      case 'wind': return '#8b5cf6'
      default: return '#10b981'
    }
  }
  
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Html position={[0, 0.3, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-lg text-xs font-semibold">
          <div className="flex items-center space-x-1">
            {getIcon()}
            <span>{value}{unit}</span>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Drone Flight Path Visualization
function FlightPath({ waypoints, currentWaypoint }: {
  waypoints: [number, number, number][],
  currentWaypoint: number
}) {
  return (
    <>
      {/* Path line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={waypoints.length}
            array={new Float32Array(waypoints.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0071e3" opacity={0.5} transparent />
      </line>
      
      {/* Waypoints */}
      {waypoints.map((wp, idx) => (
        <group key={idx} position={wp}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={idx === currentWaypoint ? '#10b981' : '#6b7280'}
              emissive={idx === currentWaypoint ? '#10b981' : '#000'}
              emissiveIntensity={idx === currentWaypoint ? 0.8 : 0}
            />
          </mesh>
          <Html position={[0, 0.5, 0]} center>
            <div className={`px-2 py-1 rounded text-xs font-semibold ${
              idx === currentWaypoint 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              WP{idx + 1}
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}

const integrationScenarios = [
  {
    id: 'agriculture',
    title: 'Smart Agriculture',
    description: 'Drones monitor crop health, soil moisture, and irrigation needs',
    icon: Droplets,
    color: 'from-green-500 to-emerald-500',
    sensors: ['temperature', 'humidity', 'soil-moisture'],
    useCase: 'Automated crop monitoring and precision irrigation'
  },
  {
    id: 'security',
    title: 'Security & Surveillance',
    description: 'Drones patrol areas and send real-time alerts to IoT security systems',
    icon: AlertTriangle,
    color: 'from-red-500 to-rose-500',
    sensors: ['motion', 'camera', 'thermal'],
    useCase: 'Perimeter monitoring and threat detection'
  },
  {
    id: 'delivery',
    title: 'Smart Delivery',
    description: 'Drones deliver packages and update IoT tracking systems in real-time',
    icon: MapPin,
    color: 'from-blue-500 to-cyan-500',
    sensors: ['gps', 'weight', 'temperature'],
    useCase: 'Automated logistics and package tracking'
  },
  {
    id: 'environmental',
    title: 'Environmental Monitoring',
    description: 'Drones collect air quality, weather, and pollution data',
    icon: Wind,
    color: 'from-purple-500 to-pink-500',
    sensors: ['air-quality', 'wind', 'temperature'],
    useCase: 'Real-time environmental data collection'
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure Inspection',
    description: 'Drones inspect bridges, buildings, and power lines with IoT sensors',
    icon: BarChart3,
    color: 'from-orange-500 to-yellow-500',
    sensors: ['camera', 'lidar', 'vibration'],
    useCase: 'Automated infrastructure health monitoring'
  },
  {
    id: 'emergency',
    title: 'Emergency Response',
    description: 'Drones provide real-time data to emergency IoT networks',
    icon: Zap,
    color: 'from-red-600 to-orange-500',
    sensors: ['thermal', 'camera', 'gas'],
    useCase: 'Rapid response and situation assessment'
  }
]

const integrationComponents = [
  {
    name: 'Drone Communication',
    description: 'WiFi, 4G/5G, or LoRa for real-time data transmission',
    icon: Radio,
    status: 'connected'
  },
  {
    name: 'IoT Gateway',
    description: 'Receives and processes drone data, routes to cloud',
    icon: Satellite,
    status: 'active'
  },
  {
    name: 'Cloud Platform',
    description: 'Stores data, runs analytics, triggers automations',
    icon: Cloud,
    status: 'synced'
  },
  {
    name: 'Control System',
    description: 'Automated responses based on drone sensor data',
    icon: Settings,
    status: 'ready'
  }
]

export default function DroneIoT() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isFlying, setIsFlying] = useState(false)
  const [battery, setBattery] = useState(100)
  const [currentWaypoint, setCurrentWaypoint] = useState(0)
  const [sensorData, setSensorData] = useState({
    temperature: 25,
    humidity: 60,
    wind: 5,
    airQuality: 85
  })
  const [dronePosition, setDronePosition] = useState<[number, number, number]>([0, 2, 0])
  const [droneRotation, setDroneRotation] = useState<[number, number, number]>([0, 0, 0])
  
  const waypoints: [number, number, number][] = [
    [0, 2, 0],
    [3, 2, 2],
    [3, 2, -2],
    [-3, 2, -2],
    [-3, 2, 2],
    [0, 2, 0]
  ]
  
  // Flight simulation
  useEffect(() => {
    if (!isFlying) return
    
    const interval = setInterval(() => {
      setCurrentWaypoint(prev => {
        const next = (prev + 1) % waypoints.length
        const current = waypoints[prev]
        const target = waypoints[next]
        
        // Animate drone movement
        const progress = 0.02
        setDronePosition([
          current[0] + (target[0] - current[0]) * progress,
          current[1] + (target[1] - current[1]) * progress,
          current[2] + (target[2] - current[2]) * progress
        ])
        
        // Update rotation to face direction of travel
        const dx = target[0] - current[0]
        const dz = target[2] - current[2]
        const angle = Math.atan2(dx, dz)
        setDroneRotation([0, angle, 0])
        
        // Reset position when reaching waypoint
        if (Math.abs(dronePosition[0] - target[0]) < 0.1 && 
            Math.abs(dronePosition[2] - target[2]) < 0.1) {
          return next
        }
        
        return prev
      })
      
      // Drain battery
      setBattery(prev => Math.max(0, prev - 0.1))
      
      // Update sensor data
      setSensorData(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        humidity: prev.humidity + (Math.random() - 0.5) * 1,
        wind: Math.max(0, prev.wind + (Math.random() - 0.5) * 0.3),
        airQuality: Math.max(0, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 2))
      }))
    }, 50)
    
    return () => clearInterval(interval)
  }, [isFlying, waypoints, dronePosition])
  
  const handleStartFlight = () => {
    setIsFlying(true)
    setBattery(100)
    setCurrentWaypoint(0)
    setDronePosition(waypoints[0])
    toast.success('Flight started!')
  }
  
  const handleStopFlight = () => {
    setIsFlying(false)
    toast('Flight stopped', { icon: 'ℹ️' })
  }
  
  const handleReset = () => {
    setIsFlying(false)
    setBattery(100)
    setCurrentWaypoint(0)
    setDronePosition(waypoints[0])
    setSensorData({
      temperature: 25,
      humidity: 60,
      wind: 5,
      airQuality: 85
    })
  }
  
  if (selectedScenario) {
    const scenario = integrationScenarios.find(s => s.id === selectedScenario)
    
    if (!scenario) {
      return null
    }
    
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedScenario(null)}
              className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Scenarios
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={isFlying ? handleStopFlight : handleStartFlight}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  isFlying 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isFlying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isFlying ? 'Stop Flight' : 'Start Flight'}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Visualization */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${scenario.color} mb-4`}>
                <scenario.icon className="h-5 w-5 mr-2 text-white" />
                <h2 className="text-title-sm font-semibold text-white">{scenario.title}</h2>
              </div>
              
              <div className="h-96 bg-gray-900 rounded-lg overflow-hidden relative">
                <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[-10, 10, -5]} intensity={0.5} color="#0071e3" />
                  
                  {/* Ground */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#4a5568" />
                  </mesh>
                  <gridHelper args={[20, 20, '#0071e3', '#2d3748']} />
                  
                  {/* Drone */}
                  <DroneModel
                    position={dronePosition}
                    rotation={droneRotation}
                    isFlying={isFlying}
                    battery={battery}
                  />
                  
                  {/* Flight path */}
                  <FlightPath waypoints={waypoints} currentWaypoint={currentWaypoint} />
                  
                  {/* IoT Sensors on ground */}
                  <IoTSensor type="temperature" value={sensorData.temperature} position={[2, 0.1, 2]} unit="°C" />
                  <IoTSensor type="humidity" value={sensorData.humidity} position={[-2, 0.1, 2]} unit="%" />
                  <IoTSensor type="wind" value={sensorData.wind} position={[2, 0.1, -2]} unit="m/s" />
                  
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Use Case:</strong> {scenario.useCase}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Sensors: {scenario.sensors.join(', ')}
                </p>
              </div>
            </div>
            
            {/* Data Panel */}
            <div className="space-y-4">
              {/* Battery Status */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">Drone Status</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Battery</span>
                      <span className="font-semibold text-gray-900">{battery.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          battery > 50 ? 'bg-green-500' : battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${battery}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${
                      isFlying ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {isFlying ? 'Flying' : 'Idle'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Waypoint</span>
                    <span className="font-semibold text-gray-900">
                      {currentWaypoint + 1} / {waypoints.length}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Sensor Data */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">Sensor Data</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-600">Temperature</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {sensorData.temperature.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Humidity</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {sensorData.humidity.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600">Wind Speed</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {sensorData.wind.toFixed(1)} m/s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">Air Quality</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {sensorData.airQuality.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Integration Status */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-4">IoT Integration</h3>
                <div className="space-y-2">
                  {integrationComponents.map((component, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <component.icon className="h-4 w-4 text-accent" />
                        <span className="text-xs text-gray-700">{component.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        component.status === 'connected' || component.status === 'active' || component.status === 'synced'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {component.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 mb-4">
            <Plane className="h-6 w-6 mr-2 text-white" />
            <h1 className="text-headline-sm md:text-headline font-semibold text-white">
              Drone & IoT Integration
            </h1>
          </div>
          <p className="text-title-sm text-gray-600 max-w-2xl mx-auto font-light mt-4">
            Explore how drones integrate with IoT systems for automated monitoring, data collection, and smart responses
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrationScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedScenario(scenario.id)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200"
            >
              <div className={`h-32 bg-gradient-to-br ${scenario.color} flex items-center justify-center`}>
                <scenario.icon className="h-12 w-12 text-white/90 group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <h3 className="text-title-xs font-semibold text-gray-900 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-body-sm text-gray-600 mb-4 font-light">
                  {scenario.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {scenario.sensors.map((sensor, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                      {sensor}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-accent text-body-sm font-light group-hover:opacity-70 transition-opacity">
                  <Play className="h-4 w-4 mr-2" />
                  <span>Explore</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Integration Architecture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
        >
          <h2 className="text-title-sm font-semibold text-gray-900 mb-6 flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-accent" />
            Integration Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {integrationComponents.map((component, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <component.icon className="h-8 w-8 text-accent mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{component.name}</h4>
                <p className="text-xs text-gray-600">{component.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Drone collects sensor data during flight</li>
              <li>Data transmitted via WiFi/4G/5G to IoT gateway</li>
              <li>Gateway processes and routes data to cloud platform</li>
              <li>Cloud platform analyzes data and triggers automated responses</li>
              <li>Control systems execute actions (irrigation, alerts, etc.)</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

