'use client';

import Button from '@/components/Button';
import Card from '@/components/card';
import StatusIndicator from '@/components/StatusIndicator';
import { useState } from 'react';


interface VerificationResult {
  verified: boolean;
  studentName?: string;
  matricNo?: string;
  department?: string;
  faculty?: string;
  verificationTime?: string;
  confidence?: number;
}

export default function VerificationPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<'connected' | 'disconnected' | 'processing'>('connected');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [captureProgress, setCaptureProgress] = useState(0);

  const handleStartVerification = () => {
    setIsVerifying(true);
    setDeviceStatus('processing');
    setVerificationResult(null);
    setCaptureProgress(0);

    // Simulate fingerprint capture and verification process
    const progressInterval = setInterval(() => {
      setCaptureProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          completeVerification();
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  const completeVerification = () => {
    // Simulate API call delay
    setTimeout(() => {
      // Mock verification result - in real app, this would come from biometric API
      const mockResult: VerificationResult = Math.random() > 0.3 ? {
        verified: true,
        studentName: 'Adebola Johnson Taiwo',
        matricNo: 'EKSU/2021/CS/001',
        department: 'Computer Science',
        faculty: 'Faculty of Science',
        verificationTime: new Date().toLocaleString(),
        confidence: 98.7
      } : {
        verified: false,
        verificationTime: new Date().toLocaleString(),
        confidence: 45.2
      };

      setVerificationResult(mockResult);
      setIsVerifying(false);
      setDeviceStatus('connected');
    }, 1000);
  };

  const handleReset = () => {
    setVerificationResult(null);
    setCaptureProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Identity Verification</h1>
          <p className="text-gray-600 mt-2">Verify identity using fingerprint biometrics</p>
        </div>

        <div className="space-y-6">
          {/* Verification Section */}
          <Card title="Fingerprint Verification">
            <div className="space-y-6">
              {/* Device Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Scanner Status:</span>
                <StatusIndicator status={deviceStatus} />
              </div>

              {/* Fingerprint Preview Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 min-h-[300px] flex flex-col items-center justify-center">
                {isVerifying ? (
                  <div className="text-center w-full">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${captureProgress}%` }}
                      ></div>
                    </div>
                    
                    {/* Scanning Animation */}
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-4 border-4 border-blue-500 border-b-transparent rounded-full animate-spin animation-delay-200"></div>
                    </div>
                    
                    <p className="text-gray-700 font-medium text-lg">Scanning Fingerprint...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {captureProgress < 100 ? 'Please keep your finger on the scanner' : 'Processing verification...'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    <p className="font-medium text-lg">Ready for Verification</p>
                    <p className="text-sm mt-2">Place your finger on the scanner to verify your identity</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                {!verificationResult && (
                  <Button
                    onClick={handleStartVerification}
                    disabled={isVerifying}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {isVerifying ? 'Verifying...' : 'Start Verification'}
                  </Button>
                )}
                
                {verificationResult && (
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleReset}
                      variant="secondary"
                    >
                      Verify Another
                    </Button>
                    <Button
                      onClick={() => window.print()}
                      variant="primary"
                    >
                      Print Result
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Verification Result */}
          {verificationResult && (
            <Card title="Verification Result">
              <div className={`p-6 rounded-lg ${
                verificationResult.verified 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      verificationResult.verified ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="ml-2 text-lg font-semibold">
                      {verificationResult.verified ? 'Identity Verified Successfully' : 'Identity Not Verified'}
                    </span>
                  </div>
                  {verificationResult.confidence && (
                    <div className="text-sm text-gray-600">
                      Confidence: <span className="font-medium">{verificationResult.confidence}%</span>
                    </div>
                  )}
                </div>
                
                {verificationResult.verified ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Full Name:</span>
                      <p className="text-gray-900 font-semibold">{verificationResult.studentName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Matric Number:</span>
                      <p className="text-gray-900 font-semibold">{verificationResult.matricNo}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Department:</span>
                      <p className="text-gray-900 font-semibold">{verificationResult.department}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Faculty:</span>
                      <p className="text-gray-900 font-semibold">{verificationResult.faculty}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-500">Verification Time:</span>
                      <p className="text-gray-900">{verificationResult.verificationTime}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <svg className="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-700 font-medium">No matching fingerprint found in the system.</p>
                    <p className="text-red-600 text-sm mt-1">
                      Please ensure you are enrolled in the biometric system or try again.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Instructions Card */}
          {!verificationResult && !isVerifying && (
            <Card title="Verification Instructions">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-gray-700">
                    Ensure the fingerprint scanner is properly connected and powered on
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-gray-700">
                    Place your finger firmly on the scanner surface when verification starts
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-gray-700">
                    Keep your finger still until the verification process is complete
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p className="text-gray-700">
                    Wait for the system to display your verification result
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}