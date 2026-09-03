import { useSEO } from '../../hooks/useSEO';

export default function DeeFreshAbout() {
  useSEO({
    title: 'About DeeFresh | Farming & Fresh Produce Kenya',
    description: 'Learn about DeeFresh, connecting farmers and customers with fresh produce, agronomical consulting and market connections in Kenya. Supporting farming and seed supply.',
    canonical: 'https://deleon1.onrender.com/deefresh/about',
    ogTitle: 'About DeeFresh | Kenya',
    ogDescription: 'DeeFresh: Fresh produce and farming solutions in Kenya.'
  });

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">About DeeFresh</h1>
        <p className="text-lg text-gray-700 leading-8 mb-6">DeeFresh connects farmers, producers and customers across Kenya through fresh produce, agronomical consulting and market connections. We support farming practices, provide seed supplies and facilitate direct relationships between growers and buyers.</p>
        <p className="text-lg text-gray-700 leading-8">Our focus is on reliable produce sourcing, farming support and transparent market connections that benefit both producers and customers. DeeFresh works with farming partners to deliver quality fresh produce and sustainability in Kenya's agricultural market.</p>
      </div>
    </div>
  );
}
