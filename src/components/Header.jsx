/**
 * Header - Main site header component
 * Displays company branding with gradient background
 * Uses Equus design system variables for consistent styling
 * Fixed position at the top of the viewport
 */

import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Header = () => {
  // Set CSS custom property for header height
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const height = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
  }, []);

  return (
    <header style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'var(--equus-gradient-primary)',
      padding: '1rem 0.5rem',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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