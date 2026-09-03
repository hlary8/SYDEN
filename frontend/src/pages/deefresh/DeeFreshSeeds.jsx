import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSEO } from '../../hooks/useSEO';

export default function DeeFreshSeeds() {
  useSEO({
    title: 'F1 Seeds & Agricultural Seeds | DeeFresh',
    description: 'Browse quality F1 and agricultural seeds from DeeFresh. Seeds for farming in Kenya with agronomical support.',
    canonical: 'https://deleon1.onrender.com/deefresh/seeds',
    ogTitle: 'Seeds & Supplies | DeeFresh',
    ogDescription: 'Quality agricultural seeds for farming.'
  });

  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeed, setSelectedSeed] = useState(null);

  const getSeedGallery = (seed) => {
    const list = [];
    const sources = [
      seed.coverImage?.url,
      ...(Array.isArray(seed.images) ? seed.images.map((img) => img?.url || img).filter(Boolean) : []),
      ...(Array.isArray(seed.gallery) ? seed.gallery.map((img) => img?.url || img).filter(Boolean) : []),
      ...(Array.isArray(seed.expectedGrowthPhotos) ? seed.expectedGrowthPhotos.map((img) => img?.url || img).filter(Boolean) : []),
      ...(Array.isArray(seed.expectedYieldPhotos) ? seed.expectedYieldPhotos.map((img) => img?.url || img).filter(Boolean) : []),
      'https://images.unsplash.com/photo-1464226184884-fa52ac9fc4a5?auto=format&fit=crop&w=900&q=80'
    ];

    for (const item of sources) {
      if (!item || list.includes(item)) continue;
      list.push(item);
      if (list.length >= 6) break;
    }
    return list;
  };

  useEffect(() => {
    const fetchSeeds = async () => {
      try {
        const { data } = await axios.get('/api/v1/seeds');
        setSeeds(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error fetching seeds:', err);
        setSeeds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeeds();
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <p>Loading seeds...</p>
      </div>
    );
  }

  if (seeds.length === 0) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Premium Seeds</h1>
          <p className="text-lg text-gray-500">No seeds available yet. Check back soon!</p>
          <a href="tel:+254700330440" className="mt-6 inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black">Request Seeds</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]">Farm inputs</p>
            <h1 className="mt-3 text-4xl font-bold">Premium Seeds</h1>
          </div>
          <a href="tel:+254700330440" className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black">Request Seeds</a>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {seeds.map((seed, idx) => {
            const seedGallery = getSeedGallery(seed);
            return (
              <motion.div
                key={seed._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => setSelectedSeed({ ...seed, gallery: seedGallery })}
                  className="block w-full text-left"
                  aria-label={`View ${seed.name}`}
                >
                  <img
                    src={seedGallery[0] || 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc4a5?auto=format&fit=crop&w=900&q=80'}
                    alt={seed.name}
                    className="h-56 w-full object-cover transition duration-300 hover:scale-[1.02]"
                  />
                </button>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{seed.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">{seed.variety || 'Variety'}</span> • {seed.seedType}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {seed.countryOfOrigin && `Origin: ${seed.countryOfOrigin}`}
                  </p>
                  {seed.isCertified && (
                    <div className="inline-block bg-green-100 text-green-800 text-xs rounded-full px-3 py-1 mb-2">
                      ✓ Certified
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-3">{seed.description || 'Premium seed variety for high-yield harvests.'}</p>
                  <p className={`text-sm font-semibold mt-3 ${seed.available ? 'text-green-600' : 'text-red-600'}`}>
                    {seed.available ? '✓ In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedSeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedSeed(null)}>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute right-4 top-4 z-10 rounded-full bg-black/70 px-3 py-1 text-sm text-white" onClick={() => setSelectedSeed(null)}>Close</button>
            <img
              src={selectedSeed.gallery?.[0] || 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc4a5?auto=format&fit=crop&w=900&q=80'}
              alt={selectedSeed.name}
              className="h-[420px] w-full object-cover"
            />
            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold">{selectedSeed.name}</h2>
                <a href="tel:+254700330440" className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black">Request Seeds</a>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">{selectedSeed.description || 'Premium seed variety for high-yield harvests.'}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(selectedSeed.gallery || []).slice(0, 3).map((image, index) => (
                  <img key={`${selectedSeed._id}-${index}`} src={image} alt={`${selectedSeed.name} ${index + 1}`} className="h-32 w-full rounded-2xl object-cover" />
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#f9f3e8] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#7A5A12]">Expected growth</p>
                  <p className="mt-2 text-sm text-gray-700">Healthy early growth, vigorous foliage, and strong field establishment across the first planting cycle.</p>
                </div>
                <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#f9f3e8] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#7A5A12]">Expected yield</p>
                  <p className="mt-2 text-sm text-gray-700">Consistent, market-ready output supported by uniform emergence and dependable harvest quality.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
