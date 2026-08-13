export default function DeeFreshFarmerApplications() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Farmer Applications</h1>
        <div className="space-y-4">
          {['Joseph Njoroge', 'Sarah Ndegwa', 'Wanjiru Kimani'].map((applicant) => (
            <div key={applicant} className="rounded-3xl border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold mb-2">{applicant}</h2>
              <p className="text-sm text-gray-500">Application status: Pending review</p>
              <button className="mt-4 rounded-full bg-[#FFD700] px-6 py-3 text-[#673147] font-semibold">Review application</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
