'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  Award, 
  FileText, 
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'

const tabs = [
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'submissions', label: 'Submissions', icon: FileText },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'badges', label: 'Badges', icon: Award },
]

// Mock data - will be replaced with API calls
const mockBookings = [
  { id: '1', school: 'Lincoln High', date: '2024-01-15', time: '10:00 AM', students: 25, status: 'PENDING' },
  { id: '2', school: 'Tech Academy', date: '2024-01-16', time: '2:00 PM', students: 20, status: 'CONFIRMED' },
]

const mockSubmissions = [
  { id: '1', student: 'Maria Rodriguez', title: 'VR Art Gallery', type: 'VR_SKETCH', status: 'PENDING', featured: false },
  { id: '2', student: 'Carlos Mendez', title: 'Smart Home IoT', type: 'AI_DEMO', status: 'APPROVED', featured: true },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings')

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings, events, submissions, and more</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === 'bookings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="h-4 w-4" />
                  <span>New Booking</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">School</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Students</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{booking.school}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.students}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-primary-600 hover:bg-primary-50 rounded">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
              </div>
              
              <div className="space-y-4">
                {mockSubmissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{submission.title}</h3>
                        <p className="text-sm text-gray-600">{submission.student} • {submission.type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status}
                        </span>
                        {submission.featured && (
                          <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        )}
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
              </div>
              <p className="text-gray-600">Event management interface coming soon...</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Users</h2>
              <p className="text-gray-600">User management interface coming soon...</p>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Badges</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Plus className="h-4 w-4" />
                  <span>Create Badge</span>
                </button>
              </div>
              <p className="text-gray-600">Badge management interface coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

