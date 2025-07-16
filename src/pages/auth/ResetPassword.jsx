/**
 * ResetPassword Page - Password reset page
 * Handles both password reset request and password reset confirmation
 */

import { useSearchParams, Link } from 'react-router-dom';
import { PasswordResetRequestForm, PasswordResetForm } from '@/components/forms/PasswordResetForm';
import { SkipLink } from '@/components/ui/skip-link';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div style={{
      minHeight: '100vh',
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
        {token ? (
          // Password reset confirmation form (with token)
          <PasswordResetForm token={token} />
        ) : (
          // Password reset request form (no token)           
          <PasswordResetRequestForm />            
        )}
      </div>
    </div>
  );
};

export default ResetPassword;