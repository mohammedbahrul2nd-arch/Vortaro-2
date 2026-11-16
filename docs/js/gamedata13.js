/* ===== Game Preposisi Verba & Adjektiva (pve Inggris · pvd Jerman · pvn Belanda) v7.80 — mesin GXX (games2.js) =====
   Kalimat dengan blank preposisi + terjemah Indonesia; 6 pilihan. Jenis soal: v = verba + preposisi · a = adjektiva + preposisi. Level A1–B2.
   Data per baris: 'kata|preposisi(~alternatif valid)|kalimat dengan ~ sebagai blank|arti|level|v atau a[|preposisi terlarang sbg pengecoh (~)]'.
   Satu kata boleh punya beberapa baris (mis. sprechen über / sprechen mit). Pengecoh diambil dari pool preposisi bahasa itu dan TIDAK
   boleh sama dengan preposisi valid mana pun (baris mana pun + alternatif) untuk kata yang sama, ataupun preposisi terlarang kolom ke-7.
   Bila ada alternatif valid, soal hanya menampilkan satu preposisi valid sebagai jawaban dan membuang yang lain dari pilihan.
   SRS: kunci '<id>|<mode>|<kata>|<preposisi>'. */
const PVM={v:'Verba + preposisi',a:'Adjektiva + preposisi'};
const PVEN=`listen|to|She likes to listen ~ music.|Dia suka mendengarkan musik.|A1|v
wait|for|We are waiting ~ the bus.|Kami menunggu bus.|A1|v|on
look|at|Look ~ this picture!|Lihat gambar ini!|A1|v
look|for|I am looking ~ my keys.|Aku sedang mencari kunciku.|A2|v
look|after|She looks ~ her little brother.|Dia menjaga adik kecilnya.|B1|v
talk|to~with|I want to talk ~ my teacher.|Aku ingin berbicara dengan guruku.|A1|v
arrive|at|The train arrives ~ the station at six.|Kereta tiba di stasiun pukul enam.|A2|v
belong|to|This book belongs ~ my sister.|Buku ini milik adikku.|A2|v
think|about~of|I am thinking ~ my holiday.|Aku sedang memikirkan liburanku.|A2|v
ask|for|He asked ~ a glass of water.|Dia meminta segelas air.|A2|v
pay|for|Who is paying ~ the dinner?|Siapa yang membayar makan malam?|A2|v
laugh|at|Don't laugh ~ me!|Jangan menertawakanku!|A2|v
agree|with|I agree ~ you.|Aku setuju denganmu.|A2|v
worry|about|Don't worry ~ the exam.|Jangan khawatir soal ujian.|A2|v
reply|to|He replied ~ my email yesterday.|Dia membalas emailku kemarin.|B1|v
thank|for|Thank you ~ your help.|Terima kasih atas bantuanmu.|A2|v
invite|to|She invited us ~ her birthday party.|Dia mengundang kami ke pesta ulang tahunnya.|A2|v
hope|for|We are hoping ~ good weather.|Kami berharap cuaca bagus.|B1|v
dream|of~about|He dreams ~ a big house.|Dia memimpikan rumah besar.|B1|v
search|for|They are searching ~ the lost child.|Mereka mencari anak yang hilang.|B1|v
depend|on|It depends ~ the weather.|Itu tergantung cuaca.|B1|v
succeed|in|She succeeded ~ passing the exam.|Dia berhasil lulus ujian.|B1|v
apologize|for|He apologized ~ being late.|Dia minta maaf karena terlambat.|B1|v
complain|about~of|She complained ~ the noise.|Dia mengeluh soal kebisingan.|B1|v
believe|in|Do you believe ~ ghosts?|Apakah kamu percaya hantu?|B1|v
rely|on|You can rely ~ me.|Kamu bisa mengandalkanku.|B1|v
focus|on|I need to focus ~ my work.|Aku perlu berfokus pada pekerjaanku.|B1|v
concentrate|on|Please concentrate ~ the lesson.|Tolong berkonsentrasilah pada pelajaran.|B1|v
apply|for|She applied ~ a new job.|Dia melamar pekerjaan baru.|B1|v
spend|on|She spends a lot of money ~ clothes.|Dia menghabiskan banyak uang untuk pakaian.|B1|v
consist|of|The team consists ~ ten players.|Tim itu terdiri dari sepuluh pemain.|B1|v
lead|to|This road leads ~ the beach.|Jalan ini menuju pantai.|B1|v
insist|on|He insisted ~ paying the bill.|Dia berkeras membayar tagihan.|B2|v
participate|in|Everyone participated ~ the discussion.|Semua orang ikut serta dalam diskusi.|B2|v
suffer|from|He suffers ~ headaches.|Dia menderita sakit kepala.|B2|v
prevent|from|The rain prevented us ~ going out.|Hujan mencegah kami keluar.|B2|v
accuse|of|They accused him ~ stealing.|Mereka menuduhnya mencuri.|B2|v
benefit|from|Many people benefit ~ this program.|Banyak orang mendapat manfaat dari program ini.|B2|v
contribute|to|Everyone contributed ~ the project.|Semua orang berkontribusi pada proyek itu.|B2|v
recover|from|She is recovering ~ a serious illness.|Dia pulih dari penyakit serius.|B2|v
afraid|of|I am afraid ~ spiders.|Aku takut pada laba-laba.|A1|a
good|at|She is good ~ drawing.|Dia pandai menggambar.|A1|a
interested|in|He is interested ~ history.|Dia tertarik pada sejarah.|A2|a
proud|of|We are proud ~ our team.|Kami bangga akan tim kami.|A2|a
married|to|She is married ~ a doctor.|Dia menikah dengan seorang dokter.|A2|a
different|from~to|This city is very different ~ my hometown.|Kota ini sangat berbeda dari kampung halamanku.|A2|a
angry|with~at|She was angry ~ her brother.|Dia marah pada adiknya.|A2|a|about
excited|about|The children are excited ~ the trip.|Anak-anak antusias soal perjalanan itu.|A2|a|by
worried|about|He is worried ~ his exam.|Dia khawatir soal ujiannya.|A2|a|over
famous|for|Paris is famous ~ its museums.|Paris terkenal karena museum-museumnya.|A2|a
keen|on|He is keen ~ football.|Dia sangat suka sepak bola.|B1|a
tired|of|I am tired ~ waiting.|Aku bosan menunggu.|B1|a|from
responsible|for|Who is responsible ~ this mistake?|Siapa yang bertanggung jawab atas kesalahan ini?|B1|a|to
jealous|of|He is jealous ~ his brother.|Dia iri pada kakaknya.|B1|a
similar|to|Your phone is similar ~ mine.|Ponselmu mirip milikku.|B1|a|with
satisfied|with|Are you satisfied ~ the result?|Apakah kamu puas dengan hasilnya?|B1|a|by
surprised|at~by|I was surprised ~ the news.|Aku terkejut oleh kabar itu.|B1|a|about
crazy|about|She is crazy ~ chocolate.|Dia tergila-gila pada cokelat.|B1|a
fond|of|She is fond ~ her grandmother.|Dia sayang pada neneknya.|B1|a
allergic|to|He is allergic ~ peanuts.|Dia alergi kacang.|B1|a
capable|of|She is capable ~ running a company.|Dia mampu menjalankan perusahaan.|B2|a
dependent|on|The child is still dependent ~ his parents.|Anak itu masih bergantung pada orang tuanya.|B2|a
guilty|of|He was found guilty ~ the crime.|Dia dinyatakan bersalah atas kejahatan itu.|B2|a|about
stare|at|He stared ~ the strange painting.|Dia menatap lukisan aneh itu.|B1|v
shout|at|Don't shout ~ the children.|Jangan membentak anak-anak.|B1|v
shout|to|She shouted ~ me from across the street.|Dia berteriak kepadaku dari seberang jalan.|B1|v
deal|with|We must deal ~ this problem.|Kita harus menangani masalah ini.|B1|v
cope|with|She copes ~ stress very well.|Dia mengatasi stres dengan sangat baik.|B2|v
vote|for|Who did you vote ~?|Kamu memilih siapa?|B1|v
happen|to|What happened ~ your car?|Apa yang terjadi pada mobilmu?|A2|v
speak|to~with|Can I speak ~ the manager?|Bolehkah saya berbicara dengan manajernya?|A2|v
differ|from|Her opinion differs ~ mine.|Pendapatnya berbeda dari pendapatku.|B2|v
refer|to|He referred ~ my report in the meeting.|Dia merujuk laporanku dalam rapat.|B2|v
object|to|I object ~ this decision.|Aku keberatan pada keputusan ini.|B2|v
adapt|to|It takes time to adapt ~ a new city.|Butuh waktu untuk menyesuaikan diri dengan kota baru.|B2|v
fight|against|They fight ~ poverty.|Mereka melawan kemiskinan.|B2|v|for
fight|for|They fight ~ equal rights.|Mereka memperjuangkan hak yang setara.|B2|v
result|in|Heavy rain resulted ~ floods.|Hujan deras mengakibatkan banjir.|B2|v
result|from|The floods resulted ~ heavy rain.|Banjir itu diakibatkan hujan deras.|B2|v
late|for|He was late ~ work.|Dia terlambat ke kantor.|A2|a
ready|for|Are you ready ~ the test?|Apakah kamu siap menghadapi ujian?|A2|a
bad|at|I am bad ~ cooking.|Aku payah memasak.|A2|a
sorry|about~for|I'm sorry ~ the mess.|Aku minta maaf soal kekacauan ini.|A2|a
kind|to|She is kind ~ animals.|Dia baik kepada binatang.|A2|a
close|to|The hotel is close ~ the beach.|Hotel itu dekat dengan pantai.|A2|a
polite|to|Be polite ~ the guests.|Bersikaplah sopan kepada para tamu.|B1|a
nervous|about|He is nervous ~ the interview.|Dia gugup soal wawancara itu.|B1|a|of
annoyed|with~at|She was annoyed ~ him.|Dia kesal padanya.|B1|a
bored|with~of|I am bored ~ this game.|Aku bosan dengan permainan ini.|B1|a
disappointed|with~in|We were disappointed ~ the service.|Kami kecewa dengan layanannya.|B1|a
grateful|for|I am grateful ~ your support.|Aku berterima kasih atas dukunganmu.|B1|a
typical|of|That is typical ~ him.|Itu khas dirinya.|B2|a
aware|of|Are you aware ~ the risks?|Apakah kamu sadar akan risikonya?|B2|a
ashamed|of|He is ashamed ~ his behaviour.|Dia malu akan perilakunya.|B2|a
short|of|We are short ~ money this month.|Kami kekurangan uang bulan ini.|B2|a`;
const PVDE=`warten|auf|Ich warte ~ den Bus.|Aku menunggu bus.|A1|v
sich freuen|auf|Wir freuen uns ~ die Ferien.|Kami menantikan liburan.|A2|v
sich freuen|über|Ich freue mich ~ das Geschenk.|Aku senang dengan hadiah itu.|A2|v
denken|an|Er denkt oft ~ seine Familie.|Dia sering memikirkan keluarganya.|A2|v
sich interessieren|für|Ich interessiere mich ~ Musik.|Aku tertarik pada musik.|A2|v
sprechen|über|Wir sprechen ~ das Wetter.|Kami membicarakan cuaca.|A2|v
sprechen|mit|Sie spricht ~ ihrer Lehrerin.|Dia berbicara dengan gurunya.|A2|v
fragen|nach|Ich frage ~ dem Weg.|Aku menanyakan jalan.|A2|v
sich kümmern|um|Sie kümmert sich ~ die Kinder.|Dia mengurus anak-anak.|A2|v
Angst haben|vor|Das Kind hat Angst ~ dem Hund.|Anak itu takut pada anjing.|A2|v
erzählen|von|Er erzählt ~ seiner Reise.|Dia bercerita tentang perjalanannya.|A2|v
sich erinnern|an|Sie erinnert sich gern ~ den Urlaub.|Dia senang mengingat liburan itu.|B1|v
träumen|von|Er träumt ~ einem neuen Auto.|Dia bermimpi tentang mobil baru.|B1|v
teilnehmen|an|Alle nehmen ~ dem Kurs teil.|Semua mengikuti kursus itu.|B1|v
glauben|an|Ich glaube ~ die Liebe.|Aku percaya pada cinta.|B1|v
hoffen|auf|Wir hoffen ~ gutes Wetter.|Kami berharap cuaca bagus.|B1|v
bitten|um|Sie bittet ihn ~ Hilfe.|Dia meminta bantuan darinya.|B1|v
sich bewerben|um|Er bewirbt sich ~ eine Stelle.|Dia melamar sebuah posisi.|B1|v
sich verlassen|auf|Du kannst dich ~ mich verlassen.|Kamu bisa mengandalkanku.|B1|v
sich gewöhnen|an|Ich gewöhne mich ~ das Klima.|Aku membiasakan diri dengan iklim.|B1|v
sich beschäftigen|mit|Er beschäftigt sich ~ Geschichte.|Dia menekuni sejarah.|B1|v
abhängen|von|Das hängt ~ dem Wetter ab.|Itu tergantung cuaca.|B1|v
bestehen|aus|Das Frühstück besteht ~ Brot und Käse.|Sarapan terdiri dari roti dan keju.|B1|v
suchen|nach|Wir suchen ~ einer Lösung.|Kami mencari solusi.|B1|v
riechen|nach|Es riecht ~ frischem Brot.|Baunya seperti roti segar.|B1|v
warnen|vor|Sie warnt ihn ~ dem Hund.|Dia memperingatkannya tentang anjing itu.|B1|v
sich entschuldigen|für|Ich entschuldige mich ~ den Fehler.|Aku minta maaf atas kesalahan itu.|B1|v
sich beschweren|über|Sie beschwert sich ~ den Service.|Dia mengeluh soal layanan.|B1|v
sich konzentrieren|auf|Ich konzentriere mich ~ die Arbeit.|Aku berkonsentrasi pada pekerjaan.|B1|v
achten|auf|Bitte achte ~ die Kinder.|Tolong perhatikan anak-anak.|B1|v
sich verlieben|in|Er verliebt sich ~ eine Kollegin.|Dia jatuh cinta pada rekan kerja.|B1|v
einladen|zu|Ich lade dich ~ meiner Party ein.|Aku mengundangmu ke pestaku.|B1|v
sich vorbereiten|auf|Ich bereite mich ~ die Prüfung vor.|Aku mempersiapkan ujian.|B1|v
diskutieren|über|Wir diskutieren ~ das Thema.|Kami mendiskusikan topik itu.|B1|v
sich bedanken|für|Ich bedanke mich ~ die Einladung.|Aku berterima kasih atas undangan itu.|B1|v
gehören|zu|Er gehört ~ den besten Spielern.|Dia termasuk pemain terbaik.|B1|v
sich ärgern|über|Er ärgert sich ~ den Lärm.|Dia kesal karena kebisingan.|B1|v
leiden|an|Er leidet ~ einer Krankheit.|Dia menderita suatu penyakit.|B2|v
leiden|unter|Er leidet ~ dem Lärm.|Dia terganggu oleh kebisingan.|B2|v
kämpfen|für|Sie kämpft ~ ihre Rechte.|Dia memperjuangkan haknya.|B2|v
kämpfen|gegen|Wir kämpfen ~ den Klimawandel.|Kami melawan perubahan iklim.|B2|v
sich sorgen|um|Sie sorgt sich ~ ihre Mutter.|Dia mengkhawatirkan ibunya.|B2|v
verzichten|auf|Ich verzichte ~ Zucker.|Aku berpantang gula.|B2|v
gut|in|Sie ist ~ Mathe gut.|Dia pandai matematika.|A1|a
schlecht|in|Er ist ~ Sport schlecht.|Dia payah olahraga.|A2|a
stolz|auf|Sie ist stolz ~ ihren Sohn.|Dia bangga pada putranya.|A2|a
zufrieden|mit|Ich bin zufrieden ~ dem Ergebnis.|Aku puas dengan hasilnya.|A2|a
verliebt|in|Er ist ~ seine Nachbarin verliebt.|Dia jatuh cinta pada tetangganya.|A2|a
fertig|mit|Bist du schon ~ deinen Hausaufgaben fertig?|Apakah kamu sudah selesai dengan PR-mu?|A2|a
verheiratet|mit|Sie ist seit zehn Jahren ~ ihm verheiratet.|Dia sudah sepuluh tahun menikah dengannya.|A2|a
freundlich|zu|Er ist immer ~ allen freundlich.|Dia selalu ramah kepada semua orang.|A2|a
müde|von|Ich bin ~ der Arbeit müde.|Aku lelah karena pekerjaan.|A2|a
abhängig|von|Das Kind ist noch ~ den Eltern abhängig.|Anak itu masih bergantung pada orang tuanya.|B1|a
begeistert|von|Wir sind ~ dem Konzert begeistert.|Kami terpukau oleh konser itu.|B1|a
glücklich|über|Sie ist ~ die gute Nachricht glücklich.|Dia bahagia atas kabar baik itu.|B1|a
interessiert|an|Er ist ~ dem Job interessiert.|Dia berminat pada pekerjaan itu.|B1|a
neugierig|auf|Ich bin ~ das Ergebnis neugierig.|Aku penasaran akan hasilnya.|B1|a
verantwortlich|für|Wer ist ~ den Fehler verantwortlich?|Siapa yang bertanggung jawab atas kesalahan itu?|B1|a
typisch|für|Das ist ~ ihn typisch.|Itu khas dirinya.|B1|a
böse|auf|Sie ist ~ ihren Bruder böse.|Dia marah pada adiknya.|B1|a
bekannt|für|Die Stadt ist ~ ihren Käse bekannt.|Kota itu terkenal karena kejunya.|B1|a
reich|an|Obst ist ~ Vitaminen reich.|Buah kaya akan vitamin.|B1|a
traurig|über|Er ist ~ den Verlust traurig.|Dia sedih karena kehilangan itu.|B1|a
eifersüchtig|auf|Er ist ~ seinen Bruder eifersüchtig.|Dia cemburu pada kakaknya.|B1|a
allergisch|gegen|Sie ist ~ Nüsse allergisch.|Dia alergi kacang.|B1|a
zuständig|für|Wer ist ~ diese Abteilung zuständig?|Siapa yang bertanggung jawab atas bagian ini?|B2|a
überzeugt|von|Ich bin ~ seiner Idee überzeugt.|Aku yakin akan idenya.|B2|a
schreiben|an|Ich schreibe ~ meinen Freund.|Aku menulis kepada temanku.|A2|v
lachen|über|Sie lacht ~ den Witz.|Dia menertawakan lelucon itu.|B1|v
telefonieren|mit|Er telefoniert ~ seiner Mutter.|Dia menelepon ibunya.|A2|v
sich verabreden|mit|Er verabredet sich ~ einem Freund.|Dia janjian dengan seorang teman.|A2|v
sich unterhalten|mit|Sie unterhält sich ~ dem Nachbarn.|Dia mengobrol dengan tetangga.|A2|v
gratulieren|zu|Wir gratulieren dir ~ deinem Geburtstag.|Kami mengucapkan selamat ulang tahun padamu.|A2|v
passen|zu|Das passt ~ deiner Jacke.|Itu cocok dengan jaketmu.|A2|v
danken|für|Wir danken euch ~ die Hilfe.|Kami berterima kasih atas bantuan kalian.|A2|v
hören|auf|Er hört ~ seine Eltern.|Dia menurut pada orang tuanya.|B1|v
sparen|für|Er spart ~ ein Auto.|Dia menabung untuk mobil.|B1|v
sich fürchten|vor|Das Kind fürchtet sich ~ dem Gewitter.|Anak itu takut petir.|B1|v
sich erkundigen|nach|Er erkundigt sich ~ dem Preis.|Dia menanyakan harga.|B1|v
sich entscheiden|für|Ich entscheide mich ~ das blaue Kleid.|Aku memilih gaun biru.|B1|v
gehen|um|Es geht ~ die Zukunft.|Ini soal masa depan.|B1|v
schwärmen|von|Sie schwärmt ~ ihrem Urlaub.|Dia memuji-muji liburannya.|B2|v
trinken|auf|Er trinkt ~ dein Wohl.|Dia bersulang untuk kesehatanmu.|B2|v
zweifeln|an|Sie zweifelt ~ seiner Ehrlichkeit.|Dia meragukan kejujurannya.|B2|v
halten|von|Ich halte nichts ~ dieser Idee.|Aku tidak setuju dengan ide ini.|B2|v
rechnen|mit|Ich rechne ~ deiner Hilfe.|Aku mengandalkan bantuanmu.|B2|v
schützen|vor|Er schützt sich ~ der Sonne.|Dia melindungi diri dari matahari.|B2|v
bestehen|auf|Wir bestehen ~ einer Antwort.|Kami berkeras meminta jawaban.|B2|v
sich handeln|um|Es handelt sich ~ ein Missverständnis.|Ini soal sebuah kesalahpahaman.|B2|v
nett|zu|Er ist immer ~ allen nett.|Dia selalu baik kepada semua orang.|A2|a
gespannt|auf|Ich bin ~ die Antwort gespannt.|Aku penasaran akan jawabannya.|B1|a
voll|von|Der Raum ist ~ Menschen voll.|Ruangan itu penuh orang.|B1|a
beliebt|bei|Der Sänger ist ~ jungen Leuten beliebt.|Penyanyi itu disukai anak muda.|B2|a
gewöhnt|an|Ich bin ~ die Kälte gewöhnt.|Aku terbiasa dengan dingin.|B2|a
schuld|an|Wer ist ~ dem Unfall schuld?|Siapa yang bersalah atas kecelakaan itu?|B2|a
arm|an|Das Land ist ~ Rohstoffen arm.|Negara itu miskin sumber daya.|B2|a
enttäuscht|von|Sie ist ~ dem Film enttäuscht.|Dia kecewa pada film itu.|B2|a`;
const PVNL=`wachten|op|Wij wachten ~ de bus.|Kami menunggu bus.|A1|v
kijken|naar|Ik kijk ~ een film.|Aku menonton film.|A1|v
luisteren|naar|Zij luistert ~ muziek.|Dia mendengarkan musik.|A1|v
houden|van|Ik houd ~ chocolade.|Aku suka cokelat.|A1|v
praten|met|Ik praat ~ mijn buurman.|Aku berbicara dengan tetanggaku.|A1|v
denken|aan|Ik denk vaak ~ mijn familie.|Aku sering memikirkan keluargaku.|A2|v
denken|over|Wat denk je ~ dit plan?|Bagaimana pendapatmu tentang rencana ini?|A2|v
zoeken|naar|Wij zoeken ~ een oplossing.|Kami mencari solusi.|A2|v
vragen|om|Hij vraagt ~ hulp.|Dia meminta bantuan.|A2|v
vragen|naar|Zij vraagt ~ de weg.|Dia menanyakan jalan.|A2|v
praten|over|Wij praten ~ het weer.|Kami membicarakan cuaca.|A2|v
lachen|om|Zij lacht ~ de grap.|Dia menertawakan lelucon itu.|A2|v
bellen|met|Ik bel ~ mijn moeder.|Aku menelepon ibuku.|A2|v
beginnen|met|Wij beginnen ~ de les.|Kami memulai pelajaran.|A2|v
zich verheugen|op|Wij verheugen ons ~ de vakantie.|Kami menantikan liburan.|B1|v
zich ergeren|aan|Hij ergert zich ~ het lawaai.|Dia kesal pada kebisingan.|B1|v
geloven|in|Geloof jij ~ spoken?|Apakah kamu percaya hantu?|B1|v
afhangen|van|Dat hangt ~ het weer af.|Itu tergantung cuaca.|B1|v
bestaan|uit|De groep bestaat ~ tien mensen.|Kelompok itu terdiri dari sepuluh orang.|B1|v
deelnemen|aan|Wij nemen ~ de wedstrijd deel.|Kami ikut serta dalam pertandingan.|B1|v
solliciteren|naar|Zij solliciteert ~ een baan.|Dia melamar pekerjaan.|B1|v
slagen|voor|Hij is ~ zijn examen geslaagd.|Dia lulus ujiannya.|B1|v
zorgen|voor|Zij zorgt ~ haar oma.|Dia merawat neneknya.|B1|v
wennen|aan|Ik moet ~ het klimaat wennen.|Aku harus membiasakan diri dengan iklim.|B1|v
stoppen|met|Hij stopt ~ roken.|Dia berhenti merokok.|B1|v
trouwen|met|Zij trouwt ~ een arts.|Dia menikah dengan seorang dokter.|B1|v
rekenen|op|Je kunt ~ mij rekenen.|Kamu bisa mengandalkanku.|B1|v
twijfelen|aan|Ik twijfel ~ zijn woorden.|Aku meragukan kata-katanya.|B2|v
bang|voor|Ik ben bang ~ spinnen.|Aku takut laba-laba.|A1|a
goed|in|Zij is goed ~ tekenen.|Dia pandai menggambar.|A1|a
trots|op|Wij zijn trots ~ ons team.|Kami bangga pada tim kami.|A2|a
blij|met|Ik ben blij ~ het cadeau.|Aku senang dengan hadiah itu.|A2|a
boos|op|Zij is boos ~ haar broer.|Dia marah pada adiknya.|A2|a
verliefd|op|Zij is verliefd ~ een collega.|Dia jatuh cinta pada rekan kerja.|A2|a
geïnteresseerd|in|Zij is geïnteresseerd ~ kunst.|Dia tertarik pada seni.|A2|a
slecht|in|Hij is slecht ~ wiskunde.|Dia payah matematika.|A2|a
aardig|voor~tegen|Zij is erg aardig ~ iedereen.|Dia sangat baik kepada semua orang.|A2|a
getrouwd|met|Zij is al tien jaar ~ hem getrouwd.|Dia sudah sepuluh tahun menikah dengannya.|A2|a
dol|op|Hij is dol ~ voetbal.|Dia gemar sekali sepak bola.|B1|a
jaloers|op|Hij is jaloers ~ zijn broer.|Dia iri pada kakaknya.|B1|a
tevreden|met|Ben je tevreden ~ het resultaat?|Apakah kamu puas dengan hasilnya?|B1|a
gewend|aan|Ik ben ~ de kou gewend.|Aku sudah terbiasa dengan dingin.|B1|a
afhankelijk|van|Het kind is nog ~ zijn ouders afhankelijk.|Anak itu masih bergantung pada orang tuanya.|B1|a
verantwoordelijk|voor|Wie is ~ deze fout verantwoordelijk?|Siapa yang bertanggung jawab atas kesalahan ini?|B1|a
moe|van|Ik ben moe ~ het wachten.|Aku lelah menunggu.|B1|a
verbaasd|over|Zij is verbaasd ~ het nieuws.|Dia terkejut oleh kabar itu.|B1|a
nieuwsgierig|naar|Ik ben ~ de uitslag nieuwsgierig.|Aku penasaran soal hasilnya.|B1|a
allergisch|voor|Hij is ~ noten allergisch.|Dia alergi kacang.|B1|a
bekend|om|Amsterdam is bekend ~ zijn grachten.|Amsterdam terkenal karena kanal-kanalnya.|B1|a
bekend|met|Ik ben goed ~ de stad bekend.|Aku mengenal baik kota ini.|B1|a
teleurgesteld|in|Hij is teleurgesteld ~ zijn vriend.|Dia kecewa pada temannya.|B2|a
schrijven|over|Hij schrijft ~ zijn reis.|Dia menulis tentang perjalanannya.|A2|v
vertellen|over|Zij vertelt ~ haar vakantie.|Dia bercerita tentang liburannya.|A2|v
spreken|met|Kan ik ~ de directeur spreken?|Bolehkah saya berbicara dengan direktur?|A2|v
spreken|over|Wij spreken ~ politiek.|Kami berbicara soal politik.|A2|v
antwoorden|op|Zij antwoordt ~ de vraag.|Dia menjawab pertanyaan itu.|A2|v
uitnodigen|voor|Zij nodigt ons ~ het feest uit.|Dia mengundang kami ke pesta.|A2|v
werken|aan|Wij werken ~ een project.|Kami mengerjakan sebuah proyek.|A2|v
meedoen|aan|Doe je ~ de wedstrijd mee?|Apakah kamu ikut pertandingan?|A2|v
genieten|van|Wij genieten ~ de zon.|Kami menikmati matahari.|A2|v
nadenken|over|Ik denk ~ het probleem na.|Aku memikirkan masalah itu.|B1|v
klagen|over|Hij klaagt ~ het eten.|Dia mengeluh soal makanan.|B1|v
reageren|op|Hij reageert ~ mijn e-mail.|Dia menanggapi emailku.|B1|v
letten|op|Let ~ de kinderen.|Perhatikan anak-anak.|B1|v
passen|bij|Die jas past ~ jouw broek.|Jaket itu cocok dengan celanamu.|B1|v
bedanken|voor|Ik bedank je ~ je hulp.|Aku berterima kasih atas bantuanmu.|B1|v
sparen|voor|Hij spaart ~ een auto.|Dia menabung untuk mobil.|B1|v
droomen|van|Hij droomt ~ een groot huis.|Dia memimpikan rumah besar.|B1|v
ruiken|naar|Het ruikt ~ vers brood.|Baunya seperti roti segar.|B1|v
smaken|naar|De soep smaakt ~ knoflook.|Sup itu terasa bawang putih.|B1|v
waarschuwen|voor|Ik waarschuw je ~ de hond.|Aku memperingatkanmu tentang anjing itu.|B1|v
zich concentreren|op|Ik concentreer me ~ mijn werk.|Aku berkonsentrasi pada pekerjaanku.|B1|v
zich voorbereiden|op|Zij bereiden zich ~ het examen voor.|Mereka mempersiapkan ujian.|B1|v
lijden|aan|Hij lijdt ~ een ziekte.|Dia menderita suatu penyakit.|B2|v
lijden|onder|Zij lijdt ~ de hitte.|Dia menderita karena panas.|B2|v
vechten|tegen|Zij vechten ~ armoede.|Mereka melawan kemiskinan.|B2|v|voor
protesteren|tegen|Mensen protesteren ~ de maatregel.|Orang-orang memprotes aturan itu.|B2|v
profiteren|van|Veel mensen profiteren ~ deze regeling.|Banyak orang mendapat manfaat dari aturan ini.|B2|v
zich schamen|voor|Hij schaamt zich ~ zijn gedrag.|Dia malu akan perilakunya.|B2|v
zich interesseren|voor|Ik interesseer me ~ geschiedenis.|Aku tertarik pada sejarah.|B2|v
klaar|met|Ben je al ~ je huiswerk klaar?|Apakah kamu sudah selesai dengan PR-mu?|A2|a
bezig|met|Zij is ~ haar werk bezig.|Dia sedang sibuk dengan pekerjaannya.|A2|a
klaar|voor|Zijn jullie ~ het examen klaar?|Apakah kalian siap untuk ujian?|B1|a
vol|van~met|De kamer is ~ mensen vol.|Ruangan itu penuh orang.|B1|a
dankbaar|voor|Ik ben ~ je hulp dankbaar.|Aku berterima kasih atas bantuanmu.|B1|a
ongerust|over|Zij is ~ haar zoon ongerust.|Dia mengkhawatirkan putranya.|B1|a
blij|over|Ik ben ~ het goede nieuws blij.|Aku senang dengan kabar baik itu.|B1|a
gelukkig|met|Ik ben ~ mijn baan gelukkig.|Aku bahagia dengan pekerjaanku.|B1|a
typisch|voor|Dat is ~ hem typisch.|Itu khas dirinya.|B1|a
gezond|voor|Groente is gezond ~ iedereen.|Sayur sehat untuk semua orang.|B1|a
gevoelig|voor|Hij is ~ kou gevoelig.|Dia peka terhadap dingin.|B2|a
rijk|aan|Fruit is ~ vitamines rijk.|Buah kaya akan vitamin.|B2|a
arm|aan|Dit gebied is ~ water arm.|Daerah ini miskin air.|B2|a
bevriend|met|Zij is ~ hem bevriend.|Dia berteman dengannya.|B2|a`;
const PVPOOL={en:['of','to','for','on','in','at','with','from','about','by','into','over','after','against','under'],de:['auf','an','für','über','mit','von','um','vor','nach','zu','in','aus','gegen','bei','unter'],nl:['op','aan','voor','over','met','van','om','naar','in','uit','tegen','bij','door','onder']};
const pvSp=t=>t.split('\n').map(l=>{const a=l.split('|'),al=a[1].split('~');return{k:a[0],p:al[0],alts:al,s:a[2],tr:a[3],lv:a[4],t:a[5],ban:a[6]?a[6].split('~'):[]}});
const PV={en:pvSp(PVEN),de:pvSp(PVDE),nl:pvSp(PVNL)};
const PVID={pve:'en',pvd:'de',pvn:'nl'};
const pvSh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
/* semua preposisi valid untuk satu kata (seluruh baris + alternatif) */
const pvValid=(L,k)=>{const s=new Set();for(const x of PV[L])if(x.k==k)x.alts.forEach(p=>s.add(p));return s};
function pvOpts(L,x,ok){const val=pvValid(L,x.k),ban=new Set(x.ban);for(const y of PV[L])if(y.k==x.k)y.ban.forEach(b=>ban.add(b));
 const d=pvSh(PVPOOL[L].filter(p=>!val.has(p)&&!ban.has(p))).slice(0,5);return pvSh([ok].concat(d))}
