import React from 'react';
import { cn } from '@/lib/utils';
import { SrOnly } from './sr-only';

/**
 * Accessible form field wrapper with proper labeling and error handling
 */
export const FormField = ({
  label,
  error,
  description,
  required = false,
  children,
  className,
  ...props
}) => {
  const fieldId = props.id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label
        htmlFor={fieldId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <p
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      {/* Input Field */}
      <div className="relative">
        {React.cloneElement(children, {
          id: fieldId,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
          'aria-required': required,
          ...props
        })}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};