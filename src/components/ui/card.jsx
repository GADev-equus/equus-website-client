/**
 * Card Component
 * A flexible card component with consistent styling across the application
 * Based on the equus-card-highlighted design with transparent background and left border accent
 */

import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  // Base styles
  'w-full',
  {
    variants: {
      variant: {
        // Traditional card styling for dashboards, forms, etc.
        default:
          'bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6',
        // Service/highlight cards for home page
        service: 'bg-transparent border-l border-l-equus-primary',
        highlighted: 'bg-transparent border-l border-l-equus-primary',
        muted: 'bg-transparent border-l border-l-gray-300',
        accent: 'bg-transparent border-l border-l-equus-accent',
        none: 'bg-transparent',
      },
      size: {
        sm: 'max-w-xs p-3',
        md: 'max-w-sm p-4',
        lg: 'max-w-md p-6',
        xl: 'max-w-lg p-8',
        full: 'max-w-full',
        dashboard: 'max-w-full p-4', // For dashboard cards
        equus: 'max-w-[350px] p-[var(--equus-spacing-md)]', // For service cards
      },
      spacing: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
        equus: 'p-[var(--equus-spacing-md)]',
      },
    },
    defaultVariants: {
      variant: 'default', // Default to traditional card styling
      size: 'full',
    },
  },
);

const Card = React.forwardRef(
  ({ className, variant, size, spacing, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, spacing }), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'text-card-title text-equus-secondary font-semibold mb-4',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-equus-muted leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
