'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react'
import { format } from 'date-fns'
import CountdownTimer from '@/components/interactive/CountdownTimer'

interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  maxCapacity: number
  currentCapacity: number
  type: string
}

interface UpcomingEventsProps {
  events?: Event[]
}

export default function UpcomingEvents({ events: propEvents }: UpcomingEventsProps) {
  // Fallback to mock data if no events provided
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'VR Design Workshop',
      description: 'Learn to create immersive VR experiences using Apple Vision Pro',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Tech Hub - VR Lab',
      maxCapacity: 20,
      currentCapacity: 15,
      type: 'WORKSHOP',
    },
    {
      id: '2',
      title: 'Drone Pilot Training',
      description: 'Master drone flying techniques and aerial photography',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Tech Hub - Outdoor Space',
      maxCapacity: 15,
      currentCapacity: 8,
      type: 'DEMO',
    },
    {
      id: '3',
      title: '3D Printing Masterclass',
      description: 'From design to print: Create your own 3D models',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Tech Hub - Maker Lab',
      maxCapacity: 25,
      currentCapacity: 22,
      type: 'WORKSHOP',
    },
  ]

  const upcomingEvents = propEvents && propEvents.length > 0 
    ? propEvents.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.startDate,
        time: format(e.startDate, 'h:mm a'),
        location: e.location,
        capacity: e.maxCapacity,
        registered: e.currentCapacity,
        type: e.type,
      }))
    : mockEvents.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.startDate,
        time: format(e.startDate, 'h:mm a'),
        location: e.location,
        capacity: e.maxCapacity,
        registered: e.currentCapacity,
        type: e.type,
      }))
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
            Upcoming Events
          </h2>
          <p className="text-title-sm text-gray-600 max-w-xl mx-auto font-light">
            Register for workshops, demonstrations, and educational sessions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-2xl overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-title-sm font-semibold text-black mb-2 tracking-tight">
                  {event.title}
                </h3>
                
                <p className="text-body-sm text-gray-600 mb-6 font-light">
                  {event.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-600 text-body-sm font-light">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{format(event.date, 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-body-sm font-light">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-body-sm font-light">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center text-accent text-body-sm font-light hover:opacity-70 transition-opacity"
                >
                  RSVP Now
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center text-accent text-body font-light hover:opacity-70 transition-opacity"
          >
            View All Events
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

