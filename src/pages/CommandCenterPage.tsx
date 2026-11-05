import React, { useState } from 'react';
import { OpsAuthProvider, useOpsAuth } from '../context/OpsAuthContext';
import { OpsHeader } from '../components/ops/OpsHeader';
import { OpsLoginPage } from '../components/ops/auth/OpsLoginPage';
import { WarRoomApp } from '../components/ops/apps/WarRoomApp';
import { ScannerApp } from '../components/ops/apps/ScannerApp';
import { CrewForceApp } from '../components/ops/apps/CrewForceApp';
import { IncidentDispatchApp } from '../components/ops/apps/IncidentDispatchApp';
import { ParkingHubApp } from '../components/ops/apps/ParkingHubApp';
import { VipRunSheetApp } from '../components/ops/apps/VipRunSheetApp';
import { StallMarketApp } from '../components/ops/apps/StallMarketApp';
import { AttendeeCrmApp } from '../components/ops/apps/AttendeeCrmApp';
import { SponsorDeliverablesApp } from '../components/ops/apps/SponsorDeliverablesApp';

// Modals
import { DatabaseSettingsModal } from '../components/ops/modals/DatabaseSettingsModal';
import { BroadcastModal } from '../components/ops/modals/BroadcastModal';
import { useApp } from '../context/AppContext';

const OpsWorkspaceContent: React.FC = () => {
  const { session, isAuthenticated, isDirector, currentApp, setCurrentApp } = useOpsAuth();
  const { navigateTo } = useApp();

  const [isDbSettingsOpen, setIsDbSettingsOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  // If not authenticated, present the mandatory Login Gate
  if (!isAuthenticated || !session) {
    return <OpsLoginPage onExitToWebsite={() => navigateTo('home')} />;
  }

  const handleQuickSos = () => {
    setCurrentApp('incidents');
  };

  // Determine active view respecting role boundaries
  const activeApp = isDirector ? currentApp : session.assignedApp || 'scanner';

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans flex flex-col">
      {/* Universal Operations Header (role-locked) */}
      <OpsHeader
        onOpenDatabaseSettings={() => setIsDbSettingsOpen(true)}
        onOpenRoleLogin={() => {}}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onQuickSos={handleQuickSos}
        onExitToWebsite={() => navigateTo('home')}
      />

      {/* Main Micro-App Workspace Container */}
      <main className="flex-1 pb-16">
        {/* Operations Head / Director can view War Room & CRM */}
        {activeApp === 'war-room' && isDirector && <WarRoomApp />}
        {activeApp === 'crm' && isDirector && <AttendeeCrmApp />}
        {activeApp === 'crew' && isDirector && <CrewForceApp />}
        {activeApp === 'sponsors' && isDirector && <SponsorDeliverablesApp />}

        {/* Operational Field Apps accessible to assigned volunteers & director */}
        {activeApp === 'scanner' && <ScannerApp />}
        {activeApp === 'parking' && <ParkingHubApp />}
        {activeApp === 'incidents' && <IncidentDispatchApp />}
        {activeApp === 'vip' && <VipRunSheetApp />}
        {activeApp === 'stalls' && <StallMarketApp />}

        {/* Security fallback: if a non-director lands on restricted apps, show assigned app */}
        {!isDirector && (activeApp === 'war-room' || activeApp === 'crm' || activeApp === 'sponsors') && (
          <div className="max-w-md mx-auto my-12 p-6 bg-white border border-amber-200 rounded-2xl shadow-sm text-center">
            <h3 className="text-base font-bold text-slate-900 mb-1">Station Duty Area</h3>
            <p className="text-xs text-slate-600 mb-4">
              Your account is stationed at <strong>{session.assignedZone}</strong>.
            </p>
            <button
              onClick={() => setCurrentApp(session.assignedApp)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-bold text-xs rounded-xl text-white cursor-pointer"
            >
              Open My Duty Station
            </button>
          </div>
        )}
      </main>

      {/* Global Command Modals (Director Only) */}
      {isDirector && (
        <>
          <DatabaseSettingsModal
            isOpen={isDbSettingsOpen}
            onClose={() => setIsDbSettingsOpen(false)}
            onRefreshStats={() => {}}
          />

          <BroadcastModal
            isOpen={isBroadcastOpen}
            onClose={() => setIsBroadcastOpen(false)}
            onBroadcastSent={() => {}}
          />
        </>
      )}
    </div>
  );
};

export const CommandCenterPage: React.FC = () => {
  return (
    <OpsAuthProvider>
      <OpsWorkspaceContent />
    </OpsAuthProvider>
  );
};
