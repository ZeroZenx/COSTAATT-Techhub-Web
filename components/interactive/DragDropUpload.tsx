'use client'

import { useState, useCallback, DragEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface FileWithPreview extends File {
  preview?: string
}

interface DragDropUploadProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  maxSize?: number // in bytes
  maxFiles?: number
}

export default function DragDropUpload({
  onFilesSelected,
  accept = 'image/*,video/*,.pdf,.zip',
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`
    }
    return null
  }

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const fileArray = Array.from(fileList)
      const validFiles: FileWithPreview[] = []
      const errors: string[] = []

      fileArray.slice(0, maxFiles - files.length).forEach((file) => {
        const error = validateFile(file)
        if (error) {
          errors.push(error)
        } else {
          const fileWithPreview = file as FileWithPreview
          if (file.type.startsWith('image/')) {
            fileWithPreview.preview = URL.createObjectURL(file)
          }
          validFiles.push(fileWithPreview)
        }
      })

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error))
      }

      if (validFiles.length > 0) {
        const newFiles = [...files, ...validFiles]
        setFiles(newFiles)
        onFilesSelected(newFiles)
        toast.success(`${validFiles.length} file(s) added`)
      }
    },
    [files, maxFiles, maxSize, onFilesSelected]
  )

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    if (files[index].preview) {
      URL.revokeObjectURL(files[index].preview!)
    }
    setFiles(newFiles)
    onFilesSelected(newFiles)
  }

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? '#0071e3' : '#e5e5e5',
        }}
        className="relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors bg-gray-50 hover:bg-gray-100"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept={accept}
          onChange={handleFileInput}
          disabled={files.length >= maxFiles}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-body font-medium text-gray-900 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-body-sm text-gray-500 font-light">
              Supports images, videos, PDFs, and ZIP files (max {maxSize / 1024 / 1024}MB)
            </p>
            {files.length >= maxFiles && (
              <p className="text-body-sm text-red-600 mt-2">
                Maximum {maxFiles} files allowed
              </p>
            )}
          </motion.div>
        </label>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-body-sm font-medium text-gray-900 mb-2">
              Selected Files ({files.length}/{maxFiles})
            </p>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    <File className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-body-sm text-gray-500 font-light">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

