import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentsAPI } from '../services/api';
import { FileText, Eye } from 'lucide-react';

export default function AssignmentsPage() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const studentId = user?.student?.student_id;
        assignmentsAPI.getAll(studentId ? `student_id=${studentId}` : '')
            .then((res) => setAssignments(res.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user]);

    const statusStyle = (status) => {
        switch (status) {
            case 'Submitted': return 'bg-green-100 text-green-700';
            case 'Not_Submitted': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const statusLabel = (status) => {
        switch (status) {
            case 'Submitted': return 'Completed';
            case 'Not_Submitted': return 'Pending';
            default: return status;
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
                        <FileText className="text-indigo-500" size={26} />
                        Assignments
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage course assignments and submissions</p>
                </div>
            </div>

            {assignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignments.map((a) => (
                        <div key={a.assignment_id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1 pr-2">{a.title}</h3>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle(a.submission_status)}`}>
                                    {statusLabel(a.submission_status)}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{a.description}</p>

                            <div className="mt-auto space-y-2 text-xs text-gray-500">
                                <div className="flex justify-between">
                                    <span>Faculty:</span>
                                    <span className="font-medium text-gray-700">{a.faculty?.user?.username || a.faculty?.designation || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Due Date:</span>
                                    <span className="font-medium text-gray-700">{a.due_date ? new Date(a.due_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                <Eye size={14} /> View Details
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-sm text-gray-400">
                    No assignments found
                </div>
            )}
        </div>
    );
}
