const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  answers: {
    type: Map,
    of: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    required: true
  },
  recommendations: [{
    title: String,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for finding user's quiz results efficiently
QuizResultSchema.index({ user: 1, quiz: 1 });

module.exports = mongoose.model('QuizResult', QuizResultSchema);