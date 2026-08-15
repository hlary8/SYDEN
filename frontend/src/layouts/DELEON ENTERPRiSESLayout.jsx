import { Outlet } from 'react-router-dom';
import DeLeonEnterprisesNavbar from '../components/DELEON ENTERPRiSES/DELEON ENTERPRiSESNavbar';
import DeLeonEnterprisesFooter from '../components/DELEON ENTERPRiSES/DELEON ENTERPRiSESFooter';
import useBrandTheme from '../hooks/useBrandTheme';

export default function DeLeonEnterprisesLayout() {
  useBrandTheme('DELEON ENTERPRiSES');
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <DeLeonEnterprisesNavbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <DeLeonEnterprisesFooter />
    </div>
  );
}
