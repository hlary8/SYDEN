import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export function Navbar() {
  const { brand, dispatch, themes } = useTheme();
  const { user, logout } = useAuth();
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentTheme = themes[brand];

  const switchBrand = (newBrand) => {
    dispatch({ type: 'SET_BRAND', payload: newBrand });
    setBrandDropdownOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: currentTheme.light, borderBottom: `2px solid ${currentTheme.primary}` }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${currentTheme.headingFont} text-2xl font-bold`}
          style={{ color: currentTheme.primary }}
        >
          DELEON
        </motion.div>

        {/* Brand Switcher */}
        <div className="relative">
          <motion.button
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="px-4 py-2 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: currentTheme.accent, color: currentTheme.dark }}
          >
            {brand.charAt(0).toUpperCase() + brand.slice(1)}
          </motion.button>

          <AnimatePresence>
            {brandDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden"
              >
                {Object.keys(themes).map((b) => (
                  <motion.button
                    key={b}
                    onClick={() => switchBrand(b)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      b === brand ? 'font-bold' : ''
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="px-4 py-2 rounded-lg font-semibold flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary, color: currentTheme.light, width: '40px', height: '40px', padding: 0 }}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden"
                  >
                    <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </a>
                    {user.role === 'admin' && (
                      <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">
                        Dashboard
                      </a>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button variant="outline">Login</Button>
              <Button>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
