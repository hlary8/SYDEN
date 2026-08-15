import { Link } from 'react-router-dom';

export default function DeeFreshAdminDashboard() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">DeeFresh Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Add Produce', link: '/deefresh/admin/produce-upload' },
            { title: 'Farmer Applications', link: '/deefresh/admin/farmer-applications' },
            { title: 'Orders', link: '/deefresh/admin' }
          ].map((item) => (
            <Link key={item.title} to={item.link} className="rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition">
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500">Manage DeeFresh operations and supply chain.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
