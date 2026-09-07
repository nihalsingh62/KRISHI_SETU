import React from "react";
import { useKisanSetu } from "../../context/KisanSetuContext";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useKisanSetu();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isError = t.type === "error";
        const isWarning = t.type === "warning";

        const borderColor = isSuccess
          ? "border-emerald-500"
          : isError
          ? "border-red-500"
          : isWarning
          ? "border-amber-500"
          : "border-blue-500";

        const iconBg = isSuccess
          ? "bg-emerald-100 text-emerald-700"
          : isError
          ? "bg-red-100 text-red-700"
          : isWarning
          ? "bg-amber-100 text-amber-700"
          : "bg-blue-100 text-blue-700";

        const Icon = isSuccess
          ? CheckCircle2
          : isError
          ? AlertCircle
          : isWarning
          ? AlertTriangle
          : Info;

        return (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto bg-white rounded-2xl p-4 shadow-xl border-2 ${borderColor} flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 transition-all`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 pt-0.5">
              {t.title && (
                <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
                  {t.title}
                </h5>
              )}
              {t.message && (
                <p className="text-[11px] font-medium text-slate-600 mt-0.5 leading-snug">
                  {t.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
