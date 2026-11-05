import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-2xl p-4 bg-white border-2 border-amber-300 shadow-[0_12px_35px_rgba(217,119,6,0.25),0_0_20px_rgba(245,158,11,0.15)] flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="mt-0.5 flex-shrink-0">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            ) : (
              <Info className="w-5 h-5 text-slate-600" />
            )}
          </div>

          <div className="flex-1 pr-2 text-left">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">{toast.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
