## TUGAS AKTIF 7.106.85 — KALIMAT BAWAAN (GSB) UNTUK SEMUA KARTU GRAMMAR
Konteks: proyek PWA Vortaro (folder vortaro/, kode di docs/js, tes di tests/). Lampirkan vortaro-pwa-<versi terbaru>.zip, ekstrak, jalankan semua tests/test_*.js (tidak boleh ada kata GAGAL). **Aku memakai Claude FREE PLAN**: kerjakan per batch kecil, JANGAN menjalankan banyak agen/subagen sekaligus (token tidak cukup), dan SETIAP SELESAI satu batch kirim zip + prompt lanjutan baru (PROMPT_LANJUTAN_<versi>.md, selalu memuat catatan free plan ini) SEBELUM token habis. Bila file belum selesai, kirim zip + prompt di bubble chat yang sama.

Tujuan: tiap kartu grammar punya 15 kalimat bawaan dengan sorotan konsisten (asing + Indonesia). Kartu dengan 15 kalimat bawaan tidak mengambil contoh dari Pustaka lagi (sudah diimplementasikan di gram.js: GSB, GSBN, gsbRows, gsbFull, gmCollect). Mesin, generator, tes SUDAH SELESAI; sisanya hanya MENULIS ISI.
URUTAN (keputusan pengguna): HSK 1–2 → Jerman A1–B1 → Jepang N5–N3 → Belanda A1–A2 → Esperanto A1–A2 → sisanya bebas. Kartu grammar PENGUCAPAN (nada, pinyin, huruf, lafal) dilewati, tidak dibuatkan kalimat.

