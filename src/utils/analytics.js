/**
 * Client-Side Analytics Utility
 * Tracks page views by sending them to the API server
 */

import httpService from '../services/httpService';

class ClientAnalytics {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.userId = null; // Will be set if user is authenticated
  }

  // Get or create a session ID in localStorage
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Generate a simple session ID
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Set user ID for authenticated tracking
  setUserId(userId) {
    this.userId = userId;
  }

  // Track a page view
  async trackPageView(path = window.location.pathname) {
    try {
      console.log(`🔍 [Analytics] Attempting to track page view: ${path}`);

      const analyticsData = {
        path: path,
        method: 'GET',
        userId: this.userId,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        referer: document.referrer || null,
        timestamp: new Date().toISOString(),
        // Client-side tracking indicator
        clientTracked: true,
      };

      console.log(`📤 [Analytics] Sending data:`, analyticsData);

      // Try direct fetch instead of httpService to test
      const response = await fetch(
        'http://localhost:8000/api/analytics/track',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analyticsData),
        },
      );

      const result = await response.json();
      console.log(`✅ [Analytics] Direct fetch response:`, result);
      console.log('📊 Page view tracked:', path);

      return { success: true };
    } catch (error) {
      console.error('Failed to track page view:', error);
      return { success: false, error: error.message };
    }
  }

  // Track page view with automatic path detection
  async trackCurrentPage() {
    return this.trackPageView();
  }
}

// Create singleton instance
const analytics = new ClientAnalytics();

// DISABLED: Auto-track page loads to prevent double tracking
// Server-side middleware already handles this
/*
window.addEventListener('load', () => {
  analytics.trackCurrentPage();
});

// Track route changes in SPA
let lastPath = window.location.pathname;
setInterval(() => {
  const currentPath = window.location.pathname;
  if (currentPath !== lastPath) {
    lastPath = currentPath;
    analytics.trackCurrentPage();
  }
}, 100); // Check every 100ms for route changes
*/

export default analytics;
