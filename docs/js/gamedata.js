/* ===== Data gim Tebak Penggolong Mandarin (量词) — v7.20.0 =====
   ZCL: penggolong → [pinyin, arti/pakai]. ZCN: kata benda → "hanzi|pinyin|arti Indonesia|penggolong benar dipisah /|kategori|catatan(opsional)"
   Kategori: p orang · a hewan · o benda · d minuman · f makanan · e hal/abstrak · l tempat/bangunan
   Catatan: jawaban benar = bentuk baku + bentuk lisan yang sangat umum. */
const ZCL={'个':['gè','penggolong umum: orang & banyak benda'],'口':['kǒu','anggota keluarga; juga mulut, sumur, benda berongga'],'位':['wèi','orang (sopan)'],'名':['míng','orang dengan profesi/status'],'杯':['bēi','gelas/cangkir isi'],'瓶':['píng','botol isi'],'碗':['wǎn','mangkuk isi'],'盘':['pán','piring isi / hidangan'],'壶':['hú','teko/poci isi'],'本':['běn','buku, majalah, benda berjilid'],'张':['zhāng','benda pipih/lebar: kertas, meja, ranjang, tiket'],'条':['tiáo','benda panjang lentur: sungai, jalan, celana, ikan'],'根':['gēn','benda panjang kaku/ramping: tali, pisang, tiang'],'支':['zhī','benda batang tipis: pena, pensil, lilin'],'枝':['zhī','batang/cabang: bunga, pena'],'只':['zhī','hewan kecil; satu dari sepasang; jam tangan'],'头':['tóu','hewan besar: sapi, babi, gajah'],'匹':['pǐ','kuda & kain gulungan'],'件':['jiàn','pakaian atas, barang, urusan'],'双':['shuāng','pasangan: sepatu, kaus kaki, sumpit'],'副':['fù','set: kacamata, sarung tangan, kartu'],'把':['bǎ','benda bergagang: kursi, payung, pisau, kunci'],'辆':['liàng','kendaraan beroda'],'架':['jià','pesawat, piano, kamera'],'艘':['sōu','kapal besar'],'列':['liè','kereta (rangkaian), barisan'],'台':['tái','mesin/elektronik: komputer, TV, kulkas'],'部':['bù','film, novel, ponsel, mobil (formal)'],'家':['jiā','keluarga, toko, perusahaan, restoran'],'间':['jiān','ruangan, kamar'],'所':['suǒ','sekolah, rumah sakit, bangunan'],'座':['zuò','benda besar tak bergerak: gunung, jembatan, menara'],'套':['tào','satu set: perabot, rumah/apartemen'],'封':['fēng','surat, e-mail'],'首':['shǒu','lagu, puisi'],'篇':['piān','artikel, karangan'],'幅':['fú','lukisan, gambar'],'句':['jù','kalimat/ucapan'],'棵':['kē','tanaman/pohon'],'朵':['duǒ','bunga, awan'],'束':['shù','seikat'],'颗':['kē','benda kecil bulat: permen, bintang, hati'],'粒':['lì','butiran: nasi, pil'],'块':['kuài','potongan/gumpalan: kue, sabun, uang, jam tangan'],'片':['piàn','irisan/lembar tipis: roti, obat, awan'],'滴':['dī','tetes'],'份':['fèn','porsi, koran, pekerjaan, hadiah'],'枚':['méi','benda kecil bernilai: koin, cincin, prangko'],'顶':['dǐng','topi, kelambu'],'扇':['shàn','pintu, jendela'],'盏':['zhǎn','lampu'],'面':['miàn','cermin, bendera, tembok'],'道':['dào','hidangan, soal ujian, garis'],'种':['zhǒng','jenis/macam'],'场':['chǎng','kejadian: hujan, pertandingan, film, ujian'],'次':['cì','kali (frekuensi)'],'遍':['biàn','kali (dari awal sampai akhir)'],'趟':['tàng','kali pergi-pulang'],'顿':['dùn','kali makan/dimarahi'],'下':['xià','sekali (tindakan singkat)'],'会儿':['huìr','sebentar'],'节':['jié','jam pelajaran, ruas'],'堂':['táng','sesi kelas'],'幢':['zhuàng','gedung'],'位置':['','']};
delete ZCL['位置'];
const ZCN=[
/* orang */
'人|rén|orang|个/位/口|p|口 dipakai menghitung anggota keluarga (我家有四口人); 位 lebih sopan',
'学生|xuésheng|murid|个/名|p','老师|lǎoshī|guru|个/位/名|p','医生|yīshēng|dokter|个/位/名|p','朋友|péngyou|teman|个/位|p',
'孩子|háizi|anak|个|p','男孩|nánhái|anak laki-laki|个|p','女孩|nǚhái|anak perempuan|个|p','客人|kèrén|tamu|个/位|p',
'同事|tóngshì|rekan kerja|个/位|p','律师|lǜshī|pengacara|个/位/名|p','警察|jǐngchá|polisi|个/名/位|p','记者|jìzhě|wartawan|个/位/名|p',
'工人|gōngrén|pekerja|个/名/位|p','先生|xiānsheng|tuan|位|p','女士|nǚshì|nyonya|位|p','老人|lǎorén|orang tua|个/位|p',
'姐姐|jiějie|kakak perempuan|个|p','弟弟|dìdi|adik laki-laki|个|p',
/* hewan */
'猫|māo|kucing|只|a','狗|gǒu|anjing|只/条|a','鸟|niǎo|burung|只|a','鱼|yú|ikan|条|a','马|mǎ|kuda|匹|a','牛|niú|sapi|头|a','猪|zhū|babi|头|a',
'羊|yáng|kambing|只/头|a','老虎|lǎohǔ|harimau|只|a','大象|dàxiàng|gajah|头|a','鸡|jī|ayam|只|a','鸭子|yāzi|bebek|只|a','兔子|tùzi|kelinci|只|a',
'蛇|shé|ular|条|a','蚊子|wénzi|nyamuk|只|a','熊猫|xióngmāo|panda|只|a',
/* benda */
'书|shū|buku|本|o','杂志|zázhì|majalah|本|o','词典|cídiǎn|kamus|本|o','笔记本|bǐjìběn|buku catatan|本|o','纸|zhǐ|kertas|张|o','照片|zhàopiàn|foto|张|o',
'桌子|zhuōzi|meja|张|o','床|chuáng|ranjang|张|o','票|piào|tiket|张|o','地图|dìtú|peta|张|o','椅子|yǐzi|kursi|把|o','伞|sǎn|payung|把|o',
'刀|dāo|pisau|把|o','钥匙|yàoshi|kunci|把|o','牙刷|yáshuā|sikat gigi|把|o','梳子|shūzi|sisir|把|o','剪刀|jiǎndāo|gunting|把|o',
'裤子|kùzi|celana|条|o','裙子|qúnzi|rok|条|o','毛巾|máojīn|handuk|条|o','河|hé|sungai|条|o','路|lù|jalan|条|o','衬衫|chènshān|kemeja|件|o',
'衣服|yīfu|baju|件|o','大衣|dàyī|mantel|件|o','行李|xíngli|bagasi|件|o','鞋|xié|sepatu|双|o','袜子|wàzi|kaus kaki|双|o','筷子|kuàizi|sumpit|双|o',
'手套|shǒutào|sarung tangan|双/副|o','眼镜|yǎnjìng|kacamata|副|o','手机|shǒujī|ponsel|部/个|o','电脑|diànnǎo|komputer|台|o','电视|diànshì|televisi|台|o',
'冰箱|bīngxiāng|kulkas|台|o','洗衣机|xǐyījī|mesin cuci|台|o','电影|diànyǐng|film|部/场|o','小说|xiǎoshuō|novel|本/部|o','汽车|qìchē|mobil|辆|o',
'自行车|zìxíngchē|sepeda|辆|o','公共汽车|gōnggòng qìchē|bus|辆|o','飞机|fēijī|pesawat|架|o','船|chuán|kapal|条/艘|o','火车|huǒchē|kereta|列|o',
'杯子|bēizi|gelas|个|o','苹果|píngguǒ|apel|个|f','香蕉|xiāngjiāo|pisang|根|f','橘子|júzi|jeruk|个|f','西瓜|xīguā|semangka|个|f','鸡蛋|jīdàn|telur|个|f',
'包子|bāozi|bakpao|个|f','饺子|jiǎozi|pangsit|个|f','面包|miànbāo|roti|个/块/片|f','蛋糕|dàngāo|kue|块/个|f','巧克力|qiǎokèlì|cokelat|块|f','糖|táng|permen|颗/块|f',
'花|huā|bunga|朵/束|o','树|shù|pohon|棵|o','蜡烛|làzhú|lilin|支/根|o','铅笔|qiānbǐ|pensil|支/枝|o','钢笔|gāngbǐ|pulpen|支/枝|o','信|xìn|surat|封|o',
'电子邮件|diànzǐ yóujiàn|e-mail|封|o','歌|gē|lagu|首|o','诗|shī|puisi|首|o','文章|wénzhāng|artikel|篇|o','作文|zuòwén|karangan|篇|o','画|huà|lukisan|幅/张|o',
'窗户|chuānghu|jendela|扇|o','门|mén|pintu|扇|o','灯|dēng|lampu|盏|o','镜子|jìngzi|cermin|面|o','旗|qí|bendera|面|o','帽子|màozi|topi|顶|o',
'手表|shǒubiǎo|jam tangan|块/只|o','戒指|jièzhi|cincin|枚/个|o','硬币|yìngbì|koin|枚|o','邮票|yóupiào|prangko|枚/张|o','包|bāo|tas|个|o','书包|shūbāo|tas sekolah|个|o',
'沙发|shāfā|sofa|张|o','星星|xīngxing|bintang|颗|o','眼泪|yǎnlèi|air mata|滴/颗|o','云|yún|awan|朵|o','药|yào|obat (pil)|片/粒|o','报纸|bàozhǐ|koran|份/张|o',
/* minuman & hidangan */
'茶|chá|teh|杯/壶|d','咖啡|kāfēi|kopi|杯|d','水|shuǐ|air|杯/瓶|d','牛奶|niúnǎi|susu|杯/瓶|d','啤酒|píjiǔ|bir|杯/瓶|d','果汁|guǒzhī|jus|杯/瓶|d',
'饭|fàn|nasi|碗|f','汤|tāng|sup|碗|f','面条|miàntiáo|mi|碗|f','粥|zhōu|bubur|碗|f','菜|cài|hidangan|道/盘|f',
/* tempat */
'房子|fángzi|rumah|座/套/所|l','房间|fángjiān|kamar|间/个|l','教室|jiàoshì|ruang kelas|间|l','厨房|chúfáng|dapur|间/个|l','商店|shāngdiàn|toko|家|l','饭馆|fànguǎn|restoran|家|l',
'银行|yínháng|bank|家|l','公司|gōngsī|perusahaan|家|l','学校|xuéxiào|sekolah|所/个|l','医院|yīyuàn|rumah sakit|家/所|l','山|shān|gunung|座|l','桥|qiáo|jembatan|座|l',
'城市|chéngshì|kota|座/个|l','塔|tǎ|menara|座|l',
/* hal abstrak / kejadian */
'问题|wèntí|pertanyaan|个|e','办法|bànfǎ|cara|个/种|e','主意|zhǔyi|ide|个|e','计划|jìhuà|rencana|个|e','故事|gùshi|cerita|个|e','梦|mèng|mimpi|个/场|e',
'会议|huìyì|rapat|个/场|e','考试|kǎoshì|ujian|场/次|e','比赛|bǐsài|pertandingan|场|e','雨|yǔ|hujan|场|w','雪|xuě|salju|场|w','音乐会|yīnyuèhuì|konser|场/个|e',
'工作|gōngzuò|pekerjaan|份/个|e','礼物|lǐwù|hadiah|份/个|e','课|kè|pelajaran|节/堂|e','词|cí|kata|个|e','汉字|hànzì|aksara Han|个|e','句子|jùzi|kalimat|个|e','话|huà|ucapan|句|e'];
/* bingkai kalimat: [awalan hanzi, awalan pinyin, akhiran hanzi, akhiran pinyin, terjemahan dgn {n}, kategori yang cocok ('*' = semua)] */
const ZCF=[
['一','yī','','','satu ___ {n}','*'],['两','liǎng','','','dua ___ {n}','*'],['三','sān','','','tiga ___ {n}','*'],['五','wǔ','','','lima ___ {n}','*'],
['这','zhè','','','___ {n} ini','*'],['那','nà','','','___ {n} itu','*'],['每','měi','','','setiap ___ {n}','*'],['几','jǐ','？','?','berapa ___ {n}?','*'],
['我有一','wǒ yǒu yì','。','.','Saya punya satu ___ {n}.','poeafl'],['我有三','wǒ yǒu sān','。','.','Saya punya tiga ___ {n}.','poeafl'],
['我想买一','wǒ xiǎng mǎi yì','。','.','Saya ingin membeli satu ___ {n}.','ofd'],['桌子上有两','zhuōzi shang yǒu liǎng','。','.','Di atas meja ada dua ___ {n}.','of'],
['我认识三','wǒ rènshi sān','。','.','Saya kenal tiga ___ {n}.','p'],['你家有几','nǐ jiā yǒu jǐ','？','?','Di rumahmu ada berapa ___ {n}?','p'],
['公园里有五','gōngyuán lǐ yǒu wǔ','。','.','Di taman ada lima ___ {n}.','pa'],['她喝了一','tā hē le yì','。','.','Dia minum satu ___ {n}.','d'],
['他吃了两','tā chī le liǎng','。','.','Dia makan dua ___ {n}.','f'],['我看见了一','wǒ kànjiàn le yì','。','.','Saya melihat satu ___ {n}.','aol'],
['我们要两','wǒmen yào liǎng','。','.','Kami mau dua ___ {n}.','dfo'],['我今天有三','wǒ jīntiān yǒu sān','。','.','Hari ini saya punya tiga ___ {n}.','e'],
['这是一','zhè shì yí','。','.','Ini satu ___ {n}.','opaldf'],['他买了一','tā mǎi le yì','。','.','Dia membeli satu ___ {n}.','of']];
/* soal penggolong verbal (tindakan): [hanzi dengan ___, pinyin dengan ___, terjemahan, [benar], catatan] */
const ZCV=[
['我去过北京两___。','wǒ qù guo Běijīng liǎng ___.','Saya pernah ke Beijing dua kali.',['次','趟'],'次 = kali umum; 趟 = pergi-pulang'],
['请你再说一___。','qǐng nǐ zài shuō yí ___.','Tolong katakan sekali lagi (dari awal sampai habis).',['遍','次'],'遍 menekankan dari awal sampai akhir'],
['这本书我看了三___。','zhè běn shū wǒ kàn le sān ___.','Buku ini sudah saya baca tiga kali.',['遍','次'],''],
['我一天吃三___饭。','wǒ yì tiān chī sān ___ fàn.','Sehari saya makan tiga kali.',['顿'],'顿 khusus untuk makan'],
['昨天下了一___大雨。','zuótiān xià le yì ___ dàyǔ.','Kemarin turun hujan deras.',['场'],'场 untuk hujan, pertandingan, ujian'],
['我们看了一___电影。','wǒmen kàn le yì ___ diànyǐng.','Kami menonton sebuah film.',['场','部'],'场 = satu kali pemutaran; 部 = film sebagai karya'],
['他踢了一___足球。','tā tī le yì ___ zúqiú.','Dia bermain satu pertandingan sepak bola.',['场'],''],
['请等一___。','qǐng děng yí ___.','Tolong tunggu sebentar.',['下','会儿'],'下 = sekali singkat; 会儿 = sebentar'],
['他生了一___病。','tā shēng le yì ___ bìng.','Dia jatuh sakit (sekali).',['场'],'生了一场病'],
['你再看一___吧。','nǐ zài kàn yí ___ ba.','Coba lihat sekali lagi.',['下','遍','次'],'下/遍/次 sama-sama dapat dipakai'],
['我们明天有两___课。','wǒmen míngtiān yǒu liǎng ___ kè.','Besok kami ada dua jam pelajaran.',['节','堂'],''],
['他每个星期去一___超市。','tā měi ge xīngqī qù yí ___ chāoshì.','Tiap minggu dia ke supermarket sekali.',['次','趟'],''],
['这个词我写了五___。','zhè ge cí wǒ xiě le wǔ ___.','Kata ini sudah saya tulis lima kali.',['遍','次'],''],
['她笑了一___。','tā xiào le yí ___.','Dia tersenyum sebentar.',['下','声'],'下 = sekali; 声 = suara'],
['我一年回家两___。','wǒ yì nián huí jiā liǎng ___.','Setahun saya pulang dua kali.',['次','趟'],''],
['我们开了一___会。','wǒmen kāi le yí ___ huì.','Kami mengadakan satu kali rapat.',['次','个','场'],'开一次会 (paling lazim)']];
ZCL['声']=['shēng','suara/bunyi (sekali)'];
