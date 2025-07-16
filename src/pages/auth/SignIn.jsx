/**
 * SignIn Page - User login page
 * Complete authentication flow with form validation
 */

import { Link } from 'react-router-dom';
import SignInForm from '@/components/forms/SignInForm';
import { SkipLink } from '@/components/ui/skip-link';

const SignIn = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--equus-spacing-sm)'
    }}>
      <SkipLink />
      <SignInForm />
    </div>
  );
};

export default SignIn;