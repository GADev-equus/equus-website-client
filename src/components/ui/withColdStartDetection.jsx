/**
 * withColdStartDetection - Higher-order component for adding cold start detection
 * Wraps existing components to enhance them with cold start detection and improved loading UX
 */

import React from 'react';
import LoadingStateWrapper from './LoadingStateWrapper';
import { useColdStartAwareLoading } from '../../hooks/useColdStartAwareLoading';

export const withColdStartDetection = (WrappedComponent, options = {}) => {
  const {
    threshold = 5000,
    size = 'md',
    showProgress = true,
    className = '',
    loadingPropName = 'isLoading',
    enableColdStart = true
  } = options;

  const ColdStartEnhancedComponent = React.forwardRef((props, ref) => {
    const {
      isLoading,
      isColdStart,
      shouldShowColdStartUI,
      coldStartTime,
      getLoadingProps
    } = useColdStartAwareLoading(props[loadingPropName] || false);

    // If cold start detection is disabled, just render the original component
    if (!enableColdStart) {
      return <WrappedComponent {...props} ref={ref} />;
    }

    // Get loading props for the wrapper
    const loadingProps = getLoadingProps({
      threshold,
      size,
      showProgress,
      className
    });

    // If we should show cold start UI, wrap with LoadingStateWrapper
    if (shouldShowColdStartUI(threshold)) {
      return (
        <LoadingStateWrapper {...loadingProps}>
          <WrappedComponent 
            {...props} 
            ref={ref}
            [loadingPropName]={false} // Override loading prop to prevent double loading states
            isColdStart={isColdStart}
            coldStartTime={coldStartTime}
          />
        </LoadingStateWrapper>
      );
    }

    // Normal loading state or no loading
    return (
      <LoadingStateWrapper 
        isLoading={isLoading}
        className={className}
        size={size}
        showColdStartUI={false}
      >
        <WrappedComponent 
          {...props} 
          ref={ref}
          isColdStart={isColdStart}
          coldStartTime={coldStartTime}
        />
      </LoadingStateWrapper>
    );
  });

  // Set display name for debugging
  ColdStartEnhancedComponent.displayName = 
    `withColdStartDetection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ColdStartEnhancedComponent;
};

// Convenience function for common use cases
export const withDefaultColdStartDetection = (WrappedComponent) => {
  return withColdStartDetection(WrappedComponent, {
    threshold: 5000,
    size: 'md',
    showProgress: true,
    enableColdStart: true
  });
};

// Factory function for creating custom cold start HOCs
export const createColdStartHOC = (defaultOptions = {}) => {
  return (WrappedComponent, componentOptions = {}) => {
    const finalOptions = { ...defaultOptions, ...componentOptions };
    return withColdStartDetection(WrappedComponent, finalOptions);
  };
};

export default withColdStartDetection;