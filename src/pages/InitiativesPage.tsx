import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MENTORS_LIST } from '../data/mockData';
import { QuestionTopic } from '../types';
import { 
  ThumbsUp, 
  Send, 
  Laptop, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const InitiativesPage: React.FC = () => {
  const { 
    questions, 
    submitQuestion, 
    upvoteQuestion, 
    submitMentorship 
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'tech' | 'realtalk'>('tech');

  // Real Talk Question Form State
  const [newQuestionText, setNewQuestionText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic>('career');
  const [questionFilter, setQuestionFilter] = useState<'all' | QuestionTopic>('all');

  // Mentorship Form State
  const [mName, setMName] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mTrack, setMTrack] = useState<'tech' | 'business' | 'creative' | 'career-switch'>('tech');
  const [mRole, setMRole] = useState('');
  const [mMessage, setMMessage] = useState('');

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    submitQuestion(newQuestionText.trim(), selectedTopic);
    setNewQuestionText('');
  };

  const handleMentorshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mEmail.trim()) return;
    submitMentorship({
      name: mName.trim(),
      email: mEmail.trim(),
      track: mTrack,
      targetRole: mRole || 'Software / Product Role',
      message: mMessage
    });
    setMName('');
    setMEmail('');
    setMRole('');
    setMMessage('');
  };

  const filteredQuestions = questions.filter(
    (q) => questionFilter === 'all' || q.topic === questionFilter
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 text-left">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          CAREER & REAL LIFE INITIATIVES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Tech, Careers & <span className="text-gradient-gold">Real Talk</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Tangible career guidance, free coding/resume mentorship, and safe-space answers to real-life dilemmas.
        </p>

        {/* Tab Switcher (White & Gold) */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tech'
                ? 'bg-amber-500 text-slate-950 shadow-[0_8px_25px_rgba(217,119,6,0.3)]'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Tech Talks & Mentorship</span>
          </button>

          <button
            onClick={() => setActiveTab('realtalk')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'realtalk'
                ? 'bg-amber-500 text-slate-950 shadow-[0_8px_25px_rgba(217,119,6,0.3)]'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Real Talk Anonymous Q&A</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TECH & CAREER MENTORSHIP */}
      {activeTab === 'tech' && (
        <div className="space-y-12 animate-in fade-in duration-200">
          {/* Booking Form & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                FAITH COMMUNE TECH GUILD
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Career Guidance with Senior Mentors
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Navigating job applications or feeling stuck in your career? Our Christian mentors in tech, finance, and product roles offer:
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Resume & GitHub Portfolio Teardown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Mock Technical & Behavioral Interviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Salary Negotiation & Sabbath Work-Life Balance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>100% Free Service to Youth in Community</span>
                </li>
              </ul>
            </div>

            {/* Request Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-[0_14px_40px_rgba(217,119,6,0.14)]">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Request Free Mentorship / Resume Review
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Fill in your details and a mentor will reach out within 48 hours.
                </p>

                <form onSubmit={handleMentorshipSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel David"
                        value={mName}
                        onChange={(e) => setMName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="samuel@gmail.com"
                        value={mEmail}
                        onChange={(e) => setMEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mentorship Track
                      </label>
                      <select
                        value={mTrack}
                        onChange={(e) => setMTrack(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-white border border-slate-300 text-slate-800"
                      >
                        <option value="tech">Software Engineering / Tech</option>
                        <option value="business">Business / Finance / Sales</option>
                        <option value="creative">UI/UX Design & Creative Arts</option>
                        <option value="career-switch">Career Pivot / College Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Target Role / Goal
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Junior Frontend Dev or Data Analyst"
                        value={mRole}
                        onChange={(e) => setMRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Link to Resume / Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Paste your LinkedIn, GitHub, Google Drive link, or write what you're working toward..."
                      value={mMessage}
                      onChange={(e) => setMMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_8px_25px_rgba(217,119,6,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Mentorship Request</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Active Mentors Grid */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-bold text-slate-900">Meet the Mentors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MENTORS_LIST.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_20px_rgba(217,119,6,0.06)] space-y-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-full h-36 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{m.name}</h4>
                    <p className="text-xs text-amber-700 font-semibold">{m.role}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {m.specialty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL TALK ANONYMOUS Q&A */}
      {activeTab === 'realtalk' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Ask Anonymously Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-300 shadow-[0_12px_35px_rgba(217,119,6,0.15)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Anonymous Real-Talk Drop Box
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ask your honest questions about workplace ethics, mental health, counseling, doubt, or relationships without fear of judgment.
            </p>

            <form onSubmit={handleQuestionSubmit} className="space-y-3 pt-2">
              <textarea
                required
                rows={3}
                placeholder="Ask your question anonymously here..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="w-full p-4 rounded-2xl glass-input text-xs sm:text-sm"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 font-semibold">Topic:</span>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value as QuestionTopic)}
                    className="px-3 py-1.5 rounded-xl glass-input text-xs bg-white border border-slate-300 text-slate-800"
                  >
                    <option value="career">Career & Corporate Life</option>
                    <option value="mental-health">Mental Health & Therapy</option>
                    <option value="relationships">Dating & Relationships</option>
                    <option value="doubt-faith">Doubt & Faith</option>
                    <option value="lifestyle">Modern Lifestyle</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_8px_20px_rgba(217,119,6,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Anonymously</span>
                </button>
              </div>
            </form>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-semibold">Filter:</span>
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'career', label: 'Career' },
              { id: 'mental-health', label: 'Mental Health' },
              { id: 'relationships', label: 'Relationships' },
              { id: 'doubt-faith', label: 'Doubt & Faith' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setQuestionFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-colors cursor-pointer ${
                  questionFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Questions Feed */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-[0_8px_25px_rgba(217,119,6,0.08)] space-y-4 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs text-slate-500 block">
                      {q.timestamp} • {q.topic}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      "{q.question}"
                    </h3>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => upvoteQuestion(q.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      q.userUpvoted
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{q.upvotes}</span>
                  </button>
                </div>

                {/* Answer Excerpt */}
                {q.answered && q.answerExcerpt && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Answered by {q.answeredBy}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{q.answerExcerpt}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
