/**
 * Unauthorized Page - Access denied page
 * Shown when user doesn't have permission to access a resource
 */

import { Link } from 'react-router-dom';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';

const Unauthorized = () => {
  return (
    <>
      <SEOHelmet
        title={SEO_CONFIG.unauthorized.title}
        description={SEO_CONFIG.unauthorized.description}
        keywords={SEO_CONFIG.unauthorized.keywords}
        noIndex={SEO_CONFIG.unauthorized.noIndex}
        url="https://equussystems.co/unauthorized"
      />
      <div className="flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-foreground mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Unauthorized
          </h2>
          <p className="text-muted-foreground mb-8">
            You don't have permission to access this resource.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
