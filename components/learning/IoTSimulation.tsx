'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wifi, Thermometer, Lightbulb, Lock, Power } from 'lucide-react'

interface Device {
  id: string
  name: string
  type: 'thermostat' | 'light' | 'lock' | 'sensor'
  status: boolean
  value?: number
  icon: typeof Thermometer
}

const initialDevices: Device[] = [
  { id: '1', name: 'Living Room Thermostat', type: 'thermostat', status: true, value: 72, icon: Thermometer },
  { id: '2', name: 'Kitchen Lights', type: 'light', status: false, icon: Lightbulb },
  { id: '3', name: 'Front Door Lock', type: 'lock', status: true, icon: Lock },
  { id: '4', name: 'Motion Sensor', type: 'sensor', status: true, icon: Wifi },
]

export default function IoTSimulation() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)

  const toggleDevice = (id: string) => {
    setDevices(devices.map((d) => (d.id === id ? { ...d, status: !d.status } : d)))
  }

  const adjustValue = (id: string, delta: number) => {
    setDevices(
      devices.map((d) =>
        d.id === id && d.value !== undefined
          ? { ...d, value: Math.max(60, Math.min(85, d.value + delta)) }
          : d
      )
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IoT Smart Home Simulation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Control and monitor connected devices in this interactive simulation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {devices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <device.icon
                  className={`h-8 w-8 ${
                    device.status ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
                <button
                  onClick={() => toggleDevice(device.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    device.status ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    animate={{ x: device.status ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 mb-2">{device.name}</h3>
              
              {device.value !== undefined && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">{device.value}°</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => adjustValue(device.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustValue(device.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className={`text-sm font-semibold ${
                  device.status ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {device.status ? 'ON' : 'OFF'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About IoT</h2>
          <p className="text-gray-600 mb-4">
            The Internet of Things (IoT) refers to the network of physical devices connected to the internet,
            enabling them to collect and exchange data. In this simulation, you can control various smart
            home devices to understand how IoT systems work.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-primary-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Connectivity</h3>
              <p className="text-sm text-gray-600">Devices communicate through wireless networks</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Automation</h3>
              <p className="text-sm text-gray-600">Devices can be controlled remotely and automatically</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-sm text-gray-600">Sensors gather information for analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

