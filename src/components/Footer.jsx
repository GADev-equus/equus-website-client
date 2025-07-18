/**
 * Footer - Main site footer component
 * Displays temporary holding page notice with gradient background
 * Uses Equus design system variables for consistent styling
 */

import usePageViews from '../hooks/usePageViews';

const Footer = () => {
  const { pageViews, hasData } = usePageViews('30d');

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
    <footer style={{ 
      background: 'var(--equus-gradient-primary)',
      padding: '0.75rem 0.5rem',
      color: 'white',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{ 
        background: 'rgba(231, 76, 60, 0.1)', 
        border: 'var(--equus-border-width) solid var(--equus-accent)',
        borderRadius: 'var(--equus-border-radius)',
        maxWidth: 'var(--equus-max-width-notice)',
        padding: '0.5rem',
        margin: '0 auto'
      }}>
        <p className="font-bold" style={{ 
          marginBottom: '0.25rem',
          fontSize: '0.9rem'
        }}>
          This is a temporary holding page
        </p>
        <p className="opacity-80" style={{ 
          margin: '0',
          fontSize: '0.8rem'
        }}>
          Our full website is currently under development
        </p>
        {hasData && (
          <p className="opacity-60" style={{ 
            margin: '0.5rem 0 0 0',
            fontSize: '0.7rem'
          }}>
            {formatPageViews(pageViews)} page views
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;