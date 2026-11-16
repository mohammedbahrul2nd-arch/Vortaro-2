/* ===== Game Grammar Cloze (gcl_zh · gcl_ja · gcl_de · gcl_nl · gcl_en · gcl_eo) v7.88 — mesin GXX (games2.js) =====
   Satu sel = satu kartu grammar (D.G) × satu soal. Kunci SRS stabil: 'gc|<id kartu>|<n>' (id kartu = g[0], mis. 'g|zh|HSK 1|Judul').
   TIDAK memakai Pustaka: soal berasal dari bank GCX (berkas gamedata15.js dst., dibuat oleh tools/gcl_build.py dari tools/gcl_src/*.txt).
   GCX = {idKartu: [soal, …]}; soal = [kalimat dengan ___, jawaban, terjemah Indonesia, petunjuk, romanisasi, pengecoh terlarang]
     · satu celah : jawaban = [utama, ...alternatif sah]
     · dua+ celah : jawaban = [celah1, celah2, …] dan tiap celah = 'teks' atau [utama, ...alternatif]
     · romanisasi (zh/ja) = kalimat penuh dengan jawaban utama; pengecoh terlarang = array jawaban yang tidak boleh jadi pilihan (ambigu).
   Mode: c = pilih jawaban (6 opsi, pengecoh otomatis dari jawaban kartu lain di bahasa/level yang sama) · t = ketik jawaban.
   Laporan pribadi (🚩) tersimpan di GXO(g).ov[kunci] = {add:['celah:jawaban'], rej:[…], skip:1}. */
