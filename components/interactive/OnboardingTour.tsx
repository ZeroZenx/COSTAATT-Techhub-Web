'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

interface TourStep {
  id: string
  target: string // CSS selector
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTourProps {
  steps: TourStep[]
  onComplete: () => void
  onSkip: () => void
}

export default function OnboardingTour({ steps, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const step = steps[currentStep]
    if (step) {
      const element = document.querySelector(step.target) as HTMLElement
      setTargetElement(element)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.style.zIndex = '9998'
        element.style.position = 'relative'
      }
    }
  }, [currentStep, steps])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (steps.length === 0 || !targetElement) return null

  const step = steps[currentStep]
  const position = step.position || 'bottom'

  const getPositionStyles = () => {
    const rect = targetElement.getBoundingClientRect()
    const gap = 20

    switch (position) {
      case 'top':
        return {
          bottom: window.innerHeight - rect.top + gap,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
        }
      case 'bottom':
        return {
          top: rect.bottom + gap,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
        }
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + gap,
          transform: 'translateY(-50%)',
        }
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + gap,
          transform: 'translateY(-50%)',
        }
    }
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997]"
        onClick={onSkip}
      />

      {/* Highlight */}
      {targetElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[9998] pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
            border: '2px solid #0071e3',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-[9999] bg-white rounded-2xl shadow-2xl p-6 max-w-sm"
        style={getPositionStyles()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-body-sm text-gray-500 font-light mb-1">
              Step {currentStep + 1} of {steps.length}
            </p>
            <h3 className="text-title-sm font-semibold text-black tracking-tight">
              {step.title}
            </h3>
          </div>
          <button
            onClick={onSkip}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <p className="text-body-sm text-gray-600 font-light mb-6">
          {step.content}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-body-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-accent'
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-full text-body-sm font-medium hover:bg-accent-700 transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </>
  )
}

