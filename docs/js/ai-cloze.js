/* ===== Kelas AI · Cloze (v7.90): prompt soal Grammar Cloze per bahasa + impor hasil AI ke game gcl_xx =====
   Alur: Pustaka → Kelas AI → “🧩 Soal Cloze game” (atau tombol di game Grammar Cloze) → pilih bahasa + LEVEL MAKSIMUM
   → salin prompt → tempel hasil AI → soal masuk ke GXO('gcl_<L>').uq[idKartu] (bentuk soal sama dengan bank GCX,
   ditambah uid di indeks 6; kunci SRS 'gc|<idKartu>|u<uid>'). Soal bank bawaan tidak disentuh.
   BATAS LEVEL: (1) prompt melarang unsur di atas level maksimum; (2) tiap soal wajib menyebut level tertingginya (kolom 7)
   dan pengimpor MENOLAK soal yang levelnya di atas batas. Modul ini hanya memakai data/fungsi lain saat dipanggil. */
const ACZ={
 zh:{rom:1,fmt:'Tulis kalimat hanzi dengan SPASI antar kata (seperti data kartu), mis. “我 在 家 里 看 书”→ per kata: “我 在 家里 看 书”. Jangan pakai ？ di tengah kalimat (hanya di akhir). Tulis 儿 menyatu dengan katanya (这儿, 玩儿). Kolom romanisasi = pinyin bertanda nada seluruh kalimat dengan jawaban utama terisi.',
  gap:'Celah = TEPAT bagian yang diajarkan kartu (partikel, kata bantu, pola tetap, kata tanya, penggolong, kata penghubung). Untuk pola berpasangan (不但…而且) pakai 2 celah. Kartu “predikat tanpa 是” jangan memakai 是 sebagai jawaban; kartu angka jangan memakai celah angka bebas.',
  ex:'我 很 好，你 ___？ | 呢 | Saya baik, bagaimana denganmu? | menanyakan hal yang sama pada lawan bicara | Wǒ hěn hǎo, nǐ ne? | 吗~吧 | HSK 1',
  up:{'HSK 1':'pola dasar saja: 是, 有, 不/没, 吗/呢, 在, 很, 都, 也, 的, 了 sederhana','HSK 2':'比, 过, 因为…所以, 还是, 要…了, 正在, 一边…一边, 先…再, 离, 从…到','HSK 3':'把, 被, 虽然…但是, 如果…就, 连…都, 越来越, 只要…就, 除了…以外, 得 (komplemen derajat/hasil), 一…就','HSK 4':'不但…而且, 即使…也, 否则, 并且, 尽管…但是, 与其…不如, 无论…都, 之所以…是因为, 倒是, 简直','HSK 5':'何况, 难免, 以便, 反而, 固然, 以至于, 不免, 免得, 况且, 与其说…不如说'}},
 ja:{rom:1,fmt:'Tulis kalimat Jepang asli (kanji+kana) natural; letakkan ___ tepat di posisi celah (tanpa spasi kecuali di sekitar ___ bila perlu). Kolom romanisasi = romaji seluruh kalimat dengan jawaban utama terisi. Kana/kanji ikuti kebiasaan penulisan kartu lain.',
  gap:'Celah = TEPAT bagian yang diajarkan kartu (partikel, bentuk kata kerja/sifat, akhiran pola, kata penghubung pola tetap). Bila bentuk kata kerja yang diuji, celahnya bentuk lengkap kata kerja itu (mis. 食べ___ → jangan; pakai satu celah penuh). Daftar semua alternatif sah (kanji/kana: 見る~みる).',
  ex:'私は 毎朝 コーヒー___ 飲みます。 | を | Saya minum kopi setiap pagi. | partikel objek | Watashi wa maiasa kōhī o nomimasu. | が~は | N5',
  up:{'N5':'です/ます, partikel dasar (は が を に で へ と の も), bentuk て/た/ない dasar, ～たい','N4':'受身, 使役, ～そうだ, ～ようにする, ～たら, ～ば, ～なければならない, ～ことがある, ～でしょう','N3':'～わけだ, ～ことになる, ～ばかり, ～ながら (lanjut), ～させられる, ～はず, ～みたい, ～がち, ～において','N2':'～にもかかわらず, ～をめぐって, ～につけ, ～かねない, ～ざるを得ない, ～に違いない, ～に先立って','N1':'～ともなると, ～をものともせず, ～極まりない, ～いかんによらず, ～に至っては, ～をもって'}},
 de:{rom:0,fmt:'Kalimat Jerman natural, huruf besar kata benda. Jawaban pakai ejaan Jerman asli; ä/ö/ü/ß boleh ditulis ae/oe/ue/ss oleh pemain (tidak perlu kamu daftar). Kolom romanisasi KOSONG.',
  gap:'Celah = TEPAT bagian yang diajarkan kartu (artikel/akhiran sesuai kasus, preposisi, konjungsi, bentuk kata kerja, kata ganti, posisi kata kerja → pakai kata kerja finit sebagai celah). Preposisi dgn kasus: celah = preposisinya saja, kecuali kartu menguji artikel/akhiran.',
  ex:'Ich fahre ___ dem Bus zur Arbeit. | mit | Saya naik bus ke tempat kerja. | preposisi + Dativ | | zu~von | A1',
  up:{'A1':'Präsens, Nominativ/Akkusativ, V2, kata kerja modal dasar, ja/nein/kein','A2':'Perfekt, Dativ, weil/dass/wenn, kata kerja terpisah, Komparativ/Superlativ, Präteritum sein/haben/modal, Wechselpräpositionen','B1':'Passiv, Konjunktiv II, Relativsätze, Genitiv, Plusquamperfekt, obwohl/damit/um…zu, n-Deklination, werden + Infinitiv','B2':'Partizipialattribute sederhana, Konjunktiv I, Nominalisierung, Passiv dgn modal, je…desto, konnektor formal (somit, folglich, indessen)','C1':'erweiterte Partizipialattribute, Funktionsverbgefüge, konstruksi nominal-formal, Konjunktiv I lanjut'}},
 nl:{rom:0,fmt:'Kalimat Belanda natural. Kolom romanisasi KOSONG.',
  gap:'Celah = TEPAT bagian yang diajarkan kartu (de/het, kata ganti, preposisi, konjungsi, bentuk kata kerja, er, posisi kata kerja → kata kerja finit/partisip sebagai celah). Daftar semua alternatif sah (je~jij hanya bila keduanya benar).',
  ex:'Ik heb ___ boek gekocht. | een | Saya membeli sebuah buku. | artikel tak tentu | | het~de | A1',
  up:{'A1':'V2, de/het, hebben/zijn, ontkenning geen/niet dasar, present','A2':'voltooid (hebben/zijn), modal, er, scheidbare werkwoorden, imperfectum sederhana, bijzin dasar','B1':'passief, bijzin kata kerja akhir, relatieve zin (die/dat/waar-), imperfectum luas, te + infinitief, om…te','B2':'conditionalis (zou/had), passief luas, voorwaardelijke bijzin kompleks, participiumconstructies, formele voegwoorden','C1':'participia attributif, formele register, idiom & vaste verbindingen, nominalisering','C2':'stilistische varianten, archaïsche/vorm formal, verfijnde nuances'}},
 en:{rom:0,fmt:'Kalimat Inggris natural. Kolom romanisasi KOSONG.',
  gap:'Celah = TEPAT bagian yang diajarkan kartu (auxiliary/modal, bentuk kata kerja, artikel, preposisi, konjungsi, kata penghubung, kolokasi). Daftar semua alternatif sah (contraction: don’t~do not).',
  ex:'She ___ to school every day. | goes | Dia pergi ke sekolah setiap hari. | present simple orang ketiga | | go~went | A1',
  up:{'A1':'to be, present simple, can, imperatif, there is/are','A2':'past simple, present continuous, going to, komparatif/superlatif, must/have to, some/any','B1':'present perfect, conditional 0/1/2, passive dasar, reported speech dasar, relative clause, used to, gerund vs infinitive','B2':'third conditional, mixed conditional, passive lanjut, wish/if only, modal perfect (should have), reported speech lanjut, future perfect','C1':'inversion, cleft sentences, subjunctive, ellipsis, nominalisation, advanced modality','C2':'archaic/literary forms, fine nuance, rare idiom & register formal'}},
 eo:{rom:0,fmt:'Kalimat Esperanto natural; boleh ditulis dengan ĉ ĝ ĥ ĵ ŝ ŭ (atau cx gx hx jx sx ux). Kolom romanisasi KOSONG.',
  gap:'Celah = TEPAT bagian yang diajarkan kartu (akhiran kelas kata, -n akusatif, korelatif, afiks, preposisi, partisip). Untuk afiks: celah = kata utuh yang berafiks. Daftar alternatif sah.',
  ex:'Mi vidas ___ hundon. | la | Saya melihat anjing itu. | artikel + objek (-n) | | unu~tiun | A1',
  up:{'A1':'-o/-a/-e/-j/-n, -as/-is/-os, la, korelatif dasar (kio, tio, kiu)','A2':'-us/-u, preposisi umum, afiks dasar (mal-, -ej-, -ul-), korelatif lanjut (ĉi-, neni-)','B1':'partisip aktif -ant-/-int-/-ont-, -ig-/-iĝ-, tabel korelatif penuh, pronomo refleksif si','B2':'partisip pasif -at-/-it-/-ot-, afiks lanjut (-ad-, -aĵ-, -ind-, -ebl-), konstruksi ĉar/tamen/kvankam, ke-klaŭzo kompleks','C1':'ĉirkaŭ-/dis-/ek-, wortbildung kompleks, gaya sastra, nuansa -um-','C2':'idiom, gaya arkaik, konstruksi sangat jarang'}}};
