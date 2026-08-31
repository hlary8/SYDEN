import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const defaultImages = [
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1400&q=80'
];

export default function DeLeonEnterprisesLandDetail() {
  const { slug } = useParams();
  const [land, setLand] = useState(null);
  const [images, setImages] = useState(defaultImages);
  const [index, setIndex] = useState(0);
  const [showConsult, setShowConsult] = useState(false);
  const [submitState, setSubmitState] = useState({ ok: false, message: '' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', contactMethod: 'Email', message: '' });
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const loadLand = async () => {
      if (!slug) return;
      try {
        const { data } = await axios.get(`/lands/${slug}`);
        const nextLand = data?.data || null;
        setLand(nextLand);
        const nextImages = Array.isArray(nextLand?.images) && nextLand.images.length > 0
          ? nextLand.images.map(img => img.url).filter(Boolean)
          : defaultImages;
        setImages(nextImages);
        setIndex(0);
      } catch (err) {
        console.error('Failed to load land detail', err);
        setLand(null);
        setImages(defaultImages);
      }
    };

    loadLand();
    return () => clearInterval(timerRef.current);
  }, [slug]);

  useEffect(() => {
    if (!images.length) return;
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % images.length), 6000);
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
    }
    touchStartX.current = null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/contact-enquiries', {
        type: 'land_enquiry',
        landId: land?._id || '',
        landName: land?.title || title,
        name: form.name,
        email: form.email,
        phone: form.phone,
        contactMethod: form.contactMethod,
        message: form.message || `I am interested in ${title}. Please contact me.`
      }, { withCredentials: true });

      setSubmitState({ ok: true, message: 'Your enquiry was sent to the DeLeon admin team.' });
      setForm({ name: '', email: '', phone: '', contactMethod: 'Email', message: '' });
      setShowConsult(false);
    } catch (err) {
      console.error('Land enquiry failed', err);
      setSubmitState({ ok: false, message: err.response?.data?.message || 'Unable to send enquiry right now.' });
    }
  };

  const title = land?.title || (slug ? slug.replace(/-/g, ' ') : 'Land Detail');
  const price = land?.price && land.price > 0 ? Number(land.price).toLocaleString() : null;
  const size = land?.sizeAcres ?? land?.size ?? '6.5';
  const location = land?.location?.address || 'Near Mt. Kenya’s northern face';
  const description = land?.description || 'Once part of a coffee estate, with sweeping panoramas and premium access.';

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white p-6 lg:p-10 shadow-2xl">
        <h1 className="text-3xl lg:text-5xl font-bold mb-3">{title}</h1>
        <p className="text-sm lg:text-lg text-gray-600 mb-6">{description}</p>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative">
            <div
              className="w-full h-72 lg:h-[520px] bg-black/5 flex items-center justify-center touch-auto"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[index] || `slide-${index}`}
                  src={images[index]}
                  alt={`slide-${index}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full h-72 lg:h-[520px] object-cover rounded-2xl"
                  onError={(e) => { e.target.src = defaultImages[index % defaultImages.length]; }}
                />
              </AnimatePresence>
            </div>

            <button
              onClick={prev}
              aria-label="Previous"
              className="hidden lg:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 border border-black/10 shadow-lg text-xl"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="hidden lg:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 border border-black/10 shadow-lg text-xl"
            >
              ›
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <div className="space-y-4">
              {price && <div className="rounded-3xl bg-[var(--surface)] p-6">Price: <strong>{price}</strong></div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-[var(--surface)] p-6">Size: <strong>{size} acres</strong></div>
                <div className="rounded-3xl bg-[var(--surface)] p-6">Status: <strong>{land?.status || 'Available'}</strong></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-[var(--surface)] p-6">
                <h2 className="text-xl font-semibold mb-3">Location</h2>
                <p>{location}</p>
              </div>
              <div className="rounded-3xl bg-[var(--surface)] p-6">
                <h2 className="text-xl font-semibold mb-3">Narrative</h2>
                <p>{description}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <a href={`mailto:visits@deleon.com?subject=Farm%20Visit%20Booking%20-%20${encodeURIComponent(title)}`} className="rounded-3xl border border-[#D9A441]/40 bg-[#F8F3E8] p-5 text-center">
              <div className="text-xs uppercase tracking-[0.18em] text-[#7A5A12] mb-2">Visit</div>
              <h3 className="text-xl font-semibold mb-2">Book a Farm Visit</h3>
              <p className="text-sm text-gray-600">Experience the land first-hand.</p>
            </a>
            <a href={`mailto:enquiries@deleon.com?subject=Enquiry%20about%20${encodeURIComponent(title)}`} className="rounded-3xl border border-[#D9A441]/40 bg-[#F8F3E8] p-5 text-center">
              <div className="text-xs uppercase tracking-[0.18em] text-[#7A5A12] mb-2">Questions</div>
              <h3 className="text-xl font-semibold mb-2">Make an Enquiry</h3>
              <p className="text-sm text-gray-600">Talk to our team directly.</p>
            </a>
            <a href={`mailto:sales@deleon.com?subject=Purchase%20Interest%20-%20${encodeURIComponent(title)}`} className="rounded-3xl border border-[#D9A441]/40 bg-[#F8F3E8] p-5 text-center">
              <div className="text-xs uppercase tracking-[0.18em] text-[#7A5A12] mb-2">Ownership</div>
              <h3 className="text-xl font-semibold mb-2">Purchase This Farm</h3>
              <p className="text-sm text-gray-600">Start your ownership journey.</p>
            </a>
            <a href="tel:+254700000000" className="rounded-3xl border border-[#D9A441]/40 bg-[#F8F3E8] p-5 text-center">
              <div className="text-xs uppercase tracking-[0.18em] text-[#7A5A12] mb-2">Advisor</div>
              <h3 className="text-xl font-semibold mb-2">Consultancy</h3>
              <p className="text-sm text-gray-600">Call our consultants today.</p>
            </a>
          </div>

          <div className="mt-10 rounded-[28px] border border-[#D9A441]/40 bg-[#F9F5EE] p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#7A5A12] mb-1">Consultation</p>
                <h2 className="text-2xl font-bold">Need help choosing the right property?</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowConsult(!showConsult)}
                className="rounded-full bg-[#D9A441] px-5 py-3 text-sm font-semibold text-black"
              >
                {showConsult ? 'Hide form' : 'Consult about this land'}
              </button>
            </div>

            {showConsult && (
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3" />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3" />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3" />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred contact
                  <select value={form.contactMethod} onChange={(e) => setForm({ ...form, contactMethod: e.target.value })} className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3">
                    <option>Email</option>
                    <option>Call</option>
                    <option>WhatsApp</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-gray-700 md:col-span-2">
                  Message
                  <textarea rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3" placeholder={`Tell us what you’d like to know about ${title}`} />
                </label>
                <div className="md:col-span-2 flex items-center justify-between gap-4 flex-wrap">
                  <button type="submit" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">Send to admin</button>
                  <a href="mailto:admin@syden.com?subject=Land%20Consultation%20-%20DeLeon" className="text-sm font-medium text-[#7A5A12] underline">or email admin directly</a>
                </div>
              </form>
            )}

            {submitState.message && (
              <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${submitState.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitState.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
