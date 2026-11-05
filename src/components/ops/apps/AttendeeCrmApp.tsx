import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { AttendeeRecord } from '../../../types/ops';
import { 
  Database, 
  Download, 
  Search, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  X,
  ShieldAlert
} from 'lucide-react';
import { useOpsAuth } from '../../../context/OpsAuthContext';

export const AttendeeCrmApp: React.FC = () => {
  const { isDirector } = useOpsAuth();
  const [attendees, setAttendees] = useState<AttendeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked-in' | 'pending'>('all');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  // New Walk-in Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [denomination, setDenomination] = useState('Inter-Denominational');
  const [homeChurch, setHomeChurch] = useState('');
  const [passCount, setPassCount] = useState(1);
  const [ageGroup, setAgeGroup] = useState('21-25');
  const [interests] = useState<string[]>(['worship-music']);

  const loadAttendees = async () => {
    const list = await opsDb.getAttendees();
    setAttendees(list);
  };

  useEffect(() => {
    if (isDirector) {
      loadAttendees();
    }
  }, [isDirector]);

  if (!isDirector) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-amber-200 rounded-3xl text-center shadow-lg">
        <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h2 className="text-lg font-black text-slate-900">Confidential Attendee Vault</h2>
        <p className="text-xs text-slate-600 mt-2">
          Attendee contact details and CRM records are strictly protected. Only the Operations Head / Command Director has access to export or browse attendee personal data.
        </p>
      </div>
    );
  }

  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Full Name',
      'Phone Number',
      'Email Address',
      'Age Group',
      'Denomination',
      'Home Church',
      'Pass Count',
      'Checked In Status',
      'Checked In Time',
      'Admitted Gate',
      'Ministry Interests',
      'Volunteer Opt-In',
      'Registered At'
    ];

    const rows = attendees.map((a) => [
      `"${a.ticketId}"`,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${a.email || ''}"`,
      `"${a.ageGroup || ''}"`,
      `"${a.denomination || ''}"`,
      `"${(a.homeChurch || '').replace(/"/g, '""')}"`,
      a.passCount,
      a.checkedIn ? 'YES' : 'NO',
      `"${a.checkedInAt || ''}"`,
      `"${a.gate || ''}"`,
      `"${(a.interests || []).join(', ')}"`,
      a.isVolunteerOptIn ? 'YES' : 'NO',
      `"${a.registeredAt}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faith_Commune_Event_Attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const ticketId = 'FC-W26-' + Math.floor(1000 + Math.random() * 9000);

    await opsDb.registerAttendee({
      ticketId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      ageGroup,
      denomination,
      homeChurch: homeChurch.trim(),
      passCount: Number(passCount) || 1,
      interests,
      isVolunteerOptIn: false
    });

    setName('');
    setPhone('');
    setEmail('');
    setHomeChurch('');
    setIsWalkInModalOpen(false);
    loadAttendees();
  };

  const filteredAttendees = attendees.filter((a) => {
    if (statusFilter === 'checked-in' && !a.checkedIn) return false;
    if (statusFilter === 'pending' && a.checkedIn) return false;

    const term = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.ticketId.toLowerCase().includes(term) ||
      a.phone.includes(term) ||
      a.denomination.toLowerCase().includes(term) ||
      (a.homeChurch && a.homeChurch.toLowerCase().includes(term))
    );
  });

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-amber-600" /> Attendee Intelligence & CRM Vault
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
              2,000 Capacity Target
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Community Registry & Ministry Engagement
          </h1>
          <p className="text-xs text-slate-500">
            Collect, search, and export data of all attendees, denominations, home churches, and future ministry interests.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-900 flex items-center gap-2 border border-amber-300 cursor-pointer shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4 text-amber-600" />
            <span>On-Spot Walk-In Pass</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export Master CSV ({attendees.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Filter:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-amber-50/60 text-slate-600'
            }`}
          >
            All Registered ({attendees.length})
          </button>
          <button
            onClick={() => setStatusFilter('checked-in')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'checked-in' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-amber-50/60 text-slate-600'
            }`}
          >
            Checked In ({checkedInCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-amber-50/60 text-slate-600'
            }`}
          >
            Pending ({attendees.length - checkedInCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search attendee by name, phone, church..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-amber-200/80 overflow-hidden shadow-[0_8px_30px_rgba(217,119,6,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-amber-200 bg-amber-50/70 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Attendee Name</th>
                <th className="py-3.5 px-4">Contact Phone & Email</th>
                <th className="py-3.5 px-4">Church / Denomination</th>
                <th className="py-3.5 px-4">Pass Count</th>
                <th className="py-3.5 px-4">Gate Status</th>
                <th className="py-3.5 px-4">Ministry Interests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No attendee records found matching query.
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((att) => (
                  <tr key={att.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {att.ticketId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{att.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Age: {att.ageGroup || 'Youth'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div>{att.phone}</div>
                      {att.email && <div className="text-[11px] text-slate-400">{att.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{att.denomination}</div>
                      <div className="text-[11px] text-slate-500">{att.homeChurch || 'City Church'}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {att.passCount} spot{att.passCount > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4">
                      {att.checkedIn ? (
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          <span>Admitted ({att.checkedInAt || 'Verified'})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Not Checked In</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(att.interests || ['worship-music']).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* On-Spot Walk-In Modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-amber-300 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 text-xs shadow-2xl relative">
            <button
              onClick={() => setIsWalkInModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" /> Issue On-Spot Walk-In Pass
            </h2>

            <form onSubmit={handleCreateWalkIn} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Kumar"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pass Count</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={passCount}
                    onChange={(e) => setPassCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age Group</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  >
                    <option value="16-20">16-20 (Youth)</option>
                    <option value="21-25">21-25 (Young Adult)</option>
                    <option value="26-35">26-35 (Professional)</option>
                    <option value="36+">36+ (Family / Elder)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Denomination</label>
                  <select
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  >
                    <option value="Inter-Denominational">Inter-Denominational</option>
                    <option value="Baptist">Baptist</option>
                    <option value="Pentecostal">Pentecostal</option>
                    <option value="Catholic">Catholic</option>
                    <option value="CSI / Methodist">CSI / Methodist</option>
                    <option value="Independent / Other">Independent / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Home Church / Fellowship</label>
                <input
                  type="text"
                  value={homeChurch}
                  onChange={(e) => setHomeChurch(e.target.value)}
                  placeholder="e.g. St. Thomas Church or Calvary Fellowship"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold shadow-md cursor-pointer"
                >
                  Create & Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
