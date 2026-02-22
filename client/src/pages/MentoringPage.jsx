import React, { useState } from 'react';
import { mentoringAPI } from '../services/api';
import { Users, User, GraduationCap, BookOpen, Award, Clipboard } from 'lucide-react';

const tabs = [
    { id: 'personal', label: 'Personal Information', icon: <User size={14} /> },
    { id: 'parent', label: 'Parent/Guardian Details', icon: <Users size={14} /> },
    { id: 'academic', label: 'Academic Records', icon: <GraduationCap size={14} /> },
    { id: 'midSem', label: 'Mid Semester Exam', icon: <BookOpen size={14} /> },
];

export default function MentoringPage() {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Clipboard className="text-indigo-500" size={26} />
                        Student Mentoring Form
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Complete digital mentoring record as per university guidelines</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-100 px-6 overflow-x-auto">
                    <div className="flex gap-1 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'personal' && <PersonalInfo />}
                    {activeTab === 'parent' && <ParentDetails />}
                    {activeTab === 'academic' && <AcademicRecords />}
                    {activeTab === 'midSem' && <MidSemExam />}
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ icon, title }) {
    return (
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-4">
            <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
            {title}
        </div>
    );
}

function FormField({ label, placeholder, type = 'text', required, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'select' ? (
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white" {...props}>
                    <option value="">{placeholder}</option>
                    {props.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : type === 'textarea' ? (
                <textarea className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" rows={3} placeholder={placeholder} {...props} />
            ) : (
                <input type={type} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder={placeholder} {...props} />
            )}
        </div>
    );
}

function PersonalInfo() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h2>
                <p className="text-sm text-gray-500 mb-6">Complete personal details of the student</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div>
                        <SectionHeader title="Basic Information" />
                        <div className="space-y-4">
                            <FormField label="Name as per 12th Marksheet" placeholder="Enter name as in 12th marksheet" required />
                            <FormField label="Name as per Aadhar" placeholder="Enter name as per Aadhar card" required />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Aadhar Number" placeholder="XXXX XXXX XXXX" required />
                                <FormField label="Date of Birth" placeholder="dd-mm-yyyy" type="date" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Gender" type="select" placeholder="Select Gender" required options={['Male', 'Female', 'Other']} />
                                <FormField label="Blood Group" type="select" placeholder="Select Blood Group" required options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <SectionHeader title="Contact Information" />
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Contact Number 1" placeholder="+91 XXXXX XXXXX" required />
                                <FormField label="Contact Number 2" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Email ID 1" placeholder="student@college.edu" required />
                                <FormField label="Email ID 2" placeholder="student@email.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Emergency Contact Number" placeholder="+91 XXXXX XXXXX" required />
                                <FormField label="Mode of Transport" type="select" placeholder="Select Mode" required options={['Bus', 'Car', 'Two Wheeler', 'Walk', 'Hostel']} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div>
                <SectionHeader title="Address Details" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField label="Permanent Address" type="textarea" placeholder="Enter complete permanent address" required />
                    <FormField label="Local/Hostel Address" type="textarea" placeholder="Enter current residential address (hostel room number or local address)" required />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                    Save & Continue
                </button>
            </div>
        </div>
    );
}

function ParentDetails() {
    return (
        <div className="space-y-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Parent & Guardian Details</h2>
            <p className="text-sm text-gray-500 -mt-7">Complete parent/guardian information</p>

            {['Father', 'Mother', 'Guardian'].map((role) => (
                <div key={role}>
                    <SectionHeader title={`${role}'s Details`} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label={`${role}'s Name`} placeholder={`Enter ${role.toLowerCase()}'s name`} required={role !== 'Guardian'} />
                        <FormField label="Occupation" placeholder="Enter occupation" />
                        <FormField label="Contact Number" placeholder="+91 XXXXX XXXXX" required={role !== 'Guardian'} />
                    </div>
                </div>
            ))}

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                    Save & Continue
                </button>
            </div>
        </div>
    );
}

function AcademicRecords() {
    const semesters = [
        { sem: 1, spi: 8.5, cpi: 8.5 }, { sem: 2, spi: 8.8, cpi: 8.65 },
        { sem: 3, spi: 9.1, cpi: 8.8 }, { sem: 4, spi: 8.6, cpi: 8.75 },
        { sem: 5, spi: 9.3, cpi: 8.86 }, { sem: 6, spi: 8.9, cpi: 8.87 },
    ];

    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Academic Records</h2>
            <p className="text-sm text-gray-500 mb-6">Semester-wise academic performance</p>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Semester</th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">SPI</th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">CPI</th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {semesters.map((s) => (
                            <tr key={s.sem} className="hover:bg-gray-50">
                                <td className="px-6 py-3 text-sm font-medium text-gray-900">Semester {s.sem}</td>
                                <td className="px-6 py-3 text-sm text-gray-700 text-center">{s.spi.toFixed(2)}</td>
                                <td className="px-6 py-3 text-sm text-gray-700 text-center">{s.cpi.toFixed(2)}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Pass</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
                <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                    Save & Continue
                </button>
            </div>
        </div>
    );
}

function MidSemExam() {
    const subjects = [
        { name: 'Machine Learning', marks: 45, total: 50 },
        { name: 'Cloud Computing', marks: 42, total: 50 },
        { name: 'Software Engineering', marks: 48, total: 50 },
        { name: 'Web Technologies', marks: 44, total: 50 },
        { name: 'Cyber Security', marks: 42, total: 50 },
    ];

    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Mid Semester Exam Details</h2>
            <p className="text-sm text-gray-500 mb-6">Subject-wise mid-semester examination performance</p>

            <div className="space-y-6">
                <div>
                    <SectionHeader title="Note for Faculty & Students" />
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                        Mid-semester marks should be updated by the respective faculty. Students can view their marks after faculty confirmation.
                    </div>
                </div>

                <div>
                    <SectionHeader title="Examination Results" />
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Marks</th>
                                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {subjects.map((s, i) => {
                                    const pct = ((s.marks / s.total) * 100).toFixed(1);
                                    return (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700 text-center">{s.marks}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700 text-center">{s.total}</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${parseFloat(pct) >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {pct}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
                <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                    Submit Form
                </button>
            </div>
        </div>
    );
}
