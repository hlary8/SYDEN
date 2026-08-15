import { Link } from 'react-router-dom';

export default function DeeFreshHome() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <section className="rounded-3xl bg-white p-10 shadow-2xl mb-10">
          <h1 className="text-5xl font-bold mb-4">DeeFresh</h1>
          <p className="text-lg text-gray-700 mb-6">Fresh produce, farmer stories, and premium seed collections for modern kitchens.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/deefresh/produce" className="rounded-3xl bg-[var(--surface)] p-8 text-center hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">Produce</h2>
              <p className="text-sm text-gray-600">Browse seasonal produce catalog.</p>
            </Link>
            <Link to="/deefresh/farmers" className="rounded-3xl bg-[var(--surface)] p-8 text-center hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">Farmers</h2>
              <p className="text-sm text-gray-600">Meet our partner growers.</p>
            </Link>
            <Link to="/deefresh/seeds" className="rounded-3xl bg-[var(--surface)] p-8 text-center hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">Seeds</h2>
              <p className="text-sm text-gray-600">Pitch premium seed varieties.</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
