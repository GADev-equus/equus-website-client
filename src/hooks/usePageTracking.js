/**
 * usePageTracking Hook - DISABLED to prevent double tracking
 * Page tracking is now handled by usePageMonitor hook
 */

// DISABLED: This hook has been replaced by usePageMonitor
const usePageTracking = () => {
  console.log('[usePageTracking] DISABLED - using usePageMonitor instead');
  return null;
};

export default usePageTracking;
