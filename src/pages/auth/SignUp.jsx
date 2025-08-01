/**
 * SignUp Page - User registration page
 * Complete registration flow with form validation
 */

import { Link } from 'react-router-dom';
import SignUpForm from '@/components/forms/SignUpForm';
import { SkipLink } from '@/components/ui/skip-link';

const SignUp = () => {
  return (
    <div className="auth-container">
      <SkipLink />
      <div className="auth-form-wrapper">
        <SignUpForm />

        <div className="auth-terms">
          <p>
            By signing up, you agree to our{' '}
            <Link to="/terms" className="auth-link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="auth-link">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
