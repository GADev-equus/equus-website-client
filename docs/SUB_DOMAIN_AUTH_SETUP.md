# Subdomain Apps Integration Plan for JWT Cookie Authentication

## Overview
To integrate JWT cookie authentication into subdomain apps (`ai-tutor.equussystems.co` and `ai-tfl.equussystems.co`), you need to create lightweight React applications that leverage the existing authentication infrastructure.

The JWT cookie authentication system has been implemented in the main application and backend to enable seamless Single Sign-On (SSO) across all subdomains. This document provides a comprehensive guide for setting up subdomain applications that can automatically authenticate users who have logged in on the main domain.

## How It Works
1. **User logs in** at `https://equussystems.co`
2. **Server sets HTTP-only cookies** with domain `.equussystems.co`
3. **Cookies are automatically shared** with all subdomains
4. **Subdomain apps validate authentication** via existing cookies
5. **Seamless access** without re-authentication required

## Required Components for Each Subdomain App

### 1. Core Services Layer (Essential)
**Copy and adapt from main app:**
- `httpService.js` - HTTP client with `credentials: 'include'` 
- `authService.js` - Authentication service (cookie-aware version)
- Basic error handling utilities

### 2. Authentication Components
**Create minimal auth components:**
- `AuthGuard.jsx` - Route protection component
- `useAuthGuard.js` - Hook for authentication checking  
- `AuthContext.jsx` - Lightweight auth context (optional)
- Login redirect component for unauthenticated users

### 3. Route Protection Setup
**Implement:**
- Protected route wrapper components
- Automatic redirect to main site for login
- Session validation on app initialization
- Logout functionality that clears cookies

### 4. Environment Configuration
**Setup:**
- API endpoint configuration pointing to main backend
- Environment variables for domain-specific settings
- CORS-compatible request configuration

## Implementation Approach

### Phase 1: Minimal Authentication Infrastructure (2-4 hours per subdomain)
1. **Copy Core Services** - Adapt httpService and authService from main app
2. **Create Auth Guard Hook** - Simple authentication check with redirect
3. **Setup Route Protection** - Wrap protected components/pages
4. **Configure API Communication** - Point to main backend with credentials

### Phase 2: User Experience Enhancement (4-6 hours per subdomain)
1. **Add Loading States** - Show auth checking progress
2. **Error Handling** - Handle auth failures gracefully
3. **User Context** - Optional user data management
4. **Logout Integration** - Clean logout with cookie clearing

### Phase 3: Advanced Features - Optional (6-8 hours per subdomain)
1. **Role-Based Access** - Subdomain-specific permissions
2. **Deep Link Preservation** - Return to intended page after auth
3. **Session Management** - Handle token refresh
4. **Analytics Integration** - Track subdomain usage

## Key Files Needed per Subdomain

### Essential Files (Minimum viable):
```
src/
├── services/
│   ├── httpService.js          # HTTP client with credentials
│   └── authService.js          # Cookie-based auth service
├── hooks/
│   └── useAuthGuard.js         # Authentication guard hook
├── components/
│   └── AuthGuard.jsx           # Route protection component
└── utils/
    └── authConfig.js           # Auth configuration
```

### Enhanced Files (Recommended):
```
src/
├── contexts/
│   └── AuthContext.jsx         # Auth state management
├── components/
│   ├── LoginRedirect.jsx       # Redirect to main site
│   └── AuthenticatedLayout.jsx # Wrapper for protected pages
└── services/
    └── errorService.js         # Error handling
```

