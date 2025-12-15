'use client'

import { motion } from 'framer-motion'
import { Users, Video, Calendar, Award, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

// Mock data - will be replaced with API call
const vendors = [
  {
    id: '1',
    name: 'Roger Chung',
    company: 'Tech Innovations Inc.',
    bio: 'Expert in AR/VR development with 15+ years of experience. Creator of award-winning educational VR applications.',
    expertise: 'AR/VR Development, Spatial Computing',
    imageUrl: '/api/placeholder/300/300',
    videoUrl: '/api/placeholder/video',
    upcomingEvents: [
      { id: '1', title: 'VR Design Workshop', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: '2',
    name: 'Rene Rochford',
    company: 'Drone Dynamics',
    bio: 'Professional drone pilot and aerial photographer. Specializes in educational drone programs for schools.',
    expertise: 'Drone Technology, Aerial Photography',
    imageUrl: '/api/placeholder/300/300',
    videoUrl: '/api/placeholder/video',
    upcomingEvents: [
      { id: '2', title: 'Drone Pilot Training', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: '3',
    name: 'Felix Pitt',
    company: '3D Print Solutions',
    bio: '3D printing specialist and maker space coordinator. Passionate about bringing student designs to life.',
    expertise: '3D Printing, Rapid Prototyping',
    imageUrl: '/api/placeholder/300/300',
    videoUrl: '/api/placeholder/video',
    upcomingEvents: [
      { id: '3', title: '3D Printing Masterclass', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    ],
  },
]

export default function VendorsPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 text-primary-600 font-semibold mb-4">
            <Users className="h-5 w-5" />
            <span>Guest Experts</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Tech Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn from industry professionals and discover cutting-edge technology
          </p>
        </motion.div>

        <div className="space-y-12">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                <div className="md:col-span-1">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400">
                    {vendor.imageUrl ? (
                      <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <Users className="h-24 w-24" />
                      </div>
                    )}
                  </div>
                  
                  {vendor.videoUrl && (
                    <button className="mt-4 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                      <Video className="h-5 w-5" />
                      <span>Watch Introduction</span>
                    </button>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{vendor.name}</h2>
                    <p className="text-lg text-primary-600 font-semibold mb-4">{vendor.company}</p>
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{vendor.expertise}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{vendor.bio}</p>

                  {vendor.upcomingEvents.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                        Upcoming Sessions
                      </h3>
                      <div className="space-y-3">
                        {vendor.upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">{event.title}</p>
                              <p className="text-sm text-gray-600">
                                {format(event.date, 'MMMM d, yyyy')}
                              </p>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 font-semibold flex items-center">
                              RSVP
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today at Tech Hub Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-2xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Today at Tech Hub</h2>
          <p className="text-lg mb-6 opacity-90">
            Check out what's happening live or watch recordings of recent events
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Live VR Demo', 'Drone Showcase', '3D Printing Workshop'].map((event, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Video className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">{event}</h3>
                <p className="text-sm opacity-80">Watch Now →</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

