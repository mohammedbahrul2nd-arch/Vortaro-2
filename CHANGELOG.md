## 7.78.0 — Kesiapan PWA untuk dibungkus jadi APK
- Manifest: tambah `id` dan `display_override`. `sw.js` SHELL: tambah ikon maskable & apple-touch. Game tidak diubah.
- Paket APK dipisah ke `vortaro-apk-kit` (repositori terpisah).

## 7.77.0  Audit akhir (item 7, bagian yang bisa dikerjakan di sandbox)
- **Uji baru `tests/test_backup_lama.js` (380 cek):** cadangan lama tanpa kunci `src/lv/spd/rep/hide/thr/self/weak`, entri `gx` kosong/sebagian, dan `gx` rusak (bukan objek) semuanya digabung dengan default oleh `GXO`; nilai lama dipertahankan; 32 game, id tidak ganda, keenam bahasa punya game, `GXLG` = 6 bahasa.
- Semua `tests/test_*.js` hijau (termasuk `test_globals`, 23 berkas). Tidak ada perubahan kode aplikasi selain `VERSION` di `sw.js`.
- Cek statis CSS: tidak ada lebar tetap di atas 360 px pada `.shd/.shbar/.vg*`; `viewport-fit=cover` terpasang.
- **Masih butuh perangkat Android nyata** (dipindah ke `PROMPT_10_apk.md`): tombol back, Lock-in, Campur, mikrofon tiap game (Shadowing, Esperanto via `it-IT`), tampilan 360-430 px terang/gelap.

## 7.76.0 — Game 4: Shadowing (shd_zh, shd_ja, shd_de, shd_nl, shd_en, shd_eo)
- **Game baru `shd_<lang>`** (`gamedata8.js`, dimuat setelah `games3.js`; mesin VG dipakai ulang): TTS memutar kalimat → pengguna menirukan (🎤 atau ⌨) → skor kemiripan 0–100, bilah skor, dan selisih berwarna (hijau cocok, merah terlewat/salah, kata tambahan yang terdengar). Latihan ulang bebas (🔁) tidak mengubah jadwal SRS.
- **Sumber kalimat**: contoh kartu (`D.C`), contoh tata bahasa (`D.G`), dan kalimat Pustaka pengguna (`S.sl`). Kalimat dengan angka/daftar kata/pecahan dibuang; terjemahan dalam kurung (zh/ja) dipisah. Kelas panjang: pendek / sedang / panjang. Filter level, sumber, "hanya kata kartu lemah".
- **Opsi**: kecepatan suara 1× / 0,7× (+ tombol 🐢 putar lambat), putar 1–3×, sembunyikan/tampilkan teks, ketat penilaian (70/80/90), penilaian otomatis atau **swa-nilai** (✓ Sudah sama / ↻ Perlu ulang). Esperanto otomatis memakai swa-nilai bila pengenal suara tidak tersedia/dimatikan; bila tersedia dinilai fonetik longgar (`srPhon`).
- **`speech.js`**: `srShNorm`, `srSim(target,terdengar,l)` (zh/ja: tingkat karakter, kana disamakan hiragana/katakana; lainnya: kata+karakter, ß=ss, apostrof diabaikan), `srDiff`, `srJudgeSim`.
- **`games3.js`** (kaitan kecil, game lain tidak berubah): `q.play/slow/htmlA/resHtml/self/showTxt`, `VG[g].extra/empty/noDir/modeLbl`, aksi `ggxvslow/ggxvself/ggxvagain`, TTS dihentikan sebelum mikrofon menyala.
- CSS `.shs/.shbar/.shd`. Uji `tests/test_shd.js` (~2.000 cek). `VERSION` 7.76.0.

## 7.75.0 — Tugas tambahan UI: area di bawah menu bawah tidak lagi menampilkan konten
- `ui.css`: `body::after` (fixed, z-index 49, di bawah menu) menutup celah antara menu melayang dan tepi layar + area aman sistem dengan latar `--bg` solid yang memudar halus ke atas; menu dibuat 94% opak. Nonaktif di layar ≥960px (menu di atas). `VERSION` 7.75.0.

## 7.74.0 — Game 3: Harga & satuan (px_zh, px_ja, px_de, px_nl, px_en, px_eo) + satuan ukur di Penggolong Mandarin
- **Game baru `px_<lang>`** (`gamedata7.js`, dimuat setelah `games3.js`; mesin suara VG dipakai ulang). Mode: harga bulat, harga dengan sen (zh: 块·毛·分, ja: ribuan & 万円), satuan ukur (kg, Pfund, Liter, Meter, km, mile, feet, inch, 斤, 公斤, 升, 米, 公里, キロ, グラム…), kasir (dengar total + uang bayar → kembalian), diskon & pajak (Rabatt, korting, 打折, 割引, 税込), jumlah belanja. Dua arah (dengar → jawab, lihat → ucapkan), suara atau ketik, SRS `S.gg['px|<lang>|<mode>|<arah>']`.
- **`speech.js`**: `srPrice(teks,l)` (hasil dalam seperseratus satuan utama), `srJudgePrice`, `srFmtPrice`. Menerima digit & simbol (€ $ £ ¥), kata (zwei Euro fünfzig, two fifty, twee vijftig, du eŭroj kvindek), 一块五 = 1,50, 三块二毛五 = 3,25, 円. Esperanto lewat `srPhonPick` bila pengenal jatuh ke it-IT.
- **Penggolong Mandarin (`zcl`) disempurnakan, bukan diduplikasi**: +11 soal satuan ukur & uang (斤, 公斤, 克, 升, 毫升, 米, 公里, 毛/角, 块/元) ditambahkan di AKHIR `ZCV` sehingga kunci SRS lama tetap; pengaturan zcl diberi tombol pintas ke `px_zh` (harga & suara). Semua opsi/SRS lama utuh.
- Jepang: `pxJaEq` membandingkan bacaan kana persis (にひゃくきゅうえん = 209円, bukan 290 menurut aturan lisan Mandarin).
- CSS `.pxl` (kartu kasir/diskon). Uji `tests/test_px.js` (~140.000 cek). `VERSION` 7.74.0.

## 7.73.0 — Tugas tambahan UI: dropdown tertutup, Lock-in, Daftar bertahap + Campur, tombol back
- **Semua dropdown tertutup di awal.** `app.js`: `DO` (status `<details data-d>`) kini kosong di awal (dulu `fs` terbuka) dan dikosongkan saat pindah tab. `ui.js`: `vrSess()` menyimpan buka/tutup hanya di memori selama layar yang sama (Alat belajar, grup Pengaturan/Statistik; tidak lagi di `S.o.u_fold`/`S.o.u_sg`), dikosongkan saat judul layar berubah; grup "Tampilan & Personalisasi" juga tertutup. `pustaka.js`: daftar tag gagal tidak lagi terbuka otomatis. Pengecualian sengaja: tabel grammar yang memuat baris sorotan.
- **Lock-in**: `back.js` — `beforeunload` bila Lock-in berjalan, peringatan saat tombol back ditekan di Kartu (Lanjut belajar / Hentikan Lock-in), dan toast saat kembali dari aplikasi lain (≥20 dtk) selagi Lock-in berjalan.
- **Daftar bertahap** (`daftar.js`, dipanggil dari `list()` dengan fallback ke daftar lama): pilih bahasa → pilih level (+ hitung kata/dikuasai) → daftar kosakata dengan pencarian, filter status, ketuk untuk membuka kartu detail/Pustaka. Pencarian global tetap ada di layar pilih bahasa. `ui.js` keadaan kosong hanya muncul di tahap daftar.
- **Campur** (`campur.js`, mandiri, hanya membaca `D.C`): satu baris per entri Indonesia (`c[2]`), semua bahasa yang punya entri itu dikumpulkan; level A1–C2 dengan kesetaraan HSK 1–5/6→A1–C1, HSK 7-9→C2, JLPT N5–N2→A1–B2 (konstanta `MAP`); chip untuk menyalakan/mematikan bahasa; baris terbuka memuat 🔊 dan "Buka kartu". State sendiri (`data-mx`), tidak disimpan.
- **Tombol back Android** (`back.js`): sentinel riwayat setelah sentuhan pertama; back menutup dialog → mundur satu langkah (Daftar, Grammar, Games, Statistik) → Kartu → di Kartu hanya toast. Tidak pernah menutup aplikasi.
- Berkas baru terdaftar di `index.html` dan `SHELL` `sw.js`. Uji: `tests/test_campur.js` (32 cek), `tests/ui_daftar_back.py` (Playwright), `test_tagfail.js` disesuaikan. `VERSION` 7.73.0.

## 7.72.0 — Penghitung Jepang (jcn), tahap 2: +48 penggolong (total 96), 6 kelompok baru
- `gamedata6.js`: kelompok baru **bg** (輪 株 束), **tl** (通 件 行 句 首 話), **ol** (試合 勝 敗 分け 点 打 発), **al** (挺 張 脚 面 基 錠 包 箱 袋 缶 瓶), **uk** (円 円玉 メートル キロ グラム リットル センチ ミリ トン 歩 畳 坪 割 パーセント), **lm** (位 級 段 号 ページ/頁 画 字). Chip filter kelompok dibuat otomatis.
- Bacaan khusus: 発/敗/歩/包 3 = ぱ (さんぱつ, さんぱい, さんぽ, さんぽう); 円 よえん・ななえん・きゅうえん; 畳 よじょう; 字 よじ; 箱/袋/瓶/束 ひと〜・ふた〜; キロ いっきろ・ろっきろ; パーセント baku tanpa sokuon (bentuk sokuon diperdebatkan).
- `tests/test_jcn.js`: nilai emas tahap 2, uji kanji/katakana (メートル, ページ/頁), jumlah kelompok (24.000+ cek). `VERSION` 7.72.0.
- Penggolong 度 (suhu) sudah tercakup oleh 度 dari tahap 1. Mode angka 11–99 ditunda.

## 7.71.0 — Game "Penghitung Jepang 助数詞" (jcn), tahap 1: 48 penggolong, 9 kelompok
- **Baru `docs/js/gamedata6.js`** (awalan global `jc`/`JC`): `JCC` (48 penggolong: 個 つ 人 回 度 番 倍 · 枚 本 · 冊 巻 部 · 台 機 両 隻 艘 · 匹 頭 羽 尾 · 軒 戸 棟 階 室 部屋 · 年 ヶ月 週間 日 時間 分 秒 歳 世紀 · 杯 膳 切れ 皿 粒 玉 房 丁 · 着 足 組 対), pembangkit bacaan `jcRd(c,n)` berbasis aturan perubahan bunyi (tipe R biasa, K/Q sokuon, H はひふへほ→ばぱ, F ふん/ぷん) + pengecualian `ov` (utama) / `al` (lazim) / `db` (diperdebatkan), `jcKan`, `jcIrr`, penilai `jcJudge`, tabel bacaan `jcTab`, `jcCells/jcMake`.
- 4 jenis soal: bacaan angka + penggolong (dengar → ketik 3本, lihat → ucapkan さんぼん), benda + jumlah (emoji × n), benda → penggolong, 何〜. Filter: hanya yang sering (N5–N3), hanya bacaan tak beraturan, per kelompok. SRS per penggolong × jenis × arah (`jc|id|mode|arah`).
- Penilaian: kana (katakana otomatis jadi hiragana), kanji/angka (`3本`, `三本`, `３本`, ヶ月/か月/カ月, 歳/才), alternatif lazim diterima, bacaan diperdebatkan ditandai. Mode ketik menolak jawaban kanji untuk soal bacaan (harus kana); hasil suara menerima kanji karena pengenal Jepang sering mengembalikan kanji. Benda yang sah dengan beberapa penggolong (りんご 個/つ) diterima semua.
- `games3.js`: `vgSubmit` kini meneruskan `how` ('voice'|'type') ke `q.judge(alts,how)`; entri hub `jcn` (kelompok Jepang). CSS `.jctab/.jcc/.jcem/.jcob/.jcex`. Uji baru `tests/test_jcn.js` (12.302 cek). `VERSION` 7.71.0.
- Sisa penggolong (bunga, tulisan, olahraga, alat, satuan ukur, lain-lain) menyusul di tahap 2.

## 7.70.0 — Game "Jam & tanggal" untuk 6 bahasa (dt_zh, dt_ja, dt_de, dt_nl, dt_en, dt_eo)
- **Baru `docs/js/gamedata5.js`** (awalan global `jt`/`JT`): pembuat bacaan jam `jtSay(h,m,l,'c'|'f')` (lisan 12 jam / resmi 24 jam: zh 两点/一刻/半/差一刻 + 凌晨…晚上, ja kana dengan ふん/ぷん & よじ/しちじ/くじ, de halb/Viertel, nl half/kwart, en past/to & "fourteen hundred", eo kaj duono/antaŭ), tanggal `jtDateSay` (ja ついたち…, de ordinal, nl bilangan pokok, en gaya AS/Inggris, eo la kvina de marto), jam analog SVG `jtClock`, kalender mini `jtCal`, penilai `jtJudgeT/D/Both`.
- 9 tingkat: jam penuh, jam + menit, kuartal & setengah, format 24 jam, tanggal, hari + tanggal, bulan, tanggal + tahun, jam & tanggal sekaligus; arah dengar → jawab dan lihat → ucapkan. Jawaban ketik: `14:30`, `5/3` (hari/bulan; en/zh/ja bulan/hari), `Do 5/3`.
- **games3.js**: hook baru `q.html` (tampil di arah B), `q.ansHtml` (tampil di hasil), `q.noBig`, `q.hn` (kata benda petunjuk), `q.ph` / `q.inm` (placeholder & inputmode). CSS `.vgclk*`, `.vgcal*`.
- **speech.js**: `srTime` en menerima "fourteen hundred (hours)".
- **Perbaikan uji**: `test_num.js` kadang gagal (acak) karena nomor telepon dinilai dengan teks bertanda "·"; kini memakai `q.say`.
- Uji baru `tests/test_dt.js` (±109.000 cek: 1440 menit × 6 bahasa × 2 gaya, tanggal 3 tahun × 12 bulan, tanpa false-positive, semua tingkat × arah, SRS, hub).

## 7.69.0 — Game "Menyebutkan nomor" untuk 6 bahasa (num_zh, num_ja, num_de, num_nl, num_en, num_eo)
- **Baru `docs/js/gamedata4.js`**: pembuat kata bilangan `vgW(n,l)` (zh 两/零, ja kanji + kana `jaK` dengan ubah bunyi, de einundzwanzig/eine Million, nl tweeëntwintig, en "and", eo), tahun `vgYear`, ordinal `vgOrd`, digit nomor telepon (zh 幺), desimal, pecahan, definisi `VG` dan pembuat soal `nuMake`. Sepuluh tingkat: 0–20, 21–100, ratusan, ribuan, puluh ribu–juta, telepon, tahun, desimal, pecahan, ordinal; tiap tingkat punya tips khusus bahasa.
- **Baru `docs/js/games3.js`**: mesin tampilan bersama untuk game suara (`vgView`, `vgAct`, `vgSubmit`): dua arah (dengar → angka, lihat angka → ucapkan), 🎤 Ucapkan / ⌨ Ketik jawaban, otomatis mode ketik bila `!srSupported()`, konfirmasi sebelum kirim bila "Kirim otomatis" mati, tombol "Tidak tahu", teks sebagai cadangan bila suara bahasa itu tidak terpasang (mis. Esperanto), SRS per tingkat × arah di `S.gg['nu|<bahasa>|<tingkat>|<arah>']`.
- **speech.js**: `srNum` kini membaca desimal berkata (drei Komma eins vier, three point one four, tri komo unu kvar).
- **Jepang**: penilai tambahan `jaStrict` agar 百一 = 101 (bukan 110) saat jawaban berupa kanji.
- **Hub**: kelompok Jepang & Esperanto ditambahkan ke `GXLG`.
- Uji baru `tests/test_num.js` (18.283 cek: putar-balik 6 bahasa × 80 angka, kasus kunci, semua tingkat × arah × bahasa, SRS, hub). `load.js` memuat speech.js, gamedata4.js, games3.js.
- Berkas: gamedata4.js, games3.js, games2.js, speech.js, index.html, sw.js, app.css.

## 7.68.0 — Modul suara bersama (`speech.js`) untuk game suara & hitung
- **Baru `docs/js/speech.js`**: `srStart` membungkus SpeechRecognition (5 alternatif, tanpa interim), pesan galat Indonesia (izin ditolak, tidak ada suara, jaringan, mikrofon), cadangan Esperanto `eo` → `it-IT` (atau `es-ES`) lewat `S.o.srEo` (auto|it|es|off).
- **Normalisasi murni** (tanpa DOM): `srNum` (digit atau kata, zh/ja/de/nl/en/eo, termasuk 两, 一万二, kana Jepang, einundzwanzig, eenentwintig, twenty twenty six, du mil dudek ses), `srDigits` (nomor telepon), `srTime` (halb/half, Viertel/kwart, nach/vor, 24j/12j, 一刻, 分前, kaj duono), `srDate` (bacaan khusus tanggal Jepang, ordinal de/nl/en/eo, hari & bulan, tahun), `srOrd`.
- **Fonetik longgar** `srPhon/srPhonEq/srPhonPick` (Levenshtein ≤1 untuk kata ≤4 huruf, ≤2 lainnya) dan penilai `srJudgeNum/Time/Date` yang mencoba semua alternatif.
- **Pengaturan suara** di hub Games (🎤 Suara): uji mikrofon per bahasa, pilihan Esperanto, kirim otomatis.
- Uji baru `tests/test_speech_norm.js` (626 kasus). Berkas: speech.js, games2.js, index.html, sw.js.

