'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sparkles, User, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationBell from '@/components/interactive/NotificationBell'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Virtual Tour', href: '/tour' },
  { name: 'Events', href: '/events' },
  { name: 'Learning', href: '/learning' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Leaderboard', href: '/leaderboard' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-12">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-lg font-medium text-black tracking-tight">
              COSTAATT Tech Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-black text-body-sm font-light transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <NotificationBell />
            <Link
              href="/login"
              className="text-accent hover:text-accent-700 text-body-sm font-light transition-colors duration-200"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-fit"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

