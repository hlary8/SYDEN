import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../../components/common/ImageUploader';

export default function DeeFreshSeedsAdmin() {
  const { user } = useAuth();
  const [seeds, setSeeds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    seedType: 'vegetable',
    variety: '',
    description: '',
    totalBags: 0,
    countryOfOrigin: '',
    isCertified: false,
    certificationBody: '',
    coverImage: null,
    gallery: [],
    plantingInstructions: '',
    germinationDays: 0,
    daysToMaturity: 0,
    spacing: '',
    soilType: '',
    waterRequirements: '',
    sunlightRequirements: '',
    expectedYield: '',
    seedsPerBag: 0,
    packetSize: ''
  });
  const [loading, setLoading] = useState(false);

  // Admin-only check
  if (user?.role !== 'admin') return <Navigate to='/' />;

  // Load seeds list
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/v1/seeds');
        setSeeds(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        console.error('Load error', e);
        setSeeds([]);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : (name === 'totalBags' || name === 'germinationDays' || name === 'daysToMaturity' || name === 'seedsPerBag' ? parseInt(value) || 0 : value)
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      seedType: 'vegetable',
      variety: '',
      description: '',
      totalBags: 0,
      countryOfOrigin: '',
      isCertified: false,
      certificationBody: '',
      coverImage: null,
      gallery: [],
      plantingInstructions: '',
      germinationDays: 0,
      daysToMaturity: 0,
      spacing: '',
      soilType: '',
      waterRequirements: '',
      sunlightRequirements: '',
      expectedYield: '',
      seedsPerBag: 0,
      packetSize: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (editingId) {
        // Update
        const { data } = await axios.patch(`/api/v1/seeds/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSeeds(seeds.map(s => s._id === editingId ? data.data : s));
      } else {
        // Create
        const { data } = await axios.post('/api/v1/seeds', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSeeds([data.data, ...seeds]);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Submit error', err);
      alert('Error saving seed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seed) => {
    setEditingId(seed._id);
    setForm(seed);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this seed? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/v1/seeds/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSeeds(seeds.filter(s => s._id !== id));
    } catch (err) {
      console.error('Delete error', err);
      alert('Error deleting: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleIssueBags = async (id) => {
    const quantity = prompt('How many bags to issue?');
    if (!quantity || !parseInt(quantity)) return;

    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.patch(`/api/v1/seeds/${id}/issue`, 
        { quantity: parseInt(quantity) },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSeeds(seeds.map(s => s._id === id ? data.data : s));
      alert(`${quantity} bags issued successfully`);
    } catch (err) {
      alert('Error issuing bags: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Seeds Management</h1>
          <button
            onClick={() => { setShowForm(true); resetForm(); }}
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700"
          >
            + Add Seed Type
          </button>
        </div>

        {/* Seeds List */}
        <div className="grid gap-6 mb-8">
          {seeds.map(seed => (
            <div key={seed._id} className="bg-white rounded-2xl p-6 shadow">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold">{seed.name} {seed.variety && `(${seed.variety})`}</h3>
                  <p className="text-gray-600 text-sm">{seed.seedType}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Total Bags:</span>
                      <strong className="block">{seed.totalBags}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Bags Remaining:</span>
                      <strong className="block text-green-600">{seed.bagsRemaining}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Issued:</span>
                      <strong className="block">{seed.bagsIssued}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <strong className={`block text-sm ${seed.available ? 'text-green-600' : 'text-red-600'}`}>
                        {seed.available ? '✓ Available' : '✗ Out of Stock'}
                      </strong>
                    </div>
                  </div>
                  {seed.isCertified && (
                    <p className="text-xs text-green-600 mt-2">🏅 Certified: {seed.certificationBody}</p>
                  )}
                  {seed.countryOfOrigin && (
                    <p className="text-xs text-gray-500 mt-1">Origin: {seed.countryOfOrigin}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(seed)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleIssueBags(seed._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600"
                  >
                    Issue Bags
                  </button>
                  <button
                    onClick={() => handleDelete(seed._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Seed Type</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Seed Name *</label>
                  <input
                    placeholder="e.g., Tomato Seed"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Seed Type *</label>
                    <select
                      name="seedType"
                      value={form.seedType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    >
                      <option value="vegetable">Vegetable</option>
                      <option value="fruit">Fruit</option>
                      <option value="herb">Herb</option>
                      <option value="grain">Grain</option>
                      <option value="legume">Legume</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Variety</label>
                    <input
                      placeholder="e.g., Hybrid F1"
                      name="variety"
                      value={form.variety}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Total Bags *</label>
                    <input
                      type="number"
                      name="totalBags"
                      value={form.totalBags}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Country of Origin</label>
                    <input
                      placeholder="e.g., Kenya, Netherlands"
                      name="countryOfOrigin"
                      value={form.countryOfOrigin}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                  </div>
                </div>

                {/* Certification */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isCertified"
                      checked={form.isCertified}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Certified Seeds</span>
                  </label>
                  {form.isCertified && (
                    <input
                      placeholder="Certification body"
                      name="certificationBody"
                      value={form.certificationBody}
                      onChange={handleChange}
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm"
                    />
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    placeholder="Describe the seed variety..."
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                  />
                </div>

                {/* Growing Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Growing Information</h3>
                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Germination Days</label>
                        <input
                          type="number"
                          name="germinationDays"
                          value={form.germinationDays}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 px-4 py-2"
                          placeholder="e.g., 7"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Days to Maturity</label>
                        <input
                          type="number"
                          name="daysToMaturity"
                          value={form.daysToMaturity}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 px-4 py-2"
                          placeholder="e.g., 60"
                        />
                      </div>
                    </div>
                    <input
                      placeholder="Spacing (e.g., '6 inches apart')"
                      name="spacing"
                      value={form.spacing}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                    <input
                      placeholder="Soil type (e.g., 'Well-drained, loamy')"
                      name="soilType"
                      value={form.soilType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                    <input
                      placeholder="Water requirements (e.g., 'Regular watering')"
                      name="waterRequirements"
                      value={form.waterRequirements}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                    <input
                      placeholder="Sunlight requirements (e.g., 'Full sun')"
                      name="sunlightRequirements"
                      value={form.sunlightRequirements}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                  </div>
                </div>

                {/* Yield & Characteristics */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Yield & Characteristics</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      placeholder="Expected yield"
                      name="expectedYield"
                      value={form.expectedYield}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                    <input
                      placeholder="Packet size (e.g., '50g')"
                      name="packetSize"
                      value={form.packetSize}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-2">Seeds Per Bag</label>
                    <input
                      type="number"
                      name="seedsPerBag"
                      value={form.seedsPerBag}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2"
                      placeholder="e.g., 1000"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-semibold mb-2">Seed Photos (up to 5)</label>
                  <ImageUploader
                    onUpload={(imgs) => setForm(f => ({ ...f, gallery: imgs || [] }))}
                    folder="seeds"
                    multiple
                  />
                  {form.gallery?.length > 0 && (
                    <p className="mt-2 text-sm text-green-600">✓ {form.gallery.length} photo(s) ready</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-4 border-t pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-full bg-green-600 py-3 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Seed'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="flex-1 rounded-full bg-gray-300 py-3 text-gray-800 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
