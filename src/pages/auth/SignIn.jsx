/**
 * SignIn Page - User login page
 * Complete authentication flow with form validation
 */

import { Link } from 'react-router-dom';
import SignInForm from '@/components/forms/SignInForm';
import { SkipLink } from '@/components/ui/skip-link';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';

const SignIn = () => {
  return (
    <>
      <SEOHelmet 
        title={SEO_CONFIG.auth.signin.title}
        description={SEO_CONFIG.auth.signin.description}
        keywords={SEO_CONFIG.auth.signin.keywords}
        noIndex={SEO_CONFIG.auth.signin.noIndex}
        url="https://equussystems.co/auth/signin"
      />
      <div style={{      
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--equus-spacing-sm)'
      }}>
        <SkipLink />
        <SignInForm />
      </div>
    </>
  );
};

export default SignIn;