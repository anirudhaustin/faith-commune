import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { VolunteerMember, OpsAppId } from '../../../types/ops';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Save, 
  Plus, 
  X,
  ScanLine,
  Car,
  AlertTriangle,
  Sparkles,
  Store,
  RefreshCw,
  Phone
} from 'lucide-react';

const STATION_OPTIONS: { appId: OpsAppId; label: string; icon: React.ReactNode; defaultZone: string }[] = [
  { appId: 'scanner', label: 'FastScan Gate Kiosk', icon: <ScanLine className="w-3.5 h-3.5" />, defaultZone: 'Gate 1 - North Main' },
  { appId: 'parking', label: 'Ground Parking Hub', icon: <Car className="w-3.5 h-3.5" />, defaultZone: 'North Ground - Four Wheelers' },
  { appId: 'incidents', label: 'Incident & Medical Dispatch', icon: <AlertTriangle className="w-3.5 h-3.5" />, defaultZone: 'Medical Post 1 - School Hall' },
  { appId: 'vip', label: 'VIP & Stage Protocol', icon: <Sparkles className="w-3.5 h-3.5" />, defaultZone: 'Backstage Green Room' },
  { appId: 'stalls', label: 'Commercial Stalls & Vendors', icon: <Store className="w-3.5 h-3.5" />, defaultZone: 'School Quadrangle Stalls' }
];

const ZONE_OPTIONS = [
  'Gate 1 - North Main Arch',
  'Gate 2 - East Public Ground',
  'Gate 3 - VIP West Access',
  'Gate 4 - Vendor & Logistics',
  'North Ground - Four Wheelers',
  'West Lawn - Two Wheelers',
  'VIP Stage Access Bay',
  'Medical Post 1 - School Hall',
  'School Quadrangle Stalls',
  'Backstage Green Room',
  'Ushers Block A - Main Stage Lawn',
  'Ushers Block B - Rear Grounds'
];

