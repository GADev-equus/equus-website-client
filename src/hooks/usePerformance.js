import { useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * Custom hook for performance monitoring
 * @param {string} componentName - Name of the component being monitored
 * @param {Object} options - Configuration options
 */
export const usePerformance = (componentName, options = {}) => {
  const { enabled = process.env.NODE_ENV === 'development' } = options;
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(
        `⚠️ Slow render detected in ${componentName}:`,
        `${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }

    startTime.current = performance.now();
  });

  const logRenderCause = useCallback((deps) => {
    if (!enabled) return;
    
    console.log(`🔄 ${componentName} re-rendered due to:`, deps);
  }, [componentName, enabled]);

  return {
    renderCount: renderCount.current,
    logRenderCause
  };
};

/**
 * Custom hook for memoizing expensive calculations
 * @param {Function} factory - Function that creates the value
 * @param {Array} deps - Dependencies array
 * @param {Object} options - Configuration options
 */
export const useExpensiveMemo = (factory, deps, options = {}) => {
  const { 
    enabled = true,
    debugName = 'anonymous'
  } = options;

  const startTime = useRef(0);

  const value = useMemo(() => {
    if (!enabled) return factory();

    startTime.current = performance.now();
    const result = factory();
    const endTime = performance.now();
    const duration = endTime - startTime.current;

    if (duration > 5) { // More than 5ms
      console.warn(
        `⚠️ Expensive calculation in ${debugName}:`,
        `${duration.toFixed(2)}ms`
      );
    }

    return result;
  }, deps);

  return value;
};

/**
 * Custom hook for debouncing expensive operations
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array
 */
export const useDebounceCallback = (callback, delay, deps) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Custom hook for measuring component lifecycle performance
 * @param {string} componentName - Name of the component
 */
export const useLifecyclePerformance = (componentName) => {
  const mountTime = useRef(0);
  const updateTime = useRef(0);
  const renderCount = useRef(0);

  useEffect(() => {
    // Component mounted
    mountTime.current = performance.now();
    
    return () => {
      // Component unmounted
      const unmountTime = performance.now();
      const totalLifetime = unmountTime - mountTime.current;
      
      console.log(`📊 ${componentName} lifecycle:`, {
        totalLifetime: `${totalLifetime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        avgRenderTime: `${(totalLifetime / renderCount.current).toFixed(2)}ms`
      });
    };
  }, [componentName]);

  useEffect(() => {
    // Component updated
    renderCount.current += 1;
    updateTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current
  };
};