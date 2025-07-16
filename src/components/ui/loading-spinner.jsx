import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ className, size = 'default', ...props }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

const LoadingSpinnerCenter = ({ className, size = 'default', text = 'Loading...' }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <LoadingSpinner size={size} className="mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

export { LoadingSpinner, LoadingSpinnerCenter };