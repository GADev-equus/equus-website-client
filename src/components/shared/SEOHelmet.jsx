/**
 * SEOHelmet Component - Manages SEO meta tags using React Helmet
 * Provides dynamic meta tags, Open Graph, Twitter Cards, and structured data
 */

import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({
  title = 'Equus Systems',
  description = 'Advanced technology solutions and AI-powered applications for modern businesses.',
  keywords = 'technology, AI, web development, business solutions, automation',
  image = '/favicon.ico',
  url = 'https://equussystems.co',
  type = 'website',
  author = 'Equus Systems',
  structuredData = null,
  noIndex = false,
  canonical = null,
  alternateUrls = []
}) => {
  const fullTitle = title === 'Equus Systems' ? title : `${title} | Equus Systems`;
  const fullUrl = canonical || url;
  const imageUrl = image.startsWith('http') ? image : `${url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Alternate URLs for different languages/regions */}
      {alternateUrls.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.lang} href={alt.url} />
      ))}
      
      {/* Robots Meta */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${title} - Equus Systems`} />
      <meta property="og:site_name" content="Equus Systems" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${title} - Equus Systems`} />
      <meta name="twitter:site" content="@EquusSystems" />
      <meta name="twitter:creator" content="@EquusSystems" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      
      {/* Structured Data JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Helmet>
  );
};

export default SEOHelmet;
