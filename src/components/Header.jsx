/**
 * Header - Main site header component
 * Displays company branding with gradient background
 * Uses Equus design system variables for consistent styling
 */

const Header = () => {
  return (
    <header style={{ 
      background: 'var(--equus-gradient-primary)',
      padding: 'var(--equus-spacing-lg) var(--equus-spacing-sm)',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 className="font-bold" style={{ 
        fontSize: '2.5rem', 
        letterSpacing: 'var(--equus-letter-spacing-tight)',
        fontFamily: 'var(--equus-font-display)',
        marginBottom: 'var(--equus-spacing-xs)'
      }}>
        EQUUS SYSTEMS
      </h1>
      <p className="opacity-90 font-light" style={{ 
        fontSize: '1.1rem' 
      }}>
        ADVANCED AI SOLUTIONS & CONSULTING
      </p>
    </header>
  );
};

export default Header;