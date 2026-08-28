import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function DeeFreshSeeds() {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);

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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Premium Seeds</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          {seeds.map((seed, idx) => (
            <motion.div 
              key={seed._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-3xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              {seed.coverImage?.url ? (
                <img 
                  src={seed.coverImage.url} 
                  alt={seed.name}
                  className="h-40 w-full object-cover rounded-3xl mb-4"
                />
              ) : (
                <div className="h-40 rounded-3xl bg-[var(--surface)] mb-4" />
              )}
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
