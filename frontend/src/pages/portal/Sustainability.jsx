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
    <div className="min-h-screen bg-[var(--holdings-bg)] text-[var(--holdings-text)]">
      <section className="relative h-[50vh] bg-[url('https://res.cloudinary.com/tmcloud1/image/upload/v1786704155/Screenshot_from_2026-08-14_13-31-57_crb5xo.png')] bg-cover bg-center md:h-[60vh]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-12 text-center md:pt-24">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-accent)]">Cultivating a better future</p>
          <h1 className="mt-4 font-serif text-[clamp(2rem,6vw,3.5rem)] leading-tight text-white">SUSTAINABILITY</h1>
          <p className="mt-4 px-4 text-sm text-white/80 md:text-base">Our commitment to the land, the animals, and the people</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-none border border-[var(--holdings-border)] bg-[var(--holdings-surface)] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--holdings-accent)] md:text-base">FOR THE LAND</h3>
            <p className="mt-2 text-xs text-[var(--holdings-text-muted)] md:text-sm">DELEON land conservation, Laikipia & Meru stewardship</p>
          </div>
          <div className="rounded-none border border-[var(--holdings-border)] bg-[var(--holdings-surface)] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--holdings-accent)] md:text-base">FOR THE ANIMALS</h3>
            <p className="mt-2 text-xs text-[var(--holdings-text-muted)] md:text-sm">Syden ethical livestock, vet welfare standards</p>
          </div>
          <div className="rounded-none border border-[var(--holdings-border)] bg-[var(--holdings-surface)] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--holdings-accent)] md:text-base">FOR THE PEOPLE</h3>
            <p className="mt-2 text-xs text-[var(--holdings-text-muted)] md:text-sm">DeeFresh fair farmer partnerships, agronomical training</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <div className="rounded-none border border-[var(--holdings-border)] bg-[var(--holdings-surface)] p-8">
            <div className="text-3xl font-bold md:text-4xl">{counts.acres.toLocaleString()}</div>
            <div className="mt-2 text-xs text-[var(--holdings-text-muted)] md:text-sm">Acres under sustainable management</div>
          </div>
          <div className="rounded-none border border-[var(--holdings-border)] bg-[var(--holdings-surface)] p-8">
            <div className="text-3xl font-bold md:text-4xl">{counts.animals.toLocaleString()}</div>
            <div className="mt-2 text-xs text-[var(--holdings-text-muted)] md:text-sm">Animals under ethical care</div>
          </div>
          <div className="rounded-none border border-[var(--holdings-border)] bg-[var(--holdings-surface)] p-8">
            <div className="text-3xl font-bold md:text-4xl">{counts.farmers.toLocaleString()}</div>
            <div className="mt-2 text-xs text-[var(--holdings-text-muted)] md:text-sm">Farmer partnerships active</div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button className="rounded-full bg-[var(--holdings-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#e0c276]">Join Our Mission</button>
        </div>
      </section>
    </div>
  );
}
