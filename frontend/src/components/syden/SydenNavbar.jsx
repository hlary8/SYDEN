import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SydenNavbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-[rgba(135,168,120,0.95)] backdrop-blur-md border-b border-[rgba(226,114,91,0.18)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-slate-900">
        <Link to="/syden" className="text-xl font-bold tracking-wide text-[#2F4F4F]">Syden</Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/syden" className="hover:text-[#E2725B] transition-colors">Home</Link>
          <Link to="/syden/livestock" className="hover:text-[#E2725B] transition-colors">Livestock</Link>
          <Link to="/syden/veterinary" className="hover:text-[#E2725B] transition-colors">Veterinary</Link>
          <Link to="/syden/farm-activities" className="hover:text-[#E2725B] transition-colors">Farm Life</Link>
          <Link to="/syden/about" className="hover:text-[#E2725B] transition-colors">About</Link>
          {user?.role === 'admin' && (
            <Link to="/syden/admin" className="px-4 py-2 rounded-full bg-[#E2725B] text-white font-semibold hover:bg-opacity-90 transition-colors">Admin</Link>
          )}
          <Link to="/syden/contact" className="px-4 py-2 rounded-full bg-[#E2725B] text-white font-semibold hover:bg-opacity-90 transition-colors">Contact</Link>
          <Link to="/" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Back to Holdings</Link>
        </div>
      </div>
    </nav>
  );
}
