import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (kode.length === 6 && nama.trim()) {
      setLoading(true);
      try {
        // 1. CEK VALIDITAS KODE (Wajib ada di respondent_codes)
        const { data: codeData, error: codeError } = await supabase
          .from('respondent_codes')
          .select('*')
          .eq('code', kode.toUpperCase())
          .maybeSingle();

        if (codeError || !codeData) {
          const errorMsg = codeError?.code === 'PGRST116' 
            ? 'Kode tidak ditemukan! Pastikan kode benar.' 
            : `Error Database: ${codeError?.message || 'Kode tidak valid'}`;
          alert(errorMsg);
          setLoading(false);
          return;
        }

        // 2. CEK APAKAH USER SUDAH TERDAFTAR (Existing User)
        const { data: existingUser } = await supabase
          .from('respondents')
          .select('*')
          .eq('kode', kode.toUpperCase())
          .maybeSingle();

        if (existingUser) {
          // LOGIN BIASA (Sinkronisasi data)
          localStorage.setItem('user', JSON.stringify({ nama: existingUser.nama, kode: existingUser.kode }));
          localStorage.setItem('user_id', existingUser.id);
          localStorage.setItem('avatar', existingUser.avatar || '🦸‍♀️');
          if (existingUser.ttd_day) localStorage.setItem('ttdDay', existingUser.ttd_day);
          if (existingUser.ttd_time) localStorage.setItem('ttdTime', existingUser.ttd_time);
          if (existingUser.completed_modules) localStorage.setItem('completedModules', JSON.stringify(existingUser.completed_modules));
          if (existingUser.pretest_score !== null) {
            localStorage.setItem('pretestScore', existingUser.pretest_score.toString());
            localStorage.setItem('pretestDone', 'true');
          }
          if (existingUser.posttest_score !== null) localStorage.setItem('lastScore', existingUser.posttest_score.toString());
          navigate(existingUser.pretest_score !== null ? '/dashboard' : '/pretest');
        } else {
          // AUTO-REGISTER (User Baru dengan Kode Valid)
          const { data: newUser, error: insertError } = await supabase
            .from('respondents')
            .insert([{ nama: nama.trim(), kode: kode.toUpperCase() }])
            .select()
            .single();

          if (insertError) throw insertError;

          // Tandai kode sebagai sudah digunakan
          const { error: updateError } = await supabase
            .from('respondent_codes')
            .update({ is_used: true })
            .eq('code', kode.toUpperCase());
          
          if (updateError) console.warn('Gagal menandai kode digunakan:', updateError);

          localStorage.setItem('user', JSON.stringify({ nama: newUser.nama, kode: newUser.kode }));
          localStorage.setItem('user_id', newUser.id);
          localStorage.setItem('avatar', '🦸‍♀️');
          navigate('/pretest');
        }
      } catch (err) {
        console.error('Auth Error:', err);
        alert('Terjadi kesalahan: ' + (err.message || 'Cek koneksi database Anda.'));
      }
      setLoading(false);
    } else {
      alert('Pastikan nama terisi dan kode unik 6 digit ya!');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f7a3c 0%, #1a9e50 35%, #f97316 100%)' }}>
      
      {/* Floating Blobs */}
      <div className="absolute -top-15 -right-15 w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}></div>
      <div className="absolute top-[15%] -left-10 w-36 h-36 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[30%] -right-7.5 w-44 h-44 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}></div>
      
      {/* Top Section - Hero */}
      <div className="pt-16 pb-10 px-7 relative z-10">
        <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8 shadow-lg">
          <span className="text-lg">🩸</span>
          <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Edukasi Remaja Bukittinggi</span>
        </div>
        
        <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          Cegah<br />Anemia<br />
          <span className="text-yellow-300">Yuk! 💪</span>
        </h1>
        <p className="text-white/75 text-[15px] font-medium leading-relaxed max-w-70">
          Jadi warrior kesehatan dan lindungi dirimu dari anemia bareng ribuan remaja Bukittinggi!
        </p>
      </div>

      {/* Bottom Card - Login Form */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] px-7 pt-8 pb-10 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] z-20">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8"></div>
        
        <h2 className="text-2xl font-extrabold text-gray-800 mb-1 tracking-tight">Ayo Mulai! 🎯</h2>
        <p className="text-sm text-gray-400 mb-7 font-medium">Masukkan datamu untuk lanjut berpetualang</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Nama Input */}
          <div className={`relative transition-all duration-300 ${focused === 'nama' ? 'transform -translate-y-0.5' : ''}`}>
            <label className={`absolute left-5 transition-all duration-200 font-semibold pointer-events-none ${focused === 'nama' || nama ? 'top-2 text-[10px] text-primary-600 tracking-wider uppercase' : 'top-[50%] -translate-y-1/2 text-sm text-gray-400'}`}>
              Nama Panggilanmu
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              onFocus={() => setFocused('nama')}
              onBlur={() => setFocused('')}
              className={`w-full pt-7 pb-3 px-5 bg-gray-50 rounded-2xl text-gray-900 font-semibold text-[15px] outline-none border-2 transition-all duration-300 ${focused === 'nama' ? 'border-primary-500 bg-primary-50/30 shadow-[0_0_0_4px_rgba(34,197,94,0.08)]' : 'border-transparent'}`}
            />
          </div>

          {/* Kode Input */}
          <div className={`relative transition-all duration-300 ${focused === 'kode' ? 'transform -translate-y-0.5' : ''}`}>
            <label className={`absolute left-5 transition-all duration-200 font-semibold pointer-events-none ${focused === 'kode' || kode ? 'top-2 text-[10px] text-primary-600 tracking-wider uppercase' : 'top-[50%] -translate-y-1/2 text-sm text-gray-400'}`}>
              Kode Responden (6 digit)
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={kode}
              onChange={(e) => setKode(e.target.value.toUpperCase().slice(0, 6))}
              onFocus={() => setFocused('kode')}
              onBlur={() => setFocused('')}
              className={`w-full pt-7 pb-3 px-5 bg-gray-50 rounded-2xl text-gray-900 font-black text-[22px] tracking-[0.4em] outline-none border-2 transition-all duration-300 ${focused === 'kode' ? 'border-primary-500 bg-primary-50/30 shadow-[0_0_0_4px_rgba(34,197,94,0.08)]' : 'border-transparent'}`}
            />
          </div>

          <div className="flex gap-2 items-center bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
            <span className="text-base">💡</span>
            <p className="text-xs text-amber-700 font-medium leading-snug">Kode didapatkan dari peneliti/fasilitator di sekolahmu</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-2 rounded-2xl font-black text-white text-[16px] tracking-wide shadow-lg shadow-primary-500/30 transition-all duration-200 ${loading ? 'opacity-70 scale-[0.98]' : 'hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.97]'}`}
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)' }}
          >
            {loading ? 'Memuat Data... ⏳' : 'Mulai Petualangan →'}
          </button>

          {/* Admin Link */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
            >
              🔒 Akses Portal Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
