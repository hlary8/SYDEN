import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import HeroSlideshow from '../../components/common/HeroSlideshow';

const VideoShowcase = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="video-showcase-container">
      <video
        ref={videoRef}
        className="deleon-story-video"
        autoPlay
        muted
        loop
        playsInline
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="https://res.cloudinary.com/tmcloud1/video/upload/v1787083390/WhatsApp_Video_2026-08-18_at_22.51.16_dfqxzb.mp4" type="video/mp4" />
      </video>

      <button
        className={`video-play-overlay ${!isPlaying ? 'visible' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        type="button"
      >
        <span className="play-icon">{isPlaying ? '❚❚' : '▶'}</span>
      </button>
    </div>
  );
};

const mobileSlides = [
  {
    id: 'deleon',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698429/WhatsApp_Image_2026-08-14_at_11.25.33_r2o5fu.jpg',
    title: 'DeLeon',
    subtitle: 'Premium land stewardship' 
  },
  {
    id: 'syden',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698439/WhatsApp_Image_2026-08-14_at_11.25.32_xvbhl8.jpg',
    title: 'Syden',
    subtitle: 'Livestock excellence' 
  },
  {
    id: 'deefresh',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1771536702/farmlink_posts/nofkjggsubvr39t3mii1.jpg',
    title: 'DeeFresh',
    subtitle: 'Harvest to Markets' 
  }
];

const highlights = [
  {
    id: 1,
    category: 'LAND',
    title: '15,000+ Acres Under Management',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698429/WhatsApp_Image_2026-08-14_at_11.25.33_r2o5fu.jpg',
    link: '/deleon'
  },
  {
    id: 2,
    category: 'LEGACY',
    title: 'Sustainable Farming Since 2008',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1771536702/farmlink_posts/nofkjggsubvr39t3mii1.jpg',
    link: '/sustainability'
  },
  {
    id: 3,
    category: 'REACH',
    title: 'From Farm to Global Markets',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698435/WhatsApp_Image_2026-08-14_at_11.25.35_2_fkx7yb.jpg',
    link: '/deefresh'
  }
];

const storyGrid = [
  { id: 1, image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698444/WhatsApp_Image_2026-08-14_at_11.25.34_zkxxz8.jpg', alt: 'Harvest' },
  { id: 2, image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698439/WhatsApp_Image_2026-08-14_at_11.25.32_xvbhl8.jpg', alt: 'Livestock' },
  { id: 3, image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1771536702/farmlink_posts/nofkjggsubvr39t3mii1.jpg', alt: 'Produce' },
  { id: 4, image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698436/WhatsApp_Image_2026-08-14_at_11.25.35_l8otp4.jpg', alt: 'Community' },
  { id: 5, image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698429/WhatsApp_Image_2026-08-14_at_11.25.33_r2o5fu.jpg', alt: 'Fields' },
  { id: 6, image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698435/WhatsApp_Image_2026-08-14_at_11.25.35_2_fkx7yb.jpg', alt: 'Processing' }
];

export default function PortalHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % highlights.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % highlights.length);
  };

  const handleMobileTap = () => {
    if (window.innerWidth < 768) {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--holdings-bg)] text-[var(--holdings-text)]">
      <section className="portal-hero-section grid min-h-screen grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
        <div className="relative flex flex-col justify-between px-8 py-24 lg:px-24">
          <div className="space-y-8">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-accent)]">Cultivating Excellence</div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-[clamp(3rem,6vw,6rem)] font-serif uppercase tracking-[0.15em] leading-[0.9]">THE ART OF<br />GROWING DREAMS</h1>
              <p className="max-w-xl text-base leading-8 text-[var(--holdings-text-muted)]">From fertile soil to flourishing enterprises, DELEON ENTERPRISES crafts legacies across land, livestock, and harvest.</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/houses" className="inline-flex items-center justify-center rounded-full border border-white px-10 py-4 text-sm uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-black">
                Discover our companies →
              </Link>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <span className="block h-[2px] w-14 bg-[var(--holdings-accent)]"></span>
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--holdings-text-muted)]">Scroll</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,169,110,0.15),_transparent_35%)]" />
          <div className="relative mx-auto my-4 h-[calc(100%-2rem)] max-h-[92vh] w-[calc(100%-2rem)] overflow-hidden rounded-[30px] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] xl:my-6 xl:max-h-[90vh]">
            <HeroSlideshow />
          </div>
          <div className="hero-video-cta">
            <div className="hero-video-preview" aria-hidden="true">
              <video className="hero-video-preview-video" muted playsInline loop autoPlay preload="metadata">
                <source src="https://res.cloudinary.com/tmcloud1/video/upload/v1787084125/WhatsApp_Video_2026-08-18_at_22.51.13_nyl6pp.mp4" type="video/mp4" />
              </video>
              <div className="hero-video-play" />
            </div>
            <Link to="/about" className="hero-video-link">WATCH OUR STORY</Link>
          </div>
        </div>
      </section>

      <section className="deleon-highlights-section">
        <div className="highlights-container">
          <div
            className="highlights-slideshow touch-pan-x overflow-x-auto snap-x snap-mandatory md:overflow-visible"
            onClick={handleMobileTap}
            onMouseEnter={() => {
              if (window.innerWidth >= 1024) {
                window.clearInterval(window.__highlightsTimer);
              }
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 1024) {
                window.__highlightsTimer = window.setInterval(() => {
                  setCurrentSlide((prev) => (prev + 1) % highlights.length);
                }, 5000);
              }
            }}
          >
            {highlights.map((item, index) => (
              <div
                key={item.id}
                className={`highlight-slide ${index === currentSlide ? 'active' : ''} snap-start min-w-[85vw] md:min-w-0`}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="highlight-slide-overlay" />
                <div className="highlight-slide-content">
                  <span className="highlight-category">{item.category}</span>
                  <h3 className="highlight-title">{item.title}</h3>
                  <Link to={item.link} className="highlight-readmore" onClick={(event) => event.stopPropagation()}>
                    EXPLORE →
                  </Link>
                </div>
              </div>
            ))}

            <button type="button" className="highlight-arrow highlight-arrow-left" onClick={(event) => { event.stopPropagation(); prevSlide(); }} aria-label="Previous highlight">←</button>
            <button type="button" className="highlight-arrow highlight-arrow-right" onClick={(event) => { event.stopPropagation(); nextSlide(); }} aria-label="Next highlight">→</button>

            <div className="highlight-dots" aria-label="Highlight slides">
              {highlights.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === currentSlide ? 'active' : ''}
                  onClick={(event) => {
                    event.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="highlights-story-grid">
            <div className="story-grid-header">
              <span className="story-grid-label">LATEST STORIES</span>
              <Link to="/press" className="story-grid-link">VIEW ALL →</Link>
            </div>
            <div className="story-grid-photos">
              {storyGrid.map((story) => (
                <div key={story.id} className="story-grid-item">
                  <img src={story.image} alt={story.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F0E8] px-8 py-16 lg:py-24 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F49]">OUR COMPANIES</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {['DeLeon', 'Syden', 'DeeFresh'].map((name) => (
              <Link key={name} to={name === 'DeLeon' ? '/deleon' : name === 'Syden' ? '/syden' : '/deefresh'} className="flex h-24 w-24 items-center justify-center rounded-full border border-[#DDD] bg-white text-sm font-semibold uppercase tracking-[0.18em] text-[#111] transition duration-300 hover:scale-110 hover:shadow-2xl">
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--holdings-bg)] px-4 py-16 sm:px-6 lg:px-24 lg:py-24">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-text-muted)]">The Dream Machine</p>
              <h2 className="mt-4 text-3xl font-serif uppercase tracking-[0.12em] sm:text-4xl lg:text-5xl">A journey through our Companies</h2>
            </div>
            <Link to="/dream-machine" className="inline-flex rounded-full border border-[var(--holdings-accent)] px-8 py-4 text-sm uppercase tracking-[0.18em] text-[var(--holdings-accent)] transition-colors duration-300 hover:bg-[var(--holdings-accent)] hover:text-black">
              Explore the story
            </Link>
          </div>

          <div className="house-scroll-container md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:[&>*]:max-w-none md:[&>*]:flex-none overflow-x-auto snap-x snap-mandatory touch-pan-x">
            {[
              { brand: 'DELEON', title: 'Premium Real Estate', desc: 'Legacy land portfolios and curated estates.', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698444/WhatsApp_Image_2026-08-14_at_11.25.34_zkxxz8.jpg', href: '/history' },
              { brand: 'DeeFresh', title: 'Nature\'s Finest Harvest', desc: 'Farm-to-table freshness and premium seeds.', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698436/WhatsApp_Image_2026-08-14_at_11.25.35_l8otp4.jpg', href: '/history' },
              { brand: 'Syden', title: 'The Science of Healthy Livestock', desc: 'Veterinary excellence & pastoral heritage.', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698439/WhatsApp_Image_2026-08-14_at_11.25.32_xvbhl8.jpg', href: '/history' }
            ].map((item) => (
              <Link key={item.brand} to={item.href} className="house-scroll-card min-w-[280px] snap-start rounded-none bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2 md:min-w-0 md:p-8 md:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="h-52 md:h-64 lg:h-72 rounded-none bg-black/10 mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">{item.brand}</p>
                <h3 className="mt-4 text-2xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-4 text-sm text-gray-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[var(--holdings-border)] bg-[#0d0d0d] px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,169,110,0.08),_transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--holdings-accent)]">The DeLeon Story</p>
          <h2 className="mt-5 font-serif text-4xl text-white md:text-6xl">The DELEON Story</h2>
          <div className="mt-10 overflow-hidden rounded-none border border-[#C9A96E] bg-black/30 shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
            <VideoShowcase />
          </div>
          <p className="mt-7 text-sm italic text-white/75">Where land, life, and legacy converge.</p>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center gap-4 px-4 pb-20 pt-12 sm:px-6 lg:flex-row">
        <Link to="/sustainability" className="inline-flex items-center justify-center rounded-full border border-[#C9A96E] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#C9A96E] hover:text-[#0A0A0A] sm:px-12 sm:py-4">
          SUSTAINABILITY
        </Link>
        <Link to="/history" className="inline-flex items-center justify-center rounded-full border border-[#C9A96E] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#C9A96E] hover:text-[#0A0A0A] sm:px-12 sm:py-4">
          HISTORY
        </Link>
        <Link to="/global-presence" className="inline-flex items-center justify-center rounded-full border border-[#C9A96E] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#C9A96E] hover:text-[#0A0A0A] sm:px-12 sm:py-4">
          GLOBAL PRESENCE
        </Link>
      </div>
    </div>
  );
}
