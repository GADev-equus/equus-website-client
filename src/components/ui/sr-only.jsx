import { cn } from '@/lib/utils';

/**
 * Screen Reader Only component - content visible only to screen readers
 * Visually hidden but accessible to assistive technologies
 */
export const SrOnly = ({ className, children, ...props }) => {
  return (
    <span
      className={cn(
        'sr-only',
        'absolute w-px h-px p-0 -m-px overflow-hidden',
        'whitespace-nowrap border-0',
        'clip-path-inset-50',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};