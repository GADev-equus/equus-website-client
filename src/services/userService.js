/**
 * User Service - Handles user management operations
 * Provides admin functions for user management and user statistics
 */

import httpService from './httpService.js';

class UserService {
  /**
   * Get all users (Admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} - Users list
   */
  async getAllUsers(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/users${queryString ? `?${queryString}` : ''}`;
      const response = await httpService.get(endpoint);
      return {
        success: true,
        data: response,
        users: response.users || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Get user by ID (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise} - User details
   */
  async getUserById(userId) {
    try {
      const response = await httpService.get(`/api/users/${userId}`);
      return {
        success: true,
        data: response,
        user: response.user || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Update user role (Admin only)
   * @param {string} userId - User ID
   * @param {string} role - New role
   * @returns {Promise} - Update result
   */
  async updateUserRole(userId, role) {
    try {
      const response = await httpService.put(`/api/users/${userId}/role`, { role });
      return {
        success: true,
        data: response,
        message: response.message || 'User role updated successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Update user status (Admin only)
   * @param {string} userId - User ID
   * @param {string} status - New status
   * @returns {Promise} - Update result
   */
  async updateUserStatus(userId, status) {
    try {
      const response = await httpService.put(`/api/users/${userId}/status`, { status });
      return {
        success: true,
        data: response,
        message: response.message || 'User status updated successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Get user statistics (Admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} - User statistics
   */
  async getUserStats(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/users/admin/stats${queryString ? `?${queryString}` : ''}`;
      const response = await httpService.get(endpoint);
      return {
        success: true,
        data: response,
        stats: response.stats || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Delete user account (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise} - Delete result
   */
  async deleteUser(userId) {
    try {
      const response = await httpService.delete(`/api/users/${userId}`);
      return {
        success: true,
        data: response,
        message: response.message || 'User deleted successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Search users (Admin only)
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} - Search results
   */
  async searchUsers(searchParams) {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await httpService.get(`/api/users/search?${queryString}`);
      return {
        success: true,
        data: response,
        users: response.users || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Get user activity log (Admin only)
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - Activity log
   */
  async getUserActivity(userId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/users/${userId}/activity${queryString ? `?${queryString}` : ''}`;
      const response = await httpService.get(endpoint);
      return {
        success: true,
        data: response,
        activities: response.activities || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Export users data (Admin only)
   * @param {Object} params - Export parameters
   * @returns {Promise} - Export result
   */
  async exportUsers(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/users/export${queryString ? `?${queryString}` : ''}`;
      const response = await httpService.get(endpoint);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Send user notification (Admin only)
   * @param {string} userId - User ID
   * @param {Object} notificationData - Notification data
   * @returns {Promise} - Send result
   */
  async sendUserNotification(userId, notificationData) {
    try {
      const response = await httpService.post(`/api/users/${userId}/notify`, notificationData);
      return {
        success: true,
        data: response,
        message: response.message || 'Notification sent successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Bulk update users (Admin only)
   * @param {Object} updateData - Bulk update data
   * @returns {Promise} - Update result
   */
  async bulkUpdateUsers(updateData) {
    try {
      const response = await httpService.post('/api/users/bulk-update', updateData);
      return {
        success: true,
        data: response,
        message: response.message || 'Bulk update completed successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Get user permissions (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise} - User permissions
   */
  async getUserPermissions(userId) {
    try {
      const response = await httpService.get(`/api/users/${userId}/permissions`);
      return {
        success: true,
        data: response,
        permissions: response.permissions || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Update user permissions (Admin only)
   * @param {string} userId - User ID
   * @param {Array} permissions - New permissions
   * @returns {Promise} - Update result
   */
  async updateUserPermissions(userId, permissions) {
    try {
      const response = await httpService.put(`/api/users/${userId}/permissions`, { permissions });
      return {
        success: true,
        data: response,
        message: response.message || 'User permissions updated successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Get user summary statistics
   * @returns {Promise} - Summary statistics
   */
  async getUserSummaryStats() {
    try {
      const response = await httpService.get('/api/users/stats/summary');
      return {
        success: true,
        data: response,
        stats: response.stats || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Validate user data
   * @param {Object} userData - User data to validate
   * @returns {Object} - Validation result
   */
  validateUserData(userData) {
    const errors = {};

    // Email validation
    if (!userData.email || !userData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // First name validation
    if (!userData.firstName || !userData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (userData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!userData.lastName || !userData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (userData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Role validation
    if (userData.role && !['admin', 'user'].includes(userData.role)) {
      errors.role = 'Invalid role specified';
    }

    // Status validation
    if (userData.status && !['active', 'inactive', 'suspended'].includes(userData.status)) {
      errors.status = 'Invalid status specified';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Check if email format is valid
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Handle user-related errors
   * @param {Error} error - Error object
   * @returns {Object} - Formatted error response
   */
  handleUserError(error) {
    const errorResponse = {
      success: false,
      message: 'User operation failed',
      error: error.message
    };

    if (error.status) {
      switch (error.status) {
        case 400:
          errorResponse.message = error.response?.message || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorResponse.message = 'Authentication required. Please log in.';
          break;
        case 403:
          errorResponse.message = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorResponse.message = 'User not found.';
          break;
        case 409:
          errorResponse.message = error.response?.message || 'User already exists.';
          break;
        case 422:
          errorResponse.message = error.response?.message || 'Validation failed. Please check your input.';
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
   * Get user role display name
   * @param {string} role - User role
   * @returns {string} - Display name
   */
  getRoleDisplayName(role) {
    const roleNames = {
      admin: 'Administrator',
      user: 'User',
      moderator: 'Moderator'
    };
    return roleNames[role] || role;
  }

  /**
   * Get user status display name
   * @param {string} status - User status
   * @returns {string} - Display name
   */
  getStatusDisplayName(status) {
    const statusNames = {
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      pending: 'Pending'
    };
    return statusNames[status] || status;
  }

  /**
   * Format user data for display
   * @param {Object} user - User data
   * @returns {Object} - Formatted user data
   */
  formatUserForDisplay(user) {
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      roleDisplay: this.getRoleDisplayName(user.role),
      statusDisplay: this.getStatusDisplayName(user.status),
      createdAtFormatted: new Date(user.createdAt).toLocaleDateString(),
      lastLoginFormatted: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
    };
  }

  /**
   * Get current user profile
   * @returns {Promise} - User profile
   */
  async getCurrentProfile() {
    try {
      const response = await httpService.get('/api/users/profile');
      return {
        success: true,
        data: response,
        user: response.user || response.data || response
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Update current user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Update result
   */
  async updateProfile(userData) {
    try {
      const response = await httpService.put('/api/users/profile', userData);
      return {
        success: true,
        data: response,
        user: response.user || response.data || response,
        message: response.message || 'Profile updated successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @returns {Promise} - Change result
   */
  async changePassword(passwordData) {
    try {
      const response = await httpService.put('/api/users/password', passwordData);
      return {
        success: true,
        data: response,
        message: response.message || 'Password changed successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Delete user account
   * @returns {Promise} - Delete result
   */
  async deleteAccount() {
    try {
      const response = await httpService.delete('/api/users/account');
      return {
        success: true,
        data: response,
        message: response.message || 'Account deleted successfully'
      };
    } catch (error) {
      return this.handleUserError(error);
    }
  }

  /**
   * Format users list for display
   * @param {Array} users - Users array
   * @returns {Array} - Formatted users array
   */
  formatUsersForDisplay(users) {
    return users.map(user => this.formatUserForDisplay(user));
  }

  /**
   * Get user statistics summary
   * @returns {Object} - Statistics summary
   */
  getUserStatsSummary(users) {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    
    return {
      total,
      active,
      inactive,
      suspended,
      admins,
      regularUsers,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
      adminPercentage: total > 0 ? Math.round((admins / total) * 100) : 0
    };
  }

  /**
   * Batch process users
   * @param {Array} users - Users to process
   * @param {Function} processor - Processing function
   * @returns {Array} - Processed results
   */
  async batchProcessUsers(users, processor) {
    const results = [];
    const batchSize = 10;
    
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(user => processor(user))
      );
      results.push(...batchResults);
    }
    
    return results;
  }
}

// Create singleton instance
const userService = new UserService();

// Add caching for user data
if (typeof window !== 'undefined') {
  userService.cache = new Map();
  userService.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  // Override getUserById to add caching
  const originalGetUserById = userService.getUserById.bind(userService);
  userService.getUserById = async function(userId) {
    const cacheKey = `user_${userId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const result = await originalGetUserById(userId);
    
    if (result.success) {
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    }
    
    return result;
  };
}

export default userService;
export { UserService };