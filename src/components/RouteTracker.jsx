/**
 * RouteTracker - Automatically tracks page views on route changes
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '@/utils/analytics';

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever the route changes
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default RouteTracker;
