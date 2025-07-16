/**
 * PasswordResetForm - Password reset form components
 * Handles both password reset request and password reset confirmation
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from './AuthForm';
import authService from '@/services/authService';

const PasswordResetRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleResetRequest = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await authService.requestPasswordReset(data.email);
      
      if (result.success) {
        setSuccess('Password reset link sent! Please check your email for instructions.');
      } else {
        setError(result.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      type="reset-request"
      onSubmit={handleResetRequest}
      loading={loading}
      error={error}
      success={success}
    />
  );
};

const PasswordResetForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handlePasswordReset = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Invalid reset link. Please request a new password reset.');
        return;
      }

      const result = await authService.resetPassword({
        token,
        newPassword: data.password
      });
      
      if (result.success) {
        setSuccess('Password updated successfully! Redirecting to sign in...');
        setTimeout(() => {
          navigate('/auth/signin', { 
            state: { 
              message: 'Password updated successfully. Please sign in with your new password.' 
            }
          });
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Invalid Reset Link</h2>
        <p className="text-muted-foreground mb-6">
          This password reset link is invalid or has expired.
        </p>
        <a 
          href="/auth/reset-password" 
          className="text-primary hover:text-primary/80 underline"
        >
          Request a new password reset
        </a>
      </div>
    );
  }

  return (
    <AuthForm
      type="reset-password"
      onSubmit={handlePasswordReset}
      loading={loading}
      error={error}
      success={success}
    />
  );
};

export { PasswordResetRequestForm, PasswordResetForm };
export default PasswordResetForm;