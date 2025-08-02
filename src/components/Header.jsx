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

  // Set CSS custom properties for header and footer heights
  useEffect(() => {
    const updateLayoutHeights = () => {
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');

      if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty(
          '--header-height',
          `${headerHeight}px`,
        );
      }

      if (footer) {
        const footerHeight = footer.offsetHeight;
        document.documentElement.style.setProperty(
          '--footer-height',
          `${footerHeight}px`,
        );
      }
    };

    // Initial measurement
    updateLayoutHeights();

    // Update on window resize
    window.addEventListener('resize', updateLayoutHeights);

    // Cleanup
    return () => window.removeEventListener('resize', updateLayoutHeights);
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
    <header className="header-fixed">
      {/* Branding Section */}
      <div>
        <div className="header-branding">
          <Link to="/" className="header-brand-link">
            <h1 className="font-bold header-brand-title">EQUUS SYSTEMS</h1>
          </Link>
          <p className="opacity-90 font-light header-brand-subtitle">
            ADVANCED AI SOLUTIONS & CONSULTING
          </p>
        </div>
      </div>

      {/* Authentication Navigation */}
      {isAuthenticated && user && (
        <nav className="header-nav">
          {/* User Greeting */}
          <span className="header-user-greeting">
            Welcome, {user.firstName}
          </span>

          {/* Dashboard Link */}
          <Link to={getDashboardPath()} className="header-nav-button">
            📊 Dashboard
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut || loading}
            className="header-nav-button text-red-400"
          >
            {isLoggingOut ? '⏳ Logging out...' : '🚪 Logout'}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
