/**
 * FormContainer - Consistent form styling wrapper
 * Provides unified styling for all forms across the application
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';

function FormContainer({
  title,
  description,
  children,
  className,
  maxWidth = 'md',
  showCard = true,
  ...props
}) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  const content = (
    <div className="space-y-6">
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          )}
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );

  if (!showCard) {
    return (
      <div
        className={cn(
          'w-full mx-auto p-6',
          maxWidthClasses[maxWidth],
          className,
        )}
        {...props}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn('w-full mx-auto', maxWidthClasses[maxWidth], className)}
      {...props}
    >
      <Card className="border-l-4 border-l-[var(--equus-primary)] bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    </div>
  );
}

function FormField({
  label,
  required = false,
  error,
  children,
  className,
  ...props
}) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
    </div>
  );
}

function FormActions({ children, className, ...props }) {
  return (
    <div className={cn('flex flex-col gap-3 pt-2', className)} {...props}>
      {children}
    </div>
  );
}

export { FormContainer, FormField, FormActions };
