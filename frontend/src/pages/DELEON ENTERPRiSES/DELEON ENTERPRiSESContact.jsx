export default function DeLeonEnterprisesContact() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-5xl font-bold mb-6">Contact DELEON ENTERPRiSES</h1>
        <p className="text-lg text-gray-700 mb-8">Reach our land acquisition team for bespoke site tours, investment briefings, and portfolio requests.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Office</h2>
            <p>DELEON ENTERPRiSES Tower, Nairobi</p>
            <p>hello@DELEON ENTERPRiSES.co.ke</p>
            <p>+254 700 110 220</p>
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Business hours</h2>
            <p>Mon–Fri: 08:00–18:00</p>
            <p>Sat: 09:00–14:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
