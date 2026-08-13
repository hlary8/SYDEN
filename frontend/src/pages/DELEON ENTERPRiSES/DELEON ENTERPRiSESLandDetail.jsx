import { useParams } from 'react-router-dom';

export default function DeLeonEnterprisesLandDetail() {
  const { slug } = useParams();

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-5xl font-bold mb-4">{slug.replace(/-/g, ' ')}</h1>
        <p className="text-lg text-gray-600 mb-8">Once part of a coffee estate, with sweeping panoramas and premium access.</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-72 rounded-3xl bg-[var(--surface)]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-[var(--surface)] p-6">Price: KES 18M</div>
              <div className="rounded-3xl bg-[var(--surface)] p-6">Size: 6.5 acres</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-[var(--surface)] p-6">
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <p>Near Mt. Kenya's northern face, with private water access and paved road frontage.</p>
            </div>
            <div className="rounded-3xl bg-[var(--surface)] p-6">
              <h2 className="text-xl font-semibold mb-3">Narrative</h2>
              <p>Once part of a coffee estate, capturing golden afternoon light and a timeless sense of provenance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
