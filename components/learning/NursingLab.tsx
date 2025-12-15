'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Stethoscope, 
  Activity,
  Syringe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Award,
  User,
  Thermometer,
  Droplet,
  Eye,
  Ear,
  Hand,
  Brain,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Wind
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Simulation {
  id: string
  name: string
  description: string
  scenario: string
  patientAge: number
  patientGender: string
  chiefComplaint: string
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenSat: number
    respiratoryRate: number
    bloodGlucose?: number
  }
  symptoms: string[]
  correctActions: string[]
  incorrectActions: string[]
  medications?: { name: string; dosage: string; route: string }[]
  allergies?: string[]
}

const simulations: Simulation[] = [
  {
    id: 'vital-signs',
    name: 'Vital Signs Assessment',
    description: 'Practice taking and interpreting vital signs with real-time monitoring',
    scenario: 'Patient presents with complaints of dizziness and fatigue. Perform comprehensive vital signs assessment.',
    patientAge: 45,
    patientGender: 'Male',
    chiefComplaint: 'Dizziness and fatigue for 2 days',
    vitals: {
      heartRate: 95,
      bloodPressure: '140/90',
      temperature: 38.2,
      oxygenSat: 96,
      respiratoryRate: 20,
      bloodGlucose: 110
    },
    symptoms: ['Dizziness', 'Fatigue', 'Elevated temperature', 'High blood pressure', 'Mild dehydration'],
    correctActions: [
      'Wash hands',
      'Introduce yourself to patient',
      'Take blood pressure',
      'Measure heart rate',
      'Check temperature',
      'Assess oxygen saturation',
      'Count respiratory rate',
      'Check blood glucose',
      'Document findings',
      'Report abnormal values'
    ],
    incorrectActions: [
      'Administer medication without assessment',
      'Ignore elevated vitals',
      'Skip hand hygiene',
      'Document without verification'
    ],
    allergies: ['Penicillin']
  },
  {
    id: 'wound-care',
    name: 'Wound Care & Dressing',
    description: 'Learn proper wound care and sterile dressing techniques',
    scenario: 'Post-operative patient with a clean surgical incision requiring dressing change. Follow sterile technique.',
    patientAge: 32,
    patientGender: 'Female',
    chiefComplaint: 'Surgical incision site',
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 36.8,
      oxygenSat: 98,
      respiratoryRate: 16
    },
    symptoms: ['Surgical incision', 'No signs of infection', 'Healing well', 'Minimal drainage'],
    correctActions: [
      'Wash hands',
      'Put on sterile gloves',
      'Remove old dressing carefully',
      'Assess wound appearance',
      'Check for signs of infection',
      'Clean wound with saline',
      'Apply antiseptic if needed',
      'Apply new sterile dressing',
      'Secure dressing properly',
      'Document procedure and findings'
    ],
    incorrectActions: [
      'Touch wound with bare hands',
      'Reuse old dressing',
      'Skip hand hygiene',
      'Apply contaminated materials'
    ]
  },
  {
    id: 'medication-admin',
    name: 'Medication Administration',
    description: 'Practice safe medication administration following the 5 rights',
    scenario: 'Patient needs scheduled medication. Verify patient identity and follow medication safety protocols.',
    patientAge: 58,
    patientGender: 'Female',
    chiefComplaint: 'Routine medication administration',
    vitals: {
      heartRate: 78,
      bloodPressure: '118/75',
      temperature: 37.0,
      oxygenSat: 99,
      respiratoryRate: 18
    },
    symptoms: ['Stable condition', 'No acute distress', 'Scheduled medication due'],
    correctActions: [
      'Wash hands',
      'Verify patient identity (name & DOB)',
      'Check medication order',
      'Verify medication name',
      'Check dosage',
      'Verify route of administration',
      'Check expiration date',
      'Verify allergies',
      'Explain medication to patient',
      'Administer medication',
      'Monitor for adverse effects',
      'Document administration'
    ],
    incorrectActions: [
      'Administer without verification',
      'Skip patient identification',
      'Ignore allergies',
      'Wrong dosage',
      'Wrong route'
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', route: 'Oral' },
      { name: 'Lisinopril', dosage: '10mg', route: 'Oral' }
    ],
    allergies: ['Sulfa drugs']
  },
  {
    id: 'cardiac-monitoring',
    name: 'Cardiac Monitoring & ECG',
    description: 'Monitor cardiac rhythms and interpret ECG readings',
    scenario: 'Patient on cardiac monitor showing irregular rhythm. Assess and interpret cardiac status.',
    patientAge: 67,
    patientGender: 'Male',
    chiefComplaint: 'Chest discomfort and palpitations',
    vitals: {
      heartRate: 88,
      bloodPressure: '135/85',
      temperature: 36.9,
      oxygenSat: 97,
      respiratoryRate: 22
    },
    symptoms: ['Irregular pulse', 'Chest discomfort', 'Palpitations', 'Mild shortness of breath'],
    correctActions: [
      'Assess patient condition',
      'Check cardiac monitor',
      'Interpret ECG rhythm',
      'Measure heart rate',
      'Check blood pressure',
      'Assess oxygen saturation',
      'Auscultate heart sounds',
      'Check peripheral pulses',
      'Document findings',
      'Notify physician if abnormal'
    ],
    incorrectActions: [
      'Ignore irregular rhythm',
      'Skip cardiac assessment',
      'Document without verification'
    ]
  }
]

