/**
 * useServerStatus - Hook for monitoring server status and cold start detection
 * Provides server status state and cold start detection functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Cold start configuration
export const COLD_START_CONFIG = {
  THRESHOLD: 5000, // 5 seconds to detect cold start
  MAX_TIME: 60000, // 60 seconds maximum expected time
  CHECK_INTERVAL: 1000, // 1 second status check interval
};

export const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useState('unknown'); // unknown, ready, warming, cold, down, connecting
  const [isColdStart, setIsColdStart] = useState(false);
  const [coldStartTime, setColdStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [requestsInProgress, setRequestsInProgress] = useState(new Set());
  
  const intervalRef = useRef(null);
  const coldStartStartTime = useRef(null);

  // Start cold start detection
  const startColdStart = useCallback((requestId = 'default') => {
    if (!coldStartStartTime.current) {
      coldStartStartTime.current = Date.now();
      setColdStartTime(coldStartStartTime.current);
      setIsColdStart(true);
      setServerStatus('connecting');
    }
    
    setRequestsInProgress(prev => new Set([...prev, requestId]));
  }, []);

  // End cold start detection
  const endColdStart = useCallback((requestId = 'default', success = true) => {
    setRequestsInProgress(prev => {
      const newSet = new Set(prev);
      newSet.delete(requestId);
      return newSet;
    });

    // Only end cold start if no more requests are pending
    setRequestsInProgress(current => {
      if (current.size === 0) {
        setIsColdStart(false);
        setServerStatus(success ? 'ready' : 'down');
        coldStartStartTime.current = null;
        setColdStartTime(null);
        setElapsedTime(0);
      }
      return current;
    });
  }, []);

  // Check if a request duration indicates cold start
  const checkColdStart = useCallback((duration, requestId = 'default') => {
    if (duration > COLD_START_CONFIG.THRESHOLD) {
      startColdStart(requestId);
      return true;
    }
    return false;
  }, [startColdStart]);

  // Update elapsed time during cold start
  useEffect(() => {
    if (isColdStart && coldStartTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - coldStartTime;
        setElapsedTime(elapsed);

        // Update status based on elapsed time
        if (elapsed > COLD_START_CONFIG.THRESHOLD && elapsed < 15000) {
          setServerStatus('warming');
        } else if (elapsed >= 15000) {
          setServerStatus('cold');
        }
      }, COLD_START_CONFIG.CHECK_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isColdStart, coldStartTime]);

  // Get current progress percentage
  const getProgress = useCallback(() => {
    if (!isColdStart || !elapsedTime) return 0;
    return Math.min((elapsedTime / COLD_START_CONFIG.MAX_TIME) * 100, 95);
  }, [isColdStart, elapsedTime]);

  // Get current message based on elapsed time
  const getCurrentMessage = useCallback(() => {
    if (!isColdStart) return '';
    
    if (elapsedTime < 3000) return 'Loading...';
    if (elapsedTime < 8000) return 'Connecting to server...';
    if (elapsedTime < 15000) return 'Server is starting up...';
    if (elapsedTime < 30000) return 'Almost ready...';
    if (elapsedTime < 45000) return 'Just a few more moments...';
    return 'Thank you for your patience...';
  }, [isColdStart, elapsedTime]);

  // Check if we should show cold start UI
  const shouldShowColdStartUI = useCallback(() => {
    return isColdStart && elapsedTime > COLD_START_CONFIG.THRESHOLD;
  }, [isColdStart, elapsedTime]);

  // Manual server status check (for health checking)
  const checkServerHealth = useCallback(async () => {
    try {
      setServerStatus('connecting');
      const startTime = Date.now();
      
      // Simple health check - could be expanded
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/health', {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      
      if (response.ok) {
        if (duration > 2000) {
          setServerStatus('warming');
        } else {
          setServerStatus('ready');
        }
        return 'healthy';
      } else {
        setServerStatus('down');
        return 'unhealthy';
      }
    } catch (error) {
      setServerStatus('down');
      return 'error';
    }
  }, []);

  return {
    // Status
    serverStatus,
    isColdStart,
    coldStartTime,
    elapsedTime,
    requestsInProgress,
    
    // Methods
    startColdStart,
    endColdStart,
    checkColdStart,
    checkServerHealth,
    
    // Computed values
    progress: getProgress(),
    currentMessage: getCurrentMessage(),
    shouldShowColdStartUI: shouldShowColdStartUI(),
    
    // Configuration
    config: COLD_START_CONFIG
  };
};