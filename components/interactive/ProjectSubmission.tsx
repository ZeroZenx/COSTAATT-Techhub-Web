'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import DragDropUpload from './DragDropUpload'
import toast from 'react-hot-toast'

export default function ProjectSubmission() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'OTHER',
    challengeId: '',
  })
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    if (files.length === 0) {
      toast.error('Please upload at least one file')
      return
    }

    // TODO: Implement file upload and submission API
    toast.success('Project submitted successfully! It will be reviewed by our team.')
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'OTHER',
      challengeId: '',
    })
    setFiles([])
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <Link
          href="/spotlight"
          className="inline-flex items-center text-accent hover:text-accent-700 mb-8 font-light"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Spotlight
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
        >
          <h1 className="text-headline-sm font-semibold text-black mb-2 tracking-tight">
            Submit Your Project
          </h1>
          <p className="text-body-sm text-gray-600 mb-8 font-light">
            Share your innovation with the COSTAATT Tech Hub community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-body-sm font-medium text-gray-900 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-body font-light"
                placeholder="e.g., VR Art Gallery"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-body font-light"
                placeholder="Describe your project, technologies used, and what makes it special..."
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-gray-900 mb-2">
                Project Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-body font-light"
              >
                <option value="DESIGN_3D">3D Design</option>
                <option value="AI_DEMO">AI Demo</option>
                <option value="VR_SKETCH">VR Sketch</option>
                <option value="CODE_PROJECT">Code Project</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-gray-900 mb-2">
                Upload Files *
              </label>
              <DragDropUpload
                onFilesSelected={setFiles}
                accept="image/*,video/*,.pdf,.zip,.obj,.glb"
                maxSize={50 * 1024 * 1024} // 50MB
                maxFiles={5}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-8 py-3 bg-accent text-white rounded-full text-body font-medium hover:bg-accent-700 transition-colors"
              >
                <Send className="h-5 w-5" />
                <span>Submit Project</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

