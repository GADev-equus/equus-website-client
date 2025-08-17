/**
 * Footer - Main site footer component
 * Uses header-fixed pattern for consistency with Header component
 * Uses Equus design system variables for consistent styling
 * Height calculation handled by Header component
 * Displays page views with polling for real-time updates
 */

import usePageViews from '../hooks/usePageViews';

const Footer = () => {
  const { pageViews, hasData } = usePageViews('30d', {
    polling: true,
    interval: 120000, // 2 minutes (120 seconds)
  });

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
          This is a temporary holding page
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