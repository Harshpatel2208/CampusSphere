import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI, resultsAPI, assignmentsAPI, leaveAPI } from '../services/api';
import {
  CalendarCheck, Award, FileText, CalendarDays,
  TrendingUp, Clock, CheckCircle, Bell,
  ArrowRight, BookOpen
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ attendance: 0, avgMarks: 0, pendingAssignments: 0, leaveCount: 0 });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = user?.student?.student_id;

    Promise.all([
      attendanceAPI.getAll(studentId ? `student_id=${studentId}` : '').catch(() => ({ data: [] })),
      resultsAPI.getAll(studentId ? `student_id=${studentId}` : '').catch(() => ({ data: [] })),
      assignmentsAPI.getAll(studentId ? `student_id=${studentId}` : '').catch(() => ({ data: [] })),
      leaveAPI.getAll(user ? `user_id=${user.user_id}` : '').catch(() => ({ data: [] })),
    ]).then(([attRes, resultsRes, assignRes, leaveRes]) => {
      const att = attRes.data || [];
      const res = resultsRes.data || [];
      const asgn = assignRes.data || [];
      const leaves = leaveRes.data || [];

      // Attendance percentage
      const present = att.filter(a => a.status === 'Present').length;
      const attendancePct = att.length > 0 ? ((present / att.length) * 100).toFixed(1) : 0;

      // Average marks percentage
      const avgMarks = res.length > 0
        ? (res.reduce((sum, r) => sum + (Number(r.marks_obtained) / Number(r.total_marks)) * 100, 0) / res.length).toFixed(1)
        : 0;

      // Pending assignments
      const pending = asgn.filter(a => a.submission_status === 'Not_Submitted').length;

      setStats({ attendance: attendancePct, avgMarks, pendingAssignments: pending, leaveCount: leaves.length });
      setRecentAssignments(asgn.slice(0, 4));
      setRecentLeaves(leaves.slice(0, 3));
      setLoading(false);
    });
  }, [user]);

  const quickActions = [
    { icon: <CalendarCheck size={24} />, label: 'View Attendance', desc: 'Subject records', path: '/attendance', color: 'bg-blue-50 text-blue-600' },
    { icon: <FileText size={24} />, label: 'Assignments', desc: `${stats.pendingAssignments} pending`, path: '/assignments', color: 'bg-purple-50 text-purple-600' },
    { icon: <Award size={24} />, label: 'View Marks', desc: 'Exam results', path: '/marks', color: 'bg-green-50 text-green-600' },
    { icon: <CalendarDays size={24} />, label: 'Apply Leave', desc: 'Quick request', path: '/leave', color: 'bg-orange-50 text-orange-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CalendarCheck size={22} />} label="Attendance" value={`${stats.attendance}%`} color="bg-blue-500" />
        <StatCard icon={<Award size={22} />} label="Average Marks" value={`${stats.avgMarks}%`} color="bg-green-500" />
        <StatCard icon={<FileText size={22} />} label="Pending Work" value={stats.pendingAssignments} badge={`${stats.pendingAssignments} due`} color="bg-purple-500" />
        <StatCard icon={<Bell size={22} />} label="Leave Requests" value={stats.leaveCount} color="bg-orange-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 text-left group"
          >
            <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{action.label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" /> Recent Assignments
          </h3>
          <div className="space-y-4">
            {recentAssignments.map((a) => (
              <div key={a.assignment_id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${a.submission_status === 'Submitted' ? 'text-green-500' : 'text-yellow-500'}`}>
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium">{a.title}</p>
                  <p className="text-xs text-gray-400">Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.submission_status === 'Submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {a.submission_status === 'Submitted' ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
            {recentAssignments.length === 0 && <p className="text-sm text-gray-400">No assignments yet</p>}
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-gray-400" /> Leave Requests
          </h3>
          <div className="space-y-3">
            {recentLeaves.map((l) => (
              <div key={l.leave_id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-8 rounded-full ${l.status === 'Approved' ? 'bg-green-400' : l.status === 'Rejected' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{l.reason || 'Leave Request'}</p>
                  <p className="text-xs text-gray-400">{l.start_date ? new Date(l.start_date).toLocaleDateString() : ''}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.status === 'Approved' ? 'bg-green-100 text-green-700' : l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {l.status}
                </span>
              </div>
            ))}
            {recentLeaves.length === 0 && <p className="text-sm text-gray-400">No leave requests yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, badge, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} bg-opacity-10 flex items-center justify-center`}>
          <span className={`${color.replace('bg-', 'text-')}`}>{icon}</span>
        </div>
        {badge && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{badge}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
