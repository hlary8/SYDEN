import React from 'react';
import { motion } from 'framer-motion';

/**
 * Luxury button with hover and click animations
 */
export function Button({ children, onClick, className = '', variant = 'primary', ...props }) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300';
  const variants = {
    primary: 'bg-gold text-dark hover:shadow-lg hover:scale-105',
    secondary: 'bg-charcoal text-ivory hover:bg-opacity-90',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-charcoal'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * Animated text counter
 */
export function AnimatedCounter({ value, duration = 1 }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = value / (duration * 60);
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

/**
 * Loading skeleton with brand-aware styling
 */
export function Skeleton({ width = 'w-full', height = 'h-4', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-shimmer mb-2`}
        />
      ))}
    </>
  );
}

/**
 * Modal overlay with Framer Motion
 */
export function Modal({ isOpen, onClose, children, title }) {
  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      {isOpen && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {title && <h2 className="text-2xl font-playfair font-bold mb-4">{title}</h2>}
            {children}
          </div>
        </motion.div>
      )}
    </>
  );
}

import React from 'react';
