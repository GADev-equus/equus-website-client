/**
 * usePageViews Hook - Fetches and manages page views data
 * Provides page views count from analytics service with caching and error handling
 */

import { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';

export const usePageViews = (period = '30d') => {
  const [pageViews, setPageViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyticsService.getOverview(period);
        
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
        setLoading(false);
      }
    };

    fetchPageViews();
  }, [period]);

  return { 
    pageViews, 
    loading, 
    error,
    // Helper function to check if we have valid data
    hasData: pageViews !== null && pageViews !== undefined && !loading && !error
  };
};

export default usePageViews;