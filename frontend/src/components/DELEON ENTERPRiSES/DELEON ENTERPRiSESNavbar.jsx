import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function DeLeonEnterprisesNavbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-[rgba(10,47,28,0.95)] backdrop-blur-md border-b border-[rgba(212,175,55,0.12)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-white">
        <Link to="/deleon" className="text-xl font-bold tracking-wide">DELEON</Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/deleon" className="hover:text-yellow-300 transition-colors">Home</Link>
          <Link to="/deleon/lands" className="hover:text-yellow-300 transition-colors">Lands</Link>
          <Link to="/deleon/about" className="hover:text-yellow-300 transition-colors">About</Link>
          <Link to="/deleon/contact" className="hover:text-yellow-300 transition-colors">Contact</Link>
          {user?.role === 'admin' && (
            <Link to="/deleon/admin" className="px-4 py-2 rounded-full bg-yellow-300 text-black font-semibold hover:bg-yellow-400 transition-colors">Admin</Link>
          )}
          <Link to="/" className="text-sm text-gray-200 hover:text-white transition-colors">Back to DELEON</Link>
        </div>
      </div>
    </nav>
  );
}
