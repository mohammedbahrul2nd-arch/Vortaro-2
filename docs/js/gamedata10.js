/* ===== Game Speaking Cloze (scl_<lang>) v7.79 — mesin VG (games3.js) =====
   Terjemahkan kalimat Indonesia ke bahasa target secara LISAN dengan kerangka kalimat bersegmen.
   Pengaturan (semua independen): vp % clue kosakata ('one' = satu saja) · vpl penempatan in/se/mx · vin % inline (mixed) · gh grammar hint 1/0 ·
   shp % segmen yang diberi label struktur (struktur selalu aktif, minimal 1 label) · thr ambang lulus · level (o.lvs).
   Penilaian: kosakata 30 · grammar 25 · struktur 25 · kelengkapan 20 (grammar diabaikan & bobot dibagi ulang bila tak bisa dicek). TIDAK menilai pelafalan.
   Data: 'lv|arti Indonesia|segmen~peran¦…|kosakata kata=arti@segmen:bentuk~bentuk,…|grammar label=penjelasan=cek~cek;…|alternatif¦…'.
   Catatan kinerja terpisah dari SRS utama: S.scs[lang] (ringkasan) dan S.scv['kata@lang'] (produksi per kata). */
const SCROLE={s:'Subjek',p:'Predikat',o:'Objek',so:'Subjek + predikat',po:'Predikat + objek',w:'Keterangan waktu',t:'Keterangan tempat',tp:'Tujuan / arah',c:'Alat / cara',r:'Klausa sebab',k:'Klausa syarat',n:'Klausa konsesif',z:'Klausa tujuan',q:'Klausa kutipan',rl:'Klausa relatif',m:'Pembanding',a:'Keterangan',b:'Pelengkap',ac:'Teman bersama',mo:'Modal + subjek',ob:'Objek + predikat',pp:'Predikat + pelengkap',tpp:'Tujuan + predikat',x:'Bagian kalimat',top:'Topik',adj:'Sifat / keadaan',ng:'Negasi + predikat',asp:'Aspek / predikat',cl:'Klausa lanjutan'};
const SCM={a:'Pendek (2–3 segmen)',b:'Sedang (4 segmen)',c:'Panjang (5+ segmen)'};
const SCD={
ja:`N4|Meskipun hujan turun, saya tetap pergi ke universitas.|雨が降っても、~n¦私は~s¦大学に行きます。~tpp|雨=hujan@1:雨~あめ,降る=turun@1:降~ふ,私=saya@2:私~わたし,大学=universitas@3:大学~だいがく,行く=pergi@3:行~い|～ても=menyatakan "meskipun" (V-て + も)=ても~でも;～ます=bentuk sopan=ます;に=penanda tujuan=に|
N5|Setiap pagi saya minum kopi di rumah.|毎朝、~w¦私は~s¦家で~t¦コーヒーを飲みます。~ob|毎朝=setiap pagi@1:毎朝~まいあさ,家=rumah@3:家~いえ~うち,コーヒー=kopi@4:コーヒー,飲む=minum@4:飲~の|で=penanda tempat kegiatan=で;を=penanda objek=を;ます=bentuk sopan=ます|私は毎朝家でコーヒーを飲みます。
N5|Kemarin saya makan sushi bersama teman.|昨日、~w¦友達と~ac¦寿司を~o¦食べました。~p|昨日=kemarin@1:昨日~きのう,友達=teman@2:友達~ともだち,寿司=sushi@3:寿司~すし,食べる=makan@4:食べ~た|と=penanda "bersama"=と;ました=lampau sopan=ました;を=penanda objek=を|友達と昨日寿司を食べました。
N5|Besok saya akan pergi ke Tokyo naik kereta.|明日、~w¦電車で~c¦東京へ~tp¦行きます。~p|明日=besok@1:明日~あした,電車=kereta@2:電車~でんしゃ,東京=Tokyo@3:東京~とうきょう,行く=pergi@4:行~い|で=penanda alat transportasi=で;へ=penanda arah=へ~に|
N4|Karena sakit, hari ini saya tidak masuk sekolah.|病気なので、~r¦今日は~w¦学校に~tp¦行きませんでした。~p|病気=sakit@1:病気~びょうき,今日=hari ini@2:今日~きょう,学校=sekolah@3:学校~がっこう,行く=pergi@4:行~い|～ので=karena (alasan objektif)=ので;～ませんでした=negatif lampau sopan=ませんでした|
N4|Kalau ada waktu, mari kita menonton film bersama.|時間があれば、~k¦一緒に~a¦映画を見ましょう。~ob|時間=waktu@1:時間~じかん,一緒に=bersama@2:一緒~いっしょ,映画=film@3:映画~えいが,見る=melihat@3:見~み|～ば=kondisional "kalau"=ば;～ましょう=ajakan "mari"=ましょう|
N4|Saya belajar bahasa Jepang agar bisa bekerja di Jepang.|日本で働くために、~z¦私は~s¦日本語を~o¦勉強しています。~p|日本=Jepang@1:日本~にほん,働く=bekerja@1:働~はたら,日本語=bahasa Jepang@3:日本語~にほんご,勉強=belajar@4:勉強~べんきょう|～ために=tujuan "agar"=ために;～ています=sedang / terus-menerus=ています~ている|
N4|Buku yang saya beli kemarin sangat menarik.|昨日買った本は、~rl¦とても~a¦面白いです。~adj|昨日=kemarin@1:昨日~きのう,買う=membeli@1:買~か,本=buku@1:本~ほん,とても=sangat@2:とても,面白い=menarik@3:面白~おもしろ|買った本=klausa relatif (bentuk biasa + kata benda)=買った~かった;は=penanda topik=は|
N4|Setelah makan malam, saya biasanya menonton televisi.|晩ご飯を食べた後で、~w¦私は~s¦たいていテレビを見ます。~ob|晩ご飯=makan malam@1:晩ご飯~ばんごはん,後=setelah@1:後~あと,たいてい=biasanya@3:たいてい,テレビ=televisi@3:テレビ,見る=melihat@3:見~み|～た後で=setelah melakukan=あとで~後で;を=penanda objek=を|
N3|Meskipun lelah, dia bekerja sampai larut malam.|疲れていても、~n¦彼は~s¦夜遅くまで~w¦働きました。~p|疲れる=lelah@1:疲~つか,彼=dia (lk)@2:彼~かれ,夜遅く=larut malam@3:夜遅~よるおそ,働く=bekerja@4:働~はたら|～ていても=meskipun dalam keadaan itu=ても~でも;まで=sampai (batas waktu)=まで|
N3|Dia mengatakan bahwa besok tidak akan datang.|彼は~s¦明日は~w¦来ないと~q¦言っていました。~p|彼=dia (lk)@1:彼~かれ,明日=besok@2:明日~あした,来る=datang@3:来~こ,言う=berkata@4:言~い|～ないと言う=kutipan: bentuk biasa + と + 言う=と言~といっ~といい;～ない=negatif bentuk biasa=ない|
N5|Saya suka musik, tetapi tidak suka olahraga.|私は~top¦音楽が好きですが、~cl¦スポーツは~top¦好きじゃありません。~ng|音楽=musik@2:音楽~おんがく,好き=suka@2:好き~すき,スポーツ=olahraga@3:スポーツ|が (objek perasaan)=好き memakai が=が;が (tetapi)=ですが=ですが~が;じゃありません=negatif sopan=じゃありません~ではありません|
N5|Perpustakaan ada di dekat stasiun.|図書館は~top¦駅の~t¦近くに~t¦あります。~p|図書館=perpustakaan@1:図書館~としょかん,駅=stasiun@2:駅~えき,近く=dekat@3:近~ちか,ある=ada@4:あ|の=penghubung nomina=の;にあります=keberadaan benda mati=にあります~にあり|
N4|Di masa depan saya ingin menjadi dokter.|将来、~w¦私は~s¦医者に~b¦なりたいです。~p|将来=masa depan@1:将来~しょうらい,医者=dokter@3:医者~いしゃ,なる=menjadi@4:なり~な|～たい=ingin melakukan=たい;になる=menjadi=になり~になる~に|
N3|Karena kereta terlambat, saya terlambat ke kantor.|電車が遅れたので、~r¦会社に~tp¦遅刻しました。~p|電車=kereta@1:電車~でんしゃ,遅れる=terlambat@1:遅~おく,会社=kantor@2:会社~かいしゃ,遅刻=terlambat@3:遅刻~ちこく|～ので=karena=ので;が=penanda subjek=が|
N3|Guru menyuruh murid-murid membaca buku.|先生は~s¦学生に~o¦本を~o¦読ませました。~p|先生=guru@1:先生~せんせい,学生=murid@2:学生~がくせい,本=buku@3:本~ほん,読む=membaca@4:読~よ|～させる=kausatif "menyuruh"=ませ~させ~せました|
N5|Ayah saya bekerja di rumah sakit.|父は~top¦病院で~t¦働いています。~p|父=ayah saya@1:父~ちち,病院=rumah sakit@2:病院~びょういん,働く=bekerja@3:働~はたら|で=penanda tempat kegiatan=で;～ています=keadaan berlangsung=ています~ている|
N5|Bulan depan kami akan berlibur ke pantai.|来月、~w¦私たちは~s¦海へ~tp¦遊びに行きます。~p|来月=bulan depan@1:来月~らいげつ,私たち=kami@2:私たち~わたしたち,海=pantai@3:海~うみ,遊ぶ=bermain@4:遊~あそ|～に行く=pergi untuk melakukan=にいき~に行~にいく|
N5|Dia membeli roti di toko dekat rumah.|彼女は~s¦家の近くの店で~t¦パンを~o¦買いました。~p|彼女=dia (pr)@1:彼女~かのじょ,近く=dekat@2:近~ちか,店=toko@2:店~みせ,パン=roti@3:パン,買う=membeli@4:買~か|で=tempat kegiatan=で;を=objek=を|
N4|Tolong buka jendelanya karena di sini panas.|ここは暑いので、~r¦窓を~o¦開けてください。~p|暑い=panas@1:暑~あつ,窓=jendela@2:窓~まど,開ける=membuka@3:開~あ|～ので=karena=ので;～てください=permintaan "tolong"=てください~て下さい|
N4|Saya belum makan karena belum lapar.|お腹がすいていないので、~r¦まだ~a¦食べていません。~ng|お腹=perut@1:お腹~なか,すく=lapar@1:すい~すく,まだ=belum@2:まだ,食べる=makan@3:食べ~た|まだ～ていません=belum melakukan=ていません~ていない|
N4|Setelah bekerja, dia pergi berenang bersama teman-temannya.|仕事の後で、~w¦彼は~s¦友達と~ac¦泳ぎに行きました。~p|仕事=pekerjaan@1:仕事~しごと,後=setelah@1:後~あと,彼=dia@2:彼~かれ,友達=teman@3:友達~ともだち,泳ぐ=berenang@4:泳~およ|～の後で=setelah (nomina)=あとで~後で;～に行く=pergi untuk=に行~にいき|
N5|Saya tinggal di kota kecil bersama keluarga.|私は~s¦家族と~ac¦小さい町に~t¦住んでいます。~p|家族=keluarga@2:家族~かぞく,小さい=kecil@3:小さい~ちいさい,町=kota@3:町~まち,住む=tinggal@4:住んで~住む|と=bersama=と;に=penanda tempat tinggal=に;ています=keadaan berlanjut=でいます~ています|
N5|Dia sedang membaca buku di perpustakaan.|彼女は~s¦図書館で~t¦本を~o¦読んでいます。~p|図書館=perpustakaan@2:図書館~としょかん,本=buku@3:本~ほん,読む=membaca@4:読んで~読む|で=tempat kegiatan=で;を=objek=を;ています=sedang melakukan=でいます~ています|
N5|Malam ini kami makan malam pukul tujuh.|今夜、~w¦七時に~w¦晩ご飯を~o¦食べます。~p|今夜=malam ini@1:今夜,七時=pukul tujuh@2:七時,晩ご飯=makan malam@3:晩ご飯,食べる=makan@4:食べ|に=penanda waktu tepat=に;を=objek=を|
N5|Cuaca hari ini bagus, jadi kami berjalan-jalan di taman.|今日は天気がいいので、~r¦公園を~t¦散歩します。~p|天気=cuaca@1:天気~てんき,いい=bagus@1:いい~よい,公園=taman@2:公園~こうえん,散歩=jalan-jalan@3:散歩~さんぽ|ので=karena (jadi)=ので;を=area gerak pada 散歩=公園を|
N5|Setiap hari saya naik bus ke kantor.|毎日、~w¦バスで~c¦会社へ~tp¦行きます。~p|毎日=setiap hari@1:毎日,バス=bus@2:バス,会社=kantor@3:会社,行く=pergi@4:行き|で=alat=で;へ=arah=へ~に|
N4|Tadi malam saya tidur larut karena menonton pertandingan sepak bola.|昨夜は~w¦サッカーの試合を~o¦見ていて、~r¦遅く寝ました。~p|昨夜=tadi malam@1:昨夜,サッカー=sepak bola@2:サッカー,試合=pertandingan@2:試合,見る=menonton@3:見て,遅い=larut@4:遅く,寝る=tidur@4:寝|て-bentuk=sebab/berurutan=見ていて;く-bentuk=adjektiva jadi keterangan=遅く|
N4|Tahukah kamu di mana toko buku itu?|本屋は~top¦どこにあるか~q¦知っていますか。~p|本屋=toko buku@1:本屋,どこ=di mana@2:どこ,知る=tahu@3:知って~知る,ある=ada@2:ある|か=pertanyaan tak langsung=あるか;ています=tahu (keadaan)=知っています|
N4|Tahun depan dia ingin belajar di luar negeri.|来年、~w¦彼は~s¦外国で~t¦勉強したいです。~p|来年=tahun depan@1:来年,彼=dia@2:彼,外国=luar negeri@3:外国,勉強=belajar@4:勉強|たい=ingin melakukan=したい;で=tempat kegiatan=で|
N4|Saya lebih suka teh daripada kopi.|コーヒーより~m¦お茶のほうが~s¦好きです。~adj|コーヒー=kopi@1:コーヒー,お茶=teh@2:お茶,好き=suka@3:好き|より=daripada=より;のほうが=lebih (pilihan)=のほうが|
N4|Kami menunggu bus selama dua puluh menit.|私たちは~s¦二十分~w¦バスを~o¦待ちました。~p|二十分=dua puluh menit@2:二十分,バス=bus@3:バス,待つ=menunggu@4:待ち~待つ|を=objek=を;ました=lampau sopan=ました|
N3|Saya disuruh dokter minum banyak air.|医者に~so¦水をたくさん~o¦飲むように~z¦言われました。~p|医者=dokter@1:医者,水=air@2:水,たくさん=banyak@2:たくさん,飲む=minum@3:飲む,言う=bilang@4:言われ|ように言う=menyuruh agar=ように;受身=pasif=言われ|
N5|Bolehkah saya bertanya sesuatu?|ちょっと~a¦質問しても~mo¦いいですか。~po|質問=pertanyaan@2:質問,いい=boleh@3:いい,ちょっと=sebentar@1:ちょっと|てもいいですか=meminta izin=てもいい|
N4|Begitu sampai rumah, saya akan menelepon kamu.|家に着いたらすぐ、~r¦あなたに~a¦電話します。~p|家=rumah@1:家,着く=tiba@1:着い,すぐ=segera@1:すぐ,電話=telepon@3:電話|たら=begitu/jika=たら;に=penerima=に|
N4|Dia sudah tinggal di sini selama sepuluh tahun.|彼は~s¦ここに~t¦十年~w¦住んでいます。~p|彼=dia@1:彼,ここ=sini@2:ここ,十年=sepuluh tahun@3:十年,住む=tinggal@4:住んで|ている=keadaan berlanjut=住んでいます;durasi=tanpa partikel=十年|
N4|Film yang kami tonton kemarin sangat bagus.|昨日見た~rl¦映画は~top¦とても~a¦よかったです。~adj|映画=film@2:映画,昨日=kemarin@1:昨日,見る=menonton@1:見た,とても=sangat@3:とても,いい=bagus@4:よかった|klausa relatif=tanpa kata ganti=昨日見た映画;いい=bentuk lampau=よかった|
N4|Kalau butuh bantuan, tolong beri tahu saya.|助けが必要なら、~k¦私に~a¦言ってください。~po|助け=bantuan@1:助け,必要=perlu@1:必要,言う=bilang@3:言って|なら=kalau=なら;てください=tolong=てください|
N4|Karena akhir pekan ini bisa beristirahat, saya senang.|今週末は~w¦休めるので、~r¦うれしいです。~adj|週末=akhir pekan@1:週末,休む=istirahat@2:休め,うれしい=senang@3:うれしい|可能形=bisa melakukan=休め;ので=karena=ので|
N3|Dia tidak hanya pandai memasak, tetapi juga pandai bernyanyi.|彼女は~s¦料理が上手なだけでなく、~x¦歌も上手です。~adj|彼女=dia@1:彼女,料理=masakan@2:料理,歌=lagu@3:歌,上手=pandai@2:上手|だけでなく~も=bukan hanya ... tetapi juga=だけでなく~も;が上手=pandai dalam=が上手|
N2|Kalau saja saya tahu lebih awal, saya pasti sudah memberitahumu.|もっと早く知っていれば、~k¦あなたに~a¦教えたのに。~p|早い=awal@1:早く,知る=tahu@1:知って,教える=memberi tahu@3:教えた|ば~のに=andai saja (penyesalan)=ば~のに;もっと=lebih=もっと|
N3|Rapat ditunda karena banyak orang sakit.|病気の人が多いので、~r¦会議は~top¦延期されました。~p|病気=sakit@1:病気,人=orang@1:人,会議=rapat@2:会議,延期=menunda@3:延期|受身=pasif=されました;ので=karena=ので|`,
zh:`HSK 1|Saya makan nasi di rumah.|我~s¦在家~t¦吃饭。~po|我=saya@1:我,家=rumah@2:家,吃饭=makan@3:吃饭~吃|在=penanda lokasi sebelum verba=在|
HSK 1|Besok kami pergi ke sekolah.|明天~w¦我们~s¦去~p¦学校。~tp|明天=besok@1:明天,我们=kami@2:我们,去=pergi@3:去,学校=sekolah@4:学校|去 + tempat tanpa preposisi=去|
HSK 2|Dia lebih tinggi daripada saya.|他~s¦比我~m¦高。~adj|他=dia@1:他,我=saya@2:我,高=tinggi@3:高|比=perbandingan "daripada" (sebelum adjektiva)=比|
HSK 2|Saya sudah selesai mengerjakan PR.|我~s¦已经~a¦做完~p¦作业了。~o|已经=sudah@2:已经,做=mengerjakan@3:做,完=selesai@3:完,作业=PR@4:作业|了=penanda aspek selesai=了;结果补语 完=hasil "selesai"=完|
HSK 2|Kamu mau minum teh atau kopi?|你~s¦想喝~p¦茶~o¦还是~a¦咖啡？~o|想=ingin@2:想,喝=minum@2:喝,茶=teh@3:茶,还是=atau (pertanyaan)@4:还是,咖啡=kopi@5:咖啡|还是=atau dalam pertanyaan=还是;想 + verba=ingin=想|
HSK 3|Meskipun hujan, kami tetap pergi ke taman.|虽然下雨，~n¦我们~s¦还是~a¦去公园。~tpp|虽然=meskipun@1:虽然,下雨=hujan@1:下雨,我们=kami@2:我们,还是=tetap@3:还是,公园=taman@4:公园|虽然…还是=meskipun…tetap=虽然~还是|
HSK 3|Saya sudah belajar bahasa Mandarin dua tahun.|我~s¦学了~p¦两年~a¦汉语。~o|学=belajar@2:学,两年=dua tahun@3:两年,汉语=bahasa Mandarin@4:汉语~中文|durasi sebelum objek=两年 sebelum 汉语=两年;了=aspek selesai=了|我学汉语学了两年了。
HSK 3|Tolong tutup pintunya.|请~a¦把门~o¦关上。~pp|请=tolong@1:请,门=pintu@2:门,关=menutup@3:关|把字句=objek dipindah ke depan verba=把;关上=hasil "tertutup"=关上~关好|
HSK 3|Dia dimarahi oleh gurunya.|他~s¦被老师~c¦批评了。~p|他=dia@1:他,老师=guru@2:老师,批评=memarahi@3:批评|被=penanda pasif=被;了=aspek selesai=了|
HSK 3|Kalau besok tidak hujan, kita pergi mendaki gunung.|如果~k¦明天不下雨，~k¦我们~s¦就去爬山。~tpp|如果=kalau@1:如果,明天=besok@2:明天,下雨=hujan@2:下雨,我们=kita@3:我们,爬山=mendaki@4:爬山|如果…就=jika…maka=如果~就|
HSK 3|Saya belum pernah ke Beijing.|我~s¦没~ng¦去过~p¦北京。~tp|去=pergi@3:去,北京=Beijing@4:北京|没 + verba + 过=belum pernah=没~过|
HSK 4|Walaupun sibuk, dia selalu meluangkan waktu untuk menemani keluarga.|尽管很忙，~n¦他~s¦总是~a¦抽时间~p¦陪家人。~o|忙=sibuk@1:忙,他=dia@2:他,总是=selalu@3:总是,抽时间=meluangkan waktu@4:抽时间~抽空,陪=menemani@5:陪,家人=keluarga@5:家人|尽管=walaupun (formal)=尽管|
HSK 2|Anak itu sedang menggambar di kamar.|那个孩子~s¦正在~a¦房间里~t¦画画。~p|孩子=anak@1:孩子,正在=sedang@2:正在~在,房间=kamar@3:房间,画画=menggambar@4:画画~画|正在=penanda sedang berlangsung=正在~在|
HSK 3|Dia berbicara bahasa Mandarin dengan sangat lancar.|他~s¦汉语~o¦说得~p¦很流利。~adj|汉语=bahasa Mandarin@2:汉语~中文,说=berbicara@3:说,流利=lancar@4:流利|得 补语=verba + 得 + deskripsi=得|
HSK 4|Karena macet, kami terlambat setengah jam.|因为堵车，~r¦我们~s¦迟到了~p¦半个小时。~a|堵车=macet@1:堵车,我们=kami@2:我们,迟到=terlambat@3:迟到,半个小时=setengah jam@4:半个小时~半小时|因为=karena=因为|
HSK 1|Saya punya dua kakak laki-laki.|我~s¦有~p¦两个~a¦哥哥。~o|有=punya@2:有,两=dua@3:两,哥哥=kakak lk@4:哥哥|量词 个=penggolong bilangan=个|
HSK 1|Ayah saya bekerja di rumah sakit.|我爸爸~s¦在医院~t¦工作。~p|爸爸=ayah@1:爸爸,医院=rumah sakit@2:医院,工作=bekerja@3:工作|在=penanda lokasi=在|
HSK 2|Bulan depan kami akan berlibur ke pantai.|下个月，~w¦我们~s¦去海边~tp¦度假。~p|下个月=bulan depan@1:下个月,我们=kami@2:我们,海边=pantai@3:海边,度假=berlibur@4:度假|去 + tempat=去|
HSK 2|Dia membeli roti di toko dekat rumah.|他~s¦在家附近的店~t¦买了面包。~po|他=dia@1:他,附近=dekat@2:附近,店=toko@2:店,买=membeli@3:买,面包=roti@3:面包|在=penanda lokasi=在;了=aspek selesai=了|
HSK 3|Tolong buka jendelanya karena di sini panas.|这里很热，~r¦请~a¦把窗户~o¦打开。~p|这里=di sini@1:这里~这儿,热=panas@1:热,窗户=jendela@3:窗户,打开=membuka@4:打开|把字句=把;请=permintaan=请|
HSK 3|Saya belum makan karena belum lapar.|我~s¦还没~ng¦吃饭，~p¦因为不饿。~r|吃饭=makan@3:吃饭~吃,饿=lapar@4:饿|还没=belum=还没~没;因为=karena=因为|
HSK 3|Setelah pulang kerja, dia pergi berenang dengan teman-temannya.|下班以后，~w¦他~s¦和朋友们~ac¦去游泳了。~p|下班=pulang kerja@1:下班,他=dia@2:他,朋友=teman@3:朋友,游泳=berenang@4:游泳|和=bersama=和;以后=setelah=以后;了=了|
HSK 1|Saya tinggal di kota kecil bersama keluarga.|我和家人~ac¦住在小城市。~tp|家人=keluarga@1:家人,住=tinggal@2:住,城市=kota@2:城市,小=kecil@2:小|和=bersama=和;在 setelah verba=lokasi tinggal=住在|
HSK 1|Dia sedang membaca buku di perpustakaan.|她~s¦在图书馆~t¦看书。~po|图书馆=perpustakaan@2:图书馆,看书=membaca@3:看书~看,她=dia@1:她|在 + tempat=sebelum verba=在图书馆|
HSK 1|Malam ini kami makan malam pukul tujuh.|今天晚上，~w¦我们七点~w¦吃晚饭。~po|今天=hari ini@1:今天,晚上=malam@1:晚上,七点=pukul tujuh@2:七点,晚饭=makan malam@3:晚饭|keterangan waktu=sebelum verba=七点;吃晚饭=makan malam=吃晚饭|
HSK 2|Cuaca hari ini bagus, jadi kami pergi jalan-jalan di taman.|今天天气很好，~x¦所以我们~s¦去公园~tp¦散步。~p|天气=cuaca@1:天气,好=bagus@1:好,公园=taman@3:公园,散步=jalan-jalan@4:散步,所以=jadi@2:所以|所以=jadi=所以;很 + adjektiva=很好|
HSK 2|Setiap hari saya naik bis ke kantor.|每天~w¦我坐公共汽车~c¦去办公室。~tp|每天=setiap hari@1:每天,坐=naik@2:坐,公共汽车=bis@2:公共汽车,办公室=kantor@3:办公室|坐 + kendaraan=naik kendaraan=坐公共汽车;去 + tempat=pergi ke=去办公室|
HSK 3|Tadi malam saya tidur terlambat karena menonton pertandingan sepak bola.|昨天晚上~w¦因为我看了足球比赛，~r¦所以睡得很晚。~r|昨天=kemarin@1:昨天,晚上=malam@1:晚上,足球=sepak bola@2:足球,比赛=pertandingan@2:比赛,睡=tidur@3:睡|因为...所以=karena ... maka=因为~所以;得=komplemen derajat=睡得很晚~睡得;了=aspek selesai=看了|
HSK 3|Tahukah kamu di mana toko buku itu?|你知道~p¦书店在哪儿吗？~q|知道=tahu@1:知道,书店=toko buku@2:书店,哪儿=di mana@2:哪儿|在哪儿=di mana=在哪儿;吗=partikel tanya=吗|
HSK 3|Tahun depan dia ingin kuliah di luar negeri.|明年~w¦她想~mo¦去国外~tp¦留学。~p|明年=tahun depan@1:明年,想=ingin@2:想,国外=luar negeri@3:国外,留学=belajar di luar negeri@4:留学|想 + verba=ingin melakukan=想去;keterangan waktu=sebelum subjek/verba=明年|
HSK 2|Saya lebih suka teh daripada kopi.|比起咖啡，~m¦我更喜欢茶。~so|咖啡=kopi@1:咖啡,茶=teh@2:茶,喜欢=suka@2:喜欢,更=lebih@2:更|比起=dibandingkan=比起;更 + verba=lebih=更喜欢|
HSK 3|Kami menunggu bus selama dua puluh menit.|我们~s¦等了~p¦二十分钟~w¦公共汽车。~o|等=menunggu@2:等,二十分钟=dua puluh menit@3:二十分钟,公共汽车=bus@4:公共汽车|durasi=sesudah verba=等了二十分钟;了=aspek selesai=了|
HSK 3|Dokter menyuruh saya banyak minum air.|医生~s¦让我~a¦多喝~p¦水。~o|医生=dokter@1:医生,让=menyuruh@2:让,喝=minum@3:喝,水=air@4:水,多=banyak@3:多|让 + orang + verba=menyuruh=让我;多 + verba=banyak melakukan=多喝|
HSK 2|Bolehkah saya mengajukan satu pertanyaan?|我可以~mo¦问你~po¦一个问题吗？~o|可以=boleh@1:可以,问=bertanya@2:问,问题=pertanyaan@3:问题|可以 + verba=boleh=可以;吗=partikel tanya=吗|
HSK 3|Begitu sampai rumah, saya akan menelepon kamu.|我一到家，~r¦就给你打电话。~po|到=tiba@1:到,家=rumah@1:家,打电话=menelepon@2:打电话,给=kepada@2:给|一...就...=begitu ... langsung=一~就;给 + orang + verba=给你打电话|
HSK 3|Dia sudah tinggal di sini sepuluh tahun.|他在这里~t¦住了~p¦十年了。~w|这里=sini@1:这里,住=tinggal@2:住,十年=sepuluh tahun@3:十年|...了...了=berlangsung sampai sekarang=住了~十年了;在 + tempat=在这里|
HSK 3|Film yang kami tonton semalam sangat bagus.|我们昨天晚上看的~rl¦那部电影~s¦非常好。~pp|电影=film@2:电影,看=menonton@1:看,昨天=kemarin@1:昨天,好=bagus@3:好,非常=sangat@3:非常|的=klausa relatif sebelum nomina=看的那部;部=penggolong film=那部|
HSK 3|Kalau butuh bantuan, kabari saja saya.|如果你需要帮助，~k¦就告诉我吧。~po|需要=butuh@1:需要,帮助=bantuan@1:帮助,告诉=memberi tahu@2:告诉|如果...就...=jika ... maka=如果~就;吧=saran lembut=吧|
HSK 4|Saya senang karena akhir pekan ini kami bisa beristirahat.|我很高兴，~so¦因为这个周末~r¦我们可以休息。~r|高兴=senang@1:高兴,周末=akhir pekan@2:周末,休息=beristirahat@3:休息,可以=bisa@3:可以|因为=karena=因为;很 + adjektiva=sangat=很高兴|
HSK 4|Dia bukan hanya pandai memasak, tetapi juga pandai bernyanyi.|她不但做饭做得好，~x¦而且唱歌也唱得好。~cl|做饭=memasak@1:做饭,唱歌=bernyanyi@2:唱歌,好=bagus@1:好|不但...而且...=bukan hanya ... tetapi juga=不但~而且;得=komplemen derajat=做得好~唱得好|
HSK 5|Kalau saja saya tahu lebih awal, saya pasti sudah memberitahumu.|如果我早点儿知道，~k¦我一定早就告诉你了。~po|知道=tahu@1:知道,早=awal@1:早,告诉=memberi tahu@2:告诉,一定=pasti@2:一定|如果=andai/jika=如果;早就...了=sudah sejak awal=早就~了|
HSK 4|Rapat ditunda karena banyak orang sakit.|因为很多人生病了，~r¦会议被推迟了。~so|会议=rapat@2:会议,推迟=menunda@2:推迟,很多=banyak@1:很多,生病=sakit@1:生病|因为=karena=因为;被=penanda pasif=被推迟|`,
de:`A2|Meskipun hujan, saya tetap pergi ke universitas.|Obwohl es regnet,~n¦gehe ich~so¦zur Universität.~tp|regnen=hujan@1:regnet~regnen~regn,gehen=pergi@2:gehe~gehen~geh~ging,Universität=universitas@3:universität~uni|obwohl=konjungsi konsesif: verba di akhir klausa=obwohl;inversi setelah anak kalimat=gehe ich;zu + Dativ=zur~zu der~zum|
A1|Setiap pagi saya minum kopi.|Ich trinke~so¦jeden Morgen~w¦Kaffee.~o|trinken=minum@1:trinke~trinken~trink,Morgen=pagi@2:morgen,Kaffee=kopi@3:kaffee|keterangan waktu Akkusativ=jeden Morgen=jeden morgen|Jeden Morgen trinke ich Kaffee.
A1|Kemarin saya menonton sebuah film.|Gestern~w¦habe ich~mo¦einen Film~o¦gesehen.~p|gestern=kemarin@1:gestern,sehen=melihat@4:gesehen~sehe~sah,Film=film@3:film~filme|Perfekt: haben + Partizip II=habe~gesehen;Akkusativ maskulin=einen=einen|
A2|Saya mau minum kopi karena saya lelah.|Ich möchte~mo¦einen Kaffee trinken,~po¦weil ich müde bin.~r|möchten=ingin@1:möchte~möchten~will~wollte,Kaffee=kopi@2:kaffee,trinken=minum@2:trinken,müde=lelah@3:müde|weil: verba di akhir klausa=bin;möchte + Infinitiv di akhir=trinken|
A1|Besok kami naik kereta ke Berlin.|Wir fahren~so¦morgen~w¦mit dem Zug~c¦nach Berlin.~tp|fahren=bepergian@1:fahren~fahr~fuhr,morgen=besok@2:morgen,Zug=kereta@3:zug|mit + Dativ=mit dem~mit;nach + kota=nach|
A2|Bisakah kamu membantuku?|Kannst du~mo¦mir~o¦bitte~a¦helfen?~p|können=bisa@1:kannst~kann~können,bitte=tolong@3:bitte,helfen=membantu@4:helfen~hilf|helfen + Dativ=mir|
A2|Kemarin saya mengunjungi nenekku karena dia berulang tahun.|Ich habe~so¦gestern~w¦meine Oma besucht,~o¦weil sie Geburtstag hatte.~r|Oma=nenek@3:oma,besuchen=mengunjungi@3:besucht~besuch,gestern=kemarin@2:gestern,Geburtstag=ulang tahun@4:geburtstag|weil: verba di akhir=hatte;Perfekt=habe~besucht|
A1|Anak itu bermain bola di kebun.|Das Kind~s¦spielt~p¦im Garten~t¦mit dem Ball.~c|Kind=anak@1:kind,spielen=bermain@2:spielt~spiel,Garten=kebun@3:garten,Ball=bola@4:ball|in + Dativ lokasi=im~in dem;mit + Dativ=mit dem|
B1|Kalau saya punya lebih banyak waktu, saya akan lebih sering berolahraga.|Wenn ich mehr Zeit hätte,~k¦würde ich~mo¦öfter~a¦Sport machen.~po|Zeit=waktu@1:zeit,öfter=lebih sering@3:öfter~öfters,Sport=olahraga@4:sport|Konjunktiv II=hätte;würde + Infinitiv=würde|
A2|Dia lupa mengunci pintu.|Er hat vergessen,~p¦die Tür~o¦abzuschließen.~p|vergessen=lupa@1:vergessen~vergisst,Tür=pintu@2:tür,abschließen=mengunci@3:abzuschließen~abschließen~abzuschliessen|zu-Infinitiv verba terpisah: ab + zu + schließen=abzuschließen~abzuschliessen|
B1|Buku yang kubeli kemarin sangat menegangkan.|Das Buch,~s¦das ich gestern gekauft habe,~rl¦ist sehr spannend.~adj|Buch=buku@1:buch,kaufen=membeli@2:gekauft~kaufe,spannend=menegangkan@3:spannend|Relativsatz: das + verba di akhir=das;Perfekt=gekauft|
A2|Saya tertarik pada musik dan bermain gitar.|Ich interessiere mich~so¦für Musik~b¦und spiele Gitarre.~po|interessieren=tertarik@1:interessiere~interessieren,Musik=musik@2:musik,Gitarre=gitar@3:gitarre,spielen=bermain@3:spiele~spielen|sich interessieren für + Akkusativ=für;kata ganti refleksif=mich|
A1|Stasiun ada di samping kantor pos.|Der Bahnhof~s¦ist~p¦neben der Post.~t|Bahnhof=stasiun@1:bahnhof,neben=di samping@3:neben,Post=kantor pos@3:post|neben + Dativ feminin=neben der|
A2|Malam ini saya harus tidur lebih awal.|Ich muss~mo¦heute Abend~w¦früh~a¦ins Bett gehen.~tpp|müssen=harus@1:muss~müssen,Abend=malam@2:abend,früh=awal@3:früh,Bett=tempat tidur@4:bett,gehen=pergi@4:gehen|ins = in das (arah, Akkusativ)=ins~in das;modal + Infinitiv di akhir=gehen|
B1|Dia bilang bahwa besok dia tidak punya waktu.|Er sagt,~so¦dass er morgen~q¦keine Zeit hat.~q|sagen=berkata@1:sagt~sagen,morgen=besok@2:morgen,Zeit=waktu@3:zeit|dass: verba di akhir=hat;keine = negasi kein=keine|
A2|Saudariku lebih tinggi daripada aku.|Meine Schwester~s¦ist~p¦größer~adj¦als ich.~m|Schwester=saudari@1:schwester,groß=tinggi@3:größer~gross~grösser|Komparativ -er + als=größer~als|
A1|Ayah saya bekerja di rumah sakit.|Mein Vater~s¦arbeitet~p¦im Krankenhaus.~t|Vater=ayah@1:vater,arbeiten=bekerja@2:arbeitet~arbeiten~arbeite,Krankenhaus=rumah sakit@3:krankenhaus|in + Dativ lokasi=im~in dem|
A2|Bulan depan kami pergi ke pantai.|Nächsten Monat~w¦fahren wir~so¦an den Strand.~tp|Monat=bulan@1:monat,fahren=pergi@2:fahren~fahr,Strand=pantai@3:strand|an + Akkusativ (arah)=an den|
A2|Dia membeli roti di toko dekat rumah.|Sie hat~so¦in dem Laden neben dem Haus~t¦Brot gekauft.~po|Laden=toko@2:laden~geschäft,Haus=rumah@2:haus,Brot=roti@3:brot,kaufen=membeli@3:gekauft~kaufe|Perfekt=hat~gekauft;neben + Dativ=neben dem|
A2|Tolong buka jendelanya karena di sini panas.|Mach bitte das Fenster auf,~po¦weil es hier heiß ist.~r|Fenster=jendela@1:fenster,aufmachen=membuka@1:auf~aufmachen~öffnen,heiß=panas@2:heiß~heiss|weil: verba di akhir=ist;perintah verba terpisah (mach … auf)=auf|
A2|Saya belum makan karena tidak lapar.|Ich habe noch nicht gegessen,~po¦weil ich keinen Hunger habe.~r|essen=makan@1:gegessen~essen,Hunger=lapar@2:hunger|noch nicht=belum=noch nicht;keinen=negasi kein (Akkusativ)=keinen|
B1|Setelah bekerja, dia pergi berenang bersama teman-temannya.|Nach der Arbeit~w¦geht er~so¦mit seinen Freunden~ac¦schwimmen.~p|Arbeit=pekerjaan@1:arbeit,gehen=pergi@2:geht~gehen,Freund=teman@3:freunden~freund,schwimmen=berenang@4:schwimmen|nach + Dativ=nach der;mit + Dativ jamak (-n)=freunden|
A1|Saya tinggal di kota kecil bersama keluarga saya.|Ich wohne~so¦in einer kleinen Stadt~t¦mit meiner Familie.~ac|wohnen=tinggal@1:wohne~wohnen,Stadt=kota@2:stadt,klein=kecil@2:kleinen~klein,Familie=keluarga@3:familie|in + Dativ=lokasi (wo?) memakai Dativ=in einer~in der;mit + Dativ=bersama + Dativ=mit meiner~mit der|
A1|Dia sedang membaca buku di perpustakaan.|Sie liest~so¦ein Buch~o¦in der Bibliothek.~t|lesen=membaca@1:liest~lesen,Buch=buku@2:buch,Bibliothek=perpustakaan@3:bibliothek|lesen=vokal berubah e→ie pada er/sie=liest;in + Dativ=lokasi memakai Dativ=in der|Sie liest in der Bibliothek ein Buch.
A1|Malam ini kami makan malam pukul tujuh.|Heute Abend~w¦essen wir~so¦um sieben Uhr~w¦zu Abend.~a|essen=makan@2:essen,Abend=malam@1:abend,sieben=tujuh@3:sieben|inversi=verba di posisi 2 setelah keterangan waktu=essen wir;zu Abend essen=makan malam=zu abend|
A1|Cuaca hari ini bagus, jadi kami jalan-jalan di taman.|Das Wetter ist heute schön,~x¦deshalb gehen wir~so¦im Park~t¦spazieren.~p|Wetter=cuaca@1:wetter,schön=bagus@1:schön,gehen=pergi@2:gehen,Park=taman@3:park,spazieren=jalan-jalan@4:spazieren|deshalb=inversi: verba tepat setelah deshalb=deshalb gehen wir;im=in + dem (lokasi)=im park~im|
A2|Setiap hari saya naik bus ke kantor.|Jeden Tag~w¦fahre ich~so¦mit dem Bus~c¦ins Büro.~tp|Tag=hari@1:tag,fahren=berkendara@2:fahre~fahren,Bus=bus@3:bus,Büro=kantor@4:büro|inversi=verba di posisi 2=fahre ich;mit + Dativ=alat transportasi=mit dem;in + Akkusativ=arah=ins~in das|
A2|Tadi malam saya tidur terlambat karena menonton pertandingan sepak bola.|Gestern Abend bin ich spät eingeschlafen,~w¦weil ich ein Fußballspiel~r¦geschaut habe.~p|Abend=malam@1:abend,einschlafen=tertidur@1:eingeschlafen,spät=terlambat@1:spät,Fußballspiel=pertandingan sepak bola@2:fußballspiel,schauen=menonton@3:geschaut|Perfekt dengan sein=einschlafen memakai sein=bin ich~eingeschlafen;weil=verba di akhir anak kalimat=geschaut habe|
A2|Tahukah kamu di mana toko buku itu?|Weißt du,~x¦wo die Buchhandlung~s¦ist?~p|wissen=tahu@1:weißt~wissen,Buchhandlung=toko buku@2:buchhandlung,wo=di mana@2:wo|wissen=du weißt (tanpa umlaut)=weißt du;wo=verba di akhir anak kalimat=die buchhandlung ist|
A2|Tahun depan dia ingin belajar di luar negeri.|Nächstes Jahr~w¦möchte sie~mo¦im Ausland~t¦studieren.~p|Jahr=tahun@1:jahr,möchten=ingin@2:möchte~möchten,Ausland=luar negeri@3:ausland,studieren=belajar kuliah@4:studieren|inversi=verba di posisi 2=möchte sie;modal=infinitif di akhir=studieren|
A2|Saya lebih suka teh daripada kopi.|Ich trinke~so¦lieber Tee~o¦als Kaffee.~m|trinken=minum@1:trinke~trinken,Tee=teh@2:tee,Kaffee=kopi@3:kaffee,lieber=lebih suka@2:lieber|lieber=komparatif dari gern=lieber;als=daripada=als kaffee~als|
A2|Kami menunggu bus selama dua puluh menit.|Wir haben~so¦zwanzig Minuten~w¦auf den Bus~o¦gewartet.~p|warten=menunggu@4:gewartet,Minute=menit@2:minuten,zwanzig=dua puluh@2:zwanzig,Bus=bus@3:bus|warten auf + Akkusativ=menunggu sesuatu=auf den;Perfekt=haben + Partizip II=haben~gewartet|
A2|Dokter menyuruh saya minum banyak air.|Der Arzt sagt mir,~so¦dass ich viel Wasser~r¦trinken soll.~p|Arzt=dokter@1:arzt,Wasser=air@2:wasser,viel=banyak@2:viel,trinken=minum@3:trinken|dass=verba di akhir anak kalimat=trinken soll;sollen=harus/disuruh=soll|
A2|Bolehkah saya bertanya sesuatu?|Darf ich~mo¦etwas fragen?~po|dürfen=boleh@1:darf~dürfen,etwas=sesuatu@2:etwas,fragen=bertanya@2:fragen|inversi=pertanyaan ya/tidak: verba di awal=darf ich;modal=infinitif di akhir=fragen|
B1|Saya akan meneleponmu begitu saya sampai di rumah.|Ich rufe dich an,~so¦sobald ich~r¦zu Hause ankomme.~p|anrufen=menelepon@1:rufe~anrufen,sobald=begitu@2:sobald,Hause=rumah@3:hause,ankommen=sampai@3:ankomme~ankommen|verba terpisah=prefiks an di akhir=rufe dich an;sobald=verba di akhir anak kalimat=ankomme|
B1|Dia sudah tinggal di sini selama sepuluh tahun.|Er wohnt~so¦schon seit zehn Jahren~w¦hier.~t|wohnen=tinggal@1:wohnt~wohnen,Jahr=tahun@2:jahren~jahr,zehn=sepuluh@2:zehn,hier=di sini@3:hier|seit + Dativ=durasi sampai sekarang + presens=seit zehn jahren;jamak Dativ=akhiran -n=jahren|
B1|Film yang kami tonton semalam sangat bagus.|Der Film,~s¦den wir gestern gesehen haben,~rl¦war sehr gut.~pp|Film=film@1:film,sehen=menonton@2:gesehen,gestern=kemarin@2:gestern,gut=bagus@3:gut|pronomina relatif=Akkusativ maskulin = den=den wir;anak kalimat relatif=verba di akhir=gesehen haben|
B1|Jika kamu butuh bantuan, kabari saja saya.|Wenn du Hilfe brauchst,~k¦sag mir einfach Bescheid.~po|Hilfe=bantuan@1:hilfe,brauchen=butuh@1:brauchst~brauchen,Bescheid=kabar@2:bescheid,einfach=saja@2:einfach|wenn=verba di akhir anak kalimat=hilfe brauchst;imperatif=sag mir=sag mir|
B1|Saya senang bahwa kami bisa beristirahat di akhir pekan.|Ich freue mich,~so¦dass wir am Wochenende~r¦uns ausruhen können.~p|freuen=senang@1:freue~freuen,Wochenende=akhir pekan@2:wochenende,ausruhen=beristirahat@3:ausruhen,können=bisa@3:können|refleksif=sich freuen: freue mich=freue mich;dass=verba di akhir=ausruhen können|
B1|Dia tidak hanya pandai memasak, tetapi juga pandai menyanyi.|Sie kann nicht nur gut kochen,~mo¦sondern auch gut singen.~cl|kochen=memasak@1:kochen,singen=menyanyi@2:singen,gut=baik pandai@1:gut|nicht nur ... sondern auch=tidak hanya ... tetapi juga=nicht nur~sondern auch;modal=infinitif di akhir=kann nicht nur gut kochen~kochen|
B2|Kalau saja saya tahu itu lebih awal, saya sudah memberitahumu.|Wenn ich das früher gewusst hätte,~k¦hätte ich es dir gesagt.~po|früher=lebih awal@1:früher,wissen=tahu@1:gewusst,sagen=mengatakan@2:gesagt|Konjunktiv II lampau=hätte + Partizip II=gewusst hätte;inversi di klausa utama=hätte ich es dir gesagt=hätte ich|
B1|Pertemuan itu ditunda karena banyak rekan kerja sakit.|Die Besprechung wurde verschoben,~so¦weil viele Kollegen~r¦krank sind.~r|Besprechung=pertemuan@1:besprechung,verschieben=menunda@1:verschoben,Kollege=rekan kerja@2:kollegen~kollege,krank=sakit@3:krank|Passiv lampau=wurde + Partizip II=wurde die~wurde verschoben;weil=verba di akhir=krank sind|`,
nl:`A2|Meskipun hujan, saya tetap pergi ke universitas.|Hoewel het regent,~n¦ga ik~so¦naar de universiteit.~tp|regenen=hujan@1:regent~regenen~regen,gaan=pergi@2:ga~gaan~gaat,universiteit=universitas@3:universiteit|hoewel: verba di akhir=regent;inversi: ga ik=ga ik|
A1|Setiap pagi saya minum kopi.|Ik drink~so¦elke ochtend~w¦koffie.~o|drinken=minum@1:drink~drinken,ochtend=pagi@2:ochtend~morgen,koffie=kopi@3:koffie|keterangan waktu=elke ochtend~elke morgen|Elke ochtend drink ik koffie.
A2|Kemarin saya menonton sebuah film.|Gisteren~w¦heb ik~so¦een film~o¦gezien.~p|gisteren=kemarin@1:gisteren,film=film@3:film,zien=melihat@4:gezien~zie~zag|voltooid tegenwoordige tijd: hebben + ge-…=heb~gezien|
A2|Saya mau minum kopi karena saya lelah.|Ik wil~mo¦een kopje koffie drinken,~po¦omdat ik moe ben.~r|willen=ingin@1:wil~willen,kopje=cangkir@2:kopje,koffie=kopi@2:koffie,moe=lelah@3:moe|omdat: verba di akhir=ben|
A1|Besok kami naik kereta ke Amsterdam.|We gaan~so¦morgen~w¦met de trein~c¦naar Amsterdam.~tp|gaan=pergi@1:gaan~gaat,morgen=besok@2:morgen,trein=kereta@3:trein|met = dengan / naik=met;naar + kota=naar|
A2|Bisakah kamu membantuku?|Kun je~mo¦me~o¦alsjeblieft~a¦helpen?~p|kunnen=bisa@1:kun~kan~kunt,alsjeblieft=tolong@3:alsjeblieft~alstublieft,helpen=membantu@4:helpen~help|infinitief di akhir=helpen|
A1|Anak itu bermain bola di kebun.|Het kind~s¦speelt~p¦in de tuin~t¦met de bal.~c|kind=anak@1:kind,spelen=bermain@2:speelt~spelen~speel,tuin=kebun@3:tuin,bal=bola@4:bal|met = dengan=met|
B1|Kalau saya punya lebih banyak waktu, saya akan lebih sering berolahraga.|Als ik meer tijd had,~k¦zou ik~mo¦vaker~a¦sporten.~p|tijd=waktu@1:tijd,vaker=lebih sering@3:vaker,sporten=berolahraga@4:sporten~sport|onvoltooid verleden voor pengandaian=had;zou + infinitief=zou|
A2|Saudariku lebih tinggi daripada aku.|Mijn zus~s¦is~p¦groter~adj¦dan ik.~m|zus=saudari@1:zus,groot=tinggi@3:groter~groot|vergrotende trap -er + dan=groter~dan|
B1|Dia bilang bahwa besok dia tidak punya waktu.|Hij zegt~so¦dat hij morgen~q¦geen tijd heeft.~q|zeggen=berkata@1:zegt~zeggen~zei,morgen=besok@2:morgen,tijd=waktu@3:tijd|dat: verba di akhir=heeft;geen = negasi=geen|
A2|Malam ini saya harus tidur lebih awal.|Ik moet~mo¦vanavond~w¦vroeg~a¦naar bed gaan.~tpp|moeten=harus@1:moet~moeten,vanavond=malam ini@2:vanavond,vroeg=awal@3:vroeg,bed=tempat tidur@4:bed,gaan=pergi@4:gaan|modal + infinitief di akhir=gaan|
A1|Stasiun ada di samping kantor pos.|Het station~s¦is~p¦naast het postkantoor.~t|station=stasiun@1:station,naast=di samping@3:naast,postkantoor=kantor pos@3:postkantoor|naast + objek = di samping=naast|
A2|Kemarin saya mengunjungi nenekku karena dia berulang tahun.|Ik heb~so¦gisteren~w¦mijn oma bezocht,~o¦want ze was jarig.~r|oma=nenek@3:oma,bezoeken=mengunjungi@3:bezocht~bezoek,jarig=berulang tahun@4:jarig|want = karena (urutan kata tidak berubah)=want;voltooid tegenwoordige tijd=heb~bezocht|
B1|Buku yang kubeli kemarin sangat menegangkan.|Het boek,~s¦dat ik gisteren heb gekocht,~rl¦is heel spannend.~adj|boek=buku@1:boek,kopen=membeli@2:gekocht~koop,spannend=menegangkan@3:spannend|betrekkelijke bijzin: dat + werkwoord achteraan=dat;voltooid deelwoord=gekocht|
A2|Dia lupa mengunci pintu.|Ze is vergeten~p¦de deur~o¦af te sluiten.~p|vergeten=lupa@1:vergeten~vergat,deur=pintu@2:deur,afsluiten=mengunci@3:afsluiten~af te sluiten|te + scheidbaar werkwoord: af te sluiten=af te sluiten|
A1|Saya suka musik dan bermain gitar.|Ik hou van muziek~po¦en speel gitaar.~po|houden=suka@1:hou~houd~houden,muziek=musik@1:muziek,gitaar=gitar@2:gitaar,spelen=bermain@2:speel~spelen|houden van + objek=hou van|
A1|Ayah saya bekerja di rumah sakit.|Mijn vader~s¦werkt~p¦in het ziekenhuis.~t|vader=ayah@1:vader,werken=bekerja@2:werkt~werken,ziekenhuis=rumah sakit@3:ziekenhuis|in = di (lokasi)=in het~in|
A2|Bulan depan kami pergi ke pantai.|Volgende maand~w¦gaan we~so¦naar het strand.~tp|maand=bulan@1:maand,gaan=pergi@2:gaan,strand=pantai@3:strand|naar = ke=naar|
A2|Dia membeli roti di toko dekat rumah.|Ze heeft~so¦in de winkel bij het huis~t¦brood gekocht.~po|winkel=toko@2:winkel,huis=rumah@2:huis,brood=roti@3:brood,kopen=membeli@3:gekocht~koop|voltooid tegenwoordige tijd=heeft~gekocht|
A2|Tolong buka jendelanya karena di sini panas.|Doe alsjeblieft het raam open,~po¦omdat het hier warm is.~r|raam=jendela@1:raam,openen=membuka@1:open~openen,warm=panas@2:warm|omdat: verba di akhir=is;scheidbaar werkwoord: doe … open=open|
A2|Saya belum makan karena tidak lapar.|Ik heb nog niet gegeten,~po¦omdat ik geen honger heb.~r|eten=makan@1:gegeten~eten,honger=lapar@2:honger|nog niet=belum=nog niet;geen=negasi=geen|
B1|Setelah bekerja, dia pergi berenang bersama teman-temannya.|Na het werk~w¦gaat hij~so¦met zijn vrienden~ac¦zwemmen.~p|werk=pekerjaan@1:werk,gaan=pergi@2:gaat,vriend=teman@3:vrienden~vriend,zwemmen=berenang@4:zwemmen|na = setelah=na;met = bersama=met|
A1|Saya tinggal di kota kecil bersama keluarga saya.|Ik woon~so¦in een kleine stad~t¦met mijn gezin.~ac|wonen=tinggal@1:woon~wonen,stad=kota@2:stad,klein=kecil@2:kleine~klein,gezin=keluarga@3:gezin|in=di (lokasi)=in een;bijvoeglijk naamwoord=klein + e di depan de-woord=kleine|
A1|Dia sedang membaca buku di perpustakaan.|Zij leest~so¦een boek~o¦in de bibliotheek.~t|lezen=membaca@1:leest~lezen,boek=buku@2:boek,bibliotheek=perpustakaan@3:bibliotheek|lezen=orang ketiga tunggal + t=leest;in de=di (lokasi)=in de|
A2|Malam ini kami makan malam pukul tujuh.|Vanavond~w¦dineren wij~so¦om zeven uur.~w|vanavond=malam ini@1:vanavond,dineren=makan malam@2:dineren,zeven=tujuh@3:zeven|inversi=verba di posisi 2=dineren wij;om + jam=pada pukul=om zeven uur|
A1|Cuaca hari ini bagus, jadi kami jalan-jalan di taman.|Het weer is vandaag mooi,~x¦daarom gaan we~so¦in het park wandelen.~tp|weer=cuaca@1:weer,mooi=bagus@1:mooi,park=taman@3:park,wandelen=jalan-jalan@3:wandelen|daarom=inversi: verba tepat setelah daarom=daarom gaan we;gaan + infinitif=pergi melakukan=wandelen|
A2|Setiap hari saya naik bus ke kantor.|Elke dag~w¦ga ik~so¦met de bus~c¦naar kantoor.~tp|dag=hari@1:dag,gaan=pergi@2:ga~gaan,bus=bus@3:bus,kantoor=kantor@4:kantoor|inversi=verba di posisi 2=ga ik;met=alat transportasi=met de bus|
A2|Tadi malam saya tidur terlambat karena menonton pertandingan sepak bola.|Gisteravond ben ik laat gaan slapen,~w¦omdat ik naar een voetbalwedstrijd~r¦heb gekeken.~p|gisteravond=tadi malam@1:gisteravond,laat=terlambat@1:laat,voetbalwedstrijd=pertandingan sepak bola@2:voetbalwedstrijd,kijken=menonton@3:gekeken|omdat=verba di akhir anak kalimat=heb gekeken;kijken naar=menonton sesuatu=naar een|
A2|Tahukah kamu di mana toko buku itu?|Weet je,~x¦waar de boekwinkel~s¦is?~p|weten=tahu@1:weet,boekwinkel=toko buku@2:boekwinkel,waar=di mana@2:waar|weten=weet je (tanpa t setelah inversi)=weet je;waar=verba di akhir anak kalimat=boekwinkel is|
A2|Tahun depan dia ingin belajar di luar negeri.|Volgend jaar~w¦wil zij~mo¦in het buitenland~t¦studeren.~p|jaar=tahun@1:jaar,willen=ingin@2:wil~willen,buitenland=luar negeri@3:buitenland,studeren=belajar kuliah@4:studeren|inversi=verba di posisi 2=wil zij;modal=infinitif di akhir=studeren|
A2|Saya lebih suka teh daripada kopi.|Ik drink~so¦liever thee~o¦dan koffie.~m|drinken=minum@1:drink~drinken,thee=teh@2:thee,koffie=kopi@3:koffie,liever=lebih suka@2:liever|liever=komparatif dari graag=liever;dan=daripada (perbandingan)=dan koffie|
A2|Kami menunggu bus selama dua puluh menit.|Wij hebben~so¦twintig minuten~w¦op de bus~o¦gewacht.~p|wachten=menunggu@4:gewacht,minuut=menit@2:minuten,twintig=dua puluh@2:twintig,bus=bus@3:bus|wachten op=menunggu sesuatu=op de;perfectum=hebben + voltooid deelwoord=gewacht|
A2|Dokter menyuruh saya minum banyak air.|De dokter zegt~so¦dat ik veel water~o¦moet drinken.~p|dokter=dokter@1:dokter,water=air@2:water,veel=banyak@2:veel,drinken=minum@3:drinken|dat=verba di akhir anak kalimat=moet drinken;moeten=harus/disuruh=moet|
A2|Bolehkah saya bertanya sesuatu?|Mag ik~mo¦iets vragen?~po|mogen=boleh@1:mag~mogen,iets=sesuatu@2:iets,vragen=bertanya@2:vragen|inversi=pertanyaan ya/tidak: verba di awal=mag ik;modal=infinitif di akhir=vragen|
B1|Saya akan meneleponmu begitu saya sampai di rumah.|Ik bel je op,~so¦zodra ik~r¦thuis aankom.~p|opbellen=menelepon@1:bel~opbellen,zodra=begitu@2:zodra,thuis=di rumah@3:thuis,aankomen=sampai@3:aankom~aankomen|scheidbaar=prefiks op di akhir=bel je op;zodra=verba di akhir anak kalimat=thuis aankom|
B1|Dia sudah tinggal di sini selama sepuluh tahun.|Hij woont~so¦al tien jaar~w¦hier.~t|wonen=tinggal@1:woont~wonen,jaar=tahun@2:jaar,tien=sepuluh@2:tien,hier=di sini@3:hier|al ... jaar + presens=durasi sampai sekarang=al tien jaar;wonen=orang ketiga + t=woont|
B1|Film yang kami tonton semalam sangat bagus.|De film,~s¦die wij gisteren hebben gezien,~rl¦was erg goed.~pp|film=film@1:film,zien=menonton@2:gezien,gisteren=kemarin@2:gisteren,goed=bagus@3:goed|die=pronomina relatif untuk de-woord=die wij;anak kalimat relatif=verba di akhir=hebben gezien|
B1|Jika kamu butuh bantuan, kabari saja saya.|Als je hulp nodig hebt,~k¦laat het me maar weten.~po|hulp=bantuan@1:hulp,nodig=perlu@1:nodig,weten=tahu@2:weten,maar=saja@2:maar|als=verba di akhir anak kalimat=nodig hebt;laten weten=memberi kabar=laat het me maar weten~laat|
B1|Saya senang bahwa kami bisa beristirahat di akhir pekan.|Ik ben blij,~so¦dat we in het weekend~r¦kunnen uitrusten.~p|blij=senang@1:blij,weekend=akhir pekan@2:weekend,uitrusten=beristirahat@3:uitrusten,kunnen=bisa@3:kunnen|dat=verba di akhir anak kalimat=kunnen uitrusten;in het weekend=pada akhir pekan=in het weekend|
B1|Dia tidak hanya pandai memasak, tetapi juga pandai menyanyi.|Zij kan niet alleen goed koken,~mo¦maar ook goed zingen.~cl|koken=memasak@1:koken,zingen=menyanyi@2:zingen,goed=pandai@1:goed|niet alleen ... maar ook=tidak hanya ... tetapi juga=niet alleen~maar ook;modal=infinitif di akhir=kan niet alleen goed koken~koken|
B2|Kalau saja saya tahu itu lebih awal, saya sudah memberitahumu.|Als ik dat eerder had geweten,~k¦had ik het je verteld.~po|eerder=lebih awal@1:eerder,weten=tahu@1:geweten,vertellen=memberitahu@2:verteld|pengandaian lampau=had + voltooid deelwoord=had geweten;inversi di klausa utama=had ik het je verteld=had ik|
B1|Rapat ditunda karena banyak orang sakit.|De vergadering is uitgesteld,~so¦omdat veel mensen~r¦ziek zijn.~r|vergadering=rapat@1:vergadering,uitstellen=menunda@1:uitgesteld,mensen=orang@2:mensen,ziek=sakit@3:ziek|pasif=zijn + voltooid deelwoord=is uitgesteld;omdat=verba di akhir=ziek zijn|`,
en:`A2|Although it was raining, I still went to the university.|Although it was raining,~n¦I still went~so¦to the university.~tp|rain=hujan@1:raining~rain~rained,go=pergi@2:went~go~goes,university=universitas@3:university,still=tetap@2:still|although = meskipun (tanpa "but")=although;past continuous: was raining=was raining~was rain|
A1|I drink coffee every morning.|I drink coffee~po¦every morning.~w|drink=minum@1:drink~drinks,coffee=kopi@1:coffee,morning=pagi@2:morning|every + singular noun=every morning|Every morning I drink coffee.
A1|Yesterday I watched a movie with my friends.|Yesterday~w¦I watched~so¦a movie~o¦with my friends.~ac|yesterday=kemarin@1:yesterday,watch=menonton@2:watched~watch,movie=film@3:movie~film,friend=teman@4:friends~friend|simple past -ed=watched;with = bersama=with|
A2|I want to drink coffee because I am tired.|I want to drink coffee~po¦because I am tired.~r|want=ingin@1:want~wants,coffee=kopi@1:coffee,tired=lelah@2:tired|want to + verb=want to;because + klausa=because|
A1|We are going to Amsterdam by train tomorrow.|We are going~so¦to Amsterdam~tp¦by train~c¦tomorrow.~w|train=kereta@3:train,tomorrow=besok@4:tomorrow,go=pergi@1:going~go|present continuous untuk rencana=are going;by + alat transportasi=by train|We are going to Amsterdam tomorrow by train.
A2|Could you help me, please?|Could you~mo¦help me,~po¦please?~a|help=membantu@2:help,please=tolong@3:please|could = permintaan sopan=could|
B1|If I had more time, I would exercise more often.|If I had more time,~k¦I would exercise~po¦more often.~a|time=waktu@1:time,exercise=berolahraga@2:exercise~work out,often=sering@3:often|second conditional: had + would=had~would|
A2|My sister is taller than me.|My sister~s¦is taller~adj¦than me.~m|sister=saudari@1:sister,tall=tinggi@2:taller~tall|comparative -er + than=taller~than|
B1|He says that he doesn't have time tomorrow.|He says~so¦that he doesn't have time~q¦tomorrow.~w|say=berkata@1:says~said~say,time=waktu@2:time,tomorrow=besok@3:tomorrow|negatif: doesn't + base verb=doesn't have~does not have|
A2|I have to go to bed early tonight.|I have to~mo¦go to bed~tpp¦early~a¦tonight.~w|bed=tempat tidur@2:bed,early=awal@3:early,tonight=malam ini@4:tonight|have to = keharusan=have to~must|
A1|The station is next to the post office.|The station~s¦is~p¦next to the post office.~t|station=stasiun@1:station,next to=di samping@3:next to,post office=kantor pos@3:post office|next to = di samping=next to|
A2|I visited my grandmother yesterday because it was her birthday.|I visited~so¦my grandmother~o¦yesterday~w¦because it was her birthday.~r|visit=mengunjungi@1:visited~visit,grandmother=nenek@2:grandmother~grandma,birthday=ulang tahun@4:birthday|simple past=visited;because + klausa=because|
B1|The book that I bought yesterday is very exciting.|The book~s¦that I bought yesterday~rl¦is very exciting.~adj|book=buku@1:book,buy=membeli@2:bought~buy,exciting=menegangkan@3:exciting~interesting|relative clause: that=that|
A2|She forgot to lock the door.|She forgot~so¦to lock~p¦the door.~o|forget=lupa@1:forgot~forget,lock=mengunci@2:lock,door=pintu@3:door|forget + to-infinitive=to lock|
A1|The child is playing in the garden with a ball.|The child~s¦is playing~p¦in the garden~t¦with a ball.~c|child=anak@1:child~kid,play=bermain@2:playing~plays~play,garden=kebun@3:garden,ball=bola@4:ball|present continuous=is playing|
A2|I have been learning English for two years.|I have been learning~so¦English~o¦for two years.~a|learn=belajar@1:learning~learn~learned,English=bahasa Inggris@2:english,year=tahun@3:years~year|present perfect continuous=have been learning~have been;for + durasi=for two years~for|
A1|Ayah saya bekerja di rumah sakit.|My father~s¦works~p¦at a hospital.~t|father=ayah@1:father,work=bekerja@2:works~work,hospital=rumah sakit@3:hospital|at + tempat kerja=at a hospital~at|
A2|Bulan depan kami akan pergi ke pantai.|Next month~w¦we are going~so¦to the beach.~tp|month=bulan@1:month,go=pergi@2:going~go,beach=pantai@3:beach|present continuous untuk rencana=are going|
A2|Dia membeli roti di toko dekat rumah.|She bought bread~po¦at the shop~t¦near her house.~t|buy=membeli@1:bought~buy,bread=roti@1:bread,shop=toko@2:shop~store,house=rumah@3:house~home|simple past=bought|
A2|Tolong buka jendelanya karena di sini panas.|Please open the window,~po¦because it is hot here.~r|open=membuka@1:open,window=jendela@1:window,hot=panas@2:hot|because + klausa=because;imperatif dengan please=please open|
A2|Saya belum makan karena tidak lapar.|I haven't eaten yet,~po¦because I am not hungry.~r|eat=makan@1:eaten~eat,hungry=lapar@2:hungry|present perfect + yet=haven't eaten~have not eaten;negasi be=am not hungry|
B1|Setelah bekerja, dia pergi berenang bersama teman-temannya.|After work,~w¦he goes swimming~po¦with his friends.~ac|work=pekerjaan@1:work,swim=berenang@2:swimming~swim,friend=teman@3:friends~friend|after + noun=after work;go + V-ing=goes swimming|
A1|Saya tinggal di kota kecil bersama keluarga saya.|I live~so¦in a small town~t¦with my family.~ac|live=tinggal@1:live,town=kota@2:town,small=kecil@2:small,family=keluarga@3:family|in + tempat=di (kota)=in a;with=bersama=with my|
A1|Dia sedang membaca buku di perpustakaan.|She is reading~so¦a book~o¦in the library.~t|read=membaca@1:reading~read,book=buku@2:book,library=perpustakaan@3:library|present continuous=is + V-ing=is reading;in the=di=in the|
A1|Malam ini kami makan malam pukul tujuh.|We have dinner~po¦at seven~w¦tonight.~w|dinner=makan malam@1:dinner,seven=tujuh@2:seven,tonight=malam ini@3:tonight|have dinner=bukan eat dinner=have dinner;at + jam=pukul=at seven|
A1|Cuaca hari ini bagus, jadi kami jalan-jalan di taman.|The weather is nice today,~x¦so we go for a walk~po¦in the park.~t|weather=cuaca@1:weather,nice=bagus@1:nice,walk=jalan-jalan@2:walk,park=taman@3:park|so=jadi (akibat)=so we;go for a walk=jalan-jalan=for a walk|
A2|Setiap hari saya naik bus ke kantor.|Every day~w¦I take the bus~po¦to the office.~tp|day=hari@1:day,take=naik@2:take,bus=bus@2:bus,office=kantor@3:office|take the bus=naik bus=take the bus;to=ke=to the|
A2|Tadi malam saya tidur terlambat karena menonton pertandingan sepak bola.|Last night I went to bed late~w¦because I was watching~r¦a football match.~o|night=malam@1:night,late=terlambat@1:late,watch=menonton@2:watching~watch,football=sepak bola@3:football,match=pertandingan@3:match|past simple=go → went=went to bed;past continuous=was + V-ing=was watching|
A2|Tahukah kamu di mana toko buku itu?|Do you know~x¦where the bookstore is?~q|know=tahu@1:know,where=di mana@2:where,bookstore=toko buku@2:bookstore|pertanyaan tak langsung=urutan kata biasa=where the bookstore is;do-support=do you know|
A2|Tahun depan dia ingin belajar di luar negeri.|Next year~w¦she wants~so¦to study~p¦abroad.~t|year=tahun@1:year,want=ingin@2:wants~want,study=belajar@3:study,abroad=luar negeri@4:abroad|want to=want + to + V dasar=to study;orang ketiga tunggal=akhiran -s=wants|
A2|Saya lebih suka teh daripada kopi.|I prefer tea~so¦to coffee.~m|prefer=lebih suka@1:prefer,tea=teh@1:tea,coffee=kopi@2:coffee|prefer A to B=lebih suka A daripada B=to coffee|
A2|Kami menunggu bus selama dua puluh menit.|We waited~so¦for the bus~o¦for twenty minutes.~w|wait=menunggu@1:waited~wait,bus=bus@2:bus,twenty=dua puluh@3:twenty,minute=menit@3:minutes~minute|wait for=menunggu sesuatu=for the;for + durasi=selama=for twenty|
A2|Dokter menyuruh saya minum banyak air.|The doctor told me~so¦to drink~po¦a lot of water.~o|doctor=dokter@1:doctor,tell=menyuruh@1:told,drink=minum@2:drink,water=air@3:water|tell someone to + V=menyuruh seseorang=told me to~to drink;a lot of=banyak=a lot of|
A2|Bolehkah saya bertanya sesuatu?|May I~mo¦ask you something?~po|may=boleh@1:may,ask=bertanya@2:ask,something=sesuatu@2:something|may I=permintaan izin sopan=may i;ask + orang=bertanya kepada=ask you|
B1|Saya akan meneleponmu begitu saya sampai di rumah.|I will call you~so¦as soon as~r¦I get home.~r|call=menelepon@1:call,soon=segera@2:soon,home=rumah@3:home,get=sampai@3:get|as soon as + presens=bukan will=as soon as i get~i get;will + V dasar=masa depan=will call|
B1|Dia sudah tinggal di sini selama sepuluh tahun.|He has lived here~so¦for ten years.~w|live=tinggal@1:lived,here=di sini@1:here,year=tahun@2:years~year,ten=sepuluh@2:ten|present perfect=has + past participle=has lived;for + durasi=selama=for ten|
B1|Film yang kami tonton semalam sangat bagus.|The movie~s¦that we watched last night~rl¦was really good.~pp|movie=film@1:movie,watch=menonton@2:watched,night=malam@2:night,good=bagus@3:good|that=pronomina relatif=that we;past simple=V-ed=watched|
B1|Jika kamu butuh bantuan, kabari saja saya.|If you need help,~k¦just let me know.~po|help=bantuan@1:help,need=butuh@1:need,know=tahu@2:know,just=saja@2:just|if + present simple=kondisi nyata=if you need;let me know=beri tahu saya=let me know|
B1|Saya senang bahwa kami bisa beristirahat akhir pekan ini.|I am happy~so¦that we can rest~r¦this weekend.~w|happy=senang@1:happy,rest=beristirahat@2:rest,weekend=akhir pekan@3:weekend,can=bisa@2:can|that-clause=that + subjek + verba=that we;can + V dasar=tanpa to=can rest|
B1|Dia tidak hanya pandai memasak, tetapi juga pandai menyanyi.|She can not only cook well,~so¦but also sing well.~cl|cook=memasak@1:cook,sing=menyanyi@2:sing,well=baik@1:well|not only ... but also=tidak hanya ... tetapi juga=not only~but also;can + V dasar=can not only cook~can|
B2|Kalau saja saya tahu itu lebih awal, saya sudah memberitahumu.|If I had known earlier,~k¦I would have told you.~po|know=tahu@1:known,early=awal@1:earlier,tell=memberitahu@2:told|conditional tipe 3=if + had + past participle=had known;would have + past participle=would have told|
B1|Rapat ditunda karena banyak orang sakit.|The meeting was postponed~so¦because many people~r¦are sick.~r|meeting=rapat@1:meeting,postpone=menunda@1:postponed,people=orang@2:people,sick=sakit@3:sick|passive past=was + past participle=was postponed;many + jamak=many people|`,
eo:`A2|Meskipun hujan, saya tetap pergi ke universitas.|Kvankam pluvas,~n¦mi tamen iras~so¦al la universitato.~tp|pluvi=hujan@1:pluvas~pluvi,iri=pergi@2:iras~iri,tamen=tetap@2:tamen,universitato=universitas@3:universitato|kvankam = meskipun=kvankam;akhiran -as = kala kini=pluvas~iras;al = ke (tanpa -n)=al|
A1|Setiap pagi saya minum kopi.|Mi trinkas~so¦kafon~o¦ĉiumatene.~w|trinki=minum@1:trinkas~trinki,kafo=kopi@2:kafon~kafo,mateno=pagi@3:ĉiumatene~matene|akusativo -n pada objek=kafon|
A1|Kemarin saya menonton film bersama teman-temanku.|Hieraŭ~w¦mi spektis~so¦filmon~o¦kun miaj amikoj.~ac|hieraŭ=kemarin@1:hieraŭ,spekti=menonton@2:spektis~spekti,filmo=film@3:filmon~filmo,amiko=teman@4:amikoj~amiko|akhiran -is = kala lampau=spektis;kun = bersama=kun;jamak -j=miaj amikoj|
A2|Saya mau minum kopi karena saya lelah.|Mi volas trinki kafon,~po¦ĉar mi estas laca.~r|voli=ingin@1:volas~voli,trinki=minum@1:trinki,kafo=kopi@1:kafon~kafo,laca=lelah@2:laca|ĉar = karena=ĉar;voli + infinitivo -i=trinki|
A1|Besok kami naik kereta ke Amsterdam.|Ni veturas~so¦morgaŭ~w¦per trajno~c¦al Amsterdamo.~tp|veturi=bepergian@1:veturas~veturi,morgaŭ=besok@2:morgaŭ,trajno=kereta@3:trajno|per = dengan (alat)=per;al = ke=al|
A2|Bisakah kamu membantuku?|Ĉu vi povas~mo¦helpi min,~po¦mi petas?~a|povi=bisa@1:povas~povi,helpi=membantu@2:helpi,peti=meminta@3:petas~peti|ĉu = partikel pertanyaan ya/tidak=ĉu;min = akusativo=min|
B1|Kalau saya punya lebih banyak waktu, saya akan lebih sering berolahraga.|Se mi havus pli da tempo,~k¦mi farus~so¦pli ofte~a¦sporton.~o|havi=punya@1:havus~havi,tempo=waktu@1:tempo,fari=melakukan@2:farus~fari,ofte=sering@3:ofte,sporto=olahraga@4:sporton~sporto|-us = kondisional=havus~farus;pli da = lebih banyak=pli da|
A2|Saudariku lebih tinggi daripada aku.|Mia fratino~s¦estas~p¦pli alta~adj¦ol mi.~m|fratino=saudari@1:fratino,alta=tinggi@3:alta|pli … ol = lebih … daripada=pli~ol|
B1|Dia bilang bahwa besok dia tidak punya waktu.|Li diras,~so¦ke li ne havas tempon~q¦morgaŭ.~w|diri=berkata@1:diras~diri,havi=punya@2:havas~havi,tempo=waktu@2:tempon~tempo,morgaŭ=besok@3:morgaŭ|ke = bahwa=ke;akusativo -n=tempon|
A2|Malam ini saya harus tidur lebih awal.|Mi devas~mo¦enlitiĝi~p¦frue~a¦ĉi-vespere.~w|devi=harus@1:devas~devi,frue=awal@3:frue,vespero=malam@4:vespere~ĉi-vespere|devi + infinitivo=enlitiĝi|
A1|Stasiun ada di samping kantor pos.|La stacidomo~s¦estas~p¦apud la poŝtoficejo.~t|stacidomo=stasiun@1:stacidomo,apud=di samping@3:apud,poŝtoficejo=kantor pos@3:poŝtoficejo|apud = di samping (tanpa -n)=apud|
A2|Kemarin saya mengunjungi nenekku karena dia berulang tahun.|Hieraŭ~w¦mi vizitis~so¦mian avinon,~o¦ĉar ŝi havis naskiĝtagon.~r|viziti=mengunjungi@2:vizitis~viziti,avino=nenek@3:avinon~avino,naskiĝtago=ulang tahun@4:naskiĝtagon~naskiĝtago|akusativo -n=avinon~naskiĝtagon;mian = posesif akusativo=mian|
B1|Buku yang kubeli kemarin sangat menarik.|La libro,~s¦kiun mi aĉetis hieraŭ,~rl¦estas tre interesa.~adj|libro=buku@1:libro,aĉeti=membeli@2:aĉetis~aĉeti,interesa=menarik@3:interesa|kiun = relatif akusativo=kiun|
A2|Dia lupa mengunci pintu.|Ŝi forgesis~so¦ŝlosi~p¦la pordon.~o|forgesi=lupa@1:forgesis~forgesi,ŝlosi=mengunci@2:ŝlosi,pordo=pintu@3:pordon~pordo|akusativo -n=pordon|
A1|Anak itu bermain bola di kebun.|La infano~s¦ludas~p¦en la ĝardeno~t¦per pilko.~c|infano=anak@1:infano,ludi=bermain@2:ludas~ludi,ĝardeno=kebun@3:ĝardeno,pilko=bola@4:pilko|en + lokasi tanpa -n=en la ĝardeno|
A2|Saya sudah belajar bahasa Esperanto dua tahun.|Mi lernas~so¦Esperanton~o¦jam du jarojn.~w|lerni=belajar@1:lernas~lerni,Esperanto=Esperanto@2:esperanton~esperanto,jaro=tahun@3:jarojn~jaro|akusativo -n=Esperanton~jarojn|
A1|Ayah saya bekerja di rumah sakit.|Mia patro~s¦laboras~p¦en hospitalo.~t|patro=ayah@1:patro,labori=bekerja@2:laboras~labori,hospitalo=rumah sakit@3:hospitalo|en + lokasi tanpa -n=en hospitalo~en
A2|Bulan depan kami akan pergi ke pantai.|Venontmonate~w¦ni iros~so¦al la plaĝo.~tp|monato=bulan@1:venontmonate~monate,iri=pergi@2:iros~iri,plaĝo=pantai@3:plaĝo|-os = kala depan=iros;al = ke=al|
A2|Dia membeli roti di toko dekat rumah.|Ŝi aĉetis panon~po¦en la vendejo~t¦proksime de la domo.~t|aĉeti=membeli@1:aĉetis~aĉeti,pano=roti@1:panon~pano,vendejo=toko@2:vendejo,domo=rumah@3:domo,proksime=dekat@3:proksime|-n akusativo=panon|
A2|Tolong buka jendelanya karena di sini panas.|Bonvolu malfermi la fenestron,~po¦ĉar ĉi tie estas varme.~r|malfermi=membuka@1:malfermi,fenestro=jendela@1:fenestron~fenestro,varma=panas@2:varme~varma|ĉar=karena=ĉar;-n akusativo=fenestron|
A2|Saya belum makan karena tidak lapar.|Mi ankoraŭ ne manĝis,~po¦ĉar mi ne malsatas.~r|manĝi=makan@1:manĝis~manĝi,malsati=lapar@2:malsatas~malsati|ankoraŭ ne=belum=ankoraŭ ne|
B1|Setelah bekerja, dia pergi berenang bersama teman-temannya.|Post la laboro~w¦li iras~so¦naĝi~p¦kun siaj amikoj.~ac|laboro=pekerjaan@1:laboro,iri=pergi@2:iras~iri,naĝi=berenang@3:naĝi,amiko=teman@4:amikoj~amiko|post = setelah=post;sia = posesif refleksif=siaj|
A1|Saya tinggal di kota kecil bersama keluarga saya.|Mi loĝas~so¦en malgranda urbo~t¦kun mia familio.~ac|loĝi=tinggal@1:loĝas~loĝi,urbo=kota@2:urbo,malgranda=kecil@2:malgranda,familio=keluarga@3:familio|en=di (lokasi tanpa -n)=en malgranda urbo~en;kun=bersama=kun mia|
A1|Dia sedang membaca buku di perpustakaan.|Ŝi legas~so¦libron~o¦en la biblioteko.~t|legi=membaca@1:legas~legi,libro=buku@2:libron~libro,biblioteko=perpustakaan@3:biblioteko|akuzativo=objek langsung berakhiran -n=libron;presens=akhiran -as=legas|
A1|Malam ini kami makan malam pukul tujuh.|Hodiaŭ vespere~w¦ni vespermanĝos~so¦je la sepa.~w|vespermanĝi=makan malam@2:vespermanĝos~vespermanĝi,vespero=malam@1:vespere,sepa=ketujuh@3:sepa|futuro=akhiran -os=vespermanĝos;je=pada (waktu)=je la sepa|
A1|Cuaca hari ini bagus, jadi kami jalan-jalan di taman.|La vetero hodiaŭ estas bela,~x¦tial ni promenas~so¦en la parko.~t|vetero=cuaca@1:vetero,bela=bagus@1:bela,promeni=jalan-jalan@2:promenas~promeni,parko=taman@3:parko|tial=jadi/karena itu=tial;presens=akhiran -as=promenas|
A2|Setiap hari saya naik bus ke kantor.|Ĉiutage~w¦mi veturas~so¦per buso~c¦al la oficejo.~tp|ĉiutage=setiap hari@1:ĉiutage,veturi=berkendara@2:veturas~veturi,buso=bus@3:buso,oficejo=kantor@4:oficejo|per=dengan (alat)=per buso;al=ke (tanpa -n)=al la oficejo|
A2|Tadi malam saya tidur terlambat karena menonton pertandingan sepak bola.|Hieraŭ vespere mi enlitiĝis malfrue,~w¦ĉar mi spektis~r¦futbalan matĉon.~o|hieraŭ=kemarin@1:hieraŭ,malfrue=terlambat@1:malfrue,spekti=menonton@2:spektis~spekti,futbala=sepak bola@3:futbalan~futbala,matĉo=pertandingan@3:matĉon~matĉo|preterito=akhiran -is=spektis;akuzativo=sifat dan nomina objek berakhiran -n=futbalan matĉon|
A2|Tahukah kamu di mana toko buku itu?|Ĉu vi scias,~x¦kie estas~p¦la librovendejo?~s|scii=tahu@1:scias~scii,kie=di mana@2:kie,librovendejo=toko buku@3:librovendejo|ĉu=partikel pertanyaan ya/tidak=ĉu;kie=di mana (lokasi tanpa -n)=kie estas|
A2|Tahun depan dia ingin belajar di luar negeri.|Venontjare~w¦ŝi volas~so¦studi~p¦eksterlande.~t|jaro=tahun@1:venontjare,voli=ingin@2:volas~voli,studi=belajar@3:studi,eksterlando=luar negeri@4:eksterlande|voli + infinitivo=infinitif berakhiran -i=volas studi;adverbo=akhiran -e=eksterlande~venontjare|
A2|Saya lebih suka teh daripada kopi.|Mi pli ŝatas~so¦teon~o¦ol kafon.~m|ŝati=suka@1:ŝatas~ŝati,teo=teh@2:teon~teo,kafo=kopi@3:kafon~kafo|pli ... ol=lebih ... daripada=pli ŝatas~ol;akuzativo=objek berakhiran -n=teon~kafon|
A2|Kami menunggu bus selama dua puluh menit.|Ni atendis~so¦la buson~o¦dum dudek minutoj.~w|atendi=menunggu@1:atendis~atendi,buso=bus@2:buson~buso,minuto=menit@3:minutoj~minuto,dudek=dua puluh@3:dudek|preterito=akhiran -is=atendis;dum=selama=dum dudek|
A2|Dokter menyuruh saya minum banyak air.|La kuracisto diris al mi,~so¦ke mi trinku~po¦multe da akvo.~o|kuracisto=dokter@1:kuracisto,trinki=minum@2:trinku~trinki,akvo=air@3:akvo,multe=banyak@3:multe|volitivo=ke + akhiran -u untuk perintah=ke mi trinku;multe da=banyak=multe da|
A2|Bolehkah saya bertanya sesuatu?|Ĉu mi rajtas~mo¦demandi ion?~po|rajti=boleh@1:rajtas~rajti,demandi=bertanya@2:demandi,io=sesuatu@2:ion~io|ĉu=partikel pertanyaan=ĉu mi;akuzativo=io menjadi ion=ion|
B1|Saya akan meneleponmu begitu saya sampai di rumah.|Mi telefonos al vi,~so¦tuj kiam mi~r¦alvenos hejmen.~p|telefoni=menelepon@1:telefonos~telefoni,tuj kiam=begitu@2:tuj kiam,hejmo=rumah@3:hejmen~hejmo,alveni=sampai@3:alvenos~alveni|futuro=akhiran -os=telefonos~alvenos;-n arah=hejmen tanpa preposisi=hejmen|
B1|Dia sudah tinggal di sini selama sepuluh tahun.|Li loĝas ĉi tie~so¦de dek jaroj.~w|loĝi=tinggal@1:loĝas~loĝi,ĉi tie=di sini@1:ĉi tie,jaro=tahun@2:jaroj~jaro,dek=sepuluh@2:dek|de + durasi=sejak/selama + presens=de dek jaroj;jamak=akhiran -j=jaroj|
B1|Film yang kami tonton semalam sangat bagus.|La filmo,~s¦kiun ni spektis hieraŭ,~rl¦estis tre bona.~pp|filmo=film@1:filmo,spekti=menonton@2:spektis,hieraŭ=kemarin@2:hieraŭ,bona=bagus@3:bona|kiun=pronomina relatif akuzativ=kiun ni;preterito=estis=estis|
B1|Jika kamu butuh bantuan, kabari saja saya.|Se vi bezonas helpon,~k¦simple sciigu min.~po|helpo=bantuan@1:helpon~helpo,bezoni=butuh@1:bezonas~bezoni,sciigi=memberi kabar@2:sciigu~sciigi,simple=saja@2:simple|se=jika=se vi;imperativo=akhiran -u=sciigu|
B1|Saya senang bahwa kami bisa beristirahat di akhir pekan.|Mi ĝojas,~so¦ke ni povas~r¦ripozi dum la semajnfino.~w|ĝoji=senang@1:ĝojas~ĝoji,povi=bisa@2:povas~povi,ripozi=beristirahat@3:ripozi,semajnfino=akhir pekan@3:semajnfino|ke=bahwa=ke ni;povi + infinitivo=povas ripozi|
B1|Dia tidak hanya pandai memasak, tetapi juga pandai menyanyi.|Ŝi povas ne nur bone kuiri,~mo¦sed ankaŭ bone kanti.~cl|kuiri=memasak@1:kuiri,kanti=menyanyi@2:kanti,bone=baik@1:bone|ne nur ... sed ankaŭ=tidak hanya ... tetapi juga=ne nur~sed ankaŭ;povi + infinitivo=bisa=povas|
B2|Kalau saja saya tahu itu lebih awal, saya sudah memberitahumu.|Se mi estus sciinta tion pli frue,~k¦mi estus dirinta ĝin al vi.~po|scii=tahu@1:sciinta,pli frue=lebih awal@1:pli frue,diri=mengatakan@2:dirinta|kondicionalo=akhiran -us=estus;participo aktiva lampau=akhiran -inta=sciinta~dirinta|
B1|Rapat ditunda karena banyak orang sakit.|La kunveno estis prokrastita,~so¦ĉar multaj homoj~r¦estas malsanaj.~r|kunveno=rapat@1:kunveno,prokrasti=menunda@1:prokrastita,homo=orang@2:homoj,malsana=sakit@3:malsanaj|pasiva participo=akhiran -ita=prokrastita;jamak=akhiran -j=multaj homoj~malsanaj|`};
/* ---- parser ---- */
const SCLV={zh:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6'],ja:['N5','N4','N3','N2'],def:['A1','A2','B1','B2']};
const scSp=(l)=>l=='zh'||l=='ja';
const SCP={};
function scParse(l){if(SCP[l])return SCP[l];const out=[],join=scSp(l)?'':' ';
 (SCD[l]||'').split('\n').forEach((ln,i)=>{ln=ln.trim();if(!ln)return;const f=ln.split('|');if(f.length<5)return;
  const segs=f[2].split('¦').map(z=>{const a=z.split('~');return{t:a[0],r:SCROLE[a[1]]||a[1]||''}}),
   voc=(f[3]||'').split(',').filter(Boolean).map(z=>{const m=z.match(/^(.+?)=(.+?)@(\d+)(?::(.*))?$/);return m?{w:m[1],g:m[2],s:+m[3]-1,acc:(m[4]||m[1]).split('~').filter(Boolean)}:null}).filter(Boolean),
   gr=(f[4]||'').split(';').filter(Boolean).map(z=>{const a=z.split('=');return{lab:a[0],ex:a[1]||'',acc:(a[2]||'').split('~').filter(Boolean)}}),
   alt=(f[5]||'').split('¦').filter(Boolean),full=segs.map(s=>s.t).join(join);
  out.push({k:'sc|'+l+'|'+i,l,lv:f[0],tr:f[1],segs,voc,gr,alt,full,n:segs.length,md:segs.length<=3?'a':segs.length==4?'b':'c'})});
 return SCP[l]=out}
/* ---- statistik performa (terpisah dari SRS utama) ---- */
const scStat=l=>{if(!S.scs)S.scs={};return S.scs[l]||(S.scs[l]={n:0,ok:0,v:0,g:0,s:0,c:0,h:{v:0,g:0,s:0,a:0}})};
const scVoc=()=>S.scv||(S.scv={});
const scWeak=(l,w)=>{const z=scVoc()[w+'@'+l];return z&&z.a?1-z.o/z.a:.5};
/* ---- pengaturan -> pilihan clue ---- */
const scClamp=(v,a,b)=>Math.max(a,Math.min(b,isFinite(+v)?+v:0));
const scK=(N,vp)=>vp=='one'?Math.min(1,N):Math.round(N*scClamp(vp,0,100)/100);
function scPlan(it,o,sh){const N=it.voc.length,k=scK(N,o.vp),idx=it.voc.map((_,i)=>i);
 const ord=idx.map(i=>({i,r:scWeak(it.l,it.voc[i].w)+Math.random()*.6})).sort((a,b)=>b.r-a.r).map(z=>z.i),pick=ord.slice(0,k);
 let nin=0;if(k){nin=o.vpl=='in'?k:o.vpl=='se'?0:Math.round(k*scClamp(o.vin,0,100)/100)}
 const sp=sh(pick.slice()),inl=new Set(sp.slice(0,nin)),sep=sp.slice(nin);
 const ns=it.segs.length,ks=Math.max(1,Math.min(ns,Math.round(ns*scClamp(o.shp==null?100:o.shp,1,100)/100))),lab=new Set(sh(it.segs.map((_,i)=>i)).slice(0,ks));
 return{inl,sep:sh(sep),extra:ord.filter(i=>!pick.includes(i)),lab}}
/* ---- penilaian ---- */
const scNorm=(s,l)=>scSp(l)?srShNorm(s,l):' '+srShNorm(s,l)+' ';
function scHas(tr,acc,l){const a=srShNorm(acc,l);if(!a)return false;if(scSp(l))return tr.includes(a);
 const T=tr.trim().split(' '),A=a.split(' ');if(A.length>1)return(' '+T.join(' ')+' ').includes(' '+a+' ');
 return T.some(w=>{const e=srShEq(w,a,l);return e>=.5||(a.length>=5&&w.length>=a.length-1&&w.startsWith(a.slice(0,Math.max(4,a.length-2))))})}
function scJudge(it,alts,o){const l=it.l,thr=+o.thr||75;let best={sim:0,alt:'',ref:it.full,main:true};
 for(const a of alts){for(const r of[it.full].concat(it.alt)){const s=srSim(r,a,l);if(s>best.sim)best={sim:s,alt:a,ref:r,main:r===it.full}}}
 const heard=best.alt||alts[0]||'',tr=srShNorm(heard,l);
 const vf=it.voc.map(v=>({v,ok:v.acc.some(a=>scHas(tr,a,l))}));
 const gc=it.gr.filter(g=>g.acc.length).map(g=>({g,ok:g.acc.some(a=>scHas(tr,a,l))}));
 const d=srDiff(it.full,heard,l),cj=scSp(l);let pos=0;const sc=it.segs.map(s=>{const n=cj?Array.from(s.t).length:s.t.split(/\s+/).filter(Boolean).length,ps=d.parts.slice(pos,pos+n);pos+=n;
  const m=ps.filter(p=>p.s==1).length,den=ps.filter(p=>p.s!=2).length;return{s,cov:den?m/den:1}});
 const cov=sc.reduce((a,z)=>a+z.cov,0)/sc.length*100,st=best.main?cov:Math.max(cov,best.sim*.95),vo=vf.length?vf.filter(z=>z.ok).length/vf.length*100:100,gr=gc.length?gc.filter(z=>z.ok).length/gc.length*100:null,cm=best.sim;
 const W={v:30,g:gr==null?0:25,s:25,c:20},tw=W.v+W.g+W.s+W.c,tot=Math.round((vo*W.v+(gr||0)*W.g+st*W.s+cm*W.c)/tw);
 return{heard,tot,vo:Math.round(vo),gr:gr==null?null:Math.round(gr),st:Math.round(st),cm:Math.round(cm),vf,gc,sc,thr,ok:tot>=thr&&cm>=50,main:best.main}}
function scLog(it,r,q){if(gxFree)return;const st=scStat(it.l);st.n++;if(r.ok)st.ok++;st.v+=r.vo;st.g+=r.gr==null?0:r.gr;st.s+=r.st;st.c+=r.cm;
 const h=q.help;st.h.v+=h.v?1:0;st.h.g+=h.g?1:0;st.h.s+=h.s?1:0;st.h.a+=h.a?1:0;
 for(const z of r.vf){const e=scVoc()[z.v.w+'@'+it.l]||(scVoc()[z.v.w+'@'+it.l]={a:0,o:0});e.a++;if(z.ok)e.o++}}
/* ---- tampilan kerangka ---- */
const scPunc=t=>(t.match(/[、。，．,.?!？！…]+$/)||[''])[0];
const scChip=(v)=>`<span class=scv>${esc(v.w)}<small>${esc(v.g)}</small></span>`;
function scFrame(q){const it=q.it,nat=`<div class=scn>${esc(q.it.tr)}</div>`,P=q.plan,H=q.help,ex=H.v|0,vis=new Set(P.inl);for(let i=0;i<ex;i++)if(P.extra[i]!=null){if(!(q.o.vpl=='se'))vis.add(P.extra[i]);}
 const bank=P.sep.slice();if(q.o.vpl=='se'||q.o.vpl=='mx')for(let i=0;i<ex;i++)if(P.extra[i]!=null&&q.o.vpl=='se')bank.push(P.extra[i]);
 const sg=it.segs.map((s,i)=>{const vs=it.voc.map((v,j)=>({v,j})).filter(z=>z.v.s==i&&vis.has(z.j)).map(z=>scChip(z.v)).join(''),lab=P.lab.has(i)||H.s?`<small class=scr>${i+1}. ${esc(s.r)}</small>`:`<small class=scr>${i+1}.</small>`;
  return `<span class=scs>${vs?`<span class=scvs>${vs}</span>`:''}<span class=scb>＿＿＿${esc(scPunc(s.t))}</span>${lab}</span>`}).join('');
 let h=nat+`<div class=scf>${sg}</div>`;
 if(bank.length)h+=`<div class=scbank><small>Bank kosakata (posisi tidak ditunjukkan)</small><div>${bank.map(j=>scChip(it.voc[j])).join('')}</div></div>`;
 if(q.o.gh!='0'||H.g)h+=`<div class=scg><small>Petunjuk grammar</small><ul>${it.gr.map(g=>`<li><b>${esc(g.lab)}</b>${g.ex?' — '+esc(g.ex):''}</li>`).join('')||'<li>—</li>'}</ul></div>`;
 if(H.a)h+=`<div class=scans><small>Contoh jawaban</small><div>${esc(it.full)}</div>${it.alt.map(a=>`<div>${esc(a)}</div>`).join('')}</div>`;
 const nx=P.extra.length-ex;
 h+=`<div class=scrow>${nx>0&&q.o.vp!=100?`<button class=chip data-a=ggxvhv>🔤 +Kosakata (${nx})</button>`:''}${q.o.gh=='0'&&!H.g?`<button class=chip data-a=ggxvhg>📘 Grammar</button>`:''}${!H.s&&P.lab.size<it.segs.length?`<button class=chip data-a=ggxvhs>🧩 Semua label struktur</button>`:''}${!H.a?`<button class=chip data-a=ggxvha>👁 Contoh jawaban</button>`:''}</div>`;
 return h}
function scMake(c){const l=c.l,o=GXO('scl_'+l),it=scParse(l).find(z=>z.k==c.k.replace(/^sc\|/,'sc|'));if(!it)return null;
 const q={L:l,dir:'B',kind:'sc',noBig:true,cell:'Speaking Cloze · '+it.lv,show:it.tr,say:it.full,words:it.full,it,o,plan:scPlan(it,o,gxShuf),help:{v:0,g:0,s:0,a:0},ph:'Ketik kalimat lengkap dalam bahasa target',
  key:{main:it.full,sub:it.tr,tip:'Kerangka dibuat dari segmen linguistik bahasa target, bukan dari jumlah kata.'}};
 Object.defineProperty(q,'html',{get(){return scFrame(q)}});
 q.act=(a)=>{if(gxRes)return false;const H=q.help;if(a=='ggxvhv'){H.v=(H.v|0)+1;return true}if(a=='ggxvhg'){H.g=1;return true}if(a=='ggxvhs'){H.s=1;return true}if(a=='ggxvha'){H.a=1;return true}return false};
 q.judge=(al,h)=>{if(h=='self')return{ok:al[0]=='ok',got:{self:1}};const r=scJudge(it,al,o);r.ok=r.ok&&!q.help.a;r.help=Object.assign({},q.help);scLog(it,r,q);return{ok:r.ok,got:r}};
 q.resHtml=r=>{const g=r.got;if(!g||g.self)return `<div class=btns><button class=chip data-a=ggxvagain>🔁 Coba lagi (latihan bebas)</button></div>`;
  const bar=(n,v)=>v==null?`<div class=scbr><span>${n}</span><em>tidak dapat dicek otomatis</em></div>`:`<div class=scbr><span>${n}</span><i style="--w:${v}%"></i><b>${v}</b></div>`;
  let h=`<div class=scres><div class=scsum>Skor <b>${g.tot}</b>/100 <small>(lulus ≥ ${g.thr})</small>${q.help.a?' · contoh jawaban dibuka → dihitung belum lulus':''}</div>${bar('Kosakata',g.vo)}${bar('Grammar',g.gr)}${bar('Struktur kalimat',g.st)}${bar('Kelengkapan makna',g.cm)}`;
  h+=`<div class=scseg>${g.sc.map(z=>`<span class="${z.cov>=.8?'shk':'shm'}">${esc(z.s.t)}</span>`).join(scSp(q.L)?'':' ')}</div>`;
  const mv=g.vf.filter(z=>!z.ok).map(z=>`${z.v.w} (${z.v.g})`),mg=g.gc.filter(z=>!z.ok);
  if(mv.length)h+=`<div class=scmis><b>Kosakata terlewat / belum terdengar:</b> ${esc(mv.join(', '))}</div>`;
  if(mg.length)h+=`<div class=scmis><b>Grammar yang perlu diperbaiki:</b><ul>${mg.map(z=>`<li>${esc(z.g.lab)}${z.g.ex?' — '+esc(z.g.ex):''}</li>`).join('')}</ul></div>`;
  const bs=g.sc.filter(z=>z.cov<.6);if(bs.length)h+=`<div class=scmis><b>Susunan / bagian kalimat:</b> ${bs.map(z=>esc((z.s.r||'bagian')+': '+z.s.t)).join(' · ')}</div>`;
  h+=`<div class=scmis><b>Contoh jawaban:</b> ${esc(q.it.full)}${q.it.alt.map(a=>'<br>'+esc(a)).join('')}</div><small>Transkrip berasal dari pengenal suara; ini bukan penilaian pelafalan, dan variasi kalimat yang benar tetapi tak terdaftar mungkin belum dikenali.</small></div><div class=btns><button class=chip data-a=ggxvagain>🔁 Coba lagi (latihan bebas)</button></div>`;
  return h};
 return q}
/* ---- pengaturan & preset ---- */
const SCPRE={mudah:{vp:100,vpl:'in',vin:100,gh:'1',shp:100},menengah:{vp:50,vpl:'mx',vin:50,gh:'1',shp:75},sulit:{vp:'one',vpl:'se',vin:0,gh:'0',shp:50},expert:{vp:0,vpl:'se',vin:0,gh:'0',shp:25}};
function scExtra(g,o){const ch=(f,lab,list)=>`<small>${lab}</small><div class=chips>${list.map(z=>`<button class="chip${String(o[f])==String(z[0])?' on':''}" data-a=ggxvset data-v=${f} data-k="${esc(z[0])}">${z[1]}</button>`).join('')}</div>`,
  num=(f,lab,min)=>`<label class=fcl><span>${lab}</span><input type=number inputmode=numeric data-i=gg_x:${g}:${f} value="${o[f]=='one'?'':o[f]}" min=${min} max=100></label>`;
 return `<small>Preset kesulitan (tiap nilai tetap bisa diubah manual)</small><div class=chips>${[['mudah','Mudah'],['menengah','Menengah'],['sulit','Sulit'],['expert','Expert']].map(z=>`<button class=chip data-a=ggxvpre data-v=${z[0]}>${z[1]}</button>`).join('')}</div>`+
  ch('vp','Jumlah petunjuk kosakata',[[0,'Tanpa clue'],['one','Satu saja'],[25,'25%'],[50,'50%'],[75,'75%'],[100,'Semua']])+num('vp','…atau persentase bebas (0–100)',0)+
  ch('vpl','Penempatan petunjuk kosakata',[['in','Inline'],['se','Separate'],['mx','Mixed']])+(o.vpl=='mx'?ch('vin','Proporsi inline (mixed)',[[25,'25%'],[50,'50%'],[75,'75%'],[100,'100%']])+num('vin','…atau persentase inline bebas',0):'')+
  ch('gh','Petunjuk grammar',[['1','Aktif'],['0','Nonaktif']])+
  ch('shp','Petunjuk struktur kalimat (selalu aktif; persentase segmen berlabel)',[[25,'25%'],[50,'50%'],[75,'75%'],[100,'100%']])+num('shp','…atau persentase bebas (1–100)',1)+
  ch('thr','Ambang lulus',[[65,'Longgar'],[75,'Sedang'],[85,'Ketat']])+
  `<small>Jumlah clue dipilih dulu (utamakan kosakata yang lemah), baru dibagi inline/separate. Bantuan yang dipakai dicatat di statistik.</small>`}
const scLvOf=c=>c.lv;
VGLG.forEach(l=>{VG['scl_'+l]={lg:l,pre:'sc|'+l+'|',modes:SCM,noDir:true,extra:scExtra,lvl:(SCLV[l]||SCLV.def).filter(z=>scParse(l).some(x=>x.lv==z)),
 def:{n:6,r:200,modes:['a','b','c'],dir:'B',inp:'v',vp:50,vpl:'mx',vin:50,gh:'1',shp:100,thr:75},
 empty:()=>'Tidak ada kalimat untuk pilihan ini. Ubah level atau panjang kalimat.',
 preset:(g,id)=>{const o=GXO(g);Object.assign(o,SCPRE[id]||{})},
 cells:o=>scParse(l).filter(z=>(o.modes||[]).includes(z.md)).map(z=>({k:z.k,l,lv:z.lv})),make:c=>scMake(c)};
 GXL.push({id:'scl_'+l,ic:'💬',t:'Speaking Cloze — '+VGLN[l],d:'Terjemahkan kalimat Indonesia ke '+VGLN[l]+' secara lisan dengan kerangka segmen. Clue kosakata & struktur berpersen, petunjuk grammar, bantuan bertahap. Skor kosakata · grammar · struktur · kelengkapan (bukan pelafalan).',tag:l.toUpperCase(),lg:l})});
