import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function SydenLivestockDetail() {
  const { id } = useParams();
  const [livestock, setLivestock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/livestock/${id}`);
        setLivestock(data.data);
        setError(null);
      } catch (err) {
        console.error('Error loading livestock:', err);
        setError(err.response?.data?.message || 'Failed to load livestock details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLivestock();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading livestock details...</p>
        </div>
      </div>
    );
  }

  if (error || !livestock) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Livestock Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to find this livestock record'}</p>
          <Link to="/syden/livestock" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ← Back to Livestock
          </Link>
        </div>
      </div>
    );
  }

  const displayName = livestock.name || `${livestock.breed || 'Animal'} (${livestock.category || 'Unknown'})`;
  const galleryPhotos = [
    ...(livestock.coverImage?.url ? [{ url: livestock.coverImage.url }] : []),
    ...(Array.isArray(livestock.gallery) ? livestock.gallery : [])
  ]
    .filter((photo, index, arr) => !!photo?.url && arr.findIndex((entry) => entry.url === photo.url) === index)
    .slice(0, 4);

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <Link to="/syden/livestock" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to Livestock
        </Link>

        {livestock.coverImage?.url && (
          <div className="rounded-3xl overflow-hidden mb-8 h-96 bg-gray-200">
            <img src={livestock.coverImage.url} alt={displayName} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="rounded-3xl bg-white p-8 shadow-lg mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2">{displayName}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                {livestock.breed && <span>Breed: <strong>{livestock.breed}</strong></span>}
                {livestock.age && <span>Age: <strong>{livestock.age}</strong></span>}
                {livestock.weight && <span>Weight: <strong>{livestock.weight}</strong></span>}
                {livestock.category && <span>Category: <strong className="capitalize">{livestock.category}</strong></span>}
                {livestock.healthStatus && <span>Health: <strong className="capitalize">{livestock.healthStatus}</strong></span>}
              </div>
            </div>

            <Link
              to={`/syden/contact?animal=${encodeURIComponent(displayName)}`}
              className="inline-flex items-center justify-center rounded-full bg-[#E2725B] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#d55f46]"
            >
              Ask about this animal
            </Link>
          </div>

          {livestock.location && (
            <p className="text-gray-700 mb-4"><strong>Location:</strong> {livestock.location}</p>
          )}
          {livestock.description && (
            <p className="text-gray-700 leading-relaxed">{livestock.description}</p>
          )}
        </div>

        {galleryPhotos.length > 0 && (
          <div className="rounded-3xl bg-white p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-bold mb-6">Photo Gallery</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {galleryPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  className="h-48 cursor-pointer overflow-hidden rounded-lg bg-gray-200 shadow-sm transition hover:shadow-lg"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img src={photo.url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {livestock.accordionSections && livestock.accordionSections.length > 0 && (
          <div className="rounded-3xl bg-white p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-bold mb-6">Farm Activities & Information</h2>
            <div className="space-y-4">
              {livestock.accordionSections.map((section, idx) => (
                <div key={idx} className="overflow-hidden rounded-lg border border-gray-200">
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-6 transition hover:bg-gray-50"
                  >
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                    <span className="text-2xl text-gray-400">{expanded === idx ? '−' : '+'}</span>
                  </button>

                  {expanded === idx && (
                    <div className="border-t bg-gray-50 p-6">
                      {section.photo?.url && (
                        <img src={section.photo.url} alt={section.title} className="mb-4 max-h-64 w-full rounded-lg object-cover" />
                      )}
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {lightboxIndex !== null && galleryPhotos.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setLightboxIndex(null)}>
            <button className="absolute right-6 top-6 text-4xl text-white" onClick={() => setLightboxIndex(null)}>
              ×
            </button>

            <div className="relative max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <img src={galleryPhotos[lightboxIndex].url} alt={`Photo ${lightboxIndex + 1}`} className="max-h-[80vh] max-w-full object-contain" />

              {galleryPhotos.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length)}
                    className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white hover:bg-white/40"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryPhotos.length)}
                    className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-2xl text-white hover:bg-white/40"
                  >
                    ›
                  </button>
                  <div className="mt-4 text-center text-white">{lightboxIndex + 1} / {galleryPhotos.length}</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
