import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MegaMenu from '../portal/MegaMenu';
import NotificationBell from './NotificationBell';
import { useAuth } from '../../context/AuthContext';

export default function ParentNavbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const openMegaMenu = (section) => {
    setOpenMenu(section);
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-[36px] z-50 border-b border-[var(--holdings-border)] bg-[rgba(10,10,10,0.85)] backdrop-blur-xl">
        {/* Mobile layout */}
        <div className="md:hidden mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--holdings-text-muted)]">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => openMegaMenu('GROUP')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 hover:border-[var(--holdings-accent)] hover:text-white"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
          
          <Link to="/" className="text-sm font-serif uppercase tracking-[0.18em] text-[var(--holdings-text)] sm:tracking-[0.28em]">DeLeon</Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <button
                  onClick={async () => {
                    try {
                      await logout();
                    } catch (e) {
                      console.error('Logout failed', e);
                    }
                    navigate('/');
                  }}
                  aria-label="Logout"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-300 text-black font-semibold text-xs"
                >
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </button>
              </>
            ) : (
               <Link to="/press" className="hover:text-white transition-colors duration-300">PRESS</Link>
            )}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex mx-auto max-w-7xl items-center justify-between px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--holdings-text-muted)]">
          <div className="flex items-center gap-8">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => openMegaMenu('GROUP')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 hover:border-[var(--holdings-accent)] hover:text-white"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
            <Link to="/houses" className="hover:text-white transition-colors duration-300">COMPANIES</Link>
            <Link to="/talent" className="hover:text-white transition-colors duration-300">TALENT</Link>
            <Link to="/history" className="hover:text-white transition-colors duration-300">HISTORY</Link>
          </div>

          <Link to="/" className="text-xs font-serif uppercase tracking-[0.18em] text-[var(--holdings-text)] sm:text-sm sm:tracking-[0.3em]">D E L E O N</Link>

          <div className="flex items-center gap-8">
            <NotificationBell />
            <Link to="/sustainability" className="hover:text-white transition-colors duration-300">SUSTAINABILITY</Link>
          {/*<Link to="/history" className="hover:text-white transition-colors duration-300">HISTORY</Link> */}  
            <Link to="/global-presence" className="hover:text-white transition-colors duration-300"></Link>
            <Link to="/press" className="hover:text-white transition-colors duration-300">PRESS</Link>
            {user ? (
              <button
                onClick={async () => {
                  try {
                    await logout();
                  } catch (e) {
                    console.error('Logout failed', e);
                  }
                  navigate('/');
                }}
                aria-label="Logout"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-300 text-black font-semibold"
              >
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </button>
            ) : (
              <Link to="/auth/login" className="hover:text-white transition-colors duration-300">JOIN US</Link>
            )}
          </div>
        </div>
      </nav>
      {openMenu && <MegaMenu open={Boolean(openMenu)} activeSection={openMenu} onClose={() => setOpenMenu(null)} />}
    </>
  );
}
