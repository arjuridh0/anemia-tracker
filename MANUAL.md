# 📖 Manual Book — Cegah Anemia Yuk!

**Aplikasi Edukasi & Monitoring Tablet Tambah Darah (TTD) untuk Remaja Putri**  
Versi 2.0 | Terakhir diperbarui: April 2026

---

## Daftar Isi

1. [Tentang Aplikasi](#1-tentang-aplikasi)
2. [Panduan untuk Pengguna (Responden)](#2-panduan-untuk-pengguna-responden)
   - [Cara Mengakses Aplikasi](#21-cara-mengakses-aplikasi)
   - [Cara Install di HP (Seperti Aplikasi Asli)](#22-cara-install-di-hp-seperti-aplikasi-asli)
   - [Login & Registrasi](#23-login--registrasi)
   - [Pre-Test](#24-pre-test)
   - [Dashboard](#25-dashboard)
   - [Modul Edukasi](#26-modul-edukasi)
   - [Kuis](#27-kuis)
   - [Profil & Jadwal TTD](#28-profil--jadwal-ttd)
   - [Notifikasi Pengingat](#29-notifikasi-pengingat)
3. [Panduan untuk Admin (Peneliti)](#3-panduan-untuk-admin-peneliti)
   - [Cara Mengakses Panel Admin](#31-cara-mengakses-panel-admin)
   - [Tab Overview (Ringkasan)](#32-tab-overview-ringkasan)
   - [Tab Respondents (Data Responden)](#33-tab-respondents-data-responden)
   - [Tab Codes (Manajemen Kode)](#34-tab-codes-manajemen-kode)
   - [Mengirim Notifikasi Manual](#35-mengirim-notifikasi-manual)
   - [Export Data ke CSV](#36-export-data-ke-csv)
4. [Perbedaan Android vs iPhone (iOS)](#4-perbedaan-android-vs-iphone-ios)
5. [FAQ (Pertanyaan yang Sering Diajukan)](#5-faq-pertanyaan-yang-sering-diajukan)

---

## 1. Tentang Aplikasi

**Cegah Anemia Yuk!** adalah aplikasi web progresif (PWA) yang dirancang untuk:
- Memberikan edukasi tentang anemia kepada remaja putri
- Mengingatkan jadwal minum Tablet Tambah Darah (TTD)
- Memantau kepatuhan responden melalui panel admin
- Mengumpulkan data pre-test & post-test untuk keperluan penelitian

**Link Aplikasi:** https://anemia-tracker.vercel.app/

---

## 2. Panduan untuk Pengguna (Responden)

### 2.1 Cara Mengakses Aplikasi

Aplikasi ini tidak perlu diunduh dari Play Store atau App Store. Cukup buka link berikut melalui browser HP:

> **https://anemia-tracker.vercel.app/**

Disarankan menggunakan browser **Google Chrome** (Android) atau **Safari** (iPhone).

---

### 2.2 Cara Install di HP (Seperti Aplikasi Asli)

Agar tampil seperti aplikasi sungguhan (ada ikon di layar utama, tampil fullscreen tanpa address bar), ikuti langkah berikut:

#### Untuk HP Android (Chrome):

1. Buka **https://anemia-tracker.vercel.app/** di Chrome
2. Tap ikon **⋮** (titik tiga) di kanan atas Chrome
3. Pilih **"Tambahkan ke layar utama"** atau **"Install app"**
4. Beri nama (misal: "Cegah Anemia") lalu tap **Tambahkan**
5. Ikon aplikasi akan muncul di layar utama HP Anda ✅
6. Buka dari ikon tersebut — tampil fullscreen seperti aplikasi native!

#### Untuk iPhone (Safari):

1. Buka **https://anemia-tracker.vercel.app/** di **Safari** (WAJIB Safari, bukan Chrome)
2. Tap ikon **Share** (ikon kotak dengan panah ke atas ⬆️) di bagian bawah Safari
3. Scroll ke bawah dan pilih **"Tambahkan ke Layar Utama"** (Add to Home Screen)
4. Ketuk **Tambah** di kanan atas
5. Ikon muncul di home screen ✅

> ⚠️ **Penting untuk iPhone:** Anda HARUS membuka dari Safari dan menambahkan ke Home Screen agar fitur notifikasi bisa berfungsi. Membuka dari Chrome di iPhone TIDAK mendukung notifikasi.

---

### 2.3 Login & Registrasi

1. Buka aplikasi → Anda akan disambut layar **Splash** animasi selama beberapa detik
2. Di halaman Login, masukkan:
   - **Nama Lengkap** → Nama Anda
   - **Kode Akses** → Kode 6 huruf yang diberikan oleh peneliti (Contoh: `ABC123`)
3. Tap **Masuk**
4. Jika kode valid dan belum digunakan, Anda akan terdaftar sebagai responden baru
5. Jika kode sudah pernah digunakan oleh Anda sebelumnya, data Anda akan tersinkronisasi otomatis (bisa login dari HP berbeda)

> 💡 Kode akses bersifat unik per orang. Jika kode sudah dipakai orang lain, Anda tidak bisa menggunakannya.

---

### 2.4 Pre-Test

- Setelah login pertama kali, Anda **wajib** mengerjakan **Pre-Test** terlebih dahulu
- Pre-Test berisi pertanyaan seputar pengetahuan anemia
- Jawab semua pertanyaan dengan sejujurnya
- Skor akan tersimpan otomatis dan muncul di halaman Profil
- Pre-Test hanya perlu dikerjakan **1 kali** saja

---

### 2.5 Dashboard

Dashboard adalah halaman utama setelah login. Di sini Anda akan menemukan:

- **Salam & Avatar** — Nama Anda beserta avatar yang dipilih
- **Misi Harian** — 2 checklist yang harus diselesaikan setiap hari:
  - 💊 Minum TTD hari ini
  - 🥦 Makan sayur/buah hari ini
- **Pertanyaan Harian** — Kuis singkat 1 soal per hari untuk mengasah pengetahuan
- **Progress Modul** — Seberapa jauh kemajuan belajar Anda
- **Tips Kesehatan** — Tips acak seputar pencegahan anemia

#### ⚠️ Peringatan Lupa Minum TTD

Jika Anda membuka aplikasi **setelah** jadwal minum TTD yang Anda atur dan belum mencentang misi "Minum TTD", akan muncul **spanduk peringatan merah** di bagian atas Dashboard. Spanduk ini akan hilang setelah Anda mencentang misi tersebut.

---

### 2.6 Modul Edukasi

- Terdapat **6 modul** pembelajaran tentang anemia
- Setiap modul berisi materi bacaan yang informatif
- Baca modul dengan teliti dari awal sampai akhir
- Setelah selesai membaca, modul akan ditandai sebagai "Selesai"
- Progress modul terlihat di Dashboard dan halaman Profil

---

### 2.7 Kuis

- Kuis/Post-Test tersedia setelah Anda menyelesaikan **semua 6 modul**
- Post-Test mengukur peningkatan pemahaman Anda dibanding Pre-Test
- Skor Post-Test akan dibandingkan dengan Pre-Test di halaman Profil

---

### 2.8 Profil & Jadwal TTD

Di halaman Profil, Anda bisa mengatur:

#### Avatar
- Tap avatar Anda untuk memilih karakter baru dari daftar emoji yang tersedia

#### Nama 
- Tap ikon pensil di samping nama → ubah nama → tap Simpan

#### Jadwal Minum TTD (Fitur Utama!)
Anda bisa mengatur jadwal pengingat minum Tablet Tambah Darah secara fleksibel:

1. **Pilih Siklus:**
   - **Mingguan** → Pilih hari-hari tertentu (bisa lebih dari 1, misal: Senin & Kamis)
   - **Harian** → Setiap hari

2. **Pilih Jam Minum:**
   - Tap kotak waktu untuk memilih jam (menggunakan time picker bawaan HP)
   - Bisa menambahkan **hingga 3 waktu** dalam sehari (misal: Pagi 08:00 & Malam 20:00)
   - Tap tombol **"+ Tambah Waktu"** untuk menambah slot waktu
   - Tap tombol **X merah** di samping slot untuk menghapus waktu

3. Tap **💾 Simpan Perubahan** untuk menyimpan jadwal

#### Statistik
- Melihat jumlah modul selesai, skor Pre-Test, dan skor Post-Test
- Perbandingan skor ditampilkan dengan warna (hijau = naik, merah = turun)

#### Logout
- Tap **Keluar** di bagian paling bawah untuk logout dari aplikasi

---

### 2.9 Notifikasi Pengingat

Aplikasi ini memiliki **2 sistem pengingat** agar Anda tidak lupa minum TTD:

#### A. Notifikasi Push (Seperti Chat WhatsApp 🔔)
- Saat pertama kali membuka aplikasi, akan muncul permintaan **"Izinkan Notifikasi"**
- Tap **Allow / Izinkan**
- Setelah itu, HP Anda akan menerima notifikasi pop-up di jam yang sudah Anda atur di Profil
- Notifikasi ini tetap masuk **walaupun aplikasi tidak sedang dibuka** (seperti WhatsApp)

#### B. Peringatan di Dalam Aplikasi (Spanduk Merah ⚠️)
- Jika Anda membuka aplikasi dan ternyata jadwal minum TTD sudah lewat tapi belum dicentang, muncul banner peringatan merah di Dashboard
- Centang misi "Minum TTD" untuk menghilangkan peringatan

---

## 3. Panduan untuk Admin (Peneliti)

### 3.1 Cara Mengakses Panel Admin

1. Buka link berikut di browser (disarankan di laptop):
   > **https://anemia-tracker.vercel.app/admin**
2. Masukkan password admin yang telah ditentukan
3. Anda akan masuk ke Dashboard Admin

> 💡 Untuk kembali ke halaman utama aplikasi, klik tombol **Logout** di panel admin.

---

### 3.2 Tab Overview (Ringkasan)

Menampilkan statistik keseluruhan penelitian:
- **Total Responden** — Jumlah siswa yang sudah mendaftar
- **Rata-rata Pre-Test** — Nilai rata-rata tes awal semua responden
- **Rata-rata Post-Test** — Nilai rata-rata tes akhir semua responden
- **Grafik Perbandingan** — Visualisasi peningkatan skor sebelum dan sesudah edukasi

---

### 3.3 Tab Respondents (Data Responden)

Menampilkan daftar seluruh responden dalam bentuk tabel:

| Kolom | Keterangan |
|-------|------------|
| Profil Responden | Nama, avatar, dan tanggal mendaftar |
| Kode | Kode unik 6 karakter milik responden |
| Pre → Post | Perbandingan skor pre-test dan post-test |
| Modul | Progress bar modul yang sudah diselesaikan (dari 6) |
| TTD Log | Jumlah hari responden sudah minum TTD |
| Aksi | Tombol hapus responden 🗑️ |

#### Cara Menghapus Responden:
1. Cari responden yang ingin dihapus di tabel
2. Klik ikon **🗑️ (tong sampah merah)** di kolom Aksi
3. Muncul dialog konfirmasi: "Yakin ingin MENGHAPUS responden?"
4. Klik **OK** untuk menghapus **secara permanen**
5. Kode akses yang digunakan responden tersebut akan **otomatis dirilis kembali** (bisa dipakai oleh orang baru)

> ⚠️ **Perhatian:** Data yang dihapus tidak bisa dikembalikan! Pastikan Anda sudah meng-export ke CSV sebelum menghapus.

---

### 3.4 Tab Codes (Manajemen Kode)

- Melihat daftar semua kode akses yang telah di-generate
- Status kode: **Terpakai** (hijau) atau **Tersedia** (abu-abu)
- Kode yang tersedia bisa dibagikan kepada responden baru
- Menambahkan kode baru

---

### 3.5 Mengirim Notifikasi Manual (via OneSignal)

Selain notifikasi otomatis dari robot, Anda juga bisa mengirim pesan broadcast manual:

1. Buka **[onesignal.com](https://onesignal.com/)** → Login
2. Pilih aplikasi Anda
3. Menu kiri → **Messages** → **Push**
4. Klik **"New Message"**
5. Isi:
   - **Title:** Judul pesan (misal: "Pengingat Minum TTD 💊")
   - **Message:** Isi pesan (misal: "Hai Pejuang Sehat! Jangan lupa minum TTD hari ini ya!")
   - **Launch URL** (opsional): `https://anemia-tracker.vercel.app/dashboard`
6. Pada bagian **Schedule**, pilih:
   - **Send Immediately** → kirim sekarang
   - **Begin sending at a particular time** → jadwalkan di waktu tertentu
   - Aktifkan **Recurring** → mengulangi setiap hari/minggu secara otomatis
7. Klik **Review and Send** → **Confirm**

---

### 3.6 Export Data ke CSV

1. Buka panel Admin → Tab Overview atau Respondents
2. Klik tombol **📥 Export CSV** di bagian atas
3. File CSV akan terunduh otomatis berisi:
   - Nama, Kode, Pre-test, Post-test, Modul Selesai, Total TTD, Tanggal Daftar
4. Buka file tersebut dengan **Microsoft Excel** atau **Google Sheets** untuk analisis data penelitian

---

## 4. Perbedaan Android vs iPhone (iOS)

| Fitur | Android (Chrome) | iPhone (Safari) |
|-------|:-----------------:|:---------------:|
| Buka di browser | ✅ | ✅ |
| Install ke Home Screen | ✅ Mudah | ✅ Harus lewat Safari |
| Notifikasi Push | ✅ Otomatis muncul | ⚠️ Harus install ke Home Screen dulu |
| Tampil Fullscreen | ✅ | ✅ (jika di-install) |
| Login & Belajar Modul | ✅ | ✅ |
| Kuis & Pre/Post Test | ✅ | ✅ |

### Catatan Khusus untuk iPhone:

1. **WAJIB pakai Safari** — Chrome di iPhone tidak mendukung notifikasi web
2. **WAJIB "Add to Home Screen"** — Tanpa langkah ini, notifikasi push tidak akan berfungsi di iPhone
3. Setelah di-install ke Home Screen, buka aplikasi dari **ikon di layar utama** (bukan dari Safari)
4. Saat muncul dialog "Izinkan Notifikasi", pilih **Allow**
5. Jika tidak muncul dialog izin, buka **Settings iPhone → Notifications → Safari/Cegah Anemia** → aktifkan Allow Notifications

### Catatan Khusus untuk Android:

1. **Disarankan pakai Chrome** (browser default Android)
2. Saat muncul pop-up "Izinkan Notifikasi" → tap **Allow/Izinkan**
3. Jika pop-up tidak muncul: buka **Settings HP → Apps → Chrome → Notifications** → pastikan dalam keadaan aktif
4. Untuk pengalaman terbaik, install ke Home Screen melalui menu Chrome → "Add to Home Screen"

---

## 5. FAQ (Pertanyaan yang Sering Diajukan)

### Umum

**Q: Apakah aplikasi ini memerlukan internet?**  
A: Ya, aplikasi ini memerlukan koneksi internet untuk login, menyimpan progress, dan menerima notifikasi.

**Q: Apakah data saya aman?**  
A: Ya. Data disimpan di server Supabase yang terenkripsi. Tidak ada data pribadi sensitif yang dikumpulkan selain nama dan kode akses.

**Q: Apakah aplikasi ini gratis?**  
A: Ya, 100% gratis. Tidak ada biaya apapun untuk menggunakannya.

### Login

**Q: Kode akses saya ditolak, kenapa?**  
A: Kemungkinan: (1) Kode salah ketik — pastikan huruf besar/kecil benar, (2) Kode sudah digunakan oleh orang lain, (3) Kode tidak ada di database. Hubungi peneliti untuk mendapatkan kode baru.

**Q: Saya ganti HP, apakah data saya hilang?**  
A: Tidak! Login dengan nama + kode yang sama dari HP baru, data Anda akan langsung tersinkronisasi kembali.

### Notifikasi

**Q: Saya tidak menerima notifikasi, kenapa?**  
A: Periksa hal berikut:
1. Pastikan notifikasi browser diizinkan di Settings HP
2. Untuk iPhone: pastikan sudah "Add to Home Screen" lewat Safari
3. Pastikan koneksi internet aktif
4. Pastikan jadwal TTD sudah di-set di halaman Profil

**Q: Bagaimana cara mematikan notifikasi?**  
A: Buka Settings HP → Pilih browser Anda (Chrome/Safari) → Notifications → Matikan untuk situs anemia-tracker.

### Admin

**Q: Saya lupa password admin, bagaimana?**  
A: Hubungi developer untuk mereset password admin.

**Q: Apakah menghapus responden akan mempengaruhi kode akses?**  
A: Kode akses yang digunakan responden yang dihapus akan otomatis dirilis kembali dan bisa digunakan oleh orang baru.

---

> **Butuh bantuan lebih lanjut?**  
> Hubungi tim peneliti atau developer aplikasi untuk pertanyaan teknis yang tidak tercakup dalam manual ini.

---

*Dibuat dengan ❤️ untuk mendukung program pencegahan anemia pada remaja putri di Bukittinggi.*
