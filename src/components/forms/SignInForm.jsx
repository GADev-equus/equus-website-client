/**
 * SignInForm - Sign in form component using AuthForm
 * Handles user authentication with email and password
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from './AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSignIn = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const result = await login(data.email, data.password);
      
      if (result.success) {
        // Navigate to intended page or home
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Sign in failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      type="signin"
      onSubmit={handleSignIn}
      loading={loading}
      error={error}
    />
  );
};

export default SignInForm;