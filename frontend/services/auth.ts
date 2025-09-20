// API base URL - adjust this for your environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Utility for storing authentication token (using cookies instead of localStorage)
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    // Set a cookie that expires in 30 days
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    // Set cookie to expire immediately
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  }
};

// Type definitions
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Authentication API service
const authService = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        setToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error occurred. Please try again.' };
    }
  },

  // Log in an existing user
  login: async (userData: LoginData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        setToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred. Please try again.' };
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<{ success: boolean; data?: UserData; message?: string }> => {
    try {
      const token = getToken();
      
      if (!token) {
        return { success: false, message: 'Not authenticated' };
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: 'Network error occurred. Please try again.' };
    }
  },

  // Logout user
  logout: () => {
    removeToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

export default authService;