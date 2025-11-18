'use client';

import { useState } from 'react';

import StatusIndicator from '../../components/StatusIndicator';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/card';
import FingerprintPreview from '@/components/FingerprintPreview';

interface StudentInfo {
    fullName: string;
    matricNo: string;
    jambRegNo: string;
    department: string;
    faculty: string;
    jambScore: string;
    acceptanceFeePaid: boolean;
}

export default function EnrollmentPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock student data - in real app, this would come from API
    const mockStudentData: StudentInfo = {
        fullName: 'Adebola Johnson Taiwo',
        matricNo: 'EKSU/2021/CS/001',
        jambRegNo: '12345678AB',
        department: 'Computer Science',
        faculty: 'Faculty of Science',
        jambScore: '285',
        acceptanceFeePaid: true,
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

    const handleCaptureStart = () => {
        console.log('Starting fingerprint capture...');
    };

    const handleSaveTemplate = () => {
        alert('Fingerprint template saved successfully!');
        // Reset form
        setStudentInfo(null);
        setSearchQuery('');
    };

    const handleCancel = () => {
        setStudentInfo(null);
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Biometric Enrollment</h1>
                    <p className="text-gray-600 mt-2">Enroll students into the biometric system</p>
                </div>

                <div className="space-y-6">
                    {/* Search Section */}
                    <Card title="Search Student">
                        <div className="space-y-4">
                            <Input
                                label='Search by Matric No. or JAMB Reg No.(use "12345678AB"'
                                placeholder="Enter matric number or JAMB registration number"
                                value={searchQuery}
                                onChange={setSearchQuery}
                                className="max-w-2xl"
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

                    {/* Student Information Section */}
                    {studentInfo && (
                        <Card title="Student Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Full Name
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {studentInfo.fullName}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Department
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {studentInfo.department}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        JAMB Details
                                    </label>
                                    <p className="text-sm text-gray-900">
                                        Reg: {studentInfo.jambRegNo}
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        Score: {studentInfo.jambScore}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Acceptance Fee
                                    </label>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${studentInfo.acceptanceFeePaid
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {studentInfo.acceptanceFeePaid ? 'Paid' : 'Not Paid'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Capture Section */}
                    {studentInfo && (
                        <Card title="Fingerprint Capture">
                            <FingerprintPreview
                                onCaptureStart={handleCaptureStart}
                                onSave={handleSaveTemplate}
                                onCancel={handleCancel}
                            />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}