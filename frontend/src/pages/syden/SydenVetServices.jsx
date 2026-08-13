export default function SydenVetServices() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Veterinary Services</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: 'Vaccination', description: 'Preventative health packages for all livestock.' },
            { name: 'Breeding', description: 'Assisted breeding and fertility support.' },
            { name: 'Emergency Care', description: '24/7 veterinary response for urgent needs.' }
          ].map((service) => (
            <div key={service.name} className="rounded-3xl bg-[var(--surface)] p-6">
              <h2 className="text-2xl font-semibold mb-3">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
