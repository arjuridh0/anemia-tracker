# 🚀 Panduan Deployment: "Cegah Anemia Yuk!"

Gunakan panduan ini untuk meng-online-kan aplikasi Anda sehingga responden bisa mengaksesnya lewat link dari mana saja. Saya merekomendasikan **Vercel** karena prosesnya paling cepat dan gratis.

## ☁️ Langkah 1: Hubungkan ke Vercel
1. Pastikan kode Anda sudah di-push ke GitHub.
2. Buka [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
3. Klik tombol **"Add New"** → **"Project"**.
4. Cari repositori `cegah-anemia-web` dan klik **"Import"**.

## ⚙️ Langkah 2: Atur Environment Variables (PENTING!)
Sebelum mengklik "Deploy", Anda harus memasukkan kunci Supabase Anda agar database bisa terkoneksi di versi online:
1. Di halaman konfigurasi Vercel, buka menu **"Environment Variables"**.
2. Masukkan data dari file `.env` Anda:
   - **Key**: `VITE_SUPABASE_URL` | **Value**: (Copy URL dari .env)
   - **Key**: `VITE_SUPABASE_ANON_KEY` | **Value**: (Copy Key dari .env)
3. Klik **"Add"** untuk masing-masing variabel.

## 🚀 Langkah 3: Deploy!
1. Klik tombol **"Deploy"**.
2. Tunggu 1-2 menit hingga proses selesai.
3. Vercel akan memberikan Anda URL (misal: `cegah-anemia-web.vercel.app`).
4. **Selesai!** Berikan link tersebut ke responden untuk dicoba.

---

## 📝 Tips Setelah Online
- **PWA Test**: Buka link aplikasi di HP, pilih menu browser, lalu klik **"Add to Home Screen"**. Aplikasi Anda akan terpasang dengan ikon dan manifest yang sudah kita buat.
- **Log Error**: Jika aplikasi tidak bisa login setelah online, cek kembali apakah `Environment Variables` di Vercel sudah benar atau belum (tidak boleh ada spasi di awal/akhir kunci).
