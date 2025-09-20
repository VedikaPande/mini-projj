const mongoose = require('mongoose');

// Option Schema for quiz questions
const OptionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

// Question Schema for quizzes
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [OptionSchema]
});

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Assessment', 'Education', 'Skills']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  questions: [QuestionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);