import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useSEO } from '../../hooks/useSEO';

const heroSlides = [
  {
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109801/WhatsApp_Image_2026-08-14_at_15.30.14_3.jpg',
    title: 'Fresh Produce from Kenya',
    subtitle: 'Farming, agronomical support and quality produce connections.'
  },
  {
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109796/WhatsApp_Image_2026-08-14_at_15.30.14_2.jpg',
    title: 'Farm to Market',
    subtitle: 'Supporting farmers and connecting quality produce to customers.'
  },
  {
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109794/WhatsApp_Image_2026-08-14_at_15.30.14.jpg',
    title: 'Quality & Freshness',
    subtitle: 'Direct connections between growers and buyers across Kenya.'
  }
];

const journeySteps = [
  {
    title: 'Seed Selection',
    description: 'Agronomically suitable seed varieties for Kenyan farming conditions.',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Farm Cultivation',
    description: 'Farming support and agronomical guidance for producers.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc5a3?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Harvest',
    description: 'Quality produce sourced directly from farming partners.',
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109785/WhatsApp_Image_2026-08-14_at_20.28.15.jpg'
  },
  {
    title: 'Processing',
    description: 'Careful handling to maintain produce quality.',
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788110369/WhatsApp_Image_2026-08-14_at_11.25.35.jpg'
  },
  {
    title: 'Market Connection',
    description: 'Direct delivery and customer connections for fresh produce.',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80'
  }
];

const videoCards = [
  { 
    title: 'Farm Life', 
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    video: 'https://res.cloudinary.com/gcne2xno/video/upload/v1788102313/VID-20260826-WA0004.mp4'
  },
  { 
    title: 'Harvest', 
    image: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc5a3?auto=format&fit=crop&w=900&q=80',
    video: 'https://res.cloudinary.com/gcne2xno/video/upload/v1788102313/VID-20260826-WA0004.mp4'
  },
  { 
    title: 'Delivery', 
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    video: 'https://res.cloudinary.com/gcne2xno/video/upload/v1788102313/VID-20260826-WA0004.mp4'
  }
];

const trustedCountries = [
  { name: 'Kenya', flag: '🇰🇪', volume: '3.4k tons' },
 {/*  { name: 'Uganda', flag: '🇺🇬', volume: '2.1k tons' },
  { name: 'Tanzania', flag: '🇹🇿', volume: '1.8k tons' },
  { name: 'Rwanda', flag: '🇷🇼', volume: '1.2k tons' },
  { name: 'South Africa', flag: '🇿🇦', volume: '2.9k tons' },
  { name: 'United Arab Emirates', flag: '🇦🇪', volume: '1.6k tons' } */}
];

const certificationBadges = [
  { label: 'Organic', icon: '✓' },
  { label: 'Fair Trade', icon: '★' },
  { label: 'Traceable', icon: '◎' },
  { label: 'Farm Certified', icon: '✦' }
];

const normalizeImages = (item) => {
  if (!item) return [];
  const cover = item.coverImage || null;
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const images = Array.isArray(item.images) ? item.images : [];
  const combined = [...(cover ? [cover] : []), ...gallery, ...images].filter((img) => img && (img.url || typeof img === 'string'));
  return combined
    .map((img) => (typeof img === 'string' ? { url: img } : img))
    .filter((img, index, arr) => arr.findIndex((entry) => entry.url === img.url) === index)
    .slice(0, 5);
};

