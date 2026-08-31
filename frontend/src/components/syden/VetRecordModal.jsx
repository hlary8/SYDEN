import React, { useState, useEffect } from 'react';
import ImageUploader from '../common/ImageUploader';
import axios from 'axios';

export default function VetRecordModal({ open, onClose, animalId, onSaved, editing }) {
  const [form, setForm] = useState({
    serviceType: 'Vaccination',
    dateAdministered: '',
    nextDueDate: '',
    medicineName: '',
    dosage: '',
    vetName: '',
    notes: '',
    images: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) setForm({
      serviceType: editing.serviceType || 'Vaccination',
      dateAdministered: editing.dateAdministered ? (new Date(editing.dateAdministered)).toISOString().slice(0,10) : '',
      nextDueDate: editing.nextDueDate ? (new Date(editing.nextDueDate)).toISOString().slice(0,10) : '',
      medicineName: editing.medicineName || '',
      dosage: editing.dosage || '',
      vetName: editing.vetName || '',
      notes: editing.notes || '',
      images: Array.isArray(editing.images) ? editing.images.map(i => i.url || i) : []
    });
    // eslint-disable-next-line
  }, [editing]);

  async function handleUpload(imgs) {
    if (!imgs) return;
    // ImageUploader returns array of { url }
    const urls = imgs.map(i => i.url || i);
    setForm(f => ({ ...f, images: urls.slice(0, 3) }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e && e.preventDefault();
    if (!animalId && !editing) return alert('Animal missing');
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const payload = { ...form, animal: animalId };
      if (editing) {
        const { data } = await axios.patch(`/api/v1/vets/${editing._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        onSaved && onSaved(data.data);
      } else {
        const { data } = await axios.post('/api/v1/vets', payload, { headers: { Authorization: `Bearer ${token}` } });
        onSaved && onSaved(data.data);
      }
      onClose();
    } catch (err) {
      console.error('Save vet record', err);
      alert('Error saving vet record: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">{editing ? 'Edit' : 'Add'} Veterinary Record</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Service Type</label>
            <select name="serviceType" value={form.serviceType} onChange={handleChange} className="w-full rounded-lg border px-3 py-2">
              <option>Vaccination</option>
              <option>Deworming</option>
              <option>Check-up</option>
              <option>Treatment</option>
              <option>Surgery</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Date Administered</label>
              <input type="date" name="dateAdministered" value={form.dateAdministered} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Next Due Date</label>
              <input type="date" name="nextDueDate" value={form.nextDueDate} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Medicine / Vaccine</label>
              <input name="medicineName" value={form.medicineName} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Dosage</label>
              <input name="dosage" value={form.dosage} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Veterinarian</label>
            <input name="vetName" value={form.vetName} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Notes / Recommendations</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} className="w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Upload Photos (up to 3)</label>
            <ImageUploader onUpload={handleUpload} folder={`vets-${animalId || 'temp'}`} multiple={true} maxImages={3} />
            {form.images && form.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.images.map((u, i) => (
                  <img key={i} src={u} alt={`vet-${i}`} className="h-20 w-full object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-full bg-[var(--accent)] text-white">{saving ? 'Saving...' : (editing ? 'Update Record' : 'Add Record')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
