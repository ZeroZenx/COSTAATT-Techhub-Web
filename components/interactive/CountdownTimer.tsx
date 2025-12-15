'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: Date
  onComplete?: () => void
  label?: string
}

export default function CountdownTimer({ targetDate, onComplete, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          expired: false,
        }
      } else {
        if (onComplete) onComplete()
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        }
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (timeLeft.expired) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <Clock className="h-4 w-4" />
        <span className="text-body-sm font-light">Event has started</span>
      </div>
    )
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      key={`${label}-${value}`}
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <div className="bg-gray-100 rounded-lg px-4 py-2 min-w-[60px]">
        <span className="text-headline-sm font-semibold text-black tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-body-sm text-gray-500 mt-1 font-light">{label}</span>
    </motion.div>
  )

  return (
    <div className="flex flex-col items-start">
      {label && (
        <div className="flex items-center space-x-2 mb-3 text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="text-body-sm font-light">{label}</span>
        </div>
      )}
      <div className="flex items-center space-x-3">
        {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label="Days" />}
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}

