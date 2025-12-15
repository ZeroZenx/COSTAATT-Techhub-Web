'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react'
import { format } from 'date-fns'

// Mock data - will be replaced with API call
const upcomingEvents = [
  {
    id: '1',
    title: 'VR Design Workshop',
    description: 'Learn to create immersive VR experiences using Apple Vision Pro',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '10:00 AM',
    location: 'Tech Hub - VR Lab',
    capacity: 20,
    registered: 15,
    type: 'WORKSHOP',
  },
  {
    id: '2',
    title: 'Drone Pilot Training',
    description: 'Master drone flying techniques and aerial photography',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '2:00 PM',
    location: 'Tech Hub - Outdoor Space',
    capacity: 15,
    registered: 8,
    type: 'DEMO',
  },
  {
    id: '3',
    title: '3D Printing Masterclass',
    description: 'From design to print: Create your own 3D models',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '11:00 AM',
    location: 'Tech Hub - Maker Lab',
    capacity: 25,
    registered: 22,
    type: 'WORKSHOP',
  },
]

export default function UpcomingEvents() {
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

