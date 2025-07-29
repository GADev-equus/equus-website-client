/**
 * NotFound Page - 404 error page
 * Shown when a route doesn't exist
 */

import { Link } from 'react-router-dom';
import SEOHelmet from '@/components/shared/SEOHelmet';
import { SEO_CONFIG } from '@/utils/structuredData';

const NotFound = () => {
  return (
    <>
      <SEOHelmet 
        title={SEO_CONFIG.notFound.title}
        description={SEO_CONFIG.notFound.description}
        keywords={SEO_CONFIG.notFound.keywords}
        noIndex={SEO_CONFIG.notFound.noIndex}
        url="https://equussystems.co/404"
      />
      <div className="flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
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

export default NotFound;