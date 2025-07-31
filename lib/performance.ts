import { ComponentType, lazy, LazyExoticComponent } from 'react';

// Lazy loading utility with error boundary
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: ComponentType
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const module = await factory();
      return module;
    } catch (error) {
      console.error('Error loading component:', error);
      // Return a fallback component if loading fails
      if (fallback) {
        return { default: fallback as T };
      }
      throw error;
    }
  });
}

// Preload utility for critical resources
export function preloadRoute(href: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'fetch';
    document.head.appendChild(link);
  }
}

// Image optimization helper
export function getOptimizedImageUrl(
  src: string, 
  width?: number, 
  height?: number, 
  quality = 75
): string {
  // In a real app, this could integrate with services like Cloudinary, ImageKit, etc.
  // For now, return the original src
  if (!width && !height) return src;
  
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  
  return `${src}?${params.toString()}`;
}

// Debounce utility for search and input optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memory management for large lists
export class VirtualList {
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop = 0;
  
  constructor(itemHeight: number, containerHeight: number) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
  }
  
  getVisibleRange(totalItems: number): { start: number; end: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const visibleItems = Math.ceil(this.containerHeight / this.itemHeight);
    const end = Math.min(start + visibleItems + 1, totalItems);
    
    return { start: Math.max(0, start - 1), end };
  }
  
  updateScrollTop(scrollTop: number): void {
    this.scrollTop = scrollTop;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  mark(name: string): void {
    if (typeof performance !== 'undefined') {
      this.marks.set(name, performance.now());
    }
  }
  
  measure(startMark: string, endMark?: string): number {
    if (typeof performance === 'undefined') return 0;
    
    const startTime = this.marks.get(startMark);
    if (!startTime) return 0;
    
    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    if (!endTime) return 0;
    
    const duration = endTime - startTime;
    console.log(`Performance: ${startMark} took ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  clear(): void {
    this.marks.clear();
  }
}

// Create a global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Bundle analyzer helper
export function analyzeBundleSize(): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis would run here in development mode');
    // In a real app, this could integrate with webpack-bundle-analyzer
  }
}

// Memory usage tracker
export function trackMemoryUsage(): void {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      allocated: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
    });
  }
}