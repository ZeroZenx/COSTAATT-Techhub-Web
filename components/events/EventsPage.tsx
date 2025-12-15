'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Filter, Search } from 'lucide-react'
import { format } from 'date-fns'
import CalendarView from './CalendarView'
import EventCard from './EventCard'
import BookingModal from './BookingModal'

// Mock data - will be replaced with API call
const events = [
  {
    id: '1',
    title: 'VR Design Workshop',
    description: 'Learn to create immersive VR experiences using Apple Vision Pro',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '10:00 AM - 12:00 PM',
    location: 'Tech Hub - VR Lab',
    capacity: 20,
    registered: 15,
    type: 'WORKSHOP',
    imageUrl: '/api/placeholder/400/300',
  },
  {
    id: '2',
    title: 'Drone Pilot Training',
    description: 'Master drone flying techniques and aerial photography',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '2:00 PM - 4:00 PM',
    location: 'Tech Hub - Outdoor Space',
    capacity: 15,
    registered: 8,
    type: 'DEMO',
    imageUrl: '/api/placeholder/400/300',
  },
  {
    id: '3',
    title: '3D Printing Masterclass',
    description: 'From design to print: Create your own 3D models',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '11:00 AM - 1:00 PM',
    location: 'Tech Hub - Maker Lab',
    capacity: 25,
    registered: 22,
    type: 'WORKSHOP',
    imageUrl: '/api/placeholder/400/300',
  },
  {
    id: '4',
    title: 'IoT Smart Home Demo',
    description: 'Explore connected devices and automation systems',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: '3:00 PM - 5:00 PM',
    location: 'Tech Hub - IoT Lab',
    capacity: 30,
    registered: 12,
    type: 'DEMO',
    imageUrl: '/api/placeholder/400/300',
  },
]

export default function EventsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)

  const filteredEvents = events.filter((event) => {
    const matchesFilter = filter === 'all' || event.type === filter
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Events & Bookings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book your visit, RSVP to workshops, and join exciting tech sessions
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* View Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'calendar'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Calendar View
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 flex-wrap">
            <Filter className="h-5 w-5 text-gray-600" />
            {['all', 'WORKSHOP', 'DEMO', 'TOUR', 'VENDOR_SESSION'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'All Events' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {view === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} onBook={() => setSelectedEvent(event)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <CalendarView events={filteredEvents} onEventClick={setSelectedEvent} />
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}

