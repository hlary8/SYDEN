import { useParams } from 'react-router-dom';

export default function DeeFreshProduceDetail() {
  const { slug } = useParams();

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-5xl font-bold mb-4">{slug.replace(/-/g, ' ')}</h1>
        <p className="text-lg text-gray-600 mb-8">A premium produce offering with provenance, seasonal freshness, and premium packaging.</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-semibold mb-3">Nutritional Information</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Calories: 52</li>
              <li>Vitamin C: High</li>
              <li>Fiber: 3.4g</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-semibold mb-3">Farmer Source</h2>
            <p>Partner farmer: Grace Mwangi</p>
            <p>Location: Rift Valley</p>
            <p>Partner since 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}
