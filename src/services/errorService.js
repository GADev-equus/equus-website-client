/**
 * Error Service - Global error handling and reporting
 * Provides centralized error handling, logging, and user notification
 */

import { HttpError } from './httpService';

class ErrorService {
  constructor() {
    this.errorHandlers = new Map();
    this.errorLog = [];
    this.maxLogSize = 100;
    this.toastService = null;
    this.initializeGlobalErrorHandlers();
  }

  /**
   * Set toast service for error notifications
   * @param {Object} toastService - Toast service instance
   */
  setToastService(toastService) {
    this.toastService = toastService;
  }

  /**
   * Initialize global error handlers
   */
  initializeGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        this.handleError(event.reason, 'unhandledrejection');
        
        // Prevent default browser behavior
        event.preventDefault();
      });

      // Handle JavaScript errors
      window.addEventListener('error', (event) => {
        console.error('JavaScript error:', event.error);
        this.handleError(event.error, 'javascript');
      });
    }
  }

  /**
   * Register error handler for specific error types
   * @param {string} errorType - Type of error
   * @param {Function} handler - Error handler function
   */
  registerErrorHandler(errorType, handler) {
    if (!this.errorHandlers.has(errorType)) {
      this.errorHandlers.set(errorType, []);
    }
    this.errorHandlers.get(errorType).push(handler);
  }

  /**
   * Handle error with appropriate response
   * @param {Error|HttpError|any} error - Error to handle
   * @param {string} context - Context where error occurred
   * @param {Object} options - Additional options
   */
  handleError(error, context = 'unknown', options = {}) {
    const errorInfo = this.processError(error, context, options);
    
    // Log error
    this.logError(errorInfo);
    
    // Run registered handlers
    this.runErrorHandlers(errorInfo);
    
    // Show user notification if toast service is available
    if (this.toastService && !options.silent) {
      this.showErrorToast(errorInfo);
    }
    
    return errorInfo;
  }

  /**
   * Process error into standardized format
   * @param {Error|HttpError|any} error - Error to process
   * @param {string} context - Context where error occurred
   * @param {Object} options - Additional options
   * @returns {Object} - Processed error info
   */
  processError(error, context, options) {
    const errorInfo = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      context,
      options,
      original: error
    };

    if (error instanceof HttpError) {
      errorInfo.type = 'http';
      errorInfo.status = error.status;
      errorInfo.message = error.message;
      errorInfo.userMessage = error.userMessage;
      errorInfo.isNetworkError = error.isNetworkError;
      errorInfo.isAuthError = error.isAuthError;
      errorInfo.isValidationError = error.isValidationError;
      errorInfo.response = error.response;
    } else if (error instanceof Error) {
      errorInfo.type = 'javascript';
      errorInfo.message = error.message;
      errorInfo.stack = error.stack;
      errorInfo.name = error.name;
      errorInfo.userMessage = this.getDefaultUserMessage(error);
    } else {
      errorInfo.type = 'unknown';
      errorInfo.message = String(error);
      errorInfo.userMessage = 'An unexpected error occurred';
    }

    return errorInfo;
  }

  /**
   * Get default user message for JavaScript errors
   * @param {Error} error - JavaScript error
   * @returns {string} - User-friendly message
   */
  getDefaultUserMessage(error) {
    const errorMessages = {
      'TypeError': 'A technical error occurred. Please try again.',
      'ReferenceError': 'A technical error occurred. Please refresh the page.',
      'SyntaxError': 'A technical error occurred. Please refresh the page.',
      'NetworkError': 'Network connection failed. Please check your internet connection.',
      'ChunkLoadError': 'Failed to load application resources. Please refresh the page.'
    };

    return errorMessages[error.name] || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Log error to internal log and external services
   * @param {Object} errorInfo - Processed error info
   */
  logError(errorInfo) {
    // Add to internal log
    this.errorLog.unshift(errorInfo);
    
    // Trim log if too large
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log to console
    console.error('Error handled:', errorInfo);

    // In production, send to external error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportToExternalService(errorInfo);
    }
  }

  /**
   * Run registered error handlers
   * @param {Object} errorInfo - Processed error info
   */
  runErrorHandlers(errorInfo) {
    const handlers = this.errorHandlers.get(errorInfo.type) || [];
    const globalHandlers = this.errorHandlers.get('*') || [];
    
    [...handlers, ...globalHandlers].forEach(handler => {
      try {
        handler(errorInfo);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });
  }

  /**
   * Show error toast notification
   * @param {Object} errorInfo - Processed error info
   */
  showErrorToast(errorInfo) {
    const message = errorInfo.userMessage || errorInfo.message;
    
    if (errorInfo.type === 'http') {
      if (errorInfo.isAuthError) {
        this.toastService.error('Authentication required. Please sign in again.', {
          title: 'Authentication Error',
          action: {
            label: 'Sign In',
            onClick: () => window.location.href = '/auth/signin'
          }
        });
      } else if (errorInfo.isValidationError) {
        this.toastService.warning(message, {
          title: 'Validation Error'
        });
      } else if (errorInfo.isNetworkError) {
        this.toastService.error('Network connection failed. Please check your internet connection.', {
          title: 'Network Error',
          action: {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        });
      } else {
        this.toastService.error(message, {
          title: 'Error'
        });
      }
    } else {
      this.toastService.error(message, {
        title: 'Error'
      });
    }
  }

  /**
   * Report error to external service
   * @param {Object} errorInfo - Processed error info
   */
  reportToExternalService(errorInfo) {
    // This would integrate with services like Sentry, LogRocket, etc.
    // For now, we'll just prepare the payload
    
    const payload = {
      errorId: errorInfo.id,
      timestamp: errorInfo.timestamp,
      type: errorInfo.type,
      message: errorInfo.message,
      context: errorInfo.context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      ...(errorInfo.stack && { stack: errorInfo.stack }),
      ...(errorInfo.response && { response: errorInfo.response })
    };

    // Example: Send to error reporting service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // }).catch(console.error);
    
    console.warn('Error report payload:', payload);
  }

  /**
   * Get current user ID for error reporting
   * @returns {string|null} - User ID or null
   */
  getCurrentUserId() {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData).id : null;
    } catch {
      return null;
    }
  }

  /**
   * Get error log
   * @returns {Array} - Array of error log entries
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   * @returns {Object} - Error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      byContext: {},
      recent: this.errorLog.slice(0, 10)
    };

    this.errorLog.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.byContext[error.context] = (stats.byContext[error.context] || 0) + 1;
    });

    return stats;
  }

  /**
   * Handle API errors specifically
   * @param {HttpError} error - HTTP error
   * @param {string} context - API context
   * @returns {Object} - Processed error info
   */
  handleApiError(error, context = 'api') {
    return this.handleError(error, context, { type: 'api' });
  }

  /**
   * Handle form validation errors
   * @param {Object} errors - Form validation errors
   * @param {string} context - Form context
   * @returns {Object} - Processed error info
   */
  handleFormErrors(errors, context = 'form') {
    const errorMessage = Object.values(errors)
      .map(error => error.message)
      .join(', ');
    
    return this.handleError(new Error(errorMessage), context, { 
      type: 'validation',
      formErrors: errors
    });
  }

  /**
   * Create error handler for React components
   * @param {string} componentName - Component name
   * @returns {Function} - Error handler function
   */
  createComponentErrorHandler(componentName) {
    return (error, errorInfo) => {
      return this.handleError(error, `component:${componentName}`, {
        componentStack: errorInfo?.componentStack
      });
    };
  }
}

// Create singleton instance
const errorService = new ErrorService();

export default errorService;
export { ErrorService };