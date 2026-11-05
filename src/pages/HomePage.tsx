import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CONCERT_DETAILS, DENOMINATION_STATS, TESTIMONIALS } from '../data/mockData';
import { 
  Ticket, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Laptop, 
  MessageCircle, 
  Music, 
  Briefcase 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, setRegisterModalOpen, claimedSpots, totalSpots } = useApp();

  // Concert Countdown Timer (Target: Nov 27, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 24,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const percentage = Math.round((claimedSpots / totalSpots) * 100);

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-8 text-center max-w-5xl mx-auto px-4">
        {/* Dynamic Clean Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-slate-900">
          Where Faith Meets <span className="text-gradient-gold">Real Life</span>,{' '}
          Careers & <span className="text-gradient-gold">Worship</span>.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A thriving community of youth, professionals, and seekers from all church backgrounds. We tackle job hunting, real-world struggles, and worship together in unity.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="gold-sweep-btn w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-[0_12px_35px_rgba(217,119,6,0.35),0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_16px_45px_rgba(217,119,6,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Ticket className="w-5 h-5 text-slate-950" />
            <span>Get Mega Concert Pass</span>
          </button>

          <button
            onClick={() => navigateTo('events')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-amber-400 hover:text-amber-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Gatherings</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>

        {/* Metrics Grid (White & Gold with Glowing Gold Shadow) */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: "3,000", label: "Concert Capacity" },
            { value: "15+", label: "Denominations" },
            { value: "45+", label: "Youth Placed in Jobs" },
            { value: "100%", label: "Open & Welcoming" }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(217,119,6,0.1),0_0_15px_rgba(245,158,11,0.06)] hover:shadow-[0_14px_35px_rgba(217,119,6,0.2),0_0_20px_rgba(245,158,11,0.12)] transition-all text-left"
            >
              <div className="text-3xl font-black text-amber-600 tracking-tight">{item.value}</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MEGA CONCERT SPOTLIGHT SECTION (White & Gold Theme) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white p-6 sm:p-10 lg:p-12 border-2 border-amber-300/80 shadow-[0_20px_50px_rgba(217,119,6,0.18),0_0_30px_rgba(245,158,11,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Concert Info & Countdown */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                FAITH COMMUNE x EAST HYDERABAD REVIVAL PRESENTS
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                ARISE <span className="text-gradient-gold">2026</span>
              </h2>

              <p className="text-sm font-semibold text-amber-800 italic">
                "{CONCERT_DETAILS.scripture}"
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Hyderabad, get ready for a night of worship! A generation called to arise, to shine, and to worship. Bringing together 3,000 youth and singers from churches across Hyderabad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold">Date & Time</span>
                    <span className="font-bold text-slate-900">{CONCERT_DETAILS.date} • 6 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold">Location</span>
                    <span className="font-bold text-slate-900 truncate">Hyderabad (HYD)</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block mb-2">
                  Event Countdown
                </span>
                <div className="grid grid-cols-4 gap-2.5 max-w-sm">
                  {[
                    { label: 'Days', val: timeLeft.days },
                    { label: 'Hours', val: timeLeft.hours },
                    { label: 'Mins', val: timeLeft.minutes },
                    { label: 'Secs', val: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-sm">
                      <div className="text-2xl font-black text-amber-600 font-mono">
                        {String(item.val).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Capacity & Pass CTA */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl p-6 sm:p-7 bg-amber-50/70 border border-amber-300 shadow-[0_12px_35px_rgba(217,119,6,0.15)] text-left space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Passes Status
                  </span>
                  <span className="text-xs font-bold text-amber-700">
                    Free Registration
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {claimedSpots.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      of {totalSpots.toLocaleString()} Capacity
                    </span>
                  </div>

                  {/* Gold Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs mt-2 font-medium">
                    <span className="text-amber-800 font-bold">{percentage}% Claimed</span>
                    <span className="text-slate-600">{totalSpots - claimedSpots} Passes Remaining</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-600 leading-relaxed shadow-sm">
                  Instant digital pass with personal QR code for gate entry generated upon submission.
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setRegisterModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-[0_10px_25px_rgba(217,119,6,0.35)] flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-slate-950" />
                    <span>Claim Your Free Pass</span>
                  </button>

                  <button
                    onClick={() => navigateTo('concert')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 text-center transition-colors cursor-pointer"
                  >
                    View Concert Artists & Full Lineup →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE PILLARS (Clean White, Gold & Slate Gray) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-2">
            A Modern Community for Real Life.
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Bridging faith, everyday careers, and genuine fellowship for the next generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 text-left">
          {/* Pillar 1: Tech & Career (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_12px_35px_rgba(217,119,6,0.1),0_0_15px_rgba(245,158,11,0.06)] hover:shadow-[0_18px_45px_rgba(217,119,6,0.22)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-5 shadow-sm">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Tech Talks & Career Mentorship</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Navigating the job market and career growth. Senior professionals in our community host free resume reviews, mock interviews, and share practical wisdom on balancing career excellence with faith.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 font-bold">Free Mentorship Available</span>
              <button
                onClick={() => navigateTo('initiatives')}
                className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Request Resume Review</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Pillar 2: Real Talk (5 cols) */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_12px_35px_rgba(217,119,6,0.1),0_0_15px_rgba(245,158,11,0.06)] hover:shadow-[0_18px_45px_rgba(217,119,6,0.22)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-5 shadow-sm">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Real Talk: Open Circles</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Safe-space discussions on workplace stress, mental health, loneliness, and life transitions with zero judgment.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 font-bold">Anonymous Q&A</span>
              <button
                onClick={() => navigateTo('initiatives')}
                className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ask Anything</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Pillar 3: Worship Concerts (5 cols) */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_12px_35px_rgba(217,119,6,0.1),0_0_15px_rgba(245,158,11,0.06)] hover:shadow-[0_18px_45px_rgba(217,119,6,0.22)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-5 shadow-sm">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">All-Church Worship Concerts</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Musicians and choirs from Catholic, Pentecostal, Baptist, and Methodist churches coming together in heartfelt, unified praise.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 font-bold">3,000 Seats</span>
              <button
                onClick={() => navigateTo('concert')}
                className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Lineup</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Pillar 4: Business Meets (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_12px_35px_rgba(217,119,6,0.1),0_0_15px_rgba(245,158,11,0.06)] hover:shadow-[0_18px_45px_rgba(217,119,6,0.22)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-5 shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Business Talks & Get Togethers</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Entrepreneurs, freelancers, and students connect to discuss ethical business practices, navigating office dynamics, and building long-lasting friendships over casual get-togethers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 font-bold">Regular Meets</span>
              <button
                onClick={() => navigateTo('events')}
                className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Event Calendar</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTER-DENOMINATIONAL REGISTRY (Clean White & Gold) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white p-7 sm:p-10 border border-slate-200/90 shadow-[0_14px_40px_rgba(217,119,6,0.12),0_0_20px_rgba(245,158,11,0.08)] text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            INTER-DENOMINATIONAL REGISTRY
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            One Body. One Community.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2">
            Youth from diverse Christian backgrounds actively participate and support one another in Faith Commune.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {DENOMINATION_STATS.map((d, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2 shadow-sm"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-bold text-slate-800">{d.name}</span>
                <span className="text-slate-500 font-mono text-[11px]">({d.count}+)</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigateTo('community')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-4 cursor-pointer"
            >
              Add Your Name to the Inter-Denominational Registry →
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (White & Gold) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Voices from the Community
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Stories from young people who found purpose, friendship, and mentorship here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(217,119,6,0.08),0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_16px_40px_rgba(217,119,6,0.18)] transition-all flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{t.quote}"
              </p>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-amber-700 font-semibold">{t.role}</p>
                  <p className="text-[10px] text-slate-500">{t.denomination} tradition</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION (White & Gold with Glowing Gold Shadow) */}
      <section className="max-w-4xl mx-auto px-4 text-center pb-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-amber-100/40 border border-amber-300/80 shadow-[0_20px_50px_rgba(217,119,6,0.2),0_0_30px_rgba(245,158,11,0.12)]">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Be Part of the Community
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Claim your free pass for the mega concert, connect with career mentors, or join an upcoming gathering.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_8px_25px_rgba(217,119,6,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-slate-950" />
                <span>Claim Concert Pass</span>
              </button>
              <button
                onClick={() => navigateTo('community')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-amber-400 cursor-pointer shadow-sm"
              >
                Join Community Registry
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
