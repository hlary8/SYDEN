import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';

export default function HomePage() {
  const { brand, themes } = useTheme();
  const theme = themes[brand];

  return (
    <div className={theme.bodyFont}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: theme.light, color: theme.primary }}
      >
        <div className="max-w-2xl text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`${theme.headingFont} text-6xl font-bold mb-6`}
          >
            Welcome to DELEON ENTERPRISES Ecosystem
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
          >
            Three brands. One powerful platform.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button>Explore Lands</Button>
            <Button variant="outline">Learn More</Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Brands Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className={`${theme.headingFont} text-4xl font-bold text-center mb-12`}>Our Brands</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'DELEON ENTERPRiSES', desc: 'Premium Land Acquisition', icon: '🏞️' },
            { name: 'Syden', desc: 'Livestock & Farm Services', icon: '🐄' },
            { name: 'DeeFresh', desc: 'Fresh Produce Marketplace', icon: '🍅' }
          ].map((brand, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="text-4xl mb-4">{brand.icon}</div>
              <h3 className={`${theme.headingFont} text-2xl font-bold mb-2`}>{brand.name}</h3>
              <p className="text-gray-600">{brand.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
