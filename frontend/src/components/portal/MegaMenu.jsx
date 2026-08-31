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
            {['COMPANIES', 'JOIN US', 'DREAM MACHINE'].map((text) => (
              <Link key={text} to={text === 'COMPANIES' ? '/houses' : text === 'DREAM MACHINE' ? '/dream-machine' : text === 'JOIN US' ? '/auth/login' : `/${text.toLowerCase().replace(/ /g, '-')}`}
                className="block text-sm uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
                onClick={onClose}
              >
                {text}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-6">
              {[ 'PRESS',].map((text) => (
                <Link key={text} to={`/${text.toLowerCase().replace(/ /g, '-')}`} className="block text-sm uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors" onClick={onClose}>
                  {text}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-sm uppercase tracking-[0.2em] text-white/70">{activeSection === 'HOUSES' ? 'HOUSES' : 'GROUP'}</div>
            {(activeSection === 'HOUSES' ? ['OUR COMMITMENT IN ACTION', 'OUR ETHICS & COMPLIANCE APPROACH', 'FOR PEOPLE', 'FOR THE ENVIRONMENT', 'FOR PHILANTHROPY', 'ALL OUR ACTIONS'] : [ 'HISTORY', 'GLOBAL PRESENCE']).map((item) => (
              <Link key={item} to={item === 'HISTORY' ? '/history' : item === 'GLOBAL PRESENCE' ? '/global-presence' : '#'} className="block text-lg md:text-2xl font-light uppercase tracking-[0.15em] text-white/90 hover:text-[var(--holdings-accent)] transition-colors" onClick={(e) => {
                if (item === 'HISTORY' || item === 'GLOBAL PRESENCE') {
                  onClose();
                } else {
                  e.preventDefault();
                }
              }}>
                {item}
              </Link>
            ))}
            
            {/* Bottom Navigation Links */}
            <div className="border-t border-white/10 pt-6 mt-6 space-y-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/50">EXPLORE</div>
              {['SUSTAINABILITY', '', ''].map((item) => (
                <Link 
                  key={`footer-${item}`}
                  to={item === 'SUSTAINABILITY' ? '/sustainability' : item === 'HISTORY' ? '/history' : '/global-presence'}
                  className="block text-sm uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Highlight</p>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="h-48 md:h-56 bg-[url('https://res.cloudinary.com/gcne2xno/image/upload/v1788109786/WhatsApp_Image_2026-08-14_at_15.30.15_1.jpg')] bg-cover bg-center" />
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
            <div className="text-white/50">© 2026 DELEON ENTERPRISES</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
