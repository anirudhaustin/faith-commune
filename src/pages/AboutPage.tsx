import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MENTORS_LIST } from '../data/mockData';
import { 
  Heart, 
  Cross, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo, setRegisterModalOpen } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is Faith Commune a new church denomination or replacement for church?",
      a: "No. We are an inter-denominational youth movement and guild, not a rival Sunday church. We encourage you to stay rooted in your local fellowship or home church while joining the Commune for weekday tech talks, career mentoring, real-life discussion circles, and city-wide multi-church worship concerts."
    },
    {
      q: "Do I have to leave my home church or change my tradition to be a part of Faith Commune?",
      a: "Never. We have active members who are devout Catholics, Pentecostals, Baptists, Methodists, and seekers who haven't stepped into a church in years. What unites us is Jesus Christ and living out faith authentically."
    },
    {
      q: "Why do you emphasize Tech Talks and Job Securing?",
      a: "Because young people spend 40 to 60 hours a week at work! Faith shouldn't only exist within church walls on Sunday morning. By helping youth build stellar resumes, ace technical coding interviews, and navigate workplace environments with integrity, we empower youth to be light in the marketplace."
    },
    {
      q: "How is Faith Commune funded?",
      a: "All of our concerts and youth meetups are free of charge. We are supported by freewill contributions from young working professionals, tech mentors, and local church alliances who believe in empowering the next generation without financial barriers."
    },
    {
      q: "What if I'm struggling with doubt or mental health issues?",
      a: "You are welcomed here. You won't hear guilt-tripping cliches. We host Real Talk open circles with certified counselors where any question can be asked openly."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-20 text-left">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          OUR STORY & MANIFESTO
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          A Community Rooted in <span className="text-gradient-gold">Authentic Truth</span> and Fellowship.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Traditional structures often build walls between denominations and overlook everyday career struggles. Faith Commune was founded by youth to bridge those gaps.
        </p>
      </div>

      {/* The Story & Contrast Matrix (White, Gold, Slate Gray) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_10px_30px_rgba(217,119,6,0.06)] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg">
            ✕
          </div>
          <h3 className="text-xl font-bold text-slate-900">The Traditional Rut</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>Denominational segregation: churches refusing to fellowship or sing together.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>Silence on real problems: corporate exhaustion, mental health, and doubts dismissed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>Zero vocational training: leaving students unprepared for the competitive job market.</span>
            </li>
          </ul>
        </div>

        <div className="p-7 sm:p-8 rounded-3xl bg-amber-50/60 border-2 border-amber-300 shadow-[0_12px_35px_rgba(217,119,6,0.18)] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm">
            ✓
          </div>
          <h3 className="text-xl font-bold text-slate-900">The Faith Commune Way</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-700 mt-1 font-bold">•</span>
              <span><strong>Inter-Denominational Unity:</strong> 15+ church traditions worshiping together.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-700 mt-1 font-bold">•</span>
              <span><strong>Real Talk Circles:</strong> Clinical counselors + open questions with zero guilt or shame.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-700 mt-1 font-bold">•</span>
              <span><strong>Career & Tech Mentorship:</strong> Free resume teardowns, coding interview preps, and coaching.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* The 4 Core Convictions (White & Gold) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Our Core Convictions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            The foundation guiding every event, meetup, and mentorship track.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Unified in Christ",
              desc: "We focus on what unites us in Christ rather than arguing over secondary traditions.",
              icon: <Cross className="w-5 h-5 text-amber-700" />
            },
            {
              title: "Work as Worship",
              desc: "Writing code, designing systems, or closing deals is meaningful when done with excellence and integrity.",
              icon: <Award className="w-5 h-5 text-amber-700" />
            },
            {
              title: "Authentic Fellowship",
              desc: "Masks come off at the door. We share real challenges, mental health concerns, and life questions honestly.",
              icon: <Heart className="w-5 h-5 text-amber-700" />
            },
            {
              title: "Next Generation",
              desc: "Equipping young people to lead in their churches, workplaces, and communities today.",
              icon: <Flame className="w-5 h-5 text-amber-700" />
            }
          ].map((c, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.08)] hover:shadow-[0_14px_35px_rgba(217,119,6,0.18)] transition-all space-y-2"
            >
              <div className="p-2.5 rounded-xl bg-amber-50 w-fit border border-amber-200">
                {c.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{c.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mentors & Guild Leads */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              COMMUNITY LEADERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Mentors & Guild Leads
            </h2>
          </div>
          <button
            onClick={() => navigateTo('initiatives')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Book Mentorship Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MENTORS_LIST.map((m, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(217,119,6,0.08)] space-y-3">
              <img
                src={m.avatar}
                alt={m.name}
                className="w-full h-44 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{m.name}</h4>
                <p className="text-xs text-amber-700 font-semibold">{m.role}</p>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  {m.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (White & Gold Accordions) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Answers regarding our inter-denominational stance.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 shadow-[0_8px_20px_rgba(217,119,6,0.06)] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-slate-900 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-300 shadow-[0_15px_40px_rgba(217,119,6,0.18)] text-center space-y-4">
        <h3 className="text-2xl font-black text-slate-900">Experience it for yourself</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Join 3,000 youth at our upcoming worship concert, or attend our next gathering.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md cursor-pointer"
          >
            Claim Concert Pass
          </button>
          <button
            onClick={() => navigateTo('community')}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 cursor-pointer shadow-sm"
          >
            Join Commune Registry
          </button>
        </div>
      </div>
    </div>
  );
};
