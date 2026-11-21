/* ===== Soal AI per game (v7.101.0) =====
   «➕ Soal AI» ada di pengaturan SETIAP game (hub Games → game → Pengaturan game). Fungsi: menambah soal baru ke game itu lewat prompt AI.
   Alur: pilih LEVEL MAKSIMUM (keras) + jumlah soal → salin prompt → tempel hasil AI → soal masuk ke GXO(game).aq
   {u, q:[kalimat ___, jawaban, terjemah, petunjuk, romanisasi, pengecoh terlarang], lv}. Kunci SRS 'aq|<game>|<u>' (di S.gg).
   Soal tambahan dimainkan oleh mesin game itu sendiri (games2.js gxItems/gxNext, games3.js vgNext → aqMake): bentuk soal rumpang
   (pilih atau ketik). Prompt memuat aturan khusus game (AQT), contoh per bahasa, dan batas level keras (ACZ[L].up, ai-cloze.js).
   Game Grammar Cloze (gcl_xx) memakai alur per-kartu di ai-cloze.js (aczOpen); tombolnya sama («➕ Soal AI»).
   Format impor (satu soal = satu baris, 7 kolom): kalimat ___ | jawaban(~alt;celah) | terjemah | petunjuk | romanisasi | pengecoh terlarang | level */
