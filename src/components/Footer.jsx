/**
 * Footer - Main site footer component
 * Displays temporary holding page notice with gradient background
 * Uses Equus design system variables for consistent styling
 * Fixed position at the bottom of the viewport
 */

import usePageViews from '../hooks/usePageViews';
import { useEffect } from 'react';

const Footer = () => {
  const { pageViews, hasData } = usePageViews('30d', {
    polling: true,
    interval: 120000, // 2 minutes (120 seconds)
  });

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
    <footer className="footer-fixed">
      <div className="footer-notice-card">
        <p className="footer-title font-bold">
          This is a temporary holding pages
        </p>
        <p className="footer-subtitle opacity-80">
          Our full website is currently under development
        </p>
        {hasData && (
          <p className="footer-stats opacity-60">
            {formatPageViews(pageViews)} page view(s)
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
