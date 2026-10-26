# Vortaro

Aplikasi flashcard kosakata (Mandarin, Jepang, Jerman, Belanda, Esperanto) dengan jadwal ulasan SRS,
latihan kalimat, grammar, **pengingat hafalan**, dan bisa dipasang seperti aplikasi biasa (PWA) — gratis lewat GitHub Pages.

- Semua kode ada di folder [`docs/`](docs) (HTML + CSS + JS biasa, tanpa build).
- **Panduan lengkap dari nol: [TUTORIAL.md](TUTORIAL.md)** · Riwayat perubahan: [CHANGELOG.md](CHANGELOG.md)
- Versi saat ini: **6.3** — **Kelas AI** dengan prompt panjang, sedang (teks bacaan) & pendek, perkiraan tuntas di Statistik (salin prompt belajar grammar & kosakata komprehensif untuk ChatGPT/Claude/Gemini, memakai kosakata lemahmu), dan semua fitur 4.0: bahasa **Belanda** (kosakata A1–B2 + grammar & taksonomi A1–C2), **Bacaan Esperanto** per pelajaran, taksonomi grammar, edit keterangan, dan semua fitur 3.0 (jadwal ulasan 30 hari, heatmap, suara, tema, pengingat).

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
  js/ai-class.js        Kelas AI: penyusun prompt belajar untuk AI (grammar & kosakata)
  js/vr-core.js         inti pengingat (dipakai halaman & service worker)
  js/reminder.js        UI pengingat + tombol pasang aplikasi
  icons/                ikon aplikasi
.github/workflows/
  reminder-ntfy.yml     (opsional) pengingat harian andal lewat ntfy.sh
```
