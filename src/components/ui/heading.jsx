import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('font-display', {
  variants: {
    level: {
      h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight',
      h2: 'text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight',
      h3: 'text-lg sm:text-xl lg:text-2xl font-semibold leading-snug',
      h4: 'text-base sm:text-lg lg:text-xl font-semibold leading-snug',
      h5: 'text-sm sm:text-base lg:text-lg font-medium leading-normal',
      h6: 'text-xs sm:text-sm lg:text-base font-medium leading-normal',
    },
    variant: {
      default: 'text-equus-foreground',
      primary: 'text-equus-primary',
      secondary: 'text-equus-secondary',
      accent: 'text-equus-accent',
      olive: 'text-equus-olive',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    level: 'h2',
    variant: 'default',
    align: 'left',
  },
});

const H1 = React.forwardRef(({ className, variant, align, ...props }, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(
        headingVariants({ level: 'h1', variant, align, className }),
      )}
      {...props}
    />
  );
});
H1.displayName = 'H1';

const H2 = React.forwardRef(({ className, variant, align, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(
        headingVariants({ level: 'h2', variant, align, className }),
      )}
      {...props}
    />
  );
});
H2.displayName = 'H2';

const H3 = React.forwardRef(({ className, variant, align, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        headingVariants({ level: 'h3', variant, align, className }),
      )}
      {...props}
    />
  );
});
H3.displayName = 'H3';

const H4 = React.forwardRef(({ className, variant, align, ...props }, ref) => {
  return (
    <h4
      ref={ref}
      className={cn(
        headingVariants({ level: 'h4', variant, align, className }),
      )}
      {...props}
    />
  );
});
H4.displayName = 'H4';

const H5 = React.forwardRef(({ className, variant, align, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn(
        headingVariants({ level: 'h5', variant, align, className }),
      )}
      {...props}
    />
  );
});
H5.displayName = 'H5';

const H6 = React.forwardRef(({ className, variant, align, ...props }, ref) => {
  return (
    <h6
      ref={ref}
      className={cn(
        headingVariants({ level: 'h6', variant, align, className }),
      )}
      {...props}
    />
  );
});
H6.displayName = 'H6';

export { H1, H2, H3, H4, H5, H6, headingVariants };
