import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { useSEO } from '../hooks/useSEO';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'DELEON ENTERPRISES',
  'url': 'https://deleon1.onrender.com',
  'description': 'Land opportunities, veterinary services and fresh produce across Kenya.',
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'Customer Service',
    'telephone': '+254-700-110-220'
  }
};

export default function HomePage() {
  const { brand, themes } = useTheme();
  const theme = themes[brand];

  useSEO({
    title: 'DELEON ENTERPRISES | Land, Livestock & Fresh Produce Kenya',
    description: 'DELEON ENTERPRISES: Three pillars of agricultural excellence. Land opportunities, veterinary services and fresh produce across Kenya. DELEON land, Syden livestock, DeeFresh farming.',
    canonical: 'https://deleon1.onrender.com/',
    ogTitle: 'DELEON ENTERPRISES | Land, Livestock & Fresh Produce Kenya',
    ogDescription: 'Three pillars. One vision. Land, livestock and harvest.',
    ogType: 'website',
    structuredData: organizationSchema
  });

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
            DELEON ENTERPRISES
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
          >
            Three pillars. One vision. Land, livestock and harvest.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button>Explore Land</Button>
            <Button variant="outline">Learn More</Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Brands Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className={`${theme.headingFont} text-4xl font-bold text-center mb-12`}>Our Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'DELEON', desc: 'Land opportunities in Laikipia and Meru, Kenya', icon: '🏞️' },
            { name: 'Syden', desc: 'Veterinary services, livestock and agricultural solutions', icon: '🐄' },
            { name: 'DeeFresh', desc: 'Farming, agronomical support and fresh produce', icon: '🍅' }
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
