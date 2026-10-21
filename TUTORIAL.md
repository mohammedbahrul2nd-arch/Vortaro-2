# Tutorial Lengkap Vortaro — dari Nol sampai Jadi Aplikasi di HP

Tutorial ini mengasumsikan kamu **belum pernah memakai GitHub**. Total waktu sekitar 15 menit.
Hasil akhirnya: Vortaro terpasang di HP seperti aplikasi biasa, jalan offline, dan mengingatkanmu menghafal.

**Daftar isi**
1. [Gambaran singkat](#1-gambaran-singkat)
2. [Buat akun GitHub](#2-buat-akun-github)
3. [Buat repositori & unggah file](#3-buat-repositori--unggah-file)
4. [Aktifkan GitHub Pages (jadi website)](#4-aktifkan-github-pages-jadi-website)
5. [Pasang di HP / komputer](#5-pasang-di-hp--komputer)
6. [Pindahkan progres dari file lama](#6-pindahkan-progres-dari-file-lama)
7. [Atur pengingat hafalan](#7-atur-pengingat-hafalan)
8. [Pengingat yang andal (ntfy)](#8-pengingat-yang-andal-ntfy)
9. [Memperbarui aplikasi](#9-memperbarui-aplikasi)
10. [Cara pakai dengan Git (opsional)](#10-cara-pakai-dengan-git-opsional)
11. [Pemecahan masalah](#11-pemecahan-masalah)
12. [Jujur soal batasan notifikasi](#12-jujur-soal-batasan-notifikasi)

---

## 1. Gambaran singkat

- **GitHub** = tempat menyimpan file proyek (repositori) secara online.
- **GitHub Pages** = fitur gratis GitHub yang mengubah repositori jadi website, mis. `https://namamu.github.io/vortaro/`.
- **PWA** = website yang bisa dipasang ke layar utama, punya ikon sendiri, dan jalan offline. Inilah "aplikasi" Vortaro. Tidak perlu Play Store / App Store, tidak ada biaya.

Isi proyek (sudah kamu terima dalam bentuk folder/zip):

```
vortaro/
├─ docs/                  ← seluruh aplikasi (inilah yang di-publish)
├─ .github/workflows/     ← pengingat opsional lewat ntfy (bagian 8)
├─ README.md
└─ TUTORIAL.md            ← file ini
```

> **Penting:** data belajarmu (progres kartu) disimpan **di browser/HP-mu sendiri**, bukan di GitHub. Jadi repositori boleh publik tanpa membocorkan progres. Konsekuensinya: sering-seringlah menekan tab **Atur → Cadangkan progres**.

---

## 2. Buat akun GitHub

1. Buka <https://github.com/signup>.
2. Isi email, password, dan username. **Username ini akan jadi bagian alamat aplikasimu** (`username.github.io`), jadi pilih yang rapi.
3. Verifikasi email yang dikirim GitHub, lalu masuk.

---

## 3. Buat repositori & unggah file

1. Setelah masuk, klik tombol **+** di kanan atas → **New repository**.
2. Isi:
   - **Repository name:** `vortaro` (huruf kecil semua; ini jadi bagian alamat).
   - **Public** (pilih ini; GitHub Pages gratis memerlukan repositori publik).
   - Jangan centang apa pun lainnya. Klik **Create repository**.
3. Di halaman repositori yang masih kosong, klik tautan **uploading an existing file**.
4. **Ekstrak** zip `vortaro.zip` di komputermu, lalu **seret isi foldernya** (`docs`, `.github`, `README.md`, `TUTORIAL.md`, `.gitignore`) ke area unggah di browser.
   - Folder `.github` bernama diawali titik sehingga **tersembunyi** di beberapa sistem. Windows: Explorer → *View* → centang *Hidden items*. Mac: tekan `Cmd + Shift + .` di Finder.
   - Kalau `.github` susah diseret, **lewati saja** — folder ini hanya dipakai untuk pengingat ntfy (bagian 8) dan bisa ditambahkan belakangan.
5. Tunggu semua file selesai terunggah (file `data.js` ±3 MB, wajar agak lama di sinyal lemah).
6. Gulir ke bawah, klik tombol hijau **Commit changes**.

Cek: di halaman repositori harus terlihat folder `docs`, dan di dalamnya ada `index.html`, `sw.js`, `css`, `js`, `icons`.

> **Alternatif tanpa seret-lepas:** pakai Git (bagian 10).

---

## 4. Aktifkan GitHub Pages (jadi website)

1. Di repositori, klik tab **Settings** (ikon roda gigi).
2. Menu kiri → **Pages**.
3. Di bagian **Build and deployment** → **Source:** pilih **Deploy from a branch**.
4. **Branch:** pilih `main`, lalu folder **`/docs`** (bukan `/ (root)`), klik **Save**.
5. Tunggu 1–3 menit, muat ulang halaman Settings → Pages. Muncul kotak:
   *"Your site is live at `https://USERNAME.github.io/vortaro/`"*.
6. Klik **Visit site**. Vortaro seharusnya terbuka. 🎉

Catat alamat itu — itulah aplikasimu.

---

## 5. Pasang di HP / komputer

Buka alamat Vortaro di browser, **tunggu sampai halaman termuat penuh sekali** (agar file tersimpan untuk offline), lalu:

**Android (Chrome)** — cara yang paling direkomendasikan
1. Buka alamatnya di **Chrome**.
2. Buka tab **Atur → Aplikasi Vortaro → Pasang Vortaro** (tombol ini muncul otomatis), *atau* menu **⋮ → Instal aplikasi**.
3. Ikon Vortaro (huruf V dengan bintang hijau) muncul di layar utama.

**iPhone / iPad (Safari)**
1. Buka alamatnya di **Safari** (bukan Chrome).
2. Ketuk **Bagikan** (kotak dengan panah) → **Tambah ke Layar Utama** → **Tambah**.
3. Selalu buka lewat ikon itu. (Untuk pengingat di iPhone, baca bagian 8.)

**Komputer (Chrome / Edge)**
- Klik ikon **Instal** di ujung kanan kolom alamat, atau menu **⋮ → Simpan dan bagikan → Instal Vortaro**.

Setelah terpasang, Vortaro bisa dibuka **tanpa internet**.

---

## 6. Pindahkan progres dari file lama

Progres di file `kosakata_flashcard.html` lama tersimpan di browser terpisah, jadi tidak otomatis ikut. Pindahkan manual (sekali saja):

1. Buka **file lama** (`kosakata_flashcard.html` atau `kosakata_flashcard_v3.html`) seperti biasa → tab **Atur** → **Cadangkan progres (unduh JSON)**. File `progres-kosakata.json` terunduh.
2. Buka **Vortaro** (yang sudah terpasang) → tab **Atur** → bagian cadangan → pilih berkas tadi pada kolom file (impor).
3. Cek tab **Stat**: jumlah kartu & aktivitas harus sudah muncul.

---

## 7. Atur pengingat hafalan

1. Buka Vortaro → tab **Atur** → kartu **🔔 Pengingat hafalan**.
2. Ketuk **Aktifkan pengingat** → saat browser bertanya, pilih **Izinkan**.
   (Kamu juga akan melihat ajakan yang sama di tab **Kartu**.)
3. Atur **jam pengingat** — sampai 3 jam per hari (default 19:00). Kosongkan kolom untuk menonaktifkan satu jam.
4. **"Hanya ingatkan jika masih ada kartu…"** (default aktif): pengingat tidak berbunyi kalau semua kartu hari ini sudah kamu selesaikan.
5. Ketuk **Kirim notifikasi uji** untuk memastikan notifikasi muncul.

Isi notifikasi mengikuti jadwal belajarmu, misalnya:
> **Vortaro · Waktunya hafalan** — 12 kartu ulasan + 20 kata baru menunggumu hari ini. Jaga rentetan 5 harimu!

Ketuk notifikasi → Vortaro terbuka langsung di tab **Kartu**. Lencana angka oranye di tab **Kartu** juga menunjukkan sisa kartu hari ini.

Sebagai tambahan, kalau Vortaro sedang terbuka tepat pada jam pengingat, yang muncul adalah **banner** di bagian atas layar (bukan notifikasi sistem).

---

## 8. Pengingat yang andal (ntfy)

Pengingat bawaan (bagian 7) berjalan di dalam browser, sehingga **ketepatan waktunya bergantung pada HP dan browser-mu** (lihat bagian 12). Kalau kamu ingin pengingat harian yang **pasti datang walau Vortaro tidak dibuka** — termasuk di iPhone — pakai ntfy.sh, layanan notifikasi gratis. GitHub yang akan mengirim "ping" setiap hari.

**Langkah:**

1. Pasang aplikasi **ntfy** (Android: Play Store/F-Droid; iPhone: App Store).
2. Pilih nama topik yang **panjang dan acak** sebagai "kata sandi", mis. `vortaro-7k2m9xq4pz-bahrul`. Siapa pun yang tahu nama topik bisa membaca/mengirim ke topik itu, jadi jangan pakai nama yang mudah ditebak.
3. Di aplikasi ntfy: **+** → *Subscribe to topic* → ketik nama topikmu.
4. Di GitHub, repositori `vortaro` → **Settings → Secrets and variables → Actions → New repository secret**:
   - **Name:** `NTFY_TOPIC`
   - **Secret:** nama topikmu → **Add secret**.
5. Pastikan folder `.github/workflows/reminder-ntfy.yml` ada di repositori (lihat bagian 3 langkah 4).
6. Tes: tab **Actions** → *Pengingat harian (ntfy)* → **Run workflow**. Dalam hitungan detik, notifikasi masuk ke HP. Ketuk notifikasi → Vortaro terbuka di tab Kartu.

**Mengubah jam:** buka `.github/workflows/reminder-ntfy.yml`, ubah baris `cron`. Jam di sana memakai **UTC**; WIB = UTC+7 (jadi 19:00 WIB = `0 12`). Format: `menit jam * * *`.

Catatan: GitHub kadang menunda jadwal beberapa menit. Pada repositori publik, jadwal otomatis dijeda bila **60 hari tanpa aktivitas** repositori — cukup lakukan satu commit kecil atau tekan **Enable workflow** di tab Actions. Pesan ntfy bersifat umum (tidak tahu jumlah kartu); untuk jumlah kartu yang akurat, andalkan pengingat bawaan.

---

## 9. Memperbarui aplikasi

### 9a. Naik ke Vortaro 4.0

Versi 4.0 menambah bahasa Belanda, Bacaan Esperanto, taksonomi grammar, dan penyempurnaan lain dari `kosakata_flashcard` v4.8 (lihat [CHANGELOG.md](CHANGELOG.md)). Alamat aplikasimu **tidak berubah** (`https://USERNAME.github.io/vortaro/`) karena repositorinya sama.

**Lewat web GitHub (tanpa Git):**
1. Ekstrak `vortaro-v4.zip`.
2. Di repositori `vortaro` → **Add file → Upload files**.
3. Seret isi folder `vortaro` hasil ekstrak (`docs`, `.github`, `README.md`, `TUTORIAL.md`, `CHANGELOG.md`, `.gitignore`) ke area unggah. File dengan nama sama akan tertimpa.
4. **Commit changes**. Buka tab **Actions** (atau Settings → Pages) dan tunggu 1–3 menit sampai deploy selesai.
5. Buka alamat Vortaro-mu. Di HP: **Atur → Cek pembaruan aplikasi**.

**Lewat Git:**
```bash
cd vortaro            # folder repositori-mu
# salin isi zip v4 ke sini (timpa file lama), lalu:
git add -A
git commit -m "Vortaro 4.0: bahasa Belanda + Bacaan Esperanto"
git push
```

Progres belajarmu tetap aman, termasuk dari 2.0 maupun 1.0. Bila masih memakai format lama (per kartu), pada pembukaan pertama progres otomatis disalin menjadi progres **per bahasa** untuk bahasa yang aktif di filter, dan versi lamanya disimpan sebagai cadangan di dalam data aplikasi. Lihat **Atur → Progres per bahasa** bila ingin menerapkannya ke bahasa lain.

> Tips: sebelum memperbarui, tekan **Atur → Cadangkan progres** dulu.

### 9b. Pembaruan biasa

Untuk mengubah sesuatu (mis. menambah kosakata di `docs/js/data.js`):

1. Di GitHub, buka file-nya → ikon ✏️ **Edit** (atau **Add file → Upload files** untuk menimpa file).
2. Klik **Commit changes**. Tunggu 1–3 menit sampai Pages memperbarui situs.
3. Di HP, buka Vortaro → **Atur → Cek pembaruan aplikasi**. (Atau tutup-buka aplikasi dua kali.)
4. Agar semua perangkat pasti mengambil versi baru, ubah angka `VERSION` di baris atas `docs/sw.js` (mis. `1.0.1`).

Progres belajarmu **tidak terhapus** saat aplikasi diperbarui.

---

## 10. Cara pakai dengan Git (opsional)

Untuk yang nyaman dengan terminal:

```bash
cd vortaro
git init -b main
git add .
git commit -m "Vortaro: versi pertama"
git remote add origin https://github.com/USERNAME/vortaro.git
git push -u origin main
```

Lalu lanjut ke bagian 4. Untuk pembaruan berikutnya: ubah file → `git add . && git commit -m "pesan" && git push`.

---

## 11. Pemecahan masalah

| Gejala | Penyebab & solusi |
|---|---|
| Alamat menampilkan **404** | Pages belum aktif atau folder salah. Cek **Settings → Pages**: branch `main`, folder `/docs`. Tunggu 3 menit. |
| Halaman putih / tulisan kacau | File belum lengkap terunggah. Pastikan `docs/js/data.js`, `app.js`, `css/app.css` ada. Muat ulang paksa (`Ctrl+Shift+R`). |
| Tombol **Pasang Vortaro** tidak muncul | Gunakan Chrome (Android) / Safari (iPhone). Pastikan alamat berawalan `https://`. Jika sudah terpasang, tombol memang tidak tampil. |
| Notifikasi tidak muncul | **Atur** → lihat daftar status di kartu pengingat. Jika "diblokir": Chrome → ⋮ → *Info situs/Setelan situs* → Notifikasi → Izinkan, lalu aktifkan lagi. Cek juga mode hemat baterai & "Jangan ganggu". |
| Progres hilang | Data ada di browser. Terhapus jika kamu *clear site data*, ganti browser, atau memakai alamat berbeda. Impor cadangan JSON (bagian 6). |
| Tampilan lama setelah update | **Atur → Cek pembaruan aplikasi**, atau naikkan `VERSION` di `sw.js`. |
| Aksi ntfy tidak jalan | Pastikan secret bernama persis `NTFY_TOPIC`, topik di aplikasi ntfy sama persis, dan workflow tidak dinonaktifkan di tab Actions. |

---

## 12. Jujur soal batasan notifikasi

Vortaro tidak memakai server sendiri (supaya gratis dan privat). Konsekuensinya:

| Perangkat | Yang terjadi |
|---|---|
| **Android, Chrome, aplikasi terpasang** | Notifikasi tepat waktu saat aplikasi masih di memori/di-minimize. Jika sudah ditutup total, Chrome *kadang* memicu pengingat latar belakang (Periodic Background Sync) — **waktunya diatur Chrome**, bisa telat beberapa jam, dan hanya untuk situs yang sering kamu pakai. |
| **iPhone / iPad** | Web app tidak bisa menjalankan tugas terjadwal di latar belakang tanpa server push. Pengingat bawaan hanya berupa banner saat aplikasi terbuka. **Gunakan ntfy (bagian 8).** |
| **Komputer** | Notifikasi hanya jika browser sedang berjalan. |

Intinya: pengingat bawaan = bantuan "lumayan"; **ntfy = jaminan harian**. Keduanya bisa dipakai bersamaan.

Selamat menghafal! 🌟
