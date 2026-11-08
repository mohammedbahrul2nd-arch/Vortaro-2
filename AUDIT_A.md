# AUDIT A — Inventaris fitur + audit gangguan visual (UI v8, tahap A, v7.52.0)

Cara baca: kolom "Tab" ditentukan dari fungsi render tempat `data-a` berada (diverifikasi lewat grep nomor baris).
Kolom "Arti" adalah DUGAAN dari nama aksi dan konteks; belum dibuka satu per satu di browser. Pakai tabel ini sebagai daftar periksa tahap F.
Tab (urutan nav): Games(gm) · Kartu(fc) · Grammar(gr) · Daftar(list) · Pustaka(lib) · Statistik(stats) · Atur(set).

## 1. Fitur -> di mana diakses

| Tab | Fungsi sumber | Aksi `data-a` | Arti (dugaan) |
|---|---|---|---|
| Navigasi | render() app.js:1141 | tab | pindah tab |
| Kartu | vrPromo (reminder.js) | (tombol pengingat, tanpa data-a) | aktifkan/tunda pengingat hafalan |
| Kartu | lkBar app.js:993-996 | fclkh, fclkm, fclkgo, fclkstop | Lock-in: jam +/-, menit +/-, Mulai, Berhenti |
| Kartu | fcFilt/fcDeckBar app.js:1346-1362 | fcdeck, fcpos | pilih deck (Kosakata/Grammar/Keduanya), posisi/filter |
| Kartu | fcHero/fcStreak app.js:1194-1203 | (hero, tanpa aksi) | ringkas target harian + streak |
| Kartu | fcView app.js:1007-1009 | fcshow, fcans, fcundo, fcsusp, libfind, edit, fcforget | tampilkan jawaban, nilai (1-4), urungkan, tunda/suspend, cari di Pustaka, edit kartu, lupakan |
| Kartu | fcDone app.js:981-987 | fcmore, fcmoreR, fcrstf, fcunsusp | tambah kartu baru / ulasan saat target selesai, reset, batal suspend |
| Kartu | say app.js:1190 | say | ucapkan (TTS) |
| Kartu/Grammar | gram.js | expl, expp, fcxdel | penjelasan/contoh, hapus kartu buatan |
| Games | games.js | ggans, gglv, gglvall, ggmore, ggnext, ggrst | jawab, level, semua level, lagi, lanjut, reset |
| Games | games2.js | ggxacc, ggxchk, ggxedit, ggxflag, ggxhome, ggxmv, ggxnext, ggxopen, ggxord0, ggxov, ggxov0, ggxpick, ggxrst, ggxtg | game generator: buka, pilih, cek, tandai, edit, urutan, timpa, reset |
| Grammar | gram() app.js:792-795 | gback, gprev, gnext, gtolv, glist, glv, groll, gopen, cyc, more | bahasa, level, daftar topik, berikut/sebelum, acak |
| Grammar | gNxt/gMap app.js:1065-1102 | gopen, ui, gmap, cyc | peta/taksonomi grammar |
| Daftar | list() app.js:801-805 | wclose, lreset, wtog, cyc, more | tutup/reset/ganti filter status, siklus status per bahasa, muat lagi |
| Daftar (global) | app.js:54-57 | cyc, fall, fl | siklus filter bahasa/status |
| Pustaka | pustaka.js | libadd, libai, libana, libanamore, libclr, libdel, libdet, libgm, libgo, libh, liblg, libmin, libmore, libmv, libpick, libplay, libr, libren, libsec, libsrt, libst, lchlg, lchmore, sldel, slh, slmore, slplay | tambah teks, Kelas AI, analisis, hapus, detail, pindah, ganti nama, urut, putar, kalimat tunggal |
| Statistik | kpiCard app.js:1260-1267 | kpi, kpilg, kpimore | KPI dapat dibuka (hari beruntun, ulasan, matang, selesai) |
| Statistik | stats() app.js:800 | stf | Kartu bandel / Perkiraan selesai / Proyeksi / Peta (bilah fitur) |
| Statistik | etaCard app.js:1298-1318 | etasc, etasn, etawi | Perkiraan selesai: cakupan, kartu baru/hari, jendela |
| Statistik | fcastCard app.js:1218-1249 | sday, slg, srng | Proyeksi beban: hari, bahasa, rentang |
| Statistik | heatCard app.js:1319-1324 | hday | Konsistensi belajar: detail per hari |
| Atur | set() app.js:809 -> fcSett | fcsyncall, fcunsusp, fcrst | sinkron semua, batal suspend semua, reset |
| Atur | uiCard app.js:1329-1337 | ui | tampilan: tema/mode |
| Atur | set() app.js:808 | miglg | migrasi bahasa riwayat |
| Atur | verCard/vrCard/vrAppCard/pcard | (belum diperiksa) | versi, pengingat, aplikasi, cadangan/impor/ekspor |
| Kartu (edit) | edBtn app.js:1369-1403 | edit, edall | edit satu kartu / terapkan semua suntingan |

Catatan: nama-nama di atas = 53 pemakaian `data-a` di app.js + gram.js + games*.js + pustaka.js. Fitur di luar `data-a` (pengingat, ekspor/impor, Kelas AI di ai-class.js) belum dipetakan terperinci -> lengkapi di awal tahap B/D.

## 2. Gangguan visual (screenshot 390px, terang + gelap, 7 tab, keadaan awal)

1. Kartu: empat blok menumpuk sebelum hero (Pengingat -> Lock-in -> tab Kosakata/Grammar/Keduanya -> Filter). Aksi utama (belajar) berada di bawah lipatan. [tahap B]
2. Kartu/Lock-in: tombol "+" menit jatuh ke baris kedua (layout patah di 390px); "Mulai" besar tapi ganda dengan hero. [tahap B]
3. Pengingat hafalan selalu tampil, tanpa cara melipat/ingat status. [tahap B]
4. Pengaturan: satu kartu "Pengaturan flashcard" terbuka dan sangat panjang; label panjang berdesakan dengan select (nilai terpotong "Flashcard kalimat r...", "Soal rumpang + fu..."); tidak ada kolom cari. [tahap D]
5. Statistik: heatmap "Konsistensi belajar" tampak kosong (kotak abu seragam) + satu kotak berbingkai kecil di kanan atas tanpa label jelas; tombol bilah fitur 2x2 tanpa penjelasan. [tahap D]
6. Daftar: tiap kartu memuat 5-6 chip status bahasa (ZH/JA/DE/EO/NL/EN "Belum") -> padat; header hanya kolom cari + "24024 kartu" kecil. [tahap D]
7. Daftar: ada glyph kosong di baris terjemahan (mis. "爱好 · 趣味 · [kosong]"). Kemungkinan font headless tidak punya glyph itu; BELUM dipastikan di HP. [tahap E]
8. Pustaka: teks penjelasan Reading panjang di atas dua tombol; empat kotak jenis padat. [tahap D]
9. Games: baik; hanya kartu terakhir tertutup nav saat scroll (perilaku normal, padding bawah belum diukur). [tahap E]
10. Mode gelap: kontras tampak memadai di semua tab keadaan awal.

## 3. Yang BELUM diuji
- Sentuhan nyata di HP (usap vs scroll), lebar 360/430px, keadaan dalam sesi belajar, onboarding, pengaturan yang terlipat/terbuka lebih dalam, ukuran font sistem besar, reduced-motion.
- Arti tiap aksi di tabel belum dicoba satu per satu.
