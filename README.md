# Vortaro

Aplikasi flashcard kosakata (Mandarin, Jepang, Jerman, Belanda, Inggris, Esperanto) dengan jadwal ulasan SRS,
latihan kalimat, grammar, **pengingat hafalan**, dan bisa dipasang seperti aplikasi biasa (PWA) — gratis lewat GitHub Pages.

- Semua kode ada di folder [`docs/`](docs) (HTML + CSS + JS biasa, tanpa build).
- **Panduan lengkap dari nol: [TUTORIAL.md](TUTORIAL.md)** · Riwayat perubahan: [CHANGELOG.md](CHANGELOG.md)
- Versi saat ini: **7.29.1** (perbaikan gagal-buka: lookbehind regex, layar pemulihan) · 7.22.0 (Genitiv Jerman terkurasi) · 7.21.0 (soal jamak Jerman/Belanda) · 7.20.0 (Games dirombak: hub, Penggolong Mandarin, Artikel & Akhiran Jerman/Belanda) · 7.19.4 (penyimpanan: gabung dua tab, cadangan berputar, ekspor lengkap, cache antrean) · 7.19.3 (grammar Esperanto satu materi per kartu: 266 → 311 kartu) · 7.19.2 (perbaikan layar Kartu Esperanto) · 7.19.1 (rumpang grammar Esperanto) · 7.19.0 (grammar Belanda satu materi per kartu, flashcard satu entri per kartu, kartu baru langsung “Sedang” untuk Kelas AI) · 7.18.0 (penjelasan konteks singkat di kartu & daftar kosakata, petunjuk konteks di sisi depan) · 7.17.0 (soal rumpang grammar diambil acak dari Pustaka, prompt Pustaka untuk soal rumpang, perbaikan tombol Salin & prompt Kelas AI yang seragam) · 7.16.1 (kartu grammar Belanda: cakupan soal 100%, kunci eksplisit/idiom, soal huruf-hilang, sel tabel berputar) · 7.16.0 (kartu grammar Belanda berbasis soal rumpang / soal sel tabel) · 7.15.0 (kartu grammar Jerman berbasis soal rumpang / soal sel tabel) · 7.14.0 (kartu grammar Mandarin gabungan dipecah) · 7.13.0 (kartu grammar Jepang berbasis soal rumpang) · 7.12.0 (kartu grammar Inggris berbasis soal rumpang + 231 terjemahan contoh) · 7.11.0 (kartu grammar Mandarin berbasis soal rumpang) · 7.10.0 (HSK 7-9, Belanda C1–C2, +4.600 kata baru) · 7.9.0 (penyimpanan IndexedDB + migrasi otomatis dari localStorage) · 7.8.0 (tab Games) · 7.7.0 (tab Belajar & Bacaan Esperanto dihapus, pengaturan flashcard di Atur, kuota 0 Kelas AI Pustaka) · 7.6.1 (Kelas AI Pustaka: level aktif + kartu belum pernah muncul; romaji/pinyin) · 7.6.0 (bahasa Inggris A1–C2) · 7.5.0 (onboarding, sensor permanen, Kelas AI Pustaka) · 7.4.0 (penghubung kartu ⇄ Pustaka, dua JSON cadangan, contoh dari Pustaka) · 7.3.1 (perbaikan pemisahan bahasa asing / romanisasi / Indonesia di Pustaka & suara) · 7.3 — Kelas AI dengan prompt Penjelasan / Reading / Listening / Dialog / Kalimat / Bicara dan **Pustaka empat bagian** (Reading, Listening, Dialog, Kalimat); sebelumnya 7.2 — **Pustaka Reading & Listening** dengan format keluaran Kelas AI bernomor [1.1] (anti-mismatch romanisasi); sebelumnya 7.0 — **Pustaka teks + pemutar listening**, prompt Kelas AI “Bicara” (percakapan & koreksi), **kartu bandel** + prompt mnemonik; sebelumnya — **Kelas AI** dengan prompt panjang, sedang (teks bacaan) & pendek, perkiraan tuntas di Statistik (salin prompt belajar grammar & kosakata komprehensif untuk ChatGPT/Claude/Gemini, memakai kosakata lemahmu), dan semua fitur 4.0: bahasa **Belanda** (kosakata A1–B2 + grammar & taksonomi A1–C2), **Bacaan Esperanto** per pelajaran, taksonomi grammar, edit keterangan, dan semua fitur 3.0 (jadwal ulasan 30 hari, heatmap, suara, tema, pengingat).

## Coba di komputer sendiri

```bash
cd docs
python3 -m http.server 8000
# buka http://localhost:8000
```

## Struktur

```
docs/
  index.html            halaman utama
  manifest.webmanifest  data "aplikasi" (nama, ikon, warna)
  sw.js                 service worker: offline + pengingat latar belakang
  css/app.css           tampilan
  js/data.js            seluruh kosakata, grammar, taksonomi & teks bacaan (±4,5 MB)
  js/app.js             logika aplikasi (flashcard, SRS, latihan, statistik)
  js/pustaka.js         Pustaka teks, pencocok bentuk kata, pemutar listening, kartu bandel
  js/ai-class.js        Kelas AI: penyusun prompt belajar untuk AI (grammar & kosakata)
  js/vr-store.js        penyimpanan IndexedDB + migrasi otomatis dari localStorage
  js/vr-core.js         inti pengingat (dipakai halaman & service worker)
  js/reminder.js        UI pengingat + tombol pasang aplikasi
  icons/                ikon aplikasi
.github/workflows/
  reminder-ntfy.yml     (opsional) pengingat harian andal lewat ntfy.sh
```
