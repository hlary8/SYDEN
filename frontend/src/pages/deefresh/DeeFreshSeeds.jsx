export default function DeeFreshSeeds() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Premium Seeds</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          {['Heritage Tomato', 'Morning Glory Basil', 'Golden Maize'].map((seed) => (
            <div key={seed} className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="h-40 rounded-3xl bg-[var(--surface)] mb-4" />
              <h2 className="text-2xl font-semibold mb-2">{seed}</h2>
              <p className="text-sm text-gray-500">Premium seed variety for high-yield, flavorful harvests.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
