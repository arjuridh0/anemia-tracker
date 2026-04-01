import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';

const avatars = ['🦸‍♀️', '👩‍🔬', '🧕', '👩‍🎓', '🧜‍♀️', '🦹‍♀️', '👩‍⚕️', '🧚‍♀️', '👩‍🍳', '💃'];
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function Profile() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { nama: '', kode: '' };
  });
  const [avatar, setAvatar] = useState(() => localStorage.getItem('avatar') || '🦸‍♀️');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved).nama : '';
  });
  const [ttdCycle, setTtdCycle] = useState(() => {
    const d = localStorage.getItem('ttdDay');
    return d === 'Setiap Hari' ? 'harian' : 'mingguan';
  });
  const [ttdDays, setTtdDays] = useState(() => {
    const d = localStorage.getItem('ttdDay');
    if (!d || d === 'Setiap Hari') return ['Jumat'];
    return d.split(', ');
  });
  const [ttdTimes, setTtdTimes] = useState(() => {
    const t = localStorage.getItem('ttdTime');
    return t ? t.split(', ') : ['20:00'];
  });
  const navigate = useNavigate();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pretestScore] = useState(() => {
    const pre = localStorage.getItem('pretestScore');
    return pre ? parseInt(pre) : null;
  });
  const [posttestScore] = useState(() => {
    const post = localStorage.getItem('lastScore');
    return post ? parseInt(post) : null;
  });
  const [completedModules] = useState(() => 
    JSON.parse(localStorage.getItem('completedModules') || '[]')
  );

