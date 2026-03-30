import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { supabase } from '../lib/supabase';

const optionLabels = ['A', 'B', 'C', 'D'];
const optionColors = [
  { base: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', active: '#3b82f6' },
  { base: '#f0fdf4', border: '#bbf7d0', text: '#166534', active: '#22c55e' },
  { base: '#fff7ed', border: '#fed7aa', text: '#c2410c', active: '#f97316' },
  { base: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce', active: '#a855f7' },
];

// Mapping soal ke modul terkait
const questionModuleMap = {
  1: { id: 1, title: 'Apa Itu Anemia?' },
  2: { id: 2, title: 'Kenapa Remaja Putri Rentan?' },
  3: { id: 2, title: 'Kenapa Remaja Putri Rentan?' },
  4: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  5: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  6: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  7: { id: 3, title: 'Kenali Tanda & Gejalanya' },
  8: { id: 3, title: 'Kenali Tanda & Gejalanya' },
  9: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  10: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  11: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  12: { id: 4, title: 'Dampak Anemia' },
  13: { id: 4, title: 'Dampak Anemia' },
  14: { id: 2, title: 'Kenapa Remaja Putri Rentan?' },
  15: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  16: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  17: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  18: { id: 6, title: 'Aksi Nyata Agen Perubahan' },
  19: { id: 5, title: 'Pencegahan: TTD & Pola Makan' },
  20: { id: 3, title: 'Kenali Tanda & Gejalanya' },
};

export default function Quiz() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [currentIdx]);

  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const progress = ((currentIdx) / questions.length) * 100;

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
        questions.forEach(qu => { if (newAnswers[qu.id] === qu.correctIndex) correct++; });
        const score = Math.round((correct / questions.length) * 100);
        
        // Simpan ke localStorage
        localStorage.setItem('lastScore', score.toString());
        localStorage.setItem('posttestAnswers', JSON.stringify(newAnswers));

        // Simpan ke Supabase
        const userId = localStorage.getItem('user_id');
        if (userId) {
          try {
            await supabase
              .from('respondents')
              .update({
                posttest_score: score,
                posttest_answers: newAnswers,
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

  if (showResult) {
    const score = parseInt(localStorage.getItem('lastScore') || '0');
    const pretestScore = localStorage.getItem('pretestScore');
    const savedAnswers = JSON.parse(localStorage.getItem('posttestAnswers') || '{}');
    
    // Find wrong answers with module links
    const wrongOnes = questions.filter(qu => savedAnswers[qu.id] !== qu.correctIndex);
    const wrongModules = [...new Map(wrongOnes.map(w => {
      const mod = questionModuleMap[w.id];
      return [mod.id, mod];
    })).values()];
    
    let grade, emoji, msg;
    if (score >= 80) { grade = 'Pengetahuan Tinggi'; emoji = '🏆'; msg = 'Luar biasa! Kamu sudah paham banget soal pencegahan anemia!'; }
    else if (score >= 60) { grade = 'Pengetahuan Cukup'; emoji = '🌟'; msg = 'Bagus! Masih ada beberapa hal yang bisa dipelajari lagi.'; }
    else if (score >= 40) { grade = 'Perlu Belajar Lagi'; emoji = '📚'; msg = 'Yuk semangat! Coba baca modulnya lagi dan pasti bisa lebih baik!'; }
    else { grade = 'Ayo Belajar Lebih Giat'; emoji = '💪'; msg = 'Jangan menyerah! Baca semua modul dulu lalu coba lagi ya!'; }

    return (
      <div className="min-h-screen p-6 pb-10" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #fff 50%, #fff7ed 100%)' }}>
        <div className="text-center pt-8 mb-6">
          <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Hasil Post-Test</p>
          <div className="mb-2">
            <span className="text-8xl font-black" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{score}</span>
            <span className="text-4xl font-black text-gray-300">/100</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-gray-100 mb-3">
            <span className="text-sm font-extrabold text-gray-700">{grade}</span>
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4 max-w-[300px] mx-auto">{msg}</p>
        </div>

        {/* Pre vs Post Comparison */}
        {pretestScore && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">📊 Perbandingan Skor</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pre-Test</p>
                <p className="text-3xl font-black text-gray-400">{pretestScore}</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold text-green-500 uppercase mb-1">Post-Test</p>
                <p className="text-3xl font-black text-green-600">{score}</p>
              </div>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{
              background: score > parseInt(pretestScore) ? '#f0fdf4' : '#fef2f2',
              border: `1.5px solid ${score > parseInt(pretestScore) ? '#bbf7d0' : '#fecaca'}`
            }}>
              <p className="text-sm font-extrabold" style={{ color: score > parseInt(pretestScore) ? '#16a34a' : '#dc2626' }}>
                {score > parseInt(pretestScore)
                  ? `🎉 Pemahamanmu naik ${score - parseInt(pretestScore)} poin! Keren!`
                  : score === parseInt(pretestScore)
                    ? '📖 Skormu sama, yuk baca modul lagi!'
                    : '💪 Jangan nyerah! Baca modulnya ya!'}
              </p>
            </div>
          </div>
        )}

        {/* Wrong answers → link to modules */}
        {wrongModules.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4">
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-3">📖 Pelajari Lagi</p>
            <p className="text-xs text-gray-400 font-medium mb-3">Kamu perlu baca ulang modul ini:</p>
            <div className="space-y-2">
              {wrongModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => navigate('/module/' + mod.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-orange-50 border border-orange-100 active:scale-[0.97] transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-orange-600">M{mod.id}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-gray-700">{mod.title}</p>
                    <p className="text-[10px] text-orange-500 font-semibold">Tap untuk belajar →</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        {score < 60 && (
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
            <p className="text-xs text-green-700 font-semibold leading-relaxed">
              💡 <strong>Jangan nyerah ya!</strong> Baca modul-modul di atas, lalu kembali ke sini dan coba kuis lagi. Pasti bisa lebih baik! Semangat Warrior! 🔥
            </p>
          </div>
        )}

        <div className="space-y-3 mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-2xl font-black text-white text-[15px] shadow-lg active:scale-[0.97] transition-all"
            style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 8px 25px rgba(34,197,94,0.35)' }}
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => { setCurrentIdx(0); setAnswers({}); setSelectedOption(null); setShowResult(false); }}
            className="w-full py-3.5 rounded-2xl font-bold text-gray-500 text-sm bg-white border border-gray-100 shadow-sm active:scale-[0.97] transition-all"
          >
            🔄 Ulangi Kuis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
            <span className="text-lg font-bold leading-none">‹</span>
          </button>
          <div className="text-center">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Post-Test (Kuis Akhir)</p>
          </div>
          <div className="bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
            <span className="text-green-700 text-[11px] font-black">{currentIdx + 1}<span className="text-green-400">/20</span></span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #16a34a, #4ade80)' }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-5 pb-36">
        <div key={currentIdx} className="space-y-5">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100">
            <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-3">Pertanyaan {currentIdx + 1}</p>
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
            background: selectedOption !== null ? 'linear-gradient(135deg, #15803d, #22c55e)' : '#e5e7eb',
            color: selectedOption !== null ? '#fff' : '#9ca3af',
            boxShadow: selectedOption !== null ? '0 8px 25px rgba(34,197,94,0.35)' : 'none',
            cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
          }}
        >
          {isLast ? '🏁 Serahkan & Lihat Hasilku' : 'Lanjut →'}
        </button>
      </div>
    </div>
  );
}
