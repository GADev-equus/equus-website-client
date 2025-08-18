/**
 * Toast notification components
 * Provides toast notifications with different variants and actions
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './button';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

// Toast Context
const ToastContext = createContext();

// Toast actions
const TOAST_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST'
};

// Toast reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case TOAST_ACTIONS.ADD_TOAST:
      return [...state, { ...action.payload, id: Date.now().toString() }];
    
    case TOAST_ACTIONS.REMOVE_TOAST:
      return state.filter(toast => toast.id !== action.payload);
    
    case TOAST_ACTIONS.UPDATE_TOAST:
      return state.map(toast => 
        toast.id === action.payload.id 
          ? { ...toast, ...action.payload.updates }
          : toast
      );
    
    default:
      return state;
  }
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = (toast) => {
    dispatch({ type: TOAST_ACTIONS.ADD_TOAST, payload: toast });
  };

  const removeToast = (id) => {
    dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id });
  };

  const updateToast = (id, updates) => {
    dispatch({ type: TOAST_ACTIONS.UPDATE_TOAST, payload: { id, updates } });
  };

  // Auto-remove toasts after duration
  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration !== 0 && toast.duration !== false) {
        const timeout = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timeout);
      }
    });
  }, [toasts]);

  const value = {
    toasts,
    addToast,
    removeToast,
    updateToast,
    // Convenience methods
    success: (message, options = {}) => addToast({ 
      ...options, 
      message, 
      variant: 'success' 
    }),
    error: (message, options = {}) => addToast({ 
      ...options, 
      message, 
      variant: 'destructive',
      duration: 0 // Don't auto-dismiss error toasts
    }),
    warning: (message, options = {}) => addToast({ 
      ...options, 
      message, 
      variant: 'warning' 
    }),
    info: (message, options = {}) => addToast({ 
      ...options, 
      message, 
      variant: 'info' 
    }),
    loading: (message, options = {}) => addToast({ 
      ...options, 
      message, 
      variant: 'default',
      duration: 0,
      loading: true
    })
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = () => {
  const { toasts } = useToast();

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 max-w-[200px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body
  );
};

// Individual Toast Component  
const Toast = ({ toast }) => {
  const { removeToast } = useToast();

  const getToastStyles = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white';
      case 'destructive':
        return 'bg-red-500 border-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600 text-white';
      case 'info':
        return 'bg-gray-800 border-gray-600 text-white';
      default:
        return 'bg-gray-700 border-gray-600 text-white';
    }
  };

  const getIcon = (variant, loading) => {
    if (loading) return '⏳';
    
    switch (variant) {
      case 'success': return '✅';
      case 'destructive': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className={`
      ${getToastStyles(toast.variant)}
      w-40 h-10
      rounded border shadow-lg
      !px-2 flex items-center !gap-1
      transition-all duration-300 ease-in-out
    `}>
      <div className="text-xs flex-shrink-0">
        {getIcon(toast.variant, toast.loading)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-xs leading-none truncate">{toast.message}</div>
      </div>
      
      {toast.duration !== 0 && (
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 w-3 h-3 flex items-center justify-center text-xs opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export { Toast, ToastContainer };