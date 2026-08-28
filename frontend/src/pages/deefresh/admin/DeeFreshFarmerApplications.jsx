import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

export default function DeeFreshFarmerApplications() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Admin-only check
  if (user?.role !== 'admin') return <Navigate to='/' />;

  // Load farmer requests
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/farmers/admin/requests?status=${filter}`);
        setRequests(Array.isArray(data.requests) ? data.requests : []);
      } catch (err) {
        console.error('Error loading requests:', err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  const handleApprove = async (requestId) => {
    if (!confirm('Approve this farmer application?')) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`/api/v1/farmers/admin/approve/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(r => r._id !== requestId));
      alert('Farmer approved successfully!');
    } catch (err) {
      alert('Error approving: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setProcessing(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`/api/v1/farmers/admin/reject/${requestId}`, 
        { rejectionReason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setRequests(requests.filter(r => r._id !== requestId));
      setSelectedRequest(null);
      setRejectionReason('');
      alert('Application rejected');
    } catch (err) {
      alert('Error rejecting: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (!confirm('Delete this farmer request?')) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/v1/farmers/admin/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(r => r._id !== requestId));
      alert('Request deleted');
    } catch (err) {
      alert('Error deleting: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <p>Loading farmer applications...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Farmer Applications</h1>

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-4">
          {['pending', 'approved', 'rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => { setFilter(status); setSelectedRequest(null); }}
              className={`px-6 py-3 rounded-full font-semibold capitalize transition ${
                filter === status
                  ? 'bg-[#FF6347] text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
            No farmer applications found with status "{filter}"
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map(request => (
              <div key={request._id} className="bg-white rounded-2xl p-6 shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{request.user?.username || 'Unknown User'}</h3>
                    <p className="text-sm text-gray-600">Email: {request.user?.email}</p>
                    <p className="text-sm text-gray-600">Farm: {request.farmName || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Location: {request.location || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Phone: {request.contactPhone || 'Not provided'}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Applied: {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${
                      request.status === 'pending' ? 'text-yellow-600' :
                      request.status === 'approved' ? 'text-green-600' :
                      request.status === 'rejected' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      Status: {request.status.toUpperCase()}
                    </p>
                    {request.rejectionReason && (
                      <p className="text-xs text-red-600 mt-2">Reason: {request.rejectionReason}</p>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 flex-col">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={processing}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 disabled:opacity-50"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => setSelectedRequest(selectedRequest === request._id ? null : request._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Rejection Reason Input */}
                {selectedRequest === request._id && request.status === 'pending' && (
                  <div className="mt-4 border-t pt-4">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="w-full p-3 border rounded-lg text-sm resize-none"
                      rows="3"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleReject(request._id)}
                        disabled={processing || !rejectionReason.trim()}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => { setSelectedRequest(null); setRejectionReason(''); }}
                        className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
