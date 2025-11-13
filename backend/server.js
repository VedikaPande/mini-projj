const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const quiz = require('./routes/quiz');
const chatbot = require('./routes/chatbot');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with specific configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Next.js default dev server
    'http://127.0.0.1:3000',
    'https://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/quizzes', quiz);
app.use('/api/chatbot', chatbot);

// Base route for API testing
app.get('/', (req, res) => {
  res.json({ message: 'Mind Support API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});