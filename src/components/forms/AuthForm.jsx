/**
 * AuthForm - Reusable authentication form component
 * Handles sign in, sign up, and password reset forms with validation
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

const AuthForm = ({ 
  type = 'signin', 
  onSubmit, 
  loading = false, 
  error = null,
  success = null,
  className = '' 
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
      resetToken: ''
    }
  });

  // Watch form values to trigger re-render when they change
  const watchedValues = form.watch();

  const getFormConfig = () => {
    switch (type) {
      case 'signup':
        return {
          title: 'Create Account',
          description: 'Sign up for a new account to get started',
          submitText: 'Create Account',
          fields: ['firstName', 'lastName', 'email', 'password', 'confirmPassword'],
          footerText: 'Already have an account?',
          footerLink: '/auth/signin',
          footerLinkText: 'Sign in'
        };
      case 'reset-request':
        return {
          title: 'Reset Password',
          description: 'Enter your email to receive a password reset link',
          submitText: 'Send Reset Link',
          fields: ['email'],
          footerText: 'Remember your password?',
          footerLink: '/auth/signin',
          footerLinkText: 'Back to sign in'
        };
      case 'reset-password':
        return {
          title: 'Set New Password',
          description: 'Enter your new password below',
          submitText: 'Update Password',
          fields: ['password', 'confirmPassword', 'resetToken'],
          footerText: 'Password updated?',
          footerLink: '/auth/signin',
          footerLinkText: 'Sign in'
        };
      default: // signin
        return {
          title: 'Sign In',
          description: 'Welcome back! Please sign in to your account',
          submitText: 'Sign In',
          fields: ['email', 'password'],
          footerText: "Don't have an account?",
          footerLink: '/auth/signup',
          footerLinkText: 'Sign up'
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
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return 'Password must contain at least one special character';
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

  const handleSubmit = (data) => {
    // Remove empty fields
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== '')
    );
    onSubmit(cleanData);
  };

  const isFormValid = () => {
    const values = form.getValues();
    const config = getFormConfig();
    
    // Check if all required fields have values
    const hasRequiredFields = config.fields.every(fieldName => {
      if (fieldName === 'resetToken') return true; // Hidden field, always valid
      const value = values[fieldName];
      return value && value.toString().trim().length > 0;
    });
    
    // Check if there are any form errors
    const formState = form.formState;
    const hasErrors = Object.keys(formState.errors).length > 0;
    
    // For form validation to work properly, we need to check if form has been touched
    // and if it's dirty (has been modified)
    const isFormTouched = formState.isDirty || Object.keys(formState.touchedFields).length > 0;
    
    return hasRequiredFields && !hasErrors && isFormTouched;
  };

  const renderField = (fieldName) => {
    switch (fieldName) {
      case 'email':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required',
              validate: validateEmail
            }}
            render={({ field }) => (
              <FormItem style={{ marginBottom: 'var(--equus-spacing-md)' }}>
                <FormLabel style={{
                  display: 'block',
                  marginBottom: 'var(--equus-spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--equus-secondary)',
                  fontSize: '1rem',
                  textAlign: 'left'
                }}>
                  Email *
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'var(--equus-border-width) solid #e1e8ed',
                      borderRadius: 'var(--equus-border-radius)',
                      fontSize: '1rem',
                      fontFamily: 'var(--equus-font-base)',
                      lineHeight: 'var(--equus-line-height-base)',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: 'var(--equus-background-white)',
                      boxSizing: 'border-box'
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage style={{
                  color: 'var(--equus-accent)',
                  fontSize: '0.875rem',
                  marginTop: 'var(--equus-spacing-xs)'
                }} />
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
              ...(type === 'signup' || type === 'reset-password' ? { validate: validatePassword } : {})
            }}
            render={({ field }) => (
              <FormItem style={{ marginBottom: 'var(--equus-spacing-md)' }}>
                <FormLabel style={{
                  display: 'block',
                  marginBottom: 'var(--equus-spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--equus-secondary)',
                  fontSize: '1rem',
                  textAlign: 'left'
                }}>
                  Password *
                </FormLabel>
                <FormControl>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete={type === 'signin' ? 'current-password' : 'new-password'}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: 'var(--equus-border-width) solid #e1e8ed',
                        borderRadius: 'var(--equus-border-radius)',
                        fontSize: '1rem',
                        fontFamily: 'var(--equus-font-base)',
                        lineHeight: 'var(--equus-line-height-base)',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        backgroundColor: 'var(--equus-background-white)',
                        boxSizing: 'border-box'
                      }}
                      {...field}
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--equus-text-secondary)',
                        fontSize: '1rem'
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </FormControl>
                {(type === 'signup' || type === 'reset-password') && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--equus-text-secondary)',
                    marginTop: 'var(--equus-spacing-xs)'
                  }}>
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                  </div>
                )}
                <FormMessage style={{
                  color: 'var(--equus-accent)',
                  fontSize: '0.875rem',
                  marginTop: 'var(--equus-spacing-xs)'
                }} />
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
              validate: (value) => value === form.watch('password') || 'Passwords do not match'
            }}
            render={({ field }) => (
              <FormItem style={{ marginBottom: 'var(--equus-spacing-md)' }}>
                <FormLabel style={{
                  display: 'block',
                  marginBottom: 'var(--equus-spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--equus-secondary)',
                  fontSize: '1rem',
                  textAlign: 'left'
                }}>
                  Confirm Password *
                </FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'var(--equus-border-width) solid #e1e8ed',
                      borderRadius: 'var(--equus-border-radius)',
                      fontSize: '1rem',
                      fontFamily: 'var(--equus-font-base)',
                      lineHeight: 'var(--equus-line-height-base)',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: 'var(--equus-background-white)',
                      boxSizing: 'border-box'
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage style={{
                  color: 'var(--equus-accent)',
                  fontSize: '0.875rem',
                  marginTop: 'var(--equus-spacing-xs)'
                }} />
              </FormItem>
            )}
          />
        );

      case 'firstName':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name="firstName"
            rules={{
              required: 'First name is required',
              minLength: { value: 2, message: 'First name must be at least 2 characters' }
            }}
            render={({ field }) => (
              <FormItem style={{ marginBottom: 'var(--equus-spacing-md)' }}>
                <FormLabel style={{
                  display: 'block',
                  marginBottom: 'var(--equus-spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--equus-secondary)',
                  fontSize: '1rem',
                  textAlign: 'left'
                }}>
                  First Name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'var(--equus-border-width) solid #e1e8ed',
                      borderRadius: 'var(--equus-border-radius)',
                      fontSize: '1rem',
                      fontFamily: 'var(--equus-font-base)',
                      lineHeight: 'var(--equus-line-height-base)',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: 'var(--equus-background-white)',
                      boxSizing: 'border-box'
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage style={{
                  color: 'var(--equus-accent)',
                  fontSize: '0.875rem',
                  marginTop: 'var(--equus-spacing-xs)'
                }} />
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
              minLength: { value: 2, message: 'Last name must be at least 2 characters' }
            }}
            render={({ field }) => (
              <FormItem style={{ marginBottom: 'var(--equus-spacing-md)' }}>
                <FormLabel style={{
                  display: 'block',
                  marginBottom: 'var(--equus-spacing-xs)',
                  fontWeight: '600',
                  color: 'var(--equus-secondary)',
                  fontSize: '1rem',
                  textAlign: 'left'
                }}>
                  Last Name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'var(--equus-border-width) solid #e1e8ed',
                      borderRadius: 'var(--equus-border-radius)',
                      fontSize: '1rem',
                      fontFamily: 'var(--equus-font-base)',
                      lineHeight: 'var(--equus-line-height-base)',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: 'var(--equus-background-white)',
                      boxSizing: 'border-box'
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage style={{
                  color: 'var(--equus-accent)',
                  fontSize: '0.875rem',
                  marginTop: 'var(--equus-spacing-xs)'
                }} />
              </FormItem>
            )}
          />
        );

      case 'resetToken':
        return (
          <input
            key={fieldName}
            type="hidden"
            {...form.register('resetToken')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      maxWidth: 'var(--equus-max-width-container)',
      margin: '0 auto',
      padding: '0 var(--equus-spacing-sm)'
    }}>
      <div style={{
        background: 'var(--equus-background-white)',
        borderRadius: 'var(--equus-border-radius)',
        boxShadow: 'var(--equus-box-shadow)',
        borderLeft: 'var(--equus-border-accent) solid var(--equus-primary)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '28rem',
        margin: '0 auto'
      }}>
        <div style={{
          padding: 'var(--equus-spacing-lg)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: 'var(--equus-spacing-xs)',
            color: 'var(--equus-secondary)',
            fontFamily: 'var(--equus-font-display)'
          }}>
            {config.title}
          </h1>
          <p style={{
            color: 'var(--equus-text-secondary)',
            marginBottom: 'var(--equus-spacing-md)',
            fontSize: '0.95rem'
          }}>
            {config.description}
          </p>

          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
              padding: 'var(--equus-spacing-sm)',
              borderRadius: 'var(--equus-border-radius)',
              marginBottom: 'var(--equus-spacing-md)',
              fontSize: '0.95rem'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              padding: 'var(--equus-spacing-sm)',
              borderRadius: 'var(--equus-border-radius)',
              marginBottom: 'var(--equus-spacing-md)',
              fontSize: '0.95rem'
            }}>
              {success}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 'var(--equus-spacing-md)' }}>
                {config.fields.map(renderField)}
              </div>

              {type === 'signin' && (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--equus-spacing-md)',
                  fontSize: '0.875rem'
                }}>
                  <Link
                    to="/auth/reset-password"
                    style={{
                      color: 'var(--equus-primary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--equus-secondary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--equus-primary)'}
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginTop: 'var(--equus-spacing-lg)'
              }}>
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  style={{
                    background: 'var(--equus-gradient-primary)',
                    color: 'white',
                    border: 'none',
                    padding: 'var(--equus-spacing-sm) var(--equus-spacing-lg)',
                    borderRadius: 'var(--equus-border-radius)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: (loading || !isFormValid()) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '180px',
                    opacity: (loading || !isFormValid()) ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && isFormValid()) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && isFormValid()) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {loading ? 'Loading...' : config.submitText}
                </button>
              </div>
            </form>
          </Form>

          <div style={{ 
            textAlign: 'center',
            marginTop: 'var(--equus-spacing-md)',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: 'var(--equus-text-secondary)' }}>
              {config.footerText}{' '}
            </span>
            <Link
              to={config.footerLink}
              style={{
                color: 'var(--equus-primary)',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--equus-secondary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--equus-primary)'}
            >
              {config.footerLinkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;