## 7.67.0 — Penyebut harian stabil, judul depan per entri, sorotan terjemahan benar, highlight kartu grammar
Temuan dari tujuh tangkapan layar (Kartu, Keduanya) dan akar masalahnya:
- **"X dari Y kartu hari ini" terus membesar** (237 -> 256 -> 264 saat belajar). Y dihitung `ulasan + sisa`, padahal ulasan = jumlah TEKAN tombol; tiap "Lagi" atau langkah belajar menambah ulasan tanpa mengurangi sisa. Kini target = kartu UNIK: `tuntas` (kartu yang hari ini sudah berstatus ulas, disimpan di `S.o.hd`, reset tiap hari, ikut Urungkan) + `sisa` (semua kartu belajar + baru + ulas yang menunggu). Selama kartu hanya berpindah (baru -> belajar -> tuntas; ulas -> lupa -> belajar -> tuntas) jumlahnya konstan. Uji: `test_v767`.
- **Judul depan salah untuk entri tertentu**: judul bersama kartu (`c[2]`) mengikuti satu bahasa, mis. "Bekerja (paruh waktu)" (dari 打工) tampil juga untuk wirken & 勤める; "Ingin / Berpikir / Merindukan" (dari 想) untuk would like. Kini `fcMean(k)` memilih judul per entri secara konservatif: (A) petunjuk "BUKAN x: ..." dipakai; (B) bahasa dengan >=2 entri memakai petunjuk entri bila berkepala kata judul ("Ingin (sopan)"); (C) kurung akhir dibuang bila hanya didukung entri lain. Dipakai di sisi depan, sisi belakang, dan soal rumpang Pustaka.
- **Sorotan terjemahan meleset** (Die Ansage ... verstanden -> "Pengumuman" tersorot): `gmGloss` menggabungkan arti kartu dengan petunjuk entri ("Mengerti, umum") setara, sehingga kata gaya "umum" cocok dengan "Pengumuman" lewat pemotongan imbuhan. Kini format `arti ‖ petunjuk`: petunjuk hanya cocok PERSIS dan kata gaya (umum, sopan, santai, formal...) dibuang. Kalimat yang tidak cocok jatuh ke kartu biasa (tanpa sorotan salah).
- **Kartu grammar kini punya highlight terjemahan** (depan & belakang, Pustaka dan contoh bawaan, semua bahasa): arti pola singkat (`g[5]`, mis. "Berpusat pada") dicari di terjemahan dengan pencocok yang sama dengan kosakata. Arti panjang (penjelasan Jerman/Inggris/Belanda) tidak disorot agar tidak salah.
- **"Ketuk untuk melihat jawaban" menimpa teks** di bawah soal (absolute di dasar kartu): kini ada ruang bawah 46px.
- Bukan bug: baris bentuk kata kerja yang kabur adalah pengaturan "Sensor (blur)" (ketuk untuk membuka).
Berkas: app.js, gram.js, ui.css, sw.js. Uji baru: tests/test_v767.js.

## 7.66.0 — Kelas AI: label entri benar
- **Bug**: kandidat Kelas AI sudah per entri sejak 7.60, tetapi chip "Kartu prioritas/Kartu baru", judul prompt, dan baris Kelas AI di beranda selalu menampilkan kata PERTAMA kartu. Entri ke-2 `sich vergnügen` (kartu spielen) tampil sebagai "spielen = Bermain… · 0 terverifikasi" dan tampak seperti spielen sendiri, sementara spielen asli juga muncul ("· 3 terverifikasi").
- **Perbaikan**: helper `aiEntE/aiEntW` mengambil kata dari indeks `~N` kunci; dipakai di chip prioritas/baru, `aiTitle`, `aiHub`, dan baris "Kata:" prompt kartu tunggal (`aiBuildV`, kini hanya kata entri itu). Uji baru `test_aientlabel`.
- **Audit semua kasus serupa** (kunci `~N` tapi data entri ke-1): `aiPoolV`/`aiPoolM` (kosakata lemah & mahir) sebelumnya MEMBUANG entri ke-2 dst. sama sekali; kini per entri (`E:1`, kata & baris prompt entri itu). Juga diperbaiki: chip kata lemah/mahir, level entri (`aiLvOf`), daftar contoh & kata utama prompt kartu tunggal (hanya entri itu), judul KPI (`kpiItems`), `libLbl` & `lchItems` (daftar kartu sulit), serta glos `gmGloss` (hanya contoh entri itu).

## 7.65.0 — Verifikasi kata benda: jumlah tidak dipersoalkan
- Cek "tunggal asing vs jamak berulang" (7.62–7.64) dihapus: friend~teman, friend~teman-teman, friends~teman, friends~teman-teman semuanya lolos terverifikasi. Syarat lain tetap (kata asing token utuh, arti Indonesia persis, Jerman berhuruf kapital, zh/ja tak bagian kata lebih panjang). Uji ditambah untuk keempat kombinasi.

## 7.64.0 — Verifikasi kata benda: jamak dari database + batas spasi
- Pengecekan jumlah memakai bentuk jamak dari database (DX.n Jerman 3.849/5.178 kata benda, DXN.n Belanda 3.953/4.940, DXE.n Inggris 5.459/5.553): bila terjemahan Indonesia hanya jamak berulang ("anjing-anjing"), kata asing harus benar-benar bentuk jamak menurut database; tanpa data jamak dipakai bentuk dasar (kata tunggal ditolak).
- Batas spasi: kata asing (de/nl/en/eo) yang cocok harus satu token utuh (batas spasi/tanda baca). Mandarin/Jepang: bila kalimat memuat spasi di sekitar kata, spasi/tanda baca dianggap batas kata (melewati cek leksikon).

## 7.63.0 — Kata benda otomatis terverifikasi: semua bahasa
- Aturan 7.62 diperluas ke zh, ja, eo (selain de/nl/en). Mandarin/Jepang: kata tak boleh bagian dari kata lebih panjang yang ada di leksikon kartu (书 di 书店), kana pendek ditolak. Salah jumlah ditolak: kata asing tunggal + terjemahan hanya berulang ("anjing-anjing") tetap "terdeteksi otomatis". Terjemahan jamak berulang untuk kata asing jamak/tak berjumlah diterima.
- Uji tambahan di `test_entrymatch` (tunggal vs jamak berulang, zh tanpa jamak, arti tak cocok).

## 7.62.0 — Kata benda otomatis terverifikasi
- Kartu kosakata kelas kata benda (de/nl/en): kalimat Pustaka otomatis **terverifikasi** (✓, bobot soal 3×, dihitung sebagai contoh di Kelas AI) tanpa tag AI bila (1) bentuk asing terdeteksi, termasuk jamak/infleksi (Jerman wajib huruf kapital = nomina), dan (2) terjemahan Indonesia memuat arti kartu **persis**, termasuk jamak berulang (rumah-rumah) dan akhiran -nya/-ku/-mu/-lah/-kah. Kecocokan akar longgar (menulis~penulis) tidak cukup, jadi tetap "terdeteksi otomatis".
- Label contoh: "N terverifikasi (bertag AI / kata benda cocok persis)". Hitungan Kelas AI per entri ikut menghitung kalimat ini (hanya untuk kartu yang sudah punya kalimat terdeteksi, agar cepat).
- Uji: `test_entrymatch` (jamak, -ku, arti tak cocok), `test_verified` disesuaikan.

## 7.61.0 — Flashcard: tanpa usap, 4 tombol dengan jadwal tampil lagi
- Gestur usap 4 arah dihapus (ui.js, CSS petunjuk panah, `touch-action:none`); kartu dibalik dengan ketukan.
- Tombol Lagi/Sulit/Baik/Mudah selalu tampil (opsi "Tampilkan tombol jawaban" dihapus); di bawah label tertulis kapan kartu muncul lagi.
- `fcFmt/fcFmtD` memakai kata penuh (menit, jam, hari, bulan, tahun; desimal koma). Berlaku juga di teks lain yang memakai fungsi ini (estimasi, game).
- Teks onboarding disesuaikan.

## 7.60.0 — Kelas AI Pustaka per ENTRI
- **Bug**: pengumpul kartu Kelas AI bekerja di level arti (kunci tanpa `~N`): entri ke-2 dst. (mis. 吊るす, 听见) tak pernah jadi kandidat sendiri, dianggap "sudah punya contoh" bila saudaranya (掛ける, 听) punya, dan baris kata di prompt hanya memuat 2 entri pertama sehingga AI tak pernah diminta memakai entri lain.
- **Perbaikan**: `aiCovCands` kini per entri (kandidat studi, kartu baru, dan kartu tampil memakai kunci entri; entri berkata sama dibuang duplikatnya), `aiCoverage` menghitung contoh per entri (`gmVerNE` = tag AI yang `n`-nya = kata entri, `libCountKey(…,true)`), `aiLvCount` menghitung entri, `aiPins/aiFcMark` memakai kunci entri, dan `aiWordLine` menampilkan kata entri itu saja (flag `E`). Kolam kata lemah/pembentuk tetap level kartu.
- Tes `test_aicands`/`test_lvcount` disesuaikan ke semantik per-entri.

## 7.59.0 — UI v8 tahap D4 (Pustaka)
Header Pustaka dirapikan: tombol "Tambah teks/kalimat" tidak lagi terpecah 3 baris menjadi bentuk lonjong (kini satu baris sejajar Kelas AI, teks lengkap di aria-label/title); paragraf penjelasan panjang dilipat di bawah ringkasan satu baris ("4 teks · 1 dibaca"). Tiga baris chip (bahasa, status, urutan) dipadatkan: label status dipendekkan (Semua/Belum/Sudah, nama lengkap di aria-label/title; "Cocok untuk kartu lemahku" -> "Kartu lemah"), jumlah pada chip aktif terbaca lagi. Perbaikan kontras: label tombol utama di kartu teks (Baca, Putar, Tutup bacaan) tadinya hampir tak terbaca di atas ungu (`.fct button` menimpa warna `.pri`). Rincian teks: tombol Judul/Pindah/Hapus sebaris (tadinya tiga baris penuh), teks bacaan sedikit lebih kecil agar teks panjang lebih ringkas, badge status tidak membungkus. Hanya ui.js + ui.css; app.js dan pustaka.js tidak diubah.

## 7.58.0 — UI v8 tahap D3 (Daftar)
Header Daftar jadi satu baris: kolom cari + pilihan status ringkas ("Semua" bukan "Semua status"; placeholder dipendekkan), tetap menempel di atas saat menggulir (sticky bawaan). Chip status per kartu dipadatkan dari "ZH · Belum" (5-6 chip, 2-3 baris) menjadi kode bahasa + penanda ○ belum / ◐ sedang / ● selesai: enam chip muat satu baris di 360-430px, tinggi ketuk 40px, aria-label/title tetap memuat nama bahasa + status lengkap, warna status tetap. Legenda penanda di bawah hitungan kartu. Keadaan kosong: bila pencarian/filter tak menemukan kartu, tampil kartu "Tidak ada kartu yang cocok" + tombol Reset pencarian. Kartu jadi lebih pendek (±120-165px, tadinya ±130-190px). Hanya ui.js + ui.css; app.js tidak diubah.

## 7.57.2 — UI v8 tahap D1b (sisa Pengaturan)
Kartu "Versi & pembaruan": menampilkan "Isi & fitur vX · Tampilan vY" (Y dibaca dari sw.js) agar angka v7.40.0 (GM_VER di gram.js, ikut metadata ekspor) tidak tampak basi; catatan rilis diringkas ke 3 butir terbaru + tombol "Lihat semua" (lipatan tadinya ±3300px). Kolom "Impor cadangan" tidak lagi melebar keluar kartu di 360px (tadinya halaman bisa digeser menyamping). Semua grup Pengaturan sudah dibuka satu per satu di 360/390/430px terang+gelap: tanpa overflow, tanpa error JS. Ekspor/impor u_* diuji sungguhan lintas konteks: semua u_* pulih dan atribut data-vr-* langsung terpasang (impor menanyakan konfirmasi "Terapkan pengaturan dari berkas?"). Hanya ui.js + ui.css.

## 7.57.1 — UI v8 tahap D2b (sisa Statistik)
Bagian bawah Statistik (Kosakata per bahasa, Kosakata per jenis kata, Ringkasan grammar) jadi kelompok lipat berikon, tertutup secara default, status diingat di S.o.u_sg (kunci st_lang, st_pos, st_gram). Dua tombol KPI yang bisa diketuk (kartu matang, kartu selesai) diberi bingkai beraksen agar beda dari kotak biasa. Area ketuk kotak heatmap diperluas 2px ke tiap sisi lewat ::after (tampilan sama). Hanya ui.js + ui.css.

## 7.57.0 — UI v8 tahap D2 (Statistik)
Heatmap "Konsistensi belajar" kini berlabel: nama bulan di atas dan Sen/Rab/Jum di kiri; saat belum ada aktivitas muncul keterangan (bukan hanya kotak kosong), selain itu ada petunjuk "ketuk kotak". Border kotak kosong dilembutkan. Empat tombol 2x2 (Kartu bandel, Perkiraan selesai, Proyeksi beban, Peta grammar) diberi judul bagian "Alat analisis" dan satu baris penjelasan per tombol. Hanya ui.js + ui.css (dekorasi DOM lewat MutationObserver, idempoten); app.js tidak diubah.

## 7.56.0 — UI v8 tahap D1 (Pengaturan)
Tab Atur: setiap kartu jadi kelompok lipat berikon (status diingat di S.o.u_sg; hanya Tampilan & Personalisasi terbuka secara default), kolom "Cari pengaturan" (membuka kelompok yang cocok, memulihkan status saat dikosongkan), select di Pengaturan flashcard selebar kartu (label tidak lagi berdesakan). Perbaikan: kartu Personalisasi tidak lagi ganda saat dibungkus. Semua kontrol tetap ada di dalam kelompoknya.

## 7.55.0 — UI v8 tahap C2 (perapian sisa tahap C)
Baris tombol di bawah kartu tidak lagi terpotong (.fct). Status lipatan "Alat belajar" pindah dari localStorage ke S.o.u_fold (ikut cadangan; localStorage lama dibaca sebagai cadangan awal). Pencatatan pemakaian lokal S.o.u_use (kunjungan tab, bahasa kartu yang dinilai) dan jalan pintas "paling sering dipakai" (maks 2 tab, muncul setelah dipakai >=2 kali) di layar Kartu. Impor cadangan membawa u_* lewat Object.assign(S.o,d.o) (dibaca dari kode gram.js, belum dicoba).

## 7.54.0 — UI v8 tahap C
Kartu "Tampilan & Personalisasi" di tab Atur (ui.js): nama panggilan (sapaan di Kartu), mode Sederhana/Lengkap (Sederhana: tombol tambahan jadi "Lainnya", Filter masuk "Alat belajar", hitungan Baru/Belajar/Ulas disembunyikan), kepadatan Nyaman/Padat, target kartu baru per hari (mengubah S.o.nl yang sama dengan Pengaturan flashcard), jam belajar favorit, tampilkan tombol jawaban, getar/suara/animasi satu per satu. Kunci baru S.o.u_nm/u_hr/u_md/u_dn/u_ab/u_an (tambahan, tanpa ubah struktur lama; ikut cadangan karena S disimpan utuh). Atribut data-vr-dn/md/ab/an pada <html>. Patch app.js 1 baris: confetti() berhenti bila animasi dimatikan.

## 7.53.0 — UI v8 tahap B
Layar Kartu: Lock-in dan Pengingat hafalan dipindah ke lipatan "Alat belajar" di bawah kartu (status buka/tutup diingat di localStorage kunci vr_ui_fold_tools); Lock-in berjalan tetap tampil di atas. Lock-in dirapikan (stepper jam/menit, target sentuh 44px, tombol "Mulai Lock-in"). Semua aksi data-a tetap di DOM. Hanya ui.js + ui.css; app.js tidak diubah.

## 7.52.0 — UI v8 tahap A
Inventaris fitur (data-a -> tab) dan audit gangguan visual 390px terang+gelap, ditulis di AUDIT_A.md. Tanpa perubahan kode selain versi.

## 7.51.0 — UI v8 tahap 11
Usap 4 arah: atas=Mudah, kanan=Baik, kiri=Sulit, bawah=Lagi. Tombol jawaban/Tampilkan jawaban disembunyikan visual (tetap di DOM untuk keyboard/aksesibilitas). Pil label arah+interval saat menggeser. touch-action:none pada kartu.

## 7.50.0 — UI v8 tahap 10
Audit bentrok kelas ui.css vs app.css (bersih), uji layar Kelas AI. Tanpa perubahan kode selain versi.

## 7.49.0 — UI v8 tahap 9
Perbaikan bentrok nama kelas onboarding (.onb milik app.css) -> .vrob; build_single.py kini menyertakan ui.css, ui.js, skeleton; HTML tunggal untuk review.

## 7.48.0 — UI v8 tahap 8
Skeleton loading (shimmer) di index.html saat muat pertama; otomatis hilang saat app.js merender. Uji headless lolos.

## 7.47.0 — UI v8 tahap 7
Uji headless: layar dalam game (terang/gelap), lebar 360/390/430, gestur geser kartu terbukti (atas = balik, kanan = Baik). Tanpa perubahan kode.

## 7.46.0 — UI v8 tahap 6
Kontras tombol/hero mode gelap, KPI rata tinggi, uji headless gelap + sisi jawaban kartu + layar Games.

## 7.45.0 — UI v8 tahap 5
Hero Games kontras (gradien aksen + teks putih), teks tebal inline di layar kosong, uji visual Games/Grammar/Daftar/Pustaka.

## 7.44.0 — UI v8 tahap 4
Uji visual 390px terang/gelap, nav 6-7 tab muat, onboarding menempel ke bawah, select lebih rapi.

## 7.43.0 — UI v8 tahap 3
Gestur geser kartu (kiri Lagi, kanan Baik, atas Mudah/balik), tombol jawaban berwarna, onboarding sekali tampil, kartu Games/Pustaka membulat.

## 7.42.0 — UI v8 tahap 2
Flip-in kartu, garis aksen, petunjuk ketuk, dock tombol jawaban, hero/KPI lebih tegas.

## 7.41.0 — UI v8 (css/ui.css + js/ui.js)
Tampilan ala Play Store: nav melayang, kartu/tombol membulat, hero gradien, ripple, animasi masuk. Logika tidak diubah.

# Riwayat Perubahan

## 7.40.0 — Minggu, 8 Nov 2026 (perbaikan: soal/contoh Pustaka sesuai ENTRI kartu)

