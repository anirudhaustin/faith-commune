import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CONCERT_DETAILS, DENOMINATIONS_LIST } from '../../data/mockData';
import { 
  X, 
  Ticket, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  HeartHandshake 
} from 'lucide-react';

export const ConcertRegisterModal: React.FC = () => {
  const { isRegisterModalOpen, setRegisterModalOpen, registerConcert, claimedSpots, totalSpots } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ageGroup, setAgeGroup] = useState('21-25');
  const [denomination, setDenomination] = useState('Non-Denominational / Independent');
  const [customDenomination, setCustomDenomination] = useState('');
  const [passCount, setPassCount] = useState(1);
  const [isVolunteerOptIn, setIsVolunteerOptIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isRegisterModalOpen) return null;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please fill in all personal details.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDenom = denomination === 'Other' && customDenomination.trim() ? customDenomination : denomination;
    registerConcert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ageGroup,
      denomination: finalDenom,
      passCount,
      isVolunteerOptIn
    });
    // Reset form
    setStep(1);
    setName('');
    setEmail('');
    setPhone('');
    setPassCount(1);
  };

  const remainingSpots = totalSpots - claimedSpots;
  const percentage = Math.round((claimedSpots / totalSpots) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-6">
        {/* Modal Container: White, Gold, Gray with Glowing Gold Shadow */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-white border-2 border-amber-300 shadow-[0_25px_60px_rgba(217,119,6,0.3),0_0_35px_rgba(245,158,11,0.2)] text-slate-800 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setRegisterModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Info */}
          <div className="pr-8 mb-5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Claim Concert Pass
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {CONCERT_DETAILS.date} • {CONCERT_DETAILS.venue}
            </p>
          </div>

          {/* Capacity Progress Bar */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 mb-6">
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <span className="text-amber-800 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5" />
                {claimedSpots.toLocaleString()} of {totalSpots.toLocaleString()} passes claimed
              </span>
              <span className="text-amber-800 font-bold">
                {remainingSpots} remaining
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Stepper Dots (Clean, No Chips) */}
          <div className="flex items-center justify-between max-w-xs mx-auto mb-6 text-xs">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200'}`}>
                1
              </span>
              <span>Details</span>
            </div>
            <div className="w-8 h-[1px] bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200'}`}>
                2
              </span>
              <span>Background</span>
            </div>
            <div className="w-8 h-[1px] bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200'}`}>
                3
              </span>
              <span>Passes</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Timothy Mathew"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="timothy@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Age Bracket
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Under 18', '18–22', '23–29', '30+'].map((age) => (
                    <button
                      type="button"
                      key={age}
                      onClick={() => setAgeGroup(age)}
                      className={`py-2 px-1 text-xs rounded-xl font-medium border transition-all text-center cursor-pointer ${
                        ageGroup === age
                          ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(217,119,6,0.3)] transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Denomination Connection */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Which church or denomination do you identify with?
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Faith Commune is 100% inter-denominational. We track this to celebrate unity across churches.
                </p>
                <select
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-white border border-slate-300 text-slate-800"
                >
                  {DENOMINATIONS_LIST.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="Other">
                    Other / Custom
                  </option>
                </select>
              </div>

              {denomination === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Please specify:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lutheran / Evangelical / Local House Church"
                    value={customDenomination}
                    onChange={(e) => setCustomDenomination(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 flex items-start gap-2.5">
                <HeartHandshake className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  Youth from all churches and backgrounds are warmly welcomed.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(217,119,6,0.3)] transition-all cursor-pointer"
                >
                  <span>Select Passes</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Passes Count & Confirmation */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  How many passes do you need? (For you and friends/family)
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setPassCount(num)}
                      className={`py-3 px-2 rounded-xl text-center font-bold text-sm border transition-all cursor-pointer ${
                        passCount === num
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/25 scale-105'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-base">{num}</div>
                      <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                        {num === 1 ? 'Pass' : 'Passes'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volunteer check */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVolunteerOptIn}
                    onChange={(e) => setIsVolunteerOptIn(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 bg-white border-slate-300 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Volunteer at the concert
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 leading-relaxed">
                      Help with gate welcoming, ushering attendees, stage assistance, or sound setup.
                    </span>
                  </div>
                </label>
              </div>

              {/* Summary Card */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Passholder:</span>
                  <span className="text-slate-900 font-semibold">{name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tradition:</span>
                  <span className="text-slate-900 font-semibold">{denomination}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Free Passes:</span>
                  <span className="text-amber-800 font-bold">{passCount} Admission{passCount > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(217,119,6,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Generate Digital Pass</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
