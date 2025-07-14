import { useState, useCallback } from 'react';
import contactService, { rateLimiter } from '../services/contactService.js';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }

      // Clear submit status when user modifies form
      if (submitStatus) {
        setSubmitStatus(null);
      }
    },
    [errors, submitStatus],
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    const error = contactService.validateField(name, value);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check rate limiting
    if (!rateLimiter.canSubmit()) {
      const waitTime = Math.ceil(rateLimiter.getTimeUntilNextAttempt() / 1000);
      setSubmitStatus({
        type: 'error',
        message: `Please wait ${waitTime} seconds before submitting again.`,
      });
      return;
    }

    // Validate entire form
    const validation = contactService.validateFormData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitStatus({
        type: 'error',
        message: 'Please correct the errors above and try again.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    try {
      const result = await contactService.submitForm(formData);

      if (result.success) {
        rateLimiter.recordAttempt();
        setSubmitStatus({
          type: 'success',
          message:
            result.message ||
            'Thank you for your message! We will get back to you soon.',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          subject: '',
        });
        setTouched({});

        // Scroll to success message
        setTimeout(() => {
          const statusElement = document.getElementById('submit-status');
          if (statusElement) {
            statusElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
        }, 100);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'An error occurred. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = 'form-input';
    const hasError = errors[fieldName];
    const hasValue = formData[fieldName].trim().length > 0;
    const isTouched = touched[fieldName];

    let className = baseClass;

    if (hasError) {
      className += ' error';
    } else if (hasValue && isTouched) {
      className += ' success';
    }

    return className;
  };

  const isFormValid = () => {
    const { name, email, message } = formData;

    // Check if all required fields have content
    const hasRequiredFields =
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      message.trim().length > 0;

    // Check if there are any actual error messages (not empty strings)
    const hasErrors = Object.values(errors).some(
      (error) => error && error.trim().length > 0,
    );

    return hasRequiredFields && !hasErrors;
  };

  const guidelines = contactService.getFormGuidelines();

  return (
    <div className="contact-form-container">
      <div className="contact-form-wrapper">
        <div className="contact-info">
          <h4>Unlock Your AI Potential</h4>
          <p className="contact-intro">
            Are you exploring how to integrate AI into your business strategy—or
            seeking hands‑on development of cutting‑edge AI systems? We offer a
            comprehensive suite of services:
          </p>

          <div className="services-preview">
            <div className="service-preview-item">
              <h5>Strategic AI Consulting</h5>
              <p>
                In-depth assessments to identify high-impact opportunities,
                define success metrics, and align AI initiatives with your core
                business goals
              </p>
            </div>

            <div className="service-preview-item">
              <h5>Custom AI Development</h5>
              <p>
                End-to-end delivery—from agentic AI solutions and
                knowledge-graph–driven architectures, to seamless integration
                and optimization
              </p>
            </div>

            <div className="service-preview-item">
              <h5>Agentic Workflows & Graph Flows</h5>
              <p>
                We build autonomous, multi-agent systems powered by intelligent
                graph structures that coordinate tasks, contextual
                decision-making, and dynamic execution without human bottlenecks
              </p>
            </div>
          </div>

          <div className="contact-cta">
            <p>
              <strong>Ready to transform your operations with AI?</strong>
            </p>
            <p>
              Reach out today to discuss your vision—and let us guide you from
              strategy to deployment with precision, agility, and measurable
              impact.
            </p>
          </div>

          <div className="contact-details">
            <div className="contact-item">
              <strong>Response Time:</strong> Within 24 hours
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={guidelines.name.placeholder}
              className={getInputClassName('name')}
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
              required
              maxLength={guidelines.name.maxLength}
            />
            {errors.name && (
              <div id="name-error" className="error-message" role="alert">
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={guidelines.email.placeholder}
              className={getInputClassName('email')}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
              required
            />
            {errors.email && (
              <div id="email-error" className="error-message" role="alert">
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={guidelines.subject.placeholder}
              className={getInputClassName('subject')}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              aria-invalid={errors.subject ? 'true' : 'false'}
              maxLength={guidelines.subject.maxLength}
            />
            {errors.subject && (
              <div id="subject-error" className="error-message" role="alert">
                {errors.subject}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={guidelines.message.placeholder}
              className={getInputClassName('message')}
              aria-describedby={
                errors.message ? 'message-error' : 'message-counter'
              }
              aria-invalid={errors.message ? 'true' : 'false'}
              required
              rows="6"
              maxLength={guidelines.message.maxLength}
            />
            <div className="message-counter" id="message-counter">
              {formData.message.length} / {guidelines.message.maxLength}
            </div>
            {errors.message && (
              <div id="message-error" className="error-message" role="alert">
                {errors.message}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              aria-describedby="submit-status"
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>

          {submitStatus && (
            <div
              id="submit-status"
              role="alert"
              className={`status-message ${submitStatus.type}`}
              aria-live="polite"
            >
              <div className="status-icon" aria-hidden="true">
                {submitStatus.type === 'success' ? '✓' : '!'}
              </div>
              <div className="status-text">{submitStatus.message}</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
