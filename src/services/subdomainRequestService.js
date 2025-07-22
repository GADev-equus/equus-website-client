import httpService from './httpService';

/**
 * Subdomain Request Service
 * Handles API calls for subdomain access request management
 */
const subdomainRequestService = {
  /**
   * Submit a new subdomain access request
   * @param {string} subdomainId - The subdomain identifier (ai-trl, ai-tutot)
   * @param {string} requestReason - Optional reason for the request
   * @returns {Promise<Object>} API response
   */
  async submitRequest(subdomainId, requestReason = '') {
    try {
      const response = await httpService.post('/api/subdomain-requests', {
        subdomainId,
        requestReason
      });
      return response;
    } catch (error) {
      console.error('Submit request error:', error);
      throw error;
    }
  },

  /**
   * Get user's own subdomain requests
   * @param {Object} options - Query options
   * @returns {Promise<Object>} API response with user's requests
   */
  async getMyRequests(options = {}) {
    try {
      const { subdomainId, status } = options;
      const params = new URLSearchParams();
      
      if (subdomainId) params.append('subdomainId', subdomainId);
      if (status) params.append('status', status);

      const queryString = params.toString();
      const url = queryString ? `/api/subdomain-requests/my-requests?${queryString}` : '/api/subdomain-requests/my-requests';
      
      const response = await httpService.get(url);
      return response;
    } catch (error) {
      console.error('Get my requests error:', error);
      throw error;
    }
  },

  /**
   * Check user's access status for subdomains
   * @param {string} subdomainId - Optional specific subdomain to check
   * @returns {Promise<Object>} API response with access status
   */
  async getAccessStatus(subdomainId = null) {
    try {
      const url = subdomainId 
        ? `/api/subdomain-requests/access-status?subdomainId=${subdomainId}`
        : '/api/subdomain-requests/access-status';
      
      const response = await httpService.get(url);
      return response;
    } catch (error) {
      console.error('Get access status error:', error);
      throw error;
    }
  },

  /**
   * Admin: Get all requests with filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} API response with all requests
   */
  async getAllRequests(options = {}) {
    try {
      const { 
        status = 'all', 
        subdomainId, 
        limit = 50, 
        skip = 0, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = options;
      
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (subdomainId) params.append('subdomainId', subdomainId);
      if (limit) params.append('limit', limit.toString());
      if (skip) params.append('skip', skip.toString());
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const queryString = params.toString();
      const url = queryString ? `/api/subdomain-requests/admin/all?${queryString}` : '/api/subdomain-requests/admin/all';
      
      const response = await httpService.get(url);
      
      return response;
    } catch (error) {
      console.error('SubdomainRequestService: Get all requests error:', error);
      throw error;
    }
  },

  /**
   * Admin: Get pending requests
   * @param {Object} options - Query options
   * @returns {Promise<Object>} API response with pending requests
   */
  async getPendingRequests(options = {}) {
    try {
      const { limit = 50, skip = 0 } = options;
      const params = new URLSearchParams();
      
      if (limit) params.append('limit', limit.toString());
      if (skip) params.append('skip', skip.toString());

      const queryString = params.toString();
      const url = queryString ? `/api/subdomain-requests/admin/pending?${queryString}` : '/api/subdomain-requests/admin/pending';
      
      const response = await httpService.get(url);
      return response;
    } catch (error) {
      console.error('Get pending requests error:', error);
      throw error;
    }
  },

  /**
   * Admin: Approve a request
   * @param {string} requestId - The request ID to approve
   * @param {Object} data - Approval data
   * @returns {Promise<Object>} API response
   */
  async approveRequest(requestId, data = {}) {
    try {
      const { adminMessage = '', expiresAt = null } = data;
      
      const response = await httpService.put(`/api/subdomain-requests/admin/${requestId}/approve`, {
        adminMessage,
        expiresAt
      });
      return response;
    } catch (error) {
      console.error('Approve request error:', error);
      throw error;
    }
  },

  /**
   * Admin: Deny a request
   * @param {string} requestId - The request ID to deny
   * @param {Object} data - Denial data
   * @returns {Promise<Object>} API response
   */
  async denyRequest(requestId, data = {}) {
    try {
      const { adminMessage = '' } = data;
      
      const response = await httpService.put(`/api/subdomain-requests/admin/${requestId}/deny`, {
        adminMessage
      });
      return response;
    } catch (error) {
      console.error('Deny request error:', error);
      throw error;
    }
  },

  /**
   * Admin: Get request statistics
   * @returns {Promise<Object>} API response with statistics
   */
  async getRequestStats() {
    try {
      const response = await httpService.get('/api/subdomain-requests/admin/stats');
      
      return response;
    } catch (error) {
      console.error('SubdomainRequestService: Get request stats error:', error);
      throw error;
    }
  }
};

export default subdomainRequestService;