const GCX={};
const GCLG=['zh','ja','de','nl','en','eo'];
const GCN={zh:'Mandarin',ja:'Jepang',de:'Jerman',nl:'Belanda',en:'Inggris',eo:'Esperanto'};
const GCV={zh:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5'],ja:['N5','N4','N3','N2','N1'],de:['A1','A2','B1','B2','C1'],nl:['A1','A2','B1','B2','C1','C2'],en:['A1','A2','B1','B2','C1','C2'],eo:['A1','A2','B1','B2','C1','C2']};
const GCM={c:'Pilih jawaban',t:'Ketik jawaban'};
/* panjang kalimat (v7.91): satuan = aksara (zh/ja, tanpa spasi & tanda baca; celah dihitung 1 per jawaban utama) atau kata (bahasa lain); ambang [maks pendek, maks sedang] per bahasa */
const GCLN={s:'Pendek',m:'Sedang',l:'Panjang'},GCLT={zh:[6,8],ja:[9,15],de:[4,6],def:[5,8]};
function gcLen(q,L){const t=String(q[0]).replace(/___/g,' X '),n=(L=='zh'||L=='ja')?t.replace(/[\s　。，！？、…・,.!?;；:：“”"'‘’「」『』（）()—-]/g,'').length:t.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length,th=GCLT[L]||GCLT.def;return n<=th[0]?'s':n<=th[1]?'m':'l'}
let GCI=null;
function gcCards(){if(!GCI){GCI={};for(const g of D.G){(GCI[g[1]]||(GCI[g[1]]=[])).push(g)}}return GCI}
const gcLv=g=>String(g[2]);
function gcLvCount(L){const uq=gcUq(L),n={};GCV[L].forEach(v=>n[v]=0);for(const c of(gcCards()[L]||[])){const v=gcLv(c);if(v in n)n[v]+=((GCX[c[0]]||[]).length)+((uq[c[0]]||[]).length)}return GCV[L].map(v=>v+' '+n[v]).join(' · ')}
const gcNGap=s=>(String(s).match(/___/g)||[]).length;
/* jawaban per celah: array (celah) of array (alternatif); alternatif pertama = utama */
function gcGaps(q){const a=q[1],n=gcNGap(q[0]);return n<2?[a.map(String)]:a.map(z=>Array.isArray(z)?z.map(String):[String(z)])}
const gcOvOf=(o,k)=>{const e=(o.ov||{})[k]||{};return{add:e.add||[],rej:e.rej||[],skip:!!e.skip}};
/* jawaban sah setelah laporan pribadi: tolak (rej) dibuang bila masih ada sisa, tambah (add) dimasukkan */
function gcValid(o,k,gaps){const e=gcOvOf(o,k);return gaps.map((a,i)=>{let v=a.filter(z=>!e.rej.includes(i+':'+z));if(!v.length)v=a.slice();for(const z of e.add){const p=z.indexOf(':');if(+z.slice(0,p)===i&&!v.includes(z.slice(p+1)))v.push(z.slice(p+1))}return v})}
/* normalisasi jawaban ketikan */
const GCDE={'ä':'ae','ö':'oe','ü':'ue','ß':'ss'},GCEO={cx:'ĉ',gx:'ĝ',hx:'ĥ',jx:'ĵ',sx:'ŝ',ux:'ŭ'};
function gcNorm(s,L){s=String(s==null?'':s).normalize('NFC').toLowerCase().replace(/[’‘`´]/g,"'");
 s=s.replace(/[\s　]+/g,L=='zh'||L=='ja'?'':' ').replace(/^[\s.,!?;:。，！？、…]+|[\s.,!?;:。，！？、…]+$/g,'').trim();
 if(L=='de')s=s.replace(/[äöüß]/g,c=>GCDE[c]);
 if(L=='eo')s=s.replace(/[cghjsu]x/g,c=>GCEO[c]);
 return s}
/* semua jawaban utama per bahasa (kumpulan pengecoh), dihitung sekali */
let GCP={};
/* soal tambahan pengguna (Kelas AI · Cloze, ai-cloze.js): GXO('gcl_<L>').uq = {idKartu:[soal+uid]}; uid di indeks 6 → kunci SRS 'gc|id|u<uid>' */
const gcUq=L=>{try{const o=GXO('gcl_'+L);return o&&o.uq&&typeof o.uq=='object'?o.uq:{}}catch(e){return{}}};
function gcPool(L){if(GCP[L])return GCP[L];const m=new Map();
 const uq=gcUq(L);for(const g of (gcCards()[L]||[])){const b=(GCX[g[0]]||[]).concat(uq[g[0]]||[]);for(const q of b)for(const a of gcGaps(q)){const v=a[0];if(!v||m.has(v))continue;m.set(v,gcLv(g))}}
 return GCP[L]=[...m].map(([v,lv])=>({v,lv}))}
const gcCjk=s=>/[぀-ヿ㐀-鿿]/.test(s);
/* kelompok sinonim (sering sama-sama sah): anggota kelompok jawaban tidak pernah dijadikan pengecoh. Tambahkan per bahasa bila ada pasangan ambigu. */
const GCS={zh:[['很','非常','真'],['常','常常'],['哪儿','哪里'],['这儿','这里'],['那儿','那里'],['和','跟'],['一起','一块儿'],['在','正在'],['块','元'],['个','口','间','家']],ja:[['とても','すごく','非常に','大変','本当に','かなり'],['どうして','なぜ','なんで'],['どんな','どういう'],['どうやって','どう','どのように'],['そして','それに'],['しかし','でも'],['から','ので'],['けど','けれど','けれども'],['一番','いちばん'],['ほう','方'],['だろう','でしょう'],['つもり','予定'],['ほしい','欲しい'],['とき','時'],['前に','まえに'],['一緒に','いっしょに'],['のです','んです'],['の','こと'],['上手','うまい'],['ちゃ','ては'],['ないと','なくては','なければ','なくちゃ','なきゃ'],['いけません','いけない','なりません','ならない'],['あります','ある'],['います','いる'],['なります','なる'],['ていません','てません','ていない'],['ています','ている'],['急に','突然'],['やっと','ようやく'],['全然','ぜんぜん'],['あまり','あんまり'],['ごろ','頃'],['場合','とき','時'],['間','あいだ'],['おきに','ごとに'],['という','っていう','って'],['はず','わけ'],['かしら','かな'],['ではないか','じゃないか'],['らしい','ようだ','みたいだ','そうだ'],['ければ','くては'],['たら','ば'],['てやった','てあげた'],['ばかり','ところ'],['ていただけませんか','てもらえませんか','てくれませんか','てくださいませんか']]};
/* pengecoh: bukan jawaban sah, bukan kata di kalimat, bukan yang terlarang; dekat panjang & level & jenis aksara */
/* kelas kata: pengecoh diutamakan dari kelas yang sama dengan jawaban (hanya bila jawaban termasuk satu kelas) */
const GCK={nl:[['in','op','naar','uit','van','met','zonder','bij','voor','om','aan','over','tot','na'],['de','het','een','geen'],['deze','die','dit','dat'],['ik','jij','je','u','hij','zij','ze','het','wij','we','jullie','me','mij','jou','hem','haar','ons','hen','hun'],['mijn','jouw','uw','zijn','haar','ons','onze','hun','jullie'],['ben','bent','is','zijn','heb','hebt','heeft','hebben','ga','gaat','gaan','kan','kunt','wil','wilt','moet','mag','zal','zult','zullen'],['wat','wie','waar','wanneer','waarom','hoe','hoeveel'],['ja','nee','jawel']],en:[['a','an','the'],['in','on','at','under','next to','between','from','to','with','for','of','beneath','by'],['me','you','him','her','it','us','them','I','he','she','we','they'],['my','your','his','her','its','our','their'],['this','that','these','those'],['am','is','are','was','were','do','does','did','have','has','can','could','may'],['and','but','or'],['where','when','why','how','whose','who','what','which'],['some','any']],de:[['an','auf','aus','bei','beim','bis','durch','für','gegen','in','im','mit','nach','neben','über','um','unter','von','vor','zu','zum','zur','zwischen','hinter','seit','ab','am','vom','außer','ohne','pro','ob'],['der','die','das','den','dem','ein','eine','einen','einem','einer','kein','keine','keinen','keinem','keiner'],['mich','dich','ihn','sie','es','uns','euch','ihnen'],['was','wer','wo','woher','wohin','wie','wann','wie viel','wie viele'],['ja','nein','doch'],['und','aber','denn','oder','sondern','weil','dass','wenn'],['mir','dir','ihm','ihr','uns','euch','ihnen'],['mich','dich','sich','uns','euch','mir','dir'],['habe','hast','hat','haben','habt','bin','bist','ist','sind','seid','war','waren','hatte','hatten']]};
function gcOpts(L,lv,sent,valid,ban,n){const vs=new Set(valid.map(z=>gcNorm(z,L))),bs=new Set((ban||[]).map(z=>gcNorm(z,L)));for(const gr of (GCS[L]||[]))if(gr.some(z=>vs.has(gcNorm(z,L))))gr.forEach(z=>bs.add(gcNorm(z,L)));
 const sn=gcNorm(sent.replace(/___/g,' '),L),ok=valid[0];
 const kg=((GCK[L]||[]).find(gr=>gr.includes(gcNorm(ok,L))))||null;
 const c=gcPool(L).filter(p=>{const z=gcNorm(p.v,L);return z&&!vs.has(z)&&!bs.has(z)&&!(z.length>0&&sn.includes(z)&&(L=='zh'||L=='ja'||(' '+sn+' ').includes(' '+z+' ')))}).map(p=>({v:p.v,s:Math.abs(p.v.length-ok.length)*3+(p.lv==lv?0:2)+(gcCjk(p.v)==gcCjk(ok)?0:4)+Math.random()*2.5-(kg&&kg.includes(gcNorm(p.v,L))?14:0)}));
 c.sort((a,b)=>a.s-b.s);return gxShuf([ok].concat(c.slice(0,n||5).map(z=>z.v)))}
function gcCells(L){const pre='gc|';return o=>{const cs=[],ln=Array.isArray(o.len)?o.len:[];const uq=gcUq(L);for(const g of (gcCards()[L]||[])){const b=GCX[g[0]];if(b)b.forEach((q,n)=>{const k=pre+g[0]+'|'+n;if(gcOvOf(o,k).skip)return;if(ln.length&&!ln.includes(gcLen(q,L)))return;cs.push({k,x:{id:g[0],n,q,g},lv:gcLv(g)})});(uq[g[0]]||[]).forEach(q=>{const k=pre+g[0]+'|u'+q[6];if(gcOvOf(o,k).skip)return;if(ln.length&&!ln.includes(gcLen(q,L)))return;cs.push({k,x:{id:g[0],n:'u'+q[6],q,g,u:1},lv:gcLv(g)})})}return cs}}
function gcMake(L,gid){return cell=>{const {q,g}=cell.x,o=GXO(gid),gaps=gcGaps(q),val=gcValid(o,cell.k,gaps),parts=[],sp=q[0].split('___'),ban=Array.isArray(q[5])?q[5]:[];
 const typ=o.modes.includes('t')&&(!o.modes.includes('c')||Math.random()<.5);
 sp.forEach((s,i)=>{if(s)parts.push(s);if(i<val.length)parts.push(i)});
 const blanks=val.map((v,i)=>({lab:val.length>1?'Celah '+(i+1):'',ok:[v[0]],alts:v,opts:typ?[]:gcOpts(L,gcLv(g),q[0],v,ban,5),soft:[]}));
 const full=sp.map((s,i)=>s+(i<val.length?val[i][0]:'')).join(''),alts=val.map((v,i)=>v.length>1?(val.length>1?'celah '+(i+1)+': ':'')+v.slice(1).join(' / '):'').filter(Boolean);
 const R={g:gid,k:cell.k,L,cell:'Cloze grammar · '+gcLv(g),blanks,parts,tr:q[2],hint:q[3]||'',typ,fullTxt:full,rom:q[4]||'',say:()=>full,card:g,cx:cell,
  expl:`Kartu: <b>${esc(g[4])}</b>${g[6]?' — pola <b>'+esc(String(g[6]).split('\n')[0])+'</b>':''}${g[5]&&g[5]!=g[4]?'<br><small>'+esc(g[5])+'</small>':''}${alts.length?'<br><small>Jawaban lain yang juga sah: '+esc(alts.join(' · '))+'</small>':''}`,
  resHtml:()=>gcRes(R,gid)};
 R.judge=vals=>{const ok=[];R.typed=vals.slice();blanks.forEach((b,i)=>{const hit=b.alts.some(a=>gcNorm(a,L)===gcNorm(vals[i],L));ok.push(hit);R.sel[i]=new Set([hit?b.ok[0]:String(vals[i]||'—').trim()||'—'])});return ok};
 return R}}
/* kotak hasil: romanisasi, ketikanmu, dan tombol 🚩 */
function gcRes(q,g){const o=GXO(g),k=q.k,e=gcOvOf(o,k),L=q.L;let h='';
 if(q.rom)h+=`<div class=gxpy>${esc(q.rom)}</div>`;
 if(q.typ&&q.typed)h+=`<div class=gxnote>Jawabanmu: <b>${esc(q.typed.map(z=>z||'—').join(' · '))}</b></div>`;
 const wrong=[];q.blanks.forEach((b,i)=>{const s=[...(q.sel[i]||[])][0];if(s!=null&&s!='—'&&!b.alts.includes(s)&&!e.add.includes(i+':'+s))wrong.push([i,s])});
 const B=(v,kk,t)=>`<button class=zcfl data-a=ggxgcf data-v=${v} data-k="${esc(kk)}">${t}</button>`;let fb='';
 for(const [i,s] of wrong)fb+=B('add',i+':'+s,`🚩 “${esc(s)}” juga benar, terima`);
 for(const z of e.add)fb+=B('clr',z,`↺ Batalkan tambahan “${esc(z.slice(z.indexOf(':')+1))}”`);
 for(const z of e.rej)fb+=B('clr',z,`↺ Batalkan penolakan “${esc(z.slice(z.indexOf(':')+1))}”`);
 q.blanks.forEach((b,i)=>{if(b.alts.length>1)for(const a of b.alts)if(!e.rej.includes(i+':'+a))fb+=B('rej',i+':'+a,`🚩 Tolak “${esc(a)}”`)});
 fb+=B('skip','',e.skip?'↺ Soal ini dimunculkan lagi':'🚩 Kunci/soal salah — sembunyikan soal ini');
 return h+`<div class=zcfb><small>Tidak setuju dengan kunci? Laporanmu hanya tersimpan di perangkat ini.</small>${fb}</div>`}
/* aksi ggxgct (kirim ketikan) & ggxgcf (laporan) — dipanggil dari gxAct (games2.js) */
function gcAct(a,x,k){const q=gxQ,g=gxCur;
 if(a=='ggxgct'){if(!q||gxRes||!q.typ)return;const v=q.blanks.map((b,i)=>{const el=document.getElementById('gcin'+i);return el?el.value:''});
  if(x=='skip'){q.blanks.forEach((b,i)=>{v[i]=''});}else if(v.some(z=>!String(z).trim())){if(typeof toast=='function')toast('Isi semua celah dulu, atau pilih “Tidak tahu”.');return}
  q.judge(v);gxFinish();return}
 if(a=='ggxgcf'){const o=GXO(g);if(!o.ov)o.ov={};const id=q?q.k:null;if(!id)return;const e=o.ov[id]||(o.ov[id]={add:[],rej:[],skip:0});e.add=e.add||[];e.rej=e.rej||[];
  const dl=(ar,c)=>{const i=ar.indexOf(c);if(i>=0)ar.splice(i,1)};
  if(x=='skip')e.skip=e.skip?0:1;else if(x=='add'){if(!e.add.includes(k))e.add.push(k);dl(e.rej,k)}else if(x=='rej'){if(!e.rej.includes(k))e.rej.push(k);dl(e.add,k)}else{dl(e.add,k);dl(e.rej,k)}
  if(!e.add.length&&!e.rej.length&&!e.skip)delete o.ov[id];return}
 if(a=='ggxgcf0'){const o=GXO(g);if(typeof confirm=='function'&&!confirm('Hapus semua laporan pribadi game ini?'))return;o.ov={};gxQ=null;gxRes=null}}
function gcStat(L){let kartu=0,soal=0,uk=0,us=0;const uq=gcUq(L);for(const g of (gcCards()[L]||[])){const b=GCX[g[0]];if(b){kartu++;soal+=b.length}const u=uq[g[0]];if(u&&u.length){uk++;us+=u.length}}return{kartu,soal,total:(gcCards()[L]||[]).length,uk,us}}
const GCT={zh:'汉',ja:'文',de:'Satz',nl:'zin',en:'The',eo:'frazo'};
for(const L of GCLG){const g='gcl_'+L;
 GXX[g]={pre:'gc|g|'+L+'|',modes:GCM,def:{n:8,r:200,modes:['c'],len:[],ov:{}},cells:o=>gcCells(L)(o),make:gcMake(L,g),
  get lvl(){return GCV[L]},
  get note(){const o=GXO(g),n=Object.keys(o.ov||{}).length,s=gcStat(L),ls=Array.isArray(o.len)?o.len:[];return `<small>Panjang kalimat (kosong = semua)</small><div class=chips>${Object.keys(GCLN).map(v=>`<button class="chip${ls.includes(v)?' on':''}" data-a=ggxtg data-v="len:${v}">${GCLN[v]}</button>`).join('')}</div><small>Satu soal = satu poin grammar. Bank soal: ${s.soal} soal untuk ${s.kartu} dari ${s.total} kartu grammar ${GCN[L]}. Pilih jawaban atau ketik; pengecoh diambil otomatis dari kartu grammar lain. Level kosong = semua level. Soal per level: ${gcLvCount(L)}.${s.us?` Soal tambahan dari Kelas AI: ${s.us} soal untuk ${s.uk} kartu.`:''} <button class=chip data-acz=open data-l=${L}>🧩 Tambah soal via Kelas AI</button>${n?` Laporan pribadi: ${n} soal. <button class=chip data-a=ggxgcf0>Hapus semua</button>`:''}</small>`},
  empty:'Tidak ada soal untuk filter ini: bank soal bahasa/level ini belum diisi (dikerjakan bertahap) atau panjang kalimat yang dipilih tidak ada. Ubah level/panjang, atau tambah soal lewat tombol «🧩 Tambah soal via Kelas AI» di pengaturan.'};
 GXL.push({id:g,ic:GCT[L],t:'Grammar Cloze — '+GCN[L],d:'Soal rumpang untuk setiap poin grammar kartu: partikel, pola tetap, akhiran, bentuk kata kerja, preposisi. Pilih atau ketik jawaban.',tag:'GC '+L.toUpperCase(),lg:L})}
if(typeof document!='undefined'&&document&&typeof document.addEventListener=='function')document.addEventListener('keydown',e=>{const t=e.target;if(e.key=='Enter'&&t&&typeof t.id=='string'&&/^gcin\d$/.test(t.id)){e.preventDefault();const b=document.querySelector('[data-a=ggxgct]');if(b)b.click()}});
