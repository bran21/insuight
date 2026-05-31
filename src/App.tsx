import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LandingPage from './components/LandingPage';
import PredictDashboard from './components/PredictDashboard';
import AgentConsole from './components/AgentConsole';
import PortfolioView from './components/PortfolioView';
import NotFound from './components/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route (No Sidebar) */}
        <Route path="/" element={<LandingPage />} />

        {/* App Routes (With Sidebar and Layout) */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<PredictDashboard />} />
          <Route path="agent" element={<AgentConsole />} />
          <Route path="portfolio" element={<PortfolioView />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
