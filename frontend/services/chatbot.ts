import { getToken } from '@/services/auth';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Type definitions for chatbot API
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
  patientSummary?: any;
  welcomeMessage: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    message: string;
    timestamp: string;
    sessionId: string;
    hasPatientContext: boolean;
    patientSummary?: any;
  };
  error?: string;
}

export interface SessionResponse {
  success: boolean;
  data?: ChatSession;
  error?: string;
}

export interface HistoryResponse {
  success: boolean;
  data?: {
    sessionId: string;
    history: ChatMessage[];
    messageCount: number;
  };
  error?: string;
}

export interface StatusResponse {
  success: boolean;
  data?: {
    status: string;
    services: {
      groq: boolean;
      tavily: boolean;
      database: boolean;
    };
    activeSessions: number;
    timestamp: string;
    version: string;
  };
  error?: string;
}

// Chatbot API service
const chatbotService = {
  // Start a new chat session
  startSession: async (patientId?: string): Promise<SessionResponse> => {
    try {
      const token = getToken();
      const url = token 
        ? `${API_URL}/chatbot/session/start`
        : `${API_URL}/chatbot/public/session/start`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(patientId ? { patientId } : {}),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Start session error:', error);
      return { 
        success: false, 
        error: 'Network error occurred. Please try again.' 
      };
    }
  },

  // Send a chat message
  sendMessage: async (
    message: string, 
    sessionId: string, 
    patientId?: string
  ): Promise<ChatResponse> => {
    try {
      const token = getToken();
      const url = token 
        ? `${API_URL}/chatbot/chat`
        : `${API_URL}/chatbot/public/chat`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const body: any = { message, sessionId };
      if (patientId && token) {
        body.patientId = patientId;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Send message error:', error);
      return { 
        success: false, 
        error: 'Network error occurred. Please try again.' 
      };
    }
  },

  // Get chat history for a session (requires authentication)
  getChatHistory: async (sessionId: string): Promise<HistoryResponse> => {
    try {
      const token = getToken();
      
      if (!token) {
        return { 
          success: false, 
          error: 'Authentication required for chat history' 
        };
      }

      const response = await fetch(
        `${API_URL}/chatbot/session/${sessionId}/history`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get chat history error:', error);
      return { 
        success: false, 
        error: 'Network error occurred. Please try again.' 
      };
    }
  },

  // Clear chat history for a session (requires authentication)
  clearChatHistory: async (sessionId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = getToken();
      
      if (!token) {
        return { 
          success: false, 
          error: 'Authentication required to clear chat history' 
        };
      }

      const response = await fetch(
        `${API_URL}/chatbot/session/${sessionId}/history`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Clear chat history error:', error);
      return { 
        success: false, 
        error: 'Network error occurred. Please try again.' 
      };
    }
  },

  // Get chatbot status
  getStatus: async (): Promise<StatusResponse> => {
    try {
      const token = getToken();
      const url = token 
        ? `${API_URL}/chatbot/status`
        : `${API_URL}/chatbot/public/status`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get status error:', error);
      return { 
        success: false, 
        error: 'Network error occurred. Please try again.' 
      };
    }
  },

  // Search patients (requires authentication)
  searchPatients: async (
    query: string, 
    limit: number = 10
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const token = getToken();
      
      if (!token) {
        return { 
          success: false, 
          error: 'Authentication required for patient search' 
        };
      }

      const response = await fetch(
        `${API_URL}/chatbot/patients/search?query=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search patients error:', error);
      return { 
        success: false, 
        error: 'Network error occurred. Please try again.' 
      };
    }
  },
};

export default chatbotService;