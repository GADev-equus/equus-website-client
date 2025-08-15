/**
 * RouteTracker - DISABLED to prevent double tracking
 * Page tracking is now handled by PageObserver component
 */

// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import analytics from '@/utils/analytics';

const RouteTracker = () => {
  // DISABLED: Tracking is now handled by PageObserver
  // const location = useLocation();

  // useEffect(() => {
  //   // Track page view whenever the route changes
  //   analytics.trackPageView(location.pathname);
  // }, [location.pathname]);

  console.log('[RouteTracker] DISABLED - tracking handled by PageObserver');
  return null; // This component doesn't render anything
};

export default RouteTracker;
