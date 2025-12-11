
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer, MobileBottomNav, LoadingScreen } from './components/Layout';
import { ThemeProvider, ToastProvider } from './components/GlassUI';
import { DataProvider } from './context/DataContext';
import { CareerAssistant } from './components/Enhancements';
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { JobDetail } from './pages/JobDetail';
import { Internships } from './pages/Internships';
import { Culture } from './pages/Culture';
import { TrackApplication } from './pages/TrackApplication';
import { Admin } from './pages/Admin';
import { Assessments } from './pages/Assessments';
import { InternshipApplication } from './pages/InternshipApplication';
import { CandidateAuth } from './pages/CandidateAuth';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { TestEnvironment } from './pages/TestEnvironment';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <ThemeProvider>
      <ToastProvider>
        <DataProvider>
          <HashRouter>
            <div 
              className="flex flex-col min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-300"
              style={{
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)'
              }}
            >
              <ScrollToTop />
              <Routes>
                {/* Standalone Pages without Layout */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/test/:type/:id" element={<TestEnvironment />} />
                
                {/* Pages with Main Layout */}
                <Route path="*" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<CandidateAuth />} />
                        <Route path="/dashboard" element={<CandidateDashboard />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/jobs/:id" element={<JobDetail />} />
                        <Route path="/internships" element={<Internships />} />
                        <Route path="/internship-apply" element={<InternshipApplication />} />
                        <Route path="/assessments" element={<Assessments />} />
                        <Route path="/culture" element={<Culture />} />
                        <Route path="/track" element={<TrackApplication />} />
                      </Routes>
                    </main>
                    <Footer />
                    <MobileBottomNav />
                    <CareerAssistant />
                  </>
                } />
              </Routes>
            </div>
          </HashRouter>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