const aczO=()=>{const o=S.o;if(!o.aczN)o.aczN=10;if(!o.aczP)o.aczP=2;if(!o.aczCap||typeof o.aczCap!='object')o.aczCap={};return o};
const aczLvs=L=>(typeof GCV!='undefined'&&GCV[L])||[];
const aczNm=s=>String(s==null?'':s).toUpperCase().replace(/\s+/g,'');
/* teks level (“B1”, “HSK 3”, “HSK3”, “N3”, “3”) → indeks pada GCV[L]; -1 bila tak dikenal */
function aczLv(L,s){const v=aczLvs(L),t=aczNm(s);if(!t)return-1;let i=v.findIndex(x=>aczNm(x)==t);if(i>=0)return i;if((L=='zh')&&/^\d$/.test(t)){i=v.findIndex(x=>aczNm(x)=='HSK'+t);if(i>=0)return i}return-1}
const aczUq=L=>{const o=GXO('gcl_'+L);if(!o.uq||typeof o.uq!='object')o.uq={};return o.uq};
const aczCnt=(L,g)=>((typeof GCX!='undefined'&&GCX[g[0]])||[]).length+((aczUq(L)[g[0]])||[]).length;
const aczClean=s=>typeof aiClean=='function'?aiClean(s):String(s||'').replace(/\s+/g,' ').trim();
/* kartu grammar bahasa L dengan level ≤ cap (indeks) */
function aczCards(L,cap){const v=aczLvs(L);return(gcCards()[L]||[]).filter(g=>{const r=v.indexOf(gcLv(g));return r>=0&&r<=cap})}
/* pilih N kartu: paling sedikit soal dulu, lalu level terendah, lalu acak */
function aczPick(L,cap,N,jit){const v=aczLvs(L),j=jit==null?1:jit;return aczCards(L,cap).map(g=>({g,n:aczCnt(L,g),r:v.indexOf(gcLv(g)),j:Math.random()*j})).sort((a,b)=>a.n-b.n||a.r-b.r||a.j-b.j).slice(0,N).map(x=>x.g)}
const aczLine=(g,i,L)=>{const ex=(g[7]||[]).slice(0,1).map(e=>String(e).split('\n').join(' | ')),have=[...((typeof GCX!='undefined'&&GCX[g[0]])||[]),...(aczUq(L)[g[0]]||[])].slice(0,3).map(q=>String(q[0]).replace(/\s+/g,' '));
 return`#${i+1} [${gcLv(g)}] ${g[4]}${g[5]&&g[5]!=g[4]?' — fungsi: '+aczClean(g[5]):''}${g[6]?' — pola: '+aczClean(String(g[6]).split('\n')[0]):''}`+(ex.length?`\n   contoh materiku: ${ex[0]}`:'')+(have.length?`\n   soal yang sudah ada (JANGAN diulang / dibuat mirip): ${have.join(' // ')}`:'')};
