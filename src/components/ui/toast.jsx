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
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
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
    const baseStyles = 'p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ease-in-out';
    
    switch (variant) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-800 dark:text-green-200`;
      case 'destructive':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/80 dark:border-yellow-800 dark:text-yellow-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-200`;
      default:
        return `${baseStyles} bg-background border-border text-foreground`;
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
    <Card className={cn(getToastStyles(toast.variant))}>
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-lg">
            {getIcon(toast.variant, toast.loading)}
          </div>
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <div className="font-medium mb-1">{toast.title}</div>
            )}
            <div className="text-sm">{toast.message}</div>
            
            {toast.action && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toast.action.onClick}
                  className="h-7 px-2 text-xs"
                >
                  {toast.action.label}
                </Button>
              </div>
            )}
          </div>
          
          {toast.duration !== 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeToast(toast.id)}
              className="h-6 w-6 p-0 hover:bg-transparent opacity-60 hover:opacity-100"
            >
              ✕
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { Toast, ToastContainer };