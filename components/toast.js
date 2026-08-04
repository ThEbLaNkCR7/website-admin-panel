import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      role="status"
      className={`animate-toast-in fixed top-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-lg ${
        isSuccess ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
      )}
      <p className="flex-1 leading-snug">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-0.5 opacity-80 hover:bg-white/15 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
