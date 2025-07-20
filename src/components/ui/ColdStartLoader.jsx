/**
 * ColdStartLoader - Specialized loader for cold start scenarios
 * Displays progressive messaging and animated progress for long server startup times
 */

import { useState, useEffect } from 'react';
import { LoadingSpinnerCenter } from './loading-spinner';

// Configurable threshold for cold start detection
export const COLD_START_THRESHOLD = 5000; // 5 seconds
export const COLD_START_MAX_TIME = 60000; // 60 seconds

const ColdStartLoader = ({ 
  startTime = Date.now(),
  onTimeout = null,
  className = '',
  size = 'lg',
  showProgress = true
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Loading...');
  const [progress, setProgress] = useState(0);

  // Progressive messages based on elapsed time
  const getMessageForTime = (elapsed) => {
    if (elapsed < 3000) return 'Loading...';
    if (elapsed < 8000) return 'Connecting to server...';
    if (elapsed < 15000) return 'Server is starting up...';
    if (elapsed < 30000) return 'Almost ready...';
    if (elapsed < 45000) return 'Just a few more moments...';
    return 'Thank you for your patience...';
  };

  // Calculate progress based on estimated max time
  const calculateProgress = (elapsed) => {
    const maxTime = COLD_START_MAX_TIME;
    const progressPercent = Math.min((elapsed / maxTime) * 100, 95); // Cap at 95%
    return Math.round(progressPercent);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      setElapsedTime(elapsed);
      setCurrentMessage(getMessageForTime(elapsed));
      setProgress(calculateProgress(elapsed));

      // Optional timeout callback
      if (elapsed > COLD_START_MAX_TIME && onTimeout) {
        onTimeout();
      }
    }, 500); // Update every 500ms for smooth progress

    return () => clearInterval(interval);
  }, [startTime, onTimeout]);

  const formatElapsedTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-6 ${className}`}>
      {/* Main Loading Spinner */}
      <LoadingSpinnerCenter size={size} />
      
      {/* Progressive Message */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground animate-pulse">
          {currentMessage}
        </p>
        
        {/* Subtle time indicator */}
        <p className="text-sm text-muted-foreground">
          {formatElapsedTime(elapsedTime)}
        </p>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-xs space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Starting...</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {/* Subtle educational message for long waits */}
      {elapsedTime > 20000 && (
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground max-w-sm">
            Server is warming up. This is normal for services that haven't been used recently.
          </p>
        </div>
      )}

      {/* Ultra long wait message */}
      {elapsedTime > 45000 && (
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground italic">
            We appreciate your patience while our server starts up.
          </p>
        </div>
      )}
    </div>
  );
};

export default ColdStartLoader;