/**
 * Header - Modern shadcn/ui header component
 * Displays company branding with gradient background
 * Uses shadcn/ui components for consistent styling and accessibility
 * Fixed position at the top of the viewport
 * Shows authentication-aware navigation when user is logged in
 */

import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import './Hero.css';

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = "font-medium uppercase tracking-wide transition-colors duration-200 !px-3 !py-1 text-sm";
    const activeClass = isActive 
      ? "!text-blue-600 !bg-white" 
      : "text-white hover:!text-gray-300";
    return `${baseClass} ${activeClass}`;
  };

  const getDashboardLinkClass = () => {
    const dashboardPath = getDashboardPath();
    const isActive = location.pathname === dashboardPath;
    const baseClass = "font-medium uppercase tracking-wide transition-colors duration-200 !px-3 !py-1 text-sm";
    const activeClass = isActive 
      ? "!text-blue-600 !bg-white" 
      : "text-white hover:!text-gray-300";
    return `${baseClass} ${activeClass}`;
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

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);


  return (
    <>
    <header className="header-fixed">
      {/* Mobile Layout: Logo left, Hamburger right */}
      <div className="flex items-center justify-between w-full md:hidden">
        {/* Mobile Logo - Smaller */}
        <div className="flex-shrink-0">
          <Link to="/" className="header-brand-link text-center">
            <h1 className="font-bold text-xl font-branding leading-tight">EQUUS SYSTEMS Ltd.</h1>
            <p className="opacity-70 font-light text-[0.6rem] leading-none">
              ADVANCED <span className="header-ai-emphasis">A<span className="visible-i">i</span></span> SOLUTIONS & CONSULTING
            </p>
          </Link>
        </div>
        
        {/* Mobile Menu Button - Top Right */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10 border border-white/30"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Desktop Layout: Multi-row layout */}
      <div className="hidden md:block md:w-full">
        {/* Top Row: Branding and Public Navigation */}
        <div className="flex items-center justify-between w-full">
          {/* Desktop Branding Section */}
          <div>
            <div className="header-branding">
              <Link to="/" className="header-brand-link">
                <h1 className="font-bold header-brand-title">EQUUS SYSTEMS Ltd.</h1>
              </Link>
              <p className="opacity-90 font-light header-brand-subtitle">
                ADVANCED <span className="header-ai-emphasis">A<span className="visible-i">i</span></span> SOLUTIONS & CONSULTING
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-6">
            <Link to="/about" className={getNavLinkClass('/about')}>
              ABOUT
            </Link>
            <Link to="/products" className={getNavLinkClass('/products')}>
              PRODUCTS
            </Link>
            {/* Show Dashboard when authenticated */}
            {isAuthenticated && user && (
              <Link to={getDashboardPath()} className={getDashboardLinkClass()}>
                DASHBOARD
              </Link>
            )}
            {/* Show Sign In when not authenticated */}
            {!isAuthenticated && (
              <Link to="/auth/signin" className={getNavLinkClass('/auth/signin')}>
                SIGN IN
              </Link>
            )}
          </nav>
        </div>

      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 border-t border-white/20 md:hidden z-50" style={{background: 'var(--equus-gradient-primary)'}}>
          <nav className="flex flex-col p-4 space-y-4">
            {/* Public Navigation */}
            <Link 
              to="/about" 
              className={`${getNavLinkClass('/about')} py-2`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link 
              to="/products" 
              className={`${getNavLinkClass('/products')} py-2`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              PRODUCTS
            </Link>

            {/* Authentication Navigation */}
            {isAuthenticated && user ? (
              <>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="space-y-4">
                    <Link 
                      to={getDashboardPath()}
                      className={`${getDashboardLinkClass()} py-2`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      DASHBOARD
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={isLoggingOut || loading}
                      className="text-red-300 hover:text-red-200 font-medium uppercase tracking-wide py-2 transition-colors duration-200"
                    >
                      {isLoggingOut ? 'LOGGING OUT...' : 'LOGOUT'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <Link 
                    to="/auth/signin"
                    className={`${getNavLinkClass('/auth/signin')} py-2`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    SIGN IN
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>

    </>
  );
};

export default Header;