const AQMAX=200;
/* kata angka per bahasa (pengecoh untuk soal angka/jam/harga); dinormalisasi gcNorm */
const AQNUM={zh:'一 二 三 四 五 六 七 八 九 十 百 千 万 两 半 零'.split(' '),ja:'一 二 三 四 五 六 七 八 九 十 百 千 万 いち に さん よん ご ろく なな はち きゅう じゅう ひゃく せん まん'.split(' '),de:'eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf zwanzig dreißig vierzig fünfzig hundert tausend'.split(' '),nl:'een twee drie vier vijf zes zeven acht negen tien elf twaalf twintig dertig veertig vijftig honderd duizend'.split(' '),en:'one two three four five six seven eight nine ten eleven twelve twenty thirty forty fifty hundred thousand'.split(' '),eo:'unu du tri kvar kvin ses sep ok naŭ dek dudek tridek kvardek kvindek cent mil unua dua tria kvara kvina sesa'.split(' ')};
const AQLV=L=>(typeof GCV!='undefined'&&GCV[L])||[];
const AQN=s=>String(s==null?'':s).toUpperCase().replace(/\s+/g,'');
const aqMeta=g=>(typeof GXL!='undefined'?GXL:[]).find(z=>z.id==g)||null;
const aqLang=g=>{const m=aqMeta(g);return m?m.lg:''};
const aqFam=g=>{const m=/^(num|dt|px|shd|scl|gcl)_/.exec(g);return m?m[1]:g};
/* aturan khusus game + contoh (6 kolom pertama; kolom 7 = level terendah bahasa, ditambahkan otomatis). ex '' = pakai contoh umum ACZ[L].ex */
const AQT={
 gen:['Game «Tebak Gender Jerman»: pemain memilih artikel yang benar (der/die/das) untuk sebuah kata benda. Soal = kalimat Nominativ dengan celah TEPAT di artikel tentu (Der/Die/Das) di depan kata benda yang diuji. Pakai kata benda umum dengan gender yang pasti (jangan yang gendernya ganda/diperdebatkan); variasikan ketiga gender dan akhiran khas (-ung, -heit, -chen, -er, -ment…). Sebut kata bendanya di petunjuk.',['___ Haus ist sehr groß.','Das','Rumah itu sangat besar.','kata benda: Haus','','']],
 gnl:['Game «Tebak Gender Belanda»: pemain memilih artikel de atau het untuk kata benda Belanda. Soal = kalimat dengan celah TEPAT di artikel tentu (De/Het) di depan kata benda tunggal yang diuji (bukan jamak/diminutif yang membingungkan). Kata benda umum dengan de/het yang pasti. Sebut kata bendanya di petunjuk.',['___ huis is erg groot.','Het','Rumah itu sangat besar.','kata benda: huis','','']],
 zcl:['Game «Penggolong Mandarin» (量词): pemain memilih penggolong yang tepat untuk sebuah benda. Soal = kalimat dengan angka/指示词 + celah penggolong + benda. Celah HANYA penggolongnya. Daftarkan semua penggolong yang sah dengan “~” (mis. 个~口 hanya bila keduanya benar). Variasikan benda: orang, hewan, buku, kendaraan, minuman, pakaian, tempat.',['我 买 了 三 ___ 书。','本','Saya membeli tiga buku.','penggolong untuk buku','Wǒ mǎi le sān běn shū.','']],
 dad:['Game «Artikel & Akhiran Jerman»: pemain memilih artikel (der/den/dem/des, ein/einen/einem/eines) atau akhiran adjektiva menurut kasus. Soal = kalimat dengan celah di artikel atau akhiran (celah akhiran = kata utuh yang berakhiran itu). Variasikan Nominativ/Akkusativ/Dativ/Genitiv dan gender. Daftarkan semua bentuk sah (dem~einem).',['Ich gebe ___ Mann das Buch.','dem~einem','Saya memberikan buku itu kepada pria itu.','Dativ maskulin','','']],
 dnl:['Game «Artikel & Akhiran Belanda»: pemain memilih de/het/een, dit/dat/deze/die, atau adjektiva dengan/tanpa -e. Soal = kalimat dengan celah di artikel, penunjuk, atau adjektiva berakhiran. Sebut kata benda dan jenis de/het di petunjuk. Daftarkan semua bentuk sah (het~een).',['Ik heb ___ boek gelezen.','het~een','Saya sudah membaca buku itu.','artikel di depan het-woord','','']],
 phv:['Game «Phrasal Verbs Inggris»: pemain memilih partikel yang tepat untuk sebuah phrasal verb. Soal = kalimat dengan celah di PARTIKEL (up, out, off, on, in, over, down, away, after, with…) dan terjemahan yang memuat artinya. Pakai phrasal verb umum sesuai level; sebut verba dasarnya di petunjuk.',['Never give ___ on your dreams.','up','Jangan pernah menyerah pada mimpimu.','give up = menyerah','','']],
 dtv:['Game «Trennbar & Untrennbar Jerman»: kata kerja berprefiks terpisah (anrufen) vs tak terpisah (besuchen). Soal = kalimat dengan celah di bentuk finit + prefiks terpisah (2 celah: “rufe;an”), atau Partizip II / zu-Infinitiv, atau prefiks saja. Sebut infinitifnya di petunjuk. Campur trennbar dan untrennbar.',['Ich ___ dich morgen ___ .','rufe;an','Besok aku akan meneleponmu.','anrufen (terpisah): verba finit lalu prefiks','','']],
 num:['Game «Menyebutkan nomor»: angka, nomor telepon, tahun, desimal, pecahan, ordinal. Soal = kalimat dengan celah berisi ANGKA yang ditulis dengan KATA/aksara bahasa itu (bukan digit). Angkanya WAJIB disebut dalam digit di terjemahan atau petunjuk (mis. “angka 20”) agar jawaban pasti. Variasikan: usia, jumlah, nomor rumah, tahun, urutan (ordinal), pecahan.',{zh:['我 家 有 ___ 口 人。','四','Keluargaku ada empat orang.','angka 4','Wǒ jiā yǒu sì kǒu rén.',''],ja:['この 本は ___円です。','三百~さんびゃく','Buku ini tiga ratus yen.','angka 300','Kono hon wa sanbyaku en desu.',''],de:['Ich bin ___ Jahre alt.','zwanzig','Umur saya dua puluh tahun.','angka 20','',''],nl:['Ik ben ___ jaar oud.','twintig','Umur saya dua puluh tahun.','angka 20','',''],en:['I am ___ years old.','twenty','Umur saya dua puluh tahun.','angka 20','',''],eo:['Mi havas ___ librojn.','dek','Saya punya sepuluh buku.','angka 10','','']}],
 dt:['Game «Jam & tanggal»: jam penuh, menit, kuartal/setengah, format 24 jam, tanggal, hari, bulan, tahun. Soal = kalimat dengan celah berisi kata waktu (angka jam/menit, nama hari/bulan, kata urutan tanggal) yang ditulis dengan kata/aksara bahasa itu. Waktu/tanggalnya WAJIB disebut dalam digit di terjemahan (mis. “pukul 03.30”) agar jawaban pasti.',{zh:['现在 是 ___ 点 半。','三','Sekarang pukul 03.30.','jam 3','Xiànzài shì sān diǎn bàn.',''],ja:['今、___時半です。','三~さん','Sekarang pukul 03.30.','jam 3','Ima, sanji han desu.',''],de:['Es ist halb ___ .','vier','Sekarang pukul 03.30 (setengah menuju jam empat).','halb + jam berikutnya','',''],nl:['Het is half ___ .','vier','Sekarang pukul 03.30.','half + jam berikutnya','',''],en:['It is half past ___ .','three','Sekarang pukul 03.30.','pukul 3','',''],eo:['Estas la ___ horo.','tria','Sekarang jam tiga.','bilangan urutan 3','','']}],
 px:['Game «Harga & satuan»: harga & mata uang, satuan ukur, kasir (kembalian), diskon, jumlah belanja. Soal = kalimat belanja/ukuran dengan celah berisi angka harga/jumlah (ditulis dengan kata/aksara) atau satuan. Nilainya WAJIB disebut dalam digit di terjemahan atau petunjuk agar jawaban pasti.',{zh:['这 个 苹果 ___ 块 钱。','五','Apel ini lima yuan.','harga 5','Zhè ge píngguǒ wǔ kuài qián.',''],ja:['この りんごは ___円です。','百~ひゃく','Apel ini seratus yen.','harga 100','Kono ringo wa hyaku en desu.',''],de:['Der Apfel kostet ___ Euro.','zwei','Apel itu harganya dua euro.','harga 2','',''],nl:['De appel kost ___ euro.','twee','Apel itu harganya dua euro.','harga 2','',''],en:['The apple costs ___ dollars.','two','Apel itu harganya dua dolar.','harga 2','',''],eo:['La pomo kostas ___ eŭrojn.','du','Apel itu harganya dua euro.','harga 2','','']}],
 shd:['Game «Shadowing»: pemain mendengar kalimat lalu menirukannya. Soal = kalimat pendek–sedang yang natural dan enak diucapkan, dengan celah satu kata isi (kata benda/kata kerja/sifat) yang bisa ditebak dari konteks dan terjemahan. Setelah dijawab, kalimat penuh dibacakan untuk ditirukan, jadi buat kalimat yang berguna sehari-hari.',''],
 scl:['Game «Speaking Cloze» (Susun kalimat): pemain menerjemahkan kalimat Indonesia secara lisan dengan kerangka segmen. Soal = kalimat natural yang jelas terbagi segmen, celah = satu segmen kunci (kata isi atau struktur) yang bisa diturunkan dari terjemahan. Variasikan pola kalimat (tanya, negatif, waktu, tujuan).',''],
 jcn:['Game «Penghitung Jepang 助数詞»: 本・枚・匹・杯・個・人・冊・台… Soal = kalimat dengan angka + celah penggolong (mis. 二___), benda jelas dari terjemahan. Daftarkan kanji dan kana (匹~ひき). Perhatikan perubahan bunyi (いっぽん・さんぼん) hanya bila celah memuat angka+penggolong utuh.',['私は 犬を 二___ 飼っています。','匹~ひき','Saya memelihara dua ekor anjing.','penggolong hewan kecil','Watashi wa inu o nihiki katte imasu.','']],
 kas:['Game «Kasus Jerman»: Nominativ · Akkusativ · Dativ · Genitiv — preposisi, verba + objek, verba + preposisi, Wechselpräposition (wo?/wohin?), kata tanya. Soal = kalimat dengan celah di artikel/pronomen/preposisi yang menentukan kasus. Sebut aturan kasusnya di petunjuk (mis. “helfen + Dativ”). Daftarkan semua bentuk sah (der~einer).',['Ich helfe ___ Frau.','der~einer','Saya membantu wanita itu.','helfen + Dativ','','']],
 dtn:['Game «Trennbar & Untrennbar Belanda»: scheidbaar (opbellen) vs onscheidbaar (bezoeken). Soal = kalimat dengan celah di prefiks terpisah, bentuk finit, voltooid deelwoord, atau te-infinitief. Sebut infinitifnya di petunjuk. Campur scheidbaar dan onscheidbaar.',['Ik bel mijn oma elke dag ___ .','op','Saya menelepon nenekku setiap hari.','opbellen (scheidbaar): prefiks di akhir','','']],
 pve:['Game «Preposisi Verba & Adjektiva Inggris»: listen to, wait for, depend on, succeed in · afraid of, good at, proud of, married to… Soal = kalimat dengan celah di PREPOSISI yang diminta verba/adjektiva. Sebut verba/adjektivanya di petunjuk. Daftarkan alternatif sah hanya bila benar-benar sama maknanya.',['I\'m looking forward ___ meeting you.','to','Saya menantikan pertemuan denganmu.','look forward to','','']],
 pvd:['Game «Preposisi Verba & Adjektiva Jerman»: warten auf, sich freuen über, kämpfen gegen · stolz auf, zufrieden mit, verliebt in… Soal = kalimat dengan celah di PREPOSISI yang diminta verba/adjektiva (kasus mengikuti). Sebut verba/adjektivanya di petunjuk.',['Ich warte ___ den Bus.','auf','Saya menunggu bus.','warten auf + Akkusativ','','']],
 pvn:['Game «Preposisi Verba & Adjektiva Belanda»: wachten op, kijken naar, houden van · bang voor, trots op, blij met… Soal = kalimat dengan celah di PREPOSISI yang diminta verba/adjektiva. Sebut verba/adjektivanya di petunjuk.',['Ik wacht ___ de bus.','op','Saya menunggu bus.','wachten op','','']],
 gcl:['Game «Grammar Cloze»: soal rumpang untuk poin grammar (dipakai alur per-kartu).','']};
