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
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      resetToken: ''
    }
  });

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
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete={type === 'signin' ? 'current-password' : 'new-password'}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </FormControl>
                {(type === 'signup' || type === 'reset-password') && (
                  <FormDescription>
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                  </FormDescription>
                )}
                <FormMessage />
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
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="equus-form-group">
            <div style={{ marginBottom: 'var(--equus-spacing-md)' }}>
              {config.fields.map(renderField)}
            </div>

            {type === 'signin' && (
              <div className="flex items-center justify-between" style={{ 
                marginBottom: 'var(--equus-spacing-md)' 
              }}>
                <div className="text-sm">
                  <Link
                    to="/auth/reset-password"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Loading...' : config.submitText}
            </button>
          </form>
        </Form>

        <div className="text-center text-sm" style={{ 
          marginTop: 'var(--equus-spacing-md)' 
        }}>
          <span className="text-muted-foreground">{config.footerText} </span>
          <Link
            to={config.footerLink}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {config.footerLinkText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;