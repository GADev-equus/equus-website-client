/**
 * SignUpForm - Sign up form component using AuthForm
 * Handles user registration with validation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import authService from '@/services/authService';

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await authService.signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      
      if (result.success) {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        // Redirect to sign in after a delay
        setTimeout(() => {
          navigate('/auth/signin', { 
            state: { 
              message: 'Please check your email and verify your account before signing in.' 
            }
          });
        }, 3000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      type="signup"
      onSubmit={handleSignUp}
      loading={loading}
      error={error}
      success={success}
    />
  );
};

export default SignUpForm;