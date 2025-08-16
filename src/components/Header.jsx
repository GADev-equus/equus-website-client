/**
 * Header - Modern shadcn/ui header component
 * Displays company branding with gradient background
 * Uses shadcn/ui components for consistent styling and accessibility
 * Fixed position at the top of the viewport
 * Shows authentication-aware navigation when user is logged in
 */

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BarChart3, LogOut, Menu, X } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              ADVANCED AI SOLUTIONS & CONSULTING
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
                ADVANCED AI SOLUTIONS & CONSULTING
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="header-nav flex">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 border border-white/30">
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 border border-white/30">
              <Link to="/products">Products</Link>
            </Button>
            {/* Show Dashboard when authenticated */}
            {isAuthenticated && user && (
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 border border-white/30">
                <Link to={getDashboardPath()}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            )}
            {/* Show Sign In when not authenticated */}
            {!isAuthenticated && (
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 border border-white/30">
                <Link to="/auth/signin">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>

      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 border-t border-white/20 md:hidden z-50" style={{background: 'var(--equus-gradient-primary)'}}>
          <nav className="flex flex-col p-4 space-y-3">
            {/* Public Navigation */}
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-white hover:bg-white/10 border border-white/30 justify-start"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link to="/about">About</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-white hover:bg-white/10 border border-white/30 justify-start"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link to="/products">Products</Link>
            </Button>

            {/* Authentication Navigation */}
            {isAuthenticated && user ? (
              <>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild 
                      className="text-white hover:bg-white/10 border border-white/30 justify-start w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to={getDashboardPath()}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={isLoggingOut || loading}
                      className="text-red-300 hover:bg-red-500/20 border border-red-300/30 justify-start w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="text-white border border-white/30 hover:bg-white/10 w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to="/auth/signin">Sign In</Link>
                  </Button>
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
