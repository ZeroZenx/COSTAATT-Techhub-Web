'use client'

import { motion } from 'framer-motion'
import { Users, Calendar, Award, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

const stats = [
  { icon: Users, label: 'Active Students', value: 1250, suffix: '+' },
  { icon: Calendar, label: 'Events This Month', value: 24, suffix: '+' },
  { icon: Award, label: 'Badges Earned', value: 3420, suffix: '+' },
  { icon: Sparkles, label: 'Projects Shared', value: 890, suffix: '+' },
]

export default function Stats() {
  const [counted, setCounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setCounted(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <div className="text-headline-sm font-semibold text-black mb-2 tracking-tight">
                {counted ? (
                  <CountUp end={stat.value} />
                ) : (
                  '0'
                )}
                {stat.suffix}
              </div>
              <div className="text-body-sm text-gray-600 font-light">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ end }: { end: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [end])

  return <>{count}</>
}