- **Bug**: kartu kosakata di SRS = satu entri (kunci `…~N`), tetapi pencocokan kalimat Pustaka menggabungkan semua entri satu arti dan tag AI hanya dicek ke kunci arti. Akibatnya kartu 吊るす memanggil kalimat 掛けました, 听见 memanggil 我重新听音乐, afhalen memanggil nemen, 畳む memanggil 折って, sich vergnügen memanggil spielen (artinya sama, kata beda).
- **Perbaikan (mode per-entri, `E`)**: `libForms/libCountKey/libHL(…,E)` hanya memakai entri kartu itu; `gmCollect(key,E)` (dipakai `gzvCands` dan `gmExamples`) menolak tag AI yang `n`-nya = entri saudara (`gmTagEnt`), dan untuk zh/ja membuang kemunculan di dalam entri saudara yang lebih panjang (听 ⊂ 听见, 吊る ⊂ 吊るす; `gmSupSib/gmStripSib`). Tanpa kalimat yang cocok → kartu tampil biasa (tanpa soal rumpang) dan daftar contoh kosong. Kelas AI / hitungan level-kartu tidak berubah.
- **Grammar preposisi Jerman**: Wechselpräposition (an/auf/hinter/in/neben/über/unter/vor/zwischen) kini memeriksa kasus dari artikel setelahnya (`gmPrepLv`): kartu “In (Akkusativ)” tak lagi memanggil “wohnen in einem Dorf” (Dativ); tanpa penentu kasus → perkiraan (lv 1).
- Uji baru `test_entrymatch.js` (data sintetis + opsional pustaka nyata).

## 7.39.0 — Minggu, 8 Nov 2026 (tahap 5D: +30 verba untrennbar, soal prefiks campur)

