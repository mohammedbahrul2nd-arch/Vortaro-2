# Vortaro

Aplikasi flashcard kosakata (Mandarin, Jepang, Jerman, Esperanto) dengan jadwal ulasan SRS,
latihan kalimat, grammar, **pengingat hafalan**, dan bisa dipasang seperti aplikasi biasa (PWA) — gratis lewat GitHub Pages.

- Semua kode ada di folder [`docs/`](docs) (HTML + CSS + JS biasa, tanpa build).
- **Panduan lengkap dari nol: [TUTORIAL.md](TUTORIAL.md)**

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
  js/data.js            seluruh kosakata & grammar (±3 MB)
  js/app.js             logika aplikasi (flashcard, SRS, latihan, statistik)
  js/vr-core.js         inti pengingat (dipakai halaman & service worker)
  js/reminder.js        UI pengingat + tombol pasang aplikasi
  icons/                ikon aplikasi
.github/workflows/
  reminder-ntfy.yml     (opsional) pengingat harian andal lewat ntfy.sh
```
