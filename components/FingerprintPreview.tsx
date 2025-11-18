'use client';

import React, { useState } from 'react';

interface FingerprintPreviewProps {
  onCaptureStart: () => void;
  onSave: () => void;
  onCancel: () => void;
}

interface FingerStatus {
  name: string;
  key: string;
  captured: boolean;
  quality: number;
}

const FingerprintPreview: React.FC<FingerprintPreviewProps> = ({
  onCaptureStart,
  onSave,
  onCancel,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<'connected' | 'disconnected'>('connected');
  const [currentFinger, setCurrentFinger] = useState<string>('');

  const fingers: FingerStatus[] = [
    { name: 'Right Thumb', key: 'right_thumb', captured: false, quality: 0 },
    { name: 'Right Index', key: 'right_index', captured: false, quality: 0 },
    { name: 'Right Middle', key: 'right_middle', captured: false, quality: 0 },
    { name: 'Right Ring', key: 'right_ring', captured: false, quality: 0 },
    { name: 'Right Little', key: 'right_little', captured: false, quality: 0 },
    { name: 'Left Thumb', key: 'left_thumb', captured: false, quality: 0 },
    { name: 'Left Index', key: 'left_index', captured: false, quality: 0 },
    { name: 'Left Middle', key: 'left_middle', captured: false, quality: 0 },
    { name: 'Left Ring', key: 'left_ring', captured: false, quality: 0 },
    { name: 'Left Little', key: 'left_little', captured: false, quality: 0 },
  ];

  const handleStartCapture = () => {
    setIsCapturing(true);
    setDeviceStatus('connected');
    onCaptureStart();
    
    // Simulate finger capture process
    let currentIndex = 0;
    const simulateCapture = () => {
      if (currentIndex < fingers.length) {
        setCurrentFinger(fingers[currentIndex].key);
        setTimeout(() => {
          fingers[currentIndex].captured = true;
          fingers[currentIndex].quality = Math.floor(Math.random() * 40) + 60;
          currentIndex++;
          simulateCapture();
        }, 1000);
      } else {
        setIsCapturing(false);
        setCurrentFinger('');
      }
    };
    
    simulateCapture();
  };

  const getFingerStatusColor = (finger: FingerStatus) => {
    if (currentFinger === finger.key) return 'border-blue-500 bg-blue-50';
    if (finger.captured) return 'border-green-500 bg-green-50';
    return 'border-gray-300 bg-gray-50';
  };

  const getFingerStatusText = (finger: FingerStatus) => {
    if (currentFinger === finger.key) return 'Capturing...';
    if (finger.captured) return `Quality: ${finger.quality}%`;
    return 'Pending';
  };

  return (
    <div className="space-y-6">
      {/* Capture Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={handleStartCapture}
          disabled={isCapturing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isCapturing ? 'Capturing...' : 'Start Capture'}
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Device Status:</span>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${deviceStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="ml-2 text-sm text-gray-600 capitalize">
              {deviceStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 min-h-[200px] flex items-center justify-center">
        {isCapturing ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Capturing fingerprint...</p>
            <p className="text-sm text-gray-500 mt-1">
              {fingers.find(f => f.key === currentFinger)?.name || 'Please place finger on scanner'}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <p className="font-medium">Fingerprint Preview</p>
            <p className="text-sm mt-1">Start capture to see live preview</p>
          </div>
        )}
      </div>

      {/* Finger List */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Fingerprint Capture Progress</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {fingers.map((finger) => (
            <div
              key={finger.key}
              className={`border-2 rounded-lg p-3 transition-all duration-200 ${getFingerStatusColor(finger)}`}
            >
              <div className="text-sm font-medium text-gray-900">{finger.name}</div>
              <div className={`text-xs mt-1 ${
                currentFinger === finger.key ? 'text-blue-600' : 
                finger.captured ? 'text-green-600' : 'text-gray-500'
              }`}>
                {getFingerStatusText(finger)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!fingers.some(f => f.captured)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Save Template
        </button>
      </div>
    </div>
  );
};

export default FingerprintPreview;