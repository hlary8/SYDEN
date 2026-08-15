import { useEffect, useMemo, useState } from 'react';

const brandContent = {
  deleon: {
    name: 'DELEON',
    hero: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    summary: 'DELEON ENTERPRISES has grown from a land stewardship practice into a state of the art agricultural and property group united by stewardship, long-view investing, and a belief in responsible growth.',
    story: [
      'Founded on the conviction that fertile land is a lasting inheritance, DELEON ENTERPRISES has shaped a portfolio of premium assets that balance cultivation, conservation and value creation.',
      'Our MISSION is to protect the integrity of each acre while building resilient opportunities for families, communities and future generations.',
      'Our VISION is to anchor a modern African ecosystem where land is not merely acquired but respected, developed and preserved with precision.'
    ],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80', caption: 'Premium landscape stewardship' },
      { src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', caption: 'Curated land developments' },
      { src: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80', caption: 'Protected natural corridors' },
      { src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80', caption: 'Long-term investment value' },
      { src: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80', caption: 'Multi-purpose agricultural estates' },
      { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=80', caption: 'Future-ready land planning' }
    ]
  },
  syden: {
    name: 'Syden',
    hero: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1600&q=80',
    summary: 'Syden blends veterinary heritage with progressive herd management, producing healthy livestock and trusted farm systems rooted in care, science and craft.',
    story: [
      'Syden was built around a simple principle: healthy animals create stronger farms, communities and food systems.',
      'From vaccination programs and breeding strategy to pasture planning and farm management, our approach merges veterinary precision with generations of husbandry wisdom.',
      'Our vision is to make excellence in livestock health and welfare a daily standard across every farm we serve.'
    ],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', caption: 'Healthy livestock management' },
      { src: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80', caption: 'Daily farm life' },
      { src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80', caption: 'Veterinary care and wellness' },
      { src: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=900&q=80', caption: 'Pasture-based nutrition' },
      { src: 'https://images.unsplash.com/photo-1570042225831-d98fa7577c1a?auto=format&fit=crop&w=900&q=80', caption: 'Farm operations at scale' },
      { src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80', caption: 'Healthy herd culture' }
    ]
  },
  deefresh: {
    name: 'DeeFresh',
    hero: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc4a5?auto=format&fit=crop&w=1600&q=80',
    summary: 'DeeFresh carries a produce legacy built on trusted farmer partnerships, rich soil and a promise of freshness from the field to the table.',
    story: [
      'The DeeFresh story is rooted in the belief that beautiful produce begins with excellent relationships with growers, agronomists and communities.',
      'We partner with farmers to improve quality, strengthen supply chains and deliver produce with consistency, taste and integrity.',
      'Our vision is simple: every harvest should reflect freshness, trust and the promise of care from seed to shelf.'
    ],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc4a5?auto=format&fit=crop&w=900&q=80', caption: 'Fresh farm harvest' },
      { src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80', caption: 'Farm partners' },
      { src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80', caption: 'Premium produce selection' },
      { src: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80', caption: 'Seasonal freshness' },
      { src: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80', caption: 'Quality assurance' },
      { src: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=900&q=80', caption: 'Harvest to market' }
    ]
  }
};

const tabs = ['deleon', 'syden', 'deefresh'];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('deleon');
  const [lightbox, setLightbox] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const persisted = localStorage.getItem('deLeonFeaturedCompany');
    if (!persisted) {
      localStorage.setItem('deLeonFeaturedCompany', JSON.stringify({ index: 0, updatedAt: Date.now() }));
      return;
    }

    try {
      const parsed = JSON.parse(persisted);
      const oneDay = 24 * 60 * 60 * 1000;
      if (!parsed.updatedAt || Date.now() - parsed.updatedAt > oneDay) {
        const next = (parsed.index + 1) % tabs.length;
        setHighlightIndex(next);
        localStorage.setItem('deLeonFeaturedCompany', JSON.stringify({ index: next, updatedAt: Date.now() }));
        return;
      }
      setHighlightIndex(parsed.index || 0);
    } catch {
      localStorage.setItem('deLeonFeaturedCompany', JSON.stringify({ index: 0, updatedAt: Date.now() }));
    }
  }, []);

  const activeBrand = brandContent[activeTab];
  const featuredBrand = brandContent[tabs[highlightIndex]];
  const galleryCells = useMemo(() => activeBrand.gallery, [activeBrand]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="relative h-[420px] overflow-hidden">
        <img src={activeBrand.hero} alt={activeBrand.name} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl uppercase tracking-[0.16em] text-white md:text-7xl">{activeBrand.name}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-2 border-b border-[#C9A96E]/30 pb-3">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm uppercase tracking-[0.18em] transition ${activeTab === tab ? 'border-b-2 border-[#C9A96E] text-[#C9A96E]' : 'text-white/70 hover:text-white'}`}
            >
              {brandContent[tab].name}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A96E]">Our story</p>
            <p className="text-lg leading-8 text-white/80">{activeBrand.summary}</p>
            {activeBrand.story.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-white/70">{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {galleryCells.slice(0, 4).map((item) => (
              <button
                key={item.caption}
                type="button"
                onClick={() => setLightbox(item)}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5"
              >
                <img src={item.src} alt={item.caption} className="h-40 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-3 text-left text-[10px] uppercase tracking-[0.18em] text-white/90">{item.caption}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#111111] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A96E]">Featured House</p>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">Art of the farm</span>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#C9A96E]/30 bg-[#171717]">
            <div className="grid md:grid-cols-2">
              <img src={featuredBrand.hero} alt={featuredBrand.name} className="h-72 w-full object-cover md:h-full" loading="lazy" />
              <div className="flex flex-col justify-center p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[#C9A96E]">Highlight</p>
                <h2 className="mt-4 font-serif text-3xl md:text-5xl">{featuredBrand.name}</h2>
                <p className="mt-5 max-w-md text-base leading-8 text-white/70">{featuredBrand.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-[#C9A96E]/40 bg-black" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setLightbox(null)} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/60 text-2xl text-white">×</button>
            <img src={lightbox.src} alt={lightbox.caption} className="max-h-[80vh] w-full object-contain" loading="lazy" />
            <div className="border-t border-white/10 bg-[#111111] p-4 text-sm uppercase tracking-[0.18em] text-[#C9A96E]">{lightbox.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
}
