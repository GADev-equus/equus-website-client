import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-equus-primary text-equus-foreground shadow-xs hover:bg-equus-primary/90',
        destructive:
          'bg-equus-accent text-white shadow-xs hover:bg-equus-accent/90 focus-visible:ring-equus-accent/20 dark:focus-visible:ring-equus-accent/40',
        outline:
          'border border-equus-border bg-equus-card text-equus-foreground shadow-xs hover:bg-equus-muted hover:text-equus-foreground hover:border-equus-primary',
        secondary:
          'bg-equus-secondary text-equus-foreground shadow-xs hover:bg-equus-secondary/80',
        ghost:
          'hover:bg-equus-accent/20 hover:text-equus-accent dark:hover:bg-equus-accent/10',
        link: 'text-equus-primary underline-offset-4 hover:underline',
        // Equus brand variants
        equus:
          'bg-equus-primary text-equus-foreground shadow-xs hover:bg-equus-primary/90',
        equusSecondary:
          'bg-equus-secondary text-equus-foreground shadow-xs hover:bg-equus-secondary/80',
        equusAccent:
          'bg-equus-accent text-white shadow-xs hover:bg-equus-accent/90',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-md px-8 has-[>svg]:px-6 text-base',
        icon: 'size-9',
        full: 'h-9 px-4 py-2 w-full',
      },
    },
    defaultVariants: {
      variant: 'equus',
      size: 'default',
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
