import { useSEO } from '../../hooks/useSEO';

export default function DeLeonEnterprisesContact() {
  useSEO({
    title: 'Contact DELEON | Land Inquiries Kenya',
    description: 'Contact the DELEON land team with questions about available properties, listings and land opportunities in Laikipia and Meru, Kenya.',
    canonical: 'https://deleon1.onrender.com/deleon/contact',
    ogTitle: 'Contact DELEON | Land Kenya',
    ogDescription: 'Reach DELEON for land opportunity inquiries.'
  });

  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-5xl font-bold mb-6">Contact DELEON</h1>
        <p className="text-lg text-gray-700 mb-8">Reach the DELEON land team with questions about available properties, listings and land opportunities in Laikipia and Meru.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Inquiries</h2>
            <p>DELEON Land Team</p>
            <p>inquiries@deleon.co.ke</p>
            <p>+254 700 110 220</p>
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Hours</h2>
            <p>Mon–Fri: 08:00–18:00</p>
            <p>Sat: 09:00–14:00</p>
            <p>Nairobi, Kenya</p>
          </div>
        </div>
      </div>
    </div>
  );
}
