import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSEO } from '../../hooks/useSEO';

export default function SydenFarmActivities() {
  useSEO({
    title: 'Farm Activities | Syden Kenya',
    description: 'Browse farm activities and farm updates from Syden. Record of farming and veterinary activities at Syden Pastoral Farm in Kenya.',
    canonical: 'https://deleon1.onrender.com/syden/farm-activities',
    ogTitle: 'Farm Activities | Syden',
    ogDescription: 'Farm updates and activities.'
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        // Load generic farm activities from admin uploads
        const { data: farmActData } = await axios.get('/farm-activities?company=Syden');
        let farmActivities = Array.isArray(farmActData?.data) ? farmActData.data : [];

        // Load animal-based activities
        const { data: livestockData } = await axios.get('/api/v1/livestock');
        const livestockItems = Array.isArray(livestockData?.data) ? livestockData.data : [];

        const animalActivities = livestockItems
          .flatMap((animal) =>
            (animal.accordionSections || []).map((section) => ({
              type: 'animal',
              ...section,
              animalName: animal.name,
              animalCategory: animal.category,
              animalPhoto: animal.coverImage?.url || null,
            }))
          )
          .filter((item) => item.title || item.content || item.photo?.url);

        // Convert farm activities to consistent format
        const formattedFarmActivities = farmActivities.map((act) => ({
          type: 'magazine',
          _id: act._id,
          title: act.title || 'Farm Activity',
          headline: act.headline || '',
          content: act.body || '',
          photos: (act.photos || []).map((p) => p.url || p),
          animalName: act.headline || 'Syden Farm',
          animalCategory: 'Farm Update',
          animalPhoto: act.photos?.[0]?.url || null,
        }));

        // Combine both types of activities
        const allActivities = [...formattedFarmActivities, ...animalActivities];

        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching farm activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedActivity) {
        setSelectedActivity(null);
      }
    };

    if (selectedActivity) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedActivity]);

  const nextPhoto = () => {
    if (!selectedActivity) return;
    const photos = selectedActivity.type === 'magazine' 
      ? selectedActivity.photos 
      : [selectedActivity.photo?.url, ...(selectedActivity.gallery || [])].filter(Boolean);
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    if (!selectedActivity) return;
    const photos = selectedActivity.type === 'magazine' 
      ? selectedActivity.photos 
      : [selectedActivity.photo?.url, ...(selectedActivity.gallery || [])].filter(Boolean);
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getPhotosForActivity = (activity) => {
    return activity.type === 'magazine' 
      ? activity.photos 
      : [activity.photo?.url, ...(activity.gallery || [])].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)] flex items-center justify-center">
        <p>Loading farm activities...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Farm Activities</h1>
        <p className="text-gray-600 mb-8">Syden's latest livestock care, veterinary records, and farm updates</p>

        {activities.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-gray-600 text-center">
            <p className="text-lg">No farm activities have been added yet.</p>
            <p className="text-sm mt-2">Check back soon for updates from our pastoral operations.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity, index) => {
              const photos = getPhotosForActivity(activity);
              return (
                <div
                  key={`${activity.type}-${activity._id || index}`}
                  onClick={() => {
                    setSelectedActivity(activity);
                    setPhotoIndex(0);
                  }}
                  className="rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {photos.length > 0 ? (
                      <>
                        <img
                          src={photos[0]}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {photos.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            +{photos.length - 1}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        No photo
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                        {activity.animalCategory}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{activity.animalName}</p>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{activity.title}</h3>
                    {activity.headline && (
                      <p className="text-xs text-gray-500 mb-3 italic line-clamp-1">{activity.headline}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {activity.content || 'Click to view full details'}
                    </p>
                    <button className="mt-4 inline-block text-[#D4AF37] text-sm font-semibold hover:text-black transition-colors">
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
          onClick={() => setSelectedActivity(null)}
        >
          <div 
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-6 right-6 z-10 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition"
              title="Close details"
            >
              ✕
            </button>

            {/* Photo Gallery */}
            {getPhotosForActivity(selectedActivity).length > 0 && (
              <div className="relative bg-gray-900 rounded-t-3xl overflow-hidden">
                <img
                  src={getPhotosForActivity(selectedActivity)[photoIndex]}
                  alt={selectedActivity.title}
                  className="w-full h-96 object-cover"
                />

                {/* Navigation Arrows */}
                {getPhotosForActivity(selectedActivity).length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full w-12 h-12 flex items-center justify-center transition text-xl"
                      title="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full w-12 h-12 flex items-center justify-center transition text-xl"
                      title="Next photo"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Photo Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {photoIndex + 1} / {getPhotosForActivity(selectedActivity).length}
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">
                  {selectedActivity.animalCategory}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{selectedActivity.title}</h1>
                <p className="text-lg text-gray-700 font-semibold">{selectedActivity.animalName}</p>
                {selectedActivity.headline && (
                  <p className="text-gray-600 italic mt-2 text-lg">{selectedActivity.headline}</p>
                )}
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                  {selectedActivity.content || 'No additional details provided.'}
                </p>
              </div>

              {/* Photo Grid */}
              {getPhotosForActivity(selectedActivity).length > 1 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold mb-6">Photo Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getPhotosForActivity(selectedActivity).map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPhotoIndex(idx)}
                        className={`relative rounded-xl overflow-hidden h-32 md:h-40 border-2 transition-all ${
                          idx === photoIndex ? 'border-[#D4AF37] shadow-lg' : 'border-gray-200 hover:border-gray-400'
                        }`}
                        title={`View photo ${idx + 1}`}
                      >
                        <img
                          src={photo}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === photoIndex && (
                          <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                            <span className="text-[#D4AF37] font-bold text-xl">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="mt-8 w-full md:w-auto mx-auto block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
