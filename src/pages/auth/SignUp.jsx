/**
 * SignUp Page - User registration page
 * Complete registration flow with form validation
 */

import { Link } from 'react-router-dom';
import SignUpForm from '@/components/forms/SignUpForm';
import { SkipLink } from '@/components/ui/skip-link';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';

const SignUp = () => {
  return (
    <>
      <SEOHelmet
        title={SEO_CONFIG.auth.signup.title}
        description={SEO_CONFIG.auth.signup.description}
        keywords={SEO_CONFIG.auth.signup.keywords}
        noIndex={SEO_CONFIG.auth.signup.noIndex}
        url="https://equussystems.co/auth/signup"
      />
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
    </>
  );
};

export default SignUp;
