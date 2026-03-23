# PandaLingo AI Tutor Integration Guide

## 🎉 What Has Been Implemented

### 1. **Database Models** ✅
- **Conversation Model**: Stores chat history with messages, mode, topic, and language preferences
- **UserPreferences Model**: Stores user learning style, difficulty level, theme preferences

### 2. **Backend API Endpoints** ✅

#### Conversations API (`/api/conversations`)
- `GET /` - Get all conversations for current user
- `GET /:id` - Get specific conversation with full message history
- `POST /` - Create new conversation with mode and topic
- `POST /:id/messages` - Add message and get AI response
- `DELETE /:id` - Delete conversation

#### User Preferences API (`/api/preferences`)
- `GET /` - Get user preferences (creates defaults if none exist)
- `PUT /` - Update preferences (learning style, difficulty, theme, etc.)

### 3. **Enhanced AI Server** ✅
- **Multiple Tutoring Modes**:
  - `tutor` - General language tutoring
  - `practice` - Conversation practice partner
  - `grammar-check` - Grammar and error correction
  - `vocabulary` - Vocabulary building and definition

- **Context-Aware Responses**: Uses conversation history for context
- **Adaptive Learning**: Considers user's learning style
- **System Prompts**: Different prompts for each mode with specific behaviors

### 4. **Frontend Components** ✅

#### ChatTutor Page (`src/pages/ChatTutor.tsx`)
- Beautiful modern UI with conversation sidebar
- Create new chat sessions with mode selection
- Load and manage conversation history
- Real-time message display with animations
- Mode selector for different tutoring styles
- Topic/subject focusing option

#### Messagebubble Component (`src/components/ai/Messagebubble.tsx`)
- Animated message bubbles
- User vs AI styling
- Timestamp display
- Loading states with animations
- Character-by-character text animation for short messages

#### Chatbox Component (`src/components/ai/Chatbox.tsx`)
- Floating chat widget (can be embedded on any page)
- Minimizable and closable
- Supports embedded mode (full-width)
- Message history with scrolling
- Position options (bottom-right, bottom-left, etc.)

####ActivityChart Component (`src/components/dashboard/ActivityChart.tsx`)
- Weekly activity bar chart
- Monthly progress line chart (XP vs Lessons)
- Gamification stats (Streak, Total XP, Lessons, Weekly activity)
- Achievement badges
- Using Recharts for beautiful visualizations

#### Sidebar Component (`src/components/layout/Sidebar.tsx`)
- Modern navigation sidebar
- Mobile-responsive with hamburger menu
- Quick stats display (XP, Streak)
- Quick links to main features
- User profile section
- Logout functionality

## 🔧 Configuration

### Environment Variables Required
```env
GEMINI_API_KEY=your_google_api_key_here
AI_PORT=5000
NODE_ENV=development
```

### Database
Uses MongoDB. Models are automatically created on first use.

## 🚀 How to Use

### Starting the Services
```bash
# Terminal 1: Start main server (handles both backend API and frontend proxy)
npm run dev:backend

# Terminal 2: Start AI Tutor Server
cd Servers && node server.js

# Terminal 3: Start development frontend (optional, if not using backend proxy)
npm run dev:frontend
```

### Using the Chat Tutor

1. **Navigate to Chat Tutor** page from the app:
   - `/chat-tutor` - Full-page chat interface

2. **Create a New Chat**:
   - Click "New Chat" button
   - Select a tutoring mode (Tutor, Practice, Grammar, Vocabulary)
   - Optionally enter a topic to focus on
   - Click "Start Learning"

3. **Send Messages**:
   - Type your message or question
   - Press Enter or click Send
   - AI responds with context-aware, personalized responses
   - Messages are stored in the database

4. **Manage Conversations**:
   - View all your past conversations in the sidebar
   - Click to load any previous conversation
   - Delete conversations with the trash icon
   - Each conversation auto-saves

