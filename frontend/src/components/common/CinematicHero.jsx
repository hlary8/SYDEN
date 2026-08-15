import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CinematicHero.css';

const CinematicHero = ({
  mediaUrl,
  mediaType,
  posterUrl,
  label,
  headline,
  subheadline,
  ctas = []
}) => {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  const type = mediaType || (mediaUrl?.match(/\.(mp4|webm|ogg|mov)(\?|$)/i) ? 'video' : 'image');

  return (
    <section className="cinematic-hero">
      <div className={`hero-media-wrap ${loaded ? 'loaded' : ''}`}>
        {type === 'video' ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl}
            onLoadedData={() => setLoaded(true)}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt={headline}
            onLoad={() => setLoaded(true)}
          />
        )}

        {!loaded && posterUrl && (
          <div className="hero-loading-blur" style={{ backgroundImage: `url(${posterUrl})` }} />
        )}
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        {label && <span className="hero-label">{label}</span>}
        <h1 className="hero-headline" dangerouslySetInnerHTML={{ __html: headline }} />
        {subheadline && <p className="hero-sub">{subheadline}</p>}

        {ctas.length > 0 && (
          <div className="hero-ctas">
            {ctas.map((cta, i) => (
              <Link key={i} to={cta.to} className={`hero-cta ${cta.variant || ''}`}>
                {cta.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CinematicHero;
