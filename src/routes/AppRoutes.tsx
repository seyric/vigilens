import { Navigate, Route, Routes } from "react-router-dom";
import NotFoundPage from "../components/common/NotFoundPage";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import VoiceSearchPage from "../pages/VoiceSearch/VoiceSearchPage";
import InvestigationDiaryPage from "../pages/InvestigationDiary/InvestigationDiaryPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import CrimeDatabasePage from "../pages/CrimeDatabase/CrimeDatabasePage";
import CrimeDetailsPage from "../pages/CrimeDetails/CrimeDetailsPage";
import CriminalNetworkPage from "../pages/CriminalNetwork/CriminalNetworkPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import GISPage from "../pages/GIS/GISPage";
import InvestigationPage from "../pages/Investigation/InvestigationPage";
import VigilensIntroPage from "../pages/Loading/VigilensIntroPage";
import VigilensLoginPage from "../pages/Auth/VigilensLoginPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import OCRReviewPage from "../pages/OCRReview/OCRReviewPage";
import DigitalIntelligenceHubPage from "../pages/DigitalIntelligenceHub/DigitalIntelligenceHubPage";
import AICrimePatternSimilarityPage from "../pages/CrimePatternSimilarity/AICrimePatternSimilarityPageFull";
import MultilingualAIPage from "../pages/MultilingualAI/MultilingualAIPage";
import SetupWizardPage from "../pages/Setup/SetupWizardPage";
import OSINTTacticalMapPage from "../pages/OSINT/OSINTTacticalMapPage";
import MultiINTCollectionPage from "../pages/OSINT/MultiINTCollectionPage";
import GlobalThreatMonitorPage from "../pages/OSINT/GlobalThreatMonitorPage";
import LiveNewsFeedsPage from "../pages/OSINT/LiveNewsFeedsPage";
import ThreatIntelStudioPage from "../pages/OSINT/ThreatIntelStudioPage";
import AdminConsolePage from "../pages/Admin/AdminConsolePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/loading" replace />} />
      <Route path="/loading" element={<VigilensIntroPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<VigilensLoginPage />} />
        <Route path="/setup" element={<SetupWizardPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/crime-database" element={<CrimeDatabasePage />} />
        <Route path="/crime-database/:crimeId" element={<CrimeDetailsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/gis" element={<GISPage />} />
        <Route path="/investigation" element={<InvestigationPage />} />
        <Route
          path="/investigation-diary"
          element={<InvestigationDiaryPage />}
        />
        <Route path="/criminal-network" element={<CriminalNetworkPage />} />
        <Route path="/voice-search" element={<VoiceSearchPage />} />
        <Route path="/multilingual-ai" element={<MultilingualAIPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ocr-review" element={<OCRReviewPage />} />
        <Route
          path="/digital-intelligence"
          element={<DigitalIntelligenceHubPage />}
        />
        <Route
          path="/crime-pattern-similarity"
          element={<AICrimePatternSimilarityPage />}
        />

        {/* OSINT & Multi-INT Fusion Routes */}
        <Route path="/osint-map" element={<OSINTTacticalMapPage />} />
        <Route path="/multi-int" element={<MultiINTCollectionPage />} />
        <Route path="/threat-monitor" element={<GlobalThreatMonitorPage />} />
        <Route path="/live-feeds" element={<LiveNewsFeedsPage />} />
        <Route path="/threat-intel" element={<ThreatIntelStudioPage />} />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminConsolePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
