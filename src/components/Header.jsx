/**
 * Header - Main site header component
 * Displays company branding with gradient background
 * Uses Equus design system variables for consistent styling
 */

import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ 
      background: 'var(--equus-gradient-primary)',
      padding: '1rem 0.5rem',
      color: 'white',
      textAlign: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="font-bold" style={{ 
          fontSize: '1.8rem', 
          letterSpacing: 'var(--equus-letter-spacing-tight)',
          fontFamily: 'var(--equus-font-display)',
          marginBottom: '0.25rem',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease'
        }}>
          EQUUS SYSTEMS
        </h1>
      </Link>
      <p className="opacity-90 font-light" style={{ 
        fontSize: '0.9rem' 
      }}>
        ADVANCED AI SOLUTIONS & CONSULTING
      </p>
    </header>
  );
};

export default Header;