import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSEO } from '../../hooks/useSEO';

export default function DeLeonEnterprisesLands() {
  useSEO({
    title: 'Land Listings | Agricultural & Development Land Kenya',
    description: 'Browse land listings in Laikipia and Meru, Kenya. Agricultural and development opportunities with transparent pricing from DELEON.',
    canonical: 'https://deleon1.onrender.com/deleon/lands',
    ogTitle: 'Land Listings | Kenya',
    ogDescription: 'Agricultural and development land opportunities in Laikipia and Meru counties.'
  });
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('newest');

  // Fetch lands from API
  useEffect(() => {
    const fetchLands = async () => {
      try {
        const res = await axios.get('/lands');
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setLands(list);
        setFilteredLands(list);
      } catch (err) {
        console.error('Error fetching lands:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let results = lands.filter(land => {
      const locStr = land.location?.address || (typeof land.location === 'string' ? land.location : '');
      const matchesQuery = !query || 
        land.title?.toLowerCase().includes(query.toLowerCase()) ||
        land.description?.toLowerCase().includes(query.toLowerCase()) ||
        locStr.toLowerCase().includes(query.toLowerCase());
      
      const price = parseInt(land.price) || 0;
      const matchesPrice = price >= minPrice && price <= maxPrice;
      
      const locStr2 = land.location?.address || (typeof land.location === 'string' ? land.location : '');
      const matchesLocation = !location || locStr2.toLowerCase().includes(location.toLowerCase());
      
      return matchesQuery && matchesPrice && matchesLocation;
    });

    // Sort results
    if (sort === 'price-asc') {
      results = results.sort((a, b) => (parseInt(a.price) || 0) - (parseInt(b.price) || 0));
    } else if (sort === 'price-desc') {
      results = results.sort((a, b) => (parseInt(b.price) || 0) - (parseInt(a.price) || 0));
    } else if (sort === 'newest') {
      results = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredLands(results);
  }, [query, minPrice, maxPrice, location, sort, lands]);

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Land Gallery</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 rounded-3xl border border-neutral-300 p-6 bg-white">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search by title, description, or location..." 
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold mb-2">Min Price (KES)</label>
              <input 
                type="number" 
                value={minPrice} 
                onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Max Price (KES)</label>
              <input 
                type="number" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(parseInt(e.target.value) || 100000000)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Location</label>
              <input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Filter by location"
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-48 rounded-2xl border border-neutral-300 px-4 py-3"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button 
            onClick={() => {
              setQuery('');
              setMinPrice(0);
              setMaxPrice(100000000);
              setLocation('');
              setSort('newest');
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-gray-600">
          {loading ? 'Loading...' : `Found ${filteredLands.length} properties`}
        </p>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : filteredLands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
            <button 
              onClick={() => {
                setQuery('');
                setMinPrice(0);
                setMaxPrice(100000000);
                setLocation('');
                setSort('newest');
              }}
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Clear Filters and Try Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {filteredLands.map((land) => (
              <div key={land._id} className="rounded-3xl bg-white p-6 shadow-lg hover:shadow-2xl transition-shadow">
                <div className="h-40 rounded-3xl bg-[var(--surface)] mb-4 overflow-hidden">
                  {land.images?.[0]?.url && (
                    <img src={land.images[0].url} alt={land.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{land.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{land.location?.address || (typeof land.location === 'string' ? land.location : '')}</p>
                <p className="text-sm text-gray-500 mb-4">{(land.sizeAcres ?? land.size ?? '—')} acres</p>
                <p className="text-xl font-bold mb-4">{land.price ? Number(land.price).toLocaleString() : '—'}</p>
                <Link to={`/deleon/lands/${land.slug}`} className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline">
                  View details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
