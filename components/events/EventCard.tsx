'use client'

import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: Date
    time: string
    location: string
    capacity: number
    registered: number
    type: string
    imageUrl?: string
  }
  onBook: () => void
}

export default function EventCard({ event, onBook }: EventCardProps) {
  const availability = ((event.capacity - event.registered) / event.capacity) * 100

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-accent-400">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            <Calendar className="h-16 w-16" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700">
            {event.type.replace('_', ' ')}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Availability</span>
              <span>{event.capacity - event.registered} spots left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  availability > 50 ? 'bg-green-500' : availability > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${availability}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {event.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" />
            <span className="text-sm">{format(event.date, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="h-5 w-5 mr-2 text-primary-600 flex-shrink-0" />
            <span className="text-sm">{event.registered}/{event.capacity} registered</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBook}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Book Now
          </button>
          <Link
            href={`/events/${event.id}`}
            className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

