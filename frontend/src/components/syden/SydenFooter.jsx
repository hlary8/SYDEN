import { Link } from 'react-router-dom';

export default function SydenFooter() {
  return (
    <footer className="bg-[#2F4F4F] text-[#FFFDD0] py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-3">Syden</h3>
          <p className="text-sm text-[#FFFDD0]/80">Organic livestock care, veterinary trust, and farm life stewardship.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-[#FFFDD0]/80">
            <li><Link to="/syden/livestock" className="hover:text-white">Livestock</Link></li>
            <li><Link to="/syden/veterinary" className="hover:text-white">Veterinary</Link></li>
            <li><Link to="/syden/farm-activities" className="hover:text-white">Farm Activities</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p className="text-sm text-[#FFFDD0]/80">support@syden.ag</p>
          <p className="text-sm text-[#FFFDD0]/80">+254 700 220 330</p>
        </div>
      </div>
    </footer>
  );
}
