import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function DeeFreshFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const { data } = await axios.get('/api/v1/farmers/approved');
        setFarmers(Array.isArray(data.farmers) ? data.farmers : []);
      } catch (err) {
        console.error('Error fetching farmers:', err);
        setFarmers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <p>Loading farmers...</p>
      </div>
    );
  }

  if (farmers.length === 0) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Our Farmers</h1>
          <p className="text-lg text-gray-500">No approved farmers yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Our Farmers</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          {farmers.map((farmer, idx) => {
            const profile = farmer.farmerProfile || {};
            const farmName = profile.farmName || farmer.farmName || farmer.username || 'Approved Farmer';
            const location = profile.farmLocation || farmer.location || 'Kenya';
            const photo = profile.farmPhoto?.url || profile.farmPhoto || farmer.profilePhoto || null;
            const gallery = Array.isArray(profile.gallery) ? profile.gallery.slice(0, 3).map((img) => img.url || img).filter(Boolean) : [];
            const story = profile.story || profile.farmDescription || farmer.description || 'Sustainable farming and premium produce from our trusted growers.';
            const activities = Array.isArray(profile.activities) ? profile.activities.slice(0, 3) : [];

            return (
              <motion.div
                key={farmer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                {photo ? (
                  <img src={photo} alt={farmName} className="h-40 w-full object-cover rounded-3xl mb-4" />
                ) : (
                  <div className="h-40 rounded-3xl bg-[var(--surface)] mb-4" />
                )}

                <h2 className="text-2xl font-semibold mb-2">{farmName}</h2>
                <p className="text-sm text-gray-600 mb-2">{location}</p>
                <p className="text-sm text-gray-500 mb-4">{story}</p>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {gallery.map((img, idx) => (
                      <img key={`${farmName}-${idx}`} src={img} alt={`${farmName} gallery ${idx + 1}`} className="h-16 w-full object-cover rounded-xl" />
                    ))}
                  </div>
                )}

                {activities.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {activities.map((item, idx) => (
                      <div key={`${farmName}-activity-${idx}`} className="text-xs text-gray-600">• {item}</div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
