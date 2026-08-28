import { Link } from 'react-router-dom';

export default function DeeFreshAdminDashboard() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">DeeFresh Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Add Produce', link: '/deefresh/admin/produce-upload', icon: '🥕' },
            { title: 'Farmer Applications', link: '/deefresh/admin/farmer-applications', icon: '👨‍🌾' },
            { title: 'Seeds Management', link: '/deefresh/admin/seeds', icon: '🌱' }
          ].map((item) => (
            <Link key={item.title} to={item.link} className="rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500">Manage DeeFresh operations</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
