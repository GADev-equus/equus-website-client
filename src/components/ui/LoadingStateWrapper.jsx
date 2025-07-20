/**
 * LoadingStateWrapper - Integration component for global cold start detection
 * Replaces existing loading states with cold start detection and enhanced UX
 */

import { useEffect, useState } from 'react';
import { coldStartUtils } from '../../services/httpService';
import ColdStartLoader from './ColdStartLoader';
import { LoadingSpinner } from './loading-spinner';

const LoadingStateWrapper = ({ 
  children, 
  isLoading = false,
  loadingComponent = null,
  className = '',
  size = 'md',
  showColdStartUI = true,
  minColdStartThreshold = 5000 // 5 seconds
}) => {
  const [isColdStart, setIsColdStart] = useState(false);
  const [coldStartTime, setColdStartTime] = useState(null);
  const [activeColdStarts, setActiveColdStarts] = useState([]);

  useEffect(() => {
    // Register for cold start events
    const unsubscribe = coldStartUtils.onColdStart((event, data) => {
      if (event === 'start') {
        setIsColdStart(true);
        setColdStartTime(data.startTime);
        setActiveColdStarts(prev => [...prev, data.requestId]);
      } else if (event === 'end') {
        setActiveColdStarts(prev => prev.filter(id => id !== data.requestId));
        
        // Only end cold start if no more active requests
        if (activeColdStarts.length <= 1) {
          setIsColdStart(false);
          setColdStartTime(null);
        }
      }
    });

    return unsubscribe;
  }, [activeColdStarts.length]);

  // Check if we should show cold start UI
  const shouldShowColdStart = () => {
    if (!showColdStartUI || !isColdStart || !coldStartTime) return false;
    
    const elapsed = Date.now() - coldStartTime;
    return elapsed > minColdStartThreshold;
  };

  // If not loading, just render children
  if (!isLoading) {
    return children;
  }

  // If cold start should be shown, use ColdStartLoader
  if (shouldShowColdStart()) {
    return (
      <div className={`loading-state-replacement cold-start-active ${className}`}>
        <ColdStartLoader 
          startTime={coldStartTime}
          size={size}
          showProgress={true}
        />
      </div>
    );
  }

  // Use custom loading component if provided
  if (loadingComponent) {
    return (
      <div className={`loading-state-replacement ${className}`}>
        {loadingComponent}
      </div>
    );
  }

  // Default loading state
  return (
    <div className={`loading-state-replacement ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-2 p-4">
        <LoadingSpinner size={size} />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingStateWrapper;