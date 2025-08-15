/**
 * Analytics Component - Handles page view analytics
 * Wrapper component that uses the usePageTracking hook
 */

import usePageTracking from '@/hooks/usePageTracking';

const Analytics = () => {
  usePageTracking();
  return null; // This component doesn't render anything
};

export default Analytics;
