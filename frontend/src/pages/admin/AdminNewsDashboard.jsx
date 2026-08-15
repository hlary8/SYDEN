import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import NewsFormModal from '../../components/admin/NewsFormModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/press.css';
import '../../styles/press-fixes.css';
import '../../styles/admin-news.css';

// Use relative paths; axios baseURL is configured in src/main.jsx

// Placeholder SVG as data URI (no external dependencies)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="50"%3E%3Crect fill="%23E8E8E8" width="80" height="50"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';

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
      const { data } = await axios.get('/news/admin/all', {
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
      await axios.delete(`/news/${articleId}`, {
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
    <div className="admin-news-page">
      <div className="admin-news-container">
        <section className="admin-header">
          <h1>News Management</h1>
          <p>{articles.length} articles • {articles.filter(a => a.isPublished).length} published</p>
        </section>

        <section className="admin-controls">
          <button 
            className="btn-new-article"
            onClick={() => {
              setEditingArticle(null);
              setShowModal(true);
            }}
          >
            + NEW ARTICLE
          </button>
          <div className="sort-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="sort-select"
            >
              <option value="publishedAt">Published Date</option>
              <option value="createdAt">Created Date</option>
              <option value="viewCount">Views</option>
              <option value="title">Title (A-Z)</option>
            </select>
            <button 
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
            </button>
          </div>
        </section>

        {loading ? (
          <div className="admin-loading">Loading articles...</div>
        ) : sortedArticles.length === 0 ? (
          <div className="admin-empty">
            <p>No articles yet. Create your first article to get started.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="col-cover">Cover</th>
                  <th className="col-title">Title & Excerpt</th>
                  <th className="col-category">Category</th>
                  <th className="col-published">Published</th>
                  <th className="col-views">Views</th>
                  <th className="col-status">Status</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedArticles.map((article) => (
                  <tr key={article._id}>
                    <td className="cell-cover">
                      {article.coverImage?.url ? (
                        <img 
                          src={article.coverImage.url} 
                          alt={article.title}
                          className="table-thumb"
                          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                        />
                      ) : (
                        <img src={PLACEHOLDER_IMAGE} alt="No image" className="table-thumb" />
                      )}
                    </td>

                    <td className="cell-title">
                      <div className="article-title">{article.title}</div>
                      <div className="article-excerpt">{article.excerpt || 'No excerpt'}</div>
                    </td>

                    <td className="cell-category">
                      <span className="badge">{article.category}</span>
                    </td>

                    <td className="cell-published">
                      {formatDate(article.publishedAt)}
                    </td>

                    <td className="cell-views">
                      {formatViews(article.viewCount || 0)}
                    </td>

                    <td className="cell-status">
                      <span className={`badge badge-${article.isPublished ? 'published' : 'draft'}`}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="cell-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(article)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(article._id)}
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
    </div>
  );
}
