/**
 * Footer - Main site footer component
 * Displays temporary holding page notice with gradient background
 * Uses Equus design system variables for consistent styling
 */

const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--equus-gradient-primary)',
      padding: 'var(--equus-spacing-lg) var(--equus-spacing-sm)',
      color: 'white',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{ 
        background: 'rgba(231, 76, 60, 0.1)', 
        border: 'var(--equus-border-width) solid var(--equus-accent)',
        borderRadius: 'var(--equus-border-radius)',
        maxWidth: 'var(--equus-max-width-notice)',
        padding: 'var(--equus-spacing-sm)',
        margin: '0 auto'
      }}>
        <p className="font-bold" style={{ 
          marginBottom: 'var(--equus-spacing-xs)' 
        }}>
          This is a temporary holding page
        </p>
        <p className="opacity-80" style={{ 
          margin: '0' 
        }}>
          Our full website is currently under development
        </p>
      </div>
    </footer>
  );
};

export default Footer;