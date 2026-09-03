import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useSEO } from '../../hooks/useSEO';

export default function SydenContact() {
  useSEO({
    title: 'Contact Syden | Veterinary & Farm Services Kenya',
    description: 'Contact the Syden team for veterinary services, livestock support, farm consulting and agricultural assistance in Kenya.',
    canonical: 'https://deleon1.onrender.com/syden/contact',
    ogTitle: 'Contact Syden | Kenya',
    ogDescription: 'Reach Syden for veterinary and livestock services.'
  });
  const [searchParams] = useSearchParams();
  const animalName = searchParams.get('animal') || '';
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    contactMethod: 'Email',
    message: animalName ? `I would like to ask about ${animalName}.` : ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/contact-enquiries', {
        type: 'vet_enquiry',
        animalName: animalName || 'Animal enquiry',
        name: form.name,
        email: form.email,
        phone: form.phone,
        contactMethod: form.contactMethod,
        message: form.message || `I would like to ask about ${animalName || 'this animal'}.`,
        landName: '',
        problemDescription: form.message || `I would like to ask about ${animalName || 'this animal'}.`
      }, { withCredentials: true });

      setSuccess('Your enquiry has been submitted to the Syden admin team.');
      setForm({
        name: '',
        email: '',
        phone: '',
        contactMethod: 'Email',
        message: animalName ? `I would like to ask about ${animalName}.` : ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send your enquiry right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Contact Syden</h1>
        <p className="mb-8 text-lg text-gray-700">
          Contact the Syden team for veterinary services, livestock support, farm consulting and agricultural assistance.
        </p>

        {animalName && (
          <div className="mb-6 rounded-2xl border border-[#E2725B]/30 bg-[#fff5f1] p-4 text-sm text-[#7a3d2c]">
            Enquiry for: <strong>{animalName}</strong>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Team Location</h2>
            <p>Syden Pastoral Farm</p>
            <p>support@syden.co.ke</p>
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Support</h2>
            <p>+254 700 220 330</p>
            <p>Veterinary & Farm Services</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-3xl border border-gray-200 bg-[var(--surface)] p-6 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Preferred contact
            <select
              value={form.contactMethod}
              onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3"
            >
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700 md:col-span-2">
            Your message
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3"
            />
          </label>

          <div className="md:col-span-2">
            {success && <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}
            {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#E2725B] px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
