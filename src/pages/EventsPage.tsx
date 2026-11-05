import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UPCOMING_EVENTS } from '../data/mockData';
import { EventItem } from '../types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Ticket, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { setRegisterModalOpen, navigateTo, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Gatherings' },
    { id: 'worship', label: 'Worship & Concerts' },
    { id: 'tech', label: 'Tech & Careers' },
    { id: 'business', label: 'Business & Startups' },
    { id: 'open-forum', label: 'Real Talk Circles' },
    { id: 'youth', label: 'Casual Hangouts' }
  ];

  const filteredEvents = UPCOMING_EVENTS.filter((evt) => {
    const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleRegisterEvent = (evt: EventItem) => {
    if (evt.id === 'evt-01') {
      setRegisterModalOpen(true);
      return;
    }

    if (registeredEvents.includes(evt.id)) {
      showToast('Already Registered', `You have already RSVP'd for ${evt.title}.`, 'info');
      return;
    }

    setRegisteredEvents((prev) => [...prev, evt.id]);
    showToast('RSVP Confirmed', `You are registered for ${evt.title}.`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 text-left">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          COMMUNITY CALENDAR
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Events & Gatherings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          From the 3,000-seat mega worship concert to tech mentorship and casual get-togethers.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, speaker, topic, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs sm:text-sm"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_6px_20px_rgba(217,119,6,0.3)]'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid (White, Gold, Slate Gray) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);
          const isMegaConcert = evt.id === 'evt-01';

          return (
            <div
              key={evt.id}
              className={`rounded-3xl bg-white border overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(217,119,6,0.08),0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_16px_45px_rgba(217,119,6,0.22)] ${
                isMegaConcert ? 'border-2 border-amber-400' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Event Image Banner */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Clean Date Badge */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {evt.date} • {evt.time}
                    </span>
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>

                  {/* Speakers preview */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="flex -space-x-2">
                      {evt.speakers.map((s, i) => (
                        <img
                          key={i}
                          src={s.avatar}
                          alt={s.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium truncate">
                      {evt.speakers.map((s) => s.name).join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Card */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    {evt.attendeesCount} / {evt.capacity} registered
                  </span>
                  <span className="text-amber-700 font-bold">Free Admission</span>
                </div>

                <button
                  onClick={() => handleRegisterEvent(evt)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isRegistered
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : isMegaConcert
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_8px_20px_rgba(217,119,6,0.3)] hover:from-amber-300 hover:to-amber-400'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : isMegaConcert ? (
                    <>
                      <Ticket className="w-4 h-4 text-slate-950" />
                      <span>Claim Concert Pass</span>
                    </>
                  ) : (
                    <>
                      <span>Reserve Free Spot</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Past Events Recap Archive */}
      <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            PAST HIGHLIGHTS
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Previous Encounters
          </h2>
          <p className="text-xs text-slate-500">
            Hundreds of youth who joined our previous gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.06)] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-700 block">
                Summer 2025 • 1,200 Attendees
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                "One Voice" Regional Worship Night
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Singers from 12 local churches gathered in the open-air park for 4 hours of prayer, spontaneous harmonies, and multi-denominational fellowship.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Recap Available</span>
              <button
                onClick={() => showToast('Playing Recap', 'Audio reel is ready.', 'info')}
                className="text-amber-700 font-bold hover:underline cursor-pointer"
              >
                Listen to Audio Reel →
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.06)] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-700 block">
                Spring 2025 • 180 Engineers
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                "Code & Kingdom" Tech Summit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Developers, designers, and students joined 8 senior engineering mentors for resume teardowns and salary negotiations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>28 Resumes Hired</span>
              <button
                onClick={() => navigateTo('initiatives')}
                className="text-amber-700 font-bold hover:underline cursor-pointer"
              >
                Submit Resume for Review →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
