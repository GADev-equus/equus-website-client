/**
 * Header Component - Main navigation header with authentication states
 * Responsive header with brand, navigation, and auth-aware actions
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SkipLink } from '@/components/ui/skip-link';
import { SrOnly } from '@/components/ui/sr-only';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const isActiveRoute = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <SkipLink />
      <header
        className="bg-card border-b border-border sticky top-0 z-50"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2"
                aria-label="EQUUS - Home"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span
                    className="text-primary-foreground font-bold text-sm"
                    aria-hidden="true"
                  >
                    E
                  </span>
                </div>
                <span className="font-bold text-xl text-foreground">EQUUS</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1 ${
                    isActiveRoute(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1"
                      aria-label={`User menu for ${user?.firstName || 'User'}`}
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xs">
                          {user?.firstName?.[0] || 'U'}
                        </span>
                      </div>
                      <span>{user?.firstName}</span>
                      <SrOnly>Open user menu</SrOnly>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                      role="menu"
                      aria-label="User menu"
                    >
                      <Card>
                        <CardContent className="p-2">
                          <div className="space-y-1">
                            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                              {user?.email}
                            </div>
                            <Link
                              to="/profile"
                              className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              role="menuitem"
                            >
                              Profile
                            </Link>
                            {user?.role === 'admin' && (
                              <Link
                                to="/admin/dashboard"
                                className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                role="menuitem"
                              >
                                Admin Dashboard
                              </Link>
                            )}
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              role="menuitem"
                            >
                              Sign Out
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={
                  mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'
                }
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
                <SrOnly>{mobileMenuOpen ? 'Close menu' : 'Open menu'}</SrOnly>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className="md:hidden border-t border-border bg-card"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Navigation */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      isActiveRoute(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Actions */}
                <div className="pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="px-3 py-1 text-xs text-muted-foreground">
                        {user?.email}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        to="/auth/signin"
                        className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/signup"
                        className="block px-3 py-2 text-base font-medium text-primary hover:bg-primary/10 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
