/* ===== Game Trennbar & Untrennbar Belanda (dtn) v7.80 — mesin GXX (games2.js) =====
   Scheidbare & onscheidbare werkwoorden dalam satu game (A2–B2). Jenis soal:
   pf pilih prefiks (blank inline) · pp voltooid deelwoord (heeft/is + pp) · te te-infinitief (op te bellen vs te bezoeken) · ty scheidbaar/onscheidbaar · ar arti → verba.
   Data per verba: 'inf|prefiks|arti|perfectum|te-infinitief|kalimat {prefiks}|arti|kalimat 2|arti 2|level' (level = kolom tambahan).
   Onscheidbaar = prefiks be-/ge-/her-/ont-/ver- (voltooid deelwoord tanpa ge-). Pengecoh prefiks tidak boleh membentuk verba nyata:
   dikecualikan prefiks+stem yang ada di data (DNL) dan daftar verba nyata tambahan DNX (kurasi; tambahkan bila ada pengecoh yang ternyata verba nyata).
   SRS: kunci 'dn|<mode>|<inf>[|1/2]'. */
const DNM={pf:'Pilih prefiks (blank di kalimat)',pp:'Voltooid deelwoord (heeft/is + pp)',te:'Te-infinitief (op te bellen / te bezoeken)',ty:'Scheidbaar atau onscheidbaar?',ar:'Arti → verba'};
const DNON=['be','ge','her','ont','ver'];
const DNL=`opbellen|op|menelepon|heeft opgebeld|op te bellen|Ik bel mijn vriend {op}.|Aku menelepon temanku.|Gisteren heeft hij mij {op}gebeld.|Kemarin dia menelepon aku.|A2
aankomen|aan|tiba|is aangekomen|aan te komen|De trein komt om tien uur {aan}.|Kereta tiba pukul sepuluh.|Wij zijn gisteren in Utrecht {aan}gekomen.|Kemarin kami tiba di Utrecht.|A2
opstaan|op|bangun|is opgestaan|op te staan|Ik sta elke dag om zeven uur {op}.|Aku bangun setiap hari pukul tujuh.|Hij is vanmorgen vroeg {op}gestaan.|Dia bangun pagi-pagi tadi.|A2
uitgaan|uit|pergi keluar (bersenang-senang)|is uitgegaan|uit te gaan|Wij gaan zaterdagavond {uit}.|Kami pergi keluar Sabtu malam.|Zij is gisteren met vrienden {uit}gegaan.|Dia kemarin keluar bersama teman-teman.|A2
meenemen|mee|membawa (pergi)|heeft meegenomen|mee te nemen|Ik neem mijn laptop {mee}.|Aku membawa laptopku.|Heb je een paraplu {mee}genomen?|Apakah kamu membawa payung?|A2
afspreken|af|membuat janji|heeft afgesproken|af te spreken|Wij spreken morgen om drie uur {af}.|Kita janjian besok pukul tiga.|Wij hebben bij het station {af}gesproken.|Kami janjian di stasiun.|A2
uitnodigen|uit|mengundang|heeft uitgenodigd|uit te nodigen|Zij nodigt ons voor het feest {uit}.|Dia mengundang kami ke pesta.|Ik ben vergeten hem {uit} te nodigen.|Aku lupa mengundangnya.|A2
instappen|in|naik (ke kendaraan)|is ingestapt|in te stappen|Wij stappen bij het station {in}.|Kami naik di stasiun.|Zij zijn net in de bus {in}gestapt.|Mereka baru saja naik bus.|A2
overstappen|over|pindah kereta (transit)|is overgestapt|over te stappen|In Utrecht moet je {over}stappen.|Di Utrecht kamu harus pindah kereta.|Ik ben in Amsterdam {over}gestapt.|Aku pindah kereta di Amsterdam.|B1
aanzetten|aan|menyalakan|heeft aangezet|aan te zetten|Hij zet de televisie {aan}.|Dia menyalakan televisi.|Ik heb het licht {aan}gezet.|Aku menyalakan lampu.|A2
nadenken|na|berpikir|heeft nagedacht|na te denken|Ik denk er nog even over {na}.|Aku masih memikirkannya sebentar.|Hij heeft lang over zijn keuze {na}gedacht.|Dia lama memikirkan pilihannya.|B1
voorstellen|voor|memperkenalkan|heeft voorgesteld|voor te stellen|Hij stelt zijn vriendin aan ons {voor}.|Dia memperkenalkan pacarnya kepada kami.|Mag ik mijn collega aan je {voor}stellen?|Boleh aku memperkenalkan rekan kerjaku padamu?|B1
doorgaan|door|berlanjut; melanjutkan|is doorgegaan|door te gaan|De les gaat morgen gewoon {door}.|Pelajaran besok tetap berlangsung.|Het feest is ondanks de regen {door}gegaan.|Pesta tetap berlangsung meski hujan.|B1
inpakken|in|mengemas; membungkus|heeft ingepakt|in te pakken|Ik pak mijn koffer {in}.|Aku mengemas kopernya.|Zij heeft het cadeau mooi {in}gepakt.|Dia membungkus hadiah itu dengan indah.|A2
invullen|in|mengisi (formulir)|heeft ingevuld|in te vullen|Ik vul het formulier {in}.|Aku mengisi formulir.|Je moet alle vragen {in}vullen.|Kamu harus mengisi semua pertanyaan.|A2
oppassen|op|berhati-hati; menjaga|heeft opgepast|op te passen|Zij moet goed {op}passen.|Dia harus berhati-hati.|Gelukkig heeft hij goed {op}gepast.|Untung dia berhati-hati.|B1
uitstappen|uit|turun (dari kendaraan)|is uitgestapt|uit te stappen|Wij stappen bij de volgende halte {uit}.|Kami turun di halte berikutnya.|Ze zijn te vroeg {uit}gestapt.|Mereka turun terlalu cepat.|A2
terugkomen|terug|kembali|is teruggekomen|terug te komen|Hij komt morgen {terug}.|Dia kembali besok.|Zij is net {terug}gekomen.|Dia baru saja kembali.|A2
opruimen|op|membereskan|heeft opgeruimd|op te ruimen|Ik ruim mijn kamer {op}.|Aku membereskan kamarku.|Heb je al {op}geruimd?|Apakah kamu sudah membereskan?|A2
uitzetten|uit|mematikan|heeft uitgezet|uit te zetten|Zet je de muziek {uit}?|Maukah kamu mematikan musik?|Ik heb de computer {uit}gezet.|Aku mematikan komputer.|A2
afwassen|af|mencuci piring|heeft afgewassen|af te wassen|Wij wassen na het eten {af}.|Kami mencuci piring setelah makan.|Hij heeft de borden {af}gewassen.|Dia mencuci piring-piring.|A2
binnenkomen|binnen|masuk|is binnengekomen|binnen te komen|Kom maar {binnen}!|Silakan masuk!|De gasten zijn net {binnen}gekomen.|Para tamu baru saja masuk.|A2
meedoen|mee|ikut serta|heeft meegedaan|mee te doen|Doe je ook {mee}?|Kamu ikut juga?|Ik heb aan de wedstrijd {mee}gedaan.|Aku ikut dalam pertandingan.|A2
opschrijven|op|menuliskan|heeft opgeschreven|op te schrijven|Ik schrijf je adres {op}.|Aku menuliskan alamatmu.|Zij heeft alles in een schrift {op}geschreven.|Dia menuliskan semuanya di buku tulis.|A2
aanbieden|aan|menawarkan|heeft aangeboden|aan te bieden|De ober biedt ons koffie {aan}.|Pelayan menawari kami kopi.|Hij heeft mij een baan {aan}geboden.|Dia menawariku pekerjaan.|B1
afhalen|af|menjemput; mengambil (barang)|heeft afgehaald|af te halen|Ik haal het pakket morgen {af}.|Aku mengambil paket besok.|Wij hebben haar van het station {af}gehaald.|Kami menjemputnya dari stasiun.|B1
uitleggen|uit|menjelaskan|heeft uitgelegd|uit te leggen|De leraar legt de regel {uit}.|Guru menjelaskan aturan itu.|Kun je dat nog een keer {uit}leggen?|Bisakah kamu menjelaskannya sekali lagi?|A2
meebrengen|mee|membawakan|heeft meegebracht|mee te brengen|Ik breng een taart {mee}.|Aku membawakan kue tart.|Zij heeft cadeaus voor iedereen {mee}gebracht.|Dia membawakan hadiah untuk semua orang.|A2
inschrijven|in|mendaftar|heeft ingeschreven|in te schrijven|Ik schrijf mij voor de cursus {in}.|Aku mendaftar untuk kursus.|Hij heeft zich al {in}geschreven.|Dia sudah mendaftar.|B1
terugbellen|terug|menelepon kembali|heeft teruggebeld|terug te bellen|Ik bel je morgen {terug}.|Aku menelepon kamu kembali besok.|Zij heeft mij nog niet {terug}gebeld.|Dia belum menelepon aku kembali.|A2
opnemen|op|merekam; mengangkat (telepon)|heeft opgenomen|op te nemen|Hij neemt het gesprek {op}.|Dia merekam percakapan itu.|Heb je de telefoon {op}genomen?|Apakah kamu mengangkat telepon?|B1
weggaan|weg|pergi (meninggalkan tempat)|is weggegaan|weg te gaan|Ga niet {weg}!|Jangan pergi!|Zij is zonder iets te zeggen {weg}gegaan.|Dia pergi tanpa mengatakan apa-apa.|A2
wegbrengen|weg|mengantarkan (ke suatu tempat)|heeft weggebracht|weg te brengen|Ik breng de boeken morgen {weg}.|Aku mengantarkan buku-buku besok.|Hij heeft het pakket naar de post {weg}gebracht.|Dia mengantarkan paket ke kantor pos.|B1
aanpassen|aan|menyesuaikan|heeft aangepast|aan te passen|Ik pas het plan {aan}.|Aku menyesuaikan rencana itu.|Zij heeft haar planning {aan}gepast.|Dia menyesuaikan jadwalnya.|B1
uitzoeken|uit|memilih; menyelidiki|heeft uitgezocht|uit te zoeken|Wij zoeken een cadeau {uit}.|Kami memilih sebuah hadiah.|Hij heeft het probleem {uit}gezocht.|Dia menyelidiki masalah itu.|B1
inleveren|in|menyerahkan (tugas)|heeft ingeleverd|in te leveren|Wij leveren het werk morgen {in}.|Kami menyerahkan tugas besok.|Ik heb mijn opdracht al {in}geleverd.|Aku sudah menyerahkan tugasku.|B1
opeten|op|menghabiskan (makanan)|heeft opgegeten|op te eten|Hij eet zijn bord {op}.|Dia menghabiskan makanannya.|Wie heeft de koekjes {op}gegeten?|Siapa yang menghabiskan kue-kue itu?|B1
meespelen|mee|ikut bermain|heeft meegespeeld|mee te spelen|Speel je ook {mee}?|Kamu ikut bermain juga?|Hij heeft in het toneelstuk {mee}gespeeld.|Dia ikut main dalam drama itu.|B1
aanvragen|aan|mengajukan (permohonan)|heeft aangevraagd|aan te vragen|Ik vraag een visum {aan}.|Aku mengajukan visa.|Zij heeft een beurs {aan}gevraagd.|Dia mengajukan beasiswa.|B1
neerleggen|neer|meletakkan|heeft neergelegd|neer te leggen|Leg je telefoon even {neer}.|Letakkan ponselmu sebentar.|Hij heeft het boek op tafel {neer}gelegd.|Dia meletakkan buku di meja.|B1
uitzien|uit|tampak|heeft uitgezien|uit te zien|Je ziet er moe {uit}.|Kamu tampak lelah.|Het huis heeft er altijd mooi {uit}gezien.|Rumah itu selalu tampak bagus.|B1
rondkijken|rond|melihat-lihat|heeft rondgekeken|rond te kijken|Wij kijken even in de stad {rond}.|Kami melihat-lihat kota sebentar.|Zij hebben in het museum {rond}gekeken.|Mereka melihat-lihat di museum.|B1
meewerken|mee|ikut bekerja; bekerja sama|heeft meegewerkt|mee te werken|Iedereen werkt aan het project {mee}.|Semua orang ikut mengerjakan proyek itu.|Zij heeft goed {mee}gewerkt.|Dia bekerja sama dengan baik.|B1
afmaken|af|menyelesaikan|heeft afgemaakt|af te maken|Ik maak mijn werk vandaag {af}.|Aku menyelesaikan pekerjaanku hari ini.|Hij heeft zijn huiswerk nog niet {af}gemaakt.|Dia belum menyelesaikan PR-nya.|A2
uitrusten|uit|beristirahat|heeft uitgerust|uit te rusten|Na het werk rust ik {uit}.|Sepulang kerja aku beristirahat.|Wij hebben op het strand {uit}gerust.|Kami beristirahat di pantai.|B1
opgeven|op|menyerah; berhenti (kebiasaan)|heeft opgegeven|op te geven|Ik geef nooit {op}.|Aku tidak pernah menyerah.|Hij heeft het roken {op}gegeven.|Dia berhenti merokok.|B1
opladen|op|mengisi daya|heeft opgeladen|op te laden|Ik laad mijn telefoon {op}.|Aku mengisi daya ponselku.|Heb je de batterij al {op}geladen?|Apakah kamu sudah mengisi baterai?|B1
afsluiten|af|menutup; mengunci|heeft afgesloten|af te sluiten|Ik sluit de deur {af}.|Aku mengunci pintu.|Hij heeft zijn rekening {af}gesloten.|Dia menutup rekeningnya.|B1
terugsturen|terug|mengirim kembali|heeft teruggestuurd|terug te sturen|Ik stuur het pakket {terug}.|Aku mengirim paket itu kembali.|Zij heeft de brief {terug}gestuurd.|Dia mengirim surat itu kembali.|B1
opbouwen|op|membangun|heeft opgebouwd|op te bouwen|Zij bouwen een bedrijf {op}.|Mereka membangun sebuah perusahaan.|Hij heeft een goede naam {op}gebouwd.|Dia membangun nama baik.|B2
uitkijken|uit|waspada; menantikan|heeft uitgekeken|uit te kijken|Kijk {uit}, het is glad!|Awas, licin!|Hij heeft naar de vakantie {uit}gekeken.|Dia menantikan liburan.|B2
inschakelen|in|menyalakan; melibatkan|heeft ingeschakeld|in te schakelen|Ik schakel de computer {in}.|Aku menyalakan komputer.|Zij hebben een expert {in}geschakeld.|Mereka melibatkan seorang ahli.|B2
uitdelen|uit|membagikan|heeft uitgedeeld|uit te delen|De leraar deelt de boeken {uit}.|Guru membagikan buku-buku.|Zij heeft cadeaus {uit}gedeeld.|Dia membagikan hadiah.|B1
aantrekken|aan|memakai (pakaian)|heeft aangetrokken|aan te trekken|Ik trek mijn jas {aan}.|Aku memakai jaketku.|Hij heeft schone kleren {aan}getrokken.|Dia memakai pakaian bersih.|A2
uittrekken|uit|melepas (pakaian)|heeft uitgetrokken|uit te trekken|Zij trekt haar schoenen {uit}.|Dia melepas sepatunya.|Ik heb mijn jas {uit}getrokken.|Aku melepas jaketku.|A2
doorsturen|door|meneruskan|heeft doorgestuurd|door te sturen|Ik stuur de e-mail {door}.|Aku meneruskan email itu.|Zij heeft het bericht {door}gestuurd.|Dia meneruskan pesan itu.|B1
ophangen|op|menggantung; menutup telepon|heeft opgehangen|op te hangen|Hij hangt zijn jas {op}.|Dia menggantung jaketnya.|Zij heeft de telefoon {op}gehangen.|Dia menutup telepon.|B1
aanraden|aan|menyarankan|heeft aangeraden|aan te raden|Ik raad je dit boek {aan}.|Aku menyarankan buku ini padamu.|De dokter heeft rust {aan}geraden.|Dokter menyarankan istirahat.|B2
uitbreiden|uit|memperluas|heeft uitgebreid|uit te breiden|Wij breiden het huis {uit}.|Kami memperluas rumah itu.|Het bedrijf heeft zijn team {uit}gebreid.|Perusahaan memperluas timnya.|B2
opzoeken|op|mencari (di kamus); mengunjungi|heeft opgezocht|op te zoeken|Ik zoek het woord {op}.|Aku mencari kata itu di kamus.|Zij hebben hun oma {op}gezocht.|Mereka mengunjungi nenek mereka.|B1
bezoeken|be|mengunjungi|heeft bezocht|te bezoeken|Ik {be}zoek mijn oma elke zondag.|Aku mengunjungi nenekku tiap Minggu.|Wij hebben het museum {be}zocht.|Kami mengunjungi museum itu.|A2
betalen|be|membayar|heeft betaald|te betalen|Ik {be}taal de rekening.|Aku membayar tagihan.|Heb je al {be}taald?|Apakah kamu sudah membayar?|A2
begrijpen|be|mengerti|heeft begrepen|te begrijpen|Ik {be}grijp het niet.|Aku tidak mengerti.|Hij heeft de vraag niet {be}grepen.|Dia tidak mengerti pertanyaan itu.|A2
gebruiken|ge|menggunakan|heeft gebruikt|te gebruiken|Ik {ge}bruik een woordenboek.|Aku menggunakan kamus.|Zij heeft mijn pen {ge}bruikt.|Dia memakai penaku.|A2
herhalen|her|mengulang|heeft herhaald|te herhalen|Kunt u dat {her}halen?|Bisakah Anda mengulanginya?|Hij heeft zijn vraag {her}haald.|Dia mengulang pertanyaannya.|A2
ontmoeten|ont|bertemu (pertama kali)|heeft ontmoet|te ontmoeten|Wij {ont}moeten elkaar bij het station.|Kami bertemu di stasiun.|Ik heb haar gisteren {ont}moet.|Aku bertemu dengannya kemarin.|A2
ontbijten|ont|sarapan|heeft ontbeten|te ontbijten|Wij {ont}bijten om acht uur.|Kami sarapan pukul delapan.|Hij heeft niet {ont}beten.|Dia tidak sarapan.|A2
vergeten|ver|lupa|heeft vergeten|te vergeten|Ik {ver}geet altijd mijn sleutels.|Aku selalu lupa kunciku.|Zij heeft de afspraak {ver}geten.|Dia lupa janjinya.|A2
vertellen|ver|menceritakan|heeft verteld|te vertellen|Hij {ver}telt een mooi verhaal.|Dia menceritakan kisah yang indah.|Zij heeft mij alles {ver}teld.|Dia menceritakan semuanya padaku.|A2
verhuizen|ver|pindah rumah|is verhuisd|te verhuizen|Wij {ver}huizen volgende maand.|Kami pindah rumah bulan depan.|Ze zijn vorig jaar naar Rotterdam {ver}huisd.|Mereka pindah ke Rotterdam tahun lalu.|A2
vertrekken|ver|berangkat|is vertrokken|te vertrekken|De bus {ver}trekt over tien minuten.|Bus berangkat sepuluh menit lagi.|De trein is net {ver}trokken.|Kereta baru saja berangkat.|A2
beginnen|be|mulai|is begonnen|te beginnen|De les {be}gint om negen uur.|Pelajaran mulai pukul sembilan.|De film is al {be}gonnen.|Film itu sudah mulai.|A2
bestellen|be|memesan|heeft besteld|te bestellen|Wij {be}stellen twee koffie.|Kami memesan dua kopi.|Ik heb een pizza {be}steld.|Aku memesan pizza.|A2
beloven|be|berjanji|heeft beloofd|te beloven|Ik {be}loof dat ik kom.|Aku berjanji akan datang.|Hij heeft het mij {be}loofd.|Dia berjanji padaku.|B1
ontvangen|ont|menerima|heeft ontvangen|te ontvangen|Wij {ont}vangen veel post.|Kami menerima banyak surat.|Ik heb je bericht {ont}vangen.|Aku sudah menerima pesanmu.|B1
ontdekken|ont|menemukan|heeft ontdekt|te ontdekken|Zij {ont}dekt een nieuw café.|Dia menemukan kafe baru.|Wij hebben het strand {ont}dekt.|Kami menemukan pantai itu.|B1
verkopen|ver|menjual|heeft verkocht|te verkopen|Hij {ver}koopt zijn fiets.|Dia menjual sepedanya.|Ik heb mijn oude auto {ver}kocht.|Aku menjual mobil lamaku.|A2
verwachten|ver|mengharapkan; menduga|heeft verwacht|te verwachten|Wij {ver}wachten veel bezoekers.|Kami mengharapkan banyak pengunjung.|Ik heb dit niet {ver}wacht.|Aku tidak menduga ini.|B1
verzamelen|ver|mengumpulkan|heeft verzameld|te verzamelen|Hij {ver}zamelt oude munten.|Dia mengumpulkan koin lama.|Zij hebben geld {ver}zameld.|Mereka mengumpulkan uang.|B1
beantwoorden|be|menjawab|heeft beantwoord|te beantwoorden|Zij {be}antwoordt de vraag.|Dia menjawab pertanyaan itu.|Heb je mijn e-mail al {be}antwoord?|Apakah kamu sudah menjawab emailku?|B1
bedanken|be|berterima kasih|heeft bedankt|te bedanken|Ik {be}dank je voor de hulp.|Aku berterima kasih atas bantuanmu.|Hij heeft iedereen {be}dankt.|Dia berterima kasih kepada semua orang.|B1
behandelen|be|merawat; memperlakukan|heeft behandeld|te behandelen|De arts {be}handelt de patiënt.|Dokter merawat pasien itu.|Zij hebben ons goed {be}handeld.|Mereka memperlakukan kami dengan baik.|B2
herkennen|her|mengenali|heeft herkend|te herkennen|Ik {her}ken hem meteen.|Aku langsung mengenalinya.|Hij heeft mij niet {her}kend.|Dia tidak mengenaliku.|B1
gebeuren|ge|terjadi|is gebeurd|te gebeuren|Wat {ge}beurt er?|Apa yang terjadi?|Het ongeluk is gisteren {ge}beurd.|Kecelakaan itu terjadi kemarin.|B1
geloven|ge|percaya|heeft geloofd|te geloven|Ik {ge}loof je.|Aku percaya padamu.|Zij heeft hem nooit {ge}loofd.|Dia tidak pernah mempercayainya.|B1
genieten|ge|menikmati|heeft genoten|te genieten|Wij {ge}nieten van de zon.|Kami menikmati sinar matahari.|Ze hebben van de vakantie {ge}noten.|Mereka menikmati liburan.|B1
verdienen|ver|menghasilkan; pantas mendapat|heeft verdiend|te verdienen|Zij {ver}dient veel geld.|Dia menghasilkan banyak uang.|Hij heeft die prijs {ver}diend.|Dia pantas mendapat hadiah itu.|B1
verbieden|ver|melarang|heeft verboden|te verbieden|Mijn ouders {ver}bieden het.|Orang tuaku melarangnya.|Zij hebben roken {ver}boden.|Mereka melarang merokok.|B2
vergelijken|ver|membandingkan|heeft vergeleken|te vergelijken|Wij {ver}gelijken de prijzen.|Kami membandingkan harga.|Zij heeft de twee telefoons {ver}geleken.|Dia membandingkan kedua ponsel itu.|B2
beslissen|be|memutuskan|heeft besloten|te beslissen|Ik {be}slis morgen.|Aku memutuskan besok.|Wij hebben {be}sloten naar huis te gaan.|Kami memutuskan untuk pulang.|B2
bereiken|be|mencapai|heeft bereikt|te bereiken|Wij {be}reiken de top.|Kami mencapai puncak.|Hij heeft zijn doel {be}reikt.|Dia mencapai tujuannya.|B2
bekijken|be|melihat; memeriksa|heeft bekeken|te bekijken|Ik {be}kijk de foto's.|Aku melihat foto-foto itu.|Zij hebben het huis {be}keken.|Mereka melihat rumah itu.|B1
beschrijven|be|menggambarkan|heeft beschreven|te beschrijven|Kun je de man {be}schrijven?|Bisakah kamu menggambarkan pria itu?|Zij heeft de situatie goed {be}schreven.|Dia menggambarkan situasi itu dengan baik.|B2
herinneren|her|mengingatkan|heeft herinnerd|te herinneren|Ik {her}inner je aan de afspraak.|Aku mengingatkanmu pada janji itu.|Hij heeft mij aan mijn belofte {her}innerd.|Dia mengingatkanku pada janjiku.|B2
verliezen|ver|kehilangan; kalah|heeft verloren|te verliezen|Ik {ver}lies mijn sleutels vaak.|Aku sering kehilangan kunciku.|Zij hebben de wedstrijd {ver}loren.|Mereka kalah dalam pertandingan.|B1
vertalen|ver|menerjemahkan|heeft vertaald|te vertalen|Zij {ver}taalt de tekst.|Dia menerjemahkan teks itu.|Ik heb het boek {ver}taald.|Aku menerjemahkan buku itu.|B1
ontwikkelen|ont|mengembangkan|heeft ontwikkeld|te ontwikkelen|Zij {ont}wikkelen een nieuwe app.|Mereka mengembangkan aplikasi baru.|Het bedrijf heeft een product {ont}wikkeld.|Perusahaan mengembangkan sebuah produk.|B2
bevestigen|be|menegaskan; mengonfirmasi|heeft bevestigd|te bevestigen|Ik {be}vestig mijn reservering.|Aku mengonfirmasi reservasiku.|Hij heeft zijn komst {be}vestigd.|Dia mengonfirmasi kedatangannya.|B2
beschermen|be|melindungi|heeft beschermd|te beschermen|De muur {be}schermt ons tegen de wind.|Dinding itu melindungi kami dari angin.|Zij hebben de natuur {be}schermd.|Mereka melindungi alam.|B2
herstellen|her|memperbaiki|heeft hersteld|te herstellen|De monteur {her}stelt de fiets.|Montir memperbaiki sepeda itu.|Hij heeft de fout {her}steld.|Dia memperbaiki kesalahan itu.|B2`;
/* verba nyata tambahan (prefiks+stem) yang tidak ada di DNL — tidak boleh muncul sebagai pengecoh. Kurasi: stem|prefiks… */
const DNXS=`bellen|af door aan na op terug uit in her
komen|be ont aan op uit mee in door over na voor terug weg om neer toe bij rond los onder achter binnen af langs
staan|be ont ver op aan uit mee af in door over na voor terug weg om neer toe bij rond los onder achter langs
gaan|be ont ver op aan uit mee af in door over na voor terug weg om neer toe bij rond los onder achter langs
nemen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij rond onder achter
spreken|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter tegen
nodigen|be
stappen|op af aan in uit over door na voor terug weg om neer toe bij rond onder achter be ont ver
zetten|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij rond los onder achter
denken|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij rond onder achter
stellen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij rond onder achter
pakken|be ont ver op aan uit mee af in door over na voor terug weg om neer toe bij rond onder achter
vullen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij rond onder achter
passen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij rond onder achter
ruimen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
wassen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
doen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
schrijven|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
bieden|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
halen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter langs
leggen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
brengen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter langs
zoeken|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
leveren|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
eten|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
spelen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
vragen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
kijken|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter langs
werken|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
maken|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
rusten|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
geven|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
zien|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
zoeken|ver
kennen|be ont ver er
huizen|be
bruiken|ver
dienen|be
vangen|be ver
wachten|be
halen|ver
antwoorden|ver
trekken|be ont
beuren|ver
loven|ver
nieten|ver
dekken|be ver
bijten|ver
grijpen|ver
kopen|be
stellen|ver ont
laden|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
sluiten|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
sturen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
bouwen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
schakelen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
delen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
hangen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
raden|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
breiden|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
wikkelen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
vestigen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
schermen|be ont ver her op aan uit mee af in door over na voor terug weg om neer toe bij onder achter
trekken|aan op uit mee af in door over na voor terug weg om neer toe bij onder achter ver her`;
const DNP=DNL.split('\n').map(l=>{const a=l.split('|');return{inf:a[0],p:a[1],tr:a[2],perf:a[3],te:a[4],s:[a[5],a[7]],t:[a[6],a[8]],lv:a[9],aux:a[3].split(' ')[0],pp:a[3].split(' ')[1],stem:a[0].slice(a[1].length),sc:!DNON.includes(a[1])}});
const DNX={};for(const l of DNXS.split('\n')){const [s,p]=l.split('|');(DNX[s]=DNX[s]||new Set());for(const z of p.split(' '))DNX[s].add(z)}
const DNINF=new Set(DNP.map(x=>x.inf));
const DNSC=['op','aan','uit','mee','af','in','door','over','na','voor','terug','weg','om','neer','toe','bij','rond','los','onder','achter'],DNNZ=['er'];
const dnSh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
/* apakah prefiks+stem adalah verba nyata (di data atau DNX)? */
const dnReal=(p,stem)=>DNINF.has(p+stem)||!!(DNX[stem]&&DNX[stem].has(p));
function dnPrefOpts(x){const pool=DNON.concat(DNNZ,x.sc?DNSC:[]),ok=pool.filter(p=>p!=x.p&&!dnReal(p,x.stem)),pri=x.sc?ok.filter(p=>DNSC.includes(p)):ok.filter(p=>DNON.includes(p)),rest=ok.filter(p=>!pri.includes(p)),d=dnSh(pri).slice(0,4);
 for(const p of dnSh(rest)){if(d.length>=5)break;d.push(p)}
 for(const p of dnSh(DNSC)){if(d.length>=3)break;if(p!=x.p&&!d.includes(p)&&!dnReal(p,x.stem))d.push(p)}return dnSh([x.p].concat(d))}
