import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DeeFreshNavbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-[rgba(255,99,71,0.95)] backdrop-blur-md border-b border-[rgba(255,215,0,0.18)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-[#673147]">
        <Link to="/deefresh" className="text-xl font-bold tracking-wide">DeeFresh</Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/deefresh" className="hover:text-[#FFD700] transition-colors">Home</Link>
          <Link to="/deefresh/produce" className="hover:text-[#FFD700] transition-colors">Produce</Link>
          <Link to="/deefresh/farmers" className="hover:text-[#FFD700] transition-colors">Farmers</Link>
          <Link to="/deefresh/seeds" className="hover:text-[#FFD700] transition-colors">Seeds</Link>
          <Link to="/deefresh/about" className="hover:text-[#FFD700] transition-colors">About</Link>
          {user?.role === 'admin' && (
            <Link to="/deefresh/admin" className="px-4 py-2 rounded-full bg-[#FFD700] text-[#673147] font-semibold hover:bg-opacity-90 transition-colors">Admin</Link>
          )}
          <Link to="/deefresh/contact" className="px-4 py-2 rounded-full bg-[#FFD700] text-[#673147] font-semibold hover:bg-opacity-90 transition-colors">Contact</Link>
          <Link to="/" className="text-sm text-[#673147]/80 hover:text-[#673147] transition-colors">Back to Holdings</Link>
        </div>
      </div>
    </nav>
  );
}
