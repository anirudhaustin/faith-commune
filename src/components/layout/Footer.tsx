import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import { Heart, Ticket, Globe, Share2, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setRegisterModalOpen } = useApp();

  return (
    <footer className="mt-24 border-t border-slate-200 relative overflow-hidden bg-white/95">
      {/* Top Gold Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-sm">
                FC
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Faith Commune
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              An inter-denominational community of youth, professionals, musicians, and thinkers. Where modern life, tech careers, and real faith meet in unity.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => navigateTo('community')}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Community"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('concert')}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Concert"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('initiatives')}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Real Talk"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {(
                [
                  ['home', 'Home'],
                  ['about', 'About Us & DNA'],
                  ['events', 'Events & Gatherings'],
                  ['concert', 'Concert 2026'],
                  ['initiatives', 'Tech & Mentorship'],
                  ['community', 'Inter-Church Registry']
                ] as [PageId, string][]
              ).map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => navigateTo(id)}
                    className="hover:text-amber-700 transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Initiatives */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Initiatives
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => navigateTo('initiatives')} className="hover:text-amber-700 transition-colors cursor-pointer">
                  Tech Career Mentorship
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('initiatives')} className="hover:text-amber-700 transition-colors cursor-pointer">
                  Real Talk Open Q&A
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('concert')} className="hover:text-amber-700 transition-colors cursor-pointer">
                  Multi-Church Choir Alliance
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('community')} className="hover:text-amber-700 transition-colors cursor-pointer">
                  Volunteer & Serve
                </button>
              </li>
            </ul>
          </div>

          {/* Concert Callout */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Next Gathering
            </h4>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 shadow-sm">
              <span className="font-bold text-slate-900 block">
                Awaken the Dawn Worship
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Expected 3,000 Footfall • Nov 27 • Free Pass
              </p>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Claim Pass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Faith Commune. All church denominations welcome. In essentials unity, in non-essentials liberty, in all things love.
          </p>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>for the next generation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
