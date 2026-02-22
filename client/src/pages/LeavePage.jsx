import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaveAPI } from '../services/api';
import { CalendarDays, Send, Upload } from 'lucide-react';

export default function LeavePage() {
    const { user } = useAuth();
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ leave_type: '', start_date: '', end_date: '', reason: '' });

    const fetchLeaves = () => {
        leaveAPI.getAll(user ? `user_id=${user.user_id}` : '')
            .then((res) => setLeaveHistory(res.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchLeaves(); }, [user]);

    const handleChange = (e) => {
        setSuccess('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess('');
        try {
            await leaveAPI.create({
                user_id: user.user_id,
                start_date: new Date(form.start_date).toISOString(),
                end_date: new Date(form.end_date).toISOString(),
                reason: form.reason,
                status: 'Pending',
            });
            setSuccess('Leave request submitted successfully!');
            setForm({ leave_type: '', start_date: '', end_date: '', reason: '' });
            fetchLeaves();
        } catch (err) {
            setSuccess('Failed to submit. Please try again.');
        }
        setSubmitting(false);
    };

    const statusStyle = (s) => {
        switch (s) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <CalendarDays className="text-indigo-500" size={26} />
                        Leave Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage student leave requests and approvals</p>
                </div>
            </div>

            {/* Apply for Leave */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Apply for Leave</h2>
                <p className="text-sm text-gray-500 mb-6">Submit a new leave request to your mentor</p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left – Leave Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-2">
                                <div className="w-1 h-4 bg-indigo-500 rounded-full"></div> Leave Details
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type <span className="text-red-500">*</span></label>
                                <select name="leave_type" value={form.leave_type} onChange={handleChange} required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white">
                                    <option value="">Select leave type</option>
                                    <option value="Medical">Medical Leave</option>
                                    <option value="Personal">Personal Leave</option>
                                    <option value="Family">Family Emergency</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                                    <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                                    <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Right – Reason */}
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-2">
                                <div className="w-1 h-4 bg-indigo-500 rounded-full"></div> Reason for Leave
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Reason <span className="text-red-500">*</span></label>
                            <textarea name="reason" value={form.reason} onChange={handleChange} required rows={4}
                                placeholder="Please provide a detailed reason for your leave request. Be specific and clear..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
                            <p className="text-xs text-gray-400 mt-1">Provide complete information to help your mentor make an informed decision</p>
                        </div>
                    </div>

                    {success && (
                        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${success.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <Upload size={16} /> Upload Documents
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md shadow-indigo-200">
                            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Leave Request'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Leave History */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Leave History</h2>
                <p className="text-sm text-gray-500 mb-4">View all your leave requests and their approval status</p>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">To</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {leaveHistory.length > 0 ? leaveHistory.map((l) => (
                                <tr key={l.leave_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{l.reason}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{l.start_date ? new Date(l.start_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{l.end_date ? new Date(l.end_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(l.status)}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No leave requests yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