const aqTopic=g=>(AQT[aqFam(g)]||[''])[0];
function aqEx(g){const L=aqLang(g),e=(AQT[aqFam(g)]||[])[1];let c=null;
 if(Array.isArray(e))c=e;else if(e&&typeof e=='object')c=e[L];
 if(!c)c=String((ACZ[L]||{}).ex||'').split('|').map(x=>x.trim()).slice(0,6);
 while(c.length<6)c.push('');return c.slice(0,6).join(' | ')+' | '+(AQLV(L)[0]||'')}
/* level yang boleh dipilih untuk game g = level bahasa itu */
const aqLevels=g=>AQLV(aqLang(g));
const aqO=()=>{const o=S.o;if(!o.aqN)o.aqN=20;if(!o.aqCap||typeof o.aqCap!='object')o.aqCap={};return o};
const aqList=g=>{try{const o=GXO(g);return Array.isArray(o.aq)?o.aq:[]}catch(e){return[]}};
const aqCount=g=>/^gcl_/.test(g)&&typeof aczCount=='function'?aczCount(g.slice(4)).q:aqList(g).length;
const aqGames=()=>(typeof GXL!='undefined'?GXL:[]).filter(m=>ACZ[m.lg]).map(m=>m.id);
const AQTH=['rumah & keluarga','sekolah & belajar','kantor & pekerjaan','makanan & restoran','belanja & uang','transportasi & perjalanan','kesehatan & dokter','cuaca & musim','hobi & olahraga','teknologi & ponsel','kota & alamat','liburan & hotel','teman & pesta','berita & budaya'];
/* ---------- prompt ---------- */
/* blok ATURAN LEVEL keras (dipakai prompt soal rumpang & prompt kalimat natural) */
function aqLvBlock(L,capIdx){const A=ACZ[L],v=AQLV(L),cap=v[capIdx],allow=v.slice(0,capIdx+1),hi=v.slice(capIdx+1),forb=hi.map(x=>`${x}: ${A.up[x]}`),mine=allow.map(x=>`${x}: ${A.up[x]}`);
 return[`ATURAN LEVEL (WAJIB & KERAS):`,
  `1. Level yang boleh dipakai: ${allow.join(', ')}. Dilarang keras ada unsur di atas ${cap}${hi.length?' ('+hi.join(', ')+')':''} — baik tata bahasa, kosakata, maupun ungkapan.`,
  hi.length?`2. Struktur yang baru muncul di level lebih tinggi sehingga DILARANG:\n   ${forb.join('\n   ')}`:`2. ${cap} adalah level tertinggi bahasa ini; tetap pakai kalimat yang jelas dan natural.`,
  `3. Struktur yang boleh dipakai sebagai kerangka (≤ ${cap}):\n   ${mine.join('\n   ')}`,
  `4. Bila ragu apakah sebuah kata atau struktur melebihi ${cap}, GANTI dengan yang lebih sederhana.`].join('\n')}
function aqBuild(g,capIdx,N,themes){const m=aqMeta(g),L=m.lg,A=ACZ[L],nm=GCN[L],v=AQLV(L),cap=v[capIdx],allow=v.slice(0,capIdx+1),hi=v.slice(capIdx+1),forb=hi.map(x=>`${x}: ${A.up[x]}`),mine=allow.map(x=>`${x}: ${A.up[x]}`);
 const have=aqList(g).slice(-12).map(x=>String(x.q[0]).replace(/\s+/g,' '));
 const th=(themes&&themes.length?themes:AQTH.slice(0,3)).join(', ');
 const nat=`PRIORITAS TERTINGGI: KALIMAT NATURAL (mengalahkan aturan lain di bawah, kecuali aturan LEVEL dan FORMAT).\nSetiap kalimat soal harus benar-benar natural: akan diucapkan atau ditulis penutur asli dalam situasi nyata, masuk akal secara makna dan logika, pilihan kata dan kolokasinya wajar, bukan terjemahan harfiah. Lebih baik jumlah soal berkurang daripada ada satu soal yang janggal. Jumlah soal yang diminta hanyalah MAKSIMUM: bila sebuah kartu tidak bisa dibuatkan kalimat yang natural (apalagi dengan tepat satu jawaban benar), buat lebih sedikit soal untuk kartu itu atau lewati kartu itu, dan jangan memaksakan. Sebelum menjawab, periksa tiap kalimat: “Apakah penutur asli benar-benar akan mengatakannya begini?” Bila tidak atau ragu, tulis ulang atau buang.`;
 const head=`Buatkan sampai ${N} soal TAMBAHAN (boleh lebih sedikit demi kalimat yang natural) untuk game «${m.t}» (${m.d}) bahasa ${nm}, untuk penutur Indonesia. Level MAKSIMUM yang kupilih: ${cap}.`;
 const gm=`ATURAN GAME (soal harus cocok dengan permainan ini):\n${aqTopic(g)}\nBentuk soal selalu kalimat rumpang: kalimat ${nm} utuh dengan celah “___”; pemain memilih atau mengetik bagian yang rumpang.`;
 const lv=[`ATURAN LEVEL (WAJIB & KERAS — soal yang melanggar akan DITOLAK otomatis oleh aplikasi):`,
  `1. Level yang boleh dipakai: ${allow.join(', ')}. Dilarang keras ada unsur di atas ${cap}${hi.length?' ('+hi.join(', ')+')':''} — baik tata bahasa, kosakata, maupun ungkapan.`,
  hi.length?`2. Struktur yang baru muncul di level lebih tinggi sehingga DILARANG di kalimatmu (di luar celah pun):\n   ${forb.join('\n   ')}`:`2. ${cap} adalah level tertinggi bahasa ini; tetap pakai kalimat yang jelas dan natural.`,
  `3. Struktur yang boleh dipakai sebagai kerangka (≤ ${cap}):\n   ${mine.join('\n   ')}`,
  `4. Kosakata: pilih kata paling umum dan sederhana (level ≤ ${cap}). Bila ragu apakah sebuah kata atau struktur melebihi ${cap}, GANTI dengan yang lebih sederhana. Sebarkan soal ke SEMUA level yang boleh (${allow.join(', ')}); jangan semuanya di ${cap}.`,
  `5. Kolom 7 tiap soal = level TERTINGGI unsur apa pun di kalimat itu, memakai penulisan: ${v.join(' / ')}. Jujur: bila ada unsur di atas ${cap}, tulis ulang kalimatnya, jangan sekadar menurunkan angka.`];
 const fmt=`FORMAT OUTPUT (satu soal = satu baris, TEPAT 7 kolom dipisah “ | ”; kolom kosong tetap ditulis sebagai “| |”):\nkalimat dengan ___ | jawaban | terjemah Indonesia | petunjuk singkat | romanisasi | pengecoh terlarang | level\nContoh satu baris soal:\n${aqEx(g)}`;
 const r=[`Kolom 1: kalimat ${nm} utuh dan natural dengan celah “___” (tiga garis bawah) tepat di bagian yang diuji game ini. ${A.fmt}`,
  `Kolom 2 = jawaban. Alternatif yang SAH dipisah “~” (yang pertama = utama). Bila ada lebih dari satu celah, jawaban per celah dipisah “;” (mis. rufe;an). Hanya boleh ada SATU jawaban benar yang tak ambigu: daftarkan SEMUA alternatif yang juga benar. Maksimal 3 celah per kalimat.`,
  `Kolom 3 = terjemah bahasa Indonesia yang natural. Kolom 4 = petunjuk singkat tanpa membocorkan jawaban.`,
  A.rom?`Kolom 5 WAJIB diisi: romanisasi kalimat penuh dengan jawaban utama terisi.`:`Kolom 5 dikosongkan (bahasa ini tanpa romanisasi).`,
  `Kolom 6 = kata yang bisa juga benar di kalimat itu tetapi tidak kamu daftarkan sebagai jawaban (agar tidak dipakai sebagai pengecoh), dipisah “~”; kosongkan bila tidak ada.`,
  `Variasikan jenis kalimat, subjek, dan tema (mis. ${th}); jangan ada dua soal yang hampir sama. Jangan memakai kata “null”, “undefined”, atau “NaN”.`+(have.length?`\n   Soal yang sudah ada (JANGAN diulang atau dibuat mirip): ${have.join(' // ')}`:''),
  `Tanpa hiasan: tanpa **tebal**, tabel, bullet, emoji, nomor di awal soal, atau blok kode; tanpa judul/kalimat pembuka/penutup. Hanya baris soal.`,
  `Jumlah baris soal paling banyak ${N}; jumlah yang lebih sedikit boleh (kalimat natural lebih penting). Bila jawabanmu terpotong dan aku mengetik “lanjut”, teruskan dengan format sama tanpa mengulang.`];
 return[head,nat,gm,lv.join('\n'),fmt,'ATURAN FORMAT:\n'+r.map((x,i)=>`${i+1}. ${x}`).join('\n')].join('\n\n')}
