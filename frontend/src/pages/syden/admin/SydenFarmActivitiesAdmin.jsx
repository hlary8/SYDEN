import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../../components/common/ImageUploader';

const emptyForm = {
  animalId: '',
  title: '',
  content: '',
  photo: null,
  gallery: []
};

export default function SydenFarmActivitiesAdmin() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (user?.role !== 'admin') return <Navigate to='/' />;

  const buildActivitiesList = (items) => {
    return items.flatMap((animal) =>
      (animal.accordionSections || []).map((section, index) => ({
        id: `${animal._id}-${index}`,
        animalId: animal._id,
        animalName: animal.name,
        title: section.title || 'Farm activity',
        content: section.content || '',
        photo: section.photo?.url || null,
        gallery: Array.isArray(section.gallery) ? section.gallery.map((img) => img.url || img) : []
      }))
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/v1/livestock');
        const itemList = Array.isArray(data.data) ? data.data : [];
        setAnimals(itemList);
        setActivities(buildActivitiesList(itemList));
      } catch (err) {
        console.error('Error loading activities:', err);
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setForm({ ...emptyForm, animalId: animals[0]?._id || '' });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handlePhotoUpload = (uploadedImages) => {
    if (!uploadedImages || uploadedImages.length === 0) return;
    const nextPhotos = uploadedImages.slice(0, 3).map((img) => img.url || img);
    setForm((f) => ({
      ...f,
      photo: nextPhotos[0] || null,
      gallery: nextPhotos
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.animalId || !form.title.trim() || !form.content.trim()) {
      alert('Please select an animal, title, and description.');
      return;
    }

    setLoading(true);

    try {
      const targetAnimal = animals.find((animal) => animal._id === form.animalId);
      if (!targetAnimal) throw new Error('Selected animal not found');

      const payload = {
        accordionSections: (targetAnimal.accordionSections || []).filter((section) => !!section)
      };

      const newSection = {
        title: form.title.trim(),
        content: form.content.trim(),
        photo: form.photo ? { url: form.photo, publicId: '' } : null,
        gallery: (form.gallery || []).filter(Boolean).slice(0, 3).map((url) => ({ url, publicId: '' }))
      };

      if (editingId) {
        const cleaned = payload.accordionSections.map((section, index) => {
          const match = activities.find((item) => item.id === editingId);
          if (!match) return section;
          const currentAnimal = animals.find((animal) => animal._id === match.animalId);
          if (!currentAnimal) return section;
          const position = (currentAnimal.accordionSections || []).findIndex((item) => item.title === match.title && item.content === match.content);
          return index === position ? newSection : section;
        });
        payload.accordionSections = cleaned;
      } else {
        payload.accordionSections.push(newSection);
      }

      const { data } = await axios.patch(`/api/v1/livestock/${form.animalId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });

      setAnimals((prev) => prev.map((animal) => animal._id === form.animalId ? data.data : animal));
      setActivities(buildActivitiesList(animals.map((animal) => animal._id === form.animalId ? data.data : animal)));
      setMessage(editingId ? 'Farm activity updated successfully.' : 'Farm activity added successfully.');
      resetForm();
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving activity:', err);
      alert('Error saving activity: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setForm({
      animalId: activity.animalId,
      title: activity.title,
      content: activity.content,
      photo: activity.photo,
      gallery: activity.gallery || []
    });
    setShowForm(true);
  };

  const handleDelete = async (activity) => {
    if (!confirm('Delete this activity?')) return;

    try {
      const targetAnimal = animals.find((animal) => animal._id === activity.animalId);
      if (!targetAnimal) return;

      const nextSec = (targetAnimal.accordionSections || []).filter((section, index) => {
        return !(section.title === activity.title && section.content === activity.content && index === ((targetAnimal.accordionSections || []).findIndex((item) => item.title === activity.title && item.content === activity.content)));
      });

      const { data } = await axios.patch(`/api/v1/livestock/${activity.animalId}`, {
        accordionSections: nextSec
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });

      setAnimals((prev) => prev.map((animal) => animal._id === activity.animalId ? data.data : animal));
      setActivities(buildActivitiesList(animals.map((animal) => animal._id === activity.animalId ? data.data : animal)));
      setMessage('Activity deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert('Error deleting activity: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Farm Activities Manager</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700"
          >
            + Add Activity
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">{message}</div>
        )}

        {activities.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500">No farm activities yet.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
                {activity.photo && (
                  <img src={activity.photo} alt={activity.title} className="h-40 w-full object-cover rounded-xl mb-4" />
                )}
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">{activity.animalName}</div>
                <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{activity.content}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(activity)} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Edit</button>
                  <button onClick={() => handleDelete(activity)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
              <h2 className="text-3xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Farm Activity</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Animal *</label>
                  <select name="animalId" value={form.animalId} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-4 py-3" required>
                    <option value="">Select an animal</option>
                    {animals.map((animal) => (
                      <option key={animal._id} value={animal._id}>{animal.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-4 py-3" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows="5" className="w-full rounded-2xl border border-gray-200 px-4 py-3" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Activity Photos (up to 3)</label>
                  <ImageUploader onUpload={handlePhotoUpload} folder="farm-activities" multiple maxImages={3} />
                  {(form.photo || form.gallery.length > 0) && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[form.photo, ...form.gallery].filter(Boolean).map((img, idx) => (
                        <img key={`${img}-${idx}`} src={img} alt="Activity preview" className="h-24 w-full object-cover rounded-2xl" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 rounded-full bg-green-600 py-4 text-white font-semibold" disabled={loading}>{loading ? 'Saving...' : 'Save Activity'}</button>
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 rounded-full bg-gray-300 py-4 text-gray-800 font-semibold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