- **Untrennbare Verben (DTU): 49 → 79 verba**, tiap verba 4 kalimat (total kalimat 1066). Baru: begrüßen, begleiten, bemerken, beobachten, berichten, beweisen, beenden, entlassen, entkommen, enttäuschen, erhalten, erwähnen, erledigen, ersetzen, erhöhen, erlernen, genießen, gestehen, geschehen, misslingen, misstrauen, verbessern, verbieten, vergleichen, verlassen, verpassen, verschieben, verschwinden, versuchen, zerschneiden.
- **Soal "Pilih prefiks" kini campur trennbar + untrennbar** (kunci SRS `dv|pf|…` tidak berubah; sel untrennbar baru ikut jadi sel baru). Trennbar: rumpang di akhir klausa; untrennbar: rumpang di awal kata verba (`[___]komme`), opsi berhuruf kapital bila di awal kalimat. Label kartu netral (“Verba Jerman · pilih prefiks”) agar jenisnya tak terbaca dari label.
- **Penanda prefiks `{…}` juga di semua kalimat DTU** (otomatis untuk 49 verba lama, tanpa ambigu) → tak ada tebakan posisi (mis. “Berlin” bukan prefiks be-).
- **Anti-konflik (pengecoh tak boleh jadi jawaban benar kedua):**
  1. Pengecoh tidak membentuk verba di data (T maupun U) dengan stem yang sama.
  2. `DTA`: prefiks yang bisa trennbar sekaligus untrennbar (um-, durch-, über-, unter-, hinter-, wider-, wieder-, voll-) tak pernah jadi pengecoh (mis. *umfährt* valid).
  3. `DTR`: tabel prefiks untrennbar yang membentuk kata nyata per stem (stellen: be/ent/er/ver; stehen: be/ent/er/ge/ver, dst.). Pengecoh untrennbar hanya dari luar tabel; stem tak terdaftar → tanpa pengecoh untrennbar.
  4. Pengecoh trennbar pada soal untrennbar aman karena prefiks trennbar tak pernah menempel di klausa utama; diuji dengan syarat semua kalimat DTU bukan anak kalimat (tanpa dass/weil/wenn/ob/…).
  5. `DTX`: stem sangat produktif (kommen, gehen, fahren, nehmen, geben, machen, stellen, sehen, setzen, ziehen) → prefiks yang membentuk verba nyata dilarang sebagai pengecoh; `DTG`: keluarga arah her/hin/heraus/hinaus/herein/herunter/hinzu/hoch tak saling jadi pengecoh. (Menutup konflik lama: *herkommen* vs *hin*/*heraus*.)
- Uji: `test_dtv.js` (U ≥ 79, total ≥ 1060; cek penanda, anak kalimat, DTR/DTX konsisten dengan data, 6 opsi unik untuk semua verba, campuran T/U di soal prefiks). `load.js` mengekspor DTR/DTA/DTUP/DTX/DTG. Semua `tests/test_*.js` lolos.

## 7.38.0 — Minggu, 8 Nov 2026 (tahap 5C: 30 verba trennbar baru)

- **Trennbare Verben (DTV): 120 → 150 verba trennbar**, tiap verba baru dengan 5 kalimat Präsens + terjemahan Indonesia (total 946 kalimat). Verba baru: abbiegen, abschließen, anklicken, anprobieren, aufbauen, aufessen, auffallen, aufwecken, ausdrucken, ausprobieren, auswandern, einfallen, eintreffen, mitfahren, nachgeben, nachmachen, vorbestellen, vorwerfen, vorbeifahren, weglaufen, wegnehmen, weglassen, weiterarbeiten, weiterempfehlen, zurückbringen, zusammenfassen, zusammenkommen, hinzufügen, losfahren, kennenlernen. Hindari prefiks über-/unter-/um-/durch-/wieder-/wider-.
- Aux `ist` untuk verba gerak/perubahan keadaan (abbiegen, auffallen, auswandern, einfallen, eintreffen, mitfahren, vorbeifahren, weglaufen, zusammenkommen, losfahren); partisip tanpa -ge- untuk batang tak-bertekanan (vorbestellt, weiterempfohlen, anprobiert, ausprobiert); prefiks panjang (hinzu-, vorbei-, zusammen-, kennen-, zurück-) tetap bekerja di soal rumpang.
- Uji: `test_dtv.js` menaikkan ambang (T ≥ 150, U ≥ 49, total ≥ 940) dan menerima partisip tanpa -ge- untuk batang berakhiran -ieren. Semua `tests/test_*.js` lolos, `node --check` semua JS lolos.

## 7.37.0 — Minggu, 8 Nov 2026 (tahap 5B: kalimat Trennbare/Untrennbare Verben)

- **Trennbare Verben (DTV): 5 kalimat per verba** (sebelumnya 3) dan **Untrennbare (DTU): 4 kalimat per verba** (sebelumnya 2). Pasangan kalimat + terjemahan ditambahkan di akhir tiap baris (gamedata3.js); `dtAll` membacanya otomatis. Total 796 kalimat. Hanya Präsens, prefiks trennbar di akhir klausa, tanpa modalverb/zu-Infinitiv/Perfekt; ada pertanyaan, perintah, subjek berbeda.
- Uji: `test_dtv.js` menaikkan ambang (T ≥ 5, U ≥ 4, total ≥ 790) dan menambah cek semua kalimat unik. Semua `tests/test_*.js` lolos.

## 7.36.0 — Minggu, 8 Nov 2026 (tahap 5A: 5 kalimat per Phrasal Verb)

- **Phrasal Verbs Inggris: 5 kalimat per verba** (sebelumnya 3). Tiap baris `PHX` (gamedata2.js) menerima 1 pasangan kalimat + terjemahan tambahan di akhir baris (total 178 verba × 5 = 890 kalimat). Kalimat baru bervariasi: lampau, pertanyaan, perintah, negatif, subjek berbeda; satu `{partikel}` per kalimat; tidak ada kalimat ganda lintas verba.
- Uji: `test_phv.js` menaikkan ambang (≥5 kalimat/verba, total ≥850). Semua `tests/test_*.js` lolos, `node --check` semua JS lolos.
- Berikutnya: tahap B (Trennbare/Untrennbare Verben: 5 / 4 kalimat), lalu C (verba trennbar baru).

## 7.35.0 — Senin, 9 Nov 2026 (tahap 4: kalimat lebih banyak + game Trennbare Verben Jerman)

- **Phrasal Verbs Inggris: 3 kalimat per verba.** `PHX` (gamedata2.js) menambah 2 kalimat + terjemahan untuk tiap `PHV`; `phAll` menggabungkannya ke `x.ss`; `phMake` memilih satu kalimat acak per soal (jadwal SRS tetap per verba+mode). `phFull/phBlank` kini menerima objek kalimat `{s,tr}`.
- **Game baru `dtv` — Trennbare Verben Jerman** (`lg:'de'`). Data di berkas baru `docs/js/gamedata3.js`: `DTV` (120 verba trennbar: prefiks, arti, Perfekt, zu-Infinitiv, 3 kalimat Präsens terpisah dengan terjemahan) dan `DTU` (49 verba untrennbar be-/emp-/ent-/er-/ge-/miss-/ver-/zer-, 2 kalimat). Empat jenis soal (`DTM`): **pilih prefiks** (kalimat rumpang; pengecoh bukan verba valid di data dengan batang yang sama), **bentuk Perfekt** (pengecoh: ge- salah tempat, infinitif, ge+infinitif, akhiran -en/-t tertukar, ist→hat; tidak ada pengecoh hat→ist karena bisa terbaca Zustandspassiv), **zu-Infinitiv** (an-zu-rufen vs zu anrufen, dst), **trennbar vs untrennbar** (dengan penjelasan aturan tekanan). Kunci SRS `dv|<mode>|<infinitif>`; TTS `de`.
- Didaftarkan di `GXL`, `GXO` (default n:6, r:200, semua jenis soal), `gxItems`, `gxNext`, reset jadwal `ggxrst` (prefix `dv|`), `gxSettings` (chip jenis soal), `index.html` + `sw.js` SHELL (`js/gamedata3.js`, sebelum `games2.js`), `tests/load.js`, `test_genhub.js`, `export_zcl.js`.
- Uji: `test_phv.js` diperluas (≥3 kalimat/verba, total ≥500 kalimat); uji baru `test_dtv.js` (data, bentuk Perfekt/zu-Infinitiv, 800 soal acak, pendaftaran). Seluruh uji node lolos.
- Versi 7.35.0 (sw.js, GM_VER, GM_NEWS).

## 7.34.0 — Minggu, 8 Nov 2026 (tahap 3: game Phrasal Verbs Inggris)

- **Game baru `phv` — Phrasal Verbs Inggris** (`lg:'en'`, tampil di grup Inggris hub). Data 178 phrasal verb di berkas baru `docs/js/gamedata2.js` (`PHV`: verba|partikel|arti|kalimat dengan {partikel}|terjemahan), pembuat soal `phAll/phCells/phMake`, pengecoh `phPtOpts/phArOpts`. Dua jenis soal (`PHM`): **pilih partikel** (kalimat rumpang + terjemahan Indonesia; pengecoh bukan kombinasi verba+partikel yang ada di data, partikel dua kata seperti *up with* / *out of* diberi pengecoh dua kata) dan **pilih arti** (opsi arti dari verba/partikel serupa + acak, tanpa kata awal yang sama dengan kunci). Kunci SRS `ph|<mode>|<verba>`; TTS bahasa `en`.
- Didaftarkan di `GXL`, `GXO` (default n:6, r:200, modes pt+ar), `gxItems`, `gxNext`, reset jadwal `ggxrst` (prefix `ph|`), `gxSettings` (chip jenis soal), `index.html` + `sw.js` SHELL (`js/gamedata2.js`, dimuat sebelum `games2.js`), `build_single.py` (otomatis lewat urutan index.html), `tests/load.js`/`test_genhub.js`/`export_zcl.js` (memuat gamedata2.js).
- Uji baru: `tests/test_phv.js` (4702 asersi: kelengkapan data, verba & arti unik, satu blank per kalimat, 400 soal acak, penilaian, pendaftaran). Seluruh uji node lolos.
- Versi 7.34.0 (sw.js, GM_VER, GM_NEWS).
- **Belum**: game Trennbare Verben Jerman (`dtv`) → tahap berikutnya (data di `gamedata2.js` juga).

## 7.33.0 — Minggu, 8 Nov 2026 (tahap 2: pecah Tebak Gender, urutan hub, laporan Kelas AI)

- **Tebak Gender dipecah**: `gen` = Tebak Gender Jerman (der/die/das), `gnl` = Tebak Gender Belanda (de/het). Tab bahasa dihapus; `ggxopen` mengatur `ggO().ggl` sesuai game, `ggView`/`gxAct` memakai `gxIsGen`. Hitungan harian per bahasa: `S.ggd` (n,r,x) = Jerman, `S.ggd.nl` = Belanda (`ggSd(L)`); impor progres ikut menggabungkan `ggd.nl`. Reset jadwal kini hanya menghapus kunci SRS bahasa itu (`@de` / `@nl`), tidak lagi menghapus seluruh `S.gg` (yang sebelumnya ikut menghapus jadwal game lain). Kunci SRS lama tidak berubah, jadi progres tetap.
- **Hub Games**: urutan default dikelompokkan per bahasa (Mandarin, Inggris, Jerman, Belanda; tiap kelompok berjudul). Tombol **↕ Atur urutan** menampilkan ▲▼ per game; urutan tersimpan di `S.o.gxOrd` (game baru yang belum ada di daftar tersimpan ditambahkan di akhir); tombol “Kembalikan urutan per bahasa”. Statistik hub kini per bahasa untuk kedua game gender.
- **Kelas AI Pustaka**: panel level menampilkan jumlah kosakata di level terpilih, berapa yang sudah punya contoh terverifikasi (persen), berapa belum, jumlah grammar, plus rincian per level (`aiLvCount`, `aiLvCountHtml`).
- **Tempel banyak kalimat** (≥ 6 kalimat): muncul kotak “Prompt yang dipakai” (+ tombol “Pakai prompt terakhir yang kusalin”, `aiLastPrompt`). Aplikasi membaca daftar kartu di bagian KARTU PRIORITAS/KARTU BARU prompt (`gmPromptCards`) dan membuat laporan (`gmTagReport`, `libRepHtml`): jumlah masuk, bertag tetapi belum terverifikasi, dan daftar kartu belum masuk dengan alasan (tag gagal + alasannya, “Dilewati:” dari AI, kata tampak tapi tak bertag, atau tidak ada sama sekali).
- Uji baru: `test_genhub.js`, `test_lvcount.js`, `test_tagreport.js`. Seluruh uji node lolos.
- Versi 7.33.0 (sw.js, GM_VER).
- **Belum**: game Phrasal Verbs Inggris (`phv`) dan Trennbare Verben Jerman (`dtv`) → tahap berikutnya.

## 7.32.0 — Minggu, 8 Nov 2026 (tahap 1: timer lock-in, jenis flashcard, tanda Kelas AI)

- **Timer Lock-in** (tab Kartu): atur durasi dalam jam & menit (langkah 5 menit), Mulai/Berhenti. Tersimpan di `S.o.lkEnd`, jadi tetap jalan setelah reload; saat habis ada getar + toast.
- **Jenis flashcard** (Pengaturan flashcard): Flashcard kalimat rumpang / Flashcard biasa / Campur (acak per kartu). Berlaku untuk kosakata & grammar (`S.o.fct`, diputuskan di `gzpRoll`).
- **Tanda Kelas AI** setelah kartu dibuka: ✅ masuk Kelas AI Pustaka (prioritas) atau ⛔ tidak masuk + alasan (`aiMarkHtml`).
- **Prioritas kartu terakhir**: kartu yang sedang tampil + dua kartu terakhir (`S.o.fcn`, `S.o.fcl`) selalu di urutan teratas daftar Kelas AI Pustaka, melewati batas jumlah kata.
- **Impor progres**: kunci lama yang sudah tak ada di data (mis. 5 judul grammar Mandarin yang dipecah) dipindah ke `S.legacy2` dan dilaporkan, bukan dibiarkan merusak sinkronisasi; `ggd` (hitungan game harian) kini ikut diimpor. Dites dengan berkas progres v7.11 (763 kunci tetap, 15 dilewati).
- **Impor progres tidak lagi menimpa yang lebih baru**: jadwal kartu (srs) dari berkas hanya dipakai bila kartu itu belum punya jadwal di perangkat atau jumlah ulasannya lebih banyak; kartu ditangguhkan tetap ditangguhkan.
- Versi 7.32.0 (sw.js, GM_VER).

## 7.31.0 — Minggu, 8 Nov 2026 (tag terverifikasi untuk SEMUA kosakata, dicek dengan arti Indonesia)

- **Prompt Kelas AI**: blok TAG kini meminta tag `V: [bentuk kamus] > [bentuk di kalimat]` untuk SETIAP kata kartu yang dipakai (kata benda, sifat, keterangan, dll. dan kata kerja, berubah bentuk maupun tidak; "([nama bentuk])" hanya untuk yang berubah). Sebelumnya hanya kata kerja yang bentuknya berubah (dan hanya di bahasa dengan daftar bentuk) yang diminta ber-tag, sehingga kosakata lain tidak pernah terverifikasi.
- **Terverifikasi = tag V: asli + padanan arti Indonesia**. Kalimat dihitung terverifikasi untuk kartu hanya jika (1) tag menunjuk kartu itu dan (2) terjemahan Indonesia kalimat memuat padanan arti kartu (`gmIdOk`/`gmGloss`: arti kartu + kepala catatan entri, toleran imbuhan ber-/me-/di-/-kan/-i/-an/-nya, frasa, kata ulang, dan kata inti frasa). Mencegah salah-tag seperti 差す yang dikira cocok pada さすが: arti "Memang hebat" tak memuat padanan "menyorot/menancapkan", jadi tidak terverifikasi. Berlaku juga retroaktif untuk tag yang sudah tersimpan (dihitung saat dipakai, tanpa impor ulang).
- **Homonim**: tag V: kini menyimpan semua kartu kandidat untuk satu lemma (`ks`, ≤8) dan cadangan lewat bentuk di kalimat bila lemma tak ketemu; pemeriksaan arti Indonesia memilih kartu yang tepat.
- **Soal rumpang kosakata** kini hanya dibuat dari kalimat yang terjemahan Indonesianya cocok dengan arti kartu (kalimat hasil deteksi otomatis yang terjemahannya tak cocok tidak lagi jadi soal). Penyorotan Indonesia memakai mode longgar.
- Pengorbanan yang disengaja: kalimat tanpa terjemahan Indonesia, atau yang terjemahannya memakai sinonim tak terdaftar, tidak terverifikasi (tetap tampil sebagai contoh "terdeteksi otomatis").
- Uji: `tests/test_tagverify.js` baru (差す/さすが, kata benda bertag, homonim ks); fixture uji lama disesuaikan (butuh arti Indonesia cocok). Seluruh uji node lolos.
- Versi 7.31.0 (sw.js, GM_VER).

## 7.30.0 — Minggu, 8 Nov 2026 (rumpang kosakata dua arah + Kelas AI hanya hitung yang terverifikasi)

- **Perbaikan kebocoran jawaban**: pada kartu kosakata berbentuk soal rumpang, sisi depan sebelumnya menampilkan kata kartu (mis. 跑 + pǎo) DI ATAS kalimat yang kata itu dikosongkan. Kini sisi depan tidak memuat kepala kartu sama sekali; jawaban baru muncul setelah kartu dibuka.
- **Dua arah soal** (semua bahasa & level; kalimat Pustaka yang memuat kata kartu):
  - **Arah A (kosongkan kata asing)**: kalimat asing dengan kotak kosong + terjemahan Indonesia lengkap dengan padanan kata kartu yang disorot (mis. "Siswa itu **berlari** lebih cepat daripada saya"). Dibuka -> jawaban asing (跑 + pǎo), kalimat lengkap, penyorotan di terjemahan.
  - **Arah B (kosongkan kata Indonesia)**: kalimat Indonesia dengan kotak kosong ("Siswa itu ___ lebih cepat daripada saya") + kalimat asing lengkap dengan kata kartu disorot (+ bacaan/pinyin). Dibuka -> jawaban Indonesia ("berlari").
  - Arah dipilih acak tiap kartu muncul. Opsi baru **Pengaturan flashcard > Arah soal rumpang kosakata** (Acak / hanya A / hanya B; `S.o.gzd`).
- **Penanda kata Indonesia** (`gzvIdSpan`, gram.js): arti kartu (mis. "Berlari / Berlari-lari") dicari di terjemahan dengan toleransi imbuhan (ber-, me-, di-, pe-, ke-, se-, -kan, -i, -an, -nya, -ku, -mu, partikel -lah/-kah/-pun), frasa, dan kata ulang. Tidak ketemu -> arah B tidak dipakai untuk kalimat itu (kalimat lain yang cocok didahulukan); arah A tetap jalan dengan petunjuk "Kata yang dicari: <arti>".
- **Kelas AI Pustaka**: jumlah contoh per kartu kata kini HANYA menghitung kalimat **terverifikasi** (bertag V:/K: asli dari AI). Hasil deteksi otomatis tidak dihitung lagi (hanya ditampilkan sebagai info di ringkasan). Akibatnya kartu yang contohnya hanya terdeteksi otomatis kembali jadi kandidat prompt. Label chip: "N terverifikasi". Grammar tidak diubah.
- Uji: `tests/test_cloze_dir.js` baru (penanda Indonesia, kedua arah untuk zh/ja/de/nl/en/eo, depan tak membocorkan jawaban); `tests/test_verified.js` disesuaikan; seluruh uji node lolos. Tampilan dicek di Chromium 390 px.
- Versi 7.30.0 (sw.js, GM_VER).

## 7.29.2 — Minggu, 8 Nov 2026 (penyebab sebenarnya layar kosong di HTML tunggal)

- **Akar masalah** (dari galat pengguna Android WebView: `Cannot read properties of null (reading 'textContent')`): di HTML tunggal, `<script type=text/plain id=vr-app>` (app.js) berada SETELAH skrip boot. Pada pembukaan pertama (IndexedDB kosong, boot cepat) `VRS.boot().then` jalan sebelum parser sampai ke #vr-app (file ±8 MB) -> `getElementById('vr-app')` null. Balapan waktu, tergantung kecepatan perangkat.
- `build_single.py`: #vr-app kini ditaruh SEBELUM skrip boot, boot menunggu `DOMContentLoaded`, dan ada galat jelas bila elemen tak ada. `docs/index.html` (memuat js lewat src) tidak terpengaruh.
- Versi 7.29.2 (sw.js, GM_VER).

## 7.29.1 — Minggu, 8 Nov 2026 (perbaikan: aplikasi tidak bisa dibuka saat pertama masuk)

- **Penyebab paling mungkin**: dua regex literal di `app.js` (`gnW`, `gnU`) memakai *lookbehind* `(?<![\p{L}])`. Browser/WebView lama (mis. Safari/iOS < 16.4, Android WebView lama) menganggapnya SyntaxError saat parse sehingga SELURUH `app.js` gagal jalan dan layar kosong. Lookbehind itu dibuang (hasil pencocokan identik untuk pemindaian kiri-ke-kanan global). Belum bisa dipastikan perangkat pengguna; ini kandidat terkuat yang ditemukan di kode.
- Tiga `new RegExp` berlookbehind (app.js `libHL`-area, gram.js x2) kini lewat `rxLB()`: bila mesin menolak lookbehind, dipakai versi tanpa lookbehind (boleh sedikit lebih longgar di tengah kata) alih-alih error.
- **Bug nyata ditemukan lewat uji**: item Pustaka/kalimat dengan bentuk tak valid (mis. tanpa `ps`) membuat `gram.js` melempar `it.ps is not iterable` dan layar kosong. Kini `S.lib`/`S.sl` dinormalisasi saat muat (item tetap disimpan; `ps` kosong bila hilang).
- **Layar pemulihan** (`vrFatal` di vr-store.js): bila boot/`app.js`/render awal gagal atau layar tetap kosong, tampil pesan + tombol Muat ulang / Bersihkan cache aplikasi / Unduh cadangan data (JSON) + teks galat. Tidak ada lagi layar kosong tanpa petunjuk.
- `index.html` dan `build_single.py`: `VRS.boot(...).catch(vrFatal)`, `app.js` onerror.
- `sw.js`: versi 7.29.1; precache memakai `cache:'reload'` agar tidak tercampur file lama/baru dari cache HTTP (sumber lain layar rusak tepat setelah pembaruan).
- Uji: 11 tes node lolos; Playwright 390 px pada HTML tunggal: data kosong, data valid, data rusak, dan mesin tanpa lookbehind (disimulasikan) semuanya terbuka, 7 tab diklik tanpa pageerror; layar pemulihan dan SW terdaftar diverifikasi pada docs/ via http.

## 7.29.0 — Minggu, 8 Nov 2026 (tugas B5: daftar tag yang gagal)

- `gmResolveTags` kini mengumpulkan `fail=[{key,kind,name,surface,reason}]` (kind V/K/G, atau `?` untuk baris/potongan yang formatnya tidak dikenali) dan `gmApplyTags` menyimpannya di `r.fail`. Peringatan angka lama (dibuang / tidak cocok kartu) tetap ada.
- Alasan yang dicatat: nomor kalimat tidak ada di teks yang ditempel; potongan teks tidak ada di kalimat; kartu kosakata tidak ditemukan (tag tetap disimpan tanpa tautan); legenda G# tidak ditemukan; judul grammar tidak cocok dengan kartu mana pun; format tag tidak dikenali (pecahan non-V/K/G, baris tanpa tag). `gmItems` mengembalikan juga `.bad`, `gmTagLines` menyimpan `raw`.
- Pratinjau tempel (`libAddPrev` -> `libFailHtml`, pustaka.js): `<details>` berisi "kalimat N · jenis: nama → “potongan” + alasan", terbuka otomatis bila ≤5 item, dibatasi 40 baris + "dan N lainnya", ter-escape.
- Uji baru: `tests/test_tagfail.js` (lolos). Tampilan pratinjau di browser: lihat catatan STATUS.

## 7.28.0 — Minggu, 8 Nov 2026 (tugas B4: terverifikasi vs terdeteksi otomatis)

- Definisi: **terverifikasi** = kalimat Pustaka punya tag V:/K: asli dari AI untuk kartu itu (`t:'v'`, `t.k` = `base@lang`); **terdeteksi otomatis** = hasil pencocok `libHL`/`libCountKey` tanpa tag. Keduanya tetap dihitung dan dipakai; hanya yang terverifikasi diprioritaskan dan diberi tanda ✓.
- gram.js: `gmVerMap/gmVerN/gmVerFirst` (cache GMVER, ikut `gmSig`; dibersihkan di `gmDelCaches`). `gmCollect` memberi `ver` pada tiap item; kalimat bertag kartu ikut terkumpul walau pencocok tidak menemukan kata (lv 3). Kartu kosakata ditandai "✓ terverifikasi" di daftar contoh (`gmExBlock`) dan di sisi belakang soal rumpang (`gzvBack`). Header contoh kini "N terverifikasi (bertag AI) · M terdeteksi otomatis".
- **Perbaikan bug B1**: `gzvCands` membandingkan `t.k==base(k)`, padahal `t.k` berbentuk `base@lang`, sehingga `tg` selalu false. Kini memakai `ver`; kalimat terverifikasi berbobot 3x saat memilih kalimat rumpang (`lv` 3).
- app.js: kartu baru (`fcMixNew`) menaruh kartu terverifikasi paling atas (urutan lain stabil); pada urutan acak (`fcPick`) undian dipersempit ke kartu terverifikasi selama masih ada.
- ai-class.js: `aiCoverage` menghitung `v` dan `a` per kartu (`n = v + a`); label kandidat dan ringkasan panel Cakupan Pustaka memakai dua angka. Kandidat Kelas AI sendiri TIDAK diurut berdasarkan terverifikasi (urutan "contoh paling sedikit" dipertahankan).
- Uji baru: `tests/test_verified.js` (lolos). Tampilan di browser BELUM dilihat.

## 7.27.0 — Minggu, 8 Nov 2026 (tugas B3: kartu baru tidak jadi kandidat Kelas AI)

- Akar masalah di `aiCovCands` (ai-class.js): (1) kunci entri ke-2 (`~n`) dibuang dari kandidat dan daftar "belum pernah muncul" hanya membangun kunci entri pertama, padahal flashcard (`fcPoolV`) menampilkan tiap entri sebagai kartu sendiri; (2) filter tingkat hanya memeriksa entri pertama (`es[0][3]`), sedangkan flashcard menerima kartu bila entri mana pun masuk filter; (3) kartu yang sedang tampil tetapi belum dijawab tidak tercatat di S.srs, jadi bisa terpotong batas pengisi (160 kata / 44 grammar saat opsi kartu baru mati).
- Perbaikan: kunci `~n` dipetakan ke kartu induk `base@lang`; tingkat dicek lewat `es.some(...)`; kartu `fcCur` (kosakata maupun grammar, bila tidak ditangguhkan) selalu disisipkan sebagai kandidat; cache `aiCoverage` kini memuat `fcCur`.
- Uji baru: `tests/test_aicands.js` (lolos; gagal pada kode 7.25.0). Belum diuji di browser. Penyebab pasti pada data pengguna belum bisa dipastikan; ketiganya adalah celah nyata di kode.

## 7.26.0 — Minggu, 8 Nov 2026 (tugas B2: hapus kalimat dari contoh Pustaka)

- Tiap kalimat di blok "📚 Contoh dari Pustakamu" (`gmExBlock`) punya tombol 🗑 (aksi `fcxdel`) dengan konfirmasi. `gmDelSent(key,idx)` di gram.js menghapus dari `S.sl`, atau dari `p.f/r/i/tg/sp` di `S.lib` (paragraf kosong dan item kosong ikut dibuang), lalu `save()` + render ulang lewat dispatcher.
- `gmCollect` kini membawa penunjuk asal `o` ({t:'sl',id} atau {t:'lib',id,pi,si}); diteruskan ke kandidat rumpang (gzpCands/gzvCands). Bila indeks sudah bergeser, kalimat dicari ulang lewat teksnya.
- Cache dibersihkan: GMEXC, gmRoll, GZP.c, GZV.c, libSD, libDocs, libAna, libAnaG. Bila kalimat yang dihapus adalah soal rumpang yang sedang tampil, `gzpRoll` dipanggil ulang agar kalimat itu tidak tampil lagi.
- Uji baru: `tests/test_delsent.js` (lolos). Tampilan tombol di browser BELUM dilihat.

## 7.25.0 — Minggu, 8 Nov 2026 (tugas B1: rumpang kartu kosakata)

- **Kartu kosakata** (bukan grammar) kini bisa tampil sebagai soal kalimat rumpang dari kalimat Pustaka yang memuat kata kartu itu (`gmCollect`, pencocok `libHL`). Kode di `gram.js` bagian 6c: `gzvExt`, `gzvCands`, `gzvPick`, `gzvRow`, `gzvFront`, `gzvBack`; dipanggil dari `gzpRoll` (sekali tiap kartu muncul) dan `fcBody` di `app.js`.
- **Jerman/Belanda, kata benda**: bagian kosong diperluas ke artikel yang langsung mendahului kata benda (der/die/das/den/dem/des/ein-/eine-..., de/het/een), jadi jawaban = artikel + kata benda. Bila tidak ada artikel tepat di depannya (mis. "mijn huis" atau ada kata sifat di antara), hanya kata bendanya yang dikosongkan. Bahasa lain: hanya kata kartunya.
- Tanpa kalimat cocok (atau kalimat tidak lolos `gzpOk`: panjang/jumlah blanko) -> tampilan kartu biasa. Opsi baru **Pengaturan flashcard > Soal rumpang kartu kosakata** (`S.o.gzv`, default aktif; juga mati bila opsi grammar = "Judul (tampilan lama)").
- Sisi belakang menampilkan kalimat yang sama dengan jawaban ditandai, lalu isi kartu seperti semula.
- Belum ada prioritas kalimat bertag AI (itu tugas B4); sekarang semua kalimat cocok berbobot sama (kalimat dengan terjemahan sedikit lebih sering).
- Uji baru `tests/test_vocabcloze.js` (perluasan artikel, kandidat, depan tidak membocorkan jawaban, belakang menandai, null tanpa kalimat/opsi mati). Belum diuji tampilan visual di browser.
- `sw.js` VERSION dan `GM_VER` 7.25.0.

## 7.24.0 — Minggu, 8 Nov 2026 (tugas A5: lebih banyak kalimat soal)

- **Jerman (DEFR/DEPLF)**: bingkai kini 33-39 per kasus (Nom 34, Akk 40, Dat 37, Gen 33; jamak Nom 34, Akk/Dat/Gen dipakai bersama karena kata kerja/preposisinya tidak bergantung jumlah). Data ada di `gamedata.js` (`FR_DE`), format `teks|tag`. Nom dipisah tunggal/jamak agar kata kerja sesuai (ist/sind, steht/stehen, dst.). Dativ memuat preposisi dua arah dalam sikap lokasi (wo?), Genitiv memuat wegen/trotz/während/statt/innerhalb/außerhalb dan kata benda + Genitiv.
- **Belanda (NLFR)**: 53 bingkai: 32 objek langsung (`FR_NL.o`) + 21 frasa preposisi (`.p`), ditambah 10 subjek tunggal (`.s`) dan 10 subjek jamak (`.z`). **Perbaikan bug**: bingkai subjek lama ("Hier is {P}", "Dit is {P}") ikut dipakai untuk meervoud, menghasilkan "Hier is de huizen". Kini dipisah. Bingkai preposisi tidak dipakai bila penentu `geen` atau mode `art`/`pla` (hindari "over geen huis").
- **Pemilihan bingkai** `frPick(kunci,daftar)`: kantong acak tanpa ulang sampai semua bingkai terpakai, dan tidak pernah sama dua kali berturut-turut (termasuk antar-kantong). Hasil soal membawa `q.fr` (templat bingkai).
- **Penjelasan hasil (Jerman)** menambahkan alasan kasus: "Kasus karena: mit + Dativ", "wegen + Genitiv", atau "Subjek (kata kerja steht)". Belanda tidak diberi tag.
- Uji baru `tests/test_frames.js` (136.688 asersi): jumlah bingkai, tanpa duplikat, tepat satu {P} dan tidak di awal kalimat, kesepakatan kata kerja, tanpa undefined/NaN dalam 500 soal per sel, tanpa pengulangan berturut-turut, kantong lengkap, semua bingkai terpakai dalam 3.000 soal. `tests/test_plural.js`: daftar kata kerja jamak Nom diperluas. `load.js` mengekspor FR_DE, FR_NL, DEFR, DEPLF, NLFR*, frPick.
- `sw.js` VERSION dan `GM_VER` 7.24.0.

## 7.23.1 — Minggu, 8 Nov 2026 (tugas A4: uji headless)

- **Tidak ada perubahan fitur.** Hanya uji dan berkas uji baru `tests/test_modes.js`: semua sel soal Jerman (102 sel: mode x kasus) dan Belanda (33 sel) dibuat 60 kali = 8100 soal, tanpa error, tanpa `undefined`/`NaN`/`null`, tanpa soal kosong.
- Uji Playwright (360 px) pada HTML tunggal: hub (4 kartu), Tebak Gender (20 jawaban, 5 putaran tambahan), Penggolong (20 soal), Artikel & Akhiran DE dan NL (20 soal). Semua 0 pageerror. Semua chip pengaturan tiap game diklik: 9 (zcl), 19 (dad), 12 (dnl), lalu 5 soal dijawab setelahnya. Chip Penerimaan jawaban (b/l/a), tombol 🚩 Tolak (3 kali), dan Hapus semua laporan (konfirmasi diterima) bekerja.
- Catatan: pada satu putaran Tebak Gender pernah terekam `scrollWidth>innerWidth` satu kali; tidak bisa direproduksi dalam 5 putaran ulang (100 soal), kemungkinan kata Jerman/Belanda yang sangat panjang. Belum ada perbaikan.
- Belum dilihat secara visual (hanya diuji lewat DOM): tampilan label/tombol.

## 7.23.0 — Minggu, 8 Nov 2026 (tugas A3: kunci jawaban penggolong)

- **Tingkat keyakinan per jawaban** (`gamedata.js`: `ZCT`, kunci `kata:penggolong`, verbal `#indeks:penggolong`). Tanpa tanda = baku; `l` = lisan lazim (17 pasangan, mis. 手机 个, 人 口); `d` = diperdebatkan (铅笔/钢笔 枝). Tingkat ini kurasi awalku, mohon ditinjau di `KUNCI_PENGGOLONG.md`.
- **Opsi "Penerimaan jawaban"** (`S.o.gx.zcl.acc`: b/l/a, default l). `zcAns(x)` menghitung `ok` (wajib), `soft` (diterima, tidak dihitung salah, diberi label "tidak dihitung") dari tingkat dan penimpaan pribadi. `gxScore` mengabaikan `soft`. Opsi soal selalu memuat semua jawaban, jadi jawaban lisan bisa dipilih tanpa hukuman.
- **Tombol 🚩** di hasil soal: "Tolak X" (jawaban dihapus dari kunci), "X juga benar, terima" (untuk pilihanmu yang dinilai salah), dan "Batalkan laporan". Disimpan di `S.o.gx.zcl.ov[kunciSoal]={rej,add}`; berlaku mulai soal berikutnya. Penolakan tidak pernah mengosongkan seluruh kunci. Tambahan pribadi berlabel hijau "tambahan pribadi". Tombol "Hapus semua" di pengaturan.
- **Ekspor**: `node tests/export_zcl.js > KUNCI_PENGGOLONG.md` (tabel kata, pinyin, arti, penggolong + tingkat, kategori, catatan; verbal juga). Ringkasan: baku 208, lisan 17, diperdebatkan 2.
- Uji baru `node tests/test_zcl.js` (16.287 asersi: kunci ZCT valid, tiga mode, skor, penimpaan, 3.000 soal tanpa undefined). `load.js` mengekspor zcAns, zcMake, zcAll, zcRes, dll.
- `sw.js` VERSION dan `GM_VER` 7.23.0.

## 7.22.0 — Minggu, 8 Nov 2026 (tugas A2: Genitiv Jerman)

- **Heuristik `deGen` diganti daftar terkurasi** (`gamedata.js`: `DEGSRC`; `games2.js`: `deGenMaps`, `deGen`). Urutan keputusan: (1) n-Deklination/khusus dengan bentuk eksplisit (Junge→Jungen, Name→Namens, Herz→Herzens, Student, Kollege, Herr→Herrn, Mensch, Bauer, Nachbar, dst.); (2) kata tak berubah (-mus, Virus, Mythos, Chaos, dst.); (3) daftar `es` (suku tunggal lazim -es: Haus→Hauses, Tag→Tages) dan `s` (lazim -s: Auto, Zimmer, Leben); (4) akhiran aman: -chen/-lein/-ling/-er/-el/-en → +s, -haus/-raum/-platz → +es, -nis → +nisses, -sch/-z/-ß/-ss/-eis/-ais → +es. **Kata di luar itu dikembalikan null dan dilewati untuk soal Genitiv, tidak ditebak** (mis. Bahnhof, Verkehr, Unfall, Angebot, yang punya dua bentuk lazim).
- Kata yang genitifnya ganda (-s atau -es) sengaja dikeluarkan dari daftar supaya kunci jawaban hanya satu.
- Cakupan pada data: 1.004 kata maskulin/netral punya bentuk pasti, 1.223 dilewati. Feminin tetap tak berubah.
- Uji baru `node tests/test_genitiv.js`: 116 kata contoh dengan bentuk benar, kata tak pasti harus null, konsistensi daftar, seluruh pool data, dan 1.440 soal Genitiv (bentuk deGen selalu muncul di kalimat, tanpa undefined/NaN). Semua lolos. `tests/load.js` kini mengekspor `deGen`, `DEGSRC`, `dePool`.

## 7.21.0 — Minggu, 8 Nov 2026 (tugas A1: bentuk jamak)

- **Data jamak terkurasi** (`gamedata.js`: `PLDE_SRC`, `PLNL_SRC`). Jerman 460 kata, Belanda 444 kata (A1–C1 yang ada di data), ditulis per pola (Jerman: -n, -en, -e, umlaut+e, -er, umlaut+er, umlaut saja, tetap, -s, -se, khusus; Belanda: -en, ejaan berubah, -s, -'s, khusus). Bentuk jamak Jerman diturunkan dari pola dan diperiksa skrip; kata yang tidak ada di data atau punya dua gender berbeda otomatis tidak dipakai.
- **Jenis soal baru Jerman** (Pengaturan game → Jenis soal): Jamak: artikel (die/die/den/der) · Jamak: akhiran adjektiva (setelah artikel tentu dan kein-/mein- selalu -en; tanpa artikel -e/-e/-en/-er) · Jamak: bentuk kata benda (pilih bentuk jamak yang benar) · Jamak: Dativ +n (kecuali jamak berakhiran -n/-s). Artikel jamak Dativ otomatis memakai kata benda + -n.
- **Jenis soal baru Belanda:** Jamak: artikel & penentu (selalu *de*, het/een/dit/dat salah) · Jamak: adjektiva (+e) · Jamak: bentuk kata benda (-en / -s / -'s / khusus).
- Jadwal ulas per sel aturan: `dr|de|pa|kasus|p`, `dr|de|pj|kasus|d/o/k`, `dr|de|pf||pola`, `dr|de|pd||tipe`, `dr|nl|pla||t`, `dr|nl|pld|penentu|t`, `dr|nl|plf||pola`. Pengguna lama: jenis soal baru tidak otomatis aktif (hidupkan lewat chip); pengguna baru: aktif semua.
- Uji: `node tests/test_plural.js` (data, pola, aturan tiap jenis soal ~3.000 soal, filter level). Semua lolos. `tests/load.js` = pemuat vm dengan stub.
- **Perbaikan kritis (bug sejak 7.20.0):** `games2.js` mendeklarasikan `const GMS` dan `const GN` yang bentrok dengan `gram.js` (GMS) dan `app.js` (GN). Akibatnya `games2.js` gagal dimuat ("ggView is not defined") dan HTML tunggal 7.20.0 tidak menampilkan aplikasi sama sekali. Diganti nama: `GMS`→`GXL`, `GN`→`DGN` (khusus games2.js). Uji baru `tests/test_globals.js` menjalankan semua berkas di satu konteks vm dan melaporkan deklarasi ganda.
- Tata letak: opsi jawaban panjang (bentuk jamak) memakai 2 kolom (`.gxg.l`) dan `overflow-wrap:anywhere`, sehingga tidak meluber di lebar 360 px.
- Uji asap Chromium headless (lebar 360 px): 7 jenis soal jamak × 20 soal dijawab benar lewat klik, 0 pageerror, 0 overflow. Hub dan game lain belum diuji sistematis (itu tugas A4).
- `build_single.py` (baru): `python3 build_single.py 7.21.0 out.html` membangun HTML tunggal.
- `sw.js` VERSION dan `GM_VER` 7.21.0.

## 7.20.0 — Minggu, 8 Nov 2026 (tahap 1: Games)

- **Games dirombak jadi hub.** Tab Games kini menampilkan kartu tiap game (ikon, deskripsi, jumlah ulas/baru, skor hari ini), bilah atas dengan tombol ‹ Games, skor sesi + rentetan 🔥, pengaturan per game yang bisa dilipat, dan tombol Periksa untuk soal multi-pilihan. Gim lama Tebak Gender tetap utuh (dibungkus `ggGenView/ggGenAct/ggGenSet`).
- **Game baru: Penggolong Mandarin (量词).** ±190 kata benda × bingkai kalimat sederhana (一___人, 两___书, 我有三___…) + 16 soal penggolong verbal (次/遍/趟/顿/场/下/会儿). Soal multi-jawaban: pilih semua yang benar (mis. 个 / 位 / 口 untuk 人). Skor: semua benar = Good, sebagian benar = Hard, ada yang salah = Again. Sisi jawaban menampilkan kalimat lengkap + pinyin + 🔊 dan catatan pemakaian tiap penggolong. Filter kategori & opsi pinyin.
- **Game baru: Artikel & Akhiran Jerman.** Enam jenis soal: artikel tentu, artikel tak tentu, akhiran adjektiva setelah artikel tentu/tak tentu, artikel + akhiran sekaligus (dua kotak), dan *semua artikel yang cocok* (der/ein/kein/mein/dein, multi-jawaban) — untuk Nominativ, Akkusativ, Dativ, Genitiv × maskulin/feminin/netral. Kata benda diambil dari kosakata (bobot level: A1–A2 lebih sering); Genitiv memakai aturan -(e)s dan melewati kata benda n-Deklination.
- **Game baru: Artikel & Akhiran Belanda.** Jenis soal: *penentu yang cocok* (de/het/een/geen/dit/dat/deze/die/mijn, multi-jawaban), dit/dat/deze/die, dan akhiran adjektiva -e atau ∅ (een + het-woord tanpa -e, dst.).
- Jadwal ulasan: Penggolong per kata (`zc|…`, `zv|…`), Jerman/Belanda per *sel aturan* (`dr|de|mode|kasus|gender`) agar latihan menyebar rata. Bila tidak ada yang jatuh tempo, game lanjut sebagai latihan bebas tanpa mengubah jadwal.
- Berkas baru: `js/gamedata.js` (data penggolong), `js/games2.js` (hub + mesin soal). `sw.js` & `GM_VER` 7.20.0.
- **Belum dikerjakan (tahap 2):** kalimat rumpang kosakata Jerman/Belanda (mulai dari artikel) dari Pustaka, tombol hapus contoh Pustaka di flashcard, kartu “unrevealed” yang tak masuk Kelas AI, prioritas kosakata bertag asli, laporan tag gagal saat paste.

## 7.19.4 — Minggu, 8 Nov 2026

- **Dua tab tidak lagi saling menimpa.** Penyimpanan kini punya nomor revisi (kunci `rev`) dan `BroadcastChannel('vortaro-state')`. Sebelum menulis, revisi tersimpan dibaca dalam satu transaksi readwrite; bila lebih baru dari yang diketahui tab ini, data digabung: `srs` ambil entri dengan `r` lebih besar (seri → `d` lebih baru), `lg`/`nw` ambil nilai per hari terbesar, `p` maksimum + `fcSync`, `s` gabungan, `sd` hari sama ambil terbesar, `lib`/`sl` gabungan per id; kunci lain milik tab penulis terakhir. Tab penerima yang tidak kotor memuat ulang state dari IndexedDB dan merender ulang. Mode localStorage memakai event `storage`. Hapus semua progres / Hapus jadwal / Pemulihan menimpa mentah (tanpa gabung).
- **Cadangan berputar.** Sekali per hari belajar (`fcDay`) state lama disalin ke `state_prev` (kemarin) dan `state_prev2`. Cadangan `state_pre` dibuat tepat sebelum Hapus semua progres, Hapus jadwal flashcard, dan impor. Tombol **Pulihkan dari cadangan…** di Atur → Penyimpanan menampilkan tanggal + jumlah kartu dan meminta konfirmasi; keadaan sekarang disimpan lebih dulu sebagai `state_undo`.
- **Ekspor/impor lengkap.** Ekspor progres kini menyertakan `o`, `f`, `gf`, `sd`, `ses`, `gs`, dan nomor skema `sch` (`S.v`=1). Impor toleran berkas lama; bila berkas memuat `o`, ditanya apakah pengaturan diterapkan. Format kunci lama tidak berubah.
- **Cache antrean flashcard (`fcQ`).** Klasifikasi kartu (baru/ulang/belajar) disimpan per (hari belajar, versi data) dan dibatalkan lewat penghitung `fcQV` saat save, jawaban, undo, aksi kartu, gim, dan sinkron antar-tab. Kartu yang sedang dipelajari tetap dievaluasi terhadap jam sekarang, jadi hasilnya identik dengan tanpa cache. Pemanggilan hangat ±2 ms (dingin ±67 ms pada 13.760 kartu).
- Uji: dua tab menilai kartu berbeda → kedua perubahan ada; rotasi cadangan; rst → `state_pre` == state sebelumnya dan pemulihan mengembalikan string IDB persis; ekspor→impor ke profil kosong; berkas lama tanpa `o` tak merusak pengaturan; cache == tanpa cache setelah jawab/undo/tangguhkan/ganti pengaturan/ganti hari; tulis IDB 13.760 kartu ±30 ms; `txCheck` lolos; 0 pageerror.

## 7.19.3 — Sabtu, 7 Nov 2026

- **Grammar Esperanto A1–C2: satu materi = satu kartu.** 33 kartu gabungan dipecah menjadi 78 kartu (266 → 311 kartu EO: A1 48, A2 71, B1 69, B2 48, C1 33, C2 42; total D.G 3451 → 3496). Pecahan pertama memakai ID lama; pecahan lain `g|eo|LEVEL|judul`. Contoh baru ditulis dalam Esperanto + terjemahan Indonesia.
- Dipecah: konjungsi (aŭ/kaj/nek/sed/tamen), tiu · ĉi tiu, ties · ĉi ties, tie · ĉi tie, tien · ĉi tien, pli · plej, malpli · malplej, diri/paroli/rakonti, ĉar · tial ke, anstataŭ/por/antaŭ ol, da · de, multe da · multaj, akusatif waktu · adverbia frekuensi, preposisi + adverbia · preposisi + preposisi, kiu · kies, koni · scii, tempo · fojo, loĝi · vivi, antikva/maljuna/malnova, gelar · sapaan, salam · seruan, -dek/-cent/-mil, -uj- (wadah/pohon/negeri), nenial/neniel/neniom, -i/-ig-/-iĝ-, tekad · ajakan, perintah · larangan, imperatif (permohonan/harapan/saran), izin (permesi/lasi/imperatif), eble · kredeble/verŝajne, bo- · duon-, -ĉj- · -nj-, satuan berat · ukuran.
- Tidak dipecah (satu konsep, hasil PERIKSA): `tiu vs ĉi tiu: yang pertama dan yang terakhir`, `Partikel ajn`.
- Setiap kartu baru punya aturan rumpang sendiri di tabel `GOR` (judul tepat → kunci) dan entri `TX` (legacy_id, tag disalin dari kartu asal, tetangga `TX.N`).
- Uji: `fcBody` depan/belakang 3496 kartu 0 galat; semua kartu EO berkunci punya kotak rumpang; `txCheck` 20 cek lolos; 0 pageerror; ID lama utuh; ID unik.
- `sw.js` VERSION dan `GM_VER` 7.19.3. Belum dikerjakan: penyaringan dan pemecahan zh, ja, de, nl, en.

## 7.19.2 — Sabtu, 7 Nov 2026

- **Perbaikan: flashcard grammar Esperanto kini berumpang di layar Kartu.** Penyebab: tabel `GZ` di `app.js` (daftar bahasa yang memakai mesin rumpang pada `gzOn()`) belum memuat `eo`, sehingga `fcBody` jatuh ke cabang lama (hanya judul + tombol jawaban). Uji 7.19.1 hanya memanggil `gzFront/gzBack` langsung. Perbaikan: `GZ={...,nl:1,eo:1}`.
- Hasil di layar (`fcBody`): 266/266 kartu EO menampilkan isi (246 berumpang + Fungsi, 20 “ingat pola”); NL/DE/EN tidak berubah; 0 pageerror; `txCheck` 20 cek lolos; 3451 kartu 0 galat; ID unik.
- Audit kartu gabungan (satu kartu = satu materi) dicatat di `AUDIT_B.md`; pemecahan dikerjakan bertahap di rilis berikutnya.
- `sw.js` VERSION dan `GM_VER` 7.19.2.

## 7.19.1 — Sabtu, 7 Nov 2026

- **Grammar Esperanto A1–C2: soal kalimat rumpang.** Kartu `eo` (266 kartu: A1 44, A2 55, B1 60, B2 46, C1 29, C2 32) kini punya mesin rumpang sendiri `gzoFront/gzoBack` (percabangan `g[1]=='eo'` di `gzFront/gzBack`). Kunci rumpang dibaca dari judul kartu: kata utuh (preposisi, konjungsi, `ĉu`, `ke`, `se`, pronomo, `la`, dst.), kata korelatif (`ti-/ki-/ĉi-/i-/neni-` + `-u/-a/-e/-o/-am/-al/-el/-om/-es`), ujung kata (`-o -a -j -n -i -as -is -os -us -u`, partisip `-anta/-inta/-onta/-ata/-ita/-ota`, `-ante…`), afiks (`-in- -il- -ej- -eg- -ar- -ul- … mal- re- ek- dis- ge- bo- eks- pra- for-`, diverifikasi ke kosakata EO agar `re-` pada *respondi* tidak ikut), dan bilangan. Hanya bagian kunci yang dikosongkan (maks. 2 kotak); ortografi ĉ ĝ ĥ ĵ ŝ ŭ utuh. Rumpang hanya ditampilkan (tidak ada input ketik), jadi normalisasi sistem-x/h tidak diperlukan.
- Hasil: **246 kartu EO berumpang**, **20 kartu tetap “ingat pola & rumus”** (alfabet, pelafalan, diftong, aksen, apozisi, kata majemuk, penurunan kata, nama diri, elisi, surat, satuan, mata uang, singkatan). Semua kartu EO sudah punya 3 contoh, jadi data.js/xlsx tidak diubah (xlsx tetap v67).
- Mesin zh/ja/de/nl/en tidak disentuh; 3451 kartu grammar diuji 0 galat, Atur › Taksonomi 20 cek lolos tanpa ✗.
- `sw.js` VERSION 7.19.1 dan `GM_VER` 7.19.1 agar cache klien diperbarui.

## 7.19.0 — Sabtu, 7 Nov 2026

- **Grammar Belanda A1–C2: satu materi = satu kartu.** 119 kartu gabungan (mis. `bij / voor / om`, `in, op, aan`, `willen / moeten / mogen`, `zowel … als / noch … noch`) dipecah menjadi 365 kartu terpisah (380 → 626 kartu NL). Isi tiap kartu (fungsi, contoh, sel tabel) dibagi menurut materinya. Kartu pertama dari tiap pecahan **mempertahankan ID lama** (jadwal SRS & status tetap), pecahan lain mendapat ID baru `g|nl|LEVEL|judul`. Taksonomi (`TX`) ikut diperbarui. Pola yang memang satu konsep (mis. urutan kata `V finit + V infinitif / …`, `Modal / laten / … + infinitif`) sengaja tidak dipecah.
- **Flashcard: satu entri per kartu.** Kata Indonesia dengan beberapa padanan di satu bahasa (mis. *menarik* → `pull`, `appeal`) kini menjadi kartu terpisah di flashcard. Entri pertama memakai kunci lama (`id@bahasa`), entri berikutnya `id@bahasa~n`, jadi progres lama tidak hilang. Sisi depan, belakang, dan suara hanya memakai satu entri.
- **Kelas AI: kartu kosakata baru langsung berstatus “Sedang”.** Begitu sebuah kartu kosakata baru muncul di flashcard (belum perlu dijawab), statusnya menjadi Sedang sehingga masuk kandidat Kelas AI Pustaka dan bisa dibuatkan contoh kalimat. Jadwal SRS tidak berubah. Kartu entri ke-2 dst. menandai kartu induknya.
- Xlsx v67: kolom grammar NL A1–C2 memakai pecahan yang sama (sheet lain identik dengan v66).

## 7.18.0 — Sabtu, 7 Nov 2026

- **Penjelasan konteks singkat** dari database v66 kini tampil di aplikasi (11.654 entri kosakata).
  - Sisi belakang kartu: baris 💡 di bawah contoh kalimat.
  - Daftar kosakata: ringkasan konteks (maks. 2 baris) dan ikut dicari lewat kolom pencarian.
  - Sisi depan kartu (Indonesia → bahasa target): bila ada arti kembar atau beberapa kata, muncul blok "Konteks tiap kata" dengan kata target disamarkan, supaya kartu kembar bisa dibedakan tanpa membocorkan jawaban.
- Pengaturan baru di Flashcard: **Petunjuk konteks di sisi depan** (Otomatis / Selalu / Jangan tampilkan).
- Kata tanpa konteks tidak berubah. Game dan prompt Kelas AI belum memakai konteks.

## 7.17.0 — Jumat, 6 Nov 2026
- **Soal rumpang kartu grammar bisa diambil dari Pustaka (acak).** Tiap kali kartu grammar (Mandarin, Jepang, Inggris, Jerman, Belanda) muncul, aplikasi memilih satu kalimat acak dari Pustakamu (Kalimat, Reading, Listening, Dialog) yang terhubung ke kartu itu. Bagian kuncinya dikosongkan, arti Indonesia menjadi petunjuk, dan fungsi singkat di atasnya ikut disamarkan. Sisi jawaban menampilkan kalimat yang sama dengan jawaban ditandai (🔊 dan romaji/pinyin bila ada), lalu tampilan kartu seperti biasa. Kalimat tidak diulang berturut-turut bila ada pilihan lain.
- **Sumber kalimat:** (1) kalimat yang **bertag grammar** dari AI — potongan di blok TAG = jawaban; (2) khusus kartu leksikal (kata/partikel/pola, bukan kala atau bentuk kata kerja), kalimat lama **tanpa tag** yang dikenali pencocok otomatis. Kartu struktural (Perfekt, Passiv, Voltooid deelwoord, Present perfect, bentuk kata kerja Jepang, dst.) hanya memakai kalimat bertag. Kalimat yang kuncinya muncul terlalu banyak, terlalu panjang, atau tak bisa dikosongkan dengan bersih dilewati. Tanpa kalimat yang cocok, kartu memakai soal bawaannya seperti sebelumnya.
- **Atur → Pengaturan flashcard:** “Sumber soal rumpang grammar” (Pustaka acak, bawaan · Campur 50:50 dengan contoh kartu · Contoh kartu saja) dan “Kalimat Pustaka yang dipakai” (bertag AI + terdeteksi otomatis, bawaan · hanya yang bertag AI). Tidak ada data, ID progres, jadwal SRS, atau format ekspor/impor yang berubah.
- **Prompt Kelas AI isi Pustaka** (Reading, Listening, Dialog, Kalimat) kini meminta kalimat yang cocok untuk soal rumpang: potongan TAG = **bagian kunci** grammar saja (bukan seluruh klausa) dan harus unik di kalimat; tag grammar wajib untuk tiap grammar yang dipakai; jawaban bagian kosong harus tunggal; arti akurat; tiap grammar prioritas/baru dipakai di minimal 3 kalimat berbeda bila jumlah kalimat cukup; panjang kalimat sedang. Panel Pustaka menyebutkan bahwa kalimat bertag otomatis jadi soal rumpang. Kalimat yang sudah ada di Pustaka tidak perlu diubah: yang sudah bertag atau terdeteksi otomatis langsung dipakai.
- **Perbaikan: tombol Salin di Kelas AI berfungsi lagi.** Fungsi penyalin (`ltCopy`) dipanggil tetapi tidak pernah didefinisikan, sehingga tombol Salin prompt dan tautan ChatGPT/Claude/Gemini tidak menyalin apa pun. Kini memakai Clipboard API dengan cadangan `execCommand` (WebView, berkas lokal, HTTP); bila tetap gagal, teks prompt dipilih otomatis agar bisa disalin manual.
- **Perbaikan: Kelas AI dari flashcard dan dari Pustaka kini memakai prompt yang sama** untuk tab Reading, Listening, Dialog, dan Kalimat. Dari flashcard, tab-tab itu membuka panel Pustaka (kartu prioritas berdasarkan cakupan Pustaka, level aktif, kartu baru, opsi kuota) untuk bahasa kartu tersebut; tab Penjelasan dan Bicara tetap khusus kartu yang sedang dibuka dan bisa dipilih kembali dari baris tab yang sama.
- Service worker 7.17.0.

## 7.16.1 — Jumat, 6 Nov 2026
- **Grammar Belanda: 380 dari 380 kartu bersoal** (260 rumpang + 120 soal sel tabel; sebelumnya 268). Hanya mesin Belanda (`gzn*`/`gn*`/`GN`/`GNK`) yang berubah; mesin bahasa lain dan Esperanto tidak tersentuh.
- **Kunci eksplisit `GNK`** untuk kartu yang kuncinya tak bisa diturunkan, kunci idiom otomatis (satu kata benda dari idiom, kotak tunggal), kunci dari kata sambung di awal `pola`, dan kata tunjuk dari `kv` untuk kartu De-/Het-woord.
- **Soal baru:** huruf/bunyi yang hilang (ejaan), singkatan → bentuk penuh, infleksi adjektiva (-e). **Sel tabel berputar** tiap kemunculan kartu (dihitung dari jadwal SRS yang hanya dibaca; tidak ada yang disimpan). Jawaban konjugasi tanpa kata ganti; bentuk `/` ditoleransi.
- **Fungsi pendek** dipotong sebelum kalimat yang sama dengan soal; **skor ambiguitas preposisi** dan petunjuk pada kartu ambigu; kalimat tanpa arti diturunkan skornya; kelas kartu diperbaiki (frasa, gender, bilangan, idiom, register, partikel, infleksi).
- **Data:** 108 kartu mendapat kalimat Belanda + arti (tambahan di akhir `contoh`) atau arti pada kalimat yang sudah ada, di `data.js`, HTML dan xlsx. Judul, ID, jumlah/urutan kartu, `kv`, `sub`, `S.srs`, `S.p` tidak berubah.

## 7.16.0 — Jumat, 6 Nov 2026
- **Flashcard grammar Belanda (A1–C2, 380 kartu) dirombak** dengan pola yang sama seperti Mandarin, Inggris, Jepang dan Jerman. Sisi depan kini berisi **fungsi pendek** (kalimat pertama, ≤ ±90 karakter, kata jawaban dan variannya disamarkan) + **kalimat contoh dengan kata kunci dikosongkan** + arti Indonesia, atau **soal sel tabel** bila kartu berupa tabel.
- **Kata kunci per jenis kartu:** preposisi dan konjungsi → judul; kata kerja + preposisi (`wachten op`, `praten met … over`, `bestaan uit`) → hanya preposisinya yang dikosongkan; pasangan (`zowel … als`, `om … te`, `hoe … hoe`, `niet alleen … maar ook`) → dua kotak berurutan; partikel (`toch`, `eens / even`, `nou`), `er` dan `waar-`/`er-` + preposisi → judul/pola; Perfectum (participle), Imperfectum, Plusquamperfectum, Futurum II dan Pasif (`worden`, `werd`, `door`) → aturan per sub-bab; urutan kata → posisi kata kerja; adjektiva `-e` → bentuk berakhiran -e. Bentuk tak beraturan (`ben/is/was`, `ging`, `kon`) diambil dari tabel konjugasi kartu itu sendiri, klitik (`je/jij`, `we/wij`, `'t/het`) dianggap sama, dan pencocokan memakai pembatas kata Unicode (`ë ï é`, apostrof, tanda hubung).
- **Soal tabel:** kata kerja kuat/campuran (`lopen: Imperfectum (wij / zij) ___`), konjugasi (`Jij / U ___`), pronomen (`Objek (Lemah) → ___`), komparatif/superlatif, daftar kata (hari, angka) dan pasangan bentuk (`boek → ___`, `kopen → ___` pada awalan). Satu sel dipilih tetap per kartu; semua bentuk dalam tabel disamarkan pada fungsi pendek.
- **Kalimat contoh dari tiga tempat:** kolom contoh (string multikalimat dipecah per kalimat), baris `Contoh …` di `kv` dan kalimat `Contoh: …` di dalam fungsi. Kalimat rusak (kata Indonesia terselip, daftar, panah, kurung, terpotong) tidak pernah dipakai sebagai soal; 77 kalimat dilewati.
- **Terjemahan:** 105 string contoh yang dipakai sebagai soal diberi terjemahan Indonesia di baris ke-2 (di `data.js`, HTML dan xlsx); string multikalimat diterjemahkan seluruhnya agar sejajar. Baris pertama, judul, ID, `kv` dan `sub` tidak berubah. 10 soal berasal dari baris `kv`/fungsi sehingga tidak diberi arti.
- **Hasil:** 268 dari 380 kartu (70,5%) mendapat soal otomatis: 168 rumpang + 100 soal sel tabel. 42 kartu ejaan/pelafalan memakai cadangan (fungsi pendek + tabel Cara Baca di belakang); 70 kartu lain memakai cadangan karena tanpa kalimat bersih atau kata kunci tak turunan (daftar lengkap di laporan fallback).
- Atur → Pengaturan flashcard → “Sisi depan kartu grammar (Mandarin, Inggris, Jepang, Jerman & Belanda)”. Pilihan “Judul” untuk Belanda identik dengan 7.15.0 (kecuali terjemahan baru di sisi belakang).
- Semua dihitung saat kartu ditampilkan; judul, ID progres (`g|nl|A1|…`), jumlah/urutan kartu, `kv`, `sub`, tag Pustaka, jadwal SRS dan format ekspor/impor tidak berubah. Mandarin, Inggris, Jepang, Jerman dan Esperanto identik dengan 7.15.0 (diuji pada 3.205 kartu × 3 mode). Tab Grammar tidak berubah.

## 7.15.0 — Kamis, 5 Nov 2026
- **Flashcard grammar Jerman (A1–C1, 386 kartu) dirombak** dengan pola yang sama seperti Mandarin, Inggris dan Jepang. Sisi depan tidak lagi memperlihatkan judul (yang pada preposisi berisi jawabannya). Kini berisi **fungsi pendek** (kalimat pertama, ≤ ±90 karakter, kata jawaban disamarkan) + **soal**: kalimat contoh dengan kata kunci dikosongkan + arti Indonesia, atau (untuk tabel tanpa kalimat) **soal sel tabel** seperti `er/sie/es ___` pada kartu konjugasi.
- **Sumber kata kunci per jenis kartu** (kolom Pola kosong di Jerman): preposisi → kolom Preposisi (termasuk `Bis zu`, `Von … an`, `Anstatt / Statt`); konjungsi, W-Frage dan zu-Infinitiv → judul; kalimat relatif → kata ganti relatif setelah koma; Perfekt, Präteritum, Futur I, Passiv, Konjunktiv II → aturan per sub-bab; kartu artikel/pronomen dengan kalimat → bentuk pada kolom `Bentuk …`; kalimat urutan kata → kata kerja posisi 1/2.
- **Kalimat contoh dari dua tempat:** kolom contoh dan sel `kv` (`Contoh Struktur Jerman`, `Contoh Kalimat Lengkap`, kalimat dengan arti dalam kurung, dst.), dengan terjemahan dari baris ke-2, baris `Arti …`, atau kurung. Kalimat yang rusak di data (kata Indonesia terselip seperti `tidak`/`dengan`, huruf tunggal seperti `Kinder n`, kurung di dalam kalimat, catatan terpotong) tidak pernah dipakai sebagai soal.
- **Kontraksi dan bentuk tak beraturan:** `im = in dem`, `zum`, `zur`, `vom`, `beim`, `ins`, `ans`, … cocok dengan kartu preposisinya, dan sisi jawaban menampilkan catatan `im = in dem`. Pencocokan memakai pembatas kata Unicode (ä ö ü ß), jadi `an` tidak jatuh di dalam `Kanne`. Kata umum (`der`, `in`, `zu`, …) hanya dikosongkan satu kemunculan yang paling relevan.
- **Sisi jawaban:** judul kecil → rumus/tabel (preposisi: `In + Dativ`; tabel: sel jawaban ditandai, tabel panjang dilipat) → fungsi lengkap → kalimat contoh (yang dipakai rumpang paling atas, kata kunci ditandai, tombol 🔊 pada tiap kalimat Jerman, arti).
- **Hasil:** 340 dari 386 kartu (88,1%) mendapat soal otomatis: 246 rumpang pada kalimat + 94 soal sel tabel. Per jenis: preposisi 179/185, konjugasi 39/39, deklinasi 69/79, konjungsi dan urutan kata 30/36, kala 12/25, aturan 11/22. 46 kartu memakai cadangan (fungsi pendek + kalimat utuh bila ada + “Ingat: pola & rumusnya”, tanpa kotak palsu).
- Atur → Pengaturan flashcard → “Sisi depan kartu grammar (Mandarin, Inggris, Jepang & Jerman)”: Soal rumpang (bawaan) · Fungsi saja · Judul (tampilan lama). Pilihan “Judul” untuk Jerman identik dengan 7.14.0.
- Semua dihitung saat kartu ditampilkan; judul, ID progres (`g|de|A1|…`), jumlah/urutan kartu, `kv`, `sub`, tag Pustaka, jadwal SRS, xlsx, dan format ekspor/impor tidak berubah. Mandarin, Inggris, Jepang, Belanda dan Esperanto identik dengan 7.14.0. Tab Grammar (daftar) tidak berubah. Service worker 7.15.0.

## 7.14.0 — Kamis, 5 Nov 2026
- **Grammar Mandarin (HSK 1–5): kartu gabungan dipecah.** 99 kartu yang memuat dua kata/poin atau lebih yang berbeda dan tidak dipakai bersamaan dijadikan satu kartu per poin (99 kartu → 362 kartu; total kartu Mandarin 439 → 702). Contoh: 常/想, 想/要, 会/能, 可能/可以, 的/地, 是非问句/特指问句, 把/被/叫/让, 连词, 补语, dan klasifier. Yang tetap digabung hanya sinonim/bentuk lain dari satu kata (mis. 常/常常, 一起/一块儿, 仅/仅仅) dan pasangan korelatif (不但……而且……, 虽然……但是……).
- Kartu lama yang sudah dipecah **dihapus** dari data aplikasi dan taksonomi; tidak akan muncul lagi.
- Tiap kartu baru punya judul, fungsi, pola, 1–3 contoh, dan keterangan sendiri. Kode taksonomi, tetangga, prasyarat, dan kluster ikut diperbarui.
- **Progres kartu yang dipecah mulai dari awal** (ID progres `g|zh|HSK n|judul` berubah). Progres kartu lain tidak terpengaruh.
- Perbaikan: contoh salah ketik pada 人称代词 HSK 1 dan 在……下 HSK 4.
- `English_Vocab_Grammar_A1-C2_v11.xlsx`: sheet HSK 1–5 memuat baris yang sama; sheet lain tidak berubah.
- Service worker 7.14.0.

## 7.13.0 — Kamis, 5 Nov 2026
- **Flashcard grammar Jepang (N5–N1, 848 kartu) dirombak** dengan pola yang sama seperti Mandarin dan Inggris. Sisi depan tidak lagi memperlihatkan bentuk grammar-nya (dulu judul = jawaban). Kini berisi **fungsi** (arti Indonesia) + **kalimat contoh dengan bentuk grammar dikosongkan** (soal rumpang). Sisi jawaban: judul kecil → **rumus pola besar** (bagian Jepang ditandai, placeholder K.Benda / V-kamus / [A] tidak) → fungsi → tiga contoh (contoh rumpang tampil pertama, bentuk grammar ditandai, tombol 🔊) → **keterangan & kasus khusus dilipat**.
- **Kata kunci dihitung otomatis dari judul** (bentuk grammar itu sendiri), cadangan: kolom Pola; placeholder Latin/Indonesia diabaikan. Pasangan `～` / alternatif `/` dipecah (maks. 2 rumpang per kalimat, berurutan: `にしろ～にしろ`, `たり～たり`), isi kurung dibuang. Bentuk yang berkonjugasi di kalimat dicari bila bentuk persis tidak ada (`てくる` → `てきた`, `出す` → `出した`, `いらっしゃる` → `いらっしゃいます`, `そうだ` → `そうな`). Kartu bentuk konjugasi (`意向形`, `受身形`, `られる`, `させる`, `させられる`, `て / で`, `ば`) memakai aturan khusus. Kartu partikel 1 huruf (は, が, を, に, の, で, …) hanya mengosongkan **satu** kemunculan yang paling relevan (sebelum/sesudah kata benda, atau di akhir kalimat untuk `ね`, `よ`, `か`).
- **809 dari 848 kartu (95,4%) mendapat rumpang otomatis** (N5 83/84 · N4 131/132 · N3 182/182 · N2 197/197 · N1 216/253). 11 di antaranya hanya sebagian (contoh memuat satu dari dua bagian pasangan `～`). 39 kartu lain memakai cadangan: fungsi + **pola dengan bagian Jepangnya dikosongkan** (mis. `K. Benda + ＿＿＿`) + contoh utuh bila ada. 25 dari 39 kartu itu karena contoh di data hanya berupa potongan tanpa bentuk grammar-nya (mis. `理由。`, `春。`), sebagian besar di N1.
- Contoh grammar Jepang di data belum punya terjemahan. Bila nanti baris ke-2 contoh diisi arti Indonesia, arti itu otomatis tampil sebagai petunjuk di bawah kalimat (sama seperti Mandarin/Inggris); tidak ada perubahan kode yang diperlukan.
- Atur → Pengaturan flashcard → “Sisi depan kartu grammar (Mandarin, Inggris & Jepang)”: Soal rumpang (bawaan) · Fungsi saja · Judul (tampilan lama). Pilihan “Judul” untuk Jepang identik dengan 7.12.0. Jerman, Belanda, Esperanto, Mandarin, dan Inggris tidak berubah.
- Semua dihitung saat kartu ditampilkan; judul, ID progres (`g|ja|N5|…`), jumlah/urutan kartu, tag Pustaka, jadwal SRS, xlsx, dan format ekspor/impor tidak berubah. Tab Grammar (daftar) tidak berubah. Service worker 7.13.0.

## 7.12.0 — Kamis, 5 Nov 2026
- **Flashcard grammar Inggris (A1–C2, 623 kartu) dirombak** dengan pola yang sama seperti Mandarin. Sisi depan: **fungsi singkat** (kalimat pertama penjelasan, ≤ ±90 karakter, kata kunci yang dirumpangkan disamarkan) + **kalimat contoh dengan 1–2 kata kunci pola dikosongkan** + arti Indonesia sebagai petunjuk. Sisi jawaban: judul kecil → **rumus pola besar** (kata kunci ditandai, placeholder S/V/noun/… tidak) → penjelasan lengkap → tiga contoh (contoh rumpang tampil pertama, kata kunci ditandai, tombol 🔊, arti) → **keterangan & kasus khusus dilipat**.
- **Kata kunci dihitung otomatis dari kolom Pola** dengan batas kata (to ≠ tomorrow), konjugasi/klitik tak beraturan (be → am/is/are/’m/’s/’re, have, do, will → ’ll, would → ’d, not → n’t/cannot, …), alternatif `/` `;` `vs` dipecah (hanya sisi yang muncul di kalimat yang dikosongkan), frasa multikata (used to, be going to, in case) dicocokkan sebagai urutan, dan kata sangat umum (a, the, to, of, in …) hanya dikosongkan **satu** kemunculan yang paling relevan. Cadangan bertingkat: daftar kata di judul/kurung → aturan sufiks (-ing, -ly, -ness …) dan kelas tertutup (wh-word, modal, aux, determiner posesif …) bila hanya ada satu kandidat → bila tetap gagal: fungsi singkat + contoh utuh + “Ingat: pola & rumusnya” (tanpa kotak palsu).
- **Kalimat yang salah (✖ / “salah”) tidak pernah dipakai sebagai soal.**
- **231 contoh grammar Inggris yang belum punya terjemahan kini punya arti Indonesia** (baris ke-2 contoh di `D.G`; catatan lama seperti “bukan *reds*” dipindah ke baris ke-3). Judul, ID, jumlah, urutan, tahap belajar (`kv`) dan taksonomi (`sub`) tidak berubah.
- Atur → Pengaturan flashcard → “Sisi depan kartu grammar (Mandarin & Inggris)”: Soal rumpang (bawaan) · Fungsi saja · Judul (tampilan lama). Jerman, Belanda, dan Esperanto tidak berubah; tampilan Mandarin identik dengan 7.11.0.
- Semua dihitung saat kartu ditampilkan; tidak ada progres SRS, tag Pustaka, atau format ekspor/impor yang berubah. Tab Grammar (daftar) tidak berubah. Service worker 7.12.0.


## 7.11.0 — Kamis, 5 Nov 2026
- **Flashcard grammar Mandarin (HSK 1–5) dirombak.** Sisi depan tidak lagi hanya berisi judul/istilah. Kini berisi **fungsi** (apa yang ingin diungkapkan) + **kalimat contoh dengan 1–2 kata kunci pola dikosongkan** (soal rumpang) + arti Indonesia sebagai petunjuk. 358 dari 439 kartu mendapat rumpang otomatis (kata kunci diambil dari kolom Pola). 81 kartu kategori (副词, 量词, 人称代词 …) memakai fungsi + contoh kalimat Mandarin.
- **Sisi jawaban lebih ringkas:** judul kecil → **rumus pola besar** (kata kunci ditandai) → fungsi → contoh (contoh yang dipakai untuk rumpang tampil pertama, kata kunci ditandai, tombol 🔊). **Keterangan & kasus khusus dilipat** (ketuk untuk membuka). Pinyin tetap diblur sampai diketuk.
- **Atur → Pengaturan flashcard → “Sisi depan kartu grammar Mandarin”:** Soal rumpang (bawaan) · Fungsi saja · Judul (tampilan lama).
- **Data tidak berubah.** Tidak ada kartu, judul, ID progres (`g|zh|HSK n|judul`), tag Pustaka, jadwal SRS, atau xlsx yang diubah; semua dihitung saat kartu ditampilkan. Tab Grammar (daftar) tidak berubah. Bahasa lain tampil seperti sebelumnya; fungsi `gz*` di `app.js` disiapkan agar bahasa lain (mis. Jepang) cukup ditambahkan ke peta `GZ`.
- Service worker 7.11.0.

## 7.10.0 — Kamis, 5 Nov 2026
- **Mandarin: level baru HSK 7-9** (1.684 kata, 937 di antaranya idiom) dan **1.593 kata baru** di HSK 1–6 (HSK 1 53 · HSK 2 143 · HSK 3 192 · HSK 4 345 · HSK 5 417 · HSK 6 443). Total Mandarin kini 3.277 entri baru.
- **Belanda: level baru C1 (1.212) dan C2 (762)** dan **3.025 kata baru** di A1–B2 (A1 102 · A2 583 · B1 1.204 · B2 1.136). Total Belanda 4.999 entri baru. De/het, bentuk jamak (2.173), bentuk kata kerja (1.041), dan komparatif kata sifat (616) ikut tersedia dan bisa disensor.
- Sumber: `English_Vocab_Grammar_A1-C2_v8.xlsx` (sheet HSK 1–7-9 dan NL A1–C2). Kata yang sudah ada **tidak diubah atau digeser level**, kata yang hanya pindah level di xlsx dilewati, sehingga progres dan Pustaka lama tetap utuh. Kata baru bermakna sama digabung ke kartu yang sudah ada; 4.534 kartu baru dibuat.
- Level baru otomatis muncul di filter flashcard, Games, onboarding, Statistik, dan Kelas AI Pustaka.
- Service worker 7.10.0.

## 7.9.0 — Rabu, 4 Nov 2026
- **Penyimpanan pindah dari localStorage ke IndexedDB** (berkas baru `js/vr-store.js`). Progres dan Pustaka tidak lagi dibatasi ±5 MB.
- **Migrasi otomatis:** saat pertama dibuka, data lama di localStorage disalin ke IndexedDB dan diverifikasi. Tidak perlu ekspor/impor. Salinan lama **dibiarkan** sebagai cadangan; hapus lewat Atur → Penyimpanan bila sudah yakin.
- **Batas Pustaka dinaikkan:** 400 → 20.000 teks (Reading/Listening/Dialog) dan 5.000 → 200.000 kalimat.
- Penyimpanan tertunda (satu penulisan untuk banyak perubahan beruntun) dan langsung ditulis saat tab disembunyikan/ditutup.
- Bila IndexedDB tidak tersedia, aplikasi otomatis memakai localStorage seperti sebelumnya.
- Atur: kartu **Penyimpanan** (jenis, ukuran data, pemakaian situs, hapus salinan lama).
- Format ekspor/impor JSON tidak berubah. Service worker 7.9.0.

## 7.8.0 — Minggu, 1 Nov 2026
- **Tab Games** (berkas baru `js/games.js`). Game pertama: **Tebak gender noun** untuk Jerman (der/die/das) dan Belanda (de/het). Filter bahasa & level, batas kata baru/ulasan per hari, dan **SRS terpisah** dari flashcard utama (disimpan di `S.gg`, ikut ekspor/impor progres, tombol reset sendiri). Benar = Baik, salah = Lagi.
- Di sisi jawaban kartu (tab Kartu), kata benda Jerman/Belanda menampilkan hasil game: artikel, status SRS, jadwal ulasan, dan jumlah benar.

## 7.7.0 — Minggu, 1 Nov 2026
- **Dihapus:** tab Belajar yang disembunyikan (Kata, Latihan kalimat) dan Bacaan Esperanto beserta datanya; tombol ⚙ Sensor di kanan atas; filter/tombol terkait latihan kalimat.
- **Pengaturan flashcard** pindah dari tab Kartu ke tab Atur (terbuka secara bawaan).
- **Kelas AI Pustaka:** kosakata prioritas, grammar prioritas, kosakata mahir, dan grammar mahir bisa dipilih **0**. Kuota bawaan yang hilang (8 / 3 / 12 / 4) diganti **kartu baru** yang belum pernah muncul di flashcard (otomatis aktif walau “Ikut” dimatikan). Berlaku untuk Reading, Listening, Dialog, dan Kalimat. Opsi komposisi kini terlihat langsung, tidak di “Opsi lanjutan”.
- Teks penjelas yang mengganggu dihapus/dipersingkat; tampilan baru (gradien, kartu, navigasi kaca).
- Service worker 7.7.0.

## 7.6.1 — Sabtu, 31 Okt 2026
- **Kelas AI Pustaka — level aktif:** chip level per bahasa (A1…C2 / HSK / N5…) di panel; tanpa pilihan, tetap mengikuti filter flashcard seperti sebelumnya. Tombol “Semua” dan “Ikuti filter”.
- **Kelas AI Pustaka — kartu yang benar-benar belum pernah muncul** (belum dinilai, belum diberi status, tidak ditangguhkan) di level terpilih kini ikut jadi pembentuk kalimat, **grammar dan kosakata**, sebagai blok “KARTU BARU” terpisah dari “KARTU PRIORITAS”. Urutan: yang belum punya contoh dulu, level terendah dulu, sehingga seluruh level terisi bertahap. Opsi: ikut/tidak, jumlah kosakata baru (3/6/10/15) dan grammar baru (0–8) per prompt. Aturan prompt: tiap kartu baru muncul ≥1×, yang 0 contoh ≥2×; grammar baru dicatat di blok TAG.
- Cakupan di panel kini dihitung untuk seluruh kartu di level terpilih (bukan hanya sampel), termasuk jumlah yang belum pernah muncul.
- **Romaji / pinyin:** baris romanisasi di Pustaka kini ikut mencocokkan kartu Jepang & Mandarin. Batas kata = spasi; bacaan kartu (≥4 huruf, nada pinyin dipertahankan) harus cocok pada batas kata; dihitung sebagai nilai terbesar dari aksara asli dan romanisasi (tanpa hitung ganda). Prompt meminta segmentasi kata yang konsisten. Bahasa berhuruf Latin sudah dicocokkan per kata (spasi/huruf) beserta bentuk turunannya.


## 7.6.0 — Sabtu, 31 Okt 2026
- **Bahasa baru: Inggris (EN)**, warna lime, level A1–C2, suara `en-US`.
- **Kosakata:** 10.103 entri dari `English_Vocab_Grammar_A1-C2_v3.xlsx` (A1 639 · A2 1.102 · B1 3.541 · B2 2.193 · C1 1.494 · C2 1.134). Bacaan = **IPA**, contoh = kalimat sederhana dari sheet. Seperti Belanda, kata berarti sama digabung ke kartu yang sudah ada (6.348 entri bergabung, **3.755 kartu baru**); kelas kata sheet dipetakan ke N/V/A/O (phrasal & modal verb → V; adverbia, preposisi, frasa, idiom, numeralia, konjungsi, pronomina, determiner, interjeksi → O).
- **Bentuk kata Inggris (`DXE`):** jamak (5.459, termasuk tanda *tak terhitung* / *selalu jamak*), `3sg · past · participle · -ing` (2.394 kata kerja & phrasal verb) dan komparatif · superlatif (1.297 kata sifat). Dibuat dari aturan + kamus tak beraturan (ejaan Amerika; penggandaan konsonan memakai tekanan dari IPA); catatan bentuk tak beraturan dari sheet menimpa hasil aturan. Ikut disensor (jamak / bentuk kata kerja / komparatif) dan tampil di kartu, prompt AI, dan pencocokan Pustaka.
- **Grammar:** 623 pola (A1 65 · A2 153 · B1 203 · B2 117 · C1 65 · C2 20) dengan fungsi/aturan, pola, 3 contoh + terjemahan, kasus khusus & kesalahan umum, alasan level dan sumber. ID progres `g|en|A1|judul`.
- **Taksonomi Inggris:** gid `en-a1-001` … `en-c2-020`; tag fungsi (kala, non-finite, artikel/determiner, modal, kondisional, pasif, klausa, preposisi …), prioritas Inti 139 · Umum 411 · Jarang 73, register (formal/literer) dan nuansa, 5 tetangga per pola, **46 kluster tertukar**, 25 pasangan kontras/mirip, 150-an relasi prasyarat. Tag lama yang dipakai bersama diberi label netral lintas bahasa.
- **Kelas AI:** profil bahasa Inggris (kala/aspek, bentuk kata kerja, artikel & countability, preposisi & phrasal verb, register, pelafalan) + daftar nama bentuk kata kerja untuk tag AI (Present perfect, Passive, Phrasal verb terpisah “pick … up”, dll.).
- **Pustaka:** bahasa Inggris di pemilih bahasa & judul `TEKS INGGRIS`, deteksi otomatis, singkatan (Mr., Mrs., Dr., e.g., i.e.) tidak memotong kalimat, pencocok bentuk kata (jamak, -s/-ed/-ing, tak beraturan, phrasal verb dengan urutan bebas), suara `en-US`.
- **Penghubung grammar ⇄ Pustaka:** pola kala (present/past perfect, continuous), pasif, masa depan, modal, kondisional, past simple, gerund, to-infinitive, dan relative dikenali dari kalimat Pustaka; tampilan “kata kerja yang berubah bentuk” mencakup Inggris.
- Latihan kalimat mengenali bentuk Inggris (jamak, past, -ing, tak beraturan). Sensor: label romanisasi mencakup IPA.
- Service worker 7.6.0.


## 7.5.0
- **Onboarding pertama kali:** pengguna baru memilih **bahasa** yang dipelajari, lalu **level** (boleh lebih dari satu). Pilihan itu mengisi filter kosakata & grammar sekaligus. Pengguna lama yang sudah punya progres/pustaka tidak dipaksa.
- **Sensor selalu aktif & tidak bisa dikonfigurasi:** kartu pengaturan Sensor dihapus. Bagian asing dan Indonesia sama-sama diblur dan bisa diketuk satu per satu; romanisasi, gender, jamak, bentuk kata kerja, komparatif, dan terjemahan bacaan selalu disensor.
- **Kelas AI — kartu mahir ikut jadi pembentuk kalimat** (kosakata & grammar yang sudah matang di SRS atau berstatus Selesai) di prompt **Reading, Listening, Dialog, dan Kalimat**. Jumlahnya lebih banyak secara bawaan (12 kata + 4 grammar) dan bisa diatur (6/12/20 dan 2/4/6). Grammar mahir ikut masuk legenda TAG.
- **Kelas AI di Pustaka (🎓 di tiap bagian Pustaka):** cukup pilih bahasa. Aplikasi menghitung jumlah contoh kalimat tiap kartu di Pustaka (Kalimat, Reading, Listening, Dialog) lalu prompt memprioritaskan kartu yang **belum punya contoh** atau contohnya paling sedikit (kosakata + grammar), dengan aturan “kartu 0 contoh minimal 2×”. Kartu lemah dan mahir tetap jadi pembentuk pelengkap.
- **Kualitas kalimat:** semua prompt Pustaka kini mewajibkan kalimat yang natural dan masuk akal (bukan sekadar memenuhi daftar kartu), boleh melewati kartu yang sulit dimasukkan secara alami (“Dilewati: …”), dan meminta pemeriksaan ulang sebelum menjawab.
- **Tab Grammar** selalu dibuka dari pilihan bahasa, lalu level.
- **Atur:** bagian taksonomi grammar disembunyikan. **Statistik:** bagian Latihan kalimat dan Bacaan Esperanto dihapus.
- Service worker 7.5.0.


## 7.4.0 — Rabu, 28 Okt 2026 · 06.20 WIB
**Penghubung kartu ⇄ Pustaka yang jauh lebih akurat, dua file JSON cadangan, dan 5 contoh kalimat saat kartu dibuka.**
- **Dua JSON terpisah:** *Ekspor progres* (`progres-kosakata_TANGGAL_JAM.json`) dan *Ekspor pustaka* (`pustaka-kosakata_…json`), masing-masing bermeta (`type`, versi, waktu). Impor menerima beberapa file sekaligus dan tetap membaca cadangan lama (satu file gabungan). Tag grammar ikut tersimpan dan digabung saat impor.
- **Tag dari AI:** prompt Kelas AI (Reading, Listening, Dialog, Kalimat) kini meminta blok `TAG GRAMMAR & KATA KERJA` berisi legenda kartu (G1, G2 …), potongan persis kalimat untuk tiap grammar, dan bentuk kata kerja yang berubah (`V: 食べる > 食べさせた (使役+た形)`). Parser memverifikasi tiap potongan benar-benar ada di kalimat (yang tidak ada dibuang), lalu menautkannya ke kartu lewat judul + level. Kalimat bertag = tingkat ✓ paling pasti, disorot persis di bagian yang ditandai.
- **Jepang:** konjugator berlabel dari kosakata kartumu (ます・ない・て・た・たり・たら・ば・意向・命令・たい・可能・受身・使役・使役受身, termasuk gabungan seperti 使役+て) dan kata sifat い/な. Pola ber-slot seperti *V-て + いる*, *V-ない + で*, *V-た + ら*, *V-masu(stem) + たい*, *V-意向 + と思う* diverifikasi: teks sebelum literal harus berupa bentuk kata kerja yang benar. Kartu bentuk (意向形, 受身形, られる, させる, させられる) dicocokkan lewat bentuk kata kerja yang terdeteksi.
- **Partikel / pola 1 huruf (は を が の さ …):** tidak lagi menandai semua kalimat. Tanpa konteks terverifikasi hanya dianggap *perkiraan lemah* (disembunyikan; ada tombol “Sertakan perkiraan lemah”). Dengan tag AI tetap tampil.
- **Mandarin:** hanzi dicocokkan dengan **pinyin per suku kata** (selaras posisi hanzi ⇄ suku kata). Suku kata yang diharapkan diambil dari contoh bertingkat di kartu, atau tabel bawaan untuk partikel umum — mis. *了 (le)* tidak lagi cocok dengan *了解 (liǎo)*, *得 (de)* dibedakan dari *得 (děi)*. Kata kunci bahasa Indonesia dari kartu dipakai sebagai penguat bila pinyin tidak ada.
- **Jerman & Belanda:** deteksi fitur struktural memakai bentuk kata kerja dari kartu verbmu (infinitif / 3.Sg / Präteritum / Partizip II / kata kerja terpisah): Perfekt, Plusquamperfekt, Präteritum, Passiv, Futur, Konjunktiv II, Modal, trennbar/scheidbaar, zu-Infinitiv / om…te, Nebensatz/bijzin, refleksif. Kartu verb-spesifik (mis. *lernen*, *haben*) mensyaratkan bentuk kata kerja itu.
- **Pustaka → analisis teks:** bagian baru **“Kata kerja yang berubah bentuk”** mengelompokkan per kartu kata kerja (Jepang: て形, 使役形 …; Jerman/Belanda: Präteritum, Partizip II …), memadukan deteksi otomatis dan tag AI. Kalimat menampilkan chip tag.
- **Saat kartu dibuka** (Kartu & Grammar): **“📚 Contoh dari Pustakamu”** — sampai 5 kalimat dari Pustaka (dipilih acak dari 10 kalimat berskor tertinggi: bertag AI → terverifikasi → punya terjemahan → panjang wajar; diacak ulang tiap berpindah kartu), dengan suara 🔊, romanisasi/terjemahan, dan tombol *Lihat semua di Pustaka*.
- **Info versi** (tanggal & jam) di Pengaturan; service worker 7.4.0; berkas baru `js/gram.js`.


## 7.3.1
**Perbaikan: bahasa asing, romanisasi, dan terjemahan Indonesia tidak lagi tercampur di Pustaka (Reading, Listening, Dialog, Kalimat).**
- **Masalah:** bila keluaran AI sedikit melenceng dari format (satu baris “asing | romaji | arti”, romaji/arti dalam kurung, dipisah “–”, nomor [1.1] diulang di setiap baris, dialog tanpa nomor, label A:/B: di baris romaji/arti), semuanya masuk ke kolom “teks asing”. Akibatnya tombol 🔊 dan pemutar membacakan romaji dan bahasa Indonesia juga, dengan suara bahasa asing.
- **Pengurai terpadu baru:** tiap potongan teks diklasifikasi sendiri sebagai *asing*, *romaji/pinyin*, atau *Indonesia* (dari aksara, tanda nada/makron, kata-kata Indonesia & partikel romaji, kata fungsi tiap bahasa), bukan hanya dari urutan baris. Dipakai oleh Reading, Listening (tanpa blok ===), Dialog, dan Kalimat.
- Dikenali: satu baris dipisah `|` `｜` tab `–` `—` `-` `→`; romaji/arti di dalam kurung; romaji/arti menempel di ujung baris yang sama; label `Romaji:` `Pinyin:` `Arti:`; nomor `[1.1]` `(1.1)` `1.1` `【1.1】`; nomor yang diulang di setiap baris; nomor yang berurutan di baris asing, romaji, dan arti (nomor diabaikan); dialog tanpa nomor (penutur A:/B:, `A：`, “Speaker A:”); judul & penanda “Paragraf N / 第一段”; bagian “Pembentuk yang dipakai” dipotong.
- Dialog tanpa label penutur diselang A/B otomatis (dengan peringatan) agar nada suara tetap berbeda.
- **Suara hanya membacakan bahasa asing:** `ttsClean()` dipakai oleh pemutar, tombol 🔊, dan kartu. Ia membuang sisa nomor, label penutur, furigana dalam kurung, romaji/pinyin, dan kalimat terjemahan Indonesia yang tertinggal di kalimat asing.
- **Teks lama yang sudah tersimpan tercampur diperbaiki otomatis** saat Pustaka dibuka (romaji dan arti dipindahkan ke tempatnya bila kosong).
- Pratinjau “＋ Tambah teks” menampilkan peringatan bila ada potongan asing yang diabaikan atau penutur tidak terbaca.
- **Prompt Kelas AI (Reading, Dialog, Kalimat, Listening)** kini meminta: satu bahasa per baris, baris romaji diawali `Romaji:`/`Pinyin:` dan baris arti diawali `Arti:`, baris 1 berisi aksara asli saja (tanpa huruf Latin), serta larangan menyambung bahasa dengan `|`, `–`, atau tanda kurung.
- **Salinan dari ChatGPT:** tanda markdown yang di-escape (`\[1\.1\]`, `\.`, `\!`, `\’`) dan `\` di akhir baris (pemisah baris markdown) dibersihkan sebelum diurai.
- **Pustaka → Kalimat:** tombol 🗑 Hapus, “Tandai hafal”, “Tampilkan lebih banyak”, dan “Putar semua” tidak bekerja karena aksinya tidak diteruskan ke Pustaka; sekarang berfungsi (hapus meminta konfirmasi).
- Service worker 7.3.1.

## 7.3.0
- **Kelas AI didefinisikan ulang — istilah Panjang / Sedang / Pendek dihapus.** Enam jenis prompt: **Penjelasan** (pelajaran lengkap + tes), **📖 Reading**, **🎧 Listening**, **💬 Dialog** (baru), **🔤 Kalimat** (baru), dan **Bicara**. Tiap tab menyebut ke mana hasilnya pergi (Pustaka → Reading / Listening / Dialog / Kalimat, atau “dibaca langsung di chat AI” untuk Penjelasan & Bicara) dan punya tombol “Buka Pustaka”.
- **Pustaka kini empat bagian:** Reading, Listening, **Dialog**, dan **Kalimat**.
  - **Dialog**: dua penutur (A:/B:) bernomor [1.1]; dibaca dengan label penutur, atau diputar dengan nada suara berbeda per penutur.
  - **Kalimat**: bank kalimat tunggal. Tempel **banyak kalimat sekaligus** (kelompok [1] [2] …, “asing | romaji | arti”, atau satu kalimat per baris); duplikat dilewati; cari teks, saring per bahasa/status/kartu (kata disorot), urut “cocok untuk kartu lemahku”, tandai hafal, putar semua kalimat satu bahasa. Ikut cadangan progres.
- **Prompt Dialog**: situasi + jumlah baris (6/10/14), topik utama & kartu lemah di setiap baris, format bernomor dengan penutur, aturan romanisasi dan teks bersih untuk suara.
- **Prompt Kalimat**: 10/20/30/50 kalimat yang berdiri sendiri, bervariasi, format bernomor [n]; bila AI terpotong, ketik “lanjut” dan penomoran diteruskan.
- Semua format keluaran bernomor sehingga romaji/pinyin dan terjemahan dicocokkan lewat nomor (anti-mismatch).
- Service worker 7.3.0.

## 7.2.0
- **Pustaka dibagi dua: 📖 Reading dan 🎧 Listening.** Tiap bagian punya hitungan, filter status (dibaca / didengar), pencarian kartu, dan tombol “＋ Tambah teks” sendiri. Reading: tombol 📖 Baca (teks + romanisasi + terjemahan per kalimat) dan “Tandai dibaca”. Listening: pemutar suara seperti sebelumnya. Teks lama otomatis masuk Listening; “⇄ Pindah ke Reading/Listening” ada di Rincian.
- **Kelas AI → prompt Sedang & Pendek punya “Tujuan hasil”: Pustaka → Reading atau Pustaka → Listening**, lengkap dengan keterangan ke mana hasilnya ditempel dan tombol “Buka Pustaka”. Tab Panjang & Bicara memberi tahu bahwa hasilnya dibaca di chat AI, bukan Pustaka. Pilihan “Format bacaan” lama diganti tujuan ini.
- **Format keluaran baru yang anti-mismatch (penting untuk Jepang & Mandarin).** Tiap kalimat diberi nomor `[paragraf.kalimat]` (mis. `[1.1]`) di semua baris/blok. Parser mencocokkan teks asing, romaji/pinyin, dan terjemahan **lewat nomor**, bukan lewat urutan atau tanda baca. Bila AI melewatkan satu baris romaji, hanya kalimat itu yang kosong; kalimat lain tidak bergeser. Reading memakai kelompok 3 baris (kalimat · romanisasi · arti; 2 baris untuk bahasa lain); Listening memakai blok `=== TEKS ===`, `=== ROMAJI/PINYIN ===`, `=== TERJEMAHAN INDONESIA ===`, `=== PEMBENTUK ===`. Prompt memuat aturan romanisasi (Hepburn dengan makron / pinyin bertanda nada), larangan menggabung/memecah kalimat, dan instruksi menghitung sebelum menulis.
- Parser lebih toleran: pagar blok kode ```, judul blok tanpa `===` (mis. **TEKS JEPANG**), label “Romaji:” / “Arti:”, urutan romaji/arti tertukar, baris lanjutan; format lama tanpa nomor tetap dibaca. Pratinjau menampilkan format terdeteksi, “romanisasi selaras n/n”, dan peringatan bila ada yang tidak cocok.
- Romanisasi otomatis (perkiraan, miring) kini juga muncul di Reading dan mengisi kalimat yang romanisasinya kosong.
- **Pemutar listening:** bagian atas (kalimat sekarang + ⏮ ▶ ⏭ 🔁) kini menempel dan tetap terlihat saat menggulung daftar; layar tidak lagi meloncat ke bawah tiap kalimat berganti (penyebabnya `scrollIntoView`; diganti tombol “↧ Ke yang sedang diputar”). Mode per paragraf: terjemahan dan “Lihat arti” per kalimat. Suara: kalimat panjang dipecah di koma, dan kalimat dianggap selesai bila antrean suara kosong (Android kadang tidak mengirim `onend`).
- **Sensor per item:** di kartu Kata (mode sensor bahasa asing / Indonesia) mengetuk bagian yang diblur hanya membuka bagian itu (satu bahasa, arti, atau kalimat saya), bukan seluruh kartu.
- Service worker 7.2.0.

## 7.1.2
- Pustaka: pengurai format terkelompok (teks / romanisasi / terjemahan per paragraf) lebih toleran: judul Mandarin/Jepang + judul Indonesia, penanda 第一段 atau tanpa penanda, jumlah baris tak seimbang.
- Pustaka: teks Mandarin/Jepang lama yang tersimpan salah format diperbaiki otomatis saat Pustaka atau pemutar dibuka.

## 7.1.1
- Grammar: membuka satu grammar kini menampilkan mode fokus (hanya materi + tombol sebelumnya/berikutnya + kembali ke Bahasa / Level / Daftar).
- Pustaka: pengurai membaca format Mandarin/Jepang yang dikelompokkan per paragraf (n baris teks, n baris romanisasi, n baris terjemahan, penanda seperti 第一段) dan membersihkan sisa markdown (\*\*, <underline>). Teks yang sudah tersimpan salah format perlu ditambahkan ulang.

## 7.1.0
- Grammar: alur baru pilih bahasa → pilih level → daftar grammar (level bisa ditambah/dikurangi tanpa kembali).
- Pustaka: pemutar menampilkan romanisasi Jepang/Mandarin; bila teks tidak memuatnya dibuat otomatis (perkiraan, dari kamus kartu).
- Kelas AI: format Audio untuk Jepang/Mandarin kini meminta blok `=== ROMAJI ===` / `=== PINYIN ===`; pengurai Pustaka membacanya. (Teks lama tetap bisa dipakai.)
- Statistik: hanya statistik; Kartu bandel, Perkiraan selesai, Proyeksi beban, dan Peta grammar menjadi tombol yang dibuka satu per satu.
- Pengaturan baru: jumlah kartu baru dan ulasan tambahan per ketukan setelah target hari ini selesai.
- Pustaka: deteksi grammar lebih akurat (konjugasi kata kerja bantu Jepang, awalan て/で, label kategori diabaikan, pola dari contoh untuk Eropa); pola yang terlalu umum diberi penanda dan diurutkan paling bawah.

## 7.0.1
- Daftar & Grammar: mengubah filter/pencarian tidak lagi melempar halaman ke atas (posisi scroll dipertahankan).
- Daftar: tombol "reset filter", bilah filter menempel di atas saat scroll.

## 7.0.0
**Pustaka teks + pemutar listening (tab baru “Pustaka”)**
- Tempel teks dari AI lewat “＋ Tambah teks”. Format yang dikenali otomatis: **Audio / listening** (`=== TEKS … ===` + `=== TERJEMAHAN INDONESIA ===`), **per kalimat** (“Paragraf N”, tiga baris: asing · romanisasi · Indonesia), paragraf + terjemahan, daftar bernomor dari prompt Pendek, dan teks polos. Bahasa terdeteksi otomatis (bisa dipilih manual); ada pratinjau sebelum disimpan.
- **Pemutar Listening**: dipecah per kalimat atau per paragraf, memakai suara bawaan perangkat. Kecepatan **0.5×–1.2×** (slider + preset), jeda antar kalimat (0–5 dtk atau “seperti durasinya”), ulangi tiap kalimat 1–3×, tombol **ulang kalimat**, sebelumnya/berikutnya, lanjut otomatis, ulang dari awal, pilihan suara per bahasa, daftar kalimat yang bisa diketuk, terjemahan **Tampil / Sensor / Sembunyi**, romanisasi bisa disembunyikan, layar tetap menyala saat memutar. Pintasan: Spasi, ←/→, R.
- `say()` (tombol 🔊) kini mengikuti pengaturan kecepatan suara (Atur → Tampilan) dan suara pilihan, tidak lagi tetap 0.9×. Bacaan Esperanto punya tombol “🎧 Pemutar”.
- Tandai **sudah didengar / sudah dibaca**, filter status, urutkan, ganti judul, hapus. Pustaka ikut **cadangan progres** (digabung per id saat impor).
- **Cari teks berdasarkan kartu**: pilih satu kartu (mis. 私 / watashi), atur “minimal muncul” (mis. 4×), dapatkan teks yang memuatnya. Pencocokan memahami **bentuk kata yang berubah**: kata kerja Jepang (godan/ichidan, ます・て・た・ない…, する/来る), kata sifat -い, bacaan kana dari romaji, Mandarin (kata sambung berpola, tanpa spasi), Jerman & Belanda (jamak, konjugasi, kata kerja kuat/lemah, partisip, kata kerja terpisah, kata sifat bertingkat, diminutif), Esperanto (semua akhiran, partisip, korelatif, pronomina). Juga urutan **“Cocok untuk kartu lemahku”**.
- Terjemahan Indonesia di pemutar kini **tampil secara bawaan** (sebelumnya tersensor); bisa diubah ke Sensor/Sembunyi. Tombol **📚 Teks** dari kartu langsung menampilkan **kalimat yang memuat kartu itu** (kata disorot, lengkap dengan paragraf/kalimat ke berapa dan terjemahannya); ketuk kalimat untuk memutar audio **dari kalimat itu**.
- **Grammar ikut bisa dicari** (dan dideteksi di rincian teks): pola literal dari judul/pola grammar dicocokkan ke teks — Jepang & Mandarin lewat fragmen kana/hanzi (urutan dalam satu kalimat bila polanya punya beberapa bagian, mis. 着…着), Jerman/Belanda/Esperanto lewat kata kunci yang terbukti muncul di contoh grammar, termasuk bentuk kata kerjanya dan awalan/akhiran (mis. -ebl-, ver-). Sifatnya perkiraan; grammar yang murni abstrak tidak bisa dicari. Tombol 📚 ada di kartu grammar dan toolbar flashcard.
- Rincian tiap teks menampilkan **semua kartu milikmu yang muncul dalam teks** (jumlah kemunculan, status lemah/baru/matang), bisa difilter; ketuk kartu untuk mencari teks lain.

**Kelas AI: prompt keempat “Bicara”**
- **Percakapan (mode suara)**: AI jadi lawan bicara yang bicara pelan dan pendek, memakai topik utama + kartu lemahmu, menunggu jawabanmu, tanpa koreksi di tengah, lalu **koreksi akhir** (skor, kesalahan, pola, pemakaian kartu, 5 kalimat untuk diulang). Pilihan situasi dan jumlah giliran; kata bantuan “arti / pelan / bantu / selesai”.
- **Koreksi tulisanku**: AI memberi tugas menulis, menunggu tulisanmu, lalu mengoreksi tiap ronde (menggantikan fungsi Latihan kalimat yang disembunyikan).

**Kartu bandel**
- Kartu yang dilupa ≥ 4× (ambang bisa diubah di Pengaturan flashcard → Lanjutan) ditandai “🪨 bandel” di kartu dan muncul di daftar **Statistik → Kartu bandel**.
- Tombol **🧠 Mnemonik** menyalin prompt khusus kartu itu: diagnosis, **3 jembatan ingatan** berbeda teknik, **1 kalimat jangkar**, dan tes ingat mini. Ada notifikasi saat sebuah kartu baru menjadi bandel.

**Teknis**: berkas baru `js/pustaka.js`; service worker 7.0.0; kunci penyimpanan `vortaro_v1` tidak berubah (data baru: `lib`, opsi `ttsr`, `lp*`, `lch`).

## 6.3.0
- **Kelas AI: opsi “Level kalimat” di semua prompt** (panjang, sedang, pendek): *Sesuai topik* (seperti sebelumnya) atau *Level tertinggi pilihanku*. Pilihan kedua mengambil level tertinggi bahasa itu dari pengaturan aktif (Filter flashcard kosakata & grammar; bila kosong, filter tab Kata/Grammar), mis. Jepang N5–N3 → N3. Kalimat dan kosakata pendamping boleh setingkat itu, tetapi semua kartu yang sedang dipelajari tetap wajib dipakai. Level topik sendiri tetap ditulis di prompt.
- **Prompt Sedang: format ketiga “Audio / listening”** untuk text-to-speech: tiga blok berurutan — `=== TEKS (bahasa asing) ===` berisi semua paragraf, `=== TERJEMAHAN INDONESIA ===` berisi semua paragrafnya, lalu daftar pembentuk. Teks bersih tanpa tebal/garis bawah/nomor/romanisasi agar enak dibacakan.
- Service worker 6.3.0.

## 6.2.0
- **Tab Belajar disembunyikan** dari antarmuka (kodenya tetap ada; ubah `SHOW_BELAJAR` di `js/app.js` menjadi `true` untuk menampilkannya lagi). Aplikasi kini dibuka di tab Kartu, dan tombol “Latih grammar ini / Buat kalimat” serta riwayat kalimat di kartu ikut disembunyikan.
- **Kelas AI memilih kosakata/grammar berdasarkan status sekarang**, bukan riwayat lupa seumur hidup. Kartu yang sudah **matang** (interval ≥ 21 hari; grammar ≥ batas 20 hari) tidak dimasukkan walau pernah lupa berkali-kali. Yang dipilih: baru lupa / belajar ulang, lupa yang intervalnya belum pulih (ditampilkan bersama interval sekarang), masih belajar, ulasan muda, sedang dipelajari, dan kesalahan latihan yang baru (21 hari) serta belum tepat pada percobaan terakhir. Berlaku untuk prompt panjang, sedang, dan pendek, serta kartu pintas di tab Grammar.
- **Prompt Sedang: dua format bacaan.** (1) Paragraf utuh + terjemahan per paragraf (seperti sebelumnya); (2) **Per kalimat**: tiap paragraf diberi penanda, lalu tiap kalimat ditulis tiga baris — bahasa asing, romanisasi (Jepang/Mandarin), bahasa Indonesia — dipisah baris kosong.
- Service worker 6.2.0.

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
