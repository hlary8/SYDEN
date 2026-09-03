import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSEO } from '../../hooks/useSEO';

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const companySlides = [
  {
    id: 'deleon',
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109786/WhatsApp_Image_2026-08-14_at_15.30.15_1.jpg',
    title: 'DELEON Land',
    subtitle: 'Premium Land Stewardship'
  },
  {
    id: 'syden',
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788102143/IMG-20260814-WA0082.jpg',
    title: 'Syden Livestock',
    subtitle: 'Livestock Excellence'
  },
  {
    id: 'deefresh',
    image: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109791/WhatsApp_Image_2026-08-14_at_20.28.12.jpg',
    title: 'DeeFresh',
    subtitle: 'Harvest to Markets'
  }
];

const artGrowingDreamsPhotos = [

        'https://res.cloudinary.com/gcne2xno/image/upload/v1788109786/WhatsApp_Image_2026-08-14_at_15.30.15_1.jpg',
        'https://res.cloudinary.com/gcne2xno/image/upload/v1788109787/WhatsApp_Image_2026-08-14_at_15.30.15_3.jpg',
        'https://res.cloudinary.com/gcne2xno/image/upload/v1788105550/IMG-20260814-WA0052.jpg',
        'https://res.cloudinary.com/gcne2xno/image/upload/v1788109795/WhatsApp_Image_2026-08-14_at_15.30.14_1.jpg',
        'https://res.cloudinary.com/gcne2xno/image/upload/v1788109801/WhatsApp_Image_2026-08-14_at_15.30.14_3.jpg'


];

export default function DeLeonEnterprisesHome() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [companyIndex, setCompanyIndex] = useState(0);

  useSEO({
    title: 'DELEON | Land Opportunities in Kenya',
    description: 'DELEON offers agricultural and development land in Laikipia and Meru. Transparent pricing, clear ownership and direct access to land investors and entrepreneurs across Kenya.',
    canonical: 'https://deleon1.onrender.com/deleon',
    ogTitle: 'DELEON | Land Opportunities in Kenya',
    ogDescription: 'Land ownership opportunities in Laikipia and Meru counties, Kenya.',
    ogType: 'website'
  });

  // Auto-rotate "Art of Growing Dreams" photos every 6 seconds
  useEffect(() => {
    const photoInterval = setInterval(() => {
      setPhotoIndex(prev => (prev + 1) % artGrowingDreamsPhotos.length);
    }, 6000);
    return () => clearInterval(photoInterval);
  }, []);

  // Auto-rotate company carousel every 7 seconds
  useEffect(() => {
    const companyInterval = setInterval(() => {
      setCompanyIndex(prev => (prev + 1) % companySlides.length);
    }, 7000);
    return () => clearInterval(companyInterval);
  }, []);

  const goToPrevPhoto = () => setPhotoIndex(prev => (prev - 1 + artGrowingDreamsPhotos.length) % artGrowingDreamsPhotos.length);
  const goToNextPhoto = () => setPhotoIndex(prev => (prev + 1) % artGrowingDreamsPhotos.length);

  const goToPrevCompany = () => setCompanyIndex(prev => (prev - 1 + companySlides.length) % companySlides.length);
  const goToNextCompany = () => setCompanyIndex(prev => (prev + 1) % companySlides.length);

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)]">
      {/* Hero Section */}
      <section className="px-4 py-12 lg:px-8 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Land Opportunities in Kenya
              </h1>
              <p className="text-base lg:text-lg mb-8 text-gray-700">
                DELEON offers agricultural and development land in Laikipia and Meru. Transparent pricing, clear ownership and direct access to land entrepreneurs and investors across Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="lands" 
                  className="rounded-full bg-[var(--accent)] px-8 py-4 text-[var(--primary)] font-semibold hover:opacity-90 text-center transition"
                >
                  Browse Land Listings
                </Link>
                <Link 
                  to="about" 
                  className="rounded-full border border-[var(--accent)] px-8 py-4 text-[var(--text)] font-semibold hover:bg-[var(--accent)] hover:text-[var(--bg)] text-center transition"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* "Art of Growing Dreams" Slideshow */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative h-64 lg:h-96 rounded-3xl overflow-hidden bg-gray-200 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={artGrowingDreamsPhotos[photoIndex]}
                    alt="Art of Growing Dreams"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button 
                  onClick={goToPrevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  aria-label="Previous"
                >
                  <ArrowLeft />
                </button>
                <button 
                  onClick={goToNextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  aria-label="Next"
                >
                  <ArrowRight />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {artGrowingDreamsPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPhotoIndex(idx)}
                      className={`w-2 h-2 rounded-full transition ${idx === photoIndex ? 'bg-white' : 'bg-white/50'}`}
                      aria-label={`Go to photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Journey - Company Carousel */}
      <section className="px-4 py-16 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Companies</h2>
            <p className="text-gray-600">Explore our ecosystem of agricultural excellence</p>
          </div>

          {/* Company Carousel - Mobile Horizontal Scroll */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={companyIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden h-72 lg:h-96 cursor-pointer relative group"
                onClick={() => goToNextCompany()}
              >
                <img 
                  src={companySlides[companyIndex].image}
                  alt={companySlides[companyIndex].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {companySlides[companyIndex].title}
                  </h3>
                  <p className="text-white/90">{companySlides[companyIndex].subtitle}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              onClick={goToPrevCompany}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition"
              aria-label="Previous company"
            >
              <ArrowLeft />
            </button>
            <button 
              onClick={goToNextCompany}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition"
              aria-label="Next company"
            >
              <ArrowRight />
            </button>

            {/* Dot Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {companySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCompanyIndex(idx)}
                  className={`w-3 h-3 rounded-full transition ${idx === companyIndex ? 'bg-[var(--accent)]' : 'bg-gray-300'}`}
                  aria-label={`Go to company ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">Our Story in Motion</h2>
          
          <div className="relative rounded-3xl overflow-hidden bg-black h-72 lg:h-96 flex items-center justify-center group">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800" />
            
            {/* Play Button Overlay */}
            <button 
              className="relative z-10 w-20 h-20 bg-[var(--accent)]/80 hover:bg-[var(--accent)] rounded-full flex items-center justify-center transition group-hover:scale-110"
              aria-label="Play video"
            >
              <span className="text-white text-3xl ml-1">▶</span>
            </button>
            
            <p className="absolute top-6 left-6 text-white text-sm font-semibold opacity-75">
              {/* INSERT VIDEO URL HERE */}
            </p>
          </div>
        </div>
      </section>

      {/* Sustainability CTA Button - Mobile Only */}
      <section className="px-4 py-12 block lg:hidden">
        <div className="max-w-6xl mx-auto text-center">
          <Link
            to="/sustainability"
            className="inline-block w-full sm:w-auto rounded-full bg-gradient-to-r from-green-600 to-green-700 px-12 py-5 text-white font-semibold hover:from-green-700 hover:to-green-800 transition shadow-lg hover:shadow-xl"
          >
            Our Sustainability Commitment
          </Link>
        </div>
      </section>
    </div>
  );
}
