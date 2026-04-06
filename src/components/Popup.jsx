import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X, Loader2 } from 'lucide-react';

// =========================================================
// 🎨 POPUP SYSTEM - Cegah Anemia Yuk!
// Mengganti alert() & confirm() bawaan browser dengan popup
// premium yang sesuai tema aplikasi.
// =========================================================

const PopupContext = createContext(null);

// Tipe popup: 'success', 'error', 'warning', 'info', 'confirm'
const POPUP_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    accentGradient: 'linear-gradient(135deg, #16a34a, #4ade80)',
  },
  error: {
    icon: XCircle,
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    accentGradient: 'linear-gradient(135deg, #dc2626, #f87171)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    accentGradient: 'linear-gradient(135deg, #d97706, #fbbf24)',
  },
  info: {
    icon: Info,
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    accentGradient: 'linear-gradient(135deg, #2563eb, #60a5fa)',
  },
  confirm: {
    icon: AlertTriangle,
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    accentGradient: 'linear-gradient(135deg, #dc2626, #f87171)',
  },
};

function PopupModal({ popup, onClose, onConfirm }) {
  const config = POPUP_CONFIG[popup.type] || POPUP_CONFIG.info;
  const IconComponent = config.icon;
  const isConfirm = popup.type === 'confirm';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ animation: 'popupFadeIn 0.2s ease-out' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'popupFadeIn 0.15s ease-out' }}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-[340px] bg-white rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden"
        style={{ animation: 'popupSlideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: config.accentGradient }} />

        {/* Close button */}
        {!isConfirm && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all active:scale-90 z-10"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        )}

        {/* Content */}
        <div className="px-7 pt-7 pb-6 text-center">
          {/* Icon */}
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: config.bgColor, border: `2px solid ${config.borderColor}` }}
          >
            <IconComponent 
              className="w-8 h-8"
              style={{ color: config.color }}
              strokeWidth={2.5}
            />
          </div>

          {/* Title */}
          {popup.title && (
            <h3 className="text-[17px] font-black text-gray-800 tracking-tight mb-2 leading-tight">
              {popup.title}
            </h3>
          )}

          {/* Message */}
          <p className="text-sm text-gray-500 font-medium leading-relaxed whitespace-pre-line">
            {popup.message}
          </p>
        </div>

        {/* Buttons */}
        <div className={`px-7 pb-7 ${isConfirm ? 'flex gap-3' : ''}`}>
          {isConfirm ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all active:scale-[0.97]"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.97]"
                style={{ background: config.accentGradient, boxShadow: `0 8px 20px ${config.color}30` }}
              >
                {popup.confirmText || 'Ya, Lanjutkan'}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.97]"
              style={{ background: config.accentGradient, boxShadow: `0 8px 20px ${config.color}30` }}
            >
              OK, Mengerti
            </button>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupSlideUp {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Provider component
export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);
  const [resolveRef, setResolveRef] = useState(null);

  const showPopup = useCallback(({ type = 'info', title, message, confirmText }) => {
    return new Promise((resolve) => {
      setResolveRef(() => resolve);
      setPopup({ type, title, message, confirmText });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (resolveRef) resolveRef(false);
    setPopup(null);
    setResolveRef(null);
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    if (resolveRef) resolveRef(true);
    setPopup(null);
    setResolveRef(null);
  }, [resolveRef]);

  return (
    <PopupContext.Provider value={showPopup}>
      {children}
      {popup && (
        <PopupModal 
          popup={popup} 
          onClose={handleClose} 
          onConfirm={handleConfirm} 
        />
      )}
    </PopupContext.Provider>
  );
}

// Hook untuk menggunakan popup dari komponen mana saja
export function usePopup() {
  const showPopup = useContext(PopupContext);
  if (!showPopup) {
    throw new Error('usePopup must be used within a PopupProvider');
  }

  return {
    // Alert-style popups (hanya tombol OK)
    success: (title, message) => showPopup({ type: 'success', title, message }),
    error: (title, message) => showPopup({ type: 'error', title, message }),
    warning: (title, message) => showPopup({ type: 'warning', title, message }),
    info: (title, message) => showPopup({ type: 'info', title, message }),

    // Confirm-style popup (tombol Batal + Konfirmasi)
    // Returns: Promise<boolean> → true jika user klik konfirmasi
    confirm: (title, message, confirmText) => showPopup({ type: 'confirm', title, message, confirmText }),
  };
}