### Progres (otomatis dari tools/gsb_release.py)
- de_A1: kartu #0–#101 selesai (102 kartu, 1530 kalimat, 102 penuh 15). Lanjut dari #102.
- de_A2: kartu #0–#92 selesai (93 kartu, 1395 kalimat, 93 penuh 15). Lanjut dari #93.
- de_B1: kartu #0–#133 selesai (134 kartu, 2010 kalimat, 134 penuh 15). Lanjut dari #134.
- eo_A1: kartu #0–#47 selesai (42 kartu, 517 kalimat, 2 penuh 15). Lanjut dari #48.
- eo_A2: kartu #0–#70 selesai (71 kartu, 887 kalimat, 5 penuh 15). Lanjut dari #71.
- eo_B1: kartu #0–#68 selesai (69 kartu, 1010 kalimat, 52 penuh 15). Lanjut dari #69.
- eo_B2: kartu #0–#47 selesai (48 kartu, 623 kalimat, 0 penuh 15). Lanjut dari #48.
- eo_C1: kartu #0–#32 selesai (33 kartu, 404 kalimat, 0 penuh 15). Lanjut dari #33.
- eo_C2: kartu #0–#41 selesai (42 kartu, 596 kalimat, 30 penuh 15). Lanjut dari #42.
- ja_N3: kartu #0–#181 selesai (182 kartu, 2717 kalimat, 169 penuh 15). Lanjut dari #182.
- ja_N4: kartu #0–#131 selesai (132 kartu, 1946 kalimat, 105 penuh 15). Lanjut dari #132.
- ja_N5: kartu #0–#83 selesai (84 kartu, 1260 kalimat, 84 penuh 15). Lanjut dari #84.
- nl_A1: kartu #0–#97 selesai (76 kartu, 1138 kalimat, 75 penuh 15). Lanjut dari #98.
- nl_A2: kartu #0–#122 selesai (123 kartu, 1687 kalimat, 48 penuh 15). Lanjut dari #123.
- nl_B1: kartu #0–#87 selesai (88 kartu, 1319 kalimat, 87 penuh 15). Lanjut dari #88.
- nl_B2: kartu #0–#87 selesai (88 kartu, 1293 kalimat, 80 penuh 15). Lanjut dari #88.
- nl_C1: kartu #0–#39 selesai (40 kartu, 600 kalimat, 40 penuh 15). Lanjut dari #40.
- zh_HSK1: kartu #0–#137 selesai (138 kartu, 1821 kalimat, 47 penuh 15). Lanjut dari #138.
- zh_HSK2: kartu #0–#210 selesai (211 kartu, 2594 kalimat, 0 penuh 15). Lanjut dari #211.
Kartu <15 kalimat:
- de_A1 <15: -
- de_A2 <15: -
- de_B1 <15: -
- eo_A1 <15: #6=14, #7=11, #8=14, #9=14, #10=12, #11=12, #12=11, #13=13, #14=13, #15=12, #16=13, #17=13, #18=13, #19=12, #20=12, #21=11, #22=12, #23=12, #24=12, #25=14, #26=13, #27=12, #28=11, #29=13, #30=8, #31=14, #32=13, #33=11, #34=13, #36=14, #38=10, #39=13, #40=12, #41=12, #42=11, #43=12, #44=11, #45=13, #46=7, #47=14
- eo_A2 <15: #0=9, #1=13, #2=11, #3=11, #4=11, #5=12, #6=9, #7=9, #8=8, #9=11, #10=12, #11=11, #12=12, #13=13, #14=13, #15=13, #16=11, #17=11, #18=11, #19=13, #20=12, #21=14, #22=11, #23=12, #24=12, #25=10, #26=10, #27=11, #28=14, #29=12, #30=11, #31=12, #32=11, #33=11, #34=12, #36=13, #37=13, #38=12, #39=13, #40=14, #41=14, #43=13, #44=14, #45=13, #46=14, #47=13, #48=14, #49=14, #50=14, #51=13, #52=13, #53=13, #54=14, #55=14, #56=14, #57=12, #58=14, #60=13, #61=13, #62=14, #63=12, #64=13, #65=14, #68=14, #69=13, #70=12
- eo_B1 <15: #0=13, #1=12, #2=13, #3=14, #4=14, #5=14, #6=14, #58=14, #59=14, #60=14, #61=14, #62=14, #63=14, #65=14, #66=13, #67=13, #68=12
- eo_B2 <15: #0=14, #1=13, #2=11, #3=14, #4=13, #5=12, #6=13, #7=13, #8=13, #9=12, #10=13, #11=13, #12=13, #13=13, #14=14, #15=12, #16=13, #17=9, #18=13, #19=13, #20=13, #21=13, #22=12, #23=13, #24=14, #25=12, #26=14, #27=13, #28=14, #29=13, #30=13, #31=14, #32=13, #33=14, #34=13, #35=14, #36=14, #37=14, #38=14, #39=13, #40=13, #41=12, #42=14, #43=13, #44=12, #45=13, #46=12, #47=13
- eo_C1 <15: #0=12, #1=14, #2=13, #3=12, #4=12, #5=13, #6=13, #7=11, #8=8, #9=13, #10=11, #11=14, #12=14, #13=14, #14=13, #15=11, #16=13, #17=13, #18=11, #19=11, #20=14, #21=13, #22=11, #23=12, #24=12, #25=12, #26=12, #27=13, #28=13, #29=11, #30=12, #31=12, #32=11
- eo_C2 <15: #0=12, #1=12, #2=12, #3=12, #4=12, #5=11, #6=12, #7=12, #18=14, #30=14, #37=12, #40=11
- ja_N3 <15: #0=14, #11=14, #22=14, #37=14, #38=14, #39=14, #40=14, #41=14, #42=14, #43=14, #95=14, #141=14, #146=14
- ja_N4 <15: #28=14, #29=14, #32=14, #36=13, #37=14, #45=14, #81=13, #82=13, #87=13, #88=14, #89=13, #90=14, #91=14, #93=13, #100=14, #101=14, #102=14, #106=14, #117=14, #118=13, #123=14, #124=14, #125=14, #128=14, #129=14, #130=14, #131=14
- ja_N5 <15: -
- nl_A1 <15: #48=13
- nl_A2 <15: #40=13, #41=13, #42=14, #43=14, #44=14, #45=14, #46=12, #47=12, #48=14, #49=12, #50=13, #52=14, #53=14, #54=13, #55=14, #56=14, #57=13, #59=14, #62=14, #66=14, #67=14, #68=14, #70=14, #71=14, #72=14, #73=13, #74=13, #75=12, #76=12, #77=14, #78=13, #79=13, #80=13, #81=13, #82=13, #83=13, #84=13, #85=14, #86=13, #87=14, #88=13, #89=13, #90=13, #91=11, #92=10, #93=11, #94=10, #95=9, #96=9, #97=11, #98=12, #99=13, #100=13, #101=12, #102=13, #103=13, #104=13, #105=13, #106=14, #107=13, #108=14, #109=13, #110=12, #111=13, #112=14, #113=13, #114=13, #115=12, #116=12, #117=12, #118=13, #119=13, #120=13, #121=14, #122=12
- nl_B1 <15: #82=14
- nl_B2 <15: #64=12, #65=12, #67=11, #76=12, #84=13, #85=11, #86=12, #87=10
- nl_C1 <15: -
- zh_HSK1 <15: #45=14, #46=14, #47=14, #48=14, #49=12, #50=14, #51=10, #52=13, #54=12, #55=14, #56=11, #57=9, #58=12, #59=12, #60=12, #61=13, #62=12, #63=6, #64=13, #66=13, #67=14, #68=12, #69=12, #70=11, #71=12, #72=12, #73=12, #74=12, #75=12, #76=12, #77=12, #78=13, #79=14, #80=12, #81=13, #82=12, #83=14, #84=13, #85=14, #86=12, #87=13, #88=13, #89=12, #90=11, #91=10, #92=10, #93=11, #94=12, #95=12, #96=12, #97=11, #98=13, #99=13, #100=13, #101=13, #102=10, #103=12, #104=11, #105=12, #106=12, #107=13, #108=13, #109=13, #110=13, #111=13, #112=12, #113=11, #114=11, #115=12, #116=13, #117=13, #118=12, #119=12, #120=12, #121=12, #122=13, #123=12, #124=13, #125=12, #126=12, #127=12, #128=12, #129=14, #130=13, #131=14, #132=12, #133=13, #134=13, #135=13, #136=11, #137=12
- zh_HSK2 <15: #0=12, #1=12, #2=11, #3=12, #4=11, #5=12, #6=8, #7=11, #8=12, #9=12, #10=12, #11=11, #12=14, #13=13, #14=13, #15=14, #16=14, #17=13, #18=13, #19=13, #20=14, #21=14, #22=14, #23=14, #24=14, #25=14, #26=14, #27=14, #28=14, #29=14, #30=14, #31=14, #32=13, #33=13, #34=14, #35=14, #36=14, #37=14, #38=14, #39=14, #40=14, #41=13, #42=14, #43=14, #44=13, #45=14, #46=13, #47=14, #48=14, #49=13, #50=14, #51=14, #52=14, #53=13, #54=13, #55=14, #56=14, #57=14, #58=14, #59=14, #60=14, #61=14, #62=13, #63=13, #64=13, #65=10, #66=12, #67=11, #68=8, #69=10, #70=9, #71=13, #72=13, #73=13, #74=12, #75=13, #76=13, #77=11, #78=12, #79=13, #80=13, #81=14, #82=13, #83=13, #84=13, #85=11, #86=13, #87=13, #88=12, #89=13, #90=12, #91=11, #92=12, #93=13, #94=10, #95=13, #96=12, #97=13, #98=13, #99=12, #100=12, #101=12, #102=13, #103=13, #104=12, #105=13, #106=13, #107=13, #108=13, #109=13, #110=13, #111=13, #112=12, #113=12, #114=12, #115=11, #116=10, #117=12, #118=12, #119=12, #120=12, #121=12, #122=12, #123=12, #124=12, #125=12, #126=12, #127=12, #128=12, #129=12, #130=12, #131=11, #132=10, #133=12, #134=11, #135=12, #136=11, #137=11, #138=10, #139=11, #140=12, #141=11, #142=11, #143=12, #144=12, #145=12, #146=11, #147=12, #148=11, #149=12, #150=12, #151=11, #152=12, #153=12, #154=12, #155=11, #156=12, #157=12, #158=12, #159=12, #160=12, #161=12, #162=12, #163=12, #164=12, #165=12, #166=11, #167=11, #168=12, #169=11, #170=11, #171=11, #172=11, #173=11, #174=12, #175=12, #176=12, #177=12, #178=12, #179=12, #180=11, #181=11, #182=12, #183=12, #184=12, #185=12, #186=11, #187=12, #188=12, #189=12, #190=11, #191=12, #192=12, #193=12, #194=12, #195=12, #196=12, #197=12, #198=12, #199=11, #200=12, #201=12, #202=12, #203=12, #204=12, #205=12, #206=12, #207=12, #208=12, #209=11, #210=12
Untuk Jerman/Jepang/dst: lihat isi kartu lewat `V.D.G.filter(g=>g[1]==L&&g[2]==lv)` (g[4] judul, g[5] penjelasan, g[7] contoh, g[10] tabel); `tools/gsb_next.py <bhs> "<level>"` juga bekerja untuk semua bahasa.

