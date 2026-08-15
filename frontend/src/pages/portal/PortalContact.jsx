export default function PortalContact() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-4 py-12">
      <div className="max-w-5xl mx-auto rounded-3xl bg-[#111111] p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Contact DELEON</h1>
        <p className="text-lg leading-8 text-gray-300 mb-6">For investor relations, corporate enquiries, and media requests, contact the DELEON ENTERPRISES headquarters.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[#191919] p-6">
            <h2 className="text-xl font-semibold mb-3">Corporate</h2>
            <p>investors@DELEON ENTERPRISES.com</p>
            <p>+254 700 000 000</p>
          </div>
          <div className="rounded-3xl bg-[#191919] p-6">
            <h2 className="text-xl font-semibold mb-3">Head Office</h2>
            <p>DELEON ENTERPRISES Tower, Nairobi</p>
            <p>Monday - Friday, 8am - 6pm</p>
          </div>
        </div>
      </div>
    </div>
  );
}
