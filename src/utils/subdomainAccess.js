import authService from '@/services/authService';

/**
 * Subdomain Access Management Utility
 * Handles secure access to protected subdomains with authentication validation
 * Based on the existing Equus authentication system
 */

/**
 * Subdomain configuration and access rules
 */
const SUBDOMAIN_CONFIG = {
  'ai-tfl': {
    name: 'AI Training & Learning Platform',
    description: 'Machine learning training resources',
    icon: '🤖',
    allowedRoles: ['admin', 'user'],
    requireEmailVerification: true,
    url: 'https://ai-tfl.equussystems.co'
  },
  'ai-tutor': {
    name: 'AI Tutorial Platform',
    description: 'Advanced AI tutorials and documentation',
    icon: '📚',
    allowedRoles: ['admin', 'user'], // TEMP: Allow regular users to test
    requireEmailVerification: true,
    url: 'https://ai-tutor.equussystems.co'
  }
};

/**
 * Handles secure access to protected subdomains
 * Ensures authentication tokens are properly validated and transferred
 * 
 * @param {string} subdomain - The subdomain identifier (ai-trl, ai-tutot)
 * @param {Object} options - Additional options for access handling
 * @param {Function} options.onNotification - Callback for showing notifications (toast)
 * @returns {Promise<Object>} Result object with success status and details
 */
