/**
 * usePageViews Hook - Fetches and manages page views data
 * Provides page views count from analytics service with caching, error handling, and optional polling
 */

import { useState, useEffect } from 'react';
import httpService from '../services/httpService';

export const usePageViews = (
  period = '30d',
  { polling = false, interval = 120000 } = {},
) => {
  const [pageViews, setPageViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(!document.hidden);

  // Track tab visibility for efficient polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const fetchPageViews = async (isPolling = false) => {
      try {
        if (!isPolling) {
          setLoading(true);
        }
        setError(null);

        // Use the public endpoint that doesn't require authentication
        const response = await httpService.get(
          `/api/analytics/public/page-views?period=${period}`,
        );

        if (response.success && response.data?.totalPageViews !== undefined) {
          setPageViews(response.data.totalPageViews);
        } else {
          // Handle case where data is available but totalPageViews is missing
          setPageViews(null);
        }
      } catch (err) {
        console.error('Failed to fetch page views:', err);
        setError(err.message);
        setPageViews(null);
      } finally {
        if (!isPolling) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchPageViews();

    // Set up polling if enabled
    let intervalId;
    if (polling) {
      intervalId = setInterval(() => {
        // Only poll when tab is visible to save resources
        if (isVisible) {
          fetchPageViews(true); // Pass true to indicate this is a polling request
        }
      }, interval);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [period, polling, interval, isVisible]);

  return {
    pageViews,
    loading,
    error,
    // Helper function to check if we have valid data
    hasData:
      pageViews !== null && pageViews !== undefined && !loading && !error,
  };
};

export default usePageViews;
