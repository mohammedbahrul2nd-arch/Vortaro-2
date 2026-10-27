# Riwayat Perubahan

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
