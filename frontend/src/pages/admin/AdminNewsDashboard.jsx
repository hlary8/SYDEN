import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import NewsFormModal from '../../components/admin/NewsFormModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/press.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export default function AdminNewsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      // Use admin endpoint to get all articles including drafts
      const { data } = await axios.get(`${API_BASE}/news/admin/all`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      setArticles(Array.isArray(data) ? data : data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Real-time updates
  useRealtimeUpdates('news', fetchArticles, () => fetchArticles());

  // Sort articles
  const sortedArticles = [...articles].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'publishedAt' || sortBy === 'createdAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Edit article
  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowModal(true);
  };

  // Delete article
  const handleDelete = async (articleId) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_BASE}/news/${articleId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      setArticles(articles.filter(a => a._id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format number
  const formatViews = (num) => {
    if (!num) return 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-news-container" style={{ padding: '40px', minHeight: '100vh', background: '#FAFAFA' }}>
      <section className="admin-header" style={{ marginBottom: '40px', borderBottom: '1px solid #E5E5E5', paddingBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: '#0A0A0A', marginBottom: '8px' }}>News Management</h1>
        <p style={{ fontSize: '14px', color: '#333', marginBottom: '16px' }}>{articles.length} articles • {articles.filter(a => a.published).length} published</p>
      </section>

      <section className="admin-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <button 
          className="btn-new-article"
          onClick={() => {
            setEditingArticle(null);
            setShowModal(true);
          }}
          style={{ padding: '12px 32px', background: '#D4AF37', color: '#0A0A0A', border: '1px solid #D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
        >
          + NEW ARTICLE
        </button>
        <div className="sort-controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="sort-select"
            style={{ padding: '8px 12px', border: '1px solid #E5E5E5', background: 'white', cursor: 'pointer', fontSize: '13px' }}
          >
            <option value="publishedAt">Published Date</option>
            <option value="createdAt">Created Date</option>
            <option value="viewCount">Views</option>
            <option value="title">Title (A-Z)</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            style={{ padding: '8px 16px', border: '1px solid #0A0A0A', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}
          >
            {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading articles...</div>
      ) : sortedArticles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
          <p>No articles yet. Create your first article to get started.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper" style={{ background: 'white', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table className="admin-table" style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: '#F9F9F9' }}>
                <th style={{ width: '80px', padding: '16px', textAlign: 'left', color: '#0A0A0A', fontWeight: 600 }}>Cover</th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#0A0A0A', fontWeight: 600 }}>Title & Excerpt</th>
                <th style={{ width: '100px', padding: '16px', textAlign: 'left', color: '#0A0A0A', fontWeight: 600 }}>Category</th>
                <th style={{ width: '120px', padding: '16px', textAlign: 'left', color: '#0A0A0A', fontWeight: 600 }}>Published</th>
                <th style={{ width: '80px', padding: '16px', textAlign: 'center', color: '#0A0A0A', fontWeight: 600 }}>Views</th>
                <th style={{ width: '100px', padding: '16px', textAlign: 'left', color: '#0A0A0A', fontWeight: 600 }}>Status</th>
                <th style={{ width: '140px', padding: '16px', textAlign: 'center', color: '#0A0A0A', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedArticles.map((article) => (
                <tr key={article._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px 16px' }}>
                    {article.coverImage?.url ? (
                      <img 
                        src={article.coverImage.url} 
                        alt={article.title}
                        className="table-thumb"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/80x50?text=No+Image'}
                      />
                    ) : (
                      <div style={{ width: '80px', height: '50px', background: '#E5E5E5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>—</div>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#0A0A0A', marginBottom: '4px' }}>{article.title}</div>
                    <div style={{ fontSize: '13px', color: '#333' }}>{article.excerpt || 'No excerpt'}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${article.category}`}>
                      {article.category}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#333' }}>
                    {formatDate(article.publishedAt)}
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#333' }}>
                    {formatViews(article.viewCount || 0)}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${article.published ? 'published' : 'draft'}`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(article)}
                      style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #0A0A0A', color: '#0A0A0A', cursor: 'pointer', fontSize: '11px', marginRight: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(article._id)}
                      style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #C62828', color: '#C62828', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <NewsFormModal 
          article={editingArticle}
          onClose={() => {
            setShowModal(false);
            setEditingArticle(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingArticle(null);
            fetchArticles();
          }}
        />
      )}
    </div>
  );
}
