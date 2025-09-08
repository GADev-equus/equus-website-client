/**
 * useScrollAnimation Hook
 * 
 * Custom hook for handling scroll-based animations using Intersection Observer API
 * Provides clean, performant animations with proper memory management
 */

import { useState, useEffect, useRef } from 'react';

export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          // Apply delay if specified
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);

          // If triggerOnce is true, stop observing after first trigger
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce && !hasTriggered) {
          // Allow re-triggering only if triggerOnce is false and hasn't triggered yet
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return { ref: elementRef, isVisible, hasTriggered };
};

/**
 * Hook for staggered animations - useful for animating multiple items with delays
 */
export const useStaggeredAnimation = (itemCount, options = {}) => {
  const {
    staggerDelay = 100,
    ...otherOptions
  } = options;

  const animations = [];
  
  for (let i = 0; i < itemCount; i++) {
    const animationOptions = {
      ...otherOptions,
      delay: (otherOptions.delay || 0) + (i * staggerDelay)
    };
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    animations.push(useScrollAnimation(animationOptions));
  }
  
  return animations;
};

/**
 * Simple hook for elements that should animate immediately when in view
 */
export const useInViewAnimation = (options = {}) => {
  return useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
    delay: 0,
    ...options
  });
};

export default useScrollAnimation;