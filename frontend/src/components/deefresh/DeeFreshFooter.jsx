import { Link } from 'react-router-dom';

export default function DeeFreshFooter() {

       const year = new Date().getFullYear();
  return (
    <footer className="bg-[#FF6347] text-[#F5FFFA] py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-3">DeeFresh</h3>
          <p className="text-sm text-[#F5FFFA]/90">Fresh produce, farmer partnerships, and premium seeds curated daily.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-[#F5FFFA]/90">
            <li><Link to="/deefresh/produce" className="hover:text-white">Produce</Link></li>
            <li><Link to="/deefresh/farmers" className="hover:text-white">Farmers</Link></li>
            <li><Link to="/deefresh/seeds" className="hover:text-white">Seeds</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p className="text-sm text-[#F5FFFA]/90">hello@deefresh.co.ke</p>
          <p className="text-sm text-[#F5FFFA]/90">+254 700 330 440</p>
           © {year} DeeFresh. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
