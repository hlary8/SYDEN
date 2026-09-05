import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../../components/common/ImageUploader';

export default function DeeFreshProduceUpload() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', category: 'vegetables', variety: '', description: '', pricePerUnit: 0, unit: 'kg', availability: { inStock: true, quantity: 0 }, images: [], farmerSource: { name: '', location: '' } });
  const [loading, setLoading] = useState(false);

  // Admin-only check
  if (user?.role !== 'admin') return <Navigate to='/' />;

  // Load produce list
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/v1/produce');
        setItems(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        console.error('Load error', e);
        setItems([]);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('farmer')) {
      const key = name.split('.')[1];
      setForm(f => ({ ...f, farmerSource: { ...f.farmerSource, [key]: value } }));
    } else if (name.startsWith('availability')) {
      const key = name.split('.')[1];
      setForm(f => ({ ...f, availability: { ...f.availability, [key]: key === 'inStock' ? value === 'true' : parseInt(value) || 0 } }));
    } else {
      setForm(f => ({ ...f, [name]: name === 'pricePerUnit' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (editingId) {
        // Update
        const { data } = await axios.patch(`/api/v1/produce/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(items.map(i => i._id === editingId ? data.data : i));
      } else {
        // Create
        const { data } = await axios.post('/api/v1/produce', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems([data.data, ...items]);
      }
      setForm({ name: '', slug: '', category: 'vegetables', variety: '', description: '', pricePerUnit: 0, unit: 'kg', availability: { inStock: true, quantity: 0 }, images: [], farmerSource: { name: '', location: '' } });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Submit error', err);
      alert('Error saving produce: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this produce?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/v1/produce/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error('Delete error', err);
      alert('Error deleting: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Produce Manager</h1>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', slug: '', category: 'vegetables', variety: '', description: '', pricePerUnit: 0, unit: 'kg', availability: { inStock: true, quantity: 0 }, images: [], farmerSource: { name: '', location: '' } }); }} className="bg-[#FF6347] text-white px-6 py-3 rounded-full font-semibold">+ Add Produce</button>
        </div>

        {/* List */}
        <div className="grid gap-6 mb-8">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl p-6 shadow">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-gray-600">{item.variety} • {item.category}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <p className="text-sm font-semibold mt-2">KES {item.pricePerUnit} / {item.unit}</p>
                  {item.images?.length > 0 && <p className="text-xs text-green-600 mt-1">✓ {item.images.length} image(s)</p>}
                </div>
                <div className="flex gap-2 md:justify-end">
                  <button onClick={() => handleEdit(item)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Produce</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input placeholder="Produce name" name="name" value={form.name} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" required />
                <input placeholder="Slug" name="slug" value={form.slug} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4">
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                </select>
                <input placeholder="Variety" name="variety" value={form.variety} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                <textarea placeholder="Description" name="description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input placeholder="Price per unit" name="pricePerUnit" type="number" value={form.pricePerUnit} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                  <select name="unit" value={form.unit} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4">
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="unit">unit</option>
                  </select>
                </div>
                <select name="availability.inStock" value={form.availability?.inStock ? 'true' : 'false'} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4">
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
                <input placeholder="Quantity available" name="availability.quantity" type="number" value={form.availability?.quantity || 0} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />

                <div>
                  <label className="block text-sm font-semibold mb-2">Images</label>
                  <ImageUploader onUpload={(imgs) => setForm(f => ({ ...f, images: imgs || [] }))} folder="produce" multiple />
                  {form.images?.length > 0 && <p className="mt-2 text-sm text-green-600">✓ {form.images.length} image(s) ready</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input placeholder="Farmer name" name="farmer.name" value={form.farmerSource?.name || ''} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                  <input placeholder="Location" name="farmer.location" value={form.farmerSource?.location || ''} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 rounded-full bg-[#FF6347] py-4 text-white font-semibold" disabled={loading}>{loading ? 'Saving...' : 'Publish Produce'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 rounded-full bg-gray-300 py-4 text-gray-800 font-semibold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
