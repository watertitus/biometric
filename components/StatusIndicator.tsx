import React from 'react';

interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'error' | 'processing';
  message?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  message 
}) => {
  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      text: 'Connected',
      defaultMessage: 'Device is connected and ready'
    },
    disconnected: {
      color: 'bg-gray-500',
      text: 'Disconnected',
      defaultMessage: 'Device is not connected'
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      defaultMessage: 'Device connection error'
    },
    processing: {
      color: 'bg-yellow-500',
      text: 'Processing',
      defaultMessage: 'Device is processing'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}></div>
        <span className="ml-2 text-sm font-medium text-gray-700">
          {config.text}
        </span>
      </div>
      {message && (
        <span className="text-sm text-gray-500">
          {message}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;