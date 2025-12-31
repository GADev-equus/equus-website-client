/**
 * ResetPassword Page - Password reset page
 * Handles both password reset request and password reset confirmation
 */

import { useSearchParams, Link } from 'react-router-dom';
import {
  PasswordResetRequestForm,
  PasswordResetForm,
} from '@/components/forms/PasswordResetForm';
import { SkipLink } from '@/components/ui/skip-link';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <>
      <SEOHelmet
        title={SEO_CONFIG.auth.resetPassword.title}
        description={SEO_CONFIG.auth.resetPassword.description}
        keywords={SEO_CONFIG.auth.resetPassword.keywords}
        noIndex={SEO_CONFIG.auth.resetPassword.noIndex}
        url="https://equussystems.co/auth/reset-password"
      />
      <div className="auth-container">
        <SkipLink />
        <div className="auth-form-wrapper">
          {token ? (
            // Password reset confirmation form (with token)
            <PasswordResetForm token={token} />
          ) : (
            // Password reset request form (no token)
            <PasswordResetRequestForm />
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
