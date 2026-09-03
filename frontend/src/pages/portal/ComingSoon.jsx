import { Link } from 'react-router-dom';

export default function ComingSoon() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--holdings-bg)] px-6 py-16 text-[var(--holdings-text)]">
      <div className="max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--holdings-accent)]">Sustainability</p>
        <h1 className="mt-5 font-serif text-5xl uppercase tracking-[0.14em] text-white md:text-7xl">Coming Soon</h1>
        <p className="mt-6 text-base leading-8 text-[var(--holdings-text-muted)]">
          This initiative is currently in development. We will share more details soon.
        </p>
        <Link
          to="/sustainability"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-[var(--holdings-accent)] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[var(--holdings-accent)] transition-colors hover:bg-[var(--holdings-accent)] hover:text-black"
        >
          Back to Sustainability
        </Link>
      </div>
    </div>
  );
}
