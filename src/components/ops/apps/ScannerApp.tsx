import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useOpsAuth } from '../../../context/OpsAuthContext';
import { opsDb } from '../../../services/db';
import { sounds } from '../../../services/soundEffects';
import { AttendeeRecord, EVENT_GATES, GateId } from '../../../types/ops';
import { 
  ScanLine, 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search, 
  Clock, 
  RefreshCw,
  Zap,
  Volume2
} from 'lucide-react';

interface ScanHistoryItem {
  id: string;
  ticketId: string;
  name: string;
  passCount: number;
  time: string;
  status: 'valid' | 'duplicate' | 'invalid';
  gate: GateId;
}

export const ScannerApp: React.FC = () => {
  const { assignedGate, setAssignedGate, session } = useOpsAuth();
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Manual / Laser Gun Input
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Verification Result Feedback
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'valid' | 'duplicate' | 'invalid';
    attendee?: AttendeeRecord;
    message: string;
    timestamp: string;
  }>({
    status: 'idle',
    message: '',
    timestamp: ''
  });

  // Recent Scans Log
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [gateStats, setGateStats] = useState({ totalCheckedIn: 0, totalRegistered: 0 });

  const loadStats = useCallback(async () => {
    const attendees = await opsDb.getAttendees();
    const checked = attendees.filter((a) => a.checkedIn).length;
    setGateStats({ totalCheckedIn: checked, totalRegistered: attendees.length });
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Core Verification Engine
  const handleVerifyPass = useCallback(async (rawCode: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const operatorName = session?.displayName || 'Gate Volunteer';
    const result = await opsDb.checkInAttendee(rawCode, assignedGate, operatorName);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (result.status === 'success') {
      sounds.playSuccessChime();
      setScanResult({
        status: 'valid',
        attendee: result.attendee,
        message: result.message,
        timestamp: now
      });
      if (result.attendee) {
        setRecentScans((prev) => [
          {
            id: Math.random().toString(),
            ticketId: result.attendee!.ticketId,
            name: result.attendee!.name,
            passCount: result.attendee!.passCount,
            time: now,
            status: 'valid',
            gate: assignedGate
          },
          ...prev.slice(0, 19)
        ]);
      }
    } else if (result.status === 'already-checked-in') {
      sounds.playDuplicateAlarm();
      setScanResult({
        status: 'duplicate',
        attendee: result.attendee,
        message: result.message,
        timestamp: now
      });
      if (result.attendee) {
        setRecentScans((prev) => [
          {
            id: Math.random().toString(),
            ticketId: result.attendee!.ticketId,
            name: result.attendee!.name,
            passCount: result.attendee!.passCount,
            time: now,
            status: 'duplicate',
            gate: assignedGate
          },
          ...prev.slice(0, 19)
        ]);
      }
    } else {
      sounds.playInvalidAlarm();
      setScanResult({
        status: 'invalid',
        message: result.message,
        timestamp: now
      });
      setRecentScans((prev) => [
        {
          id: Math.random().toString(),
          ticketId: rawCode,
          name: 'Unknown Pass Code',
          passCount: 0,
          time: now,
          status: 'invalid',
          gate: assignedGate
        },
        ...prev.slice(0, 19)
      ]);
    }

    await loadStats();
    setIsProcessing(false);
  }, [assignedGate, isProcessing, loadStats, session]);

  // Hardware Barcode Scanner / Keyboard Wedge Listener
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 150) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length >= 4) {
          handleVerifyPass(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleVerifyPass]);

  // Start / Stop Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-container');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          qrbox: { width: 260, height: 260 }
        },
        (decodedText) => {
          handleVerifyPass(decodedText);
        },
        () => {}
      );
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera init error', err);
      const msg = err instanceof Error ? err.message : 'Camera permission denied or camera not found.';
      setCameraError(msg);
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isCameraActive) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {
        console.warn('Camera stop error', e);
      }
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current = null;
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleVerifyPass(manualInput.trim());
    setManualInput('');
  };

  const currentGateMeta = EVENT_GATES.find((g) => g.id === assignedGate) || EVENT_GATES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Gate & Counters (White & Gold Theme) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-amber-600" /> High-Speed Gate Kiosk
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              Audio Chimes Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            {currentGateMeta.name}
          </h1>
          <p className="text-xs text-slate-500">
            {currentGateMeta.description} • Target: <span className="text-slate-800 font-bold">{currentGateMeta.targetAudience}</span>
          </p>
        </div>

        {/* Quick Gate Switcher & Live Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Admitted
            </div>
            <div className="text-lg font-black text-amber-800">
              {gateStats.totalCheckedIn} / {gateStats.totalRegistered || '2,000'}
            </div>
          </div>

          <select
            value={assignedGate}
            onChange={(e) => setAssignedGate(e.target.value as GateId)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-amber-300 text-xs font-bold text-slate-900 focus:border-amber-500 shadow-sm cursor-pointer"
          >
            {EVENT_GATES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewfinder & Manual Input (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Camera Viewfinder Box */}
          <div className="relative rounded-3xl bg-white border-2 border-amber-200/80 p-5 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col items-center">
            {/* Viewfinder Element */}
            <div
              id="qr-reader-container"
              className="w-full max-w-sm rounded-2xl overflow-hidden aspect-square bg-slate-50 border border-slate-200 flex items-center justify-center relative shadow-inner"
            >
              {!isCameraActive && (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Camera Viewfinder Offline</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Click below to activate your phone or laptop camera for high-speed scanning.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-xs text-rose-600 font-semibold mt-2 text-center">{cameraError}</p>
            )}

            {/* Camera Controls */}
            <div className="mt-4 flex items-center gap-3 w-full max-w-sm">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Activate Camera Viewfinder</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Stop Camera</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => sounds.playSuccessChime()}
                title="Test Audio Chime"
                className="p-3 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-800 cursor-pointer shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Hardware Scanner Hint */}
            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Hardware Laser Barcode Guns supported: aim at attendee badge and pull trigger.
              </span>
            </div>
          </div>

          {/* Manual Input Search Fallback */}
          <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Manual Pass Look-up / Phone Search
            </div>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter Ticket ID (e.g. FC-W26-1043) or 10-digit Phone"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white text-sm text-slate-900 placeholder-slate-400 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !manualInput.trim()}
                className="py-3 px-5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                Verify Pass
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Instant Visual Feedback & Recent Scans (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Scan Status Card */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all ${
              scanResult.status === 'valid'
                ? 'bg-amber-50/80 border-amber-400 shadow-[0_8px_30px_rgba(217,119,6,0.15)]'
                : scanResult.status === 'duplicate'
                ? 'bg-amber-100/70 border-amber-500 shadow-[0_8px_30px_rgba(217,119,6,0.15)]'
                : scanResult.status === 'invalid'
                ? 'bg-rose-50 border-rose-400 shadow-[0_8px_30px_rgba(244,63,94,0.1)]'
                : 'bg-white border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)]'
            }`}
          >
            {scanResult.status === 'idle' ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <ScanLine className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Scanner Ready</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Aim camera at attendee's digital QR pass or search by phone number.
                </p>
              </div>
            ) : scanResult.status === 'valid' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-800">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                      Access Granted • Verified
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      {scanResult.attendee?.name}
                    </h2>
                  </div>
                </div>

                {/* Attendee Details Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-amber-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Ticket ID
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {scanResult.attendee?.ticketId}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-amber-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Pass Count
                    </span>
                    <span className="font-bold text-amber-800 text-sm">
                      {scanResult.attendee?.passCount} Admitted
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-amber-200 col-span-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Church / Denomination
                    </span>
                    <span className="font-semibold text-slate-800">
                      {scanResult.attendee?.denomination || 'Inter-Denominational'} {scanResult.attendee?.homeChurch ? `• ${scanResult.attendee.homeChurch}` : ''}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Verified at: {scanResult.timestamp}</span>
                </div>
              </div>
            ) : scanResult.status === 'duplicate' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 border border-amber-400 flex items-center justify-center text-amber-900">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900">
                      Duplicate Pass Alert
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Already Checked In
                    </h2>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-amber-300 text-xs text-amber-900 space-y-1">
                  <p className="font-bold">{scanResult.message}</p>
                  <p className="text-[11px] text-slate-600">
                    Attendee: <strong>{scanResult.attendee?.name}</strong> ({scanResult.attendee?.ticketId})
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700">
                      Invalid Code
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Pass Not Recognized
                    </h2>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-rose-300 text-xs text-rose-800">
                  <p className="font-bold">{scanResult.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Scans Feed */}
          <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Gate Entry Log ({recentScans.length})
              </span>
              <button
                onClick={loadStats}
                className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {recentScans.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No scans logged at this gate yet.
                </p>
              ) : (
                recentScans.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === 'valid'
                            ? 'bg-amber-600'
                            : item.status === 'duplicate'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.ticketId} • {item.passCount} pass{item.passCount > 1 ? 'es' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {item.time}
                      </span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-white border border-amber-200 text-amber-800">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
