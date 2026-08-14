import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../../components/common/ImageUploader';

export default function DeLeonEnterprisesLandUpload() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', price: 0, sizeAcres: 0, location: { address: '' }, features: [], status: 'available', images: [] });
  const [loading, setLoading] = useState(false);

  // Admin-only check
  if (user?.role !== 'admin') return <Navigate to='/' />;

  // Load lands list
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/lands');
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
    if (name === 'address') {
      setForm(f => ({ ...f, location: { ...f.location, address: value } }));
    } else if (type === 'checkbox') {
      const newFeatures = checked ? [...(form.features || []), value] : (form.features || []).filter(f => f !== value);
      setForm(f => ({ ...f, features: newFeatures }));
    } else {
      setForm(f => ({ ...f, [name]: name === 'price' || name === 'sizeAcres' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (editingId) {
        // Update
        const { data } = await axios.patch(`/lands/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(items.map(i => i._id === editingId ? data.data : i));
      } else {
        // Create
        const { data } = await axios.post('/lands', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems([data.data, ...items]);
      }
      setForm({ title: '', description: '', price: 0, sizeAcres: 0, location: { address: '' }, features: [], status: 'available', images: [] });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Submit error', err);
      alert('Error saving land: ' + (err.response?.data?.message || err.message));
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
    if (!confirm('Delete this land listing?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/lands/${id}`, {
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
          <h1 className="text-4xl font-bold">Land Manager</h1>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', description: '', price: 0, sizeAcres: 0, location: { address: '' }, features: [], status: 'available', images: [] }); }} className="bg-[var(--primary)] text-[var(--bg)] px-6 py-3 rounded-full font-semibold">+ Add Land</button>
        </div>

        {/* List */}
        <div className="grid gap-6 mb-8">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl p-6 shadow">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-600">{item.sizeAcres} acres • {item.location?.address}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <p className="text-sm font-semibold mt-2">KES {item.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: <span className="font-semibold">{item.status}</span></p>
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
              <h2 className="text-3xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Land</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input placeholder="Title" name="title" value={form.title} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" required />
                <textarea placeholder="Description" name="description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input placeholder="Price (KES)" name="price" type="number" value={form.price} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                  <input placeholder="Size in acres" name="sizeAcres" type="number" value={form.sizeAcres} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />
                </div>
                <input placeholder="Location address" name="address" value={form.location?.address || ''} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4" />

                <div>
                  <label className="block text-sm font-semibold mb-3">Features</label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {['Fenced', 'Road Frontage', 'Water Access', 'Electricity', 'Title Deed Ready'].map((feature) => (
                      <label key={feature} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
                        <input type="checkbox" value={feature} checked={(form.features || []).includes(feature)} onChange={handleChange} />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Images</label>
                  <ImageUploader onUpload={(imgs) => setForm(f => ({ ...f, images: imgs || [] }))} folder="lands" multiple />
                  {form.images?.length > 0 && <p className="mt-2 text-sm text-green-600">✓ {form.images.length} image(s) ready</p>}
                </div>

                <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-3xl border border-gray-200 px-5 py-4">
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 rounded-full bg-[var(--primary)] py-4 text-[var(--bg)] font-semibold" disabled={loading}>{loading ? 'Saving...' : 'Save Land'}</button>
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
