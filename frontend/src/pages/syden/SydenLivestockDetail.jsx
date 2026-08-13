import { useState } from 'react';
import { useParams } from 'react-router-dom';

const panels = [
  {
    key: 'vet',
    title: 'Health & Veterinary Record',
    content: 'Full veterinary history timeline, last checkup date, vaccination records, and medical notes.'
  },
  {
    key: 'care',
    title: 'Care & Feeding Instructions',
    content: 'Diet details, exercise routine, housing guidance, and special care notes.'
  },
  {
    key: 'activities',
    title: 'Farm Activities',
    content: 'Recent farm activities this animal participated in, with photo stories and notes.'
  },
  {
    key: 'breeding',
    title: 'Breeding Information',
    content: 'Pedigree details, breeding history, and offspring records.'
  }
];

export default function SydenLivestockDetail() {
  const { id } = useParams();
  const [expanded, setExpanded] = useState('vet');

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-5xl font-bold mb-4">{id.replace(/-/g, ' ')}</h1>
        <p className="text-lg text-gray-600 mb-10">Premium livestock detail, veterinary record, and care insights for {id.replace(/-/g, ' ')}.</p>
        <div className="space-y-4">
          {panels.map((panel) => (
            <button
              key={panel.key}
              type="button"
              onClick={() => setExpanded(panel.key)}
              className="w-full rounded-3xl border border-gray-200 p-6 text-left shadow-sm hover:border-[var(--accent)] transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{panel.title}</h2>
                  <p className="text-sm text-gray-500">Click to expand for details</p>
                </div>
                <span className="text-[var(--accent)]">{expanded === panel.key ? '−' : '+'}</span>
              </div>
              {expanded === panel.key && (
                <div className="mt-6 text-gray-700">
                  <p>{panel.content}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
