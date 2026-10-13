# Riwayat Perubahan

## 3.0.0
**Statistik**
- **Ulasan terjadwal 30 hari ke depan:** grafik batang bertumpuk (Belajar / Muda / Matang) dengan pilihan 7, 14, atau 30 hari. Ketuk batang untuk rincian per hari dan per bahasa, lengkap dengan garis rata-rata, penanda batas ulasan harian, dan jumlah kartu yang terlambat. Bisa difilter per bahasa atau Grammar.
- **Ringkasan** di puncak halaman: rentetan hari, ulasan hari ini, kartu matang, item selesai.
- **Heatmap konsistensi** 14 minggu (ketuk sel untuk melihat harinya), rentetan terbaik, dan jumlah hari aktif.

**UI/UX**
- **Cincin target harian** di tab Kartu: persentase, sisa kartu, perkiraan menit, dan rentetan 🔥.
- **Suara pengucapan** 🔊 untuk Mandarin, Jepang, Jerman, dan Esperanto, plus opsi ucapkan otomatis saat jawaban dibuka.
- **Tema** Otomatis/Terang/Gelap, **6 warna aksen**, dan **ukuran huruf kata** (Normal/Besar/Sangat besar) di Atur.
- **Perayaan** konfeti + getar saat semua kartu hari ini selesai; getar halus saat menilai kartu.
- Pesan **toast** menggantikan kotak dialog peringatan; animasi halus saat jawaban dibuka.
- **Lencana ikon aplikasi** menampilkan jumlah kartu yang menunggu (di perangkat yang mendukung), dan pintasan ikon ke **Statistik**.

**Teknis**
- Service worker 3.0.0; progres belajar tetap aman (kunci `vortaro_v1` tidak berubah).

## 2.0.0
Diambil dari `kosakata_flashcard_v3.html`, dengan semua fitur Vortaro (PWA, offline, pengingat, ntfy) dipertahankan.

**Baru dari v3**
- Progres kosakata **per bahasa** pada kata yang sama (mis. "manusia" Jerman bisa Selesai, Esperanto tetap Belum). Jadwal flashcard (SRS) juga terpisah per bahasa.
- Navigasi baru dengan ikon; tab **Belajar** kini menggabungkan *Kata* dan *Latihan kalimat* (lengkap dengan indikator langkah & pemilih bahasa).
- Tombol jawaban flashcard menempel di bawah layar, kolom latihan kalimat otomatis membesar, pintasan Ctrl/⌘ + Enter untuk memeriksa kalimat.
- Ketuk kode bahasa (ZH, JA, DE, EO) di tab Daftar untuk mengubah status per bahasa.
- Kartu **Progres per bahasa** di tab Atur untuk menerapkan progres lama ke bahasa aktif.
- Tampilan baru: tema terang/gelap yang lebih rapi, animasi halus, tata letak menyesuaikan layar lebar.

**Tetap ada di Vortaro**
- Pengingat hafalan (notifikasi, banner, lencana jumlah kartu di tab Kartu), pemasangan ke layar utama, mode offline, pengingat ntfy lewat GitHub Actions.
- Penyimpanan memakai kunci `vortaro_v1`; progres dari `kosakata_v1` tetap otomatis disalin bila Vortaro masih kosong.

**Migrasi**
- Progres lama (per kartu) otomatis dikonversi ke per bahasa saat pertama dibuka; salinan lamanya disimpan sebagai cadangan.

## 1.0.0
Rilis pertama Vortaro.
