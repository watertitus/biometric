'use client';

import { CaptureOptions, FingerprintImage, FingerprintTemplate, FutronicSDK } from '@/lib/futronic-sdk';
import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { FutronicSDK, FingerprintImage, FingerprintTemplate, CaptureOptions } from '../../lib/futronic-sdk';

interface FutronicScannerProps {
  onCaptureSuccess: (image: FingerprintImage, template: FingerprintTemplate) => void;
  onCaptureError: (error: Error) => void;
  onDeviceStatusChange: (connected: boolean, deviceInfo?: any) => void;
  onPreviewUpdate?: (imageData: string) => void;
  autoStart?: boolean;
  captureOptions?: CaptureOptions;
  className?: string;
}

const FutronicScanner: React.FC<FutronicScannerProps> = ({
  onCaptureSuccess,
  onCaptureError,
  onDeviceStatusChange,
  onPreviewUpdate,
  autoStart = false,
  captureOptions = {},
  className = '',
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [captureProgress, setCaptureProgress] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);

  const sdkRef = useRef<FutronicSDK | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SDK
  const initializeSDK = useCallback(async () => {
    try {
      sdkRef.current = new FutronicSDK();
      const initialized = await sdkRef.current.initialize();
      
      if (initialized) {
        setIsInitialized(true);
        await checkDeviceStatus();
      } else {
        throw new Error('Failed to initialize Futronic SDK');
      }
    } catch (error) {
      console.error('SDK Initialization error:', error);
      onDeviceStatusChange(false);
      setDeviceStatus('error');
      onCaptureError(error as Error);
    }
  }, [onDeviceStatusChange, onCaptureError]);

  // Check device status
  const checkDeviceStatus = useCallback(async () => {
    if (!sdkRef.current) return;

    try {
      const devices = await sdkRef.current.getDevices();
      const fs80hDevice = devices.find(device => 
        device.model?.includes('FS80H') || device.name?.includes('Futronic')
      );

      if (fs80hDevice) {
        setDeviceInfo(fs80hDevice);
        setDeviceStatus('connected');
        onDeviceStatusChange(true, fs80hDevice);
      } else {
        setDeviceStatus('disconnected');
        onDeviceStatusChange(false);
      }
    } catch (error) {
      setDeviceStatus('error');
      onDeviceStatusChange(false);
      console.error('Device status check failed:', error);
    }
  }, [onDeviceStatusChange]);

  // Start fingerprint capture
  const startCapture = useCallback(async () => {
    if (!sdkRef.current || !isInitialized || deviceStatus !== 'connected') {
      onCaptureError(new Error('Scanner not ready'));
      return;
    }

    setIsCapturing(true);
    setCaptureProgress(0);
    setQualityScore(0);

    try {
      // Simulate capture progress
      let progress = 0;
      captureIntervalRef.current = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
          }
        }
        setCaptureProgress(Math.min(progress, 100));
      }, 200);

      // Capture fingerprint
      const image = await sdkRef.current.captureFingerprint(captureOptions);
      
      // Update preview
      const imageData = `data:image/png;base64,${arrayBufferToBase64(image.data)}`;
      setPreviewImage(imageData);
      onPreviewUpdate?.(imageData);

      // Extract template
      const template = await sdkRef.current.extractTemplate(image);
      setQualityScore(template.quality);

      // Success callback
      onCaptureSuccess(image, template);
      
    } catch (error) {
      onCaptureError(error as Error);
    } finally {
      setIsCapturing(false);
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    }
  }, [isInitialized, deviceStatus, captureOptions, onCaptureSuccess, onCaptureError, onPreviewUpdate]);

  // Stop capture
  const stopCapture = useCallback(() => {
    setIsCapturing(false);
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  }, []);

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Effect for initialization
  useEffect(() => {
    initializeSDK();

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
      if (sdkRef.current) {
        sdkRef.current.close();
      }
    };
  }, [initializeSDK]);

  // Effect for auto-start
  useEffect(() => {
    if (autoStart && isInitialized && deviceStatus === 'connected' && !isCapturing) {
      startCapture();
    }
  }, [autoStart, isInitialized, deviceStatus, isCapturing, startCapture]);

  // Device status indicator
  const getStatusColor = () => {
    switch (deviceStatus) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (deviceStatus) {
      case 'connected': return 'Connected';
      case 'error': return 'Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Scanner Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Futronic FS80H Scanner
          </h3>
          {deviceInfo && (
            <p className="text-sm text-gray-600">
              {deviceInfo.name} - {deviceInfo.serialNumber}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Preview Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <div className="aspect-video bg-black rounded flex items-center justify-center relative overflow-hidden">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Fingerprint Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              <p className="font-medium">Fingerprint Preview</p>
              <p className="text-sm mt-1">
                {isCapturing ? 'Place finger on scanner...' : 'Ready for capture'}
              </p>
            </div>
          )}

          {/* Capture Overlay */}
          {isCapturing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="font-medium">Capturing Fingerprint...</p>
                <p className="text-sm mt-1">Please keep your finger steady</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress and Quality Indicators */}
        {(isCapturing || qualityScore > 0) && (
          <div className="mt-4 space-y-3">
            {isCapturing && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Capture Progress</span>
                  <span>{Math.round(captureProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${captureProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {qualityScore > 0 && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Quality Score</span>
                  <span className={qualityScore >= 60 ? 'text-green-600' : 'text-red-600'}>
                    {qualityScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      qualityScore >= 80 ? 'bg-green-600' : 
                      qualityScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${qualityScore}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={startCapture}
          disabled={!isInitialized || deviceStatus !== 'connected' || isCapturing}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isCapturing ? 'Capturing...' : 'Capture Fingerprint'}
        </button>
        
        <button
          onClick={stopCapture}
          disabled={!isCapturing}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Stop
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Ensure the scanner is clean and dry</li>
          <li>• Place your finger flat on the scanner surface</li>
          <li>• Apply gentle, even pressure</li>
          <li>• Keep your finger still during capture</li>
        </ul>
      </div>
    </div>
  );
};

export default FutronicScanner;