### ALUR HEMAT TOKEN (wajib; jangan menjalankan agen/subagen)
1. `python3 tools/gsb_next.py zh "HSK 1" 10` → daftar ringkas 10 kartu berikutnya (otomatis mulai dari kartu belum selesai). Jangan membaca ulang berkas sumber/zip/CHANGELOG.
2. Tulis SEMUA kalimat batch dengan SATU perintah `cat >> tools/gsb_src/<bhs>_<level>.txt <<'EOF' ...` (jangan Read/Edit berkas sumber besar).
3. `python3 tools/gsb_build.py zh | grep -E "!|gsb-"` → perbaiki hanya baris galat (pesan «kalimat ganda = baris N» menunjuk sumber duplikat). Perbaiki banyak baris sekaligus dengan satu skrip python (ganti per nomor baris).
4. zh: `python3 tools/gsb_lvl.py zh_HSK1.txt <baris_awal_batch>` → hanya kata di luar level; ganti bila tidak wajar.
5. Tutup batch dengan SATU perintah: `python3 tools/gsb_release.py "<ringkasan batch>"` (build, versi, CHANGELOG, semua tes, prompt baru, zip). Lalu SendUserFile zip + prompt dari /home/claude/out/ dan jawab SINGKAT (3–6 kalimat: kartu yang selesai, kartu <15, file).
6. Targetkan 10–12 kartu per batch bila token cukup; jangan membuat TaskCreate banyak, jangan narasi panjang, jangan memeriksa browser kecuali diminta.

