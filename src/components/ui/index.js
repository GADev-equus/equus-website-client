/**
 * UI Components Index - Centralized exports for all UI components
 * Includes all base components, forms, and enhanced UX components
 */

// Base UI components
export { Button, buttonVariants } from './button';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card';
export { Input } from './input';
export { Label } from './label';
export { Badge, badgeVariants } from './badge';
export { Alert, AlertTitle, AlertDescription } from './alert';
export { StatusIndicator, statusIndicatorVariants } from './status-indicator';

// Form components
export { FormContainer, FormField, FormActions } from './form-container';
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField as FormFieldHookForm,
} from './form';

// Loading components
export { LoadingSpinner, LoadingSpinnerCenter } from './loading-spinner';

// Cold start detection components
export { default as ColdStartLoader } from './ColdStartLoader';
export { default as ServerStatusIndicator } from './ServerStatusIndicator';
export { default as LoadingStateWrapper } from './LoadingStateWrapper';

// Cold start detection utilities and HOCs
export {
  default as withColdStartDetection,
  withDefaultColdStartDetection,
  createColdStartHOC,
} from './withColdStartDetection';

// Hooks for cold start detection
export { useColdStartAwareLoading } from '../../hooks/useColdStartAwareLoading';
export { useServerStatus } from '../../hooks/useServerStatus';

// Cold start utilities from httpService
export { coldStartUtils, COLD_START_CONFIG } from '../../services/httpService';

// Constants and configuration
export { COLD_START_THRESHOLD, COLD_START_MAX_TIME } from './ColdStartLoader';

// Enhanced loading state patterns
export const LOADING_PATTERNS = {
  // Standard loading with cold start detection
  ENHANCED: 'enhanced',
  // Cold start only (no standard loading)
  COLD_START_ONLY: 'cold-start-only',
  // Standard loading only (no cold start detection)
  STANDARD_ONLY: 'standard-only',
};

// Convenience wrapper function for common usage
export const createLoadingComponent = (options = {}) => {
  const {
    pattern = LOADING_PATTERNS.ENHANCED,
    threshold = 5000,
    size = 'md',
    showProgress = true,
    className = '',
  } = options;

  return ({ isLoading, children, ...props }) => {
    switch (pattern) {
      case LOADING_PATTERNS.COLD_START_ONLY:
        return (
          <LoadingStateWrapper
            isLoading={isLoading}
            showColdStartUI={true}
            minColdStartThreshold={0} // Always show cold start UI when loading
            size={size}
            className={className}
            {...props}
          >
            {children}
          </LoadingStateWrapper>
        );

      case LOADING_PATTERNS.STANDARD_ONLY:
        return (
          <LoadingStateWrapper
            isLoading={isLoading}
            showColdStartUI={false}
            size={size}
            className={className}
            {...props}
          >
            {children}
          </LoadingStateWrapper>
        );

      case LOADING_PATTERNS.ENHANCED:
      default:
        return (
          <LoadingStateWrapper
            isLoading={isLoading}
            showColdStartUI={true}
            minColdStartThreshold={threshold}
            size={size}
            className={className}
            {...props}
          >
            {children}
          </LoadingStateWrapper>
        );
    }
  };
};
