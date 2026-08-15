import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 'DELEON ENTERPRiSES',
    title: 'THE LAND LEGACY',
    subtitle: '15,000 acres of prime agricultural and development land',
    cta: 'Enter DELEON ENTERPRiSES →',
    link: '/DELEON ENTERPRiSES',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698444/WhatsApp_Image_2026-08-14_at_11.25.34_zkxxz8.jpg'
  },
  {
    id: 'syden',
    title: 'THE PASTORAL ART',
    subtitle: 'Where veterinary science meets generations of husbandry',
    cta: 'Enter Syden →',
    link: '/syden',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698439/WhatsApp_Image_2026-08-14_at_11.25.32_xvbhl8.jpg'
  },
  {
    id: 'deefresh',
    title: 'THE HARVEST DREAM',
    subtitle: 'Farm-to-table excellence, seed to supermarket',
    cta: 'Enter DeeFresh →',
    link: '/deefresh',
    image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1771536702/farmlink_posts/nofkjggsubvr39t3mii1.jpg'
  }
];

export default function DreamMachine() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen overflow-hidden bg-[#F2F0EB] text-[#111111]">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm uppercase tracking-[0.15em]">
          <div className="font-semibold">DELEON ENTERPRiSES Dream Machine</div>
          <div>{String(index + 1).padStart(2, '0')} / 03</div>
          <Link to="/" className="font-semibold">Close ×</Link>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="relative w-full max-w-[900px] lg:max-w-[1400px] lg:h-[80vh]">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9A96E] bg-transparent text-xl text-white transition-all duration-300 hover:scale-110 hover:bg-[rgba(201,169,110,0.1)]"
          >
            ←
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9A96E] bg-transparent text-xl text-white transition-all duration-300 hover:scale-110 hover:bg-[rgba(201,169,110,0.1)]"
          >
            →
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative mx-auto flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out" style={{ backgroundImage: `url(${slide.image})` }} />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex flex-col justify-center p-10 text-center text-white lg:p-20">
                <div className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">Episode {index + 1}</div>
                <h1 className="mt-10 text-5xl font-serif uppercase tracking-[0.15em] leading-tight lg:text-7xl">{slide.title}</h1>
                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/80 lg:max-w-2xl lg:text-lg">{slide.subtitle}</p>
                <Link to={slide.link} className="mt-10 inline-flex rounded-full border border-white px-8 py-4 text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black">
                  {slide.cta}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
