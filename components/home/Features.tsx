'use client'

import { motion } from 'framer-motion'
import { 
  Eye, 
  Calendar, 
  Trophy, 
  GraduationCap, 
  Users, 
  Lightbulb,
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Eye,
    title: 'Interactive Virtual Tour',
    description: 'Explore our Tech Hub in 360° with clickable hotspots on cutting-edge devices.',
    href: '/tour',
  },
  {
    icon: Calendar,
    title: 'Event Calendar & Booking',
    description: 'Book school visits, RSVP to workshops, and never miss an exciting event.',
    href: '/events',
  },
  {
    icon: Trophy,
    title: 'Gamification',
    description: 'Earn badges, climb leaderboards, and complete challenges to showcase your skills.',
    href: '/leaderboard',
  },
  {
    icon: GraduationCap,
    title: 'Interactive Learning',
    description: 'AR/VR demos, IoT simulations, and quizzes to enhance your learning experience.',
    href: '/learning',
  },
  {
    icon: Users,
    title: 'Vendor Highlights',
    description: 'Meet tech experts, watch demos, and learn from industry professionals.',
    href: '/vendors',
  },
  {
    icon: Lightbulb,
    title: 'Student Spotlight',
    description: 'Share your projects, get featured, and inspire others with your creations.',
    href: '/spotlight',
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-headline-sm md:text-headline font-semibold text-black mb-4 tracking-tight">
            Core Features
          </h2>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Comprehensive technology solutions designed for educational excellence and innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="group"
            >
              <div className="mb-4">
                <feature.icon className="h-8 w-8 text-black" />
              </div>
              
              <h3 className="text-title-sm font-semibold text-black mb-2 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-body-sm text-gray-600 mb-6 font-light leading-relaxed">
                {feature.description}
              </p>
              
              <Link
                href={feature.href}
                className="inline-flex items-center text-accent text-body-sm font-light hover:opacity-70 transition-opacity duration-200"
              >
                Learn more
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

