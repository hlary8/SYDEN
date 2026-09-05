import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '../../hooks/useSEO';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
    title: 'Syden — Veterinary Services & Livestock',
    subtitle: 'Professional animal health care and farm support across Kenya.'
  },
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    title: 'Livestock Health & Management',
    subtitle: 'Comprehensive veterinary care and farm services for productive herds.'
  },
  {
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    title: 'Agricultural Solutions',
    subtitle: 'Veterinary expertise, livestock support and farming guidance.'
  }
];

const farmMoments = [
  { title: 'Morning pasture checks', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80' },
  { title: 'Feeding and nutrition', image: 'https://images.unsplash.com/photo-1532712938310-34cbec9d4e0a?auto=format&fit=crop&w=900&q=80' },
  { title: 'Veterinary care', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80' },
  { title: 'Milk collection', image: 'https://images.unsplash.com/photo-1559742811-b6a0da1d97c7?auto=format&fit=crop&w=900&q=80' }
];

export default function SydenHome() {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useSEO({
    title: 'Syden | Veterinary Services, Livestock & Agricultural Solutions Kenya',
    description: 'Syden provides veterinary services, livestock management and agricultural solutions for farmers and producers in Kenya. Professional animal health care and farm support.',
    canonical: 'https://deleon1.onrender.com/syden',
    ogTitle: 'Syden | Veterinary Services & Livestock Kenya',
    ogDescription: 'Professional animal health care, livestock management and farm support services in Kenya.'
  });

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        const { data } = await axios.get('/api/v1/livestock');
        setLivestock(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error fetching livestock:', err);
        setLivestock([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLivestock();
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(livestock.map((item) => item.category).filter(Boolean))];
    return unique.length ? unique : ['cattle', 'poultry', 'goats', 'sheep'];
  }, [livestock]);

  const featuredAnimals = useMemo(() => livestock.filter((item) => item.isFeatured || item.coverImage?.url || item.gallery?.length).slice(0, 4), [livestock]);
  const healthyCount = useMemo(() => livestock.filter((item) => ['excellent', 'good'].includes(item.healthStatus)).length, [livestock]);

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-6 text-[var(--text)] md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden rounded-[32px] bg-black shadow-2xl mb-10 min-h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img src={heroSlides[heroIndex].image} alt={heroSlides[heroIndex].title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex min-h-[560px] items-end px-6 pb-12 pt-16 md:px-10 lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F4E7C6] mb-4">Syden</p>
              <h1 className="text-4xl font-bold text-white md:text-6xl leading-tight mb-5">
                {heroSlides[heroIndex].title}
              </h1>
              <p className="text-base text-white/80 md:text-lg mb-8 max-w-xl">
                {heroSlides[heroIndex].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#meet-our-livestock" className="rounded-full bg-[#D9A441] px-8 py-4 text-[#171717] font-semibold text-center shadow-xl hover:opacity-90 transition">
                  View Our Animals
                </a>
                <Link to="/syden/veterinary" className="rounded-full border border-white/60 px-8 py-4 text-white font-semibold text-center hover:bg-white/10 transition">
                  Veterinary Services
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => setHeroIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${index === heroIndex ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Animals', value: String(livestock.length || 0) },
            { label: 'Healthy Stock', value: String(healthyCount || 0) },
            { label: 'Breeds', value: String(new Set(livestock.map((animal) => animal.breed).filter(Boolean)).size || 0) },
            { label: 'Vet Checks This Month', value: String(livestock.reduce((count, animal) => count + (Array.isArray(animal.veterinaryHistory) ? animal.veterinaryHistory.length : 0), 0)) }
          ].map((stat) => (
            <div key={stat.label} className="rounded-[26px] bg-white p-5 shadow-lg text-center">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </section>

        <section id="meet-our-livestock" className="mb-10 rounded-[28px] bg-white p-6 shadow-lg md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Meet our livestock</p>
              {/* <h2 className="text-3xl font-bold">The Living Gallery</h2> */}
            </div>
            <Link to="/syden/livestock" className="text-sm font-semibold text-[var(--accent)] hover:underline">View all animals →</Link>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {['all', ...categories].map((category) => (
              <Link
                key={category}
                to={category === 'all' ? '/syden/livestock' : `/syden/livestock?category=${encodeURIComponent(category)}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${category === 'all' ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--primary)]' : 'border-neutral-300 bg-white text-[var(--text)] hover:border-[var(--accent)]'}`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredAnimals.map((animal) => (
              <Link key={animal._id} to={`/syden/livestock/${animal._id}`} className="group relative overflow-hidden rounded-[28px] bg-[var(--surface)] shadow-md transition hover:shadow-xl">
                <div className="relative overflow-hidden">
                  <img
                    src={animal.coverImage?.url || animal.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'}
                    alt={animal.name}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 transition group-hover:opacity-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">View Profile</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold">{animal.name}</h3>
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${animal.healthStatus === 'under-treatment' ? 'bg-red-500' : animal.healthStatus === 'fair' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#D9A441]/15 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-[#7A5A12]">{animal.breed || 'Breed'}</span>
                    <span className="rounded-full bg-[#E8DCC0]/70 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-[#3B2F1F] capitalize">{animal.category}</span>
                  </div>
                  <div className="text-sm text-gray-600">{animal.age || 'Age available'} • {animal.weight || 'Weight available'}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 overflow-hidden rounded-[28px] bg-[#F3EFE7] p-6 shadow-lg md:p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Farm life</p>
           {/*  <h2 className="text-3xl font-bold">From our pastures to diet</h2>*/}
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {farmMoments.map((moment) => (
              <div key={moment.title} className="overflow-hidden rounded-[24px] bg-white shadow-md">
                <img src={moment.image} alt={moment.title} className="h-48 w-full object-cover" />
                <div className="p-4 text-sm font-medium text-gray-700">{moment.title}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-[28px] bg-white p-6 shadow-lg md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Breeding program</p>
              <h2 className="text-3xl font-bold">Breeding excellence</h2>
            </div>
            <Link to="/syden/livestock" className="text-sm font-semibold text-[var(--accent)] hover:underline">View all animals →</Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredAnimals.slice(0, 3).map((animal) => (
              <div key={`${animal._id}-breeding`} className="rounded-[24px] bg-[var(--surface)] p-4 shadow-md">
                <img src={animal.coverImage?.url || animal.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'} alt={animal.name} className="h-44 w-full object-cover rounded-[18px] mb-4" />
                <h3 className="text-2xl font-semibold mb-1">{animal.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{animal.breed || 'Pure breed'} lineage</p>
                <p className="text-sm text-gray-700">{animal.description || 'Strong lineage, robust health, and excellent farm suitability.'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-[28px] bg-[#1E1C1A] p-6 text-white shadow-lg md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#F4E7C6] mb-2">Animal health first</p>
              <h2 className="text-3xl font-bold">Veterinary hub preview</h2>
            </div>
            <Link to="/syden/veterinary" className="text-sm font-semibold text-[#F4E7C6] hover:underline">View full health records →</Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredAnimals.slice(0, 3).map((animal) => (
              <div key={`${animal._id}-health`} className="rounded-[22px] bg-white/5 p-4 border border-white/10">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{animal.name}</h3>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] ${animal.healthStatus === 'under-treatment' ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                    {animal.healthStatus || 'good'}
                  </span>
                </div>
                <p className="text-sm text-white/70">Last vaccination: {animal.veterinaryHistory?.[0]?.date ? new Date(animal.veterinaryHistory[0].date).toLocaleDateString() : 'Newly added'}</p>
                <p className="text-sm text-white/70 mt-2">Medicine: {animal.veterinaryHistory?.[0]?.procedure || 'Routine check'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="relative rounded-[28px] overflow-hidden bg-black shadow-2xl">
            <h2 className="absolute top-6 left-6 right-6 text-2xl lg:text-3xl font-bold text-white z-10">Syden in Action</h2>
            <video 
              className="w-full h-72 lg:h-96 object-cover"
              controls
              poster="https://res.cloudinary.com/gcne2xno/image/upload/v1788102143/IMG-20260814-WA0082.jpg"
              preload="metadata"
            >
              <source 
                src="https://res.cloudinary.com/gcne2xno/video/upload/v1788514886/WhatsApp_Video_2026-08-26_at_12.40.17.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        </section>

        <section className="mb-10 text-center">
          <a
            href="mailto:sydencompanylimited@gmail.com?subject=Emergency%20Veterinary%20Care"
            className="inline-block rounded-full bg-red-600 px-10 py-4 text-white font-semibold shadow-lg hover:bg-red-700 transition pulse"
          >
            Emergency? Contact Our Veterinary Team
          </a>
        </section>
      </div>
    </div>
  );
}