### Full File Structure (Complete implementation):
```
subdomain-app/
├── public/
├── src/
│   ├── components/
│   │   ├── AuthGuard.jsx
│   │   ├── LoginRedirect.jsx
│   │   ├── AuthenticatedLayout.jsx
│   │   └── ui/
│   │       └── LoadingSpinner.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuthGuard.js
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProtectedPage.jsx
│   │   └── UnauthorizedPage.jsx
│   ├── services/
│   │   ├── httpService.js
│   │   ├── authService.js
│   │   └── errorService.js
│   ├── utils/
│   │   └── authConfig.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Code Examples

### 1. HTTP Service Configuration (httpService.js)
```javascript
/**
 * HTTP Service for Subdomain Apps
 * Configured to work with JWT cookie authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://equus-website-api.onrender.com';

class HttpService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      credentials: 'include', // CRUCIAL: Always include cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }
}

const httpService = new HttpService();
export default httpService;
```

### 2. Authentication Guard Hook (useAuthGuard.js)
```javascript
/**
 * Authentication Guard Hook
 * Checks if user is authenticated via cookies and redirects if not
 */

import { useEffect, useState } from 'react';
import httpService from '../services/httpService.js';

const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'https://equussystems.co';
const LOGIN_URL = `${MAIN_DOMAIN}/auth/signin`;

