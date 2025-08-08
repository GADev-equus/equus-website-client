/**
 * UserLayout - Consistent layout for user pages
 * Provides navigation, header, and main content area for regular users
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const UserLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const isActiveRoute = (href) => location.pathname === href;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="block lg:flex w-full h-full">
      {/* Mobile menu button - Simple relative positioning */}
      <div className="lg:hidden w-full p-4 bg-background border-b border-border relative z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600"
          >
            {sidebarOpen ? '✕' : '☰'} Menu
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen
            ? 'relative inset-y-0 left-0 z-40 w-full border-r border-border'
            : 'hidden'
        } lg:static lg:inset-auto lg:left-auto lg:z-auto lg:block lg:w-64 bg-card border-r border-border flex-shrink-0`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Brand */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-100">EQUUS</h1>
            <p className="text-sm text-gray-300">Welcome back!</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActiveRoute(item.href)
                        ? 'bg-primary text-gray-900 font-semibold'
                        : 'text-white hover:bg-accent hover:text-white font-medium'
                    }
                  `}
                onClick={() => setSidebarOpen(false)}
              >
                <span
                  className={`text-lg ${
                    isActiveRoute(item.href) ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`font-medium ${
                    isActiveRoute(item.href) ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="mt-auto pt-8 border-t border-border">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-white">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-red-400"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 h-full flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
              <p className="text-sm text-gray-300">
                Welcome back, {user?.firstName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                {new Date().toLocaleDateString()}
              </div>
              {user?.emailVerified ? (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <span>✓</span>
                  <span>Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <span>⚠</span>
                  <span>Email not verified</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 w-full">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
