import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCheck } from 'lucide-react';
import { questions } from '../data/questions';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';

const tips = [
  { emoji: "🍊", text: "Jeruk + Rendang = super combo! Vitamin C bikin zat besi terserap 3x lebih banyak." },
  { emoji: "🍃", text: "Daun kelor lokal kita juaranya! Zat besinya melebihi bayam biasa lho!" },
  { emoji: "☕", text: "Jangan minum teh pas makan ya! Tanin di teh 'nangkap' zat besi biar ga terserap." },
  { emoji: "🌙", text: "TTD paling oke diminum malam hari biar efek mual-nya minimal. Tips dari dokter!" },
];

const moduleLabels = [
  { id: 1, emoji: '🩺', short: 'Anemia?' },
  { id: 2, emoji: '🩸', short: 'Penyebab' },
  { id: 3, emoji: '👀', short: 'Gejala' },
  { id: 4, emoji: '⚡', short: 'Dampak' },
  { id: 5, emoji: '🥗', short: 'Cegah' },
  { id: 6, emoji: '🏆', short: 'Aksi!' },
];

// Helper: get today's date as string key
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { nama: 'Warrior', kode: '' };
  });
  const [ttdChecked, setTtdChecked] = useState(false);
  const [sayurChecked, setSayurChecked] = useState(false);
  const [completedModules] = useState(() => JSON.parse(localStorage.getItem('completedModules') || '[]'));
  const [lastScore] = useState(() => { const s = localStorage.getItem('lastScore'); return s ? parseInt(s) : null; });
  const [pretestScore] = useState(() => { const p = localStorage.getItem('pretestScore'); return p ? parseInt(p) : null; });
  const [tipIndex] = useState(() => Math.floor(Math.random() * tips.length));
  const [animateCheck, setAnimateCheck] = useState(null);
  const [avatar] = useState(() => localStorage.getItem('avatar') || '🦸‍♀️');

  // Daily question state
  const [dailyQ, setDailyQ] = useState(() => {
    const todayKey = getTodayKey();
    const savedDailyKey = localStorage.getItem('dailyQuestionDate');
    const savedDailyId = localStorage.getItem('dailyQuestionId');

    if (savedDailyKey === todayKey && savedDailyId) {
      const qId = parseInt(savedDailyId);
      return questions?.find(q => q.id === qId) || questions[0];
    } else if (questions && questions.length > 0) {
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      localStorage.setItem('dailyQuestionDate', todayKey);
      localStorage.setItem('dailyQuestionId', randomQ.id.toString());
      localStorage.removeItem('dailyAnswered');
      return randomQ;
    }
    return null;
  });

  const [dailyAnswered, setDailyAnswered] = useState(() => {
    return localStorage.getItem('dailyAnswered') === getTodayKey();
  });

  const [dailyCorrect, setDailyCorrect] = useState(null);

  // TTD reminder state
  const [showTtdReminder, setShowTtdReminder] = useState(() => {
    const todayKey = getTodayKey();
    const ttdDay = localStorage.getItem('ttdDay');
    if (!ttdDay) return false;
    const todayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];
    const ttdDismissed = localStorage.getItem('ttdDismissed');
    return ttdDay === todayName && ttdDismissed !== todayKey;
  });

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/login');
  }, [navigate]);

  const handleCheck = async (type) => {
    setAnimateCheck(type);
    setTimeout(() => setAnimateCheck(null), 600);
    
    if (type === 'ttd') {
      const newValue = !ttdChecked;
      setTtdChecked(newValue);
      if (newValue) {
        logTtdToSupabase();
      }
    } else {
      setSayurChecked(prev => !prev);
    }
  };

  const logTtdToSupabase = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    try {
      // Get current ttd_logs
      const { data } = await supabase.from('respondents').select('ttd_logs').eq('id', userId).single();
      const currentLogs = data?.ttd_logs || [];
      const today = getTodayKey();
      if (!currentLogs.includes(today)) {
        await supabase.from('respondents').update({ ttd_logs: [...currentLogs, today] }).eq('id', userId);
      }
    } catch (err) {
      console.error('Gagal log TTD', err);
    }
  };

  const handleDailyAnswer = async (idx) => {
    if (dailyAnswered) return;
    setDailyCorrect(idx === dailyQ.correctIndex);
    setDailyAnswered(true);
    const today = getTodayKey();
    localStorage.setItem('dailyAnswered', today);

    // Save to supabase
    const userId = localStorage.getItem('user_id');
    if (userId && dailyQ) {
      try {
        const { data } = await supabase.from('respondents').select('daily_answers').eq('id', userId).single();
        const currentAnswers = data?.daily_answers || {};
        currentAnswers[today] = { qId: dailyQ.id, answerIdx: idx, correct: idx === dailyQ.correctIndex };
        await supabase.from('respondents').update({ daily_answers: currentAnswers }).eq('id', userId);
      } catch (err) {
        console.error('Gagal log daily question', err);
      }
    }
  };

  const handleTtdDone = () => {
    setShowTtdReminder(false);
    setTtdChecked(true);
    localStorage.setItem('ttdDismissed', getTodayKey());
    logTtdToSupabase();
  };

  const handleTtdLater = () => {
    setShowTtdReminder(false);
  };

  const tip = tips[tipIndex];
  const greeting = new Date().getHours() < 12 ? 'Selamat Pagi' : new Date().getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';
  const moduleProgress = Math.round((completedModules.length / 6) * 100);

  const getScoreColor = (s) => {
    if (s >= 80) return '#16a34a';
    if (s >= 60) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="min-h-screen pb-32" style={{ background: '#f5f5f5' }}>

      {/* ===== TTD REMINDER MODAL ===== */}
      {showTtdReminder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-90 text-center shadow-2xl">
            <div className="text-7xl mb-4">💊</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Hari Ini Jadwal TTD-mu!</h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              Sudah minum Tablet Tambah Darah hari ini belum, Warrior?
            </p>
            <div className="space-y-3">
              <button
                onClick={handleTtdDone}
                className="w-full py-4 rounded-2xl font-black text-white text-[15px] shadow-lg active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 8px 25px rgba(34,197,94,0.35)' }}
              >
                ✅ Sudah Minum!
              </button>
              <button
                onClick={handleTtdLater}
                className="w-full py-3.5 rounded-2xl font-bold text-gray-500 text-sm bg-gray-50 border border-gray-200 active:scale-[0.97] transition-all"
              >
                Nanti Dulu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden px-5 pt-10 pb-8 rounded-b-[40px]" style={{ background: 'linear-gradient(145deg, #15803d 0%, #16a34a 60%, #ea580c 160%)' }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-[3px] border-white/10"></div>
        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full border-[3px] border-white/10"></div>
        <div className="absolute top-6 right-5 w-16 h-16 rounded-full bg-white/10"></div>

        {/* Streak */}
        <div className="absolute top-10 right-5 flex flex-col items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-2 shadow-lg">
          <Flame className="w-6 h-6 mb-0.5" style={{ color: '#fb923c', filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.6))' }} fill="#fb923c" />
          <span className="text-white text-[10px] font-black tracking-wider">🔥 STREAK</span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl">
            {avatar}
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase">{greeting},</p>
            <h1 className="text-2xl font-black text-white leading-tight tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
              {user.nama}! 👋
            </h1>
          </div>
        </div>
        <p className="text-white/70 text-sm font-medium mb-6">Ayo belajar lagi hari ini, Warrior!</p>

        {/* Mission Card */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-black text-gray-700 uppercase tracking-widest">Misi Hari Ini</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Selesaikan untuk dapat poin!</p>
            </div>
            <div className="bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-xl">
              <span className="text-orange-600 text-[11px] font-black tracking-wide">+50 POIN</span>
            </div>
          </div>

          {[
            { key: 'ttd', emoji: '💊', label: 'Minum TTD hari ini', checked: ttdChecked },
            { key: 'sayur', emoji: '🥦', label: 'Makan sayur/buah hari ini', checked: sayurChecked }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleCheck(item.key)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl mb-2 last:mb-0 transition-all duration-300 active:scale-[0.97] ${item.checked ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-100 hover:border-gray-200'}`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className={`flex-1 text-sm text-left font-semibold transition-colors duration-300 ${item.checked ? 'text-green-700 line-through decoration-green-400' : 'text-gray-600'}`}>
                {item.label}
              </span>
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${item.checked ? 'bg-green-500 border-green-500 scale-110' : 'border-gray-300'} ${animateCheck === item.key ? 'scale-125' : ''}`}>
                {item.checked && <CheckCheck className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">

        {/* ===== DAILY QUESTION (Opsional) ===== */}
        {dailyQ && (
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <p className="text-[11px] font-black text-purple-600 uppercase tracking-widest">Asah Otak Hari Ini</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                <span className="text-purple-600 text-[10px] font-black">+10 POIN</span>
              </div>
            </div>

            {dailyAnswered ? (
              <div className="rounded-2xl p-4 text-center" style={{ background: dailyCorrect ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${dailyCorrect ? '#bbf7d0' : '#fecaca'}` }}>
                <div className="text-3xl mb-2">{dailyCorrect ? '🎉' : '😊'}</div>
                <p className="text-sm font-extrabold" style={{ color: dailyCorrect ? '#16a34a' : '#dc2626' }}>
                  {dailyCorrect ? 'Benar! +10 Poin untukmu!' : 'Hmm, belum tepat. Belajar lagi ya!'}
                </p>
                <p className="text-xs text-gray-400 font-medium mt-1">Kembali besok untuk soal baru!</p>
              </div>
            ) : (
              <>
                <p className="text-[14px] font-bold text-gray-800 leading-relaxed mb-3">{dailyQ.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  {dailyQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDailyAnswer(idx)}
                      className="p-3 rounded-2xl border-2 border-gray-100 bg-gray-50 text-xs font-semibold text-gray-600 text-left active:scale-[0.95] transition-all hover:border-purple-200 hover:bg-purple-50"
                    >
                      <span className="font-black text-purple-500 mr-1">{['A','B','C','D'][idx]}.</span> {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== PROGRESS SECTION ===== */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-extrabold text-gray-800 tracking-tight">Progres Belajarmu</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{completedModules.length} dari 6 modul selesai</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black" style={{ color: moduleProgress > 0 ? '#16a34a' : '#d1d5db' }}>{moduleProgress}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${moduleProgress}%`, background: 'linear-gradient(90deg, #16a34a, #4ade80)' }}
            ></div>
          </div>

          {/* Module dots */}
          <div className="flex gap-2 justify-between">
            {moduleLabels.map((mod) => {
              const isDone = completedModules.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() => navigate('/module/' + mod.id)}
                  className="flex flex-col items-center gap-1.5 flex-1 active:scale-90 transition-transform"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${isDone ? 'shadow-md' : 'opacity-40'}`}
                    style={{ background: isDone ? '#f0fdf4' : '#f3f4f6', border: isDone ? '2px solid #bbf7d0' : '2px solid #e5e7eb' }}>
                    {isDone ? mod.emoji : '🔒'}
                  </div>
                  <span className={`text-[9px] font-bold text-center leading-tight ${isDone ? 'text-green-600' : 'text-gray-300'}`}>{mod.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== SKOR PRE vs POST ===== */}
        {(pretestScore !== null || lastScore !== null) && (
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">📊 Perkembangan Nilaimu</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              {/* Pre-test */}
              <div className="flex-1 text-center p-3 rounded-2xl" style={{ background: pretestScore !== null ? getScoreColor(pretestScore) + '10' : '#f9fafb', border: `1.5px solid ${pretestScore !== null ? getScoreColor(pretestScore) + '30' : '#e5e7eb'}` }}>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pre-Test</p>
                <p className="text-3xl font-black" style={{ color: pretestScore !== null ? getScoreColor(pretestScore) : '#d1d5db' }}>
                  {pretestScore !== null ? pretestScore : '-'}
                </p>
              </div>
              <div className="text-2xl text-gray-300">→</div>
              {/* Post-test */}
              <div className="flex-1 text-center p-3 rounded-2xl" style={{ background: lastScore !== null ? getScoreColor(lastScore) + '10' : '#f9fafb', border: `1.5px solid ${lastScore !== null ? getScoreColor(lastScore) + '30' : '#e5e7eb'}` }}>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Post-Test</p>
                <p className="text-3xl font-black" style={{ color: lastScore !== null ? getScoreColor(lastScore) : '#d1d5db' }}>
                  {lastScore !== null ? lastScore : '-'}
                </p>
              </div>
            </div>

            {/* Comparison message */}
            {pretestScore !== null && lastScore !== null && (
              <div className="rounded-2xl p-3 text-center" style={{
                background: lastScore > pretestScore ? '#f0fdf4' : lastScore === pretestScore ? '#fffbeb' : '#fef2f2',
                border: `1.5px solid ${lastScore > pretestScore ? '#bbf7d0' : lastScore === pretestScore ? '#fde68a' : '#fecaca'}`
              }}>
                <p className="text-sm font-extrabold" style={{ color: lastScore > pretestScore ? '#16a34a' : lastScore === pretestScore ? '#d97706' : '#dc2626' }}>
                  {lastScore > pretestScore
                    ? `🎉 Naik ${lastScore - pretestScore} poin! Keren banget!`
                    : lastScore === pretestScore
                      ? '📖 Yuk baca modul lagi biar naik skornya!'
                      : '💪 Jangan nyerah! Baca modul dan coba lagi!'}
                </p>
              </div>
            )}

            {lastScore !== null && lastScore < 60 && (
              <button
                onClick={() => navigate('/modules')}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-green-600 bg-green-50 border border-green-200 active:scale-[0.97] transition-all"
              >
                📚 Baca Modul Sekarang →
              </button>
            )}
          </div>
        )}

        {/* ===== QUICK TIP ===== */}
        <div className="relative overflow-hidden rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)', border: '1.5px solid #fed7aa' }}>
          <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 select-none pointer-events-none">💡</div>
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">💡 Tahukah Kamu?</p>
          <div className="flex gap-3 items-start">
            <span className="text-3xl leading-none">{tip.emoji}</span>
            <p className="text-sm font-semibold text-amber-900 leading-relaxed italic">"{tip.text}"</p>
          </div>
        </div>

        {/* ===== CTA Mulai Belajar / Lanjut ===== */}
        <button
          onClick={() => navigate(completedModules.length >= 6 ? '/quiz' : '/modules')}
          className="w-full py-4 rounded-2xl font-black text-white text-[15px] shadow-lg active:scale-[0.97] transition-all"
          style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 8px 25px rgba(34,197,94,0.35)' }}
        >
          {completedModules.length === 0 ? '📚 Mulai Belajar Sekarang →' : completedModules.length < 6 ? `📖 Lanjutkan Modul ${completedModules.length + 1} →` : '✅ Ambil Post-Test Sekarang! →'}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
