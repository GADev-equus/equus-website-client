/**
 * AI Tutorial Platform Guard Configuration
 * Deployed to: ai-tutor.equussystems.co
 * Access: Admin role only with email verification
 */

// Configuration for AI-TUTOT subdomain (Admin only)
const SUBDOMAIN_AUTH_CONFIG = {
  // Main authentication API
  mainApiUrl: 'https://equussystems.co/api',
  loginUrl: 'https://equussystems.co/auth/signin',
  
  // Subdomain-specific settings
  subdomain: 'ai-tutot',
  subdomainName: 'AI Tutorial Platform (Admin Only)',
  allowedRoles: ['admin'],
  requireEmailVerification: true,
  
  // UI configuration
  showProgressBar: true,
  showLoadingMessages: true,
  progressThreshold: 5000, // 5 seconds before showing cold start message
  
  // Timeout settings
  authTimeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000
};

// Initialize guard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing AI-TUTOT Authentication Guard (Admin Only)');
  
  // Create and initialize the authentication guard
  const authGuard = new SubdomainAuthGuard(SUBDOMAIN_AUTH_CONFIG);
  
  // Listen for authentication success
  window.addEventListener('subdomainAuthSuccess', (event) => {
    const { user, isAuthenticated } = event.detail;
    
    console.log('AI-TUTOT: Admin authentication successful for', user.email);
    console.log('User role:', user.role);
    console.log('Email verified:', user.emailVerified);
    
    // Double-check admin access (should be caught by guard, but extra safety)
    if (user.role !== 'admin') {
      console.error('AI-TUTOT: Non-admin user somehow passed guard - blocking access');
      window.location.href = 'https://equussystems.co/auth/signin?error=insufficient_privileges';
      return;
    }
    
    // Initialize admin application
    if (typeof initializeAITutotApp === 'function') {
      initializeAITutotApp(user);
    } else {
      console.warn('initializeAITutotApp function not found - define this function to initialize your admin application');
    }
    
    // Make admin user data available globally
    window.aiTutotAdmin = user;
    window.aiTutotAuth = {
      isAuthenticated,
      user,
      isAdmin: true, // Guaranteed by guard
      canManageAll: true,
      canEditContent: true,
      canManageUsers: true
    };
  });
  
  // Handle authentication errors
  window.addEventListener('subdomainAuthError', (event) => {
    console.error('AI-TUTOT: Authentication error', event.detail);
  });
});

// Example admin application initialization function
// This should be defined in your main application JavaScript
function initializeAITutotApp(adminUser) {
  console.log('Initializing AI Tutorial Platform (Admin) for admin:', adminUser);
  
  // Update admin interface with user information
  const adminElements = document.querySelectorAll('[data-admin-name]');
  adminElements.forEach(el => {
    el.textContent = `${adminUser.firstName} ${adminUser.lastName}`;
  });
  
  const adminEmailElements = document.querySelectorAll('[data-admin-email]');
  adminEmailElements.forEach(el => {
    el.textContent = adminUser.email;
  });
  
  // Show admin-specific navigation and features
  const adminNavElements = document.querySelectorAll('[data-admin-nav]');
  adminNavElements.forEach(el => {
    el.style.display = 'block';
  });
  
  // Initialize admin dashboard features
  if (typeof initializeAdminDashboard === 'function') {
    initializeAdminDashboard(adminUser);
  }
  
  // Initialize tutorial management features
  if (typeof initializeTutorialManagement === 'function') {
    initializeTutorialManagement(adminUser);
  }
  
  // Initialize user management features (if applicable)
  if (typeof initializeUserManagement === 'function') {
    initializeUserManagement(adminUser);
  }
  
  // Set up admin logout functionality
  setupAdminLogoutHandlers();
  
  // Set up audit logging
  setupAdminAuditLogging(adminUser);
  
  console.log('AI-TUTOT admin application initialized successfully');
}

// Setup admin logout functionality with confirmation
function setupAdminLogoutHandlers() {
  const logoutButtons = document.querySelectorAll('[data-admin-logout]');
  logoutButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const confirmation = confirm('Are you sure you want to logout from the Admin Tutorial Platform?');
      if (confirmation) {
        // Log admin logout for audit trail
        console.log(`Admin logout: ${window.aiTutotAdmin?.email} at ${new Date().toISOString()}`);
        
        // Clear local authentication data
        localStorage.removeItem('equus_auth_token');
        localStorage.removeItem('equus_refresh_token');
        sessionStorage.removeItem('equus_auth_token');
        sessionStorage.removeItem('equus_refresh_token');
        
        // Clear subdomain cookies
        document.cookie = 'equus_subdomain_auth=; Domain=.equussystems.co; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax';
        document.cookie = 'equus_subdomain_indicator=; Domain=.equussystems.co; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax';
        
        // Redirect to main site admin dashboard
        window.location.href = 'https://equussystems.co/admin/dashboard';
      }
    });
  });
}

// Setup audit logging for admin actions
function setupAdminAuditLogging(adminUser) {
  // Log admin session start
  console.log(`Admin session started: ${adminUser.email} at ${new Date().toISOString()}`);
  
  // Track admin actions for audit trail
  const auditLog = {
    adminEmail: adminUser.email,
    sessionStart: new Date().toISOString(),
    actions: []
  };
  
  // Log page visibility changes (track when admin leaves/returns to tab)
  document.addEventListener('visibilitychange', () => {
    const action = {
      type: document.hidden ? 'page_hidden' : 'page_visible',
      timestamp: new Date().toISOString()
    };
    auditLog.actions.push(action);
    console.log('Admin audit:', action);
  });
  
  // Store audit log globally for potential reporting
  window.adminAuditLog = auditLog;
  
  // Periodic audit log reporting (every 5 minutes)
  setInterval(() => {
    if (auditLog.actions.length > 0) {
      console.log('Admin audit summary:', {
        admin: adminUser.email,
        sessionDuration: Date.now() - new Date(auditLog.sessionStart).getTime(),
        actionCount: auditLog.actions.length,
        lastAction: auditLog.actions[auditLog.actions.length - 1]
      });
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// Utility function to track admin actions
function trackAdminAction(actionType, details = {}) {
  if (window.adminAuditLog && window.aiTutotAdmin) {
    const action = {
      type: actionType,
      timestamp: new Date().toISOString(),
      admin: window.aiTutotAdmin.email,
      ...details
    };
    
    window.adminAuditLog.actions.push(action);
    console.log('Admin action tracked:', action);
  }
}

// Export admin action tracker for use in other scripts
window.trackAdminAction = trackAdminAction;