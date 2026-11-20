## TUGAS AKTIF {{VER}} — KALIMAT BAWAAN (GSB) UNTUK SEMUA KARTU GRAMMAR
Konteks: proyek PWA Vortaro (folder vortaro/, kode di docs/js, tes di tests/). Lampirkan vortaro-pwa-<versi terbaru>.zip, ekstrak, jalankan semua tests/test_*.js (tidak boleh ada kata GAGAL). **Aku memakai Claude FREE PLAN**: kerjakan per batch kecil, JANGAN menjalankan banyak agen/subagen sekaligus (token tidak cukup), dan SETIAP SELESAI satu batch kirim zip + prompt lanjutan baru (PROMPT_LANJUTAN_<versi>.md, selalu memuat catatan free plan ini) SEBELUM token habis. Bila file belum selesai, kirim zip + prompt di bubble chat yang sama.

Tujuan: tiap kartu grammar punya 15 kalimat bawaan dengan sorotan konsisten (asing + Indonesia). Kartu dengan 15 kalimat bawaan tidak mengambil contoh dari Pustaka lagi (sudah diimplementasikan di gram.js: GSB, GSBN, gsbRows, gsbFull, gmCollect). Mesin, generator, tes SUDAH SELESAI; sisanya hanya MENULIS ISI.
URUTAN (keputusan pengguna): HSK 1–2 → Jerman A1–B1 → Jepang N5–N3 → Belanda A1–A2 → Esperanto A1–A2 → sisanya bebas. Kartu grammar PENGUCAPAN (nada, pinyin, huruf, lafal) dilewati, tidak dibuatkan kalimat.

### Progres (otomatis dari tools/gsb_release.py)
{{PROGRES}}
Kartu <15 kalimat:
{{PENDEK}}
Untuk Jerman/Jepang/dst: lihat isi kartu lewat `V.D.G.filter(g=>g[1]==L&&g[2]==lv)` (g[4] judul, g[5] penjelasan, g[7] contoh, g[10] tabel); `tools/gsb_next.py <bhs> "<level>"` juga bekerja untuk semua bahasa.

### ALUR HEMAT TOKEN (wajib; jangan menjalankan agen/subagen)
1. `python3 tools/gsb_next.py zh "HSK 1" 10` → daftar ringkas 10 kartu berikutnya (otomatis mulai dari kartu belum selesai). Jangan membaca ulang berkas sumber/zip/CHANGELOG.
2. Tulis SEMUA kalimat batch dengan SATU perintah `cat >> tools/gsb_src/<bhs>_<level>.txt <<'EOF' ...` (jangan Read/Edit berkas sumber besar).
3. `python3 tools/gsb_build.py zh | grep -E "!|gsb-"` → perbaiki hanya baris galat (pesan «kalimat ganda = baris N» menunjuk sumber duplikat). Perbaiki banyak baris sekaligus dengan satu skrip python (ganti per nomor baris).
4. zh: `python3 tools/gsb_lvl.py zh_HSK1.txt <baris_awal_batch>` → hanya kata di luar level; ganti bila tidak wajar.
5. Tutup batch dengan SATU perintah: `python3 tools/gsb_release.py "<ringkasan batch>"` (build, versi, CHANGELOG, semua tes, prompt baru, zip). Lalu SendUserFile zip + prompt dari /home/claude/out/ dan jawab SINGKAT (3–6 kalimat: kartu yang selesai, kartu <15, file).
6. Targetkan 10–12 kartu per batch bila token cukup; jangan membuat TaskCreate banyak, jangan narasi panjang, jangan memeriksa browser kecuali diminta.

### Pelajaran
{{PELAJARAN}}

### Aturan isi (dari prompt pengguna, berlaku untuk semua bahasa)
1. PRIORITAS TERTINGGI: kalimat NATURAL (benar-benar diucapkan penutur asli, kolokasi wajar, bukan terjemahan harfiah). Lebih baik < 15 kalimat natural daripada ada yang janggal; kartu boleh punya <15 (catat di CHANGELOG/prompt kartu mana).
2. Tiap kalimat memuat grammar kartu itu; berdiri sendiri (tanpa kata ganti merujuk kalimat lain); urut pendek → panjang; bervariasi (subjek, kosakata, situasi, jenis kalimat); tak ada dua kalimat hampir sama; panjang sedang (zh/ja ±8–35 aksara, lain ±6–20 kata; minimal 5 aksara zh agar lolos soal rumpang).
3. TINGKAT: kosakata & pola pembentuk kalimat memakai level KARTU itu sendiri: kartu B1 → pembentuk A1–B1; kartu HSK 1 → hanya HSK 1; kartu HSK 2 → HSK 1–2; dst. Jangan melebihi level kartu.
4. Kunci (potongan kolom 3) = bagian terpendek yang utuh, tepat SATU jawaban wajar, muncul TEPAT SEKALI di kalimat; pola terpisah ditulis `A … B`. Sorotan Indonesia (kolom 4) = salin persis dari kolom arti (huruf besar/kecil bebas), tulis arti dengan kata yang jelas menerjemahkan pola (mis. 是 → «adalah», 吗 → «Apakah»); `-` bila benar-benar tak ada padanan.
5. Arti Indonesia akurat dan natural; hindari kata «null/undefined/NaN».

### Format sumber (tools/gsb_src/<bhs>_<level>.txt, mis. zh_HSK1.txt)
`#<indeks kartu> judul` lalu 15 baris: `kalimat | arti Indonesia | kunci | sorotan Indonesia [| romaji untuk ja]`.
- zh: tulis dipisah spasi per kata (pinyin otomatis); nama diri/aksara tak dikenal → override `李{Lǐ} 明{Míng}`, `北京{Běijīng}`, `中国{Zhōngguó}`; tambah kata yang sering ke PIN_EXTRA di tools/gcl_build.py. Jangan memakai ？ di tengah kalimat; 儿 menyatu (这儿).
- Jalankan `python3 tools/gsb_build.py [bhs]` → menulis docs/js/gsb-<bhs>-<level>.js dan menyinkronkan <script> di docs/index.html + SHELL docs/sw.js. Galat (!) harus 0; peringatan (~) soal rumpang boleh (kalimat <5 aksara tak jadi soal rumpang tetapi tetap tampil sebagai contoh).
- Setelah menulis: `node tests/test_gsb.js`, `node tests/test_globals.js`, semua tes; bila bahasa/level baru, naikkan versi (docs/sw.js VERSION), tambahkan CHANGELOG, zip `vortaro-pwa-<versi>.zip`, tulis PROMPT_LANJUTAN baru, hapus PROMPT_LANJUTAN lama.
- ja: kolom 5 romaji (opsional tapi disarankan, は=wa を=o); de/nl/en/eo tanpa romanisasi. Bila gmHLS/gzpFind butuh bentuk terkonjugasi, kunci = bentuk persis di kalimat.
- Cek browser singkat (opsional): serve docs/ dengan `python3 -m http.server 8765`, evaluasi `gmCollect(k,true).length`, `gmExBlock(k)`, `gzpCands(GK[k]).length` (sudah dicek untuk #0: 15/15, tanpa pageerror).
- Belum dikerjakan/opsional: tampilan sorotan di tab Grammar (bukan kartu) tidak berubah; gsb-*.js akan membesar (≈15 KB per 10 kartu) — pecah per level sudah otomatis.

Catatan: prompt lama (Grammar Cloze, Kelas AI, dsb.) diarsipkan UTUH di arsip/PROMPT_LANJUTAN_7.105.2_ARSIP.md — jangan diedit/diperbarui; tidak perlu dibaca untuk tugas ini.
