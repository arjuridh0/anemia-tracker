import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pretestQuestions } from '../data/pretestQuestions';
import { supabase } from '../lib/supabase';

const optionLabels = ['A', 'B', 'C', 'D'];
const optionColors = [
  { base: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', active: '#3b82f6' },
  { base: '#f0fdf4', border: '#bbf7d0', text: '#166534', active: '#22c55e' },
  { base: '#fff7ed', border: '#fed7aa', text: '#c2410c', active: '#f97316' },
  { base: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce', active: '#a855f7' },
];

export default function Pretest() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [currentIdx]);

  // Intro Screen
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 30%, #fff7ed 70%, #fef3c7 100%)' }}>
        
        {/* Floating decorations */}
        <div className="absolute top-10 left-6 text-5xl opacity-30 animate-bounce" style={{ animationDelay: '0s' }}>🩺</div>
        <div className="absolute top-20 right-8 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>💊</div>
        <div className="absolute bottom-32 left-10 text-4xl opacity-25 animate-bounce" style={{ animationDelay: '1s' }}>🥗</div>
        <div className="absolute bottom-20 right-12 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '0.3s' }}>🩸</div>

        <div className="relative z-10">
          <div className="text-7xl mb-6">🎯</div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight mb-3">
            Yuk Test Pemahaman<br />Awalmu Dulu!
          </h1>
          <p className="text-gray-500 font-medium text-sm leading-relaxed mb-2 max-w-75 mx-auto">
            Sebelum mulai belajar, kita cek dulu seberapa banyak yang kamu tau soal anemia. 
          </p>
          <p className="text-gray-400 font-medium text-xs mb-8 max-w-70 mx-auto">
            Tenang aja, ini bukan nilai rapor kok! 😉 Cuma 7 pertanyaan singkat~
          </p>

          <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-800">Tes Singkat</p>
                <p className="text-xs text-gray-400 font-medium">7 pertanyaan • ~2 menit</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { emoji: '🧠', text: 'Cek pemahamanmu tentang anemia' },
                { emoji: '📊', text: 'Lihat hasilmu sebelum dan sesudah belajar' },
                { emoji: '💡', text: 'Jawab salah? Gapapa, nanti ada panduan belajarnya!' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-xs text-gray-600 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 rounded-2xl font-black text-white text-[15px] shadow-lg active:scale-[0.97] transition-all"
            style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 8px 25px rgba(34,197,94,0.35)' }}
          >
            Mulai Pre-Test! 🚀
          </button>
        </div>
      </div>
    );
  }

  const q = pretestQuestions[currentIdx];
  const isLast = currentIdx === pretestQuestions.length - 1;
  const progress = ((currentIdx) / pretestQuestions.length) * 100;

  const handleSelect = (idx) => {
    if (!submitting) setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    setSubmitting(true);
    const newAnswers = { ...answers, [q.id]: selectedOption };
    setAnswers(newAnswers);

    setTimeout(async () => {
      if (isLast) {
        let correct = 0;
        pretestQuestions.forEach(qu => { if (newAnswers[qu.id] === qu.correctIndex) correct++; });
        const score = Math.round((correct / pretestQuestions.length) * 100);
        
        // Simpan ke localStorage
        localStorage.setItem('pretestScore', score.toString());
        localStorage.setItem('pretestAnswers', JSON.stringify(newAnswers));
        localStorage.setItem('pretestDone', 'true');

        // Simpan ke Supabase
        const userId = localStorage.getItem('user_id');
        if (userId) {
          try {
            await supabase
              .from('respondents')
              .update({
                pretest_score: score,
                pretest_answers: newAnswers,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId);
          } catch (err) {
            console.error('Gagal menyimpan ke database', err);
          }
        }

        setShowResult(true);
      } else {
        setCurrentIdx(prev => prev + 1);
      }
      setSubmitting(false);
      setSelectedOption(null);
    }, 300);
  };

  // Result Screen
  if (showResult) {
    const score = parseInt(localStorage.getItem('pretestScore') || '0');
    const savedAnswers = JSON.parse(localStorage.getItem('pretestAnswers') || '{}');
    
    // Find wrong answers
    const wrongOnes = pretestQuestions.filter(qu => savedAnswers[qu.id] !== qu.correctIndex);

    return (
      <div className="min-h-screen p-6 pb-10" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #fff 50%, #fff7ed 100%)' }}>
        <div className="text-center pt-8 mb-8">
          <div className="text-6xl mb-4">{score >= 70 ? '🌟' : score >= 40 ? '💪' : '📚'}</div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Hasil Pre-Test Mu</p>
          <div className="mb-2">
            <span className="text-7xl font-black" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{score}</span>
            <span className="text-3xl font-black text-gray-300">/100</span>
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-75 mx-auto">
            {score >= 70 
              ? 'Wah keren! Kamu sudah cukup paham tentang anemia. Tapi yuk kita dalami lagi lewat modul!' 
              : score >= 40 
                ? 'Lumayan nih! Masih ada beberapa topik yang perlu dipelajari. Yuk baca modulnya!' 
                : 'Gapapa kok skor segini! 😊 Justru makanya kita belajar bareng lewat modul-modul seru di bawah ini!'}
          </p>
        </div>

        {/* Wrong answers → link to modules */}
        {wrongOnes.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-3">📖 Pelajari Lebih Lanjut</p>
            <p className="text-xs text-gray-400 font-medium mb-4">Ini topik-topik yang perlu kamu baca modulnya:</p>
            <div className="space-y-2">
              {/* Group by unique modul */}
              {[...new Map(wrongOnes.map(w => [w.modulId, w])).values()].map((item) => (
                <button 
                  key={item.modulId}
                  onClick={() => navigate('/module/' + item.modulId)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-orange-50 border border-orange-100 active:scale-[0.97] transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-orange-600">M{item.modulId}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-gray-700">{item.modulTitle}</p>
                    <p className="text-[10px] text-orange-500 font-semibold">Tap untuk belajar →</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-6">
          <p className="text-xs text-green-700 font-semibold leading-relaxed">
            💡 <strong>Catatan:</strong> Nanti setelah selesai membaca semua modul, kamu bisa ambil Post-Test (Kuis Akhir) untuk lihat seberapa besar peningkatan pemahamanmu! Semangat belajar! 🔥
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 rounded-2xl font-black text-white text-[15px] shadow-lg active:scale-[0.97] transition-all"
          style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 8px 25px rgba(34,197,94,0.35)' }}
        >
          Lanjut ke Beranda 🏠
        </button>
      </div>
    );
  }

  // Question Screen
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest">Pre-Test</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
            <span className="text-orange-700 text-[11px] font-black">{currentIdx + 1}<span className="text-orange-400">/7</span></span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #ea580c, #fb923c)' }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-5 pb-36">
        <div key={currentIdx} className="space-y-5">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100">
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-3">Pertanyaan {currentIdx + 1}</p>
            <h2 className="text-[17px] font-extrabold text-gray-800 leading-[1.6] tracking-tight">{q.text}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const color = optionColors[idx];
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] text-left"
                  style={{
                    background: isSelected ? color.base : '#fff',
                    borderColor: isSelected ? color.active : '#f3f4f6',
                    boxShadow: isSelected ? `0 4px 15px ${color.active}25` : '0 1px 3px rgba(0,0,0,0.04)',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black text-sm transition-all duration-300"
                    style={{
                      background: isSelected ? color.active : '#f9fafb',
                      color: isSelected ? '#fff' : '#9ca3af',
                    }}
                  >
                    {optionLabels[idx]}
                  </div>
                  <span className={`text-[14px] leading-relaxed font-semibold transition-colors duration-200 ${isSelected ? '' : 'text-gray-600'}`} style={{ color: isSelected ? color.text : undefined }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-20" style={{ maxWidth: '430px', margin: '0 auto' }}>
        <button
          onClick={handleNext}
          disabled={selectedOption === null || submitting}
          className="w-full py-4 rounded-2xl font-black text-[15px] transition-all duration-300 active:scale-[0.97]"
          style={{
            background: selectedOption !== null ? 'linear-gradient(135deg, #ea580c, #fb923c)' : '#e5e7eb',
            color: selectedOption !== null ? '#fff' : '#9ca3af',
            boxShadow: selectedOption !== null ? '0 8px 25px rgba(234,88,12,0.35)' : 'none',
            cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
          }}
        >
          {isLast ? '🏁 Lihat Hasilku!' : 'Lanjut →'}
        </button>
      </div>
    </div>
  );
}
