import React, { useState } from 'react';
import { useOpsAuth } from '../../../context/OpsAuthContext';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  UserCheck, 
  AlertCircle
} from 'lucide-react';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginDirector, loginVolunteer } = useOpsAuth();
  const [tab, setTab] = useState<'volunteer' | 'director'>('volunteer');
  const [volCode, setVolCode] = useState('');
  const [directorPin, setDirectorPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (tab === 'director') {
        const res = await loginDirector(directorPin);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Invalid Director Passcode');
        }
      } else {
        const res = await loginVolunteer(volCode);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Volunteer not found');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md my-6 bg-white border border-amber-300 rounded-3xl p-6 text-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Switch Operations Account</h2>
            <p className="text-xs text-slate-500">Sign in to change station duty or enter supervisor mode</p>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 mb-4 border border-slate-200">
          <button
            type="button"
            onClick={() => { setTab('volunteer'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'volunteer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            Field Volunteer
          </button>
          <button
            type="button"
            onClick={() => { setTab('director'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'director' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Operations Head
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'volunteer' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Volunteer Code or Phone Number
              </label>
              <input
                type="text"
                required
                value={volCode}
                onChange={(e) => setVolCode(e.target.value)}
                placeholder="e.g. VOL-101 or 9876543210"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Director Master PIN
              </label>
              <input
                type="password"
                required
                value={directorPin}
                onChange={(e) => setDirectorPin(e.target.value)}
                placeholder="Enter 4-digit Master PIN"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
