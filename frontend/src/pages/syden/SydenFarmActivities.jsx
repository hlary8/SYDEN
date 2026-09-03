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

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const { data } = await axios.get('/api/v1/livestock');
        const items = Array.isArray(data?.data) ? data.data : [];

        const flattened = items
          .flatMap((animal) =>
            (animal.accordionSections || []).map((section) => ({
              ...section,
              animalName: animal.name,
              animalCategory: animal.category,
              animalPhoto: animal.coverImage?.url || null,
            }))
          )
          .filter((item) => item.title || item.content || item.photo?.url);

        setActivities(flattened);
      } catch (error) {
        console.error('Error fetching farm activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

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
        <h1 className="text-4xl font-bold mb-6">Farm Activities</h1>
        {activities.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-lg text-gray-600">
            No farm activities have been added yet.
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={`${activity.animalName}-${activity.title || index}`} className="rounded-3xl bg-white p-8 shadow-lg">
                <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl font-semibold">{activity.title || 'Farm Activity'}</h2>
                    <p className="text-sm text-gray-500">{activity.animalName} • {activity.animalCategory}</p>
                  </div>
                  <span className="text-sm text-gray-500">Live record</span>
                </div>

                {activity.photo?.url && (
                  <img
                    src={activity.photo.url}
                    alt={activity.title || activity.animalName}
                    className="w-full h-56 object-cover rounded-2xl mb-4"
                  />
                )}

                <p className="text-gray-600 whitespace-pre-line">{activity.content || 'No description provided for this activity.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
