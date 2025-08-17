/**
 * Production Performance Utilities
 * Optimized for production use with analytics integration
 */

// Debounce function for expensive operations (search, resize, etc.)
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for high-frequency events (scroll, mousemove, etc.)
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

// Production-ready Web Vitals tracking with analytics integration
const sendAnalytics = (metric, value, category = 'Performance') => {
  // Send to your analytics service (Google Analytics, custom API, etc.)
  if (window.gtag) {
    window.gtag('event', metric, {
      event_category: category,
      value: Math.round(value),
      non_interaction: true,
    });
  }
  
  // Send to custom analytics API if available
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric,
        value: Math.round(value),
        category,
        timestamp: Date.now(),
        url: window.location.pathname
      })
    }).catch(() => {}); // Silent fail for analytics
  }
};

// Create a performance observer for production monitoring
const createPerformanceObserver = (callback) => {
  if (!window.PerformanceObserver) {
    return null;
  }

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    callback(entries);
  });

  return observer;
};

// Track Core Web Vitals for production analytics
export const trackCoreWebVitals = () => {
  const observer = createPerformanceObserver((entries) => {
    entries.forEach((entry) => {
      switch (entry.entryType) {
        case 'largest-contentful-paint':
          sendAnalytics('LCP', entry.startTime, 'Core Web Vitals');
          break;
        case 'first-input':
          sendAnalytics('FID', entry.processingStart - entry.startTime, 'Core Web Vitals');
          break;
        case 'layout-shift':
          if (!entry.hadRecentInput) {
            sendAnalytics('CLS', entry.value * 1000, 'Core Web Vitals'); // Convert to integer
          }
          break;
      }
    });
  });

  if (observer) {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }
};

// Error boundary performance tracking
export const trackErrorBoundary = (error, errorInfo) => {
  const errorMetric = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: Date.now(),
    url: window.location.pathname,
    userAgent: navigator.userAgent
  };

  sendAnalytics('Error_Boundary', 1, 'Errors');
  
  // Send detailed error info to custom API
  if (import.meta.env.VITE_ERROR_TRACKING_ENDPOINT) {
    fetch(import.meta.env.VITE_ERROR_TRACKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorMetric)
    }).catch(() => {}); // Silent fail
  }
};

// Track navigation performance
export const trackNavigation = () => {
  if (!performance.getEntriesByType) return;
  
  const navigationEntries = performance.getEntriesByType('navigation');
  if (navigationEntries.length > 0) {
    const nav = navigationEntries[0];
    sendAnalytics('Navigation_Time', nav.loadEventEnd - nav.fetchStart, 'Navigation');
    sendAnalytics('DOM_Load_Time', nav.domContentLoadedEventEnd - nav.fetchStart, 'Navigation');
  }
};

// Initialize production performance monitoring
export const initializePerformanceMonitoring = () => {
  // Always track Core Web Vitals in production
  trackCoreWebVitals();
  
  // Track initial navigation performance
  if (document.readyState === 'complete') {
    trackNavigation();
  } else {
    window.addEventListener('load', trackNavigation);
  }
};