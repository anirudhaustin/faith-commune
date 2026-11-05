import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DENOMINATIONS_LIST, DENOMINATION_STATS } from '../data/mockData';
import { 
  Send, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { joinCommunity, setRegisterModalOpen } = useApp();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [denomination, setDenomination] = useState('Non-Denominational / Independent');
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState<string[]>(['Tech Mentorship', 'Concerts']);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const interestOptions = [
    'Tech & Career Mentorship',
    'Concerts & Worship Music',
    'Real Talk Open Circles',
    'Coffee & Rooftop Fellowship',
    'Volunteer & Gate Operations'
  ];

  const handleToggleInterest = (opt: string) => {
    setInterests((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    joinCommunity({
      fullName: name.trim(),
      email: email.trim(),
      denomination,
      city: city.trim() || 'Metro Area',
      interests
    });
    setHasSubmitted(true);
  };

  const totalRegisteredCommune = DENOMINATION_STATS.reduce((a, b) => a + b.count, 0) + (hasSubmitted ? 1 : 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-16 text-left">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          INTER-DENOMINATIONAL REGISTRY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Join the <span className="text-gradient-gold">Faith Commune</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Be part of a registry of over 3,000 youth from Baptist, Catholic, Pentecostal, Methodist, CSI, and seeking backgrounds growing together.
        </p>
      </div>

      {/* Main Grid: Form + Denomination Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-[0_14px_40px_rgba(217,119,6,0.12)] space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Add Your Name to the Registry
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                You'll receive invitations to community gatherings, tech talks, and worship events.
              </p>
            </div>

            {hasSubmitted ? (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-amber-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Welcome to Faith Commune, {name}!</h3>
                <p className="text-xs text-slate-600">
                  Your record has been logged in the inter-denominational registry. Check your email for upcoming meetup details.
                </p>
                <button
                  onClick={() => setHasSubmitted(false)}
                  className="text-xs text-amber-700 underline font-semibold cursor-pointer"
                >
                  Register another person
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christine Paul"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="christine@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Downtown Metro"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Church / Denominational Background
                  </label>
                  <select
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-white border border-slate-300 text-slate-800"
                  >
                    {DENOMINATIONS_LIST.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    What are you most excited for in Faith Commune?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => {
                      const isSelected = interests.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleToggleInterest(opt)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_8px_25px_rgba(217,119,6,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Join Registry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Denominational Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.08)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                REGISTRY COMPOSITION
              </span>
              <span className="font-mono text-xs font-bold text-slate-900">
                {totalRegisteredCommune.toLocaleString()} Members
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Denominational Unity
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every denomination brings a unique gift: liturgical heritage, charismatic passion, theological depth, and seeker curiosity.
            </p>

            {/* Diversity Bars in Gold & Slate */}
            <div className="space-y-3 pt-2">
              {DENOMINATION_STATS.map((d, i) => {
                const percent = Math.round((d.count / totalRegisteredCommune) * 100);
                return (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700">
                        {d.name}
                      </span>
                      <span className="font-mono text-slate-500">{d.count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                        style={{ width: `${percent * 3}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Volunteer Squad */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-300 shadow-[0_10px_25px_rgba(217,119,6,0.12)] space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Concert Volunteer Squad</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Help us host 3,000 youth on Nov 27
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We need volunteers for ushering, gate scanner operations, hospitality, sound engineering, and choir support.
            </p>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm cursor-pointer"
            >
              Sign Up as Concert Volunteer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
