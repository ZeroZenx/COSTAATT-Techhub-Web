'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface PollOption {
  id: string
  text: string
  votes: number
}

interface InteractivePollProps {
  question: string
  options: PollOption[]
  onVote: (optionId: string) => void
  userVote?: string
  totalVotes: number
}

export default function InteractivePoll({
  question,
  options,
  onVote,
  userVote,
  totalVotes,
}: InteractivePollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(userVote || null)

  const handleVote = (optionId: string) => {
    if (!selectedOption) {
      setSelectedOption(optionId)
      onVote(optionId)
    }
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <h3 className="text-title-sm font-semibold text-black mb-6 tracking-tight">
        {question}
      </h3>

      <div className="space-y-4">
        {options.map((option, index) => {
          const percentage = getPercentage(option.votes)
          const isSelected = selectedOption === option.id
          const isWinning = option.votes === Math.max(...options.map((o) => o.votes))

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleVote(option.id)}
              disabled={!!selectedOption}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-accent bg-accent/5'
                  : selectedOption
                  ? 'border-gray-200 bg-gray-50 opacity-60'
                  : 'border-gray-200 hover:border-accent/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1">
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-accent"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  )}
                  <span className="text-body font-medium text-gray-900">
                    {option.text}
                  </span>
                </div>
                <span className="text-body-sm font-semibold text-gray-600 tabular-nums">
                  {percentage}%
                </span>
              </div>

              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    isSelected || isWinning ? 'bg-accent' : 'bg-gray-400'
                  }`}
                />
              </div>

              <div className="mt-2 text-body-sm text-gray-500 font-light">
                {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
              </div>
            </motion.button>
          )
        })}
      </div>

      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20"
        >
          <p className="text-body-sm text-accent font-medium">
            ✓ Your vote has been recorded! Total votes: {totalVotes}
          </p>
        </motion.div>
      )}
    </div>
  )
}

