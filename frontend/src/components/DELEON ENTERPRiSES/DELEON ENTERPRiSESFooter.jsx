import { Link } from 'react-router-dom';

export default function DeLeonEnterprisesFooter() {

     const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--primary)] text-[var(--bg)] py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-3">DELEON</h3>
          <p className="text-sm text-[var(--bg)]/80">Land opportunities in Kenya. Agricultural and development land in Laikipia and Meru counties.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-[var(--bg)]/80">
            <li><Link to="/deleon" className="hover:text-yellow-300">Home</Link></li>
            <li><Link to="/deleon/lands" className="hover:text-yellow-300">Land Listings</Link></li>
            <li><Link to="/deleon/about" className="hover:text-yellow-300">About</Link></li>
            <li><Link to="/deleon/contact" className="hover:text-yellow-300">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p className="text-sm text-[var(--bg)]/80">inquiries@deleon.co.ke</p>
          <p className="text-sm text-[var(--bg)]/80">+254 700 110 220</p>
          <p className="text-sm text-[var(--bg)]/80 mt-4">© {year} DELEON ENTERPRISES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
