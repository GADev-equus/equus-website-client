/**
 * Form Service - Enhanced form handling utilities with React Hook Form integration
 * Provides validation schemas, form utilities, and common form patterns
 */

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  name: /^[a-zA-Z\s'-]{2,50}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Common validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: {
    minLength: 'Password must be at least 8 characters long',
    pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  },
  name: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be no more than ${max} characters`,
  min: (min) => `Must be at least ${min}`,
  max: (max) => `Must be no more than ${max}`,
  match: (field) => `Must match ${field}`,
  unique: 'This value is already taken'
};

class FormService {
  /**
   * Get validation rules for common fields
   * @param {string} fieldType - Type of field (email, password, etc.)
   * @param {Object} options - Additional validation options
   * @returns {Object} - Validation rules object
   */
  getValidationRules(fieldType, options = {}) {
    const rules = { required: options.required !== false ? VALIDATION_MESSAGES.required : false };

    switch (fieldType) {
      case 'email':
        rules.pattern = {
          value: VALIDATION_PATTERNS.email,
          message: options.message || VALIDATION_MESSAGES.email
        };
        break;

      case 'password':
        rules.minLength = {
          value: options.minLength || VALIDATION_PATTERNS.password.minLength,
          message: options.minMessage || VALIDATION_MESSAGES.password.minLength
        };
        if (options.strong !== false) {
          rules.pattern = {
            value: VALIDATION_PATTERNS.password.pattern,
            message: options.patternMessage || VALIDATION_MESSAGES.password.pattern
          };
        }
        break;

      case 'confirmPassword':
        rules.validate = (value) => {
          if (!options.passwordValue) return true;
          return value === options.passwordValue || VALIDATION_MESSAGES.match('password');
        };
        break;

      case 'name':
        rules.pattern = {
          value: VALIDATION_PATTERNS.name,
          message: options.message || VALIDATION_MESSAGES.name
        };
        rules.minLength = {
          value: options.minLength || 2,
          message: options.minMessage || VALIDATION_MESSAGES.minLength(options.minLength || 2)
        };
        rules.maxLength = {
          value: options.maxLength || 50,
          message: options.maxMessage || VALIDATION_MESSAGES.maxLength(options.maxLength || 50)
        };
        break;

      case 'phone':
        rules.pattern = {
          value: VALIDATION_PATTERNS.phone,
          message: options.message || VALIDATION_MESSAGES.phone
        };
        break;

      case 'url':
        rules.pattern = {
          value: VALIDATION_PATTERNS.url,
          message: options.message || VALIDATION_MESSAGES.url
        };
        break;

      case 'number':
        if (options.min !== undefined) {
          rules.min = {
            value: options.min,
            message: options.minMessage || VALIDATION_MESSAGES.min(options.min)
          };
        }
        if (options.max !== undefined) {
          rules.max = {
            value: options.max,
            message: options.maxMessage || VALIDATION_MESSAGES.max(options.max)
          };
        }
        break;

      case 'text':
        if (options.minLength) {
          rules.minLength = {
            value: options.minLength,
            message: options.minMessage || VALIDATION_MESSAGES.minLength(options.minLength)
          };
        }
        if (options.maxLength) {
          rules.maxLength = {
            value: options.maxLength,
            message: options.maxMessage || VALIDATION_MESSAGES.maxLength(options.maxLength)
          };
        }
        break;

      default:
        break;
    }

    // Add custom validation
    if (options.validate) {
      rules.validate = options.validate;
    }

    return rules;
  }

  /**
   * Create form schema for authentication forms
   * @param {string} formType - Type of form (signin, signup, reset, etc.)
   * @returns {Object} - Form schema
   */
  getAuthFormSchema(formType) {
    const schemas = {
      signin: {
        email: this.getValidationRules('email'),
        password: this.getValidationRules('password', { strong: false })
      },
      signup: {
        firstName: this.getValidationRules('name'),
        lastName: this.getValidationRules('name'),
        email: this.getValidationRules('email'),
        password: this.getValidationRules('password'),
        confirmPassword: this.getValidationRules('confirmPassword')
      },
      resetRequest: {
        email: this.getValidationRules('email')
      },
      resetPassword: {
        password: this.getValidationRules('password'),
        confirmPassword: this.getValidationRules('confirmPassword')
      },
      changePassword: {
        currentPassword: this.getValidationRules('password', { strong: false }),
        newPassword: this.getValidationRules('password'),
        confirmPassword: this.getValidationRules('confirmPassword')
      }
    };

    return schemas[formType] || {};
  }

  /**
   * Create form schema for user profile forms
   * @returns {Object} - Profile form schema
   */
  getProfileFormSchema() {
    return {
      firstName: this.getValidationRules('name'),
      lastName: this.getValidationRules('name'),
      email: this.getValidationRules('email'),
      phone: this.getValidationRules('phone', { required: false }),
      bio: this.getValidationRules('text', { 
        required: false, 
        maxLength: 500,
        maxMessage: 'Bio must be no more than 500 characters'
      })
    };
  }

  /**
   * Create form schema for contact forms
   * @returns {Object} - Contact form schema
   */
  getContactFormSchema() {
    return {
      name: this.getValidationRules('name'),
      email: this.getValidationRules('email'),
      subject: this.getValidationRules('text', {
        minLength: 5,
        maxLength: 100
      }),
      message: this.getValidationRules('text', {
        minLength: 10,
        maxLength: 1000
      })
    };
  }

  /**
   * Sanitize form data before submission
   * @param {Object} data - Form data
   * @returns {Object} - Sanitized data
   */
  sanitizeFormData(data) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Trim whitespace
        sanitized[key] = value.trim();
        
        // Remove null bytes and normalize whitespace
        sanitized[key] = sanitized[key].replace(/\0/g, '').replace(/\s+/g, ' ');
      } else {
        sanitized[key] = value;
      }
    }
    
    // Remove empty string values
    return Object.fromEntries(
      Object.entries(sanitized).filter(([, value]) => value !== '')
    );
  }

  /**
   * Format form errors for display
   * @param {Object} errors - React Hook Form errors object
   * @returns {Array} - Array of error messages
   */
  formatFormErrors(errors) {
    const errorMessages = [];
    
    for (const [field, error] of Object.entries(errors)) {
      if (error?.message) {
        errorMessages.push({
          field,
          message: error.message
        });
      }
    }
    
    return errorMessages;
  }

  /**
   * Get form field state classes for styling
   * @param {Object} fieldState - React Hook Form field state
   * @returns {string} - CSS classes
   */
  getFieldStateClasses(fieldState) {
    const classes = [];
    
    if (fieldState.invalid) {
      classes.push('field-error');
    }
    
    if (fieldState.isDirty) {
      classes.push('field-dirty');
    }
    
    if (fieldState.isTouched) {
      classes.push('field-touched');
    }
    
    return classes.join(' ');
  }

  /**
   * Create async validation function
   * @param {Function} validator - Async validator function
   * @param {number} debounceMs - Debounce delay in milliseconds
   * @returns {Function} - Debounced validation function
   */
  createAsyncValidator(validator, debounceMs = 300) {
    let timeoutId;
    
    return (value) => {
      return new Promise((resolve) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            const result = await validator(value);
            resolve(result);
          } catch (error) {
            resolve(error.message || 'Validation failed');
          }
        }, debounceMs);
      });
    };
  }

  /**
   * Create form default values
   * @param {Object} schema - Form schema
   * @param {Object} initialData - Initial data to populate
   * @returns {Object} - Default values object
   */
  createDefaultValues(schema, initialData = {}) {
    const defaults = {};
    
    for (const field of Object.keys(schema)) {
      defaults[field] = initialData[field] || '';
    }
    
    return defaults;
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result with strength score
   */
  validatePasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    const strength = score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong';
    
    return {
      isValid: score >= 4,
      score,
      strength,
      checks,
      message: this.getPasswordStrengthMessage(checks)
    };
  }

  /**
   * Get password strength message
   * @param {Object} checks - Password validation checks
   * @returns {string} - Strength message
   */
  getPasswordStrengthMessage(checks) {
    const missing = [];
    
    if (!checks.length) missing.push('at least 8 characters');
    if (!checks.lowercase) missing.push('a lowercase letter');
    if (!checks.uppercase) missing.push('an uppercase letter');
    if (!checks.number) missing.push('a number');
    if (!checks.special) missing.push('a special character');
    
    if (missing.length === 0) {
      return 'Strong password';
    }
    
    return `Password needs: ${missing.join(', ')}`;
  }

  /**
   * Format field value for display
   * @param {any} value - Field value
   * @param {string} type - Field type
   * @returns {string} - Formatted value
   */
  formatFieldValue(value, type) {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'phone':
        return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      default:
        return String(value);
    }
  }
}

// Create singleton instance
const formService = new FormService();

export default formService;
export { FormService };