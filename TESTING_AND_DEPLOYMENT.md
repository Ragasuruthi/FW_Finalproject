# PandaLingo - Testing & Deployment Guide

## ✅ Implementation Checklist

### Backend Models & APIs
- ✅ Conversation model created (stores messages, mode, topic)
- ✅ UserPreferences model created (learning style, difficulty, theme)
- ✅ Conversation API endpoints (CRUD operations)
- ✅ Preferences API endpoints (GET/PUT)
- ✅ All endpoints require JWT authentication

### AI Server Enhancements
- ✅ Multiple tutoring modes (tutor, practice, grammar-check, vocabulary)
- ✅ Context-aware responses using conversation history
- ✅ Learning style adaptation
- ✅ System prompts for each mode
- ✅ Error handling with fallback messages
- ✅ Health check endpoint

### Frontend Components
- ✅ ChatTutor page - Full-featured chat interface
- ✅ Messagebubble component - Animated message display
- ✅ Chatbox component - Floating chat widget
- ✅ ActivityChart component - Progress visualization
- ✅ Sidebar component - Navigation with stats
- ✅ Enhanced Lesson component - Better gamification
- ✅ Animations using Framer Motion
- ✅ Responsive design for all devices

---

## 🧪 Testing Procedures

### 1. Authentication Testing
```bash
# Test signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save the token from response as $TOKEN
```

### 2. User Preferences Testing
```bash
# Get preferences (creates defaults if none exist)
curl http://localhost:4000/api/preferences \
  -H "Authorization: Bearer $TOKEN"

# Update preferences
curl -X PUT http://localhost:4000/api/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "learningStyle": "visual",
    "difficulty": "beginner",
    "preferredLanguage": "spanish",
    "darkMode": true,
    "dailyGoalXp": 150
  }'
```

### 3. Conversation Management Testing
```bash
# Create a conversation
curl -X POST http://localhost:4000/api/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spanish Greetings",
    "mode": "practice",
    "topic": "Saludos",
    "language": "spanish"
  }'

# Save the conversation ID as $CONV_ID from response

# Get all conversations
curl http://localhost:4000/api/conversations \
  -H "Authorization: Bearer $TOKEN"

# Get specific conversation
curl http://localhost:4000/api/conversations/$CONV_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 4. AI Chat Testing
```bash
# Send a message
curl -X POST http://localhost:4000/api/conversations/$CONV_ID/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "¿Cómo te llamas?"
  }'

# Test different modes
# Mode: tutor
curl -X POST http://localhost:4000/api/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Spanish", "mode": "tutor", "topic": "Present Tense"}'

# Mode: practice
curl -X POST http://localhost:4000/api/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Practice Conversation", "mode": "practice", "topic": "Restaurant"}'

# Mode: grammar-check
curl -X POST http://localhost:4000/api/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Grammar Help", "mode": "grammar-check", "topic": "Verb Conjugation"}'

# Mode: vocabulary
curl -X POST http://localhost:4000/api/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Build Vocabulary", "mode": "vocabulary", "topic": "Food"}'
```

### 5. Delete Conversation Testing
```bash
curl -X DELETE http://localhost:4000/api/conversations/$CONV_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Frontend Feature Testing

**ChatTutor Page**
1. Navigate to `/chat-tutor`
2. Click "New Chat" button
3. Select tutor mode with topic "Spanish Verbs"
4. Send message: "What are the basic Spanish verbs?"
5. Verify AI responds appropriately
6. Send follow-up message to test conversation history
7. Verify that conversation is saved in sidebar
8. Click on saved conversation to reload it
9. Verify message history appears
10. Test message deletion

**Messagebubble Component**
1. Send various length messages (short, medium, long)
2. Observe character-by-character animation for short messages
3. Check loading state animation
4. Verify timestamps display correctly

**ActivityChart Component**
1. Navigate to `/dashboard`
2. Scroll down to see charts and stats
3. Verify weekly activity bar chart displays
4. Verify monthly progress line chart displays
5. Check that streak, XP, lessons stats are showing
6. Verify achievement badges animate

**Lesson Quiz**
1. Navigate to `/lessons`
2. Select a lesson to quiz
3. Complete quiz and observe:
   - Progress bar animation
   - Panda reaction animation
   - Answer feedback (correct/incorrect colors)
   - Confetti animation on completion
   - Final score screen with percentage
   - XP earned display

**Sidebar Component**
1. View sidebar with user stats
2. Test mobile hamburger menu
3. Click navigation items
4. Verify quick stats update
5. Test logout functionality

---

## 🚀 Deployment Steps

### Prerequisites
1. Node.js 16+ installed
2. MongoDB running
3. Google Gemini API key
4. Environment variables configured

### Production Setup

**1. Configure Environment Variables**
```bash
# Create .env file in root directory
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-url
JWT_SECRET=your-secure-secret
GEMINI_API_KEY=your-google-api-key
AI_SERVER_URL=http://localhost:5000
AI_PORT=5000
PORT=4000
```

**2. Install Dependencies**
```bash
npm install
cd Servers && npm install && cd ..
```

**3. Build Frontend (if using Vite)**
```bash
npm run build
```

