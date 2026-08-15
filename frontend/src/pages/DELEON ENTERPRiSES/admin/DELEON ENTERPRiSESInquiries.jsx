export default function DeLeonEnterprisesInquiries() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Land Inquiries</h1>
        <div className="space-y-4">
          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Pending inquiry from John Doe</p>
            <p className="font-semibold mt-2">Interested in Riverfront Reserve</p>
            <p className="mt-3 text-sm text-gray-600">"Please contact me with the full site specs and access routes."</p>
          </div>
          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Pending inquiry from Mary Atieno</p>
            <p className="font-semibold mt-2">Looking for a farm near Nairobi</p>
            <p className="mt-3 text-sm text-gray-600">"Need site visit availability this month."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
