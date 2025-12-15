'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'

interface LiveSearchProps<T> {
  items: T[]
  onSelect: (item: T) => void
  onSearch: (query: string) => void
  getItemLabel: (item: T) => string
  getItemKey: (item: T) => string
  placeholder?: string
  debounceMs?: number
  isLoading?: boolean
  renderItem?: (item: T) => React.ReactNode
}

export default function LiveSearch<T>({
  items,
  onSelect,
  onSearch,
  getItemLabel,
  getItemKey,
  placeholder = 'Search...',
  debounceMs = 300,
  isLoading = false,
  renderItem,
}: LiveSearchProps<T>) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query)
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, onSearch])

  useEffect(() => {
    if (items.length > 0 && query.trim()) {
      setIsOpen(true)
    }
  }, [items, query])

  const handleSelect = (item: T) => {
    onSelect(item)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || items.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + items.length) % items.length)
        break
      case 'Enter':
        e.preventDefault()
        if (items[highlightedIndex]) {
          handleSelect(items[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [highlightedIndex])

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlightedIndex(0)
          }}
          onFocus={() => {
            if (items.length > 0 && query.trim()) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-body font-light"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            ref={listRef}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {items.map((item, index) => (
              <motion.div
                key={getItemKey(item)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-gray-50'
                }`}
              >
                {renderItem ? renderItem(item) : getItemLabel(item)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

