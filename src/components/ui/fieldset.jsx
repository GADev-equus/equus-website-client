import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SrOnly } from './sr-only';

const fieldsetVariants = cva(
  'border border-transparent transition-all group relative',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-transparent dark:border-transparent dark:bg-transparent',
        outline:
          'border-transparent bg-transparent dark:border-transparent',
        filled:
          'border-transparent bg-gray-50 dark:border-transparent dark:bg-gray-800/50',
        elevated:
          'border-transparent bg-white shadow-sm dark:border-transparent dark:bg-gray-900',
        accent:
          'border-transparent bg-blue-50/30 dark:border-transparent dark:bg-blue-950/20',
        equus:
          'border-transparent bg-transparent dark:border-transparent dark:bg-transparent',
        success:
          'border-transparent bg-green-50/50 dark:border-transparent dark:bg-green-950/20',
        warning:
          'border-transparent bg-amber-50/50 dark:border-transparent dark:bg-amber-950/20',
        error:
          'border-transparent bg-red-50/50 dark:border-transparent dark:bg-red-950/20',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      spacing: {
        tight: 'space-y-2',
        default: 'space-y-4',
        relaxed: 'space-y-6',
        loose: 'space-y-8',
      },
      state: {
        default: '',
        disabled: 'opacity-60 cursor-not-allowed',
        focused:
          'ring-2 ring-blue-500/20 border-blue-500 dark:ring-blue-400/20 dark:border-blue-400',
        invalid:
          'ring-2 ring-red-500/20 border-red-500 dark:ring-red-400/20 dark:border-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      spacing: 'default',
      state: 'default',
    },
  },
);

const legendVariants = cva('font-medium transition-colors text-left ml-0', {
  variants: {
    variant: {
      default: 'font-semibold',
      muted: 'text-gray-600 dark:text-gray-400',
      accent: 'text-blue-600 dark:text-blue-400',
      equus: 'text-blue-600 font-semibold dark:text-blue-400',
      success: 'text-green-700 dark:text-green-400',
      warning: 'text-amber-700 dark:text-amber-400',
      error: 'text-red-700 dark:text-red-400',
    },
    size: {
      sm: 'text-sm px-2',
      default: 'text-[1.25rem] px-4',
      lg: 'text-[1.5rem] px-4',
      xl: 'text-2xl px-4',
    },
    position: {
      default: '',
      centered: 'mx-auto',
      right: 'ml-auto',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    position: 'default',
  },
});

const Fieldset = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      spacing,
      state,
      disabled,
      children,
      legend,
      legendVariant,
      legendSize,
      legendPosition,
      legendClassName,
      description,
      required,
      optional,
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref,
  ) => {
    // Determine the actual state based on props
    const actualState = disabled ? 'disabled' : state;
    const baseId = React.useId();
    const legendId = legend ? `${baseId}-legend` : undefined;
    const descriptionId = description ? `${baseId}-description` : undefined;
    const ariaDescribedBy = [
      ariaDescribedByProp,
      descriptionId,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        className={cn(
          fieldsetVariants({ variant, size, spacing, state: actualState }),
          className,
        )}
        {...props}
      >
        {legend && (
          <legend
            id={legendId}
            className={cn(
              legendVariants({
                variant: legendVariant || variant,
                size: legendSize || size,
                position: legendPosition,
              }),
              legendClassName,
            )}
          >
            <span className="flex items-center gap-2">
              {typeof legend === 'string' ? (
                <>
                  <SrOnly>{legend}</SrOnly>
                  <span aria-hidden="true">
                    {legend.split('').map((letter, index) => (
                      <span
                        key={index}
                        className="font-semibold bg-gradient-to-b from-white from-50% to-gray-400 to-50% bg-clip-text text-transparent"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                legend
              )}
              {required && (
                <span
                  className="text-red-500 dark:text-red-400"
                  aria-label="required"
                >
                  *
                </span>
              )}
              {optional && (
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  (optional)
                </span>
              )}
            </span>
          </legend>
        )}

        {description && (
          <div
            id={descriptionId}
            className="text-xs text-gray-600 dark:text-gray-400 mt-2 mb-4 px-1"
          >
            {description}
          </div>
        )}

        <div
          className={cn(
            'fieldset-content',
            spacing &&
              fieldsetVariants({ spacing })
                .split(' ')
                .find((cls) => cls.startsWith('space-')),
          )}
        >
          {children}
        </div>
      </fieldset>
    );
  },
);

Fieldset.displayName = 'Fieldset';

// Fieldset content helpers for better organization
const FieldsetHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fieldset-header mb-4 pb-2 border-b border-gray-200 dark:border-gray-700',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

FieldsetHeader.displayName = 'FieldsetHeader';

const FieldsetBody = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('fieldset-body', className)} {...props}>
      {children}
    </div>
  ),
);

FieldsetBody.displayName = 'FieldsetBody';

const FieldsetFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fieldset-footer mt-4 pt-2 border-t border-gray-200 dark:border-gray-700',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

FieldsetFooter.displayName = 'FieldsetFooter';

const FieldsetGrid = React.forwardRef(
  (
    {
      className,
      children,
      cols = 1,
      gap = 'default',
      responsive = true,
      ...props
    },
    ref,
  ) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };

    const gridGap = {
      tight: 'gap-2',
      default: 'gap-4',
      relaxed: 'gap-6',
      loose: 'gap-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          responsive ? gridCols[cols] || 'grid-cols-1' : `grid-cols-${cols}`,
          gridGap[gap] || 'gap-4',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

FieldsetGrid.displayName = 'FieldsetGrid';

export {
  Fieldset,
  FieldsetHeader,
  FieldsetBody,
  FieldsetFooter,
  FieldsetGrid,
  fieldsetVariants,
  legendVariants,
};
