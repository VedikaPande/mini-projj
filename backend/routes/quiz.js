const express = require('express');
const router = express.Router();
const { 
  getQuizzes, 
  getQuiz, 
  submitQuizResult, 
  getQuizResults, 
  getQuizResult 
} = require('../controllers/quiz');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Get all quizzes and submit quiz result
router.route('/')
  .get(getQuizzes);

// Get specific quiz
router.route('/:id')
  .get(getQuiz);

// Submit quiz result
router.route('/:id/submit')
  .post(submitQuizResult);

// Get all user's quiz results
router.route('/results')
  .get(getQuizResults);

// Get user's specific quiz result
router.route('/:id/results')
  .get(getQuizResult);

module.exports = router;