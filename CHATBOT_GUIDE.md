# 🤖 Chatbot Guide

## Overview

The COSTAATT Tech Hub features an intelligent chatbot assistant that knows everything about the website and can help users navigate, find information, and answer questions.

## Features

### ✅ What the Chatbot Can Do

1. **Event Information**
   - List upcoming events
   - Explain how to book visits
   - Provide event details and schedules

2. **Virtual Tour Guidance**
   - Explain how to use the virtual tour
   - Describe available devices and technology
   - Guide users through hotspots

3. **Booking Assistance**
   - Walk through the booking process
   - Explain requirements
   - Help with RSVP

4. **Learning Modules**
   - Describe available learning modules
   - Explain AR/VR experiences
   - Guide to quizzes and simulations

5. **Badges & Gamification**
   - List available badges
   - Explain how to earn badges
   - Show leaderboard information

6. **Student Projects**
   - Explain submission process
   - Guide to Student Spotlight
   - Help with project types

7. **General Information**
   - Answer FAQs
   - Provide website navigation help
   - Explain Tech Hub features

## Usage

### For Users

1. **Open the Chatbot**
   - Click the floating chat button (bottom-right corner)
   - Available on all pages

2. **Ask Questions**
   - Type your question in natural language
   - Use quick question buttons for common queries
   - Press Enter or click Send

3. **Examples of Questions**
   - "What events are coming up?"
   - "How do I book a visit?"
   - "Tell me about the virtual tour"
   - "What badges can I earn?"
   - "How do I submit my project?"

### For Developers

#### Component Location
```
components/chatbot/ChatBot.tsx
```

#### Knowledge Base
```
lib/chatbot-knowledge.ts
```

#### Integration
The chatbot is integrated in `app/layout.tsx` and appears on all pages.

## Knowledge Base Structure

The chatbot uses a structured knowledge base (`lib/chatbot-knowledge.ts`) containing:

- **Features**: All website features and their descriptions
- **Devices**: Available technology and equipment
- **Badges**: All available badges and how to earn them
- **Booking Info**: Booking process and requirements
- **FAQ**: Frequently asked questions

## Customization

### Adding New Knowledge

Edit `lib/chatbot-knowledge.ts`:

```typescript
export const chatbotKnowledge = {
  // Add new sections
  newSection: {
    // Your data
  }
}
```

### Adding Response Patterns

Edit `components/chatbot/ChatBot.tsx` in the `getResponse` function:

```typescript
// Add new pattern matching
if (lowerMessage.match(/your-pattern/)) {
  return "Your response"
}
```

### Styling

The chatbot uses Tailwind CSS classes matching the Apple.com aesthetic:
- Accent color: `#0071e3`
- Rounded corners: `rounded-2xl`
- Light fonts: `font-light`
- Clean spacing

## Future Enhancements

### Planned Features

1. **AI Integration**
   - Connect to OpenAI GPT or similar
   - More natural language understanding
   - Context-aware responses

2. **Real-Time Data**
   - Fetch live events from database
   - Show real-time availability
   - Dynamic responses based on current state

3. **Multi-Language Support**
   - Spanish translation
   - Other languages as needed

4. **Voice Input**
   - Speech-to-text
   - Voice responses

5. **Analytics**
   - Track common questions
   - Improve responses based on usage
   - Identify knowledge gaps

## Technical Details

### Technologies Used

- **React Hooks**: useState, useEffect, useRef
- **Framer Motion**: Animations and transitions
- **date-fns**: Date formatting
- **Lucide React**: Icons

### Performance

- Lightweight component (~15KB)
- No external API calls (can be added)
- Efficient re-renders with React.memo potential
- Smooth animations with Framer Motion

### Accessibility

- Keyboard navigation support
- ARIA labels
- Screen reader friendly
- Focus management

## Troubleshooting

### Chatbot Not Appearing

1. Check `app/layout.tsx` includes `<ChatBot />`
2. Verify component imports are correct
3. Check browser console for errors

### Responses Not Working

1. Check `lib/chatbot-knowledge.ts` exists
2. Verify pattern matching in `getResponse` function
3. Check browser console for errors

### Styling Issues

1. Verify Tailwind CSS is configured
2. Check accent color is defined in `tailwind.config.ts`
3. Ensure font classes are available

## Support

For issues or questions about the chatbot:
1. Check this guide
2. Review the code comments
3. Test with common questions
4. Check browser console for errors

---

**The chatbot is designed to be helpful, friendly, and knowledgeable about everything related to the COSTAATT Tech Hub!**

