import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateFormatter';
import { LinkedInIcon, XIcon, FacebookIcon } from '../../components/common/Icons';
import '../../styles/press.css';

export default function Press() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = async (p = 1, reset = false) => {
    const params = { page: p, limit: 12 };
    if (filter !== 'all') params.category = filter;
    try {
      const { data } = await axios.get('/api/v1/news', { params });
      const list = Array.isArray(data?.articles) ? data.articles : [];

      if (reset) {
        setArticles(list);
      } else {
        setArticles((s) => [...s, ...list]);
      }

      const nextFeatured = list.find(a => a.featured) || list[0] || null;
      if (reset || !featuredArticle || !list.some(a => a._id === featuredArticle?._id)) {
        setFeaturedArticle(nextFeatured);
      }

      setHasMore(typeof data?.totalPages === 'number' ? p < data.totalPages : list.length >= params.limit);
    } catch (err) {
      console.error('Failed to load articles', err);
      if (reset) setArticles([]);
      setFeaturedArticle(null);
      setHasMore(false);
    }
  };

  useEffect(() => { load(1, true); setPage(1); }, [filter]);

  const loadMore = () => { const p = page + 1; setPage(p); load(p); };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <section className="press-header">
        <h1>News</h1>
        <p className="press-subtitle">Discover the latest from DeLeon Holdings.</p>
        <div className="press-header-actions">
          <Link to="/admin/news" className="see-all-btn">SEE ALL PRESS RELEASES</Link>
          {user?.role === 'admin' && (
            <Link to="/admin/news" className="admin-btn">+ NEW ARTICLE</Link>
          )}
        </div>
      </section>

      <main>
        {featuredArticle && (
          <section className="featured-article">
            <div className="featured-image">
              <img src={featuredArticle.coverImage?.url} alt={featuredArticle.title} />
              <div className="featured-overlay" />
            </div>
            <div className="featured-content">
              <span className="featured-label">FEATURED</span>
              <span className="article-date">{formatDate(featuredArticle.publishedAt)}</span>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.excerpt}</p>
              <Link to={`/press/${featuredArticle.slug}`} className="see-more">READ MORE →</Link>
            </div>
          </section>
        )}

        <div className="press-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'deleon' ? 'active' : ''} onClick={() => setFilter('deleon')}>DeLeon</button>
          <button className={filter === 'syden' ? 'active' : ''} onClick={() => setFilter('syden')}>Syden</button>
          <button className={filter === 'deefresh' ? 'active' : ''} onClick={() => setFilter('deefresh')}>DeeFresh</button>
          <button className={filter === 'sustainability' ? 'active' : ''} onClick={() => setFilter('sustainability')}>Sustainability</button>
        </div>

        <div className="press-grid">
          {articles.map((article, index) => (
            <article key={article._id} className={`article-card ${index % 3 === 0 ? 'large' : ''}`}>
              <Link to={`/press/${article.slug}`}>
                <div className="article-image-wrap">
                  <img src={article.coverImage?.url} alt={article.title} loading="lazy" />
                  <div className="article-image-overlay" />
                </div>
              </Link>

              <div className="article-body">
                <div className="article-meta">
                  <span className="article-category">{article.category}</span>
                  <span className="article-date">{formatDate(article.publishedAt)}</span>
                </div>

                <Link to={`/press/${article.slug}`}><h3 className="article-title">{article.title}</h3></Link>

                <p className="article-excerpt">{article.excerpt}</p>

                <div className="article-footer">
                  <Link to={`/press/${article.slug}`} className="see-more">SEE MORE</Link>
                  <div className="article-socials">
                    <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/press/' + article.slug)}`)} aria-label="Share on LinkedIn"><LinkedInIcon /></button>
                    <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/press/' + article.slug)}&text=${encodeURIComponent(article.title)}`)} aria-label="Share on X"><XIcon /></button>
                    <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/press/' + article.slug)}`)} aria-label="Share on Facebook"><FacebookIcon /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="load-more-wrap text-center mt-8">
            <button onClick={loadMore} className="load-more-btn">LOAD MORE</button>
          </div>
        )}
      </main>
    </div>
  );
}
