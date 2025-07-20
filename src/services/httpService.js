/**
 * HTTP Service - Centralized HTTP client for API communication
 * Provides a consistent interface for making API requests with error handling
 * Enhanced with interceptors, automatic token management, and cold start detection
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://equus-website-api.onrender.com' : 'http://localhost:8000');

// Cold start detection configuration
export const COLD_START_CONFIG = {
  THRESHOLD: 5000, // 5 seconds to detect cold start
  MAX_TIME: 60000, // 60 seconds maximum expected time
  ENABLED: true, // Global enable/disable
};

// Global cold start state management
let coldStartCallbacks = [];
let activeColdStarts = new Map(); // Track active cold starts by request ID

class HttpService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.defaultTimeout = 10000; // 10 seconds
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryCondition: (error) => error.status >= 500 || error.status === 0
    };
    
    // Cold start detection
    this.coldStartEnabled = COLD_START_CONFIG.ENABLED;
    this.setupColdStartDetection();
  }

  /**
   * Setup cold start detection interceptors
   */
  setupColdStartDetection() {
    // Request interceptor to add timing
    this.addRequestInterceptor((config) => {
      if (this.coldStartEnabled) {
        config.requestId = this.generateRequestId();
        config.startTime = Date.now();
        config.coldStartDetected = false;
      }
      return config;
    });

    // Response interceptor to check timing and trigger cold start if needed
    this.addResponseInterceptor((response, originalResponse) => {
      if (this.coldStartEnabled && originalResponse.config) {
        const duration = Date.now() - originalResponse.config.startTime;
        const requestId = originalResponse.config.requestId;
        
        if (duration > COLD_START_CONFIG.THRESHOLD && !originalResponse.config.coldStartDetected) {
          this.triggerColdStart(requestId, originalResponse.config.startTime, duration);
          originalResponse.config.coldStartDetected = true;
        }
        
        // End cold start for this request
        this.endColdStart(requestId, true);
      }
      return response;
    });

    // Error interceptor to handle cold start on errors
    this.addErrorInterceptor((error) => {
      if (this.coldStartEnabled && error.config) {
        const duration = Date.now() - error.config.startTime;
        const requestId = error.config.requestId;
        
        if (duration > COLD_START_CONFIG.THRESHOLD && !error.config.coldStartDetected) {
          this.triggerColdStart(requestId, error.config.startTime, duration);
          error.config.coldStartDetected = true;
        }
        
        // End cold start for this request
        this.endColdStart(requestId, false);
      }
    });
  }

  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Trigger cold start detection
   */
  triggerColdStart(requestId, startTime, duration) {
    if (!activeColdStarts.has(requestId)) {
      activeColdStarts.set(requestId, {
        startTime,
        duration,
        triggered: Date.now()
      });

      // Notify all registered callbacks
      coldStartCallbacks.forEach(callback => {
        try {
          callback('start', { requestId, startTime, duration });
        } catch (error) {
          console.error('Cold start callback error:', error);
        }
      });
    }
  }

  /**
   * End cold start for request
   */
  endColdStart(requestId, success) {
    if (activeColdStarts.has(requestId)) {
      const coldStartInfo = activeColdStarts.get(requestId);
      activeColdStarts.delete(requestId);

      // Notify callbacks of end
      coldStartCallbacks.forEach(callback => {
        try {
          callback('end', { 
            requestId, 
            success, 
            totalDuration: Date.now() - coldStartInfo.startTime 
          });
        } catch (error) {
          console.error('Cold start callback error:', error);
        }
      });
    }
  }

  /**
   * Register cold start callback
   */
  onColdStart(callback) {
    coldStartCallbacks.push(callback);
    return () => {
      const index = coldStartCallbacks.indexOf(callback);
      if (index > -1) {
        coldStartCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Enable/disable cold start detection
   */
  setColdStartEnabled(enabled) {
    this.coldStartEnabled = enabled;
  }

  /**
   * Get active cold starts
   */
  getActiveColdStarts() {
    return Array.from(activeColdStarts.entries()).map(([requestId, info]) => ({
      requestId,
      ...info,
      elapsedTime: Date.now() - info.startTime
    }));
  }

  /**
   * Check if any cold starts are active
   */
  hasColdStartsActive() {
    return activeColdStarts.size > 0;
  }

  /**
   * Generic request method with interceptors and retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async request(endpoint, options = {}) {
    // Validate endpoint
    if (endpoint === undefined || endpoint === null) {
      throw new HttpError('Endpoint is required', 400, { endpoint });
    }
    
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${cleanEndpoint}`;
    
    let config = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const requestWithRetry = async (retryCount = 0) => {
      // Add timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);
      config.signal = controller.signal;

      try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Parse response based on content type
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          const error = new HttpError(
            data.message || `HTTP Error: ${response.status}`,
            response.status,
            data
          );
          
          // Apply error interceptors
          for (const interceptor of this.errorInterceptors) {
            await interceptor(error);
          }
          
          // Check if we should retry
          if (retryCount < this.retryConfig.maxRetries && this.retryConfig.retryCondition(error)) {
            await this.delay(this.retryConfig.retryDelay * (retryCount + 1));
            return requestWithRetry(retryCount + 1);
          }
          
          throw error;
        }

        // Apply response interceptors
        let processedData = data;
        for (const interceptor of this.responseInterceptors) {
          processedData = await interceptor(processedData, response);
        }

        return processedData;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          const timeoutError = new HttpError('Request timeout', 408);
          
          // Apply error interceptors
          for (const interceptor of this.errorInterceptors) {
            await interceptor(timeoutError);
          }
          
          throw timeoutError;
        }
        
        if (error instanceof HttpError) {
          throw error;
        }
        
        // Network or other errors
        const networkError = new HttpError(
          error.message || 'Network error occurred',
          0,
          { originalError: error }
        );
        
        // Apply error interceptors
        for (const interceptor of this.errorInterceptors) {
          await interceptor(networkError);
        }
        
        // Check if we should retry for network errors
        if (retryCount < this.retryConfig.maxRetries && this.retryConfig.retryCondition(networkError)) {
          await this.delay(this.retryConfig.retryDelay * (retryCount + 1));
          return requestWithRetry(retryCount + 1);
        }
        
        throw networkError;
      }
    };

    return requestWithRetry();
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  }

  /**
   * Set default headers
   * @param {Object} headers - Headers to set
   */
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set request timeout
   * @param {number} timeout - Timeout in milliseconds
   */
  setTimeout(timeout) {
    this.defaultTimeout = timeout;
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor - Request interceptor function
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor - Response interceptor function
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   * @param {Function} interceptor - Error interceptor function
   */
  addErrorInterceptor(interceptor) {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Configure retry settings
   * @param {Object} config - Retry configuration
   */
  setRetryConfig(config) {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /**
   * Delay utility for retry logic
   * @param {number} ms - Milliseconds to wait
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear all interceptors
   */
  clearInterceptors() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
  }

  /**
   * Health check for API
   * @returns {Promise} - Health check response
   */
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return { status: 'healthy', data: response };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Get API status and metrics
   * @returns {Promise} - API status response
   */
  async getApiStatus() {
    try {
      const response = await this.get('/');
      return { status: 'online', data: response };
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  }
}

/**
 * Custom HTTP Error class
 */
class HttpError extends Error {
  constructor(message, status = 0, response = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.response = response;
    this.timestamp = new Date().toISOString();
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isTimeout() {
    return this.status === 408;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  get isValidationError() {
    return this.status === 422;
  }

  get isRateLimitError() {
    return this.status === 429;
  }

  /**
   * Get user-friendly error message
   */
  get userMessage() {
    switch (this.status) {
      case 0:
        return 'Network connection failed. Please check your internet connection.';
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You need to sign in to access this resource.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 408:
        return 'Request timeout. Please try again.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Service temporarily unavailable. Please try again later.';
      case 503:
        return 'Service maintenance in progress. Please try again later.';
      default:
        return this.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Convert error to JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      userMessage: this.userMessage,
      timestamp: this.timestamp,
      response: this.response
    };
  }
}

// Create singleton instance
const httpService = new HttpService();

// Set up default error logging interceptor
httpService.addErrorInterceptor((error) => {
  console.error('HTTP Error:', {
    message: error.message,
    status: error.status,
    timestamp: error.timestamp,
    endpoint: error.response?.url || 'unknown'
  });
});

// Cold start utility functions
export const coldStartUtils = {
  /**
   * Register global cold start callback
   */
  onColdStart: (callback) => httpService.onColdStart(callback),
  
  /**
   * Enable/disable cold start detection globally
   */
  setEnabled: (enabled) => {
    httpService.setColdStartEnabled(enabled);
    COLD_START_CONFIG.ENABLED = enabled;
  },
  
  /**
   * Get current configuration
   */
  getConfig: () => ({ ...COLD_START_CONFIG }),
  
  /**
   * Update configuration
   */
  updateConfig: (newConfig) => {
    Object.assign(COLD_START_CONFIG, newConfig);
  },
  
  /**
   * Get active cold starts
   */
  getActiveColdStarts: () => httpService.getActiveColdStarts(),
  
  /**
   * Check if cold starts are active
   */
  hasColdStartsActive: () => httpService.hasColdStartsActive(),
  
  /**
   * Manual cold start simulation (for testing)
   */
  simulateColdStart: (duration = 15000) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  }
};

// Export both the instance and the class for flexibility
export default httpService;
export { HttpService, HttpError };

// Common API endpoints
export const API_ENDPOINTS = {
  // Health and status
  HEALTH: '/health',
  STATUS: '/',
  
  // Authentication endpoints
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_SIGNIN: '/api/auth/signin',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_RESET_REQUEST: '/api/auth/request-reset',
  AUTH_RESET: '/api/auth/reset',
  AUTH_VERIFY_EMAIL: '/api/auth/verify-email',
  
  // User endpoints
  USER_PROFILE: '/api/users/profile',
  USER_PASSWORD: '/api/users/password',
  USER_ACCOUNT: '/api/users/account',
  USERS_ALL: '/api/users',
  USERS_STATS: '/api/users/admin/stats',
  
  // Email endpoints
  EMAIL_CONTACT: '/api/email/contact',
  EMAIL_STATUS: '/api/email/status',
  EMAIL_SEND: '/api/email/send',
};

// API response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Request timeout constants
export const TIMEOUT = {
  DEFAULT: 10000,
  LONG: 30000,
  SHORT: 5000,
};