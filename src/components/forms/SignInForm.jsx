/**
 * SignInForm - Sign in form component using AuthForm
 * Handles user authentication with email and password
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from './AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';

const SignInForm = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Use cold start aware loading instead of basic loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState
  } = useColdStartAwareLoading(false);

  const handleSignIn = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('SignIn - Starting login request');
      console.log('SignIn - Cold start state:', { 
        shouldShowColdStart: shouldShowColdStartUI(), 
        loadingState 
      });

      const result = await login(data.email, data.password);
      
      console.log('SignIn - Login result:', result);
      
      if (result.success) {
        // Determine redirect path based on user role
        const redirectPath = location.state?.from?.pathname || 
          (result.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        
        // Navigate to role-appropriate dashboard
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message || 'Sign in failed. Please try again.');
      }
    } catch (err) {
      console.error('SignIn - Login error:', err);
      setError('An unexpected error occurred. Please try again.');
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
      shouldShowColdStartUI={shouldShowColdStartUI()}
      loadingState={loadingState}
    />
  );
};

export default SignInForm;