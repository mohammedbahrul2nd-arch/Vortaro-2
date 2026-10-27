/* ===== Vortaro 7: Pustaka teks pribadi, pencocok kosakata (bentuk kata berubah), pemutar listening, kartu bandel =====
   Dimuat sebelum app.js; hanya memakai data/fungsi app.js saat dipanggil. */

/* ---------------------------------------------------------------------------------------------
   1. PARSER: teks tempelan dari AI -> paragraf -> kalimat (+ romanisasi + terjemahan)
   --------------------------------------------------------------------------------------------- */
const LIBL=['zh','ja','de','nl','eo'];
const libNm=l=>(typeof LN!='undefined'&&LN[l])||({zh:'Mandarin',ja:'Jepang',de:'Jerman',nl:'Belanda',eo:'Esperanto'}[l])||l;
const libId=()=>'t'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const LIBHN={JEPANG:'ja',MANDARIN:'zh',JERMAN:'de',BELANDA:'nl',ESPERANTO:'eo'};
const LIBSW={
 id:'yang dan di untuk dengan ini itu saya tidak adalah ke dari pada akan juga dalam sudah bisa kami kita mereka dia aku kamu ada atau karena seperti oleh sebuah lebih sangat sedang mau harus hari'.split(' '),
 de:'der die das und ist nicht ich du er sie es wir ihr ein eine einen mit auf für von zu den dem im auch sich aber wie wenn bin sind war hat haben wird'.split(' '),
 nl:'de het een en is niet ik jij je hij zij ze wij we jullie van op voor met dat die dit zijn was heeft hebben wordt ook maar als naar bij'.split(' '),
 eo:'la kaj estas mi vi li ŝi ni ili ne en al por kun sur ĉi tio kio ke sed aŭ mia via lia ŝia'.split(' ')};
const LIBSWS={};for(const l in LIBSW)LIBSWS[l]=new Set(LIBSW[l]);
function libScore(text){const t=String(text).toLowerCase().match(/[\p{L}]+/gu)||[],o={};for(const l in LIBSWS)o[l]=t.reduce((a,w)=>a+(LIBSWS[l].has(w)?1:0),0);
 if(/[ĉĝĥĵŝŭ]/i.test(text))o.eo+=4;if(/[äöüß]/i.test(text))o.de+=2;if(/\b(ij|ui)\b|[a-z]ij/i.test(text))o.nl+=1;return o}
const libCJK=s=>/[぀-ヿ㐀-鿿]/.test(s);
function libDetectL(t){const kana=(t.match(/[぀-ヿ]/g)||[]).length,han=(t.match(/[㐀-鿿]/g)||[]).length;
 if(kana>=2||(kana>0&&han&&kana/han>.03))return'ja';if(han>=2)return'zh';
 const s=libScore(t);let b='',bv=1;for(const l of['de','nl','eo'])if(s[l]>bv){b=l;bv=s[l]}return b}
