import { useSEO } from '../../hooks/useSEO';

export default function PortalAbout() {
  useSEO({
    title: 'About DELOEN ENTERPRISES LIMITED | Land, Livestock & Fresh Produce',
    description: 'DELOEN ENTERPRISES LIMITED is the parent company uniting premium land, livestock, and fresh produce brands. Three pillars - DeLoen land, Syden livestock and veterinary, DeeFresh farming.',
    canonical: 'https://deleon1.onrender.com/about',
    ogTitle: 'About DELOEN ENTERPRISES LIMITED',
    ogDescription: 'Three pillars. One vision. Land, livestock and harvest.'
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-4 py-12">
      <div className="max-w-5xl mx-auto rounded-3xl bg-[#111111] p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">About DELOEN ENTERPRISES LIMITED</h1>
        <p className="text-lg leading-8 text-gray-300">DELOEN ENTERPRISES LIMITED is the parent company uniting premium land, livestock, and fresh produce brands under one portfolio. Our focus is on sustainable growth, premium experiences, and cross-sector investment excellence.</p>
      </div>
    </div>
  );
}
