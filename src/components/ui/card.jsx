/**
 * Card Component
 * A flexible card component with consistent styling across the application
 * Features unified padding and gradient backgrounds inspired by Hero section
 * Uses Equus design system variables for brand consistency
 */

import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  // Base styles - applied to all cards with gradient background
  'w-full !p-4 relative overflow-hidden',
  {
    variants: {
      variant: {
        // Traditional card styling for dashboards, forms, etc.
        default: 'bg-card text-card-foreground border border-border shadow-sm',
        // Service/highlight cards with gradient background
        service:
          'bg-gradient-to-br from-equus-primary/10 via-equus-secondary/5 to-equus-olive/10 border-lxxx backdrop-blur-sm',
        // Gradient cards with different accent borders
        highlighted:
          'bg-gradient-to-br from-equus-primary/5 via-transparent to-equus-olive/5 border-lxxx backdrop-blur-sm',
        muted:
          'bg-gradient-to-br from-gray-500/5 via-transparent to-gray-300/5 border-lxxx border-lxxx-gray-300 backdrop-blur-sm',
        accent:
          'bg-gradient-to-br from-equus-accent/10 via-transparent to-equus-secondary/5 border-lxxx border-lxxx-equus-accent backdrop-blur-sm',
        gradient:
          'bg-gradient-to-br from-equus-primary/10 via-equus-secondary/5 to-equus-olive/10 border border-equus-primary/20 shadow-lg backdrop-blur-sm',
        none: 'bg-transparent',
      },
      size: {
        sm: 'max-w-xs',
        md: 'max-w-sm',
        lg: 'max-w-md',
        xl: 'max-w-lg',
        full: 'max-w-full',
        equus: 'max-w-[600px]', // For service cards
      },
      spacing: {
        // Override base padding if needed
        none: '!p-0',
        sm: '!p-3',
        md: '!p-4',
        lg: '!p-6',
        xl: '!p-8',
        equus: '!p-[var(--equus-spacing-md)]',
      },
    },
    defaultVariants: {
      variant: 'default',
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
      'text-card-title text-equus-primary font-semibold mb-4 text-center',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-equus-muted leading-relaxed text-left', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-left', className)} {...props} />
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
