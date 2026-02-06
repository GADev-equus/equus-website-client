/**
 * Footer - Main site footer component
 * Uses header-fixed pattern for consistency with Header component
 * Uses Equus design system variables for consistent styling
 * Height calculation handled by Header component
 * Displays page views with polling for real-time updates
 */

import { Link } from 'react-router-dom';
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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-fixed">
      {/* Full width copyright and terms */}
      <div className="w-full mt-2 px-4">
        <p className="footer-legal-line opacity-50 text-xs flex items-center justify-center space-x-3">
          <span>&copy; {currentYear} Equus Systems. All rights reserved.</span>
          <span>|</span>
          <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
        </p>
        {hasData && (
          <p className="mt-1 text-xs opacity-50 text-center">
            {formatPageViews(pageViews)} page view(s)
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
