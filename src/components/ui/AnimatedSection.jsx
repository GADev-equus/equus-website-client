/**
 * AnimatedSection Component
 * 
 * Reusable wrapper component for scroll-based animations
 * Integrates with Equus design system and animation utilities
 */

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { clsx } from 'clsx';

const AnimatedSection = ({ 
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 'normal',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
    delay
  });

  // Animation type mapping
  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'slide-left': 'animate-slide-left',
    'slide-right': 'animate-slide-right',
    'scale-in': 'animate-scale-in'
  };

  // Duration mapping
  const durationClasses = {
    'fast': 'animate-duration-fast',
    'normal': 'animate-duration-normal',
    'slow': 'animate-duration-slow'
  };

  // Delay mapping
  const delayClasses = {
    100: 'animate-delay-100',
    200: 'animate-delay-200',
    300: 'animate-delay-300',
    400: 'animate-delay-400',
    500: 'animate-delay-500',
    600: 'animate-delay-600',
    700: 'animate-delay-700',
    800: 'animate-delay-800'
  };

  const classes = clsx(
    animationClasses[animation] || 'animate-fade-in',
    durationClasses[duration] || 'animate-duration-normal',
    delayClasses[delay] || '',
    isVisible && 'is-visible',
    className
  );

  return (
    <Component 
      ref={ref} 
      className={classes} 
      {...props}
    >
      {children}
    </Component>
  );
};

export default AnimatedSection;