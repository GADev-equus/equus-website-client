import * as React from 'react';
import { cn } from '@/lib/utils';
import { fieldsetVariants, legendVariants } from './fieldset';
import { SrOnly } from './sr-only';

const Section = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      spacing,
      state,
      children,
      title,
      titleVariant,
      titleSize,
      titlePosition,
      titleClassName,
      description,
      titleAs: TitleTag = 'h2',
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref,
  ) => {
    const baseId = React.useId();
    const titleId = title ? `${baseId}-title` : undefined;
    const descriptionId = description ? `${baseId}-description` : undefined;
    const ariaDescribedBy = [
      ariaDescribedByProp,
      descriptionId,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <section
        ref={ref}
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        className={cn(
          fieldsetVariants({ variant, size, spacing, state }),
          className,
        )}
        {...props}
      >
        {title && (
          <TitleTag
            id={titleId}
            className={cn(
              legendVariants({
                variant: titleVariant || variant,
                size: titleSize || size,
                position: titlePosition,
              }),
              '-mt-2 mb-3',
              titleClassName,
            )}
          >
            <span className="flex items-center gap-2">
              {typeof title === 'string' ? (
                <>
                  <SrOnly>{title}</SrOnly>
                  <span aria-hidden="true">
                    {title.split('').map((letter, index) => (
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
                title
              )}
            </span>
          </TitleTag>
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
      </section>
    );
  },
);

Section.displayName = 'Section';

export { Section };