export const accessProtectedSubdomain = async (subdomain, options = {}) => {
  try {
    const {
      validateFirst = true,
      openInNewTab = false,
      onNotification = null // Callback function for notifications
    } = options;

    // Verify subdomain configuration exists
    if (!SUBDOMAIN_CONFIG[subdomain]) {
      throw new Error(`Unknown subdomain: ${subdomain}`);
    }

    const config = SUBDOMAIN_CONFIG[subdomain];

    // Verify current authentication state if requested
    if (validateFirst) {
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser.success) {
        const errorMessage = "Please log in to access protected resources.";
        if (onNotification) {
          onNotification({
            title: "Authentication Required",
            description: errorMessage,
            variant: "destructive"
          });
        }
        return { success: false, error: 'Not authenticated', message: errorMessage };
      }

      // Check user permissions for this subdomain
      const hasAccess = checkSubdomainPermissions(currentUser.user, subdomain);
      
      if (!hasAccess) {
        const reason = getAccessDenialReason(currentUser.user, subdomain);
        const errorMessage = `Your account doesn't have permission to access ${config.name}. ${reason}`;
        
        if (onNotification) {
          onNotification({
            title: "Access Denied",
            description: errorMessage,
            variant: "destructive"
          });
        }
        return { success: false, error: 'Access denied', reason, message: errorMessage };
      }
    }

    // Get JWT token from authService (works with current token management)
    const currentUser = await authService.getCurrentUser();
    console.log('🔍 SubdomainAccess - Current user result:', currentUser.success);
    console.log('🔍 SubdomainAccess - AuthService token available:', !!authService.token);
    
    if (!currentUser.success || !authService.token) {
      const errorMessage = "Authentication token not found. Please log in again.";
      console.log('❌ SubdomainAccess - No token available for URL appending');
      if (onNotification) {
        onNotification({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      return { success: false, error: 'No auth token', message: errorMessage };
    }

    const token = authService.token;
    console.log('🔑 SubdomainAccess - Token found, appending to URL:', token ? token.substring(0, 20) + '...' : 'NULL');

    // Show loading state
    if (onNotification) {
      onNotification({
        title: "Accessing Protected Resource",
        description: `Connecting to ${config.name}...`,
        duration: 3000
      });
    }

    // Navigate to subdomain with JWT token in URL (works across all domains)
    // The subdomain will read the token, store it locally, then remove it from URL
    const targetUrl = `${config.url}?auth_token=${encodeURIComponent(token)}`;
    
    if (openInNewTab) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = targetUrl;
    }

    return { success: true, url: targetUrl };
    
  } catch (error) {
    console.error('Subdomain access error:', error);
    const errorMessage = error.message || "Failed to access protected resource. Please try again.";
    
    if (options.onNotification) {
      options.onNotification({
        title: "Access Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
    return { success: false, error: error.message, message: errorMessage };
  }
};

/**
 * Check if user has permission to access specific subdomain
 * 
 * @param {Object} user - User object from authentication context
 * @param {string} subdomain - Subdomain identifier
 * @returns {boolean} Whether user has access
 */
export const checkSubdomainPermissions = (user, subdomain) => {
  const config = SUBDOMAIN_CONFIG[subdomain];
  if (!config) return false;

  // Check role permission
  if (!config.allowedRoles.includes(user.role)) {
    return false;
  }

  // Check email verification if required
  if (config.requireEmailVerification && !user.emailVerified) {
    return false;
  }

  // Check account status
  if (!user.isActive || user.accountStatus !== 'active' || user.isLocked) {
    return false;
  }

  return true;
};

/**
 * Get human-readable reason for access denial
 * 
 * @param {Object} user - User object
 * @param {string} subdomain - Subdomain identifier
 * @returns {string} Reason for denial
 */
export const getAccessDenialReason = (user, subdomain) => {
  const config = SUBDOMAIN_CONFIG[subdomain];
  if (!config) return 'Invalid subdomain';

  if (!config.allowedRoles.includes(user.role)) {
    if (user.role === 'user' && config.allowedRoles.includes('admin') && !config.allowedRoles.includes('user')) {
      return 'Contact administrators for access approval';
    }
    return `Requires ${config.allowedRoles.join(' or ')} role (you have: ${user.role})`;
  }

  if (config.requireEmailVerification && !user.emailVerified) {
    return 'Email verification required';
  }

  if (!user.isActive) {
    return 'Account is inactive';
  }

  if (user.accountStatus !== 'active') {
    return `Account status: ${user.accountStatus}`;
  }

  if (user.isLocked) {
    return 'Account is locked';
  }

  return 'Access denied';
};

/**
 * Get list of accessible subdomains for a user
 * 
 * @param {Object} user - User object
 * @returns {Array} Array of accessible subdomain configurations
 */
export const getAccessibleSubdomains = (user) => {
  if (!user) return [];

  return Object.entries(SUBDOMAIN_CONFIG)
    .filter(([subdomain]) => checkSubdomainPermissions(user, subdomain))
    .map(([id, config]) => ({
      id,
      ...config,
      status: 'accessible'
    }));
};

/**
 * Get list of all subdomains with access status for a user
 * 
 * @param {Object} user - User object
 * @returns {Array} Array of all subdomains with status
 */
export const getAllSubdomainsWithStatus = (user) => {
  return Object.entries(SUBDOMAIN_CONFIG).map(([id, config]) => ({
    id,
    ...config,
    hasAccess: user ? checkSubdomainPermissions(user, id) : false,
    accessReason: user ? (checkSubdomainPermissions(user, id) ? 'accessible' : getAccessDenialReason(user, id)) : 'Not logged in'
  }));
};


/**
 * Clear subdomain authentication cookies
 */
export const clearSubdomainAuthCookies = () => {
  try {
    const domain = '.equussystems.co';
    const clearOptions = `Domain=${domain}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax`;

    document.cookie = `equus_subdomain_auth=; ${clearOptions}`;
    document.cookie = `equus_subdomain_refresh=; ${clearOptions}`;
    document.cookie = `equus_subdomain_indicator=; ${clearOptions}`;
  } catch (error) {
    console.warn('Could not clear subdomain cookies:', error);
  }
};

/**
 * Batch access multiple subdomains (opens in new tabs)
 * 
 * @param {Array} subdomains - Array of subdomain identifiers
 * @param {Object} user - User object
 */
export const accessMultipleSubdomains = async (subdomains, user) => {
  const results = [];
  
  for (const subdomain of subdomains) {
    if (checkSubdomainPermissions(user, subdomain)) {
      const result = await accessProtectedSubdomain(subdomain, {
        validateFirst: false,
        showToast: false,
        openInNewTab: true
      });
      results.push({ subdomain, ...result });
    } else {
      results.push({ 
        subdomain, 
        success: false, 
        error: 'No permission', 
        reason: getAccessDenialReason(user, subdomain) 
      });
    }
  }

  return results;
};

/**
 * Get subdomain display name
 * 
 * @param {string} subdomain - Subdomain identifier
 * @returns {string} Human-readable name
 */
export const getSubdomainName = (subdomain) => {
  return SUBDOMAIN_CONFIG[subdomain]?.name || subdomain;
};

/**
 * Get subdomain configuration
 * 
 * @param {string} subdomain - Subdomain identifier
 * @returns {Object|null} Subdomain configuration
 */
export const getSubdomainConfig = (subdomain) => {
  return SUBDOMAIN_CONFIG[subdomain] || null;
};

// Export configuration for external use
export { SUBDOMAIN_CONFIG };

export default {
  accessProtectedSubdomain,
  checkSubdomainPermissions,
  getAccessibleSubdomains,
  getAllSubdomainsWithStatus,
  getAccessDenialReason,
  clearSubdomainAuthCookies,
  accessMultipleSubdomains,
  getSubdomainName,
  getSubdomainConfig,
  SUBDOMAIN_CONFIG
};