# Riwayat Perubahan

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
