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
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      defaultMessage: 'Scanner is connected and ready'
    },
    disconnected: {
      color: 'bg-gray-500',
      text: 'Disconnected',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      defaultMessage: 'Scanner is not connected'
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      defaultMessage: 'Scanner connection error'
    },
    processing: {
      color: 'bg-yellow-500',
      text: 'Processing',
      icon: (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2m15.364-7.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.536 7.464l2.828 2.828M4.636 19.364l2.828-2.828" />
        </svg>
      ),
      defaultMessage: 'Scanner is processing'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse flex items-center justify-center`}>
          {config.icon}
        </div>
        <span className="text-sm font-medium text-gray-700">
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