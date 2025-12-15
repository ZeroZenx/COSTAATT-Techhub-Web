// Knowledge base for the chatbot
// This can be expanded or replaced with an AI service in the future

export const chatbotKnowledge = {
  about: {
    name: 'COSTAATT Tech Hub',
    description: 'An interactive learning platform featuring cutting-edge technology, virtual tours, event bookings, and student innovation showcases.',
    location: 'Trinidad',
    email: 'info@costaatt.edu.tt',
    phone: '868 625 5030',
  },
  
  features: [
    {
      name: 'Interactive Virtual Tour',
      description: '360° walkthrough with clickable hotspots on devices like Apple Vision Pro, drones, 3D printers, and IoT kits.',
      url: '/tour',
    },
    {
      name: 'Event Calendar & Booking',
      description: 'Book school visits, RSVP to workshops, and never miss an exciting event.',
      url: '/events',
    },
    {
      name: 'Gamification',
      description: 'Earn badges, climb leaderboards, and complete challenges to showcase your skills.',
      url: '/leaderboard',
    },
    {
      name: 'Interactive Learning',
      description: 'AR/VR demos, IoT simulations, and quizzes to enhance your learning experience.',
      url: '/learning',
    },
    {
      name: 'Vendor Highlights',
      description: 'Meet tech experts, watch demos, and learn from industry professionals.',
      url: '/vendors',
    },
    {
      name: 'Student Spotlight',
      description: 'Share your projects, get featured, and inspire others with your creations.',
      url: '/spotlight',
    },
  ],

  devices: [
    {
      name: 'Apple Vision Pro',
      description: 'Experience immersive AR/VR with cutting-edge spatial computing technology.',
      category: 'AR/VR',
    },
    {
      name: 'Drone Fleet',
      description: 'Learn aerial photography and drone piloting with our professional drone collection.',
      category: 'Aerial Technology',
    },
    {
      name: '3D Printers',
      description: 'Turn your digital designs into reality with our advanced 3D printing lab.',
      category: 'Manufacturing',
    },
    {
      name: 'IoT Development Kits',
      description: 'Build smart devices and connected systems with our comprehensive IoT kits.',
      category: 'Internet of Things',
    },
  ],

  badges: [
    { name: 'VR Explorer', description: 'Completed VR tour', category: 'EXPLORER' },
    { name: 'Drone Pilot', description: 'Mastered drone basics', category: 'CREATOR' },
    { name: '3D Designer', description: 'Created 3D model', category: 'CREATOR' },
    { name: 'IoT Innovator', description: 'Built IoT project', category: 'INNOVATOR' },
    { name: 'Quiz Master', description: 'Scored 100% on quiz', category: 'EXPERT' },
  ],

  bookingInfo: {
    process: [
      'Go to the Events page',
      'Choose an event or time slot',
      'Fill in school details and student count',
      'Submit your booking request',
      'Wait for admin confirmation',
    ],
    requirements: [
      'School name',
      'Number of students',
      'Contact email',
      'Contact name (teacher/coordinator)',
    ],
    capacity: 'Events have limited capacity, so book early!',
  },

  faq: [
    {
      question: 'How do I book a visit?',
      answer: 'Visit the Events page, select an event or time slot, fill in your details, and submit. Our admin team will confirm your booking.',
    },
    {
      question: 'What technology is available?',
      answer: 'We have Apple Vision Pro for AR/VR, professional drones, 3D printers, and IoT development kits. Explore them all in our Virtual Tour!',
    },
    {
      question: 'How do I earn badges?',
      answer: 'Complete activities like the virtual tour, quizzes, workshops, or submit projects. Check the Leaderboard to see all available badges.',
    },
    {
      question: 'Can I submit my project?',
      answer: 'Yes! Go to the Submit page and upload your project. It could be featured in our Student Spotlight.',
    },
    {
      question: 'Are events free?',
      answer: 'Most events are free for students and schools. Check individual event details for any requirements.',
    },
  ],
}

export function searchKnowledge(query: string): string[] {
  const results: string[] = []
  const lowerQuery = query.toLowerCase()

  // Search features
  chatbotKnowledge.features.forEach((feature) => {
    if (
      feature.name.toLowerCase().includes(lowerQuery) ||
      feature.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push(`${feature.name}: ${feature.description}`)
    }
  })

  // Search devices
  chatbotKnowledge.devices.forEach((device) => {
    if (
      device.name.toLowerCase().includes(lowerQuery) ||
      device.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push(`${device.name}: ${device.description}`)
    }
  })

  // Search badges
  chatbotKnowledge.badges.forEach((badge) => {
    if (
      badge.name.toLowerCase().includes(lowerQuery) ||
      badge.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push(`${badge.name}: ${badge.description}`)
    }
  })

  return results
}

