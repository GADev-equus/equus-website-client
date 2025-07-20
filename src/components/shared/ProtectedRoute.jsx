/**
 * ProtectedRoute - Route wrapper that requires authentication
 * Redirects to sign-in page if user is not authenticated
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinnerCenter } from '@/components/ui/loading-spinner';
import ColdStartLoader from '@/components/ui/ColdStartLoader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, shouldShowColdStartUI, loadingState } = useAuth();
  
  // Debug cold start state
  console.log('ProtectedRoute - Cold start state:', { 
    loading, 
    shouldShowColdStartUI: shouldShowColdStartUI ? shouldShowColdStartUI() : false,
    loadingState 
  });
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    // Use cold start loader if cold start is detected
    if (shouldShowColdStartUI && shouldShowColdStartUI()) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <ColdStartLoader 
            startTime={loadingState?.coldStartTime || Date.now()}
            size="lg"
            className="min-h-screen"
          />
        </div>
      );
    }
    
    // Default loading state
    return (
      <div className="min-h-screen">
        <LoadingSpinnerCenter size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location to redirect after login
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;