export default function SydenFarmActivities() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Farm Activities</h1>
        <div className="space-y-6">
          {['Milking', 'Shearing', 'Feeding', 'Herding'].map((activity) => (
            <div key={activity} className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{activity}</h2>
                <span className="text-sm text-gray-500">March 2026</span>
              </div>
              <p className="text-gray-600">A detailed summary of the farm practice, the team involved, and the impact on livestock wellness.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
