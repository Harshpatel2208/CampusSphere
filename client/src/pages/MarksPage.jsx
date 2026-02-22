import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resultsAPI } from '../services/api';
import { Award } from 'lucide-react';

export default function MarksPage() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const studentId = user?.student?.student_id;
        resultsAPI.getAll(studentId ? `student_id=${studentId}` : '')
            .then((res) => setResults(res.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user]);

    const gradeColor = (grade) => {
        if (grade === 'A+') return 'bg-green-100 text-green-700';
        if (grade === 'A') return 'bg-blue-100 text-blue-700';
        if (grade === 'B+' || grade === 'B') return 'bg-yellow-100 text-yellow-700';
        return 'bg-gray-100 text-gray-700';
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
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Award className="text-indigo-500" size={26} />
                        Semester Marks
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Mid-semester and end-semester examination results</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Marks</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Percentage</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {results.length > 0 ? results.map((r) => {
                                const pct = r.total_marks > 0 ? ((Number(r.marks_obtained) / Number(r.total_marks)) * 100).toFixed(1) : '0';
                                return (
                                    <tr key={r.result_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.subject_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{Number(r.marks_obtained)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{Number(r.total_marks)}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-center">{pct}%</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${gradeColor(r.grade)}`}>
                                                {r.grade}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">No results found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
