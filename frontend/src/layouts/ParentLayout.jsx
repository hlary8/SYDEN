import { Outlet } from 'react-router-dom';
import ParentTickerBar from '../components/common/ParentTickerBar';
import ParentNavbar from '../components/common/ParentNavbar';
import ParentFooter from '../components/common/ParentFooter';

export default function ParentLayout() {
  return (
    <div className="min-h-screen bg-[var(--holdings-bg)] text-[var(--holdings-text)]">
      <ParentTickerBar />
      <ParentNavbar />
      <main className="pt-[138px]">
        <Outlet />
      </main>
      <ParentFooter />
    </div>
  );
}
