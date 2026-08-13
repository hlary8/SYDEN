import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../../components/common/ImageUploader';

export default function SydenLivestockUpload() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', breed: '', age: '', category: 'cattle', description: '', careInstructions: '', images: [], isFeatured: false });
  const [loading, setLoading] = useState(false);

  // Admin-only check
  if (user?.role !== 'admin') return <Navigate to='/' />;

  // Load livestock list
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/v1/livestock');
        setItems(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        console.error('Load error', e);
        setItems([]);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (editingId) {
        // Update
        const { data } = await axios.patch(`/api/v1/livestock/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(items.map(i => i._id === editingId ? data.data : i));
      } else {
        // Create
        const { data } = await axios.post('/api/v1/livestock', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems([data.data, ...items]);
      }
      setForm({ name: '', breed: '', age: '', category: 'cattle', description: '', careInstructions: '', images: [], isFeatured: false });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Submit error', err);
      alert('Error saving livestock: ' + (err.response?.data?.message || err.message));
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
    if (!confirm('Delete this livestock record?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/v1/livestock/${id}`, {
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Livestock Manager</h1>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', breed: '', age: '', category: 'cattle', description: '', careInstructions: '', images: [], isFeatured: false }); }} className="bg-[#87A878] text-white px-6 py-3 rounded-full font-semibold">+ Add Livestock</button>
        </div>

        {/* List */}
        <div className="grid gap-6 mb-8">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl p-6 shadow">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-gray-600">{item.breed} • {item.age}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
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
            <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-2xl w-full">
              <h2 className="text-3xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Livestock</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input placeholder="Animal name" name="name" value={form.name} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" required />
                <input placeholder="Breed" name="breed" value={form.breed} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                <input placeholder="Age" name="age" value={form.age} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4">
                  <option value="cattle">Cattle</option>
                  <option value="poultry">Poultry</option>
                  <option value="sheep">Sheep</option>
                  <option value="goat">Goat</option>
                </select>
                <textarea placeholder="Description" name="description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                <textarea placeholder="Care Instructions" name="careInstructions" value={form.careInstructions} onChange={handleChange} rows="2" className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Images</label>
                  <ImageUploader onUpload={(imgs) => setForm(f => ({ ...f, images: imgs || [] }))} folder="livestock" multiple />
                  {form.images?.length > 0 && <p className="mt-2 text-sm text-green-600">✓ {form.images.length} image(s) ready</p>}
                </div>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                  <span>Featured</span>
                </label>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 rounded-full bg-[#87A878] py-4 text-white font-semibold" disabled={loading}>{loading ? 'Saving...' : 'Save Livestock'}</button>
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
