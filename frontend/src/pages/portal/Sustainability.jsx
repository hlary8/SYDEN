import { useEffect, useState } from 'react';

const galleryItems = [
  {
    id: 'video-1',
    type: 'video',
    src: 'https://res.cloudinary.com/gcne2xno/video/upload/v1788102451/VID-20260826-WA0016.mp4',
    alt: 'Farm field video',
    span: 'md:col-span-4 md:row-span-2'
  },
  {
    id: 'image-1',
    type: 'image',
    src: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788110369/WhatsApp_Image_2026-08-14_at_11.25.35.jpg',
    alt: 'Farm worker portrait',
    span: 'md:col-span-5 md:row-span-2'
  },
  {
    id: 'image-2',
    type: 'image',
    src: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109786/WhatsApp_Image_2026-08-14_at_15.30.15_1.jpg',
    alt: 'Sustainable agricultural field',
    span: 'md:col-span-3 md:row-span-2'
  },
  {
    id: 'video-2',
    type: 'video',
    src: 'https://res.cloudinary.com/gcne2xno/video/upload/v1788102319/VID-20260826-WA0015.mp4',
    alt: 'Livestock movement video',
    span: 'md:col-span-3'
  },
  {
    id: 'image-3',
    type: 'image',
    src: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109795/WhatsApp_Image_2026-08-14_at_15.30.14_1.jpg',
    alt: 'Growing produce close-up',
    span: 'md:col-span-3'
  },
  {
    id: 'image-4',
    type: 'image',
    src: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109801/WhatsApp_Image_2026-08-14_at_15.30.14_3.jpg',
    alt: 'Farm workers in action',
    span: 'md:col-span-3'
  },
  {
    id: 'image-5',
    type: 'image',
    src: 'https://res.cloudinary.com/gcne2xno/image/upload/v1788109804/WhatsApp_Image_2026-08-14_at_15.30.13.jpg',
    alt: 'Sustainable harvest scene',
    span: 'md:col-span-3'
  }
];

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#121212]">
      <section className="relative overflow-hidden bg-[#111111]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,169,110,0.16),_transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.58))]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#d7b57a]">Cultivating a harvest future</p>
            <h1 className="mt-5 font-serif text-[clamp(2.5rem,7vw,5.8rem)] uppercase leading-[0.95] tracking-[0.14em] text-white">Sustainability</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 md:text-base">Our commitment to the land, the animals, and the people who keep every cycle thriving.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            ['For the Land', 'DELEON land conservation, Laikipia & Meru stewardship'],
            ['For the Animals', 'Syden livestock, vet welfare standards'],
            ['For the People', 'DeeFresh fair farmer partnerships, agronomical training']
          ].map(([title, text]) => (
            <div key={title} className="border border-[#cdb083] bg-white/60 p-5 shadow-[0_10px_40px_rgba(17,17,17,0.04)] backdrop-blur-sm">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b18d4e]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#333]">{text}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:auto-rows-[220px]">
          {galleryItems.map((item) => (
            <div key={item.id} className={`${item.span} overflow-hidden border border-[#d8c8a9] bg-[#e8ddce] shadow-[0_18px_45px_rgba(0,0,0,0.06)]`}>
              {item.type === 'video' ? (
                <video className="h-full w-full object-cover" autoPlay muted loop playsInline>
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 text-center md:grid-cols-3">
          {[
            ['1,000+', 'Acres under sustainable management'],
            ['2,500+', 'Animals under ethical care'],
            ['1,200+', 'Farmer partnerships active']
          ].map(([value, label]) => (
            <div key={label} className="border border-[#d9c299] bg-[#f7f2e9] px-6 py-8 shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
              <div className="text-4xl font-bold text-[#111] md:text-5xl">{value}</div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#7a6a51]">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button type="button" className="inline-flex items-center justify-center rounded-full bg-[#c9a96e] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#111] shadow-[0_10px_25px_rgba(201,169,110,0.35)] transition-transform duration-300 hover:-translate-y-0.5">Join Our Mission</button>
        </div>
      </section>
    </div>
  );
}
