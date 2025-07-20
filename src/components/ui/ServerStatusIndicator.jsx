/**
 * ServerStatusIndicator - Component for displaying server status and cold start information
 * Shows current server status and provides visual feedback for cold starts
 */

import { useState, useEffect } from 'react';

const ServerStatusIndicator = ({ 
  status = 'ready', 
  className = '',
  showStatus = true 
}) => {
  const [displayStatus, setDisplayStatus] = useState(status);

  useEffect(() => {
    setDisplayStatus(status);
  }, [status]);

  const getStatusColor = () => {
    switch (displayStatus) {
      case 'ready': return 'text-green-600';
      case 'warming': return 'text-yellow-600';
      case 'cold': return 'text-blue-600';
      case 'connecting': return 'text-blue-500';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (displayStatus) {
      case 'ready': return '●';
      case 'warming': return '◐';
      case 'cold': return '○';
      case 'connecting': return '◔';
      case 'down': return '●';
      default: return '○';
    }
  };

  const getStatusMessage = () => {
    switch (displayStatus) {
      case 'ready': return 'Connected';
      case 'warming': return 'Connecting...';
      case 'cold': return 'Starting server...';
      case 'connecting': return 'Connecting...';
      case 'down': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (!showStatus) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span className={`${getStatusColor()} animate-pulse`}>
        {getStatusIcon()}
      </span>
      <span className={`${getStatusColor()} font-medium`}>
        {getStatusMessage()}
      </span>
    </div>
  );
};

export default ServerStatusIndicator;