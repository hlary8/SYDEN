import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../../components/common/ImageUploader';

const emptyForm = {
  farmName: '',
  location: '',
  contactPhone: '',
  description: '',
  story: '',
  activities: '',
  profilePhoto: null,
  gallery: [],
  isSuspended: true
};

export default function DeeFreshFarmersAdmin() {
  const { user, accessToken } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (user?.role !== 'admin') return <Navigate to='/' />;

  const authToken = accessToken || localStorage.getItem('accessToken');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/v1/farmers/approved');
        setFarmers(Array.isArray(data.farmers) ? data.farmers : []);
      } catch (e) {
        console.error('Load error', e);
        setFarmers([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const id = setTimeout(() => setSuccessMessage(''), 5000);
    return () => clearTimeout(id);
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePhotoUpload = (uploadedImages) => {
    if (uploadedImages && uploadedImages.length > 0) {
      setForm(f => ({ ...f, profilePhoto: uploadedImages[0].url }));
      setSuccessMessage('Photo uploaded successfully');
    }
  };

  const handleGalleryUpload = (uploadedImages) => {
    if (uploadedImages && uploadedImages.length > 0) {
      const gallery = uploadedImages.slice(0, 3).map((img) => img.url || img);
      setForm(f => ({ ...f, gallery }));
      setSuccessMessage('Gallery photos uploaded successfully');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.farmName.trim() || !form.location.trim() || !form.contactPhone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const payload = {
      ...form,
      activities: form.activities
        ? form.activities.split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 5)
        : [],
      gallery: form.gallery || [],
      isSuspended: Boolean(form.isSuspended)
    };

    setLoading(true);
    try {
      const token = authToken || localStorage.getItem('accessToken');
      if (!token) {
        alert('Please log in as an admin before saving farmer.');
        return;
      }

      if (editingId) {
        const { data } = await axios.patch(`/api/v1/farmers/admin/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFarmers(farmers.map(f => f._id === editingId ? {
          ...f,
          farmName: data.data.farmName,
          location: data.data.location,
          contactPhone: data.data.contactPhone,
          description: data.data.description,
          profilePhoto: data.data.profilePhoto,
          farmerProfile: {
            ...(f.farmerProfile || {}),
            farmName: data.data.farmName,
            farmLocation: data.data.location,
            farmDescription: data.data.description,
            story: data.data.story,
            activities: data.data.activities,
            gallery: data.data.gallery,
            farmPhoto: data.data.profilePhoto ? { url: data.data.profilePhoto } : null,
            isSuspended: data.data.isSuspended
          }
        } : f));
        setSuccessMessage('Farmer updated successfully');
      } else {
        const { data } = await axios.post('/api/v1/farmers/admin/create', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFarmers([data.data, ...farmers]);
        setSuccessMessage('Farmer added successfully');
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Submit error', err);
      alert('Error saving farmer: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (farmer) => {
    const profile = farmer.farmerProfile || {};
    setEditingId(farmer._id);
    setForm({
      farmName: profile.farmName || farmer.farmName || farmer.username || '',
      location: profile.farmLocation || farmer.location || '',
      contactPhone: profile.contactPhone || farmer.contactPhone || '',
      description: profile.farmDescription || farmer.description || '',
      story: profile.story || '',
      activities: Array.isArray(profile.activities) ? profile.activities.join('\n') : '',
      profilePhoto: profile.farmPhoto?.url || farmer.profilePhoto || null,
      gallery: Array.isArray(profile.gallery) ? profile.gallery.map((img) => img.url || img).slice(0, 3) : [],
      isSuspended: !!profile.isSuspended
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this farmer?')) return;
    try {
      const token = authToken || localStorage.getItem('accessToken');
      await axios.delete(`/api/v1/farmers/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarmers(farmers.filter(f => f._id !== id));
      setSuccessMessage('Farmer deleted successfully');
    } catch (err) {
      alert('Error deleting farmer: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Farmers Management</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setForm(emptyForm);
              }
            }}
            className="px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-full hover:opacity-90 transition"
          >
            {showForm ? 'Cancel' : 'Add New Farmer'}
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-2xl">
            {successMessage}
          </div>
        )}

        {showForm && (
          <div className="mb-12 rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Farmer' : 'Add New Farmer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Farm Name *</label>
                  <input
                    type="text"
                    name="farmName"
                    value={form.farmName}
                    onChange={handleChange}
                    placeholder="e.g., Green Valley Farm"
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g., Kiambu County"
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Contact Phone *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    placeholder="e.g., +254 700 000000"
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Farm Owner Photo</label>
                  <ImageUploader
                    onUpload={handlePhotoUpload}
                    folder="farmers"
                    multiple={false}
                    maxImages={1}
                  />
                  {form.profilePhoto && (
                    <img src={form.profilePhoto} alt="farmer preview" className="mt-3 h-24 w-full object-cover rounded-2xl" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Short Story / About</label>
                <textarea
                  name="story"
                  value={form.story}
                  onChange={handleChange}
                  placeholder="Tell the story of the farm, values, and lifestyle."
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the farm, specialties, produce, and farming practices."
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Activities / Highlights</label>
                <textarea
                  name="activities"
                  value={form.activities}
                  onChange={handleChange}
                  placeholder="One activity per line, for example:&#10;Organic vegetable cultivation&#10;Bee pollination&#10;Sustainable irrigation"
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Gallery (up to 3 photos)</label>
                <ImageUploader
                  onUpload={handleGalleryUpload}
                  folder="farmers-gallery"
                  multiple={true}
                  maxImages={3}
                />
                {form.gallery.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {form.gallery.map((img, index) => (
                      <img key={`${img}-${index}`} src={img} alt={`Farmer gallery ${index + 1}`} className="h-24 w-full object-cover rounded-2xl" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Visibility</label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!form.isSuspended}
                    onChange={(e) => setForm(f => ({ ...f, isSuspended: !e.target.checked }))}
                  />
                  Publish this farmer to the public page
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-full hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Farmer' : 'Add Farmer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="px-8 py-3 border border-neutral-300 rounded-full hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Approved Farmers ({farmers.length})</h2>
          {farmers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No public farmers yet. Add or complete a farmer profile!</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {farmers.map((farmer) => {
                const profile = farmer.farmerProfile || {};
                const farmName = profile.farmName || farmer.farmName || farmer.username || 'Approved Farmer';
                const location = profile.farmLocation || farmer.location || 'Kenya';
                const photo = profile.farmPhoto?.url || farmer.profilePhoto || null;
                const needPublish = !profile.isSuspended && photo && location;

                return (
                  <div key={farmer._id} className="border border-neutral-200 rounded-2xl p-6 hover:shadow-lg transition">
                    {photo && (
                      <img src={photo} alt={farmName} className="w-full h-40 object-cover rounded-2xl mb-4" />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{farmName}</h3>
                    <p className="text-sm text-gray-600 mb-1"><strong>Location:</strong> {location}</p>
                    <p className="text-sm text-gray-600 mb-3"><strong>Phone:</strong> {profile.contactPhone || farmer.contactPhone || 'Not provided'}</p>
                    <p className="text-sm text-gray-700 mb-4">{profile.farmDescription || farmer.description || 'Farm profile still being completed.'}</p>
                    <div className="text-xs text-gray-500 mb-3">
                      {needPublish ? 'Visible on public farmers page' : 'Hidden until profile details are completed'}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(farmer)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(farmer._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
