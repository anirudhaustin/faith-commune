import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import { 
  Menu, 
  X, 
  Ticket, 
  ScanLine, 
  Calendar, 
  Users, 
  Compass, 
  Briefcase,
  Shield
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activePage, navigateTo, setRegisterModalOpen, setGateModalOpen } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Users className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'concert', label: 'Concert 2026', icon: <Ticket className="w-4 h-4" /> },
    { id: 'initiatives', label: 'Tech & Mentorship', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> }
  ];

  const handleNavClick = (id: PageId) => {
    navigateTo(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all">
      <nav className="glass-panel-elevated rounded-2xl px-5 py-3.5 flex items-center justify-between border border-amber-200/60 shadow-[0_10px_35px_-5px_rgba(217,119,6,0.15),0_0_20px_rgba(245,158,11,0.1)] backdrop-blur-2xl bg-white/95">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1.5px] shadow-[0_4px_16px_rgba(217,119,6,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black text-amber-600 tracking-tighter">FC</span>
            </div>
          </div>

          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              Faith Commune
            </span>
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
              Inter-Denominational
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 focus:outline-none ${
                  isActive
                    ? 'text-amber-700 bg-amber-50/90 font-bold border border-amber-300/50 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Ops Command Center Button */}
          <button
            onClick={() => handleNavClick('ops')}
            title="Event IT & Operations Command Center (War Room)"
            className="px-3 py-2 rounded-xl text-slate-800 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/80 transition-colors border border-amber-300 flex items-center gap-1.5 text-xs font-bold focus:outline-none shadow-sm cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Ops Command</span>
          </button>

          {/* Gate Scanner Quick Tool */}
          <button
            onClick={() => setGateModalOpen(true)}
            title="Gate Volunteer Check-In & Scanner Portal"
            className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-semibold focus:outline-none"
          >
            <ScanLine className="w-4 h-4 text-amber-600" />
            <span>Gate Portal</span>
          </button>

          {/* Primary Concert Pass Button (White, Gold, Charcoal with glowing gold shadow, no chips) */}
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="gold-sweep-btn px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-[0_8px_25px_rgba(217,119,6,0.35),0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_12px_30px_rgba(217,119,6,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-slate-950" />
            <span>Get Concert Pass</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 shadow-md"
          >
            Passes
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Glass Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 glass-panel-elevated rounded-2xl p-4 border border-amber-200 shadow-2xl backdrop-blur-2xl bg-white animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 border border-amber-300 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-amber-600">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleNavClick('ops');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 flex items-center justify-center gap-2 shadow-sm"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Enter IT & Operations Command Center</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setGateModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 flex items-center justify-center gap-2"
            >
              <ScanLine className="w-4 h-4 text-amber-600" />
              <span>Organizer Gate & Ticket Check-In</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setRegisterModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(217,119,6,0.3)]"
            >
              <Ticket className="w-4 h-4 text-slate-950" />
              <span>Claim Free Concert Pass</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
