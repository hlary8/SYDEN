import React, { useState, useEffect } from 'react';
import ImageUploader from '../common/ImageUploader';
import axios from 'axios';

// Use relative paths; axios baseURL is configured in src/main.jsx

export default function NewsFormModal({ article, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: null,
    images: [],
    category: 'holdings',
    tags: [],
    featured: false,
    published: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        coverImage: article.coverImage || null,
        images: article.images || [],
        category: article.category || 'holdings',
        tags: article.tags || [],
        featured: article.featured || false,
        published: article.published || false,
      });
    }
  }, [article]);

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (name === 'title') {
      setForm(f => ({
        ...f,
        [name]: value,
        slug: f.slug || generateSlug(value)
      }));
    } else if (name === 'tags') {
      setForm(f => ({
        ...f,
        tags: value.split(',').map(t => t.trim()).filter(t => t)
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleCoverImageUpload = (images) => {
    if (images && images.length > 0) {
      setForm(f => ({ ...f, coverImage: images[0] }));
    }
  };

  const handleGalleryImageUpload = (images) => {
    if (images && images.length > 0) {
      setForm(f => ({ ...f, images: [...(f.images || []), ...images] }));
    }
  };

  const removeCoverImage = () => {
    setForm(f => ({ ...f, coverImage: null }));
  };

  const removeGalleryImage = (index) => {
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!form.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }
    if (!form.excerpt.trim()) {
      setErrors({ excerpt: 'Excerpt is required' });
      return;
    }
    if (!form.content.trim()) {
      setErrors({ content: 'Content is required' });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const slug = form.slug || generateSlug(form.title);

      const payload = {
        title: form.title,
        slug: slug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        tags: form.tags,
        featured: form.featured,
        published: form.published,
        coverImage: form.coverImage,
        images: form.images,
      };

      if (article) {
        // Update
        await axios.patch(`/news/${article._id}`, payload, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
      } else {
        // Create
        await axios.post('/news', payload, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving article:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save article' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="modal-card" style={{
        background: 'white',
        borderRadius: '8px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#0A0A0A', margin: 0 }}>
            {article ? 'Edit Article' : 'New Article'}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
          >
            ✕
          </button>
        </div>

        {errors.submit && (
          <div style={{ background: '#FFE5E5', border: '1px solid #FF6B6B', color: '#C62828', padding: '12px 16px', marginBottom: '20px', borderRadius: '4px' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>
              Article Title *
            </label>
            <input 
              name="title" 
              placeholder="Enter article title"
              value={form.title} 
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
            {errors.title && <span style={{ fontSize: '12px', color: '#C62828' }}>{errors.title}</span>}
          </div>

          {/* Slug & Category (side by side) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>
                URL Slug
              </label>
              <input 
                name="slug"
                placeholder="auto-generated if empty"
                value={form.slug}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>
                Category *
              </label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="holdings">DELEON</option>
                <option value="deleon">DELEON</option>
                <option value="syden">Syden</option>
                <option value="deefresh">DeeFresh</option>
                <option value="sustainability">Sustainability</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>
              Excerpt (500 chars max) *
            </label>
            <textarea 
              name="excerpt" 
              placeholder="Short summary of the article"
              value={form.excerpt} 
              onChange={handleChange}
              maxLength={500}
              rows={3}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontSize: '15px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
            <span style={{ fontSize: '12px', color: '#999' }}>{form.excerpt.length}/500</span>
          </div>

          {/* Content */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>
              Article Content *
            </label>
            <textarea 
              name="content" 
              placeholder="Full article content (supports markdown)"
              value={form.content} 
              onChange={handleChange}
              rows={12}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontSize: '15px',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Cover Image */}
          <div style={{ marginBottom: '24px', padding: '20px', background: '#F9F9F9', borderRadius: '4px' }}>
            <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '12px' }}>
              Cover Image
            </label>
            {form.coverImage?.url ? (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img 
                  src={form.coverImage.url} 
                  alt="cover" 
                  style={{
                    maxWidth: '300px',
                    height: 'auto',
                    borderRadius: '4px',
                    display: 'block'
                  }}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'}
                />
                <button 
                  type="button"
                  onClick={removeCoverImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#C62828',
                    color: 'white',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <ImageUploader 
                onUpload={handleCoverImageUpload}
                folder="news"
              />
            )}
          </div>

          {/* Gallery Images */}
          <div style={{ marginBottom: '24px', padding: '20px', background: '#F9F9F9', borderRadius: '4px' }}>
            <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '12px' }}>
              Gallery Images (Optional)
            </label>
            <ImageUploader 
              onUpload={handleGalleryImageUpload}
              folder="news/gallery"
              multiple={true}
            />
            {form.images && form.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {form.images.map((img, i) => (
                  <div 
                    key={i}
                    style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      background: '#E5E5E5',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={img.url} 
                      alt={`gallery-${i}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/120?text=Error'}
                    />
                    <button 
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: '#C62828',
                        color: 'white',
                        border: 'none',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>
              Tags (comma separated)
            </label>
            <input 
              name="tags"
              placeholder="e.g., agriculture, technology, news"
              value={form.tags.join(', ')}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Checkboxes */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input 
                type="checkbox" 
                name="featured" 
                checked={form.featured} 
                onChange={handleChange}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              Featured Article
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input 
                type="checkbox" 
                name="published" 
                checked={form.published} 
                onChange={handleChange}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              Publish Now
            </label>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 32px',
                border: '1px solid #0A0A0A',
                background: 'transparent',
                color: '#0A0A0A',
                cursor: loading ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '12px',
                opacity: loading ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 32px',
                border: '1px solid #D4AF37',
                background: '#D4AF37',
                color: '#0A0A0A',
                cursor: loading ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '12px',
                fontWeight: 600,
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Saving...' : (article ? 'Update Article' : 'Publish Article')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
