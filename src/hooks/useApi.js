import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Custom hook for API calls with loading states and error handling
 * @param {Function} apiFunction - The API function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred'
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      
      if (showSuccessToast) {
        toast({
          title: 'Success',
          description: successMessage,
          variant: 'success'
        });
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (showErrorToast) {
        toast({
          title: 'Error',
          description: err.message || errorMessage,
          variant: 'destructive'
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, showSuccessToast, showErrorToast, successMessage, errorMessage, toast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};