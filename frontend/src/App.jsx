import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ParentLayout from './layouts/ParentLayout';
import DeLeonEnterprisesLayout from './layouts/DELEON ENTERPRiSESLayout';
import SydenLayout from './layouts/SydenLayout';
import DeeFreshLayout from './layouts/DeeFreshLayout';
import PortalHome from './pages/portal/PortalHome';
import PortalAbout from './pages/portal/PortalAbout';
import PortalContact from './pages/portal/PortalContact';
import DreamMachine from './pages/portal/DreamMachine';
import Houses from './pages/portal/Houses';
import Sustainability from './pages/portal/Sustainability';
import HistoryPage from './pages/portal/HistoryPage';
import Press from './pages/portal/Press';
import PressArticle from './pages/portal/PressArticle';
import GlobalPresence from './pages/portal/GlobalPresence';
import Talent from './pages/portal/Talent';
import AdminNewsDashboard from './pages/admin/AdminNewsDashboard';
import DeLeonEnterprisesHome from './pages/DELEON ENTERPRiSES/DELEON ENTERPRiSESHome';
import DeLeonEnterprisesLands from './pages/DELEON ENTERPRiSES/DELEON ENTERPRiSESLands';
import DeLeonEnterprisesLandDetail from './pages/DELEON ENTERPRiSES/DELEON ENTERPRiSESLandDetail';
import DeLeonEnterprisesAbout from './pages/DELEON ENTERPRiSES/DELEON ENTERPRiSESAbout';
import DeLeonEnterprisesContact from './pages/DELEON ENTERPRiSES/DELEON ENTERPRiSESContact';
import DeLeonEnterprisesAdminDashboard from './pages/DELEON ENTERPRiSES/admin/DELEON ENTERPRiSESAdminDashboard';
import DeLeonEnterprisesLandUpload from './pages/DELEON ENTERPRiSES/admin/DELEON ENTERPRiSESLandUpload';
import DeLeonEnterprisesInquiries from './pages/DELEON ENTERPRiSES/admin/DELEON ENTERPRiSESInquiries';
import SydenHome from './pages/syden/SydenHome';
import SydenLivestock from './pages/syden/SydenLivestock';
import SydenLivestockDetail from './pages/syden/SydenLivestockDetail';
import SydenVetServices from './pages/syden/SydenVetServices';
import SydenFarmActivities from './pages/syden/SydenFarmActivities';
import SydenAbout from './pages/syden/SydenAbout';
import SydenContact from './pages/syden/SydenContact';
import SydenAdminDashboard from './pages/syden/admin/SydenAdminDashboard';
import SydenLivestockUpload from './pages/syden/admin/SydenLivestockUpload';
import SydenCommentModeration from './pages/syden/admin/SydenCommentModeration';
import SydenFarmActivitiesAdmin from './pages/syden/admin/SydenFarmActivitiesAdmin';
import DeeFreshHome from './pages/deefresh/DeeFreshHome';
import DeeFreshProduce from './pages/deefresh/DeeFreshProduce';
import DeeFreshProduceDetail from './pages/deefresh/DeeFreshProduceDetail';
import DeeFreshFarmers from './pages/deefresh/DeeFreshFarmers';
import DeeFreshSeeds from './pages/deefresh/DeeFreshSeeds';
import DeeFreshAbout from './pages/deefresh/DeeFreshAbout';
import DeeFreshContact from './pages/deefresh/DeeFreshContact';
import DeeFreshAdminDashboard from './pages/deefresh/admin/DeeFreshAdminDashboard';
import DeeFreshProduceUpload from './pages/deefresh/admin/DeeFreshProduceUpload';
import DeeFreshFarmerApplications from './pages/deefresh/admin/DeeFreshFarmerApplications';
import DeeFreshSeedsAdmin from './pages/deefresh/admin/DeeFreshSeedsAdmin';
import DeeFreshFarmersAdmin from './pages/deefresh/admin/DeeFreshFarmersAdmin';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure each route navigation starts at top of page
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<ParentLayout />}>
              <Route index element={<PortalHome />} />
              <Route path="about" element={<PortalAbout />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="about/our-story" element={<HistoryPage />} />
              <Route path="contact" element={<PortalContact />} />
              <Route path="dream-machine" element={<DreamMachine />} />
              <Route path="houses" element={<Houses />} />
              <Route path="sustainability" element={<Sustainability />} />
              <Route path="press" element={<Press />} />
              <Route path="press/:slug" element={<PressArticle />} />
              <Route path="global-presence" element={<GlobalPresence />} />
              <Route path="talent" element={<Talent />} />
            </Route>

            <Route path="/deleon/*" element={<DeLeonEnterprisesLayout />}>
              <Route index element={<DeLeonEnterprisesHome />} />
              <Route path="lands" element={<DeLeonEnterprisesLands />} />
              <Route path="lands/:slug" element={<DeLeonEnterprisesLandDetail />} />
              <Route path="about" element={<DeLeonEnterprisesAbout />} />
              <Route path="contact" element={<DeLeonEnterprisesContact />} />
              <Route path="admin" element={<DeLeonEnterprisesAdminDashboard />} />
              <Route path="admin/upload" element={<DeLeonEnterprisesLandUpload />} />
              <Route path="admin/inquiries" element={<DeLeonEnterprisesInquiries />} />
            </Route>

            <Route path="/DELEON ENTERPRiSES/*" element={<DeLeonEnterprisesLayout />}>
              <Route index element={<DeLeonEnterprisesHome />} />
              <Route path="lands" element={<DeLeonEnterprisesLands />} />
              <Route path="lands/:slug" element={<DeLeonEnterprisesLandDetail />} />
              <Route path="about" element={<DeLeonEnterprisesAbout />} />
              <Route path="contact" element={<DeLeonEnterprisesContact />} />
              <Route path="admin" element={<DeLeonEnterprisesAdminDashboard />} />
              <Route path="admin/upload" element={<DeLeonEnterprisesLandUpload />} />
              <Route path="admin/inquiries" element={<DeLeonEnterprisesInquiries />} />
            </Route>

            <Route path="/syden/*" element={<SydenLayout />}>
              <Route index element={<SydenHome />} />
              <Route path="livestock" element={<SydenLivestock />} />
              <Route path="livestock/:id" element={<SydenLivestockDetail />} />
              <Route path="veterinary" element={<SydenVetServices />} />
              <Route path="farm-activities" element={<SydenFarmActivities />} />
              <Route path="about" element={<SydenAbout />} />
              <Route path="contact" element={<SydenContact />} />
              <Route path="admin" element={<SydenAdminDashboard />} />
              <Route path="admin/livestock-upload" element={<SydenLivestockUpload />} />
              <Route path="admin/comment-moderation" element={<SydenCommentModeration />} />
              <Route path="admin/farm-activities" element={<SydenFarmActivitiesAdmin />} />
            </Route>

            <Route path="/deefresh/*" element={<DeeFreshLayout />}>
              <Route index element={<DeeFreshHome />} />
              <Route path="produce" element={<DeeFreshProduce />} />
              <Route path="produce/:slug" element={<DeeFreshProduceDetail />} />
              <Route path="farmers" element={<DeeFreshFarmers />} />
              <Route path="seeds" element={<DeeFreshSeeds />} />
              <Route path="about" element={<DeeFreshAbout />} />
              <Route path="contact" element={<DeeFreshContact />} />
              <Route path="admin" element={<DeeFreshAdminDashboard />} />
              <Route path="admin/produce-upload" element={<DeeFreshProduceUpload />} />
              <Route path="admin/farmer-applications" element={<DeeFreshFarmerApplications />} />
              <Route path="admin/farmers" element={<DeeFreshFarmersAdmin />} />
              <Route path="admin/seeds" element={<DeeFreshSeedsAdmin />} />
            </Route>

            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/admin/news" element={<AdminNewsDashboard />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
