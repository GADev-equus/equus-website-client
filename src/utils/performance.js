/**
 * Performance utility functions
 */

// Debounce function for expensive operations
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for high-frequency events
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Measure function execution time
export const measurePerformance = (fn, label = 'Operation') => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
};

// Measure async function execution time
export const measureAsyncPerformance = (fn, label = 'Async Operation') => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
};

// Create a performance observer for monitoring
export const createPerformanceObserver = (callback) => {
  if (!window.PerformanceObserver) {
    console.warn('PerformanceObserver not supported');
    return null;
  }

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    callback(entries);
  });

  return observer;
};

// Monitor Core Web Vitals
export const monitorCoreWebVitals = () => {
  const observer = createPerformanceObserver((entries) => {
    entries.forEach((entry) => {
      switch (entry.entryType) {
        case 'largest-contentful-paint':
          console.log('LCP:', entry.startTime);
          break;
        case 'first-input':
          console.log('FID:', entry.processingStart - entry.startTime);
          break;
        case 'layout-shift':
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
          break;
      }
    });
  });

  if (observer) {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }
};

// Resource loading performance
export const monitorResourceLoading = () => {
  const observer = createPerformanceObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.transferSize > 100000) { // Resources larger than 100KB
        console.warn(`Large resource detected: ${entry.name} (${(entry.transferSize / 1024).toFixed(2)}KB)`);
      }
    });
  });

  if (observer) {
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Bundle size analysis helper
export const analyzeBundleSize = () => {
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;

  scripts.forEach((script) => {
    if (script.src.includes('chunk') || script.src.includes('bundle')) {
      // This is a simplified approach - in practice, you'd need server-side analysis
      console.log(`Script: ${script.src}`);
    }
  });

  return totalSize;
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (!performance.memory) {
    console.warn('Memory API not supported');
    return;
  }

  const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
  
  console.log('Memory Usage:', {
    used: `${(usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
    total: `${(totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
    limit: `${(jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
    usage: `${((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(2)}%`
  });
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    monitorCoreWebVitals();
    monitorResourceLoading();
    
    // Monitor memory usage every 30 seconds
    setInterval(monitorMemoryUsage, 30000);
  }
};