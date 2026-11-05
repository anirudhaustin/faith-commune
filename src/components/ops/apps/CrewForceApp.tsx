import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { VolunteerMember, VolunteerDepartment } from '../../../types/ops';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Phone, 
  UserCheck, 
  QrCode,
  MapPin
} from 'lucide-react';
import { SupervisorVolunteerDispatcher } from '../dispatch/SupervisorVolunteerDispatcher';

const DEPARTMENTS: VolunteerDepartment[] = [
  'Gate Security & Scanning',
  'Ushers & Crowd Flow',
  'Stage, AV & Production',
  'VIP & Minister Hospitality',
  'Emergency & Medical First-Aid',
  'Stalls & Market Coordination',
  'Parking & Ground Traffic',
  'Media, Photo & Broadcast'
];

export const CrewForceApp: React.FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerMember[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInCode, setCheckInCode] = useState('');
  const [checkInMsg, setCheckInMsg] = useState<{ success: boolean; message: string } | null>(null);

  const loadVolunteers = async () => {
    const list = await opsDb.getVolunteers();
    setVolunteers(list);
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInCode.trim()) return;

    const res = await opsDb.checkInVolunteer(checkInCode.trim());
    setCheckInMsg(res);
    setCheckInCode('');
    if (res.success) {
      loadVolunteers();
    }
  };

  const handleQuickCheckIn = async (code: string) => {
    const res = await opsDb.checkInVolunteer(code);
    setCheckInMsg(res);
    if (res.success) {
      loadVolunteers();
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesDept = selectedDept === 'all' || v.department === selectedDept;
    const matchesSearch =
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm);

    return matchesDept && matchesSearch;
  });

  const onDutyCount = volunteers.filter((v) => v.checkedIn).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" /> CrewForce Volunteer Command
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
              150-200 Staff Protocol
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Volunteer Force & Shift Attendance
          </h1>
          <p className="text-xs text-slate-500">
            Real-time shift rosters, station check-ins, and department leads directory for 4-acre venue.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active On-Duty
            </div>
            <div className="text-2xl font-black text-amber-800">
              {onDutyCount} <span className="text-sm font-semibold text-slate-400">/ {volunteers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Head Volunteer Duty Dispatcher */}
      <SupervisorVolunteerDispatcher />

      {/* Quick Check-in Bar for Reception Kiosk */}
      <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-600" />
          Supervisor Volunteer Terminal & Self Check-In
        </div>

        <form onSubmit={handleCheckInSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={checkInCode}
              onChange={(e) => setCheckInCode(e.target.value)}
              placeholder="Enter or scan Volunteer ID Code (e.g. VOL-GT-01, VOL-US-02)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white text-sm text-slate-900 placeholder-slate-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-6 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Present on Duty</span>
          </button>
        </form>

        {checkInMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              checkInMsg.success
                ? 'bg-amber-50 border border-amber-300 text-amber-900'
                : 'bg-rose-50 border border-rose-300 text-rose-800'
            }`}
          >
            {checkInMsg.message}
          </div>
        )}
      </div>

      {/* Filter & Department Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-amber-50/60 text-slate-600 hover:text-slate-900 border border-amber-200'
            }`}
          >
            All Teams ({volunteers.length})
          </button>
          {DEPARTMENTS.map((dept) => {
            const count = volunteers.filter((v) => v.department === dept).length;
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-amber-50/40 text-slate-600 hover:text-slate-900 border border-amber-200/60'
                }`}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search volunteer by name/code..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Volunteer Table */}
      <div className="rounded-3xl bg-white border border-amber-200/80 overflow-hidden shadow-[0_8px_30px_rgba(217,119,6,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-amber-200 bg-amber-50/70 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Volunteer Code</th>
                <th className="py-3.5 px-4">Name & Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Shift & Assigned Zone</th>
                <th className="py-3.5 px-4">Phone / Contact</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No volunteers found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {vol.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{vol.fullName}</span>
                        {vol.isLead && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                            LEAD
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{vol.role}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {vol.department}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-semibold">{vol.shift}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        <span>{vol.assignedZone || 'Main Campus'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <a
                        href={`tel:${vol.phone}`}
                        className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-bold"
                      >
                        <Phone className="w-3 h-3" />
                        {vol.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      {vol.checkedIn ? (
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          <span>On Duty ({vol.checkedInAt || 'Present'})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!vol.checkedIn && (
                        <button
                          onClick={() => handleQuickCheckIn(vol.code)}
                          className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                        >
                          Check In
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
