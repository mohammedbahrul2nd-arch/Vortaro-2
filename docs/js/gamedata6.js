/* Game suara — Penghitung Jepang 助数詞 (jcn). Murni, tanpa DOM. Pakai mesin games3.js; didaftarkan ke VG. Awalan global jc/JC.
   Bacaan dibangkitkan dari aturan perubahan bunyi (jcRd) + pengecualian per penggolong (ov = utama, al = lazim, db = diperdebatkan). */
const JCN=['','いち','に','さん','よん','ご','ろく','なな','はち','きゅう','じゅう'];
const JCHD={'は':'ばぱ','ひ':'びぴ','ふ':'ぶぷ','へ':'べぺ','ほ':'ぼぽ'};
const jcDk=(b,i)=>JCHD[b[0]]?JCHD[b[0]][i]+b.slice(1):b;
const JCG={um:'Umum',pp:'Pipih & panjang',bk:'Buku & jilid',ms:'Mesin & kendaraan',hw:'Hewan',rm:'Rumah & bangunan',wk:'Waktu & usia',mm:'Makan & minum',pk:'Pakaian & pasangan',bg:'Bunga & tumbuhan',tl:'Tulisan & cetak',ol:'Olahraga',al:'Alat & benda',uk:'Satuan ukur',lm:'Lain-lain'};
const JCGK=Object.keys(JCG);
const JCM={rd:'Bacaan angka + penggolong',cnt:'Benda + jumlah',obj:'Benda → penggolong',nan:'何〜 (berapa?)',fr:'Hanya yang sering (N5–N3)',irr:'Hanya bacaan tak beraturan'};
JCGK.forEach(g=>{JCM['g_'+g]='Kelompok: '+JCG[g]});
const JCDIR={A:'Dengar → ketik (mis. 3本)',B:'Lihat → ucapkan'};
const JCC=[],JCI={};
/* jcA(id, kanji, kana, tipe, kelompok, level(5=N5…1=N1), arti, contoh 'nama|emoji|arti;…', catatan, opsi) — tipe: R biasa · K sokuon (ろっ) · Q sokuon (ろく) · H はひふへほ→ばぱ · F ふん/ぷん */
function jcA(id,c,b,ty,g,lv,m,ex,nt,x){const o=Object.assign({id,c,b,ty,g,lv,m,ex:ex.split(';').map(s=>s.split('|')),nt:nt||''},x||{});JCC.push(o);JCI[id]=o}
/* umum */
jcA('ko','個','こ','K','um',5,'benda kecil, serbaguna','りんご|🍎|apel;たまご|🥚|telur;おにぎり|🍙|onigiri;消しゴム|🧽|penghapus','Penggolong serbaguna. 1 いっこ, 6 ろっこ, 8 はっこ, 10 じゅっこ.');
jcA('tsu','つ','つ','R','um',5,'bilangan asli Jepang 1–10 (tanpa penggolong)','りんご|🍎|apel;みかん|🍊|jeruk;ケーキ|🍰|kue;いす|🪑|kursi','Bacaan asli: ひとつ・ふたつ・みっつ… ; 10 = とお (tanpa つ). Berlaku sampai 10 saja.',{ov:{1:'ひとつ',2:'ふたつ',3:'みっつ',4:'よっつ',5:'いつつ',6:'むっつ',7:'ななつ',8:'やっつ',9:'ここのつ',10:'とお',0:'いくつ'}});
jcA('nin','人','にん','R','um',5,'orang','学生|🧑‍🎓|pelajar;家族|👨‍👩‍👧|anggota keluarga;友だち|🧑‍🤝‍🧑|teman;お客さん|🙋|tamu','1 ひとり dan 2 ふたり khusus. 4 = よにん (bukan よんにん).',{ov:{1:'ひとり',2:'ふたり',4:'よにん',7:'ななにん',9:'きゅうにん'},al:{7:['しちにん']},db:{4:['よんにん'],9:['くにん']}});
jcA('kai','回','かい','K','um',5,'kali (frekuensi)','行く|🚶|pergi;食べる|🍽️|makan;練習|🏃|latihan;試験|📝|ujian','Frekuensi: いっかい, ろっかい, はっかい, じゅっかい.');
jcA('do','度','ど','R','um',4,'kali (formal) / derajat','会う|🤝|bertemu;見る|👀|melihat;温度|🌡️|suhu','一度 いちど = sekali; juga satuan suhu (30度).');
jcA('ban','番','ばん','R','um',4,'nomor urut / peringkat','順位|🏅|peringkat;バス|🚌|bus (nomor)','一番 いちばん = nomor satu / paling.');
jcA('bai','倍','ばい','R','um',3,'kali lipat','値段|💴|harga;大きさ|📏|ukuran','二倍 にばい = dua kali lipat.');
/* pipih & panjang */
jcA('mai','枚','まい','R','pp',5,'benda tipis & pipih','紙|📄|kertas;シャツ|👕|kemeja;切符|🎫|tiket;お皿|🍽️|piring','Tidak ada perubahan bunyi.');
jcA('hon','本','ほん','H','pp',5,'benda panjang & ramping','鉛筆|✏️|pensil;傘|☂️|payung;木|🌳|pohon;ビールの瓶|🍾|botol bir','Ingat pola 1-3-6-8-10: いっぽん・さんぼん・ろっぽん・はっぽん・じゅっぽん.');
/* buku */
jcA('satsu','冊','さつ','Q','bk',5,'buku & barang bersampul','本|📚|buku;雑誌|📖|majalah;ノート|📒|buku tulis;辞書|📕|kamus','1 いっさつ, 8 はっさつ, 10 じゅっさつ.');
jcA('kan','巻','かん','K','bk',3,'jilid / gulungan','漫画|📘|manga (jilid);全集|📚|kumpulan karya;DVD|💿|DVD (jilid)','Jilid dalam seri: 全10巻 ぜんじゅっかん.');
jcA('bu','部','ぶ','R','bk',3,'eksemplar / bagian','新聞|📰|koran;雑誌|📖|majalah (eksemplar);資料|📑|dokumen (rangkap)','Eksemplar cetakan.');
/* mesin */
jcA('dai','台','だい','R','ms',5,'mesin, kendaraan, perabot besar','車|🚗|mobil;自転車|🚲|sepeda;パソコン|💻|komputer;テレビ|📺|TV;ピアノ|🎹|piano','Tidak ada perubahan bunyi.');
jcA('ki','機','き','K','ms',3,'pesawat & mesin besar','飛行機|✈️|pesawat;ヘリコプター|🚁|helikopter;ロケット|🚀|roket','Mesin penerbangan.');
jcA('ryo','両','りょう','R','ms',3,'gerbong kereta','電車|🚃|gerbong kereta;列車|🚆|rangkaian kereta','四両編成 よんりょうへんせい = 4 gerbong.');
jcA('seki','隻','せき','Q','ms',2,'kapal besar','船|🚢|kapal;タンカー|🛳️|kapal tanker','Kapal besar; kapal kecil memakai 艘.');
jcA('so','艘','そう','Q','ms',2,'perahu / kapal kecil','ボート|🚤|perahu motor;ヨット|⛵|kapal layar;小舟|🛶|sampan','Perahu kecil.');
/* hewan */
jcA('hiki','匹','ひき','H','hw',5,'hewan kecil sampai sedang','猫|🐈|kucing;犬|🐕|anjing;魚|🐟|ikan;虫|🐛|serangga','いっぴき・さんびき・ろっぴき・はっぴき・じゅっぴき.');
jcA('to','頭','とう','Q','hw',3,'hewan besar','牛|🐄|sapi;馬|🐎|kuda;象|🐘|gajah;ライオン|🦁|singa','Hewan besar; hewan kecil pakai 匹.');
jcA('wa','羽','わ','R','hw',4,'burung & kelinci','鳥|🐦|burung;ニワトリ|🐔|ayam;うさぎ|🐇|kelinci','3 さんわ/さんば, 6 ろくわ/ろっぱ, 8 はちわ/はっぱ, 10 じゅうわ/じゅっぱ: dua bentuk lazim.',{al:{3:['さんば'],6:['ろっぱ'],8:['はっぱ'],10:['じゅっぱ'],0:['なんば']},db:{3:['さんぱ'],10:['じっぱ']}});
jcA('bi','尾','び','R','hw',2,'ikan (di restoran / perikanan)','鯛|🐟|ikan kakap;アジ|🐠|ikan kembung','Bacaan sering berbeda antar sumber; dianggap diperdebatkan.',{db:{1:['いっぴ'],2:['にひ']}});
/* rumah */
jcA('ken','軒','けん','K','rm',4,'rumah & toko','家|🏠|rumah;店|🏪|toko;レストラン|🍴|restoran','3 さんげん dan 何 なんげん berubah jadi げん.',{ov:{3:'さんげん',0:'なんげん'}});
jcA('ko2','戸','こ','K','rm',2,'rumah tangga (sensus)','住宅|🏘️|rumah tinggal;農家|🌾|rumah petani','Bacaan sama dengan 個.');
jcA('tou2','棟','とう','Q','rm',2,'gedung / bangunan','ビル|🏢|gedung;倉庫|🏭|gudang;マンション|🏬|apartemen','Bacaan sama dengan 頭, tapi arti berbeda.');
jcA('kai2','階','かい','K','rm',5,'lantai','レストラン|🍽️|restoran;トイレ|🚻|toilet;オフィス|🏢|kantor','3階 さんがい dan 何階 なんがい.',{ov:{3:'さんがい',0:'なんがい'}});
jcA('shitsu','室','しつ','Q','rm',3,'ruangan','会議室|🧑‍💼|ruang rapat;寝室|🛏️|kamar tidur','');
jcA('heya','部屋','へや','R','rm',3,'kamar','ホテルの部屋|🏨|kamar hotel;寝室の部屋|🛏️|kamar tidur','1 ひとへや, 2 ふたへや; seterusnya angka biasa.',{ov:{1:'ひとへや',2:'ふたへや'},db:{3:['さんべや']}});
/* waktu & usia */
jcA('nen','年','ねん','R','wk',5,'tahun','留学|🎓|studi di luar negeri;勉強|📚|belajar;日本|🗾|di Jepang','4 よねん, 7 しちねん/ななねん, 9 くねん/きゅうねん.',{ov:{4:'よねん',7:'しちねん',9:'くねん'},al:{7:['ななねん'],9:['きゅうねん']}});
jcA('kagetsu','ヶ月','かげつ','K','wk',5,'bulan (durasi)','旅行|🧳|perjalanan;待つ|⏳|menunggu','Boleh ditulis ヶ月・か月・カ月. 1 いっかげつ, 6 ろっかげつ, 10 じゅっかげつ.',{al:{7:['しちかげつ']}});
jcA('shukan','週間','しゅうかん','Q','wk',5,'minggu (durasi)','休み|🏖️|libur;出張|💼|dinas luar','1 いっしゅうかん, 8 はっしゅうかん, 10 じゅっしゅうかん.');
jcA('nichi','日','にち','R','wk',5,'hari (durasi / tanggal)','旅行|🧳|perjalanan;休み|🏖️|libur','Bacaan asli 1–10: いちにち・ふつか・みっか・よっか・いつか・むいか・なのか・ようか・ここのか・とおか.',{ov:{1:'いちにち',2:'ふつか',3:'みっか',4:'よっか',5:'いつか',6:'むいか',7:'なのか',8:'ようか',9:'ここのか',10:'とおか',0:'なんにち'},al:{1:['ついたち']}});
jcA('jikan','時間','じかん','R','wk',5,'jam (durasi)','勉強|📚|belajar;仕事|💼|bekerja;睡眠|😴|tidur','4 よじかん, 7 ななじかん, 9 くじかん.',{ov:{4:'よじかん',7:'ななじかん',9:'くじかん'},al:{7:['しちじかん'],9:['きゅうじかん']}});
jcA('fun','分','ふん','F','wk',5,'menit','待つ|⏳|menunggu;歩く|🚶|berjalan;電車|🚃|kereta','ふん/ぷん: 1・3・4・6・8・10 = ぷん; 2・5・7・9 = ふん.',{al:{7:['しちふん']}});
jcA('byo','秒','びょう','R','wk',4,'detik','タイム|⏱️|catatan waktu;ゴール|🏁|garis akhir','Tidak ada perubahan bunyi.');
jcA('sai','歳','さい','Q','wk',5,'usia (tahun)','子ども|🧒|anak;兄|👦|kakak laki-laki;赤ちゃん|👶|bayi','20歳 = はたち (khusus, di luar 1–10). Boleh ditulis 才.',{cs:['才'],db:{6:['ろっさい']}});
jcA('seiki','世紀','せいき','R','wk',2,'abad','二十一世紀|🌐|abad ke-21;歴史|🏛️|sejarah','');
/* makan-minum */
jcA('hai','杯','はい','H','mm',5,'cangkir, gelas, mangkuk','コーヒー|☕|kopi;ビール|🍺|bir;お茶|🍵|teh;ご飯|🍚|nasi (mangkuk)','いっぱい・さんばい・ろっぱい・はっぱい・じゅっぱい.');
jcA('zen','膳','ぜん','R','mm',2,'sepasang sumpit / semangkuk nasi','お箸|🥢|sumpit;ご飯の膳|🍱|set nasi','');
jcA('kire','切れ','きれ','R','mm',3,'potong / iris','ケーキの切れ|🍰|potong kue;ピザ|🍕|pizza;スイカ|🍉|semangka','1 ひときれ, 2 ふたきれ.',{ov:{1:'ひときれ',2:'ふたきれ'},al:{8:['はっきれ'],10:['じゅっきれ']},db:{6:['ろっきれ']}});
jcA('sara','皿','さら','R','mm',3,'piring (hidangan)','ステーキ|🥩|steik;サラダ|🥗|salad;カレー|🍛|kari','1 ひとさら, 2 ふたさら.',{ov:{1:'ひとさら',2:'ふたさら'}});
jcA('tsubu','粒','つぶ','R','mm',2,'butir kecil','米|🍚|butir beras;ぶどう|🍇|anggur;あめ|🍬|permen kecil','1 ひとつぶ, 2 ふたつぶ.',{ov:{1:'ひとつぶ',2:'ふたつぶ'}});
jcA('tama','玉','たま','R','mm',2,'bola / gumpal','キャベツ|🥬|kubis;うどん|🍜|mi udon (porsi);スイカの玉|🍉|semangka utuh','1 ひとたま, 2 ふたたま.',{ov:{1:'ひとたま',2:'ふたたま'}});
jcA('fusa','房','ふさ','R','mm',2,'sisir / tandan','バナナ|🍌|pisang;ぶどうの房|🍇|tandan anggur','1 ひとふさ, 2 ふたふさ.',{ov:{1:'ひとふさ',2:'ふたふさ'}});
jcA('cho','丁','ちょう','Q','mm',2,'blok (tahu), pisau','豆腐|🟨|tahu;包丁|🔪|pisau dapur','Juga untuk alamat: 〜丁目.');
/* pakaian & pasangan */
jcA('chaku','着','ちゃく','Q','pk',4,'setel pakaian','スーツ|🤵|setelan jas;ドレス|👗|gaun;コート|🧥|mantel','1 いっちゃく, 8 はっちゃく, 10 じゅっちゃく.');
jcA('soku','足','そく','Q','pk',4,'pasang alas kaki','靴|👟|sepatu;靴下|🧦|kaus kaki;スリッパ|🩴|sandal rumah','3 さんぞく dan 何 なんぞく.',{ov:{3:'さんぞく',0:'なんぞく'}});
jcA('kumi','組','くみ','R','pk',3,'set / pasangan / kelas','カップル|👫|pasangan;トランプ|🃏|set kartu','1 ひとくみ (kelas 1 = いちくみ).',{ov:{1:'ひとくみ',2:'ふたくみ'},al:{1:['いちくみ'],2:['にくみ']}});
jcA('tsui','対','つい','R','pk',2,'sepasang','イヤリング|💎|anting;花瓶|🏺|vas bunga','1 いっつい, 2 につい.',{ov:{1:'いっつい'},al:{1:['いちつい']}});
/* v7.72 tahap 2 */
/* bunga & tumbuhan */
jcA('rin','輪','りん','R','bg',2,'bunga (tangkai)','バラ|🌹|mawar;チューリップ|🌷|tulip;ひまわり|🌻|bunga matahari','Bunga tunggal; sekuntum bunga 一輪 いちりん.');
jcA('kabu','株','かぶ','K','bg',2,'pohon kecil / rumpun / saham','苗|🌱|bibit;サボテン|🌵|kaktus;会社の株|📈|saham perusahaan','1 いっかぶ, 6 ろっかぶ, 8 はっかぶ, 10 じゅっかぶ. Juga satuan saham.');
jcA('taba','束','たば','R','bg',3,'ikat / seikat','花束|💐|buket bunga;ほうれん草|🥬|bayam seikat;お札の束|💴|seikat uang kertas','1 ひとたば, 2 ふたたば; seterusnya angka biasa.',{ov:{1:'ひとたば',2:'ふたたば'},al:{1:['いちたば'],2:['にたば']}});
/* tulisan & cetak */
jcA('tsu2','通','つう','Q','tl',3,'surat / dokumen / email','手紙|✉️|surat;メール|📧|email;書類|📄|dokumen resmi','1 いっつう, 8 はっつう, 10 じゅっつう.');
jcA('ken2','件','けん','K','tl',3,'kasus / perkara / pesan','メッセージ|💬|pesan;事件|🚨|kasus;予約|📅|reservasi','Tidak berubah jadi げん (beda dengan 軒): 3件 さんけん.');
jcA('gyo','行','ぎょう','R','tl',3,'baris tulisan','詩|📜|puisi;手紙の行|✉️|baris surat;コードの行|💻|baris kode','Tidak ada perubahan bunyi.');
jcA('ku','句','く','K','tl',2,'larik / frasa haiku','俳句|🎋|haiku;川柳|📝|senryu;名句|📖|kutipan indah','1 いっく, 6 ろっく, 8 はっく, 10 じゅっく.');
jcA('shu','首','しゅ','Q','tl',2,'puisi (waka, syair)','和歌|🎴|waka;詩の首|📜|syair;歌|🎶|lagu klasik','1 いっしゅ, 8 はっしゅ, 10 じゅっしゅ.');
jcA('wa2','話','わ','R','tl',3,'episode / cerita','アニメの話|📺|episode anime;ドラマの話|🎬|episode drama;昔話|📖|dongeng','第3話 だいさんわ = episode ke-3. Tidak ada perubahan bunyi.');
/* olahraga */
jcA('shiai','試合','しあい','R','ol',3,'pertandingan','サッカーの試合|⚽|pertandingan bola;野球の試合|⚾|pertandingan bisbol;テニスの試合|🎾|pertandingan tenis','1 いちしあい (juga ひとしあい).',{al:{1:['ひとしあい']}});
jcA('sho','勝','しょう','Q','ol',3,'kemenangan','優勝|🏆|juara;勝利|🥇|menang;連勝|🔥|menang beruntun','1 いっしょう, 8 はっしょう, 10 じゅっしょう.');
jcA('hai2','敗','はい','H','ol',3,'kekalahan','負け|😢|kalah;連敗|📉|kalah beruntun;敗戦|🏳️|kekalahan','3 さんぱい (bukan ば). 1 いっぱい, 6 ろっぱい.',{ov:{3:'さんぱい',0:'なんぱい'},al:{3:['さんばい']}});
jcA('wake','分け','わけ','R','ol',2,'seri (hasil imbang)','引き分け|🤝|imbang;ドロー|⚖️|draw','1 いちわけ, 2 にわけ; 5勝3敗2分け.');
jcA('ten','点','てん','Q','ol',4,'skor / poin / butir','ゴール|🥅|gol;テスト|📝|nilai ujian;得点|🔢|skor','1 いってん, 8 はってん, 10 じゅってん.');
jcA('da','打','だ','R','ol',2,'pukulan (bisbol)','ヒット|⚾|hit;打席|🏏|giliran memukul','Tidak ada perubahan bunyi: 3打数 さんだすう.');
jcA('hatsu','発','はつ','H','ol',3,'tembakan / ledakan / peluru','弾丸|🔫|peluru;花火|🎆|kembang api;ホームラン|⚾|home run','Bacaan khusus: 3 さんぱつ, 1 いっぱつ, 6 ろっぱつ, 8 はっぱつ, 10 じゅっぱつ.',{ov:{3:'さんぱつ',0:'なんぱつ'}});
/* alat & benda spesifik */
jcA('cho2','挺','ちょう','Q','al',2,'senjata / tinta / kereta kuda ringan','銃|🔫|senapan;墨|🖋️|batang tinta;三味線|🪕|shamisen','Penggolong untuk benda bergagang. 1 いっちょう, 8 はっちょう.');
jcA('cho3','張','ちょう','Q','al',2,'benda berselaput / membentang','弓|🏹|busur;テント|⛺|tenda;提灯|🏮|lampion','1 いっちょう, 8 はっちょう.');
jcA('kyaku','脚','きゃく','K','al',3,'kursi, meja (berkaki)','椅子|🪑|kursi;テーブル|🍽️|meja;ソファ|🛋️|sofa','1 いっきゃく, 6 ろっきゃく, 8 はっきゃく, 10 じゅっきゃく.');
jcA('men','面','めん','R','al',2,'cermin, lapangan, halaman koran','鏡|🪞|cermin;テニスコート|🎾|lapangan tenis;一面記事|📰|halaman depan','Tidak ada perubahan bunyi.');
jcA('ki2','基','き','K','al',2,'bangunan tinggi / monumen / reaktor','塔|🗼|menara;原子炉|☢️|reaktor;墓|🪦|makam','1 いっき, 6 ろっき, 8 はっき, 10 じゅっき.');
jcA('jo','錠','じょう','R','al',3,'tablet / pil','薬|💊|obat;ビタミン剤|💊|tablet vitamin','Tidak ada perubahan bunyi.');
jcA('ho','包','ほう','H','al',2,'bungkus obat bubuk','粉薬|💊|obat bubuk;漢方薬|🌿|obat herbal','3 さんぽう. 1 いっぽう, 6 ろっぽう.',{ov:{3:'さんぽう',0:'なんぽう'}});
jcA('hako','箱','はこ','R','al',4,'kotak','ティッシュ|📦|tisu;お菓子|🍪|kue kering;タバコ|🚬|kotak rokok','1 ひとはこ, 2 ふたはこ.',{ov:{1:'ひとはこ',2:'ふたはこ'}});
jcA('fukuro','袋','ふくろ','R','al',4,'kantong','お米|🍚|beras;パン|🍞|roti;お菓子の袋|🍬|permen kantong','1 ひとふくろ, 2 ふたふくろ.',{ov:{1:'ひとふくろ',2:'ふたふくろ'}});
jcA('kan2','缶','かん','K','al',4,'kaleng','缶ビール|🍺|bir kaleng;缶コーヒー|☕|kopi kaleng;ジュース缶|🥤|jus kaleng','1 いっかん, 6 ろっかん, 8 はっかん, 10 じゅっかん.');
jcA('bin','瓶','びん','R','al',3,'botol (kaca)','牛乳瓶|🥛|botol susu;ワイン瓶|🍷|botol anggur;醤油瓶|🍶|botol kecap','1 ひとびん, 2 ふたびん (juga いっぴん).',{ov:{1:'ひとびん',2:'ふたびん'},al:{1:['いっぴん'],2:['にびん']}});
/* satuan ukur */
jcA('en','円','えん','R','uk',5,'yen','おにぎり円|🍙|harga onigiri;切符|🎫|tiket;お釣り|🪙|uang kembali','4 よえん, 7 ななえん (しちえん), 9 きゅうえん (くえん).',{ov:{4:'よえん',7:'ななえん',9:'きゅうえん'},al:{4:['よんえん'],7:['しちえん'],9:['くえん']}});
jcA('endama','円玉','えんだま','R','uk',3,'koin yen','十円玉|🪙|koin 10 yen;五円玉|🪙|koin 5 yen;百円玉|🪙|koin 100 yen','4 よえんだま, 7 ななえんだま, 9 きゅうえんだま (くえんだま).',{ov:{4:'よえんだま',7:'ななえんだま',9:'きゅうえんだま'},al:{4:['よんえんだま'],7:['しちえんだま'],9:['くえんだま']}});
jcA('metoru','メートル','めーとる','R','uk',4,'meter','プール|🏊|kolam renang;高さ|📏|tinggi;距離|🛣️|jarak','Tidak ada perubahan bunyi.');
jcA('kiro','キロ','きろ','K','uk',5,'kilo (km / kg)','マラソン|🏃|maraton;お米のキロ|🍚|beras;体重|⚖️|berat badan','Bacaan khusus: 1 いっきろ, 6 ろっきろ, 8 はっきろ, 10 じゅっきろ.');
jcA('guramu','グラム','ぐらむ','R','uk',4,'gram','お肉|🥩|daging;砂糖|🧂|gula;バター|🧈|mentega','Tidak ada perubahan bunyi.');
jcA('rittoru','リットル','りっとる','R','uk',4,'liter','水|💧|air;ガソリン|⛽|bensin;牛乳|🥛|susu','Tidak ada perubahan bunyi.');
jcA('senchi','センチ','せんち','Q','uk',4,'sentimeter','身長|🧍|tinggi badan;定規|📏|penggaris;雪|❄️|salju','1 いっせんち, 8 はっせんち, 10 じゅっせんち.',{al:{6:['ろっせんち']}});
jcA('miri','ミリ','みり','R','uk',3,'milimeter','雨量|🌧️|curah hujan;ネジ|🔩|baut','Tidak ada perubahan bunyi.');
jcA('ton','トン','とん','Q','uk',3,'ton','トラック|🚚|truk;貨物|📦|muatan;鉄|⚙️|besi','1 いっとん, 8 はっとん, 10 じゅっとん.',{al:{6:['ろっとん']}});
jcA('ho2','歩','ほ','H','uk',3,'langkah','一歩|👣|satu langkah;散歩|🚶|jalan santai;歩数|🔢|jumlah langkah','3 さんぽ, 1 いっぽ, 6 ろっぽ, 8 はっぽ, 10 じゅっぽ.',{ov:{3:'さんぽ',0:'なんぽ'}});
jcA('jo2','畳','じょう','R','uk',3,'tatami / luas ruang','六畳|🏯|ruang 6 tatami;和室|🎍|kamar Jepang;四畳半|🏠|ruang 4,5 tatami','4 よじょう, 7 ななじょう; 四畳半 よじょうはん.',{ov:{4:'よじょう',7:'ななじょう'},al:{4:['よんじょう'],7:['しちじょう']}});
jcA('tsubo','坪','つぼ','R','uk',2,'tsubo (±3,3 m²)','土地|🏞️|tanah;マンション坪|🏬|luas apartemen','1 いちつぼ (juga ひとつぼ).',{al:{1:['ひとつぼ']}});
jcA('wari','割','わり','R','uk',3,'persepuluh (10%)','打率|⚾|rata-rata pukulan;割引|🏷️|diskon;成功率|📊|tingkat sukses','3割 さんわり = 30%. 10割 じゅうわり = 100%.');
jcA('pasento','パーセント','ぱーせんと','R','uk',4,'persen','成功率パーセント|📊|persentase sukses;消費税|🧾|pajak konsumsi;電池|🔋|baterai','Bacaan baku tanpa sokuon; versi dengan sokuon (いっぱーせんと) diperdebatkan.',{db:{1:['いっぱーせんと'],6:['ろっぱーせんと'],8:['はっぱーせんと'],10:['じゅっぱーせんと','じっぱーせんと']}});
/* lain-lain */
jcA('i','位','い','R','lm',4,'peringkat','順位|🏅|peringkat;マラソンの順位|🏃|peringkat maraton;ランキング|📊|ranking','Tidak ada perubahan bunyi: 1位 いちい, 4位 よんい.');
jcA('kyu','級','きゅう','K','lm',3,'tingkat / kelas (JLPT, kyu)','日本語能力試験|📝|JLPT;漢検|🈁|ujian kanji;柔道|🥋|judo','1 いっきゅう, 6 ろっきゅう, 8 はっきゅう, 10 じゅっきゅう; 9 きゅうきゅう.');
jcA('dan','段','だん','R','lm',3,'dan / tingkat / anak tangga','柔道|🥋|judo (dan);階段|🪜|anak tangga;本棚|📚|rak buku','Tidak ada perubahan bunyi.');
jcA('go','号','ごう','R','lm',3,'nomor (edisi, kamar, topan)','台風|🌀|topan;雑誌|📖|edisi majalah;部屋番号|🚪|nomor kamar','Tidak ada perubahan bunyi.');
jcA('peji','ページ','ぺーじ','H','lm',5,'halaman','教科書|📘|buku pelajaran;雑誌のページ|📖|halaman majalah;ノートのページ|📒|halaman buku tulis','1 いっページ, 3 さんページ, 6 ろっページ, 8 はっページ, 10 じゅっページ.',{cs:['頁']});
jcA('kaku','画','かく','K','lm',3,'coretan kanji','漢字|🈳|kanji;名前|✍️|nama;画数|🔢|jumlah coretan','1 いっかく, 6 ろっかく, 8 はっかく, 10 じゅっかく.');
jcA('ji','字','じ','R','lm',4,'karakter / huruf','漢字の字|🈳|karakter kanji;文字|🔤|huruf;四字熟語|📜|idiom empat karakter','4 よじ (四字熟語 よじじゅくご), 7 ななじ.',{ov:{4:'よじ',7:'ななじ'},al:{4:['よんじ'],7:['しちじ']}});
JCC.find(c=>c.id=='tsu').kj=(()=>{const k={0:['幾つ'],10:['10','十']};for(let n=1;n<=9;n++)k[n]=[n+'つ',jaN(n)+'つ'];return k})();
/* indeks benda → penggolong yang sah */
const JCOBJ={};JCC.forEach(c=>c.ex.forEach(e=>{(JCOBJ[e[0]]=JCOBJ[e[0]]||[]).push(c.id)}));
/* ---- bacaan ---- */
function jcRd(c,n){const b=c.b,t=c.ty;let m;
 if(c.ov&&c.ov[n]!=null)m=c.ov[n];
 else if(n==0)m='なん'+(t=='H'?jcDk(b,0):t=='F'?jcDk(b,1):b);
 else if(t=='R')m=JCN[n]+b;
 else if(t=='H'||t=='F'){const p=jcDk(b,1);m=n==1?'いっ'+p:n==6?'ろっ'+p:n==8?'はっ'+p:n==10?'じゅっ'+p:n==3?'さん'+(t=='F'?p:jcDk(b,0)):n==4&&t=='F'?'よん'+p:JCN[n]+b}
 else m=n==1?'いっ'+b:n==6?(t=='K'?'ろっ':'ろく')+b:n==8?'はっ'+b:n==10?'じゅっ'+b:JCN[n]+b;
 const o=[{r:m,t:0}],add=(a,tt)=>(a||[]).forEach(r=>{if(!o.some(z=>z.r==r))o.push({r,t:tt})});
 if(!(c.ov&&c.ov[n]!=null)&&n&&t!='R'){if(n==8)add(['はち'+b],1);if(n==10)add(['じっ'+(t=='H'||t=='F'?jcDk(b,1):b)],1)}
 add(c.al&&c.al[n],1);add(c.db&&c.db[n],2);return o}
