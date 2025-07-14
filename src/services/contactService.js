/**
 * Contact Service - Handles contact form related API operations
 * Provides validation, submission, and error handling for contact forms
 */

import httpService, { API_ENDPOINTS } from './httpService.js';

class ContactService {
  /**
   * Submit contact form
   * @param {Object} formData - Contact form data
   * @param {string} formData.name - Contact name
   * @param {string} formData.email - Contact email
   * @param {string} formData.message - Contact message
   * @param {string} [formData.subject] - Optional subject
   * @returns {Promise} - Submission result
   */
  async submitForm(formData) {
    // Validate form data before submission
    const validation = this.validateFormData(formData);
    if (!validation.isValid) {
      throw new ContactFormError('Validation failed', validation.errors);
    }

    // Sanitize input data
    const sanitizedData = this.sanitizeFormData(formData);

    try {
      const response = await httpService.post(API_ENDPOINTS.CONTACT, sanitizedData);
      return {
        success: true,
        data: response,
        message: response.message || 'Contact form submitted successfully'
      };
    } catch (error) {
      return this.handleSubmissionError(error);
    }
  }

  /**
   * Validate form data
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result
   */
  validateFormData(formData) {
    const errors = {};
    
    // Name validation
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message || !formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    } else if (formData.message.trim().length > 2000) {
      errors.message = 'Message must be less than 2000 characters';
    }

    // Subject validation (optional)
    if (formData.subject && formData.subject.length > 200) {
      errors.subject = 'Subject must be less than 200 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate individual form field
   * @param {string} fieldName - Name of the field
   * @param {string} value - Field value
   * @returns {string|null} - Error message or null if valid
   */
  validateField(fieldName, value) {
    const tempData = { [fieldName]: value };
    const validation = this.validateFormData(tempData);
    return validation.errors[fieldName] || null;
  }

  /**
   * Check if email format is valid
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Sanitize form data
   * @param {Object} formData - Raw form data
   * @returns {Object} - Sanitized form data
   */
  sanitizeFormData(formData) {
    return {
      name: this.sanitizeString(formData.name),
      email: this.sanitizeString(formData.email).toLowerCase(),
      message: this.sanitizeString(formData.message),
      subject: formData.subject ? this.sanitizeString(formData.subject) : undefined
    };
  }

  /**
   * Sanitize string input
   * @param {string} input - String to sanitize
   * @returns {string} - Sanitized string
   */
  sanitizeString(input) {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Handle submission errors
   * @param {Error} error - Error from submission
   * @returns {Object} - Formatted error response
   */
  handleSubmissionError(error) {
    const errorResponse = {
      success: false,
      message: 'An error occurred while submitting your message',
      error: error.message
    };

    if (error.status) {
      switch (error.status) {
        case 400:
          if (error.response?.error === 'Validation Error') {
            errorResponse.message = 'Please check your form data and try again';
          } else if (error.response?.error === 'Duplicate Submission') {
            errorResponse.message = 'You have already submitted a contact form. We will get back to you soon.';
          } else {
            errorResponse.message = error.response?.message || 'Invalid request. Please check your input.';
          }
          break;
        case 408:
          errorResponse.message = 'Request timeout. Please try again.';
          break;
        case 429:
          errorResponse.message = 'Too many requests. Please wait before submitting again.';
          break;
        case 500:
          if (error.response?.error === 'Email Service Error') {
            errorResponse.message = 'Your message was received but our email service is temporarily unavailable. We will contact you soon.';
          } else {
            errorResponse.message = 'Server error. Please try again later.';
          }
          break;
        default:
          errorResponse.message = 'Network error. Please check your connection and try again.';
      }
    }

    return errorResponse;
  }

  /**
   * Check email service status
   * @returns {Promise} - Service status
   */
  async checkEmailServiceStatus() {
    try {
      const response = await httpService.get(API_ENDPOINTS.EMAIL_STATUS);
      return {
        available: true,
        status: response.status || 'operational',
        message: 'Email service is operational'
      };
    } catch (error) {
      return {
        available: false,
        status: 'unavailable',
        message: 'Email service is temporarily unavailable'
      };
    }
  }

  /**
   * Get form submission guidelines
   * @returns {Object} - Form guidelines
   */
  getFormGuidelines() {
    return {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: 'Your full name'
      },
      email: {
        required: true,
        format: 'email',
        placeholder: 'your.email@example.com'
      },
      message: {
        required: true,
        minLength: 10,
        maxLength: 2000,
        placeholder: 'Please describe your inquiry or message...'
      },
      subject: {
        required: false,
        maxLength: 200,
        placeholder: 'Optional subject line'
      }
    };
  }
}

/**
 * Custom Contact Form Error class
 */
class ContactFormError extends Error {
  constructor(message, validationErrors = null) {
    super(message);
    this.name = 'ContactFormError';
    this.validationErrors = validationErrors;
  }
}

// Rate limiting utility
class RateLimiter {
  constructor(limit = 1, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.attempts = [];
  }

  canSubmit() {
    const now = Date.now();
    this.attempts = this.attempts.filter(time => now - time < this.windowMs);
    return this.attempts.length < this.limit;
  }

  recordAttempt() {
    this.attempts.push(Date.now());
  }

  getTimeUntilNextAttempt() {
    if (this.attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...this.attempts);
    const timeSinceOldest = Date.now() - oldestAttempt;
    return Math.max(0, this.windowMs - timeSinceOldest);
  }
}

// Create singleton instances
const contactService = new ContactService();
const rateLimiter = new RateLimiter(1, 60000); // 1 submission per minute

// Export the service and utilities
export default contactService;
export { ContactService, ContactFormError, RateLimiter, rateLimiter };