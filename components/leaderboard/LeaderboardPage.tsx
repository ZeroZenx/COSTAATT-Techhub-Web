'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Award, Medal, Star, Filter } from 'lucide-react'

// Mock data - will be replaced with API call
const leaderboardData = [
  { rank: 1, name: 'Emma Headley', school: 'Providence', points: 1250, badges: 12, avatar: '/api/placeholder/50/50' },
  { rank: 2, name: 'Datrice Headley', school: 'St Joseph Convent', points: 1180, badges: 11, avatar: '/api/placeholder/50/50' },
  { rank: 3, name: 'Melissa Headley', school: 'Fatima College', points: 1100, badges: 10, avatar: '/api/placeholder/50/50' },
  { rank: 4, name: 'Grason Rochford', school: 'Providence', points: 980, badges: 9, avatar: '/api/placeholder/50/50' },
  { rank: 5, name: 'Emma Wilson', school: 'St Joseph Convent', points: 920, badges: 8, avatar: '/api/placeholder/50/50' },
  { rank: 6, name: 'David Lee', school: 'Fatima College', points: 850, badges: 7, avatar: '/api/placeholder/50/50' },
  { rank: 7, name: 'Luna Martinez', school: 'Providence', points: 780, badges: 6, avatar: '/api/placeholder/50/50' },
  { rank: 8, name: 'Noah Brown', school: 'St Joseph Convent', points: 720, badges: 6, avatar: '/api/placeholder/50/50' },
]

const schoolLeaderboard = [
  { rank: 1, school: 'Providence', totalPoints: 3010, students: 45 },
  { rank: 2, school: 'St Joseph Convent', totalPoints: 2880, students: 38 },
  { rank: 3, school: 'Fatima College', totalPoints: 2750, students: 42 },
]

const badges = [
  { id: '1', name: 'VR Explorer', description: 'Completed VR tour', icon: '🎮', category: 'EXPLORER' },
  { id: '2', name: 'Drone Pilot', description: 'Mastered drone basics', icon: '🚁', category: 'CREATOR' },
  { id: '3', name: '3D Designer', description: 'Created 3D model', icon: '🎨', category: 'CREATOR' },
  { id: '4', name: 'IoT Innovator', description: 'Built IoT project', icon: '💡', category: 'INNOVATOR' },
  { id: '5', name: 'Quiz Master', description: 'Scored 100% on quiz', icon: '🧠', category: 'EXPERT' },
]

export default function LeaderboardPage() {
  const [view, setView] = useState<'individual' | 'school'>('individual')
  const [badgeFilter, setBadgeFilter] = useState<string>('all')

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-orange-500" />
    return <span className="text-gray-400 font-bold">#{rank}</span>
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 text-primary-600 font-semibold mb-4">
            <Trophy className="h-5 w-5" />
            <span>Gamification</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Leaderboard & Achievements
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compete with peers, earn badges, and climb the ranks!
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setView('individual')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                view === 'individual'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setView('school')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                view === 'school'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Schools
            </button>
          </div>
        </div>

        {/* Individual Leaderboard */}
        {view === 'individual' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Top Performers</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {leaderboardData.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
                        entry.rank <= 3 ? 'bg-gradient-to-r from-primary-50 to-transparent' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-12 flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                          {entry.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900">{entry.name}</p>
                        <p className="text-sm text-gray-600">{entry.school}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">{entry.points.toLocaleString()} pts</p>
                        <p className="text-sm text-gray-600">{entry.badges} badges</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary-600" />
                  Available Badges
                </h3>
                <div className="space-y-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{badge.name}</p>
                          <p className="text-xs text-gray-600">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* School Leaderboard */}
        {view === 'school' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">School Rankings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {schoolLeaderboard.map((school, index) => (
                <motion.div
                  key={school.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    school.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0 w-16 flex items-center justify-center">
                      {getRankIcon(school.rank)}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{school.school}</p>
                      <p className="text-sm text-gray-600">{school.students} active students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {school.totalPoints.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">total points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