function jcKan(c,n){if(c.kj&&c.kj[n])return c.kj[n];const o=[];for(const k of [c.c].concat(c.cs||[])){if(n==0)o.push('何'+k,'なん'+k);else o.push(n+k,jaN(n)+k)}return o}
const jcIrr=c=>{for(let n=0;n<=10;n++)if(jcRd(c,n)[0].r!=(n?JCN[n]:'なん')+c.b)return true;return false};
/* ---- penilaian ---- */
function jcNorm(s){s=String(s==null?'':s).normalize('NFKC').replace(/[ヶヵケ]/g,'か').replace(/[\s。、，．,.！!？?「」『』・~〜]/g,'').replace(/(です|だよ)$/,'');return s.replace(/[ァ-ヶ]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-96))}
const jcCache={};
function jcForms(c,n){const k=c.id+'|'+n;if(jcCache[k])return jcCache[k];const rd=new Map(),kj=new Set();
 jcRd(c,n).forEach(z=>{const s=jcNorm(z.r);if(!rd.has(s))rd.set(s,z.t)});jcKan(c,n).forEach(z=>kj.add(jcNorm(z)));return jcCache[k]={rd,kj}}
function jcAnySet(c){const k=c.id+'|any';if(jcCache[k])return jcCache[k];const s=new Set([jcNorm(c.c),jcNorm(c.b),jcNorm('何'+c.c)]);
 for(const x of [c.c].concat(c.cs||[]))s.add(jcNorm(x));if(c.ty=='H'||c.ty=='F')for(let i=0;i<2;i++)s.add(jcNorm(jcDk(c.b,i)));
 for(let n=0;n<=10;n++){const f=jcForms(c,n);f.rd.forEach((v,x)=>s.add(x));f.kj.forEach(x=>s.add(x))}return jcCache[k]=s}
