import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SydenLivestock() {
  const [livestock, setLivestock] = useState([]);
  const [filteredLivestock, setFilteredLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('featured');

  // Fetch livestock from API
  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        const res = await axios.get('/api/v1/livestock');
        setLivestock(res.data.data || []);
        setFilteredLivestock(res.data.data || []);
      } catch (err) {
        console.error('Error fetching livestock:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivestock();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = livestock.filter(item => {
      const matchesQuery = !query || 
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.breed?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || item.category?.toLowerCase() === category.toLowerCase();
      
      return matchesQuery && matchesCategory;
    });

    // Sort results
    if (sort === 'name-asc') {
      results = results.sort((a, b) => a.name?.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      results = results.sort((a, b) => b.name?.localeCompare(a.name));
    } else if (sort === 'featured') {
      results = results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredLivestock(results);
  }, [query, category, sort, livestock]);

  const categories = [...new Set(livestock.map(item => item.category).filter(Boolean))];

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Livestock Gallery</h1>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 rounded-3xl border border-neutral-300 p-6 bg-white">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search by name, breed, or description..." 
              className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 md:grid-cols-2">
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
              setSort('featured');
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-gray-600">
          {loading ? 'Loading...' : `Found ${filteredLivestock.length} animals`}
        </p>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading livestock...</p>
          </div>
        ) : filteredLivestock.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No livestock found matching your criteria.</p>
            <button 
              onClick={() => {
                setQuery('');
                setCategory('');
                setSort('featured');
              }}
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Clear Filters and Try Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {filteredLivestock.map((item) => (
              <div key={item._id} className="rounded-3xl bg-white p-6 shadow-lg hover:shadow-2xl transition-shadow">
                <div className="h-44 rounded-3xl bg-[var(--surface)] mb-4 overflow-hidden">
                  {item.images?.[0]?.url && (
                    <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{item.breed}</p>
                <p className="text-sm text-gray-500 mb-4">Category: {item.category}</p>
                <Link to={`/syden/livestock/${item._id}`} className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline">
                  View profile →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