// ...
  const saveProfile = async () => {
    const updatedUser = { ...user, nama: tempName.trim() || user.nama };
    const savedDayString = ttdCycle === 'harian' ? 'Setiap Hari' : ttdDays.join(', ');
    const savedTimeString = ttdTimes.join(', ');

    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('avatar', avatar);
    localStorage.setItem('ttdDay', savedDayString);
    localStorage.setItem('ttdTime', savedTimeString);
    setUser(updatedUser);
    setEditingName(false);
    
    // Simpan ke Supabase
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        await supabase
          .from('respondents')
          .update({
            nama: updatedUser.nama,
            avatar: avatar,
            ttd_day: savedDayString,
            ttd_time: savedTimeString,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      } catch (err) {
        console.error('Gagal update profil', err);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="min-h-screen pb-32" style={{ background: '#f5f5f5' }}>
      
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-10 rounded-b-[40px]" style={{ background: 'linear-gradient(145deg, #15803d 0%, #16a34a 60%, #22c55e 100%)' }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-[3px] border-white/10"></div>
        <div className="absolute top-6 right-5 w-16 h-16 rounded-full bg-white/10"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Avatar */}
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center text-5xl mb-3 shadow-xl active:scale-95 transition-transform"
          >
            {avatar}
          </button>
          <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest mb-2">Tap untuk ganti avatar</p>

          <h1 className="text-2xl font-black text-white tracking-tight">{user.nama}</h1>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20">
            <span className="text-xs">🔑</span>
            <span className="text-white/80 text-xs font-bold tracking-widest">{user.kode}</span>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="mx-5 -mt-5 bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4 relative z-20">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">🎭 Pilih Avatarmu</p>
          <div className="grid grid-cols-5 gap-3">
            {avatars.map((av, i) => (
              <button
                key={i}
                onClick={() => { setAvatar(av); setShowAvatarPicker(false); }}
                className={`w-full aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-90 ${avatar === av ? 'bg-green-100 border-2 border-green-400 shadow-md scale-105' : 'bg-gray-50 border-2 border-gray-100'}`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pt-5 space-y-4">

        {/* === Nama === */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">👤 Nama Panggilan</p>
            <button
              onClick={() => { if (editingName) saveProfile(); else setEditingName(true); }}
              className="text-xs font-bold text-green-600 active:scale-90 transition-transform px-3 py-1 rounded-full bg-green-50 border border-green-200"
            >
              {editingName ? '✓ Simpan' : '✏️ Edit'}
            </button>
          </div>
          {editingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full p-3 rounded-2xl bg-green-50 border-2 border-green-200 text-gray-800 font-bold text-lg outline-none"
              autoFocus
            />
          ) : (
            <p className="text-xl font-extrabold text-gray-800">{user.nama}</p>
          )}
        </div>

        {/* === Kode Responden (read-only) === */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">🔑 Kode Responden</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-2xl bg-gray-50 border-2 border-gray-200">
              <p className="text-2xl font-black text-gray-800 tracking-[0.3em] text-center">{user.kode}</p>
            </div>
            <div className="shrink-0 bg-gray-100 rounded-xl px-3 py-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Read Only</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-2">Kode ini diberikan oleh peneliti dan tidak bisa diubah</p>
        </div>

        {/* === Jadwal Minum TTD === */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">💊 Jadwal Minum TTD</p>
          <p className="text-[10px] text-gray-400 font-medium mb-4">Atur siklus pengingat minum Tablet Tambah Darah-mu</p>

          {/* Type Selector */}
          <div className="flex bg-gray-50 p-1 rounded-2xl mb-4 border border-gray-100">
            {['mingguan', 'harian'].map(type => (
              <button
                key={type}
                onClick={() => setTtdCycle(type)}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all capitalize ${ttdCycle === type ? 'bg-white shadow-sm text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Day Selector (Only if Mingguan) */}
          {ttdCycle === 'mingguan' && (
            <div className="mb-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Pilih Hari (Bisa Lebih Dari 1)</label>
              <div className="flex flex-wrap gap-2">
                {days.map(d => {
                  const isSelected = ttdDays.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        if (isSelected && ttdDays.length > 1) {
                          setTtdDays(ttdDays.filter(day => day !== d));
                        } else if (!isSelected) {
                          setTtdDays([...ttdDays, d]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${isSelected ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Time Picker */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Jam Minum ({ttdTimes.length}x Sehari)</label>
            <div className="space-y-2">
              {ttdTimes.map((time, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimes = [...ttdTimes];
                      newTimes[idx] = e.target.value;
                      setTtdTimes(newTimes);
                    }}
                    className="flex-1 p-3 rounded-2xl bg-green-50 border-2 border-green-200 text-gray-800 font-bold text-sm outline-none w-full appearance-none"
                  />
                  {ttdTimes.length > 1 && (
                    <button 
                      onClick={() => setTtdTimes(ttdTimes.filter((_, i) => i !== idx))}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl border-2 border-red-100 hover:bg-red-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              {ttdTimes.length < 3 && (
                <button
                  onClick={() => setTtdTimes([...ttdTimes, '12:00'])}
                  className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-green-600 bg-green-50/50 border border-dashed border-green-300 rounded-2xl hover:bg-green-50 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah Waktu
                </button>
              )}
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100">
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              ⏰ Jadwalmu: <strong>{ttdCycle === 'harian' ? 'Setiap Hari' : ttdDays.join(', ')}</strong> pukul <strong>{ttdTimes.join(', ')}</strong>. Pastikan tidak terlewat ya!
            </p>
          </div>
        </div>

        {/* === Statistik === */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">📊 Statistikmu</p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-2xl bg-green-50 border border-green-200">
              <p className="text-2xl font-black text-green-600">{completedModules.length}</p>
              <p className="text-[9px] font-bold text-green-500 uppercase mt-1">Modul</p>
            </div>
            <div className="text-center p-3 rounded-2xl" style={{ background: pretestScore !== null ? getScoreColor(pretestScore) + '10' : '#f9fafb', border: pretestScore !== null ? `1px solid ${getScoreColor(pretestScore)}30` : '1px solid #e5e7eb' }}>
              <p className="text-2xl font-black" style={{ color: pretestScore !== null ? getScoreColor(pretestScore) : '#d1d5db' }}>{pretestScore !== null ? pretestScore : '-'}</p>
              <p className="text-[9px] font-bold uppercase mt-1" style={{ color: pretestScore !== null ? getScoreColor(pretestScore) : '#9ca3af' }}>Pre-Test</p>
            </div>
            <div className="text-center p-3 rounded-2xl" style={{ background: posttestScore !== null ? getScoreColor(posttestScore) + '10' : '#f9fafb', border: posttestScore !== null ? `1px solid ${getScoreColor(posttestScore)}30` : '1px solid #e5e7eb' }}>
              <p className="text-2xl font-black" style={{ color: posttestScore !== null ? getScoreColor(posttestScore) : '#d1d5db' }}>{posttestScore !== null ? posttestScore : '-'}</p>
              <p className="text-[9px] font-bold uppercase mt-1" style={{ color: posttestScore !== null ? getScoreColor(posttestScore) : '#9ca3af' }}>Post-Test</p>
            </div>
          </div>

          {/* Score comparison */}
          {pretestScore !== null && posttestScore !== null && (
            <div className="rounded-2xl p-4 border-2" style={{ 
              background: posttestScore > pretestScore ? '#f0fdf4' : '#fef2f2',
              borderColor: posttestScore > pretestScore ? '#bbf7d0' : '#fecaca'
            }}>
              <p className="text-sm font-extrabold text-center" style={{ color: posttestScore > pretestScore ? '#16a34a' : '#dc2626' }}>
                {posttestScore > pretestScore 
                  ? `🎉 Pemahamanmu naik ${posttestScore - pretestScore} poin!`
                  : posttestScore === pretestScore 
                    ? '📖 Skormu sama, yuk baca modul lagi!'
                    : '💪 Jangan nyerah! Baca modulnya lagi ya!'}
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          className="w-full py-4 rounded-2xl font-black text-white text-[15px] shadow-lg active:scale-[0.97] transition-all"
          style={{ 
            background: saved ? 'linear-gradient(135deg, #16a34a, #4ade80)' : 'linear-gradient(135deg, #15803d, #22c55e)', 
            boxShadow: '0 8px 25px rgba(34,197,94,0.35)' 
          }}
        >
          {saved ? '✅ Tersimpan!' : '💾 Simpan Perubahan'}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            if (window.confirm('Apakah kamu yakin ingin keluar? Semua data lokal akan dihapus.')) {
              localStorage.clear();
              navigate('/login');
            }
          }}
          className="w-full py-3.5 rounded-2xl font-bold text-red-500 text-sm bg-red-50 border border-red-100 active:scale-[0.97] transition-all mt-2"
        >
          🚪 Keluar dari Akun
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
