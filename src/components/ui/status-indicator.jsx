/**
 * StatusIndicator - Consistent status display component
 * Used across admin interfaces for status management
 */

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

const statusIndicatorVariants = cva('inline-flex items-center gap-2', {
  variants: {
    variant: {
      pending: 'text-yellow-700 dark:text-yellow-400',
      read: 'text-blue-700 dark:text-blue-400',
      replied: 'text-green-700 dark:text-green-400',
      archived: 'text-gray-700 dark:text-gray-400',
      active: 'text-green-700 dark:text-green-400',
      inactive: 'text-red-700 dark:text-red-400',
      processing: 'text-blue-700 dark:text-blue-400',
    },
  },
  defaultVariants: {
    variant: 'pending',
  },
});

function StatusIndicator({
  status,
  showDot = true,
  showBadge = true,
  size = 'default',
  className,
  ...props
}) {
  const variant = status?.toLowerCase() || 'pending';

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500' },
    read: { label: 'Read', color: 'bg-blue-500' },
    replied: { label: 'Replied', color: 'bg-green-500' },
    archived: { label: 'Archived', color: 'bg-gray-500' },
    active: { label: 'Active', color: 'bg-green-500' },
    inactive: { label: 'Inactive', color: 'bg-red-500' },
    processing: { label: 'Processing', color: 'bg-blue-500' },
  };

  const config = statusConfig[variant] || statusConfig.pending;

  if (showBadge) {
    return (
      <Badge
        variant={variant}
        size={size}
        className={cn(statusIndicatorVariants({ variant }), className)}
        {...props}
      >
        {showDot && (
          <span
            className={cn('w-2 h-2 rounded-full', config.color)}
            aria-hidden="true"
          />
        )}
        {config.label}
      </Badge>
    );
  }

  return (
    <span
      className={cn(statusIndicatorVariants({ variant }), className)}
      {...props}
    >
      {showDot && (
        <span
          className={cn('w-2 h-2 rounded-full', config.color)}
          aria-hidden="true"
        />
      )}
      <span className="capitalize">{config.label}</span>
    </span>
  );
}

export { StatusIndicator, statusIndicatorVariants };