/* prompt lengkap */
function aczBuild(L,capIdx,cards,per){const A=ACZ[L],nm=GCN[L],v=aczLvs(L),cap=v[capIdx],allow=v.slice(0,capIdx+1),hi=v.slice(capIdx+1),N=cards.length;
 const forb=hi.map(x=>`${x}: ${A.up[x]}`),mine=allow.map(x=>`${x}: ${A.up[x]}`);
 const head=`Buatkan soal Grammar Cloze (kalimat rumpang) bahasa ${nm} untuk game latihanku (penutur Indonesia). Level MAKSIMUM yang kupilih: ${cap}. Untuk tiap kartu grammar di bawah buat TEPAT ${per} soal berbeda (total ${N*per} soal).`;
 const lv=[`ATURAN LEVEL (WAJIB & KERAS — soal yang melanggar akan DITOLAK otomatis oleh aplikasi):`,
  `1. Level yang boleh dipakai: ${allow.join(', ')}. Unsur level yang sama atau LEBIH RENDAH dari ${cap} boleh masuk. Dilarang keras ada unsur di atas ${cap}${hi.length?' ('+hi.join(', ')+')':''} — baik tata bahasa, kosakata, maupun ungkapan.`,
  hi.length?`2. Struktur yang baru muncul di level lebih tinggi sehingga DILARANG di kalimatmu (di luar celah pun):\n   ${forb.join('\n   ')}`:`2. ${cap} adalah level tertinggi bahasa ini; tetap pakai kalimat yang jelas dan natural.`,
  `3. Struktur yang boleh dipakai sebagai kerangka (≤ ${cap}):\n   ${mine.join('\n   ')}`,
  `4. Kosakata: pilih kata paling umum dan sederhana (level ≤ ${cap}). Bila ragu apakah sebuah kata atau struktur melebihi ${cap}, GANTI dengan yang lebih sederhana. Kartu level rendah tetap dibuat pada level kartunya; jangan sengaja menaikkan kalimat ke ${cap}.`,
  `5. Kolom 7 tiap soal = level TERTINGGI unsur apa pun di kalimat itu (tata bahasa atau kosakata), memakai penulisan: ${v.join(' / ')}. Jujur: bila ada unsur di atas ${cap}, kamu salah — tulis ulang kalimatnya, jangan sekadar menurunkan angka.`];
 const cards_=`KARTU (nomor #n dipakai untuk mencocokkan; kerjakan berurutan):\n`+cards.map((g,i)=>aczLine(g,i,L)).join('\n');
 const fmt=`FORMAT OUTPUT (satu soal = satu baris, TEPAT 7 kolom dipisah “ | ”; kolom kosong tetap ditulis sebagai “| |”):\n#1 Judul kartu persis seperti daftar\nkalimat dengan ___ | jawaban | terjemah Indonesia | petunjuk singkat | romanisasi | pengecoh terlarang | level\n(${per} baris soal untuk #1) lalu satu baris kosong, lanjut ke #2 dst. sampai #${N}.\nContoh satu baris soal:\n${A.ex}`;
 const r=[`Kolom 1: kalimat ${nm} utuh dan natural dengan celah “___” (tiga garis bawah) tepat di bagian yang diajarkan kartu. ${A.fmt}`,
  `Kolom 2 = jawaban. Alternatif yang SAH dipisah “~” (yang pertama = utama). Bila ada lebih dari satu celah, jawaban per celah dipisah “;” (mis. 不但~不仅;而且~也). Hanya boleh ada SATU jawaban benar yang tak ambigu: daftarkan SEMUA alternatif yang juga benar.`,
  `Kolom 3 = terjemah bahasa Indonesia yang natural. Kolom 4 = petunjuk singkat tanpa membocorkan jawaban (mis. “kata kerja penghubung”).`,
  A.rom?`Kolom 5 WAJIB diisi: romanisasi kalimat penuh dengan jawaban utama terisi (aturan romanisasi ada di aturan kolom 1).`:`Kolom 5 dikosongkan (bahasa ini tanpa romanisasi).`,
  `Kolom 6 = kata yang bisa juga benar di kalimat itu tetapi tidak kamu daftarkan sebagai jawaban (agar tidak dipakai sebagai pengecoh), dipisah “~”; kosongkan bila tidak ada.`,
  A.gap,`Variasikan jenis kalimat, subjek, dan konteks; jangan menyalin contoh materiku. Jangan ada dua soal yang hampir sama. Jangan memakai kata “null”, “undefined”, atau “NaN”.`,
  `Tanpa hiasan: tanpa **tebal**, tabel, bullet, emoji, nomor di awal soal, atau blok kode; tanpa kalimat pembuka/penutup. Hanya baris “#n Judul” dan baris soal.`,
  `Sebelum menjawab, hitung: ${N} kartu × ${per} soal = ${N*per} baris soal. Bila jawabanmu terpotong dan aku mengetik “lanjut”, teruskan dari kartu berikutnya dengan format sama tanpa mengulang.`];
 return[head,lv.join('\n'),cards_,fmt,'ATURAN FORMAT:\n'+r.map((x,i)=>`${i+1}. ${x}`).join('\n')].join('\n\n')}