function pvCells(L,pre){return o=>{const c=[],M=o.modes||[];for(const x of PV[L])if(M.includes(x.t))c.push({k:pre+x.t+'|'+x.k+'|'+x.p,m:x.t,x,lv:x.lv});return c}}
function pvMake(L,g){return cell=>{const x=cell.x,ok=x.alts[Math.random()*x.alts.length|0],sp=x.s.split('~'),full=sp[0]+ok+sp[1],all=[...pvValid(L,x.k)];
 const others=PV[L].filter(y=>y.k==x.k&&y!==x).map(y=>`${esc(y.k)} + <b>${esc(y.alts.join(' / '))}</b>: ${esc(y.s.replace('~',y.p))}`);
 return{g,k:cell.k,L,cell:(cell.m=='v'?'Preposisi · verba':'Preposisi · adjektiva')+' · '+x.lv,blanks:[{lab:'Preposisi',opts:pvOpts(L,x,ok),ok:[ok],soft:[]}],parts:[sp[0],0,sp[1]],tr:x.tr,
  expl:`<b>${esc(x.k)}</b> + <b>${esc(x.alts.join(' / '))}</b> (${cell.m=='v'?'verba':'adjektiva'}).<br>${esc(full)}${others.length?'<br><small>Pola lain untuk kata ini: '+others.join(' · ')+'</small>':''}`,fullTxt:full,say:()=>full}}}
