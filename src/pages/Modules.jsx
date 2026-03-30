import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const modulesData = [
  { id: 1, emoji: '🩺', title: 'Apa Itu Anemia?', subtitle: 'Definisi, nilai Hb normal, dan prevalensi', duration: '3 menit', color: '#16a34a', colorLight: '#f0fdf4', colorBorder: '#bbf7d0' },
  { id: 2, emoji: '🩸', title: 'Kenapa Kamu Rentan?', subtitle: 'Pertumbuhan, menstruasi, dan pola makan', duration: '4 menit', color: '#ea580c', colorLight: '#fff7ed', colorBorder: '#fed7aa' },
  { id: 3, emoji: '👀', title: 'Kenali Tanda & Gejalanya', subtitle: 'Gejala 5L, konjungtiva pucat, dan lainnya', duration: '3 menit', color: '#dc2626', colorLight: '#fef2f2', colorBorder: '#fecaca' },
  { id: 4, emoji: '⚡', title: 'Dampak Anemia', subtitle: 'Pengaruh jangka pendek dan masa depan', duration: '4 menit', color: '#d97706', colorLight: '#fffbeb', colorBorder: '#fde68a' },
  { id: 5, emoji: '🥗', title: 'Pencegahan: TTD & Makanan', subtitle: 'Cara minum TTD, sumber zat besi, pantangan', duration: '5 menit', color: '#16a34a', colorLight: '#f0fdf4', colorBorder: '#bbf7d0' },
  { id: 6, emoji: '🏆', title: 'Aksi Nyata Agen Perubahan', subtitle: 'Komitmen, edukasi teman sebaya, dan aksi', duration: '3 menit', color: '#9333ea', colorLight: '#faf5ff', colorBorder: '#e9d5ff' },
];

export default function Modules() {
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('completedModules') || '[]');
    setCompletedModules(saved);
  }, []);

  const completedCount = completedModules.length;
  const totalModules = modulesData.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="min-h-screen pb-32" style={{ background: '#f5f5f5' }}>
      
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6 border-b border-gray-100">
        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">📚 Ruang Belajar</p>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-4">Semua Modul</h1>
        
        {/* Overall Progress */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600">{completedCount} dari {totalModules} modul selesai</span>
            <span className="text-sm font-black" style={{ color: progressPercent === 100 ? '#16a34a' : '#6b7280' }}>{progressPercent}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #16a34a, #4ade80)' }}
            ></div>
          </div>
          {completedCount === totalModules && (
            <p className="text-xs text-green-600 font-bold mt-2 text-center">🎉 Semua modul selesai! Kamu luar biasa!</p>
          )}
        </div>
      </div>

      {/* Module List */}
      <div className="p-5 space-y-4">
        {modulesData.map((m, idx) => {
          const isCompleted = completedModules.includes(m.id);
          const isLocked = idx > 0 && !completedModules.includes(modulesData[idx - 1].id);

          return (
            <button
              key={m.id}
              onClick={() => !isLocked && navigate('/module/' + m.id)}
              disabled={isLocked}
              className="w-full text-left transition-all duration-300 active:scale-[0.97]"
            >
              <div className={`rounded-3xl overflow-hidden border-2 ${isLocked ? 'opacity-50' : 'hover:shadow-lg'} transition-all duration-300`} style={{ borderColor: isCompleted ? m.color + '40' : isLocked ? '#e5e7eb' : '#f3f4f6', background: isCompleted ? m.colorLight : '#fff', boxShadow: isCompleted ? `0 4px 15px ${m.color}15` : '0 2px 10px rgba(0,0,0,0.04)' }}>
                
                {/* Top strip jika completed */}
                {isCompleted && (
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}88)` }}></div>
                )}
                
                <div className="p-4 flex items-center gap-4">
                  {/* Emoji Circle */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner"
                    style={{ background: m.colorLight, border: `2px solid ${m.colorBorder}` }}
                  >
                    {isLocked ? '🔒' : m.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: isLocked ? '#9ca3af' : m.color }}>Modul {m.id}</p>
                      <span className="text-[9px] text-gray-400 font-semibold">• {m.duration}</span>
                    </div>
                    <h3 className="text-[15px] font-extrabold text-gray-800 leading-snug mb-1">{m.title}</h3>
                    <p className="text-xs text-gray-400 font-medium leading-snug line-clamp-2">{m.subtitle}</p>
                  </div>

                  {/* Status Icon */}
                  <div className="shrink-0 ml-1">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: m.color, boxShadow: `0 4px 10px ${m.color}40` }}>
                        <span className="text-white text-sm font-black">✓</span>
                      </div>
                    ) : isLocked ? (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-300 text-sm">›</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-gray-300 text-sm font-bold">›</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Locked message */}
                {isLocked && (
                  <div className="px-4 pb-3">
                    <p className="text-[11px] text-gray-400 font-semibold">🔒 Selesaikan modul sebelumnya untuk membuka ini</p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
