import React from 'react';

export default function GlobalPresence() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F0EB',
      color: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Airplane Hero Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '250px',
          marginBottom: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Pseudo Airplane SVG */}
          <svg
            width="280"
            height="140"
            viewBox="0 0 280 140"
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))',
              animation: 'float 6s ease-in-out infinite'
            }}
          >
            <defs>
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-15px); }
                }
              `}</style>
            </defs>
            {/* Fuselage */}
            <ellipse cx="140" cy="70" rx="90" ry="25" fill="#0A0A0A" opacity="0.85" />
            {/* Cabin Windows */}
            <circle cx="110" cy="70" r="4" fill="#C9A96E" />
            <circle cx="125" cy="70" r="4" fill="#C9A96E" />
            <circle cx="140" cy="70" r="4" fill="#C9A96E" />
            <circle cx="155" cy="70" r="4" fill="#C9A96E" />
            <circle cx="170" cy="70" r="4" fill="#C9A96E" />
            {/* Nose Cone */}
            <path d="M 230 70 L 250 65 L 250 75 Z" fill="#0A0A0A" opacity="0.9" />
            {/* Tail */}
            <path d="M 50 70 L 40 50 L 40 90 Z" fill="#C9A96E" opacity="0.8" />
            {/* Left Wing */}
            <rect x="60" y="80" width="160" height="15" fill="#0A0A0A" opacity="0.7" />
            {/* Right Wing */}
            <rect x="60" y="45" width="160" height="15" fill="#0A0A0A" opacity="0.7" />
            {/* Landing Gear */}
            <line x1="120" y1="95" x2="120" y2="110" stroke="#0A0A0A" strokeWidth="2" />
            <line x1="160" y1="95" x2="160" y2="110" stroke="#0A0A0A" strokeWidth="2" />
            <rect x="115" y="110" width="10" height="4" fill="#0A0A0A" />
            <rect x="155" y="110" width="10" height="4" fill="#0A0A0A" />
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 400,
          marginBottom: '16px',
          color: '#0A0A0A',
          lineHeight: 1.2
        }}>
          Global Presence
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '48px',
          lineHeight: 1.6,
          maxWidth: '600px',
          margin: '0 auto 48px'
        }}>
          Expanding our footprint across continents.
        </p>

        {/* Coming Soon Badge */}
        <div style={{
          display: 'inline-block',
          padding: '16px 40px',
          border: '2px solid #C9A96E',
          color: '#C9A96E',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontWeight: 600,
          marginBottom: '60px',
          borderRadius: '2px',
          backgroundColor: 'rgba(201, 169, 110, 0.05)'
        }}>
          🌍 Coming Soon
        </div>

        {/* Photo Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginTop: '80px',
          padding: '60px 0'
        }}>
          {/* Placeholder Cards for Photos */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                position: 'relative',
                paddingBottom: '100%',
                backgroundColor: '#E8E3D8',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DDD4C9';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E8E3D8';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <span style={{
                  fontSize: '48px',
                  opacity: 0.6
                }}>📸</span>
                <span style={{
                  fontSize: '12px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600
                }}>Your Photo Here</span>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{
          marginTop: '80px',
          padding: '60px 40px',
          backgroundColor: 'rgba(10, 10, 10, 0.03)',
          borderRadius: '4px',
          borderLeft: '4px solid #C9A96E'
        }}>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#555',
            textAlign: 'left'
          }}>
            DeLeon Holdings is growing its international operations across key markets. Through our subsidiaries—DeLeon Enterprises (real estate & land management), Syden (livestock & veterinary services), and DeeFresh (agricultural produce & seeds)—we're establishing a robust global network.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#555',
            textAlign: 'left',
            marginTop: '16px'
          }}>
            This section will showcase our geographical expansion, partnerships, and local initiatives. We're committed to bringing excellence in agriculture, real estate, and veterinary services to communities worldwide.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '60px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#999',
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em'
          }}>
            Interested in our global presence?
          </p>
          <a
            href="mailto:info@deleonholdings.com"
            style={{
              display: 'inline-block',
              padding: '12px 40px',
              backgroundColor: '#0A0A0A',
              color: '#F5F0EB',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.15em',
              fontWeight: 600,
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              border: '1px solid #0A0A0A'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F5F0EB';
              e.target.style.color = '#0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#0A0A0A';
              e.target.style.color = '#F5F0EB';
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