/* ---------- impor ---------- */
function aqParse(text,g,capIdx){const L=aqLang(g),A=ACZ[L],v=AQLV(L),cap=v[capIdx],out=[],bad=[],cur=aqList(g),have=new Set(cur.map(x=>AQN(x.q[0])));let ln=0,room=AQMAX-cur.length;
 String(text||'').replace(/\r/g,'').split('\n').forEach(raw=>{ln++;let s=raw.trim();if(!s||/^(\/\/|```|#)/.test(s)||s.indexOf('|')<0)return;
  s=s.replace(/^(?:[-*•]\s+|\d+[.)]\s+)/,'');
  const c=s.split('|').map(x=>x.trim());
  if(c.length>7){bad.push({ln,why:'kolom lebih dari 7 (tanda “|” di dalam teks?)'});return}
  while(c.length<7)c.push('');
  const sent=c[0].replace(/_{2,}|＿{2,}/g,'___'),ng=(sent.match(/___/g)||[]).length;
  if(ng<1||ng>3){bad.push({ln,why:'kalimat harus memuat 1–3 celah “___”'});return}
  if(!c[1]||!c[2]){bad.push({ln,why:'jawaban / terjemahan kosong'});return}
  if(/\b(null|undefined|NaN)\b/i.test(s)){bad.push({ln,why:'memuat kata null/undefined/NaN'});return}
  const lv=typeof aczLv=='function'?aczLv(L,c[6]):-1;
  if(lv<0){bad.push({ln,why:`level “${c[6]||'kosong'}” tidak dikenal (pakai ${v.join('/')})`});return}
  if(lv>capIdx){bad.push({ln,why:`level ${v[lv]} melebihi batas ${cap}`});return}
  if(A.rom&&!c[4]){bad.push({ln,why:'romanisasi (kolom 5) wajib untuk bahasa ini'});return}
  if(L=='zh'&&/[？?]/.test(sent.slice(0,-1))){bad.push({ln,why:'tanda tanya hanya boleh di akhir kalimat zh'});return}
  const gs=c[1].split(';').map(z=>z.split('~').map(y=>y.trim()).filter(Boolean));
  if(gs.length!=ng||gs.some(z=>!z.length)){bad.push({ln,why:`jumlah jawaban (${gs.length}) ≠ jumlah celah (${ng})`});return}
  if(gs.some(z=>z.some(y=>y.indexOf('___')>=0))){bad.push({ln,why:'jawaban memuat “___”'});return}
  const k=AQN(sent);if(have.has(k)){bad.push({ln,why:'duplikat soal yang sudah ada'});return}
  if(room<=0){bad.push({ln,why:`satu game maksimal ${AQMAX} soal tambahan`});return}
  have.add(k);room--;
  const ban=c[5]?c[5].split('~').map(y=>y.trim()).filter(Boolean):[];
  out.push({q:[sent,ng<2?gs[0]:gs.map(z=>z.length>1?z:z[0]),c[2],c[3],c[4],ban],lv:v[lv]})});
 return{ok:out,bad}}
/* v7.101.0: kalimat lengkap (celah terisi jawaban utama) dari soal AI ikut masuk Pustaka → Kalimat. SATU ARAH: kalimat Pustaka TIDAK pernah menjadi soal game. */
let aqLibN=0;
function aqToLib(L,q){try{if(typeof libId!='function'||!Array.isArray(S.sl))return 0;const gaps=gcGaps(q),cjk=L=='zh'||L=='ja';let i=0;
 let f=String(q[0]).replace(/___/g,()=>(gaps[i++]||[''])[0]);f=cjk?f.replace(/\s+/g,''):f.replace(/\s+/g,' ').trim();if(!f)return 0;
 if(S.sl.some(x=>x.L==L&&x.f==f))return 0;
 S.sl.unshift({id:libId(),L,f,r:q[4]||'',i:q[2]||'',c:Date.now(),d:0,pb:''});return 1}catch(e){return 0}}
function aqAdd(g,items){const o=GXO(g);if(!Array.isArray(o.aq))o.aq=[];if(!o.aqn)o.aqn=0;let n=0;
 aqLibN=0;for(const it of items){o.aq.push({u:++o.aqn,q:it.q,lv:it.lv});n++;aqLibN+=aqToLib(aqLang(g),it.q)}
 if(o.n==null)o.n=8;if(o.r==null)o.r=200;
 if(typeof save=='function')save();return n}
function aqClear(g){const o=GXO(g);o.aq=[];if(typeof save=='function')save()}
/* ---------- sel & soal untuk mesin game ---------- */
function aqCells(g){try{const o=GXO(g),a=o.aq;if(!Array.isArray(a)||!a.length)return[];
 const info=typeof gxLvInfo=='function'?gxLvInfo(g):null,sel=Array.isArray(o.lvs)?o.lvs:[],f=sel.length&&info&&!(typeof gxIsPre=='function'&&gxIsPre(g));
 const out=[];for(const x of a){if(f&&!sel.includes(x.lv))continue;const k='aq|'+g+'|'+x.u;if(typeof gcOvOf=='function'&&gcOvOf(o,k).skip)continue;out.push({k,x:{aq:1,u:x.u,q:x.q,lv:x.lv},lv:x.lv,aq:1})}return out}catch(e){return[]}}
/* pengecoh: jawaban soal tambahan lain di game ini lebih dulu, lalu pool jawaban Grammar Cloze bahasa itu */
function aqOpts(g,L,lv,sent,valid,ban,n){const vs=new Set(valid.map(z=>gcNorm(z,L))),bs=new Set((ban||[]).map(z=>gcNorm(z,L)));
 for(const gr of ((typeof GCS!='undefined'&&GCS[L])||[]))if(gr.some(z=>vs.has(gcNorm(z,L))))gr.forEach(z=>bs.add(gcNorm(z,L)));
 const sn=gcNorm(String(sent).replace(/___/g,' '),L),ok=valid[0],seen=new Set(),pool=[];
 const add=(v0,own)=>{const z=gcNorm(v0,L);if(!z||seen.has(z)||vs.has(z)||bs.has(z))return;if(sn.includes(z)&&(L=='zh'||L=='ja'||(' '+sn+' ').includes(' '+z+' ')))return;seen.add(z);pool.push({v:v0,own})};
 const nw=(AQNUM[L]||[]).map(w=>gcNorm(w,L));if(nw.includes(gcNorm(ok,L)))nw.forEach(w=>add(w,1));/* jawaban berupa angka: pengecoh sesama angka */
 for(const x of aqList(g))for(const a of gcGaps(x.q))if(a[0])add(a[0],1);
 try{for(const p of gcPool(L))add(p.v,0)}catch(e){}
 const kg=((typeof GCK!='undefined'&&GCK[L])||[]).find(gr=>gr.includes(gcNorm(ok,L)))||null;
 const c=pool.map(p=>({v:p.v,s:Math.abs(p.v.length-ok.length)*3+(gcCjk(p.v)==gcCjk(ok)?0:4)+Math.random()*2.5-(p.own?6:0)-(kg&&kg.includes(gcNorm(p.v,L))?14:0)}));
 c.sort((a,b)=>a.s-b.s);return gxShuf([ok].concat(c.slice(0,n||5).map(z=>z.v)))}
function aqMake(g){return cell=>{const {q,lv}=cell.x,L=aqLang(g),o=GXO(g),gaps=gcGaps(q),val=gcValid(o,cell.k,gaps),parts=[],sp=q[0].split('___'),ban=Array.isArray(q[5])?q[5]:[];
 const mode=o.aqm=='t'||o.aqm=='m'?o.aqm:'c';let typ=mode=='t'||(mode=='m'&&Math.random()<.5);
 sp.forEach((s,i)=>{if(s)parts.push(s);if(i<val.length)parts.push(i)});
 let blanks=val.map((v,i)=>({lab:val.length>1?'Celah '+(i+1):'',ok:[v[0]],alts:v,opts:typ?[]:aqOpts(g,L,lv,q[0],v,ban,5),soft:[]}));
 if(!typ&&blanks.some(b=>b.opts.length<3)){typ=true;blanks=blanks.map(b=>({...b,opts:[]}))}
 const full=sp.map((s,i)=>s+(i<val.length?val[i][0]:'')).join(''),alts=val.map((v,i)=>v.length>1?(val.length>1?'celah '+(i+1)+': ':'')+v.slice(1).join(' / '):'').filter(Boolean),m=aqMeta(g);
 const R={g,k:cell.k,L,aq:1,cell:'Soal AI · '+(m?m.t:g)+(lv?' · '+lv:''),blanks,parts,tr:q[2],hint:q[3]||'',typ,fullTxt:full,rom:q[4]||'',say:()=>full,cx:cell,sel:blanks.map(()=>new Set()),
  expl:`<small>Soal tambahan dari AI${lv?' · level '+esc(lv):''}.</small>${alts.length?'<br><small>Jawaban lain yang juga sah: '+esc(alts.join(' · '))+'</small>':''}`,
  resHtml:()=>gcRes(R,g)};
 R.judge=vals=>{const ok=[];R.typed=vals.slice();blanks.forEach((b,i)=>{const hit=b.alts.some(a=>gcNorm(a,L)===gcNorm(vals[i],L));ok.push(hit);R.sel[i]=new Set([hit?b.ok[0]:String(vals[i]||'—').trim()||'—'])});return ok};
 return R}}
/* ---------- tombol & tampilan di game ---------- */
const aqBtn=g=>{if(!ACZ[aqLang(g)])return'';const n=aqCount(g);return`<button class=chip data-aq=open data-g="${g}" title="Tambah soal ke game ini lewat prompt AI">➕ Soal AI${n?' ('+n+')':''}</button>`};
let aqSolo='';
function aqGenSettings(g){const o=GXO(g);if(o.n==null)o.n=8;if(o.r==null)o.r=200;
 return`${dtag('gxs_'+g)}<summary><span>Pengaturan soal AI</span></summary><div class=card><small>Game ini punya mesin sendiri (di atas). Soal tambahan dari AI dimainkan di tampilan «Latih soal AI».</small><label class=fcl><span>Soal baru per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:n value="${o.n}" min=0 max=9999></label><label class=fcl><span>Maks. ulasan per hari</span><input type=number inputmode=numeric data-i=gg_x:${g}:r value="${o.r}" min=0 max=9999></label><div class=btns>${aqBtn(g)}<button data-a=ggxrst>Reset jadwal game</button></div></div></details>`}
function aqGenCard(g){const n=aqList(g).length;
 return`<div class=card style="margin-top:12px"><b>➕ Soal AI</b><small style="display:block;margin:4px 0 8px">Tambah soal rumpang baru untuk game ini lewat prompt AI (batas level keras).${n?` Sudah ada ${n} soal tambahan.`:''}</small><div class=btns>${aqBtn(g)}${n?`<button class=pri data-aq=solo data-g="${g}">Latih soal AI (${n})</button>`:''}</div></div>`}
function aqSoloView(g){const m=aqMeta(g);return`<div class=gxbar><button class=gxback data-aq=unsolo aria-label="Kembali ke game">‹ ${esc(m.t)}</button><b>Soal AI</b><span></span></div>`+gxView(g)}
/* ---------- dialog ---------- */
let aqS=null;
function aqClose(){const m=document.getElementById('aqm');if(m)m.remove();document.body.style.overflow='';aqS=null}
function aqPick3(){const a=AQTH.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,3)}
function aqOpen(g){if(/^gcl_/.test(g)){if(typeof aczOpen=='function')aczOpen(g.slice(4));return}
 if(AQSENT(g)){aqSentOpen(g);return}
 const m=aqMeta(g);if(!m||!ACZ[m.lg])return;aqClose();if(typeof aiClose=='function'&&document.getElementById('aim'))aiClose();
 const o=aqO(),v=aqLevels(g);let c=o.aqCap[g];if(c==null||c<0||c>=v.length)c=Math.min(1,v.length-1);
 aqS={g,cap:c,th:aqPick3(),inp:'',rep:''};
 const d=document.createElement('div');d.id='aqm';d.className='edm';d.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="Soal AI"><div class=edh><div><b>➕ Soal AI · ${esc(m.t)}</b><small>Prompt → tempel hasil → soal masuk ke game ini</small></div><button class=mini data-aq=close aria-label=Tutup>✕</button></div><div class=edb></div><div class="edf aif"><button class=pri data-aq=copy>Salin prompt</button><div class=aisites><a data-aq=site href="https://chatgpt.com/" target=_blank rel=noopener>ChatGPT</a><a data-aq=site href="https://claude.ai/new" target=_blank rel=noopener>Claude</a><a data-aq=site href="https://gemini.google.com/app" target=_blank rel=noopener>Gemini</a></div></div></div>`;
 document.body.appendChild(d);document.body.style.overflow='hidden';aqPanel()}
const aqText=()=>aqS?aqBuild(aqS.g,aqS.cap,aqO().aqN,aqS.th):'';
function aqPanel(){const s=aqS,m=document.getElementById('aqm');if(!s||!m)return;const o=aqO(),g=s.g,L=aqLang(g),v=aqLevels(g),go=GXO(g),a=aqList(g),ch=(k,val,on,t)=>`<button class="chip${on?' on':''}" data-aq=${k} data-v="${val}">${t}</button>`;
 const by={};a.forEach(x=>{by[x.lv]=(by[x.lv]|0)+1});const txt=aqText(),md=go.aqm=='t'||go.aqm=='m'?go.aqm:'c';
 m.querySelector('.edb').innerHTML=`<div class=aidest><b>${esc(aqMeta(g).t)}</b><small>${esc(aqMeta(g).d)}</small></div>`+
 `<div class=aio><small>Level MAKSIMUM (level ini dan di bawahnya boleh; yang di atasnya dilarang &amp; ditolak)</small><div class=chips>${v.map((x,i)=>ch('cap',i,i==s.cap,esc(x))).join('')}</div></div>`+
 `<div class=aio><small>Jumlah soal per prompt</small><div class=chips>${[10,20,30,40].map(n=>ch('n',n,o.aqN==n,n)).join('')}</div></div>`+
 `<div class=aio><small>Cara menjawab soal tambahan</small><div class=chips>${[['c','Pilih'],['t','Ketik'],['m','Campur']].map(z=>ch('mode',z[0],md==z[0],z[1])).join('')}</div></div>`+
 `<div class=aidest><small>Soal tambahan game ini: <b>${a.length}</b>${a.length?' ('+v.filter(x=>by[x]).map(x=>esc(x)+': '+by[x]).join(' · ')+')':''}. Tersimpan di perangkat ini dan ikut cadangan. Dimainkan dengan jadwal ulasan game ini; level di pengaturan game menyaring soal tambahan juga (bila game punya filter level).${a.length?` <button class=chip data-aq=clear>Hapus semua soal tambahan</button>`:''}</small></div>`+
 `<div class=aio style="margin-top:12px"><div class=aih><small>Pratinjau prompt <i class=aicnt>${txt.length.toLocaleString('id-ID')} karakter</i> — boleh diedit sebelum disalin</small><button class=mini data-aq=reroll>↻ Tema lain</button></div><textarea id=aqTxt spellcheck=false>${esc(txt)}</textarea></div>`+
 `<div class=aio style="margin-top:12px"><div class=aih><small>Tempel hasil AI di sini</small></div><textarea id=aqIn rows=6 spellcheck=false placeholder="${esc(aqEx(g))}">${esc(s.inp)}</textarea><button class=pri data-aq=import style="margin-top:6px">Tambahkan ke game</button><div id=aqRep>${s.rep}</div></div>`}
function aqReport(res,n){const f=x=>esc(String(x));let h=`<small><b>✓ ${n} soal ditambahkan ke game ini</b>${n?` · ${aqLibN} kalimat baru masuk Pustaka → Kalimat (satu arah: kalimat Pustaka tidak menjadi soal game)`:''}.${res.bad.length?` ${res.bad.length} baris ditolak:`:''}</small>`;
 if(res.bad.length)h+='<ul style="margin:4px 0 0 16px;font-size:.8rem">'+res.bad.slice(0,12).map(b=>`<li>baris ${b.ln}: ${f(b.why)}</li>`).join('')+(res.bad.length>12?`<li>… dan ${res.bad.length-12} lainnya</li>`:'')+'</ul>';return h}
if(typeof document!='undefined'&&document&&typeof document.addEventListener=='function'){
document.addEventListener('input',e=>{if(e.target&&e.target.id=='aqIn'&&aqS)aqS.inp=e.target.value});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-aq]');const m=document.getElementById('aqm');
 if(m&&e.target===m){aqClose();return}
 if(!b)return;const a=b.dataset.aq;if(a=='site'){const t=aqText();if(t&&typeof ltCopy=='function')ltCopy(t);return}
 e.stopPropagation();e.preventDefault();
 if(a=='open'){aqOpen(b.dataset.g);return}
 if(a=='solo'){aqSolo=b.dataset.g;gxQ=null;gxRes=null;if(typeof render=='function')render();return}
 if(a=='unsolo'){aqSolo='';gxQ=null;gxRes=null;if(typeof render=='function')render();return}
 if(!aqS)return;const s=aqS,o=aqO();
 if(a=='close')aqClose();
 else if(a=='cap'){s.cap=+b.dataset.v;o.aqCap[s.g]=s.cap;if(typeof save=='function')save();aqPanel()}
 else if(a=='n'){o.aqN=+b.dataset.v;if(typeof save=='function')save();aqPanel()}
 else if(a=='mode'){GXO(s.g).aqm=b.dataset.v;if(typeof save=='function')save();aqPanel()}
 else if(a=='reroll'){s.th=aqPick3();aqPanel()}
 else if(a=='copy'){const x=document.getElementById('aqTxt'),t=x?x.value:aqText();if(!t)return;
  const done=ok=>{if(typeof toast=='function')toast(ok?'Prompt disalin ✓ Tempel di AI favoritmu':'Salin otomatis gagal. Teks prompt sudah terpilih — salin manual.');if(!ok&&x){x.focus();x.select()}};
  if(typeof ltCopy=='function')ltCopy(t).then(done);else done(false)}
 else if(a=='clear'){if(typeof confirm=='function'&&!confirm('Hapus semua soal tambahan di game ini? (Soal bawaan tidak terhapus.)'))return;aqClear(s.g);gxQ=null;aqPanel()}
 else if(a=='import'){const x=document.getElementById('aqIn'),t=x?x.value:s.inp;s.inp=t;if(!String(t).trim()){if(typeof toast=='function')toast('Tempel hasil AI dulu.');return}
  const res=aqParse(t,s.g,s.cap),n=res.ok.length?aqAdd(s.g,res.ok):0;s.rep=aqReport(res,n);if(n&&!res.bad.length)s.inp='';
  gxQ=null;aqPanel()}
},true);
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&document.getElementById('aqm'))aqClose()});
}

