import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useColdStartAwareLoading } from '../hooks/useColdStartAwareLoading.js';
import contactService, { rateLimiter } from '../services/contactService.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import './ContactForm.css';

const ContactForm = () => {
  const {
    isLoading: isSubmitting,
    setLoading: setIsSubmitting,
    shouldShowColdStartUI,
  } = useColdStartAwareLoading(false);

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      message: '',
      subject: '',
    },
  });

  const guidelines = contactService.getFormGuidelines();

  const handleSubmit = async (data) => {
    if (!rateLimiter.canSubmit()) {
      const waitTime = Math.ceil(rateLimiter.getTimeUntilNextAttempt() / 1000);
      form.setError('root', {
        message: `Please wait ${waitTime} seconds before submitting again.`,
      });
      return;
    }

    const validation = contactService.validateFormData(data);
    if (!validation.isValid) {
      Object.keys(validation.errors).forEach((field) => {
        form.setError(field, { message: validation.errors[field] });
      });
      form.setError('root', {
        message: 'Please correct the errors above and try again.',
      });
      return;
    }

    setIsSubmitting(true);
    form.clearErrors();

    try {
      const result = await contactService.submitForm(data);

      if (result.success) {
        rateLimiter.recordAttempt();
        form.reset();
        form.setError('root', {
          type: 'success',
          message:
            result.message ||
            'Thank you for your message! We will get back to you soon.',
        });

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
        form.setError('root', {
          message:
            result.message ||
            'Something went wrong. Please try again or contact support directly.',
        });
      }
    } catch (err) {
      form.setError('root', {
        message:
          err?.message ||
          'Something went wrong while submitting your request. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="contact-form"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
                maxLength: {
                  value: guidelines.name.maxLength,
                  message: `Name must be less than ${guidelines.name.maxLength} characters`,
                },
              }}
              render={({ field }) => (
                <FormItem className="form-group">
                  <FormLabel className="form-label">Name *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={guidelines.name.placeholder}
                      className="auth-form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="auth-error-message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field }) => (
                <FormItem className="form-group">
                  <FormLabel className="form-label">Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={guidelines.email.placeholder}
                      className="auth-form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="auth-error-message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              rules={{
                maxLength: {
                  value: guidelines.subject.maxLength,
                  message: `Subject must be less than ${guidelines.subject.maxLength} characters`,
                },
              }}
              render={({ field }) => (
                <FormItem className="form-group">
                  <FormLabel className="form-label">Subject</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={guidelines.subject.placeholder}
                      className="auth-form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="auth-error-message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              rules={{
                required: 'Message is required',
                minLength: {
                  value: 10,
                  message: 'Message must be at least 10 characters',
                },
                maxLength: {
                  value: guidelines.message.maxLength,
                  message: `Message must be less than ${guidelines.message.maxLength} characters`,
                },
              }}
              render={({ field }) => (
                <FormItem className="form-group">
                  <FormLabel className="form-label">Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={guidelines.message.placeholder}
                      className="auth-form-input"
                      rows="6"
                      {...field}
                    />
                  </FormControl>
                  <div className="message-counter">
                    {field.value.length} / {guidelines.message.maxLength}
                  </div>
                  <FormMessage className="auth-error-message" />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <Alert
                variant={
                  form.formState.errors.root.type === 'success'
                    ? 'success'
                    : 'destructive'
                }
                className="auth-alert"
                id="submit-status"
              >
                <AlertTitle>
                  {form.formState.errors.root.type === 'success'
                    ? 'Success'
                    : 'Error'}
                </AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="form-actions">
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                variant="equus"
                size="lg"
                className="w-full"
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
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default ContactForm;
