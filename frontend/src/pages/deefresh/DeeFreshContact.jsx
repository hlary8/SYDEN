export default function DeeFreshContact() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Contact DeeFresh</h1>
        <p className="text-lg text-gray-700 mb-8">Reach our customer care team for produce orders, seed inquiries, and farmer partnership discussions.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">General Inquiries</h2>
            <p>hello@deefresh.co.ke</p>
            <p>+254 700 330 440</p>
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-3">Partnerships</h2>
            <p>partners@deefresh.co.ke</p>
            <p>Bulk produce & seed requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
