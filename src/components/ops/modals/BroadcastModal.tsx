import React, { useState } from 'react';
import { opsDb } from '../../../services/db';
import { sounds } from '../../../services/soundEffects';
import { Radio, X, Send } from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSent: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose, onBroadcastSent }) => {
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'all' | 'gate' | 'ushers' | 'parking' | 'security' | 'medical'>('all');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await opsDb.createBroadcast({
      message: message.trim(),
      targetAudience: audience,
      urgency,
      sentBy: 'Operations Command'
    });

    if (urgency === 'emergency') {
      sounds.playEmergencySiren();
    }

    setIsSubmitting(false);
    setMessage('');
    onBroadcastSent();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-6 bg-white border border-amber-300 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Command Radio Broadcast
            </h2>
            <p className="text-xs text-slate-500">
              Push real-time alert notifications to volunteer and coordinator devices.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Target Operational Team
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 text-sm text-slate-900"
            >
              <option value="all">📢 All Departments (150-200 Staff)</option>
              <option value="gate">🎟️ Gate Check-in & Scanner Teams</option>
              <option value="ushers">👥 Ushers & Crowd Flow Leads</option>
              <option value="parking">🚗 Parking & Traffic Marshals</option>
              <option value="security">🛡️ Security & Perimeter</option>
              <option value="medical">🩺 Emergency Medical Responders</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('normal')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  urgency === 'normal'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  urgency === 'urgent'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Urgent Notice
              </button>
              <button
                type="button"
                onClick={() => setUrgency('emergency')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  urgency === 'emergency'
                    ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                SOS Emergency
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Broadcast Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Gate 1 experiencing rush of 50 youth. Ushers Team B please send 3 volunteers to assist..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white text-sm text-slate-900 placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Transmit Radio Broadcast</span>
          </button>
        </form>
      </div>
    </div>
  );
};
