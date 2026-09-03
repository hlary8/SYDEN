import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSEO } from '../../hooks/useSEO';

export default function DeeFreshProduce() {
  useSEO({
    title: 'Fresh Produce | DeeFresh Kenya',
    description: 'Browse fresh produce from DeeFresh. Quality vegetables, fruits and produce in Kenya with direct farmer connections.',
    canonical: 'https://deleon1.onrender.com/deefresh/produce',
    ogTitle: 'Fresh Produce | DeeFresh',
    ogDescription: 'Quality fresh produce from Kenya.'
  });

  const [produce, setProduce] = useState([]);
  const [filteredProduce, setFilteredProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('featured');

  // Fetch produce from API
  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const res = await axios.get('/api/v1/produce');
        setProduce(res.data.data || []);
        setFilteredProduce(res.data.data || []);
      } catch (err) {
        console.error('Error fetching produce:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduce();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = produce.filter(item => {
      const matchesQuery = !query || 
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.origin?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || item.category?.toLowerCase() === category.toLowerCase();
      
      const matchesAvailability = !availability || item.availability?.toLowerCase() === availability.toLowerCase();
      
      return matchesQuery && matchesCategory && matchesAvailability;
    });

    // Sort results
    if (sort === 'name-asc') {
      results = results.sort((a, b) => a.name?.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      results = results.sort((a, b) => b.name?.localeCompare(a.name));
    } else if (sort === 'featured') {
      results = results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProduce(results);
  }, [query, category, availability, sort, produce]);

  const categories = [...new Set(produce.map(item => item.category).filter(Boolean))];
  const availabilityOptions = [...new Set(produce.map(item => item.availability).filter(Boolean))];

  const normalizeProduceImages = (item) => {
    if (!item) return [];
    const directImages = Array.isArray(item.images) ? item.images : [];
    const coverImage = item.coverImage || null;
    const gallery = Array.isArray(item.gallery) ? item.gallery : [];
    const combined = [
      ...(coverImage ? [coverImage] : []),
      ...gallery,
      ...directImages
    ].filter(img => img && img.url);

    return combined.filter((img, index, arr) => arr.findIndex((itemImg) => itemImg.url === img.url) === index);
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Produce Catalog</h1>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 rounded-3xl border border-neutral-300 p-6 bg-white">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search by name, description, or origin..." 
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Availability</label>
              <select 
                value={availability} 
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
              >
                <option value="">All Status</option>
                {availabilityOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
              >
                <option value="featured">Featured First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button 
            onClick={() => {
              setQuery('');
              setCategory('');
              setAvailability('');
              setSort('featured');
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-gray-600">
          {loading ? 'Loading...' : `Found ${filteredProduce.length} products`}
        </p>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading produce...</p>
          </div>
        ) : filteredProduce.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No produce found matching your criteria.</p>
            <button 
              onClick={() => {
                setQuery('');
                setCategory('');
                setAvailability('');
                setSort('featured');
              }}
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Clear Filters and Try Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {filteredProduce.map((item) => {
              const itemImages = normalizeProduceImages(item);
              return (
                <div key={item._id} className="rounded-3xl bg-white p-6 shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="h-44 rounded-3xl bg-[var(--surface)] mb-4 overflow-hidden relative">
                    {itemImages[0]?.url && (
                      <img src={itemImages[0].url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                    {item.availability && (
                      <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {item.availability}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  {item.origin && <p className="text-sm text-gray-500 mb-4">From: {item.origin}</p>}
                  <Link to={`/deefresh/produce/${item.slug}`} className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline">
                    View detail →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
