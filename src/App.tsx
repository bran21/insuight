import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LandingPage from './components/LandingPage';
import PredictDashboard from './components/PredictDashboard';

import PortfolioView from './components/PortfolioView';
import CompetitionsView from './components/CompetitionsView';
import EarnView from './components/EarnView';
import LeaderboardView from './components/LeaderboardView';
import NotFound from './components/NotFound';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route (No Sidebar) */}
        <Route path="/" element={<LandingPage />} />

        {/* App Routes (With Sidebar and Layout) */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<PredictDashboard />} />

          <Route path="portfolio" element={<PortfolioView />} />
          <Route path="leaderboard" element={<LeaderboardView />} />
          <Route path="competitions" element={<CompetitionsView />} />
          <Route path="earn" element={<EarnView />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