/* ===== v7.102.0: Speaking Cloze & Shadowing — «➕ Soal AI» = prompt KALIMAT NATURAL ala Kelas AI Pustaka =====
   Kartu fokus = kartu (kosakata ATAU grammar) dengan contoh TERVERIFIKASI paling sedikit (aiGatherLib), dengan level maksimum & jumlah sendiri (TERPISAH
   dari pengaturan Pustaka: pengaturan Pustaka dipinjam sebentar lalu dikembalikan). Hasil tempel → libParseSents → Pustaka → Kalimat (dengan tag kartu).
   SATU ARAH: input game masuk Pustaka; kalimat Pustaka biasa tidak pernah otomatis jadi soal game. Jumlah kalimat boleh KURANG dari diminta (hanya yang natural). */
const AQSENT=g=>/^(scl|shd)_/.test(g);
const AQSNS=[6,10,15,20],AQSNK=[6,10,14];
const AQSNAT={scl:'Game «Speaking Cloze»: pemain menerjemahkan kalimat Indonesia secara lisan memakai kerangka segmen. Karena itu setiap kalimat harus (a) sangat natural, seperti yang benar-benar diucapkan penutur asli sehari-hari; (b) berupa SATU kalimat utuh yang jelas bisa dipecah menjadi 2–5 segmen bermakna (subjek / predikat / objek / keterangan / klausa); (c) tidak terlalu panjang (maks. ±15 kata, zh/ja ±25 aksara).',
 shd:'Game «Shadowing»: pemain mendengar kalimat lalu menirukannya dengan suara. Karena itu setiap kalimat harus (a) sangat natural, seperti yang benar-benar diucapkan penutur asli sehari-hari; (b) enak diucapkan keras dalam satu napas, ritme wajar, tanpa tanda kurung/angka digit/singkatan; (c) pendek–sedang (±5–14 kata, zh/ja ±8–22 aksara).'};
