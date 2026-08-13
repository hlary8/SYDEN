import { Link } from 'react-router-dom';

export default function SydenHome() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <section className="rounded-3xl bg-white p-10 shadow-2xl mb-10">
          <h1 className="text-5xl font-bold mb-4">Syden Livestock</h1>
          <p className="text-lg text-gray-700 mb-6">Healthy livestock, expert care, and trusted veterinary services in golden hour settings.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Cattle', 'Poultry', 'Equine'].map((item) => (
              <Link key={item} to="/syden/livestock" className="rounded-3xl bg-[var(--surface)] p-6 text-center hover:shadow-lg transition">
                <h2 className="font-semibold text-xl mb-2">{item}</h2>
                <p className="text-sm text-gray-500">Explore premium {item.toLowerCase()} profiles.</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
