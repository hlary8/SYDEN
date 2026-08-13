import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 'DELEON ENTERPRiSES',
    title: 'THE LAND LEGACY',
    subtitle: '15,000 acres of prime agricultural and development land',
    cta: 'Enter DELEON ENTERPRiSES →',
    link: '/DELEON ENTERPRiSES',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'syden',
    title: 'THE PASTORAL ART',
    subtitle: 'Where veterinary science meets generations of husbandry',
    cta: 'Enter Syden →',
    link: '/syden',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'deefresh',
    title: 'THE HARVEST DREAM',
    subtitle: 'Farm-to-table excellence, seed to supermarket',
    cta: 'Enter DeeFresh →',
    link: '/deefresh',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1400&q=80'
  }
];

export default function DreamMachine() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-[#111111] overflow-hidden">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm uppercase tracking-[0.15em]">
          <div className="font-semibold">DELEON ENTERPRiSES Dream Machine</div>
          <div>{String(index + 1).padStart(2, '0')} / 03</div>
          <Link to="/" className="font-semibold">Close ×</Link>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mx-auto flex max-w-[900px] flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 p-10 text-center text-white">
              <div className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">Episode {index + 1}</div>
              <h1 className="mt-10 text-5xl font-serif uppercase tracking-[0.15em] leading-tight">{slide.title}</h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/80">{slide.subtitle}</p>
              <Link to={slide.link} className="mt-10 inline-flex rounded-full border border-white px-8 py-4 text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black">
                {slide.cta}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="fixed bottom-10 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4">
        <button onClick={prev} className="rounded-full border border-black/20 bg-white/90 px-6 py-3 text-sm uppercase tracking-[0.12em] shadow-lg">Previous</button>
        <button onClick={next} className="rounded-full border border-black/20 bg-white/90 px-6 py-3 text-sm uppercase tracking-[0.12em] shadow-lg">Next</button>
      </div>
    </div>
  );
}
