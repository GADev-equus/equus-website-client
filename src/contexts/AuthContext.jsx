/**
 * Authentication Context - Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService.js';

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

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated() && !authService.isTokenExpired()) {
          setUser(authService.getUser());
          setIsAuthenticated(true);
          
          // Refresh user data from server
          const result = await authService.getCurrentUser();
          if (result.success) {
            setUser(result.user);
          }
        } else if (authService.isTokenExpired()) {
          // Try to refresh token
          const refreshResult = await authService.refreshAuthToken();
          if (refreshResult.success) {
            setUser(authService.getUser());
            setIsAuthenticated(true);
          } else {
            authService.clearAuth();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.signUp(userData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.signIn(credentials);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const result = await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return result;
    } finally {
      setLoading(false);
    }
  };

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

  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.updateProfile(userData);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      return await authService.changePassword(passwordData);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const result = await authService.refreshAuthToken();
      if (result.success) {
        setUser(authService.getUser());
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      return result;
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Actions
    signUp,
    signIn,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    updateProfile,
    changePassword,
    refreshToken,
    
    // Utilities
    isAdmin,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;