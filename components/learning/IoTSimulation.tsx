'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, 
  Thermometer, 
  Lightbulb, 
  Lock, 
  Power, 
  Shield, 
  Camera, 
  Wind, 
  Droplet,
  Zap,
  Clock,
  Settings,
  Home,
  TrendingUp,
  Bell,
  Mic,
  Sun,
  Moon,
  Cloud,
  Activity,
  Battery,
  WifiOff,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Device {
  id: string
  name: string
  type: 'thermostat' | 'light' | 'lock' | 'sensor' | 'camera' | 'security' | 'smartplug'
  status: boolean
  value?: number
  brightness?: number
  color?: string
  room: string
  icon: typeof Thermometer
  energyUsage?: number
  lastUpdate?: Date
}

interface Automation {
  id: string
  name: string
  trigger: string
  action: string
  enabled: boolean
}

interface EnergyData {
  time: string
  usage: number
}

const rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Garage', 'Outdoor']

const initialDevices: Device[] = [
  { id: '1', name: 'Living Room Thermostat', type: 'thermostat', status: true, value: 72, room: 'Living Room', icon: Thermometer, energyUsage: 2.5, lastUpdate: new Date() },
  { id: '2', name: 'Kitchen Lights', type: 'light', status: false, brightness: 50, room: 'Kitchen', icon: Lightbulb, energyUsage: 0.8, lastUpdate: new Date() },
  { id: '3', name: 'Front Door Lock', type: 'lock', status: true, room: 'Outdoor', icon: Lock, energyUsage: 0.1, lastUpdate: new Date() },
  { id: '4', name: 'Motion Sensor', type: 'sensor', status: true, room: 'Living Room', icon: Activity, energyUsage: 0.05, lastUpdate: new Date() },
  { id: '5', name: 'Security Camera', type: 'camera', status: true, room: 'Outdoor', icon: Camera, energyUsage: 1.2, lastUpdate: new Date() },
  { id: '6', name: 'Smart Plug', type: 'smartplug', status: false, room: 'Bedroom', icon: Power, energyUsage: 0, lastUpdate: new Date() },
  { id: '7', name: 'Bedroom Lights', type: 'light', status: true, brightness: 30, room: 'Bedroom', icon: Lightbulb, energyUsage: 0.5, lastUpdate: new Date() },
  { id: '8', name: 'Security System', type: 'security', status: true, room: 'Outdoor', icon: Shield, energyUsage: 0.3, lastUpdate: new Date() },
  { id: '9', name: 'Bathroom Heater', type: 'thermostat', status: false, value: 68, room: 'Bathroom', icon: Thermometer, energyUsage: 0, lastUpdate: new Date() },
  { id: '10', name: 'Garage Door', type: 'lock', status: false, room: 'Garage', icon: Lock, energyUsage: 0.2, lastUpdate: new Date() },
]

const automations: Automation[] = [
  { id: '1', name: 'Good Morning', trigger: '7:00 AM', action: 'Turn on lights, set temp to 72°', enabled: true },
  { id: '2', name: 'Away Mode', trigger: 'Motion: None for 30min', action: 'Lock doors, turn off lights', enabled: true },
  { id: '3', name: 'Night Mode', trigger: '10:00 PM', action: 'Dim lights, lock doors', enabled: false },
  { id: '4', name: 'Energy Saver', trigger: 'No motion for 1hr', action: 'Reduce temp by 5°', enabled: true },
]

