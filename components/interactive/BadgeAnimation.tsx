'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Award, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BadgeAnimationProps {
  badge: {
    name: string
    description: string
    icon: string
  }
  onClose: () => void
}

export default function BadgeAnimation({ badge, onClose }: BadgeAnimationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 500)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                  repeatDelay: 0.3,
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-accent rounded-full mb-6"
              >
                <Award className="h-12 w-12 text-white" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-headline-sm font-semibold text-black mb-2 tracking-tight"
              >
                Badge Unlocked!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-title-sm font-semibold text-accent mb-2"
              >
                {badge.name}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-body-sm text-gray-600 font-light"
              >
                {badge.description}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

