'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { chatbotKnowledge, searchKnowledge } from '@/lib/chatbot-knowledge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatBotProps {
  events?: Array<{
    id: string
    title: string
    date: Date
    type: string
  }>
}

export default function ChatBot({ events = [] }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your COSTAATT Tech Hub assistant. I can help you with events, bookings, virtual tours, learning modules, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  const getResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase()

    // Greetings
    if (lowerMessage.match(/hi|hello|hey|greetings/)) {
      return "Hello! I'm here to help you explore the COSTAATT Tech Hub. You can ask me about events, the virtual tour, learning modules, badges, or how to book a visit!"
    }

    // Events
    if (lowerMessage.match(/event|workshop|demo|session|schedule|calendar/)) {
      if (events.length > 0) {
        const upcomingEvents = events
          .filter((e) => new Date(e.date) > new Date())
          .slice(0, 3)
        if (upcomingEvents.length > 0) {
          const eventList = upcomingEvents
            .map((e) => `• ${e.title} - ${format(e.date, 'MMM d')}`)
            .join('\n')
          return `Here are some upcoming events:\n\n${eventList}\n\nYou can view all events and book on the Events page!`
        }
      }
      return "We have various events including VR Design Workshops, Drone Pilot Training, 3D Printing Masterclasses, and IoT Demos. Check the Events page to see the full calendar and book your spot!"
    }

    // Virtual Tour
    if (lowerMessage.match(/tour|virtual|360|explore|visit|walkthrough/)) {
      return "Our Interactive Virtual Tour lets you explore the Tech Hub in 360°! Click on hotspots to discover Apple Vision Pro, drones, 3D printers, and IoT kits. Each device has interactive demos. Visit the Virtual Tour page to get started!"
    }

    // Booking
    if (lowerMessage.match(/book|booking|reserve|rsvp|register|sign up/)) {
      return "To book a visit:\n1. Go to the Events page\n2. Choose an event or time slot\n3. Fill in your school details and student count\n4. Submit your booking request\n\nTeachers can book for their entire class. Bookings are confirmed by our admin team."
    }

    // Learning Modules
    if (lowerMessage.match(/learn|learning|module|quiz|ar|vr|iot|simulation/)) {
      return "We offer several interactive learning modules:\n• Tech Knowledge Quizzes - Test your knowledge\n• AR/VR Experiences - Immersive demonstrations\n• IoT Simulations - Build and experiment with smart devices\n\nVisit the Learning page to explore all modules!"
    }

    // Badges/Gamification
    if (lowerMessage.match(/badge|achievement|gamification|leaderboard|points|rank/)) {
      return "Earn badges by completing activities:\n• VR Explorer - Complete virtual tour\n• Drone Pilot - Master drone basics\n• 3D Designer - Create 3D models\n• IoT Innovator - Build IoT projects\n• Quiz Master - Score perfectly on quizzes\n\nCheck the Leaderboard to see rankings and your progress!"
    }

    // Devices/Technology
    if (lowerMessage.match(/device|technology|tech|vision pro|drone|3d printer|iot|equipment/)) {
      return "Our Tech Hub features:\n• Apple Vision Pro - AR/VR spatial computing\n• Professional Drones - Aerial photography and piloting\n• 3D Printers - Turn designs into reality\n• IoT Development Kits - Build smart connected devices\n\nExplore them all in our Virtual Tour!"
    }

    // Student Projects
    if (lowerMessage.match(/project|submission|spotlight|showcase|share|submit/)) {
      return "Students can submit projects to be featured in our Student Spotlight! Projects can include:\n• 3D Designs\n• AI Demos\n• VR Sketches\n• Code Projects\n\nVisit the Submit page to upload your project, or check the Spotlight page to see featured work!"
    }

    // Vendors
    if (lowerMessage.match(/vendor|expert|guest|professional|speaker/)) {
      return "We regularly host tech experts and industry professionals who lead workshops and demos. Check the Vendors page to see upcoming guest sessions and learn from industry leaders!"
    }

    // Admin
    if (lowerMessage.match(/admin|manage|dashboard|staff/)) {
      return "The Admin Dashboard allows Tech Hub staff to manage bookings, events, submissions, and badges. Access requires admin credentials."
    }

    // Help/General
    if (lowerMessage.match(/help|what can|how|what|assist|support/)) {
      return "I can help you with:\n• Finding and booking events\n• Exploring the virtual tour\n• Learning about our technology\n• Understanding badges and gamification\n• Submitting student projects\n• General questions about the Tech Hub\n\nJust ask me anything!"
    }

    // About/Info
    if (lowerMessage.match(/about|info|what is|tell me about/)) {
      return `${chatbotKnowledge.about.description}\n\nWe're located in ${chatbotKnowledge.about.location}.\n\nContact us:\n• Email: ${chatbotKnowledge.about.email}\n• Phone: ${chatbotKnowledge.about.phone}\n\nWe offer:\n• Virtual tours\n• Event bookings\n• Learning modules\n• Student showcases\n• Gamification\n\nExplore our features to learn more!`
    }

    // Contact information
    if (lowerMessage.match(/contact|email|phone|reach|get in touch/)) {
      return `You can reach us at:\n• Email: ${chatbotKnowledge.about.email}\n• Phone: ${chatbotKnowledge.about.phone}\n• Location: ${chatbotKnowledge.about.location}\n\nFeel free to contact us for bookings, questions, or more information!`
    }

    // FAQ matching
    const faqMatch = chatbotKnowledge.faq.find((faq) =>
      lowerMessage.includes(faq.question.toLowerCase().split(' ')[0])
    )
    if (faqMatch) {
      return faqMatch.answer
    }

    // Knowledge search
    const searchResults = searchKnowledge(userMessage)
    if (searchResults.length > 0) {
      return `I found this information:\n\n${searchResults.slice(0, 3).join('\n\n')}\n\nWould you like to know more about any of these?`
    }

    // Default response
    return "I'm not sure I understand that question. I can help you with events, bookings, virtual tours, learning modules, badges, or student projects. Try asking about one of these topics, or say 'help' for more options!"
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate thinking time
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await getResponse(userMessage.content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    'What events are coming up?',
    'How do I book a visit?',
    'Tell me about the virtual tour',
    'What badges can I earn?',
  ]

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        {!isOpen && messages.length > 1 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold"
          >
            {messages.filter((m) => m.role === 'user').length}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-6 right-6 z-50 w-full md:w-96 h-[600px] md:h-[700px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-accent text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-body font-semibold">Tech Hub Assistant</h3>
                    <p className="text-body-sm opacity-90 font-light">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-accent text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <p
                            className={`text-body-sm font-light whitespace-pre-wrap ${
                              message.role === 'user' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-2 font-light ${
                              message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                            }`}
                          >
                            {format(message.timestamp, 'h:mm a')}
                          </p>
                        </div>
                        {message.role === 'user' && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-white/70" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl p-4">
                      <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="px-4 py-2 bg-white border-t border-gray-200">
                  <p className="text-body-sm text-gray-600 mb-2 font-light">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => {
                          setInput(question)
                          setTimeout(() => handleSend(), 100)
                        }}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-light transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about the Tech Hub..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-accent focus:border-transparent text-body-sm font-light"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-3 bg-accent text-white rounded-full hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

