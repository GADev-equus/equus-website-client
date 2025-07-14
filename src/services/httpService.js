/**
 * HTTP Service - Centralized HTTP client for API communication
 * Provides a consistent interface for making API requests with error handling
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://equus-website-api.onrender.com' 
  : 'http://localhost:8000';

class HttpService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.defaultTimeout = 10000; // 10 seconds
  }

  /**
   * Generic request method
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

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
        throw new HttpError(
          data.message || `HTTP Error: ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new HttpError('Request timeout', 408);
      }
      
      if (error instanceof HttpError) {
        throw error;
      }
      
      // Network or other errors
      throw new HttpError(
        error.message || 'Network error occurred',
        0,
        { originalError: error }
      );
    }
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
}

// Create singleton instance
const httpService = new HttpService();

// Export both the instance and the class for flexibility
export default httpService;
export { HttpService, HttpError };

// Common API endpoints
export const API_ENDPOINTS = {
  CONTACT: '/api/email/contact',
  EMAIL_STATUS: '/api/email/status',
  HEALTH: '/health',
};