import { useCallback, useEffect, useState } from 'react';

const slides = [
  {
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788105550/IMG-20260814-WA0052.jpg',
    alt: 'DeLeon Land'
  },
  {
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698439/WhatsApp_Image_2026-08-14_at_11.25.32_xvbhl8.jpg',
    alt: 'Syden Livestock'
  },
  {
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788105550/IMG-20260814-WA0026.jpg',
    alt: 'DeeFresh Produce'
  },
  {
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698444/WhatsApp_Image_2026-08-14_at_11.25.34_zkxxz8.jpg',
    alt: 'Sustainability'
  },
  {
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698436/WhatsApp_Image_2026-08-14_at_11.25.35_l8otp4.jpg',
    alt: 'Community'
  }
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(next, 5000);
    return () => window.clearInterval(timer);
  }, [next]);

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  return (
    <div
      className="hero-slideshow"
      onClick={handleScrollDown}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleScrollDown();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Scroll to the next section"
    >
      {slides.map((slide, index) => (
        <div
          key={`${slide.alt}-${index}`}
          className={`hero-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-label={slide.alt}
          role="img"
        />
      ))}

      <div className="hero-overlay-text">
        <h1>Art of the Farm</h1>
        <p>Cultivating excellence across land, livestock, and harvest.</p>
        <button
          type="button"
          className="hero-discover-btn"
          onClick={(event) => {
            event.stopPropagation();
            handleScrollDown();
          }}
        >
          DISCOVER
        </button>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">⌄</div>
    </div>
  );
}
