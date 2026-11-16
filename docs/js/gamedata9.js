/* ===== Game Kasus Jerman (ks) v7.79 — mesin GXX (games2.js) =====
   Jenis soal: pr Präposition→kasus · id kasus frasa bergaris · qw kata tanya · vb verba→kasus objek · vp verba+preposisi · vc kasus setelah verba+preposisi · wp Wechselpräposition (Wo?/Wohin?)
   Level A1–C1 (o.lvs). SRS: kunci 'ks|<mode>|<id>'. */
const KSM={pr:'Preposisi → kasus',id:'Kasus frasa bergaris',qw:'Kata tanya (wer/wen/wem/wessen)',vb:'Verba → kasus objek',vp:'Verba + preposisi',vc:'Kasus setelah verba + preposisi',wp:'Wechselpräposition (Wo? / Wohin?)',pa:'Preposisi + artikel',ar:'Artikel menurut kasus'};
const KSC={N:'Nominativ',A:'Akkusativ',D:'Dativ',G:'Genitiv',W:'Wechsel (Akk. / Dat.)',AD:'Akkusativ + Dativ',AG:'Akkusativ + Genitiv'};
const KSQ={N:'Wer? / Was?',A:'Wen? / Was?',D:'Wem?',G:'Wessen?'};
/* preposisi: prep|kasus|level|contoh|arti */
const KSP=`mit|D|A1|Ich fahre mit dem Bus.|Aku naik bus.
bei|D|A1|Sie wohnt bei ihren Eltern.|Dia tinggal bersama orang tuanya.
nach|D|A1|Nach dem Essen gehen wir spazieren.|Setelah makan kami jalan-jalan.
von|D|A1|Das Geschenk ist von meiner Oma.|Hadiah itu dari nenekku.
zu|D|A1|Ich gehe zu meinem Freund.|Aku pergi ke rumah temanku.
aus|D|A1|Er kommt aus der Schweiz.|Dia berasal dari Swiss.
seit|D|A2|Seit einem Jahr lerne ich Deutsch.|Sejak setahun aku belajar bahasa Jerman.
gegenüber|D|B1|Das Café liegt gegenüber dem Bahnhof.|Kafe itu berseberangan dengan stasiun.
ab|D|B1|Ab nächstem Monat arbeite ich hier.|Mulai bulan depan aku bekerja di sini.
außer|D|B1|Alle außer meinem Bruder sind da.|Semua hadir kecuali kakakku.
entgegen|D|C1|Entgegen dem Rat der Ärzte reiste er ab.|Bertentangan dengan saran dokter, dia berangkat.
gemäß|D|C1|Gemäß dem Vertrag zahlt er monatlich.|Menurut kontrak, dia membayar tiap bulan.
durch|A|A1|Wir gehen durch den Park.|Kami berjalan melewati taman.
für|A|A1|Das Geschenk ist für meine Mutter.|Hadiah ini untuk ibuku.
ohne|A|A1|Er kommt ohne seinen Bruder.|Dia datang tanpa kakaknya.
gegen|A|A2|Ich bin gegen diesen Plan.|Aku menentang rencana ini.
um|A|A2|Wir sitzen um den Tisch.|Kami duduk mengelilingi meja.
bis|A|B1|Ich warte bis nächsten Montag.|Aku menunggu sampai Senin depan.
pro|A|B2|Er verdient zehn Euro pro Stunde.|Dia mendapat sepuluh euro per jam.
an|W|A2|Das Bild hängt an der Wand.|Gambar itu tergantung di dinding.
auf|W|A2|Das Buch liegt auf dem Tisch.|Buku itu ada di atas meja.
hinter|W|A2|Der Ball liegt hinter dem Haus.|Bola itu ada di belakang rumah.
in|W|A1|Wir sind in der Küche.|Kami ada di dapur.
neben|W|A2|Die Tasche steht neben dem Sofa.|Tas itu ada di samping sofa.
über|W|A2|Die Lampe hängt über dem Tisch.|Lampu tergantung di atas meja.
unter|W|A2|Die Katze schläft unter dem Bett.|Kucing tidur di bawah tempat tidur.
vor|W|A2|Das Auto steht vor dem Haus.|Mobil itu di depan rumah.
zwischen|W|B1|Der Tisch steht zwischen dem Sofa und dem Fenster.|Meja ada di antara sofa dan jendela.
wegen|G|B1|Wegen des Wetters bleiben wir zu Hause.|Karena cuaca kami tinggal di rumah.
trotz|G|B1|Trotz des Regens gehen wir spazieren.|Meskipun hujan kami jalan-jalan.
während|G|B1|Während der Ferien fahren wir ans Meer.|Selama liburan kami pergi ke laut.
statt|G|B1|Statt eines Autos kauft er ein Fahrrad.|Alih-alih mobil, dia membeli sepeda.
außerhalb|G|B2|Außerhalb der Stadt gibt es viele Felder.|Di luar kota ada banyak ladang.
innerhalb|G|B2|Innerhalb einer Woche ist alles fertig.|Dalam seminggu semuanya selesai.
aufgrund|G|B2|Aufgrund des Streiks fällt der Zug aus.|Karena pemogokan, kereta dibatalkan.
anlässlich|G|C1|Anlässlich des Jubiläums gibt es ein Fest.|Dalam rangka hari jadi ada pesta.`;
/* frasa bergaris: kalimat dgn [frasa]|kasus|peran|level|arti */
const KSI=`[Der Hund] schläft im Garten.|N|Subjek|A1|Anjing itu tidur di kebun.
Heute kommt [meine Schwester] zu Besuch.|N|Subjek|A1|Hari ini saudariku datang berkunjung.
[Die Kinder] spielen im Park.|N|Subjek|A1|Anak-anak bermain di taman.
Mein Bruder ist [ein guter Lehrer].|N|Pelengkap subjek (setelah sein)|A2|Kakakku adalah guru yang baik.
Gestern hat [der neue Kollege] angerufen.|N|Subjek|A2|Kemarin kolega baru menelepon.
Morgen beginnt [der Kurs] um acht Uhr.|N|Subjek|A2|Besok kursus mulai pukul delapan.
Er wird [ein berühmter Arzt].|N|Pelengkap subjek (setelah werden)|B1|Dia akan menjadi dokter terkenal.
Sie bleibt [eine gute Freundin].|N|Pelengkap subjek (setelah bleiben)|B1|Dia tetap menjadi teman baik.
Ich sehe [den Mann] auf der Straße.|A|Objek langsung|A1|Aku melihat pria itu di jalan.
Wir kaufen [einen neuen Tisch].|A|Objek langsung|A1|Kami membeli meja baru.
Hast du [meine Tasche] gesehen?|A|Objek langsung|A1|Apakah kamu melihat tasku?
Sie liebt [ihren kleinen Bruder].|A|Objek langsung|A1|Dia menyayangi adik laki-lakinya.
Ich besuche [meine Großeltern] jeden Sonntag.|A|Objek langsung|A1|Aku mengunjungi kakek-nenekku tiap Minggu.
Ich habe [einen Hund] und eine Katze.|A|Objek langsung|A1|Aku punya anjing dan kucing.
Wir treffen [unsere Freunde] im Café.|A|Objek langsung|A1|Kami bertemu teman-teman di kafe.
Ich möchte [ein Glas Wasser].|A|Objek langsung|A1|Aku mau segelas air.
Sie hat [keinen Hunger].|A|Objek langsung (haben + Akkusativ)|A1|Dia tidak lapar.
Der Lehrer fragt [den Schüler].|A|Objek langsung (fragen + Akkusativ)|A2|Guru bertanya kepada murid itu.
Der Lehrer lobt [die Schülerin].|A|Objek langsung|A2|Guru memuji murid perempuan itu.
Es gibt [einen Supermarkt] in der Nähe.|A|Objek (es gibt + Akkusativ)|A2|Ada supermarket di dekat sini.
Jeden [Morgen] trinke ich Kaffee.|A|Keterangan waktu (Akkusativ)|A2|Setiap pagi aku minum kopi.
Er wartet auf [den Bus].|A|Setelah preposisi auf (warten auf + Akkusativ)|A2|Dia menunggu bus.
Wir gehen durch [den Park].|A|Setelah preposisi durch|A1|Kami berjalan melewati taman.
Das Geschenk ist für [meine Mutter].|A|Setelah preposisi für|A1|Hadiah ini untuk ibuku.
Er kommt ohne [seinen Bruder].|A|Setelah preposisi ohne|A1|Dia datang tanpa kakaknya.
Wir fahren in [die Stadt].|A|Setelah preposisi in (arah: wohin? → Akkusativ)|A2|Kami pergi ke kota.
Er legt das Buch auf [den Tisch].|A|Setelah preposisi auf (arah: wohin? → Akkusativ)|A2|Dia meletakkan buku di atas meja.
Ich denke oft an [meine Familie].|A|Setelah preposisi an (denken an + Akkusativ)|A2|Aku sering memikirkan keluargaku.
Wir freuen uns auf [das Wochenende].|A|Setelah preposisi auf (sich freuen auf + Akkusativ)|A2|Kami menantikan akhir pekan.
Er erinnert sich an [den Urlaub].|A|Setelah preposisi an (sich erinnern an + Akkusativ)|B1|Dia teringat liburan itu.
Ich helfe [meinem Vater] im Garten.|D|Objek (helfen + Dativ)|A2|Aku membantu ayahku di kebun.
Das Buch gehört [dem Lehrer].|D|Objek (gehören + Dativ)|A2|Buku itu milik guru.
Ich danke [der Frau] für die Hilfe.|D|Objek (danken + Dativ)|A2|Aku berterima kasih kepada ibu itu atas bantuannya.
Er gibt [dem Kind] einen Apfel.|D|Objek tak langsung (penerima)|A1|Dia memberi anak itu sebuah apel.
Ich schenke [meiner Mutter] Blumen.|D|Objek tak langsung (penerima)|A1|Aku memberi ibuku bunga.
Der Lehrer erklärt [den Schülern] die Regel.|D|Objek tak langsung (penerima)|A2|Guru menjelaskan aturan itu kepada para murid.
Sie zeigt [ihrem Freund] das Foto.|D|Objek tak langsung (penerima)|A2|Dia menunjukkan foto itu kepada temannya.
Er antwortet [dem Chef] sofort.|D|Objek (antworten + Dativ)|A2|Dia langsung menjawab atasannya.
Die Jacke gefällt [meiner Schwester].|D|Objek (gefallen + Dativ)|A2|Jaket itu disukai saudariku.
Der Film hat [den Kindern] gut gefallen.|D|Objek (gefallen + Dativ)|B1|Film itu disukai anak-anak.
Ich vertraue [dir].|D|Objek (vertrauen + Dativ)|B1|Aku percaya padamu.
Ich folge [dem Weg].|D|Objek (folgen + Dativ)|B1|Aku mengikuti jalan itu.
Wir fahren mit [dem Zug].|D|Setelah preposisi mit|A1|Kami naik kereta.
Sie wohnt bei [ihren Eltern].|D|Setelah preposisi bei|A1|Dia tinggal bersama orang tuanya.
Nach [dem Essen] gehen wir spazieren.|D|Setelah preposisi nach|A1|Setelah makan kami jalan-jalan.
Er kommt aus [der Schweiz].|D|Setelah preposisi aus|A1|Dia berasal dari Swiss.
Ich gehe zu [meinem Arzt].|D|Setelah preposisi zu|A1|Aku pergi ke dokterku.
Das Kind spielt mit [dem Ball].|D|Setelah preposisi mit|A1|Anak itu bermain bola.
Seit [einem Jahr] lerne ich Deutsch.|D|Setelah preposisi seit|A2|Sejak setahun aku belajar bahasa Jerman.
Die Katze schläft auf [dem Sofa].|D|Setelah preposisi auf (lokasi: wo? → Dativ)|A2|Kucing tidur di atas sofa.
Wir sitzen in [der Küche].|D|Setelah preposisi in (lokasi: wo? → Dativ)|A2|Kami duduk di dapur.
Das Haus liegt gegenüber [dem Bahnhof].|D|Setelah preposisi gegenüber|B1|Rumah itu berseberangan dengan stasiun.
Er träumt von [einem neuen Auto].|D|Setelah preposisi von (träumen von + Dativ)|B1|Dia bermimpi tentang mobil baru.
Das ist das Auto [meines Vaters].|G|Atribut kepemilikan (genitif)|A2|Itu mobil ayahku.
Die Tasche [der Lehrerin] liegt hier.|G|Atribut kepemilikan (genitif)|A2|Tas guru perempuan itu ada di sini.
Der Name [des Mädchens] ist Anna.|G|Atribut kepemilikan (genitif)|B1|Nama gadis itu Anna.
Das ist der Hund [meiner Nachbarn].|G|Atribut kepemilikan (genitif)|B1|Itu anjing para tetanggaku.
Die Farbe [des Hauses] ist weiß.|G|Atribut kepemilikan (genitif)|B1|Warna rumah itu putih.
Am Ende [des Films] weinen alle.|G|Atribut kepemilikan (genitif)|B1|Di akhir film semua menangis.
Wegen [des Wetters] bleiben wir zu Hause.|G|Setelah preposisi wegen|B1|Karena cuaca kami tinggal di rumah.
Trotz [des Regens] gehen wir spazieren.|G|Setelah preposisi trotz|B1|Meskipun hujan kami jalan-jalan.
Während [der Ferien] fahren wir ans Meer.|G|Setelah preposisi während|B1|Selama liburan kami pergi ke laut.
Statt [eines Autos] kauft er ein Fahrrad.|G|Setelah preposisi statt|B1|Alih-alih mobil, dia membeli sepeda.
Außerhalb [der Stadt] gibt es viele Felder.|G|Setelah preposisi außerhalb|B2|Di luar kota ada banyak ladang.
[Der Lehrer] erklärt die Aufgabe.|N|Subjek|A1|Guru menjelaskan tugas itu.
Gestern hat [meine Mutter] Kuchen gebacken.|N|Subjek|A1|Kemarin ibuku membuat kue.
Er wird [Lehrer].|N|Pelengkap subjek (setelah werden)|B1|Dia menjadi guru.
Ich suche [meinen Schlüssel].|A|Objek langsung|A1|Aku mencari kunciku.
Sie trägt [einen roten Mantel].|A|Objek langsung|A2|Dia memakai mantel merah.
Wir besuchen [die Ausstellung] am Samstag.|A|Objek langsung|A2|Kami mengunjungi pameran itu hari Sabtu.
Wir gehen ohne [unseren Hund] spazieren.|A|Setelah preposisi ohne|A2|Kami jalan-jalan tanpa anjing kami.
Sie stellt die Vase auf [den Tisch].|A|Setelah preposisi auf (arah: wohin? → Akkusativ)|A2|Dia menaruh vas di atas meja.
Er schreibt [seiner Tante] eine Karte.|D|Objek tak langsung (penerima)|A2|Dia menulis kartu untuk bibinya.
Der Arzt hilft [dem Patienten].|D|Objek (helfen + Dativ)|A2|Dokter menolong pasien itu.
Ich wohne bei [meinem Onkel].|D|Setelah preposisi bei|A1|Aku tinggal bersama pamanku.
Sie kommt von [der Arbeit].|D|Setelah preposisi von|A1|Dia datang dari kerja.
Das Kind spielt hinter [dem Haus].|D|Setelah preposisi hinter (lokasi: wo? → Dativ)|A2|Anak itu bermain di belakang rumah.
Das ist die Meinung [des Chefs].|G|Atribut kepemilikan (genitif)|B1|Itu pendapat atasan.
Der Anfang [der Geschichte] ist spannend.|G|Atribut kepemilikan (genitif)|B1|Awal ceritanya menegangkan.
Innerhalb [einer Woche] ist alles fertig.|G|Setelah preposisi innerhalb|B2|Dalam seminggu semuanya beres.`;
/* verba → kasus objek: verba|kasus|level|contoh|arti */
const KSV=`kaufen|A|A1|Ich kaufe einen Apfel.|Aku membeli sebuah apel.
besuchen|A|A1|Wir besuchen unsere Oma.|Kami mengunjungi nenek kami.
brauchen|A|A1|Ich brauche einen Stift.|Aku butuh sebuah pena.
fragen|A|A2|Er fragt den Lehrer.|Dia bertanya kepada guru.
anrufen|A|A2|Ich rufe meinen Freund an.|Aku menelepon temanku.
treffen|A|A2|Wir treffen den Chef.|Kami bertemu atasan.
loben|A|A2|Sie lobt den Schüler.|Dia memuji murid itu.
vermissen|A|B1|Ich vermisse meine Familie.|Aku merindukan keluargaku.
unterstützen|A|B1|Wir unterstützen das Projekt.|Kami mendukung proyek itu.
helfen|D|A2|Ich helfe meiner Mutter.|Aku membantu ibuku.
danken|D|A2|Er dankt dem Arzt.|Dia berterima kasih kepada dokter.
gefallen|D|A2|Das Kleid gefällt mir.|Gaun itu kusukai.
gehören|D|A2|Das Auto gehört meinem Vater.|Mobil itu milik ayahku.
antworten|D|A2|Sie antwortet dem Kunden.|Dia menjawab pelanggan.
gratulieren|D|A2|Wir gratulieren dir.|Kami mengucapkan selamat padamu.
passen|D|A2|Die Hose passt ihm.|Celana itu cocok untuknya.
schmecken|D|A2|Die Suppe schmeckt mir.|Sup itu enak bagiku.
fehlen|D|A2|Du fehlst mir.|Aku merindukanmu.
zuhören|D|A2|Hör mir bitte zu.|Tolong dengarkan aku.
leidtun|D|A2|Es tut mir leid.|Aku menyesal.
folgen|D|B1|Der Hund folgt dem Kind.|Anjing itu mengikuti anak itu.
glauben|D|B1|Ich glaube dir.|Aku percaya padamu.
vertrauen|D|B1|Sie vertraut ihrem Freund.|Dia percaya pada temannya.
begegnen|D|B1|Ich begegne dem Nachbarn.|Aku berpapasan dengan tetangga.
raten|D|B1|Ich rate dir zu warten.|Aku menyarankanmu menunggu.
widersprechen|D|B1|Er widerspricht dem Chef.|Dia membantah atasan.
zustimmen|D|B1|Ich stimme dir zu.|Aku setuju denganmu.
schaden|D|B1|Rauchen schadet der Gesundheit.|Merokok merusak kesehatan.
nützen|D|B1|Das nützt mir nichts.|Itu tidak berguna bagiku.
gelingen|D|B2|Das Experiment gelingt ihm.|Eksperimen itu berhasil baginya.
einfallen|D|B2|Mir fällt nichts ein.|Aku tak punya ide.
gehorchen|D|B2|Der Hund gehorcht seinem Herrn.|Anjing itu menurut pada tuannya.
imponieren|D|B2|Sein Mut imponiert mir.|Keberaniannya mengesankanku.
geben|AD|A1|Ich gebe dem Kind einen Ball.|Aku memberi anak itu bola.
zeigen|AD|A1|Sie zeigt mir das Zimmer.|Dia menunjukkan kamar itu kepadaku.
schenken|AD|A1|Wir schenken ihr Blumen.|Kami memberinya bunga.
schicken|AD|A2|Er schickt mir eine Nachricht.|Dia mengirimiku pesan.
erklären|AD|A2|Der Lehrer erklärt uns die Regel.|Guru menjelaskan aturan itu kepada kami.
empfehlen|AD|A2|Ich empfehle dir diesen Film.|Aku merekomendasikan film ini padamu.
bringen|AD|A2|Der Kellner bringt uns das Essen.|Pelayan membawakan kami makanan.
schreiben|AD|A2|Ich schreibe dir einen Brief.|Aku menulis surat untukmu.
verkaufen|AD|A2|Er verkauft mir sein Auto.|Dia menjual mobilnya kepadaku.
erzählen|AD|A2|Oma erzählt den Kindern eine Geschichte.|Nenek menceritakan dongeng kepada anak-anak.
leihen|AD|B1|Kannst du mir 10 Euro leihen?|Bisakah kamu meminjamiku 10 euro?
anbieten|AD|B1|Sie bietet uns Tee an.|Dia menawari kami teh.
gedenken|G|C1|Wir gedenken der Opfer.|Kami mengenang para korban.
bedürfen|G|C1|Das bedarf keiner Erklärung.|Itu tak perlu penjelasan.
sich bedienen|G|C2|Er bediente sich eines Tricks.|Dia menggunakan sebuah trik.
anklagen|AG|C1|Man klagt ihn des Diebstahls an.|Dia didakwa mencuri.
beschuldigen|AG|C1|Sie beschuldigen ihn des Betrugs.|Mereka menuduhnya menipu.
verdächtigen|AG|C1|Man verdächtigt ihn des Mordes.|Dia dicurigai melakukan pembunuhan.
lesen|A|A1|Ich lese ein Buch.|Aku membaca buku.
trinken|A|A1|Er trinkt einen Tee.|Dia minum teh.
essen|A|A1|Wir essen einen Kuchen.|Kami makan kue.
öffnen|A|A1|Sie öffnet die Tür.|Dia membuka pintu.
lernen|A|A1|Ich lerne Deutsch.|Aku belajar bahasa Jerman.
einladen|A|A2|Wir laden dich ein.|Kami mengundangmu.
bestellen|A|A2|Er bestellt einen Salat.|Dia memesan salad.
überzeugen|A|B1|Sie überzeugt den Chef.|Dia meyakinkan atasan.
erreichen|A|B1|Wir erreichen den Zug.|Kami sampai/menyusul kereta.
begleiten|A|B1|Ich begleite dich.|Aku menemanimu.
verzeihen|D|B2|Ich verzeihe dir.|Aku memaafkanmu.
sich nähern|D|B2|Der Zug nähert sich dem Bahnhof.|Kereta mendekati stasiun.
ausweichen|D|C1|Er weicht dem Auto aus.|Dia menghindari mobil itu.
entsprechen|D|B2|Das entspricht meinen Wünschen.|Itu sesuai keinginanku.
weh tun|D|A2|Der Kopf tut mir weh.|Kepalaku sakit.
verbieten|AD|B1|Er verbietet den Kindern das Spielen.|Dia melarang anak-anak bermain.
erlauben|AD|B1|Sie erlaubt mir den Besuch.|Dia mengizinkanku berkunjung.
versprechen|AD|B1|Ich verspreche dir meine Hilfe.|Aku berjanji membantumu.
wünschen|AD|A2|Wir wünschen dir viel Glück.|Kami mendoakan kamu beruntung.
vorlesen|AD|B1|Papa liest den Kindern eine Geschichte vor.|Ayah membacakan cerita kepada anak-anak.
mitteilen|AD|B2|Er teilt mir die Nachricht mit.|Dia memberitahuku kabar itu.
sehen|A|A1|Ich sehe einen Vogel.|Aku melihat seekor burung.
hören|A|A1|Wir hören Musik.|Kami mendengar musik.
mögen|A|A1|Ich mag diesen Film.|Aku suka film ini.
nehmen|A|A1|Sie nimmt den Bus.|Dia naik bus.
suchen|A|A1|Er sucht seine Brille.|Dia mencari kacamatanya.
verstehen|A|A2|Ich verstehe dich nicht.|Aku tidak mengerti kamu.
sagen|AD|A1|Ich sage dir die Wahrheit.|Aku mengatakan kebenaran padamu.
dienen|D|B2|Das dient dem Zweck.|Itu melayani tujuan itu.
beistehen|D|B2|Sie steht ihm bei.|Dia mendampinginya.
drohen|D|B2|Er droht dem Nachbarn.|Dia mengancam tetangga itu.
angehören|D|C1|Er gehört einer Partei an.|Dia anggota sebuah partai.`;
/* verba + preposisi: kalimat dgn {prep}|arti|verba+prep|kasus|level */
const KSB=`Ich warte {auf} den Bus.|Aku menunggu bus.|warten auf|A|A2
Er denkt oft {an} seine Familie.|Dia sering memikirkan keluarganya.|denken an|A|A2
Wir freuen uns {auf} die Ferien.|Kami menantikan liburan.|sich freuen auf|A|A2
Ich freue mich {über} das Geschenk.|Aku senang dengan hadiah itu.|sich freuen über|A|A2
Sie interessiert sich {für} Kunst.|Dia tertarik pada seni.|sich interessieren für|A|A2
Wir sprechen {über} das Wetter.|Kami membicarakan cuaca.|sprechen über|A|A2
Sie spricht {mit} ihrer Freundin.|Dia berbicara dengan temannya.|sprechen mit|D|A2
Das Kind hat Angst {vor} dem Hund.|Anak itu takut pada anjing.|Angst haben vor|D|A2
Sie fragt {nach} dem Weg.|Dia menanyakan jalan.|fragen nach|D|A2
Er erzählt {von} seiner Reise.|Dia bercerita tentang perjalanannya.|erzählen von|D|A2
Wir gratulieren dir {zu} deinem Geburtstag.|Kami mengucapkan selamat ulang tahun padamu.|gratulieren zu|D|A2
Das passt {zu} deiner Jacke.|Itu cocok dengan jaketmu.|passen zu|D|A2
Sie unterhält sich {mit} dem Nachbarn.|Dia mengobrol dengan tetangga.|sich unterhalten mit|D|A2
Er ärgert sich {über} den Lärm.|Dia kesal karena kebisingan.|sich ärgern über|A|B1
Er träumt {von} einem neuen Auto.|Dia bermimpi tentang mobil baru.|träumen von|D|B1
Ich nehme {an} dem Kurs teil.|Aku mengikuti kursus itu.|teilnehmen an|D|B1
Ich glaube {an} die Liebe.|Aku percaya pada cinta.|glauben an|A|B1
Wir hoffen {auf} gutes Wetter.|Kami berharap cuaca bagus.|hoffen auf|A|B1
Sie bittet ihn {um} Hilfe.|Dia meminta bantuan darinya.|bitten um|A|B1
Er bewirbt sich {um} eine Stelle.|Dia melamar sebuah posisi.|sich bewerben um|A|B1
Du kannst dich {auf} mich verlassen.|Kamu bisa mengandalkanku.|sich verlassen auf|A|B1
Ich gewöhne mich {an} das Klima.|Aku membiasakan diri dengan iklim.|sich gewöhnen an|A|B1
Er beschäftigt sich {mit} Geschichte.|Dia menekuni sejarah.|sich beschäftigen mit|D|B1
Das hängt {von} dem Wetter ab.|Itu tergantung cuaca.|abhängen von|D|B1
Das Frühstück besteht {aus} Brot und Käse.|Sarapannya terdiri dari roti dan keju.|bestehen aus|D|B1
Wir suchen {nach} einer Lösung.|Kami mencari solusi.|suchen nach|D|B1
Es riecht {nach} frischem Brot.|Baunya seperti roti segar.|riechen nach|D|B1
Sie warnt ihn {vor} dem Hund.|Dia memperingatkannya soal anjing.|warnen vor|D|B1
Ich entschuldige mich {für} den Fehler.|Aku minta maaf atas kesalahan itu.|sich entschuldigen für|A|B1
Sie beschwert sich {über} den Service.|Dia mengeluh soal pelayanan.|sich beschweren über|A|B1
Er erinnert sich {an} seine Kindheit.|Dia mengingat masa kecilnya.|sich erinnern an|A|B1
Ich konzentriere mich {auf} die Arbeit.|Aku berkonsentrasi pada pekerjaan.|sich konzentrieren auf|A|B1
Bitte achte {auf} die Kinder.|Tolong perhatikan anak-anak.|achten auf|A|B1
Er verliebt sich {in} eine Kollegin.|Dia jatuh cinta pada rekan kerja.|sich verlieben in|A|B1
Ich lade dich {zu} meiner Party ein.|Aku mengundangmu ke pestaku.|einladen zu|D|B1
Ich bereite mich {auf} die Prüfung vor.|Aku mempersiapkan ujian.|sich vorbereiten auf|A|B1
Wir diskutieren {über} das Thema.|Kami mendiskusikan topik itu.|diskutieren über|A|B1
Ich bedanke mich {für} die Einladung.|Aku berterima kasih atas undangan itu.|sich bedanken für|A|B1
Er gehört {zu} den besten Spielern.|Dia termasuk pemain terbaik.|gehören zu|D|B1
Es geht {um} die Zukunft.|Ini soal masa depan.|gehen um|A|B1
Er leidet {an} einer Krankheit.|Dia menderita suatu penyakit.|leiden an|D|B2
Er leidet {unter} dem Lärm.|Dia terganggu oleh kebisingan.|leiden unter|D|B2
Sie kämpft {für} ihre Rechte.|Dia memperjuangkan haknya.|kämpfen für|A|B2
Wir kämpfen {gegen} den Klimawandel.|Kami melawan perubahan iklim.|kämpfen gegen|A|B2
Das Buch handelt {von} einem Jungen.|Buku itu bercerita tentang seorang anak.|handeln von|D|B2
Sie sorgt sich {um} ihre Mutter.|Dia mengkhawatirkan ibunya.|sich sorgen um|A|B2
Ich verzichte {auf} Zucker.|Aku berpantang gula.|verzichten auf|A|B2
Er hält nichts {von} dieser Idee.|Dia tak setuju dengan ide ini.|halten von|D|B2
Ich rechne {mit} deiner Hilfe.|Aku mengandalkan bantuanmu.|rechnen mit|D|B2
Er schützt sich {vor} der Sonne.|Dia melindungi diri dari matahari.|sich schützen vor|D|B2
Wir bestehen {auf} einer Antwort.|Kami berkeras meminta jawaban.|bestehen auf|D|C1
Ich schreibe {an} meinen Freund.|Aku menulis kepada temanku.|schreiben an|A|A2
Sie lacht {über} den Witz.|Dia menertawakan lelucon itu.|lachen über|A|B1
Er telefoniert {mit} seiner Mutter.|Dia menelepon ibunya.|telefonieren mit|D|A2
Er verabredet sich {mit} einem Freund.|Dia janjian dengan seorang teman.|sich verabreden mit|D|A2
Wir reden {über} Politik.|Kami berbicara soal politik.|reden über|A|A2
Wir danken euch {für} die Hilfe.|Kami berterima kasih atas bantuan kalian.|danken für|A|A2
Er hört {auf} seine Eltern.|Dia menurut pada orang tuanya.|hören auf|A|B1
Er spart {für} ein Auto.|Dia menabung untuk mobil.|sparen für|A|B1
Das Kind fürchtet sich {vor} dem Gewitter.|Anak itu takut petir.|sich fürchten vor|D|B1
Er erkundigt sich {nach} dem Preis.|Dia menanyakan harga.|sich erkundigen nach|D|B1
Sie schwärmt {von} ihrem Urlaub.|Dia memuji-muji liburannya.|schwärmen von|D|B2
Er trinkt {auf} dein Wohl.|Dia bersulang untuk kesehatanmu.|trinken auf|A|B2
Sie zweifelt {an} seiner Ehrlichkeit.|Dia meragukan kejujurannya.|zweifeln an|D|B2`;
/* Wechselpräposition: prep|kalimat Wo (~ = artikel+nomina)|kalimat Wohin|nomina|level */
const KSN={tisch:['Tisch','m'],regal:['Regal','n'],bett:['Bett','n'],sofa:['Sofa','n'],stuhl:['Stuhl','m'],schrank:['Schrank','m'],wand:['Wand','f'],tür:['Tür','f'],fenster:['Fenster','n'],küche:['Küche','f'],garten:['Garten','m'],haus:['Haus','n'],kino:['Kino','n'],schule:['Schule','f'],park:['Park','m'],stadt:['Stadt','f'],bank:['Bank','f'],auto:['Auto','n'],balkon:['Balkon','m'],straße:['Straße','f'],brücke:['Brücke','f'],see:['See','m'],berg:['Berg','m'],baum:['Baum','m'],tasche:['Tasche','f'],kühlschrank:['Kühlschrank','m'],zimmer:['Zimmer','n'],lampe:['Lampe','f'],buch:['Buch','n'],mantel:['Mantel','m'],fahrrad:['Fahrrad','n'],keller:['Keller','m'],dach:['Dach','n'],boden:['Boden','m'],decke:['Decke','f'],ecke:['Ecke','f'],mauer:['Mauer','f'],bus:['Bus','m'],zug:['Zug','m'],platz:['Platz','m'],kirche:['Kirche','f'],hotel:['Hotel','n'],flur:['Flur','m'],bad:['Bad','n'],hof:['Hof','m'],treppe:['Treppe','f'],sessel:['Sessel','m']};
const KSW=`auf|Das Buch liegt auf ~.|Ich lege das Buch auf ~.|tisch,regal,bett,sofa,stuhl|A2
auf|Die Tasse steht auf ~.|Ich stelle die Tasse auf ~.|tisch,regal,schrank|A2
auf|Wir sitzen auf ~.|Wir setzen uns auf ~.|bank,sofa,stuhl,balkon|A2
auf|Der Hund ist auf ~.|Der Hund läuft auf ~.|straße,balkon,berg,brücke|A2
an|Das Bild hängt an ~.|Ich hänge das Bild an ~.|wand,tür,fenster|A2
an|Das Fahrrad lehnt an ~.|Ich lehne das Fahrrad an ~.|wand,tür,baum,haus|A2
an|Er steht an ~.|Er geht an ~.|tür,fenster,see,wand|A2
in|Die Milch steht in ~.|Ich stelle die Milch in ~.|kühlschrank,schrank|A1
in|Wir sind in ~.|Wir gehen in ~.|kino,schule,stadt,park,garten,haus,küche|A1
in|Mein Handy ist in ~.|Ich stecke mein Handy in ~.|tasche,schrank,auto|A2
in|Der Schlüssel liegt in ~.|Ich lege den Schlüssel in ~.|tasche,schrank,auto|A2
unter|Die Schuhe stehen unter ~.|Ich stelle die Schuhe unter ~.|bett,tisch,sofa,stuhl|A2
unter|Die Katze sitzt unter ~.|Die Katze läuft unter ~.|tisch,bett,stuhl,baum,brücke|A2
über|Die Lampe hängt über ~.|Ich hänge die Lampe über ~.|tisch,bett,sofa|A2
vor|Das Auto steht vor ~.|Ich fahre das Auto vor ~.|haus,schule,kino,tür|A2
vor|Das Kind steht vor ~.|Das Kind läuft vor ~.|tür,haus,auto,schule,baum|A2
hinter|Der Ball liegt hinter ~.|Er wirft den Ball hinter ~.|haus,schrank,sofa,tür,baum|A2
neben|Die Tasche steht neben ~.|Ich stelle die Tasche neben ~.|tisch,sofa,bett,stuhl,schrank,tür|A2
neben|Wir wohnen neben ~.|Wir ziehen neben ~.|schule,kino,park,haus,see|B1
zwischen|Der Tisch steht zwischen ~ und dem Fenster.|Ich stelle den Tisch zwischen ~ und das Fenster.|sofa,bett,schrank|B1
auf|Die Lampe steht auf ~.|Ich stelle die Lampe auf ~.|tisch,regal,schrank|A2
auf|Das Handy liegt auf ~.|Ich lege das Handy auf ~.|tisch,sofa,bett,stuhl|A2
auf|Der Mantel liegt auf ~.|Ich lege den Mantel auf ~.|bett,sofa,stuhl|A2
an|Das Poster hängt an ~.|Ich hänge das Poster an ~.|wand,tür|A2
in|Das Buch steht in ~.|Ich stelle das Buch in ~.|regal,schrank|A1
in|Die Kinder spielen in ~.|Die Kinder laufen in ~.|garten,park,küche,zimmer,haus|A1
über|Die Decke liegt über ~.|Ich lege die Decke über ~.|bett,sofa,stuhl|B1
vor|Der Stuhl steht vor ~.|Ich stelle den Stuhl vor ~.|tisch,schrank,fenster,tür|A2
hinter|Das Fahrrad steht hinter ~.|Ich stelle das Fahrrad hinter ~.|haus,auto,schule|A2
unter|Der Ball liegt unter ~.|Ich werfe den Ball unter ~.|sofa,bett,auto|A2
neben|Der Papierkorb steht neben ~.|Ich stelle den Papierkorb neben ~.|tisch,schrank,sofa,tür|A2
zwischen|Die Katze sitzt zwischen ~ und dem Sofa.|Die Katze springt zwischen ~ und das Sofa.|stuhl,tisch,schrank|B1`;
const ksSp=(t)=>t.split('\n').map(l=>l.split('|'));
const KS={P:ksSp(KSP).map(a=>({id:a[0],p:a[0],c:a[1],lv:a[2],ex:a[3],tr:a[4]})),
 I:ksSp(KSI).map((a,i)=>{const m=a[0].match(/\[([^\]]+)\]/);return{id:'i'+i,s:a[0],ph:m[1],c:a[1],role:a[2],lv:a[3],tr:a[4],pre:/^Setelah preposisi/.test(a[2])}}),
 V:ksSp(KSV).map(a=>({id:a[0],v:a[0],c:a[1],lv:a[2],ex:a[3],tr:a[4]})),
 B:ksSp(KSB).map((a,i)=>{const m=a[0].match(/\{([^}]+)\}/);return{id:a[2].replace(/ /g,'_'),s:a[0],p:m[1],tr:a[1],vp:a[2],c:a[3],lv:a[4]}}),
 W:ksSp(KSW).map((a,i)=>({id:'w'+i,p:a[0],wo:a[1],wh:a[2],ns:a[3].split(','),lv:a[4]}))};
