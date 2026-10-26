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
function libClean(s){return String(s||'').replace(/\r\n?/g,'\n').replace(/[\u00a0\u200b\u2028\u2029]/g,' ')
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
function libParse(raw,opt){opt=opt||{};let t=libClean(raw).trim();if(!t)return{err:'Teks kosong.'};
 let L=opt.L||'',title=(opt.title||'').trim(),note='',ps=[],fmt='',fm=opt.fmt||'auto';
 const cut=s=>{const m=s.search(/^\s*(?:daftar\s+)?(?:kartu\s+)?pembentuk(?:\s+yang\s+(?:dipakai|digunakan))?\s*:?\s*$/im);if(m>=0){note=s.slice(m).trim();return s.slice(0,m)}return s},
  dropLbl=s=>s.split('\n').filter(l=>!/^\s*(?:pembentuk|topik utama|tambahan)\s*:/i.test(l)).join('\n');
 /* a) format Audio / listening: tiga blok === ... === */
 if(fm=='auto'&&/^\s*={2,}\s*TEKS/im.test(t)||fm=='aud'){
  const parts=t.split(/^\s*={2,}\s*([^=\n]+?)\s*={2,}\s*$/m);let fb='',ib='';
  for(let k=1;k<parts.length;k+=2){const nm=parts[k].trim().toUpperCase(),body=parts[k+1]||'';
   if(/^TEKS/.test(nm)){fb=body;if(!L){const w=nm.split(/\s+/)[1];if(LIBHN[w])L=LIBHN[w]}}else if(/^TERJEMAHAN/.test(nm))ib=body;else note=(note?note+'\n':'')+body.trim()}
  if(!fb.trim())return{err:'Blok “=== TEKS … ===” tidak ditemukan atau kosong.'};
  if(!L)L=libDetectL(fb);
  const pf=libParas(fb),pi=libParas(ib);pf.forEach((p,k)=>ps.push(libMkPara(p,pi[k]||'','',L)));fmt='aud'}
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
  const rom=L=='ja'||L=='zh';
  if(B.length>=2&&B[0].length==1&&B[0][0].length<=90&&!/[.!?。！？]["”)」』]?$/.test(B[0][0])){if(!title)title=B[0][0];B=B.slice(1)}
  const J=b=>b.join(' '),tgt=s=>{const x=libScore(s);return x[L]>x.id},idn=s=>{const x=libScore(s);return x.id>x[L]};
  const allLines=B.every(b=>b.length==(rom?3:2));
  const lineOK=b=>rom?(libCJK(b[0])&&!libCJK(b[1])&&!libCJK(b[2])):(tgt(b[0])&&idn(b[1]));
  if(allLines&&B.length&&B.every(lineOK)){const p0=[];B.forEach(b=>p0.push(b));
   for(let k=0;k<p0.length;k+=5){const ch=p0.slice(k,k+5);ps.push({f:ch.map(b=>b[0]),r:rom?ch.map(b=>b[1]):null,i:ch.map(b=>b[rom?2:1]),a:1})}fmt='sen'}
  else if(rom&&B.length>=3&&B.every((b,k)=>k%3==0?libCJK(J(b)):!libCJK(J(b)))){for(let k=0;k+2<B.length+0;k+=3)ps.push(libMkPara(J(B[k]),J(B[k+2]),J(B[k+1]),L));fmt='blk'}
  else if(rom&&B.length>=2&&B.every((b,k)=>k%2==0?libCJK(J(b)):!libCJK(J(b)))){for(let k=0;k<B.length;k+=2)ps.push(libMkPara(J(B[k]),B[k+1]?J(B[k+1]):'','',L));fmt='blk'}
  else if(!rom&&B.length>=2&&B.every((b,k)=>k%2==0?tgt(J(b)):idn(J(b)))){for(let k=0;k<B.length;k+=2)ps.push(libMkPara(J(B[k]),B[k+1]?J(B[k+1]):'','',L));fmt='blk'}
  else{B.forEach(b=>ps.push(libMkPara(J(b),'','',L)));fmt='txt'}}
 ps=ps.filter(p=>p.f.length);
 if(!L)return{err:'Bahasa tidak terdeteksi. Pilih bahasa teks secara manual.'};
 if(!ps.length)return{err:'Tidak ada kalimat yang bisa dibaca dari teks ini.'};
 if(!title){const s=ps[0].f[0].replace(/\s+/g,' ');title=s.length>34?s.slice(0,32)+'…':s}
 return{L,title,ps,note:note.slice(0,800),fmt}}
const libNS=it=>it.ps.reduce((a,p)=>a+p.f.length,0);
const libHasTr=it=>it.ps.some(p=>p.i&&p.i.length);

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
  else if(LIBROW[last]&&stem.length>=1){let row=LIBROW[last];if(base=='行く'||base=='いく')row+='っ';
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
function libGramF(gid){const g=GK[gid];if(!g)return null;const L=g[1],title=String(g[4]||''),pat=String(g[6]||''),ex=(g[7]||[]).map(e=>String(e).split('\n')[0]);
 if(L=='zh'||L=='ja'){const alts=[];
  for(const src of[pat,title]){if(alts.length)break;
   for(const a of src.split(/\s*[\/／、;]\s*|\n/)){const runs=libCjkRuns(a);if(!runs.length)continue;if(runs.join('').length>12)continue;alts.push(runs)}}
  if(!alts.length)return null;const single=new Set(),ord=[];
  for(const r of alts){if(r.length==1)single.add(r[0]);else ord.push(new RegExp(r.map(libEsc).join('.{0,15}?'),'g'))}
  const f={k:'sub'};if(single.size)f.re=new RegExp([...single].sort((a,b)=>b.length-a.length).map(libEsc).join('|'),'g');if(ord.length)f.ord=ord;return{alts:[f]}}
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
 return alts.length?{alts}:null}

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
 for(const k of libGKeys(it.L)){const n=libCountKey(d,k);if(n>0)out.push({k,n})}out.sort((a,b)=>b.n-a.n);libAnaG.set(it.id,out);return out}
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
const lpClean=(t,L)=>{let s=String(t).replace(/[~〜*_#`]/g,'').replace(/\s+/g,' ').trim();if(L=='ja'||L=='zh')s=s.replace(/\s+/g,'');return s};

/* ---------------------------------------------------------------------------------------------
   4. TAMBAH TEKS (modal)
   --------------------------------------------------------------------------------------------- */
function libAddOpen(pre){libAddClose();const m=document.createElement('div');m.id='lbm';m.className='edm';
 m.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="Tambah teks"><div class=edh><div><b>＋ Tambah teks ke Pustaka</b><small>Tempel hasil dari ChatGPT / Claude / Gemini</small></div><button class=mini data-lb=close aria-label=Tutup>✕</button></div><div class=edb>`+
 `<label class=edl>Teks<small>Paling pas: format “Audio / listening” dari Kelas AI (Sedang). Format paragraf, per kalimat, atau teks polos juga dikenali.</small><textarea id=lbX rows=11 spellcheck=false placeholder="=== TEKS JEPANG ===&#10;…&#10;&#10;=== TERJEMAHAN INDONESIA ===&#10;…">${esc(pre||'')}</textarea></label>`+
 `<button data-lb=paste style="margin:8px 0">📋 Tempel dari clipboard</button><div class=gsub id=lbP style="margin:4px 0 10px"></div>`+
 `<label class=edl>Judul (boleh kosong)<input id=lbT autocomplete=off placeholder="Otomatis dari kalimat pertama"></label>`+
 `<div class=aiopts><label class=edl style="flex:1">Bahasa<select id=lbL><option value="">Otomatis (deteksi)</option>${LIBL.map(l=>`<option value=${l}>${libNm(l)}</option>`).join('')}</select></label>`+
 `<label class=edl style="flex:1">Format<select id=lbF><option value=auto>Otomatis</option><option value=aud>Audio (3 blok ===)</option><option value=sen>Per kalimat (Paragraf N)</option><option value=txt>Teks polos (tanpa terjemahan)</option></select></label></div>`+
 `</div><div class=edf><button data-lb=close>Batal</button><button data-lb=save>Simpan</button><button class=pri data-lb=saveplay>Simpan &amp; putar</button></div></div>`;
 document.body.appendChild(m);document.body.style.overflow='hidden';libAddPrev()}
function libAddClose(){const m=document.getElementById('lbm');if(m)m.remove();if(!document.getElementById('lpm')&&!document.getElementById('aim')&&!document.getElementById('edm'))document.body.style.overflow=''}
function libAddRead(){const g=id=>{const e=document.getElementById(id);return e?e.value:''};return{x:g('lbX'),t:g('lbT'),L:g('lbL'),f:g('lbF')}}
function libAddParse(){const v=libAddRead();return libParse(v.x,{L:v.L,title:v.t,fmt:v.f=='txt'?'txt':v.f})}
function libAddPrev(){const p=document.getElementById('lbP');if(!p)return;const v=libAddRead();if(!v.x.trim()){p.textContent='Belum ada teks.';return}
 const r=libAddParse();if(r.err){p.innerHTML=`<span style="color:var(--bad)">${esc(r.err)}</span>`;return}
 const ns=r.ps.reduce((a,q)=>a+q.f.length,0),tr=r.ps.some(q=>q.i.length),rm=r.ps.some(q=>q.r&&q.r.length),al=r.ps.every(q=>q.a);
 p.innerHTML=`Terdeteksi: <b>${libNm(r.L)}</b> · ${r.ps.length} paragraf · ${ns} kalimat · terjemahan ${tr?'✓':'—'}${rm?' · romanisasi ✓':''}${tr&&!al?' <small>(sebagian terjemahan per paragraf)</small>':''}`}
function libAddSave(play){const r=libAddParse();if(r.err)return toast(r.err);
 const it={id:libId(),t:r.title,L:r.L,c:Date.now(),ps:r.ps,h:0,r:0,n:0};if(r.note)it.nt=r.note;
 S.lib.unshift(it);if(S.lib.length>400)S.lib.length=400;save();libAddClose();toast('Teks disimpan di Pustaka ✓');
 if(typeof tab!='undefined'&&tab!='lib'){tab='lib'}render();if(play)lpOpen(it)}
document.addEventListener('click',e=>{const m=document.getElementById('lbm');if(!m)return;if(e.target===m){libAddClose();return}
 const b=e.target.closest('[data-lb]');if(!b)return;const a=b.dataset.lb;
 if(a=='close')libAddClose();else if(a=='save')libAddSave(0);else if(a=='saveplay')libAddSave(1);
 else if(a=='paste'){try{navigator.clipboard.readText().then(t=>{const x=document.getElementById('lbX');if(x){x.value=t;libAddPrev()}}).catch(()=>toast('Izin clipboard ditolak. Tempel manual di kotak teks.'))}catch(_){toast('Tempel manual di kotak teks.')}}});
document.addEventListener('input',e=>{if(e.target.id=='lbX'||e.target.id=='lbT')libAddPrev()});
document.addEventListener('change',e=>{if(e.target.id=='lbL'||e.target.id=='lbF')libAddPrev()});
document.addEventListener('keydown',e=>{if(!document.getElementById('lbm'))return;if(e.key=='Escape')libAddClose();else if((e.ctrlKey||e.metaKey)&&e.key=='Enter'){e.preventDefault();libAddSave(0)}});

/* ---------------------------------------------------------------------------------------------
   5. PUSTAKA (tab)
   --------------------------------------------------------------------------------------------- */
let libLg='',libStt='',libSort='new',libLim=30,libOpenId='',libQ='',libCard='',libAnaF='all',libAnaLim=40;
let libMinOv=0;
const libMinV=()=>libMinOv||Math.max(1,+S.o.libMin||4);
let libIdx=null;
function libIndex(){if(libIdx)return libIdx;libIdx=[];for(const c of D.C)for(const L of LIBL){const es=c[3][L];if(!es||!es.length)continue;libIdx.push({k:ik(c[0],L),L,t:(c[2]+' '+es.map(e=>e[0]+' '+(e[1]||'')).join(' ')).toLowerCase()})}
 for(const g of D.G)if(LIBL.includes(g[1]))libIdx.push({k:g[0],L:g[1],g:1,t:(g[4]+' '+g[6]).toLowerCase()});return libIdx}
function libFindRes(){const q=libQ.trim().toLowerCase(),langs=new Set(S.lib.map(t=>t.L));
 if(!langs.size)return'<small>Tambahkan teks dulu, lalu cari di sini.</small>';if(!q)return'<small>Ketik untuk mencari kartu dari bahasa yang ada di Pustaka.</small>';
 const r=libIndex().filter(x=>langs.has(x.L)&&(!libLg||x.L==libLg)&&x.t.includes(q));
 r.sort((a,b)=>(b.t.startsWith(q)-a.t.startsWith(q))||a.t.length-b.t.length);
 if(!r.length)return'<small>Tidak ada kartu yang cocok.</small>';
 return`<div class=lbcs>`+r.slice(0,10).map(x=>{const l=libLbl(x.k);return`<button class=lbc data-a=libpick data-k="${esc(x.k)}"><b>${esc(l.w)}</b>${l.r?` <small>${esc(l.r)}</small>`:''}<span>${esc(l.m)}</span><i>${x.g?'Grammar · ':''}${esc(libNm(x.L))}</i></button>`}).join('')+`</div>`+(r.length>10?`<small>${r.length-10} lainnya… persempit pencarian.</small>`:'')}
function libFindRender(){const e=document.getElementById('libfr');if(e)e.innerHTML=libFindRes()}
document.addEventListener('input',e=>{if(e.target.dataset&&e.target.dataset.l=='fq'){libQ=e.target.value;libFindRender()}});
function libFinder(){const l=libCard?libLbl(libCard):null,mn=libMinV();
 return dtag('libf')+`<summary><span>🔎 Cari teks berdasarkan kartu</span>${libCard?'<em class=cnt>aktif</em>':''}</summary><div class=card style="margin-top:8px">`+
 `<p class=gsub style="margin:0 0 8px">Ketik kata atau arti kartu (mis. <i>watashi</i>, <i>私</i>, <i>saya</i>) atau nama grammar (mis. <i>てください</i>, <i>是</i>, <i>Für</i>), lalu pilih. Bentuk kata yang berubah — konjugasi, jamak, partisip, kata kerja terpisah, kata sifat — ikut dihitung. Untuk grammar, teks dicocokkan lewat bagian literal pola (perkiraan; pola yang murni abstrak tidak bisa dicari).</p>`+
 `<input class=lbq data-l=fq placeholder="Cari kartu…" value="${esc(libQ)}" autocomplete=off><div id=libfr style="margin-top:6px">${libFindRes()}</div>`+
 (libCard?`<div class=lbsel><div><small>${l.g?'Grammar':'Kartu'} dipilih · ${esc(libNm(l.L))}</small><br><b>${esc(l.w)}</b> ${l.r?`<small>${esc(l.r)}</small>`:''} <small>${esc(l.m)}</small></div><button class=mini data-a=libclr>✕ Lepas</button></div>`:'')+
 `<small class=lbl>Minimal muncul</small><div class=chips>${[1,2,3,4,5,6,8,10].map(n=>`<button class="chip${mn==n?' on':''}" data-a=libmin data-v=${n}>${n}×</button>`).join('')}</div></div></details>`}
function libFilter(){let a=S.lib.slice();const mc={},ws={};
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
function libRow(it,mc,ws){const ns=libNS(it),op=libOpenId==it.id;
 return`<div class="card lbi"><div class=hd><span>${esc(libNm(it.L))} · ${it.ps.length} paragraf · ${ns} kalimat · ${libDt(it.c)}</span><span>${it.h?'<span class=bdg>🎧 didengar</span>':''}${it.r?'<span class=bdg>📖 dibaca</span>':''}</span></div>`+
  `<div class=mean style="font-size:1.12rem;margin:2px 0 6px">${esc(it.t)}</div>`+
  (mc!=null?`<div class=lbm1><b>${esc(libLbl(libCard).w)}</b> muncul <b>${mc}×</b> di teks ini</div>`:'')+
  (ws?`<div class=lbm1>Memuat <b>${ws.n}</b> dari ${ws.of} kartu lemahmu</div>`:'')+
  (mc!=null?libSnips(it):'')+`<div class=fct><button class=pri data-a=libplay data-k="${esc(it.id)}" style="flex:1.4">▶ Putar</button><button data-a=libdet data-k="${esc(it.id)}">${op?'Tutup':'Rincian'}</button><button class="${it.h?'on':''}" data-a=libh data-k="${esc(it.id)}">${it.h?'✓ Didengar':'Tandai didengar'}</button><button class="${it.r?'on':''}" data-a=libr data-k="${esc(it.id)}">${it.r?'✓ Dibaca':'Tandai dibaca'}</button></div>`+(op?libDetail(it):'')+`</div>`}
function libDetail(it){const m=S.o.rdt=='off'?0:S.o.rdt=='blur'?1:2,rm=it.ps.some(p=>p.r&&p.r.length);
 let h=`<div class=lbd><div class=rdh><button data-a=libren data-k="${esc(it.id)}">✎ Ganti judul</button><button data-a=libdel data-k="${esc(it.id)}" style="color:var(--bad)">🗑 Hapus</button></div>`;
 h+=it.ps.map((p,pi)=>{const a=p.a!==0;return`<div class=lbp><small class=lbl>Paragraf ${pi+1}</small>`+p.f.map((f,si)=>`<div class=rds><div class=eo>${esc(f)}${spk(f,it.L)}</div>${p.r&&p.r.length&&a?`<div class="r rom">${esc(p.r[si]||'')}</div>`:''}${a&&p.i[si]&&m?`<div class="idn${m==1?' ltm mnh':''}">${esc(p.i[si])}</div>`:''}</div>`).join('')+
   (!a&&m?`${p.r&&p.r.length?`<div class="r rom">${esc(p.r.join(' '))}</div>`:''}${p.i.length?`<div class="idn${m==1?' ltm mnh':''}"><small>Terjemahan paragraf:</small> ${esc(p.i.join(' '))}</div>`:''}`:'')+`</div>`}).join('');
 if(it.nt)h+=`<details class=lbn><summary>Catatan pembentuk dari AI</summary><div class=gsub style="white-space:pre-line">${esc(it.nt)}</div></details>`;
 h+=libAnaView(it)+`</div>`;return h}
function libAnaView(it){const A=libAnalyze(it),tot=A.length,occ=A.reduce((s,x)=>s+x.n,0),cl=A.map(x=>libSt(x.k)),cw=cl.filter(x=>x=='w').length,cn=cl.filter(x=>x=='n').length,cm=tot-cw-cn;
 const rows=A.map((x,i)=>({...x,s:cl[i]})).filter(x=>libAnaF=='all'||(libAnaF=='2'?x.n>=2:x.s==libAnaF));
 const chip=(v,t,n)=>`<button class="chip${libAnaF==v?' on':''}" data-a=libana data-v=${v}>${t} <small>${n}</small></button>`;
 const AG=libAnalyzeG(it);
 return`<div class=lbana><div class=gsec style="margin-top:12px">Kosakata kartumu dalam teks ini</div><p class=gsub style="margin:2px 0 6px"><b>${tot}</b> kartu berbeda · ${occ} kemunculan${libHasTr(it)?'':''}. Ketuk satu kartu untuk mencari teks lain yang juga memuatnya.</p>`+
  `<div class=chips>${chip('all','Semua',tot)}${chip('w','Lemah / dipelajari',cw)}${chip('n','Belum dipelajari',cn)}${chip('m','Matang',cm)}${chip('2','≥ 2×',A.filter(x=>x.n>=2).length)}</div>`+
  (rows.length?rows.slice(0,libAnaLim).map(x=>{const l=libLbl(x.k);return`<div class=row><div data-a=libpick data-k="${esc(x.k)}"><b>${esc(l.w)}</b> ${l.r?`<small>${esc(l.r)}</small>`:''}<br><small>${esc(l.m)} · ${LIBSTN[x.s]}</small></div><span class=bdg>${x.n}×</span></div>`}).join('')+(rows.length>libAnaLim?`<button data-a=libanamore style="width:100%;margin-top:8px">Tampilkan lebih banyak (${rows.length-libAnaLim})</button>`:''):'<small>Tidak ada kartu pada kategori ini.</small>')+
  `<div class=gsec style="margin-top:14px">Grammar yang terdeteksi <small>(perkiraan dari pola literal)</small></div>`+(AG.length?AG.slice(0,libAnaLim).map(x=>{const g=GK[x.k];return`<div class=row><div data-a=libpick data-k="${esc(x.k)}"><b>${esc(g[4])}</b><br><small>${esc(libNm(g[1]))} ${esc(g[2])} · ${LIBSTN[libSt(x.k)]}</small></div><span class=bdg>${x.n}×</span></div>`}).join(''):'<small>Tidak ada grammar yang terdeteksi.</small>')+`</div>`}
function libView(){const lib=S.lib,cnt={};lib.forEach(t=>cnt[t.L]=(cnt[t.L]|0)+1);
 let h=`<div class=card><div class=hd><span>🎧 Pustaka teks</span><span>${lib.length} teks · ${lib.filter(t=>t.h).length} didengar · ${lib.filter(t=>t.r).length} dibaca</span></div><p class=gsub style="margin:2px 0 10px">Simpan teks dari AI (terutama format <b>Audio / listening</b> dari Kelas AI → Sedang), dengarkan dengan suara perangkat, tandai sudah didengar atau dibaca, dan cari teks yang memuat kartumu. Ikut dalam cadangan progres.</p><button class=pri data-a=libadd>＋ Tambah teks</button></div>`;
 if(!lib.length)return h+`<div class="card empty"><b>Pustaka masih kosong</b>Di kartu mana pun tekan 🎓 → tab <b>Sedang</b> → format <b>Audio / listening</b>, salin prompt ke AI, lalu tempel hasilnya lewat “＋ Tambah teks”.</div>`;
 h+=libFinder();
 const langs=LIBL.filter(l=>cnt[l]);
 h+=`<div class=chips><button class="chip${libLg?'':' on'}" data-a=liblg data-v="">Semua <small>${lib.length}</small></button>${langs.map(l=>`<button class="chip${libLg==l?' on':''}" data-a=liblg data-v=${l}>${libNm(l)} <small>${cnt[l]}</small></button>`).join('')}</div>`+
  `<div class=chips>${[['','Semua status'],['nh','Belum didengar'],['nr','Belum dibaca'],['h','Sudah didengar'],['r','Sudah dibaca']].map(([v,t])=>`<button class="chip${libStt==v?' on':''}" data-a=libst data-v="${v}">${t}</button>`).join('')}</div>`+
  (libCard?'':`<div class=chips>${[['new','Terbaru'],['title','Judul'],['weak','Cocok untuk kartu lemahku']].map(([v,t])=>`<button class="chip${libSort==v?' on':''}" data-a=libsrt data-v=${v}>${t}</button>`).join('')}</div>`);
 const {a,mc,ws}=libFilter();
 if(libCard){const l=libLbl(libCard);h+=`<div class=gsub style="margin:0 0 8px">Teks ${esc(libNm(l.L))} dengan <b>${esc(l.w)}</b> ≥ ${libMinV()}× · ${a.length} teks · <button class=lnk data-a=libclr>lepas filter</button></div>`}
 if(!a.length)return h+`<div class="card empty"><b>Tidak ada teks</b>${libCard?'Belum ada teks yang memuat kartu ini sebanyak itu. Turunkan angka “Minimal muncul”.':'Tidak ada teks dengan filter ini.'}</div>`;
 return h+a.slice(0,libLim).map(t=>libRow(t,libCard?mc[t.id]:null,libCard?null:libSort=='weak'?ws[t.id]:null)).join('')+(a.length>libLim?`<button data-a=libmore style="width:100%;margin-top:8px">Tampilkan lebih banyak (${a.length-libLim})</button>`:'')}
function libAct(a,x,k,b){const it=k&&S.lib.find(t=>t.id==k);
 if(a=='libadd'){libAddOpen();return 1}
 else if(a=='libplay'){if(it)lpOpen(it);return 1}
 else if(a=='libgo'){if(it)lpOpen(it,+x);return 1}
 else if(a=='libdet'){libOpenId=libOpenId==k?'':k;libAnaF='all';libAnaLim=40}
 else if(a=='libh'&&it){it.h=it.h?0:Date.now()}
 else if(a=='libr'&&it){it.r=it.r?0:Date.now()}
 else if(a=='libdel'&&it){if(!confirm('Hapus teks “'+it.t+'” dari Pustaka?'))return 1;S.lib=S.lib.filter(t=>t.id!=k);libForget(k);libOpenId='';save();render();return 1}
 else if(a=='libren'&&it){const n=prompt('Judul baru:',it.t);if(n&&n.trim())it.t=n.trim().slice(0,120);else return 1}
 else if(a=='liblg'){libLg=x||'';libLim=30}else if(a=='libst'){libStt=x||'';libLim=30}else if(a=='libsrt'){libSort=x}
 else if(a=='libmore')libLim+=30;
 else if(a=='libpick'){libMinOv=0;libCard=k;libLg='';libQ='';libLim=30;const l=libOfKey(k);if(!S.lib.some(t=>t.L==l))toast('Belum ada teks '+libNm(l)+' di Pustaka.');DO.add('libf')}
 else if(a=='libclr'){libCard='';libQ='';libMinOv=0}
 else if(a=='libmin'){libMinOv=0;S.o.libMin=+x}
 else if(a=='libana'){libAnaF=x;libAnaLim=40}else if(a=='libanamore')libAnaLim+=60;
 else if(a=='libfind'){libCard=k;libLg='';libQ='';libLim=30;libMinOv=1;libStt='';tab='lib';goTop=1;DO.add('libf')}
 return 0}

/* ---------------------------------------------------------------------------------------------
   6. PEMUTAR LISTENING
   --------------------------------------------------------------------------------------------- */
let LP=null;
const lpO=()=>{const o=S.o;if(o.lpM==null)o.lpM='s';if(o.lpPause==null)o.lpPause=1;if(o.lpRep==null)o.lpRep=1;if(o.lpAuto==null)o.lpAuto=1;if(o.lpLoop==null)o.lpLoop=0;if(!o.lpT)o.lpT='show';if(o.lpRom==null)o.lpRom=1;return o};
function lpBuild(it,mode){const sents=[],paras=[];
 it.ps.forEach((p,pi)=>{const a=p.a!==0,from=sents.length;
  p.f.forEach((f,si)=>sents.push({f,pi,si,r:p.r&&p.r.length?(a?(p.r[si]||''):p.r.join(' ')):'',i:p.i&&p.i.length?(a?(p.i[si]||''):p.i.join(' ')):'',pa:!a}));
  paras.push({pi,from,to:sents.length-1})});
 const units=mode=='p'?paras.map(q=>{const ss=sents.slice(q.from,q.to+1),a=it.ps[q.pi].a!==0;return{chunks:ss.map(s=>s.f),from:q.from,to:q.to,pi:q.pi,f:ss.map(s=>s.f).join(' '),r:ss.map(s=>s.r).filter(Boolean).join(' '),i:a?ss.map(s=>s.i).filter(Boolean).join(' '):ss[0].i}})
  :sents.map((s,i)=>({chunks:[s.f],from:i,to:i,pi:s.pi,f:s.f,r:s.r,i:s.i}));
 return{sents,units}}
function lpOpen(it,startS){lpClose(true);const o=lpO(),b=lpBuild(it,o.lpM);
 LP={it,L:it.L,mode:o.lpM,sents:b.sents,units:b.units,idx:Math.max(0,b.units.findIndex(u=>startS>=u.from&&startS<=u.to)),rep:0,tok:0,playing:false,peek:0,timer:null,t0:0,wl:null};
 const m=document.createElement('div');m.id='lpm';m.className='edm';
 m.innerHTML=`<div class="eds lps" role=dialog aria-modal=true aria-label="Pemutar listening"><div class=edh><div><b>🎧 ${esc(it.t)}</b><small>${esc(libNm(it.L))} · <span id=lpPos></span></small></div><button class=mini data-lp=close aria-label=Tutup>✕</button></div><div class="edb lpb"><div id=lpNow></div><div id=lpCtl></div><div id=lpSet></div><div class=gsec style="margin-top:12px" id=lpLh></div><div id=lpList class=lpl></div></div><div class=edf><button data-lp=heard id=lpHd>Tandai didengar</button><button data-lp=close>Tutup</button></div></div>`;
 document.body.appendChild(m);document.body.style.overflow='hidden';
 lpNow();lpCtl();lpSetR();lpListR();
 if(!canSay()){toast('Perangkat ini belum mendukung suara. Teks tetap bisa dibaca.')}else lpSpeak()}
function lpOpenTemp(o){lpOpen({id:o.id,L:o.L,t:o.t,ps:o.ps,temp:1})}
function lpClose(quiet){if(!LP){const m=document.getElementById('lpm');if(m)m.remove();return}
 LP.tok++;clearTimeout(LP.timer);try{speechSynthesis.cancel()}catch(e){}lpWake(0);LP=null;const m=document.getElementById('lpm');if(m)m.remove();
 if(!quiet&&!document.getElementById('aim')&&!document.getElementById('lbm'))document.body.style.overflow=''}
async function lpWake(on){try{if(!LP&&on)return;if(on){if(LP&&!LP.wl&&navigator.wakeLock)LP.wl=await navigator.wakeLock.request('screen')}else if(LP&&LP.wl){LP.wl.release();LP.wl=null}}catch(e){}}
function lpSpeak(){const P=LP;if(!P||!canSay())return;const tok=++P.tok;clearTimeout(P.timer);try{speechSynthesis.cancel()}catch(e){}
 const u=P.units[P.idx];if(!u)return;P.t0=Date.now();P.playing=true;lpCtl();lpNow();lpListCur();lpWake(1);
 const ch=u.chunks,vv=ttsVoice(P.L),rate=ttsRate();
 if(!vv.v&&VZ.length){P.playing=false;lpCtl();return toast('Suara '+libNm(P.L)+' belum terpasang di perangkat ini.')}
 const next=j=>{if(P.tok!=tok)return;if(j+1<ch.length)run(j+1);else lpDone()};
 const run=j=>{if(P.tok!=tok)return;const text=lpClean(ch[j],P.L);if(!text){next(j);return}
  const ut=new SpeechSynthesisUtterance(text);ut.lang=vv.v?vv.v.lang:vv.lc;if(vv.v)ut.voice=vv.v;ut.rate=rate;
  let done=0,wd=0;const fin=()=>{if(done||P.tok!=tok)return;done=1;clearTimeout(wd);next(j)};
  const est=text.length*((P.L=='ja'||P.L=='zh')?200:120)/rate+3000;wd=setTimeout(fin,est*2.5);
  ut.onend=fin;ut.onerror=e=>{if(P.tok!=tok)return;if(e&&(e.error=='canceled'||e.error=='interrupted'))return;fin()};
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
 let tr='';if(u.i){if(o.lpT=='show')tr=`<div class=idn>${esc(u.i)}</div>`;else if(o.lpT=='blur')tr=`<div class="idn ltm mnh">${esc(u.i)}</div>`;else tr=P.peek?`<div class=idn>${esc(u.i)}</div>`:`<button class=mini data-lp=peek>👁 Lihat arti</button>`}
 else tr=`<small class=lbl>Tidak ada terjemahan untuk teks ini.</small>`;
 e.innerHTML=`<div class=lpn><div class=lpf>${esc(u.f)}</div>${o.lpRom&&u.r?`<div class="r rom">${esc(u.r)}</div>`:''}${tr}${u.pa&&u.i?`<small class=lbl>Terjemahan seluruh paragraf</small>`:''}</div>`}
function lpCtl(){const P=LP,e=document.getElementById('lpCtl');if(!P||!e)return;const sp=ttsRate();
 e.innerHTML=`<div class=lpc><button data-lp=prev aria-label="Sebelumnya">⏮</button><button class="lpp" data-lp=${P.playing?'pause':'play'} aria-label="${P.playing?'Jeda':'Putar'}">${P.playing?'⏸':'▶'}</button><button data-lp=next aria-label="Berikutnya">⏭</button><button data-lp=rep title="Ulang ${P.mode=='p'?'paragraf':'kalimat'} ini" aria-label="Ulang">🔁</button></div>`+
  `<div class=lps2><label>Kecepatan <b id=lpSpv>${sp.toFixed(2).replace(/0$/,'')}×</b></label><input type=range min=.5 max=1.2 step=.05 value="${sp}" data-lpr=sp aria-label="Kecepatan suara"><div class=chips style="margin:4px 0 0">${[.5,.7,.8,.9,1,1.2].map(v=>`<button class="chip${Math.abs(sp-v)<.001?' on':''}" data-lp=spd data-v=${v}>${v}×</button>`).join('')}</div></div>`;
 const hd=document.getElementById('lpHd');if(hd)hd.textContent=P.it.temp?'—':(P.it.h?'✓ Sudah didengar':'Tandai didengar');if(hd)hd.disabled=!!P.it.temp}
function lpSetR(){const P=LP,e=document.getElementById('lpSet');if(!P||!e)return;const o=lpO(),sg=(n,ops)=>`<div class=seg2>${ops.map(([v,t])=>`<button class="${o[n]==v?'on':''}" data-lp=opt data-o=${n} data-v="${v}">${t}</button>`).join('')}</div>`,vs=ttsVoices(P.L);
 e.innerHTML=`<details class=lpd${P.setOpen?' open':''} data-lpd=1><summary>Pengaturan pemutar</summary>`+
  `<small class=lbl>Satuan putar</small>${sg('lpM',[['s','Per kalimat'],['p','Per paragraf']])}`+
  `<small class=lbl>Jeda antar ${P.mode=='p'?'paragraf':'kalimat'}</small>${sg('lpPause',[[0,'0'],[1,'1 dtk'],[2,'2 dtk'],[3,'3 dtk'],[5,'5 dtk'],['sd','Seperti durasinya']])}`+
  `<small class=lbl>Ulangi tiap ${P.mode=='p'?'paragraf':'kalimat'}</small>${sg('lpRep',[[1,'1×'],[2,'2×'],[3,'3×']])}`+
  `<small class=lbl>Terjemahan Indonesia</small>${sg('lpT',[['show','Tampil'],['blur','Sensor'],['hide','Sembunyi']])}`+
  (P.it.ps.some(p=>p.r&&p.r.length)?`<small class=lbl>Romanisasi</small>${sg('lpRom',[[1,'Tampil'],[0,'Sembunyi']])}`:'')+
  `<label class=fcl><span><input type=checkbox data-lpc=lpAuto${o.lpAuto?' checked':''}> Lanjut otomatis ke berikutnya</span></label><label class=fcl><span><input type=checkbox data-lpc=lpLoop${+o.lpLoop?' checked':''}> Ulangi dari awal setelah selesai</span></label>`+
  `<label class=fcl><span>Suara</span><select data-lpv=1 style="width:auto;max-width:60%"><option value="">Otomatis</option>${vs.map(v=>`<option value="${esc(v.voiceURI)}"${(S.o.lpV||{})[P.L]==v.voiceURI?' selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select></label>`+
  `<small>${vs.length?'Kualitas dan kecepatan dasar tiap suara berbeda; coba suara lain bila terasa lambat atau kaku.':'Belum ada suara '+esc(libNm(P.L))+' di perangkat ini. Pasang suara bahasa tersebut di pengaturan sistem (Text-to-speech).'}</small></details>`}
function lpListR(){const P=LP,e=document.getElementById('lpList'),h=document.getElementById('lpLh');if(!P||!e)return;if(h)h.textContent=(P.mode=='p'?'Daftar paragraf':'Daftar kalimat');
 e.innerHTML=P.units.map((u,i)=>`<div class="lpi${i==P.idx?' cur':''}" data-lp=go data-v=${i}><i>${i+1}</i><span>${esc(u.f)}</span></div>`).join('');lpListCur(1)}
function lpListCur(first){const P=LP,e=document.getElementById('lpList');if(!P||!e)return;e.querySelectorAll('.lpi').forEach((x,i)=>x.classList.toggle('cur',i==P.idx));const c=e.querySelector('.lpi.cur');if(c&&!first){try{const r=c.getBoundingClientRect(),b=e.getBoundingClientRect();if(r.top<b.top||r.bottom>b.bottom)c.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(_){}}}
document.addEventListener('click',e=>{const m=document.getElementById('lpm');if(!m)return;
 if(e.target===m){lpClose();return}
 const b=e.target.closest('[data-lp]');if(!b||!LP)return;const a=b.dataset.lp,P=LP,o=lpO();
 if(a=='close'){lpClose();return}
 e.stopPropagation();
 if(a=='play')lpSpeak();else if(a=='pause')lpPause();else if(a=='next')lpGo(P.idx+1);else if(a=='prev')lpGo(P.idx-1);else if(a=='rep'){P.rep=0;lpSpeak()}
 else if(a=='go')lpGo(+b.dataset.v);
 else if(a=='peek'){P.peek=1;lpNow()}
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