### Using Floating Chatbox (Embedded)
```tsx
import Chatbox from "@/components/ai/Chatbox";

// In any page/component:
<Chatbox 
  isOpen={false}
  position="bottom-right"
  mode="tutor"
  topic="Spanish Verbs"
  embedded={false}  // Set to true for full-width embedding
/>
```

### Activity Chart in Dashboard
```tsx
import ActivityChart from "@/components/dashboard/ActivityChart";

<ActivityChart 
  weeklyData={customWeeklyData}
  monthlyData={customMonthlyData}
  streak={12}
  totalXp={1250}
  lessonsCompleted={29}
/>
```

## 📝 API Examples

### Create a Conversation
```bash
curl -X POST http://localhost:4000/api/conversations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spanish Greetings",
    "mode": "practice",
    "topic": "Saludos",
    "language": "spanish"
  }'
```

### Send a Message
```bash
curl -X POST http://localhost:4000/api/conversations/CONV_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hola, ¿cómo estás?"
  }'
```

### Get User Preferences
```bash
curl http://localhost:4000/api/preferences \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Preferences
```bash
curl -X PUT http://localhost:4000/api/preferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "learningStyle": "kinesthetic",
    "difficulty": "intermediate",
    "preferredLanguage": "spanish",
    "dailyGoalXp": 200
  }'
```

## 🎨 UI Customization

### Colors and Gradients
- Primary: Orange to Pink (`from-orange-500 to-pink-500`)
- Secondary: Purple to Pink (`from-purple-500 to-pink-500`)
- Accent: Various gradient options for each component

### Animations
- Using Framer Motion for smooth animations
- Particle effects on interactions
- Smooth transitions and hover states
- Loading indicators with animated dots

### Responsive Design
- Mobile-first approach
- Full responsiveness on all components
- Collapsible sidebar on mobile
- Touch-friendly buttons and interactions

## 🔐 Security Notes

1. **JWT Authentication**: All API endpoints require valid JWT tokens
2. **User Isolation**: Each user can only access their own data
3. **Token Validation**: AI server should validate tokens (optional but recommended)
4. **CORS**: Configure CORS properly in production

## 🐛 Troubleshooting

### AI Server Not Responding
- Ensure `Servers/server.js` is running
- Check `GEMINI_API_KEY` environment variable is set
- Verify `AI_PORT` (default 5000) is available

### Conversations Not Saving
- Ensure MongoDB is running
- Check database connection string
- Verify JWT token is valid

### Messages Not Displaying
- Check browser console for errors
- Ensure conversation ID is correct
- Verify network connection to backend

## 📚 Next Steps

1. **Audio Integration**:
   - Add speech-to-text for typing alternatives
   - Text-to-speech for AI responses
   - Pronunciation feedback

2. **Advanced Features**:
   - Streaming responses (WebSocket support)
   - Conversation summaries
   - Personalized learning paths
   - Spaced repetition integration

3. **Analytics**:
   - Track learning progress over time
   - Generate performance reports
   - Identify weak areas needing practice

4. **Social Features**:
   - Share conversation highlights
   - Community challenges
   - Friend streaks and leaderboards

5. **Offline Support**:
   - Cache conversations locally
   - IndexedDB for offline message storage
   - Service workers for offline functionality

## 🎓 Learning Features

### Current Capabilities
- ✅ Interactive chat with AI tutor
- ✅ Multiple learning modes
- ✅ Conversation history persistence
- ✅ User preferences and customization
- ✅ Progress tracking with XP/Levels
- ✅ Streak counting and motivation

### Potential Enhancements
- 🚀 Real-time feedback on language usage
- 🚀 Pronunciation analysis
- 🚀 Vocabulary reinforcement through spaced repetition
- 🚀 Grammar explanations with examples
- 🚀 Cultural context for language learning
- 🚀 Adaptive difficulty based on performance

---

**Last Updated**: March 2024
**Version**: 1.0.0
