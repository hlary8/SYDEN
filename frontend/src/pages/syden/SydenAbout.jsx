import { useSEO } from '../../hooks/useSEO';

export default function SydenAbout() {
  useSEO({
    title: 'About Syden | Veterinary & Livestock Services Kenya',
    description: 'Learn about Syden, providing veterinary services, livestock management and agricultural solutions for farmers in Kenya. Based at Syden Pastoral Farm.',
    canonical: 'https://deleon1.onrender.com/syden/about',
    ogTitle: 'About Syden | Kenya',
    ogDescription: 'Veterinary services and livestock management across Kenya.'
  });

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">About Syden</h1>
        <p className="text-lg text-gray-700 leading-8 mb-6">Syden provides veterinary services, livestock management and agricultural solutions for farmers and producers in Kenya. We support animal health, farm productivity and agricultural development through professional veterinary care and farm guidance.</p>
        <p className="text-lg text-gray-700 leading-8">Our services include veterinary consultations, livestock monitoring, farm activity tracking, and connections to agricultural suppliers and resources. Syden Pastoral Farm is our operational base for veterinary and livestock services across Kenya.</p>
      </div>
    </div>
  );
}
