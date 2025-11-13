const GroqLLMService = require('../services/groqLLM');
const PatientContextService = require('../services/patientContext');

class ChatbotController {
  constructor() {
    this.groqService = new GroqLLMService();
    this.patientService = new PatientContextService();
    this.conversationHistory = new Map(); // Store conversation history by session
    
    // Bind methods to ensure 'this' context
    this.chat = this.chat.bind(this);
    this.startSession = this.startSession.bind(this);
    this.getChatHistory = this.getChatHistory.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.searchPatients = this.searchPatients.bind(this);
  }

  /**
   * Handle chat message with patient context
   */
  async chat(req, res) {
    try {
      const { message, sessionId } = req.body;
      const patientId = req.user ? req.user.patientId : null;

      // Validate input
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message is required and cannot be empty'
        });
      }

      // Get patient context if patientId is provided
      let patientContext = '';
      let patientSummary = null;
      
      if (patientId) {
        const isValidPatient = await this.patientService.validatePatientAccess(patientId);
        
        if (isValidPatient) {
          patientContext = await this.patientService.getPatientContext(patientId);
          patientSummary = await this.patientService.getPatientSummary(patientId);
        } else {
          console.warn(`Invalid or inaccessible patient ID: ${patientId}`);
        }
      }

      // Get conversation history
      const chatHistory = this.getConversationHistory(sessionId);
      
      // Generate response using Groq LLM
      const response = await this.groqService.generateResponse(
        message,
        patientContext,
        chatHistory
      );

      // Update conversation history
      this.updateConversationHistory(sessionId, message, response);

      // Prepare response
      const chatResponse = {
        success: true,
        data: {
          message: response,
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
          hasPatientContext: !!patientContext,
          patientSummary: patientSummary
        }
      };

      res.json(chatResponse);

    } catch (error) {
      console.error('Chat error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Unable to process your message at this time. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Start a new chat session
   */
  async startSession(req, res) {
    try {
      const patientId = req.user ? req.user.patientId : null;
      const sessionId = this.generateSessionId();

      // Validate patient if provided
      let patientSummary = null;
      if (patientId) {
        const isValidPatient = await this.patientService.validatePatientAccess(patientId);
        if (isValidPatient) {
          patientSummary = await this.patientService.getPatientSummary(patientId);
        }
      }

      // Initialize conversation history
      this.conversationHistory.set(sessionId, []);

      res.json({
        success: true,
        data: {
          sessionId,
          patientSummary,
          welcomeMessage: this.generateWelcomeMessage(patientSummary),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Session start error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Unable to start chat session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get chat history for a session
   */
  getChatHistory(req, res) {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'Session ID is required'
        });
      }

      const history = this.conversationHistory.get(sessionId) || [];

      res.json({
        success: true,
        data: {
          sessionId,
          history,
          messageCount: history.length
        }
      });

    } catch (error) {
      console.error('Get history error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Unable to retrieve chat history'
      });
    }
  }

  /**
   * Clear chat history for a session
   */
  clearHistory(req, res) {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'Session ID is required'
        });
      }

      this.conversationHistory.delete(sessionId);

      res.json({
        success: true,
        data: {
          message: 'Chat history cleared successfully',
          sessionId
        }
      });

    } catch (error) {
      console.error('Clear history error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Unable to clear chat history'
      });
    }
  }

  /**
   * Get chatbot status and health check
   */
  async getStatus(req, res) {
    try {
      const status = {
        success: true,
        data: {
          status: 'operational',
          services: {
            groq: !!process.env.GROQ_API_KEY,
            tavily: !!process.env.TAVILY_API_KEY,
            database: true // Assuming DB is connected if we reach here
          },
          activeSessions: this.conversationHistory.size,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      // Test Groq service availability
      try {
        await this.groqService.simpleChat('test', '');
        status.data.services.groq = true;
      } catch (error) {
        status.data.services.groq = false;
        console.warn('Groq service test failed:', error.message);
      }

      res.json(status);

    } catch (error) {
      console.error('Status check error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Status check failed'
      });
    }
  }

  /**
   * Search patients (admin endpoint)
   */
  async searchPatients(req, res) {
    try {
      const { query, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const patients = await this.patientService.searchPatients(query, parseInt(limit));

      res.json({
        success: true,
        data: {
          patients,
          count: patients.length,
          query
        }
      });

    } catch (error) {
      console.error('Patient search error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Unable to search patients'
      });
    }
  }

  // Helper Methods

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(sessionId) {
    if (!sessionId) return [];
    return this.conversationHistory.get(sessionId) || [];
  }

  /**
   * Update conversation history
   */
  updateConversationHistory(sessionId, userMessage, botResponse) {
    if (!sessionId) return;
    
    const history = this.conversationHistory.get(sessionId) || [];
    
    history.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });
    
    history.push({
      role: 'assistant',
      content: botResponse,
      timestamp: new Date().toISOString()
    });

    // Keep only last 20 messages to prevent memory bloat
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    this.conversationHistory.set(sessionId, history);
  }

  /**
   * Generate welcome message based on patient context
   */
  generateWelcomeMessage(patientSummary) {
    if (patientSummary) {
      return `Hello! I'm MindSupport AI, your mental health companion. I see you're here for continued support with ${patientSummary.primaryDiagnosis}. I'm here to listen, provide guidance, and support you on your mental health journey. How are you feeling today?`;
    }
    
    return `Hello! I'm MindSupport AI, your compassionate mental health support assistant. I'm here to provide emotional support, mental health information, and guidance. Whether you're dealing with stress, anxiety, depression, or just need someone to talk to, I'm here for you. How can I support you today?`;
  }
}

module.exports = new ChatbotController();