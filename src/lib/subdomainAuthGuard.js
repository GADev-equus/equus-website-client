/**
 * Subdomain Authentication Guard Library
 * 
 * Frontend-based authentication protection for subdomains
 * Compatible with existing Equus authentication system
 * Designed for deployment on ai-tfl.equussystems.co and ai-tutor.equussystems.co
 */

class SubdomainAuthGuard {
  constructor(config) {
    this.config = {
      // Main authentication API configuration
      mainApiUrl: 'https://equussystems.co/api',
      loginUrl: 'https://equussystems.co/auth/signin',
      
      // Subdomain-specific configuration
      allowedRoles: ['user', 'admin'],
      requireEmailVerification: true,
      subdomain: '',
      subdomainName: 'Protected Application',
      
      // Token storage configuration
      storageKey: 'equus_auth_token',
      refreshKey: 'equus_refresh_token',
      cookieFallbackKey: 'equus_subdomain_auth',
      
      // UI configuration
      showProgressBar: true,
      showLoadingMessages: true,
      progressThreshold: 5000, // Show cold start messages after 5 seconds
      
      // Timeout configuration
      authTimeout: 30000, // 30 seconds for authentication
      retryAttempts: 3,
      retryDelay: 2000,
      
      // Override with provided config
      ...config
    };
    
    // Internal state
    this.isAuthenticated = false;
    this.user = null;
    this.token = null;
    this.startTime = Date.now();
    this.currentAttempt = 0;
    this.timeouts = [];
    
    // Initialize authentication
    this.initializeAuth();
  }

  /**
   * Initialize authentication process
   */
  async initializeAuth() {
    try {
      this.log('Initializing subdomain authentication guard');
      
      // Show loading state immediately
      this.showLoadingState();
      
      // Set up cold start detection
      this.setupColdStartDetection();
      
      // Try to authenticate
      await this.authenticate();
      
    } catch (error) {
      this.handleError('Authentication initialization failed', error);
    }
  }

  /**
   * Main authentication flow
   */
  async authenticate() {
    try {
      // Step 1: Get authentication token
      this.updateProgress('Retrieving authentication token', 20);
      this.token = await this.getAuthToken();
      
      if (!this.token) {
        this.redirectToLogin('No authentication token found');
        return;
      }

      // Step 2: Validate token with main API
      this.updateProgress('Validating authentication', 40);
      const validation = await this.validateTokenWithAPI(this.token);
      
      if (!validation.success) {
        // Try to refresh token if validation failed
        if (validation.shouldRetry && this.currentAttempt < this.config.retryAttempts) {
          this.currentAttempt++;
          this.log(`Token validation failed, attempt ${this.currentAttempt} to refresh`);
          
          const refreshResult = await this.tryRefreshToken();
          if (refreshResult.success) {
            this.token = refreshResult.token;
            return this.authenticate(); // Retry with new token
          }
        }
        
        this.clearStoredAuth();
        this.redirectToLogin(validation.error || 'Authentication failed');
        return;
      }

      // Step 3: Check subdomain permissions
      this.updateProgress('Checking access permissions', 60);
      const hasAccess = this.checkSubdomainAccess(validation.user);
      
      if (!hasAccess) {
        this.showAccessDenied(validation.user);
        return;
      }

      // Step 4: Authentication successful
      this.updateProgress('Initializing application', 80);
      this.user = validation.user;
      this.isAuthenticated = true;
      
      // Complete initialization
      await this.completeInitialization();
      
    } catch (error) {
      this.handleError('Authentication process failed', error);
    }
  }

  /**
   * Get authentication token from various sources
   */
  async getAuthToken() {
    // Try localStorage first
    let token = localStorage.getItem(this.config.storageKey);
    
    // Try sessionStorage as fallback
    if (!token) {
      token = sessionStorage.getItem(this.config.storageKey);
    }
    
    // Try subdomain cookies as last resort
    if (!token) {
      token = this.getCookieValue(this.config.cookieFallbackKey);
    }
    
    // Try domain-wide cookie
    if (!token) {
      token = this.getCookieValue('equus_subdomain_indicator');
      if (token === 'authenticated') {
        // Cookie indicates authentication, try to get actual token
        token = this.getCookieValue('equus_auth_fallback');
      }
    }
    
    this.log(token ? 'Authentication token found' : 'No authentication token found');
    return token;
  }

