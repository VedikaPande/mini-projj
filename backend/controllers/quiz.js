const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { Groq } = require('groq-sdk');

// Initialize Groq client with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions');
    
    // Get completed quizzes for the current user
    const userResults = await QuizResult.find({ 
      user: req.user.id 
    }).select('quizId score maxScore');
    
    // Map user results to quizzes
    const userQuizzes = quizzes.map(quiz => {
      const userResult = userResults.find(result => result.quizId === quiz.id);
      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        questions: quiz.questions ? quiz.questions.length : 0,
        category: quiz.category,
        difficulty: quiz.difficulty,
        completed: !!userResult,
        score: userResult ? Math.round((userResult.score / userResult.maxScore) * 100) : null,
      };
    });
    
    res.status(200).json({
      success: true,
      count: userQuizzes.length,
      data: userQuizzes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.id });
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit quiz result
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuizResult = async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quiz answers'
      });
    }
    
    // Find quiz
    const quiz = await Quiz.findOne({ id: req.params.id });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    
    quiz.questions.forEach(question => {
      const answer = answers[question._id];
      const option = question.options.find(opt => opt.value === answer);
      
      if (option) {
        totalScore += option.score;
      }
      
      // Calculate max possible score
      const maxOptionScore = Math.max(...question.options.map(o => o.score));
      maxScore += maxOptionScore;
    });
    
    // Determine stress/anxiety level based on score percentage
    const scorePercentage = (totalScore / maxScore) * 100;
    let level;
    
    if (scorePercentage <= 33) {
      level = 'Low';
    } else if (scorePercentage <= 66) {
      level = 'Moderate';
    } else {
      level = 'High';
    }
    
    // Generate personalized recommendations using Groq
    let recommendations = [];
    try {
      const promptText = `
      Generate personalized mental health recommendations based on the following information:
      - Quiz: ${quiz.title}
      - Score: ${totalScore}/${maxScore}
      - Level: ${level}
      
      Please provide 3 actionable recommendations to help improve mental wellbeing. 
      Each recommendation should have a title (5-7 words) and a brief description (15-25 words).
      Format the response as a JSON array: [{"title": "Title here", "description": "Description here"}, ...].
      `;
      
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a mental health expert providing evidence-based recommendations." },
          { role: "user", content: promptText }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 500,
      });
      
      // Parse the response to get the recommendations
      const response = completion.choices[0].message.content;
      recommendations = JSON.parse(response);
    } catch (groqError) {
      console.error('Groq API error:', groqError);
      // Fallback recommendations if Groq API fails
      recommendations = [
        {
          title: "Practice Daily Mindfulness",
          description: "Spend 5-10 minutes each day in quiet meditation or focused breathing to reduce stress."
        },
        {
          title: "Maintain a Regular Sleep Schedule",
          description: "Aim for 7-9 hours of sleep each night, going to bed and waking up at consistent times."
        },
        {
          title: "Connect with Supportive People",
          description: "Reach out to friends or family members who provide positive emotional support."
        }
      ];
    }
    
    // Save quiz result
    const quizResult = await QuizResult.create({
      user: req.user.id,
      quiz: quiz._id,
      quizId: quiz.id,
      answers: answers,
      score: totalScore,
      maxScore: maxScore,
      level: level,
      recommendations: recommendations
    });
    
    res.status(201).json({
      success: true,
      data: {
        score: totalScore,
        maxScore: maxScore,
        level: level,
        recommendations: recommendations
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's quiz results
// @route   GET /api/quizzes/results
// @access  Private
exports.getQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user.id })
      .populate('quiz', 'id title category')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's specific quiz result
// @route   GET /api/quizzes/:id/results
// @access  Private
exports.getQuizResult = async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      user: req.user.id,
      quizId: req.params.id
    }).sort('-createdAt');
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No results found for this quiz'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};