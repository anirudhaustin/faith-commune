import React, { useState } from 'react';
import { useOpsAuth } from '../../context/OpsAuthContext';
import { opsDb } from '../../services/db';
import { OpsAppId, EVENT_GATES, GateId } from '../../types/ops';
import { 
  Shield, 
  ScanLine, 
  Users, 
  AlertTriangle, 
  Car, 
  Sparkles, 
  Store, 
  Database, 
  Award, 
  Activity, 
  Radio, 
  ChevronDown, 
  ExternalLink,
  Wifi,
  WifiOff,
  Maximize2,
  LogOut,
  User,
  MapPin
} from 'lucide-react';

interface OpsHeaderProps {
  onOpenDatabaseSettings: () => void;
  onOpenRoleLogin: () => void;
  onOpenBroadcast: () => void;
  onQuickSos: () => void;
  onExitToWebsite: () => void;
}

const APPS: { id: OpsAppId; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: 'war-room', label: 'War Room (Overview)', shortLabel: 'War Room', icon: <Activity className="w-4 h-4" /> },
  { id: 'scanner', label: 'FastScan Gate Kiosk', shortLabel: 'Scanner', icon: <ScanLine className="w-4 h-4" /> },
  { id: 'crew', label: 'CrewForce Volunteer Hub', shortLabel: 'Volunteers', icon: <Users className="w-4 h-4" /> },
  { id: 'incidents', label: 'Incident Dispatch & SOS', shortLabel: 'Incidents', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'parking', label: 'Ground Parking & Traffic', shortLabel: 'Parking', icon: <Car className="w-4 h-4" /> },
  { id: 'vip', label: 'Stage & VIP Run-of-Show', shortLabel: 'VIP & Stage', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'stalls', label: 'Stall & Market Manager', shortLabel: 'Stalls', icon: <Store className="w-4 h-4" /> },
  { id: 'crm', label: 'Attendee CRM & Data Vault', shortLabel: 'CRM', icon: <Database className="w-4 h-4" /> },
  { id: 'sponsors', label: 'Sponsor Brand Marketing', shortLabel: 'Sponsors', icon: <Award className="w-4 h-4" /> }
];

export const OpsHeader: React.FC<OpsHeaderProps> = ({
  onOpenDatabaseSettings,
  onOpenBroadcast,
  onQuickSos,
  onExitToWebsite
}) => {
  const { session, isDirector, currentApp, setCurrentApp, assignedGate, setAssignedGate, logout } = useOpsAuth();
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const dbConfig = opsDb.getConfig();

  const activeAppMeta = APPS.find((a) => a.id === currentApp) || APPS[0];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-amber-200/80 backdrop-blur-xl px-4 py-2.5 sm:px-6 shadow-[0_4px_25px_rgba(217,119,6,0.08)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 tracking-tight">ApexEvents OS</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isDirector 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {isDirector ? 'Supervisor Command' : 'Field Station'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium">
                {isDirector ? 'Faith Commune 4-Acre Command' : (session?.assignedZone || 'Assigned Duty Post')}
              </p>
            </div>
          </div>

          {/* If DIRECTOR: Show App Switcher Dropdown */}
          {isDirector ? (
            <div className="relative">
              <button
                onClick={() => setIsAppMenuOpen(!isAppMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-300 text-xs font-bold text-slate-900 transition-all shadow-sm cursor-pointer"
              >
                <span className="text-amber-600">{activeAppMeta.icon}</span>
                <span className="hidden md:inline">{activeAppMeta.label}</span>
                <span className="md:hidden">{activeAppMeta.shortLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
              </button>

              {isAppMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-amber-200 shadow-[0_15px_40px_rgba(217,119,6,0.15)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Operations App Suite (Director)
                  </div>
                  <div className="space-y-1">
                    {APPS.map((app) => {
                      const isSelected = currentApp === app.id;
                      return (
                        <button
                          key={app.id}
                          onClick={() => {
                            setCurrentApp(app.id);
                            setIsAppMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
                          }`}
                        >
                          <span className={isSelected ? 'text-slate-950' : 'text-amber-600'}>
                            {app.icon}
                          </span>
                          <span className="flex-1">{app.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* If VOLUNTEER: STRICTLY LOCKED BADGE (No Switcher!) */
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-xs font-bold text-slate-900 shadow-sm">
              <span className="text-amber-600">{activeAppMeta.icon}</span>
              <span>{activeAppMeta.label}</span>
              {session?.assignedZone && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-900 font-semibold border border-amber-300/80">
                  <MapPin className="w-2.5 h-2.5" />
                  {session.assignedZone}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Gate Selector (Only for Director or Gate Scanners) */}
        {(isDirector || currentApp === 'scanner') && (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Gate:</span>
            <select
              value={assignedGate}
              onChange={(e) => setAssignedGate(e.target.value as GateId)}
              className="px-2.5 py-1 rounded-lg bg-amber-50/70 border border-amber-300 text-xs font-bold text-amber-900 focus:border-amber-500 cursor-pointer"
            >
              {EVENT_GATES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right Tools & Statuses */}
        <div className="flex items-center gap-2">
          {/* Quick SOS Trigger for anyone on site */}
          <button
            onClick={onQuickSos}
            title="Report Emergency / Incident to War Room"
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Report SOS</span>
          </button>

          {/* Radio Broadcast (Only for Director) */}
          {isDirector && (
            <button
              onClick={onOpenBroadcast}
              title="Broadcast Announcement to All Field Staff"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-800 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Radio className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Broadcast</span>
            </button>
          )}

          {/* Database Cloud / Local Status (Only for Director) */}
          {isDirector && (
            <button
              onClick={onOpenDatabaseSettings}
              title="Neon Database Connection & Status"
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                dbConfig.isCloudMode
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
            >
              {dbConfig.isCloudMode ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span className="hidden md:inline">Neon DB</span>
            </button>
          )}

          {/* User Profile Badge */}
          <div className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm">
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline max-w-[120px] truncate">
              {session?.displayName || 'User'}
            </span>
            {session?.volunteerCode && (
              <span className="text-[10px] font-mono text-slate-500 font-normal">
                ({session.volunteerCode})
              </span>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullScreen}
            title="Toggle Fullscreen Mode"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hidden sm:flex cursor-pointer shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            title="Sign Out / Change User"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>

          {/* Exit to Public Website (Only for Director) */}
          {isDirector && (
            <button
              onClick={onExitToWebsite}
              title="Return to Public Website"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span className="hidden md:inline">Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
