'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle, Calendar, Award, Users } from 'lucide-react'

interface Notification {
  id: string
  type: 'event' | 'badge' | 'booking' | 'general'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationBellProps {
  notifications?: Notification[]
  onNotificationClick?: (notification: Notification) => void
}

export default function NotificationBell({ notifications = [], onNotificationClick }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5" />
      case 'badge':
        return <Award className="h-5 w-5" />
      case 'booking':
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'event',
      title: 'New Workshop Available',
      message: 'VR Design Workshop starts in 2 days',
      timestamp: new Date(),
      read: false,
      actionUrl: '/events/1',
    },
    {
      id: '2',
      type: 'badge',
      title: 'Badge Earned!',
      message: 'You earned the "VR Explorer" badge',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      actionUrl: '/leaderboard',
    },
  ]

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-accent text-white rounded-full text-xs font-semibold flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-title-sm font-semibold text-black">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[400px]">
                {displayNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-body-sm font-light">No notifications</p>
                  </div>
                ) : (
                  displayNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onNotificationClick?.(notification)
                        setIsOpen(false)
                      }}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-accent/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'event' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'badge' ? 'bg-yellow-100 text-yellow-600' :
                          notification.type === 'booking' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </p>
                          <p className="text-body-sm text-gray-600 font-light mb-2">
                            {notification.message}
                          </p>
                          <p className="text-body-sm text-gray-400 font-light">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

