/**
 * Header - Main site header component
 * Displays company branding with gradient background
 * Uses Equus design system variables for consistent styling
 * Fixed position at the top of the viewport
 * Shows authentication-aware navigation when user is logged in
 */

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Set CSS custom property for header height
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const height = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
  }, []);

  const getDashboardPath = () => {
    return user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Branding Section */}
      <div style={{ textAlign: 'left', flex: '1 1 auto' }}>
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
      </div>

      {/* Authentication Navigation */}
      {isAuthenticated && user && (
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* User Greeting */}
          <span style={{
            fontSize: '0.9rem',
            opacity: 0.9,
            whiteSpace: 'nowrap'
          }}>
            Welcome, {user.firstName}
          </span>

          {/* Dashboard Link */}
          <Link
            to={getDashboardPath()}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            📊 Dashboard
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut || loading}
            style={{
              color: 'white',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isLoggingOut || loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isLoggingOut || loading ? 0.6 : 1,
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut && !loading) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            {isLoggingOut ? '⏳ Logging out...' : '🚪 Logout'}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;