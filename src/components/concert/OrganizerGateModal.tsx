import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ScanLine, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Lock, 
  Eye 
} from 'lucide-react';

export const OrganizerGateModal: React.FC = () => {
  const { 
    isGateModalOpen, 
    setGateModalOpen, 
    tickets, 
    toggleCheckIn, 
    setViewingTicket, 
    exportAttendeesCSV, 
    claimedSpots, 
    totalSpots 
  } = useApp();

  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked-in' | 'pending'>('all');

  if (!isGateModalOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026' || pinInput.trim() === '') {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const checkedInCount = tickets.filter((t) => t.checkedIn).length;
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.denomination.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'checked-in') return t.checkedIn;
    if (filterStatus === 'pending') return !t.checkedIn;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-6">
        <div className="relative rounded-3xl p-6 sm:p-8 bg-white border-2 border-amber-300 shadow-[0_25px_60px_rgba(217,119,6,0.25),0_0_35px_rgba(245,158,11,0.15)] text-slate-900">
          {/* Close button */}
          <button
            onClick={() => setGateModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Gate Scanner & Check-In Portal
              </h2>
              <p className="text-xs text-slate-500">
                Verify attendee QR codes and manage gate entries for 3,000 capacity.
              </p>
            </div>
          </div>

          {!isUnlocked ? (
            /* PIN Gate */
            <div className="py-8 max-w-sm mx-auto text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Access Passcode Required</h3>
              <p className="text-xs text-slate-500">
                Enter volunteer passcode. Default: <code className="text-amber-700 font-bold">2026</code>
              </p>
              <form onSubmit={handlePinSubmit} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter PIN (e.g. 2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-center text-lg tracking-widest"
                />
                {pinError && (
                  <p className="text-xs text-rose-600">Invalid PIN. Try 2026.</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 text-sm shadow-md"
                >
                  Unlock Gate Portal
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Capacity</span>
                  <span className="text-base font-black text-slate-900 mt-0.5 block">{totalSpots.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Registered</span>
                  <span className="text-base font-black text-amber-700 mt-0.5 block">{claimedSpots.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-amber-800 block text-[10px] uppercase font-bold">Checked In</span>
                  <span className="text-base font-black text-amber-900 mt-0.5 block">{checkedInCount} Passholders</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Gate Clearance</span>
                  <span className="text-base font-black text-slate-800 mt-0.5 block">
                    {tickets.length ? Math.round((checkedInCount / tickets.length) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Controls: Search, Filters, CSV Export */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, ticket ID (FC-W26), email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
                    {(['all', 'checked-in', 'pending'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setFilterStatus(mode)}
                        className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                          filterStatus === mode ? 'bg-white text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mode.replace('-', ' ')}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={exportAttendeesCSV}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Export attendee spreadsheet"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Attendees List */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 rounded-2xl">
                {filteredTickets.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No attendees found matching "{searchTerm}".
                  </div>
                ) : (
                  filteredTickets.map((t) => (
                    <div
                      key={t.ticketId}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        t.checkedIn
                          ? 'bg-amber-50/70 border-amber-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                            t.checkedIn
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {t.checkedIn ? 'IN' : 'WAIT'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{t.name}</span>
                            <span className="font-mono text-[11px] text-amber-700 font-bold">
                              {t.ticketId}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              ({t.passCount} {t.passCount > 1 ? 'passes' : 'pass'})
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-0.5">
                            <span>{t.denomination}</span>
                            <span>•</span>
                            <span>{t.phone}</span>
                            <span>•</span>
                            <span>Age {t.ageGroup}</span>
                            {t.checkedIn && t.checkedInAt && (
                              <span className="text-amber-800 font-semibold">
                                Checked at {t.checkedInAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setViewingTicket(t)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View Digital Pass"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleCheckIn(t.ticketId)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            t.checkedIn
                              ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                              : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-sm'
                          }`}
                        >
                          {t.checkedIn ? (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Undo</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Check In</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