export const SupervisorVolunteerDispatcher: React.FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerMember | null>(null);
  
  // Assignment form state
  const [targetApp, setTargetApp] = useState<OpsAppId>('scanner');
  const [targetZone, setTargetZone] = useState('Gate 1 - North Main Arch');
  const [targetRole, setTargetRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add new volunteer form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDept, setNewDept] = useState('Gate Security & Scanning');
  const [newRole, setNewRole] = useState('Gate Scanner');
  const [newStation, setNewStation] = useState<OpsAppId>('scanner');
  const [newZone, setNewZone] = useState('Gate 1 - North Main Arch');

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ops?action=get_volunteers');
      if (res.ok) {
        const data = await res.json();
        if (data.volunteers) {
          const mapped: VolunteerMember[] = data.volunteers.map((v: any) => ({
            id: v.id,
            code: v.volunteer_code,
            fullName: v.full_name,
            phone: v.phone,
            email: v.email,
            department: v.department,
            role: v.role,
            isLead: v.is_lead,
            shift: v.shift,
            checkedIn: v.checked_in,
            checkedInAt: v.checked_in_at,
            emergencyContact: v.emergency_contact,
            assignedZone: v.assigned_zone,
            assignedApp: v.assigned_app
          }));
          setVolunteers(mapped);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // fallback
    }

    // Fallback to local DB
    const list = await opsDb.getVolunteers();
    setVolunteers(list);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const openAssignModal = (vol: VolunteerMember) => {
    setEditingVolunteer(vol);
    setTargetApp((vol.assignedApp as OpsAppId) || 'scanner');
    setTargetZone(vol.assignedZone || ZONE_OPTIONS[0]);
    setTargetRole(vol.role || '');
  };

  const handleSaveAssignment = async () => {
    if (!editingVolunteer) return;
    setIsSaving(true);

    try {
      // 1. Try serverless Neon update
      const res = await fetch('/api/ops?action=assign_duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volunteerId: editingVolunteer.id || editingVolunteer.code,
          assignedApp: targetApp,
          assignedZone: targetZone,
          role: targetRole
        })
      });

      if (!res.ok) {
        throw new Error('Server assignment failed');
      }
    } catch {
      // fallback local update
    }

    // 2. Update local state & storage
    setVolunteers((prev) =>
      prev.map((v) =>
        v.code === editingVolunteer.code
          ? { ...v, assignedApp: targetApp, assignedZone: targetZone, role: targetRole || v.role }
          : v
      )
    );

    setNotification({
      type: 'success',
      message: `Assigned ${editingVolunteer.fullName} (${editingVolunteer.code}) to ${targetApp.toUpperCase()} at ${targetZone}.`
    });

    setIsSaving(false);
    setEditingVolunteer(null);

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleCreateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone) return;

    const newCode = 'VOL-' + Math.floor(100 + Math.random() * 900);
    const newVol: VolunteerMember = {
      id: 'vol-' + Math.random().toString(36).substring(2, 9),
      code: newCode,
      fullName: newFullName,
      phone: newPhone,
      department: newDept as any,
      role: newRole,
      isLead: false,
      shift: 'Main Event Peak (14:00 - 21:00)',
      checkedIn: true,
      checkedInAt: new Date().toLocaleTimeString(),
      assignedZone: newZone,
      assignedApp: newStation
    };

    // Save to local DB & Neon
    opsDb.addVolunteer(newVol);
    setVolunteers((prev) => [newVol, ...prev]);

    try {
      await fetch('/api/ops?action=assign_duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volunteerId: newVol.id,
          assignedApp: newStation,
          assignedZone: newZone,
          role: newRole
        })
      });
    } catch {
      // ignore
    }

    setIsAddModalOpen(false);
    setNewFullName('');
    setNewPhone('');

    setNotification({
      type: 'success',
      message: `Registered & assigned ${newFullName} with Code: ${newCode}`
    });

    setTimeout(() => setNotification(null), 4000);
  };

  const filtered = volunteers.filter((v) => {
    const matchDept = selectedDept === 'all' || v.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchSearch =
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm) ||
      (v.assignedZone || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="bg-white border border-amber-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Operations Head Command
            </span>
            <span className="text-xs text-slate-500 font-medium">
              150-200 Field Staff Protocol
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            Volunteer Duty Assignment & Station Dispatcher
          </h2>
          <p className="text-xs text-slate-500">
            Supervisor assigns each volunteer to a specific duty app & physical gate/zone. Volunteers only see their assigned screen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchVolunteers}
            disabled={isLoading}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Volunteer</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search volunteers by name, code (e.g. VOL-101), phone, or zone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
        >
          <option value="all">All Departments ({volunteers.length})</option>
          <option value="Gate">Gates & Access Scanning</option>
          <option value="Parking">Traffic & Ground Parking</option>
          <option value="Medical">Medical & Safety First-Aid</option>
          <option value="VIP">VIP & Stage Protocol</option>
          <option value="Stall">Commercial Stalls</option>
          <option value="Usher">Ushers & Crowd Flow</option>
        </select>
      </div>

      {/* Volunteers Table */}
      <div className="overflow-x-auto rounded-2xl border border-amber-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-amber-50/70 border-b border-amber-200/80 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Volunteer</th>
              <th className="py-3 px-4">Phone / Code</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Current Assigned Duty Post</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Dispatch Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                  No volunteers found matching your query.
                </td>
              </tr>
            ) : (
              filtered.map((v) => {
                const assignedAppMeta = STATION_OPTIONS.find((s) => s.appId === v.assignedApp) || STATION_OPTIONS[0];
                return (
                  <tr key={v.code} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{v.fullName}</div>
                      <div className="text-[11px] text-slate-500">{v.role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {v.code}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                        {v.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {v.department}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="p-1 rounded bg-amber-100 text-amber-800">
                          {assignedAppMeta.icon}
                        </span>
                        <span>{assignedAppMeta.label}</span>
                      </div>
                      <div className="text-[10px] text-amber-900 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-amber-600" />
                        {v.assignedZone || 'Not assigned'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {v.checkedIn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-300 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          On Duty
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
                          <Clock className="w-3 h-3" />
                          Scheduled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openAssignModal(v)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 font-bold text-amber-900 text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        Assign Post
                        <ArrowRight className="w-3 h-3 text-amber-700" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Assign Duty & Station */}
      {editingVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-amber-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Assign Duty Station & App
                </h3>
                <p className="text-xs text-slate-500">
                  Target volunteer: <strong>{editingVolunteer.fullName}</strong> ({editingVolunteer.code})
                </p>
              </div>
              <button
                onClick={() => setEditingVolunteer(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Select Station App */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Designated Duty App (Locked in Volunteer Phone)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.appId}
                      type="button"
                      onClick={() => {
                        setTargetApp(opt.appId);
                        setTargetZone(opt.defaultZone);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        targetApp === opt.appId
                          ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={targetApp === opt.appId ? 'text-white' : 'text-amber-600'}>
                        {opt.icon}
                      </span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Zone / Physical Gate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Physical Venue Station / Gate Location
                </label>
                <select
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {ZONE_OPTIONS.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Duty Role Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Lead Gate Scanner, Parking Marshall"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                🔒 When <strong>{editingVolunteer.fullName}</strong> signs in using code <strong>{editingVolunteer.code}</strong>, their phone will automatically lock to this station. They will NOT have access to War Room or CRM.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingVolunteer(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveAssignment}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Confirm Assignment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Field Volunteer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <form onSubmit={handleCreateVolunteer} className="w-full max-w-md bg-white rounded-3xl border border-amber-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Register New Field Staff / Volunteer
                </h3>
                <p className="text-xs text-slate-500">
                  Adds volunteer to 4-acre event roster & assigns login permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Johnathan Mark"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Gate Security & Scanning">Gate Scanning</option>
                    <option value="Parking & Ground Traffic">Parking & Traffic</option>
                    <option value="Emergency & Medical First-Aid">Medical & Safety</option>
                    <option value="VIP & Minister Hospitality">VIP & Stage</option>
                    <option value="Stalls & Market Coordination">Commercial Stalls</option>
                    <option value="Ushers & Crowd Flow">Ushers & Flow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Station App
                  </label>
                  <select
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value as OpsAppId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="scanner">Gate Scanner</option>
                    <option value="parking">Parking Hub</option>
                    <option value="incidents">Incident Lead</option>
                    <option value="vip">VIP Protocol</option>
                    <option value="stalls">Stalls Officer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Gate / Zone
                </label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {ZONE_OPTIONS.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Volunteer</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
