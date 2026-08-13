import { Link } from 'react-router-dom';

export default function ParentFooter() {
  return (
    <footer className="bg-[#0B0B0B] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold mb-3">DELEON ENTERPRiSES Holdings</h3>
          <p className="text-sm text-gray-400">Cultivating excellence across land, livestock, and fresh produce.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/DELEON ENTERPRiSES" className="hover:text-white">DELEON ENTERPRiSES</Link></li>
            <li><Link to="/syden" className="hover:text-white">Syden</Link></li>
            <li><Link to="/deefresh" className="hover:text-white">DeeFresh</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">hello@DELEON ENTERPRiSESholdings.com</p>
          <p className="text-sm text-gray-400">+254 700 000 000</p>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
        © 2026 DELEON ENTERPRiSES Holdings. All rights reserved.
      </div>
    </footer>
  );
}