export default function IoTSimulation() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [selectedRoom, setSelectedRoom] = useState<string>('All')
  const [energyData, setEnergyData] = useState<EnergyData[]>([])
  const [totalEnergy, setTotalEnergy] = useState(0)
  const [automationRules, setAutomationRules] = useState<Automation[]>(automations)
  const [showAutomation, setShowAutomation] = useState(false)
  const [voiceCommand, setVoiceCommand] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [weather, setWeather] = useState({ temp: 78, condition: 'Sunny', humidity: 65 })
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'rooms'>('grid')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        lastUpdate: new Date(),
        energyUsage: device.status ? (device.energyUsage || 0) + Math.random() * 0.1 : 0
      })))
      
      // Update energy data
      const now = new Date()
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      const currentUsage = devices
        .filter(d => d.status)
        .reduce((sum, d) => sum + (d.energyUsage || 0), 0)
      
      setEnergyData(prev => {
        const newData = [...prev, { time: timeStr, usage: currentUsage }]
        return newData.slice(-20) // Keep last 20 data points
      })
      
      setTotalEnergy(prev => prev + currentUsage * 0.1)
      
      // Simulate weather changes
      if (Math.random() > 0.9) {
        setWeather(prev => ({
          temp: prev.temp + (Math.random() - 0.5) * 2,
          condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          humidity: Math.max(40, Math.min(80, prev.humidity + (Math.random() - 0.5) * 5))
        }))
      }
      
      // Simulate security alerts
      if (Math.random() > 0.95 && devices.find(d => d.type === 'sensor' && d.status)?.status) {
        setSecurityAlerts(prev => [
          ...prev,
          `Motion detected at ${new Date().toLocaleTimeString()}`
        ])
        toast.success('Motion detected!', { icon: '🔔' })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [devices])

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = !d.status
        toast.success(`${d.name} turned ${newStatus ? 'ON' : 'OFF'}`)
        return { ...d, status: newStatus, lastUpdate: new Date() }
      }
      return d
    }))
  }

  const adjustValue = (id: string, delta: number) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id && d.value !== undefined) {
        const newValue = Math.max(60, Math.min(85, d.value + delta))
        toast.success(`Temperature set to ${newValue}°F`)
        return { ...d, value: newValue, lastUpdate: new Date() }
      }
      return d
    }))
  }

  const adjustBrightness = (id: string, brightness: number) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id && d.type === 'light') {
        return { ...d, brightness, energyUsage: (brightness / 100) * 0.8, lastUpdate: new Date() }
      }
      return d
    }))
  }

  const executeAutomation = (automation: Automation) => {
    toast.success(`Executing: ${automation.name}`)
    // Simulate automation execution
    if (automation.name === 'Good Morning') {
      setDevices(prev => prev.map(d => {
        if (d.type === 'light') return { ...d, status: true, brightness: 80, lastUpdate: new Date() }
        if (d.type === 'thermostat') return { ...d, status: true, value: 72, lastUpdate: new Date() }
        return d
      }))
    } else if (automation.name === 'Away Mode') {
      setDevices(prev => prev.map(d => {
        if (d.type === 'light') return { ...d, status: false, lastUpdate: new Date() }
        if (d.type === 'lock') return { ...d, status: true, lastUpdate: new Date() }
        return d
      }))
    }
  }

  const handleVoiceCommand = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      const command = voiceCommand.toLowerCase()
      
      if (command.includes('turn on') || command.includes('turn off')) {
        const action = command.includes('turn on')
        const deviceName = command.split('turn')[1]?.trim() || ''
        const device = devices.find(d => 
          d.name.toLowerCase().includes(deviceName) || 
          deviceName.includes(d.name.toLowerCase().split(' ')[0])
        )
        if (device) {
          toggleDevice(device.id)
          toast.success(`Voice command executed: ${command}`)
        }
      } else if (command.includes('temperature') || command.includes('temp')) {
        const match = command.match(/\d+/)
        if (match) {
          const temp = parseInt(match[0])
          const thermostat = devices.find(d => d.type === 'thermostat' && d.status)
          if (thermostat) {
            setDevices(prev => prev.map(d => 
              d.id === thermostat.id ? { ...d, value: temp, lastUpdate: new Date() } : d
            ))
            toast.success(`Temperature set to ${temp}°F`)
          }
        }
      } else {
        toast.error('Command not recognized. Try: "Turn on lights" or "Set temperature to 72"')
      }
      setVoiceCommand('')
    }, 1500)
  }

  const filteredDevices = selectedRoom === 'All' 
    ? devices 
    : devices.filter(d => d.room === selectedRoom)

  const totalEnergyUsage = devices
    .filter(d => d.status)
    .reduce((sum, d) => sum + (d.energyUsage || 0), 0)

  const activeDevices = devices.filter(d => d.status).length
  const totalDevices = devices.length

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            IoT Smart Home Simulation
          </h1>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Control and monitor connected devices in this advanced interactive simulation
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-body-sm text-gray-500 font-light">Energy</span>
            </div>
            <div className="text-headline-sm font-semibold text-black">{totalEnergyUsage.toFixed(1)}</div>
            <div className="text-body-sm text-gray-500 font-light">kW/h</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span className="text-body-sm text-gray-500 font-light">Active</span>
            </div>
            <div className="text-headline-sm font-semibold text-black">{activeDevices}/{totalDevices}</div>
            <div className="text-body-sm text-gray-500 font-light">Devices</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              {weather.condition === 'Sunny' ? <Sun className="h-5 w-5 text-yellow-500" /> :
               weather.condition === 'Cloudy' ? <Cloud className="h-5 w-5 text-gray-500" /> :
               <Droplet className="h-5 w-5 text-blue-500" />}
              <span className="text-body-sm text-gray-500 font-light">Weather</span>
            </div>
            <div className="text-headline-sm font-semibold text-black">{weather.temp}°F</div>
            <div className="text-body-sm text-gray-500 font-light">{weather.condition}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className={`h-5 w-5 ${devices.find(d => d.type === 'security')?.status ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-body-sm text-gray-500 font-light">Security</span>
            </div>
            <div className="text-headline-sm font-semibold text-black">
              {devices.find(d => d.type === 'security')?.status ? 'Armed' : 'Disarmed'}
            </div>
            <div className="text-body-sm text-gray-500 font-light">System</div>
          </motion.div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-accent text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('rooms')}
              className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${
                viewMode === 'rooms' 
                  ? 'bg-accent text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Room View
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAutomation(!showAutomation)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-body-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Automations</span>
            </button>
            <div className="relative">
              <input
                type="text"
                value={voiceCommand}
                onChange={(e) => setVoiceCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVoiceCommand()}
                placeholder="Voice command..."
                className="px-4 py-2 pr-10 border border-gray-300 rounded-full text-body-sm font-light focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <button
                onClick={handleVoiceCommand}
                disabled={isListening || !voiceCommand}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-accent text-white hover:bg-accent-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Room Filter */}
        {viewMode === 'rooms' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedRoom('All')}
              className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${
                selectedRoom === 'All'
                  ? 'bg-accent text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Rooms
            </button>
            {rooms.map(room => (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${
                  selectedRoom === room
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        )}

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredDevices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all border-2 ${
                device.status ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  device.status ? 'bg-accent/10' : 'bg-gray-100'
                }`}>
                  <device.icon
                    className={`h-6 w-6 ${
                      device.status ? 'text-accent' : 'text-gray-400'
                    }`}
                  />
                </div>
                <button
                  onClick={() => toggleDevice(device.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    device.status ? 'bg-accent' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: device.status ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <h3 className="text-body font-semibold text-black mb-1 tracking-tight">{device.name}</h3>
              <p className="text-body-sm text-gray-500 mb-4 font-light">{device.room}</p>
              
              {/* Temperature Control */}
              {device.value !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-headline-sm font-semibold text-black">{device.value}°F</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => adjustValue(device.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-body-sm font-medium transition-colors"
                      >
                        −
                      </button>
                      <button
                        onClick={() => adjustValue(device.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-body-sm font-medium transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-red-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((device.value - 60) / 25) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Brightness Control */}
              {device.brightness !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-body-sm text-gray-600 font-light">Brightness</span>
                    <span className="text-body-sm font-semibold text-black">{device.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={device.brightness}
                    onChange={(e) => adjustBrightness(device.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              )}

              {/* Status and Energy */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {device.status ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-body-sm font-medium ${
                    device.status ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {device.status ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-body-sm text-gray-500 font-light">
                  <Zap className="h-3 w-3" />
                  <span>{(device.energyUsage || 0).toFixed(1)}W</span>
                </div>
              </div>

              {/* Last Update */}
              {device.lastUpdate && (
                <div className="mt-2 text-xs text-gray-400 font-light">
                  Updated {device.lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Energy Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-sm font-semibold text-black tracking-tight flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                Energy Consumption
              </h3>
              <span className="text-body-sm text-gray-500 font-light">Last 20 readings</span>
            </div>
            <div className="h-48 flex items-end justify-between space-x-1">
              {energyData.length > 0 ? (
                energyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.usage / Math.max(...energyData.map(d => d.usage))) * 100}%` }}
                      className="w-full bg-gradient-to-t from-accent to-blue-400 rounded-t-lg min-h-[4px]"
                    />
                    {index % 5 === 0 && (
                      <span className="text-xs text-gray-400 mt-1 transform -rotate-45 origin-top-left">
                        {data.time}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-body-sm font-light">Collecting data...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Automations Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-sm font-semibold text-black tracking-tight flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-500" />
                Smart Automations
              </h3>
              <button
                onClick={() => setShowAutomation(!showAutomation)}
                className="text-accent text-body-sm font-light hover:opacity-70 transition-opacity"
              >
                {showAutomation ? 'Hide' : 'Show All'}
              </button>
            </div>
            <div className="space-y-3">
              {(showAutomation ? automationRules : automationRules.filter(a => a.enabled)).map((automation) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-body-sm font-semibold text-black">{automation.name}</h4>
                      {automation.enabled && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-gray-600 font-light">
                      <span className="font-medium">When:</span> {automation.trigger} → 
                      <span className="font-medium"> Then:</span> {automation.action}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAutomationRules(prev => prev.map(a => 
                        a.id === automation.id ? { ...a, enabled: !a.enabled } : a
                      ))
                      toast.success(`Automation ${automation.enabled ? 'disabled' : 'enabled'}`)
                    }}
                    className={`ml-4 px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${
                      automation.enabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {automation.enabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => executeAutomation(automation)}
                    className="ml-2 px-4 py-2 bg-accent text-white rounded-full text-body-sm font-medium hover:bg-accent-700 transition-colors"
                  >
                    Run
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security Alerts */}
        {securityAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-sm font-semibold text-black tracking-tight flex items-center">
                <Bell className="h-5 w-5 mr-2 text-red-500" />
                Security Alerts
              </h3>
              <button
                onClick={() => setSecurityAlerts([])}
                className="text-body-sm text-gray-500 font-light hover:text-gray-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2">
              {securityAlerts.slice(-5).reverse().map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-body-sm text-gray-900 font-light">{alert}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <h2 className="text-title-sm font-semibold text-black mb-4 tracking-tight">About IoT Smart Homes</h2>
          <p className="text-body text-gray-600 mb-6 font-light leading-relaxed">
            The Internet of Things (IoT) connects everyday devices to the internet, enabling remote control, 
            automation, and data collection. This simulation demonstrates real-world IoT capabilities including 
            energy monitoring, smart automation, voice control, and security systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
              <h3 className="text-body-sm font-semibold text-black mb-2">Real-Time Monitoring</h3>
              <p className="text-body-sm text-gray-600 font-light">Track energy usage, device status, and environmental data in real-time</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h3 className="text-body-sm font-semibold text-black mb-2">Smart Automation</h3>
              <p className="text-body-sm text-gray-600 font-light">Create rules that automatically control devices based on triggers</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h3 className="text-body-sm font-semibold text-black mb-2">Energy Efficiency</h3>
              <p className="text-body-sm text-gray-600 font-light">Monitor and optimize energy consumption across all devices</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
