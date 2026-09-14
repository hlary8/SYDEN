import { useSEO } from '../../hooks/useSEO';

export default function DeLeonEnterprisesAbout() {
  useSEO({
    title: 'About DeLoen | Land Business in Kenya',
    description: 'Learn about DeLoen, a land business in Kenya connecting landowners and investors with agricultural and development land opportunities in Laikipia and Meru.',
    canonical: 'https://deleon1.co.ke/deleon/about',
    ogTitle: 'About DeLoen | Land Business Kenya',
    ogDescription: 'DeLoen offers transparent land transactions and clear ownership transfers in Kenya.'
  });

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-5xl font-bold mb-6">About DELOEN</h1>
        <p className="text-lg text-gray-700 leading-8 mb-6">DELOEN ENTERPRISES LTD. is a land business operating in Kenya, connecting landowners and investors with agricultural and development land opportunities in Laikipia and Meru counties.</p>
        <p className="text-lg text-gray-700 leading-8 mb-6">We provide transparent information about available properties, facilitate direct communication between parties, and ensure clear ownership transfers for land transactions across Kenya.</p>
        <p className="text-lg text-gray-700 leading-8">Whether you're looking for agricultural land, development plots, or investment opportunities, DeLoen offers a straightforward path to Kenya's land market.</p>
      </div>
    </div>
  );
}
