import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'GROUP', to: '/about', category: 'main', items: ['LEADERSHIP', 'GOVERNANCE', 'HISTORY', 'GLOBAL PRESENCE'] },
  { label: 'HOUSES', to: '/houses', category: 'main', items: ['OUR COMMITMENT IN ACTION', 'OUR ETHICS & COMPLIANCE APPROACH', 'FOR PEOPLE', 'FOR THE ENVIRONMENT', 'FOR PHILANTHROPY', 'ALL OUR ACTIONS'] }
];

const footerItems = ['Facebook', 'Instagram', 'YouTube', 'Pinterest', 'LinkedIn', 'X', 'TikTok'];

export default function MegaMenu({ open, onClose, activeSection = 'GROUP' }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 text-white overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      exit={{ opacity: 0 }}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: open ? 0 : 20, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative mx-auto flex flex-col min-h-screen max-w-[1400px] px-6 py-10"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <button onClick={onClose} className="text-sm uppercase tracking-[0.15em] text-white/80 hover:text-white">
            × close
          </button>
          <div className="text-sm uppercase tracking-[0.15em] text-white/80">search</div>
        </div>
        
        <div className="grid flex-1 gap-6 md:gap-10 py-10 lg:grid-cols-[1.2fr_1.8fr_1.5fr]">
          <div className="space-y-6 border-r border-white/10 pr-8">
            {['GROUP', 'COMMITMENTS', 'HOUSES', 'JOIN US', 'DREAM MACHINE'].map((text) => (
              <Link key={text} to={text === 'HOUSES' ? '/houses' : text === 'DREAM MACHINE' ? '/dream-machine' : `/${text.toLowerCase().replace(/ /g, '-')}`}
                className="block text-sm uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
                onClick={onClose}
              >
                {text}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-6">
              {['INVESTORS', 'PRESS', 'SUPPLIERS', 'CANDIDATE PORTAL'].map((text) => (
                <Link key={text} to={`/${text.toLowerCase().replace(/ /g, '-')}`} className="block text-sm uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors" onClick={onClose}>
                  {text}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-sm uppercase tracking-[0.2em] text-white/70">{activeSection === 'HOUSES' ? 'HOUSES' : 'GROUP'}</div>
            {(activeSection === 'HOUSES' ? ['OUR COMMITMENT IN ACTION', 'OUR ETHICS & COMPLIANCE APPROACH', 'FOR PEOPLE', 'FOR THE ENVIRONMENT', 'FOR PHILANTHROPY', 'ALL OUR ACTIONS'] : ['LEADERSHIP', 'GOVERNANCE', 'HISTORY', 'GLOBAL PRESENCE']).map((item) => (
              <Link key={item} to="#" className="block text-lg md:text-2xl font-light uppercase tracking-[0.15em] text-white/90 hover:text-[var(--holdings-accent)] transition-colors" onClick={(e) => e.preventDefault()}>
                {item}
              </Link>
            ))}
          </div>

          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Highlight</p>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="h-48 md:h-56 bg-[url('https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
              <div className="p-6">
                <p className="text-sm uppercase tracking-[0.15em] text-white/70">Featured House</p>
                <h3 className="mt-3 text-xl md:text-2xl font-semibold">A Legacy of Crafted Growth</h3>
                <Link to="/houses" onClick={onClose} className="mt-4 inline-block text-sm uppercase tracking-[0.12em] text-[var(--holdings-accent)] hover:text-white transition-colors">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 mt-auto">
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between text-sm uppercase tracking-[0.15em] text-white/60">
            <div className="flex flex-wrap gap-4">{footerItems.map((item) => <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>)}</div>
            <div className="text-white/50">© 2026 DELEON ENTERPRiSES Holdings</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
