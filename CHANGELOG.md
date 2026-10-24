# Riwayat Perubahan

## 6.1.0
- **Kelas AI: prompt “Sedang”** (tab baru di antara Panjang dan Pendek): hasilnya **teks bacaan berparagraf** (judul + paragraf utuh + terjemahan Indonesia per paragraf; Jepang ditambah romaji, Mandarin ditambah pinyin). Aturannya sama dengan prompt lain: topik utama ada di SETIAP kalimat, ditambah kosakata/grammar yang sering lupa atau sedang dipelajari dalam bahasa yang sama. Panjang bacaan bisa dipilih (3 / 4 / 6 paragraf), dan di akhir ada daftar pembentuk beserta paragraf tempat munculnya.
- Service worker 6.1.0.

## 6.0.0
**Kelas AI: dua jenis prompt** (pilih lewat tab di panel 🎓)
- **Prompt panjang**: seperti sebelumnya (tidak diubah).
- **Prompt pendek** (baru): hanya daftar contoh kalimat + arti. Jepang menambah **romaji**, Mandarin menambah **pinyin**. Topik utama (kartu yang kamu salin) wajib ada di setiap kalimat; pembentuk kalimat adalah kosakata/grammar lain dalam bahasa yang sama yang sering lupa atau sedang dipelajari. Tiap kalimat diberi baris “Pembentuk” untuk dicek.

**Belajar**
- Kini hanya dua bagian utama: **Kata** dan **Latihan kalimat**.
- **Bacaan** menjadi tombol “📖 Kumpulan bacaan Esperanto” yang harus ditekan untuk menampilkan daftar bacaan.

**Statistik**
- **Kartu matang** dan **kartu selesai** (sebelumnya “item selesai”) bisa diketuk untuk melihat daftarnya (filter per bahasa, urut interval, ketuk item untuk membuka).
- **Perkiraan tuntas** (baru): kapan semua kartu pada cakupan aktif (ikut Filter flashcard, atau semua bahasa & level) dikenalkan, matang, dan selesai. Memakai laju rata-rata sejak mulai, laju 14 hari terakhir, batas kartu baru harian, atau skenario “jika kartu baru/hari = N”; waktu matang tiap kartu disimulasikan dengan pengaturan SRS dan tingkat lupa dari riwayatmu. Ada rincian per bahasa dan penjelasan asumsi.
- Aplikasi kini mencatat kartu baru per hari per bahasa (`nw`, ikut cadangan progres) agar laju 14 hari terakhir akurat.

**Teknis**: service worker 6.0.0; kunci penyimpanan `vortaro_v1` tidak berubah.

## 5.1.0
**Kelas AI: aturan kalimat yang ketat.** Prompt kini memuat bagian “ATURAN WAJIB UNTUK SETIAP KALIMAT”:
- Salin **grammar X** → SETIAP kalimat (contoh, dialog, soal tes, kartu hafalan) wajib memuat grammar X, ditambah minimal 1 kosakata atau grammar lemah (sering lupa / masih dipelajari) dalam bahasa yang sama.
- Salin **kosakata X** → SETIAP kalimat wajib memuat kata X (boleh berubah bentuk), ditambah minimal 1 kosakata atau grammar lemah.
- Topik utama dan elemen tambahan ditandai berbeda (**tebal** / _garis bawah_), maksimal 3 elemen tambahan per kalimat, dan tiap contoh diberi baris label “Topik utama | Tambahan” agar mudah diperiksa.
- Service worker 5.1.0 (memaksa aplikasi terpasang memuat versi baru).

