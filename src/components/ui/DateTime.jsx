/**
 * DateTime Component - Real-time date and time display
 * Updates every second to show current date and time
 * Optimized for performance with visibility detection
 */

import { useState, useEffect } from 'react';

const DateTime = ({ 
  format = 'full', // 'full', 'date', 'time', 'compact', 'daymonth'
  className = '',
  updateInterval = 1000 // 1 second default
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(!document.hidden);

  // Track tab visibility for efficient updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Update time based on visibility and interval
  useEffect(() => {
    let intervalId;

    if (isVisible) {
      // Update immediately when becoming visible
      setCurrentTime(new Date());
      
      // Set up interval for regular updates
      intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, updateInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isVisible, updateInterval]);

  const formatDateTime = (date, formatType) => {
    // Custom format for daymonth to get "27 Aug 10:04 AM"
    if (formatType === 'daymonth') {
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const time = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
      return `${day} ${month} ${time}`;
    }

    const options = {
      full: {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      },
      date: {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      time: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      },
      compact: {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    };

    try {
      return new Intl.DateTimeFormat('en-US', options[formatType] || options.full).format(date);
    } catch (error) {
      // Fallback to simple format if Intl fails
      return date.toLocaleString();
    }
  };

  return (
    <span className={`datetime-display ${className}`} title={currentTime.toLocaleString()}>
      {formatDateTime(currentTime, format)}
    </span>
  );
};

export default DateTime;