import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { FluidBackground } from './components/layout/FluidBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { ConcertRegisterModal } from './components/concert/ConcertRegisterModal';
import { DigitalPassModal } from './components/concert/DigitalPassModal';
import { OrganizerGateModal } from './components/concert/OrganizerGateModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { ConcertPage } from './pages/ConcertPage';
import { InitiativesPage } from './pages/InitiativesPage';
import { CommunityPage } from './pages/CommunityPage';
import { CommandCenterPage } from './pages/CommandCenterPage';

const MainContent: React.FC = () => {
  const { activePage, navigateTo } = useApp();

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('ops') || hash.includes('command')) {
        navigateTo('ops');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [navigateTo]);

  if (activePage === 'ops') {
    return <CommandCenterPage />;
  }

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 font-sans">
      <FluidBackground />
      <Navbar />

      <main className="flex-1 pt-6 sm:pt-8">
        {activePage === 'home' && <HomePage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'events' && <EventsPage />}
        {activePage === 'concert' && <ConcertPage />}
        {activePage === 'initiatives' && <InitiativesPage />}
        {activePage === 'community' && <CommunityPage />}
      </main>

      <Footer />

      {/* Global Interactive Modals */}
      <ConcertRegisterModal />
      <DigitalPassModal />
      <OrganizerGateModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
