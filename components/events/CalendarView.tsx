'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import { format } from 'date-fns'
import 'react-calendar/dist/Calendar.css'
import { motion } from 'framer-motion'

interface CalendarViewProps {
  events: Array<{
    id: string
    title: string
    date: Date
    type: string
  }>
  onEventClick: (event: any) => void
}

export default function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const eventsOnDate = events.filter((event) => {
    return format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  })

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayEvents = events.filter((e) => format(e.date, 'yyyy-MM-dd') === dateStr)
    
    if (dayEvents.length > 0) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full" />
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            tileContent={tileContent}
            className="w-full border-0"
            tileClassName="hover:bg-primary-50 transition-colors"
          />
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {eventsOnDate.length > 0 ? (
            <div className="space-y-3">
              {eventsOnDate.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onEventClick(event)}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-l-4 border-primary-600"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.type.replace('_', ' ')}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events scheduled for this date.</p>
          )}
        </div>
      </div>
    </div>
  )
}

