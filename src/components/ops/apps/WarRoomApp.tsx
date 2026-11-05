import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { useOpsAuth } from '../../../context/OpsAuthContext';
import { 
  Activity, 
  Users, 
  ScanLine, 
  Car, 
  AlertTriangle, 
  Sparkles, 
  Store, 
  Award, 
  RefreshCw,
  ArrowRight,
  Radio
} from 'lucide-react';
import { SupervisorVolunteerDispatcher } from '../dispatch/SupervisorVolunteerDispatcher';

export const WarRoomApp: React.FC = () => {
  const { setCurrentApp } = useOpsAuth();
  const [stats, setStats] = useState({
    totalAdmitted: 0,
    totalRegistered: 0,
    capacity: 2000,
    volunteersOnDuty: 0,
    totalVolunteers: 0,
    parkingOccupancy: 0,
    parkingCapacity: 0,
    openIncidentsCount: 0,
    criticalIncidentsCount: 0,
    vipsReady: 0,
    totalVips: 0,
    stallsOpen: 0,
    totalStalls: 0,
    sponsorsPercent: 0
  });

  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [recentVips, setRecentVips] = useState<any[]>([]);
  const [recentBroadcasts, setRecentBroadcasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWarRoomData = async () => {
    setIsLoading(true);
    const [
      attendees,
      volunteers,
      incidents,
      parking,
      vips,
      stalls,
      sponsors,
      broadcasts
    ] = await Promise.all([
      opsDb.getAttendees(),
      opsDb.getVolunteers(),
      opsDb.getIncidents(),
      opsDb.getParkingZones(),
      opsDb.getVips(),
      opsDb.getStalls(),
      opsDb.getSponsors(),
      opsDb.getBroadcasts()
    ]);

    const admittedCount = attendees.reduce((acc, a) => acc + (a.checkedIn ? a.passCount : 0), 0);
    const registeredCount = attendees.reduce((acc, a) => acc + a.passCount, 0);

    const onDuty = volunteers.filter((v) => v.checkedIn).length;
    
    const parkOccupied = parking.reduce((acc, p) => acc + p.currentCount, 0);
    const parkCap = parking.reduce((acc, p) => acc + p.capacity, 0);

    const openIncs = incidents.filter((i) => i.status !== 'resolved');
    const critIncs = openIncs.filter((i) => i.priority === 'P1-CRITICAL' || i.priority === 'P2-HIGH');

    const vipsOnSite = vips.filter((v) => ['in-green-room', 'backstage-ready', 'on-stage', 'completed'].includes(v.status));
    const openStallsCount = stalls.filter((s) => s.status === 'open').length;

    let totalTasks = 0;
    let completedTasks = 0;
    sponsors.forEach((s) => {
      s.deliverables.forEach((d) => {
        totalTasks++;
        if (d.completed) completedTasks++;
      });
    });
    const spPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    setStats({
      totalAdmitted: admittedCount,
      totalRegistered: registeredCount || 2000,
      capacity: 2000,
      volunteersOnDuty: onDuty,
      totalVolunteers: volunteers.length,
      parkingOccupancy: parkOccupied,
      parkingCapacity: parkCap,
      openIncidentsCount: openIncs.length,
      criticalIncidentsCount: critIncs.length,
      vipsReady: vipsOnSite.length,
      totalVips: vips.length,
      stallsOpen: openStallsCount,
      totalStalls: stalls.length,
      sponsorsPercent: spPercent
    });

    setRecentIncidents(openIncs.slice(0, 3));
    setRecentVips(vips);
    setRecentBroadcasts(broadcasts.slice(0, 2));
    setIsLoading(false);
  };

  useEffect(() => {
    loadWarRoomData();
    const interval = setInterval(loadWarRoomData, 10000);
    return () => clearInterval(interval);
  }, []);

  const admittedPercentage = Math.round((stats.totalAdmitted / stats.capacity) * 100);
  const parkingPercentage = stats.parkingCapacity > 0 ? Math.round((stats.parkingOccupancy / stats.parkingCapacity) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* War Room Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-300">
                Live Operations
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Venue: 4-Acre School Ground
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mission Control War Room
            </h1>
          </div>
        </div>

        <button
          onClick={loadWarRoomData}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Operations</span>
        </button>
      </div>

      {/* Main 4 KPI Hero Gauges (White Cards, Gold Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Footfall Admitted */}
        <div 
          onClick={() => setCurrentApp('scanner')}
          className="p-5 rounded-3xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-[0_8px_30px_rgba(217,119,6,0.06)] hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-amber-600" /> Ground Footfall
            </span>
            <span className="text-[10px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
              Gate Kiosk &rarr;
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-slate-900">
              {stats.totalAdmitted}
            </div>
            <div className="text-xs font-bold text-slate-500">
              / {stats.capacity} Cap
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, admittedPercentage)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>{admittedPercentage}% In Venue</span>
            <span className="text-amber-700 font-bold">Fast Gates</span>
          </div>
        </div>

        {/* KPI 2: Active Volunteers */}
        <div 
          onClick={() => setCurrentApp('crew')}
          className="p-5 rounded-3xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-[0_8px_30px_rgba(217,119,6,0.06)] hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" /> Volunteers On Duty
            </span>
            <span className="text-[10px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
              CrewForce &rarr;
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-slate-900">
              {stats.volunteersOnDuty}
            </div>
            <div className="text-xs font-bold text-slate-500">
              / {stats.totalVolunteers} Roster
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.volunteersOnDuty / (stats.totalVolunteers || 1)) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>8 Active Departments</span>
            <span className="text-amber-700 font-bold">150-200 Staff Ready</span>
          </div>
        </div>

        {/* KPI 3: Parking Grounds */}
        <div 
          onClick={() => setCurrentApp('parking')}
          className="p-5 rounded-3xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-[0_8px_30px_rgba(217,119,6,0.06)] hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-600" /> Ground Parking
            </span>
            <span className="text-[10px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
              Traffic Hub &rarr;
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-slate-900">
              {stats.parkingOccupancy}
            </div>
            <div className="text-xs font-bold text-slate-500">
              / {stats.parkingCapacity} Vehicles
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${
                parkingPercentage > 85 ? 'bg-amber-600' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, parkingPercentage)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>{parkingPercentage}% Full</span>
            <span className="text-amber-800 font-bold">
              {parkingPercentage > 85 ? 'Heavy Traffic' : 'Flow Smooth'}
            </span>
          </div>
        </div>

        {/* KPI 4: Active Incidents */}
        <div 
          onClick={() => setCurrentApp('incidents')}
          className="p-5 rounded-3xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-[0_8px_30px_rgba(217,119,6,0.06)] hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> Safety Incidents
            </span>
            <span className="text-[10px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
              Dispatch &rarr;
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-slate-900">
              {stats.openIncidentsCount}
            </div>
            <div className="text-xs font-bold text-slate-500">
              {stats.criticalIncidentsCount} Urgent
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${
                stats.criticalIncidentsCount > 0 ? 'bg-amber-600' : 'bg-slate-300'
              }`}
              style={{ width: `${stats.openIncidentsCount > 0 ? 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Triage Board Active</span>
            <span className="text-amber-800 font-bold">
              {stats.criticalIncidentsCount > 0 ? 'Action Required' : 'All Clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Supervisor Volunteer Duty Assignment & Live Dispatcher */}
      <SupervisorVolunteerDispatcher />

      {/* Middle Row: Operational Modules Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VIP & Stage Run-of-Show Readiness */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">VIP & Stage Protocol</h3>
            </div>
            <button
              onClick={() => setCurrentApp('vip')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              Run-of-Show <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentVips.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{v.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {v.role} • Stage: <span className="text-amber-800 font-bold">{v.stageTime}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-amber-800 border border-amber-300">
                  {v.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Stalls & Marketplace */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Commercial Stalls & Food</h3>
            </div>
            <button
              onClick={() => setCurrentApp('stalls')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              Manage Stalls <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
              <div className="text-2xl font-black text-slate-900">{stats.stallsOpen}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Stalls Open</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
              <div className="text-2xl font-black text-amber-700">100%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Power & Safety Checked</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-amber-200/60 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">Categories Active</div>
            <p className="text-[11px] text-slate-500">
              Clothing Apparel, Deccan Rolls Street Food, Specialty Coffee, Scripture Bibles, Handcrafted Jewellery.
            </p>
          </div>
        </div>

        {/* Sponsor Brand Deliverables */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Sponsor Marketing</h3>
            </div>
            <button
              onClick={() => setCurrentApp('sponsors')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              Checklist <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Deliverables Executed</span>
              <span className="font-bold text-amber-800">{stats.sponsorsPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.sponsorsPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              LED main screen ads rotating every 45 mins. Stage MC acknowledgments scheduled.
            </p>
          </div>

          {/* Quick CRM Jump */}
          <button
            onClick={() => setCurrentApp('crm')}
            className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 flex items-center justify-between cursor-pointer transition-all shadow-sm"
          >
            <span>Open Attendee Intelligence CRM (2,000 Capacity)</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Active Incident Dispatch Ticker & Radio Broadcast Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Incidents Ticker */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-bold text-slate-900">Active Safety Alerts</h3>
            </div>
            <button
              onClick={() => setCurrentApp('incidents')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              All Incidents ({stats.openIncidentsCount}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {recentIncidents.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No active safety or crowd alerts reported.</p>
            ) : (
              recentIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{inc.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                        {inc.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {inc.location} • Reported: {inc.reportedAt}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 px-2 py-0.5 rounded bg-white border border-amber-300">
                    {inc.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Broadcast Stream */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-600 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900">Recent Team Radio Transmissions</h3>
            </div>
            <span className="text-[10px] font-medium text-slate-500">Channel: All Volunteer Stations</span>
          </div>

          <div className="space-y-2">
            {recentBroadcasts.map((bc) => (
              <div
                key={bc.id}
                className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-amber-800">{bc.sentBy}</span>
                  <span>{bc.sentAt}</span>
                </div>
                <p className="text-slate-800 font-medium">{bc.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
