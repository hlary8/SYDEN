import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ImageUploader from '../../../components/common/ImageUploader';
import { io } from 'socket.io-client';

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
  const [farmActivitiesList, setFarmActivitiesList] = useState([]);

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

  // Load generic farm activities (company: Syden)
  useEffect(() => {
    let mounted = true;
    const loadActivities = async () => {
      try {
        const { data } = await axios.get('/farm-activities?company=Syden');
        if (!mounted) return;
        setFarmActivitiesList(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error loading farm activities:', err);
      }
    };
    loadActivities();

    const SOCKET_BASE = (axios.defaults.baseURL || window.location.origin).replace(/\/api\/v1\/?$/,'');
    const socket = io(SOCKET_BASE, { withCredentials: true });
    socket.on('connect', () => console.log('Socket connected for farm activities', socket.id));
    socket.on('farmActivity:created', (item) => setFarmActivitiesList((s) => [item, ...s]));
    socket.on('farmActivity:updated', (item) => setFarmActivitiesList((s) => s.map((a) => a._id === item._id ? item : a)));
    socket.on('farmActivity:deleted', ({ id }) => setFarmActivitiesList((s) => s.filter((a) => a._id !== id)));

    return () => {
      mounted = false;
      try { socket.disconnect(); } catch (e) {}
    };
  }, []);

  // Form state for generic farm activities
  const [faForm, setFaForm] = useState({ title: '', headline: '', body: '', photos: [] });
  const [faLoading, setFaLoading] = useState(false);
  const [faEditId, setFaEditId] = useState(null);

  const handleFaUpload = (imgs) => {
    if (!imgs) return;
    const urls = imgs.slice(0, 4).map((i) => i.url || i);
    setFaForm((f) => ({ ...f, photos: urls }));
  };

  const saveFa = async (e) => {
    e && e.preventDefault();
    if (!faForm.title.trim()) return alert('Please add title');
    setFaLoading(true);
    try {
      if (faEditId) {
        const { data } = await axios.patch(`/farm-activities/${faEditId}`, { ...faForm, company: 'Syden' }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
        setFarmActivitiesList((s) => s.map((a) => a._id === data.data._id ? data.data : a));
        setMessage('Activity updated');
      } else {
        const { data } = await axios.post('/farm-activities', { ...faForm, company: 'Syden' }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
        setFarmActivitiesList((s) => [data.data, ...s]);
        setMessage('Activity created');
      }
      setFaForm({ title: '', headline: '', body: '', photos: [] });
      setFaEditId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Save farm activity error', err);
      alert(err.response?.data?.message || err.message);
    } finally { setFaLoading(false); }
  };

  const handleFaEdit = (item) => {
    setFaEditId(item._id);
    setFaForm({ title: item.title || '', headline: item.headline || '', body: item.body || '', photos: (item.photos || []).map(p => p.url || p) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFaDelete = async (id) => {
    if (!confirm('Delete this activity?')) return;
    try {
      await axios.delete(`/farm-activities/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      setFarmActivitiesList((s) => s.filter((a) => a._id !== id));
      setMessage('Activity deleted');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Delete activity', err);
      alert(err.response?.data?.message || err.message);
    }
  };

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
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold sm:text-4xl">Farm Activities Manager</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full rounded-full bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 sm:w-auto"
          >
            + Add Activity
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">{message}</div>
        )}

        {/* Generic Farm Activities Manager (Syden) */}
        <div className="mt-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold">Syden — Farm Activities (Magazine)</h2>
            <button
              onClick={() => {
                setFaEditId(null);
                setFaForm({ title: '', headline: '', body: '', photos: [] });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full rounded-full bg-yellow-600 px-4 py-2 text-white sm:w-auto"
            >
              + New Activity
            </button>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6">
            <form onSubmit={saveFa} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">Title *</label>
                <input value={faForm.title} onChange={(e) => setFaForm(f => ({ ...f, title: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Headline</label>
                <input value={faForm.headline} onChange={(e) => setFaForm(f => ({ ...f, headline: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Body</label>
                <textarea value={faForm.body} onChange={(e) => setFaForm(f => ({ ...f, body: e.target.value }))} rows={4} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Photos (up to 4)</label>
                <ImageUploader onUpload={handleFaUpload} folder="farm-activities" multiple maxImages={4} />
                {faForm.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {faForm.photos.map((p, i) => (
                      <img key={`${p}-${i}`} src={p} alt={`photo-${i}`} className={`w-full object-cover ${i === 0 ? 'col-span-2 row-span-2 h-64 sm:h-64' : 'h-32'} rounded-2xl`} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={faLoading} className="w-full rounded-full bg-black px-6 py-3 text-white sm:w-auto">{faEditId ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setFaEditId(null); setFaForm({ title: '', headline: '', body: '', photos: [] }); }} className="w-full rounded-full bg-gray-200 px-6 py-3 sm:w-auto">Reset</button>
              </div>
            </form>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {farmActivitiesList.map((act) => (
              <article key={act._id} className="rounded-2xl bg-white p-6 shadow">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <div className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">{act.headline}</div>
                    <h3 className="mb-2 text-xl font-bold">{act.title}</h3>
                    <p className="mb-4 text-gray-600">{act.body}</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button onClick={() => handleFaEdit(act)} className="rounded bg-blue-600 px-4 py-2 text-white">Edit</button>
                      <button onClick={() => handleFaDelete(act._id)} className="rounded bg-red-600 px-4 py-2 text-white">Delete</button>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    {act.photos && act.photos.length > 0 ? (
                      <div className="grid gap-2">
                        {act.photos.slice(0,4).map((p, idx) => (
                          <img key={idx} src={p.url || p} alt={`photo-${idx}`} className={`w-full object-cover ${idx === 0 ? 'h-40' : 'h-20'} rounded-lg`} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-400">No photos</div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center text-gray-500">No farm activities yet.</div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {activities.map((activity) => (
              <div key={activity.id} className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
                {activity.photo && (
                  <img src={activity.photo} alt={activity.title} className="mb-4 h-40 w-full rounded-xl object-cover" />
                )}
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">{activity.animalName}</div>
                <h3 className="mb-2 text-xl font-bold">{activity.title}</h3>
                <p className="mb-4 text-sm text-gray-600">{activity.content}</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button onClick={() => handleEdit(activity)} className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white">Edit</button>
                  <button onClick={() => handleDelete(activity)} className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm text-white">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
              <h2 className="mb-6 text-3xl font-bold">{editingId ? 'Edit' : 'Add'} Farm Activity</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Animal *</label>
                  <select name="animalId" value={form.animalId} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-4 py-3" required>
                    <option value="">Select an animal</option>
                    {animals.map((animal) => (
                      <option key={animal._id} value={animal._id}>{animal.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-4 py-3" required />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Description *</label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows="5" className="w-full rounded-2xl border border-gray-200 px-4 py-3" required />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Activity Photos (up to 3)</label>
                  <ImageUploader onUpload={handlePhotoUpload} folder="farm-activities" multiple maxImages={3} />
                  {(form.photo || form.gallery.length > 0) && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[form.photo, ...form.gallery].filter(Boolean).map((img, idx) => (
                        <img key={`${img}-${idx}`} src={img} alt="Activity preview" className="h-24 w-full rounded-2xl object-cover" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="submit" className="flex-1 rounded-full bg-green-600 py-4 font-semibold text-white" disabled={loading}>{loading ? 'Saving...' : 'Save Activity'}</button>
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 rounded-full bg-gray-300 py-4 font-semibold text-gray-800">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
