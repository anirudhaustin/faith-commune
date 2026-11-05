import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { sounds } from '../../../services/soundEffects';
import { IncidentRecord, IncidentPriority, IncidentCategory, IncidentStatus } from '../../../types/ops';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  User, 
  ShieldAlert, 
  X
} from 'lucide-react';

export const IncidentDispatchApp: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for New Incident
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('medical');
  const [priority, setPriority] = useState<IncidentPriority>('P2-HIGH');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // Resolution Modal State
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadIncidents = async () => {
    const list = await opsDb.getIncidents();
    setIncidents(list);
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    if (priority === 'P1-CRITICAL') {
      sounds.playEmergencySiren();
    }

    await opsDb.createIncident({
      title: title.trim(),
      category,
      priority,
      location: location.trim(),
      description: description.trim(),
      reportedBy: reportedBy.trim() || 'Field Volunteer',
      assignedTo: assignedTo.trim() || undefined
    });

    setTitle('');
    setLocation('');
    setDescription('');
    setReportedBy('');
    setAssignedTo('');
    setIsModalOpen(false);

    loadIncidents();
  };

  const handleStatusChange = async (id: string, status: IncidentStatus) => {
    if (status === 'resolved') {
      setResolvingId(id);
      return;
    }
    await opsDb.updateIncidentStatus(id, status);
    loadIncidents();
  };

  const handleConfirmResolution = async () => {
    if (!resolvingId) return;
    await opsDb.updateIncidentStatus(resolvingId, 'resolved', undefined, resolutionNotes.trim() || 'Resolved on floor');
    setResolvingId(null);
    setResolutionNotes('');
    loadIncidents();
  };

  const filtered = incidents.filter((i) => {
    const matchesPriority = priorityFilter === 'all' || i.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const criticalCount = incidents.filter((i) => i.status !== 'resolved' && (i.priority === 'P1-CRITICAL' || i.priority === 'P2-HIGH')).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Safety & Emergency Dispatch
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
              P1-P4 Triage Grid
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Incident Command & Field Dispatch
          </h1>
          <p className="text-xs text-slate-500">
            Log medical emergencies, crowd bottlenecks, power/AV alerts, and dispatch field teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Urgent Alerts
            </div>
            <div className="text-2xl font-black text-amber-800">
              {criticalCount} <span className="text-sm font-semibold text-slate-400">Unresolved</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-5 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500">Priority:</span>
          {['all', 'P1-CRITICAL', 'P2-HIGH', 'P3-MEDIUM', 'P4-LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                priorityFilter === p
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-50/60 text-slate-600 hover:text-slate-900 border border-amber-200/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Status:</span>
          {['all', 'open', 'investigating', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-50/60 text-slate-600 hover:text-slate-900 border border-amber-200/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Board */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-3xl bg-white border border-amber-200/80 text-slate-400 shadow-sm">
            No incidents reported matching your criteria. Ground operations operating smoothly.
          </div>
        ) : (
          filtered.map((inc) => (
            <div
              key={inc.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white ${
                inc.priority === 'P1-CRITICAL' && inc.status !== 'resolved'
                  ? 'border-amber-500 shadow-[0_8px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-500/50'
                  : inc.priority === 'P2-HIGH' && inc.status !== 'resolved'
                  ? 'border-amber-300 shadow-sm'
                  : 'border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)]'
              }`}
            >
              {/* Left Details */}
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                      inc.priority === 'P1-CRITICAL'
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : inc.priority === 'P2-HIGH'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {inc.priority}
                  </span>

                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {inc.category}
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono">
                    Reported at {inc.reportedAt} by {inc.reportedBy}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900">{inc.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {inc.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{inc.location}</span>
                  </div>

                  {inc.assignedTo && (
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>Assigned to: <strong>{inc.assignedTo}</strong></span>
                    </div>
                  )}

                  {inc.resolvedAt && (
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Resolved at {inc.resolvedAt}</span>
                    </div>
                  )}
                </div>

                {inc.resolutionNotes && (
                  <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 italic mt-1">
                    Notes: {inc.resolutionNotes}
                  </p>
                )}
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-xl border ${
                    inc.status === 'open'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : inc.status === 'investigating'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {inc.status}
                </span>

                {inc.status === 'open' && (
                  <button
                    onClick={() => handleStatusChange(inc.id, 'investigating')}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold cursor-pointer transition-all shadow-sm"
                  >
                    Investigate
                  </button>
                )}

                {inc.status !== 'resolved' && (
                  <button
                    onClick={() => handleStatusChange(inc.id, 'resolved')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 text-xs font-bold cursor-pointer transition-all shadow-sm"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl my-6 bg-white border border-amber-300 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" /> Report Field Incident
            </h2>

            <form onSubmit={handleCreateIncident} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Crowd congestion at Gate 1 or First-aid assistance needed"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="medical">Medical / First-Aid</option>
                    <option value="crowd">Crowd / Gate Congestion</option>
                    <option value="technical">Technical / AV / Power</option>
                    <option value="security">Security / Perimeter</option>
                    <option value="facility">Facility / Sanitation</option>
                    <option value="lost_found">Lost Person / Property</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold"
                  >
                    <option value="P1-CRITICAL">P1-CRITICAL (Immediate Dispatch Siren)</option>
                    <option value="P2-HIGH">P2-HIGH (Urgent)</option>
                    <option value="P3-MEDIUM">P3-MEDIUM (Normal)</option>
                    <option value="P4-LOW">P4-LOW (Low Priority)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Exact Ground Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. East Seating Block Row M, or Gate 1 Pedestrian Arch"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Details</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the situation and what assistance is needed..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reported By</label>
                  <input
                    type="text"
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                    placeholder="Your name / Role"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign To Lead (Optional)</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Dr. Rebecca (Medical) or Daniel (Ushers)"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 font-bold text-slate-950 shadow-md cursor-pointer"
                >
                  Submit & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution Notes Modal */}
      {resolvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-amber-300 rounded-3xl p-6 max-w-md w-full space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" /> Close & Archive Incident
            </h3>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Resolution Summary</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="What action was taken to resolve this incident?"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResolvingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolution}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 cursor-pointer shadow-sm"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
