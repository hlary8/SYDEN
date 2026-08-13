import { Outlet } from 'react-router-dom';
import SydenNavbar from '../components/syden/SydenNavbar';
import SydenFooter from '../components/syden/SydenFooter';
import useBrandTheme from '../hooks/useBrandTheme';

export default function SydenLayout() {
  useBrandTheme('syden');
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SydenNavbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <SydenFooter />
    </div>
  );
}
