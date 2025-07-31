import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingStateProps {
  title?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ title = 'Loading...', message, size = 'md' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoadingSpinner size={size} className="mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {message && (
        <p className="text-sm text-gray-600 mt-2 text-center max-w-md">
          {message}
        </p>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}