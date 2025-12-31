/**
 * EmailVerification Page - Email verification page
 * Handles email verification with token from URL
 */

import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ColdStartLoader from '@/components/ui/ColdStartLoader';
import { SkipLink } from '@/components/ui/skip-link';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';
import { useAuth } from '@/contexts/AuthContext';
import { useColdStartAwareLoading } from '@/hooks/useColdStartAwareLoading';
import authService from '@/services/authService';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  // Use cold start aware loading
  const {
    isLoading: loading,
    setLoading,
    shouldShowColdStartUI,
    loadingState,
  } = useColdStartAwareLoading(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(
        'Verification token is missing. Please check your email link.',
      );
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        setLoading(true);
        const result = await authService.verifyEmail(token);

        if (result.success) {
          setStatus('success');
          setMessage(
            'Your email has been successfully verified! You can now sign in to your account.',
          );

          // Auto-redirect to sign in after 3 seconds
          setTimeout(() => {
            navigate('/auth/signin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(
            result.message ||
              'Email verification failed. The link may be expired or invalid.',
          );
        }
      } catch (err) {
        setStatus('error');
        setMessage(
          'An unexpected error occurred during verification. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        // Show cold start loader if detected, otherwise regular spinner
        if (shouldShowColdStartUI && shouldShowColdStartUI()) {
          return (
            <ColdStartLoader
              startTime={loadingState?.coldStartTime || Date.now()}
              size="lg"
            />
          );
        }
        return <LoadingSpinner size="lg" className="loading-spinner-primary" />;
      case 'success':
        return (
          <div className="verification-status-icon success">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="verification-status-icon error">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <>
      <SEOHelmet
        title={SEO_CONFIG.auth.verifyEmail.title}
        description={SEO_CONFIG.auth.verifyEmail.description}
        keywords={SEO_CONFIG.auth.verifyEmail.keywords}
        noIndex={SEO_CONFIG.auth.verifyEmail.noIndex}
        url="https://equussystems.co/auth/verify-email"
      />
      <div className="auth-container">
        <SkipLink />
        <div className="verification-card">
          <div className="verification-content">
            {getStatusIcon()}

            <div className="mt-md">
              <h1 className={`verification-title ${status}`}>
                {status === 'verifying' && 'Verifying Email...'}
                {status === 'success' && 'Email Verified!'}
                {status === 'error' && 'Verification Failed'}
              </h1>
              <p className="text-equus-muted">{message}</p>
            </div>

            <div className="mt-md">
              {status === 'success' && (
                <div className="verification-redirect-notice">
                  Redirecting to sign in page in 3 seconds...
                </div>
              )}

              {status === 'success' && (
                <Link to="/auth/signin">
                  <button className="btn-primary">Continue to Sign In</button>
                </Link>
              )}

              {status === 'error' && (
                <div className="verification-button-group">
                  <Link to="/auth/signup">
                    <button className="btn-secondary">Create New Account</button>
                  </Link>
                  <Link to="/auth/signin">
                    <button className="btn-secondary">Back to Sign In</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
