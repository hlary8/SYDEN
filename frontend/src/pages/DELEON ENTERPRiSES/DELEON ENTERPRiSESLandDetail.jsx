import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const defaultImages = [
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1400&q=80'
];

export default function DeLeonEnterprisesLandDetail() {
  const { slug } = useParams();
  const [land, setLand] = useState(null);
  const [images, setImages] = useState(defaultImages);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const loadLand = async () => {
      if (!slug) return;
      try {
        const { data } = await axios.get(`/lands/${slug}`);
        const nextLand = data?.data || null;
        setLand(nextLand);
        const nextImages = Array.isArray(nextLand?.images) && nextLand.images.length > 0
          ? nextLand.images.map(img => img.url).filter(Boolean)
          : defaultImages;
        setImages(nextImages);
        setIndex(0);
      } catch (err) {
        console.error('Failed to load land detail', err);
        setLand(null);
        setImages(defaultImages);
      }
    };

    loadLand();
    return () => clearInterval(timerRef.current);
  }, [slug]);

  useEffect(() => {
    if (!images.length) return;
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % images.length), 6000);
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
    }
    touchStartX.current = null;
  }

  const title = land?.title || (slug ? slug.replace(/-/g, ' ') : 'Land Detail');
  const price = land?.price && land.price > 0 ? Number(land.price).toLocaleString() : null;
  const size = land?.sizeAcres ?? land?.size ?? '6.5';
  const location = land?.location?.address || 'Near Mt. Kenya’s northern face';
  const description = land?.description || 'Once part of a coffee estate, with sweeping panoramas and premium access.';

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white p-6 lg:p-10 shadow-2xl">
        <h1 className="text-3xl lg:text-5xl font-bold mb-3">{title}</h1>
        <p className="text-sm lg:text-lg text-gray-600 mb-6">{description}</p>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative">
            <div
              className="w-full h-72 lg:h-[520px] bg-black/5 flex items-center justify-center touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[index] || `slide-${index}`}
                  src={images[index]}
                  alt={`slide-${index}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full h-72 lg:h-[520px] object-cover rounded-2xl"
                  onError={(e) => { e.target.src = defaultImages[index % defaultImages.length]; }}
                />
              </AnimatePresence>
            </div>

            <button
              onClick={prev}
              aria-label="Previous"
              className="hidden lg:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 border border-black/10 shadow-lg text-xl"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="hidden lg:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 border border-black/10 shadow-lg text-xl"
            >
              ›
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <div className="space-y-4">
              {price && <div className="rounded-3xl bg-[var(--surface)] p-6">Price: <strong>{price}</strong></div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-[var(--surface)] p-6">Size: <strong>{size} acres</strong></div>
                <div className="rounded-3xl bg-[var(--surface)] p-6">Status: <strong>{land?.status || 'Available'}</strong></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-[var(--surface)] p-6">
                <h2 className="text-xl font-semibold mb-3">Location</h2>
                <p>{location}</p>
              </div>
              <div className="rounded-3xl bg-[var(--surface)] p-6">
                <h2 className="text-xl font-semibold mb-3">Narrative</h2>
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
