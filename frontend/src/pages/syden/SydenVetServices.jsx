import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSEO } from '../../hooks/useSEO';

const statusClasses = {
  excellent: 'bg-green-100 text-green-700',
  good: 'bg-emerald-100 text-emerald-700',
  fair: 'bg-yellow-100 text-yellow-700',
  'under-treatment': 'bg-red-100 text-red-700'
};

export default function SydenVetServices() {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Veterinary Services in Kenya | Syden',
    description: 'Syden offers veterinary care, livestock health monitoring and farm support services for farmers across Kenya. Professional veterinary consultations and livestock management.',
    canonical: 'https://deleon1.onrender.com/syden/veterinary',
    ogTitle: 'Veterinary Services | Kenya',
    ogDescription: 'Professional veterinary consultations and livestock health monitoring.'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/v1/livestock');
        setLivestock(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error fetching veterinary data:', err);
        setLivestock([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const records = useMemo(() => {
    return livestock.map((item) => ({
      id: item._id,
      name: item.name,
      breed: item.breed,
      category: item.category,
      image: item.coverImage?.url || item.gallery?.[0]?.url || item.images?.[0]?.url,
      healthStatus: item.healthStatus || 'good',
      veterinaryHistory: Array.isArray(item.veterinaryHistory) ? item.veterinaryHistory : [],
      accordionSections: Array.isArray(item.accordionSections) ? item.accordionSections : []
    }));
  }, [livestock]);

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <p>Loading veterinary records...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl bg-white p-10 shadow-2xl mb-10">
          <h1 className="text-4xl font-bold mb-4">Veterinary Services</h1>
          <p className="text-gray-700 text-lg mb-8">
            Syden offers veterinary care, livestock health monitoring and agricultural support services to farmers across Kenya. Our services help maintain healthy herds and productive farms.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Veterinary Consultations', description: 'Animal health assessments and veterinary guidance for livestock.' },
              { name: 'Livestock Monitoring', description: 'Health tracking and farm record management for herds.' },
              { name: 'Farm Support', description: 'Agricultural guidance and farming assistance for producers.' }
            ].map((service) => (
              <div key={service.name} className="rounded-3xl bg-[var(--surface)] p-6">
                <h2 className="text-2xl font-semibold mb-3">{service.name}</h2>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {records.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 shadow-lg text-gray-600">
              No veterinary records are available yet.
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img src={record.image} alt={record.name} className="h-40 w-full md:w-56 object-cover rounded-2xl" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h2 className="text-2xl font-semibold">{record.name}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[record.healthStatus] || statusClasses.good}`}>
                        {record.healthStatus}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">{record.breed} • <span className="capitalize">{record.category}</span></p>

                    {record.veterinaryHistory.length > 0 ? (
                      <div className="space-y-3 mt-4">
                        {record.veterinaryHistory.slice(0, 3).map((entry, idx) => (
                          <div key={`${record.id}-${idx}`} className="rounded-2xl border border-gray-200 p-3">
                            <div className="font-semibold text-sm">{entry.procedure}</div>
                            <div className="text-xs text-gray-500">{entry.vetName || 'Syden vet team'} • {entry.date ? new Date(entry.date).toLocaleDateString() : 'No date'}</div>
                            {entry.notes && <div className="text-sm text-gray-600 mt-1">{entry.notes}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 mt-4">No vet history has been recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
