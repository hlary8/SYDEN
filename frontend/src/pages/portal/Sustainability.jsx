import { useEffect, useState } from 'react';

export default function Sustainability() {
  const [counts, setCounts] = useState({ acres: 0, animals: 0, farmers: 0 });

  useEffect(() => {
    // simple counter animation
    const target = { acres: 15000, animals: 32000, farmers: 1200 };
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setCounts({
        acres: Math.floor(target.acres * t),
        animals: Math.floor(target.animals * t),
        farmers: Math.floor(target.farmers * t)
      });
      if (t < 1) requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="h-[50vh] md:h-[60vh] bg-[url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-12 md:pt-24">
          <h1 className="font-serif text-[clamp(2rem,6vw,3.5rem)] text-white leading-tight">SUSTAINABILITY</h1>
          <p className="mt-4 text-sm md:text-base text-white/80 px-4">Our commitment to the land, the animals, and the people</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">FOR THE LAND</h3>
            <p className="mt-2 text-xs md:text-sm text-gray-600">DeLeon land conservation, Laikipia & Meru stewardship</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">FOR THE ANIMALS</h3>
            <p className="mt-2 text-xs md:text-sm text-gray-600">Syden ethical livestock, vet welfare standards</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-sm md:text-base">FOR THE PEOPLE</h3>
            <p className="mt-2 text-xs md:text-sm text-gray-600">DeeFresh fair farmer partnerships, agronomical training</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold">{counts.acres.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-gray-600 mt-2">Acres under sustainable management</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">{counts.animals.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-gray-600 mt-2">Animals under ethical care</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">{counts.farmers.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-gray-600 mt-2">Farmer partnerships active</div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button className="rounded-full bg-yellow-300 px-6 py-3 text-sm font-semibold hover:bg-yellow-400 transition-colors">Join Our Mission</button>
        </div>
      </section>
    </div>
  );
}
