import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// ADDED: Gallery Lightbox Component for DeeFresh produce detail
const GalleryLightbox = ({ images, currentIndex, onClose, onNav }) => {
  if (!images || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      cursor: 'pointer'
    }} onClick={onClose}>
      <button style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '40px',
        cursor: 'pointer',
        padding: '0',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} onClick={onClose}>×</button>
      
      <div style={{
        position: 'relative',
        maxWidth: '80vw',
        maxHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} onClick={(e) => e.stopPropagation()}>
        <img src={current.url} alt={`Image ${currentIndex + 1}`} style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }} />
        
        {images.length > 1 && (
          <>
            <button style={{
              position: 'absolute',
              left: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '12px 16px',
              borderRadius: '4px',
              transition: 'background 0.3s'
            }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.4)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onClick={() => onNav(-1)}>‹</button>
            <button style={{
              position: 'absolute',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '12px 16px',
              borderRadius: '4px',
              transition: 'background 0.3s'
            }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.4)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onClick={() => onNav(1)}>›</button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          color: 'white',
          fontSize: '14px'
        }}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default function DeeFreshProduceDetail() {
  const { slug } = useParams();
  const [produce, setProduce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const allImages = produce ? normalizeProduceImages(produce) : [];

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/produce/${slug}`);
        setProduce(data.data);
        setError(null);
      } catch (err) {
        console.error('Error loading produce:', err);
        setError(err.response?.data?.message || 'Failed to load produce');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduce();
  }, [slug]);

  const handleLightboxNav = useCallback((direction) => {
    if (allImages.length <= 1) return;
    setLightboxIndex((prev) => (prev + direction + allImages.length) % allImages.length);
  }, [allImages.length]);

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading produce...</p>
        </div>
      </div>
    );
  }

  if (error || !produce) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', marginBottom: '12px' }}>
            {error || 'Produce not found'}
          </h2>
          <Link to="/deefresh/produce" style={{
            display: 'inline-block',
            padding: '12px 32px',
            backgroundColor: 'var(--holdings-accent)',
            color: 'white',
            textDecoration: 'none',
            textTransform: 'uppercase',
            fontSize: '12px',
            marginTop: '24px',
            borderRadius: '4px'
          }}>
            ← Back to Produce
          </Link>
        </div>
      </div>
    );
  }

  const farmerName = produce.farmerSource?.name || 'DeeFresh';

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]" style={{ backgroundColor: '#F5F0EB' }}>
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/deefresh/produce" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#0A0A0A',
          textDecoration: 'none',
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '32px'
        }}>
          ← Back to Produce
        </Link>

        {/* Hero & Title */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(28px, 4vw, 48px)',
          color: '#0A0A0A',
          lineHeight: 1.2,
          marginBottom: '32px',
          fontWeight: 400
        }}>
          {produce.name} {produce.variety ? `— ${produce.variety}` : ''}
        </h1>

        {allImages.length > 0 ? (
          <div style={{ marginBottom: '48px', cursor: 'pointer' }} onClick={() => setLightboxIndex(0)}>
            <img src={allImages[0].url} alt={produce.name} style={{
              width: '100%',
              aspectRatio: '16/9',
              objectFit: 'cover',
              borderRadius: '4px'
            }} />
          </div>
        ) : (
          <div style={{
            marginBottom: '48px',
            backgroundColor: '#E8E3D8',
            borderRadius: '4px',
            height: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '18px'
          }}>
            No product image available
          </div>
        )}

        {allImages.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              marginBottom: '24px',
              color: '#0A0A0A',
              fontWeight: 400
            }}>
              Photo Gallery
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {allImages.map((img, idx) => (
                <div key={`${img.url}-${idx}`} style={{
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  aspectRatio: '4/3',
                  backgroundColor: '#E8E3D8'
                }} onClick={() => setLightboxIndex(idx)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                  <img src={img.url} alt={`Gallery ${idx + 1}`} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '40px' }}>
          {/* Left: Description & Details */}
          <div>
            {produce.description && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: '#666' }}>
                  About
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#555' }}>
                  {produce.description}
                </p>
              </div>
            )}

            {/* Nutritional Info */}
            {produce.nutritionalInfo && (
              <div style={{ marginBottom: '40px', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E8E3D8' }}>
                <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', color: '#666' }}>
                  Nutritional Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                  {produce.nutritionalInfo.calories && (
                    <div>
                      <span style={{ color: '#999' }}>Calories:</span>
                      <br />
                      <strong style={{ color: '#0A0A0A' }}>{produce.nutritionalInfo.calories} kcal</strong>
                    </div>
                  )}
                  {produce.nutritionalInfo.protein && (
                    <div>
                      <span style={{ color: '#999' }}>Protein:</span>
                      <br />
                      <strong style={{ color: '#0A0A0A' }}>{produce.nutritionalInfo.protein}g</strong>
                    </div>
                  )}
                  {produce.nutritionalInfo.carbs && (
                    <div>
                      <span style={{ color: '#999' }}>Carbs:</span>
                      <br />
                      <strong style={{ color: '#0A0A0A' }}>{produce.nutritionalInfo.carbs}g</strong>
                    </div>
                  )}
                  {produce.nutritionalInfo.fiber && (
                    <div>
                      <span style={{ color: '#999' }}>Fiber:</span>
                      <br />
                      <strong style={{ color: '#0A0A0A' }}>{produce.nutritionalInfo.fiber}g</strong>
                    </div>
                  )}
                </div>
                {produce.nutritionalInfo.vitamins && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8E3D8' }}>
                    <span style={{ color: '#999', fontSize: '13px' }}>Vitamins:</span>
                    <p style={{ fontSize: '14px', color: '#0A0A0A', marginTop: '4px' }}>
                      {produce.nutritionalInfo.vitamins}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Info */}
            {(produce.seasonality || produce.storageTips) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {produce.seasonality && (
                  <div>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color: '#999' }}>
                      Seasonality
                    </h4>
                    <p style={{ fontSize: '14px', color: '#0A0A0A' }}>{produce.seasonality}</p>
                  </div>
                )}
                {produce.storageTips && (
                  <div>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color: '#999' }}>
                      Storage Tips
                    </h4>
                    <p style={{ fontSize: '14px', color: '#0A0A0A' }}>{produce.storageTips}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            {/* Price & Availability */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '4px', marginBottom: '24px', border: '1px solid #E8E3D8' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Price
                </span>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#0A0A0A', marginTop: '4px' }}>
                  ${produce.pricePerUnit.toFixed(2)}<span style={{ fontSize: '14px', fontWeight: 400, color: '#999' }}>/{produce.unit}</span>
                </div>
              </div>

              {produce.availability && (
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '2px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    backgroundColor: produce.availability.inStock ? '#E8F5E9' : '#FFEBEE',
                    color: produce.availability.inStock ? '#2E7D32' : '#C62828'
                  }}>
                    {produce.availability.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            {/* Farmer Source */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '4px', border: '1px solid #E8E3D8' }}>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: '#999' }}>
                Sourced By
              </h4>
              <p style={{ fontSize: '16px', color: '#0A0A0A', fontWeight: 500, marginBottom: '8px' }}>
                {farmerName}
              </p>
              {produce.farmerSource?.location && (
                <p style={{ fontSize: '13px', color: '#999' }}>
                  📍 {produce.farmerSource.location}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={handleLightboxNav}
        />
      )}
    </div>
  );
}

const normalizeProduceImages = (item) => {
  if (!item) return [];
  const directImages = Array.isArray(item.images) ? item.images : [];
  const coverImage = item.coverImage || null;
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const combined = [
    ...(coverImage ? [coverImage] : []),
    ...gallery,
    ...directImages
  ].filter(img => img && img.url);

  return combined.filter((img, index, arr) => arr.findIndex((itemImg) => itemImg.url === img.url) === index);
};