function libClean(s){return String(s||'').replace(/\r\n?/g,'\n').replace(/^[ \t]*```[^\n`]*$/gm,'').replace(/\\[ \t]*$/gm,'').replace(/\\([!-\/:-@\[-`{-~’‘“”])/g,'$1').replace(/<\/?(?:underline|u|b|i|em|strong|mark|span|ins|del|br)\b[^>]*>/gi,'').replace(/[\u00a0\u200b\u2028\u2029]/g,' ')
 .replace(/(\*\*|__|`)/g,'').replace(/(^|[\s(「『“"])[*_]([^*_\n]+?)[*_](?=[\s.,!?;:)」』”"。、！？]|$)/g,'$1$2')
 .split('\n').map(l=>l.replace(/^\s*(?:#{1,6}\s+|>\s+|[-•]\s+|\d{1,2}[.)]\s+)/,'').replace(/[ \t]+$/,'')).join('\n')}
const LIBAB=/(?:\bz\.\s?B|\bd\.\s?h|\bu\.\s?a|\bo\.\s?a|\bbzw|\busw|\bca|\bDr|\bHr|\bFr|\bNr|\bSt|\bvgl|\bbijv|\benz|\bmevr|\bdhr|\bmr|\bvs)\.$/i;
function libSplit(t,L){t=String(t||'').replace(/\s+/g,' ').trim();if(!t)return[];
 const m=t.match(/[^.!?…。！？]+(?:[.!?…。！？]+["”’»)」』）]*|$)\s*/g)||[t],out=[],cj=L=='ja'||L=='zh';
 for(const p0 of m){const p=p0.trim();if(!p)continue;const last=out[out.length-1];
  if(last&&!cj&&(LIBAB.test(last)||(/\d\.$/.test(last)&&/^\d/.test(p))))out[out.length-1]=last+' '+p;else out.push(p)}
 return out}
const libParas=b=>String(b||'').split(/\n\s*\n/).map(x=>x.split('\n').map(y=>y.trim()).filter(Boolean).join(' ')).filter(Boolean);
function libMkPara(f,i,r,L){const fa=libSplit(f,L),ia=i?libSplit(i,'id'):[],ra=r?libSplit(r,'rom'):[];
 const okI=!ia.length||ia.length==fa.length,okR=!ra.length||ra.length==fa.length;
 if(okI&&okR)return{f:fa,i:ia,r:ra.length?ra:null,a:1};
 return{f:fa,i:i?[i.replace(/\s+/g,' ').trim()]:[],r:r?[r.replace(/\s+/g,' ').trim()]:null,a:0}}
/* hasil: {L,title,ps:[{f:[],i:[],r:[]|null,a}],note,fmt} atau {err} */
/* format terkelompok per paragraf: n baris teks, n baris romanisasi, n baris terjemahan (penanda seperti 第一段 / Paragraf 1 opsional) */
function libGrouped(lines,L){const mark=l=>/^(?:第[一二三四五六七八九十百\d]+[段章节部分]|paragra[fp]h?\s*\d+|段落?\s*\d+|[①-⑩])\s*[:：.]?$/i.test(l);
 let ln=lines.map(x=>String(x).trim()).filter(Boolean),title='',i=0;const mi=ln.findIndex(mark);if(mi>0){title=ln[0];ln=ln.slice(mi)}const ls=ln.filter(x=>!mark(x)),ps=[];
 while(i<ls.length){let n=0;while(i+n<ls.length&&libCJK(ls[i+n]))n++;
  if(!n){if(!ps.length&&!title){title=ls[i];i++;continue}return null}
  let m=0;while(i+n+m<ls.length&&!libCJK(ls[i+n+m]))m++;
  if(!ps.length&&n==1&&m<2&&i+n+m<ls.length){title=title||ls[i];i+=n+m;continue}
  if(m!=2*n){/* jumlah baris tak seimbang: pisahkan romanisasi | terjemahan dengan menebak titik belahnya */
   if(m<2)return null;const nl=ls.slice(i+n,i+n+m),isId=x=>{const q=libScore(x);return q.id>=2||(q.id>=1&&!/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(x)&&/[a-z]{4,}/.test(x)&&/\b(?:yang|dan|di|ke|dengan|itu|ini|adalah|saya|kami|dia|tidak)\b/i.test(x))};
   let bj=-1,bc=1e9;for(let j=1;j<m;j++){let c=0;for(let k=0;k<m;k++){const id=isId(nl[k]);if(k<j&&id)c++;if(k>=j&&!id)c++}if(c<bc){bc=c;bj=j}}
   if(bj<0||bc>Math.ceil(m*.25))return null;
   ps.push(libMkPara(ls.slice(i,i+n).join(' '),nl.slice(bj).join(' '),nl.slice(0,bj).join(' '),L));i+=n+m;continue}
  ps.push({f:ls.slice(i,i+n),r:ls.slice(i+n,i+2*n),i:ls.slice(i+2*n,i+3*n),a:1});i+=3*n}
 return ps.length?{ps,title}:null}
/* ---------------------------------------------------------------------------------------------
   v7.2 — PENANDA ID [paragraf.kalimat]
   Supaya romanisasi / terjemahan TIDAK PERNAH bergeser dari kalimatnya, prompt Kelas AI meminta tiap kalimat
   diberi nomor [1.1] [1.2] [2.1] … di SEMUA blok (teks, romaji/pinyin, terjemahan). Parser mencocokkan lewat
   nomor itu, bukan lewat urutan atau tanda baca. Kalimat yang hilang di satu blok hanya kehilangan bagiannya
   sendiri; kalimat lain tetap selaras. Tanpa nomor, parser memakai pencocokan baris / paragraf seperti sebelumnya.
   --------------------------------------------------------------------------------------------- */
const LIBID=/^\s*[\[【〔［]\s*(\d{1,3})\s*[.\-:·．]\s*(\d{1,3})\s*[\]】〕］]\s*[:：.)\-–—]?\s*/;
const LIBHD=/^\s*(?:={2,}\s*)?(?:DAFTAR\s+)?(?:KARTU\s+)?(TEKS|TEXT|ROMAJI|ROMANISASI|ROMANIZATION|PINYIN|TERJEMAHAN|TRANSLATION|ARTI|PEMBENTUK|JUDUL|TITLE)\b([^=\n]{0,45}?)\s*(?:={2,})?\s*:?\s*$/i;
const LIBHK={TEKS:'f',TEXT:'f',ROMAJI:'r',ROMANISASI:'r',ROMANIZATION:'r',PINYIN:'r',TERJEMAHAN:'i',TRANSLATION:'i',ARTI:'i',PEMBENTUK:'n',JUDUL:'t',TITLE:'t'};
const LIBHW={JEPANG:'ja',JAPANESE:'ja',MANDARIN:'zh',CHINESE:'zh',JERMAN:'de',GERMAN:'de',BELANDA:'nl',DUTCH:'nl',ESPERANTO:'eo'};
function libHead(l){if(l.length>70)return null;const m=l.match(LIBHD);if(!m)return null;
 const strong=/={2,}/.test(l)||/:\s*$/.test(l)||(l===l.toUpperCase()&&/[A-Z]/.test(l))||/^\s*(?:DAFTAR\s+)?(?:KARTU\s+)?(?:TEKS|TEXT|ROMAJI|ROMANISASI|PINYIN|TERJEMAHAN|TRANSLATION|ARTI|JUDUL|TITLE|PEMBENTUK)(?:\s+(?:BAHASA|YANG|DIPAKAI|DIGUNAKAN|JEPANG|MANDARIN|JERMAN|BELANDA|ESPERANTO|INDONESIA|ASING|JAPANESE|CHINESE|GERMAN|DUTCH))*\s*$/i.test(l);if(!strong)return null;
 const k=LIBHK[m[1].toUpperCase()];const w=(m[2]||'').trim().toUpperCase().split(/\s+/).map(x=>LIBHW[x]).find(Boolean)||'';
 /* “TEKS INDONESIA” / “TERJEMAHAN” bukan blok teks asing */
 if(k=='f'&&/\bINDONESIA\b/i.test(m[2]||''))return{k:'i',w:''};
 return{k,w}}
const libTone=x=>/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňḿ]/i.test(x);
const libIsIndo=x=>{const q=libScore(x);return!libTone(x)&&(q.id>=2||(q.id>=1&&/\b(?:yang|dan|di|ke|dengan|itu|ini|adalah|saya|kami|dia|tidak|aku|kamu|sedang|sudah)\b/i.test(x)))};
const libLabel=x=>{const m=String(x).match(/^\s*(romaji|rōmaji|romanisasi|pinyin|arti|terjemahan|indonesia|bahasa indonesia)\s*[:：]\s*/i);if(!m)return{t:x,k:''};
 const w=m[1].toLowerCase();return{t:x.slice(m[0].length),k:/^(?:romaji|rōmaji|romanisasi|pinyin)$/.test(w)?'r':'i'}};
const libSp=x=>String(x||'').replace(/\s+/g,' ').trim();
/* baris -> entri bernomor; baris tanpa nomor yang mengikuti baris bernomor dianggap lanjutan kalimat itu */
function libIdEntries(lines){const ents=[];let last=null,has=false;
 for(const raw of lines){const ln=raw.trim();if(!ln){last=null;continue}const m=ln.match(LIBID);
  if(m){has=true;last={p:+m[1],s:+m[2],t:ln.slice(m[0].length).trim()};ents.push(last)}
  else if(last&&has)last.t=libSp(last.t+' '+ln);else ents.push({p:0,s:0,t:ln,x:1})}
 return{has:has&&ents.some(e=>!e.x),ents:ents.filter(e=>!e.x||!has)}}
/* paragraf (dipisah baris kosong) -> daftar baris */
const libParaLines=lines=>{const out=[];let cur=[];for(const raw of lines){const l=raw.trim();if(!l){if(cur.length)out.push(cur);cur=[]}else cur.push(l)}if(cur.length)out.push(cur);return out};
const libEndsS=x=>/[.!?…。！？]["”’»)」』）]*$/.test(x);
function libTitleOf(s){s=libSp(s).replace(/^(?:judul|title)\s*[:：]\s*/i,'');const q=s.split(/\s+[|｜]\s+|\s+\/\/\s+/);return q[0].replace(/\s*\([^)]*\)\s*$/,'').trim().slice(0,120)}
/* a) format blok: === TEKS … === / === ROMAJI|PINYIN === / === TERJEMAHAN INDONESIA === (+ PEMBENTUK, JUDUL) */
function libParseBlocks(t,L,wn){const lines=t.split('\n'),B=[];let cur={k:'pre',l:[]};B.push(cur);
 for(const ln of lines){const h=libHead(ln);if(h){cur={k:h.k,w:h.w,l:[]};B.push(cur);if(h.w&&!L)L=h.w}else cur.l.push(ln)}
 const get=k=>B.find(b=>b.k==k),F=get('f'),R=get('r'),I=get('i'),Nn=B.filter(b=>b.k=='n').map(b=>b.l.join('\n').trim()).filter(Boolean).join('\n'),Tt=get('t');
 if(!F||!F.l.join('').trim())return{err:'Blok “=== TEKS … ===” tidak ditemukan atau kosong.'};
 if(!L)L=libDetectL(F.l.join('\n'));
 let title='';if(Tt&&Tt.l.join('').trim())title=libTitleOf(Tt.l.find(x=>x.trim())||'');
 if(!title){const pm=B[0].l.map(x=>x.trim()).find(x=>/^(?:judul|title)\s*[:：]/i.test(x));if(pm)title=libTitleOf(pm)}
 const rom=L=='ja'||L=='zh',warn=[],ps=[];
 const fe=libIdEntries(F.l),re=R?libIdEntries(R.l):null,ie=I?libIdEntries(I.l):null;let fmt='aud';
 if(fe.has){
  /* pencocokan lewat nomor */
  const key=e=>e.p+'.'+e.s,rm=new Map(),im=new Map();
  if(re)re.ents.forEach(e=>{if(!rm.has(key(e)))rm.set(key(e),e.t)});if(ie)ie.ents.forEach(e=>{if(!im.has(key(e)))im.set(key(e),e.t)});
  const groups=new Map();fe.ents.forEach(e=>{if(!groups.has(e.p))groups.set(e.p,[]);groups.get(e.p).push(e)});
  let missR=0,missI=0,tot=0;
  const posR=re&&!re.has?re.ents.map(e=>e.t):null,posI=ie&&!ie.has?ie.ents.map(e=>e.t):null;let gi=0;
  for(const [pn,es] of groups){const p={f:[],i:[],r:rom&&(R||posR)?[]:null,a:1};
   es.forEach(e=>{tot++;p.f.push(e.t);
    if(p.r){let v=re&&re.has?rm.get(key(e)):posR&&posR.length==fe.ents.length?posR[gi]:'';if(!v)missR++;p.r.push(v||'')}
    let w=ie&&ie.has?im.get(key(e)):posI&&posI.length==fe.ents.length?posI[gi]:'';if(!w&&I)missI++;p.i.push(w||'');gi++});
   if(!p.i.some(Boolean))p.i=[];if(p.r&&!p.r.some(Boolean))p.r=null;ps.push(p)}
  if(R&&!(re.has||(posR&&posR.length==fe.ents.length)))warn.push('Romanisasi tidak bernomor dan jumlah barisnya ('+(posR?posR.length:0)+') ≠ jumlah kalimat ('+fe.ents.length+'): romanisasi dilewati.');
  if(I&&!(ie.has||(posI&&posI.length==fe.ents.length)))warn.push('Terjemahan tidak bernomor dan jumlah barisnya ≠ jumlah kalimat: terjemahan dilewati.');
  if(missR&&rom&&R)warn.push(missR+' dari '+tot+' kalimat tidak punya baris romanisasi bernomor sama (dikosongkan, tidak digeser).');
  if(missI&&I)warn.push(missI+' dari '+tot+' kalimat tidak punya terjemahan bernomor sama.');
  const extraR=re&&re.has?[...rm.keys()].filter(k=>!fe.ents.some(e=>key(e)==k)).length:0;if(extraR)warn.push(extraR+' nomor romanisasi tidak ada di teks asing (diabaikan).');
  fmt='aud'
 }else{
  /* tanpa nomor: baris-ke-baris bila selaras, selain itu pecah per tanda baca (cara lama) */
  const fp=libParaLines(F.l),rp=R?libParaLines(R.l):null,ip=I?libParaLines(I.l):null;
  const lineMode=fp.some(b=>b.length>1)&&fp.every(b=>b.length>=1)&&fp.flat().filter(libEndsS).length>=fp.flat().length*.9&&
   [rp,ip].every(q=>!q||(q.length==fp.length&&q.every((b,k)=>b.length==fp[k].length)));
  fp.forEach((b,k)=>{if(lineMode){const p={f:b,i:ip?ip[k]:[],r:rom&&rp?rp[k]:null,a:1};if(!p.i||!p.i.length)p.i=[];ps.push(p)}
   else ps.push(libMkPara(b.join(' '),ip&&ip[k]?ip[k].join(' '):'',rp&&rp[k]?rp[k].join(' '):'',L))});
  if(R&&rom&&!lineMode&&ps.some(p=>p.a===0))warn.push('Jumlah kalimat romanisasi tidak sama dengan teks asing di sebagian paragraf, jadi romanisasi ditampilkan per paragraf. Pakai nomor [1.1] agar selaras per kalimat.');
  fmt='aud'}
 return{L,title,ps:ps.filter(p=>p.f.length),note:Nn.slice(0,800),fmt,warn}}
/* isi satu kelompok kalimat: baris 1 = kalimat asing (+ lanjutan), baris berikut = romanisasi dan/atau arti */
function libGrpFRI(g,rom){let f=[g.f],x=g.x.slice(),i0=0;
 if(rom)while(i0<x.length&&libCJK(x[i0])){f.push(x[i0]);i0++}
 x=x.slice(i0).map(libLabel);let r='',tr='';
 if(rom){
  if(x.length>=2){let a=x[0],b=x.slice(1);
   if(!a.k&&!b[0].k&&libIsIndo(a.t)&&!libIsIndo(b[0].t)){r=b[0].t;tr=libSp(a.t)}
   else if(a.k=='i'||(b[0].k=='r')){r=(b.find(q=>q.k=='r')||{}).t||'';tr=libSp(x.filter(q=>q.k!='r').map(q=>q.t).join(' '))}
   else{r=a.t;tr=libSp(b.map(q=>q.t).join(' '))}}
  else if(x.length==1){const q=x[0];if(q.k=='r'||(!q.k&&!libIsIndo(q.t)))r=q.t;else tr=q.t}}
 else tr=libSp(x.map(q=>q.t).join(' '));
 return{f:libSp(f.join(rom?'':' ')),r:libSp(r),i:libSp(tr)}}
/* b) format kelompok berpenanda (Reading): [1.1] kalimat asing / romanisasi / terjemahan, satu kelompok per kalimat */
function libParseStack(t,L){const lines=t.split('\n').map(x=>x.trim()),mark=l=>/^(?:paragra[fp]h?\s*\d+|第[一二三四五六七八九十百\d]+[段章节部分]|段落?\s*\d+|[①-⑩])\s*[:：.]?$/i.test(l);
 let title='',G=[],cur=null;
 for(const ln of lines){if(!ln)continue;const m=ln.match(LIBID);
  if(m){cur={p:+m[1],s:+m[2],f:ln.slice(m[0].length).trim(),x:[]};G.push(cur);continue}
  if(mark(ln)){cur=null;continue}
  if(!G.length){if(/^(?:judul|title)\s*[:：]/i.test(ln))title=libTitleOf(ln);else if(!title&&ln.length<=90&&!libEndsS(ln))title=libTitleOf(ln);continue}
  if(cur)cur.x.push(ln)}
 if(G.length<1)return null;
 if(!L)L=libDetectL(G.map(g=>g.f).join('\n'));const rom=L=='ja'||L=='zh',warn=[],groups=new Map();let missR=0,missI=0;
 for(const g of G){const e=libGrpFRI(g,rom);
  if(!groups.has(g.p))groups.set(g.p,[]);groups.get(g.p).push(e)}
 const ps=[];let tot=0;
 for(const [,es] of groups){const p={f:[],i:[],r:rom?[]:null,a:1};
  es.forEach(e=>{tot++;p.f.push(e.f);p.i.push(e.i);if(rom){p.r.push(e.r);if(!e.r)missR++}if(!e.i)missI++});
  if(!p.i.some(Boolean))p.i=[];if(p.r&&!p.r.some(Boolean))p.r=null;ps.push(p)}
 if(missR&&rom&&missR<tot)warn.push(missR+' dari '+tot+' kalimat tidak punya baris romanisasi.');
 if(missI&&missI<tot)warn.push(missI+' dari '+tot+' kalimat tidak punya terjemahan.');
 return{L,title,ps,warn,fmt:'stk'}}

let libRepd=0;
function libRepairAll(){if(libRepd||typeof S=='undefined')return;libRepd=1;let ch=0;
 for(const it of S.lib){if((it.L!='zh'&&it.L!='ja')||it.ps.some(p=>p.r&&p.r.length))continue;
  const g=libGrouped(it.ps.flatMap(p=>p.f).map(x=>libClean(x)),it.L);if(g&&g.ps.length){it.ps=g.ps;if(g.title&&(!it.t||/^\d+$/.test(it.t)))it.t=g.title;libForget(it.id);ch++}}
 for(const it of S.lib){const n=libPolishPs(it.ps,it.L,libKind(it)=='d');if(n){libForget(it.id);ch+=n}}
 for(const x of S.sl){const q=libSan(x.f,x.L);if(q.f!==x.f){x.f=q.f;ch++}if(q.r&&!x.r){x.r=q.r;ch++}if(q.i&&!x.i){x.i=q.i;ch++}if(ch)libSD.delete(x.id+'|0|0')}
 if(ch){try{save()}catch(e){}}}
function libParseOld(raw,opt){opt=opt||{};let t=libClean(raw).trim();if(!t)return{err:'Teks kosong.'};
 let L=opt.L||'',title=(opt.title||'').trim(),note='',ps=[],fmt='',fm=opt.fmt||'auto';
 const cut=s=>{const m=s.search(/^\s*(?:daftar\s+)?(?:kartu\s+)?pembentuk(?:\s+yang\s+(?:dipakai|digunakan))?\s*:?\s*$/im);if(m>=0){note=s.slice(m).trim();return s.slice(0,m)}return s},
  dropLbl=s=>s.split('\n').filter(l=>!/^\s*(?:pembentuk|topik utama|tambahan)\s*:/i.test(l)).join('\n');
 /* a) format Audio / listening: tiga blok === ... === */
 if(fm=='auto'&&/^\s*={2,}\s*TEKS/im.test(t)||fm=='aud'){
  const parts=t.split(/^\s*={2,}\s*([^=\n]+?)\s*={2,}\s*$/m);let fb='',ib='',rb='';
  for(let k=1;k<parts.length;k+=2){const nm=parts[k].trim().toUpperCase(),body=parts[k+1]||'';
   if(/^TEKS/.test(nm)){fb=body;if(!L){const w=nm.split(/\s+/)[1];if(LIBHN[w])L=LIBHN[w]}}else if(/^TERJEMAHAN/.test(nm))ib=body;else if(/^(ROMAJI|ROMANISASI|PINYIN|ROMANIZATION)/.test(nm))rb=body;else note=(note?note+'\n':'')+body.trim()}
  if(!fb.trim())return{err:'Blok “=== TEKS … ===” tidak ditemukan atau kosong.'};
  if(!L)L=libDetectL(fb);
  const pf=libParas(fb),pi=libParas(ib),pr=libParas(rb);pf.forEach((p,k)=>ps.push(libMkPara(p,pi[k]||'',pr[k]||'',L)));fmt='aud'}
 /* b) format per kalimat: penanda “Paragraf N” */
 else if((fm=='auto'||fm=='sen')&&/^\s*(?:paragraf|paragraph)\s+\d+\s*:?\s*$/im.test(t)){
  t=cut(dropLbl(t));const parts=t.split(/^\s*(?:paragraf|paragraph)\s+\d+\s*:?\s*$/im);if(!title){const h=parts[0].split('\n').map(x=>x.trim()).filter(Boolean);if(h.length)title=h[0]}
  if(!L)L=libDetectL(parts.slice(1).join('\n'));const rom=L=='ja'||L=='zh';
  for(let k=1;k<parts.length;k++){const bl=parts[k].split(/\n\s*\n/).map(b=>b.split('\n').map(x=>x.trim()).filter(Boolean)).filter(b=>b.length);if(!bl.length)continue;
   const p={f:[],i:[],r:rom?[]:null,a:1};
   bl.forEach(b=>{const n=b.length;let f=b[0],r='',i='';
    if(rom&&n>=3){r=b[1];i=b.slice(2).join(' ')}else if(n>=2){i=b.slice(1).join(' ')}
    p.f.push(f);p.i.push(i);if(rom)p.r.push(r)});
   if(!p.i.some(Boolean))p.i=[];ps.push(p)}
  fmt='sen'}
 /* c) umum: judul + blok-blok */
 else{t=cut(dropLbl(t));let B=t.split(/\n\s*\n/).map(b=>b.split('\n').map(x=>x.trim()).filter(Boolean)).filter(b=>b.length);
  if(!B.length)return{err:'Teks kosong.'};
  if(!L)L=libDetectL(B.map(b=>b.join(' ')).join('\n'));
  const rom=L=='ja'||L=='zh',GR=rom?libGrouped(B.flat(),L):null;
  if(GR){ps=GR.ps;if(!title&&GR.title)title=GR.title;fmt='grp'}else{
  if(B.length>=2&&B[0].length==1&&B[0][0].length<=90&&!/[.!?。！？]["”)」』]?$/.test(B[0][0])){if(!title)title=B[0][0];B=B.slice(1)}
  const J=b=>b.join(' '),tgt=s=>{const x=libScore(s);return x[L]>x.id},idn=s=>{const x=libScore(s);return x.id>x[L]};
  const allLines=B.every(b=>b.length==(rom?3:2));
  const lineOK=b=>rom?(libCJK(b[0])&&!libCJK(b[1])&&!libCJK(b[2])):(tgt(b[0])&&idn(b[1]));
  if(allLines&&B.length&&B.every(lineOK)){const p0=[];B.forEach(b=>p0.push(b));
   for(let k=0;k<p0.length;k+=5){const ch=p0.slice(k,k+5);ps.push({f:ch.map(b=>b[0]),r:rom?ch.map(b=>b[1]):null,i:ch.map(b=>b[rom?2:1]),a:1})}fmt='sen'}
  else if(rom&&B.length>=3&&B.every((b,k)=>k%3==0?libCJK(J(b)):!libCJK(J(b)))){for(let k=0;k+2<B.length+0;k+=3)ps.push(libMkPara(J(B[k]),J(B[k+2]),J(B[k+1]),L));fmt='blk'}
  else if(rom&&B.length>=2&&B.every((b,k)=>k%2==0?libCJK(J(b)):!libCJK(J(b)))){for(let k=0;k<B.length;k+=2)ps.push(libMkPara(J(B[k]),B[k+1]?J(B[k+1]):'','',L));fmt='blk'}
  else if(!rom&&B.length>=2&&B.every((b,k)=>k%2==0?tgt(J(b)):idn(J(b)))){for(let k=0;k<B.length;k+=2)ps.push(libMkPara(J(B[k]),B[k+1]?J(B[k+1]):'','',L));fmt='blk'}
  else{B.forEach(b=>ps.push(libMkPara(J(b),'','',L)));fmt='txt'}}}
 ps=ps.filter(p=>p.f.length);
 if(!L)return{err:'Bahasa tidak terdeteksi. Pilih bahasa teks secara manual.'};
 if(!ps.length)return{err:'Tidak ada kalimat yang bisa dibaca dari teks ini.'};
 if(!title){const s=ps[0].f[0].replace(/\s+/g,' ');title=s.length>34?s.slice(0,32)+'…':s}
 return{L,title,ps,note:note.slice(0,800),fmt}}
/* dialog: awalan penutur “A:” / “B:” / “小明：” di kalimat asing dipisah ke p.sp */
const LIBSPK=/^\s*([A-Za-zÀ-ž]{1,12}|[㐀-鿿぀-ヿ]{1,6}|[ＡＢＣＤ])\s*[:：]\s*/;
function libSpeakers(ps){let n=0,t=0;ps.forEach(p=>p.f.forEach(f=>{t++;if(LIBSPK.test(f))n++}));if(!t||n<t*.6)return;
 ps.forEach(p=>{p.sp=p.f.map(f=>{const m=f.match(LIBSPK);return m?m[1].trim():''});p.f=p.f.map(f=>f.replace(LIBSPK,'').trim())})}
/* pintu masuk parser: blok === (Listening) -> pengurai blok; selain itu pengurai terpadu v7.3.1; terakhir cara lama (teks polos) */
function libParse(raw,opt){opt=opt||{};const t=libClean(raw).trim();if(!t)return{err:'Teks kosong.'};
 const fm=opt.fmt||'auto',L0=opt.L||'',lines=t.split('\n'),hasF=lines.some(l=>{const h=libHead(l);return h&&h.k=='f'});
 let r=null;
 if(fm=='aud'||(fm=='auto'&&hasF))r=libParseBlocks(t,L0,0);
 else if(fm!='txt')r=libParseU(t,opt);
 if(!r){r=libParseOld(raw,opt);if(r.err)return r;if(opt.dlg)libSpeakers(r.ps)}
 if(r.err)return r;
 const L=L0||r.L;if(!L)return{err:'Bahasa tidak terdeteksi. Pilih bahasa teks secara manual.'};
 r.L=L;r.ps=r.ps.filter(p=>p.f.length);if(!r.ps.length)return{err:'Tidak ada kalimat yang bisa dibaca dari teks ini.'};
 libPolishPs(r.ps,L,!!opt.dlg);
 let title=(opt.title||'').trim()||r.title||'';if(!title){const x=r.ps[0].f[0].replace(/\s+/g,' ');title=x.length>34?x.slice(0,32)+'…':x}
 r.title=title;r.note=r.note||'';r.warn=r.warn||[];return r}
const libNS=it=>it.ps.reduce((a,p)=>a+p.f.length,0);
const libHasTr=it=>it.ps.some(p=>p.i&&p.i.length);

/* ---------------------------------------------------------------------------------------------
   v7.3.1 — PEMISAH BAHASA: kalimat asing / romanisasi / terjemahan Indonesia tidak boleh tercampur.
   Dasarnya: tiap potongan teks DIKLASIFIKASI sendiri (asing · romaji/pinyin · Indonesia), bukan hanya
   mengandalkan urutan baris. Jadi format yang melenceng (satu baris “asing | romaji | arti”, romaji dalam
   kurung, nomor di setiap baris, dialog tanpa nomor, dll.) tetap terpisah, dan suara (TTS) hanya
   membacakan bahasa asing.
   --------------------------------------------------------------------------------------------- */
const LIBIDW=new Set(('yang dan di ke dari untuk dengan ini itu saya aku kamu anda dia kami kita mereka tidak bukan belum sudah telah akan sedang masih juga hanya sangat lebih paling sekali apa siapa mana kapan bagaimana mengapa kenapa adalah ialah merupakan ada punya bisa dapat boleh harus mau ingin perlu karena jika kalau tetapi tapi atau serta pada dalam oleh agar supaya sambil sebelum sesudah setelah ketika saat hari besok kemarin pagi siang sore malam minggu bulan tahun rumah sekolah buku makan minum pergi datang pulang melihat membaca menulis belajar bekerja bermain suka tolong terima kasih maaf selamat silakan silahkan permisi halo baik sehat kabar nama orang teman ibu bapak ayah anak kakak adik guru murid mahasiswa pelajar air kopi teh roti nasi uang mobil kereta jalan kota negara sini situ sana semua banyak sedikit satu dua tiga empat lima enam tujuh delapan sembilan sepuluh jam menit pukul sekarang nanti tadi lalu kemudian lagi dulu baru bersama bagi seorang sebuah seekor beberapa setiap tiap membeli menjual naik turun masuk keluar duduk berdiri tidur bangun mandi memasak minta ingat lupa tahu mengerti bicara berbicara berkata bertanya menjawab membantu membuka menutup mencari menemukan memakai membawa mengambil memberi menunggu bertemu tinggal hidup senang sedih marah takut lapar haus lelah capek cantik tampan besar kecil panjang pendek tinggi rendah lama murah mahal dingin panas enak sibuk mudah sulit susah penting benar salah kemana dimana berapa mungkin pasti tentu jangan ayo mari sampai kepada terhadap tentang antara tanpa melalui seperti sebagai menjadi menurut yaitu yakni').split(/\s+/));
/* kata Indonesia yang bentuknya sama dengan kata bahasa lain: jangan dihitung sebagai bukti */
const LIBIDX={ja:['kita','kami','aku','mana','sana','hari','mari','baru','lama','tahu'],zh:['ke','di','dan','mana','sana'],nl:['dan','kan','mau','sana'],eo:['ke','dia','sana'],de:['mau','sana']};
const LIBJAW=new Set('wa ga wo o ni no de to mo ka ne yo da desu deshita masu mashita masen mashou deshou dewa janai nai imasu arimasu imashita arimasen kudasai onegai watashi boku ore anata kare kanojo kore sore are kono sono ano koko soko asoko doko nani dare itsu naze doushite totemo sugoku ima kyo ashita kinou ohayo konnichiwa konbanwa sayonara arigato sumimasen gomen hon gakusei sensei tomodachi nihon nihongo taberu nomu iku kuru miru suki kirai ii yoi warui ookii chiisai tte kara made yori demo mada mou desuka masuka'.split(' '));
const libFold=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const libToks=s=>libFold(s).match(/[a-z]+/g)||[];
function libIdHits(x,L){const ex=LIBIDX[L]||[];let n=0;for(const w of libToks(x))if(LIBIDW.has(w)&&!ex.includes(w))n++;return n}
/* klasifikasi satu potongan teks: 'f' asing · 'r' romanisasi · 'i' Indonesia · '' tidak yakin */
function libCls(x,L){x=libSp(x);if(!x)return'';const rom=L=='ja'||L=='zh';
 if(rom){if(libCJK(x))return'f';if(!/[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(x))return'';if(libTone(x))return'r';
  const id=libIdHits(x,L);let jh=0;if(L=='ja')for(const w of libToks(x))if(LIBJAW.has(w))jh++;
  if(id>jh)return'i';if(jh>id)return'r';
  if(L=='zh'&&!id){const t=libToks(x);if(t.length&&t.every(w=>w.length<=7)&&t.reduce((a,w)=>a+w.length,0)/t.length<=4)return'r'}
  return''}
 const id=libIdHits(x,L),q=libScore(x)[L]||0;if(id>q)return'i';if(q>id)return'f';return''}
const LIBSEPS=/\s*[|｜]\s*|\t+|\s+[–—―]\s+|\s+-{1,2}\s+|\s+(?:=>|->|→|⇒|=)\s+|\s+\/\/\s+/;
const libCJKCh=/[぀-ヿ㐀-鿿々。、！？，：；「」『』（）～〜ー]/;
/* satu baris -> potongan-potongan (asing, lalu romaji/arti yang menempel di baris yang sama) */
function libSplitLine(line,L){const rom=L=='ja'||L=='zh';let s=libSp(line);if(!s)return[];const ex=[];
 s=s.replace(/[（(]([^()（）]{1,240})[）)]/g,(m,inner)=>{const c=libCls(inner,L);if(c=='i'||(rom&&c=='r')){ex.push(libSp(inner));return' '}return m});s=libSp(s);
 let parts=s.split(LIBSEPS).map(libSp).filter(Boolean);
 if(!(parts.length>1&&parts.slice(1).some(p=>{const c=libCls(p,L);return c=='r'||c=='i'})))parts=[s];
 if(parts.length==1){
  if(rom){let e=-1;for(let k=s.length-1;k>=0;k--)if(libCJKCh.test(s[k])){e=k;break}
   if(e>=0&&e<s.length-1){const head=s.slice(0,e+1),tail=libSp(s.slice(e+1));
    if(tail&&/[A-Za-zāīūēōǎ]{2,}/.test(tail)&&(/\s/.test(tail)||libCls(tail,L)=='r'||libCls(tail,L)=='i')){parts=[libSp(head)].concat(libSplit(tail,'rom'))}}}
  else{const ss=libSplit(s,L);if(ss.length>=2){let k=ss.length;while(k>1&&libCls(ss[k-1],L)=='i')k--;if(k<ss.length)parts=[ss.slice(0,k).join(' '),ss.slice(k).join(' ')]}}}
 return parts.concat(ex)}
const LIBSPKS=/^\s*(?:(?:speaker|penutur|pembicara|orang|person)\s+)?([A-HＡ-Ｈ])\s*[:：]\s*/;
const libSpN=x=>String(x).replace(/[Ａ-Ｈ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).toUpperCase();
/* furigana / sisa tanda kurung pada kalimat asing */
function libFixFText(f,L){let s=String(f||'');
 if(L=='ja')s=s.replace(/([㐀-鿿々]+)[（(][ぁ-ゟ゠-ヿー・\s]{1,24}[）)]/g,'$1');
 s=s.replace(/^\s*[\[【〔［(（]\s*\d{1,3}\s*(?:[.\-:·．]\s*\d{1,3})?\s*[\]】〕］)）]\s*[:：.)\-–—]?\s*/,'');
 return libSp(s)}
/* rakit satu kelompok baris -> {f,r,i}. Baris pertama selalu kalimat asing. */
function libAsm(lines,L,dlg){const rom=L=='ja'||L=='zh',F=[],R=[],I=[];let seenI=0,dropped=0;
 lines.forEach((ln0,li)=>{let ln=String(ln0||'').trim();if(!ln)return;
  const lb=libLabel(ln);let forced=lb.k;ln=lb.t;if(dlg&&li>0)ln=ln.replace(LIBSPKS,'');
  if(forced&&!rom&&forced=='r')return;
  const pcs=libSplitLine(ln,L);
  pcs.forEach((p,pi)=>{p=libSp(p);if(!p)return;
   let c=(li==0&&pi==0)?'f':(forced||libCls(p,L));
   if(c==''){c=rom?((!R.length&&!seenI)?'r':'i'):'i'}
   if(c=='f'){if(rom||!seenI)F.push(p);else dropped++}
   else if(c=='r'){if(rom)R.push(p);else{I.push(p);seenI=1}}
   else{I.push(p);seenI=1}})});
 return{f:libFixFText(F.join(rom?'':' '),L),r:libSp(R.join(' ')),i:libSp(I.join(' ')),dropped}}
/* satu kalimat asing apa adanya -> bersihkan campuran; ekstra dikembalikan sebagai r / i */
function libSan(f,L){const a=libAsm([String(f||'')],L);return{f:a.f||libSp(f),r:a.r,i:a.i}}
/* teks yang BOLEH dibacakan suara: hanya bahasa asing */
function ttsClean(t,L){let s=libSan(String(t||''),L).f;s=s.replace(LIBSPKS,'');
 if(L=='ja'||L=='zh')s=s.replace(/[（(][^（）()]*[A-Za-zāīūēōǎ][^（）()]*[）)]/g,'');
 return libSp(s)}
const LIBMARK=l=>/^(?:第[一二三四五六七八九十百\d]+[段章节部分]|paragra[fp]h?\s*\d+|段落?\s*\d+|[①-⑩])\s*[:：.]?$/i.test(l);
const LIBNOTE=/^\s*(?:daftar\s+)?(?:kartu\s+)?pembentuk\b[^\n]{0,45}$/im;
const LIBIDP=/^\s*[\[【〔［(（]\s*(\d{1,3})\s*[.\-:·．]\s*(\d{1,3})\s*[\]】〕］)）]\s*[:：.)\-–—]?\s*/;
const LIBIDB=/^\s*#?(\d{1,3})[.\-:·．](\d{1,3})(?:[.):：]|\s)\s*(?=\S)/;
const LIBID1=/^\s*[\[【〔［]\s*(\d{1,4})(?:\s*[.\-:·．]\s*\d{1,3})?\s*[\]】〕］]\s*[:：.)\-–—]?\s*/;
const LIBID1P=/^\s*[(（]\s*(\d{1,4})\s*[)）]\s*[:：.\-–—]?\s*/;
/* baris -> kelompok (satu kelompok = satu kalimat beserta romanisasi/arti-nya) */
function libGroups(lines,L,o){const rom=L=='ja'||L=='zh',sent=!!o.sent,G=[],pre=[];let idRe=null;
 const tiers=sent?[LIBID1,LIBID1P]:[LIBID,LIBIDP,LIBIDB];
 for(const re of tiers){const n=lines.filter(l=>re.test(l)).length;if(n>=(re===LIBIDB?2:1)){idRe=re;break}}
 const build=re=>{const out=[];let cur=null;
  for(const raw of lines){const ln=raw.trim();if(!ln)continue;if(LIBMARK(ln)){cur=null;continue}
   const m=re&&ln.match(re);
   if(m){const key=sent?m[1]:(m[1]+'.'+m[2]),body=ln.slice(m[0].length).trim();
    if(cur&&cur.key===key)cur.lines.push(body);else{cur={key,p:+m[1],s:sent?0:+m[2],lines:[body]};out.push(cur)}}
   else if(cur)cur.lines.push(ln);else if(!out.length)pre.push(ln)}
  return out};
 if(idRe){let g=build(idRe);
  /* nomor dipakai di SETIAP baris (asing, romaji, arti diberi nomor berurutan)? -> abaikan nomor */
  const bad=g.filter(x=>{const c=libCls(libSplitLine(x.lines[0],L)[0]||'',L);return rom?c!='f':c=='i'}).length;
  if(g.length>=3&&bad>=g.length*.4){idRe=null;pre.length=0;lines=lines.map(l=>{for(const re of tiers){const m=l.match(re);if(m)return l.slice(m[0].length)}return l})}
  else return{G:g,pre,id:1}}
 /* tanpa nomor: kelompok dimulai pada baris asing (atau baris dengan penutur A:/B:) */
 const spStrict=o.dlg&&lines.filter(l=>LIBSPKS.test(l.trim())&&!libLabel(l.trim()).k).length>=2;
 let cur=null,blank=true,mk=false;
 for(const raw of lines){const ln=raw.trim();if(!ln){blank=true;continue}
  if(LIBMARK(ln)){mk=true;blank=true;continue}
  if(!G.length&&!cur&&/^(?:judul|title)\s*[:：]/i.test(ln)){pre.push(ln);continue}
  const body=ln.replace(LIBSPKS,''),lead=libSplitLine(body,L)[0]||'',c=libCls(lead,L),hasSp=spStrict&&LIBSPKS.test(ln)&&!libLabel(ln).k;
  let start=false;
  if(hasSp)start=true;else if(spStrict&&cur)start=false;
  else if(c=='f'&&!libLabel(ln).k)start=true;else if(!cur)start=true;
  else if(c==''&&!rom&&cur.lines.slice(1).some(x=>libCls(libSplitLine(x,L)[0]||'',L)=='i'))start=true;
  if(start){cur={lines:[ln],blank,mk};G.push(cur)}else cur.lines.push(ln);blank=false;mk=false}
 return{G,pre,id:0}}
/* pengurai terpadu untuk Reading / Listening (tanpa blok ===) / Dialog */
function libParseU(t,opt){let note='',L=opt.L||'';const mi=t.search(LIBNOTE);let b=t;if(mi>=0){note=t.slice(mi).trim();b=t.slice(0,mi)}
 let lines=b.split('\n').map(x=>x.replace(/[ \t]+$/,''));
 if(!L)L=libDetectL(lines.join('\n'));if(!L)return null;
 const rom=L=='ja'||L=='zh',dlg=!!opt.dlg,warn=[];
 let r0=libGroups(lines,L,{dlg});let G=r0.G,pre=r0.pre,title='';
 if(!G.length)return null;
 /* judul */
 const pj=pre.find(x=>/^(?:judul|title)\s*[:：]/i.test(x));if(pj)title=libTitleOf(pj);
 else if(r0.id&&pre.length&&pre[0].length<=90&&!libEndsS(pre[0]))title=libTitleOf(pre[0]);
 else if(!r0.id&&G.length>1){const g0=G[0];if(g0.lines.length==1&&g0.lines[0].length<=60&&!libEndsS(g0.lines[0])&&(G[1].blank||G[1].mk||g0.mk)){title=libTitleOf(g0.lines[0]);G=G.slice(1)}}
 /* penutur */
 const E=G.map(g=>{const l0=g.lines[0]||'';let sp='';
  if(dlg){const m=l0.match(LIBSPKS);if(m&&!libLabel(l0).k){sp=libSpN(m[1]);g=Object.assign({},g,{lines:[l0.slice(m[0].length)].concat(g.lines.slice(1))})}}
  const e=libAsm(g.lines,L,dlg);return Object.assign(e,{g,sp})}).filter(e=>e.f);
 if(!E.length)return null;
 const hasTr=E.some(e=>e.i||e.r);
 if(!r0.id&&!hasTr&&!dlg)return null;
 /* paragraf */
 const ps=[];let curP=null,par=0;const anyMk=E.some(x=>x.g.mk);
 const fb=E.length>1?E.slice(1).filter(e=>e.g.blank||e.g.mk).length/(E.length-1):0;
 E.forEach((e,k)=>{let key;
  if(dlg)key=1;else if(r0.id)key=e.g.p;
  else if(fb>=.8&&!anyMk)key=Math.floor(k/5);
  else{if(k>0&&(e.g.mk||(e.g.blank&&fb<.8)))par++;key=par}
  if(!curP||curP.key!==key){curP={key,f:[],i:[],r:rom?[]:null,sp:[],a:1};ps.push(curP)}
  curP.f.push(e.f);curP.i.push(e.i||'');if(rom)curP.r.push(e.r||'');curP.sp.push(e.sp||'')});
 let miR=0,miI=0,tot=E.length,dr=E.reduce((a,e)=>a+e.dropped,0);
 ps.forEach(p=>{p.f.forEach((f,k)=>{if(rom&&!p.r[k])miR++;if(!p.i[k])miI++});
  if(!p.i.some(Boolean))p.i=[];if(p.r&&!p.r.some(Boolean))p.r=null;
  if(!p.sp.some(Boolean))delete p.sp;delete p.key});
 if(rom&&miR&&miR<tot)warn.push(miR+' dari '+tot+' kalimat tidak punya baris romanisasi (dikosongkan, tidak digeser).');
 if(miI&&miI<tot)warn.push(miI+' dari '+tot+' kalimat tidak punya terjemahan.');
 if(dr)warn.push(dr+' potongan teks asing di dalam baris terjemahan diabaikan (agar suara tidak membaca campuran).');
 if(dlg&&!ps.some(p=>p.sp)){const p0=ps[0];p0.sp=p0.f.map((_,k)=>k%2?'B':'A');warn.push('Penutur A:/B: tidak ditemukan; penutur diselang A/B otomatis.')}
 if(!hasTr)warn.push('Tidak ada baris terjemahan yang dikenali.');
 return{L,title,ps,note:note.slice(0,800),warn,fmt:'stk'}}
/* bank kalimat: banyak kalimat tunggal sekaligus */
function libParseSents(raw,opt){opt=opt||{};let t=libClean(raw).trim();if(!t)return{err:'Teks kosong.'};
 let note='';const mi=t.search(LIBNOTE);if(mi>=0){note=t.slice(mi);t=t.slice(0,mi)}
 const lines=t.split('\n').map(x=>x.trim()).filter(x=>!/^(?:judul|title)\s*[:：]/i.test(x)&&!libHead(x));
 let L=opt.L||'';if(!L)L=libDetectL(lines.join('\n'));if(!L)return{err:'Bahasa tidak terdeteksi. Pilih bahasa secara manual.'};
 const rom=L=='ja'||L=='zh',warn=[],g0=libGroups(lines,L,{sent:true}),out=[];let missR=0,missI=0,dr=0;
 for(const g of g0.G){const e=libAsm(g.lines,L,false);if(!e.f)continue;dr+=e.dropped;if(rom&&!e.r)missR++;if(!e.i)missI++;out.push({f:e.f,r:e.r,i:e.i,n:g.key||''})}
 if(!out.length)return{err:'Tidak ada kalimat yang bisa dibaca.'};
 if(rom&&missR&&missR<out.length)warn.push(missR+' dari '+out.length+' kalimat tanpa romanisasi (dibuat otomatis, perkiraan).');
 if(missI&&missI<out.length)warn.push(missI+' dari '+out.length+' kalimat tanpa terjemahan.');
 if(dr)warn.push(dr+' potongan teks asing di dalam baris terjemahan diabaikan.');
 const pb={};note.split('\n').forEach(l=>{const m=l.match(LIBID1)||l.match(LIBID1P);if(m)pb[m[1]]=l.slice(m[0].length).trim().slice(0,200)});
 out.forEach(o=>{if(o.n&&pb[o.n])o.pb=pb[o.n]});
 return{L,sents:out,fmt:g0.id?'id':'line',warn}}
/* rapikan hasil parser (juga teks lama di Pustaka): kalimat asing dibersihkan, ekstra dipindah ke romanisasi/arti */
function libPolishPs(ps,L,dlg){const rom=L=='ja'||L=='zh';let ch=0;
 ps.forEach(p=>{if(p.a===0)return;p.f=p.f.map((f,k)=>{const s=libSan(f,L);
   if(s.f!==f)ch++;
   if(s.r&&rom){if(!p.r)p.r=p.f.map(()=>'');if(!p.r[k]){p.r[k]=s.r;ch++}}
   if(s.i){if(!p.i||!p.i.length)p.i=p.f.map(()=>'');if(!p.i[k]){p.i[k]=s.i;ch++}}
   return s.f});
  if(p.r&&!p.r.some(Boolean))p.r=null});
 if(dlg)libSpeakers(ps);return ch}

/* ---------------------------------------------------------------------------------------------
   2. PENCOCOK KOSAKATA: bentuk kata berubah (konjugasi, jamak, partisip, kata kerja terpisah, ...)
   --------------------------------------------------------------------------------------------- */
const libSet=a=>new Set(a.filter(Boolean));
const libC1=w=>String(w||'').replace(/\([^)]*\)/g,' ').replace(/[~〜～…]/g,' ').replace(/\s+/g,' ').trim();
const libLow=s=>s.toLowerCase().normalize('NFC');
const LIBSEP_DE=['ab','an','auf','aus','bei','ein','fest','her','hin','los','mit','nach','vor','weg','zu','zurück','zusammen','weiter','heraus','hinaus','herein','hinein','fern','statt','teil'];
const LIBSEP_NL=['aan','af','bij','door','in','mee','na','om','op','over','toe','uit','vast','voor','weg','terug','samen','binnen'];
const libEnd=(stem,a)=>a.map(x=>stem+x);
const libUml=w=>{const o=[];for(const [a,b] of[['au','äu'],['a','ä'],['o','ö'],['u','ü']]){const i=w.lastIndexOf(a);if(i>=0){o.push(w.slice(0,i)+b+w.slice(i+a.length));break}}return o};
const libAdjEnd=['','e','en','em','er','es'];

/* ---- Jerman ---- */
function libDeNoun(raw){const o=new Set(),w0=libC1(raw).replace(/^(?:(?:der|die|das)(?:\/(?:der|die|das))*)\s+/i,'');
 const pl=((typeof DX!='undefined'&&DX&&DX.n[raw])||'').replace(/^die\s+/i,'');
 for(const w of w0.split(/\s*\/\s*/)){const l=libLow(w);if(!l)continue;[l,l+'s',l+'es',l+'n',l+'en'].forEach(x=>o.add(x))}
 for(const p of pl.split(/\s*\/\s*/)){const l=libLow(libC1(p));if(l){o.add(l);if(!/[ns]$/.test(l))o.add(l+'n')}}
 return o}
function libDeVerb(raw){const o=new Set(),w=libLow(libC1(raw).replace(/^sich\s+/i,'')).trim();if(!w||/\s/.test(w))return o;
 const info=((typeof DX!='undefined'&&DX&&DX.v[raw])||'').split(' · ').map(x=>x.trim()),stemOf=x=>/(?:ern|eln)$/.test(x)?x.slice(0,-1):x.replace(/en$/,'').replace(/n$/,'');
 const reg=(st,P)=>{const pre=P||'';[ 'e','st','t','en','et','est','n','te','test','ten','tet','ete','etest','eten','etet'].forEach(s=>o.add(st+s));
  o.add(pre+'ge'+st+'t');o.add(pre+'ge'+st+'et');o.add(pre+'ge'+st+'en');o.add(pre+'ge'+st+'te')};
 o.add(w);reg(stemOf(w));
 let part='';
 if(info.length>=2&&info[0]){const p3=info[0].split(/\s+/),pr=info[1].split(/\s+/),pp=(info[2]||'').split(/\s+/),h3=p3[0],hr=pr[0],ppw=pp[pp.length-1];
  part=p3.length>1?p3[p3.length-1]:'';
  [h3,h3+'st',hr,hr+'st',hr+'en',hr+'t',hr+'e'].forEach(x=>o.add(libLow(x)));
  if(ppw&&!/^(?:hat|ist|haben|sein)$/.test(ppw)){const q=libLow(ppw);[q,q+'e',q+'en',q+'er',q+'em',q+'es'].forEach(x=>o.add(x))}
  if(part&&w.startsWith(part)){const P=libLow(part),h=libLow(h3),r=libLow(hr);[P+h,P+r,P+r+'en',P+h+'st'].forEach(x=>o.add(x));const base=w.slice(P.length);o.add(P+'zu'+base);reg(stemOf(base),P)}}
 else{const pf=LIBSEP_DE.find(p=>w.startsWith(p)&&w.length>p.length+3);if(pf){const base=w.slice(pf.length);reg(stemOf(base),pf);o.add(pf+'zu'+base);libEnd(stemOf(base),['e','st','t','en','te','ten']).forEach(x=>o.add(x))}}
 return o}
function libDeAdj(raw){const o=new Set(),l=libLow(libC1(raw)),bs=[l];if(l.endsWith('e'))bs.push(l.slice(0,-1));
 const all=[];bs.forEach(b=>{all.push(b);libUml(b).forEach(u=>all.push(u))});
 all.forEach(b=>{libAdjEnd.forEach(e=>{o.add(b+e);o.add(b+'er'+e);o.add(b+'st'+e);o.add(b+'est'+e)})});o.add(l);return o}
function libDeSets(raw,pos){const w0=libC1(raw).replace(/^(?:(?:der|die|das)(?:\/(?:der|die|das))*)\s+/i,'').replace(/^sich\s+/i,'');
 const ws=w0.split(' ').filter(Boolean);
 const one=(x,p)=>p=='N'?libDeNoun(x):p=='V'?libDeVerb(x):p=='A'?libDeAdj(x):new Set([libLow(libC1(x))]);
 if(ws.length<=1)return[one(raw,pos)];
 const sets=ws.slice(0,-1).map(x=>{const l=libLow(x),s=new Set([l]);libAdjEnd.concat(['s','n','t','te','st']).forEach(e=>s.add(l+e));return s});
 const head=ws[ws.length-1];sets.push(pos=='V'?libDeVerb(head):pos=='N'?libDeNoun(head):one(head,pos));return sets}

/* ---- Belanda ---- */
const libNlFix=s=>{const o=new Set([s]);const m=s.match(/^(.*[^aeiou])([aeiou])([^aeiou])$/);if(m)o.add(m[1]+m[2]+m[2]+m[3]);if(/v$/.test(s))o.add(s.slice(0,-1)+'f');if(/z$/.test(s))o.add(s.slice(0,-1)+'s');return[...o]};
function libNlNoun(raw){const o=new Set(),w0=libC1(raw).replace(/^(?:(?:de|het)(?:\/(?:de|het))*)\s+/i,'').replace(/'/g,''),pl=((typeof DXN!='undefined'&&DXN&&DXN.n[raw])||'').replace(/^(?:de|het)\s+/i,'').replace(/'/g,'');
 for(const w of w0.split(/\s*\/\s*/)){const l=libLow(w);if(!l)continue;[l,l+'s',l+'je',l+'tje',l+'pje',l+'etje',l+'jes',l+'tjes'].forEach(x=>o.add(x))}
 for(const p of pl.split(/\s*\/\s*/)){const l=libLow(libC1(p));if(l)o.add(l)}return o}
function libNlVerb(raw){const o=new Set(),w=libLow(libC1(raw).replace(/^zich\s+/i,'')).trim();if(!w||/\s/.test(w))return o;
 const info=((typeof DXN!='undefined'&&DXN&&DXN.v[raw])||'').split(' · ').map(x=>x.trim());
 const reg=(inf,P)=>{const pre=P||'',base=inf.replace(/en$/,'').replace(/n$/,'');
  for(const st of libNlFix(base)){[st,st+'t',st+'en',st+'te',st+'de',st+'ten',st+'den'].forEach(x=>o.add(pre+x));
   const nge=/^(?:be|ge|her|ont|ver|er)/.test(inf)&&!P;
   [nge?'':'ge'].forEach(g=>{o.add(pre+g+st+'t');o.add(pre+g+st+'d');o.add(pre+g+st+'te')})}
  o.add(pre+inf)};
 o.add(w);reg(w);
 let part='';
 if(info.length>=2&&info[0]){const p3=info[0].split(/\s+/),pr=info[1].split(/\s+/),pp=(info[2]||'').split(/\s+/),h3=libLow(p3[0]),hr=libLow(pr[0]),ppw=libLow(pp[pp.length-1]);
  part=p3.length>1?libLow(p3[p3.length-1]):'';
  const st=[h3];if(/t$/.test(h3))st.push(h3.slice(0,-1));
  st.forEach(s=>{o.add(s);o.add(s+'t');o.add(s+'en')});o.add(hr);o.add(hr+(/e$/.test(hr)?'n':'en'));
  if(ppw&&!/^(?:heeft|is|hebben|zijn)$/.test(ppw)){o.add(ppw);o.add(ppw+'e')}
  if(part&&w.startsWith(part)){const base=w.slice(part.length);st.forEach(s=>{o.add(part+s);o.add(part+s+'t')});o.add(part+hr);o.add(part+hr+(/e$/.test(hr)?'n':'en'));reg(base,part)}}
 else{const pf=LIBSEP_NL.find(p=>w.startsWith(p)&&w.length>p.length+3);if(pf)reg(w.slice(pf.length),pf)}
 return o}
function libNlAdj(raw){const o=new Set(),l=libLow(libC1(raw)),cmp=((typeof DXN!='undefined'&&DXN&&DXN.a[raw])||'').toLowerCase();
 const bs=new Set([l]);let m=l.match(/^(.*[^aeiou])([aeiou])\2([^aeiou])$/);if(m)bs.add(m[1]+m[2]+m[3]);if(/f$/.test(l))bs.add(l.slice(0,-1)+'v');if(/s$/.test(l))bs.add(l.slice(0,-1)+'z');
 bs.forEach(b=>{[b,b+'e',b+'er',b+'ere',b+'st',b+'ste'].forEach(x=>o.add(x))});o.add(l);o.add(l+'e');o.add(l+'er');o.add(l+'st');if(cmp){o.add(cmp);o.add(cmp+'e')}return o}
function libNlSets(raw,pos){const w0=libC1(raw).replace(/^(?:(?:de|het)(?:\/(?:de|het))*)\s+/i,'').replace(/^zich\s+/i,'');const ws=w0.split(' ').filter(Boolean);
 const one=(x,p)=>p=='N'?libNlNoun(x):p=='V'?libNlVerb(x):p=='A'?libNlAdj(x):new Set([libLow(libC1(x))]);
 if(ws.length<=1)return[one(raw,pos)];
 const sets=ws.slice(0,-1).map(x=>{const l=libLow(x),s=new Set([l]);['e','en','er','s','t','te','de'].forEach(e=>s.add(l+e));return s});
 const head=ws[ws.length-1];sets.push(pos=='V'?libNlVerb(head):pos=='N'?libNlNoun(head):one(head,pos));return sets}

/* ---- Esperanto ---- */
const LIBEO_P=new Set(['mi','ni','vi','li','ŝi','ĝi','ili','oni','si','ci']);
function libEo(raw,pos){const o=new Set(),w=libLow(libC1(raw)).replace(/\s+/g,'');if(!w)return[o];
 o.add(w);
 if(LIBEO_P.has(w)){['n','a','aj','an','ajn'].forEach(e=>o.add(w+e));return[o]}
 if(/^(?:ki|ti|i|ĉi|neni)(?:u|a)$/.test(w)){['j','n','jn'].forEach(e=>o.add(w+e));return[o]}
 if(/^(?:ki|ti|i|ĉi|neni)o$/.test(w)){o.add(w+'n');return[o]}
 if(pos!='O'||/^[\p{L}]+[oai]$/u.test(w)&&w.length>=4){
  if(/[oaei]$/.test(w)&&w.length>=3){const r=w.slice(0,-1);
   ['o','oj','on','ojn','a','aj','an','ajn','e','en','i','as','is','os','us','u'].forEach(e=>o.add(r+e));
   for(const p of['ant','int','ont','at','it','ot'])['a','aj','an','ajn','o','oj','on','ojn','e','en'].forEach(e=>o.add(r+p+e))}}
 return[o]}

/* ---- Mandarin & Jepang (tanpa spasi: substring) ---- */
const libEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function libZhF(entries){const pats=new Set(),co=[];
 for(const e of entries){const raw=String(e[0]||'');for(let alt of raw.split(/\s*[\/、]\s*/)){alt=alt.replace(/\([^)]*\)|（[^）]*）/g,'').replace(/\s+/g,'').trim();if(!alt)continue;
  const parts=alt.split(/[…~～—]+|\.{2,}/).filter(Boolean);if(parts.length>1)co.push(parts);else if(parts[0])pats.add(parts[0])}}
 const f={k:'sub'};if(pats.size)f.re=new RegExp([...pats].sort((a,b)=>b.length-a.length).map(libEsc).join('|'),'g');if(co.length)f.co=co;return f}
const LIBROW={'る':'るりらっれろまなたてよさず','う':'うわいっえお','く':'くかきいけこ','ぐ':'ぐがぎいげご','す':'すさしせそ','つ':'つたちってと','ぬ':'ぬなにんねの','ぶ':'ぶばびんべぼ','む':'むまみんめも'};
/* romaji Hepburn -> hiragana (untuk mencocokkan teks yang ditulis dengan kana) */
const LIBKA={a:'あ',i:'い',u:'う',e:'え',o:'お',ka:'か',ki:'き',ku:'く',ke:'け',ko:'こ',sa:'さ',si:'し',shi:'し',su:'す',se:'せ',so:'そ',ta:'た',ti:'ち',chi:'ち',tu:'つ',tsu:'つ',te:'て',to:'と',na:'な',ni:'に',nu:'ぬ',ne:'ね',no:'の',ha:'は',hi:'ひ',hu:'ふ',fu:'ふ',he:'へ',ho:'ほ',ma:'ま',mi:'み',mu:'む',me:'め',mo:'も',ya:'や',yu:'ゆ',yo:'よ',ra:'ら',ri:'り',ru:'る',re:'れ',ro:'ろ',wa:'わ',wo:'を',ga:'が',gi:'ぎ',gu:'ぐ',ge:'げ',go:'ご',za:'ざ',zi:'じ',ji:'じ',zu:'ず',ze:'ぜ',zo:'ぞ',da:'だ',di:'ぢ',du:'づ',de:'で',do:'ど',ba:'ば',bi:'び',bu:'ぶ',be:'べ',bo:'ぼ',pa:'ぱ',pi:'ぴ',pu:'ぷ',pe:'ぺ',po:'ぽ',
 kya:'きゃ',kyu:'きゅ',kyo:'きょ',sha:'しゃ',shu:'しゅ',sho:'しょ',sya:'しゃ',syu:'しゅ',syo:'しょ',cha:'ちゃ',chu:'ちゅ',cho:'ちょ',tya:'ちゃ',tyu:'ちゅ',tyo:'ちょ',nya:'にゃ',nyu:'にゅ',nyo:'にょ',hya:'ひゃ',hyu:'ひゅ',hyo:'ひょ',mya:'みゃ',myu:'みゅ',myo:'みょ',rya:'りゃ',ryu:'りゅ',ryo:'りょ',gya:'ぎゃ',gyu:'ぎゅ',gyo:'ぎょ',ja:'じゃ',ju:'じゅ',jo:'じょ',jya:'じゃ',jyu:'じゅ',jyo:'じょ',zya:'じゃ',zyu:'じゅ',zyo:'じょ',bya:'びゃ',byu:'びゅ',byo:'びょ',pya:'ぴゃ',pyu:'ぴゅ',pyo:'ぴょ',fa:'ふぁ',fi:'ふぃ',fe:'ふぇ',fo:'ふぉ',ti2:'てぃ',wi:'うぃ',we:'うぇ'};
function libRomaji2Kana(r){r=String(r||'').toLowerCase().replace(/[^a-zāīūēō'\- ]/g,'');if(!r.trim())return[];
 const vars=[[r]];let res=[r];
 if(/[āīūēō]/.test(r)){res=[''];for(const ch of r){const m={ā:['aa'],ī:['ii'],ū:['uu'],ē:['ee','ei'],ō:['ou','oo']}[ch];if(m){const n=[];res.forEach(x=>m.forEach(y=>n.push(x+y)));res=n.slice(0,8)}else res=res.map(x=>x+ch)}}
 const out=[];for(const s0 of res){const s=s0.replace(/[\s\-]/g,'');let k='',i=0,bad=0;
  while(i<s.length){const c=s[i];
   if(c=="'"){i++;continue}
   if(c=='n'&&(i+1==s.length||!/[aiueoy]/.test(s[i+1]))){k+='ん';i+=(s[i+1]=="'"?2:1);continue}
   if(i+1<s.length&&c==s[i+1]&&/[kstpcgzdbfhjmrw]/.test(c)){k+='っ';i++;continue}
   if(c=='t'&&s[i+1]=='c'&&s[i+2]=='h'){k+='っ';i++;continue}
   let hit=0;for(const L of[3,2,1]){const sub=s.substr(i,L);if(LIBKA[sub]){k+=LIBKA[sub];i+=L;hit=1;break}}
   if(!hit){bad=1;break}}
  if(!bad&&k)out.push(k)}
 return[...new Set(out)]}
function libJaPats(base,pos){const P=new Set(),add=x=>x&&P.add(libEsc(x));
 if(!base)return P;add(base);const last=base.slice(-1),stem=base.slice(0,-1),kanaOnly=!/[㐀-鿿]/.test(base);
 if(pos=='V'){
  if(base.length>2&&/する$/.test(base)){const s=base.slice(0,-2);if(s.length>=(kanaOnly?2:1))add(s)}
  else if(base=='する')['する','します','しません','しない','した','して','しよう','しろ','すれば','させ','され','しな','しま'].forEach(add);
  else if(base=='来る'||base=='くる'){(base=='来る'?['来る','来ます','来ません','来ない','来た','来て','来よう','来れ','来い','来られ','来させ','来な','来ま']:['くる','きます','きません','こない','きた','きて','こよう','こい','くれば','こられ','こさせ','きな']).forEach(add)}
  else if(base=='ある'||base=='有る'||base=='在る'){[base,base.slice(0,-1)+'ります',base.slice(0,-1)+'りません',base.slice(0,-1)+'った',base.slice(0,-1)+'って',base.slice(0,-1)+'れば'].forEach(add)}
  else if(LIBROW[last]&&stem.length>=1){let row=LIBROW[last];if(/(^|[てにへ])(行く|いく)$/.test(base))row+='っ';
   if(stem.length>=2||!kanaOnly)P.add(libEsc(stem)+'['+row+']');else{['ます','ません','ました','ない','なかった','た','て'].forEach(s=>add(stem+s))}}}
 else if(pos=='A'&&last=='い'&&base.length>=2){
  if(base=='いい'||base=='よい'){['いい','よい','よく','よかっ','よければ','よさ'].forEach(add)}
  else if(stem.length>=1)P.add(libEsc(stem)+'[いくかけさそ]')}
 return P}
function libJaF(entries,pos){const P=new Set(),co=[];
 for(const e of entries){const raw=String(e[0]||'');
  const kana=libRomaji2Kana(e[1]||'');
  for(let alt of raw.split(/\s*[\/、]\s*/)){alt=alt.replace(/\([^)]*\)|（[^）]*）/g,'').replace(/\s+/g,'').trim();if(!alt)continue;
   const parts=alt.split(/[…~～〜]+/).filter(Boolean);
   if(parts.length>1&&!/^[~〜～]/.test(alt)&&!/[~〜～]$/.test(alt)){co.push(parts);continue}
   const b=parts.join('');libJaPats(b,pos).forEach(x=>P.add(x))}
  if(kana.length&&/[㐀-鿿]/.test(raw)){kana.forEach(k=>{if(k.length>=2)libJaPats(k,pos).forEach(x=>P.add(x))})}}
 const f={k:'sub'};if(P.size)f.re=new RegExp([...P].sort((a,b)=>b.length-a.length).join('|'),'g');if(co.length)f.co=co;return f}


/* ---- GRAMMAR: pola literal dari judul/pola (perkiraan terbaik) ---- */
const LIBGSTOP=new Set('kata kerja bantu benda sifat keterangan dan di ke untuk dengan yang orang tunggal jamak akhiran awalan bentuk pola kalimat subjek objek predikat klausa atau dari pada dalam sebagai saat waktu tempat arah sebab akibat nama akar subjekt verb partizip akkusativ dativ genitiv nominativ nebensatz hauptsatz imperfectum perfectum'.split(' '));
const libCjkRuns=t=>String(t).replace(/\([^)]*\)|（[^）]*）/g,' ').match(/[぀-ヿ㐀-鿿々ー]+/g)||[];
const LIBGCAT=new Set(['量词','名词','动词','形容词','副词','代词','数词','助词','介词','连词','主语','谓语','宾语','补语','状语','定语','疑问代词','人称代词','名量词','动量词','数量短语','陈述句','疑问句','祈使句','感叹句','时间词','方位词','名詞','動詞','形容詞','副詞','助詞','他動詞','自動詞','主語','述語','目的語','連体詞','接続詞','形容動詞','助動詞','名詞句']);
const LIBJVB=/(する|なる|ある|いる|くる|できる|みる|おく|しまう|くれる|あげる|もらう|やる|すぎる|[行い]く)$/;
const LIBPT=/^[のがをにはもでとへ]$/;
function libJaRun(r,before,sibNoRun,j,n){let run=r;
 if(/^(.)\1/.test(run)&&run.length>2)run=run.slice(1);
 if(j==0&&/^[のがで]/.test(run)&&run.length>=4)run=run.slice(1);
 if(/(?:だ|です)$/.test(run)&&run.length>=3)run=run.replace(/(?:だ|です)$/,'');
 const te=!sibNoRun&&!/^[てで]/.test(run)&&/(?:\bV|Sifat|Adj)[-‑ ]?(?:te|て)(?:\s*\([^)]*\))?\s*\+?\s*$/i.test(before),vm=/(^|[\s+(])V[-‑ ]/.test(before);
 let src=libEsc(run);
 if(/する$/.test(run)&&run.length>=3){src=libEsc(run.slice(0,-2))+'[すしさせ]'}
 else if(run.length>=2&&LIBROW[run.slice(-1)]&&(vm||te||LIBJVB.test(run)||(/[㐀-鿿]/.test(run)&&run.length>=3))&&!/(?:ます|ませ|です)$/.test(run)){
  if(run.length==2&&!/[㐀-鿿]/.test(run)&&run!='くる'&&run!='あげる')src=libEsc(run[0])+'['+LIBROW[run[1]]+']';
  else{const P=libJaPats(run,'V');if(P.size)src='(?:'+[...P].sort((x,y)=>y.length-x.length).join('|')+')'}}
 else if(run.length>=3&&/い$/.test(run)&&/Sifat|Adj|やすい|にくい|づらい/.test(before+run)){const P=libJaPats(run,'A');if(P.size)src='(?:'+[...P].join('|')+')'}
 if(te)src='[てで](?:'+src+')';
 return src}
function libGramF(gid){const g=GK[gid];if(!g)return null;const L=g[1],title=String(g[4]||''),pat=String(g[6]||''),ex=(g[7]||[]).map(e=>String(e).split('\n')[0]);
 if(L=='zh'||L=='ja'){const alts=[];
  const gl=t=>String(t).replace(/\([^)]*\)|（[^）]*）/g,' '),exN=ex.map(e=>e.replace(/\s+/g,''));
  const isCat=r=>LIBGCAT.has(r)||/^[぀-ヿ㐀-鿿]{1,3}形$/.test(r)||(r.length>=3&&/(副词|短语|谓语|定语|状语|补语|主语|宾语|词语|量词|名词|动词|形容词|结构|类型|后缀|复句|副詞|名詞|動詞|形容詞)/.test(r));
  for(const src of[pat,title]){if(alts.length)break;
   if(src===title&&/[A-Za-z]/.test(gl(title)))continue;
   const parts=src.split(/\s*[\/／、;]\s*|\n/),sib=parts.some(x=>!libCjkRuns(x).length);
   for(const a of parts){const g=gl(a),toks=[...g.matchAll(/[぀-ヿ㐀-鿿々ー]+/g)].map(m=>({r:m[0],i:m.index,e:m.index+m[0].length}));
    let ts=toks.filter(t=>!isCat(t.r)&&(src!==title||!exN.length||exN.some(e=>e.includes(t.r))));if(!ts.length)continue;if(L=='ja'&&ts.length>1&&LIBPT.test(ts[0].r))ts=ts.slice(1);
    if(ts.map(t=>t.r).join('').length>12)continue;alts.push({ts,g,toks,sib})}}
  if(!alts.length)return null;const single=new Set(),ord=[];let gen=1;
  for(const {ts,g,toks,sib} of alts){const srcs=ts.map((t,j)=>{if(L!='ja')return libEsc(t.r);const k=toks.indexOf(t),pe=k>0?toks[k-1].e:0;return libJaRun(t.r,g.slice(pe,t.i),sib,j,ts.length)});
   if(ts.length==1&&srcs[0]==libEsc(ts[0].r))single.add(ts[0].r);else ord.push(new RegExp(srcs.join('.{0,15}?'),'g'));if(ts.map(t=>t.r).join('').length>1)gen=0}
  const f={k:'sub'};if(single.size)f.re=new RegExp([...single].sort((a,b)=>b.length-a.length).map(libEsc).join('|'),'g');if(ord.length)f.ord=ord;return{alts:[f],gen}}
 const exT=ex.map(e=>new Set(libTok(e,L))),need=exT.length?Math.max(1,Math.ceil(exT.length*.4)):0,words=new Set(),pre=[],cont=[];
 const ok=w=>w.length>=2&&!LIBGSTOP.has(w)&&!LIBSWS.id.has(w);
 const inEx=w=>!need||exT.filter(t=>t.has(w)).length>=need;
 const take=(src,single)=>{const t=String(src).replace(/\([^)]*\)/g,' ');
  for(const seg of t.split(/[:\/,;+=]|\s[–-]\s|\n/)){const ws=seg.trim().split(/\s+/).filter(Boolean);if(!ws.length)continue;if(single&&ws.length>1)continue;
   for(const w0 of ws){const m=w0.match(/^(-)?([\p{L}]{2,})(-)?$/u);if(!m)continue;const w=libLow(m[2]);if(!ok(w))continue;
    if(m[1]||m[3]){if(m[3]&&!m[1])pre.push(w);else cont.push(w);continue}
    if(!need&&LIBSWS[L]&&LIBSWS[L].has(w))continue;if(inEx(w)&&(need||single||ws.length==1))words.add(w)}}};
 take(pat,!need);take(title,!need);
 const sets=new Set();
 for(const w of words){sets.add(w);
  if(L=='de'&&/en$/.test(w)&&w.length>4)libDeVerb(w).forEach(x=>sets.add(x));
  else if(L=='nl'&&/en$/.test(w)&&w.length>4)libNlVerb(w).forEach(x=>sets.add(x));
  else if(L=='eo'&&/[aeo]?i$/.test(w)&&w.length>3)libEo(w,'V')[0].forEach(x=>sets.add(x))}
 const alts=[];if(sets.size)alts.push({k:'tok',sets:[sets]});if(pre.length||cont.length)alts.push({k:'aff',pre,cont});
 if(!alts.length&&exT.length>=2){/* tanpa pola eksplisit: tambang kata ciri dari contoh sendiri (kata yang ada di >=60% contoh & jarang di korpus) */
  const D0=libExDF(L),cnt=new Map();exT.forEach(t=>t.forEach(w=>cnt.set(w,(cnt.get(w)|0)+1)));const mn=Math.max(2,Math.ceil(exT.length*.6)),cand=[];
  for(const [w,c] of cnt){if(c<mn||w.length<3||LIBGSTOP.has(w)||LIBSWS.id.has(w)||(LIBSWS[L]&&LIBSWS[L].has(w)))continue;const df=(D0.df.get(w)|0)/D0.n;if(df<=.03)cand.push([df,w])}
  cand.sort((a,b)=>a[0]-b[0]);if(cand.length){const st=new Set(cand.slice(0,6).map(x=>x[1]));st.forEach(w=>{if(L=='de'&&/en$/.test(w)&&w.length>4)libDeVerb(w).forEach(x=>st.add(x));else if(L=='nl'&&/en$/.test(w)&&w.length>4)libNlVerb(w).forEach(x=>st.add(x))});return{alts:[{k:'tok',sets:[st]}],gen:0,mined:1}}}
 const gen=!sets.size&&alts.every(a=>a.k=='aff'&&[...a.pre,...a.cont].every(x=>x.length<=2))?1:0;
 return alts.length?{alts,gen}:null}
const LIBEXDF={};
function libExDF(L){if(LIBEXDF[L])return LIBEXDF[L];const df=new Map();let n=0;for(const g of Object.values(GK)){if(g[1]!=L)continue;for(const e of(g[7]||[])){n++;new Set(libTok(String(e).split('\n')[0],L)).forEach(w=>df.set(w,(df.get(w)|0)+1))}}return LIBEXDF[L]={df,n:Math.max(1,n)}}

/* ---- pembangun utama: kunci kartu "id@bahasa" -> bentuk-bentuk pencarian ---- */
const libFM=new Map();
function libForms(key){if(libFM.has(key))return libFM.get(key);let F=null;
 if(GK[key]){try{F=libGramF(key)}catch(e){F=null}libFM.set(key,F);return F}
 try{const b=base(key),L=lang(key),c=K[b],es=c&&c[3][L];if(es&&es.length){const pos=c[1];
  if(L=='zh')F={alts:[libZhF(es)]};
  else if(L=='ja')F={alts:[libJaF(es,pos)]};
  else{const single=new Set(),alts=[];
   const mk={de:libDeSets,nl:libNlSets,eo:libEo}[L];
   for(const e of es){const sets=mk(e[0],pos);if(sets.length==1)sets[0].forEach(x=>single.add(x));else alts.push({k:'tok',sets})}
   if(single.size)alts.unshift({k:'tok',sets:[single]});F={alts}}}}catch(e){F=null}
 libFM.set(key,F);return F}
const libDocs=new Map();
function libTok(s,L){let t=libLow(String(s));if(L=='eo')t=t.replace(/([cghjs])x/g,(m,c)=>({c:'ĉ',g:'ĝ',h:'ĥ',j:'ĵ',s:'ŝ'}[c])).replace(/ux/g,'ŭ');return t.match(/\p{L}+/gu)||[]}
function libDoc(it){let d=libDocs.get(it.id);if(d)return d;const L=it.L,sents=[];it.ps.forEach(p=>p.f.forEach(s=>sents.push(s)));
 d={L,sents,flat:sents.join('').replace(/\s+/g,'')};
 if(L!='ja'&&L!='zh'){const cnt=new Map(),sT=[];sents.forEach(s=>{const tk=libTok(s,L);sT.push(new Set(tk));tk.forEach(w=>cnt.set(w,(cnt.get(w)|0)+1))});d.cnt=cnt;d.sT=sT}
 libDocs.set(it.id,d);return d}
function libCount1(d,F){if(F.k=='aff'){let n=0;for(const [w,c] of d.cnt)if(F.pre.some(p=>w.startsWith(p))||F.cont.some(p=>w.includes(p)))n+=c;return n}
 if(F.k=='sub'){let n=0;if(F.re){F.re.lastIndex=0;const m=d.flat.match(F.re);n+=m?m.length:0}
  if(F.ord)for(const re of F.ord)for(const s of d.sents){re.lastIndex=0;const m=s.replace(/\s+/g,'').match(re);if(m)n+=m.length}
  if(F.co)for(const parts of F.co)for(const s of d.sents){const s2=s.replace(/\s+/g,'');if(parts.every(p=>s2.includes(p)))n++}
  return n}
 if(F.sets.length==1){let n=0;const S0=F.sets[0];if(S0.size<=d.cnt.size){for(const w of S0)n+=d.cnt.get(w)|0}else{for(const [w,c] of d.cnt)if(S0.has(w))n+=c}return n}
 let n=0;for(const st of d.sT){if(F.sets.every(S0=>{for(const w of S0)if(st.has(w))return true;return false}))n++}return n}
function libCountKey(d,key){const F=libForms(key);if(!F)return 0;let n=0;for(const a of F.alts)n+=libCount1(d,a);return n}
const libKeysByL={};
function libKeys(L){if(libKeysByL[L])return libKeysByL[L];const a=[];for(const c of D.C)if(c[3][L]&&c[3][L].length)a.push(ik(c[0],L));return libKeysByL[L]=a}
const libAna=new Map();
function libAnalyze(it){if(libAna.has(it.id))return libAna.get(it.id);const d=libDoc(it),out=[];
 for(const k of libKeys(it.L)){const n=libCountKey(d,k);if(n>0)out.push({k,n})}
 out.sort((a,b)=>b.n-a.n);libAna.set(it.id,out);return out}
const libAnaG=new Map();
function libGKeys(L){return D.G.filter(g=>g[1]==L).map(g=>g[0])}
function libAnalyzeG(it){if(libAnaG.has(it.id))return libAnaG.get(it.id);const d=libDoc(it),out=[];
 for(const k of libGKeys(it.L)){const n=libCountKey(d,k);if(n>0){const F=libForms(k);out.push({k,n,gen:F&&F.gen?1:0,mi:F&&F.mined?1:0})}}out.sort((a,b)=>(a.gen-b.gen)||b.n-a.n);libAnaG.set(it.id,out);return out}
function libForget(id){libDocs.delete(id);libAna.delete(id);libAnaG.delete(id)}
/* status kartu: w = lemah/sedang dipelajari, m = matang/selesai, n = belum dipelajari */
function libSt(k){const g=GK[k]?1:0,s=typeof aiState=='function'?aiState(k,g):null;if(s&&s.t.length)return'w';const c=S.srs[k];if(aiRem(c,g)||S.p[k]==2)return'm';return c&&c.t?'w':S.p[k]==1?'w':'n'}
const LIBSTN={w:'dipelajari / lemah',m:'matang / selesai',n:'belum dipelajari'};
const libOfKey=k=>GK[k]?GK[k][1]:lang(k);
function libLbl(k){if(GK[k]){const g=GK[k];return{w:g[4],r:'',m:'Grammar '+g[2],L:g[1],g:1}}const b=base(k),L=lang(k),c=K[b],e=(c&&c[3][L]||[])[0]||['',''];return{w:e[0],r:e[1]||'',m:c?c[2]:'',L}}

/* ---------------------------------------------------------------------------------------------
   3. TEKS-TO-SPEECH bersama (say() & pemutar): kecepatan 0.5–1.2×, suara pilihan
   --------------------------------------------------------------------------------------------- */
const ttsRate=()=>Math.min(1.2,Math.max(.5,+S.o.ttsr||.9));
function ttsVoices(l){const code=(typeof TL!='undefined'&&TL[l])||'',p=code.toLowerCase().split('-')[0];
 const a=(typeof VZ!='undefined'?VZ:[]).filter(v=>v.lang.toLowerCase().replace('_','-').split('-')[0]==p);
 if(!a.length&&l=='eo')return(typeof VZ!='undefined'?VZ:[]).filter(v=>/^it/i.test(v.lang));return a}
function ttsVoice(l){const code=TL[l];if(!code)return{v:null,lc:''};
 const find=c=>{const p=c.toLowerCase().split('-')[0];return VZ.find(v=>v.lang.replace('_','-').toLowerCase()==c.toLowerCase())||VZ.find(v=>v.lang.toLowerCase().replace('_','-').split('-')[0]==p)};
 const pref=(S.o.lpV||{})[l];let v=pref&&VZ.find(x=>x.voiceURI==pref),lc=code;
 if(!v)v=find(code);if(!v&&l=='eo'){v=find('it-IT');lc='it-IT'}return{v,lc}}
const lpClean=(t,L)=>{let s=ttsClean(t,L).replace(/[~〜*_#`]/g,'').replace(/\s+/g,' ').trim();if(L=='ja'||L=='zh')s=s.replace(/\s+/g,'');return s};

/* ---------------------------------------------------------------------------------------------
   4. TAMBAH TEKS (modal)
   --------------------------------------------------------------------------------------------- */
/* jenis teks: 'r' = Reading, 'l' = Listening (teks lama tanpa penanda dianggap Listening) */
const libKind=it=>it&&(it.k=='r'||it.k=='d')?it.k:'l';
const LIBKN={r:'Reading',l:'Listening',d:'Dialog',s:'Kalimat'};
const LIBKI={r:'📖',l:'🎧',d:'💬',s:'🔤'};
let libAddK='r';
const libPH={
 r:`Judul: [judul] | [arti judul]&#10;&#10;Paragraf 1&#10;[1.1] [kalimat asing]&#10;Romaji: [romaji / pinyin (Jepang & Mandarin)]&#10;Arti: [arti Indonesia]&#10;&#10;[1.2] …`,
 l:`=== TEKS JEPANG ===&#10;[1.1] …&#10;[1.2] …&#10;&#10;=== ROMAJI ===&#10;[1.1] …&#10;&#10;=== TERJEMAHAN INDONESIA ===&#10;[1.1] …`,
 d:`Judul: [judul] | [arti judul]&#10;&#10;[1.1] A: [kalimat asing]&#10;Romaji: [romaji / pinyin (Jepang & Mandarin)]&#10;Arti: [arti Indonesia]&#10;&#10;[1.2] B: …`,
 s:`[1] [kalimat asing]&#10;Romaji: [romaji / pinyin (Jepang & Mandarin)]&#10;Arti: [arti Indonesia]&#10;&#10;[2] …&#10;&#10;Atau satu baris per kalimat:&#10;kalimat asing | romaji | arti`};
const libHelp={
 r:'Reading: tempel hasil Kelas AI → tab Reading. Format apa pun tetap dibaca: kalimat asing, romanisasi, dan arti dipisahkan otomatis per bahasa (suara hanya membacakan bahasa asing). Format dari Kelas AI paling aman karena tiap kalimat bernomor [1.1].',
 l:'Listening: tempel hasil Kelas AI → tab Listening (blok === TEKS ===, ROMAJI/PINYIN, TERJEMAHAN; tiap kalimat bernomor). Teks polos atau format lain juga dikenali.',
 d:'Dialog: tempel hasil Kelas AI → tab Dialog (tiap baris “[1.1] A: …” + romanisasi + arti). Penutur dikenali dari awalan A: / B:.',
 s:'Kalimat: tempel BANYAK kalimat sekaligus (hasil Kelas AI → tab Kalimat, atau tulis sendiri). Tiap kalimat disimpan terpisah. Dikenali: kelompok [1] [2] …, “asing | romaji | arti”, atau satu kalimat per baris.'};
function libAddOpen(pre,kind){libAddClose();libAddK=kind||(typeof S!='undefined'&&S.o&&S.o.libSec)||'r';const m=document.createElement('div');m.id='lbm';m.className='edm';
 m.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="Tambah teks"><div class=edh><div><b>＋ Tambah ke Pustaka</b><small>Tempel hasil dari ChatGPT / Claude / Gemini</small></div><button class=mini data-lb=close aria-label=Tutup>✕</button></div><div class=edb>`+
 `<div class=aio style="margin-top:8px"><small>Simpan ke</small><div class=chips id=lbK></div></div>`+
 `<label class=edl>Teks<small id=lbH></small><textarea id=lbX rows=11 spellcheck=false>${esc(pre||'')}</textarea></label>`+
 `<button data-lb=paste style="margin:8px 0">📋 Tempel dari clipboard</button><div class=gsub id=lbP style="margin:4px 0 10px"></div>`+
 `<label class=edl id=lbTw>Judul (boleh kosong)<input id=lbT autocomplete=off placeholder="Otomatis dari judul / kalimat pertama"></label>`+
 `<div class=aiopts><label class=edl style="flex:1">Bahasa<select id=lbL><option value="">Otomatis (deteksi)</option>${LIBL.map(l=>`<option value=${l}>${libNm(l)}</option>`).join('')}</select></label>`+
 `<label class=edl style="flex:1" id=lbFw>Format<select id=lbF><option value=auto>Otomatis (disarankan)</option><option value=stk>Kelompok per kalimat [1.1]</option><option value=aud>Blok === (Listening)</option><option value=sen>Per kalimat “Paragraf N” (lama)</option><option value=txt>Teks polos (tanpa terjemahan)</option></select></label></div>`+
 `</div><div class=edf><button data-lb=close>Batal</button><button data-lb=save>Simpan</button><button class=pri data-lb=saveplay id=lbSP></button></div></div>`;
 document.body.appendChild(m);document.body.style.overflow='hidden';libAddKR();libAddPrev()}
function libAddKR(){const k=document.getElementById('lbK');if(!k)return;
 k.innerHTML=['r','l','d','s'].map(v=>`<button class="chip${libAddK==v?' on':''}" data-lb=tk data-v=${v}>${LIBKI[v]} ${LIBKN[v]}</button>`).join('');
 const h=document.getElementById('lbH');if(h)h.textContent=libHelp[libAddK];const x=document.getElementById('lbX');if(x)x.placeholder=libPH[libAddK].replace(/&#10;/g,'\n');
 const tw=document.getElementById('lbTw'),fw=document.getElementById('lbFw');if(tw)tw.style.display=libAddK=='s'?'none':'';if(fw)fw.style.display=libAddK=='s'?'none':'';
 const sp=document.getElementById('lbSP');if(sp){sp.style.display=libAddK=='s'?'none':'';sp.innerHTML=libAddK=='r'?'Simpan &amp; baca':'Simpan &amp; putar'}}
function libAddClose(){const m=document.getElementById('lbm');if(m)m.remove();if(!document.getElementById('lpm')&&!document.getElementById('aim')&&!document.getElementById('edm'))document.body.style.overflow=''}
function libAddRead(){const g=id=>{const e=document.getElementById(id);return e?e.value:''};return{x:g('lbX'),t:g('lbT'),L:g('lbL'),f:g('lbF')}}
function libAddParse(){const v=libAddRead();if(libAddK=='s')return libParseSents(v.x,{L:v.L});return libParse(v.x,{L:v.L,title:v.t,fmt:v.f,dlg:libAddK=='d'})}
function libAddPrev(){const p=document.getElementById('lbP');if(!p)return;const v=libAddRead();if(!v.x.trim()){p.textContent='Belum ada teks.';return}
 const r=libAddParse();if(r.err){p.innerHTML=`<span style="color:var(--bad)">${esc(r.err)}</span>`;return}
 const wr=(r.warn||[]).length?`<div style="color:var(--s1);margin-top:4px;font-size:.84rem">${r.warn.map(w=>'⚠ '+esc(w)).join('<br>')}</div>`:'';
 if(libAddK=='s'){const rom=r.L=='ja'||r.L=='zh',n=r.sents.length,nr=r.sents.filter(x=>x.r).length,nt=r.sents.filter(x=>x.i).length,dup=r.sents.filter(x=>S.sl.some(y=>y.L==r.L&&y.f==x.f)).length;
  p.innerHTML=`Terdeteksi: <b>${libNm(r.L)}</b> · ${n} kalimat · terjemahan ${nt}/${n}`+(rom?` · romanisasi ${nr}/${n}`:'')+(dup?` · <b>${dup}</b> sudah ada (dilewati)`:'')+wr;return}
 const ns=r.ps.reduce((a,q)=>a+q.f.length,0),tr=r.ps.some(q=>q.i.length),rom=r.L=='ja'||r.L=='zh',rm=r.ps.some(q=>q.r&&q.r.length),al=r.ps.every(q=>q.a);
 const nr=r.ps.reduce((a,q)=>a+(q.r?q.r.filter(Boolean).length:0),0),nt=r.ps.reduce((a,q)=>a+(q.a?q.i.filter(Boolean).length:q.i.length?q.f.length:0),0);
 const FM={aud:'blok ===',stk:'kelompok [1.1]',sen:'per kalimat',grp:'terkelompok',blk:'paragraf + terjemahan',txt:'teks polos'},dl=libAddK=='d'?(r.ps.some(q=>q.sp)?' · penutur ✓':' · <b>penutur (A:/B:) tidak terbaca</b>'):'';
 p.innerHTML=`Terdeteksi: <b>${libNm(r.L)}</b> · format ${FM[r.fmt]||r.fmt} · ${r.ps.length} paragraf · ${ns} kalimat · terjemahan ${tr?(nt==ns||!al?'✓':'✓ '+nt+'/'+ns):'—'}`+
  (rom?` · romanisasi ${rm?(nr==ns?'✓ selaras '+nr+'/'+ns:'⚠ '+nr+'/'+ns):'— (dibuat otomatis, perkiraan)'}`:'')+dl+(tr&&!al?' <small>(sebagian terjemahan per paragraf)</small>':'')+
  (r.title?`<br><small>Judul: ${esc(r.title)}</small>`:'')+wr}
function libAddSave(play){const r=libAddParse();if(r.err)return toast(r.err);
 if(libAddK=='s'){let n=0,d=0;const seen=new Set(S.sl.map(x=>x.L+'|'+x.f));
  r.sents.forEach(x=>{const key=r.L+'|'+x.f;if(seen.has(key)){d++;return}seen.add(key);S.sl.unshift({id:libId(),L:r.L,f:x.f,r:x.r||'',i:x.i||'',c:Date.now(),d:0,pb:x.pb||''});n++});
  if(S.sl.length>5000)S.sl.length=5000;S.o.libSec='s';save();libAddClose();toast(n+' kalimat disimpan di Pustaka → Kalimat'+(d?' ('+d+' sudah ada)':'')+' ✓');if(typeof tab!='undefined'&&tab!='lib')tab='lib';render();return}
 const it={id:libId(),t:r.title,L:r.L,c:Date.now(),ps:r.ps,h:0,r:0,n:0,k:libAddK};if(r.note)it.nt=r.note;
 S.lib.unshift(it);if(S.lib.length>400)S.lib.length=400;S.o.libSec=libAddK;save();libAddClose();toast('Disimpan di Pustaka → '+LIBKN[libAddK]+' ✓');
 if(typeof tab!='undefined'&&tab!='lib'){tab='lib'}if(play&&libAddK=='r')libOpenId=it.id;render();if(play&&libAddK!='r')lpOpen(it)}
document.addEventListener('click',e=>{const m=document.getElementById('lbm');if(!m)return;if(e.target===m){libAddClose();return}
 const b=e.target.closest('[data-lb]');if(!b)return;const a=b.dataset.lb;
 if(a=='close')libAddClose();else if(a=='save')libAddSave(0);else if(a=='saveplay')libAddSave(1);
 else if(a=='tk'){libAddK=['r','l','d','s'].includes(b.dataset.v)?b.dataset.v:'r';libAddKR();libAddPrev()}
 else if(a=='paste'){try{navigator.clipboard.readText().then(t=>{const x=document.getElementById('lbX');if(x){x.value=t;libAddPrev()}}).catch(()=>toast('Izin clipboard ditolak. Tempel manual di kotak teks.'))}catch(_){toast('Tempel manual di kotak teks.')}}});
document.addEventListener('input',e=>{if(e.target.id=='lbX'||e.target.id=='lbT')libAddPrev()});
document.addEventListener('change',e=>{if(e.target.id=='lbL'||e.target.id=='lbF')libAddPrev()});
document.addEventListener('keydown',e=>{if(!document.getElementById('lbm'))return;if(e.key=='Escape')libAddClose();else if((e.ctrlKey||e.metaKey)&&e.key=='Enter'){e.preventDefault();libAddSave(0)}});

/* ---------------------------------------------------------------------------------------------
   5. PUSTAKA (tab)
   --------------------------------------------------------------------------------------------- */
const libSecV=()=>['r','l','d','s'].includes(S.o.libSec)?S.o.libSec:'r';
const libSecItems=()=>libSecV()=='s'?S.sl:S.lib.filter(t=>libKind(t)==libSecV());
let libLg='',libStt='',libSort='new',libLim=30,libOpenId='',libQ='',libCard='',libAnaF='all',libAnaLim=40;
let libMinOv=0;
const libMinV=()=>libMinOv||Math.max(1,+S.o.libMin||4);
let libIdx=null;
function libIndex(){if(libIdx)return libIdx;libIdx=[];for(const c of D.C)for(const L of LIBL){const es=c[3][L];if(!es||!es.length)continue;libIdx.push({k:ik(c[0],L),L,t:(c[2]+' '+es.map(e=>e[0]+' '+(e[1]||'')).join(' ')).toLowerCase()})}
 for(const g of D.G)if(LIBL.includes(g[1]))libIdx.push({k:g[0],L:g[1],g:1,t:(g[4]+' '+g[6]).toLowerCase()});return libIdx}
function libFindRes(){const q=libQ.trim().toLowerCase(),langs=new Set(libSecItems().map(t=>t.L));
 if(!langs.size)return'<small>Tambahkan teks dulu, lalu cari di sini.</small>';if(!q)return'<small>Ketik untuk mencari kartu dari bahasa yang ada di Pustaka.</small>';
 const r=libIndex().filter(x=>langs.has(x.L)&&(!libLg||x.L==libLg)&&x.t.includes(q));
 r.sort((a,b)=>(b.t.startsWith(q)-a.t.startsWith(q))||a.t.length-b.t.length);
 if(!r.length)return'<small>Tidak ada kartu yang cocok.</small>';
 return`<div class=lbcs>`+r.slice(0,10).map(x=>{const l=libLbl(x.k);return`<button class=lbc data-a=libpick data-k="${esc(x.k)}"><b>${esc(l.w)}</b>${l.r?` <small>${esc(l.r)}</small>`:''}<span>${esc(l.m)}</span><i>${x.g?'Grammar · ':''}${esc(libNm(x.L))}</i></button>`}).join('')+`</div>`+(r.length>10?`<small>${r.length-10} lainnya… persempit pencarian.</small>`:'')}
function libFindRender(){const e=document.getElementById('libfr');if(e)e.innerHTML=libFindRes()}
document.addEventListener('input',e=>{if(e.target.dataset&&e.target.dataset.l=='fq'){libQ=e.target.value;libFindRender()}});
function libFinder(noMin){const l=libCard?libLbl(libCard):null,mn=libMinV();
 return dtag('libf')+`<summary><span>🔎 Cari teks berdasarkan kartu</span>${libCard?'<em class=cnt>aktif</em>':''}</summary><div class=card style="margin-top:8px">`+
 `<p class=gsub style="margin:0 0 8px">Ketik kata atau arti kartu (mis. <i>watashi</i>, <i>私</i>, <i>saya</i>) atau nama grammar (mis. <i>てください</i>, <i>是</i>, <i>Für</i>), lalu pilih. Bentuk kata yang berubah — konjugasi, jamak, partisip, kata kerja terpisah, kata sifat — ikut dihitung. Untuk grammar, teks dicocokkan lewat bagian literal pola (perkiraan; pola yang murni abstrak tidak bisa dicari).</p>`+
 `<input class=lbq data-l=fq placeholder="Cari kartu…" value="${esc(libQ)}" autocomplete=off><div id=libfr style="margin-top:6px">${libFindRes()}</div>`+
 (libCard?`<div class=lbsel><div><small>${l.g?'Grammar':'Kartu'} dipilih · ${esc(libNm(l.L))}</small><br><b>${esc(l.w)}</b> ${l.r?`<small>${esc(l.r)}</small>`:''} <small>${esc(l.m)}</small></div><button class=mini data-a=libclr>✕ Lepas</button></div>`:'')+
 (noMin?'':`<small class=lbl>Minimal muncul</small><div class=chips>${[1,2,3,4,5,6,8,10].map(n=>`<button class="chip${mn==n?' on':''}" data-a=libmin data-v=${n}>${n}×</button>`).join('')}</div>`)+`</div></details>`}
function libFilter(){let a=libSecItems();const mc={},ws={};
 if(libLg)a=a.filter(t=>t.L==libLg);
 if(libStt=='nh')a=a.filter(t=>!t.h);else if(libStt=='nr')a=a.filter(t=>!t.r);else if(libStt=='h')a=a.filter(t=>t.h);else if(libStt=='r')a=a.filter(t=>t.r);
 if(libCard){const L=libOfKey(libCard),mn=libMinV();a=a.filter(t=>t.L==L);a.forEach(t=>mc[t.id]=libCountKey(libDoc(t),libCard));a=a.filter(t=>mc[t.id]>=mn).sort((x,y)=>mc[y.id]-mc[x.id])}
 else if(libSort=='weak'){const W={};a.forEach(t=>{if(!W[t.L])W[t.L]=aiSort(aiPoolV(t.L),0).slice(0,25)});
  a.forEach(t=>{const d=libDoc(t);let sc=0,n=0;W[t.L].forEach(x=>{const c=libCountKey(d,x.k);if(c>0){n++;sc+=Math.min(c,3)*(x.tier==1?2:1)}});ws[t.id]={n,of:W[t.L].length,sc}});
  a.sort((x,y)=>ws[y.id].sc-ws[x.id].sc||y.c-x.c)}
 else if(libSort=='title')a.sort((x,y)=>x.t.localeCompare(y.t));else a.sort((x,y)=>y.c-x.c);
 return{a,mc,ws}}
const libDt=ts=>{const d=new Date(ts);return d.getDate()+' '+['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()]};

/* kalimat yang memuat kartu/grammar + penyorotan */
const libSD=new Map();
function libSentDoc(it,pi,si){const key=it.id+'|'+pi+'|'+si;let d=libSD.get(key);if(d)return d;const L=it.L,f=it.ps[pi].f[si];
 d={L,sents:[f],flat:f.replace(/\s+/g,'')};if(L!='ja'&&L!='zh'){const tk=libTok(f,L),cnt=new Map();tk.forEach(w=>cnt.set(w,(cnt.get(w)|0)+1));d.cnt=cnt;d.sT=[new Set(tk)]}
 libSD.set(key,d);return d}
function libHits(it,key){const out=[];let g=0;it.ps.forEach((p,pi)=>p.f.forEach((f,si)=>{const n=libCountKey(libSentDoc(it,pi,si),key);if(n>0)out.push({pi,si,g:g,n,f,i:p.a!==0&&p.i&&p.i[si]?p.i[si]:''});g++}));return out}
function libHL(f,key,L){const F=libForms(key);if(!F)return esc(f);
 if(L=='ja'||L=='zh'){const t=f.replace(/\s+/g,'');let res=[];const add=re=>{if(!re)return;re.lastIndex=0;let m;while((m=re.exec(t))){if(!m[0].length){re.lastIndex++;continue}res.push([m.index,m.index+m[0].length])}};
  F.alts.forEach(a=>{add(a.re);(a.ord||[]).forEach(add);(a.co||[]).forEach(parts=>parts.forEach(pt=>{let i=t.indexOf(pt);while(i>=0){res.push([i,i+pt.length]);i=t.indexOf(pt,i+pt.length)}}))});
  res.sort((a,b)=>a[0]-b[0]);const mg=[];res.forEach(r=>{const l=mg[mg.length-1];if(l&&r[0]<=l[1])l[1]=Math.max(l[1],r[1]);else mg.push(r.slice())});
  let h='',p=0;mg.forEach(r=>{h+=esc(t.slice(p,r[0]))+'<mark>'+esc(t.slice(r[0],r[1]))+'</mark>';p=r[1]});return h+esc(t.slice(p))}
 const sets=[],aff=[];F.alts.forEach(a=>{if(a.k=='tok')a.sets.forEach(x=>sets.push(x));else if(a.k=='aff')aff.push(a)});
 return esc(f).replace(/[\p{L}]+/gu,w=>{const l=libTok(w,L)[0]||'';const hit=sets.some(x=>x.has(l))||aff.some(a=>a.pre.some(q=>l.startsWith(q))||a.cont.some(q=>l.includes(q)));return hit?'<mark>'+w+'</mark>':w})}
function libSnips(it){const H=libHits(it,libCard);if(!H.length)return'';const L=it.L;
 return`<div class=lbsn><small class=lbl>Ada di ${H.length} kalimat</small>`+H.slice(0,6).map(h=>`<div class=lbs data-a=libgo data-k="${esc(it.id)}" data-v=${h.g}><small>Paragraf ${h.pi+1} · kalimat ${h.si+1}</small><div class=eo>${libHL(h.f,libCard,L)}</div>${h.i?`<div class=idn>${esc(h.i)}</div>`:''}<span class=lbgo>▶ Putar dari sini</span></div>`).join('')+(H.length>6?`<small>…dan ${H.length-6} kalimat lain (buka Rincian).</small>`:'')+`</div>`}
function libRow(it,mc,ws){const ns=libNS(it),op=libOpenId==it.id,kd=libKind(it),id=esc(it.id);
 const btn=kd=='r'?`<button class=pri data-a=libdet data-k="${id}" style="flex:1.4">${op?'Tutup bacaan':'📖 Baca'}</button><button class="${it.r?'on':''}" data-a=libr data-k="${id}">${it.r?'✓ Dibaca':'Tandai dibaca'}</button>`
  :kd=='d'?`<button class=pri data-a=libplay data-k="${id}" style="flex:1.4">▶ Putar</button><button data-a=libdet data-k="${id}">${op?'Tutup':'📖 Baca'}</button><button class="${it.h?'on':''}" data-a=libh data-k="${id}">${it.h?'✓ Selesai':'Tandai selesai'}</button>`
  :`<button class=pri data-a=libplay data-k="${id}" style="flex:1.4">▶ Putar</button><button data-a=libdet data-k="${id}">${op?'Tutup':'Rincian'}</button><button class="${it.h?'on':''}" data-a=libh data-k="${id}">${it.h?'✓ Didengar':'Tandai didengar'}</button>`;
 const bd=kd=='r'?(it.r?'<span class=bdg>📖 dibaca</span>':''):(it.h?(kd=='d'?'<span class=bdg>💬 selesai</span>':'<span class=bdg>🎧 didengar</span>'):'');
 return`<div class="card lbi"><div class=hd><span>${esc(libNm(it.L))} · ${it.ps.length} paragraf · ${ns} kalimat · ${libDt(it.c)}</span><span>${bd}</span></div>`+
  `<div class=mean style="font-size:1.12rem;margin:2px 0 6px">${esc(it.t)}</div>`+
  (mc!=null?`<div class=lbm1><b>${esc(libLbl(libCard).w)}</b> muncul <b>${mc}×</b> di teks ini</div>`:'')+
  (ws?`<div class=lbm1>Memuat <b>${ws.n}</b> dari ${ws.of} kartu lemahmu</div>`:'')+
  (mc!=null?libSnips(it):'')+`<div class=fct>${btn}</div>`+(op?libDetail(it):'')+`</div>`}
function libDetail(it){const m=S.o.rdt=='off'?0:S.o.rdt=='blur'?1:2,rom=it.L=='ja'||it.L=='zh',hasR=it.ps.some(p=>p.r&&p.r.some(Boolean)),rd=libKind(it)=='r';
 let h=`<div class=lbd><div class=rdh><button data-a=libren data-k="${esc(it.id)}">✎ Ganti judul</button><button data-a=libmv data-k="${esc(it.id)}">⇄ Pindah ke ${libKind(it)=='r'?'Listening':libKind(it)=='l'?'Dialog':'Reading'}</button><button data-a=libdel data-k="${esc(it.id)}" style="color:var(--bad)">🗑 Hapus</button></div>`;
 h+=it.ps.map((p,pi)=>{const a=p.a!==0;return`<div class=lbp><small class=lbl>Paragraf ${pi+1}</small>`+p.f.map((f,si)=>{
   let rr=p.r&&p.r.length&&a?(p.r[si]||''):'',au=0;if(!rr&&rom&&a){rr=libAutoRom(it.L,f);au=1}
   const sp=p.sp&&p.sp[si]?`<b class=spk>${esc(p.sp[si])}</b> `:'';
   return`<div class=rds><div class=eo>${sp}${esc(f)}${spk(f,it.L)}</div>${rr?`<div class="r rom${au?' auto':''}"${au?' title="Romanisasi otomatis (perkiraan)"':''}>${esc(rr)}</div>`:''}${a&&p.i[si]&&m?`<div class="idn${m==1?' ltm mnh':''}">${esc(p.i[si])}</div>`:''}</div>`}).join('')+
   (!a&&m?`${p.r&&p.r.length?`<div class="r rom">${esc(p.r.join(' '))}</div>`:''}${p.i.length?`<div class="idn${m==1?' ltm mnh':''}"><small>Terjemahan paragraf:</small> ${esc(p.i.join(' '))}</div>`:''}`:'')+`</div>`}).join('');
 if(rom&&!hasR)h+=`<small class=lbl>Romanisasi dibuat otomatis dari kamus kartu (perkiraan, miring). Pakai tujuan Reading/Listening di Kelas AI agar romanisasi dari AI ikut tersimpan.</small>`;
 if(it.nt)h+=`<details class=lbn><summary>Catatan pembentuk dari AI</summary><div class=gsub style="white-space:pre-line">${esc(it.nt)}</div></details>`;
 h+=libAnaView(it)+`</div>`;return h}
function libAnaView(it){const A=libAnalyze(it),tot=A.length,occ=A.reduce((s,x)=>s+x.n,0),cl=A.map(x=>libSt(x.k)),cw=cl.filter(x=>x=='w').length,cn=cl.filter(x=>x=='n').length,cm=tot-cw-cn;
 const rows=A.map((x,i)=>({...x,s:cl[i]})).filter(x=>libAnaF=='all'||(libAnaF=='2'?x.n>=2:x.s==libAnaF));
 const chip=(v,t,n)=>`<button class="chip${libAnaF==v?' on':''}" data-a=libana data-v=${v}>${t} <small>${n}</small></button>`;
 const AG=libAnalyzeG(it);
 return`<div class=lbana><div class=gsec style="margin-top:12px">Kosakata kartumu dalam teks ini</div><p class=gsub style="margin:2px 0 6px"><b>${tot}</b> kartu berbeda · ${occ} kemunculan${libHasTr(it)?'':''}. Ketuk satu kartu untuk mencari teks lain yang juga memuatnya.</p>`+
  `<div class=chips>${chip('all','Semua',tot)}${chip('w','Lemah / dipelajari',cw)}${chip('n','Belum dipelajari',cn)}${chip('m','Matang',cm)}${chip('2','≥ 2×',A.filter(x=>x.n>=2).length)}</div>`+
  (rows.length?rows.slice(0,libAnaLim).map(x=>{const l=libLbl(x.k);return`<div class=row><div data-a=libpick data-k="${esc(x.k)}"><b>${esc(l.w)}</b> ${l.r?`<small>${esc(l.r)}</small>`:''}<br><small>${esc(l.m)} · ${LIBSTN[x.s]}</small></div><span class=bdg>${x.n}×</span></div>`}).join('')+(rows.length>libAnaLim?`<button data-a=libanamore style="width:100%;margin-top:8px">Tampilkan lebih banyak (${rows.length-libAnaLim})</button>`:''):'<small>Tidak ada kartu pada kategori ini.</small>')+
  `<div class=gsec style="margin-top:14px">Grammar yang terdeteksi <small>(perkiraan dari pola; pola umum diurutkan paling bawah)</small></div>`+(AG.length?AG.slice(0,libAnaLim).map(x=>{const g=GK[x.k];return`<div class=row><div data-a=libpick data-k="${esc(x.k)}"><b>${esc(g[4])}</b><br><small>${esc(libNm(g[1]))} ${esc(g[2])} · ${LIBSTN[libSt(x.k)]}${x.gen?' · pola umum (bisa meleset)':x.mi?' · dikenali dari contoh':''}</small></div><span class=bdg>${x.n}×</span></div>`}).join(''):'<small>Tidak ada grammar yang terdeteksi.</small>')+`</div>`}
const LIBDESC={r:'simpan teks bacaan dari AI (Kelas AI → tab <b>Reading</b>), baca dengan terjemahan yang bisa disensor per kalimat, tandai sudah dibaca, dan cari teks yang memuat kartumu.',
 l:'simpan teks audio dari AI (Kelas AI → tab <b>Listening</b>), dengarkan dengan suara perangkat, tandai sudah didengar, dan cari teks yang memuat kartumu.',
 d:'simpan dialog dua penutur dari AI (Kelas AI → tab <b>Dialog</b>); baca per penutur atau putar dengan suara, tandai selesai.',
 s:'kumpulan kalimat tunggal dalam jumlah banyak (Kelas AI → tab <b>Kalimat</b>, atau tempel sendiri sekaligus): cari, saring per kartu, dengarkan, tandai hafal.'};
function libView(){libRepairAll();const sec=libSecV(),all=S.lib,lib=libSecItems(),cnt={},N={r:0,l:0,d:0,s:S.sl.length};all.forEach(t=>N[libKind(t)]++);lib.forEach(t=>cnt[t.L]=(cnt[t.L]|0)+1);
 const prog=sec=='s'?lib.filter(t=>t.d).length+' hafal':sec=='r'?lib.filter(t=>t.r).length+' dibaca':lib.filter(t=>t.h).length+(sec=='d'?' selesai':' didengar');
 let h=`<div class=card><div class=hd><span>📚 Pustaka</span><span>${all.length+N.s} item</span></div>`+
  `<div class=aitabs role=tablist style="grid-template-columns:1fr 1fr">${[['r','Baca + terjemahan'],['l','Pemutar suara'],['d','Dua penutur'],['s','Kalimat tunggal']].map(([v,d])=>`<button class="${sec==v?'on':''}" data-a=libsec data-v=${v} role=tab><b>${LIBKI[v]} ${LIBKN[v]} · ${N[v]}</b><small>${d}</small></button>`).join('')}</div>`+
  `<p class=gsub style="margin:2px 0 10px"><b>${LIBKN[sec]}</b>: ${LIBDESC[sec]} ${lib.length?`${lib.length} ${sec=='s'?'kalimat':'teks'} · ${prog}. `:''}Ikut dalam cadangan progres.</p><button class=pri data-a=libadd>＋ Tambah ${sec=='s'?'kalimat (banyak sekaligus)':'teks ke '+LIBKN[sec]}</button></div>`;
 if(!lib.length){const oth=Object.keys(N).filter(x=>x!=sec&&N[x]);return h+`<div class="card empty"><b>${LIBKN[sec]} masih kosong</b>Di kartu mana pun tekan 🎓 → tab <b>${LIBKN[sec]}</b>, salin prompt ke AI, lalu tempel hasilnya lewat “＋ Tambah”.${sec=='l'&&N.l==0&&0?'':''}${oth.length?`<br><small>Bagian lain berisi: ${oth.map(x=>LIBKN[x]+' '+N[x]).join(', ')}.${sec=='r'&&N.l?' Teks lama dari versi sebelumnya ada di Listening; buka Rincian → “Pindah ke…”.':''}</small>`:''}</div>`}
 h+=libFinder(sec=='s');
 const langs=LIBL.filter(l=>cnt[l]);
 h+=`<div class=chips><button class="chip${libLg?'':' on'}" data-a=liblg data-v="">Semua <small>${lib.length}</small></button>${langs.map(l=>`<button class="chip${libLg==l?' on':''}" data-a=liblg data-v=${l}>${libNm(l)} <small>${cnt[l]}</small></button>`).join('')}</div>`;
 if(sec=='s')return h+slView();
 h+=`<div class=chips>${(sec=='r'?[['','Semua status'],['nr','Belum dibaca'],['r','Sudah dibaca']]:[['','Semua status'],['nh','Belum '+(sec=='d'?'selesai':'didengar')],['h','Sudah '+(sec=='d'?'selesai':'didengar')]]).map(([v,t])=>`<button class="chip${libStt==v?' on':''}" data-a=libst data-v="${v}">${t}</button>`).join('')}</div>`+
  (libCard?'':`<div class=chips>${[['new','Terbaru'],['title','Judul'],['weak','Cocok untuk kartu lemahku']].map(([v,t])=>`<button class="chip${libSort==v?' on':''}" data-a=libsrt data-v=${v}>${t}</button>`).join('')}</div>`);
 const {a,mc,ws}=libFilter();
 if(libCard){const l=libLbl(libCard);h+=`<div class=gsub style="margin:0 0 8px">Teks ${esc(libNm(l.L))} dengan <b>${esc(l.w)}</b> ≥ ${libMinV()}× · ${a.length} teks · <button class=lnk data-a=libclr>lepas filter</button></div>`}
 if(!a.length)return h+`<div class="card empty"><b>Tidak ada teks</b>${libCard?'Belum ada teks yang memuat kartu ini sebanyak itu. Turunkan angka “Minimal muncul”.':'Tidak ada teks dengan filter ini.'}</div>`;
 return h+a.slice(0,libLim).map(t=>libRow(t,libCard?mc[t.id]:null,libCard?null:libSort=='weak'?ws[t.id]:null)).join('')+(a.length>libLim?`<button data-a=libmore style="width:100%;margin-top:8px">Tampilkan lebih banyak (${a.length-libLim})</button>`:'')}

/* ---------- Pustaka → Kalimat: bank kalimat tunggal ---------- */
let slQ='',slLim=40;
const slPs=x=>({id:x.id,L:x.L,ps:[{f:[x.f]}]});
const slCnt=(x,key)=>libCountKey(libSentDoc(slPs(x),0,0),key);
function slFiltered(){let a=S.sl.slice();if(libLg)a=a.filter(x=>x.L==libLg);if(libStt=='n')a=a.filter(x=>!x.d);else if(libStt=='d')a=a.filter(x=>x.d);
 const q=slQ.trim().toLowerCase();if(q)a=a.filter(x=>(x.f+' '+(x.r||'')+' '+(x.i||'')).toLowerCase().includes(q));
 if(libCard){const L=libOfKey(libCard);a=a.filter(x=>x.L==L&&slCnt(x,libCard)>0)}
 if(libSort=='weak'&&!libCard){const W={};a.forEach(x=>{if(!W[x.L])W[x.L]=aiSort(aiPoolV(x.L),0).slice(0,25)});
  const sc=new Map();a.forEach(x=>{let v=0;W[x.L].forEach(w=>{if(slCnt(x,w.k)>0)v+=w.tier==1?2:1});sc.set(x.id,v)});a.sort((p,q2)=>sc.get(q2.id)-sc.get(p.id)||q2.c-p.c)}
 else if(libSort=='old')a.reverse();
 return a}
function slRow(x){const m=S.o.rdt=='off'?0:S.o.rdt=='blur'?1:2,rom=x.L=='ja'||x.L=='zh';let rr=x.r||'',au=0;if(!rr&&rom){rr=libAutoRom(x.L,x.f);au=1}
 return`<div class="card lbi sli"><div class=hd><span>${esc(libNm(x.L))} · ${libDt(x.c)}</span><span>${x.d?'<span class=bdg>✓ hafal</span>':''}</span></div>`+
  `<div class=eo style="font-size:1.25rem;font-weight:600;line-height:1.5">${libCard?libHL(x.f,libCard,x.L):esc(x.f)}${spk(x.f,x.L)}</div>`+
  (rr?`<div class="r rom${au?' auto':''}">${esc(rr)}</div>`:'')+(x.i&&m?`<div class="idn${m==1?' ltm mnh':''}">${esc(x.i)}</div>`:'')+
  (x.pb?`<small class=lbl>Pembentuk: ${esc(x.pb)}</small>`:'')+
  `<div class=fct><button class="${x.d?'on':''}" data-a=slh data-k="${esc(x.id)}">${x.d?'✓ Hafal':'Tandai hafal'}</button><button data-a=sldel data-k="${esc(x.id)}" style="color:var(--bad);flex:.5">🗑</button></div></div>`}
function slList(){const a=slFiltered();if(!a.length)return`<div class="card empty"><b>Tidak ada kalimat</b>Tidak ada kalimat dengan filter ini.</div>`;
 return`<div class=gsub style="margin:0 0 8px">${a.length} kalimat${libCard?` memuat <b>${esc(libLbl(libCard).w)}</b> · <button class=lnk data-a=libclr>lepas filter</button>`:''}</div>`+a.slice(0,slLim).map(slRow).join('')+(a.length>slLim?`<button data-a=slmore style="width:100%;margin-top:8px">Tampilkan lebih banyak (${a.length-slLim})</button>`:'')}
function slView(){const langs=[...new Set(S.sl.map(x=>x.L))],L=libLg||(langs.length==1?langs[0]:'');
 return`<div class=chips>${[['','Semua status'],['n','Belum hafal'],['d','Sudah hafal']].map(([v,t])=>`<button class="chip${libStt==v?' on':''}" data-a=libst data-v="${v}">${t}</button>`).join('')}</div>`+
  `<div class=chips>${[['new','Terbaru'],['old','Terlama'],['weak','Cocok untuk kartu lemahku']].map(([v,t])=>`<button class="chip${(libSort==v||(v=='new'&&libSort=='title'))?' on':''}" data-a=libsrt data-v=${v}>${t}</button>`).join('')}</div>`+
  `<input class=lbq data-l=slq placeholder="Cari di kalimat / arti…" value="${esc(slQ)}" autocomplete=off style="margin:2px 0 8px">`+
  (L?`<button data-a=slplay data-k=${L} style="width:100%;margin-bottom:8px">▶ Putar semua kalimat ${esc(libNm(L))} yang tampil</button>`:'<small>Pilih satu bahasa untuk memutar semua kalimatnya.</small>')+
  `<div id=slist>${slList()}</div>`}
document.addEventListener('input',e=>{if(e.target.dataset&&e.target.dataset.l=='slq'){slQ=e.target.value;slLim=40;const l=document.getElementById('slist');if(l)l.innerHTML=slList()}});
function libAct(a,x,k,b){const it=k&&S.lib.find(t=>t.id==k);
 if(a=='libadd'){libAddOpen('',libSecV());return 1}
 else if(a=='libsec'){S.o.libSec=['r','l','d','s'].includes(x)?x:'r';slQ='';slLim=40;libStt='';libLg='';libLim=30;libOpenId='';libCard='';libQ='';save()}
 else if(a=='libmv'&&it){it.k=libKind(it)=='r'?'l':libKind(it)=='l'?'d':'r';S.o.libSec=it.k;libOpenId=it.id;libStt='';libLg='';save();toast('Dipindah ke '+LIBKN[it.k]+' ✓')}
 else if(a=='libplay'){if(it)lpOpen(it);return 1}
 else if(a=='libgo'){if(it)lpOpen(it,+x);return 1}
 else if(a=='libdet'){libOpenId=libOpenId==k?'':k;libAnaF='all';libAnaLim=40}
 else if(a=='slh'){const x2=S.sl.find(y=>y.id==k);if(x2)x2.d=x2.d?0:Date.now()}
 else if(a=='sldel'){if(!confirm('Hapus kalimat ini dari Pustaka?'))return 1;S.sl=S.sl.filter(y=>y.id!=k);libSD.delete(k+'|0|0');save();render();return 1}
 else if(a=='slmore')slLim+=40;
 else if(a=='slplay'){const l=x||k,list=slFiltered().filter(y=>y.L==l).slice(0,300);if(!list.length)return 1;lpOpenTemp({id:'sl:'+l,L:l,t:'Kalimat '+libNm(l),ps:[{f:list.map(y=>y.f),i:list.map(y=>y.i||''),r:list.some(y=>y.r)?list.map(y=>y.r||''):null,a:1}]});return 1}
 else if(a=='libh'&&it){it.h=it.h?0:Date.now()}
 else if(a=='libr'&&it){it.r=it.r?0:Date.now()}
 else if(a=='libdel'&&it){if(!confirm('Hapus teks “'+it.t+'” dari Pustaka?'))return 1;S.lib=S.lib.filter(t=>t.id!=k);libForget(k);libOpenId='';save();render();return 1}
 else if(a=='libren'&&it){const n=prompt('Judul baru:',it.t);if(n&&n.trim())it.t=n.trim().slice(0,120);else return 1}
 else if(a=='liblg'){libLg=x||'';libLim=30}else if(a=='libst'){libStt=x||'';libLim=30}else if(a=='libsrt'){libSort=x}
 else if(a=='libmore')libLim+=30;
 else if(a=='libpick'){libMinOv=0;libCard=k;libLg='';libQ='';libLim=30;const l=libOfKey(k);if(!libSecItems().some(t=>t.L==l))toast('Belum ada teks '+libNm(l)+' di '+LIBKN[libSecV()]+'.');DO.add('libf')}
 else if(a=='libclr'){libCard='';libQ='';libMinOv=0}
 else if(a=='libmin'){libMinOv=0;S.o.libMin=+x}
 else if(a=='libana'){libAnaF=x;libAnaLim=40}else if(a=='libanamore')libAnaLim+=60;
 else if(a=='libfind'){const l0=libOfKey(k),cur=libSecV(),oth=cur=='r'?'l':'r',has=q=>S.lib.some(t=>libKind(t)==q&&t.L==l0);if(!has(cur)&&has(oth))S.o.libSec=oth;libCard=k;libLg='';libQ='';libLim=30;libMinOv=1;libStt='';tab='lib';goTop=1;DO.add('libf')}
 return 0}

/* ---------------------------------------------------------------------------------------------
   6. PEMUTAR LISTENING
   --------------------------------------------------------------------------------------------- */
let LP=null;
const lpO=()=>{const o=S.o;if(o.lpM==null)o.lpM='s';if(o.lpPause==null)o.lpPause=1;if(o.lpRep==null)o.lpRep=1;if(o.lpAuto==null)o.lpAuto=1;if(o.lpLoop==null)o.lpLoop=0;if(!o.lpT)o.lpT='show';if(o.lpRom==null)o.lpRom=1;return o};
function lpBuild(it,mode){const sents=[],paras=[];
 it.ps.forEach((p,pi)=>{const a=p.a!==0,from=sents.length;
  p.f.forEach((f,si)=>sents.push({f,pi,si,r:p.r&&p.r.length?(a?(p.r[si]||((it.L=='ja'||it.L=='zh')?libAutoRom(it.L,f):'')):p.r.join(' ')):((it.L=='ja'||it.L=='zh')?libAutoRom(it.L,f):''),au:!(p.r&&p.r.length),sp:p.sp&&p.sp[si]||'',i:p.i&&p.i.length?(a?(p.i[si]||''):p.i.join(' ')):'',pa:!a}));
  paras.push({pi,from,to:sents.length-1})});
 const units=mode=='p'?paras.map(q=>{const ss=sents.slice(q.from,q.to+1),a=it.ps[q.pi].a!==0;return{chunks:ss.map(s=>s.f),cs:ss.map(s=>s.sp),from:q.from,to:q.to,pi:q.pi,f:ss.map(s=>s.f).join(' '),r:ss.map(s=>s.r).filter(Boolean).join(' '),i:a?ss.map(s=>s.i).filter(Boolean).join(' '):ss[0].i,is:a?ss.map(s=>s.i):null,rs:ss.map(s=>s.r)}})
  :sents.map((s,i)=>({chunks:[s.f],cs:[s.sp],from:i,to:i,pi:s.pi,f:s.f,r:s.r,i:s.i}));
 return{sents,units}}
function lpOpen(it,startS){libRepairAll();lpClose(true);const o=lpO(),b=lpBuild(it,o.lpM);
 LP={it,L:it.L,mode:o.lpM,sents:b.sents,units:b.units,idx:Math.max(0,b.units.findIndex(u=>startS>=u.from&&startS<=u.to)),rep:0,tok:0,playing:false,peek:0,timer:null,t0:0,wl:null};
 const m=document.createElement('div');m.id='lpm';m.className='edm';
 m.innerHTML=`<div class="eds lps" role=dialog aria-modal=true aria-label="Pemutar listening"><div class=edh><div><b>🎧 ${esc(it.t)}</b><small>${esc(libNm(it.L))} · <span id=lpPos></span></small></div><button class=mini data-lp=close aria-label=Tutup>✕</button></div><div class=lpt><div id=lpNow></div><div id=lpCtl></div></div><div class="edb lpb"><div id=lpSpd></div><div id=lpSet></div><div class=gsec style="margin-top:12px" id=lpLh></div><div id=lpList class=lpl></div></div><div class=edf><button data-lp=heard id=lpHd>Tandai didengar</button><button data-lp=close>Tutup</button></div></div>`;
 document.body.appendChild(m);document.body.style.overflow='hidden';
 lpNow();lpCtl();lpSetR();lpListR();
 if(!canSay()){toast('Perangkat ini belum mendukung suara. Teks tetap bisa dibaca.')}else lpSpeak()}
function lpOpenTemp(o){lpOpen({id:o.id,L:o.L,t:o.t,ps:o.ps,temp:1})}
function lpClose(quiet){if(!LP){const m=document.getElementById('lpm');if(m)m.remove();return}
 LP.tok++;clearTimeout(LP.timer);try{speechSynthesis.cancel()}catch(e){}lpWake(0);LP=null;const m=document.getElementById('lpm');if(m)m.remove();
 if(!quiet&&!document.getElementById('aim')&&!document.getElementById('lbm'))document.body.style.overflow=''}
async function lpWake(on){try{if(!LP&&on)return;if(on){if(LP&&!LP.wl&&navigator.wakeLock)LP.wl=await navigator.wakeLock.request('screen')}else if(LP&&LP.wl){LP.wl.release();LP.wl=null}}catch(e){}}
/* kalimat panjang dipecah di tanda koma agar tidak terputus di tengah (Android/Chrome sering memotong ucapan panjang) */
function lpSplitLong(t,L){const max=(L=='ja'||L=='zh')?70:170;if(t.length<=max)return[t];
 const parts=t.match(/[^、，,;；:：]+[、，,;；:：]?\s*/g)||[t],out=[];let cur='';
 for(const q of parts){if(cur&&(cur+q).length>max){out.push(cur.trim());cur=q}else cur+=q}if(cur.trim())out.push(cur.trim());return out}
function lpSpeak(){const P=LP;if(!P||!canSay())return;const tok=++P.tok;clearTimeout(P.timer);try{speechSynthesis.cancel()}catch(e){}
 const u=P.units[P.idx];if(!u)return;P.t0=Date.now();P.playing=true;lpCtl();lpNow();lpListCur();lpWake(1);
 const ch=u.chunks.flatMap((c,ci)=>lpSplitLong(lpClean(c,P.L),P.L).map(t=>({t,sp:(u.cs||[])[ci]||''}))).filter(x=>x.t),vv=ttsVoice(P.L),rate=ttsRate();
 P.spm=P.spm||{};const pitchOf=sp=>{if(!sp)return 1;if(!(sp in P.spm))P.spm[sp]=[1,1.3,.8,1.15][Object.keys(P.spm).length%4];return P.spm[sp]};
 if(!vv.v&&VZ.length){P.playing=false;lpCtl();return toast('Suara '+libNm(P.L)+' belum terpasang di perangkat ini.')}
 if(!ch.length){lpDone();return}
 const next=j=>{if(P.tok!=tok)return;if(j+1<ch.length)run(j+1);else lpDone()};
 const run=j=>{if(P.tok!=tok)return;const text=ch[j]&&ch[j].t;if(!text){next(j);return}
  const ut=new SpeechSynthesisUtterance(text);ut.lang=vv.v?vv.v.lang:vv.lc;if(vv.v)ut.voice=vv.v;ut.rate=rate;ut.pitch=pitchOf(ch[j].sp);
  let done=0,wd=0,poll=0,idle=0;const t1=Date.now();
  const fin=()=>{if(done||P.tok!=tok)return;done=1;clearTimeout(wd);clearInterval(poll);next(j)};
  const est=text.length*((P.L=='ja'||P.L=='zh')?200:120)/rate+3000;wd=setTimeout(fin,est*1.8);
  ut.onend=fin;ut.onerror=e=>{if(P.tok!=tok)return;if(e&&(e.error=='canceled'||e.error=='interrupted'))return;fin()};
  /* Android kadang tidak mengirim onend: bila antrean suara sudah kosong, anggap ucapan selesai */
  poll=setInterval(()=>{if(P.tok!=tok){clearInterval(poll);return}
   try{if(Date.now()-t1>900&&!speechSynthesis.speaking&&!speechSynthesis.pending){if(++idle>=3)fin()}else idle=0}catch(_){}},400);
  setTimeout(()=>{if(P.tok==tok){try{speechSynthesis.speak(ut)}catch(e){fin()}}},40)};
 run(0)}
function lpAfter(fn,el){const o=lpO(),tok=LP.tok;const ms=o.lpPause=='sd'?Math.min(12000,Math.max(1000,el)):Math.max(0,+o.lpPause)*1000;
 LP.timer=setTimeout(()=>{if(LP&&LP.tok==tok)fn()},ms)}
function lpDone(){const P=LP;if(!P)return;const o=lpO(),el=Date.now()-P.t0;
 if(P.rep<(+o.lpRep)-1){P.rep++;lpAfter(()=>lpSpeak(),el);return}
 P.rep=0;
 if(!o.lpAuto){P.playing=false;lpCtl();lpWake(0);return}
 if(P.idx+1<P.units.length){lpAfter(()=>{P.idx++;P.peek=0;lpSpeak()},el)}
 else if(+o.lpLoop){lpAfter(()=>{P.idx=0;P.peek=0;lpSpeak()},el)}
 else lpFinish()}
function lpFinish(){const P=LP;if(!P)return;P.playing=false;lpCtl();lpWake(0);const it=P.it;
 if(!it.temp&&!it.h){it.h=Date.now();it.n=(it.n|0)+1;save();toast('Selesai didengar ✓ Ditandai sudah didengar.');if(typeof tab!='undefined'&&tab=='lib')render()}else toast('Selesai.')}
function lpPause(){const P=LP;if(!P)return;P.tok++;clearTimeout(P.timer);try{speechSynthesis.cancel()}catch(e){}P.playing=false;lpCtl();lpWake(0)}
function lpGo(i){const P=LP;if(!P)return;P.idx=Math.max(0,Math.min(P.units.length-1,i));P.rep=0;P.peek=0;lpSpeak()}
function lpMode(m){const P=LP;if(!P||P.mode==m)return;const cur=P.units[P.idx],sent=cur?cur.from:0;lpO().lpM=m;save();
 const was=P.playing;lpPause();const b=lpBuild(P.it,m);P.mode=m;P.sents=b.sents;P.units=b.units;P.idx=Math.max(0,b.units.findIndex(u=>sent>=u.from&&sent<=u.to));P.rep=0;P.peek=0;lpNow();lpCtl();lpSetR();lpListR();if(was)lpSpeak()}
function lpNow(){const P=LP,e=document.getElementById('lpNow');if(!P||!e)return;const u=P.units[P.idx]||{f:'',r:'',i:''},o=lpO();
 const pos=document.getElementById('lpPos');if(pos)pos.textContent=(P.mode=='p'?'Paragraf ':'Kalimat ')+(P.idx+1)+' / '+P.units.length;
 /* terjemahan: tiap kalimat punya blok sendiri, jadi sensor / lihat arti hanya membuka SATU blok yang diketuk */
 const parts=u.is&&u.is.filter(Boolean).length>1?u.is.filter(Boolean):(u.i?[u.i]:[]);let tr='';
 if(parts.length){tr=parts.map((t,j)=>{const pk=P.peek&&P.peek[j];
   if(o.lpT=='show')return`<div class=idn>${esc(t)}</div>`;
   if(o.lpT=='blur')return`<div class="idn ltm mnh">${esc(t)}</div>`;
   return pk?`<div class=idn>${esc(t)}</div>`:`<button class=mini data-lp=peek data-v=${j}>👁 Lihat arti${parts.length>1?' '+(j+1):''}</button>`}).join('')}
 else tr=`<small class=lbl>Tidak ada terjemahan untuk teks ini.</small>`;
 const rom=u.rs&&u.rs.filter(Boolean).length>1?u.rs.filter(Boolean).join(' '):u.r;
 const lf=u.cs&&u.cs.some(Boolean)?u.chunks.map((t,j)=>`<div class=lpf><b class=spk>${esc(u.cs[j]||'')}</b> ${esc(t)}</div>`).join(''):`<div class=lpf>${esc(u.f)}</div>`;
 e.innerHTML=`<div class=lpn>${lf}${o.lpRom&&rom?`<div class="r rom">${esc(rom)}</div>`:''}${tr}${u.pa&&u.i?`<small class=lbl>Terjemahan seluruh paragraf</small>`:''}</div>`}
function lpCtl(){const P=LP,e=document.getElementById('lpCtl');if(!P||!e)return;const sp=ttsRate();
 e.innerHTML=`<div class=lpc><button data-lp=prev aria-label="Sebelumnya">⏮</button><button class="lpp" data-lp=${P.playing?'pause':'play'} aria-label="${P.playing?'Jeda':'Putar'}">${P.playing?'⏸':'▶'}</button><button data-lp=next aria-label="Berikutnya">⏭</button><button data-lp=rep title="Ulang ${P.mode=='p'?'paragraf':'kalimat'} ini" aria-label="Ulang">🔁</button></div>`;
 const sd=document.getElementById('lpSpd');
 if(sd&&!sd.firstChild)sd.innerHTML=`<div class=lps2><label>Kecepatan <b id=lpSpv></b></label><input type=range min=.5 max=1.2 step=.05 data-lpr=sp aria-label="Kecepatan suara"><div class=chips id=lpSpc style="margin:4px 0 0"></div></div>`;
 if(sd){const r=sd.querySelector('input[type=range]'),v=document.getElementById('lpSpv'),c=document.getElementById('lpSpc');
  if(r&&document.activeElement!==r)r.value=sp;if(v)v.textContent=sp.toFixed(2).replace(/0$/,'')+'×';
  if(c)c.innerHTML=[.5,.7,.8,.9,1,1.2].map(x=>`<button class="chip${Math.abs(sp-x)<.001?' on':''}" data-lp=spd data-v=${x}>${x}×</button>`).join('')}
 const hd=document.getElementById('lpHd');if(hd)hd.textContent=P.it.temp?'—':(P.it.h?'✓ Sudah didengar':'Tandai didengar');if(hd)hd.disabled=!!P.it.temp}
function lpSetR(){const P=LP,e=document.getElementById('lpSet');if(!P||!e)return;const o=lpO(),sg=(n,ops)=>`<div class=seg2>${ops.map(([v,t])=>`<button class="${o[n]==v?'on':''}" data-lp=opt data-o=${n} data-v="${v}">${t}</button>`).join('')}</div>`,vs=ttsVoices(P.L);
 e.innerHTML=`<details class=lpd${P.setOpen?' open':''} data-lpd=1><summary>Pengaturan pemutar</summary>`+
  `<small class=lbl>Satuan putar</small>${sg('lpM',[['s','Per kalimat'],['p','Per paragraf']])}`+
  `<small class=lbl>Jeda antar ${P.mode=='p'?'paragraf':'kalimat'}</small>${sg('lpPause',[[0,'0'],[1,'1 dtk'],[2,'2 dtk'],[3,'3 dtk'],[5,'5 dtk'],['sd','Seperti durasinya']])}`+
  `<small class=lbl>Ulangi tiap ${P.mode=='p'?'paragraf':'kalimat'}</small>${sg('lpRep',[[1,'1×'],[2,'2×'],[3,'3×']])}`+
  `<small class=lbl>Terjemahan Indonesia</small>${sg('lpT',[['show','Tampil'],['blur','Sensor'],['hide','Sembunyi']])}`+
  ((P.L=='ja'||P.L=='zh')?`<small class=lbl>Romanisasi${P.it.ps.some(p=>p.r&&p.r.length)?'':' (otomatis, perkiraan)'}</small>${sg('lpRom',[[1,'Tampil'],[0,'Sembunyi']])}`:'')+
  `<label class=fcl><span><input type=checkbox data-lpc=lpAuto${o.lpAuto?' checked':''}> Lanjut otomatis ke berikutnya</span></label><label class=fcl><span><input type=checkbox data-lpc=lpLoop${+o.lpLoop?' checked':''}> Ulangi dari awal setelah selesai</span></label>`+
  `<label class=fcl><span>Suara</span><select data-lpv=1 style="width:auto;max-width:60%"><option value="">Otomatis</option>${vs.map(v=>`<option value="${esc(v.voiceURI)}"${(S.o.lpV||{})[P.L]==v.voiceURI?' selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select></label>`+
  `<small>${vs.length?'Kualitas dan kecepatan dasar tiap suara berbeda; coba suara lain bila terasa lambat atau kaku.':'Belum ada suara '+esc(libNm(P.L))+' di perangkat ini. Pasang suara bahasa tersebut di pengaturan sistem (Text-to-speech).'}</small></details>`}
function lpListR(){const P=LP,e=document.getElementById('lpList'),h=document.getElementById('lpLh');if(!P||!e)return;if(h)h.innerHTML=(P.mode=='p'?'Daftar paragraf':'Daftar kalimat')+` <button class="mini lnk" data-lp=cur style="float:right">↧ Ke yang sedang diputar</button>`;
 e.innerHTML=P.units.map((u,i)=>`<div class="lpi${i==P.idx?' cur':''}" data-lp=go data-v=${i}><i>${i+1}</i><span>${esc(u.f)}</span></div>`).join('');lpListCur(1)}
function lpListCur(){const P=LP,e=document.getElementById('lpList');if(!P||!e)return;e.querySelectorAll('.lpi').forEach((x,i)=>x.classList.toggle('cur',i==P.idx))}
/* tidak ada scroll otomatis: pergantian kalimat tidak boleh menggeser layar. Tombol “Ke yang sedang diputar” menggulung atas permintaan. */
function lpScrollCur(){const c=document.querySelector('#lpList .lpi.cur'),sc=document.querySelector('#lpm .lpb');if(c&&sc)sc.scrollTop+=c.getBoundingClientRect().top-sc.getBoundingClientRect().top-8}
document.addEventListener('click',e=>{const m=document.getElementById('lpm');if(!m)return;
 if(e.target===m){lpClose();return}
 const b=e.target.closest('[data-lp]');if(!b||!LP)return;const a=b.dataset.lp,P=LP,o=lpO();
 if(a=='close'){lpClose();return}
 e.stopPropagation();
 if(a=='play')lpSpeak();else if(a=='pause')lpPause();else if(a=='next')lpGo(P.idx+1);else if(a=='prev')lpGo(P.idx-1);else if(a=='rep'){P.rep=0;lpSpeak()}
 else if(a=='go')lpGo(+b.dataset.v);
 else if(a=='cur')lpScrollCur();
 else if(a=='peek'){P.peek=P.peek||{};P.peek[+b.dataset.v||0]=1;lpNow()}
 else if(a=='spd'){S.o.ttsr=+b.dataset.v;save();lpCtl();if(P.playing)lpSpeak()}
 else if(a=='opt'){const n=b.dataset.o,v=b.dataset.v;if(n=='lpM')lpMode(v);else{o[n]=(n=='lpT')?v:(v=='sd'?'sd':+v);save();P.setOpen=1;lpSetR();lpNow();if(n=='lpPause'||n=='lpRep')lpCtl()}}
 else if(a=='heard'&&!P.it.temp){P.it.h=P.it.h?0:Date.now();save();lpCtl();if(typeof tab!='undefined'&&tab=='lib')render()}},true);
document.addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.lpr=='sp'&&LP){const v=+t.value,s=document.getElementById('lpSpv');if(s)s.textContent=v.toFixed(2).replace(/0$/,'')+'×'}});
document.addEventListener('change',e=>{const t=e.target;if(!LP||!t.dataset)return;
 if(t.dataset.lpr=='sp'){S.o.ttsr=Math.round(+t.value*100)/100;save();lpCtl();if(LP.playing)lpSpeak()}
 else if(t.dataset.lpc){lpO()[t.dataset.lpc]=t.checked?1:0;save()}
 else if(t.dataset.lpv){S.o.lpV=S.o.lpV||{};if(t.value)S.o.lpV[LP.L]=t.value;else delete S.o.lpV[LP.L];save();if(LP.playing)lpSpeak()}});
document.addEventListener('toggle',e=>{if(LP&&e.target.dataset&&e.target.dataset.lpd)LP.setOpen=e.target.open},true);
document.addEventListener('keydown',e=>{if(!LP||!document.getElementById('lpm'))return;const tg=(e.target&&e.target.tagName)||'';if(/INPUT|TEXTAREA|SELECT/.test(tg)&&e.key!='Escape')return;
 if(e.key=='Escape')lpClose();else if(e.key==' '){e.preventDefault();LP.playing?lpPause():lpSpeak()}else if(e.key=='ArrowRight'){e.preventDefault();lpGo(LP.idx+1)}else if(e.key=='ArrowLeft'){e.preventDefault();lpGo(LP.idx-1)}else if(e.key=='r'||e.key=='R'){LP.rep=0;lpSpeak()}});
try{speechSynthesis.addEventListener('voiceschanged',()=>{if(LP)lpSetR()})}catch(e){}
document.addEventListener('visibilitychange',()=>{if(LP&&!document.hidden&&LP.playing&&!LP.wl)lpWake(1)});


/* ---------------------------------------------------------------------------------------------
   7. KARTU BANDEL (leech): lupa >= ambang (default 4×)
   --------------------------------------------------------------------------------------------- */
const lchN=()=>Math.max(2,+S.o.lch||4);
const isLch=k=>{const c=S.srs[k];return!!c&&!c.z&&(c.l|0)>=lchN()};
function lchItems(){const out=[];for(const k in S.srs){if(!isLch(k))continue;const c=S.srs[k];
  if(GK[k]){const g=GK[k];out.push({k,c,l:c.l,t:g[4],r:'',m:'Grammar',sub:(LN[g[1]]||'')+' '+g[2],L:g[1],g:1})}
  else if(String(k).indexOf('@')>=0&&K[base(k)]){const L=lang(k),cd=K[base(k)],es=cd[3][L];if(!es||!es.length)continue;out.push({k,c,l:c.l,t:es[0][0],r:es[0][1]||'',m:cd[2],sub:(LN[L]||L)+(es[0][3]?' '+es[0][3]:''),L})}}
 return out.sort((a,b)=>b.l-a.l||(a.c.i|0)-(b.c.i|0))}
let lchLg='',lchLim=8;
function lchAct(a,x){if(a=='lchlg'){lchLg=x;lchLim=8}else if(a=='lchmore')lchLim+=20}
function leechCard(){const all=lchItems();if(!all.length)return`<div class=card><b>🪨 Kartu bandel</b><p class=gsub style="margin:2px 0 0">Belum ada kartu yang dilupa ≥ ${lchN()}×. Kartu seperti itu akan ditandai otomatis di sini, lengkap dengan prompt mnemonik khusus. (Ambang bisa diubah di Kartu → Pengaturan flashcard → Lanjutan.)</p></div>`;
 const lgs=[...new Set(all.map(x=>x.L))],rows=lchLg?all.filter(x=>x.L==lchLg):all;
 return`<div class=card><b>🪨 Kartu bandel</b> — ${all.length} kartu dilupa ≥ ${lchN()}×<p class=gsub style="margin:2px 0 8px">Ketuk 🧠 untuk menyalin prompt yang meminta AI membuat 3 jembatan ingatan + 1 kalimat jangkar khusus kartu itu.</p>`+
  (lgs.length>1?`<div class=chips><button class="chip${lchLg?'':' on'}" data-a=lchlg data-v="">Semua</button>${lgs.map(l=>`<button class="chip${lchLg==l?' on':''}" data-a=lchlg data-v=${l}>${esc(LN[l]||l)}</button>`).join('')}</div>`:'')+
  rows.slice(0,lchLim).map(x=>`<div class=row><div data-a=${x.g?'gopen':'wopen'} data-k="${esc(x.g?x.k:base(x.k))}"><b>${esc(x.t)}</b> ${x.r?`<small>${esc(x.r)}</small>`:''}<br><small>${esc(x.sub)} · ${esc(x.m)} · lupa ${x.l}× · ${x.c.t==2?'interval '+x.c.i+' hr':x.c.t==3?'belajar ulang':'belajar'}</small></div><button class="mini aibtn on" data-ai=leech data-k="${esc(x.k)}">🧠 Mnemonik</button></div>`).join('')+
  (rows.length>lchLim?`<button data-a=lchmore style="width:100%;margin-top:8px">Tampilkan lebih banyak (${rows.length-lchLim})</button>`:'')+`</div>`}

/* ---------- v7.1: romanisasi otomatis (perkiraan) untuk teks ja/zh yang tidak memuat romanisasi ---------- */
const LRK={};
(function(){const t='a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n ga gi gu ge go za ji zu ze zo da ji zu de do ba bi bu be bo pa pi pu pe po'.split(' ');
 const H='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ';
 for(let i=0;i<H.length;i++){LRK[H[i]]=t[i];LRK[String.fromCharCode(H.charCodeAt(i)+96)]=t[i]}
 LRK['ゔ']='vu';LRK['ヴ']='vu'})();
const LRKS={'ゃ':'ya','ゅ':'yu','ょ':'yo','ャ':'ya','ュ':'yu','ョ':'yo'};
function libKana2Rom(s){let o='';const ch=[...s];
 for(let i=0;i<ch.length;i++){const c=ch[i];
  if(c=='っ'||c=='ッ'){const n=LRK[ch[i+1]]||'';o+=n?(n[0]=='c'?'t':n[0]):'';continue}
  if(c=='ー'){const m=o.match(/[aiueo]$/);o+=m?m[0]:'';continue}
  const r=LRK[c];if(!r){o+=c;continue}
  if(LRKS[ch[i+1]]){const y=LRKS[ch[i+1]];let b=r.replace(/i$/,'');if(r=='shi'||r=='chi'||r=='ji')b=r.slice(0,-1)=='sh'?'sh':r.slice(0,-1);o+=(b=='sh'||b=='ch'||b=='j')?b+y.slice(1):b+y;i++;continue}
  o+=r}
 return o}
let LRD=null;
function libRomDict(){if(LRD)return LRD;LRD={ja:new Map(),zh:new Map(),st:new Set()};const add=(L,w,r)=>{w=String(w||'').replace(/[\s~〜～・]/g,'');r=String(r||'').split(/\s*[\/,;]\s*/)[0].replace(/\([^)]*\)/g,'').trim().toLowerCase();if(!w||!r||/[぀-ヿ㐀-鿿]/.test(r))return;const ol=LRD[L].get(w);if(ol==null||(r.length<ol.length&&L=='ja'))LRD[L].set(w,r)};
 const jv=(w,r)=>{add('ja',w,r);const m=w.match(/^([^ぁ-ん]+[ぁ-ん]*?)([うくぐすつぬぶむる])$/);
  if(m&&/[㐀-鿿]/.test(m[1])){const e=libKana2Rom(m[2]);if(r.toLowerCase().endsWith(e)){add('ja',m[1],r.slice(0,-e.length));LRD.st.add(m[1])}}
  const a=w.match(/^(.*[㐀-鿿])い$/);if(a&&/i$/.test(r)){add('ja',a[1],r.slice(0,-1));LRD.st.add(a[1])};
  const s=w.match(/^(.+)する$/);if(s&&/suru$/.test(r))add('ja',s[1],r.slice(0,-4))};
 for(const c of D.C){const e=c[3]||{};(e.ja||[]).forEach(x=>jv(x[0],x[1]));(e.zh||[]).forEach(x=>add('zh',x[0],x[1]))}
 for(const g of Object.values(GK)){if(g[1]!='ja'&&g[1]!='zh')continue;(g[7]||[]).forEach(ex=>{const p=String(ex).split('\n');if(p.length>=3&&p[1]){const f=p[0].replace(/[\s。、！？.,!?]/g,'');if(f.length>1&&!LRD[g[1]].has('\u0001'+f))LRD[g[1]].set('\u0001'+f,p[1].trim())}})}
 return LRD}
const LRP={'。':'.','、':',','！':'!','？':'?','，':',','；':';','：':':','「':'"','」':'"','『':'"','』':'"','（':'(','）':')','～':'~','・':' ','·':' '};
function libAutoRom(L,text){if(L!='ja'&&L!='zh')return'';const d=libRomDict()[L],src=String(text||'');
 const ex=d.get('\u0001'+src.replace(/[\s。、！？.,!?]/g,''));if(ex&&String(src).replace(/\s/g,'').length>1)return ex;
 const ch=[...src.replace(/\s+/g,L=='zh'?'':' ')],out=[];let kb='',i=0,glue=0;
 const FW=['でしょう','ました','ません','でした','です','ます','から','まで','ので','のに','より','たい','ない','ね','よ'],PA={'は':'wa','へ':'e','を':'o'};
 const seg=k=>{if(k.length==1)return PA[k]||libKana2Rom(k);const o=[];let u='',i=0;const fu=()=>{if(u){o.push(libKana2Rom(u));u=''}};
  while(i<k.length){const w=FW.find(x=>k.startsWith(x,i)&&(x.length>1||i>0&&/[ねよ]/.test(x)&&i==k.length-1));if(w){fu();o.push(libKana2Rom(w));i+=w.length}else if(k[i]=='を'){fu();o.push('o');i++}else if(/[はがをにでともの]/.test(k[i])&&i==k.length-1&&i>0&&!/[ゃゅょっ]/.test(k[i-1])){fu();o.push(PA[k[i]]||libKana2Rom(k[i]));i++}else{u+=k[i];i++}}
  fu();return o.join(' ')};
 const flush=()=>{if(!kb)return;let t=seg(kb);if(glue){if(out.length){out[out.length-1]+=t.replace(/ /g,'');t=''}glue=0}if(t)out.push(t);kb=''};
 while(i<ch.length){let hit=0;
  for(let n=Math.min(8,ch.length-i);n>=1;n--){const w=ch.slice(i,i+n).join('');if(!d.has(w))continue;
   const kanaOnly=!/[㐀-鿿]/.test(w);if(L=='ja'&&kanaOnly&&n<2)continue;
   flush();out.push(d.get(w));i+=n;hit=1;if(L=='ja'&&libRomDict().st.has(w)&&/[ぁ-ゟ]/.test(ch[i]||'')){glue=1}break}
  if(hit)continue;const c=ch[i];
  if(L=='ja'&&/[぀-ヿー]/.test(c)){if(kb&&(/[ァ-ヶー]/.test(c)!=/[ァ-ヶー]/.test(kb[kb.length-1])&&c!='ー'))flush();kb+=c;i++;continue}
  flush();out.push(LRP[c]!=null?LRP[c]:c);i++}
 flush();
 let r=out.join(' ').replace(/\s+([.,!?;:)])/g,'$1').replace(/([("])\s+/g,'$1').replace(/\s+/g,' ').trim();
 if(L=='ja')r=r.replace(/ (wa|e|o)(?= )/g,' $1');
 return r.charAt(0).toUpperCase()+r.slice(1)}
