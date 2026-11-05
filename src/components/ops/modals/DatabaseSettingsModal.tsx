import React, { useState } from 'react';
import { opsDb } from '../../../services/db';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  Server, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshStats: () => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshStats
}) => {
  const [dbUrl, setDbUrl] = useState(opsDb.getConnectionString());
  const [isInitializing, setIsInitializing] = useState(false);
  const [initResult, setInitResult] = useState<{ success: boolean; message: string; tablesCreated?: string[] } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const config = opsDb.getConfig();

  const handleSaveAndTest = async () => {
    if (!dbUrl.trim()) return;
    setIsInitializing(true);
    setInitResult(null);

    const result = await opsDb.initDatabaseSchema(dbUrl.trim());
    setInitResult(result);
    setIsInitializing(false);
    if (result.success) {
      onRefreshStats();
    }
  };

  const handleCopySampleUri = () => {
    navigator.clipboard.writeText('postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require');
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl my-6 bg-white border border-amber-300 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              Neon PostgreSQL Connection
              {config.isCloudMode ? (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase tracking-wider">
                  Live Cloud
                </span>
              ) : (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-bold uppercase tracking-wider">
                  Local Persistent Cache
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              Manage your Neon Serverless Database connection, run schema migrations, and sync state.
            </p>
          </div>
        </div>

        {/* Neon Setup Guidance Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 mb-6 text-xs text-slate-700 space-y-2">
          <div className="flex items-center justify-between font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-amber-700" /> Neon Connection Guide
            </span>
            <a
              href="https://console.neon.tech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 underline font-semibold"
            >
              Open Neon Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
            <li>Open your <strong>Faith Commune Ops</strong> project on Neon.</li>
            <li>Copy the <strong>Connection String</strong> from the Neon dashboard.</li>
            <li>Paste it below and click <strong>"Initialize & Connect Neon"</strong>.</li>
          </ol>
        </div>

        {/* Connection String Input */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Neon PostgreSQL Connection String</span>
              <button
                type="button"
                onClick={handleCopySampleUri}
                className="text-[10px] text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold"
              >
                {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Sample Format
              </button>
            </label>
            <div className="relative">
              <input
                type="password"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                placeholder="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white text-sm text-slate-900 placeholder-slate-400 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports serverless connection pooling via <code className="text-amber-800 font-bold">@neondatabase/serverless</code>. Zero connection limits.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSaveAndTest}
            disabled={isInitializing || !dbUrl.trim()}
            className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running PostgreSQL Migrations...</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>Initialize & Connect Neon Database</span>
              </>
            )}
          </button>
        </div>

        {/* Initialization Result Banner */}
        {initResult && (
          <div
            className={`p-4 rounded-2xl mb-6 border text-xs ${
              initResult.success
                ? 'bg-amber-50 border-amber-400 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {initResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{initResult.message}</p>
                {initResult.tablesCreated && (
                  <p className="mt-1 text-[11px] text-amber-800">
                    Tables created: {initResult.tablesCreated.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Offline Fallback Assurance */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${config.isCloudMode ? 'bg-amber-600' : 'bg-slate-400'}`} />
            <span>
              {config.isCloudMode
                ? 'Connected directly to Neon Serverless Cloud'
                : 'Running in Local Resilient Mode with Instant Persistence'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
