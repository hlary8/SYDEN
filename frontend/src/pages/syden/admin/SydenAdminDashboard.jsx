import { Link } from 'react-router-dom';

export default function SydenAdminDashboard() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Syden Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Add Livestock', link: '/syden/admin/livestock-upload' },
            { title: 'Moderate Comments', link: '/syden/admin/comment-moderation' },
            { title: 'View Activity', link: '/syden/admin' }
          ].map((item) => (
            <Link key={item.title} to={item.link} className="rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition">
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500">Manage Syden content and community activity.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
