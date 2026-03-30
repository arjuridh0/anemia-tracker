import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

async function markModuleComplete(id) {
  const saved = JSON.parse(localStorage.getItem('completedModules') || '[]');
  if (!saved.includes(id)) {
    const newArr = [...saved, id];
    localStorage.setItem('completedModules', JSON.stringify(newArr));
    
    // Simpan ke Supabase
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        await supabase
          .from('respondents')
          .update({
            completed_modules: newArr,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      } catch (err) {
        console.error('Gagal update modul', err);
      }
    }
  }
}

const modulesData = [
  {
    id: 1, emoji: '🩺', title: 'Apa Itu Anemia?', accent: '#16a34a', accentLight: '#f0fdf4',
    img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
    sections: [
      { heading: 'Definisi Anemia', body: 'Anemia adalah kondisi di mana kadar hemoglobin (Hb) dalam darah berada di bawah nilai normal. Hemoglobin adalah protein di dalam sel darah merah yang bertugas membawa oksigen ke seluruh tubuh.' },
      { heading: 'Berapa Kadar Normal Hb?', body: 'Menurut standar WHO, untuk **remaja putri** kadar Hb harus berada di atas **12 g/dL**. Jika di bawah angka itu, maka kamu termasuk kategori anemia dan perlu penanganan segera.' },
      { heading: 'Seberapa Umum Ini?', body: 'Kamu tidak sendirian! Sekitar **1 dari 3 remaja putri di Indonesia** mengalami anemia. Di Bukittinggi sendiri, angkanya cukup tinggi dan inilah mengapa edukasi ini sangat penting.' },
    ]
  },
  {
    id: 2, emoji: '🩸', title: 'Kenapa Remaja Putri Rentan?', accent: '#ea580c', accentLight: '#fff7ed',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    sections: [
      { heading: 'Masa Pertumbuhan Pesat', body: 'Kamu sedang dalam fase pertumbuhan yang sangat cepat! Tubuhmu membutuhkan jauh lebih banyak zat besi untuk membentuk sel darah merah baru setiap hari.' },
      { heading: 'Menstruasi Setiap Bulan', body: 'Ini adalah faktor utama kenapa perempuan lebih rentan! Setiap bulan, tubuhmu kehilangan zat besi melalui **darah menstruasi**. Makin banyak darah yang keluar, makin besar risiko anemia.' },
      { heading: 'Pola Makan Tidak Ideal', body: 'Sering skip sarapan? Suka diet ekstrem? Kurang suka makan daging dan sayur? Semua itu berkontribusi besar pada **berkurangnya cadangan zat besi** dalam tubuhmu.' },
    ]
  },
  {
    id: 3, emoji: '👀', title: 'Kenali Tanda & Gejalanya', accent: '#dc2626', accentLight: '#fef2f2',
    img: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600',
    sections: [
      { heading: 'Gejala Umum: 5L', body: 'Cara paling mudah mengingat gejalanya: **Lemah, Letih, Lesu, Lelah, Lalai (5L)**. Kamu merasa terus capek padahal aktivitasnya biasa-biasa saja? Itu sinyal penting!' },
      { heading: 'Cek Sendiri di Cermin', body: 'Tarik kelopak mata bawahmu sedikit ke bawah dan lihat bagian dalam berwarna merah (Konjungtiva). Pada penderita anemia, bagian itu akan terlihat **pucat atau putih**, bukan merah cerah.' },
      { heading: 'Gejala Lainnya', body: 'Sering pusing tiba-tiba saat berdiri cepat, sulit berkonsentrasi waktu belajar, jantung berdebar, atau kuku mudah patah dan pucat juga bisa jadi tanda anemia yang perlu diwaspadai.' },
    ]
  },
  {
    id: 4, emoji: '⚡', title: 'Dampak Anemia', accent: '#d97706', accentLight: '#fffbeb',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
    sections: [
      { heading: 'Dampak Sekarang (Jangka Pendek)', body: 'Anemia langsung mempengaruhi kehidupanmu sehari-hari. **Nilai pelajaran bisa turun** karena susah fokus, stamina saat olahraga melemah, dan kamu jadi lebih mudah tertular penyakit karena imunitas ikut melemah.' },
      { heading: 'Dampak Masa Depanmu', body: 'Ini yang sering dilupakan remaja. Anemia yang tidak ditangani bisa terbawa hingga dewasa. Saat hamil kelak, ibu yang anemia berisiko tinggi mengalami **perdarahan berbahaya** dan melahirkan bayi dengan berat badan kurang atau risiko **stunting**.' },
      { heading: 'Produktivitas & Karir', body: 'Penelitian membuktikan, remaja yang bebas anemia punya kemampuan belajar, daya ingat, dan produktivitas kerja yang jauh lebih baik. **Investasi terbaik untuk masa depanmu dimulai dari darah yang sehat!**' },
    ]
  },
  {
    id: 5, emoji: '🥗', title: 'Pencegahan: TTD & Pola Makan', accent: '#16a34a', accentLight: '#f0fdf4',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
    sections: [
      { heading: '💊 Cara Minum TTD yang Benar', body: 'Minum **1 tablet per minggu**, direkomendasikan malam hari setelah makan malam agar mengurangi rasa mual. Jangan panik kalau besok tinjamu berwarna hitam—itu normal dan pertanda TTD-nya diserap tubuh!' },
      { heading: '🥩 Makanan Kaya Zat Besi', body: '**Zat Besi Heme (mudah diserap):** Rendang sapi, hati ayam, ikan teri.\n**Zat Besi Non-Heme:** Bayam, daun kelor, tempe, tahu.\nPaduan terbaik: Makan rendang + jus jeruk di waktu yang sama!' },
      { heading: '🚫 Yang Harus Dihindari', body: 'JANGAN minum **teh atau kopi** bersamaan saat makan besar! Tanin di dalam teh ibarat magnet yang menangkap dan membuang zat besi sebelum sempat diserap ususmu. Tunggu minimal 1-2 jam setelah makan.' },
    ]
  },
  {
    id: 6, emoji: '🏆', title: 'Aksi Nyata Agen Perubahan', accent: '#9333ea', accentLight: '#faf5ff',
    img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=600',
    sections: [
      { heading: 'Mulai dari Dirimu Sendiri', body: 'Komitmen dimulai dari KAMU. Tandai di kalendermu jadwal minum TTD setiap minggunya. Pasang alarm HP jam 20.00 dengan label "💊 Waktunya TTD!" agar tidak pernah lupa.' },
      { heading: 'Jadilah Agen Perubahan', body: 'Setelah kamu paham bahayanya anemia, sekarang giliran kamu untuk **mengedukasi teman-teman**! Ajak teman sebangkumu minum TTD bersama, bagikan fakta menarik tentang anemia melalui WhatsApp Story atau Instagram-mu.' },
      { heading: 'Bangkit Bukittinggi!', body: 'Bersama-sama kita bisa menekan angka anemia di kota kita. Setiap remaja putri yang sadar dan bergerak adalah **pahlawan kesehatan**. Kamu sudah satu langkah lebih maju dari yang lain. Pertahankan semangatmu, Warrior! 💪' },
    ]
  },
];

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const m = modulesData.find(x => x.id === parseInt(id));
  const nextId = m ? m.id + 1 : null;
  const hasNext = nextId && nextId <= 6;

  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  if (!m) return null;

  const handleComplete = () => {
    markModuleComplete(m.id);
    if (hasNext) {
      navigate('/module/' + nextId);
    } else {
      navigate('/modules');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Image */}
      <div className="relative h-72 overflow-hidden">
        <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }}></div>
        
        <button onClick={() => navigate(-1)} className="absolute top-8 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
          <span className="text-lg font-bold">‹</span>
        </button>

        <div className="absolute bottom-6 left-5 right-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ background: m.accent + '33', border: `1px solid ${m.accent}55`, backdropFilter: 'blur(10px)' }}>
            <span className="text-base">{m.emoji}</span>
            <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: '#fff' }}>Modul {m.id} dari 6</span>
          </div>
          <h1 className="text-[28px] font-black text-white leading-tight tracking-tight drop-shadow-lg">{m.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-5">
        {m.sections.map((sec, i) => (
          <div key={i} className="rounded-3xl overflow-hidden" style={{ background: m.accentLight, border: `1.5px solid ${m.accent}20` }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: m.accent + '15' }}>
              <h2 className="text-[15px] font-extrabold tracking-tight" style={{ color: m.accent }}>{sec.heading}</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-[14px] text-gray-700 leading-[1.75] font-medium">
                {sec.body.split('\n').map((line, li) => (
                  <span key={li}>
                    {line.split('**').map((chunk, ci) =>
                      ci % 2 === 1
                        ? <strong key={ci} style={{ color: m.accent }} className="font-extrabold">{chunk}</strong>
                        : <span key={ci}>{chunk}</span>
                    )}
                    {li < sec.body.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}

        <button
          onClick={handleComplete}
          className="w-full py-4 rounded-2xl font-black text-white text-[15px] mt-4 active:scale-[0.97] transition-all shadow-lg"
          style={{ background: `linear-gradient(135deg, ${m.accent}, ${m.accent}bb)`, boxShadow: `0 8px 25px ${m.accent}40` }}
        >
          {hasNext ? `✅ Selesai & Lanjut Modul ${nextId} →` : '🎉 Selesai Semua Modul!'}
        </button>
        <button onClick={() => navigate('/quiz')} className="w-full py-3.5 rounded-2xl font-bold text-gray-500 text-sm bg-gray-50 border border-gray-100 active:scale-[0.97] transition-all">
          Langsung ke Kuis →
        </button>
      </div>
    </div>
  );
}
