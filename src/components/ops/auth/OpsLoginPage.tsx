import React, { useState } from 'react';
import { useOpsAuth } from '../../../context/OpsAuthContext';
import { 
  Shield, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  AlertCircle, 
  Car, 
  ScanLine, 
  Activity, 
  Users,
  ChevronLeft,
  KeyRound,
  Sparkles
} from 'lucide-react';

interface OpsLoginPageProps {
  onExitToWebsite: () => void;
}

export const OpsLoginPage: React.FC<OpsLoginPageProps> = ({ onExitToWebsite }) => {
  const { loginVolunteer, loginDirector } = useOpsAuth();
  
  const [activeTab, setActiveTab] = useState<'volunteer' | 'director'>('volunteer');
  
  // Volunteer inputs
  const [volIdentifier, setVolIdentifier] = useState('');
  
  // Director inputs
  const [directorPin, setDirectorPin] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await loginVolunteer(volIdentifier);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to authenticate volunteer.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await loginDirector(directorPin);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid Director Passcode.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setPresetVolunteer = (code: string) => {
    setVolIdentifier(code);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between text-slate-900 font-sans selection:bg-amber-200">
      {/* Top Bar */}
      <header className="px-4 py-4 sm:px-8 border-b border-amber-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  Faith Commune Ops
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-300">
                  ApexEvents OS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Event Operations Command Center • 4-Acre Ground</p>
            </div>
          </div>

          <button
            onClick={onExitToWebsite}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to</span> Website
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white border border-amber-200 rounded-2xl shadow-xl shadow-amber-500/5 p-6 sm:p-8">
          
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200/80">
            <button
              type="button"
              onClick={() => { setActiveTab('volunteer'); setErrorMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'volunteer'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-600" />
              Field Volunteer
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('director'); setErrorMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'director'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-600" />
              Operations Head
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs sm:text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="text-red-600 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* TAB 1: FIELD VOLUNTEER LOGIN */}
          {activeTab === 'volunteer' && (
            <form onSubmit={handleVolunteerSubmit} className="space-y-4">
              <div>
                <div className="mb-2">
                  <h2 className="text-lg font-black text-slate-900">Volunteer Duty Sign-In</h2>
                  <p className="text-xs text-slate-500">
                    Enter your Volunteer ID or Mobile Number to access your designated station.
                  </p>
                </div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Volunteer Code or Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={volIdentifier}
                    onChange={(e) => setVolIdentifier(e.target.value)}
                    placeholder="e.g. VOL-101 or 9876543210"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <p className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Quick Test Roles:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPresetVolunteer('VOL-101')}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-white border border-amber-300 font-bold text-slate-800 hover:bg-amber-100 transition-all flex items-center gap-1"
                  >
                    <ScanLine className="w-3 h-3 text-amber-600" />
                    VOL-101 (Gate 1 Scanner)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetVolunteer('VOL-103')}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-white border border-amber-300 font-bold text-slate-800 hover:bg-amber-100 transition-all flex items-center gap-1"
                  >
                    <Car className="w-3 h-3 text-amber-600" />
                    VOL-103 (Parking Marshall)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetVolunteer('VOL-105')}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-white border border-amber-300 font-bold text-slate-800 hover:bg-amber-100 transition-all flex items-center gap-1"
                  >
                    <Activity className="w-3 h-3 text-amber-600" />
                    VOL-105 (Medical Lead)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to My Station
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Locked to your assigned duty. Volunteers cannot view broad event data or other stations.
              </p>
            </form>
          )}

          {/* TAB 2: OPERATIONS HEAD / DIRECTOR LOGIN */}
          {activeTab === 'director' && (
            <form onSubmit={handleDirectorSubmit} className="space-y-4">
              <div>
                <div className="mb-2">
                  <h2 className="text-lg font-black text-slate-900">Operations Command Portal</h2>
                  <p className="text-xs text-slate-500">
                    Restricted access for Event Director & Core Operations Heads.
                  </p>
                </div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Director Master PIN / Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={directorPin}
                    onChange={(e) => setDirectorPin(e.target.value)}
                    placeholder="Enter Master PIN (Default: 2026)"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  Supervisor Privileges:
                </p>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-500">
                  <li>Live War Room Real-time Analytics & Footfall</li>
                  <li>Assign & Dispatch 150+ Volunteers to Stations</li>
                  <li>Full Attendee CRM Data Vault & CSV Export</li>
                  <li>Vendor Stall Clearance & Sponsor Oversight</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-black active:scale-[0.99] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Unlock Command Center
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400">
                  Default Event Master PIN: <strong className="text-slate-600">2026</strong>
                </span>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        Faith Commune IT & Ground Operations System • Connected to Neon Serverless Database
      </footer>
    </div>
  );
};