const KSLV=['A1','A2','B1','B2','C1'];
const KSPLUS=['auf','an','für','über','mit','von','um','vor','nach','zu','in','aus','gegen','bei','unter'];
const ksSh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const KSNK=Object.keys(KSN),KSPN=x=>{let h=0;for(const ch of x.p)h=(h*31+ch.charCodeAt(0))%997;const a=[];for(let i=0;i<8;i++)a.push(KSNK[(h+i*5)%KSNK.length]);return[...new Set(a)]};
const KSA={N:{m:'der',f:'die',n:'das'},A:{m:'den',f:'die',n:'das'},D:{m:'dem',f:'der',n:'dem'}},KSG={m:'Maskulin',f:'Feminin',n:'Neutrum'};
function ksArtOpts(ok){const all=['der','die','das','den','dem'].filter(z=>z!=ok);return ksSh([ok].concat(ksSh(all).slice(0,3)))}
function ksCells(o){const c=[],M=o.modes||[];
 const add=(m,arr,f)=>{if(M.includes(m))for(const x of arr)c.push({k:'ks|'+m+'|'+x.id+(f?'|'+f(x):''),m,x,lv:x.lv})};
 add('pr',KS.P);add('id',KS.I);add('qw',KS.I.filter(x=>!x.pre));add('vb',KS.V);add('vp',KS.B);add('vc',KS.B);
 if(M.includes('pa'))for(const x of KS.P.filter(z=>z.c=='A'||z.c=='D'))for(const id of KSPN(x))c.push({k:'ks|pa|'+x.id+'|'+id,m:'pa',x,nid:id,lv:x.lv});
 if(M.includes('ar'))for(const id of Object.keys(KSN))for(const cs of['N','A','D'])c.push({k:'ks|ar|'+id+'|'+cs,m:'ar',nid:id,cs,lv:'A1'});
 if(M.includes('wp'))for(const x of KS.W)for(const d of ['wo','wh'])c.push({k:'ks|wp|'+x.id+'|'+d,m:'wp',x,d,lv:x.lv});return c}
