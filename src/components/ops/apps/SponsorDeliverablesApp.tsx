import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { SponsorRecord } from '../../../types/ops';
import { 
  Award, 
  Phone, 
  Check 
} from 'lucide-react';

export const SponsorDeliverablesApp: React.FC = () => {
  const [sponsors, setSponsors] = useState<SponsorRecord[]>([]);

  const loadSponsors = async () => {
    const list = await opsDb.getSponsors();
    setSponsors(list);
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  const handleToggleDeliverable = async (sponsorId: string, deliverableId: string) => {
    await opsDb.toggleSponsorDeliverable(sponsorId, deliverableId);
    loadSponsors();
  };

  let totalTasks = 0;
  let completedTasks = 0;
  sponsors.forEach((s) => {
    s.deliverables.forEach((d) => {
      totalTasks++;
      if (d.completed) completedTasks++;
    });
  });
  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" /> Sponsor Marketing Command
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
              Brand Compliance Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Sponsor Deliverables & Stage Brand Exposure
          </h1>
          <p className="text-xs text-slate-500">
            Audit and verify LED screen commercials, MC verbal stage mentions, and exhibition pavilions.
          </p>
        </div>

        {/* Global Fulfillment Progress */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Deliverables Fulfilled
            </div>
            <div className="text-2xl font-black text-amber-800">
              {overallPercent}% <span className="text-xs font-semibold text-slate-400">({completedTasks}/{totalTasks})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sponsors.map((sponsor) => {
          const sCompleted = sponsor.deliverables.filter((d) => d.completed).length;
          const sTotal = sponsor.deliverables.length;
          const sPercent = sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 100;

          return (
            <div
              key={sponsor.id}
              className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                    {sponsor.tier}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    {sCompleted}/{sTotal} Complete ({sPercent}%)
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-900">{sponsor.brandName}</h2>

                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-600 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">{sponsor.contactPerson}</span>
                  </div>
                  <a
                    href={`tel:${sponsor.contactPhone}`}
                    className="text-amber-800 hover:text-amber-950 font-bold font-mono flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {sponsor.contactPhone}
                  </a>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${sPercent}%` }}
                  />
                </div>

                {/* Checklist of Deliverables */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Execution Checklist (Click to toggle)
                  </span>

                  {sponsor.deliverables.map((deliv) => (
                    <div
                      key={deliv.id}
                      onClick={() => handleToggleDeliverable(sponsor.id, deliv.id)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        deliv.completed
                          ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            deliv.completed
                              ? 'bg-amber-500 border-amber-500 text-slate-950'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {deliv.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className={deliv.completed ? 'line-through text-slate-400' : 'font-semibold text-slate-900'}>
                            {deliv.task}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Responsible: {deliv.assignedTeam}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          deliv.completed
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {deliv.completed ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
