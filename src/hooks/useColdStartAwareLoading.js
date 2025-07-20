/**
 * useColdStartAwareLoading - Hook for integrating cold start detection with loading states
 * Enhances existing loading states with cold start detection and progressive UX
 */

import { useState, useEffect, useCallback } from 'react';
import { coldStartUtils } from '../services/httpService';

export const useColdStartAwareLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isColdStart, setIsColdStart] = useState(false);
  const [coldStartTime, setColdStartTime] = useState(null);
  const [activeColdStarts, setActiveColdStarts] = useState(new Set());

  useEffect(() => {
    // Register for cold start events
    const unsubscribe = coldStartUtils.onColdStart((event, data) => {
      if (event === 'start') {
        setIsColdStart(true);
        setColdStartTime(data.startTime);
        setActiveColdStarts(prev => new Set([...prev, data.requestId]));
      } else if (event === 'end') {
        setActiveColdStarts(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.requestId);
          
          // Only end cold start if no more active requests
          if (newSet.size === 0) {
            setIsColdStart(false);
            setColdStartTime(null);
          }
          
          return newSet;
        });
      }
    });

    return unsubscribe;
  }, []);

  // Enhanced loading state that includes cold start info
  const loadingState = {
    isLoading,
    isColdStart,
    coldStartTime,
    activeColdStarts: Array.from(activeColdStarts),
    hasActiveColdStarts: activeColdStarts.size > 0
  };

  // Enhanced setLoading that works with cold start detection
  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
    
    // If we're stopping loading but have active cold starts, keep showing loading
    if (!loading && activeColdStarts.size > 0) {
      // Don't stop loading until cold starts are done
      return;
    }
  }, [activeColdStarts.size]);

  // Check if we should show cold start UI
  const shouldShowColdStartUI = useCallback((threshold = 5000) => {
    if (!isColdStart || !coldStartTime) return false;
    
    const elapsed = Date.now() - coldStartTime;
    return elapsed > threshold;
  }, [isColdStart, coldStartTime]);

  // Get current loading component props
  const getLoadingProps = useCallback((options = {}) => {
    const {
      threshold = 5000,
      size = 'md',
      showProgress = true,
      className = ''
    } = options;

    return {
      isLoading: isLoading || hasActiveColdStarts,
      isColdStart,
      shouldShowColdStart: shouldShowColdStartUI(threshold),
      coldStartTime,
      size,
      showProgress,
      className,
      loadingState
    };
  }, [isLoading, isColdStart, coldStartTime, shouldShowColdStartUI, activeColdStarts.size]);

  return {
    // Basic loading state
    isLoading: isLoading || activeColdStarts.size > 0,
    setLoading,
    
    // Cold start specific state
    isColdStart,
    coldStartTime,
    activeColdStarts: Array.from(activeColdStarts),
    hasActiveColdStarts: activeColdStarts.size > 0,
    
    // Enhanced state object
    loadingState,
    
    // Utility functions
    shouldShowColdStartUI,
    getLoadingProps,
    
    // Direct cold start utilities
    coldStartConfig: coldStartUtils.getConfig(),
    updateColdStartConfig: coldStartUtils.updateConfig,
    setColdStartEnabled: coldStartUtils.setEnabled
  };
};