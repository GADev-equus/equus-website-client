import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for infinite scrolling
 * @param {Function} fetchMore - Function to fetch more data
 * @param {Object} options - Configuration options
 * @returns {Object} { loading, hasMore, error, reset }
 */
export const useInfiniteScroll = (fetchMore, options = {}) => {
  const {
    threshold = 100,
    enabled = true,
    rootMargin = '0px'
  } = options;

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const handleIntersection = useCallback(async (entries) => {
    if (!enabled || loading || !hasMore) return;

    const [entry] = entries;
    if (entry.isIntersecting) {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchMore();
        if (result && result.hasMore !== undefined) {
          setHasMore(result.hasMore);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  }, [fetchMore, enabled, loading, hasMore]);

  const observerRef = useCallback((node) => {
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [handleIntersection, rootMargin]);

  const reset = useCallback(() => {
    setLoading(false);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    loading,
    hasMore,
    error,
    reset,
    observerRef
  };
};

/**
 * Custom hook for virtual scrolling (for large lists)
 * @param {Array} items - Array of items to render
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of the container
 * @returns {Object} { visibleItems, containerProps, scrollToIndex }
 */
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd).map((item, index) => ({
    ...item,
    index: visibleStart + index
  }));

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const scrollToIndex = useCallback((index) => {
    const scrollTop = index * itemHeight;
    setScrollTop(scrollTop);
  }, [itemHeight]);

  const containerProps = {
    style: {
      height: containerHeight,
      overflow: 'auto'
    },
    onScroll: handleScroll
  };

  return {
    visibleItems,
    containerProps,
    scrollToIndex,
    totalHeight,
    offsetY
  };
};