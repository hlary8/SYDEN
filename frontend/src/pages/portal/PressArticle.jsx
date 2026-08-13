import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../../utils/dateFormatter';
import { shareOnLinkedIn, shareOnX, shareOnFacebook, copyLink } from '../../utils/share';
import '../../styles/press.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export default function PressArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_BASE}/news/${slug}`);
        setArticle(data);
        
        // Load related articles
        if (data.category) {
          try {
            const rel = await axios.get(`${API_BASE}/news`, { 
              params: { category: data.category, limit: 3 } 
            });
            if (rel.data.articles) {
              setRelated(rel.data.articles.filter(a => a._id !== data._id).slice(0, 3));
            }
          } catch (e) {
            console.error('Error loading related articles:', e);
          }
        }
      } catch (err) {
        console.error('Error loading article:', err);
        setError(err.response?.status === 404 ? 'Article not found' : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const handleShare = (platform) => {
    if (!article) return;
    
    const handlers = {
      linkedin: () => shareOnLinkedIn(article),
      x: () => shareOnX(article),
      facebook: () => shareOnFacebook(article),
      copy: () => {
        copyLink(article);
        alert('✓ Link copied to clipboard');
      }
    };
    
    handlers[platform]?.();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#888' }}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', marginBottom: '12px', color: '#0A0A0A' }}>
            {error || 'Article not found'}
          </h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/press" 
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              border: '1px solid #0A0A0A',
              color: '#0A0A0A',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.1em',
              transition: 'all 0.3s'
            }}
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(article.coverImage ? [article.coverImage] : []),
    ...(article.gallery || [])
  ];

  return (
    <div className="press-article-container" style={{ paddingTop: '40px' }}>
      {/* Back Link */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', marginBottom: '32px' }}>
        <Link 
          to="/press" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#0A0A0A',
            textDecoration: 'none',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#C9A96E'}
          onMouseLeave={(e) => e.target.style.color = '#0A0A0A'}
        >
          ← BACK TO PRESS
        </Link>
      </div>

      <article className="press-article" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', paddingBottom: '80px' }}>
        {/* Category & Meta */}
        <header className="article-header">
          <span className={`badge ${article.category}`} style={{ marginBottom: '16px', display: 'inline-block' }}>
            {article.category}
          </span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: '#0A0A0A',
            lineHeight: 1.2,
            margin: '16px 0',
            fontWeight: 400
          }}>
            {article.title}
          </h1>
          
          <div className="article-meta-bar" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '24px',
            fontSize: '13px',
            color: '#888',
            flexWrap: 'wrap',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E5E5'
          }}>
            <span>{formatDate(article.publishedAt)}</span>
            {article.author && <span>By {article.author.username}</span>}
            <span>{article.viewCount || 0} views</span>
            {article.tags && article.tags.length > 0 && (
              <span>{article.tags.join(', ')}</span>
            )}
          </div>
        </header>

        {/* Hero Image */}
        {article.coverImage?.url && (
          <div className="article-hero-image" style={{ marginTop: '40px', marginBottom: '40px' }}>
            <img 
              src={article.coverImage.url} 
              alt={article.coverImage.caption || article.title}
              style={{
                width: '100%',
                aspectRatio: '21/9',
                objectFit: 'cover',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => setLightboxImage(article.coverImage)}
              onError={(e) => e.target.style.display = 'none'}
            />
            {article.coverImage.caption && (
              <figcaption style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#999',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                {article.coverImage.caption}
              </figcaption>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="article-content" style={{
          fontSize: '17px',
          lineHeight: 1.8,
          color: '#333',
          marginBottom: '40px'
        }}>
          {/* Render as plain text with line breaks - safer than dangerouslySetInnerHTML */}
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '24px' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Gallery */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="article-gallery" style={{ marginTop: '60px', marginBottom: '60px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px',
              color: '#0A0A0A',
              marginBottom: '24px',
              fontWeight: 400
            }}>
              Gallery
            </h2>
            <div className="gallery-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px'
            }}>
              {article.gallery.map((img, i) => (
                <figure 
                  key={i}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    aspect: '1'
                  }}
                  onClick={() => setLightboxImage(img)}
                >
                  <img 
                    src={img.url} 
                    alt={img.caption || `Gallery image ${i + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Image+Error'}
                  />
                  {img.caption && (
                    <figcaption style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '12px',
                      fontSize: '12px'
                    }}>
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Share Bar */}
        <div className="article-share-bar" style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '16px',
          padding: '24px 0',
          borderTop: '1px solid #E5E5E5',
          borderBottom: '1px solid #E5E5E5',
          marginBottom: '60px'
        }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}>
            Share:
          </span>
          <button 
            onClick={() => handleShare('linkedin')}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #E5E5E5',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'all 0.3s',
              fontSize: '14px'
            }}
            title="Share on LinkedIn"
          >
            in
          </button>
          <button 
            onClick={() => handleShare('x')}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #E5E5E5',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'all 0.3s',
              fontSize: '16px'
            }}
            title="Share on X (Twitter)"
          >
            𝕏
          </button>
          <button 
            onClick={() => handleShare('facebook')}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #E5E5E5',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'all 0.3s',
              fontSize: '14px'
            }}
            title="Share on Facebook"
          >
            f
          </button>
          <button 
            onClick={() => handleShare('copy')}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #E5E5E5',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'all 0.3s',
              fontSize: '14px'
            }}
            title="Copy link"
          >
            🔗
          </button>
        </div>

        {/* Related Articles */}
        {related && related.length > 0 && (
          <div className="related-articles" style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #E5E5E5' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px',
              color: '#0A0A0A',
              marginBottom: '32px',
              fontWeight: 400,
              textAlign: 'center'
            }}>
              Related Articles
            </h2>
            <div className="related-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px'
            }}>
              {related.map(article => (
                <Link 
                  key={article._id}
                  to={`/press/${article.slug}`}
                  className="related-card"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    background: '#F5F0EB',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {article.coverImage?.url && (
                    <div style={{ overflow: 'hidden', aspectRatio: '16/10' }}>
                      <img 
                        src={article.coverImage.url} 
                        alt={article.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'}
                      />
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C9A96E', marginBottom: '8px' }}>
                      {article.category}
                    </div>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '18px',
                      color: '#0A0A0A',
                      lineHeight: 1.3,
                      margin: '0 0 8px 0'
                    }}>
                      {article.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#888',
                      margin: 0
                    }}>
                      {formatDate(article.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.caption}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
