import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const healthOptions = ['excellent', 'good', 'fair', 'under-treatment'];
const categoryOptions = ['cattle', 'poultry', 'goats', 'sheep', 'pigs', 'equine'];

export default function SydenAdminDashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [breedFilter, setBreedFilter] = useState('');

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const { data } = await axios.get('/api/v1/livestock');
        setAnimals(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error loading Syden inventory:', err);
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnimals();
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesCategory = categoryFilter === 'all' || animal.category === categoryFilter;
      const matchesHealth = healthFilter === 'all' || animal.healthStatus === healthFilter;
      const matchesBreed = !breedFilter || (animal.breed || '').toLowerCase().includes(breedFilter.toLowerCase());
      return matchesCategory && matchesHealth && matchesBreed;
    });
  }, [animals, categoryFilter, healthFilter, breedFilter]);

  const updateAnimal = async (id, updates) => {
    try {
      const { data } = await axios.patch(`/api/v1/livestock/${id}`, updates, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });

      setAnimals((prev) => prev.map((animal) => animal._id === id ? data.data : animal));
    } catch (err) {
      console.error('Error updating animal:', err);
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const vetRecords = useMemo(() => {
    return animals.flatMap((animal) =>
      (animal.veterinaryHistory || []).map((entry) => ({
        ...entry,
        animalName: animal.name,
        animalId: animal._id,
        category: animal.category,
        healthStatus: animal.healthStatus
      }))
    );
  }, [animals]);

  const stats = [
    { label: 'Total animals', value: animals.length },
    { label: 'Categories', value: new Set(animals.map((animal) => animal.category).filter(Boolean)).size },
    { label: 'Healthy stock', value: animals.filter((animal) => ['excellent', 'good'].includes(animal.healthStatus)).length }
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Syden Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-white p-6 shadow-lg text-center">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg mb-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Inventory</p>
              <h2 className="text-3xl font-bold">Livestock inventory manager</h2>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-2xl border border-neutral-300 px-4 py-3">
              <option value="all">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)} className="rounded-2xl border border-neutral-300 px-4 py-3">
              <option value="all">All health statuses</option>
              {healthOptions.map((health) => (
                <option key={health} value={health}>{health}</option>
              ))}
            </select>

            <input
              placeholder="Filter by breed"
              value={breedFilter}
              onChange={(e) => setBreedFilter(e.target.value)}
              className="rounded-2xl border border-neutral-300 px-4 py-3"
            />
          </div>

          {loading ? (
            <div className="text-gray-500">Loading inventory...</div>
          ) : (
            <div className="space-y-4">
              {filteredAnimals.map((animal) => (
                <div key={animal._id} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <img src={animal.coverImage?.url || animal.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'} alt={animal.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div>
                        <div className="text-xl font-semibold">{animal.name}</div>
                        <div className="text-sm text-gray-500">{animal.breed || 'Unknown breed'} • {animal.category}</div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <input
                        value={animal.name}
                        onChange={(e) => updateAnimal(animal._id, { name: e.target.value })}
                        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                      />

                      <select
                        value={animal.category}
                        onChange={(e) => updateAnimal(animal._id, { category: e.target.value })}
                        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                      >
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>

                      <select
                        value={animal.healthStatus || 'good'}
                        onChange={(e) => updateAnimal(animal._id, { healthStatus: e.target.value })}
                        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                      >
                        {healthOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Veterinary</p>
          <h2 className="text-3xl font-bold mb-6">Veterinary master log</h2>

          {vetRecords.length === 0 ? (
            <div className="text-gray-500">No veterinary records yet.</div>
          ) : (
            <div className="space-y-4">
              {vetRecords.map((record, index) => (
                <div key={`${record.animalId}-${index}`} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold">{record.animalName}</div>
                      <div className="text-sm text-gray-500">{record.category} • {record.vetName || 'Syden vet team'}</div>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${record.healthStatus === 'under-treatment' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {record.healthStatus}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    {record.procedure} • {record.date ? new Date(record.date).toLocaleDateString() : 'No date'}
                  </div>
                  {record.notes && <div className="mt-2 text-sm text-gray-600">{record.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
