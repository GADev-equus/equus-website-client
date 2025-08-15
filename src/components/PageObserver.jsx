/**
 * PageObserver Component - Handles page navigation monitoring
 * Wrapper component that uses the usePageMonitor hook
 */

import usePageMonitor from '@/hooks/usePageMonitor';

const PageObserver = () => {
  usePageMonitor();
  return null; // This component doesn't render anything
};

export default PageObserver;
