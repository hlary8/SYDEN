import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PortalHome() {
  return (
    <div className="min-h-screen bg-[var(--holdings-bg)] text-[var(--holdings-text)]">
      <section className="grid min-h-screen grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
        <div className="relative flex flex-col justify-between px-8 py-24 lg:px-24">
          <div className="space-y-8">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-accent)]">Cultivating Excellence</div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-[clamp(3rem,6vw,6rem)] font-serif uppercase tracking-[0.15em] leading-[0.9]">THE ART OF<br />GROWING DREAMS</h1>
              <p className="max-w-xl text-base leading-8 text-[var(--holdings-text-muted)]">From fertile soil to flourishing enterprises, DELEON ENTERPRiSES Holdings crafts legacies across land, livestock, and harvest.</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/houses" className="inline-flex items-center justify-center rounded-full border border-white px-10 py-4 text-sm uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-black">
                Discover our houses →
              </Link>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <span className="block h-[2px] w-14 bg-[var(--holdings-accent)]"></span>
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--holdings-text-muted)]">Scroll</span>
          </div>
        </div>
        <div className="relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,169,110,0.15),_transparent_35%)]" />
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/tmcloud1/image/upload/v1786698429/WhatsApp_Image_2026-08-14_at_11.25.33_r2o5fu.jpg')] bg-cover bg-center" />
        </div>
      </section>

      <section className="border-t border-[var(--holdings-border)] px-8 py-20 lg:px-24 lg:py-24">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col gap-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-text-muted)]">DELEON ENTERPRiSES Holdings</div>
            <div className="flex flex-wrap items-center gap-3 text-3xl font-serif uppercase tracking-[0.12em] sm:text-4xl lg:text-5xl">
              <span className="font-light">DEL</span>
              <span className="font-bold">EON</span>
              <span className="font-light">HIGHLIGHTS</span>
            </div>
            <div className="h-1 w-20 bg-[var(--holdings-accent)]"></div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: '15,000+ Acres Under Management', label: 'LAND', href: '/deleon', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698429/WhatsApp_Image_2026-08-14_at_11.25.33_r2o5fu.jpg' },
              { title: 'Sustainable Farming Since 2008', label: 'LEGACY', href: '/about', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1771536702/farmlink_posts/nofkjggsubvr39t3mii1.jpg' },
              { title: 'From Farm to Global Markets', label: 'REACH', href: '/deefresh', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698435/WhatsApp_Image_2026-08-14_at_11.25.35_2_fkx7yb.jpg' }
            ].map((card) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden rounded-none bg-[var(--holdings-surface)] p-8">
                <div className="h-56 rounded-none bg-black/20 mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${card.image})` }} />
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-text-muted)]">{card.label}</p>
                <h2 className="mt-4 text-2xl font-semibold leading-tight">{card.title}</h2>
                <Link to={card.href} className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--holdings-accent)]">
                  Read more →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F0E8] px-8 py-16 lg:py-24 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B5F49]">OUR HOUSES</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {['DeLeon', 'Syden', 'DeeFresh'].map((name) => (
              <Link key={name} to={name === 'DeLeon' ? '/deleon' : name === 'Syden' ? '/syden' : '/deefresh'} className="flex h-24 w-24 items-center justify-center rounded-full border border-[#DDD] bg-white text-sm font-semibold uppercase tracking-[0.18em] text-[#111] transition duration-300 hover:scale-110 hover:shadow-2xl">
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--holdings-bg)] px-8 py-16 lg:px-24 lg:py-24">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-text-muted)]">The Dream Machine</p>
              <h2 className="mt-4 text-3xl font-serif uppercase tracking-[0.12em] sm:text-4xl lg:text-5xl">A cinematic journey through our houses</h2>
            </div>
            <Link to="/dream-machine" className="inline-flex rounded-full border border-[var(--holdings-accent)] px-8 py-4 text-sm uppercase tracking-[0.18em] text-[var(--holdings-accent)] transition-colors duration-300 hover:bg-[var(--holdings-accent)] hover:text-black">
              Explore the story
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { brand: 'Syden', title: 'The Science of Healthy Livestock', desc: 'Veterinary excellence & pastoral heritage.', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698439/WhatsApp_Image_2026-08-14_at_11.25.32_xvbhl8.jpg' },
              { brand: 'DeeFresh', title: 'Nature\'s Finest Harvest', desc: 'Farm-to-table freshness and premium seeds.', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698436/WhatsApp_Image_2026-08-14_at_11.25.35_l8otp4.jpg' },
              { brand: 'DELEON ENTERPRiSES', title: 'Premium Real Estate', desc: 'Legacy land portfolios and curated estates.', image: 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698444/WhatsApp_Image_2026-08-14_at_11.25.34_zkxxz8.jpg' }
            ].map((item) => (
              <div key={item.brand} className="rounded-none bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2 flex flex-col">
                <div className="h-48 md:h-64 lg:h-96 rounded-none bg-black/10 mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">{item.brand}</p>
                <h3 className="mt-4 text-2xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-4 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
