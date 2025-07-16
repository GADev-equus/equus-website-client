import { useEffect, useState } from 'react';

/**
 * Custom hook for keyboard navigation handling
 * @param {Object} options - Configuration options
 * @param {Function} options.onEscape - Callback for Escape key
 * @param {Function} options.onEnter - Callback for Enter key
 * @param {Function} options.onArrowUp - Callback for Arrow Up key
 * @param {Function} options.onArrowDown - Callback for Arrow Down key
 * @param {Function} options.onArrowLeft - Callback for Arrow Left key
 * @param {Function} options.onArrowRight - Callback for Arrow Right key
 * @param {boolean} options.enabled - Whether the hook is enabled
 * @param {Array} options.dependencies - Dependencies array for useEffect
 */
export const useKeyboardNavigation = (options = {}) => {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    enabled = true,
    dependencies = []
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape(event);
          }
          break;
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter(event);
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp(event);
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown(event);
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft(event);
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight(event);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, ...dependencies]);
};

/**
 * Custom hook for list/menu keyboard navigation
 * @param {Array} items - Array of items to navigate
 * @param {Function} onSelect - Callback when item is selected
 * @param {Object} options - Configuration options
 */
export const useListKeyboardNavigation = (items, onSelect, options = {}) => {
  const {
    initialIndex = -1,
    loop = true,
    enabled = true
  } = options;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleArrowUp = () => {
    setCurrentIndex(prev => {
      if (prev <= 0) {
        return loop ? items.length - 1 : 0;
      }
      return prev - 1;
    });
  };

  const handleArrowDown = () => {
    setCurrentIndex(prev => {
      if (prev >= items.length - 1) {
        return loop ? 0 : items.length - 1;
      }
      return prev + 1;
    });
  };

  const handleEnter = () => {
    if (currentIndex >= 0 && currentIndex < items.length && onSelect) {
      onSelect(items[currentIndex], currentIndex);
    }
  };

  useKeyboardNavigation({
    onArrowUp: handleArrowUp,
    onArrowDown: handleArrowDown,
    onEnter: handleEnter,
    enabled,
    dependencies: [items, currentIndex]
  });

  return {
    currentIndex,
    setCurrentIndex
  };
};