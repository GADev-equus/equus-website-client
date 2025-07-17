/**
 * SignUp Page - User registration page
 * Complete registration flow with form validation
 */

import { Link } from 'react-router-dom';
import SignUpForm from '@/components/forms/SignUpForm';
import { SkipLink } from '@/components/ui/skip-link';

const SignUp = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--equus-spacing-sm)'
    }}>
      <SkipLink />
      <div style={{
        width: '100%',
        maxWidth: '28rem'
      }}>
        <SignUpForm />    
            
        <div style={{
          marginTop: 'var(--equus-spacing-md)',
          fontSize: '0.75rem',
          color: 'var(--equus-text-secondary)',
          textAlign: 'center'
        }}>
          <p>
            By signing up, you agree to our{' '}
            <Link 
              to="/terms" 
              style={{
                color: 'var(--equus-primary)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link 
              to="/privacy" 
              style={{
                color: 'var(--equus-primary)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;