/**
 * Navigation Component - Auth-aware navigation with role-based routing
 * Provides consistent navigation patterns throughout the application
 */

import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = ({ variant = 'default', className = '' }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const publicNavigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Services', href: '/#services', icon: '⚙️' },
    { name: 'About', href: '/#about', icon: 'ℹ️' },
    { name: 'Contact', href: '/#contact', icon: '📧' },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: '🛠️' },
    { name: 'User Management', href: '/admin/users', icon: '👥' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  ];

  const getNavigationItems = () => {
    let items = [...publicNavigation];
    
    if (isAuthenticated) {
      items = [...items, ...userNavigation];
      
      if (user?.role === 'admin') {
        items = [...items, ...adminNavigation];
      }
    }
    
    return items;
  };

  const isActiveRoute = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('/#')) return location.pathname === '/' && location.hash === href.slice(1);
    return location.pathname.startsWith(href);
  };

  const navigationItems = getNavigationItems();

  // Sidebar variant for admin pages
  if (variant === 'sidebar') {
    return (
      <nav className={`space-y-2 ${className}`}>
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
              ${isActiveRoute(item.href) 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    );
  }

  // Breadcrumb variant
  if (variant === 'breadcrumb') {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    // Add home
    breadcrumbs.push({ name: 'Home', href: '/' });
    
    // Build breadcrumb trail
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const navItem = navigationItems.find(item => item.href === currentPath);
      if (navItem) {
        breadcrumbs.push({ name: navItem.name, href: currentPath });
      } else {
        // Capitalize segment for display
        const displayName = segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ name: displayName, href: currentPath });
      }
    });

    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`}>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center space-x-2">
            {index > 0 && (
              <span className="text-muted-foreground">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">{crumb.name}</span>
            ) : (
              <Link
                to={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Tab variant for horizontal navigation
  if (variant === 'tabs') {
    return (
      <nav className={`flex items-center space-x-1 ${className}`}>
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${isActiveRoute(item.href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    );
  }

  // Pills variant for compact navigation
  if (variant === 'pills') {
    return (
      <nav className={`flex flex-wrap gap-2 ${className}`}>
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full transition-colors
              ${isActiveRoute(item.href)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    );
  }

  // Default horizontal navigation
  return (
    <nav className={`flex items-center space-x-8 ${className}`}>
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`
            text-sm font-medium transition-colors hover:text-primary
            ${isActiveRoute(item.href) 
              ? 'text-primary' 
              : 'text-muted-foreground'
            }
          `}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;