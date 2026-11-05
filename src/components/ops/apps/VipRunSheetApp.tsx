import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { VipGuest, VipStatus } from '../../../types/ops';
import { 
  Sparkles, 
  Mic2, 
  Clock, 
  Phone, 
  User, 
  ArrowRight,
  Shield,
  Utensils
} from 'lucide-react';

const STATUS_ORDER: VipStatus[] = [
  'expected',
  'in-transit',
  'in-green-room',
  'backstage-ready',
  'on-stage',
  'completed'
];

export const VipRunSheetApp: React.FC = () => {
  const [vips, setVips] = useState<VipGuest[]>([]);

  const loadVips = async () => {
    const list = await opsDb.getVips();
    setVips(list);
  };

  useEffect(() => {
    loadVips();
  }, []);

  const handleAdvanceStatus = async (id: string, currentStatus: VipStatus) => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    if (currentIndex < STATUS_ORDER.length - 1) {
      const nextStatus = STATUS_ORDER[currentIndex + 1];
      await opsDb.updateVipStatus(id, nextStatus);
      loadVips();
    }
  };

  const handleSetStatus = async (id: string, status: VipStatus) => {
    await opsDb.updateVipStatus(id, status);
    loadVips();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> VIP & Stage Protocol Command
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
              Gate 3 & Green Room Direct
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Guest Pastors, Speakers & Artists Run-of-Show
          </h1>
          <p className="text-xs text-slate-500">
            Real-time stage countdown, soundcheck clearances, green-room hospitality, and escort coordination.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total VIP Ministers & Bands
            </div>
            <div className="text-2xl font-black text-amber-800">
              {vips.length} Headliners
            </div>
          </div>
        </div>
      </div>

      {/* VIP Cards Grid */}
      <div className="space-y-4">
        {vips.map((vip) => (
          <div
            key={vip.id}
            className={`p-6 rounded-3xl border transition-all bg-white ${
              vip.status === 'on-stage'
                ? 'border-amber-500 shadow-[0_8px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-500'
                : vip.status === 'backstage-ready'
                ? 'border-amber-300 shadow-sm'
                : 'border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                    {vip.role}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {vip.churchOrOrg}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>{vip.name}</span>
                  {vip.status === 'on-stage' && (
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold animate-pulse shadow-sm">
                      LIVE ON STAGE
                    </span>
                  )}
                </h2>

                {/* Times Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Arrival: <strong>{vip.scheduledArrivalTime}</strong></span>
                  </div>
                  {vip.soundcheckTime && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mic2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Soundcheck: <strong>{vip.soundcheckTime}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Stage Cue: {vip.stageTime}</span>
                  </div>
                </div>

                {/* Hospitality & Escort */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: <strong className="text-slate-700">{vip.greenRoomId}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Escort: <strong className="text-slate-700">{vip.escortVolunteerName}</strong></span>
                    <a
                      href={`tel:${vip.escortPhone}`}
                      className="text-amber-700 hover:text-amber-900 font-bold ml-1 inline-flex items-center gap-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      {vip.escortPhone}
                    </a>
                  </div>
                  {vip.dietaryNotes && (
                    <div className="flex items-center gap-1.5 text-slate-700 italic">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      <span>{vip.dietaryNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Stepper & Action */}
              <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_ORDER.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSetStatus(vip.id, st)}
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        vip.status === st
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800'
                      }`}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {vip.status !== 'completed' && (
                  <button
                    onClick={() => handleAdvanceStatus(vip.id, vip.status)}
                    className="py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Advance Stage Status</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