export default function DeeFreshHome() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [produce, setProduce] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'DeeFresh | Fresh Produce, Farming & Agronomy Kenya',
    description: 'DeeFresh connects farmers, producers and customers with fresh produce, agronomical consulting and market connections in Kenya. Farm support and seed supplies.',
    canonical: 'https://deleon1.onrender.com/deefresh',
    ogTitle: 'DeeFresh | Fresh Produce & Farming Kenya',
    ogDescription: 'Farm to market: Fresh produce and farming solutions in Kenya.'
  });

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produceRes, farmersRes, seedsRes] = await Promise.all([
          axios.get('/api/v1/produce'),
          axios.get('/api/v1/farmers/approved'),
          axios.get('/api/v1/seeds')
        ]);

        setProduce(Array.isArray(produceRes.data?.data) ? produceRes.data.data : []);
        setFarmers(Array.isArray(farmersRes.data?.farmers) ? farmersRes.data.farmers : []);
        setSeeds(Array.isArray(seedsRes.data?.data) ? seedsRes.data.data : []);
      } catch (err) {
        console.error('Error loading DeeFresh data:', err);
        setProduce([]);
        setFarmers([]);
        setSeeds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const topProduce = useMemo(() => produce.slice(0, 4), [produce]);
  const topFarmers = useMemo(() => farmers.slice(0, 3), [farmers]);
  const topSeeds = useMemo(() => seeds.slice(0, 3), [seeds]);

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-6 text-[var(--text)] md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden rounded-[32px] bg-black shadow-2xl mb-10 min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img src={heroSlides[heroIndex].image} alt={heroSlides[heroIndex].title} className="w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex min-h-[520px] items-center px-6 py-12 md:px-10 lg:px-14">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D7F7D0] mb-4">DeeFresh</p>
              <h1 className="text-4xl font-bold text-white md:text-6xl leading-tight mb-5">{heroSlides[heroIndex].title}</h1>
              <p className="text-base text-white/80 md:text-lg mb-8">{heroSlides[heroIndex].subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/deefresh/produce" className="rounded-full bg-[#D9A441] px-8 py-4 text-[#1A1A1A] font-semibold text-center shadow-xl hover:opacity-90 transition">
                  Show produce
                </Link>
                <Link to="/deefresh/farmers" className="rounded-full border border-white/60 px-8 py-4 text-white font-semibold text-center hover:bg-white/10 transition">
                  Meet growers
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setHeroIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${index === heroIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-[28px] bg-white p-6 shadow-lg md:p-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">The Journey</p>
              <h2 className="text-3xl font-bold">From field to fork</h2>
            </div>
          </div>

          <div className="overflow-x-auto pb-3 touch-action-pan-x overflow-y-hidden">
            <div className="flex min-w-max gap-5">
              {journeySteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative w-[280px] shrink-0 overflow-hidden rounded-[28px] bg-[var(--surface)] shadow-md"
                >
                  <img src={step.image} alt={step.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="mb-2 inline-flex rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]">
                      Step {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-white/80">{step.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Fresh harvests', value: '24/7' },
            { label: 'Partner growers', value: String(farmers.length || 0) },
            { label: 'Seed varieties', value: String(seeds.length || 0) }
          ].map((stat) => (
            <div key={stat.label} className="rounded-[26px] bg-white p-6 shadow-md text-center">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Produce showcase</p>
              <h2 className="text-3xl font-bold">Fresh picks for modern living</h2>
            </div>
            <Link to="/deefresh/produce" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline">
              Browse all produce →
            </Link>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-white p-8 text-center text-gray-500">Loading produce...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {topProduce.map((item) => {
                const itemImages = normalizeImages(item);
                const mainImage = itemImages[0]?.url;
                return (
                  <Link key={item._id} to={`/deefresh/produce/${item.slug || item._id}`} className="group relative overflow-hidden rounded-[30px] bg-white p-3 shadow-lg hover:shadow-2xl transition">
                    <div className="relative overflow-hidden rounded-[22px] bg-[var(--surface)]">
                      {mainImage ? <img src={mainImage} alt={item.name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-64 flex items-center justify-center text-gray-400">No image</div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 transition group-hover:opacity-100">
                        <span className="text-sm font-medium">View details</span>
                        <span className="rounded-full bg-white/20 px-2 py-1 text-xs">Tap to explore</span>
                      </div>
                    </div>
                    <div className="p-3 pb-2">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        {item.availability ? <span className="rounded-full bg-[#D9A441]/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7A5A12]">{item.availability}</span> : null}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                      {itemImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {itemImages.slice(1, 5).map((img, idx) => (
                            <img key={`${item._id}-${idx}`} src={img.url} alt={`${item.name} ${idx + 2}`} className="h-12 w-full rounded-xl object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-10 rounded-[28px] bg-[#F7F3EA] p-6 shadow-md md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Farmer spotlights</p>
              <h2 className="text-3xl font-bold">Trusted growers behind every harvest</h2>
            </div>
            <Link to="/deefresh/farmers" className="text-sm font-semibold text-[var(--accent)] hover:underline">View directory →</Link>
          </div>

          {topFarmers.length === 0 ? (
            <div className="rounded-[22px] bg-white p-5 text-gray-500">Farmer spotlights will appear here as soon as approved growers are added.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {topFarmers.map((farmer) => {
                const profile = farmer.farmerProfile || {};
                const name = profile.farmName || farmer.username || 'Approved Farmer';
                const location = profile.farmLocation || 'Kenya';
                const photo = profile.farmPhoto?.url || null;
                const tagline = profile.farmDescription || profile.story || 'Fresh produce grown with care and consistency.';
                return (
                  <Link key={farmer._id} to="/deefresh/farmers" className="group rounded-[26px] bg-white p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 overflow-hidden rounded-[20px]">
                      {photo ? <img src={photo} alt={name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-56 items-center justify-center bg-[var(--surface)] text-sm text-gray-500">Farmer photo</div>}
                    </div>
                    <h3 className="text-2xl font-semibold mb-1">{name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{location}</p>
                    <p className="text-sm text-gray-700 leading-6">{tagline}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Certified seeds</p>
              <h2 className="text-3xl font-bold">Premium seed varieties</h2>
            </div>
            <Link to="/deefresh/seeds" className="text-sm font-semibold text-[var(--accent)] hover:underline">Explore seeds →</Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {topSeeds.map((seed) => (
              <Link key={seed._id} to="/deefresh/seeds" className="rounded-[26px] bg-white p-5 shadow-lg hover:shadow-xl transition">
                <div className="mb-4 overflow-hidden rounded-[20px]">
                  <img src={seed.coverImage?.url || seed.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80'} alt={seed.name} className="h-52 w-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold mb-1">{seed.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{seed.variety || seed.type || 'Certified seed'}</p>
                <p className="text-sm text-gray-700">{seed.description || 'High-performing seed selection for dependable harvest quality.'}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-[28px] bg-white p-6 shadow-lg md:p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Trusted across borders</p>
            <h2 className="text-3xl font-bold">Global position</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[26px] bg-[var(--surface)] p-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {trustedCountries.map((country) => (
                  <div key={country.name} className="rounded-[20px] bg-white p-4 shadow-sm">
                    <div className="text-3xl mb-2">{country.flag}</div>
                    <div className="font-semibold">{country.name}</div>
                    <div className="text-sm text-gray-500">{country.volume}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Total exports this year', value: '180.4k' },
                { label: 'Export value', value: '2.4B' },
                { label: 'Tons shipped', value: '9.2k' },
                { label: 'Happy customers', value: '4.8k' }
              ].map((stat) => (
                <div key={stat.label} className="rounded-[24px] bg-[var(--surface)] p-5 text-center">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-[28px] bg-[#F4F1EA] p-6 shadow-lg md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Sustainability</p>
              <h2 className="text-3xl font-bold">Certified for a healthier future</h2>
            </div>
            <Link to="/sustainability" className="text-sm font-semibold text-[var(--accent)] hover:underline">View full report →</Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {certificationBadges.map((badge) => (
              <div key={badge.label} className="rounded-[24px] bg-white p-5 text-center shadow-md">
                <div className="text-3xl mb-3">{badge.icon}</div>
                <div className="font-semibold">{badge.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Water saved', value: '42%' },
              { label: 'Carbon offset', value: '18.5k kg' },
              { label: 'Organic acreage', value: '3.8k ha' }
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] bg-white p-5 text-center shadow-md">
                <div className="text-3xl font-bold mb-2">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Mkulima Bora </p>
            <h2 className="text-3xl font-bold">Farm business in motion</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {videoCards.map((video) => (
              <div key={video.title} className="group relative overflow-hidden rounded-[28px] bg-black shadow-xl">
                <video 
                  className="h-72 w-full object-cover opacity-80 transition duration-500 group-hover:opacity-100"
                  poster={video.image}
                  controls
                  preload="metadata"
                >
                  <source src={video.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white pointer-events-none">
                  <div className="text-lg font-semibold">{video.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
