'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-accent text-white rounded-full text-body font-medium hover:bg-accent-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full text-body font-medium hover:bg-gray-50 transition-colors"
              >
                Go Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-red-50 rounded-lg text-left">
                <p className="text-sm font-mono text-red-800">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

