import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useColdStartAwareLoading } from '../hooks/useColdStartAwareLoading.js';
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
  const [submitStatus, setSubmitStatus] = useState(null);
  const [touched, setTouched] = useState({});

  const {
    isLoading: isSubmitting,
    setLoading: setIsSubmitting,
    shouldShowColdStartUI,
  } = useColdStartAwareLoading(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }

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

    if (!rateLimiter.canSubmit()) {
      const waitTime = Math.ceil(rateLimiter.getTimeUntilNextAttempt() / 1000);
      setSubmitStatus({
        type: 'error',
        message: `Please wait ${waitTime} seconds before submitting again.`,
      });
      return;
    }

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

        setFormData({
          name: '',
          email: '',
          message: '',
          subject: '',
        });
        setTouched({});

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
          message:
            result.message ||
            'Something went wrong. Please try again or contact support directly.',
        });
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message:
          err?.message ||
          'Something went wrong while submitting your request. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFieldValid = (fieldName) => {
    if (!touched[fieldName]) return true;
    if (!errors[fieldName]) return true;
    if (
      typeof errors[fieldName] === 'string' &&
      errors[fieldName].trim() === ''
    ) {
      return true;
    }
    return false;
  };

  const getInputClassName = (fieldName) => {
    const baseClass = 'form-input';
    if (isFieldValid(fieldName)) {
      return baseClass;
    }
    return `${baseClass} error`;
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'message'];
    const hasRequiredFields = requiredFields.every((field) => {
      const value = formData[field]?.trim();
      return value && value.length > 0;
    });

    const hasErrors = Object.values(errors).some(
      (error) => error && error.trim().length > 0,
    );

    return hasRequiredFields && !hasErrors;
  };

  const guidelines = contactService.getFormGuidelines();

  return (
    <section className="contact-form-container">
      <div className="contact-form-layout">
        <aside className="contact-info">
          <h4 className="contact-info__heading">Let&apos;s Connect</h4>
          <p className="contact-intro">
            Share a little about your AI goals and our team will respond with
            tailored next steps.
          </p>

          <div className="contact-cta">
            <p>
              <strong>Ready to transform your operations with AI?</strong>
            </p>
            <p>
              Reach out today to discuss your vision and let us guide you from
              strategy to deployment with precision, agility, and measurable
              impact.
            </p>
          </div>

          <div className="contact-meta">
            <div className="contact-meta__item">
              <span className="contact-meta__label">Response Time</span>
              <span className="contact-meta__value">Within 24 hours</span>
            </div>
            <div className="contact-meta__item">
              <span className="contact-meta__label">Email</span>
              <a
                className="contact-meta__link"
                href="mailto:hello@equussystems.co"
              >
                info@equussystems.co
              </a>
            </div>
          </div>
          <div className="signin-invitation">
            <p>Ready to unlock your personalised AI journey?</p>
            <p>Join our community!</p>
            <Link to="/auth/signin" className="signin-invitation-link">
              Sign in or register
            </Link>
          </div>
        </aside>

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
                  {shouldShowColdStartUI && shouldShowColdStartUI()
                    ? 'Starting server...'
                    : 'Sending...'}
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
                {submitStatus.type === 'success' ? '\u2713' : '!'}
              </div>
              <div className="status-text">{submitStatus.message}</div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