### Pelajaran
- Kalimat ≥5 aksara agar lolos soal rumpang; kunci hanya SATU kali di kalimat (pola berulang seperti 有的…有的 → kunci rentang «有的X，有的»; hindari 我家/这家 bila kunci 家; 现在 mengandung 在).
- Jangan mengisi kalimat janggal demi 15; 6–14 natural lebih baik (catat otomatis oleh gsb_release).
- Kalimat tidak boleh sama persis dengan kalimat lain dalam satu berkas (galat «kalimat ganda»); kalimat sederhana (书在桌子上, 这是我的杯子, 我爸爸是医生, 你叫什么名字) sudah terpakai: variasikan subjek/kosakata.
- Kata di luar level kartu jangan dipakai (gsb_lvl.py membantu); kosakata kartu itu sendiri (别的, 半, 百, 页, 楼, 房子, 面包) boleh. Catatan: 饭馆 tercatat HSK2 di kamus aplikasi (dipakai di #45–#70; untuk HSK 1 baru, lebih baik 商店/饭店 sesuai contoh kartu).
- Kata baru tanpa pinyin → PIN_EXTRA (tools/gcl_build.py); nama diri → override {Pinyin}.
- Kartu tata bahasa umum (subjek/predikat/objek) → kunci = kata inti (kata kerja/sifat) agar tetap satu jawaban.
- tests/test_gsb.js memeriksa kunci sebagai SUBSTRING (bukan batas kata): kunci pendek seperti «bei»(Arbeit), «in»(einer, Minuten, Kind) gagal bila muncul di dalam kata lain → perpanjang kunci («bei der», «in einer») atau hindari kata itu. Audit: de_A2 punya 93 kartu (preposisi #58–#92 sisa 23 kartu mulai #70).
- Urutan prioritas: HSK1–2, de A1–B1, ja N5–N3, nl A1–A2, eo A1–B2 TUNTAS; eo C1 selesai (31 kartu, #0–#30). Berikutnya: eo C2, lalu nl B1+, zh HSK3+, ja N2+, de B2+, en. Tulis kunci di tengah kalimat (bukan kapital awal) agar tes substring case-sensitive lolos.
- Kunci pendek untuk eo (se, iam, ial, iel, iom, ja, mem, ajn): substring bisa tersangkut di kata lain (tiam/ĉiam/neniam ⊃ iam; kial/tial/nenial ⊃ ial; kiel/tiel/ĉielo ⊃ iel; neniom/kiom ⊃ iom; jaro/trajno ⊃ ja/ajn; -ajn akusatif jamak ⊃ ajn). Hindari kata itu di kalimat sama, atau pakai kunci 2 kata («se vi», «se la suno»). Kalimat ganda antar kartu juga dicek (galat «kalimat ganda»).


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
