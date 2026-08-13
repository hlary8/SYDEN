import { Link } from 'react-router-dom';

export default function DeLeonEnterprisesFooter() {
  return (
    <footer className="bg-[var(--primary)] text-[var(--bg)] py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-3">DELEON ENTERPRiSES</h3>
          <p className="text-sm text-[var(--bg)]/80">Premium land acquisitions with architectural luxury and investment-grade service.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-[var(--bg)]/80">
            <li><Link to="/DELEON ENTERPRiSES/lands" className="hover:text-yellow-300">Lands</Link></li>
            <li><Link to="/DELEON ENTERPRiSES/about" className="hover:text-yellow-300">About</Link></li>
            <li><Link to="/DELEON ENTERPRiSES/contact" className="hover:text-yellow-300">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p className="text-sm text-[var(--bg)]/80">inquiries@DELEON ENTERPRiSES.co.ke</p>
          <p className="text-sm text-[var(--bg)]/80">+254 700 110 220</p>
        </div>
      </div>
    </footer>
  );
}
