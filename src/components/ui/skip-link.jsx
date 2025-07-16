import { cn } from '@/lib/utils';

/**
 * Skip Link component for accessibility - allows users to skip to main content
 * Hidden by default, becomes visible when focused
 */
export const SkipLink = ({ href = '#main-content', className, children = 'Skip to main content' }) => {
  return (
    <a
      href={href}
      className={cn(
        'absolute -top-40 left-6 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md',
        'focus:top-6 transition-all duration-300 ease-in-out',
        'text-sm font-medium',
        'outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {children}
    </a>
  );
};