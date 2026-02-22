import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentsAPI } from '../services/api';
import { User, Save } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        first_name: '', last_name: '', email_id: '', contact_no: '',
        date_of_birth: '', blood_group: '', gender: '',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.student) {
            const s = user.student;
            setForm({
                first_name: s.first_name || '',
                last_name: s.last_name || '',
                email_id: s.email_id || user.email || '',
                contact_no: s.contact_no || '',
                date_of_birth: s.date_of_birth ? s.date_of_birth.substring(0, 10) : '',
                blood_group: s.blood_group || '',
                gender: s.gender || '',
            });
            setLoading(false);
        } else {
            // If no student record, pre-fill from user
            setForm(prev => ({ ...prev, email_id: user?.email || '' }));
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        setSaved(false);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const studentId = user?.student?.student_id;
            if (studentId) {
                const updateData = { ...form };
                if (updateData.date_of_birth) {
                    updateData.date_of_birth = new Date(updateData.date_of_birth).toISOString();
                }
                await studentsAPI.update(studentId, updateData);
            }
            setSaved(true);
        } catch (err) {
            console.error('Failed to save profile:', err);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <User className="text-indigo-500" size={26} />
                        Student Profile
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                            <input name="first_name" value={form.first_name} onChange={handleChange} required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                placeholder="Enter first name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                            <input name="last_name" value={form.last_name} onChange={handleChange} required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                placeholder="Enter last name" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                            <input name="email_id" type="email" value={form.email_id} onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                placeholder="student@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <input name="contact_no" value={form.contact_no} onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                placeholder="+91 XXXXX XXXXX" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select name="blood_group" value={form.blood_group} onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white">
                                <option value="">Select Blood Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        {saved && (
                            <span className="text-sm text-green-600 font-medium">✓ Profile updated successfully</span>
                        )}
                        <button type="submit" disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-md shadow-indigo-200">
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