/* cs = penggolong yang sah; n = 0..10 (0 = 何); mode A (kanji/angka saja) · B (bacaan; kanji hanya bila suara) · O (penggolong saja) */
function jcJudge(cs,n,mode,alts,how){for(const a of alts||[]){const s=jcNorm(a);if(!s)continue;
  for(const c of cs){
   if(mode=='O'){if(jcAnySet(c).has(s))return {ok:true,got:c.c+' ('+c.b+')',c};continue}
   const f=jcForms(c,n);
   if(mode=='A'){if(f.kj.has(s))return {ok:true,got:jcRd(c,n)[0].r,c}}
   else if(f.rd.has(s)||(how!='type'&&f.kj.has(s)))return {ok:true,got:jcRd(c,n)[0].r,c,tier:f.rd.get(s)}}}
 return {ok:false,got:null}}
/* ---- tampilan ---- */
function jcTab(c){let h='<div class=jctab>';for(let n=1;n<=10;n++){const r=jcRd(c,n),irr=r[0].r!=JCN[n]+c.b;h+=`<span class="jcc${irr?' irr':''}"><b>${n}</b> ${esc(r[0].r)}${r.length>1?'<small> / '+esc(r.slice(1).map(z=>z.r).join(' / '))+'</small>':''}</span>`}
 const w=jcRd(c,0);h+=`<span class="jcc${w[0].r!='なん'+c.b?' irr':''}"><b>何</b> ${esc(w[0].r)}${w.length>1?'<small> / '+esc(w.slice(1).map(z=>z.r).join(' / '))+'</small>':''}</span></div>`;
 return h+`<div class=jcex>${c.ex.map(e=>esc(e[1]+' '+e[0]+' ('+e[2]+')')).join(' · ')}</div>`}
