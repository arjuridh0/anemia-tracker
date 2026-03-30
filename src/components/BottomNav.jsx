import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
  { id: 'dashboard', path: '/dashboard', emoji: '🏠', label: 'Beranda' },
  { id: 'modules', path: '/modules', emoji: '📚', label: 'Modul' },
  { id: 'quiz', path: '/quiz', emoji: '📝', label: 'Kuis' },
  { id: 'profile', path: '/profile', emoji: '👤', label: 'Profil' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const path = window.location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-[430px] mx-auto px-4 pb-3 pt-1">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex justify-around items-center px-1 py-2">
          {navItems.map((item) => {
            const isActive = path.startsWith(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={clsx(
                  "flex flex-col items-center justify-center gap-0.5 transition-all duration-300 rounded-2xl px-4 py-2.5 flex-1 active:scale-95",
                  isActive ? "bg-green-600 shadow-[0_4px_12px_rgba(22,163,74,0.4)]" : "hover:bg-gray-50"
                )}
              >
                <span className={clsx("text-xl transition-all duration-300", isActive ? "scale-110" : "")}>{item.emoji}</span>
                <span className={clsx("text-[9px] font-black transition-all", isActive ? "text-white" : "text-gray-400")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
