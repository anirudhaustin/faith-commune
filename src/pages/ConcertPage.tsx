import React from 'react';
import { useApp } from '../context/AppContext';
import { CONCERT_DETAILS } from '../data/mockData';
import { 
  Ticket, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  ScanLine, 
  Car, 
  Coffee 
} from 'lucide-react';

export const ConcertPage: React.FC = () => {
  const { 
    setRegisterModalOpen, 
    setGateModalOpen, 
    claimedSpots, 
    totalSpots 
  } = useApp();

  const percentage = Math.round((claimedSpots / totalSpots) * 100);
  const remaining = totalSpots - claimedSpots;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-16 text-left">
      {/* Concert Hero Banner: White & Gold with Glowing Gold Shadow */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 lg:p-14 border-2 border-amber-300 shadow-[0_25px_60px_rgba(217,119,6,0.18),0_0_35px_rgba(245,158,11,0.12)]">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            FAITH COMMUNE x EAST HYDERABAD REVIVAL PRESENTS
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            ARISE <span className="text-gradient-gold">2026</span>
          </h1>

          <p className="text-sm font-semibold text-amber-800 italic">
            "{CONCERT_DETAILS.scripture}"
          </p>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {CONCERT_DETAILS.description}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Date & Time</span>
                <span className="font-bold text-slate-900">{CONCERT_DETAILS.date}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">City & Venue</span>
                <span className="font-bold text-slate-900 truncate">Hyderabad (HYD)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Expected Footfall</span>
                <span className="font-bold text-amber-800">2,500 – 3,000 Youth</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="gold-sweep-btn w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-[0_12px_35px_rgba(217,119,6,0.35)] flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Ticket className="w-4 h-4 text-slate-950" />
              <span>Claim Free Digital Pass</span>
            </button>

            <button
              onClick={() => setGateModalOpen(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-amber-600" />
              <span>Volunteer Gate Check-In Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE CAPACITY METER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-300 shadow-[0_12px_35px_rgba(217,119,6,0.15)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              REGISTRATION STATUS
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Passes Claimed: {claimedSpots.toLocaleString()} / {totalSpots.toLocaleString()}
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-800 self-start sm:self-auto">
            {remaining} Passes Remaining ({percentage}% Booked)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Due to safety guidelines at The Lumina Arena (Hall 4), capacity is capped at 3,000 attendees. Each pass includes a personalized digital QR badge for swift check-in.
        </p>
      </div>

      {/* GUEST ARTISTS & MULTI-CHURCH LINEUP */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            THE STAGE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Singers & Ensembles from 25+ Churches
          </h2>
          <p className="text-xs text-slate-600">
            Vocalists, choirs, brass, and modern worship teams from across the city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONCERT_DETAILS.lineup.map((artist, idx) => (
            <div
              key={idx}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.08)] space-y-3 flex flex-col justify-between"
            >
              <div>
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-44 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div className="mt-3">
                  <h4 className="font-bold text-slate-900 text-sm">{artist.name}</h4>
                  <p className="text-xs text-amber-700 font-bold">{artist.role}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {artist.church}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {artist.bio}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-amber-800">Confirmed</span>
                <span>Multi-Church Ensemble</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONCERT SCHEDULE */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            SCHEDULE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Evening Flow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              time: "5:00 PM",
              title: "Gates Open & Networking",
              desc: "Pass scanning, acoustic welcome sets, coffee zone, and fellowship."
            },
            {
              time: "6:15 PM",
              title: "All-Church Choir Anthem",
              desc: "Multi-church vocal ensemble launching the night into praise."
            },
            {
              time: "7:45 PM",
              title: "Kingdom in the City",
              desc: "Keynote on faith and workplace ambition without compromise."
            },
            {
              time: "8:15 PM",
              title: "Unified Worship Wave",
              desc: "Full bands unite for anthems, acoustic choruses, and prayer."
            }
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_20px_rgba(217,119,6,0.06)] space-y-2">
              <span className="font-mono text-xs font-black text-amber-700 block">
                {item.time}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VENUE & GUIDELINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.08)] space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>Venue & Parking Guidelines</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Lumina Arena is located opposite Central Metro Station (Gate 3 Exit). For drivers, designated parking is available in Gates B and C.
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-600" />
              <span>Free Parking for 1,200 vehicles</span>
            </li>
            <li className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600" />
              <span>Youth Coffee & Refreshment Zone</span>
            </li>
            <li className="flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-amber-600" />
              <span>Mobile QR entry lines at all doors</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.08)] space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>Passholder FAQ</span>
          </h3>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>Do I need to print my pass?</strong><br />
              No. You can show the digital pass directly on your smartphone screen.
            </p>
            <p>
              <strong>Can I bring friends who aren't Christian?</strong><br />
              Yes, 100%. Everyone is warmly welcomed without judgment. You can reserve up to 4 passes for friends.
            </p>
          </div>
        </div>
      </div>

      {/* FINAL REGISTRATION BAR */}
      <div className="p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-300 shadow-[0_15px_40px_rgba(217,119,6,0.18)] text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
          Reserve Your Free Seat Among the 3,000
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Passes are going fast. Secure your spot and receive your personal QR badge.
        </p>
        <button
          onClick={() => setRegisterModalOpen(true)}
          className="px-8 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_10px_25px_rgba(217,119,6,0.35)] inline-flex items-center gap-2 cursor-pointer"
        >
          <Ticket className="w-4 h-4 text-slate-950" />
          <span>Claim Free Pass Now</span>
        </button>
      </div>
    </div>
  );
};
