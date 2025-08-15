/**
 * Client-Side Analytics Service
 * Tracks page views and user interactions from the React app
 */

import httpService from './httpService';

class ClientAnalytics {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.isEnabled = true;
  }

  /**
   * Get or create a session ID for tracking
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate a simple session ID
   */
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Track a page view
   */
  async trackPageView(path = window.location.pathname) {
    if (!this.isEnabled) return;

    try {
      console.log(`[Analytics] Tracking page view: ${path}`);

      const data = {
        path,
        method: 'GET',
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referer: document.referrer || null,
      };

      await httpService.post('/api/analytics/track', data);
      console.log(`[Analytics] Successfully tracked: ${path}`);
    } catch (error) {
      console.error('[Analytics] Failed to track page view:', error);
    }
  }

  /**
   * Track a custom event
   */
  async trackEvent(eventName, eventData = {}) {
    if (!this.isEnabled) return;

    try {
      const data = {
        path: window.location.pathname,
        method: 'EVENT',
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        eventName,
        eventData,
        userAgent: navigator.userAgent,
      };

      await httpService.post('/api/analytics/track', data);
      console.log(`[Analytics] Successfully tracked event: ${eventName}`);
    } catch (error) {
      console.error('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Enable/disable analytics tracking
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`[Analytics] Tracking ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Create and export a singleton instance
const clientAnalytics = new ClientAnalytics();

export default clientAnalytics;