export default function useAuthGuard(redirectOnFailure = true) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setLoading(true);
        
        // Validate token via cookies (cookies sent automatically)
        const response = await httpService.get('/api/auth/validate-token');
        
        if (response.success && response.user) {
          setIsAuthenticated(true);
          setUser(response.user);
        } else {
          setIsAuthenticated(false);
          if (redirectOnFailure) {
            window.location.href = LOGIN_URL;
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        
        if (redirectOnFailure) {
          // Redirect to main site for login
          window.location.href = LOGIN_URL;
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [redirectOnFailure]);

  return {
    isAuthenticated,
    user,
    loading,
    checkAuth: () => checkAuthentication()
  };
}
```

### 3. Authentication Guard Component (AuthGuard.jsx)
```javascript
/**
 * Authentication Guard Component
 * Protects routes and components from unauthenticated access
 */

import { useEffect } from 'react';
import useAuthGuard from '../hooks/useAuthGuard.js';
import LoadingSpinner from './ui/LoadingSpinner.jsx';

export default function AuthGuard({ 
  children, 
  fallback = null,
  showLoading = true 
}) {
  const { isAuthenticated, loading } = useAuthGuard(true);

  if (loading && showLoading) {
    return (
      <div className="auth-guard-loading">
        <LoadingSpinner />
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return fallback || (
      <div className="auth-guard-unauthorized">
        <h2>Authentication Required</h2>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (isAuthenticated === true) {
    return children;
  }

  return null;
}
```

### 4. Authentication Context (AuthContext.jsx)
```javascript
/**
 * Authentication Context for Subdomain Apps
 * Lightweight version focused on cookie-based authentication
 */

import { createContext, useContext, useState, useEffect } from 'react';
import httpService from '../services/httpService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await httpService.get('/api/auth/validate-token');
        
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    try {
      await httpService.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Redirect to main site
      window.location.href = import.meta.env.VITE_MAIN_DOMAIN || 'https://equussystems.co';
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 5. Main App Component (App.jsx)
```javascript
/**
 * Main App Component for Subdomain
 * Shows how to integrate authentication
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AuthGuard from './components/AuthGuard.jsx';
import HomePage from './pages/HomePage.jsx';
import ProtectedPage from './pages/ProtectedPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Protected routes */}
            <Route 
              path="/protected" 
              element={
                <AuthGuard>
                  <ProtectedPage />
                </AuthGuard>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## Configuration Requirements

### 1. Environment Variables (.env)
```env
# API Configuration
VITE_API_URL=https://equus-website-api.onrender.com

# Main Domain Configuration
VITE_MAIN_DOMAIN=https://equussystems.co
VITE_LOGIN_URL=https://equussystems.co/auth/signin
VITE_LOGOUT_REDIRECT=https://equussystems.co

# App Configuration
VITE_APP_NAME=AI Tutor
VITE_SUBDOMAIN=ai-tutor
```

### 2. Package Dependencies (package.json)
```json
{
  "name": "ai-tutor-subdomain",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 3. Vite Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Different port for each subdomain app
    cors: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

## Implementation Steps

### Step 1: Project Setup
1. Create new React project for subdomain
2. Install required dependencies
3. Setup environment variables
4. Configure Vite for development

### Step 2: Copy Core Services
1. Copy `httpService.js` from main app
2. Ensure `credentials: 'include'` is set
3. Copy minimal auth utilities
4. Test API connectivity

### Step 3: Implement Authentication
1. Create `useAuthGuard` hook
2. Build `AuthGuard` component
3. Setup authentication context
4. Test authentication flow

### Step 4: Protect Routes
1. Wrap protected components with `AuthGuard`
2. Setup redirect logic for unauthenticated users
3. Handle loading states during auth checks
4. Test protected route access

### Step 5: Enhanced Features (Optional)
1. Add user profile display
2. Implement logout functionality
3. Handle token refresh scenarios
4. Add error handling and recovery

## Testing Checklist

### ✅ Basic Authentication
- [ ] Unauthenticated users redirected to main site
- [ ] Authenticated users can access protected content
- [ ] Cookies are automatically sent with requests
- [ ] Authentication state persists across page refreshes

### ✅ Cross-Domain Functionality  
- [ ] Login on main site grants access to subdomain
- [ ] Logout on subdomain clears authentication everywhere
- [ ] Session sharing works across all domains
- [ ] HTTPS requirements met in production

### ✅ Error Handling
- [ ] Network errors handled gracefully
- [ ] Invalid/expired tokens handled properly
- [ ] Loading states shown during auth checks
- [ ] Fallback UI displayed for auth failures

## Security Considerations

### ✅ **Implemented Security Measures**
- **HTTP-only cookies**: Tokens not accessible via JavaScript
- **Secure flag**: Cookies only sent over HTTPS in production
- **SameSite attribute**: Protection against CSRF attacks
- **Domain restriction**: Cookies scoped to `.equussystems.co`
- **CORS configuration**: Proper cross-origin request handling

### 🔒 **Best Practices**
- Always use `credentials: 'include'` in fetch requests
- Never store sensitive tokens in localStorage
- Validate authentication on every protected route
- Handle expired tokens gracefully
- Redirect to main domain for all authentication actions

## Troubleshooting

### Common Issues

1. **Cookies not being sent**
   - Check `credentials: 'include'` in all HTTP requests
   - Verify CORS configuration allows credentials
   - Ensure domain is served over HTTPS in production

2. **Authentication fails**
   - Verify API endpoint is correct
   - Check that backend CORS includes subdomain
   - Confirm cookies have correct domain setting

3. **Redirect loops**
   - Check authentication validation logic
   - Ensure login URL is correct
   - Verify token validation endpoint works

4. **Session not shared**
   - Confirm cookie domain is set to `.equussystems.co`
   - Check that both main and subdomain use HTTPS
   - Verify SameSite attribute is configured correctly

### Debug Commands
```bash
# Check if cookies are being set
curl -v -X POST https://equussystems.co/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# Test authenticated request from subdomain
curl -v -b cookies.txt https://ai-tutor.equussystems.co/api/protected
```

## Integration Benefits

- **Seamless SSO**: Users login once, access all subdomains
- **Enhanced Security**: HTTP-only cookies prevent XSS attacks
- **Minimal Complexity**: Leverage existing backend infrastructure
- **Scalable Architecture**: Easy to add more subdomains
- **Maintainable Code**: Centralized authentication logic
- **Better UX**: No multiple login prompts across domains

## Next Steps

After implementing basic authentication:

1. **Add subdomain-specific features** based on app requirements
2. **Implement role-based access control** if needed
3. **Add analytics tracking** for subdomain usage
4. **Setup monitoring** for authentication failures
5. **Create deployment pipeline** for subdomain apps
6. **Add automated testing** for auth flows

## Support and Resources

- **Main Documentation**: `/JWT_COOKIES_IMPLEMENTATION.md`
- **Backend API**: All authentication endpoints documented in main app
- **Security Guide**: `/client/docs/JTW_COOKIES.md`
- **Error Handling**: Refer to main app's error service patterns

---

**Implementation Date**: July 23, 2025  
**Status**: Ready for Implementation  
**Estimated Time**: 2-8 hours per subdomain (depending on features)