function dnPpOpts(x){const a=x.aux,b=a=='heeft'?'is':'heeft',pp=x.pp,u=new Set();
 if(x.sc){const core=pp.slice(x.p.length);u.add(a+' ge'+pp);u.add(a+' '+x.p+core.replace(/^ge/,''));u.add(b+' '+pp);u.add(a+' '+core+' '+x.p);u.add(a+' ge'+x.inf)}
 else{u.add(a+' ge'+pp);u.add(a+' '+x.p+'ge'+pp.slice(x.p.length));u.add(b+' '+pp);u.add(a+' ge'+x.inf);u.add(a+' '+x.p+' '+pp.slice(x.p.length))}
 u.delete(x.perf);return dnSh([x.perf].concat(dnSh([...u]).slice(0,4)))}
function dnTeOpts(x){const u=new Set();
 if(x.sc){u.add('te '+x.inf);u.add(x.p+'te '+x.stem);u.add(x.inf+' te');u.add('te '+x.p+' '+x.stem)}
 else{u.add(x.p+' te '+x.stem);u.add(x.inf+' te');u.add('te '+x.p+' '+x.stem);u.add('te ge'+x.inf)}
 u.delete(x.te);return dnSh([x.te].concat(dnSh([...u]).slice(0,4)))}
const dnKeys=s=>new Set(s.split(/;|\//).map(z=>z.replace(/\(.*?\)/g,'').trim().split(' ')[0].toLowerCase().slice(0,5)).filter(Boolean));
function dnArOpts(x){const kx=dnKeys(x.tr),cand=dnSh(DNP.filter(y=>y!==x&&![...dnKeys(y.tr)].some(k=>kx.has(k)))).sort((a,b)=>((b.stem==x.stem||b.p==x.p)?1:0)-((a.stem==x.stem||a.p==x.p)?1:0)||0),out=[x],used=new Set(kx);
 for(const y of cand){if(out.length>=5)break;const ky=dnKeys(y.tr);if([...ky].some(k=>used.has(k)))continue;ky.forEach(k=>used.add(k));out.push(y)}
 return dnSh(out.map(y=>y.inf))}
function dnCells(o){const c=[],M=o.modes||[];
 for(const x of DNP){
  if(M.includes('pf'))for(const n of [0,1])c.push({k:'dn|pf|'+x.inf+'|'+(n+1),m:'pf',x,n,lv:x.lv});
  for(const m of ['pp','te','ty','ar'])if(M.includes(m))c.push({k:'dn|'+m+'|'+x.inf,m,x,lv:x.lv})}
 return c}
function dnMake(cell){const m=cell.m,x=cell.x,base={g:'dtn',k:cell.k,L:'nl'},typ=x.sc?'scheidbaar (prefiks terpisah dari verba)':'onscheidbaar (prefiks melekat)';
 if(m=='pf'){const s=x.s[cell.n],full=s.replace(/[{}]/g,''),bl=s.split(/\{[^}]+\}/);
  return Object.assign(base,{cell:'Trennbar NL · pilih prefiks',blanks:[{lab:'Prefiks',opts:dnPrefOpts(x),ok:[x.p],soft:[]}],parts:[bl[0],0,bl[1]||''],tr:x.t[cell.n],expl:`<b>${esc(x.inf)}</b> (${esc(x.tr)}) — ${typ}.<br>${esc(full)}<br><small>Perfectum: ${esc(x.perf)} · te-infinitief: ${esc(x.te)}</small>`,fullTxt:full,say:()=>full})}
 if(m=='pp')return Object.assign(base,{cell:'Trennbar NL · voltooid deelwoord',blanks:[{lab:'Perfectum',opts:dnPpOpts(x),ok:[x.perf],soft:[]}],parts:[`${x.inf}  (${x.tr})  →  `,0],tr:'',expl:`<b>${esc(x.inf)}</b> — ${typ}: <b>${esc(x.perf)}</b>${x.sc?' (ge- di antara prefiks dan stem)':' (tanpa ge-)'}.<br>${esc(x.s[1].replace(/[{}]/g,''))} — ${esc(x.t[1])}`,fullTxt:x.perf,say:()=>x.perf});
 if(m=='te')return Object.assign(base,{cell:'Trennbar NL · te-infinitief',blanks:[{lab:'Te-infinitief',opts:dnTeOpts(x),ok:[x.te],soft:[]}],parts:[`${x.inf}  (${x.tr})  →  `,0],tr:'',expl:`<b>${esc(x.inf)}</b> — ${typ}: <b>${esc(x.te)}</b>${x.sc?' (te di antara prefiks dan stem)':' (te di depan verba)'}.`,fullTxt:x.te,say:()=>x.te});
 if(m=='ty'){const A='Scheidbaar (terpisah)',B='Onscheidbaar (melekat)';return Object.assign(base,{cell:'Trennbar NL · scheidbaar atau onscheidbaar',blanks:[{lab:'Jenis',opts:[A,B],ok:[x.sc?A:B],soft:[]}],parts:[`${x.inf}  (${x.tr})  →  `,0],tr:'',expl:`<b>${esc(x.inf)}</b> — ${typ}.${x.sc?' Prefiks op/aan/uit/mee/af/in … ditekankan dan dilepas: '+esc(x.s[0].replace(/[{}]/g,'')):' Prefiks be-/ge-/her-/ont-/ver- tidak ditekankan dan tak pernah dilepas: '+esc(x.s[0].replace(/[{}]/g,''))}`,fullTxt:x.inf,say:()=>x.inf})}
 if(m=='ar')return Object.assign(base,{cell:'Trennbar NL · arti → verba',blanks:[{lab:'Verba',opts:dnArOpts(x),ok:[x.inf],soft:[]}],parts:[`“${x.tr}”  →  `,0],tr:'',expl:`<b>${esc(x.inf)}</b> = ${esc(x.tr)} — ${typ}.<br>${esc(x.s[0].replace(/[{}]/g,''))} — ${esc(x.t[0])}`,fullTxt:x.inf,say:()=>x.inf});
 return null}
GXX.dtn={pre:'dn|',lvl:['A2','B1','B2'],modes:DNM,def:{n:8,r:200,modes:['pf','pp','te','ty','ar']},cells:dnCells,make:dnMake,
 note:'<small>Scheidbare werkwoorden (opbellen, aankomen …) dan onscheidbare (bezoeken, betalen …). Level kosong = semua level.</small>'};
GXL.push({id:'dtn',ic:'op',t:'Trennbar & Untrennbar Belanda',d:'Scheidbaar & onscheidbaar dalam satu game: opbellen (heeft opgebeld, op te bellen) vs bezoeken (heeft bezocht, te bezoeken). Pilih prefiks, voltooid deelwoord, te-infinitief, jenis, atau arti → verba.',tag:'NL',lg:'nl'});
