import { Outlet } from 'react-router-dom';
import DeeFreshNavbar from '../components/deefresh/DeeFreshNavbar';
import DeeFreshFooter from '../components/deefresh/DeeFreshFooter';
import useBrandTheme from '../hooks/useBrandTheme';

export default function DeeFreshLayout() {
  useBrandTheme('deefresh');
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <DeeFreshNavbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <DeeFreshFooter />
    </div>
  );
}