**4. Start Services**
```bash
# Terminal 1: Backend API
npm run dev:backend

# Terminal 2: AI Tutor Server
cd Servers && node server.js

# Or use PM2 for process management:
npm install -g pm2
pm2 start "npm run dev:backend" --name "backend"
pm2 start "cd Servers && node server.js" --name "ai-server"
```

### Docker Deployment (Optional)

**Create Dockerfile for backend:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev:backend"]
```

**Create Dockerfile for AI server:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY Servers/package*.json ./
RUN npm install

COPY Servers .

EXPOSE 5000

CMD ["node", "server.js"]
```

---

## 🔍 Monitoring & Debugging

### Check AI Server Health
```bash
curl http://localhost:5000/health
```

### Check Backend Health
```bash
curl http://localhost:4000/
```

### View Conversation History (Debug Endpoint)
```bash
curl http://localhost:4000/api/conversations/CONV_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Monitor Logs
```bash
# View backend logs
npm run dev:backend

# View AI server logs
cd Servers && node server.js

# With PM2
pm2 logs
```

### Database Check (MongoDB)
```bash
# Connect to MongoDB
mongo

# List conversations collection
use learning-web
db.conversations.find()

# View user preferences
db.userpreferences.find()
```

---

## 🐛 Common Issues & Solutions

### Issue: AI Server Not Responding
**Solution:**
1. Ensure `GEMINI_API_KEY` is set in environment
2. Check port 5000 is available
3. Verify `Servers/server.js` is running
4. Check for API rate limiting

### Issue: Conversations Not Saving
**Solution:**
1. Ensure MongoDB is running
2. Check database connection string
3. Verify JWT token is valid
4. Check browser developer console for errors

### Issue: Cannot Login
**Solution:**
1. Ensure backend is running on port 4000
2. Check MongoDB connection
3. Clear localStorage and try again
4. Check browser console for errors

### Issue: AI Responses are Generic
**Solution:**
1. Verify `conversationHistory` is being sent with messages
2. Check AI mode is correct
3. Review system prompt for the mode
4. Check `GEMINI_API_KEY` is valid and has quota

### Issue: Animations Not Working
**Solution:**
1. Ensure Framer Motion is installed: `npm install framer-motion`
2. Check browser supports CSS animations
3. Verify no CSS conflicts
4. Check console for JavaScript errors

---

## 📊 Performance Optimization

### Frontend Optimization
1. ✅ Code splitting with React.lazy()
2. ✅ Image optimization with compression
3. ✅ Lazy loading of components
4. ✅ Debounced API calls
5. ✅ Memoization where appropriate

### Backend Optimization
1. ✅ Database indexing on frequently queried fields
2. ✅ JWT token caching
3. ✅ API response pagination (if needed)
4. ✅ Error handling without server crashes
5. ✅ Request timeout settings

### AI Server Optimization
1. ✅ Batch API calls if needed
2. ✅ Response caching for similar prompts
3. ✅ Conversation history limiting (keep last 10 messages)
4. ✅ Timeout settings for API calls

---

## 🔐 Security Checklist

- ✅ JWT tokens used for authentication
- ✅ Passwords hashed with bcrypt
- ✅ User data isolated per user
- ✅ CORS configured properly
- ✅ Environment variables not hardcoded
- ✅ Input validation on API endpoints
- ✅ Error messages don't leak sensitive info
- ✅ Rate limiting recommended for production
- ❌ TODO: Add rate limiting middleware
- ❌ TODO: Add request validation (Joi/Zod)
- ❌ TODO: Add logging and monitoring

---

## 📈 Future Enhancements

### Immediate (Sprint 1)
- [ ] Rate limiting on API endpoints
- [ ] Input validation middleware
- [ ] Conversation history export
- [ ] User profile customization
- [ ] Password reset functionality

### Short Term (Sprint 2-3)
- [ ] Streaming AI responses (WebSocket)
- [ ] Audio/Speech input support
- [ ] Conversation bookmarking
- [ ] Search within conversations
- [ ] Export results to PDF

### Medium Term (Sprint 4-6)
- [ ] Leaderboards
- [ ] Social features (friend challenges)
- [ ] Mobile app (React Native)
- [ ] Offline support with Service Workers
- [ ] Advanced analytics dashboard

### Long Term
- [ ] Machine learning for personalization
- [ ] Custom AI tutor training
- [ ] Integration with language learning platforms
- [ ] Gamification marketplace
- [ ] Teacher dashboard for classroom management

---

## 📚 Additional Resources

### API Documentation
See [AI_TUTOR_IMPLEMENTATION.md](AI_TUTOR_IMPLEMENTATION.md) for detailed API examples

### Component Documentation
- ChatTutor: Full-page chat interface with conversation sidebar
- Messagebubble: Reusable message bubble with animations
- Chatbox: Floating widget for embedding
- ActivityChart: Progress visualization
- Sidebar: Navigation with user stats

### Database Schema
- User: Email, password (hashed), name
- Conversation: userId, messages[], title, mode, topic, language
- UserPreferences: userId, learningStyle, difficulty, theme, goals
- Progress: userId, lessonId, completed, score
- RevokedToken: token, expiresAt

---

## 🎓 Learning Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Express.js Docs](https://expressjs.com/)

---

**Last Updated**: March 2024
**Version**: 1.0.0
**Status**: ✅ All core features implemented and tested
