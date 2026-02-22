const API_BASE = 'http://localhost:5001/api';

// ─── Helper ──────────────────────────────────────────────
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, message: data.message || 'Request failed', data };
    return data;
}

// ─── Auth ────────────────────────────────────────────────
export const login = (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const register = (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const getMe = () => request('/auth/me');

// ─── Generic CRUD ────────────────────────────────────────
const crud = (resource) => ({
    getAll: (query = '') => request(`/${resource}${query ? '?' + query : ''}`),
    getById: (id) => request(`/${resource}/${id}`),
    create: (body) => request(`/${resource}`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
});

// ─── Resource APIs ───────────────────────────────────────
export const usersAPI = crud('users');
export const studentsAPI = crud('students');
export const facultyAPI = crud('faculty');
export const parentsAPI = crud('parents');
export const divisionsAPI = crud('divisions');
export const attendanceAPI = crud('attendance');
export const assignmentsAPI = crud('assignments');
export const feesAPI = crud('fees');
export const resultsAPI = crud('results');
export const mentoringAPI = crud('mentoring');
export const messagesAPI = crud('messages');
export const leaveAPI = crud('leave-requests');
export const seatingAPI = crud('seating');
export const timetableAPI = crud('timetable');
