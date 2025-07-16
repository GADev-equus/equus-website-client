/**
 * Authentication Service - Handles user authentication with JWT tokens
 * Provides login, logout, registration, and token management
 */

import httpService from './httpService.js';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.refreshToken = null;
    this.initializeFromStorage();
  }

  /**
   * Initialize authentication state from localStorage
   */
  initializeFromStorage() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);

      if (token && userData) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = JSON.parse(userData);
        
        // Set default authorization header
        httpService.setDefaultHeaders({
          Authorization: `Bearer ${token}`
        });
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
      this.clearStorage();
    }
  }

  /**
   * User sign up (alias for signup)
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  async signUp(userData) {
    return this.signup(userData);
  }

  /**
   * User signup
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  async signup(userData) {
    try {
      const response = await httpService.post('/api/auth/signup', userData);
      return {
        success: true,
        data: response,
        message: response.message || 'Registration successful. Please check your email for verification.'
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * User sign in (alias for login)
   * @param {Object} credentials - Login credentials
   * @returns {Promise} - Login result
   */
  async signIn(credentials) {
    return this.login(credentials.email, credentials.password);
  }

  /**
   * User login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Login result
   */
  async login(email, password) {
    try {
      const response = await httpService.post('/api/auth/signin', { email, password });
      
      if (response.token && response.user) {
        this.setAuthData(response.token, response.refreshToken, response.user);
        return {
          success: true,
          data: response,
          user: response.user,
          message: response.message || 'Login successful'
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * User logout
   * @returns {Promise} - Logout result
   */
  async logout() {
    try {
      if (this.token) {
        await httpService.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearAuth();
      return { success: true, message: 'Logged out successfully' };
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} - Reset request result
   */
  async requestPasswordReset(email) {
    try {
      const response = await httpService.post('/api/auth/request-reset', { email });
      return {
        success: true,
        data: response,
        message: response.message || 'Password reset email sent'
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Reset token and new password
   * @returns {Promise} - Reset result
   */
  async resetPassword(resetData) {
    try {
      const response = await httpService.post('/api/auth/reset', resetData);
      return {
        success: true,
        data: response,
        message: response.message || 'Password reset successfully'
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Verify email address
   * @param {string} token - Email verification token
   * @returns {Promise} - Verification result
   */
  async verifyEmail(token) {
    try {
      const response = await httpService.post('/api/auth/verify-email', { token });
      return {
        success: true,
        data: response,
        message: response.message || 'Email verified successfully'
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise} - Refresh result
   */
  async refreshAuthToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpService.post('/api/auth/refresh', {
        refreshToken: this.refreshToken
      });

      if (response.token) {
        this.setAuthData(response.token, response.refreshToken || this.refreshToken, this.user);
        return {
          success: true,
          token: response.token
        };
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user profile
   * @returns {Promise} - User profile
   */
  async getCurrentUser() {
    try {
      const response = await httpService.get('/api/users/profile');
      this.user = response.user;
      this.updateUserInStorage(response.user);
      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Update result
   */
  async updateProfile(userData) {
    try {
      const response = await httpService.put('/api/users/profile', userData);
      this.user = response.user;
      this.updateUserInStorage(response.user);
      return {
        success: true,
        user: response.user,
        message: response.message || 'Profile updated successfully'
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Current and new password
   * @returns {Promise} - Change result
   */
  async changePassword(passwordData) {
    try {
      const response = await httpService.put('/api/users/password', passwordData);
      return {
        success: true,
        message: response.message || 'Password changed successfully'
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Set authentication data
   * @param {string} token - JWT token
   * @param {string} refreshToken - Refresh token
   * @param {Object} user - User data
   */
  setAuthData(token, refreshToken, user) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.user = user;

    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Set default authorization header
    httpService.setDefaultHeaders({
      Authorization: `Bearer ${token}`
    });

    // Setup automatic token refresh
    this.setupTokenRefresh();
  }

  /**
   * Update user data in storage
   * @param {Object} user - Updated user data
   */
  updateUserInStorage(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.clearStorage();
    this.clearTokenRefresh();
    
    // Remove authorization header
    httpService.setDefaultHeaders({
      Authorization: undefined
    });
  }

  /**
   * Clear localStorage
   */
  clearStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Handle authentication errors
   * @param {Error} error - Error object
   * @returns {Object} - Formatted error response
   */
  handleAuthError(error) {
    const errorResponse = {
      success: false,
      message: 'Authentication failed',
      error: error.message
    };

    if (error.status) {
      switch (error.status) {
        case 400:
          errorResponse.message = error.response?.message || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorResponse.message = 'Invalid credentials. Please check your email and password.';
          if (this.isAuthenticated()) {
            this.clearAuth(); // Clear invalid session
          }
          break;
        case 403:
          errorResponse.message = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorResponse.message = 'User not found.';
          break;
        case 409:
          errorResponse.message = error.response?.message || 'User already exists.';
          break;
        case 422:
          errorResponse.message = error.response?.message || 'Validation failed. Please check your input.';
          break;
        case 429:
          errorResponse.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorResponse.message = 'Server error. Please try again later.';
          break;
        default:
          errorResponse.message = 'Network error. Please check your connection.';
      }
    }

    return errorResponse;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return !!(this.token && this.user);
  }

  /**
   * Check if user is admin
   * @returns {boolean} - Admin status
   */
  isAdmin() {
    return this.user?.role === 'admin';
  }

  /**
   * Get current user
   * @returns {Object|null} - Current user data
   */
  getUser() {
    return this.user;
  }

  /**
   * Get current token
   * @returns {string|null} - Current JWT token
   */
  getToken() {
    return this.token;
  }

  /**
   * Check if token is expired (basic check)
   * @returns {boolean} - Token expiration status
   */
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   * @returns {Date|null} - Token expiration date
   */
  getTokenExpiration() {
    if (!this.token) return null;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Setup automatic token refresh
   */
  setupTokenRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    if (!this.token || !this.refreshToken) return;

    const checkAndRefresh = async () => {
      const expiration = this.getTokenExpiration();
      if (!expiration) return;

      // Refresh token 5 minutes before expiration
      const refreshTime = expiration.getTime() - (5 * 60 * 1000);
      const now = Date.now();

      if (now >= refreshTime) {
        try {
          await this.refreshAuthToken();
        } catch (error) {
          console.error('Automatic token refresh failed:', error);
          this.clearAuth();
        }
      }
    };

    // Check every minute
    this.refreshInterval = setInterval(checkAndRefresh, 60000);
    
    // Initial check
    checkAndRefresh();
  }

  /**
   * Clear token refresh interval
   */
  clearTokenRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Initialize auth service with HTTP interceptors
   */
  initializeInterceptors() {
    // Add token to requests
    httpService.addRequestInterceptor(async (config) => {
      if (this.token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle auth errors
    httpService.addErrorInterceptor(async (error) => {
      if (error.status === 401 && this.isAuthenticated()) {
        // Try to refresh token
        if (this.refreshToken) {
          try {
            const result = await this.refreshAuthToken();
            if (!result.success) {
              this.clearAuth();
            }
          } catch (refreshError) {
            this.clearAuth();
          }
        } else {
          this.clearAuth();
        }
      }
    });
  }
}

// Create singleton instance
const authService = new AuthService();

// Initialize interceptors
if (typeof window !== 'undefined') {
  authService.initializeInterceptors();
}

export default authService;
export { AuthService };