/**
 * AuthForm - Reusable authentication form component
 * Handles sign in, sign up, and password reset forms with validation
 * Uses CSS classes and Fieldset component for consistent styling
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Fieldset } from '@/components/ui';
import './AuthForm.css';

const AuthForm = ({
  type = 'signin',
  onSubmit,
  loading = false,
  error = null,
  success = null,
  shouldShowColdStartUI = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      resetToken: '',
    },
  });

  const getFormConfig = () => {
    switch (type) {
      case 'signup':
        return {
          title: 'Create Account',
          description: 'Sign up for a new account to get started',
          submitText: 'Create Account',
          fields: [
            'firstName',
            'lastName',
            'email',
            'password',
            'confirmPassword',
          ],
          footerText: 'Already have an account?',
          footerLink: '/auth/signin',
          footerLinkText: 'Sign in',
        };
      case 'reset-request':
        return {
          title: 'Reset Password',
          description: 'Enter your email to receive a password reset link',
          submitText: 'Send Reset Link',
          fields: ['email'],
          footerText: 'Remember your password?',
          footerLink: '/auth/signin',
          footerLinkText: 'Back to sign in',
        };
      case 'reset-password':
        return {
          title: 'Set New Password',
          description: 'Enter your new password below',
          submitText: 'Update Password',
          fields: ['password', 'confirmPassword', 'resetToken'],
          footerText: 'Password updated?',
          footerLink: '/auth/signin',
          footerLinkText: 'Sign in',
        };
      default: // signin
        return {
          title: 'Sign In',
          description: 'Welcome back! Please sign in to your account',
          submitText: 'Sign In',
          fields: ['email', 'password'],
          footerText: "Don't have an account?",
          footerLink: '/auth/signup',
          footerLinkText: 'Sign up',
        };
    }
  };

  const config = getFormConfig();

  const validatePassword = (value) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return true;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  };

  const handleSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  // Check if form is valid for submit button state
  const isFormValid = () => {
    const values = form.getValues();

    // Check if all required fields have values
    const hasRequiredFields = config.fields.every((fieldName) => {
      if (fieldName === 'resetToken') return true; // Hidden field, always valid
      const value = values[fieldName];
      return value && value.toString().trim().length > 0;
    });

    // Check if there are any form errors
    const formState = form.formState;
    const hasErrors = Object.keys(formState.errors).length > 0;

    // For form validation to work properly, we need to check if form has been touched
    // and if it's dirty (has been modified)
    const isFormTouched =
      formState.isDirty || Object.keys(formState.touchedFields).length > 0;

    return hasRequiredFields && !hasErrors && isFormTouched;
  };

  const renderField = (fieldName) => {
    switch (fieldName) {
      case 'firstName':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="firstName"
            rules={{
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters',
              },
            }}
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-form-label">First Name *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    className="auth-form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="auth-error-message" />
              </FormItem>
            )}
          />
        );

      case 'lastName':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="lastName"
            rules={{
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters',
              },
            }}
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-form-label">Last Name *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    className="auth-form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="auth-error-message" />
              </FormItem>
            )}
          />
        );

      case 'email':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required',
              validate: validateEmail,
            }}
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-form-label">Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="auth-form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="auth-error-message" />
              </FormItem>
            )}
          />
        );

      case 'password':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="password"
            rules={{
              required: 'Password is required',
              validate: validatePassword,
            }}
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-form-label">Password *</FormLabel>
                <FormControl>
                  <div className="auth-password-container">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete={
                        type === 'signin' ? 'current-password' : 'new-password'
                      }
                      className="auth-form-input"
                      {...field}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="auth-error-message" />
                {type !== 'signin' && (
                  <FormDescription className="auth-form-field-description">
                    Password must be at least 8 characters and include
                    uppercase, lowercase, and number
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
        );

      case 'confirmPassword':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: (value) =>
                value === form.watch('password') || 'Passwords do not match',
            }}
            render={({ field }) => (
              <FormItem className="auth-form-group">
                <FormLabel className="auth-form-label">
                  Confirm Password *
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="auth-form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="auth-error-message" />
              </FormItem>
            )}
          />
        );

      case 'resetToken':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="resetToken"
            render={({ field }) => <input type="hidden" {...field} />}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-form-container">
      <Fieldset legend={config.title.toUpperCase()} size="lg">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <p className="auth-form-description">{config.description}</p>
          </div>

          <div className="auth-form-content">
            {error && (
              <div className="auth-alert error">
                <div className="auth-alert-icon">!</div>
                <div className="auth-alert-text">{error}</div>
              </div>
            )}

            {success && (
              <div className="auth-alert success">
                <div className="auth-alert-icon">✓</div>
                <div className="auth-alert-text">{success}</div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div>{config.fields.map(renderField)}</div>

                {type === 'signin' && (
                  <div className="auth-additional-links">
                    <Link
                      to="/auth/reset-password"
                      className="auth-additional-link"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <div className="auth-form-actions">
                  <Button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    variant="equus"
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <span className="auth-loading-spinner"></span>
                        {shouldShowColdStartUI
                          ? 'Starting server...'
                          : 'Please wait...'}
                      </>
                    ) : (
                      config.submitText
                    )}
                  </Button>
                </div>

                {type === 'signup' && (
                  <div className="auth-terms">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms">Terms of Service</Link> and{' '}
                    <Link to="/privacy">Privacy Policy</Link>.
                  </div>
                )}
              </form>
            </Form>
          </div>

          <div className="auth-form-footer">
            <p className="auth-form-footer-text">{config.footerText}</p>
            <Link to={config.footerLink} className="auth-form-footer-link">
              {config.footerLinkText}
            </Link>
          </div>
        </div>
      </Fieldset>
    </div>
  );
};

export default AuthForm;