function aqSentOverride(L,capIdx,k,N,fn){const o=aiO(),keys=['aiLL','aiSn','aiLW','aiLG','aiNew','aiNW','aiNG'],sv={};keys.forEach(x=>{sv[x]=o[x]});const lv0=o.aiLvs[L],has=Object.prototype.hasOwnProperty.call(o.aiLvs,L);
 try{const w=Math.max(1,Math.round(k*.7)),gg=Math.max(1,k-w);o.aiLL=L;o.aiSn=N;o.aiLvs[L]=aiLvAll(L).slice(0,capIdx+1);o.aiLW=Math.max(1,Math.ceil(w/2));o.aiLG=Math.max(1,Math.ceil(gg/2));o.aiNew=1;o.aiNW=Math.max(1,w-o.aiLW);o.aiNG=Math.max(1,gg-o.aiLG);aiOvr=1;return fn()}
 finally{aiOvr=0;keys.forEach(x=>{if(sv[x]===undefined)delete o[x];else o[x]=sv[x]});if(has)o.aiLvs[L]=lv0;else delete o.aiLvs[L]}}
function aqSentBuild(g,capIdx,k,N){const L=aqLang(g),fam=aqFam(g),nm=GCN[L];
 return aqSentOverride(L,capIdx,k,N,()=>{const ctx=aiGatherLib(L,1);let p=aiBuildSent(ctx);const cap=AQLV(L)[capIdx];
  p+=`\n\nATURAN KHUSUS GAME (WAJIB; bila bertentangan dengan aturan lain di atas, aturan ini yang menang):\n1. ${AQSNAT[fam]}\n2. HANYA kalimat yang benar-benar natural. Jangan memaksakan sebuah kartu ke dalam kalimat janggal/buatan. Bila sebuah kartu tidak bisa dibuatkan kalimat natural pada level ≤ ${cap}, LEWATI kartu itu.\n3. Jumlah kalimat BOLEH KURANG dari ${N} (bahkan sedikit) bila tidak ada lagi kalimat natural yang mungkin; lebih baik sedikit tapi natural. Abaikan perintah “tepat ${N}” di atas: tulis sebanyak kalimat natural yang ada (maksimum ${N}), penomoran [1], [2], … tetap berurutan tanpa lompat sesuai jumlah yang benar-benar ditulis.\n4. Pertama-tama pakai kartu di daftar KARTU PRIORITAS / KARTU BARU (yang contoh terverifikasinya paling sedikit); satu kalimat boleh memuat beberapa kartu bila tetap natural.\n\n${aqLvBlock(L,capIdx)}\n5. Kalimat ${nm} harus benar secara tata bahasa dan idiomatik; tanpa “null”, “undefined”, “NaN”.`;
  return{ctx,prompt:p}})}
