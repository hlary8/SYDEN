import { useSEO } from '../../hooks/useSEO';

export default function DeLeonEnterprisesAbout() {
  useSEO({
    title: 'About DELEON | Land Business in Kenya',
    description: 'Learn about DELEON, a land business in Kenya connecting landowners and investors with agricultural and development land opportunities in Laikipia and Meru.',
    canonical: 'https://deleon1.onrender.com/deleon/about',
    ogTitle: 'About DELEON | Land Business Kenya',
    ogDescription: 'DELEON offers transparent land transactions and clear ownership transfers in Kenya.'
  });

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-5xl font-bold mb-6">About DELEON</h1>
        <p className="text-lg text-gray-700 leading-8 mb-6">DELEON is a land business operating in Kenya, connecting landowners and investors with agricultural and development land opportunities in Laikipia and Meru counties.</p>
        <p className="text-lg text-gray-700 leading-8 mb-6">We provide transparent information about available properties, facilitate direct communication between parties, and ensure clear ownership transfers for land transactions across Kenya.</p>
        <p className="text-lg text-gray-700 leading-8">Whether you're looking for agricultural land, development plots, or investment opportunities, DELEON offers a straightforward path to Kenya's land market.</p>
      </div>
    </div>
  );
}