function jcCells(o){const ms=o.modes||[],Q=['rd','cnt','obj','nan'].filter(m=>ms.includes(m));if(!Q.length)return[];
 const gs=JCGK.filter(g=>ms.includes('g_'+g)),D={rd:['A','B'],nan:['A','B'],cnt:['B'],obj:['B']},cs=[];
 for(const c of JCC){if(gs.length&&!gs.includes(c.g))continue;if(ms.includes('fr')&&c.lv<3)continue;if(ms.includes('irr')&&!jcIrr(c))continue;
  for(const md of Q)for(const dir of D[md]){if(o.dir!='M'&&o.dir!=dir)continue;cs.push({k:'jc|'+c.id+'|'+md+'|'+dir,cn:c.id,md,dir})}}
 return cs}
function jcMake(cell){const c=JCI[cell.cn];if(!c)return null;const md=cell.md,dir=cell.dir,n=md=='rd'||md=='cnt'?vgRi(1,10):0,R=jcRd(c,n),r0=R[0].r;
 const q={L:'ja',dir,kind:'jc',cell:c.c+' · '+JCM[md]},kd=c.kj&&c.kj[n],k=n?(kd?kd[1]||kd[0]:jaN(n)+c.c):(kd?kd[0]:'何'+c.c),dg=n?(kd?kd[0]:n+c.c):k;
 q.say=md=='obj'?c.b:r0;q.words=md=='obj'?c.b:r0;q.exp={c:c.id,n,md};
 const al=R.filter(z=>z.t==1).map(z=>z.r),db=R.filter(z=>z.t==2).map(z=>z.r);
 let tip=c.nt;if(jcIrr(c))tip+=(tip?' ':'')+'Perhatikan perubahan bunyi (merah di tabel).';
 q.ansHtml=jcTab(c);
 q.key={main:md=='obj'?c.c+' ('+c.b+') — '+c.m:k+' = '+r0,sub:(md=='obj'?'':c.c+' ('+c.b+') — '+c.m)+(al.length?' · Lazim: '+al.join('・'):'')+(db.length?' · Diperdebatkan: '+db.join('・'):''),tip,x:''};
 if(md=='rd'||md=='nan'){q.show=dg;q.hn=md=='nan'?'bacaan 何〜':'bilangan + penggolongnya';
  if(dir=='A'){q.ph=md=='nan'?'mis. 何本':'mis. 3本';q.inm='text';q.judge=(a,h)=>jcJudge([c],n,'A',a,h)}
  else{q.ph='ketik hiragana, mis. '+(md=='nan'?'なんぼん':'さんぼん');q.inm='text';q.judge=(a,h)=>jcJudge([c],n,'B',a,h)}
  return q}
 const e=vgPick(c.ex),cs=(JCOBJ[e[0]]||[c.id]).map(i=>JCI[i]);if(cs.indexOf(c)>0){cs.splice(cs.indexOf(c),1);cs.unshift(c)}
 q.noBig=true;q.hn=md=='obj'?'penggolongnya':'jumlah + penggolongnya';
 q.show=e[1]+(md=='cnt'?' ×'+n:'');
 q.html=`<div class=jcem>${md=='cnt'?esc(e[1].repeat(n)):esc(e[1])}</div><div class=jcob>${esc(e[0])} <small>(${esc(e[2])})</small>${md=='cnt'?' × '+n:''}</div>`;
 if(cs.length>1)q.key.tip+=(q.key.tip?' ':'')+'Penggolong lain yang juga sah untuk benda ini: '+cs.filter(z=>z!==c).map(z=>z.c).join('・')+'.';
 if(md=='obj'){q.ph='mis. 本 / ほん';q.judge=(a,h)=>jcJudge(cs,0,'O',a,h)}
 else{q.ph='ketik hiragana, mis. '+r0;q.judge=(a,h)=>jcJudge(cs,n,'B',a,h)}
 return q}
VG.jcn={lg:'ja',pre:'jc|',modes:JCM,dirs:JCDIR,def:{n:10,r:200,modes:['rd','cnt','obj','fr'],dir:'M',inp:'v'},cells:o=>jcCells(o),make:c=>jcMake(c)};