function aqSentSave(g,text,N){const L=aqLang(g),r=libParseSents(text,{L});if(r.err)return{err:r.err};
 let n=0,d=0,t=0;const seen=new Set(S.sl.map(x=>x.L+'|'+x.f));
 r.sents.forEach(x=>{const key=r.L+'|'+x.f;if(seen.has(key)){d++;return}seen.add(key);S.sl.unshift({id:libId(),L:r.L,f:x.f,r:x.r||'',i:x.i||'',c:Date.now(),d:0,pb:x.pb||'',...(x.tg&&x.tg.length?{tg:x.tg}:{})});n++;if(x.tg&&x.tg.length)t++});
 if(typeof LIB_SL_MAX!='undefined'&&S.sl.length>LIB_SL_MAX)S.sl.length=LIB_SL_MAX;
 if(typeof gmDelCaches=='function')gmDelCaches();if(typeof save=='function')save();return{n,d,t,warn:r.warn||[],N}}
let aqSS=null;
function aqSentClose(){const m=document.getElementById('aqs');if(m)m.remove();document.body.style.overflow='';aqSS=null}
function aqSentOpen(g){const m0=aqMeta(g);if(!m0||!ACZ[m0.lg]||typeof aiGatherLib!='function')return;aqSentClose();if(typeof aiClose=='function'&&document.getElementById('aim'))aiClose();
 const o=aqO(),v=aqLevels(g);let c=o.aqCap[g];if(c==null||c<0||c>=v.length)c=Math.min(1,v.length-1);
 aqSS={g,cap:c,k:o.aqSK||10,N:o.aqSN||10,inp:'',rep:'',b:null};
 const d=document.createElement('div');d.id='aqs';d.className='edm';d.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="Soal AI"><div class=edh><div><b>➕ Soal AI · ${esc(m0.t)}</b><small>Prompt kalimat natural → hasil masuk Pustaka → Kalimat</small></div><button class=mini data-aqs=close aria-label=Tutup>✕</button></div><div class=edb></div><div class="edf aif"><button class=pri data-aqs=copy>Salin prompt</button><div class=aisites><a data-aqs=site href="https://chatgpt.com/" target=_blank rel=noopener>ChatGPT</a><a data-aqs=site href="https://claude.ai/new" target=_blank rel=noopener>Claude</a><a data-aqs=site href="https://gemini.google.com/app" target=_blank rel=noopener>Gemini</a></div></div></div>`;
 document.body.appendChild(d);document.body.style.overflow='hidden';aqSentPanel(1)}
function aqSentName(x,L){if(x.g)return x.g[4];const es=(x.c&&x.c[3]&&x.c[3][L])||[],e=es[ent(x.k)]||es[0];return e?e[0]:String(x.k)}
function aqSentPanel(rebuild){const s=aqSS,m=document.getElementById('aqs');if(!s||!m)return;const g=s.g,L=aqLang(g),v=aqLevels(g),ch=(k,val,on,t)=>`<button class="chip${on?' on':''}" data-aqs=${k} data-v="${val}">${t}</button>`;
 if(rebuild||!s.b){try{s.b=aqSentBuild(g,s.cap,s.k,s.N)}catch(e){s.b={ctx:null,prompt:'Gagal menyusun prompt: '+e.message}}}
 const b=s.b,ctx=b.ctx,fo=ctx?ctx.pw.concat(ctx.pg,ctx.nw,ctx.ng):[],f=n=>n.toLocaleString('id-ID');
 const list=fo.slice(0,Math.max(12,s.k)).map(x=>`<span class=scv>${esc(aqSentName(x,L))}<small>${x.g?'grammar':'kata'} · ${esc((x.tags&&x.tags[0])||'')}</small></span>`).join('');
 const z=ctx&&ctx.lvC?aqSentOverride(L,s.cap,s.k,s.N,()=>aiLvCountHtml(ctx)):'';
 m.querySelector('.edb').innerHTML=`<div class=aidest><b>${esc(aqMeta(g).t)}</b><small>Kalimat dibuat dari kartu (kosakata maupun grammar) dengan <b>contoh terverifikasi paling sedikit</b> di level yang kamu pilih. Hasil tempel masuk ke Pustaka → Kalimat (dengan tag kartu). Arah sebaliknya tidak ada: kalimat Pustaka tidak otomatis jadi soal game.</small></div>`+
 `<div class=aio><small>Level MAKSIMUM (keras: struktur di atasnya dilarang)</small><div class=chips>${v.map((x,i)=>ch('cap',i,i==s.cap,esc(x))).join('')}</div></div>`+
 `<div class=aio><small>Jumlah kartu fokus</small><div class=chips>${AQSNK.map(n=>ch('k',n,s.k==n,n)).join('')}</div></div>`+
 `<div class=aio><small>Jumlah kalimat maksimum (AI boleh menulis lebih sedikit bila tak ada yang natural)</small><div class=chips>${AQSNS.map(n=>ch('n',n,s.N==n,n)).join('')}</div></div>`+
 `<div class=aidest><b>📊 Cakupan (terpisah dari Pustaka)</b>${z}${list?`<div class=scbank style="margin-top:6px"><small>Kartu fokus prompt ini (contoh terverifikasi paling sedikit)</small><div>${list}</div></div>`:''}</div>`+
 `<div class=aio style="margin-top:12px"><div class=aih><small>Pratinjau prompt <i class=aicnt>${f(b.prompt.length)} karakter</i> — boleh diedit sebelum disalin</small><button class=mini data-aqs=reroll>↻ Acak ulang</button></div><textarea id=aqsTxt spellcheck=false>${esc(b.prompt)}</textarea></div>`+
 `<div class=aio style="margin-top:12px"><div class=aih><small>Tempel hasil AI di sini → masuk Pustaka → Kalimat</small></div><textarea id=aqsIn rows=6 spellcheck=false placeholder="[1] kalimat&#10;(romanisasi bila ada)&#10;terjemahan Indonesia">${esc(s.inp)}</textarea><button class=pri data-aqs=import style="margin-top:6px">Tambahkan ke Pustaka</button><div id=aqsRep>${s.rep}</div></div>`}
if(typeof document!='undefined'&&document&&typeof document.addEventListener=='function'){
document.addEventListener('input',e=>{if(e.target&&e.target.id=='aqsIn'&&aqSS)aqSS.inp=e.target.value});
document.addEventListener('click',e=>{const m=document.getElementById('aqs');if(m&&e.target===m){aqSentClose();return}
 const b=e.target.closest&&e.target.closest('[data-aqs]');if(!b||!aqSS)return;const a=b.dataset.aqs,s=aqSS,o=aqO();
 if(a=='site'){const x=document.getElementById('aqsTxt');if(x&&typeof ltCopy=='function')ltCopy(x.value);return}
 e.stopPropagation();e.preventDefault();
 if(a=='close')aqSentClose();
 else if(a=='cap'){s.cap=+b.dataset.v;o.aqCap[s.g]=s.cap;if(typeof save=='function')save();aqSentPanel(1)}
 else if(a=='k'){s.k=+b.dataset.v;o.aqSK=s.k;if(typeof save=='function')save();aqSentPanel(1)}
 else if(a=='n'){s.N=+b.dataset.v;o.aqSN=s.N;if(typeof save=='function')save();aqSentPanel(1)}
 else if(a=='reroll')aqSentPanel(1);
 else if(a=='copy'){const x=document.getElementById('aqsTxt'),t=x?x.value:s.b.prompt;if(!t)return;
  const done=ok=>{if(typeof toast=='function')toast(ok?'Prompt disalin ✓ Tempel di AI favoritmu':'Salin otomatis gagal. Teks prompt sudah terpilih — salin manual.');if(!ok&&x){x.focus();x.select()}};
  if(typeof ltCopy=='function')ltCopy(t).then(done);else done(false)}
 else if(a=='import'){const x=document.getElementById('aqsIn'),t=x?x.value:s.inp;s.inp=t;if(!String(t).trim()){if(typeof toast=='function')toast('Tempel hasil AI dulu.');return}
  const r=aqSentSave(s.g,t,s.N);
  s.rep=r.err?`<small style="color:var(--bad)">${esc(r.err)}</small>`:`<small><b>✓ ${r.n} kalimat masuk Pustaka → Kalimat</b>${r.t?` · ${r.t} bertag kartu`:''}${r.d?` · ${r.d} sudah ada`:''}${r.n<r.N?` · lebih sedikit dari ${r.N}: tidak apa-apa, hanya kalimat natural yang dipakai`:''}.${r.warn.length?'<br>'+r.warn.map(esc).join('<br>'):''}</small>`;
  if(!r.err&&r.n&&!r.warn.length)s.inp='';aqSentPanel(0)}
},true);
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&document.getElementById('aqs'))aqSentClose()});
}