const PVT={pve:['Preposisi Verba & Adjektiva Inggris','listen to, wait for, depend on, succeed in · afraid of, good at, proud of, married to … Pilih preposisi yang tepat untuk blank.','EN','en'],pvd:['Preposisi Verba & Adjektiva Jerman','warten auf, sich freuen über, kämpfen gegen · stolz auf, zufrieden mit, verliebt in … Pilih preposisi yang tepat untuk blank.','DE','de'],pvn:['Preposisi Verba & Adjektiva Belanda','wachten op, kijken naar, houden van · bang voor, trots op, blij met … Pilih preposisi yang tepat untuk blank.','NL','nl']};
for(const g of Object.keys(PVID)){const L=PVID[g],pre=g+'|';
 GXX[g]={pre,lvl:['A1','A2','B1','B2'],modes:PVM,def:{n:8,r:200,modes:['v','a']},cells:pvCells(L,pre),make:pvMake(L,g),
  note:'<small>Verba + preposisi (v) dan adjektiva + preposisi (a). Satu kata bisa punya beberapa pola (mis. denken aan / denken over). Level kosong = semua level.</small>'};
 GXL.push({id:g,ic:PVT[g][2]=='EN'?'of':PVT[g][2]=='DE'?'auf':'op',t:PVT[g][0],d:PVT[g][1],tag:PVT[g][2],lg:PVT[g][3]})}
