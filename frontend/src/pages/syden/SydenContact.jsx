export default function SydenContact() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Contact Syden</h1>
        <p className="text-lg text-gray-700 mb-8">Contact our vet care and livestock team for farm consultations, emergency support, and partnership enquiries.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Office</h2>
            <p>Rongai Farm House</p>
            <p>support@syden.ag</p>
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Hotline</h2>
            <p>+254 700 220 330</p>
            <p>24/7 veterinary support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