  /**
   * Validate token with main authentication API
   */
  async validateTokenWithAPI(token) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.authTimeout);
      
      const response = await fetch(`${this.config.mainApiUrl}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            error: 'Token expired or invalid',
            shouldRetry: true
          };
        }
        
        throw new Error(`API validation failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        user: data.user || data.data?.user
      };
      
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Authentication timeout'
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Try to refresh authentication token
   */
  async tryRefreshToken() {
    try {
      const refreshToken = localStorage.getItem(this.config.refreshKey) || 
                          sessionStorage.getItem(this.config.refreshKey);
      
      if (!refreshToken) {
        return { success: false, error: 'No refresh token available' };
      }
      
      const response = await fetch(`${this.config.mainApiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      
      // Store new token
      localStorage.setItem(this.config.storageKey, data.token);
      if (data.refreshToken) {
        localStorage.setItem(this.config.refreshKey, data.refreshToken);
      }
      
      return { success: true, token: data.token };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user has access to this subdomain
   */
  checkSubdomainAccess(user) {
    // Check role permission
    if (!this.config.allowedRoles.includes(user.role)) {
      this.log(`Access denied: Role ${user.role} not in allowed roles [${this.config.allowedRoles.join(', ')}]`);
      return false;
    }

    // Check email verification if required
    if (this.config.requireEmailVerification && !user.emailVerified) {
      this.log('Access denied: Email verification required');
      return false;
    }

    // Check account status
    if (!user.isActive || user.accountStatus !== 'active' || user.isLocked) {
      this.log(`Access denied: Account status - Active: ${user.isActive}, Status: ${user.accountStatus}, Locked: ${user.isLocked}`);
      return false;
    }

    this.log('Access granted: All permission checks passed');
    return true;
  }

  /**
   * Setup cold start detection for slow loading
   */
  setupColdStartDetection() {
    if (this.config.progressThreshold > 0) {
      const coldStartTimeout = setTimeout(() => {
        if (!this.isAuthenticated) {
          this.showColdStartMessage();
        }
      }, this.config.progressThreshold);
      
      this.timeouts.push(coldStartTimeout);
    }
  }

  /**
   * Show loading state with progress
   */
  showLoadingState() {
    const loadingHTML = `
      <div id="auth-loading-overlay" class="auth-overlay">
        <div class="auth-container">
          <div class="auth-content">
            <!-- App branding -->
            <div class="auth-header">
              <div class="auth-icon">🔒</div>
              <h1 class="auth-title">${this.config.subdomainName}</h1>
              <p class="auth-description">Authenticating your access...</p>
            </div>
            
            <!-- Progress indicator -->
            <div class="auth-progress">
              <div class="progress-bar">
                <div id="progress-fill" class="progress-fill" style="width: 10%"></div>
              </div>
              <div id="progress-text" class="progress-text">Initializing...</div>
            </div>
            
            <!-- Loading spinner -->
            <div class="auth-spinner"></div>
            
            <!-- Time indicator -->
            <div id="time-indicator" class="time-indicator">
              Elapsed: <span id="elapsed-time">0</span>s
            </div>
            
            <!-- Cold start message (hidden initially) -->
            <div id="cold-start-message" class="cold-start-message hidden">
              <div class="cold-start-icon">⏱️</div>
              <div class="cold-start-text">
                <strong>Secure Connection:</strong> This protected application is starting up securely. 
                This may take up to 60 seconds on first access.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    this.injectStyles();
    this.startTimeCounter();
  }

  /**
   * Update progress during authentication
   */
  updateProgress(message, percentage) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = message;
    }
    
    this.log(`Progress: ${percentage}% - ${message}`);
  }

  /**
   * Show cold start message
   */
  showColdStartMessage() {
    const coldStartMessage = document.getElementById('cold-start-message');
    if (coldStartMessage) {
      coldStartMessage.classList.remove('hidden');
    }
    this.log('Cold start detected - showing extended loading message');
  }

  /**
   * Start elapsed time counter
   */
  startTimeCounter() {
    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const timeElement = document.getElementById('elapsed-time');
      if (timeElement) {
        timeElement.textContent = elapsed;
      }
      
      if (!this.isAuthenticated) {
        setTimeout(updateTime, 1000);
      }
    };
    
    updateTime();
  }

  /**
   * Complete initialization and show application
   */
  async completeInitialization() {
    this.updateProgress('Loading application...', 100);
    
    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.hideLoadingState();
    this.onAuthenticationSuccess();
    
    this.log('Authentication completed successfully');
  }

  /**
   * Handle authentication success
   */
  onAuthenticationSuccess() {
    // Clear any timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
    
    // Dispatch success event
    window.dispatchEvent(new CustomEvent('subdomainAuthSuccess', {
      detail: {
        user: this.user,
        token: this.token,
        isAuthenticated: this.isAuthenticated,
        subdomain: this.config.subdomain,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Make auth data globally available
    window.equusSubdomainAuth = {
      user: this.user,
      isAuthenticated: this.isAuthenticated,
      token: this.token,
      hasRole: (role) => this.user.role === role,
      hasAnyRole: (roles) => roles.includes(this.user.role),
      config: this.config
    };
    
    // Show the application
    const app = document.getElementById('app');
    if (app) {
      app.style.display = 'block';
      app.style.opacity = '0';
      app.style.transition = 'opacity 0.5s ease-in';
      setTimeout(() => app.style.opacity = '1', 100);
    }
  }

  /**
   * Show access denied page
   */
  showAccessDenied(user) {
    this.hideLoadingState();
    
    const deniedHTML = `
      <div id="auth-denied-overlay" class="auth-overlay">
        <div class="auth-container">
          <div class="auth-content denied">
            <div class="denied-icon">🚫</div>
            <h2 class="denied-title">Access Restricted</h2>
            <p class="denied-message">
              Hello ${user.firstName}, you don't have permission to access ${this.config.subdomainName}.
            </p>
            
            <div class="permission-details">
              <div class="permission-row">
                <span class="permission-label">Required:</span>
                <span class="permission-value">${this.config.allowedRoles.join(' or ')} role</span>
              </div>
              <div class="permission-row">
                <span class="permission-label">Your role:</span>
                <span class="permission-value">${user.role}</span>
              </div>
              ${this.config.requireEmailVerification ? `
                <div class="permission-row">
                  <span class="permission-label">Email verified:</span>
                  <span class="permission-value ${user.emailVerified ? 'verified' : 'unverified'}">
                    ${user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
              ` : ''}
            </div>
            
            <div class="denied-actions">
              <button onclick="window.location.href='${this.config.loginUrl}'" class="btn btn-primary">
                Return to Main Site
              </button>
              <button onclick="window.history.back()" class="btn btn-secondary">
                Go Back
              </button>
            </div>
            
            <p class="support-link">
              Need access? <a href="mailto:support@equussystems.co">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', deniedHTML);
  }

  /**
   * Redirect to login page
   */
  redirectToLogin(reason = 'Authentication required') {
    const currentUrl = encodeURIComponent(window.location.href);
    const loginUrl = `${this.config.loginUrl}?returnUrl=${currentUrl}&reason=${encodeURIComponent(reason)}`;
    
    this.log(`Redirecting to login: ${reason}`);
    
    // Show redirect message briefly
    this.updateProgress('Redirecting to login...', 100);
    
    setTimeout(() => {
      window.location.href = loginUrl;
    }, 1500);
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    const overlay = document.getElementById('auth-loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => overlay.remove(), 300);
    }
  }

  /**
   * Clear stored authentication data
   */
  clearStoredAuth() {
    localStorage.removeItem(this.config.storageKey);
    localStorage.removeItem(this.config.refreshKey);
    sessionStorage.removeItem(this.config.storageKey);
    sessionStorage.removeItem(this.config.refreshKey);
    
    // Clear subdomain cookies
    const domain = '.equussystems.co';
    const clearOptions = `Domain=${domain}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax`;
    
    document.cookie = `${this.config.cookieFallbackKey}=; ${clearOptions}`;
    document.cookie = `equus_subdomain_indicator=; ${clearOptions}`;
    document.cookie = `equus_auth_fallback=; ${clearOptions}`;
  }

  /**
   * Get cookie value by name
   */
  getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  /**
   * Handle errors
   */
  handleError(message, error) {
    this.log(`ERROR: ${message}`, error);
    
    // Show error state
    this.updateProgress('Authentication error occurred', 0);
    
    setTimeout(() => {
      this.redirectToLogin(`Error: ${message}`);
    }, 3000);
  }

  /**
   * Logging utility
   */
  log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[SubdomainAuth] ${timestamp}: ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (document.getElementById('subdomain-auth-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'subdomain-auth-styles';
    styles.textContent = `
      .auth-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .auth-container {
        max-width: 480px;
        width: 90%;
        margin: 1rem;
      }
      
      .auth-content {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        text-align: center;
      }
      
      .auth-header {
        margin-bottom: 2rem;
      }
      
      .auth-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .auth-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }
      
      .auth-description {
        color: #6b7280;
        margin: 0;
      }
      
      .auth-progress {
        margin-bottom: 2rem;
      }
      
      .progress-bar {
        width: 100%;
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 1rem;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        border-radius: 2px;
        transition: width 0.3s ease;
      }
      
      .progress-text {
        font-size: 0.875rem;
        color: #4b5563;
        font-weight: 500;
      }
      
      .auth-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 1rem auto;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .time-indicator {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-top: 1rem;
      }
      
      .cold-start-message {
        margin-top: 1.5rem;
        padding: 1rem;
        background: #eff6ff;
        border: 1px solid #dbeafe;
        border-radius: 8px;
        text-align: left;
      }
      
      .cold-start-message.hidden {
        display: none;
      }
      
      .cold-start-icon {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
      }
      
      .cold-start-text {
        font-size: 0.875rem;
        color: #1e40af;
        line-height: 1.4;
      }
      
      .auth-content.denied {
        border-left: 4px solid #dc2626;
      }
      
      .denied-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      
      .denied-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #dc2626;
        margin-bottom: 1rem;
      }
      
      .denied-message {
        color: #4b5563;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }
      
      .permission-details {
        background: #f9fafb;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        text-align: left;
      }
      
      .permission-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      
      .permission-row:last-child {
        margin-bottom: 0;
      }
      
      .permission-label {
        font-size: 0.875rem;
        color: #6b7280;
      }
      
      .permission-value {
        font-size: 0.875rem;
        font-weight: 500;
        color: #1f2937;
      }
      
      .permission-value.verified {
        color: #059669;
      }
      
      .permission-value.unverified {
        color: #dc2626;
      }
      
      .denied-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 1rem;
      }
      
      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }
      
      .btn-primary {
        background: #3b82f6;
        color: white;
      }
      
      .btn-primary:hover {
        background: #2563eb;
      }
      
      .btn-secondary {
        background: #e5e7eb;
        color: #374151;
      }
      
      .btn-secondary:hover {
        background: #d1d5db;
      }
      
      .support-link {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0;
      }
      
      .support-link a {
        color: #3b82f6;
        text-decoration: none;
      }
      
      .support-link a:hover {
        text-decoration: underline;
      }
      
      @media (max-width: 640px) {
        .auth-container {
          width: 95%;
        }
        
        .auth-content {
          padding: 1.5rem;
        }
        
        .denied-actions {
          flex-direction: column;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// Export for use
window.SubdomainAuthGuard = SubdomainAuthGuard;

// Export as module if in module environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SubdomainAuthGuard;
}

// Auto-initialize if configuration is provided
if (typeof SUBDOMAIN_AUTH_CONFIG !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new SubdomainAuthGuard(SUBDOMAIN_AUTH_CONFIG);
  });
}
