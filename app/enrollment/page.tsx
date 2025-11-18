'use client';

import Button from '@/components/Button';
import Card from '@/components/card';
import FutronicScanner from '@/components/fingerprint/FutronicScanner';
import Input from '@/components/Input';
import { FingerprintImage, FingerprintTemplate } from '@/lib/futronic-sdk';
import { useState, useCallback } from 'react';


interface StudentInfo {
  fullName: string;
  matricNo: string;
  jambRegNo: string;
  department: string;
  faculty: string;
}

interface CapturedFinger {
  finger: string;
  image: FingerprintImage;
  template: FingerprintTemplate;
  quality: number;
  timestamp: Date;
}

export default function EnrollmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedFingers, setCapturedFingers] = useState<CapturedFinger[]>([]);
  const [scannerStatus, setScannerStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  const fingersList = [
    'Right Thumb', 'Right Index', 'Right Middle', 'Right Ring', 'Right Little',
    'Left Thumb', 'Left Index', 'Left Middle', 'Left Ring', 'Left Little'
  ];

  // Mock student data
  const mockStudentData: StudentInfo = {
    fullName: 'Adebola Johnson Taiwo',
    matricNo: 'EKSU/2021/CS/001',
    jambRegNo: '12345678AB',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStudentInfo(mockStudentData);
      setIsLoading(false);
    }, 1500);
  };

  const handleCaptureSuccess = useCallback((image: FingerprintImage, template: FingerprintTemplate) => {
    const nextFingerIndex = capturedFingers.length;
    if (nextFingerIndex < fingersList.length) {
      const newFinger: CapturedFinger = {
        finger: fingersList[nextFingerIndex],
        image,
        template,
        quality: template.quality,
        timestamp: new Date()
      };
      
      setCapturedFingers(prev => [...prev, newFinger]);
      
      // Auto-capture next finger after short delay
      setTimeout(() => {
        if (nextFingerIndex + 1 < fingersList.length) {
          // Trigger next capture automatically
        }
      }, 1000);
    }
  }, [capturedFingers.length, fingersList]);

  const handleCaptureError = useCallback((error: Error) => {
    console.error('Fingerprint capture error:', error);
    alert(`Capture failed: ${error.message}`);
  }, []);

  const handleDeviceStatusChange = useCallback((connected: boolean, info?: any) => {
    setScannerStatus(connected ? 'connected' : 'disconnected');
    setDeviceInfo(info);
  }, []);

  const handlePreviewUpdate = useCallback((imageData: string) => {
    setPreviewImage(imageData);
  }, []);

  const handleSaveEnrollment = async () => {
    if (capturedFingers.length === 0) {
      alert('Please capture at least one fingerprint');
      return;
    }

    try {
      // Here you would send the data to your backend
      const enrollmentData = {
        studentInfo,
        fingerprints: capturedFingers,
        deviceInfo,
        enrolledAt: new Date().toISOString()
      };

      console.log('Enrollment data:', enrollmentData);
      alert('Enrollment completed successfully!');
      
      // Reset form
      setStudentInfo(null);
      setSearchQuery('');
      setCapturedFingers([]);
    } catch (error) {
      console.error('Enrollment save error:', error);
      alert('Failed to save enrollment data');
    }
  };

  const getFingerStatus = (fingerName: string) => {
    const captured = capturedFingers.find(f => f.finger === fingerName);
    return {
      captured: !!captured,
      quality: captured?.quality || 0,
      isCurrent: false // You can track current finger being captured
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Biometric Enrollment</h1>
          <p className="text-gray-600 mt-2">Enroll students using Futronic FS80H Scanner</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Student Info and Scanner */}
          <div className="space-y-6">
            {/* Search Section */}
            <Card title="Search Student">
              <div className="space-y-4">
                <Input
                  label="Search by Matric No. or JAMB Reg No."
                  placeholder="Enter matric number or JAMB registration number"
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Find Student'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card>

            {/* Student Information */}
            {studentInfo && (
              <Card title="Student Information">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {studentInfo.fullName}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Matric No.
                      </label>
                      <p className="text-gray-900 font-medium">
                        {studentInfo.matricNo}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Department
                      </label>
                      <p className="text-gray-900 font-medium">
                        {studentInfo.department}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Fingerprint Scanner */}
            {studentInfo && (
              <FutronicScanner
                onCaptureSuccess={handleCaptureSuccess}
                onCaptureError={handleCaptureError}
                onDeviceStatusChange={handleDeviceStatusChange}
                onPreviewUpdate={handlePreviewUpdate}
                captureOptions={{
                  timeout: 30000,
                  qualityThreshold: 60,
                  captureMode: 'single'
                }}
                className="w-full"
              />
            )}
          </div>

          {/* Right Column - Fingerprint Progress */}
          {studentInfo && (
            <div className="space-y-6">
              <Card title="Fingerprint Capture Progress">
                <div className="space-y-4">
                  {/* Progress Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Capture Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        {capturedFingers.length} / {fingersList.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(capturedFingers.length / fingersList.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Finger List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fingersList.map((fingerName) => {
                      const status = getFingerStatus(fingerName);
                      return (
                        <div
                          key={fingerName}
                          className={`border-2 rounded-lg p-3 transition-all duration-200 ${
                            status.captured 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {fingerName}
                            </span>
                            {status.captured && (
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600">
                                  {status.quality}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className={`text-xs mt-1 ${
                            status.captured ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {status.captured ? 'Captured' : 'Pending'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  {capturedFingers.length > 0 && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => setCapturedFingers([])}
                        variant="secondary"
                        className="flex-1"
                      >
                        Restart Capture
                      </Button>
                      <Button
                        onClick={handleSaveEnrollment}
                        variant="primary"
                        className="flex-1"
                        disabled={capturedFingers.length === 0}
                      >
                        Complete Enrollment
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Device Information */}
              {deviceInfo && (
                <Card title="Scanner Information">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{deviceInfo.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serial No:</span>
                      <span className="font-medium">{deviceInfo.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        scannerStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {scannerStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}