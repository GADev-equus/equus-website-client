/**
 * Authentication Context - Provides authentication state and methods throughout the app
 * Enhanced with error handling, loading states, and automatic token management
 */

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import authService from '../services/authService.js';
import errorService from '../services/errorService.js';
import { useToast } from '../components/ui/toast.jsx';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const toast = useToast();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthError(null);
        
        if (authService.isAuthenticated() && !authService.isTokenExpired()) {
          const currentUser = authService.getUser();
          setUser(currentUser);
          setIsAuthenticated(true);
          setTokenExpiry(authService.getTokenExpiration());
          
          // Refresh user data from server
          try {
            const result = await authService.getCurrentUser();
            if (result.success) {
              setUser(result.user);
            }
          } catch (refreshError) {
            // If user data refresh fails, keep existing user data
            console.warn('Failed to refresh user data:', refreshError);
          }
        } else if (authService.isTokenExpired() && authService.refreshToken) {
          // Try to refresh token
          try {
            const refreshResult = await authService.refreshAuthToken();
            if (refreshResult.success) {
              setUser(authService.getUser());
              setIsAuthenticated(true);
              setTokenExpiry(authService.getTokenExpiration());
              toast.success('Session renewed automatically');
            } else {
              authService.clearAuth();
              setAuthError('Session expired. Please sign in again.');
            }
          } catch (refreshError) {
            authService.clearAuth();
            errorService.handleError(refreshError, 'auth:refresh');
          }
        } else {
          // No valid authentication
          authService.clearAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        errorService.handleError(error, 'auth:init');
        authService.clearAuth();
        setAuthError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [toast]);

  const signUp = useCallback(async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.signup(userData);
      if (result.success) {
        toast.success(result.message || 'Account created successfully! Please check your email.');
      } else {
        setAuthError(result.message);
        errorService.handleError(new Error(result.message), 'auth:signup');
      }
      return result;
    } catch (error) {
      const errorResult = errorService.handleError(error, 'auth:signup');
      setAuthError(errorResult.userMessage);
      return { success: false, message: errorResult.userMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setTokenExpiry(authService.getTokenExpiration());
        toast.success(`Welcome back, ${result.user.firstName}!`);
      } else {
        setAuthError(result.message);
        errorService.handleError(new Error(result.message), 'auth:login');
      }
      return result;
    } catch (error) {
      const errorResult = errorService.handleError(error, 'auth:login');
      setAuthError(errorResult.userMessage);
      return { success: false, message: errorResult.userMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Keep legacy signIn method for backward compatibility
  const signIn = useCallback(async (credentials) => {
    return login(credentials.email, credentials.password);
  }, [login]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const result = await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      setTokenExpiry(null);
      toast.info('You have been signed out successfully');
      return result;
    } catch (error) {
      // Even if logout fails on server, clear local state
      errorService.handleError(error, 'auth:logout');
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      setTokenExpiry(null);
      return { success: true, message: 'Signed out successfully' };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      return await authService.requestPasswordReset(email);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetData) => {
    setLoading(true);
    try {
      return await authService.resetPassword(resetData);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      return await authService.verifyEmail(token);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = useCallback(async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.updateProfile(userData);
      if (result.success) {
        setUser(result.user);
        toast.success(result.message || 'Profile updated successfully');
      } else {
        setAuthError(result.message);
        errorService.handleError(new Error(result.message), 'auth:updateProfile');
      }
      return result;
    } catch (error) {
      const errorResult = errorService.handleError(error, 'auth:updateProfile');
      setAuthError(errorResult.userMessage);
      return { success: false, message: errorResult.userMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      return await authService.changePassword(passwordData);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      const result = await authService.refreshAuthToken();
      if (result.success) {
        setUser(authService.getUser());
        setIsAuthenticated(true);
        setTokenExpiry(authService.getTokenExpiration());
        setAuthError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setTokenExpiry(null);
        setAuthError('Session expired. Please sign in again.');
      }
      return result;
    } catch (error) {
      console.error('Token refresh error:', error);
      errorService.handleError(error, 'auth:refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      setTokenExpiry(null);
      setAuthError('Session expired. Please sign in again.');
      return { success: false, error: error.message };
    }
  }, []);

  // Clear auth error
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Force logout (for security issues)
  const forceLogout = useCallback(() => {
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    setTokenExpiry(null);
    toast.warning('Session terminated for security reasons');
  }, [toast]);

  // Check if token is about to expire
  const isTokenExpiringSoon = useCallback(() => {
    if (!tokenExpiry) return false;
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return tokenExpiry.getTime() < fiveMinutesFromNow;
  }, [tokenExpiry]);

  // Get user initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  }, [user]);

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  const value = useMemo(() => ({
    // State
    user,
    loading,
    isAuthenticated,
    authError,
    tokenExpiry,
    
    // Actions
    signUp,
    signIn, // Legacy method
    login, // New preferred method
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    updateProfile,
    changePassword,
    refreshToken,
    clearAuthError,
    forceLogout,
    
    // Utilities
    isAdmin,
    hasPermission,
    isTokenExpiringSoon,
    getUserInitials,
  }), [
    user,
    loading,
    isAuthenticated,
    authError,
    tokenExpiry,
    signUp,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    updateProfile,
    changePassword,
    refreshToken,
    clearAuthError,
    forceLogout,
    isAdmin,
    hasPermission,
    isTokenExpiringSoon,
    getUserInitials
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;