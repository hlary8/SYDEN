import { Link } from 'react-router-dom';
import CinematicHero from '../../components/common/CinematicHero';

export default function Houses() {
  const heroImage = import.meta.env.VITE_HERO_IMAGE_URL || 'https://res.cloudinary.com/gcne2xno/image/upload/v1788102133/IMG-20260814-WA0054.jpg';
  const deleonImage = import.meta.env.VITE_DELEON_HOUSE_IMAGE || 'https://res.cloudinary.com/tmcloud1/image/upload/v1786698444/WhatsApp_Image_2026-08-14_at_11.25.34_zkxxz8.jpg';
  const sydenImage = import.meta.env.VITE_SYDEN_HOUSE_IMAGE || 'https://res.cloudinary.com/gcne2xno/image/upload/v1788102146/IMG-20260814-WA0106.jpg';
  const deefreshImage = import.meta.env.VITE_DEEFRESH_HOUSE_IMAGE || 'https://res.cloudinary.com/gcne2xno/image/upload/v1788102131/IMG-20260814-WA0127.jpg';

  const quickLinks = [
    { name: 'DeLeon', href: '/deleon', image: deleonImage },
    { name: 'Syden', href: '/syden', image: sydenImage },
    { name: 'DeeFresh', href: '/deefresh', image: deefreshImage }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="relative mx-auto my-6 flex max-w-7xl items-center justify-center overflow-hidden rounded-[28px] border border-[#E5E5E5] bg-black md:my-8" style={{ height: '52vh', minHeight: '420px', maxHeight: '560px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="font-[Cormorant] text-white text-[clamp(2.5rem,8vw,4.5rem)] leading-tight">OUR COMPANIES</h1>
          <p className="mt-6 mx-auto max-w-3xl px-2 text-sm text-white/90 md:text-lg">Three pillars. One vision. Cultivating excellence across land, livestock, and harvest.</p>
        </div>
        <div className="absolute bottom-8 w-full text-center text-white/80 md:bottom-12">
          <div className="animate-bounce text-xs md:text-base">⌄ SCROLL TO DISCOVER</div>
        </div>
      </section>

      <section className="px-4 pb-2 pt-2 md:px-6 md:pb-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
            {quickLinks.map((item) => (
              <Link key={item.name} to={item.href} className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 md:h-20 md:w-20" title={item.name}>
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DELEON Section */}
      <section className="px-4 md:px-6 py-12 md:py-[120px] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <div className="lg:w-1/2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]">THE COMPANY</p>
            <h2 className="mt-4 font-serif text-2xl md:text-4xl">DELEON</h2>
            <h3 className="mt-2 text-lg md:text-xl font-semibold">The Land Legacy</h3>
            <p className="mt-6 text-sm md:text-base leading-[1.8] text-[#222]">Founded on the principle that land is the foundation of all prosperity, DELEON has spent over a decade curating premium agricultural and development parcels across East Africa. From the rolling highlands of Laikipia to the fertile plains of Meru, every acre is surveyed, fenced, and title-deed ready. We do not merely sell land — we deliver legacy. Each parcel comes with environmental assessments, infrastructure mapping, and a commitment to sustainable stewardship that spans generations.</p>
            <Link to="/deleon" className="inline-block mt-6 underline text-[#D4AF37] hover:text-black text-sm md:text-base">Explore DELEON →</Link>
          </div>
          <div className="lg:w-1/2 w-full">
            <CinematicHero
              mediaUrl={import.meta.env.VITE_DELEON_HOUSE_MEDIA || deleonImage}
              posterUrl={import.meta.env.VITE_DELEON_HOUSE_POSTER || (deleonImage + '?w=200&blur=200')}
              label="THE LAND LEGACY"
              headline="At DeLeon, We Craft<br/>The Earth"
              subheadline="Premium fenced land in Laikipia & Meru. Title-ready. Environmentally assessed. Legacy-grade."
              ctas={[{ label: 'Explore DeLeon →', to: '/deleon', variant: 'primary' }]}
            />
            <p className="mt-3 text-xs md:text-sm text-gray-500">Laikipia Highlands, Kenya</p>
          </div>
        </div>
      </section>

      {/* DeeFresh Section */}
      <section className="px-4 md:px-6 py-12 md:py-[120px] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <div className="lg:w-1/2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]">THE COMPANY</p>
            <h2 className="mt-4 font-serif text-2xl md:text-4xl">DeeFresh</h2>
            <h3 className="mt-2 text-lg md:text-xl font-semibold">The Harvest Dream</h3>
            <p className="mt-6 text-sm md:text-base leading-[1.8] text-[#222]">DeeFresh reimagines the farm-to-markets journey as a seamless tapestry of partnership, precision, and purity. We engage small-scale and large-scale farmers through contractual farming agreements that guarantee fair prices and agronomical support. Our consultancy services span soil analysis, crop planning, and market sourcing — with a special focus on peas and high-value produce. From seed selection to supermarket shelf, DeeFresh ensures every harvest reaches its fullest potential.</p>
            <Link to="/deefresh" className="inline-block mt-6 underline text-[#D4AF37] hover:text-black text-sm md:text-base">Explore DeeFresh →</Link>
          </div>
          <div className="lg:w-1/2 w-full">
            <CinematicHero
              mediaUrl={import.meta.env.VITE_DEEFRESH_HOUSE_MEDIA || deefreshImage}
              posterUrl={import.meta.env.VITE_DEEFRESH_HOUSE_POSTER || (deefreshImage + '?w=200&blur=200')}
              label="THE HARVEST DREAM"
              headline="At DeeFresh, We Cultivate<br/>Abundance"
              subheadline="Contractual farming, agronomical services, and the finest fresh produce from farm to global market supply."
              ctas={[{ label: 'View Produce →', to: '/deefresh/produce', variant: 'primary' }, { label: 'Farm With Us →', to: '/deefresh', variant: 'secondary' }]}
            />
            <p className="mt-3 text-xs md:text-sm text-gray-500">DeeFresh Partner Farm</p>
          </div>
        </div>
      </section>

      {/* Syden Section */}
      <section className="px-4 md:px-6 py-12 md:py-[120px] border-t border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-12">
          <div className="lg:w-1/2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B7280]">THE COMPANY</p>
            <h2 className="mt-4 font-serif text-2xl md:text-4xl">Syden</h2>
            <h3 className="mt-2 text-lg md:text-xl font-semibold">The Pastoral Art</h3>
            <p className="mt-6 text-sm md:text-base leading-[1.8] text-[#222]">Where veterinary science meets generations of husbandry, Syden stands as the region's premier livestock and agricultural services house. Our herd management programs combine cutting-edge veterinary care with time-honored pastoral traditions. Beyond livestock, Syden supplies F1 potato seeds to farmers seeking certified, high-yield varieties. From vaccination protocols to breeding programs, from seed certification to farm advisory — Syden nurtures life at every stage.</p>
            <Link to="/syden" className="inline-block mt-6 underline text-black hover:text-[#6B7280] text-sm md:text-base">Explore Syden →</Link>
          </div>
          <div className="lg:w-1/2 w-full">
            <CinematicHero
              mediaUrl={import.meta.env.VITE_SYDEN_HOUSE_MEDIA || sydenImage}
              posterUrl={import.meta.env.VITE_SYDEN_HOUSE_POSTER || (sydenImage + '?w=200&blur=200')}
              label="THE PASTORAL ART"
              headline="At Syden, We Nurture<br/>Life"
              subheadline="Veterinary excellence, premium livestock, and certified F1 potato seeds."
              ctas={[{ label: 'Explore Livestock →', to: '/syden', variant: 'primary' }, { label: 'Vet Services →', to: '/syden/veterinary', variant: 'secondary' }]}
            />
            <p className="mt-3 text-xs md:text-sm text-gray-500">Syden Pastoral Farm</p>
          </div>
        </div>
      </section>

      {/* Footer handled by layout */}
    </div>
  );
}
