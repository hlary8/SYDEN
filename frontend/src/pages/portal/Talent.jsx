import { useState } from 'react';

const openings = [
  { id: 1, title: 'Field Agronomist', company: 'DeeFresh', location: 'Meru', type: 'Full-time' },
  { id: 2, title: 'Livestock Vet Technician', company: 'Syden', location: 'Laikipia', type: 'Full-time' },
  { id: 3, title: 'Estate Manager', company: 'DeLeon', location: 'Nanyuki', type: 'Contract' }
];

export default function Talent() {
  const [filter, setFilter] = useState('all');

  const jobs = openings.filter(j => filter === 'all' || j.company.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-6">GROW WITH US</h1>
        <p className="text-gray-600 mb-8">Join a team that cultivates excellence</p>

        <div className="mb-6">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded border px-3 py-2">
            <option value="all">All Companies</option>
            <option value="deleon">DeLeon</option>
            <option value="syden">Syden</option>
            <option value="deefresh">DeeFresh</option>
          </select>
        </div>

        <div className="grid gap-6">
          {jobs.length === 0 && <p className="text-gray-600">No openings found.</p>}
          {jobs.map(j => (
            <div key={j.id} className="p-6 border rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{j.company} • {j.location}</div>
                <h3 className="mt-2 text-xl">{j.title}</h3>
                <div className="text-sm text-gray-600">{j.type}</div>
              </div>
              <div>
                <button className="rounded-full bg-yellow-300 px-4 py-2">Apply</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">No openings? <a className="text-blue-600" href="#">Send your CV</a></p>
        </div>
      </section>
    </div>
  );
}