export default function NursingLab() {
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null)
  const [completedActions, setCompletedActions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [vitalsVisible, setVitalsVisible] = useState(false)
  const [patientCondition, setPatientCondition] = useState<'stable' | 'improving' | 'declining'>('stable')
  const [ecgVisible, setEcgVisible] = useState(false)
  const [heartRate, setHeartRate] = useState(0)

  const simulation = simulations.find(s => s.id === selectedSimulation)

  // Simulate real-time heart rate
  useEffect(() => {
    if (!simulation || !vitalsVisible) return
    
    const interval = setInterval(() => {
      const baseRate = simulation.vitals.heartRate
      const variation = Math.floor(Math.random() * 10) - 5
      setHeartRate(Math.max(60, Math.min(120, baseRate + variation)))
    }, 1000)

    return () => clearInterval(interval)
  }, [simulation, vitalsVisible])

  const handleAction = (action: string) => {
    if (completedActions.includes(action)) {
      toast.error('Action already completed')
      return
    }

    const isCorrect = simulation!.correctActions.includes(action)
    
    if (isCorrect) {
      setCompletedActions([...completedActions, action])
      setScore(score + 15)
      toast.success('Correct action!', { icon: '✓' })
      
      // Show vitals after taking vital signs
      if (action.includes('blood pressure') || action.includes('heart rate') || action.includes('temperature') || action.includes('oxygen')) {
        setVitalsVisible(true)
      }

      // Show ECG for cardiac monitoring
      if (action.includes('cardiac monitor') || action.includes('ECG')) {
        setEcgVisible(true)
      }

      // Update patient condition based on actions
      if (completedActions.length + 1 > simulation!.correctActions.length * 0.7) {
        setPatientCondition('improving')
      }
      
      // Check if all correct actions completed
      if (completedActions.length + 1 === simulation!.correctActions.length) {
        setTimeout(() => {
          setShowResults(true)
          toast.success('Simulation complete!', { icon: '🎉' })
        }, 500)
      }
    } else {
      setScore(Math.max(0, score - 5))
      toast.error('Incorrect action. Review procedures.', { icon: '⚠️' })
      if (simulation!.incorrectActions.includes(action)) {
        setPatientCondition('declining')
        setTimeout(() => setPatientCondition('stable'), 2000)
      }
    }
  }

  const handleReset = () => {
    setCompletedActions([])
    setScore(0)
    setShowResults(false)
    setVitalsVisible(false)
    setPatientCondition('stable')
    setEcgVisible(false)
    setHeartRate(0)
  }

  if (selectedSimulation && simulation) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedSimulation(null)}
              className="text-accent hover:text-accent-700 font-medium flex items-center"
            >
              ← Back to Nursing Lab
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Score: <span className="font-bold text-accent">{score}</span>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Info & Virtual Patient */}
            <div className="lg:col-span-1 space-y-6">
              {/* Virtual Patient */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <User className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">Virtual Patient</h2>
                    <p className="text-xs text-gray-600 font-light">
                      {simulation.patientAge} year old {simulation.patientGender}
                    </p>
                  </div>
                </div>

                {/* Animated Patient Avatar */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-4 aspect-square flex items-center justify-center relative overflow-hidden">
                  {/* Patient Status Indicator */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    patientCondition === 'improving' ? 'bg-green-500 text-white' :
                    patientCondition === 'declining' ? 'bg-red-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {patientCondition === 'improving' ? '✓ Improving' :
                     patientCondition === 'declining' ? '⚠ Attention' :
                     'Stable'}
                  </div>

                  {/* Animated Heart */}
                  {vitalsVisible && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 60 / simulation.vitals.heartRate }}
                      className="absolute"
                    >
                      <Heart className="h-16 w-16 text-red-500" fill="currentColor" />
                    </motion.div>
                  )}

                  {/* Patient Body Representation */}
                  <div className="relative z-10 text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 font-light">
                      {simulation.chiefComplaint}
                    </p>
                  </div>

                  {/* Breathing Animation */}
                  {vitalsVisible && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 60 / simulation.vitals.respiratoryRate }}
                      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    >
                      <Wind className="h-8 w-8 text-blue-400" />
                    </motion.div>
                  )}
                </div>

                {/* Patient Info */}
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-black">Chief Complaint:</span>
                    <p className="text-gray-600 font-light">{simulation.chiefComplaint}</p>
                  </div>
                  {simulation.allergies && simulation.allergies.length > 0 && (
                    <div>
                      <span className="font-semibold text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Allergies:
                      </span>
                      <p className="text-gray-600 font-light">{simulation.allergies.join(', ')}</p>
                    </div>
                  )}
                  {simulation.medications && simulation.medications.length > 0 && (
                    <div>
                      <span className="font-semibold text-black">Medications:</span>
                      <ul className="text-gray-600 font-light space-y-1 mt-1">
                        {simulation.medications.map((med, i) => (
                          <li key={i} className="text-xs">
                            {med.name} {med.dosage} ({med.route})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* 3D Heart Model */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-title-sm font-semibold text-black">3D Heart Model</h2>
                    <p className="text-xs text-gray-600 font-light">
                      Interactive anatomical visualization
                    </p>
                  </div>
                </div>
                
                <div className="sketchfab-embed-wrapper rounded-xl overflow-hidden" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                  <iframe
                    title="Heart"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/40973a6b8f6d485c8d78e536ac2ec168/embed"
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
                    href="https://sketchfab.com/3d-models/heart-40973a6b8f6d485c8d78e536ac2ec168?utm_medium=embed&utm_campaign=share-popup&utm_content=40973a6b8f6d485c8d78e536ac2ec168"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Heart
                  </a>
                  {' by '}
                  <a
                    href="https://sketchfab.com/Sohila.Lotfy?utm_medium=embed&utm_campaign=share-popup&utm_content=40973a6b8f6d485c8d78e536ac2ec168"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    BrainStation
                  </a>
                  {' on '}
                  <a
                    href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=40973a6b8f6d485c8d78e536ac2ec168"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9', textDecoration: 'none' }}
                  >
                    Sketchfab
                  </a>
                </p>
              </div>

              {/* Vitals Monitor */}
              {vitalsVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 rounded-xl p-6 border-2 border-green-500"
                >
                  <h3 className="text-white text-sm font-semibold mb-4 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-green-400" />
                    Vital Signs Monitor
                  </h3>
                  <div className="space-y-3">
                    {/* Heart Rate */}
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400 font-light">Heart Rate</span>
                        <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-red-400">{heartRate || simulation.vitals.heartRate}</span>
                        <span className="text-xs text-gray-500">bpm</span>
                      </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400 font-light">Blood Pressure</span>
                        <Droplet className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-blue-400">{simulation.vitals.bloodPressure}</span>
                        <span className="text-xs text-gray-500">mmHg</span>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400 font-light">Temperature</span>
                        <Thermometer className="h-4 w-4 text-orange-400" />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-orange-400">{simulation.vitals.temperature}</span>
                        <span className="text-xs text-gray-500">°C</span>
                      </div>
                    </div>

                    {/* Oxygen Saturation */}
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400 font-light">O₂ Saturation</span>
                        <Wind className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-green-400">{simulation.vitals.oxygenSat}</span>
                        <span className="text-xs text-gray-500">%</span>
                      </div>
                    </div>

                    {/* Respiratory Rate */}
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400 font-light">Respiratory Rate</span>
                        <Wind className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-cyan-400">{simulation.vitals.respiratoryRate}</span>
                        <span className="text-xs text-gray-500">/min</span>
                      </div>
                    </div>

                    {/* Blood Glucose (if available) */}
                    {simulation.vitals.bloodGlucose && (
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 font-light">Blood Glucose</span>
                          <Activity className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-purple-400">{simulation.vitals.bloodGlucose}</span>
                          <span className="text-xs text-gray-500">mg/dL</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ECG Monitor */}
              {ecgVisible && simulation.id === 'cardiac-monitoring' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 rounded-xl p-6 border-2 border-blue-500"
                >
                  <h3 className="text-white text-sm font-semibold mb-4 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-400" />
                    ECG Monitor
                  </h3>
                  <div className="bg-black rounded-lg p-4 h-32 relative overflow-hidden">
                    <ECGWaveform heartRate={heartRate || simulation.vitals.heartRate} />
                    <div className="absolute bottom-2 left-4 text-green-400 text-xs font-mono">
                      Lead II
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400 font-light">
                    Rhythm: Sinus rhythm with occasional PVCs
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h3 className="text-title-sm font-semibold text-black mb-6">Required Actions</h3>
                
                <div className="space-y-3 mb-6">
                  {simulation.correctActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleAction(action)}
                      disabled={completedActions.includes(action)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        completedActions.includes(action)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-accent hover:bg-accent/5'
                      } disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            completedActions.includes(action)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {completedActions.includes(action) ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <span className={`text-body-sm font-medium ${
                            completedActions.includes(action) ? 'text-green-700' : 'text-black'
                          }`}>
                            {action}
                          </span>
                        </div>
                        {completedActions.includes(action) && (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Progress */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-body-sm font-medium text-gray-900">Progress</span>
                    <span className="text-body-sm text-gray-600 font-light">
                      {completedActions.length}/{simulation.correctActions.length} actions
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-accent h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedActions.length / simulation.correctActions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Medical Equipment Panel */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h3 className="text-title-sm font-semibold text-black mb-4">Medical Equipment</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Stethoscope, name: 'Stethoscope', action: 'Auscultate heart sounds' },
                    { icon: Thermometer, name: 'Thermometer', action: 'Check temperature' },
                    { icon: Activity, name: 'Pulse Oximeter', action: 'Assess oxygen saturation' },
                    { icon: Syringe, name: 'Syringe', action: 'Administer medication' },
                    { icon: Eye, name: 'Penlight', action: 'Check pupil response' },
                    { icon: Hand, name: 'BP Cuff', action: 'Measure blood pressure' },
                    { icon: Activity, name: 'ECG Monitor', action: 'Monitor cardiac rhythm' },
                    { icon: Shield, name: 'Gloves', action: 'Use sterile technique' }
                  ].map((equipment, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-accent cursor-pointer text-center"
                    >
                      <equipment.icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="text-xs text-gray-700 font-medium">{equipment.name}</p>
                    </motion.div>
                  ))}
                </div>
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
                      <Award className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-title-sm font-semibold text-black mb-2">Simulation Complete!</h3>
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
    <div className="min-h-screen pt-16 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            Nursing Lab Simulation
          </h1>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Practice clinical skills, vital signs assessment, and patient care procedures with virtual patients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {simulations.map((sim, index) => (
            <motion.div
              key={sim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedSimulation(sim.id)
                setCompletedActions([])
                setScore(0)
                setVitalsVisible(false)
                setPatientCondition('stable')
                setEcgVisible(false)
              }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center relative">
                <Stethoscope className="h-16 w-16 text-white/90 group-hover:scale-110 transition-transform" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
                  {sim.patientAge}yo
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-title-sm font-semibold text-black mb-2">{sim.name}</h3>
                <p className="text-body-sm text-gray-600 mb-4 font-light">{sim.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="font-light">{sim.correctActions.length} steps</span>
                  <span className="font-light">Virtual patient</span>
                </div>

                <div className="flex items-center text-accent text-body-sm font-light group-hover:opacity-70 transition-opacity">
                  <Play className="h-4 w-4 mr-2" />
                  <span>Start Simulation</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ECG Waveform Component
function ECGWaveform({ heartRate }: { heartRate: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 600
    canvas.height = 100

    const drawECG = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 2
      ctx.beginPath()

      const centerY = canvas.height / 2
      const samplesPerSecond = 250
      const duration = 3 // seconds
      const totalSamples = samplesPerSecond * duration

      for (let i = 0; i < totalSamples; i++) {
        const x = (i / totalSamples) * canvas.width
        const t = (i / samplesPerSecond) + time
        const y = centerY + Math.sin(t * heartRate * 0.1) * 20 + 
                  Math.sin(t * heartRate * 0.3) * 5 +
                  Math.sin(t * heartRate * 0.05) * 10

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
    }

    drawECG()
    const interval = setInterval(() => {
      setTime(prev => prev + 0.1)
      drawECG()
    }, 100)

    return () => clearInterval(interval)
  }, [heartRate, time])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
