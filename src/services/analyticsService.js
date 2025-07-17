/**
 * Analytics Service - Handles analytics data operations
 * Provides functions to fetch analytics data from the backend API
 */

import httpService from './httpService.js';

class AnalyticsService {
  /**
   * Get analytics overview
   * @param {string} period - Time period (1h, 24h, 7d, 30d, 90d)
   * @returns {Promise} - Analytics overview data
   */
  async getOverview(period = '7d') {
    try {
      const response = await httpService.get(`/api/analytics/overview?period=${period}`);
      return {
        success: true,
        data: response.data || response,
        period
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get traffic analytics
   * @param {string} period - Time period (1h, 24h, 7d, 30d, 90d)
   * @param {string} granularity - Data granularity (hourly, daily)
   * @returns {Promise} - Traffic analytics data
   */
  async getTrafficAnalytics(period = '7d', granularity = 'daily') {
    try {
      const response = await httpService.get(`/api/analytics/traffic?period=${period}&granularity=${granularity}`);
      return {
        success: true,
        data: response.data || response,
        period,
        granularity
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get page performance analytics
   * @param {string} period - Time period (1h, 24h, 7d, 30d, 90d)
   * @param {string} sortBy - Sort by field (totalViews, avgResponseTime, uniqueVisitors)
   * @param {number} limit - Number of results to return
   * @returns {Promise} - Page performance data
   */
  async getPagePerformance(period = '7d', sortBy = 'totalViews', limit = 20) {
    try {
      const response = await httpService.get(`/api/analytics/performance?period=${period}&sortBy=${sortBy}&limit=${limit}`);
      return {
        success: true,
        data: response.data || response,
        period,
        sortBy,
        limit
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get user analytics (authenticated users only)
   * @param {string} period - Time period (1h, 24h, 7d, 30d, 90d)
   * @returns {Promise} - User analytics data
   */
  async getUserAnalytics(period = '7d') {
    try {
      const response = await httpService.get(`/api/analytics/users?period=${period}`);
      return {
        success: true,
        data: response.data || response,
        period
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get analytics data for a specific date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {string} type - Analytics type (overview, traffic, performance, users)
   * @returns {Promise} - Analytics data
   */
  async getAnalyticsForDateRange(startDate, endDate, type = 'overview') {
    try {
      const response = await httpService.get(`/api/analytics/${type}?startDate=${startDate}&endDate=${endDate}`);
      return {
        success: true,
        data: response.data || response,
        startDate,
        endDate,
        type
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get real-time analytics summary
   * @returns {Promise} - Real-time analytics data
   */
  async getRealtimeAnalytics() {
    try {
      const response = await httpService.get('/api/analytics/overview?period=1h');
      return {
        success: true,
        data: response.data || response,
        isRealtime: true
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get top pages for a specific period
   * @param {string} period - Time period
   * @param {number} limit - Number of results
   * @returns {Promise} - Top pages data
   */
  async getTopPages(period = '7d', limit = 10) {
    try {
      const overviewData = await this.getOverview(period);
      if (overviewData.success && overviewData.data.topPages) {
        return {
          success: true,
          data: overviewData.data.topPages.slice(0, limit),
          period,
          limit
        };
      }
      return {
        success: false,
        message: 'Failed to fetch top pages data'
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get visitor statistics
   * @param {string} period - Time period
   * @returns {Promise} - Visitor statistics
   */
  async getVisitorStats(period = '7d') {
    try {
      const [overviewData, trafficData] = await Promise.all([
        this.getOverview(period),
        this.getTrafficAnalytics(period)
      ]);

      if (overviewData.success && trafficData.success) {
        return {
          success: true,
          data: {
            totalPageViews: overviewData.data.totalPageViews,
            uniqueVisitors: overviewData.data.uniqueVisitors,
            authenticatedPageViews: overviewData.data.authenticatedPageViews,
            userTypeBreakdown: trafficData.data.userTypeBreakdown,
            trafficData: trafficData.data.trafficData
          },
          period
        };
      }
      return {
        success: false,
        message: 'Failed to fetch visitor statistics'
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get performance metrics summary
   * @param {string} period - Time period
   * @returns {Promise} - Performance metrics
   */
  async getPerformanceMetrics(period = '7d') {
    try {
      const [overviewData, performanceData] = await Promise.all([
        this.getOverview(period),
        this.getPagePerformance(period)
      ]);

      if (overviewData.success && performanceData.success) {
        return {
          success: true,
          data: {
            averageResponseTime: overviewData.data.averageResponseTime,
            overallStats: performanceData.data.overallStats,
            performanceData: performanceData.data.performanceData
          },
          period
        };
      }
      return {
        success: false,
        message: 'Failed to fetch performance metrics'
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Export analytics data
   * @param {string} type - Export type (csv, json)
   * @param {string} period - Time period
   * @param {string} dataType - Data type (overview, traffic, performance)
   * @returns {Promise} - Export result
   */
  async exportAnalytics(type = 'csv', period = '7d', dataType = 'overview') {
    try {
      const response = await httpService.get(`/api/analytics/${dataType}?period=${period}&export=${type}`);
      return {
        success: true,
        data: response.data || response,
        type,
        period,
        dataType
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Get analytics summary for dashboard
   * @param {string} period - Time period
   * @returns {Promise} - Dashboard summary
   */
  async getDashboardSummary(period = '7d') {
    try {
      const [overview, traffic, performance] = await Promise.all([
        this.getOverview(period),
        this.getTrafficAnalytics(period),
        this.getPagePerformance(period, 'totalViews', 5)
      ]);

      if (overview.success && traffic.success && performance.success) {
        return {
          success: true,
          data: {
            overview: overview.data,
            traffic: traffic.data,
            topPages: performance.data.performanceData.slice(0, 5),
            period
          }
        };
      }
      return {
        success: false,
        message: 'Failed to fetch dashboard summary'
      };
    } catch (error) {
      return this.handleAnalyticsError(error);
    }
  }

  /**
   * Validate analytics date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Object} - Validation result
   */
  validateDateRange(startDate, endDate) {
    const errors = {};
    
    if (!startDate || !endDate) {
      errors.general = 'Both start and end dates are required';
      return { isValid: false, errors };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime())) {
      errors.startDate = 'Invalid start date format';
    }

    if (isNaN(end.getTime())) {
      errors.endDate = 'Invalid end date format';
    }

    if (start > end) {
      errors.general = 'Start date must be before end date';
    }

    if (end > now) {
      errors.endDate = 'End date cannot be in the future';
    }

    // Check for reasonable date range (not more than 1 year)
    const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
    if (end - start > maxRange) {
      errors.general = 'Date range cannot exceed 1 year';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format analytics data for charts
   * @param {Array} data - Raw analytics data
   * @param {string} type - Chart type (line, bar, pie)
   * @returns {Object} - Formatted chart data
   */
  formatDataForChart(data, type = 'line') {
    if (!Array.isArray(data)) {
      return { labels: [], datasets: [] };
    }

    switch (type) {
      case 'line':
        return {
          labels: data.map(item => item.period || item.date || item.label),
          datasets: [{
            label: 'Page Views',
            data: data.map(item => item.pageViews || item.count || item.value),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1
          }]
        };
      
      case 'bar':
        return {
          labels: data.map(item => item.path || item.label),
          datasets: [{
            label: 'Views',
            data: data.map(item => item.count || item.totalViews || item.value),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }]
        };
      
      case 'pie':
        return {
          labels: data.map(item => item.userType || item.label),
          datasets: [{
            data: data.map(item => item.count || item.value),
            backgroundColor: [
              'rgba(59, 130, 246, 0.6)',
              'rgba(16, 185, 129, 0.6)',
              'rgba(245, 158, 11, 0.6)',
              'rgba(239, 68, 68, 0.6)',
              'rgba(139, 92, 246, 0.6)'
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
              'rgb(139, 92, 246)'
            ],
            borderWidth: 1
          }]
        };
      
      default:
        return { labels: [], datasets: [] };
    }
  }

  /**
   * Get period display name
   * @param {string} period - Period code
   * @returns {string} - Display name
   */
  getPeriodDisplayName(period) {
    const periodNames = {
      '1h': 'Last Hour',
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 90 Days'
    };
    return periodNames[period] || period;
  }

  /**
   * Calculate percentage change
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {Object} - Change data
   */
  calculatePercentageChange(current, previous) {
    if (previous === 0) {
      return { change: current > 0 ? 100 : 0, direction: current > 0 ? 'up' : 'neutral' };
    }
    
    const change = ((current - previous) / previous) * 100;
    return {
      change: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  }

  /**
   * Handle analytics-related errors
   * @param {Error} error - Error object
   * @returns {Object} - Formatted error response
   */
  handleAnalyticsError(error) {
    const errorResponse = {
      success: false,
      message: 'Analytics operation failed',
      error: error.message
    };

    if (error.status) {
      switch (error.status) {
        case 400:
          errorResponse.message = error.response?.message || 'Invalid request parameters';
          break;
        case 401:
          errorResponse.message = 'Authentication required. Please log in.';
          break;
        case 403:
          errorResponse.message = 'Access denied. Admin privileges required.';
          break;
        case 404:
          errorResponse.message = 'Analytics data not found.';
          break;
        case 429:
          errorResponse.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorResponse.message = 'Server error. Please try again later.';
          break;
        default:
          errorResponse.message = 'Network error. Please check your connection.';
      }
    }

    return errorResponse;
  }

  /**
   * Format number for display
   * @param {number} num - Number to format
   * @returns {string} - Formatted number
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Format response time for display
   * @param {number} ms - Response time in milliseconds
   * @returns {string} - Formatted response time
   */
  formatResponseTime(ms) {
    if (ms >= 1000) {
      return (ms / 1000).toFixed(2) + 's';
    }
    return Math.round(ms) + 'ms';
  }

  /**
   * Get analytics health status
   * @returns {Promise} - Health status
   */
  async getAnalyticsHealth() {
    try {
      const response = await httpService.get('/api/analytics/overview?period=1h');
      return {
        success: true,
        healthy: true,
        message: 'Analytics service is operational'
      };
    } catch (error) {
      return {
        success: false,
        healthy: false,
        message: 'Analytics service is not available'
      };
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

// Add caching for analytics data
if (typeof window !== 'undefined') {
  analyticsService.cache = new Map();
  analyticsService.cacheTimeout = 2 * 60 * 1000; // 2 minutes for analytics data
  
  // Override getOverview to add caching
  const originalGetOverview = analyticsService.getOverview.bind(analyticsService);
  analyticsService.getOverview = async function(period) {
    const cacheKey = `overview_${period}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const result = await originalGetOverview(period);
    
    if (result.success) {
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    }
    
    return result;
  };
}

export default analyticsService;
export { AnalyticsService };