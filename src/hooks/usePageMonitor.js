/**
 * usePageMonitor Hook - Monitors page views for site statistics
 * StrictMode-safe implementation that prevents double counting
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import httpService from '../services/httpService';

const usePageMonitor = () => {
  const location = useLocation();
  const visitedPaths = useRef(new Set());
  const sessionId = useRef(null);

  // Generate or get session ID
  useEffect(() => {
    if (!sessionId.current) {
      let stored = sessionStorage.getItem('page_session_id');
      if (!stored) {
        stored = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('page_session_id', stored);
      }
      sessionId.current = stored;
    }
  }, []);

  // Monitor page view on location change
  useEffect(() => {
    const logPageView = async () => {
      const path = location.pathname;
      const fullPath = `${path}${location.search}${location.hash}`;
      
      // Avoid logging the same path multiple times in the same session
      if (visitedPaths.current.has(fullPath)) {
        return;
      }

      // StrictMode protection: Add a small delay and check again
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Double-check after delay (in case StrictMode ran this twice)
      if (visitedPaths.current.has(fullPath)) {
        return;
      }

      // Mark as visited BEFORE making the request to prevent double tracking
      visitedPaths.current.add(fullPath);

      try {
        const data = {
          path,
          method: 'GET',
          sessionId: sessionId.current,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referer: document.referrer || null,
          clientTracked: true,
        };

        await httpService.post('/api/analytics/track', data);
        
      } catch (error) {
        console.error('[PageMonitor] Failed to log page view:', error);
        // Remove from visited paths if the request failed
        visitedPaths.current.delete(fullPath);
      }
    };

    if (sessionId.current) {
      logPageView();
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default usePageMonitor;
