import { Link } from 'react-router-dom';

export default function DeLeonEnterprisesAdminDashboard() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">DELEON Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {[
            { title: 'Upload Land', link: '/deleon/admin/upload' },
            { title: 'View Inquiries', link: '/deleon/admin/inquiries' },
            { title: 'Analytics', link: '/deleon/admin' }
          ].map((card) => (
            <Link key={card.title} to={card.link} className="rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition">
              <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
              <p className="text-sm text-gray-500">Manage and monitor the DELEON land portfolio.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
