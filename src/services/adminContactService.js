import httpService from './httpService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const adminContactService = {
  /**
   * Get all contacts with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (pending, read, replied, archived)
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {string} params.search - Search term
   * @param {string} params.sort - Sort field (default: createdAt)
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  async getAllContacts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters if provided
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/api/contacts?${queryString}` : '/api/contacts';
      
      const response = await httpService.get(url);
      return response;
    } catch (error) {
      console.error('Get all contacts error:', error);
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        response: error.response
      });
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to fetch contacts' 
      };
    }
  },

  /**
   * Get contact by ID
   * @param {string} contactId - Contact ID
   * @returns {Promise} API response
   */
  async getContactById(contactId) {
    try {
      if (!contactId) {
        throw new Error('Contact ID is required');
      }

      const response = await httpService.get(`/api/contacts/${contactId}`);
      return response;
    } catch (error) {
      console.error('Get contact by ID error:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to fetch contact details' 
      };
    }
  },

  /**
   * Update contact status
   * @param {string} contactId - Contact ID
   * @param {string} status - New status (pending, read, replied, archived)
   * @returns {Promise} API response
   */
  async updateContactStatus(contactId, status) {
    try {
      if (!contactId || !status) {
        throw new Error('Contact ID and status are required');
      }

      console.log('Updating contact status:', { contactId, status });
      const response = await httpService.put(`/api/contacts/${contactId}/status`, {
        status
      });
      console.log('Update status response:', response);
      
      return response;
    } catch (error) {
      console.error('Update contact status error:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to update contact status' 
      };
    }
  },

  /**
   * Get contact statistics
   * @returns {Promise} API response
   */
  async getContactStats() {
    try {
      console.log('Making contact stats request...');
      const response = await httpService.get('/api/contacts/stats');
      console.log('Contact stats response:', response);
      return response;
    } catch (error) {
      console.error('Get contact stats error:', error);
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        response: error.response
      });
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to fetch contact statistics' 
      };
    }
  },

  /**
   * Get recent contacts
   * @param {number} limit - Number of recent contacts to fetch (default: 5)
   * @returns {Promise} API response
   */
  async getRecentContacts(limit = 5) {
    try {
      console.log('Making recent contacts request...');
      const response = await httpService.get(`/api/contacts/recent?limit=${limit}`);
      console.log('Recent contacts response:', response);
      return response;
    } catch (error) {
      console.error('Get recent contacts error:', error);
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        response: error.response
      });
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to fetch recent contacts' 
      };
    }
  },

  /**
   * Delete contact
   * @param {string} contactId - Contact ID
   * @returns {Promise} API response
   */
  async deleteContact(contactId) {
    try {
      if (!contactId) {
        throw new Error('Contact ID is required');
      }

      const response = await httpService.delete(`/api/contacts/${contactId}`);
      return response;
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to delete contact' 
      };
    }
  },

  /**
   * Batch update contact status
   * @param {Array} contactIds - Array of contact IDs
   * @param {string} status - New status for all contacts
   * @returns {Promise} Array of update results
   */
  async batchUpdateStatus(contactIds, status) {
    try {
      if (!Array.isArray(contactIds) || contactIds.length === 0) {
        throw new Error('Contact IDs array is required');
      }
      if (!status) {
        throw new Error('Status is required');
      }

      const promises = contactIds.map(id => 
        this.updateContactStatus(id, status).catch(error => ({
          id,
          success: false,
          error: error.message || 'Failed to update'
        }))
      );

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Batch update status error:', error);
      throw { 
        success: false, 
        message: 'Failed to batch update contact status' 
      };
    }
  },

  /**
   * Format contact data for display
   * @param {Object} contact - Raw contact object
   * @returns {Object} Formatted contact object
   */
  formatContact(contact) {
    if (!contact) return null;

    return {
      ...contact,
      displayDate: this.formatDate(contact.createdAt),
      statusColor: this.getStatusColor(contact.status),
      statusIcon: this.getStatusIcon(contact.status),
      shortMessage: contact.message ? 
        contact.message.length > 100 ? 
          `${contact.message.substring(0, 100)}...` : 
          contact.message : ''
    };
  },

  /**
   * Format date for display
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Get status color for UI
   * @param {string} status - Contact status
   * @returns {string} Color class or hex code
   */
  getStatusColor(status) {
    const colors = {
      pending: 'orange',
      read: 'blue',
      replied: 'green',
      archived: 'gray'
    };
    return colors[status] || 'gray';
  },

  /**
   * Get status icon for UI
   * @param {string} status - Contact status
   * @returns {string} Icon identifier or emoji
   */
  getStatusIcon(status) {
    const icons = {
      pending: '📩',
      read: '👁️',
      replied: '✅',
      archived: '📁'
    };
    return icons[status] || '📩';
  }
};

export default adminContactService;