export default function DeeFreshFarmers() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Our Farmers</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          {['Grace Mwangi', 'Peter Ouma', 'Amina Farah'].map((farmer) => (
            <div key={farmer} className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="h-40 rounded-3xl bg-[var(--surface)] mb-4" />
              <h2 className="text-2xl font-semibold mb-2">{farmer}</h2>
              <p className="text-sm text-gray-500">Partner farmer specializing in premium produce and sustainable farming.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
