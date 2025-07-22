/**
 * AI Training & Learning Platform Guard Configuration
 * Deployed to: ai-tfl.equussystems.co
 * Access: Admin and User roles with email verification
 */

// Configuration for AI-TRL subdomain
const SUBDOMAIN_AUTH_CONFIG = {
  // Main authentication API
  mainApiUrl: 'https://equussystems.co/api',
  loginUrl: 'https://equussystems.co/auth/signin',
  
  // Subdomain-specific settings
  subdomain: 'ai-trl',
  subdomainName: 'AI Training & Learning Platform',
  allowedRoles: ['admin', 'user'],
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
  console.log('Initializing AI-TRL Authentication Guard');
  
  // Create and initialize the authentication guard
  const authGuard = new SubdomainAuthGuard(SUBDOMAIN_AUTH_CONFIG);
  
  // Listen for authentication success
  window.addEventListener('subdomainAuthSuccess', (event) => {
    const { user, isAuthenticated } = event.detail;
    
    console.log('AI-TRL: Authentication successful for', user.email);
    console.log('User role:', user.role);
    console.log('Email verified:', user.emailVerified);
    
    // Initialize application with authenticated user
    if (typeof initializeAITRLApp === 'function') {
      initializeAITRLApp(user);
    } else {
      console.warn('initializeAITRLApp function not found - define this function to initialize your application');
    }
    
    // Make user data available globally
    window.aiTrlUser = user;
    window.aiTrlAuth = {
      isAuthenticated,
      user,
      hasAdminAccess: user.role === 'admin',
      canManageContent: ['admin', 'user'].includes(user.role)
    };
  });
  
  // Handle authentication errors
  window.addEventListener('subdomainAuthError', (event) => {
    console.error('AI-TRL: Authentication error', event.detail);
  });
});

// Example application initialization function
// This should be defined in your main application JavaScript
function initializeAITRLApp(user) {
  console.log('Initializing AI Training & Learning Platform for user:', user);
  
  // Update user interface with user information
  const userElements = document.querySelectorAll('[data-user-name]');
  userElements.forEach(el => {
    el.textContent = `${user.firstName} ${user.lastName}`;
  });
  
  const userEmailElements = document.querySelectorAll('[data-user-email]');
  userEmailElements.forEach(el => {
    el.textContent = user.email;
  });
  
  const roleElements = document.querySelectorAll('[data-user-role]');
  roleElements.forEach(el => {
    el.textContent = user.role;
  });
  
  // Show/hide admin features based on role
  const adminElements = document.querySelectorAll('[data-admin-only]');
  adminElements.forEach(el => {
    el.style.display = user.role === 'admin' ? 'block' : 'none';
  });
  
  // Initialize any AI training modules or features
  if (typeof initializeTrainingModules === 'function') {
    initializeTrainingModules(user);
  }
  
  // Set up logout functionality
  setupLogoutHandlers();
  
  console.log('AI-TRL application initialized successfully');
}

// Setup logout functionality
function setupLogoutHandlers() {
  const logoutButtons = document.querySelectorAll('[data-logout]');
  logoutButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      if (confirm('Are you sure you want to logout?')) {
        // Clear local authentication data
        localStorage.removeItem('equus_auth_token');
        localStorage.removeItem('equus_refresh_token');
        sessionStorage.removeItem('equus_auth_token');
        sessionStorage.removeItem('equus_refresh_token');
        
        // Redirect to main site
        window.location.href = 'https://equussystems.co/auth/signin';
      }
    });
  });
}