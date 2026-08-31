import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

export default function FarmerApplicationsAdmin() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  if (user?.role !== 'admin') return <Navigate to='/' />;

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  async function load() {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.get('/api/v1/farmers/admin/requests', { headers: { Authorization: `Bearer ${token}` } });
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error('Load farmer requests', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    if (!confirm('Approve this farmer application?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.patch(`/api/v1/farmers/admin/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Approved');
      setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
      alert('Error approving: ' + (err.response?.data?.message || err.message));
    }
  }

  async function reject(id) {
    const reason = prompt('Rejection reason (optional)');
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`/api/v1/farmers/admin/reject/${id}`, { rejectionReason: reason }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Rejected');
      setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
      alert('Error rejecting: ' + (err.response?.data?.message || err.message));
    }
  }

  async function remove(id) {
    if (!confirm('Delete this application?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/v1/farmers/admin/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Deleted');
      setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
      alert('Error deleting: ' + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Farmer Applications</h1>
        </div>

        {loading && <p>Loading...</p>}

        <div className="grid gap-6">
          {requests.map(r => (
            <div key={r._id} className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{r.user?.username || 'Applicant'}</h3>
                  <p className="text-sm text-gray-600">{r.user?.email}</p>
                  <p className="text-sm text-gray-500">Applied: {new Date(r.requestedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(r._id)} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
                  <button onClick={() => reject(r._id)} className="px-4 py-2 bg-yellow-500 text-white rounded">Reject</button>
                  <button onClick={() => remove(r._id)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && !loading && (
          <p className="text-gray-500 mt-6">No pending applications found.</p>
        )}
      </div>
    </div>
  );
}