## 5.0.0
**Fitur baru: Kelas AI — salin prompt belajar komprehensif untuk ChatGPT / Claude / Gemini** (semua bahasa: Mandarin, Jepang, Jerman, Belanda, Esperanto).
- Tombol **🎓** di kartu grammar, setiap blok bahasa pada kartu kosakata, dan toolbar Flashcard (“Kelas AI”), plus kartu pintas **“Yang paling perlu diulang sekarang”** di tab Grammar.
- **Prompt grammar** (mis. 〜てください): peran guru + topik lengkap dari materi aplikasi (pola, rincian, catatan, kasus khusus, contoh, peta taksonomi: prioritas, register, nuansa, *sering tertukar*, prasyarat) → urutan mengajar 11 tahap (gambaran besar, rumus, kapan dipakai/jangan, jebakan penutur Indonesia, pembeda pola mirip, contoh kalimat berjenjang, dialog, mnemonik, tes ingat aktif, kartu hafalan, jadwal ulang).
- **Prompt kosakata**: inti kata, anatomi/asal-usul, kolokasi, keluarga kata & kata mirip, contoh kalimat, mini cerita, mnemonik, tes ingat aktif, kartu hafalan, jadwal ulang.
- **Contoh kalimat memakai kosakata lemahmu, tanpa peduli level, selalu dalam bahasa yang sama dengan kartunya.** Label yang dipakai: *sering lupa* (jumlah “Lagi” di Flashcard), *belajar ulang*, *salah di latihan kalimat*, lalu *masih belajar* / *sedang dipelajari* / *ulasan muda* bila tidak ada yang sering lupa. Kata sering lupa wajib muncul minimal 2×; campuran kata kerja/benda/sifat dijaga agar kalimat tetap natural. Grammar lemah dalam bahasa yang sama ikut disebut ringan.
- Bagian khusus per bahasa: pinyin & nada (Mandarin), kesopanan/partikel/bentuk kata kerja (Jepang), gender/kasus/posisi kata kerja (Jerman), de/het & V2 (Belanda), akhiran/afiks/korelatif (Esperanto), lengkap dengan teknik mnemonik yang cocok.
- Kalimat buatanmu yang sebelumnya belum tepat ikut dilampirkan agar AI menganalisis kebiasaan salahmu.
- Panel pratinjau: pilih gaya **Lengkap sekaligus** / **Interaktif bertahap**, jumlah contoh (6/10/15), jumlah kata lemah (5/8/12), ketuk kata untuk mengeluarkan, **Acak ulang**, edit prompt sebelum disalin, tombol Salin / ChatGPT / Claude / Gemini (menyalin otomatis lalu membuka) / Bagikan.

**Teknis**
- Berkas baru `js/ai-class.js`; service worker 5.0.0. Progres tetap aman (kunci `vortaro_v1` tidak berubah); preferensi Kelas AI disimpan di pengaturan yang sama.

## 4.0.0
Disinkronkan dengan `kosakata_flashcard_v4_8.html`. Semua fitur Vortaro (PWA, offline, pengingat, ntfy, statistik 3.0) dipertahankan; kunci penyimpanan `vortaro_v1` tidak berubah, jadi progres lama tetap aman.

**Bahasa baru: Belanda (NL)**
- **4.998 entri kosakata A1–B2** digabung ke kartu yang sudah ada: kata dengan arti sama berbagi kartu dengan Mandarin/Jepang/Jerman/Esperanto, ditambah 1.294 kartu baru khusus Belanda.
- Gender **de/het** (bisa disensor seperti der/die/das), **bentuk jamak**, **bentuk kata kerja** (hij/zij/het · verleden · voltooid), dan **komparatif** kata sifat; ketiganya punya pengaturan sensor sendiri di Atur → Sensor.
- **Grammar Belanda A1–C2 (380 topik)**: pelafalan, kata kerja & konjugasi, kata benda & artikel, kalimat, angka & waktu, dan seterusnya, dengan tabel konjugasi Ik/Jij/Hij/Wij/Jullie/Zij; 223 topik punya contoh kalimat sehingga bisa dipakai di Latihan kalimat.
- **Taksonomi grammar Belanda** (fungsi, prioritas, register, nuansa; gid `nl-a1-001` … `nl-c2-043`) dengan filter, rekomendasi berikutnya, dan peta grammar seperti bahasa lain.
- Suara **nl-NL**, filter level A1–B2 (kosakata) dan A1–C2 (grammar), Flashcard, Daftar, Latihan kalimat, dan Statistik ikut mendukung Belanda.

**Bacaan Esperanto**
- **61 teks bacaan** per pelajaran (A1–C2) di tab Belajar → **Bacaan**: terjemahan Indonesia per kalimat (bisa disensor), suara 🔊 per kalimat atau seluruh teks, penanda sudah dibaca, dan ringkasan di Statistik. Penanda ikut dalam cadangan progres.

**Dari seri v4 (sebelumnya belum ada di Vortaro)**
- Taksonomi grammar (fungsi, prioritas, register, nuansa) untuk Mandarin, Jepang, Jerman, Esperanto (dan Belanda), lengkap dengan filter prioritas/fungsi, rekomendasi grammar berikutnya, peta grammar, dan matriks fungsi × level.
- Edit keterangan (✎) untuk kosakata, grammar, dan flashcard, serta penyempurnaan Latihan kalimat dan Flashcard dari v4.2–v4.6.

**Teknis**
- Service worker 4.0.0. `data.js` kini memuat juga taksonomi dan teks bacaan (±4,5 MB), jadi pembukaan pertama setelah pembaruan sedikit lebih lama.

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
