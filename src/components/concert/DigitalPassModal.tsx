import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CONCERT_DETAILS } from '../../data/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Download, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Printer 
} from 'lucide-react';
import { toPng } from 'html-to-image';

export const DigitalPassModal: React.FC = () => {
  const { isPassModalOpen, setPassModalOpen, recentTicket, showToast } = useApp();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isPassModalOpen || !recentTicket) return null;

  const handleDownloadImage = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = `Faith_Commune_Pass_${recentTicket.ticketId}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Pass Downloaded', 'Saved your digital pass image to your device.', 'success');
    } catch (err) {
      console.error('Failed to download pass', err);
      showToast('Download Failed', 'Could not generate ticket image. Try taking a screenshot.', 'warning');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadCalendar = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Faith Commune//Concert 2026//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Awaken the Dawn - Faith Commune Youth Worship Concert',
      'DESCRIPTION:Mega youth worship gathering bringing together youth and singers from across all churches. Ticket ID: ' + recentTicket.ticketId,
      'LOCATION:' + CONCERT_DETAILS.venue + ', ' + CONCERT_DETAILS.address,
      'DTSTART:20261127T123000Z',
      'DTEND:20261127T170000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Faith_Commune_Concert.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Calendar Saved', 'Added event to your calendar.', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'My Faith Commune Concert Pass',
          text: `I just registered for Awaken the Dawn Worship Gathering! Get your free pass too:`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Concert registration link copied to clipboard.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-8">
        {/* Close Button */}
        <button
          onClick={() => setPassModalOpen(false)}
          className="absolute -top-3 -right-3 z-20 p-2 rounded-full bg-white border border-slate-300 text-slate-500 hover:text-slate-900 transition-colors shadow-lg cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Digital Gold & White Pass */}
        <div
          ref={ticketRef}
          className="relative rounded-3xl p-1 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-[0_25px_60px_rgba(217,119,6,0.35),0_0_35px_rgba(245,158,11,0.2)] overflow-hidden"
        >
          <div className="relative rounded-[22px] bg-white p-6 sm:p-8 text-slate-900 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-sm">
                  FC
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-wide">FAITH COMMUNE</h3>
                  <p className="text-[10px] text-amber-700 font-bold uppercase">OFFICIAL CONCERT PASS 2026</p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>CONFIRMED</span>
              </div>
            </div>

            {/* Concert Title */}
            <div className="my-5 text-center">
              <span className="text-xs uppercase font-bold text-amber-700 block mb-1">
                Faith Commune x East Hyderabad Revival
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                ARISE 2026
              </h2>
              <p className="text-xs font-semibold text-amber-800 italic mt-0.5">
                "For your light has come, and the glory of the Lord rises upon you." — Isaiah 60:1
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Hyderabad • 28 November 2026
              </p>
            </div>

            {/* Passholder Details Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 text-left text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Pass Holder</span>
                <span className="text-slate-900 font-bold text-sm truncate block mt-0.5">
                  {recentTicket.name}
                </span>
                <span className="text-[11px] text-slate-600 truncate block">
                  {recentTicket.denomination}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Passes Reserved</span>
                <span className="text-amber-800 font-extrabold text-sm block mt-0.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  {recentTicket.passCount} {recentTicket.passCount > 1 ? 'Admissions' : 'Admission'}
                </span>
                <span className="text-[11px] text-slate-500">Age: {recentTicket.ageGroup}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Date & Time</span>
                <span className="text-slate-800 font-medium block mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  28 Nov 2026 • 6 PM
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Location</span>
                <span className="text-slate-800 font-medium block mt-0.5 truncate flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Hyderabad (HYD)
                </span>
              </div>
            </div>

            {/* Ticket Tear Cut Effect */}
            <div className="relative my-4 flex items-center justify-between">
              <div className="w-5 h-5 -ml-9 rounded-full bg-slate-100 border-r border-amber-300" />
              <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2" />
              <div className="w-5 h-5 -mr-9 rounded-full bg-slate-100 border-l border-amber-300" />
            </div>

            {/* QR Code and Validation Section */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="text-left flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Ticket Pass ID
                </span>
                <div className="text-lg font-mono font-black text-amber-700 tracking-wider">
                  {recentTicket.ticketId}
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Show this QR code at Gate Hall 4 for mobile check-in.
                </p>
                {recentTicket.isVolunteerOptIn && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                    Concert Volunteer Squad
                  </span>
                )}
              </div>

              {/* QR Code Canvas */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm flex-shrink-0">
                <QRCodeSVG
                  value={`FAITH-COMMUNE-PASS:${recentTicket.ticketId}:${recentTicket.name}:${recentTicket.passCount}`}
                  size={96}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Below Pass */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-[0_8px_20px_rgba(217,119,6,0.3)] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Saving...' : 'Save Image'}</span>
          </button>

          <button
            onClick={handleDownloadCalendar}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Calendar</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4 text-amber-600" />
            <span>Share</span>
          </button>

          <button
            onClick={() => window.print()}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-600" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