/* ---------- impor: teks hasil AI → soal tervalidasi ---------- */
function aczMapIds(L){const o=S.o;return o.aczMap&&o.aczMap.L==L&&Array.isArray(o.aczMap.ids)?o.aczMap.ids:[]}
function aczParse(text,L,capIdx,ids){const out=[],bad=[],A=ACZ[L],cards=gcCards()[L]||[],byId={},byT={};cards.forEach(g=>{byId[g[0]]=g;byT[aczNm(g[4])]=g});
 let cur=null,ln=0;const cap=aczLvs(L)[capIdx];
 const seen=new Set();for(const g of cards)for(const q of [...((typeof GCX!='undefined'&&GCX[g[0]])||[]),...(aczUq(L)[g[0]]||[])])seen.add(g[0]+'\u0001'+aczNm(q[0]));
 const per={};
 String(text||'').replace(/\r/g,'').split('\n').forEach(raw=>{ln++;let s=raw.trim();if(!s||/^(\/\/|```)/.test(s))return;
  const h=s.match(/^#\s*(\d+)\s*[.:)\-–—]?\s*(.*)$/);
  if(h){const n=+h[1],t=h[2].replace(/^\[[^\]]*\]\s*/,'').trim();let g=null;
   if(ids[n-1])g=byId[ids[n-1]];
   if(t){const gt=byT[aczNm(t)];if(gt&&(!g||aczNm(g[4])!=aczNm(t)))g=gt}
   cur=g||null;if(!cur)bad.push({ln,why:`kartu #${n} tidak dikenali (cek nomor/judul)`});return}
  if(s.indexOf('|')<0)return;
  s=s.replace(/^(?:[-*•]\s+|\d+[.)]\s+)/,'');
  if(!cur){bad.push({ln,why:'soal tanpa baris “#n Judul” di atasnya'});return}
  const c=s.split('|').map(x=>x.trim());while(c.length<7)c.push('');
  if(c.length>7){bad.push({ln,why:'kolom lebih dari 7 (tanda “|” di dalam teks?)'});return}
  const sent=c[0].replace(/_{2,}|＿{2,}/g,'___');
  const ng=(sent.match(/___/g)||[]).length;
  if(ng<1||ng>3){bad.push({ln,why:'kalimat harus memuat 1–3 celah “___”'});return}
  if(!c[1]||!c[2]){bad.push({ln,why:'jawaban / terjemahan kosong'});return}
  if(/\b(null|undefined|NaN)\b/i.test(s)){bad.push({ln,why:'memuat kata null/undefined/NaN'});return}
  const lv=aczLv(L,c[6]);
  if(lv<0){bad.push({ln,why:`level “${c[6]||'kosong'}” tidak dikenal (pakai ${aczLvs(L).join('/')})`});return}
  if(lv>capIdx){bad.push({ln,why:`level ${aczLvs(L)[lv]} melebihi batas ${cap}`});return}
  if(A.rom&&!c[4]){bad.push({ln,why:'romanisasi (kolom 5) wajib untuk bahasa ini'});return}
  if(L=='zh'&&/[？?]/.test(sent.slice(0,-1))){bad.push({ln,why:'tanda tanya hanya boleh di akhir kalimat zh'});return}
  const gs=c[1].split(';').map(z=>z.split('~').map(y=>y.trim()).filter(Boolean));
  if(gs.length!=ng||gs.some(z=>!z.length)){bad.push({ln,why:`jumlah jawaban (${gs.length}) ≠ jumlah celah (${ng})`});return}
  if(gs.some(z=>z.some(y=>y.indexOf('___')>=0))){bad.push({ln,why:'jawaban memuat “___”'});return}
  const k=cur[0]+'\u0001'+aczNm(sent);if(seen.has(k)){bad.push({ln,why:'duplikat soal yang sudah ada'});return}
  per[cur[0]]=(per[cur[0]]||0)+1;if(((aczUq(L)[cur[0]]||[]).length+per[cur[0]])>20){bad.push({ln,why:'satu kartu maksimal 20 soal tambahan'});return}
  seen.add(k);
  const ban=c[5]?c[5].split('~').map(y=>y.trim()).filter(Boolean):[];
  out.push({id:cur[0],q:[sent,ng<2?gs[0]:gs.map(z=>z.length>1?z:z[0]),c[2],c[3],c[4],ban]})});
 return{ok:out,bad}}
/* simpan soal yang lolos; kembalikan jumlah */
function aczAdd(L,items){const o=GXO('gcl_'+L),uq=aczUq(L);if(!o.uqn)o.uqn=0;let n=0;for(const it of items){(uq[it.id]||(uq[it.id]=[])).push([...it.q,++o.uqn]);n++}
 if(typeof GCP!='undefined')GCP[L]=0;if(typeof save=='function')save();return n}
function aczClear(L){const o=GXO('gcl_'+L);o.uq={};if(typeof GCP!='undefined')GCP[L]=0;if(typeof save=='function')save()}
const aczCount=L=>{const u=aczUq(L);let k=0,q=0;for(const id in u){if(u[id].length){k++;q+=u[id].length}}return{k,q}};
/* ---------- dialog ---------- */
let aczS=null;
function aczClose(){const m=document.getElementById('aczm');if(m)m.remove();document.body.style.overflow='';aczS=null}
function aczLangs(){return(typeof GCLG!='undefined'?GCLG:[]).filter(l=>ACZ[l]&&(gcCards()[l]||[]).length)}
function aczOpen(L){if(typeof aiClose=='function'&&document.getElementById('aim'))aiClose();aczClose();const ls=aczLangs();if(!ls.length)return;if(!ls.includes(L))L=ls[0];
 const o=aczO(),v=aczLvs(L);let c=o.aczCap[L];if(c==null||c<0||c>=v.length)c=Math.min(1,v.length-1);
 aczS={L,cap:c,cards:aczPick(L,c,o.aczN),inp:'',rep:''};
 const m=document.createElement('div');m.id='aczm';m.className='edm';m.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="Kelas AI Cloze"><div class=edh><div><b>🧩 Kelas AI · soal Cloze game</b><small>Prompt → tempel hasil → masuk ke game Grammar Cloze</small></div><button class=mini data-acz=close aria-label=Tutup>✕</button></div><div class=edb></div><div class="edf aif"><button class=pri data-acz=copy>Salin prompt</button><div class=aisites><a data-acz=site href="https://chatgpt.com/" target=_blank rel=noopener>ChatGPT</a><a data-acz=site href="https://claude.ai/new" target=_blank rel=noopener>Claude</a><a data-acz=site href="https://gemini.google.com/app" target=_blank rel=noopener>Gemini</a></div></div></div>`;
 document.body.appendChild(m);document.body.style.overflow='hidden';aczPanel()}
function aczText(){const s=aczS;return s&&s.cards.length?aczBuild(s.L,s.cap,s.cards,aczO().aczP):''}
function aczPanel(){const s=aczS,m=document.getElementById('aczm');if(!s||!m)return;const o=aczO(),L=s.L,v=aczLvs(L),ch=(a,val,on,t)=>`<button class="chip${on?' on':''}" data-acz=${a} data-v="${val}">${t}</button>`,u=aczCount(L);
 const txt=aczText(),hi=v.slice(s.cap+1);
 m.querySelector('.edb').innerHTML=`<div class=aio><small>Bahasa</small><div class=chips>${aczLangs().map(l=>ch('lang',l,l==L,esc(GCN[l]))).join('')}</div></div>`+
 `<div class=aio><small>Level MAKSIMUM (level ini dan di bawahnya boleh; yang di atasnya dilarang &amp; ditolak)</small><div class=chips>${v.map((x,i)=>ch('cap',i,i==s.cap,esc(x))).join('')}</div></div>`+
 `<div class=aio><small>Jumlah kartu per prompt</small><div class=chips>${[5,10,15,20].map(n=>ch('n',n,o.aczN==n,n)).join('')}</div></div>`+
 `<div class=aio><small>Soal per kartu</small><div class=chips>${[2,3,4].map(n=>ch('p',n,o.aczP==n,n)).join('')}</div></div>`+
 `<div class=aidest><b>📊 ${esc(GCN[L])} · sampai ${esc(v[s.cap])}</b><small>${aczCards(L,s.cap).length} kartu grammar masuk batas level${hi.length?' (tidak ikut: '+esc(hi.join(', '))+')':''}. Kartu dipilih yang soalnya paling sedikit (bank bawaan + tambahanmu). Soal tambahan tersimpan di perangkat ini: ${u.q} soal untuk ${u.k} kartu.${u.q?` <button class=chip data-acz=clear>Hapus semua soal tambahan</button>`:''}</small></div>`+
 `<div class=aio style="margin-top:8px"><div class=aih><small>Kartu di prompt ini (${s.cards.length})</small><button class=mini data-acz=reroll>↻ Acak ulang</button></div><div class=aigr>${s.cards.map(g=>`<span class="aitg ${aczCnt(L,g)?'t2':'t1'}">${esc(g[4])} [${esc(gcLv(g))}] · ${aczCnt(L,g)} soal</span>`).join('')||'<small>Tidak ada kartu.</small>'}</div></div>`+
 `<div class=aio style="margin-top:12px"><div class=aih><small>Pratinjau prompt <i class=aicnt>${txt.length.toLocaleString('id-ID')} karakter</i> — boleh diedit sebelum disalin</small></div><textarea id=aczTxt spellcheck=false>${esc(txt)}</textarea></div>`+
 `<div class=aio style="margin-top:12px"><div class=aih><small>Tempel hasil AI di sini</small></div><textarea id=aczIn rows=6 spellcheck=false placeholder="#1 Judul kartu&#10;kalimat ___ | jawaban | terjemah | petunjuk | romanisasi | pengecoh | level">${esc(s.inp)}</textarea><button class=pri data-acz=import style="margin-top:6px">Tambahkan ke game</button><div id=aczRep>${s.rep}</div></div>`}
function aczReport(res,n,cap){const f=x=>esc(String(x));let h=`<small><b>✓ ${n} soal ditambahkan ke game Grammar Cloze.</b>${res.bad.length?` ${res.bad.length} baris ditolak:`:''}</small>`;
 if(res.bad.length)h+='<ul style="margin:4px 0 0 16px;font-size:.8rem">'+res.bad.slice(0,12).map(b=>`<li>baris ${b.ln}: ${f(b.why)}</li>`).join('')+(res.bad.length>12?`<li>… dan ${res.bad.length-12} lainnya</li>`:'')+'</ul>';
 return h}
if(typeof document!='undefined'&&document&&typeof document.addEventListener=='function'){
document.addEventListener('input',e=>{if(e.target&&e.target.id=='aczIn'&&aczS)aczS.inp=e.target.value});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-acz]');const m=document.getElementById('aczm');
 if(m&&e.target===m){aczClose();return}
 if(!b)return;const a=b.dataset.acz;if(a=='site'){const t=aczText();if(t&&typeof ltCopy=='function')ltCopy(t);return}
 e.stopPropagation();e.preventDefault();
 if(a=='open'){aczOpen(b.dataset.l);return}
 if(!aczS)return;const s=aczS,o=aczO();
 if(a=='close')aczClose();
 else if(a=='lang'){aczOpen(b.dataset.v)}
 else if(a=='cap'){s.cap=+b.dataset.v;o.aczCap[s.L]=s.cap;s.cards=aczPick(s.L,s.cap,o.aczN);if(typeof save=='function')save();aczPanel()}
 else if(a=='n'){o.aczN=+b.dataset.v;s.cards=aczPick(s.L,s.cap,o.aczN);if(typeof save=='function')save();aczPanel()}
 else if(a=='p'){o.aczP=+b.dataset.v;if(typeof save=='function')save();aczPanel()}
 else if(a=='reroll'){s.cards=aczPick(s.L,s.cap,o.aczN,4);aczPanel()}
 else if(a=='copy'){const x=document.getElementById('aczTxt'),t=x?x.value:aczText();if(!t)return;o.aczMap={L:s.L,ids:s.cards.map(g=>g[0])};if(typeof save=='function')save();
  const done=ok=>{if(typeof toast=='function')toast(ok?'Prompt disalin ✓ Tempel di AI favoritmu':'Salin otomatis gagal. Teks prompt sudah terpilih — salin manual.');if(!ok&&x){x.focus();x.select()}};
  if(typeof ltCopy=='function')ltCopy(t).then(done);else done(false)}
 else if(a=='clear'){if(typeof confirm=='function'&&!confirm('Hapus semua soal tambahan Kelas AI untuk '+GCN[s.L]+'? (Soal bank bawaan tidak terhapus.)'))return;aczClear(s.L);s.cards=aczPick(s.L,s.cap,o.aczN);aczPanel()}
 else if(a=='import'){const x=document.getElementById('aczIn'),t=x?x.value:s.inp;s.inp=t;if(!String(t).trim()){if(typeof toast=='function')toast('Tempel hasil AI dulu.');return}
  const ids=(s.cards.length&&aczMapIds(s.L).length?aczMapIds(s.L):s.cards.map(g=>g[0]));
  const res=aczParse(t,s.L,s.cap,ids),n=res.ok.length?aczAdd(s.L,res.ok):0;
  s.rep=aczReport(res,n,aczLvs(s.L)[s.cap]);if(n&&!res.bad.length)s.inp='';
  s.cards=aczPick(s.L,s.cap,o.aczN);aczPanel();if(typeof gxQ!='undefined'){try{gxQ=null}catch(x){}}}
},true);
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&document.getElementById('aczm'))aczClose()});
}
