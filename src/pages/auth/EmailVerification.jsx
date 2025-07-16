/**
 * EmailVerification Page - Email verification page
 * Handles email verification with token from URL
 */

import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SkipLink } from '@/components/ui/skip-link';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/authService';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please check your email link.');
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        setLoading(true);
        const result = await authService.verifyEmail(token);
        
        if (result.success) {
          setStatus('success');
          setMessage('Your email has been successfully verified! You can now sign in to your account.');
          
          // Auto-redirect to sign in after 3 seconds
          setTimeout(() => {
            navigate('/auth/signin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Email verification failed. The link may be expired or invalid.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred during verification. Please try again.');
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
        return <LoadingSpinner size="lg" style={{ color: 'var(--equus-primary)' }} />;
      case 'success':
        return (
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#d4edda',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <svg style={{ width: '2rem', height: '2rem', color: '#27ae60' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#f8d7da',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <svg style={{ width: '2rem', height: '2rem', color: 'var(--equus-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--equus-background-dark)',
      padding: 'var(--equus-spacing-sm)'
    }}>
      <SkipLink />
      <div style={{
        backgroundColor: 'var(--equus-background-white)',
        padding: 'var(--equus-spacing-lg)',
        borderRadius: 'var(--equus-border-radius)',
        border: 'var(--equus-border-width) solid var(--equus-border-color)',
        boxShadow: 'var(--equus-box-shadow)',
        width: '100%',
        maxWidth: '28rem'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          {getStatusIcon()}
          
          <div style={{ marginTop: 'var(--equus-spacing-md)' }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: 'var(--equus-spacing-xs)',
              color: status === 'success' ? '#27ae60' : status === 'error' ? 'var(--equus-accent)' : 'var(--equus-text-primary)'
            }}>
              {status === 'verifying' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h1>
            <p style={{
              color: 'var(--equus-text-secondary)'
            }}>{message}</p>
          </div>

          <div style={{ marginTop: 'var(--equus-spacing-md)' }}>
            {status === 'success' && (
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--equus-text-secondary)',
                marginBottom: 'var(--equus-spacing-sm)'
              }}>
                Redirecting to sign in page in 3 seconds...
              </div>
            )}
            
            {status === 'success' && (
              <Link to="/auth/signin">
                <button className="btn-primary">
                  Continue to Sign In
                </button>
              </Link>
            )}
            
            {status === 'error' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--equus-spacing-xs)'
              }}>
                <Link to="/auth/signup">
                  <button className="btn-secondary">
                    Create New Account
                  </button>
                </Link>
                <Link to="/auth/signin">
                  <button className="btn-secondary">
                    Back to Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;