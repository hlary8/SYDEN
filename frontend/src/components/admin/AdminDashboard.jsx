import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export function AdminDashboard() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/v1/admin/stats', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [accessToken]);

  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/v1/admin/comments', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setComments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  useEffect(() => {
    if (tab === 'comments') {
      fetchComments();
    }
  }, [tab, accessToken]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-playfair mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {['stats', 'comments', 'users', 'inquiries'].map((t) => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              tab === t
                ? 'bg-deleon-gold text-deleon-dark'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Stats Grid */}
      {tab === 'stats' && stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: 'Land Listings', value: stats.lands },
            { label: 'Comments', value: stats.comments },
            { label: 'Users', value: stats.users },
            { label: 'Inquiries', value: stats.inquiries },
            { label: 'Produce Orders', value: stats.produceOrders }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-deleon-gold to-deleon-dark text-white p-6 rounded-xl shadow-lg"
            >
              <p className="text-sm opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value.toLocaleString()}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Comments Moderation */}
      {tab === 'comments' && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-deleon-gold"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm text-gray-600">
                    {comment.author?.username}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="text-xs px-3 py-1"
                  onClick={async () => {
                    await axios.delete(`/api/v1/admin/comments/${comment._id}`, {
                      headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    fetchComments();
                  }}
                >
                  Delete
                </Button>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
