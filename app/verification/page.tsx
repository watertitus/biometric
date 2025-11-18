'use client';

import Button from '@/components/Button';
import Card from '@/components/card';
import Input from '@/components/Input';
import { useState } from 'react';


export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationResult({
        verified: true,
        studentName: 'Adebola Johnson Taiwo',
        matricNo: 'EKSU/2021/CS/001',
        department: 'Computer Science',
        lastVerified: '2024-01-15',
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Identity Verification</h1>
          <p className="text-gray-600 mt-2">Verify student identity using biometric data</p>
        </div>

        <div className="space-y-6">
          <Card title="Verify Identity">
            <div className="space-y-4">
              <Input
                label="Matriculation Number"
                placeholder="Enter student matric number"
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <Button
                onClick={handleVerify}
                disabled={!searchQuery.trim() || isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Verifying...' : 'Verify Identity'}
              </Button>
            </div>
          </Card>

          {verificationResult && (
            <Card title="Verification Result">
              <div className={`p-4 rounded-lg ${
                verificationResult.verified 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className={`w-4 h-4 rounded-full ${
                    verificationResult.verified ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="ml-2 font-semibold">
                    {verificationResult.verified ? 'Identity Verified' : 'Identity Not Verified'}
                  </span>
                </div>
                
                {verificationResult.verified && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {verificationResult.studentName}
                    </div>
                    <div>
                      <span className="font-medium">Matric No:</span> {verificationResult.matricNo}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {verificationResult.department}
                    </div>
                    <div>
                      <span className="font-medium">Last Verified:</span> {verificationResult.lastVerified}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}