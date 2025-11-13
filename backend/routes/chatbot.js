const express = require('express');
const chatbotController = require('../controllers/chatbot');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/chatbot/chat
 * @desc    Send message to chatbot with patient context from authenticated user
 * @access  Protected (requires authentication)
 * @body    { message: string, sessionId?: string }
 * @note    Patient ID is automatically extracted from authenticated user
 */
router.post('/chat', protect, chatbotController.chat);

/**
 * @route   POST /api/chatbot/session/start
 * @desc    Start a new chat session with patient context from authenticated user
 * @access  Protected (requires authentication)
 * @body    { } (empty body - patient ID comes from auth)
 * @note    Patient ID is automatically extracted from authenticated user
 */
router.post('/session/start', protect, chatbotController.startSession);

/**
 * @route   GET /api/chatbot/session/:sessionId/history
 * @desc    Get chat history for a session
 * @access  Protected (requires authentication)
 */
router.get('/session/:sessionId/history', protect, chatbotController.getChatHistory);

/**
 * @route   DELETE /api/chatbot/session/:sessionId/history
 * @desc    Clear chat history for a session
 * @access  Protected (requires authentication)
 */
router.delete('/session/:sessionId/history', protect, chatbotController.clearHistory);

/**
 * @route   GET /api/chatbot/status
 * @desc    Get chatbot service status and health check
 * @access  Protected (requires authentication)
 */
router.get('/status', protect, chatbotController.getStatus);

/**
 * @route   GET /api/chatbot/patients/search
 * @desc    Search patients by name (admin use)
 * @access  Protected (requires authentication)
 * @query   { query: string, limit?: number }
 */
router.get('/patients/search', protect, chatbotController.searchPatients);

// Public endpoint for basic chat (without patient context)
/**
 * @route   POST /api/chatbot/public/chat
 * @desc    Public chat endpoint without patient context
 * @access  Public
 * @body    { message: string, sessionId?: string }
 */
router.post('/public/chat', async (req, res) => {
  try {
    // Remove patientId to ensure no patient context is used
    const { message, sessionId } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and cannot be empty'
      });
    }

    // Call the chat method without patientId
    req.body = { message, sessionId };
    await chatbotController.chat(req, res);
  } catch (error) {
    console.error('Public chat error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Unable to process your message'
    });
  }
});

/**
 * @route   POST /api/chatbot/public/session/start
 * @desc    Start a public chat session (no patient context)
 * @access  Public
 */
router.post('/public/session/start', async (req, res) => {
  try {
    // Remove any patientId to ensure public session
    req.body = {};
    await chatbotController.startSession(req, res);
  } catch (error) {
    console.error('Public session start error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Unable to start chat session'
    });
  }
});

/**
 * @route   GET /api/chatbot/public/status
 * @desc    Get public chatbot status (basic info only)
 * @access  Public
 */
router.get('/public/status', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        status: 'operational',
        message: 'MindSupport AI is ready to help',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Status check failed'
    });
  }
});


// Error handling middleware for this router
router.use((error, req, res, next) => {
  console.error('Chatbot route error:', error.message);
  
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;