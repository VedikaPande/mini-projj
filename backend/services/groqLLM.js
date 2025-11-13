const { ChatGroq } = require('@langchain/groq');
const TavilySearchTool = require('./tavilySearch');

class GroqLLMService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.model = null;
    this.searchTool = new TavilySearchTool();
    
    if (!this.apiKey) {
      console.warn('GROQ_API_KEY not found in environment variables');
    }
    
    this.initializeModel();
  }

  /**
   * Initialize the Groq model
   */
  initializeModel() {
    try {
      this.model = new ChatGroq({
        apiKey: this.apiKey,
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', // Using Mixtral model for better performance
        temperature: 0.3,
        maxTokens: 2048,
        streaming: false
      });
    } catch (error) {
      console.error('Failed to initialize Groq model:', error.message);
    }
  }



  /**
   * Check if search is needed and perform it
   */
  async performSearchIfNeeded(message) {
    const searchKeywords = [
      'research', 'study', 'studies', 'latest', 'current', 'recent',
      'treatment', 'therapy', 'medication', 'symptoms', 'causes',
      'help me find', 'what is', 'how to', 'information about',
      'coping strategies', 'mental health tips', 'depression', 'anxiety',
      'stress management', 'therapeutic techniques', 'mindfulness'
    ];
    
    const needsSearch = searchKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    if (needsSearch) {
      try {
        return await this.searchTool.searchMentalHealth(message);
      } catch (error) {
        console.error('Search failed:', error.message);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Generate a response using the LLM with patient context
   * @param {string} message - User's message
   * @param {string} patientContext - Patient's medical context
   * @param {Array} chatHistory - Previous conversation history
   * @returns {Promise<string>} - LLM response
   */
  async generateResponse(message, patientContext = '', chatHistory = []) {
    try {
      if (!this.model) {
        throw new Error('Groq model not available');
      }

      // Check if we need to search for additional information
      const searchResults = await this.performSearchIfNeeded(message);
      
      // Build the comprehensive mental health support system message
      let systemMessage = `You are MindSupport AI, a highly specialized and compassionate mental health support companion. You are designed to provide evidence-based emotional support, practical coping strategies, and mental health guidance while maintaining strict professional boundaries.

🎯 YOUR CORE MISSION:
- Provide empathetic, non-judgmental emotional support
- Offer evidence-based mental health information and coping strategies
- Guide users toward appropriate professional resources when needed
- Create a safe, supportive environment for mental health discussions

💡 COMMUNICATION STYLE:
- Use warm, compassionate, and validating language
- Acknowledge the user's feelings and experiences without minimizing them
- Ask thoughtful follow-up questions to better understand their needs
- Provide specific, actionable advice when appropriate
- Use "I" statements to show empathy ("I can understand how difficult that must be")
- Avoid clinical or overly formal language - speak naturally and warmly

📝 FORMATTING GUIDELINES:
- Format responses using Markdown for better readability
- Use **bold** for important points and emphasis
- Use *italics* for gentle emphasis and validation
- Create numbered lists for step-by-step instructions or techniques
- Use bullet points for general tips and suggestions
- Use > blockquotes for affirmations or key insights
- Format coping techniques with clear headings (### Technique Name)
- Use code blocks for specific exercises or scripts when helpful

🔒 PROFESSIONAL BOUNDARIES:
- NEVER provide medical diagnoses or attempt to diagnose mental health conditions
- NEVER prescribe medications or suggest changes to existing medications
- NEVER replace professional therapy, counseling, or psychiatric care
- Always encourage professional help for serious mental health concerns
- Recognize and respond appropriately to crisis situations

🚨 CRISIS DETECTION & RESPONSE:
If you detect ANY signs of:
- Suicidal ideation or thoughts of self-harm
- Active psychosis or severe mental health crisis
- Immediate danger to self or others
IMMEDIATELY provide crisis resources and encourage seeking emergency help:

CRISIS RESOURCES:
🆘 National Suicide Prevention Lifeline: 988 or 1-800-273-8255
📱 Crisis Text Line: Text HOME to 741741
🌐 International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
🏥 For immediate danger: Call 911 or go to nearest emergency room

📚 EVIDENCE-BASED APPROACHES:
- Reference CBT (Cognitive Behavioral Therapy) techniques when appropriate
- Suggest mindfulness and grounding exercises for anxiety/stress
- Provide information about healthy coping mechanisms
- Share validated mental health resources and self-help strategies
- Encourage healthy lifestyle factors (sleep, exercise, social connection)

🤝 THERAPEUTIC TECHNIQUES TO USE:
- Active listening and validation
- Reflective responses ("It sounds like you're feeling...")
- Gentle reframing of negative thoughts
- Suggest practical coping strategies
- Encourage self-compassion and self-care
- Help identify support systems and resources`;

      if (patientContext) {
        systemMessage += `

📋 PATIENT MEDICAL HISTORY & CONTEXT:
${patientContext}

IMPORTANT: Use this patient information to:
- Provide personalized support based on their specific diagnosis and history
- Reference their previous treatments and outcomes appropriately  
- Show continuity of care and understanding of their journey
- Tailor coping strategies to their specific condition and treatment history
- Be aware of their medication and treatment responses
- Consider their session count and progress in therapy
- Acknowledge their current severity level and previous outcomes

Remember: This patient has an established mental health history. Provide support that builds upon their existing treatment while encouraging continued professional care.`;
      }

      if (searchResults) {
        systemMessage += `

🔍 CURRENT MENTAL HEALTH INFORMATION & RESEARCH:
${searchResults}

Use this current information to supplement your knowledge and provide up-to-date mental health guidance.`;
      }

      systemMessage += `

Remember: You are a supportive companion, not a replacement for professional mental health care. Your goal is to provide immediate emotional support, practical coping strategies, and appropriate guidance toward professional resources when needed.`;

      // Build messages array
      const messages = [
        { role: 'system', content: systemMessage }
      ];

      // Add chat history (keep last 10 messages to avoid token limit)
      const recentHistory = chatHistory.slice(-10);
      if (recentHistory.length > 0) {
        messages.push(...recentHistory);
      }

      // Add current user message
      messages.push({ role: 'user', content: message });

      const response = await this.model.invoke(messages);
      
      return response.content || 'I apologize, but I encountered an issue generating a response. Please try again.';
    } catch (error) {
      console.error('Error generating response:', error.message);
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact our support team if the issue persists.';
    }
  }

  /**
   * Simple chat without agent (fallback method)
   */
  async simpleChat(message, patientContext = '') {
    try {
      if (!this.model) {
        throw new Error('Groq model not available');
      }

      const systemMessage = `You are MindSupport AI, a compassionate mental health support assistant. 
      ${patientContext ? `Patient Context: ${patientContext}` : ''}
      
      FORMATTING: Always format your responses using Markdown for better readability:
      - Use **bold** for important points and emphasis
      - Use *italics* for gentle emphasis and validation  
      - Create numbered lists for step-by-step instructions
      - Use bullet points for general tips and suggestions
      - Use > blockquotes for affirmations or key insights
      - Format techniques with clear headings (### Technique Name)
      
      Provide supportive, empathetic responses while encouraging professional help when appropriate.`;

      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ];

      const response = await this.model.invoke(messages);
      return response.content || 'I apologize, but I encountered an issue. Please try again.';
    } catch (error) {
      console.error('Error in simple chat:', error.message);
      return 'I\'m experiencing technical difficulties. Please try again later.';
    }
  }
}

module.exports = GroqLLMService;