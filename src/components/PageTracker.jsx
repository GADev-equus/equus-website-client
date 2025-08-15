/**
 * PageTracker Component - Handles page view tracking
 * Wrapper component that uses the usePageTracking hook
 */

import usePageTracking from '@/hooks/usePageTracking';

const PageTracker = () => {
  usePageTracking();
  return null; // This component doesn't render anything
};

export default PageTracker;
