/**
 * Footer - Main site footer component
 * Displays temporary holding page notice with gradient background
 * Uses Equus design system variables for consistent styling
 * Fixed position at the bottom of the viewport
 */

import usePageViews from '../hooks/usePageViews';
import { useEffect } from 'react';

const Footer = () => {
  const { pageViews, hasData } = usePageViews('30d');

  // Set CSS custom property for footer height
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      const height = footer.offsetHeight;
      document.documentElement.style.setProperty(
        '--footer-height',
        `${height}px`,
      );
    }
  }, [hasData]); // Re-run when page views data changes (affects footer height)

  const formatPageViews = (count) => {
    if (!count) return null;
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'var(--equus-gradient-primary)',
        padding: '0.75rem 0.5rem',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          background: 'rgba(231, 76, 60, 0.1)',
          border: 'var(--equus-border-width) solid var(--equus-accent)',
          borderRadius: 'var(--equus-border-radius)',
          maxWidth: 'var(--equus-max-width-notice)',
          padding: '0.5rem',
          margin: '0 auto',
        }}
      >
        <p
          className="font-bold"
          style={{
            marginBottom: '0.25rem',
            fontSize: '0.9rem',
          }}
        >
          This is a temporary holding pages
        </p>
        <p
          className="opacity-80"
          style={{
            margin: '0',
            fontSize: '0.8rem',
          }}
        >
          Our full website is currently under development
        </p>
        {hasData && (
          <p
            className="opacity-60"
            style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.7rem',
            }}
          >
            {formatPageViews(pageViews)} page view(s)
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
