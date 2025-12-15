'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'

const quizzes = [
  {
    id: 'vr-basics',
    title: 'VR & AR Basics',
    description: 'Test your knowledge of virtual and augmented reality',
    questions: [
      {
        question: 'What does VR stand for?',
        options: ['Virtual Reality', 'Visual Reality', 'Video Reality', 'Vivid Reality'],
        correct: 0,
      },
      {
        question: 'Which device is commonly used for VR experiences?',
        options: ['Smartphone', 'VR Headset', 'Tablet', 'Laptop'],
        correct: 1,
      },
      {
        question: 'AR overlays digital content onto:',
        options: ['Virtual world', 'Real world', 'Both', 'Neither'],
        correct: 1,
      },
    ],
  },
  {
    id: 'iot-fundamentals',
    title: 'IoT Fundamentals',
    description: 'Learn about Internet of Things and connected devices',
    questions: [
      {
        question: 'What does IoT stand for?',
        options: ['Internet of Things', 'Internet of Technology', 'Integrated Online Technology', 'Internet on Things'],
        correct: 0,
      },
      {
        question: 'Which is an example of an IoT device?',
        options: ['Smartphone', 'Smart Thermostat', 'Desktop Computer', 'TV Remote'],
        correct: 1,
      },
    ],
  },
]

export default function QuizModule() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const quiz = selectedQuiz ? quizzes.find((q) => q.id === selectedQuiz) : null

  const handleAnswer = (answerIndex: number) => {
    if (!quiz) return
    
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    if (currentQuestion < quiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 500)
    } else {
      setTimeout(() => {
        setShowResults(true)
      }, 500)
    }
  }

  const calculateScore = () => {
    if (!quiz) return 0
    let correct = 0
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct) correct++
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Tech Knowledge Quizzes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedQuiz(quiz.id)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="flex items-center text-primary-600 font-semibold">
                  Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showResults && quiz) {
    const score = calculateScore()
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
          >
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
            <div className="text-6xl font-bold text-primary-600 mb-4">{score}%</div>
            <p className="text-gray-600 mb-8">
              You got {answers.filter((a, i) => a === quiz.questions[i].correct).length} out of {quiz.questions.length} questions correct!
            </p>
            <button
              onClick={() => {
                setSelectedQuiz(null)
                setCurrentQuestion(0)
                setAnswers([])
                setShowResults(false)
              }}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Take Another Quiz
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!quiz) return null

  const question = quiz.questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion] !== undefined ? answers[currentQuestion] : null

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span className="text-sm font-semibold text-primary-600">{quiz.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{question.question}</h2>
          
          <div className="space-y-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correct
              const showResult = selectedAnswer !== null

              return (
                <motion.button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isSelected && !isCorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                  }`}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">{option}</span>
                    {showResult && (
                      <>
                        {isCorrect && <CheckCircle className="h-6 w-6 text-green-500" />}
                        {isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-500" />}
                      </>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

