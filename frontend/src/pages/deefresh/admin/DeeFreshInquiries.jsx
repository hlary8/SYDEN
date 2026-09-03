import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

export default function DeeFreshInquiries() {
  const { user, accessToken } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const { data } = await axios.get('/api/v1/admin/website-concerns?type=produce_enquiry', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to load produce enquiries', err);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchInquiries();
  }, [user, accessToken]);

  const markRead = async (id) => {
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      await axios.patch(`/api/v1/admin/website-concerns/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries((prev) => prev.map((item) => item._id === id ? { ...item, status: 'read', read: true } : item));
    } catch (err) {
      console.error('Failed to mark enquiry as read', err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
          <h1 className="text-4xl font-bold mb-3">Produce Enquiries</h1>
          <p className="text-gray-600">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Produce Enquiries</h1>

        {loading ? (
          <p className="text-gray-500">Loading enquiries...</p>
        ) : inquiries.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="text-gray-500">No produce enquiries yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((item) => (
              <div key={item._id} className="rounded-3xl border border-gray-200 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{item.read ? 'Read' : 'New'} {item.enquiryType || 'produce'} enquiry from {item.name}</p>
                    <p className="mt-2 font-semibold">{item.productName || 'Produce enquiry'}</p>
                  </div>
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => markRead(item._id)}
                      className="rounded-full bg-[#FFD700] px-4 py-2 text-sm font-semibold text-[#673147]"
                    >
                      Mark as read
                    </button>
                  )}
                </div>

                <div className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Phone:</strong> {item.phone || 'Not provided'}</p>
                  <p><strong>Interest:</strong> {item.enquiryType || item.serviceType || 'Not specified'}</p>
                  <p><strong>Submitted:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                </div>

                <p className="mt-4 text-sm text-gray-600">"{item.message || item.problemDescription || 'No message provided.'}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
