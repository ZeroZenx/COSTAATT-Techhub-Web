'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h1 className="text-headline-sm font-semibold text-black mb-2 tracking-tight">
          Something went wrong
        </h1>
        <p className="text-body text-gray-600 mb-8 font-light">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-2.5 bg-accent text-white rounded-full text-body font-medium hover:bg-accent-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full text-body font-medium hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