function ksMake(cell){const m=cell.m,x=cell.x,base={g:'kas',k:cell.k,L:'de'};
 const optC=(codes,ok)=>({lab:'Kasus',opts:codes.map(z=>KSC[z]),ok:[KSC[ok]],soft:[]});
 if(m=='pr'){const cs=['A','D','G','W'];return Object.assign(base,{cell:'Kasus · preposisi → kasus',blanks:[optC(cs,x.c)],parts:[`“${x.p}” + … `,0],tr:'',expl:`<b>${esc(x.p)}</b> + <b>${KSC[x.c]}</b>${x.c=='W'?' — Dativ untuk lokasi (wo?), Akkusativ untuk arah (wohin?)':''}.<br>${esc(x.ex)} — ${esc(x.tr)}`,fullTxt:x.ex,say:()=>x.ex})}
 if(m=='id'||m=='qw'){const cs=['N','A','D','G'],s=x.s.replace(/\[|\]/g,''),mk=x.s.replace('[','⟦').replace(']','⟧');
  if(m=='id')return Object.assign(base,{cell:'Kasus · frasa bergaris',blanks:[optC(cs,x.c)],parts:[mk+'   →  ',0],tr:x.tr,expl:`<b>${esc(x.ph)}</b> = ${KSC[x.c]} — ${esc(x.role)}.<br>${esc(s)}`,fullTxt:s,say:()=>s});
  return Object.assign(base,{cell:'Kasus · kata tanya',blanks:[{lab:'Kata tanya',opts:cs.map(z=>KSQ[z]),ok:[KSQ[x.c]],soft:[]}],parts:[mk+'   →  ',0],tr:x.tr,expl:`<b>${esc(x.ph)}</b> menjawab <b>${KSQ[x.c]}</b> (${KSC[x.c]} — ${esc(x.role)}).<br>${esc(s)}`,fullTxt:s,say:()=>s})}
 if(m=='vb'){const cc=x.c=='G'||x.c=='AG'?['A','D','AD','G','AG']:['A','D','AD','G'];return Object.assign(base,{cell:'Kasus · verba → objek',blanks:[optC(cc,x.c)],parts:[`${x.v} + … `,0],tr:'',expl:`<b>${esc(x.v)}</b> + ${KSC[x.c]}.<br>${esc(x.ex)} — ${esc(x.tr)}`,fullTxt:x.ex,say:()=>x.ex})}
 if(m=='vp'||m=='vc'){const full=x.s.replace(/[{}]/g,''),bl=x.s.split(/\{[^}]+\}/);
  if(m=='vc')return Object.assign(base,{cell:'Kasus · setelah verba + preposisi',blanks:[optC(['A','D','G'],x.c)],parts:[`${x.vp} + … `,0],tr:'',expl:`<b>${esc(x.vp)}</b> + ${KSC[x.c]}.<br>${esc(full)} — ${esc(x.tr)}`,fullTxt:full,say:()=>full});
  const bv=z=>z.replace(/^sich /,'').split(' ')[0],okp=new Set(KS.B.filter(z=>bv(z.vp)==bv(x.vp)).map(z=>z.p)),dis=ksSh(KSPLUS.filter(z=>!okp.has(z)&&z!=x.p)).slice(0,4);
  return Object.assign(base,{cell:'Kasus · verba + preposisi',blanks:[{lab:'Preposisi',opts:ksSh([x.p].concat(dis)),ok:[x.p],soft:[]}],parts:[bl[0],0,bl[1]||''],tr:x.tr,expl:`<b>${esc(x.vp)}</b> + ${KSC[x.c]}.<br>${esc(full)}`,fullTxt:full,say:()=>full})}
 if(m=='pa'){const [nm,gd]=KSN[cell.nid],ok=KSA[x.c][gd],full=`${x.p} ${ok} ${nm}`;return Object.assign(base,{cell:'Kasus · preposisi + artikel',blanks:[{lab:'Artikel',opts:ksArtOpts(ok),ok:[ok],soft:[]}],parts:[x.p+' ',0,` ${nm}  (${KSG[gd]})`],tr:'',expl:`<b>${esc(x.p)}</b> + <b>${KSC[x.c]}</b> → <b>${ok}</b> ${esc(nm)} (${KSG[gd].toLowerCase()}).<br>${esc(x.ex)} — ${esc(x.tr)}`,fullTxt:full,say:()=>full})}
 if(m=='ar'){const [nm,gd]=KSN[cell.nid],ok=KSA[cell.cs][gd],full=`${ok} ${nm}`;return Object.assign(base,{cell:'Kasus · artikel menurut kasus',blanks:[{lab:'Artikel',opts:ksArtOpts(ok),ok:[ok],soft:[]}],parts:[KSC[cell.cs]+':  ',0,` ${nm}  (${KSG[gd]})`],tr:'',expl:`${KSC[cell.cs]} ${KSG[gd].toLowerCase()}: <b>${ok}</b> ${esc(nm)}.`,fullTxt:full,say:()=>full})}
 if(m=='wp'){const id=x.ns[Math.random()*x.ns.length|0],[nm,gd]=KSN[id],dir=cell.d,T=dir=='wo'?x.wo:x.wh,sp=T.split('~'),Z={wo:{m:'dem',f:'der',n:'dem'},wh:{m:'den',f:'die',n:'das'}},ok=Z[dir][gd],oth=Object.keys(Z).filter(z=>z!=dir)[0],bad=Z[oth][gd],ex=['der','die','das','dem','den'].filter(z=>z!=ok&&z!=bad&&z!=Z.wo[gd]&&z!=Z.wh[gd]),opts=ksSh([ok,bad].concat(ksSh(ex).slice(0,2)));
  const full=sp[0]+ok+' '+nm+sp[1];return Object.assign(base,{cell:'Kasus · Wechselpräposition',blanks:[{lab:'Artikel',opts,ok:[ok],soft:[]}],parts:[sp[0],0,' '+nm+sp[1]],tr:'',expl:`<b>${esc(x.p)}</b> = Wechselpräposition. ${dir=='wo'?'Lokasi (<b>wo?</b>) → <b>Dativ</b>':'Arah/gerak (<b>wohin?</b>) → <b>Akkusativ</b>'}: ${esc(ok)} ${esc(nm)} (${gd}).<br>${esc(full)}`,fullTxt:full,say:()=>full})}
 return null}
GXX.kas={pre:'ks|',lvl:KSLV,modes:KSM,def:{n:8,r:200,modes:['pr','id','qw','vb','vp','vc','wp','pa','ar']},cells:ksCells,make:ksMake,
 note:'<small>Kasus Jerman: preposisi, frasa dalam kalimat, kata tanya, verba + objek, verba + preposisi, dan Wechselpräposition. Level kosong = semua level.</small>'};
GXL.push({id:'kas',ic:'Kasus',t:'Kasus Jerman',d:'Nominativ · Akkusativ · Dativ · Genitiv: preposisi, verba + objek, verba + preposisi, Wechselpräposition (wo?/wohin?), dan kata tanya. Level A1–C1.',tag:'DE',lg:'de'});
