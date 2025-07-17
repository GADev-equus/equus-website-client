/**
 * Footer - Main site footer component
 * Displays temporary holding page notice with gradient background
 * Uses Equus design system variables for consistent styling
 */

const Footer = () => {
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
      </div>
    </footer>
  );
};

export default Footer;