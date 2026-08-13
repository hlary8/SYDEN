import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DeLeonEnterprisesHome() {
  return (
    <div className="bg-[var(--bg)] min-h-screen px-4 py-12 text-[var(--text)]">
      <section className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white shadow-2xl p-10">
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>DELEON ENTERPRiSES Land</h1>
          <p className="text-lg mb-8">Discover premium land listings built for long-term investment and generational legacy.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="lands" className="rounded-full bg-[var(--accent)] px-8 py-4 text-[var(--primary)] font-semibold hover:opacity-90">Browse Lands</Link>
            <Link to="about" className="rounded-full border border-[var(--accent)] px-8 py-4 text-[var(--text)] font-semibold hover:bg-[var(--accent)] hover:text-[var(--bg)]">Learn more</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
