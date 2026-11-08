function rxLB(s,f){try{return new RegExp(s,f)}catch(e){return new RegExp(String(s).replace(/\(\?<[=!][^)]*\)/g,''),f)}}
let S={rd:{},p:{},s:{},ses:{},gs:0,f:[],gf:[],srs:{},sd:{d:-1,n:0,r:0,x:0,y:0},lg:{},nw:{},lib:[],sl:[],lt:{h:[],g:{},d:{}},o:{}},ok=true,tab='fc',q='',fs='',lim=50,shown=new Set;
/* v7.9: data dimuat dari IndexedDB lewat VRS.boot() (dijalankan sebelum berkas ini; migrasi otomatis dari localStorage) */
try{Object.assign(S,VRS.initial)}catch(e){ok=false}VRS.onError=()=>{ok=false;try{typeof toast=='function'&&toast('Gagal menyimpan ke penyimpanan browser. Buat cadangan (Ekspor) sekarang.')}catch(e){}};
const FCD={gz:'cloze',nl:20,rl:200,fd:'id',ff:[],fm:'or',fmin:1,deck:'v',ord:'seq',no:'after',ls:'1 10',rs:'10',gi:1,ei:4,se:250,eb:130,hi:120,ni:0,im:100,mx:36500,lk:1,mig:0,sp:[],lch:4,xn:10,xr:50};const LTD={lm:1,pl:'zh',plv:[],pn:1,pa:1,pv:1,po:1,ps:'full',pw:'all',pg:'all',pe:1,lx:1};S.o={hide:0,rom:0,minL:1,mode:'mix',...FCD,...LTD,...S.o};if(!S.o.cv)S.o.cv=S.o.hide?'fo':'none';S.o={cgL:'blur',cgK:'show',cgF:'show',cpl:'blur',cvb:'blur',ckp:'blur',rdt:'blur',...S.o};
/* v7.5: semua sensor SELALU aktif dan tidak bisa dikonfigurasi (pengaturannya dihapus). cv:'both' = bahasa asing & Indonesia sama-sama disensor per bagian. */
const SENS={cv:'both',rom:1,cgL:'blur',cgK:'blur',cgF:'blur',cpl:'blur',cvb:'blur',ckp:'blur',rdt:'blur',lm:1,ps:'id'};S.o=Object.assign(S.o,SENS);S.o={th:'auto',ac:'indigo',fz:'m',tts:1,ttsa:0,hap:1,gr:25,ttsr:.9,libMin:4,...S.o};if(!Array.isArray(S.lib))S.lib=[];S.lib=S.lib.filter(t=>t&&typeof t=='object');S.lib.forEach(t=>{if(!Array.isArray(t.ps))t.ps=[]});if(!Array.isArray(S.sl))S.sl=[];S.sl=S.sl.filter(t=>t&&typeof t=='object');if(!Array.isArray(S.o.gff))S.o.gff=(S.gf||[]).slice();
let fcQV=0;if(!S.v)S.v=1;
const save=()=>{fcQV++;VRS.save(S);window.vrSnapSoon&&vrSnapSoon()};
const K={};D.C.forEach(c=>K[c[0]]=c);
const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);{const ok=x=>LN[String(x).split(':')[0]];S.f=S.f.filter(ok);S.o.ff=S.o.ff.filter(ok)}D.GL.forEach(l=>{if(!LN[l[0]])LN[l[0]]=l[1]});const GK={};D.G.forEach(g=>GK[g[0]]=g);
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const st=k=>S.p[k]|0;
const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\d+$/,'')},ent=k=>{const m=/~(\d+)$/.exec(String(k));return m?+m[1]:0},ik=(k,l)=>k+SEP+l;
/* progres kosakata disimpan per (kartu, bahasa): item = "kartu@bahasa". Grammar tetap per id. */
const items=(c,v)=>Object.keys(v).map(l=>ik(c[0],l));
const cs=(c,v)=>{if(GK[c[0]])return st(c[0]);v=v||vis(c);if(!v)return 0;let m=2;for(const l in v)m=Math.min(m,st(ik(c[0],l)));return m};
const cnew=(c,v)=>Object.keys(v).some(l=>{const i=ik(c[0],l);return!st(i)&&!S.s[i]});
const cknown=(c,v)=>Object.keys(v).some(l=>{const i=ik(c[0],l);return st(i)||S.s[i]});
const markSeen=k=>{if(GK[k]||!K[k]){S.s[k]=1;return}const v=vis(K[k]);if(v)Object.keys(v).forEach(l=>S.s[ik(k,l)]=1)};
function migKeys(langs){let n=0;const L=c=>Object.keys(c[3]).filter(l=>!langs||!langs.length||langs.includes(l));
 for(const bag of['p','s','srs']){const o=S[bag];for(const k of Object.keys(o)){if(k.indexOf(SEP)>=0||!K[k])continue;
  S.legacy=S.legacy||{p:{},s:{},srs:{}};S.legacy[bag][k]=o[k];
  for(const l of L(K[k])){const i=ik(k,l);if(o[i]===undefined){o[i]=bag=='srs'?JSON.parse(JSON.stringify(o[k])):o[k];n++}}
  delete o[k]}}
 return n}
function migLegacy(langs){const lg=S.legacy;if(!lg)return 0;let n=0;
 for(const bag of['p','s','srs'])for(const k in lg[bag]){if(!K[k])continue;
  for(const l of Object.keys(K[k][3]).filter(x=>!langs.length||langs.includes(x))){const i=ik(k,l);if(S[bag][i]===undefined){S[bag][i]=bag=='srs'?JSON.parse(JSON.stringify(lg[bag][k])):lg[bag][k];n++}}}
 return n}
const DO=new Set(['fs']),dtag=id=>`<details data-d="${id}"${DO.has(id)?' open':''}>`;
const ART=/^((?:der|die|das)(?:\/(?:der|die|das))*)(\s+)(.+)$/i,ARTN=/^((?:de|het)(?:\/(?:de|het))*)(\s+)(.+)$/i;
function wd(t,pos,ctx,lang,force){const m=pos=='N'&&(lang=='de'?String(t).match(ART):lang=='nl'?String(t).match(ARTN):null);if(!m||force||S.o['cg'+ctx]!='blur')return esc(t);return`<span class=cz>${esc(m[1])}</span>${esc(m[2]+m[3])}`}
function fmx(e,pos,lang,force){if((lang!='de'&&lang!='nl'&&lang!='en')||!DX)return'';let t,l,md;
 if(lang=='en'){const X=typeof DXE!='undefined'?DXE:null;if(!X)return'';if(pos=='N'){t=X.n[e[0]];l='Bentuk jamak';md=S.o.cpl}else if(pos=='V'){t=X.v[e[0]];l='3sg · past · participle · -ing';md=S.o.cvb}else if(pos=='A'){t=X.a[e[0]];l='Komparatif · superlatif';md=S.o.ckp}else return''}
 else if(lang=='nl'){if(pos=='N'){t=DXN.n[e[0]];l='Bentuk jamak';md=S.o.cpl}else if(pos=='V'){t=DXN.v[e[0]];l='hij/zij/het · verleden · voltooid';md=S.o.cvb}else if(pos=='A'){t=DXN.a[e[0]];l='Komparatif';md=S.o.ckp}else return''}
 else if(pos=='N'){t=DX.n[e[0]];l='Bentuk jamak';md=S.o.cpl}else if(pos=='V'){t=DX.v[e[0]];l='er/sie/es · Präteritum · Perfekt';md=S.o.cvb}else return'';
 if(!t||md=='off')return'';
 return`<div class="r fx"><span class=gl>${l}</span><span class="${md=='blur'&&!force?'cz':''}">${esc(t)}</span></div>`}
const csel=(k,l,op,di)=>`<label class=fcl><span>${l}</span><select data-i="${di||k}" style="width:auto;margin:0">${op.map(([v,t])=>`<option value="${v}"${S.o[k]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
const SH=[['show','Tampil'],['blur','Sensor (blur)']],SH3=[['show','Tampil'],['blur','Sensor (blur)'],['off','Tidak ditampilkan']];
function vis(c,all){const v={};let n=0;for(const[id,,,]of D.L){const e=(c[3][id]||[]).filter(x=>all||!S.f.length||S.f.includes(id+':'+x[3]));if(e.length){v[id]=e;n++}}return all?(n?v:null):(n>=S.o.minL&&n?v:null)}
const pool=p=>D.C.filter(c=>c[1]==p&&vis(c));
const ORD={new:[0],rev:[1,2,0],mix:[0,1,2]};
function choose(P){const m=S.o.mode,V=new Map(),vv=c=>{let x=V.get(c);if(x===undefined){x=GK[c[0]]?{}:vis(c)||{};V.set(c,x)}return x};
if(m=='new')P=P.filter(c=>GK[c[0]]?!st(c[0])&&!S.s[c[0]]:cnew(c,vv(c)));else if(m=='rev')P=P.filter(c=>GK[c[0]]?st(c[0])||S.s[c[0]]:cknown(c,vv(c)));
for(const s of ORD[m]){const g=P.filter(c=>cs(c,vv(c))==s);if(g.length){const r=g[Math.random()*g.length|0][0];markSeen(r);return r}}return null}
const pick=(p,ex)=>choose(pool(p).filter(c=>c[0]!=ex)),gp=()=>D.G.filter(g=>(!S.gf.length||S.gf.includes(g[1]+':'+g[2]))&&txOk(g[0]));
const msel=()=>'<small>Mode belajar</small><select data-i=mode>'+[['mix','Campur (prioritas Belum)'],['new','Hafalan baru'],['rev','Mengingat kembali']].map(([v,x])=>`<option value=${v}${S.o.mode==v?' selected':''}>${x}</option>`).join('')+'</select>';
function card(k,full){const c=K[k],v=c&&vis(c,full);if(!v)return'<div class=card>Tidak ada kata yang cocok dengan filter saat ini.</div>';const ls=Object.keys(v),dn=ls.filter(l=>st(ik(k,l))==2).length;
/* sensor per item: tiap bagian yang diblur punya penanda sendiri (data-rv) dan hanya bagian yang diketuk yang terbuka */
const fo=S.o.cv=='fo'||S.o.cv=='both',idm=S.o.cv=='id'||S.o.cv=='both',rva=(key,on,base)=>{const rk=k+'|'+key;return on?` data-rv="${esc(rk)}" class="${base?base+' ':''}rvl${shown.has(rk)?' rv':''}"`:(base?` class="${base}"`:'')};
return`<div class="card" data-k="${esc(k)}"><div class=hd><span>${PN[c[1]]}</span><span>${dn}/${ls.length} bahasa selesai${edBtn('v',k)}</span></div><div${rva('m',idm,'mean')}>${esc(c[2])}</div><div class=grid>`+
D.L.filter(l=>v[l[0]]).map(([id,n,col])=>{const i=ik(k,id),s=st(i);return`<div class=lg style="--lc:${col}"><small class=lgh>${n}<button class="stp stp${s}" data-a=cyc data-k="${esc(i)}" title="Ketuk untuk mengubah status ${n}">${STN[s]}${fcTag(i)}</button>${aiBtn(i)}</small><div${rva(id,fo)}>`+v[id].map(e=>`<div class=w>${wd(e[0],c[1],'K',id)}${spk(e[0],id)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}${fmx(e,c[1],id)}${e[2]?`<div class=ex>${esc(e[2])}</div>`:''}${e[4]?`<div class=cx>💡 ${esc(e[4])}</div>`:''}`).join('')+'</div></div>'}).join('')+
`</div></div>`}
function filtBody(){return'<div class=chips><button class="chip'+(S.f.length?'':' on')+'" data-a=fall>Semua bahasa</button></div>'+
D.L.map(l=>`<div><small>${l[1]}</small><div class=chips>`+l[4].map(v=>{const x=l[0]+':'+v;return`<button class="chip${S.f.includes(x)?' on':''}" data-a=fl data-v="${x}">${v}</button>`}).join('')+'</div></div>').join('')}
const fcnt=n=>n?`<em class=cnt>${n} aktif</em>`:''
function filt(){return dtag('f1')+'<summary><span>Filter level &amp; bahasa</span>'+fcnt(S.f.length)+'</summary>'+filtBody()+'</details>'}
function vsetBody(){return'<div class=card>'+msel()+`<small>Minimal bahasa per kartu</small><select data-i=minL>${[1,2,3,4].map(n=>`<option${S.o.minL==n?' selected':''}>${n}</option>`).join('')}</select></div>`}
function vset(){return dtag('vs')+'<summary>Pengaturan kosakata</summary>'+vsetBody()+'</details>'}
function stats0(){let per=D.L.map(l=>[l,[0,0,0]]);const PM={};for(const c of D.C){const v=vis(c);if(!v)continue;for(const l in v){const s=st(ik(c[0],l));(PM[c[1]]||(PM[c[1]]=[0,0,0]))[s]++;per.find(x=>x[0][0]==l)[1][s]++}}
 const bar=(n,t)=>`<div class=bar><i style="width:${n[2]/t*100}%;background:var(--s2)"></i><i style="width:${n[1]/t*100}%;background:var(--s1)"></i></div>`;
 return filt()+vset()+`<div class=card><b>Kosakata per bahasa</b>`+per.filter(x=>x[1][0]+x[1][1]+x[1][2]).map(([l,n])=>{const t=(n[0]+n[1]+n[2])||1;return`<div class=lg style="--lc:${l[2]};margin:8px 0"><small>${l[1]} — ${t} kata</small>${bar(n,t)}Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}</div>`}).join('')+'</div>'+
 ['N','A','V','O'].map(p=>{const P=pool(p),n=PM[p]||[0,0,0],t=(n[0]+n[1]+n[2])||1;
 return`<div class=card><b>${PN[p]}</b> — ${P.length} kartu · ${t} entri bahasa${bar(n,t)}Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}</div>`}).join('')}
function gbody(g){const L=t=>`<div class=gsec>${t}</div>`,kv=g[10]||[],CJ=g[1]=='nl'?['Ik','Jij / U','Hij / Zij / Het','Wij','Jullie','Zij']:['Ich','Du','Er/Sie/Es/Man','Wir','Ihr','sie/Sie'],cj=kv.filter(p=>CJ.includes(p[0])),isC=cj.length>=3,rest=isC?kv.filter(p=>!CJ.includes(p[0])):kv;let h='';
 if(rest.length)h+=`<dl class=gkv>${rest.map(p=>`<dt>${esc(p[0])}</dt><dd>${esc(p[1])}</dd>`).join('')}</dl>`;
 if(isC)h+=`<div class=gwrap><table class=gtb><tr>${CJ.map(c=>`<th>${c}</th>`).join('')}</tr><tr>${CJ.map(c=>{const p=cj.find(x=>x[0]==c);return`<td>${p?esc(p[1]):'–'}</td>`}).join('')}</tr></table></div>`;
 if(g[5])h+=L(g[11]||'Fungsi')+`<div class=gtx>${esc(g[5])}</div>`;
 if(g[6])h+=L('Pola')+`<div class=gtx>${esc(g[6])}</div>`;
 const num=(a,n,c)=>a.map((x,i)=>`<div class="${c}"><span class=gl>${n}${a.length>1?' '+(i+1):''}</span>${esc(x)}</div>`).join('');
 if(g[7].length)h+='<div style="margin-top:10px"></div>'+g[7].map((e,i)=>{const a=e.split('\n');return`<div class=gex><span class=gl>Contoh${g[7].length>1?' '+(i+1):''}</span><div class=g1>${esc(a[0])}</div>${a.length>1?`<div class=g2>${g[1]=='zh'&&a.length>=3?`<span class=rom>${esc(a[1])}</span>\n${esc(a.slice(2).join('\n'))}`:esc(a.slice(1).join('\n'))}</div>`:''}</div>`}).join('');
 if(g[8].length)h+=num(g[8],g[12]||'Keterangan','gnt');
 if(g[9].length)h+=num(g[9],'Kasus khusus','gnt gkk');
 return h}
/* ===== v7.11: kartu grammar flashcard berbasis rumpang (cloze). Mandarin, Inggris (v7.12), Jepang (v7.13) dan Jerman (v7.15); bahasa lain cukup ditambahkan ke GZ ===== */
const GZ={zh:/[㐀-鿿]+/g,en:1,ja:1,de:1,nl:1,eo:1};
const gzLn=e=>{const a=String(e).split('\n');a[0]=a[0].replace(/^\s*\d+\s*[.、．)]\s*/,'');return a};
const gzSp=s=>String(s||'').replace(/\s+/g,'');
const gzOn=g=>!!GZ[g[1]]&&(S.o.gz||'cloze')!='old';
/* kata kunci = aksara pada kolom Pola (cadangan: judul). Label kategori (副词, 量词, ...) tidak ada di kalimat sehingga otomatis tidak dipakai */
function gzKeys(g){const re=GZ[g[1]];if(!re)return[];const f=s=>(String(s||'').match(re)||[]).filter(x=>x.length<=6);let k=f(g[6]);if(!k.length)k=f(g[4]);return[...new Set(k)]}
function gzSplit(h,keys){h=String(h||'');if(!keys.length)return[[h,0]];const re=new RegExp('('+[...keys].sort((a,b)=>b.length-a.length).map(k=>[...k].join('\\s*')).join('|')+')','g'),o=[];let p=0,m;
 while((m=re.exec(h))){if(!m[0].length){re.lastIndex++;continue}if(m.index>p)o.push([h.slice(p,m.index),0]);o.push([m[0],1]);p=m.index+m[0].length}
 if(p<h.length)o.push([h.slice(p),0]);return o}
const gzTr=a=>{let t=a.length>=3?a.slice(2).join('\n'):a.length==2?a[1]:'';t=t.trim();const m=t.match(/^[（(]([\s\S]*)[)）]$/);return m&&!/[（(]/.test(m[1])?m[1].trim():t};
/* pilih contoh terbaik untuk rumpang: 1-2 kata kunci dikosongkan (maks. 2 agar tidak terlalu sulit), punya pinyin+arti, panjang sedang */
function gzPick(g){const keys=gzKeys(g);let best=null,bs=-1,mk=[];
 if(keys.length)(g[7]||[]).forEach((e,i)=>{const a=e.split('\n'),hit=new Set(gzSplit(a[0],keys).filter(x=>x[1]).map(x=>gzSp(x[0])));if(!hit.size)return;const n=hit.size,len=gzSp(a[0]).length,sc=(n>=2?100:50)-(n>2?(n-2)*10:0)+(a.length>=3?20:0)-Math.abs(len-12)*.5;if(sc>bs){bs=sc;best=i;mk=keys.filter(k=>hit.has(k)).slice(0,2)}});
 return{keys,mk,i:best}}
function gzFront(g){if(g[1]=='en')return gzeFront(g);if(g[1]=='ja')return gzjFront(g);if(g[1]=='de')return gzdFront(g);if(g[1]=='nl')return gznFront(g);if(g[1]=='eo')return gzoFront(g);const m=S.o.gz||'cloze',p=gzPick(g),fn=`<div class="gzq${String(g[5]||'').length>60?' gzl':''}"><span class=gl>${esc(g[11]||'Fungsi')}</span>${esc(g[5])}</div>`;
 if(m=='cloze'&&p.i!=null){const a=gzLn(g[7][p.i]),tr=gzTr(a);
  return fn+`<div class=gzc>${gzSplit(a[0],p.mk).map(([t,h])=>h?`<span class=gzb style="--n:${[...gzSp(t)].length}">&nbsp;</span>`:esc(t)).join('')}</div>`+(tr?`<div class=gzm>${esc(tr)}</div>`:'')+`<div class=fchint><small>Isi bagian yang hilang &amp; ingat rumus polanya</small></div>`}
 let ex='';if(m!='fn'){const k=(g[7]||[]).findIndex(e=>/[\u3400-\u9fff]/.test(e.split('\n')[0])&&e.split('\n').length>=2),a=(g[7]||[])[k>=0?k:0];if(a){const b=gzLn(a),t=gzTr(b);ex=`<div class=gzc style="font-size:1.5rem">${esc(b[0])}</div>`+(t?`<div class=gzm>${esc(t)}</div>`:'')}}
 return fn+ex+`<div class=fchint><small>Ingat: nama pola &amp; rumusnya</small></div>`}
function gzBack(g,k){if(g[1]=='en')return gzeBack(g,k);if(g[1]=='ja')return gzjBack(g,k);if(g[1]=='de')return gzdBack(g,k);if(g[1]=='nl')return gznBack(g,k);if(g[1]=='eo')return gzoBack(g,k);const p=gzPick(g),ks=p.keys,hl=t=>gzSplit(t,ks).map(([x,h])=>h?`<mark class=gzh>${esc(x)}</mark>`:esc(x)).join('');
 let h=`<div class=gzt1>${esc(g[4])}</div><hr>`;
 if(g[6])h+=`<div class=gzp>${gzSplit(g[6],ks).map(([x,y])=>y?`<mark class=gzh>${esc(x)}</mark>`:esc(x)).join('')}</div>`;
 h+=`<div class=gzf>${esc(g[5])}</div>`;
 const ord=(g[7]||[]).map((e,i)=>i);if(p.i!=null){ord.splice(p.i,1);ord.unshift(p.i)}
 h+=ord.map(i=>{const a=gzLn(g[7][i]),han=/[㐀-鿿]/.test(a[0]),pin=a.length>=3?a[1]:'',tr=gzTr(a);
  return`<div class="gex gzx"><div class=g1>${hl(a[0])}${han?spk(gzSp(a[0]),g[1]):''}</div>${pin?`<div class="g2 rom">${esc(pin)}</div>`:''}${tr?`<div class=g2>${esc(tr)}</div>`:''}</div>`}).join('');
 const n1=(g[8]||[]).length,n2=(g[9]||[]).length,num=(a,n,c)=>a.map((x,i)=>`<div class="${c}"><span class=gl>${n}${a.length>1?' '+(i+1):''}</span>${esc(x)}</div>`).join('');
 if(n1+n2)h+=`<details class=gzd><summary>${n1?esc(g[12]||'Keterangan'):''}${n1&&n2?' &amp; ':''}${n2?'kasus khusus':''} (${n1+n2})</summary>${num(g[8]||[],g[12]||'Keterangan','gnt')}${num(g[9]||[],'Kasus khusus','gnt gkk')}</details>`;
 return`<div style="text-align:left">`+h+gmExBlock(k)+`</div>`}
/* ===== v7.12: grammar Inggris (aksara Latin) pada kartu rumpang. Kata kunci diambil dari kolom Pola; zh tidak diubah ===== */
const GE={
 ph:new Set(('s s1 s2 v v1 v2 v3 v-ing v-ed v-s o n n1 n2 n-s np pp io do2 x y z b c d ed ing es ies ied icked ly er est ic ically ily le ance ment ence ness ity ant ent ure ee ue ess ian ese ish al un dis pre anti st nd rd sh ch tch ss tion sion ial '
 +'noun nouns verb verba adj adjective adv adverb aux clause pronoun pron singular plural present past future perfect simple continuous uncountable countable object subject complement phrase prep preposition prepositions prepositional place time vs neg '
 +'comparative superlative linking modal modals possessive person manner proper abstract concrete gerund infinitive to-v to-infinitive that-clause interrogative demonstrative interjection interj det determiner article quantifier particle adverbial conj conjunctive '
 +'coordinating subordinating correlative dependent independent main finite participle reflexive intransitive transitive stative gradable ungradable non-gradable wh-word wh comp ordinal cardinal attributive predicative declarative active passive collective compound complex '
 +'statement question command exclamation name title pattern frequency duration purpose agent agency instrument origin direction connection event opinion measurement shape condition age color material general common specific tense aspect formal tag root base form '
 +'tanpa tidak di akhir dengan awal koma yang atau untuk sebagai dapat hanya bagian hari kalimat bunyi konsonan dll vokal huruf kapital kecil ketiga tunggal jauh jam bulan tahun tanggal pola dipakai gunakan jangan bukan bila dan satu dua inti pada tengah waktu kolektif '
 +'dekat orang tetap umum masih benar wajib contoh kontras kata nomina objek tujuan peristiwa kegiatan berlanjut pelaku benda transportasi perangkat penekanan negatif tanya diketahui pluralkan gandakan harus dihafal lama jika sendiri berdiri ide perasaan titik sebagai pengganti nama '
 +'animals people things thing group number unit amount quantity word words sentence one-word interj stress hyphen hyphenated closed open act').split(/\s+/)),
 gen:new Set('a an the to of in on at for with by as and or but it i'.split(' ')),
 aux:'be am is are was were been being|have has had having|do does did done doing|a an|an a',
 vb:'look looks looked looking|take takes took taken taking|give gives gave given giving|put puts putting|run runs ran running|turn turns turned turning|pick picks picked picking|break breaks broke broken breaking|bring brings brought bringing|hang hangs hung hanging|throw throws threw thrown throwing|grow grows grew grown growing|keep keeps kept keeping|show shows showed shown showing|make makes made making|tell tells told telling|think thinks thought thinking|know knows knew known knowing|feel feels felt feeling|hear hears heard hearing|see sees saw seen seeing|call calls called calling|move moves moved moving|pull pulls pulled pulling|drop drops dropped dropping|catch catches caught catching|wear wears wore worn wearing|find finds found finding|work works worked working|stay stays stayed staying|want wants wanted wanting|need needs needed needing|try tries tried trying|ask asks asked asking|wish wishes wished wishing|love loves loved loving|like likes liked liking|help helps helped helping|get gets got gotten getting|go goes went gone|come comes came coming|say says said saying|can cannot|stop stops stopped stopping|remember remembers remembered remembering|forget forgets forgot forgotten forgetting|suggest suggests suggested suggesting|insist insists insisted insisting|recommend recommends recommended recommending|decide decides decided deciding|agree agrees agreed agreeing',
 cl:{"'m":'be',"'re":'be',"'s":'be have',"'ve":'have',"'d":'have would',"'ll":'will',"n't":'not'},
 st:{"can't":'can',"won't":'will',"shan't":'shall'},
 det:new Set('the a an my your his her its our their this that these those me him us them it you'.split(' ')),
 sfx:new Set('only family july reply apply supply rely ally holy jelly belly ugly lovely early daily need speed feed seed weed hundred red shed bed indeed'.split(' ')),
 cc:[[/\bwh(-word)?\b/i,/^(who|whom|whose|what|which|when|where|why|how)$/],[/\bmodals?\b/i,/^(can|could|may|might|must|shall|should|will|would|ought)$/],[/possessive\s+(det|determiner|adj)/i,/^(my|your|his|her|its|our|their)$/],[/possessive pronoun/i,/^(mine|yours|his|hers|ours|theirs)$/],[/-self|reflexive|intensive pronoun/i,/^(my|your|him|her|it|one|our|them)selves?$|^(yourselves|themselves|ourselves)$/],[/\barticle\b/i,/^(a|an|the)$/],[/\baux\b/i,/^(do|does|did|is|are|am|was|were|have|has|had|will|would|can|could|should|may|might|must|shall)$/],[/\bprep(osition)?\b/i,/^(in|on|at|by|for|with|from|about|above|across|after|against|along|among|around|before|behind|below|beside|between|beyond|during|except|inside|into|near|off|onto|outside|over|since|through|toward|towards|under|until|up|upon|within|without)$/],[/subordinating|\bconj\b/i,/^(because|although|though|whereas|unless|whenever|wherever|whether|provided)$/],[/coordinating/i,/^(and|but|or|nor|yet|so)$/]],
 ing:new Set('thing something nothing anything everything king ring bring sing spring morning evening during string wing swing sting ceiling'.split(' '))};
const geRev={},geVb={};
GE.aux.split('|').forEach(r=>{const f=r.split(' ');f.forEach(w=>(geRev[w]=geRev[w]||[]).push(f[0]))});
GE.vb.split('|').forEach(r=>{const f=r.split(' ');f.forEach(w=>{(geRev[w]=geRev[w]||[]).push(f[0]);geVb[w]=f[0]})});
const geNorm=w=>String(w).replace(/[’‘]/g,"'").toLowerCase();
const geMk=(s,e,l,extra)=>{const c=new Set([l,...(extra||[])]);(geRev[l]||[]).forEach(x=>c.add(x));(extra||[]).forEach(x=>(geRev[x]||[]).forEach(y=>c.add(y)));return{s,e,l,c}};
/* kalimat → unit kata (klitik dipisah: don't → do + n't, I'll → I + 'll) */
function geU(t){t=String(t||'');const u=[],re=/['’](?:s|m|re|ve|d|ll)(?![A-Za-z])|[A-Za-z]+(?:['’][A-Za-z]+)*/g;let m;
 while((m=re.exec(t))){const w=m[0],s=m.index,e=s+w.length,lo=geNorm(w);
  if(GE.cl[lo]){u.push({s,e,l:lo,c:new Set([lo,...GE.cl[lo].split(' ')])});continue}
  if(lo=='cannot'){const x=geMk(s,e,lo,['can','not']);u.push(x);continue}
  let k=lo.match(/^(.+)(n't)$/);
  if(k){const st=k[1],ex=GE.st[lo]?[GE.st[lo]]:[];u.push(geMk(s,s+st.length,st,ex));u.push({s:s+st.length,e,l:"n't",c:new Set(["n't",'not'])});continue}
  k=lo.match(/^([a-z]+)('(?:s|m|re|ve|d|ll))$/);
  if(k){const n=k[1].length;u.push(geMk(s,s+n,k[1]));u.push({s:s+n,e,l:k[2],c:new Set([k[2],...GE.cl[k[2]].split(' ')])});continue}
  u.push(geMk(s,e,lo))}
 return u}
const geInfC=new Map();
/* bentuk reguler kata isi dari Pola (look → looks/looked/looking); bukan stemmer: hanya menambah sufiks pada kata kunci */
function geInf(w){let r=geInfC.get(w);if(r)return r;r=new Set();if(w.length>=4&&!GE.gen.has(w)&&!geRev[w]&&/^[a-z]+$/.test(w)){const b=w.replace(/e$/,''),y=/[^aeiou]y$/.test(w)?w.slice(0,-1):null,d=/[^aeiou][aeiou][bdgklmnprt]$/.test(w)?w+w.slice(-1):null;
 [w+'s',w+'es',w+'ed',w+'d',w+'ing',b+'ing'].forEach(x=>r.add(x));if(y)['ies','ied'].forEach(x=>r.add(y+x));if(d)['ed','ing'].forEach(x=>r.add(d+x))}geInfC.set(w,r);return r}
const geM=(u,w)=>u.c.has(w)||(!!geVb[w]&&u.c.has(geVb[w]))||geInf(w).has(u.l);
/* token pada kolom Pola: placeholder (S, V1, noun, ...) bukan kata kunci */
function gzeLex(w){if(w!='I'&&/^[A-Z][A-Z0-9]*$/.test(w))return false;if(/[A-Z]{2,}/.test(w))return false;const lo=geNorm(w);
 if(GE.ph.has(lo)||/^[vnso]\d$/.test(lo))return false;
 if(/[-]/.test(lo)&&lo.split('-').some(x=>GE.ph.has(x)))return false;return true}
function geW(tok){const lo=geNorm(tok);let k=lo.match(/^(.+)(n't)$/);
 if(k)return[GE.st[lo]||k[1],"n't"];k=lo.match(/^([a-z]+)('(?:s|m|re|ve|d|ll))$/);if(k)return[k[1],k[2]];return[lo]}
/* Pola → potongan alternatif (/ ; vs → >) → frasa (kata leksikal berurutan, dipisah placeholder atau tanda) */
function gzePc(p){p=String(p||'').replace(/\[[^\]]*\]/g,' + ').replace(/\([^)]*\)/g,' + ');
 return p.split(/\s*(?:\/|;|→|>|=|\bvs\b)\s*/i).map(s=>{const ph=[];let cur=[],m;const re=/([A-Za-z][A-Za-z0-9]*(?:[-'’][A-Za-z0-9]+)*|['’][A-Za-z]+)|\S/g,fl=()=>{if(cur.length)ph.push(cur);cur=[]};
  while((m=re.exec(s))){if(m[1]&&gzeLex(m[1]))cur.push(...geW(m[1]));else fl()}
  fl();return ph}).filter(x=>x.length)}
let geDFc=null;
function geDF(){if(geDFc)return geDFc;const df={};let n=0;Object.values(GK).forEach(g=>{if(g[1]!='en')return;(g[7]||[]).forEach(e=>{n++;const sn=new Set();geU(geEx(e).s).forEach(u=>u.c.forEach(w=>sn.add(w)));sn.forEach(w=>df[w]=(df[w]||0)+1)})});return geDFc={df,n:n||1}}
const geSc=ph=>{const d=geDF();return ph.reduce((a,w)=>a+Math.log(d.n/(1+(d.df[w]||0))),0)+(ph.length>1?3:0)};
const geGen=ph=>ph.every(w=>GE.gen.has(w));
const GEN_NOTE=/^\s*(bukan(?!kah)|salah(?!\s+satu)|✖|\*|=)/i,GEI=/^(.+?[.!?…"”])\s*\(([^()]+)\)\s*(\[[^\]]*\])?\s*(✖[\s\S]*)?$/;
/* contoh Inggris: kalimat, arti (baris ke-2 atau inline dalam kurung), catatan, tanda kalimat salah (✖ / "salah") */
function geEx(e){const a=gzLn(e);let s=String(a[0]||'').trim(),tr='',notes=[],wrong=/^✖/.test(s);
 const m=s.match(GEI);if(m){s=m[1];tr=m[2].trim();if(m[3])notes.push(m[3].replace(/^\[|\]$/g,''));if(m[4])notes.push(m[4])}
 for(let j=1;j<a.length;j++){const l=String(a[j]).trim();if(!l)continue;if(!tr&&j==1&&!GEN_NOTE.test(l))tr=l;else{notes.push(l);if(/^salah(?!\s+satu)/i.test(l))wrong=true}}
 const q=tr.match(/^[（(]([\s\S]*)[)）]$/);if(q&&!/[(（]/.test(q[1]))tr=q[1].trim();
 return{s,tr,notes,wrong}}
const geCc=new Map();
/* kata kunci cadangan: daftar di judul (setelah ":" atau dalam kurung) dan isi kurung pada Pola; hanya dipakai bila Pola tidak menemukan apa pun */
function geTl(g){const o=[],add=x=>String(x||'').split(/\s*[,;\/]\s*|\s+(?:atau|or|dan)\s+/).forEach(it=>{const ws=(it.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)||[]);if(!ws.length||ws.length>3||!ws.every(w=>gzeLex(w)))return;o.push(ws.flatMap(geW))});
 const t=String(g[4]||''),p=String(g[6]||'');let m,re=/\(([^()]*)\)/g;while((m=re.exec(t)))add(m[1]);const c=t.lastIndexOf(':');if(c>=0)add(t.slice(c+1).replace(/\([^()]*\)/g,''));
 re=/[(\[]([^()\[\]]*)[)\]]/g;while((m=re.exec(p)))if(/[,\/;]/.test(m[1]))add(m[1]);
 return o.map(ph=>[ph])}
function geCard(g){let c=geCc.get(g[0]);if(!c){c={pcs:gzePc(g[6]),sp:geTl(g)};c.lex=c.pcs.some(p=>p.length);c.slex=c.sp.length>0;
 c.suf=[...new Set([...(String(g[6]||'').matchAll(/(?:^|[\s(+\/>;,])-([a-z]{2,6})\b/g))].map(x=>x[1]).concat(/v-ing/i.test(String(g[6]||''))?['ing']:[]).filter(x=>/^(ly|ness|tion|sion|ment|ance|ence|est|ed|ing|ity|ful|less|ee|or|al|ure)$/.test(x)))];
 c.cc=GE.cc.filter(([r])=>r.test(String(g[6]||''))).map(x=>x[1]);geCc.set(g[0],c)}return c}
function geOcc(t,U,ph){const o=[];for(let i=0;i+ph.length<=U.length;i++){let ok=true;for(let j=0;j<ph.length&&ok;j++){ok=geM(U[i+j],ph[j]);if(ok&&j)ok=!/\S/.test(t.slice(U[i+j-1].e,U[i+j].s))}if(ok)o.push([i,i+ph.length-1])}return o}
/* pilih bagian yang dirumpangkan pada satu kalimat: {bx:[[s,e]], ph:[frasa], sc, gen, other, src} atau null */
function gzeSel(g,t){const C=geCard(g),U=geU(t);return gzeRun(C.pcs,t,U)||(C.sp.length&&gzeRun(C.sp,t,U,'judul'))||gzeMorph(C,t,U)}
function gzeRun(pcs,t,U,src){let best=null,gen=null;
 pcs.forEach(pc=>{const m=pc.map(ph=>({ph,oc:geOcc(t,U,ph),sc:geSc(ph)})).filter(x=>x.oc.length);if(!m.length)return;
  const ng=m.filter(x=>!geGen(x.ph)).sort((a,b)=>b.sc-a.sc);
  if(ng.length){const bx=[],ps=[];let sc=0;for(const x of ng){const ov=x.oc.some(([a,b])=>bx.some(([c,d])=>a<=d&&b>=c));if(ov||bx.length+x.oc.length>2)continue;bx.push(...x.oc);ps.push(x.ph);sc+=x.sc}
   if(bx.length){const r={bx,ph:ps,sc:sc+(ng.length==pc.length?10:0),gen:false};if(!best||r.sc>best.sc)best=r}}
  else{const x=m.sort((a,b)=>b.sc-a.sc)[0];if(!gen||x.sc>gen.sc)gen=x}});
 if(best){let oth=0;pcs.forEach(pc=>pc.forEach(ph=>{if(!geGen(ph)&&!best.ph.some(q=>q.join(' ')==ph.join(' '))&&geOcc(t,U,ph).length)oth++}));best.other=oth;return fin(best)}
 if(gen){const k=gen.oc.length>1?gzeOne(t,U,pcs,gen):gen.oc[0];return fin({bx:[k],ph:[gen.ph],sc:gen.sc-40,gen:true,other:0})}
 return null;
 function fin(r){r.src=src||'pola';r.bx=r.bx.map(([a,b])=>[U[a].s,U[b].e]).sort((x,y)=>x[0]-y[0]);return r}}
/* tanpa kata leksikal sama sekali: sufiks pada Pola (-ing, -ly, -ness, ...) → kata berakhiran itu, hanya bila tepat satu kandidat */
function gzeMorph(C,t,U){if(C.lex)return null;
 let c=C.suf.length?U.filter(u=>C.suf.some(f=>u.l.length>=f.length+3&&u.l.endsWith(f))&&!GE.ing.has(u.l)&&!GE.sfx.has(u.l)):[];
 if(!c.length&&C.cc.length)c=U.filter(u=>C.cc.some(f=>f.test(u.l)));
 return c.length==1?{bx:[[c[0].s,c[0].e]],ph:[[c[0].l]],sc:0,gen:false,other:0,morph:true,src:'morfologi'}:null}
/* kata sangat umum (to, of, a ...): kosongkan SATU kemunculan yang paling relevan (dekat kata kunci lain / "to + verba") */
function gzeOne(t,U,pcs,x){const others=[];pcs.forEach(pc=>pc.forEach(ph=>{if(ph.join(' ')!=x.ph.join(' '))others.push(ph)}));
 const hit=new Set();others.forEach(ph=>geOcc(t,U,ph).forEach(([a,b])=>{for(let i=a;i<=b;i++)hit.add(i)}));
 let bk=x.oc[0],bs=1e9;x.oc.forEach(k=>{let d=1e8;hit.forEach(i=>{const dd=Math.min(Math.abs(i-k[0]),Math.abs(i-k[1]));if(dd<d)d=dd});
  const nx=U[k[1]+1];let sc=d;if(x.ph.join(' ')=='to'&&nx&&GE.det.has(nx.l))sc+=50;if(sc<bs){bs=sc;bk=k}});return bk}
const geWc=s=>(s.match(/[A-Za-z']+/g)||[]).length;
function gzeScore(x,sel){const ns=(x.s.match(/[.!?]["”]?\s+(?=["“A-Z])/g)||[]).length;
 return sel.sc+(x.tr?25:0)-ns*15-(/ \/ /.test(x.s)?10:0)-Math.abs(geWc(x.s)-9)*.8+(sel.ph.length>1?8:0)-(sel.other||0)*12+(/[.!?]["”]?$/.test(x.s)?3:0)}
const geIc=new Map();
function gzeInfo(g){let r=geIc.get(g[0]);if(r)return r;let bs=-1e9,bi=null,bsel=null;
 (g[7]||[]).forEach((e,i)=>{const x=geEx(e);if(x.wrong)return;const sel=gzeSel(g,x.s);if(!sel)return;const sc=gzeScore(x,sel);if(sc>bs){bs=sc;bi=i;bsel=sel}});
 let sh=null,ss=-1e9;(g[7]||[]).forEach((e,i)=>{const x=geEx(e);if(x.wrong)return;const sc=(x.tr?25:0)-(x.s.match(/[.!?]["”]?\s+(?=["“A-Z])/g)||[]).length*15-Math.abs(geWc(x.s)-9)*.8;if(sc>ss){ss=sc;sh=i}});
 r={i:bi,sel:bsel,show:sh,why:bi!=null?(bsel.morph?'morph':bsel.gen?'generik':bsel.src=='judul'?'judul':'auto'):((geCard(g).lex||geCard(g).slex)?'nomatch':'nolex')};geIc.set(g[0],r);return r}
/* fungsi pendek: kalimat pertama ≤ ±90 karakter, kata kunci yang dirumpangkan diganti kotak */
function gzeFn(g,p){let t=String(g[5]||'').replace(/\s+/g,' ').trim(),re=/[.!?](?=\s+["'(A-Z0-9])/g,m,cut=t.length;
 while((m=re.exec(t))){const w=(t.slice(0,m.index).match(/(\S+)$/)||[''])[1].toLowerCase();if(/^(mis|dll|dst|dsb|spt|cth|no|vs|mr|dr|yg|dgn|tsb)$/.test(w))continue;cut=m.index;break}
 t=t.slice(0,cut).replace(/[.\s]+$/,'');if(t.length>90){const c=t.slice(0,91).replace(/\s+\S*$/,'');t=(c||t.slice(0,90))+'…'}
 const ph=[];if(p&&p.sel)p.sel.ph.forEach(q=>{ph.push(q);if(q.length>1)q.filter(w=>!GE.gen.has(w)).forEach(w=>ph.push([w]))});if(!ph.length)return esc(t);const U=geU(t),bx=[];
 ph.forEach(q=>geOcc(t,U,q).forEach(([a,b])=>bx.push([U[a].s,U[b].e])));bx.sort((x,y)=>x[0]-y[0]);
 let o='',l=0;for(const[a,b]of bx){if(a<l)continue;o+=esc(t.slice(l,a))+`<span class="gzb gze gzs" style="--n:${b-a}">&nbsp;</span>`;l=b}return o+esc(t.slice(l))}
const gzeSeg=(t,bx,f)=>{let o='',l=0;for(const[a,b]of bx){o+=esc(t.slice(l,a))+f(t.slice(a,b),b-a);l=b}return o+esc(t.slice(l))};
function gzeFront(g){const m=S.o.gz||'cloze',p=gzeInfo(g),fh=gzeFn(g,p),fn=`<div class="gzq${String(g[5]||'').length>60?' gzl':''}"><span class=gl>Fungsi</span>${fh}</div>`;
 if(m=='cloze'&&p.i!=null){const x=geEx(g[7][p.i]);
  return fn+`<div class="gzc gzen">${gzeSeg(x.s,p.sel.bx,(w,n)=>`<span class="gzb gze" style="--n:${n}">&nbsp;</span>`)}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')+`<div class=fchint><small>Isi bagian yang hilang &amp; ingat rumus polanya</small></div>`}
 let ex='';if(m!='fn'&&p.show!=null){const x=geEx(g[7][p.show]);ex=`<div class="gzc gzen">${esc(x.s)}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')}
 return fn+ex+`<div class=fchint><small>Ingat: ${m=='fn'?'nama pola &amp; rumusnya':'pola &amp; rumusnya'}</small></div>`}
function gzePatHtml(p){p=String(p||'');let o='',l=0,d=0,m;const re=/\[|\]|\(|\)|([A-Za-z][A-Za-z0-9]*(?:[-'’][A-Za-z0-9]+)*|['’][A-Za-z]+)/g;
 while((m=re.exec(p))){if(m[0]=='['||m[0]=='('){d++;continue}if(m[0]==']'||m[0]==')'){d=Math.max(0,d-1);continue}
  if(!d&&gzeLex(m[1])){o+=esc(p.slice(l,m.index))+`<mark class=gzh>${esc(m[1])}</mark>`;l=m.index+m[0].length}}
 return o+esc(p.slice(l))}
function gzeBack(g,k){const p=gzeInfo(g);let h=`<div class=gzt1>${esc(g[4])}</div><hr>`;
 if(g[6])h+=`<div class=gzp>${gzePatHtml(g[6])}</div>`;
 h+=`<div class=gzf>${esc(g[5])}</div>`;
 const ord=(g[7]||[]).map((e,i)=>i),f=p.i!=null?p.i:p.show;if(f!=null){ord.splice(f,1);ord.unshift(f)}
 h+=ord.map(i=>{const x=geEx(g[7][i]),sel=x.wrong?null:i==p.i?p.sel:gzeSel(g,x.s),bx=sel?sel.bx:[];
  return`<div class="gex gzx${x.wrong?' gzw':''}"><div class=g1>${gzeSeg(x.s,bx,w=>`<mark class=gzh>${esc(w)}</mark>`)}${x.wrong?'':spk(x.s,'en')}</div>${x.tr?`<div class=g2>${esc(x.tr)}</div>`:''}${x.notes.map(n=>`<div class="g2 gzn">${esc(n)}</div>`).join('')}</div>`}).join('');
 const n1=(g[8]||[]).length,n2=(g[9]||[]).length,num=(a,n,c)=>a.map((x,i)=>`<div class="${c}"><span class=gl>${n}${a.length>1?' '+(i+1):''}</span>${esc(x)}</div>`).join('');
 if(n1+n2)h+=`<details class=gzd><summary>${n1?esc(g[12]||'Keterangan'):''}${n1&&n2?' &amp; ':''}${n2?'kasus khusus':''} (${n1+n2})</summary>${num(g[8]||[],g[12]||'Keterangan','gnt')}${num(g[9]||[],'Kasus khusus','gnt gkk')}</details>`;
 return`<div style="text-align:left">`+h+gmExBlock(k)+`</div>`}
/* ===== v7.13: grammar Jepang (N5–N1) pada kartu rumpang. Kata kunci diambil dari JUDUL (bentuk grammar itu sendiri), cadangan: kolom Pola; placeholder Latin/Indonesia diabaikan ===== */
const GJ={
 /* akhiran konjugasi: kata kunci berakhiran る/い/う/… dicari juga dalam bentuk berubah (いる → いた/いて/います) bila bentuk persis tidak ada */
 cls:{'る':'れろよりらっんてたずな','い':'いくかけさっ','う':'うわいえおっ','く':'くきけこい','ぐ':'ぐぎげごい','す':'すしせそ','つ':'つちてとっ','ぬ':'ぬなねのん','ぶ':'ぶびべぼん','む':'むみめもん','だ':'だでなにっろ'},
 /* kartu bentuk konjugasi (judul tidak muncul di kalimat): {rx: regex; kelompok 1 = bagian yang dikosongkan, berada di akhir kecocokan} */
 cx:{'て / で':'(?:[ぁ-ん一-龯ー])([てで])(?=[、。]|[^ぁ-ゟ]|[いあおくしみもはね]|$)','ば':'[れけえげせてねべめ](ば)','意向形':'(?:^|[^だで])((?:よう|[おこそとのほもろごぼ]う))(?=[。、！？!?」]|と|か|ね|$)','受身形':'((?:られ|[あかがさざたなばまらわ]れ))(?=[るたなてま])','られる':'((?:られ(?=[るたなてま])|[えけげせぜてでねべめれ]る))','させる':'((?:させ|[あかがさざたなばまらわ]せ)(?=[るたなてま]))','させられる':'((?:させられ|[あかがさざたなばまらわ]され)(?=[るたなてま]))'},
 nn:/^\s*(K\.?\s*Benda|Kata\s*Benda|Angka|Grup|Waktu|Tempat|Satuan|Jumlah|K\.?\s*Sifat)/i,
 end:/Akhir/i,
 jp:/[々぀-ヿ㐀-鿿]+/g};
const gjHira=c=>/[ぁ-ゟ]/.test(c||''),gjQ=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const gjCc=new Map();
/* potongan (piece) dari judul/pola: urutan aksara Jepang yang dipisah ～, placeholder Latin, tanda +; "/" memisahkan alternatif; isi kurung dibuang */
function gjForms(src,pat){const s=String(src||'').replace(/[（(][^）)]*[）)]/g,' '),o=[],seen=new Set();
 s.split('/').forEach(side=>{let ps=side.match(GJ.jp)||[];if(pat&&ps.some(p=>p.length>1))ps=ps.filter(p=>p.length>1||!/^[ぁ-ゟ]$/.test(p));const k=ps.join('|');if(ps.length&&!seen.has(k)){seen.add(k);o.push(ps.map(t=>gjPc(t)))}});return o}
function gjPc(t){const c=t.slice(-1),pc={t};let cl=GJ.cls[c];
 if(/です$/.test(t))pc.cj=gjQ(t.slice(0,-1))+'[すし]';
 else if(/ます$/.test(t))pc.cj=gjQ(t.slice(0,-2))+'ま(?:す|せ|し)';
 else if(t.length>=3&&/くる$/.test(t))pc.cj=gjQ(t.slice(0,-2))+'(?:く(?:る|れ|ろ)|き|こ)';
 else if(t.length>=3&&/する$/.test(t))pc.cj=gjQ(t.slice(0,-2))+'(?:す(?:る|れ)|し|さ|せ)';
 else if(cl){const st=t.slice(0,-1);if(c=='る'&&/[ゃさざ]る$/.test(t))cl+='い';
  if(st.length>=2||/[\u4e00-\u9fff]$/.test(st)||t=='ない')pc.cj=gjQ(st)+(c=='る'?'(?:ま(?:す|せん|し(?:た|ょう)?)|['+cl+'])':'['+cl+']')}
 return pc}
function gjCard(g){let c=gjCc.get(g[0]);if(c)return c;const ti=String(g[4]||''),cx=GJ.cx[ti],lat=/[A-Za-z]{3,}/.test(ti.replace(/[（(][^）)]*[）)]/g,''));
 const tf=cx?[[{t:ti,rx:cx}]]:lat?[]:gjForms(ti),pf=gjForms(g[6],1);
 c={f1:tf.length?tf:pf,f2:tf.length?pf:[],nn:GJ.nn.test(String(g[6]||'')),en:GJ.end.test(String(g[6]||''))};c.any=c.f1.length>0;gjCc.set(g[0],c);return c}
/* semua kemunculan potongan pada kalimat: bentuk persis dulu; bila tidak ada, bentuk berkonjugasi */
function gjOcc(t,pc){const o=[];
 if(pc.rx){const re=new RegExp(pc.rx,'g');let m;while((m=re.exec(t))){if(!m[0].length){re.lastIndex++;continue}const g1=m[1]!=null?m[1]:m[0];o.push({s:m.index+m[0].length-g1.length,e:m.index+m[0].length,x:1,b:0});re.lastIndex=m.index+Math.max(1,m[0].length-g1.length)}return o}
 let i=-1;while((i=t.indexOf(pc.t,i+1))>=0)o.push({s:i,e:i+pc.t.length,x:1});
 if(!o.length&&pc.cj){const re=new RegExp(pc.cj,'g');let m;while((m=re.exec(t))){if(!m[0].length){re.lastIndex++;continue}o.push({s:m.index,e:m.index+m[0].length,x:0})}}
 return o}
function gjCtx(t,o,C,pc){let b=0;const p=t[o.s-1],n=t[o.e];
 if(pc.t&&pc.t.length==1&&gjHira(pc.t)){if(C.nn)b+=p&&!gjHira(p)?6:-4;if(C.en&&(!n||/[。！？!?…、」]/.test(n)))b+=8}
 return b}
/* satu bentuk (urutan potongan): pilih ≤2 bagian yang dikosongkan, berurutan dan tidak tumpang tindih */
function gjForm(f,t,C){const oc=f.map(pc=>gjOcc(t,pc).map(o=>({...o,b:(o.b||0)+gjCtx(t,o,C,pc)})));if(!oc.some(a=>a.length))return null;
 const n=f.length,same=f.map(pc=>f.filter(q=>q.t==pc.t).length),ps=(i,o)=>Math.min((f[i].t||'').length,4)*3+o.b+(o.x?4:-2)-Math.max(0,oc[i].length-same[i])*6-o.s*.01;
 let best=null;const put=(bx,sc,k)=>{sc+=(k==n?30:n>2&&k==2?10:0);if(!best||sc>best.sc)best={bx,sc,full:k==n}};
 for(let i=0;i<n;i++)oc[i].forEach(a=>{put([[a.s,a.e]],ps(i,a),1);for(let j=i+1;j<n;j++)oc[j].forEach(b=>{if(b.s>=a.e)put([[a.s,a.e],[b.s,b.e]],ps(i,a)+ps(j,b)-Math.min(b.s-a.e,12)*.3,2)})});
 return best}
function gjSel(g,t){const C=gjCard(g),run=(fs,src)=>{let b=null;fs.forEach(f=>{const r=gjForm(f,t,C);if(r&&(!b||r.sc>b.sc))b=r});if(b)b.src=src;return b};
 return run(C.f1,'f1')||(C.f2.length&&run(C.f2,'f2'))||null}
const gjIc=new Map(),gjLen=s=>[...s].length;
function gjInfo(g){let r=gjIc.get(g[0]);if(r)return r;let bs=-1e9,bi=null,bsel=null,sh=null,ss=-1e9;
 (g[7]||[]).forEach((e,i)=>{const a=gzLn(e),s=String(a[0]||'').trim(),L=gjLen(s),b=-Math.abs(L-16)*.5-(L<6?15:0)+(/[。！？!?]$/.test(s)?3:0)+(a.length>=2?10:0);
  if(b>ss){ss=b;sh=i}const sel=gjSel(g,s);if(!sel)return;const sc=sel.sc+b+(sel.full?0:-15);if(sc>bs){bs=sc;bi=i;bsel=sel}});
 r={i:bi,sel:bsel,show:sh,why:bi!=null?(bsel.full?'auto':'sebagian'):(gjCard(g).any?'nomatch':'nolex')};gjIc.set(g[0],r);return r}
/* cadangan: pola dengan bagian Jepangnya dikosongkan (K.Benda + ＿＿＿), dipakai bila tidak ada contoh yang memuat bentuk grammar-nya */
function gjPatBlank(g){const C=gjCard(g),p=String(g[6]||'');if(!C.any)return'';const ks=[...new Set(C.f1.concat(C.f2).flat().map(x=>x.t).filter(t=>!GJ.cx[t]&&t.length<=8))].sort((a,b)=>b.length-a.length);let used=false,o='',l=0,m;const re=new RegExp(GJ.jp.source,'g');
 while((m=re.exec(p))){o+=esc(p.slice(l,m.index));l=m.index+m[0].length;if(ks.some(k=>m[0].includes(k)||k.includes(m[0]))){used=true;o+=`<span class=gzb style="--n:${[...m[0]].length}">&nbsp;</span>`}else o+=esc(m[0])}
 return used?o+esc(p.slice(l)):''}
function gzjFront(g){const m=S.o.gz||'cloze',p=gjInfo(g),fn=`<div class=gzq><span class=gl>${esc(g[11]||'Fungsi')}</span>${esc(g[5])}</div>`;
 if(m=='cloze'&&p.i!=null){const a=gzLn(g[7][p.i]),s=String(a[0]).trim(),tr=gzTr(a);
  return fn+`<div class="gzc gzja">${gzeSeg(s,p.sel.bx,(w,n)=>`<span class=gzb style="--n:${n}">&nbsp;</span>`)}</div>`+(tr?`<div class=gzm>${esc(tr)}</div>`:'')+`<div class=fchint><small>Isi bagian yang hilang &amp; ingat rumus polanya</small></div>`}
 let ex='';if(m!='fn'){const pb=p.i==null?gjPatBlank(g):'';if(pb)ex=`<div class="gzc gzja gzpb">${pb}</div>`;
  if(p.show!=null){const a=gzLn(g[7][p.show]),tr=gzTr(a);if(!pb||gjLen(String(a[0]))>=8)ex+=`<div class="gzc gzja${pb?' gzsm':''}">${esc(String(a[0]).trim())}</div>`+(tr?`<div class=gzm>${esc(tr)}</div>`:'')}}
 return fn+ex+`<div class=fchint><small>Ingat: ${m=='fn'?'nama pola &amp; rumusnya':'pola &amp; rumusnya'}</small></div>`}
/* rumus pola: setiap bagian Jepang ditandai, placeholder (K.Benda, V-kamus, [A] …) tidak */
function gjPatHtml(p){p=String(p||'');let o='',l=0,m;const re=new RegExp(GJ.jp.source,'g');while((m=re.exec(p))){o+=esc(p.slice(l,m.index))+`<mark class=gzh>${esc(m[0])}</mark>`;l=m.index+m[0].length}return o+esc(p.slice(l))}
function gzjBack(g,k){const p=gjInfo(g);let h=`<div class=gzt1>${esc(g[4])}</div><hr>`;
 if(g[6])h+=`<div class=gzp>${gjPatHtml(g[6])}</div>`;
 h+=`<div class=gzf>${esc(g[5])}</div>`;
 const ord=(g[7]||[]).map((e,i)=>i),f=p.i!=null?p.i:p.show;if(f!=null){ord.splice(f,1);ord.unshift(f)}
 h+=ord.map(i=>{const a=gzLn(g[7][i]),s=String(a[0]).trim(),sel=i==p.i?p.sel:gjSel(g,s),tr=gzTr(a);
  return`<div class="gex gzx"><div class=g1>${gzeSeg(s,sel?sel.bx:[],w=>`<mark class=gzh>${esc(w)}</mark>`)}${spk(s,'ja')}</div>${tr?`<div class=g2>${esc(tr)}</div>`:''}</div>`}).join('');
 const n1=(g[8]||[]).length,n2=(g[9]||[]).length,num=(a,n,c)=>a.map((x,i)=>`<div class="${c}"><span class=gl>${n}${a.length>1?' '+(i+1):''}</span>${esc(x)}</div>`).join('');
 if(n1+n2)h+=`<details class=gzd><summary>${n1?esc(g[12]||'Keterangan'):''}${n1&&n2?' &amp; ':''}${n2?'kasus khusus':''} (${n1+n2})</summary>${num(g[8]||[],g[12]||'Keterangan','gnt')}${num(g[9]||[],'Kasus khusus','gnt gkk')}</details>`;
 return`<div style="text-align:left">`+h+gmExBlock(k)+`</div>`}
/* ===== v7.15: grammar Jerman (A1–C1) pada kartu rumpang. Kata kunci per jenis kartu: Preposisi → kolom Preposisi, konjungsi/W-Frage/zu → judul, kala (Perfekt, Passiv, Konjunktiv II …) → aturan per sub-bab, deklinasi → sel tabel; tabel tanpa kalimat → soal sel tabel. en/zh/ja tidak disentuh ===== */
const GD={
 irr:'sein bin bist ist sind seid war warst waren wart gewesen|haben habe hast hat habt hatte hattest hatten hattet gehabt|werden werde wirst wird werdet wurde wurdest wurden wurdet geworden|können kann kannst könnt konnte konntest konnten konntet|müssen muss musst müsst musste musstest mussten musstet|dürfen darf darfst dürft durfte durftest durften durftet|sollen soll sollst sollt sollte solltest sollten solltet|wollen will willst wollt wollte wolltest wollten wolltet|mögen mag magst mögt mochte mochtest mochten mochtet|wissen weiß weißt wisst wusste wusstest wussten wusstet',
 con:{im:'in dem',am:'an dem',zum:'zu dem',zur:'zu der',vom:'von dem',beim:'bei dem',ins:'in das',ans:'an das',aufs:'auf das',fürs:'für das',ums:'um das',durchs:'durch das',hinterm:'hinter dem',überm:'über dem',unterm:'unter dem',vorm:'vor dem',übers:'über das',unters:'unter das',vors:'vor das',hinters:'hinter das'},
 gen:new Set('der die das den dem des ein eine einen einem einer eines in an auf zu mit von bei aus nach um für am im zum zur vom und ist es ich du er sie wir ihr nicht ja wie was wo'.split(' ')),
 det:new Set('der die das den dem des ein eine einen einem einer eines mein meine meinen meinem meiner meines dein deine sein seine ihr ihre unser euer dieser diese dieses diesen diesem jeder alle kein keine keinen keinem keiner'.split(' ')),
 de:new Set('ich du er sie es wir ihr der die das den dem des ein eine einen einem einer eines ist sind bin bist war waren hat habe haben hatte nicht kein keine keinen und oder aber denn mit von zu in an auf für bei aus nach um über unter vor durch gegen ohne wie was wo wer wann wohin woher warum wird werden wurde kann können muss will soll mein meine meinen meinem meiner dein dir dich mich mir uns euch ihm ihn ihnen ihre sein seine hier heute gestern morgen sehr auch noch schon nur dass weil wenn als ob ja nein doch bitte gern gut'.split(' ')),
 id:new Set('saya aku kamu anda dia kami kita mereka yang itu ini dan di ke dari untuk dengan adalah tidak bukan akan sudah sedang bisa mandi dalam kopi pergi sini rumah buku kepada oleh karena atau jika ketika tetapi tapi juga sangat harus boleh punya ada apa siapa kapan mana berapa bagaimana'.split(' ')),
 pr:{Ich:'ich',Du:'du','Er/Sie/Es/Man':'er/sie/es',Wir:'wir',Ihr:'ihr','sie/Sie':'sie/Sie'},
 prep:new Set('mit von für an auf in zu bei aus nach über unter um durch gegen ohne vor hinter neben zwischen'.split(' ')),
 rel:new Set('der die das den dem denen dessen deren'.split(' '))};
const gdRev={};GD.irr.split('|').forEach(r=>{const f=r.split(' ');f.forEach(w=>gdRev[w]=f[0])});
const gdW=t=>String(t||'').match(/[\p{L}ß]+(?:-[\p{L}ß]+)*/gu)||[];
const gdH=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
/* kalimat → unit kata; c = bentuk yang dianggap sama (kontraksi im → in; bentuk tak beraturan → infinitif). cons=false: kontraksi tidak dipecah (kartu non-preposisi) */
function gdU(t,cons){t=String(t||'');const u=[],re=/[\p{L}ß]+(?:-[\p{L}ß]+)*/gu;let m;while((m=re.exec(t))){const l=m[0].toLowerCase(),c=new Set([l]);if(cons&&GD.con[l])c.add(GD.con[l].split(' ')[0]);if(gdRev[l])c.add(gdRev[l]);u.push({s:m.index,e:m.index+m[0].length,l,c})}return u}
/* apakah teks kalimat Jerman? skor kata fungsi Jerman vs Indonesia; rusak = ada kata Indonesia / huruf tunggal yang terselip (mis. "euch tidak", "Kinder n") */
function gdIs(t){const w=gdW(t).map(x=>x.toLowerCase());let d=0,i=0;w.forEach(x=>{if(GD.de.has(x))d++;if(GD.id.has(x))i++});return{de:d,id:i,n:w.length}}
const gdSingle=t=>gdW(t).some(x=>x.length==1&&/[a-zß]/.test(x)&&!/^[aA]$/.test(x))||/[a-zäöüß]\s[a-zäöüß]\s[a-zäöüß]/.test(String(t));
const gdTr=s=>{s=String(s||'').trim();const q=s.match(/^[（(]([\s\S]*)[)）]\.?$/);return q&&!/[(（]/.test(q[1])?q[1].trim():s};
function gdPair(a,b){const x=String(a).split(/\s+\/\s+/),y=String(b||'').split(/\s+\/\s+/);return x.length>1&&x.length==y.length?x.map((s,i)=>[s,y[i]]):[[a,b||'']]}
/* kalimat contoh dari dua tempat: g[7] dan sel kv. Mengembalikan [{s,tr,notes,wrong,dirty,src,row,trRow}] */
function gdSents(g){const o=[],kv=g[10]||[];
 (g[7]||[]).forEach((e,i)=>{const a=gzLn(e),s0=String(a[0]||'').trim();let tr='',notes=[];for(let j=1;j<a.length;j++){const l=String(a[j]).trim();if(!l)continue;if(!tr&&j==1&&!GEN_NOTE.test(l))tr=l;else notes.push(l)}
  const wrong=/^✖/.test(s0)||notes.some(n=>/^salah(?!\s+satu)/i.test(n)),nm=s0.match(/^(.+?[.!?…"”])\s*\(([^()]{6,})\)\.?\s*$/);if(nm&&!tr)gdPair(nm[1],'').forEach(([s])=>o.push({s:s.trim(),tr:'',notes:notes.concat(nm[2]),wrong,src:'c',i}));else gdPair(s0,tr).forEach(([s,t])=>o.push({s:s.trim(),tr:gdTr(t),notes,wrong,src:'c',i}))});
 const used=new Set();
 kv.forEach((r,i)=>{if(used.has(i))return;const v=String(r[1]||'').trim();if(!v||v.length<8||/^[\[(]/.test(v)||/\[/.test(v))return;const k=gdIs(v);if(!(k.de>=2&&k.de>=k.id)||k.n<3)return;if(!/[.!?…"”]$/.test(v.replace(/\s*\([^()]*(?:\([^()]*\)[^()]*)*\)\.?\s*$/,'')))return;
  if(/^(Arti|Kosa|Contoh Kata)/i.test(r[0])&&!/Kalimat|Struktur/i.test(r[0]))return;
  let s=v,tr='';const m=v.match(/^(.+?[.!?…"”])\s*\(([^()]+(?:\([^()]*\)[^()]*)*)\)\.?\s*$/);if(m){s=m[1];tr=m[2]}else{const nx=kv[i+1];if(nx){const nv=String(nx[1]||'').trim();if(/^Arti/i.test(nx[0])||/^\(.+\)\.?$/.test(nv)){tr=gdTr(nv);used.add(i+1)}}}
  used.add(i);gdPair(s,tr).forEach(([a,b])=>o.push({s:a.trim(),tr:gdTr(b),notes:[],wrong:false,src:'k',row:i}))});
 o.forEach(x=>{const k=gdIs(x.s);x.dirty=gdSingle(x.s)||k.id>0||/\(/.test(x.s)||x.s.length<4;x.used=used});return o}
/* teks pada kalimat yang bukan kalimat Jerman utuh → tidak dipakai */
const gdSpec={};
const gdAl=v=>String(v||'').replace(/\$[^$]*\$/g,' ').replace(/\([^)]*\)/g,' ').split(/\s+\/\s+|\s*,\s*|\s+atau\s+/).map(x=>gdW(x).map(y=>y.toLowerCase())).filter(x=>x.length&&x.length<=3);
const gdPA=v=>{v=String(v||'').replace(/\$[^$]*\$/g,' ');if(/\.\.\./.test(v)){const p=v.split(/\s*\.\.\.\s*/);return{t:'p',a:[gdAl(p[0]),gdAl(p[1])]}}const a=gdAl(v);return a.length?{t:'w',a}:null};
const SPECIAL={'jawaban positif':{t:'w',a:[['ja']]},'jawaban negatif':{t:'w',a:[['nein']]},'respon khusus: doch':{t:'w',a:[['doch']]},'struktur terbalik (variasi)':{t:'w',a:[['weil'],['wenn']]},'kalimat pernyataan biasa':{t:'pos',n:2},'kalimat pernyataan (variasi keterangan)':{t:'pos',n:2},'pertanyaan umum (konfirmasi)':{t:'pos',n:1},'pengecualian kata kerja terpisah':{t:'w',a:[['zu']]},'konstruksi kata kerja / sifat':{t:'w',a:[['zu']]},'konstruksi kata sifat / kata benda':{t:'w',a:[['zu']]}};
const SUBR=[[/Kalimat Relatif/,{t:'rel'}],[/Agen Pelaku/,{t:'rx',re:/^(von|vom|durch)$/}],[/Präteritum Passiv/,{t:'rx',re:/^wurd(e|est|en|et)$/}],[/Präsens Passiv/,{t:'rx',re:/^(wird|werden|werde|wirst|werdet)$/}],[/Futur I/,{t:'rx',re:/^(werde|wirst|wird|werden|werdet)$/}],[/Plusquamperfekt/,{t:'rx',re:/^(hatte|hattest|hatten|hattet|war|warst|waren|wart)$/}],[/3\.2 Präteritum/,{t:'rx',re:/^(war|warst|waren|wart|hatte|hattest|hatten|hattet)$/}],[/3\.1 Perfekt/,{t:'last'}],[/Konjunktiv II/,{t:'rx',re:/^(hätt|wär|könnt|würd|sollt|müsst|dürft)(e|est|en|et)?$/}]];
const gdTK=g=>{const t=String(g[4]||'').replace(/#\d+$/,'').replace(/\([^)]*\)/g,' ').trim();if(!t)return null;const ws=gdW(t);if(!ws.length||ws.some(w=>GD.id.has(w.toLowerCase())))return null;if(!/^[a-zäöüß]/.test(t)&&!/^(Wo|Wer|Was|Wie|Wann|Woher|Wohin|Warum|Wieso|Welche|Welcher)/.test(t))return null;return gdPA(t)};
const gdList=g=>{const r=(g[10]||[])[0];if(!r)return null;const v=String(r[1]||'');if(!/^[\p{L}ß]+(?:\s*,\s*[\p{L}ß/]+){2,}$/u.test(v))return null;const a=v.split(/\s*,\s*/).map(x=>x.split('/')[0].toLowerCase());return{t:'w',a:a.map(x=>[x])}};
/* kata kunci yang dicari pada kalimat */
function gdSpecOf(g){let r=gdSpec[g[0]];if(r!==undefined)return r;const kv=g[10]||[],sub=String(g[3]||''),tt=String(g[4]||'').replace(/#\d+$/,'').trim().toLowerCase();let sp=null,kind='aturan';
 if(sub=='Preposisi'){sp=gdPA(kv[0]&&kv[0][1]);kind='prep';if(sp)sp.cons=1}
 else if(SPECIAL[tt])sp=SPECIAL[tt];
 else{for(const[re,s]of SUBR)if(re.test(sub)){sp=s;break}
  if(!sp&&/Preposisi Khusus|Wechsel/.test(sub))sp=gdList(g);
  if(!sp&&/Koordinatif|Subordinatif|W-Frage|Klausa Tujuan|Infinitiv dengan|Preposisi Khusus/.test(sub))sp=gdTK(g);
  if(!sp){const b=kv.filter(x=>/^Bentuk /.test(x[0]));if(b.length>=2){const a=gdAl(b[b.length-1][1].replace(/\(\+n\)/,''));if(a.length)sp={t:'w',a}}}
  if(!sp){const ar=kv.filter(x=>/^(Artikel Pasti|Artikel Tidak Pasti|Kepemilikan)/.test(x[0]));if(ar.length>=2){const a=ar.flatMap(x=>gdAl(x[1]));if(a.length)sp={t:'w',a}}}
  if(!sp){const p=kv.find(x=>/^Posisi Kata Kerja/.test(x[0]));if(p&&/Posisi 2/.test(p[1]))sp={t:'pos',n:2};else if(p&&/Posisi 1/.test(p[1]))sp={t:'pos',n:1}}}
 return gdSpec[g[0]]={sp,kind:gdKind(g,kind)}}
const gdForm=v=>/^[\p{L}ß]+(?: \.\.\. [\p{L}ß]+| (?:mich|dich|sich|uns|euch|mir|dir))?$/u.test(String(v||'').trim());
function gdKind(g,k){if(k=='prep')return k;const kv=g[10]||[],sub=String(g[3]||''),L=kv.map(r=>r[0]);
 if(L.filter(l=>GD.pr[l]&&gdForm(kv[L.indexOf(l)][1])).length>=3)return'konjugasi';
 if(/Perfekt|Präteritum|Plusquamperfekt|Futur|Passiv|Konjunktiv II|Agen Pelaku/.test(sub))return'kala';
 if(kv.some(r=>/^(Maskulin|Feminin|Neutrum|Plural|Bentuk |Artikel Pasti|Artikel Tidak Pasti|Kepemilikan)/.test(r[0])))return'deklinasi';
 if(/Koordinatif|Subordinatif|W-Frage|Ja\/Nein|Urutan Kata|Kalimat Relatif|Infinitiv|Klausa|Tambahan Pelengkap/.test(sub)||kv.some(r=>/^Posisi Kata Kerja/.test(r[0])))return'konjungsi';
 return'aturan'}
/* menandai kemunculan kata kunci pada satu kalimat → {bx:[[s,e]], ph, n} atau null */
function gdOcc(t,U,ph){const o=[];for(let i=0;i+ph.length<=U.length;i++){let ok=true;for(let j=0;j<ph.length&&ok;j++){ok=U[i+j].c.has(ph[j]);if(ok&&j)ok=!/[^\s]/.test(t.slice(U[i+j-1].e,U[i+j].s))}if(ok)o.push([i,i+ph.length-1])}return o}
function gdPickOne(oc,U){let b=oc[0];for(const k of oc){const n=U[k[1]+1];if(n&&GD.det.has(n.l)){b=k;break}}return b}
function gdSel(sp,t,cons){if(!sp)return null;const U=gdU(t,cons);if(!U.length)return null;const R=(oc,ph)=>({bx:oc.map(([a,b])=>[U[a].s,U[b].e]).sort((x,y)=>x[0]-y[0]),ph});
 if(sp.t=='w'){let best=null;for(const ph of sp.a){const oc=gdOcc(t,U,ph);if(!oc.length)continue;const gen=ph.every(w=>GD.gen.has(w)),pick=gen?[gdPickOne(oc,U)]:oc,sc=(gen?0:50)+ph.length*5-pick[0][0]*.01;if(pick.length>4)continue;if(!best||sc>best.sc)best={sc,oc:pick,ph}}return best?R(best.oc,[best.ph]):null}
 if(sp.t=='p'){const f=a=>{for(const ph of a){const oc=gdOcc(t,U,ph);if(oc.length)return{oc,ph}}return null},A=f(sp.a[0]),B=f(sp.a[1]);if(!A||!B)return null;const a=A.oc[0],b=B.oc.find(x=>x[0]>a[1]);if(!b)return null;return R([a,b],[A.ph,B.ph])}
 if(sp.t=='rx'){const i=U.findIndex(u=>sp.re.test(u.l));return i<0?null:R([[i,i]],[[U[i].l]])}
 if(sp.t=='pos'){const i=sp.n-1;return U[i]?R([[i,i]],[[U[i].l]]):null}
 if(sp.t=='last'){const i=U.length-1;return U[i]&&U.length>=3?R([[i,i]],[[U[i].l]]):null}
 if(sp.t=='rel'){const c=t.indexOf(',');if(c<0)return null;let i=U.findIndex(u=>u.s>c);if(i<0)return null;if(GD.prep.has(U[i].l)&&U[i+1])i++;return GD.rel.has(U[i].l)?R([[i,i]],[[U[i].l]]):null}
 return null}
const gdWc=s=>gdW(s).length;
function gdScore(x,sel){return(x.tr?25:0)-((x.s.match(/[.!?]["”]?\s+(?=["“A-ZÄÖÜ])/g)||[]).length)*15-Math.abs(gdWc(x.s)-8)*.8+(sel.bx.length>1?6:0)+(x.src=='c'?3:0)}
/* soal berbasis tabel: kartu konjugasi, daftar kosakata (angka/hari/bulan), deklinasi/artikel/pronomen */
const gdCtx=g=>String(g[3]||'').split('›').pop().trim().replace(/^[\d.\s-]+/,'').trim();
function gdTab(g,kind){const kv=g[10]||[],h=gdH(g[0]),ti=String(g[4]||'').replace(/#\d+$/,'').trim();
 if(kind=='konjugasi'){const rows=kv.map((r,i)=>[r,i]).filter(([r])=>GD.pr[r[0]]);let ok=[];for(const[r,i]of rows){if(!gdForm(r[1]))break;ok.push([r,i])}
  const tw=new Set(gdW(ti).map(x=>x.toLowerCase())),nt=a=>a.filter(([r])=>!gdW(r[1]).every(w=>tw.has(w.toLowerCase())));ok=nt(ok.filter(([r])=>r[0]!='Ich'&&r[0]!='sie/Sie'));if(ok.length<2)ok=nt(rows.filter(([r])=>gdForm(r[1])&&r[0]!='Ich'));if(!ok.length)return null;const[r,i]=ok[h%ok.length],ar=kv.find(x=>/^Arti/.test(x[0]));
  return{t:'konj',row:i,ans:String(r[1]).trim(),head:(/^Konjugasi/i.test(ti)?'':'Konjugasi · ')+ti+(gdCtx(g)&&!/Tambahan|Pelengkap/.test(gdCtx(g))?' · '+gdCtx(g):''),hint:ar?ar[1]:'',pr:GD.pr[r[0]]}}
 const a=kv.findIndex(r=>/^Kosa Kata/.test(r[0])),b=kv.findIndex(r=>/^Arti \/ Angka/.test(r[0]));
 if(a>=0&&b>=0){const x=String(kv[a][1]).split(/\s*,\s*/),y=String(kv[b][1]).split(/\s*,\s*/);if(x.length>=3&&x.length==y.length){const j=h%x.length;return{t:'list',row:a,ans:x[j],q:y[j],head:ti,idx:j}}}
 const bf=kv.map((r,i)=>[r,i]).filter(([r])=>/^Bentuk /.test(r[0]));
 if(bf.length>=2&&![bf[0],bf[bf.length-1]].some(x=>/[,.!?]/.test(String(x[0][1])))){const[f,l]=[bf[0],bf[bf.length-1]],sh=r=>r[0].replace(/^Bentuk\s+/,'').replace(/\s*\(.*$/,'');return{t:'bentuk',row:l[1],ans:String(l[0][1]).trim(),head:ti+' · '+sh(l[0]),line:String(f[0][1]).trim(),from:sh(f[0]),to:sh(l[0])}}
 const cr=kv.map((r,i)=>[r,i]).filter(([r])=>/^(Maskulin|Feminin|Neutrum|Plural|Artikel Pasti|Artikel Tidak Pasti|Negasi|Kepemilikan|Orang)/.test(r[0])&&/[\p{L}]/u.test(String(r[1]||'').replace(/\(.*?\)/g,''))&&!/^(Contoh|Arti(?!kel))/.test(r[0])&&String(r[1]).length<40);
 if(cr.length>=2&&ti.toLowerCase()!='catatan'){const[r,i]=cr[h%cr.length];const art=/^(Artikel|Negasi|Kepemilikan)/.test(r[0]);return{t:'sel',row:i,ans:String(r[1]).trim(),head:(gdCtx(g)&&!art?gdCtx(g)+' · ':art?gdCtx(g)+' · ':'')+ti,lab:(a=>{const w=gdW(String(r[1])).map(x=>x.toLowerCase()),l=r[0].replace(/\s*\(([^)]*)\)\s*$/,(m,x)=>gdW(x).some(y=>w.includes(y.toLowerCase()))?'':m);return l})()}}
 return null}
const gdIc=new Map();
function gdInfo(g){let r=gdIc.get(g[0]);if(r)return r;const{sp,kind}=gdSpecOf(g),ss=gdSents(g);let bi=null,bsel=null,bs=-1e9,hasKeyNoMatch=false;
 ss.forEach((x,i)=>{if(x.wrong||x.dirty)return;const sel=gdSel(sp,x.s,sp&&sp.cons||kind=='prep');if(!sel)return;const sc=gdScore(x,sel);if(sc>bs){bs=sc;bi=i;bsel=sel}});
 let sh=null,hs=-1e9;ss.forEach((x,i)=>{if(x.wrong||x.dirty)return;const sc=(x.tr?25:0)-Math.abs(gdWc(x.s)-8)*.8;if(sc>hs){hs=sc;sh=i}});
 const tab=bi==null?gdTab(g,kind):null;
 r={kind,sp,ss,i:bi,sel:bsel,show:sh,tab,why:bi!=null?'rumpang':tab?'tabel':!ss.length?'tanpa-kalimat':!sp?(ss.some(x=>!x.dirty&&!x.wrong)?'tanpa-kunci':'tanpa-kunci'):ss.every(x=>x.dirty||x.wrong)?'kalimat-rusak':'kunci-tak-cocok'};
 return gdIc.set(g[0],r),r}
const GDAB=/^(mis|dll|dst|dsb|spt|cth|no|vs|dr|yg|dgn|tsb|ex)$/;
/* kata jawaban untuk menyamarkan fungsi pendek */
function gdAns(p){const s=new Set();if(p.sel)p.sel.ph.forEach(ph=>ph.forEach(w=>s.add(w)));if(p.tab)gdW(p.tab.ans).forEach(w=>{if(w.length>=2)s.add(w.toLowerCase())});return s}
function gdFn(g,p){let t=String(g[5]||'').replace(/\s+/g,' ').trim(),re=/[.!?](?=\s+["'(A-ZÄÖÜ0-9])/g,m,cut=t.length;
 while((m=re.exec(t))){const w=(t.slice(0,m.index).match(/(\S+)$/)||[''])[1].toLowerCase();if(GDAB.test(w))continue;cut=m.index;break}
 t=t.slice(0,cut).replace(/[.\s]+$/,'');if(t.length>90){const c=t.slice(0,91).replace(/\s+\S*$/,'');t=(c||t.slice(0,90))+'…'}
 const A=gdAns(p);if(!A.size)return esc(t);const U=gdU(t,true),bx=[];U.forEach(u=>{if([...u.c].some(w=>A.has(w))||A.has(u.l))bx.push([u.s,u.e])});
 let o='',l=0;for(const[a,b]of bx){if(a<l)continue;o+=esc(t.slice(l,a))+`<span class="gzb gze gzs" style="--n:${b-a}">&nbsp;</span>`;l=b}return o+esc(t.slice(l))}
const gdSeg=(t,bx,f)=>{let o='',l=0;for(const[a,b]of bx){o+=esc(t.slice(l,a))+f(t.slice(a,b),b-a);l=b}return o+esc(t.slice(l))};
const gdBox=n=>`<span class="gzb gze" style="--n:${n}">&nbsp;</span>`;
const gdFnLab=g=>String(g[5]||'').trim()?`<div class="gzq${String(g[5]||'').length>60?' gzl':''}"><span class=gl>${esc(g[11]||'Fungsi')}</span>`:'';
function gzdFront(g){const m=S.o.gz||'cloze',p=gdInfo(g),fh=gdFn(g,p),ctx=String(g[3]||'').split('›').pop().trim().replace(/^[\d.\s-]+/,''),fn=String(g[5]||'').trim()?`<div class="gzq${String(g[5]||'').length>60?' gzl':''}"><span class=gl>${esc(g[11]||'Fungsi')}</span>${fh}</div>`:(g[3]!='Preposisi'?`<div class="gzq gzl"><span class=gl>Topik</span>${esc(ctx)}</div>`:'');
 if(m=='cloze'&&p.i!=null){const x=p.ss[p.i];return fn+`<div class="gzc gzen gzde">${gdSeg(x.s,p.sel.bx,(w,n)=>gdBox(n))}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')+`<div class=fchint><small>Isi bagian yang hilang &amp; ingat rumus polanya</small></div>`}
 if(m=='cloze'&&p.tab){const q=p.tab,n=[...q.ans.replace(/\s/g,'')].length;let body;
  if(q.t=='konj')body=`<div class="gzc gzen gzde">${q.pr} ${gdBox(n)}</div>`+(q.hint?`<div class=gzm>${esc(q.hint)}</div>`:'');
  else if(q.t=='list')body=`<div class="gzc gzen gzde">${esc(q.q)} → ${gdBox(n)}</div>`;
  else if(q.t=='bentuk')body=`<div class="gzc gzen gzde">${esc(q.line)} <small>(${esc(q.from)})</small> → ${gdBox(n)}</div>`;
  else body=`<div class="gzc gzen gzde">${esc(q.lab)} → ${gdBox(n)}</div>`;
  return fn+`<div class="gzm gzhd">${esc(q.head)}</div>`+body+`<div class=fchint><small>Isi sel tabel yang hilang &amp; ingat rumusnya</small></div>`}
 let ex='';if(m!='fn'&&p.show!=null){const x=p.ss[p.show];ex=`<div class="gzc gzen gzde">${esc(x.s)}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')}
 return fn+ex+`<div class=fchint><small>Ingat: ${m=='fn'?'nama pola &amp; rumusnya':'pola &amp; rumusnya'}</small></div>`}
function gzdBack(g,k){const p=gdInfo(g);let h=`<div class=gzt1>${esc(g[4])}</div><hr>`;const kv=g[10]||[],skip=new Set();
 p.ss.forEach(x=>{if(x.src=='k')skip.add(x.row)});if(p.ss.some(x=>x.src=='k'))p.ss[0]&&p.ss[0].used&&p.ss[0].used.forEach(i=>skip.add(i));
 const ans=new Set(),sel=p.sel?p.sel:null;
 if(g[3]=='Preposisi'&&kv.length>=2){const ph=p.sp&&p.sp.t!='p'?p.sp:null,a=String(kv[0][1]).replace(/\$[^$]*\$/g,'').trim();h+=`<div class=gzp><mark class=gzh>${esc(a)}</mark> + ${esc(kv[1][1])}</div>`+(kv[2]?`<div class=gzf style="margin-top:-2px">= ${esc(kv[2][1])}</div>`:'')}
 else{const rows=kv.map((r,i)=>[r,i]).filter(([r,i])=>!skip.has(i)&&String(r[1]||'').trim());
  if(rows.length){const mk=(v,i)=>{let hl=false;if(p.tab&&p.tab.row==i)hl=true;return hl?`<mark class=gzh>${esc(v)}</mark>`:esc(v)};
   const R=rows.map(([r,i])=>`<div class=gzr><span class=gl>${esc(r[0])}</span><span>${mk(String(r[1]),i)}</span></div>`);
   h+=rows.length>8?`<div class=gzk>${R.slice(0,4).join('')}</div><details class=gzd><summary>Tabel lengkap (${rows.length})</summary><div class=gzk>${R.join('')}</div></details>`:`<div class=gzk>${R.join('')}</div>`}}
 h+=`<div class=gzf>${esc(g[5])}</div>`;
 const ord=p.ss.map((x,i)=>i),f=p.i!=null?p.i:p.show;if(f!=null){ord.splice(ord.indexOf(f),1);ord.unshift(f)}
 h+=ord.map(i=>{const x=p.ss[i],sl=x.wrong||x.dirty?null:i==p.i?p.sel:gdSel(p.sp,x.s,p.sp&&p.sp.cons||p.kind=='prep'),bx=sl?sl.bx:[];
  const cn=[];if(bx.length)bx.forEach(([a,b])=>{const w=x.s.slice(a,b).toLowerCase();if(GD.con[w])cn.push(`${w} = ${GD.con[w]}`)});
  return`<div class="gex gzx${x.wrong||x.dirty?' gzw':''}"><div class=g1>${gdSeg(x.s,bx,w=>`<mark class=gzh>${esc(w)}</mark>`)}${x.wrong||x.dirty?'':spk(x.s,'de')}</div>${x.tr?`<div class=g2>${esc(x.tr)}</div>`:''}${cn.map(n=>`<div class="g2 gzn">${esc(n)}</div>`).join('')}${(x.notes||[]).map(n=>`<div class="g2 gzn">${esc(n)}</div>`).join('')}</div>`}).join('');
 return`<div style="text-align:left">`+h+gmExBlock(k)+`</div>`}
/* ===== v7.16: grammar Belanda (A1–C2) pada kartu rumpang. Kata kunci per jenis kartu: judul (preposisi, konjungsi, partikel, er, …), kata kerja + preposisi (hanya preposisinya), kala (Perfectum, Imperfectum, Pasif, …) → aturan per sub-bab, posisi kata kerja; kata kerja kuat/konjugasi, pronomen, komparatif, daftar kata → soal sel tabel. Kartu ejaan/pelafalan → cadangan. zh/en/ja/de tidak disentuh ===== */
const GN={
 irr:'zijn ben bent is was waren geweest|hebben heb hebt heeft had hadden gehad|gaan ga gaat ging gingen gegaan|kunnen kan kunt kon konden gekund|willen wil wilt wilde wilden wou wouden gewild|zullen zal zult zou zouden|mogen mag mocht mochten gemogen|moeten moet moest moesten gemoeten|doen doe doet deed deden gedaan|komen kom komt kwam kwamen gekomen|zien zie ziet zag zagen gezien|worden word wordt werd werden geworden|weten weet weetje wist wisten geweten|staan sta staat stond stonden gestaan|slaan sla slaat sloeg sloegen geslagen|laten laat laten liet lieten gelaten|brengen breng brengt bracht brachten gebracht|denken denk denkt dacht dachten gedacht|houden houd houdt hield hielden gehouden|krijgen krijg krijgt kreeg kregen gekregen|blijven blijf blijft bleef bleven gebleven|nemen neem neemt nam namen genomen|geven geef geeft gaf gaven gegeven|vinden vind vindt vond vonden gevonden|spreken spreek spreekt sprak spraken gesproken|schrijven schrijf schrijft schreef schreven geschreven|lezen lees leest las lazen gelezen|eten eet at aten gegeten|drinken drink drinkt dronk dronken gedronken|kopen koop koopt kocht kochten gekocht|zitten zit zit zat zaten gezeten|liggen lig ligt lag lagen gelegen|lopen loop loopt liep liepen gelopen|rijden rijd rijdt reed reden gereden|beginnen begin begint begon begonnen|zoeken zoek zoekt zocht zochten gezocht|brengen|snijden snij snijdt sneed sneden gesneden',
 cl:{je:['jij'],jij:['je'],we:['wij'],wij:['we'],ze:['zij'],zij:['ze'],me:['mij'],mij:['me'],"'t":['het'],het:["'t"],"'n":['een'],een:["'n"],"d'r":['haar'],"'k":['ik'],ik:["'k"],"'m":['hem'],hem:["'m"],"'r":['haar']},
 gen:new Set('de het een in op te van met om aan er is dat die en of ik je jij we wij ze zij hij u dit dus ook niet geen maar als dan nu zo wel al nog toch heel mijn jouw zijn haar ons onze hun naar bij voor uit door'.split(' ')),
 de:new Set('ik jij je hij zij ze het de een en of maar dat die dit deze is zijn ben bent was waren heb hebt heeft had hebben niet geen wij we jullie u mijn jouw zijn haar ons hun met van voor naar bij op in aan uit door om over na tot als dan nu hier daar er wat wie waar hoe waarom wanneer kan kunt willen wil moet moeten zal zou mag ook nog wel al toch gaan ga gaat naar thuis veel heel te omdat want dus mij jou hem hen'.split(' ')),
 id:new Set('saya aku kamu anda dia kami kita mereka yang itu ini di ke dari untuk dengan adalah tidak bukan akan sudah sedang bisa dalam pergi sini rumah buku kepada oleh karena atau jika ketika tetapi tapi juga sangat harus boleh punya ada apa siapa kapan mana berapa bagaimana tinggal bekerja membaca pada sebuah seorang kemarin besok hari lebih ya baiklah bagus cukup sulit sebenarnya menyenangkan menurut meskipun sakit rencana setuju sama cuacanya tugasnya dibebaskan langkah diterapkan pemerintah memerangi pengangguran bagaimanapun sulitnya mencoba melakukannya melihatnya indah'.split(' ')),
 det:new Set('de het een zijn haar mijn jouw ons onze hun dit dat deze die'.split(' ')),
 ph:new Set('infinitief infinitif participle voltooid deelwoord jumlah agen pelaku prep preposisi adjektif subjek objek kata benda kerja sifat modal'.split(' ')),
 vb:/Kata Kerja|Reflexif|Scheidbare|Pasif|Passief|Masa Depan|Modal|Perfectum|Imperfectum|Progresif|Pengandaian|Hulpwerkwoord|Verba|Verb|Awalan|Idiom|Ungkapan Tetap|Peribahasa/,
 pr:{'Ik':'ik','Jij / U':'jij / u','Hij / Zij / Het':'hij / zij / het','Wij':'wij','Jullie':'jullie','Zij':'zij'},
 pre:new Set('in op naar uit van met zonder bij voor om aan over tegen door achter naast tussen boven onder na tot vanaf sinds tijdens'.split(' ')),
 conj:new Set('omdat dat als wanneer toen hoewel terwijl zodat voordat nadat tenzij indien opdat doordat ofschoon alhoewel zodra totdat sinds naarmate'.split(' ')),
 stop:new Set('de het een in op te van met om aan er is dat die en of ik je jij we wij ze zij hij u dit dus ook niet geen maar als dan nu zo wel al nog toch heel mijn jouw zijn haar ons onze hun naar bij voor uit door heen weg me mij jou hem hen zich moet moeten kan kunnen zal zullen wil willen mag mogen wordt worden heeft hebben ben bent was waren gaan gaat ga komt kom'.split(' ')),
 refl:new Set('me je u zich ons jou mij jij hem haar ze zij we wij jullie hij ik'.split(' ')),
 amb:[['in','op','aan'],['bij','voor','om'],['met','van','door'],['naar','tot','aan'],['over','van','om'],['uit','van','op']]};
const GNK={"A1|a b c d e f g h i j k l m n o p q r s t u v w x y z": "spel", "A1|Suku kata pertama": "eerste", "A1|jij (kamu)": "lees", "A1|De-woord (Maskulin / Feminin)": "de", "A1|Het-woord (Netral)": "het", "A1|Jamak (Meervoud)": "de", "A1|Een": "een", "A1|Gender: De-woord": "de", "A1|Gender: Het-woord": "het", "A1|Bulan & Musim": "mei", "A1|Jam": "half", "A1|Pertanyaan Waktu": "laat", "A1|Salam (Begroetingen)": "goedemorgen", "A1|Perkenalan": "heet", "A1|Sopan Santun": "alsjeblieft", "A1|Dasar Komunikasi": "kunt", "A1|Het-woord tunggal": "dit | dat", "A1|De-woord tunggal": "deze | die", "A1|Jamak (semua kata benda)": "deze | die", "A2|Awalan tanpa ge-": "begrepen", "A2|Imperfectum (Onvoltooid Verleden Tijd)": "werkte", "A2|in / op / om": "om", "A2|Tijd – Manier – Plaats": "vandaag", "A2|Tanggal": "hoeveelste", "A2|Euro & Harga": "kost", "A2|Jam formal & informal": "kwart", "A2|elke dag, één keer per week, twee keer per maand": "elke", "A2|Anak + inversi": "omdat", "B1|elk(e) / ieder(e)": "elk | elke | ieder | iedere", "B1|sommige / enkele / meerdere": "sommige | enkele | meerdere", "B1|Bezit lisan": "zijn", "B2|Voltooid deelwoord + -e": "gesloten", "B2|stam + -end(e)": "lachende", "B2|on- (tidak) / niet-": "onmogelijk", "B2|Dua atau lebih partikel": "maar even | nu eenmaal", "B2|wel sebagai lawan niet": "wél", "B2|Kategori de-woord": "de", "B2|Kategori het-woord": "het", "B2|Huruf penghubung -s- / -e(n)- / tanpa": "stationsplein", "B2|Kata ukuran tanpa jamak": "kilo", "B2|het gaat om / het komt erop aan": "om", "B2|Dengan / tanpa objek langsung": "~leggen | ~liggen", "C1|Urutan di tengah klausa": "gisteren", "C1|Elemen apa pun di posisi 1": "woont | heb", "C1|hebben/zijn + V1 + V2 (infinitif)": "horen", "C1|Frasa preposisi setelah V akhir": "op", "C1|her- = lagi; er-; ge-": "herhalen", "C1|aan-, af-, mee-, op-, uit-, in-, terug-, weg-": "aan", "C1|door-, over-, om-, onder-, voor-, achter-, na-": "door", "C1|participle kini (-end)": "lachend", "C1|Kata benda + keterangan nominal": "hoofdstad", "C1|Participle/infinitif absolut": "hebbende", "C1|Wat + subjek + ook + V (subjungtif)": "ook", "C1|Klausa relatif tambahan": "die", "C1|Klausa anak di awal": "als", "C1|Reformasi 1947 / 1954 / 1995 / 2005": "benen", "C1|ij/uij, gh, ae": "gogh", "C1|Aksen akut / trema / apostrof": "té", "C1|Kapital": "nederlands", "C1|Pembuka / penutup surat": "vriendelijke", "C1|Frasa baku isi surat": "bijgaand", "C1|Beste ... / Groetjes": "beste", "C2|u / jij-je / gij-ge": "u", "C2|u ↔ je": "u | je", "C2|goesting, schoon, kot, seffens, tof, nen/ne": "goesting", "C2|Pelafalan & grammar": "zachter", "C2|Kancelarijtaal / ambtelijk": "hierbij", "C2|Reduksi + partikel": "hè", "C2|Genitif tetap": "allen", "C2|zich bewust zijn van / zich herinneren": "bewust", "C2|worden + participle + van/uit": "ontheven", "C2|Frasa kata benda panjang": "ter", "C2|hoe ... ook / hoezeer ... ook": "hoe … ook", "C2|alhoewel / ofschoon": "ofschoon", "C2|Elipsis subjek / verba": "studeerde | zag", "C2|Topikalisasi ekstrem": "wat", "C2|ik zou zeggen / het lijkt me": "zou", "C2|ergens van uit gaan / ergens aan toe zijn": "ervan", "C2|ik → 'k; het → 't; hem → 'm; haar → 'r/d'r": "'k | 't | 'm", "C2|zo'n, 'n, d'r": "zo'n", "C2|hè / hoor / zeg / toch": "hè", "C2|zeker / best / wel / toch": "best", "C2|Nederland / Holland / België / Vlaanderen": "vlaanderen", "C2|Amsterdam / 's-Gravenhage / 's-Hertogenbosch": "haag", "C2|Titik, koma desimal, tanggal": "euro", "C2|g / ch (Utara vs Selatan)": "harder", "C2|Diftong ei/ij, ui, ou": "huis", "C2|Archaïsme pra-1947": "nederlandsche", "C2|1954 Groene Boekje; 1995; 2005; 2006 Witte Boekje": "voorkeurspelling", "C2|Ejaan kreatif media sosial": "leuk"};

const gnInv=new Map(),gnVc=new Map();let gnDW=null,gnDF=null,gnInit=0,gnBg=null;
GN.irr.split('|').forEach(r=>{const f=r.split(' ');f.slice(1).forEach(w=>{if(!gnInv.has(w))gnInv.set(w,f[0])})});
const gnW=t=>String(t||'').match(/['’]?\p{L}+(?:['’-]\p{L}+)*/gu)||[];
const gnH=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
const gnNorm=w=>String(w).toLowerCase().replace(/’/g,"'");
const gnWc=s=>gnW(s).length;
/* data-driven: bentuk tak beraturan diambil dari tabel konjugasi/imperfectum kartu itu sendiri (kv), dan korpus kata Belanda dari contoh */
function gnBoot(){if(gnInit)return;gnInit=1;gnDW=new Set();gnDF=new Map();gnBg=new Map();const add=(w,inf)=>{w=gnNorm(w);if(w.length>1&&inf&&!gnInv.has(w))gnInv.set(w,inf)};
 const G=(typeof D!='undefined'?D.G:[]).filter(g=>g[1]=='nl');
 const dict=s=>gnW(s).forEach(w=>gnDW.add(gnNorm(w)));
 G.forEach(g=>{const ti=gnNorm(String(g[4]||'').replace(/#\d+$/,'').trim()),kv=g[10]||[],one=/^[\p{L}]+$/u.test(ti);
  kv.forEach(r=>{const l=r[0],v=String(r[1]||'');
   if(GN.pr[l]||/^Imperfectum|^Voltooid|^Subjek|^Objek|^Posesif|^Komparatif|^Superlatif|^Kosakata Belanda|^Contoh \(Belanda\)|^Contoh Kalimat|^Arti \/ Contoh/.test(l)){dict(v.replace(/\([^)]*\)/g,' '));
    if(one&&/en$|^(zijn|gaan|doen|slaan|zien|staan)$/.test(ti)&&(GN.pr[l]||/^Imperfectum|^Voltooid/.test(l)))v.replace(/\([^)]*\)/g,' ').split(/\s*\/\s*/).forEach(x=>{const w=gnW(x)[0];if(w)add(w,ti)})}});
  });
 G.forEach(g=>{const seen=new Set();gnSents(g).forEach(x=>{if(x.dirty||x.wrong)return;dict(x.s);const ws=gnW(x.s).map(gnNorm);ws.forEach((w,i)=>{if(i){const b=ws[i-1]+' '+w;gnBg.set(b,(gnBg.get(b)||0)+1)}if(!seen.has(w)){seen.add(w);gnDF.set(w,(gnDF.get(w)||0)+1)}})})})}
const gnCommon=w=>GN.gen.has(w)||(gnBoot(),(gnDF.get(w)||0)>=60);
/* bentuk kata kerja: tak beraturan dari tabel + bentuk beraturan (stam, -t, -te(n), -de(n), ge-…-t/d, -end) */
function gnVF(inf){let s=gnVc.get(inf);if(s)return s;gnBoot();s=new Set([inf]);gnInv.forEach((v,f)=>{if(v==inf)s.add(f)});
 if(inf.length>=4&&/n$/.test(inf)){let st=inf.replace(/en$/,'');if(st==inf)st=inf.replace(/n$/,'');const A=new Set([st]);const m=st.match(/^(.*?)([aeiou])([^aeiouy])$/);if(m&&m[1]&&!/[aeiou]$/.test(m[1]))A.add(m[1]+m[2]+m[2]+m[3]);if(/([^aeiou])\1$/.test(st))A.add(st.slice(0,-1));
  [...A].forEach(x=>{if(/z$/.test(x))A.add(x.slice(0,-1)+'s');if(/v$/.test(x))A.add(x.slice(0,-1)+'f')});
  A.forEach(x=>{[x,x+'t',x+'te',x+'ten',x+'de',x+'den','ge'+x+'t','ge'+x+'d',x+'end',x+'ende'].forEach(y=>s.add(y))})}
 gnVc.set(inf,s);return s}
const gnPref='aan af achter bij binnen door in mee na om onder op open over rond samen terug toe uit vast voor vooruit weg thuis neer'.split(' ');
function gnForms(w,verb){w=gnNorm(w);const s=new Set([w]);(GN.cl[w]||[]).forEach(x=>s.add(x));gnBoot();if(gnInv.has(w)||[...gnInv.values()].includes(w)||(verb&&w.length>=4&&/n$/.test(w)))gnVF(gnInv.get(w)||w).forEach(x=>s.add(x));return s}
/* kalimat → unit kata; c = bentuk yang dianggap sama (klitik je ~ jij, bentuk tak beraturan → infinitif) */
function gnU(t){t=String(t||'');const u=[],re=/['’]?\p{L}+(?:['’-]\p{L}+)*/gu;let m;gnBoot();while((m=re.exec(t))){let l=gnNorm(m[0]),s=m.index;if(l[0]=="'"&&!GN.cl[l]&&l!="'s"){l=l.slice(1);s++}const c=new Set([l]);(GN.cl[l]||[]).forEach(x=>c.add(x));if(gnInv.has(l))c.add(gnInv.get(l));u.push({s,e:m.index+m[0].length,l,c})}return u}
function gnIs(t){const w=gnW(t).map(gnNorm);let d=0,i=0;w.forEach(x=>{if(GN.de.has(x))d++;if(GN.id.has(x))i++});return{de:d,id:i,n:w.length}}
const gnSingle=t=>gnW(t).some(x=>x.length==1&&/[a-z]/i.test(x)&&!/^[uU]$/.test(x))||/\b[a-z]\s[a-z]\s[a-z]\b/.test(String(t));
const gnTr=s=>{s=String(s||'').trim();const q=s.match(/^[（(]([\s\S]*)[)）]\.?$/);return q&&!/[(（]/.test(q[1])?q[1].trim():s};
const GNAB=/^(bijv|enz|o\.a|m\.b\.t|a\.u\.b|z\.o\.z|t\.o\.v|n\.a\.v|t\.a\.v|d\.w\.z|dhr|mevr|drs|mr|ir|prof|nr|blz|bv|ca|vs|dr|st|etc|tel|mis|dll|dst|dsb|cth|ex)\.?$/i;
function gnSplit(t){t=String(t||'').trim();const o=[],re=/[.!?…]+["”’']?(?=\s+["“'‘(]?[A-ZÀ-ÖØ-Þ0-9])/g;let st=0,m;while((m=re.exec(t))){const w=(t.slice(st,m.index).match(/(\S+)$/)||[''])[1];if(GNAB.test(w))continue;o.push(t.slice(st,m.index+m[0].length).trim());st=m.index+m[0].length}const r=t.slice(st).trim();if(r)o.push(r);return o}
/* "a / b" dan "x. y." → pasangan (kalimat, terjemahan); jumlah kalimat Belanda ≠ terjemahan → tanpa terjemahan (tr diberi '' dan mis=true) */
function gnPairs(a,b){b=String(b||'');const x=a.split(/\s+\/\s+/),y=b.split(/\s+\/\s+/),A=x.length>1&&x.length==y.length?x:[a],B=A.length>1?y:[b],o=[];
 A.forEach((s,i)=>{const p=gnSplit(s),q=gnSplit(B[i]||'');if(p.length==q.length)p.forEach((z,j)=>o.push([z,q[j],p.length>1?1:0]));else if(p.length==1)o.push([p[0],B[i]||'',0]);else p.forEach(z=>o.push([z,'',2]))});return o}
/* kalimat contoh dari tiga tempat: g[7], sel kv (Contoh …), dan “Contoh: …” di dalam fungsi */
const gnSC=new Map();function gnSents(g){let m=gnSC.get(g[0]);if(m)return m;m=gnSents0(g);gnSC.set(g[0],m);return m}
function gnSents0(g){const o=[],kv=g[10]||[],used=new Set();
 (g[7]||[]).forEach((e,i)=>{const a=gzLn(e),l0=String(a[0]||'').trim();let tr='',notes=[];for(let j=1;j<a.length;j++){const l=String(a[j]).trim();if(!l)continue;if(!tr&&j==1&&!GEN_NOTE.test(l))tr=l;else notes.push(l)}
  const wrong=/^✖/.test(l0)||notes.some(n=>/^salah(?!\s+satu)/i.test(n)),nm=l0.match(/^(.+?[.!?…"”])\s*\(([^()]{6,})\)\.?\s*$/);
  if(nm&&!tr)gnPairs(nm[1],'').forEach(([s,t,m])=>o.push({s:s.trim(),tr:'',notes:notes.concat(nm[2]),wrong,src:'c',i,mis:m}));else gnPairs(l0,tr).forEach(([s,t,m])=>o.push({s:s.trim(),tr:gnTr(t),notes,wrong,src:'c',i,mis:m}))});
 kv.forEach((r,i)=>{if(used.has(i))return;const v=String(r[1]||'').trim();if(!v||v.length<8||/^[\[(]/.test(v)||/\[/.test(v)||/^(Arti(?!\s*\/)|Penjelasan|Fungsi|Dipakai|Cara Baca|Kosakata)/i.test(r[0]))return;const k=gnIs(v);if(!(k.de>=2&&k.de>=k.id)||k.n<3)return;
  if(!/[.!?…"”]$/.test(v.replace(/\s*\([^()]*(?:\([^()]*\)[^()]*)*\)\.?\s*$/,'')))return;
  let s=v,tr='';const m=v.match(/^(.+?[.!?…"”])\s*\(([^()]+(?:\([^()]*\)[^()]*)*)\)\.?\s*$/);if(m){s=m[1];tr=m[2]}else{const nx=kv[i+1];if(nx){const nv=String(nx[1]||'').trim();if(/^Arti/i.test(nx[0])&&!/^Arti \(Bahasa/.test(nx[0])){tr=gnTr(nv);used.add(i+1)}}}
  used.add(i);gnPairs(s,tr).forEach(([a,b,mm])=>o.push({s:a.trim(),tr:gnTr(b),notes:[],wrong:false,src:'k',row:i,mis:mm}))});
 const fm=String(g[5]||'').match(/(?:Contoh|Mis\.?)[^:.]{0,30}:\s*(.+)$/);if(fm&&!o.length)gnSplit(fm[1]).forEach(s=>{const k=gnIs(s);if(k.de>=1&&k.de>=k.id&&gnW(s).length>=3&&/[.!?…]["”]?$/.test(s))o.push({s,tr:'',notes:[],wrong:false,src:'f',mis:0})});
 const seen=new Set();const r=o.filter(x=>{const key=x.s;if(seen.has(key))return false;seen.add(key);return true});
 r.forEach(x=>{x.s=x.s.replace(/^[AB]:\s+/,'');const k=gnIs(x.s);x.dirty=gnSingle(x.s)||k.id>0||/[()]/.test(x.s)||/[;→=]|\s\/\s|\.\.\./.test(x.s)||x.s.length<4||gnW(x.s).length<2||(!/[.!?…]["”]?$/.test(x.s)&&(x.s.match(/,/g)||[]).length>=2);x.used=used});return r}
/* judul → alternatif frasa Belanda */
const gnTitle=(g)=>{let t=String(g[4]||'').replace(/#\d+$/,'').trim();const qs=[...t.matchAll(/'([\p{L}]+)'/gu)].map(m=>m[1]);gnBoot();
 const eform=new Set();t=t.replace(/(\p{L}+)\(e\)/gu,(m,w)=>{eform.add(w.toLowerCase());return w});
 t=t.replace(/\[[^\]]*\]/g,' ').replace(/\([^)]*\)/g,' ').replace(/=.*$/,'').trim();
 const verb=GN.vb.test(String(g[3]||'')),alts=[];
 t.split(/\s*[\/,;]\s*/).forEach(alt=>{if(!alt.trim())return;const pieces=alt.split(/\s+\.\.\.\s+/).map(p=>{const q=p.split(/\s*\+\s*/).find(x=>gnW(x).some(w=>!GN.ph.has(gnNorm(w))))||'';return q.replace(/\b(zich|iets|ergens|iemand)\s+/gi,'').trim()});let ok=true;const ps=pieces.map(p=>gnW(p).map(gnNorm).filter(w=>!GN.ph.has(w)));
  const vpc=gnVP(g);ps.forEach(p=>{const ws=vpc&&p.length>1?[p[p.length-1]]:p;if(!p.length||ws.some(w=>!(gnDW.has(w)||[...gnForms(w,verb)].some(f=>gnDW.has(f)))))ok=false});if(ok)alts.push({ps,verb,e:ps.flat().some(w=>eform.has(w)),infl:/Infleksi -e|Perubahan Ejaan/.test(String(g[3]||''))})});
 if(!alts.length&&qs.length)qs.forEach(w=>{const x=gnNorm(w);if(gnDW.has(x))alts.push({ps:[[x]],verb:false})});return alts};
const gnInfl=w=>{const s=new Set([w+'e']);s.add(w.replace(/([aeiou])\1([^aeiou])$/,'$1$2')+'e');if(/f$/.test(w))s.add(w.slice(0,-1)+'ve');if(/s$/.test(w))s.add(w.slice(0,-1)+'ze');return s};
const gnVP=g=>/Kata Kerja \+ Preposisi|Adjektif \+ Preposisi|Daftar Lanjutan/.test(String(g[3]||''));
const gnSpecC={};
const GNSUBR=[[/3\.1 Perfectum|Participle Lampau|Pasif Perfectum/,{t:'part'}],[/Imperfectum \(Onvoltooid/,{t:'impf'}],[/Plusquamperfectum|Pengandaian Lampau/,{t:'rx',re:/^(had|hadden|was|waren)$/}],[/Futurum II/,{t:'rx',re:/^(zal|zullen|zult)$/}],[/Passief Imperfectum|Pasif Imperfectum|Subjek Pasif \(Lampau\)/,{t:'rx',re:/^(werd|werden)$/}],[/Passief Presens|Subjek Pasif \(Presens\)/,{t:'rx',re:/^(wordt|worden|word)$/}],[/Agen Pasif/,{t:'rx',re:/^door$/}],[/Pertanyaan Tak Langsung|[Kk]ata tanya \+ S|Kata tanya \+ V/,{t:'rx',re:/^(wie|wat|waar|waarom|wanneer|hoe|welke|welk|waarheen)$/,skip:1}],[/Verb Cluster di Klausa Anak|Kata Kerja Ganda di Klausa Anak|Perfectum di Klausa Anak|Posisi Verba|Verba Pisah di Klausa Anak/,{t:'last'}]];
function gnKind(g){const kv=g[10]||[],sub=String(g[3]||''),ti=String(g[4]||''),L=kv.map(r=>r[0]);
 if(L.filter((l,i)=>GN.pr[l]&&String(kv[i][1]).trim().length>1).length>=4)return'konjugasi';
 if(/Ungkapan Sehari-hari/.test(sub))return'frasa';
 if(L.includes('Predikatif (setelah zijn)'))return'infleksi';
 if(/Idiom|Peribahasa|Ungkapan Kemanta|Ungkapan Tetap/.test(sub))return'idiom';
 if(/Bahasa Lisan|Reduksi|Kontraksi|Penanda Wacana|Partikel Penutur|Pelunak/.test(sub))return'register';
 if(/Partikel Modal/.test(sub))return'partikel';
 if(/Pelafalan|Abjad|Tekanan Kata|Regional|Sejarah Ejaan|Reformasi Ejaan|Ejaan|Singkatan|Nama Diri|Konvensi Tulis|Archa|Aksen|Huruf Kapital|Surat Formal|Email|Tanda Koma|Gelar|Kata Ganti Sapaan|Sapaan Antar|Flandria|Perbedaan Belanda|Register Resmi|Register Akrab/.test(sub)||L.includes('Cara Baca (perkiraan)'))return'ejaan';
 if(/Artikel|Gender|Demonstratif/.test(sub)||/^(De-woord|Het-woord|Kategori (de|het)-woord)/.test(ti))return'gender';
 if(/Angka|Hari, Bulan|Jam & Waktu|Jam Lanjutan|Ordinal|Tanggal|Uang|Frekuensi & Rutinitas/.test(sub))return'bilangan';
 if(L.includes('Voltooid Deelwoord')&&L.some(l=>/^Imperfectum/.test(l)))return'kuat';
 if(L.includes('Subjek (Onderwerp)'))return'pronomen';
 if(L.some(l=>/^Komparatif/.test(l)))return'komparatif';
 if(/Preposisi|Vaste|Adjektif \+ Preposisi/.test(sub))return'preposisi';
 if(/Koordinatif|Subordinatif|Urutan|Kata Tanya|Ya\/Tidak|Negasi|Relatif|Infinitif|Klausa|Kalimat Majemuk|Verb Cluster|Korelatif|Tak Langsung|Sintaksis/.test(sub)||L.some(r=>/^Posisi Kata Kerja/.test(r)))return'konjungsi';
 if(/Jamak|Diminutif|Infleksi|Awalan|Pembentukan|Kata Benda|Perubahan Ejaan|Adjektif|Participle|Majemuk|Feminin/.test(sub))return'morfologi';
 return'aturan'}
function gnPola(g){const v=String(g[6]||'').replace(/\[[^\]]*\]/g,' ').replace(/\([^)]*\)/g,' ');if(!v.trim())return[];gnBoot();const verb=GN.vb.test(String(g[3]||'')),sing=[],pairs=[];
 v.split(/\s*[,;\/|→]\s*|\s+vs\s+/).forEach(alt=>{const parts=alt.split(/\s*\+\s*/).map(x=>x.trim()).filter(x=>x&&x!='...'),ok=parts.map(x=>{const w=gnW(x).map(gnNorm);return w.length==1&&!GN.ph.has(w[0])&&gnDW.has(w[0])?w[0]:null}).filter(Boolean);
  if(ok.length==1)sing.push([gnForms(ok[0],verb)]);else if(ok.length==2&&parts.length<=4)pairs.push([[gnForms(ok[0])],[gnForms(ok[1])]])});
 const o=[];if(sing.length)o.push({t:'w',a:sing});if(pairs.length)o.push({t:'p',a:pairs});return o}
function gnKeyS(s){const a=[],p=[];const wf=t=>t[0]=='~'?gnForms(t.slice(1),true):gnForms(t);String(s).split(/\s*\|\s*/).forEach(alt=>{const m=alt.split(/\s+…\s+/);if(m.length==2)p.push(m.map(x=>x.trim().split(/\s+/).map(wf)));else{const ws=alt.trim().split(/\s+/).filter(Boolean).map(wf);if(ws.length)a.push(ws)}});const o=[];if(a.length)o.push({t:'w',a,o1:1});if(p.length)o.push({t:'p',a:p});return o}
const gnIdKey=alt=>{const w=gnW(alt).map(gnNorm).filter(x=>!GN.ph.has(x)),ok=x=>x.length>2&&!GN.stop.has(x);for(let i=0;i<w.length;i++){if(GN.det.has(w[i])){const run=[];for(let j=i+1;j<w.length&&ok(w[j]);j++)run.push(w[j]);if(run.length){const nn=run.filter(x=>!/en$/.test(x));return(nn.length?nn:run).slice(-1)[0]}}}const c=w.filter(ok).sort((a,b)=>b.length-a.length);return c[0]||null};
function gnSpecOf(g){let r=gnSpecC[g[0]];if(r)return r;const kind=gnKind(g),kv=g[10]||[],sub=String(g[3]||''),title=String(g[4]||''),sps=[];
 const gk=GNK[String(g[0]).replace(/^g\|nl\|/,'')];
 if(gk)sps.push(...gnKeyS(gk));
 if(kind=='idiom'){const ks=title.replace(/#\d+$/,'').replace(/\[[^\]]*\]|\([^)]*\)/g,' ').split(/\s+\/\s+/).map(gnIdKey).filter(Boolean);if(ks.length)sps.push({t:'w',a:ks.map(k=>[gnForms(k)]),o1:1})}
 if(kind=='gender'){const dz=kv.filter(x=>/^(Dekat|Jauh)/.test(x[0])).map(x=>gnW(x[1])[0]).filter(Boolean);if(dz.length)sps.push({t:'w',a:dz.map(w=>[gnForms(w)]),o1:1})}
 if(kind=='konjungsi'){const f=gnW(String(g[6]||''))[0];if(f&&GN.conj.has(gnNorm(f)))sps.push({t:'w',a:[[gnForms(f)]],o1:1})}
 if(kind!='ejaan'){
  for(const[re,s]of GNSUBR)if(re.test(sub+' '+title)){sps.push(s);break}
  const al=gnTitle(g);
  if(al.length){const vp=gnVP(g)&&al.every(a=>a.ps[0].length>=2||a.ps.length>1);
   if(vp)sps.push({t:'vp',a:al.map(a=>{const p0=a.ps[0],v=p0.slice(0,-1),pr=[p0[p0.length-1]].concat(a.ps.slice(1).map(p=>p[p.length-1]));return{v:v.map(w=>gnForms(w,true)).filter(f=>[...f].some(x=>gnDW.has(x))),p:pr.map(w=>gnForms(w))}})});
   else{const pairs=al.filter(a=>a.ps.length==2),singles=al.filter(a=>a.ps.length==1);
    if(singles.length)sps.push({t:'w',a:singles.map(a=>a.ps[0].map(w=>{if(a.infl)return gnInfl(w);const f=gnForms(w,a.verb);if(a.e)f.add(w+'e');return f}))});
    if(singles.some(a=>a.infl))sps.push({t:'w',a:singles.map(a=>a.ps[0].map(w=>gnForms(w)))});
    if(pairs.length)sps.push({t:'p',a:pairs.map(a=>[a.ps[0].map(w=>gnForms(w)),a.ps[1].map(w=>gnForms(w))])})}}
  const p=kv.find(x=>/^Posisi Kata Kerja/.test(x[0]));if(p){if(/Posisi 2/.test(p[1])||/posisi 2/.test(p[1]))sps.push({t:'pos',n:2});else if(/Posisi 1/.test(p[1]))sps.push({t:'pos',n:1});else if(/akhir/i.test(p[1]))sps.push({t:'last'})}
  sps.push(...gnPola(g))}
 if(/waar \+ prep|er \+ prep|erop, eraan|Preposisi \+ relatif|waar \+ preposisi/.test(title+' '+g[6]))sps.unshift({t:'rx',re:/^(waar|er)(op|aan|mee|over|voor|in|van|uit|bij|naar|door|om|tegen|na|onder|achter|tussen|toe)$/});
 return gnSpecC[g[0]]={sps,kind}}
function gnOcc(t,U,ph){const o=[];for(let i=0;i+ph.length<=U.length;i++){let ok=true;for(let j=0;j<ph.length&&ok;j++){ok=[...U[i+j].c].some(x=>ph[j].has(x));if(ok&&j)ok=!/[^\s]/.test(t.slice(U[i+j-1].e,U[i+j].s))}if(ok)o.push([i,i+ph.length-1])}return o}
const gnPart=u=>/^(ge\p{L}{3,}(?:d|t|en)|(?:be|ver|ont|her|er)\p{L}{3,}(?:d|t|en))$/u.test(u.l)&&!/^(geen|gelijk|genoeg|gezellig)/.test(u.l)||(gnInv.has(u.l)&&/^ge/.test(u.l));
const gnImpfRe=/^(\p{L}{2,}(?:te|de|ten|den)|was|waren|had|hadden|ging|gingen|kon|konden|wilde|zou|zouden|mocht|moest|deed|deden|kwam|kwamen|zag|zagen|werd|werden)$/u;
function gnSel(sp,t){if(!sp)return null;const U=gnU(t);if(!U.length)return null;const R=(oc,ph)=>({bx:oc.map(([a,b])=>[U[a].s,U[b].e]).sort((x,y)=>x[0]-y[0]),ph:ph.map(p=>p.map(s=>[...s])),cov:oc.reduce((n,[a,b])=>n+b-a+1,0)/U.length});
 if(sp.t=='w'){let best=null;for(const ph of sp.a){const oc=gnOcc(t,U,ph);if(!oc.length)continue;const com=ph.every(s=>[...s].some(w=>gnCommon(w)))||sp.o1,pick=com?[gnPickOne(oc,U)]:oc,sc=(com?0:50)+ph.length*5-pick[0][0]*.01-(com?(oc.length-1)*8:0);if(pick.length>4)continue;if(!best||sc>best.sc)best={sc,oc:pick,ph}}return best?R(best.oc,[best.ph]):null}
 if(sp.t=='p'){let best=null;for(const[A,B]of sp.a){const a=gnOcc(t,U,A),b=gnOcc(t,U,B);if(!a.length||!b.length)continue;const x=a[0],y=b.find(z=>z[0]>x[1]);if(!y)continue;if(!best)best={oc:[x,y],ph:[A,B]}}return best?R(best.oc,best.ph):null}
 if(sp.t=='vp'){for(const a of sp.a){let ok=true;const occ=[];let from=0;for(const P of a.p){let f=-1;for(let i=from;i<U.length;i++){if([...U[i].c].some(x=>P.has(x))){const j=U.slice(Math.max(0,i-7),i).findIndex(u=>a.v.every(V=>[...u.c].some(x=>V.has(x))||U.slice(Math.max(0,i-7),i).some(w=>[...w.c].some(x=>V.has(x)))));if(!a.v.length||j>=0){f=i;break}}}if(f<0){ok=false;break}occ.push([f,f]);from=f+1}
   if(ok&&occ.length)return R(occ,a.p.map(x=>[x]))}return null}
 if(sp.t=='rx'){const i=U.findIndex((u,k)=>(!sp.skip||k>0)&&sp.re.test(u.l));return i<0?null:R([[i,i]],[[new Set([U[i].l])]])}
 if(sp.t=='part'){let i=-1;U.forEach((u,k)=>{if(gnPart(u))i=k});return i<0?null:R([[i,i]],[[new Set([U[i].l])]])}
 if(sp.t=='impf'){const i=U.findIndex((u,k)=>k>0&&gnImpfRe.test(u.l)&&!/^(de|te|veelste|mijnheer)$/.test(u.l));return i<0?null:R([[i,i]],[[new Set([U[i].l])]])}
 if(sp.t=='pos'){const i=sp.n-1;return U[i]?R([[i,i]],[[new Set([U[i].l])]]):null}
 if(sp.t=='last'){const i=U.length-1;return U[i]&&U.length>=4?R([[i,i]],[[new Set([U[i].l])]]):null}
 return null}
function gnPickOne(oc,U){let b=oc[0];for(const k of oc){const n=U[k[1]+1];if(n&&GN.det.has(n.l)){b=k;break}}return b}
function gnAmb(t,sel){if(!sel||!gnBg)return 0;const ws=gnW(t).map(gnNorm);let n=0;sel.bx.forEach(([a,b])=>{const w=gnNorm(t.slice(a,b));if(/\s/.test(w))return;const i=ws.indexOf(w);if(i<0)return;for(const G of GN.amb){if(!G.includes(w))continue;G.forEach(q=>{if(q==w)return;if((i&&gnBg.get(ws[i-1]+' '+q))||(i+1<ws.length&&gnBg.get(q+' '+ws[i+1])))n++})}});return n}
function gnScore(x,sel){const bw=sel.bx.length;return(x.tr?25:-15)-gnAmb(x.s,sel)*7-Math.abs(gnWc(x.s)-8)*.8+(bw>1?6:0)+(x.src=='c'?3:x.src=='k'?1:0)-(bw>2?(bw-2)*4:0)}
const gnCtx=g=>String(g[3]||'').split('›').pop().trim().replace(/^[\d.\s-]+/,'').trim();
const gnForm=v=>{v=String(v||'').replace(/\s*\([^)]*\)\s*$/,'').trim();return /^[\p{L}'’-]+(?:(?: \.\.\. | \/ | )[\p{L}'’-]+)*$/u.test(v)&&v.split(/ /).length<=7};
const gnStrip=v=>String(v||'').replace(/\s*\([^)]*\)\s*$/,'').trim();
/* label baris tabel: buang kurung yang memuat jawaban (Posesif (Bezit) tetap; “Imperfectum (ik / hij)” aman karena jawaban bukan ik/hij) */
const gnLab=(l,ans)=>{const w=new Set(gnW(ans).map(gnNorm).filter(x=>x.length>=2));return String(l).replace(/\s*\(([^)]*)\)\s*$/,(m,x)=>gnW(x).some(y=>w.has(gnNorm(y)))?'':m)};
const gnClean=(v,refl)=>{const o=[];String(gnStrip(v)).split(/\s+\/\s+/).forEach(x=>{x=x.trim().replace(/\s*\.\.\.\s*/g,' ... ');if(refl)x=x.split(/\s+/).filter(w=>!GN.refl.has(gnNorm(w))).join(' ');x=x.trim();if(x&&!o.includes(x))o.push(x)});return o};
const gnLen=s=>[...String(s).replace(/[\s.]/g,'')].length;
function gnTabs(g,kind){const kv=g[10]||[],ti=String(g[4]||'').replace(/#\d+$/,'').trim(),ar=kv.find(x=>/^Arti(?!\s*\/)/.test(x[0])),hint=ar?ar[1]:'',R=[];const rows=re=>kv.map((r,i)=>[r,i]).filter(([r])=>re.test(r[0]));
 if(kind=='konjugasi'){const refl=/^zich /.test(ti),tw=gnNorm(ti);rows(/^(Ik|Jij \/ U|Hij \/ Zij \/ Het|Wij|Jullie|Zij)$/).filter(([r])=>gnForm(gnStrip(r[1]))&&gnNorm(gnStrip(r[1]))!=tw).forEach(([r,i])=>{const alts=gnClean(r[1],refl);if(alts.length&&gnLen(alts[0])>=2)R.push({t:'konj',row:i,ans:alts[0],alts,head:ti,hint,pr:r[0]})});if(R.length<3)return[];return R}
 if(kind=='kuat'){const rs=rows(/^(Imperfectum|Voltooid)/).filter(([r])=>gnForm(r[1]));const w=rs.length>=3?[rs[0],rs[2],rs[1]]:rs;w.forEach(([r,i])=>R.push({t:'sel',row:i,ans:gnStrip(r[1]),alts:gnClean(r[1]),head:ti,hint,lab:gnLab(r[0],r[1])}));return R}
 if(kind=='pronomen'){const rs=rows(/^(Subjek|Objek|Posesif)/).filter(([r])=>/^[\p{L}' \/-]+$/u.test(String(r[1])));if(rs.length<2)return[];rs.forEach(([r,i])=>R.push({t:'sel',row:i,ans:String(r[1]).trim(),alts:[String(r[1]).trim()],head:gnCtx(g)||ti,hint,lab:gnLab(r[0],r[1])}));return R}
 if(kind=='komparatif'){rows(/^(Komparatif|Superlatif)/).filter(([r])=>gnForm(r[1])).forEach(([r,i])=>R.push({t:'sel',row:i,ans:gnStrip(r[1]),alts:gnClean(r[1]),head:ti,hint,lab:gnLab(r[0],r[1])}));return R}
 if(kind=='infleksi'){const st=gnNorm(ti.replace(/\s*\(.*$/,'').trim()),F=new Set([st,...gnInfl(st)]);rows(/^(Predikatif|De-woord|Het-woord|Jamak)/).forEach(([r,i])=>{const v=String(r[1]).split(/\s+\/\s+/)[0],U=gnU(v),k=U.findIndex(u=>F.has(u.l));if(k<0||U.length<2)return;const a=U[k];R.push({t:'phr',row:i,ans:a.l,alts:[a.l],pre:v.slice(0,a.s),post:v.slice(a.e),head:ti,hint,lab:r[0].replace(/\s*\(.*$/,'')})});return R}
 if(kind=='ejaan'){const gr=ti.split(/\s*[,\/]\s*/).map(x=>x.trim());const cw=rows(/^Contoh Kata & Arti/)[0];
  if(cw&&gr.length&&gr.every(x=>/^[a-z]{1,3}$/.test(x))){const G=[...gr].sort((a,b)=>b.length-a.length);String(cw[0][1]).split(/,\s*(?![^()]*\))/).forEach(it=>{const m=it.match(/^\s*([\p{L}]+)\s*\(([^)]*)\)/u);if(!m)return;const w=m[1].toLowerCase();for(const x of G){const k=w.indexOf(x);if(k>=0){R.push({t:'gap',row:cw[1],ans:x,alts:[x],pre:w.slice(0,k),post:w.slice(k+x.length),word:w,q:m[2],head:ti});break}}});if(R.length)return R}
  const sa=rows(/^Singkatan \/ Nama/)[0],sb=rows(/^Arti \/ Contoh/)[0];
  if(sa&&sb){const ab=ti.split(/\s+\/\s+/).map(x=>x.trim()),x=String(sa[0][1]).split(/\s*,\s*/),y=String(sb[0][1]).split(/\s*,\s*/);if(ab.length>=3&&ab.length==x.length){x.forEach((a,j)=>R.push({t:'abbr',row:sa[1],ans:a,alts:[a],q:ab[j],hint:y.length==x.length?y[j]:'',head:ti}));return R}}
  return[]}
 const a=kv.findIndex(r=>/^Kosakata( Belanda| \/ Pola Belanda)/.test(r[0])),b=kv.findIndex(r=>/^Arti \/ (Angka|Contoh)/.test(r[0]));
 if(a>=0&&b>=0){const x=String(kv[a][1]).split(/\s*,\s*/),y=String(kv[b][1]).split(/\s*,\s*/),cl=s=>s.replace(/^\.\.\.\s*/,'').trim();if(x.length>=3&&x.length==y.length&&x.every(s=>/^(\.\.\. )?[\p{L}'-]+$/u.test(s))){x.forEach((s,j)=>R.push({t:'list',row:a,ans:cl(s),alts:[cl(s)],q:cl(y[j]),head:ti}));return R}}
 for(let pr=0;pr<kv.length;pr++){if(/^(Penjelasan|Arti)/.test(kv[pr][0])||!/→/.test(kv[pr][1]))continue;const ps=String(kv[pr][1]).split(/\s*;\s*/).map(x=>x.replace(/\s*\([^)]*\)\s*[,.]?$/,'').trim().split(/\s*→\s*/)).filter(x=>x.length==2&&/^[\p{L}'-]+$/u.test(x[0])&&/^[\p{L}'-]+$/u.test(x[1])&&x[0]!=x[1]);if(ps.length>=2){ps.forEach(([q,an])=>R.push({t:'pair',row:pr,ans:an,alts:[an],q,head:ti}));return R}}
 return R}
const gnIc=new Map();
function gnInfo(g){let r=gnIc.get(g[0]);if(r)return r;const{sps,kind}=gnSpecOf(g),ss=gnSents(g);let bi=null,bsel=null,bs=-1e9,spi=null;
 for(let k=0;k<sps.length&&bi==null;k++)ss.forEach((x,i)=>{if(x.wrong||x.dirty)return;const sel=gnSel(sps[k],x.s);if(!sel||(sel.cov>.6&&gnWc(x.s)>3))return;const sc=gnScore(x,sel);if(sc>bs){bs=sc;bi=i;bsel=sel;spi=k}});
 let sh=null,hs=-1e9;ss.forEach((x,i)=>{if(x.wrong||x.dirty)return;const sc=(x.tr?25:0)-Math.abs(gnWc(x.s)-8)*.8;if(sc>hs){hs=sc;sh=i}});
 const tabFirst=kind=='konjugasi'||kind=='kuat'||kind=='infleksi',tabs=(tabFirst||bi==null)?gnTabs(g,kind):[],tab=tabs[0]||null,useTab=tab&&(tabFirst||bi==null);
 if(useTab&&tabFirst){bi=null;bsel=null}
 r={g,kind,sps,sp:spi!=null?sps[spi]:sps[0]||null,ss,i:bi,sel:bsel,show:sh,tab:useTab?tab:null,tabs:useTab?tabs:[],amb:bsel&&bi!=null?gnAmb(ss[bi].s,bsel):0,why:useTab?'tabel':bi!=null?'rumpang':kind=='ejaan'?'ejaan':!ss.length?'tanpa-kalimat':!sps.length?'tanpa-kunci':ss.every(x=>x.dirty||x.wrong)?'kalimat-rusak':'kunci-tak-cocok'};
 return gnIc.set(g[0],r),r}
/* sel tabel berputar tiap kemunculan: dibaca dari jadwal SRS (hanya baca), tanpa menyimpan apa pun */
function gnCur(g){const r=gnInfo(g);if(!r.tab||r.tabs.length<2)return r;const c=typeof S!='undefined'&&S.srs&&S.srs[g[0]],rot=c?gnH(g[0]+'|'+[c.t,c.s,c.i,c.d,c.l,c.r].join(',')):0,tab=r.tabs[rot%r.tabs.length];return tab===r.tab?r:Object.assign({},r,{tab})}
function gnAns(p){const s=new Set();if(p.sel)p.sel.ph.forEach(ph=>ph.forEach(a=>a.forEach(w=>s.add(w))));if(p.tab){gnW((p.tab.alts||[p.tab.ans]).join(' ')).forEach(w=>{if(w.length>=2&&!GN.refl.has(gnNorm(w)))s.add(gnNorm(w))});if(p.tab.word)s.add(p.tab.word);const k=p.kind,rx=k=='konjugasi'?/^(Ik|Jij \/ U|Hij \/ Zij \/ Het|Wij|Jullie|Zij)$/:k=='kuat'?/^(Imperfectum|Voltooid)/:k=='pronomen'?/^(Subjek|Objek|Posesif)/:k=='komparatif'?/^(Komparatif|Superlatif)/:null;
  if(rx)(p.g[10]||[]).forEach(r=>{if(rx.test(r[0]))gnW(String(r[1]).replace(/\([^)]*\)/g,' ')).forEach(w=>{if(w.length>=2&&!GN.refl.has(gnNorm(w)))s.add(gnNorm(w))})})}
 return s}
const gnAbbr=/^(mis|dll|dst|dsb|spt|cth|no|vs|dr|yg|dgn|tsb|ex)$/;
function gnFn(g,p){let t=String(g[5]||'').replace(/\s+/g,' ').trim();const ci=t.search(/\b(Contoh|Mis\.?)\b[^:]{0,30}:/);if(ci>8)t=t.slice(0,ci).trim();let re=/[.!?](?=\s+["'(A-ZÄÖÜ0-9])/g,m,cut=t.length;
 while((m=re.exec(t))){const w=(t.slice(0,m.index).match(/(\S+)$/)||[''])[1].toLowerCase();if(gnAbbr.test(w))continue;cut=m.index;break}
 t=t.slice(0,cut).replace(/[.\s:]+$/,'');if(p.i!=null){const sx=String(p.ss[p.i].s).replace(/\s+/g,' '),k=t.indexOf(sx);if(k>=0)t=t.slice(0,k).replace(/[\s:;,.\-–—]+$/,'')}if(t.length>90){const c=t.slice(0,91).replace(/\s+\S*$/,'');t=(c||t.slice(0,90))+'…'}
 const A=gnAns(p);if(!A.size)return esc(t);const U=gnU(t),bx=[];U.forEach(u=>{if([...u.c].some(w=>A.has(w))||A.has(u.l))bx.push([u.s,u.e])});
 let o='',l=0;for(const[a,b]of bx){if(a<l)continue;o+=esc(t.slice(l,a))+`<span class="gzb gze gzs" style="--n:${b-a}">&nbsp;</span>`;l=b}return o+esc(t.slice(l))}
const gnSeg=(t,bx,f)=>{let o='',l=0;for(const[a,b]of bx){o+=esc(t.slice(l,a))+f(t.slice(a,b),b-a);l=b}return o+esc(t.slice(l))};
const gnBox=n=>`<span class="gzb gze" style="--n:${n}">&nbsp;</span>`;
function gznFront(g){const m=S.o.gz||'cloze',p=gnCur(g),fh=gnFn(g,p),ctx=gnCtx(g),fn=String(g[5]||'').trim()&&fh?`<div class="gzq${String(g[5]||'').length>60?' gzl':''}"><span class=gl>${esc(g[11]||'Fungsi')}</span>${fh}</div>`:`<div class="gzq gzl"><span class=gl>Topik</span>${esc(ctx)}</div>`;
 if(m=='cloze'&&p.i!=null){const x=p.ss[p.i];return fn+`<div class="gzc gzen gzde">${gnSeg(x.s,p.sel.bx,(w,n)=>gnBox(n))}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')+`<div class=fchint><small>Isi bagian yang hilang &amp; ingat rumus polanya${p.amb?' (beberapa preposisi mungkin cocok; pilih yang sesuai arti &amp; pola)':''}</small></div>`}
 if(m=='cloze'&&p.tab){const q=p.tab,n=gnLen(q.ans);let body;
  if(q.t=='konj')body=`<div class="gzc gzen gzde">${esc(q.pr)} ${gnBox(n)}</div>`+(q.hint?`<div class=gzm>${esc(q.hint)}</div>`:'');
  else if(q.t=='list')body=`<div class="gzc gzen gzde">${esc(q.q)} → ${gnBox(n)}</div>`;
  else if(q.t=='pair')body=`<div class="gzc gzen gzde">${esc(q.q)} → ${gnBox(n)}</div>`;
  else if(q.t=='gap')body=`<div class="gzc gzen gzde">${esc(q.pre)}${gnBox(n)}${esc(q.post)}</div><div class=gzm>${esc(q.q)}</div>`;
  else if(q.t=='abbr')body=`<div class="gzc gzen gzde">${esc(q.q)} → ${gnBox(n)}</div>`+(q.hint?`<div class=gzm>${esc(q.hint)}</div>`:'');
  else if(q.t=='phr')body=`<div class="gzc gzen gzde">${esc(q.pre)}${gnBox(n)}${esc(q.post)}</div><div class=gzm>${esc(q.lab)}</div>`;
  else body=`<div class="gzc gzen gzde">${esc(q.lab)} → ${gnBox(n)}</div>`+(q.hint?`<div class=gzm>${esc(q.hint)}</div>`:'');
  return fn+`<div class="gzm gzhd">${esc(q.head)}</div>`+body+`<div class=fchint><small>${q.t=='gap'?'Isi huruf / bunyi yang hilang':'Isi sel tabel yang hilang &amp; ingat rumusnya'}</small></div>`}
 let ex='';if(m!='fn'&&p.show!=null){const x=p.ss[p.show];ex=`<div class="gzc gzen gzde">${esc(x.s)}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')}
 return fn+ex+`<div class=fchint><small>Ingat: ${m=='fn'?'nama pola &amp; rumusnya':'pola &amp; rumusnya'}</small></div>`}
function gnMark(t,A){t=String(t||'');if(!A.size)return esc(t);const bx=[];gnU(t).forEach(u=>{if([...u.c].some(w=>A.has(w)))bx.push([u.s,u.e])});return gnSeg(t,bx,w=>`<mark class=gzh>${esc(w)}</mark>`)}
function gznBack(g,k){const p=gnCur(g);let h=`<div class=gzt1>${esc(g[4])}</div><hr>`;const kv=g[10]||[],skip=new Set(),A=gnAns(p);
 p.ss.forEach(x=>{if(x.src=='k')skip.add(x.row)});if(p.ss.some(x=>x.src=='k')&&p.ss[0]&&p.ss[0].used)p.ss[0].used.forEach(i=>skip.add(i));
 if(g[6])h+=`<div class=gzp>${gnMark(g[6],A)}</div>`;
 const rows=kv.map((r,i)=>[r,i]).filter(([r,i])=>!skip.has(i)&&String(r[1]||'').trim());
 if(rows.length){const R=rows.map(([r,i])=>`<div class=gzr><span class=gl>${esc(r[0])}</span><span>${p.tab&&p.tab.row==i?`<mark class=gzh>${esc(String(r[1]))}</mark>`:esc(String(r[1]))}</span></div>`);
  const mk=p.tab?rows.findIndex(([r,i])=>i==p.tab.row):-1;h+=rows.length>8?`<div class=gzk>${R.slice(0,4).join('')}</div><details class=gzd${mk>=4?' open':''}><summary>Tabel lengkap (${rows.length})</summary><div class=gzk>${R.join('')}</div></details>`:`<div class=gzk>${R.join('')}</div>`}
 h+=`<div class=gzf>${esc(g[5])}</div>`;
 const ord=p.ss.map((x,i)=>i),f=p.i!=null?p.i:p.show;if(f!=null){ord.splice(ord.indexOf(f),1);ord.unshift(f)}
 h+=ord.map(i=>{const x=p.ss[i],sl=x.wrong||x.dirty?null:i==p.i?p.sel:(p.sps.map(s=>gnSel(s,x.s)).find(Boolean)||null),bx=sl?sl.bx:[];
  return`<div class="gex gzx${x.wrong||x.dirty?' gzw':''}"><div class=g1>${gnSeg(x.s,bx,w=>`<mark class=gzh>${esc(w)}</mark>`)}${x.wrong||x.dirty?'':spk(x.s,'nl')}</div>${x.tr?`<div class=g2>${esc(x.tr)}</div>`:''}${(x.notes||[]).map(n=>`<div class="g2 gzn">${esc(n)}</div>`).join('')}</div>`}).join('');
 return`<div style="text-align:left">`+h+gmExBlock(k)+`</div>`}
/* ===== v7.19.1: grammar Esperanto (A1–C2) pada kartu rumpang. Kunci per kartu dibaca dari judul (kata fungsi, korelatif, preposisi, kala/partisip → ujung kata, afiks → morfem yang diverifikasi ke kosakata EO, bilangan). Kartu tanpa kalimat cocok / kartu bunyi → kartu "ingat pola". Rumpang hanya tampil; tidak ada input ketik, jadi sistem-x/h tidak relevan. zh/ja/de/nl/en tidak disentuh ===== */
const GOW=s=>[...String(s||'').matchAll(/[\p{L}]+(?:-[\p{L}]+)*/gu)].map(m=>({l:m[0].toLowerCase(),s:m.index,e:m.index+m[0].length}));
const GOF=new Set('la mi vi li ŝi ĝi ni ili ci si ĉi min vin lin ŝin ĝin nin ilin sin mia via lia ŝia ĝia nia ilia sia pli plej tro pro tre ĉe de da je al el en ne se ke ju des ĝis jen jam ja do nu ho unu du tri kvin kvar ses sep ok naŭ dek cent mil nul kaj aŭ sed tamen nek ĉar ol por per kun sen sur sub tra apud ekster post antaŭ ĉirkaŭ inter laŭ po pri kiel tiel ankaŭ nun tuj nur eĉ ĉu oni mem ajn plu for ambaŭ kvazaŭ kvankam dum anstataŭ krom malgraŭ trans super preter kontraŭ multe malmulte almenaŭ apenaŭ baldaŭ hieraŭ hodiaŭ morgaŭ ankoraŭ ĝuste tiam kiam ĉiam jam'.split(' '));
const GOC=/^(neni|ti|ki|ĉi|i)(u|a|e|o|am|al|el|om|es)([jn]{0,2})$/u;
const GOP='al anstataŭ antaŭ apud ĉe ĉirkaŭ da de dum ekster el en ĝis inter je kontraŭ krom kun laŭ malgraŭ malantaŭ per po por post preter pri pro sen sub super sur tra trans'.split(' ');
const GOTW=new Set([...GOP,...'ĉar ke se ĉu nek kaj aŭ sed tamen do jen jam ja mem ajn ambaŭ oni kvazaŭ for pli plej malpli malplej multe ju des ol'.split(' ')]);
const GOSUF='ul in ej ar eg et ec ind ebl ist uj obl em id ad aĉ er um ig iĝ aĵ ing estr op an il on ĉj nj'.split(' '),GOPRE='mal re ek dis ge bo eks pra fi duon for'.split(' ');
const GONW='(?:(?:unu|du|tri|kvar|kvin|ses|sep|ok|naŭ)?(?:dek|cent|mil)|unu|du|tri|kvar|kvin|ses|sep|ok|naŭ|nul)';
let goLx=null;
function goBoot(){if(goLx)return;goLx=new Set();for(const r of D.C){const e=r[3]&&r[3].eo;if(e)e.forEach(x=>GOW(x[0]).forEach(t=>{goLx.add(t.l);goLx.add(t.l.replace(/(as|is|os|us|[oaeiu])[jn]*$/,''))}))}}
function goRoot(s,d){if(s.length<2)return false;if(goLx.has(s))return true;if(d>1)return false;for(const p of GOPRE)if(s.startsWith(p)&&s.length>p.length+1&&goRoot(s.slice(p.length),d+1))return true;for(const f of GOSUF)if(s.endsWith(f)&&s.length>f.length+1&&goRoot(s.slice(0,-f.length),d+1))return true;return false}
const GOEN='(?:[aeiou][jn]{0,2}|[aiou]s)';
/* judul kartu → kunci: w=kata utuh (~=akar kata kerja), c=korelatif, e=ujung kata, m=sisipan/akhiran (diverifikasi), p=awalan, r=bilangan, -=tanpa rumpang */
const GOR=[/* v7.19.3: kartu EO hasil pecahan */
[/^Konjungsi aŭ \(atau\)$/,'w:aŭ'],
[/^Konjungsi kaj \(dan\)$/,'w:kaj'],
[/^Konjungsi nek \(maupun\)$/,'w:nek'],
[/^Konjungsi sed \(tetapi\)$/,'w:sed'],
[/^Konjungsi tamen \(namun\)$/,'w:tamen'],
[/^ĉi tiu \(ini\)$/,'w:ĉi'],
[/^tiu \(itu\)$/,'w:tiu'],
[/^Bentuk Kepemilikan ties \(milik itu\)$/,'w:ties'],
[/^Bentuk Kepemilikan ĉi ties \(milik ini\)$/,'w:ĉi'],
[/^Adverbia Tempat tie \(di sana\)$/,'w:tie'],
[/^Adverbia Tempat ĉi tie \(di sini\)$/,'w:ĉi'],
[/^Arah dengan tien \(ke sana\)$/,'w:tien'],
[/^Arah dengan ĉi tien \(ke sini\)$/,'w:ĉi'],
[/^Tingkat Lebih dengan pli$/,'w:pli'],
[/^Tingkat Paling dengan plej$/,'w:plej'],
[/^malpli \(kurang\)$/,'w:malpli'],
[/^malplej \(paling kurang\)$/,'w:malplej'],
[/^Kata Kerja diri \(mengatakan\)$/,'w:~dir'],
[/^Kata Kerja paroli \(berbicara\)$/,'w:~parol'],
[/^Kata Kerja rakonti \(menceritakan\)$/,'w:~rakont'],
[/^Anak Kalimat Sebab dengan ĉar$/,'w:ĉar'],
[/^Anak Kalimat Sebab dengan tial ke$/,'w:tial'],
[/^Infinitif dengan anstataŭ$/,'w:anstataŭ'],
[/^Infinitif dengan por$/,'w:por'],
[/^Infinitif dengan antaŭ ol$/,'w:antaŭ'],
[/^Takaran dengan da$/,'w:da'],
[/^Keseluruhan Tertentu dengan de$/,'w:de'],
[/^Adverbia Jumlah multe da \(massa\)$/,'w:multe,malmulte'],
[/^Kata Sifat Jumlah multaj \(individu\)$/,'w:multa'],
[/^Akusatif Waktu: dimanĉon \(sekali\)$/,'e:n'],
[/^Adverbia Frekuensi: dimanĉe \(kebiasaan\)$/,'e:e'],
[/^Preposisi \+ Adverbia \(de nun, el tie\)$/,'w:de,el'],
[/^Preposisi \+ Preposisi \(el sub, de sur\)$/,'w:sub,sur,post'],
[/^Pronomo Tanya kiu \(siapa\/yang mana\)$/,'w:kiu'],
[/^Pronomo Tanya kies \(milik siapa\)$/,'w:kies'],
[/^koni \(kenal\)$/,'w:~kon'],
[/^scii \(tahu\)$/,'w:~sci'],
[/^tempo \(waktu\)$/,'w:tempo'],
[/^fojo \(kali\)$/,'w:fojo'],
[/^loĝi \(tinggal\)$/,'w:~loĝ'],
[/^vivi \(hidup\)$/,'w:~viv'],
[/^antikva \(kuno\)$/,'w:antikva'],
[/^maljuna \(berusia lanjut\)$/,'w:maljuna'],
[/^malnova \(lama \/ tidak baru\)$/,'w:malnova'],
[/^Gelar \(sinjoro, sinjorino, fraŭlino\)$/,'w:sinjoro,sinjorino,fraŭlino'],
[/^Sapaan Sopan dengan Gelar$/,'w:sinjoro,sinjorino,fraŭlino'],
[/^Salam dengan Akusatif \(Bonan matenon!\)$/,'e:n'],
[/^Seruan dengan Akusatif \(Dankon!\)$/,'e:n'],
[/^Bilangan Puluhan dengan -dek$/,'r:num'],
[/^Bilangan Ratusan dengan -cent$/,'r:num'],
[/^Bilangan Ribuan dengan -mil$/,'r:num'],
[/^Akhiran -uj- \(Wadah\)$/,'m:uj'],
[/^Akhiran -uj- \(Pohon\)$/,'m:uj'],
[/^Akhiran -uj- \(Negeri\)$/,'m:uj'],
[/^Adverbia Negatif nenial \(tanpa alasan\)$/,'w:nenial'],
[/^Adverbia Negatif neniel \(sama sekali tidak\)$/,'w:neniel'],
[/^Adverbia Negatif neniom \(sedikit pun tidak\)$/,'w:neniom'],
[/^Kata Kerja Dasar -i \(sidi, kuŝi\)$/,'w:~sid,~kuŝ,~silent'],
[/^Bentuk -ig-: Membuat \(sidigi\)$/,'m:ig'],
[/^Bentuk -iĝ-: Menjadi \(sidiĝi\)$/,'m:iĝ'],
[/^Tekad dengan mi \+ -u$/,'e:u'],
[/^Ajakan dengan ni \+ -u$/,'e:u'],
[/^Perintah dengan -u$/,'e:u'],
[/^Larangan dengan ne \+ -u$/,'e:u'],
[/^Imperatif untuk Permohonan$/,'e:u'],
[/^Imperatif untuk Harapan$/,'e:u'],
[/^Imperatif untuk Saran dan Pertimbangan$/,'e:u'],
[/^Izin dengan permesi$/,'w:~permes'],
[/^Izin dengan lasi$/,'w:~las'],
[/^Izin dengan Imperatif$/,'e:u'],
[/^Kemungkinan dengan eble$/,'w:eble,neebla'],
[/^Probabilitas dengan kredeble, verŝajne$/,'w:kredeble,verŝajne'],
[/^Awalan bo- \(Kekerabatan Pernikahan\)$/,'p:bo'],
[/^Awalan duon- \(Tiri\/Setengah\)$/,'p:duon'],
[/^Akhiran -ĉj- \(Nama Kesayangan Laki-laki\)$/,'m!:ĉj'],
[/^Akhiran -nj- \(Nama Kesayangan Perempuan\)$/,'m!:nj'],
[/^Satuan Berat \(gramo, kilogramo\)$/,'-'],
[/^Satuan Ukuran \(metro, litro\)$/,'-'],
[/Kata Kerja Pilihan/,'w:al'],[/^(Alfabet|Pengucapan|Diftong|Gugus|Aksen|Penulisan Nama|Elisi|Korespondensi|Sistem Mata Uang|Singkatan|Apozisi|Kata Majemuk|Pembentukan Kata dari Akar|Penurunan|Preposisi sebagai Awalan|Satuan Berat)/,'-'],
[/^Interjeksi/,'w:ho,nu,fi,hura,ve,adiaŭ'],[/^Kata Benda berakhiran -o/,'e:o'],[/^Artikel/,'w:la'],[/^Kata Sifat berakhiran -a/,'e:a'],
[/Kala Kini -as|^Kata Kerja Impersonal|Konjugasi Kala Kini/,'e:as'],[/Bentuk Jamak/,'e:j'],[/^Kata (Sifat|Benda) Predikat|^Kata Kerja Mendahului Subjek/,'w:estas,ŝajnas'],
[/Dijadikan Transitif|Kausatif -ig-/,'m:ig'],[/Dijadikan Intransitif/,'m:iĝ'],[/^Tiga Bentuk/,'m:ig,iĝ'],[/-ĉj-/,'m!:ĉj,nj'],[/Perempuan dengan -in-/,'m:in'],[/Antonim dengan mal-/,'p:mal'],[/^Awalan bo-/,'p:bo,duon'],
[/Refleksif si \(/,'w:si,sin'],[/Refleksif \(mi/,'w:min,nin,vin'],[/Posesif Refleksif sia/,'w:sia,siaj,sian,siajn'],[/^Kata Sifat Posesif|^Penggunaan Posesif/,'w:mia,via,lia,ŝia,ĝia,nia,ilia'],
[/^Akusatif Kata Ganti|^Kata Kerja Refleksif|^Posisi Pronomo/,'w:min,vin,lin,ŝin,ĝin,nin,ilin,sin'],[/^Kata Ganti Orang|^Kesesuaian dengan Kata Ganti/,'w:mi,vi,li,ŝi,ĝi,ni,ili'],[/^Batas Pronomo/,'w:li,ŝi,ĝi,ili,lin,ŝin,ĝin,ilin,si,sin'],
[/^Kata Kerja Transitif$|Akusatif|Salam dan Seruan|Adverbia Arah dengan -n|Predikat Objek/,'e:n'],[/Konjungsi kaj/,'w:kaj'],[/Konjungsi nek/,'w:nek'],[/^Konjungsi Koordinatif/,'w:aŭ,kaj,nek,sed,tamen,do'],[/^Kata Negasi ne/,'w:ne'],
[/^Infinitif dengan/,'w:anstataŭ,por,antaŭ'],[/Infinitif/,'e:i'],[/Kala Lampau -is/,'e:is'],[/Kala Depan -os/,'e:os'],
[/Partisip Adverbial/,'e:ante,inte,onte,ate,ite,ote'],[/^Kala Majemuk Verba Impersonal/,'e:ante,inte'],[/Partisipial/,'e:anto,into,onto,ato,ito,oto'],[/^Kala Majemuk Kondisional/,'e:anta,inta,onta,ata,ita,ota'],[/^Kala Majemuk$/,'e:anta,inta,onta'],
[/Futurum Periphrastik Pasif|Partisip Pasif Depan/,'e:ota'],[/Pasif Perfek|Pasif Pluperfek|Pasif Futurum Perfek|Partisip Pasif Lampau/,'e:ita'],[/Pasif Kini|Pasif Lampau|Pasif Depan|Partisip Pasif Kini/,'e:ata'],
[/Partisip Aktif Kini|Kini Progresif|Imperfek|Depan Progresif/,'e:anta'],[/Aktif Lampau|Kala Perfek|Kala Pluperfek|Futurum Perfek/,'e:inta'],[/Aktif Depan|Futurum Periphrastik/,'e:onta'],
[/Modus Kondisional|Kurang Nyata|Kondisional Mandiri/,'e:us'],[/Berlawanan dengan Fakta/,'w:estus'],[/Bersyarat Faktual|Ringkasan Tiga Jenis/,'w:se'],
[/Imperatif|Tekad dan Ajakan|Perintah dan Larangan|Tujuan \(por ke\)|^Izin/,'e:u'],
[/devi \(harus/,'w:~dev'],[/Makna povi/,'w:~pov'],[/koni vs scii/,'w:~kon,~sci'],[/loĝi vs vivi/,'w:~loĝ,~viv'],[/diri, paroli/,'w:~dir,~parol,~rakont'],[/tempo vs fojo/,'w:tempo,fojo'],[/antikva vs/,'w:antikva,maljuna,malnova'],
[/^Adverbia for /,'p:for'],[/^Akhiran -op-/,'m:op'],[/Bilangan Tingkat|Waktu dalam Sehari/,'r:ord'],[/Kata Benda Bilangan/,'r:numo'],[/Adverbia dari Bilangan/,'r:nume'],[/Pecahan/,'r:frac'],[/Bilangan/,'r:num'],
[/Sebab \(ĉar/,'w:ĉar,tial,ke'],[/Kutipan Tidak Langsung/,'w:ke,ĉu'],[/Resiprokal/,'w:unu,alia,alian,reciproke'],[/Kehormatan moŝto/,'w:moŝto'],[/Gelar dan Sapaan/,'w:sinjoro,sinjorino,fraŭlino,sinjoroj'],
[/Kemungkinan dan Probabilitas/,'w:eble,kredeble,verŝajne'],[/Tingkat Tertinggi/,'w:eble,plej'],[/Dimulai di Masa Lalu/,'w:de'],[/^Adverbia \(Kata Keterangan\)/,'w:baldaŭ,hieraŭ,hodiaŭ,morgaŭ,ankoraŭ,tre,tro,nun,tuj,nur,jam,ankaŭ'],
[/Pembentukan Adverbia dengan -e|Adverbia dari Preposisi|Keterangan pada Verba Impersonal/,'e:e'],[/^Preposisi (\(Kata Depan\)|\+ Adverbia)/,'w:'+GOP.join(',')]];
const goC=new Map();
function goSpec(g){const t=String(g[4]||'').replace(/#\d+$/,'').trim();let s=null;for(const[r,v]of GOR)if(r.test(t)){s=v;break}
 if(s==null){const tk=GOW(t.replace(/\([^)]*\)/g,x=>x)).map(x=>x.l),ru=GOW(String(g[6]||'').replace(/\(.*?\)/g,'')).map(x=>x.l),cr=tk.filter(x=>GOC.test(x)),tw=tk.filter(x=>GOTW.has(x)&&x!='de'||x=='de'&&/\bde\b/.test(t));
  if(/Korelatif/.test(t))s='c:*';else if(cr.length)s='c:'+[...new Set(cr)].join(',');else if(tw.length)s='w:'+[...new Set(tw)].join(',');
  else if(/^Akhiran -(\p{L}+)-/u.test(t))s='m:'+t.match(/^Akhiran -(\p{L}+)-/u)[1];else if(/^Awalan (\p{L}+)-/u.test(t))s='p:'+t.match(/^Awalan (\p{L}+)-/u)[1];
  else if(/^Preposisi/.test(t))s='w:'+GOP.join(',');else if(/berakhiran -o \(Hal/.test(t)){const c=ru.filter(x=>GOC.test(x));s=c.length?'c:'+[...new Set(c)].join(','):'-'}else s='-'}
 return s}
/* spesifikasi → fungsi uji token: f(l)=>[a,b] (rentang yang dirumpangkan di dalam token) atau null */
function goFn(sp){const k=sp[0],nx=sp.indexOf('!')==1,L=sp.slice(sp.indexOf(':')+1).split(',');
 if(sp=='-')return null;
 if(k=='w'){const vs=L.filter(x=>x[0]=='~').map(x=>new RegExp('^'+x.slice(1)+'(?:i|as|is|os|us|u)$','u')),ws=L.filter(x=>x[0]!='~');return l=>{if(ws.some(w=>l==w||w.length>=3&&/[aou]$/.test(w)&&new RegExp('^'+w+'[jn]{1,2}$','u').test(l))||vs.some(r=>r.test(l)))return[0,l.length];return null}}
 if(k=='c'){const all=L[0]=='*';return l=>{if(all?GOC.test(l):L.some(w=>l==w||new RegExp('^'+w+'[jn]{1,2}$','u').test(l)))return[0,l.length];return null}}
 if(k=='r'){const N=GONW,re=L[0]=='ord'?new RegExp('^'+N+'a[jn]{0,2}$','u'):L[0]=='numo'?new RegExp('^'+N+'o[jn]{0,2}$','u'):L[0]=='nume'?new RegExp('^'+N+'e$','u'):L[0]=='frac'?new RegExp('^'+N+'on[oae][jn]{0,2}$','u'):new RegExp('^'+N+'$','u');return l=>re.test(l)?[0,l.length]:null}
 if(k=='e'){const ms=[...L].sort((a,b)=>b.length-a.length);let re;
  if(L[0]=='n')re=/^(.{2,}[aeiouj])(n)()$/u;else if(L[0]=='j')re=/^(.{2,}[ao])(j)(n?)$/u;else re=new RegExp('^(.{2,}?)('+ms.join('|')+')('+(ms.every(m=>/[ao]$/.test(m))?'[jn]{0,2}':'')+')$','u');
  return l=>{if(l.length<3||GOF.has(l)||L[0]!='n'&&GOC.test(l))return null;const m=l.match(re);return m?[m[1].length,m[1].length+m[2].length]:null}}
 if(k=='m'||k=='p'){goBoot();const ms=[...L].sort((a,b)=>b.length-a.length).join('|'),re=k=='m'?new RegExp('^(.{'+(nx?1:2)+',}?)('+ms+')'+GOEN+'$','u'):new RegExp('^('+ms+')(.{3,})$','u');
  return l=>{if(GOF.has(l)||GOC.test(l))return null;const m=l.match(re);if(!m)return null;if(k=='m'){if(!nx&&!goRoot(m[1],0))return null;return[m[1].length,m[1].length+m[2].length]}
   const r=m[2].replace(/(as|is|os|us|[oaeiu])[jn]*$/,'');if(!goRoot(r,0)&&!goRoot(m[2],0))return null;return[0,m[1].length]}}
 return null}
function goCur(g){let c=goC.get(g[0]);if(c)return c;const sp=goSpec(g),f=goFn(sp),ss=(g[7]||[]).map(e=>{const a=gzLn(e),s=a[0],tr=gzTr(a),m=[];if(f)GOW(s).forEach(t=>{const r=f(t.l);if(r)m.push([t.s+r[0],t.s+r[1]])});return{s,tr,m}});
 let bi=null,bs=-1;ss.forEach((x,i)=>{const n=x.m.length;if(!n)return;const wc=GOW(x.s).length,sc=(n<=2?60-(n-1)*5:40-(n-3)*5)+(x.tr?20:0)-Math.abs(wc-7)*1.5-(wc>16?20:0);if(sc>bs){bs=sc;bi=i}});
 c={sp,f,ss,i:bi,bx:bi!=null?ss[bi].m.slice(0,2):[],show:ss.length?0:null};goC.set(g[0],c);return c}
const goBox=n=>`<span class="gzb gze" style="--n:${n}">&nbsp;</span>`;
const goSeg=(t,bx,f)=>{let o='',l=0;for(const[a,b]of bx){if(a<l)continue;o+=esc(t.slice(l,a))+f(t.slice(a,b),b-a);l=b}return o+esc(t.slice(l))};
function gzoFront(g){const m=S.o.gz||'cloze',p=goCur(g),fn=String(g[5]||'').trim()?`<div class="gzq${String(g[5]||'').length>60?' gzl':''}"><span class=gl>${esc(g[11]||'Fungsi')}</span>${esc(g[5])}</div>`:`<div class="gzq gzl"><span class=gl>Topik</span>${esc(String(g[3]||''))}</div>`;
 if(m=='cloze'&&p.i!=null){const x=p.ss[p.i];return fn+`<div class="gzc gzen gzde">${goSeg(x.s,p.bx,(w,n)=>goBox(n))}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')+`<div class=fchint><small>Isi bagian yang hilang &amp; ingat rumus polanya</small></div>`}
 let ex='';if(m!='fn'&&p.show!=null){const x=p.ss[p.show];ex=`<div class="gzc gzen gzde">${esc(x.s)}</div>`+(x.tr?`<div class=gzm>${esc(x.tr)}</div>`:'')}
 return fn+ex+`<div class=fchint><small>Ingat: ${m=='fn'?'nama pola &amp; rumusnya':'pola &amp; rumusnya'}</small></div>`}
function goMk(t,p){t=String(t||'');if(!p.f)return esc(t);const sp=p.sp,k=sp[0];if(k=='w'||k=='c'||k=='r')return goSeg(t,GOW(t).map(x=>{const r=p.f(x.l);return r&&[x.s,x.e]}).filter(Boolean),w=>`<mark class=gzh>${esc(w)}</mark>`);
 const ms=sp.slice(sp.indexOf(':')+1).split(',').sort((a,b)=>b.length-a.length).join('|'),re=rxLB('-(?:'+ms+')(?![\\p{L}])|(?<![\\p{L}])(?:'+ms+')-','gu'),bx=[...t.matchAll(re)].map(m=>[m.index,m.index+m[0].length]);return goSeg(t,bx,w=>`<mark class=gzh>${esc(w)}</mark>`)}
function gzoBack(g,k){const p=goCur(g);let h=`<div class=gzt1>${esc(g[4])}</div><hr>`;
 if(g[6])h+=`<div class=gzp>${goMk(g[6],p)}</div>`;h+=`<div class=gzf>${esc(g[5])}</div>`;
 const ord=p.ss.map((x,i)=>i),f=p.i!=null?p.i:p.show;if(f!=null){ord.splice(ord.indexOf(f),1);ord.unshift(f)}
 h+=ord.map(i=>{const x=p.ss[i];return`<div class="gex gzx"><div class=g1>${goSeg(x.s,x.m,w=>`<mark class=gzh>${esc(w)}</mark>`)}${spk(x.s,'eo')}</div>${x.tr?`<div class=g2>${esc(x.tr)}</div>`:''}</div>`}).join('');
 const n1=(g[8]||[]).length,n2=(g[9]||[]).length,num=(a,n,c)=>a.map((x,i)=>`<div class="${c}"><span class=gl>${n}${a.length>1?' '+(i+1):''}</span>${esc(x)}</div>`).join('');
 if(n1+n2)h+=`<details class=gzd><summary>${n1?esc(g[12]||'Keterangan'):''}${n1&&n2?' &amp; ':''}${n2?'kasus khusus':''} (${n1+n2})</summary>${num(g[8]||[],g[12]||'Keterangan','gnt')}${num(g[9]||[],'Kasus khusus','gnt gkk')}</details>`;
 return`<div style="text-align:left">`+h+gmExBlock(k)+`</div>`}
function gcard(k){const g=GK[k];if(!g)return'<div class=card>Tidak ada grammar untuk filter/mode ini.</div>';const s=st(k);
return`<div class=card><div class=hd><span>${LN[g[1]]||'Jerman'} ${g[2]}${g[3]?' · '+esc(g[3]):''}</span><span><i class="dot dot${s}"></i>${STN[s]}${fcTag(k)}${aiBtn(k)}${S.lib.some(t=>t.L==g[1])?`<button class="mini" data-a=libfind data-k="${esc(k)}" title="Cari teks di Pustaka">📚</button>`:''}${edBtn('g',k)}</span></div><div class=mean>${esc(g[4])}</div>${gbody(g)}${gTax(k)}${gmExBlock(k)}<div class="seg">${STN.map((x,i)=>`<button class="sb sb${i}${i==s?' on':''}" data-a=set data-k="${esc(k)}" data-v=${i}>${x}</button>`).join('')}</div></div>`}
let gLg='',gLv=0,gFoc=0,gFresh=1;const gAll0=l=>gLvs(l).map(v=>l+':'+v);
const gLvs=l=>(D.GL.find(x=>x[0]==l)||[0,0,0,[]])[3];
function gSync(){if(S.gf.length){const l=S.gf[0].split(':')[0];if(S.gf.some(x=>!x.startsWith(l+':')))S.gf=S.gf.filter(x=>x.startsWith(l+':'));if(!gFresh&&gLg!=l){gLg=l;gLv=1}}else if(gLv||gLg){gLg='';gLv=0}}
function gStat(l,v){const a=D.G.filter(g=>g[1]==l&&(!v||g[2]==v));const d=a.filter(g=>st(g[0])==2).length;return{n:a.length,d}}
function gPick(){const bt=(c,v,t,sub,pct)=>`<button class=gpk data-a=${c} data-v="${v}"><b>${t}</b><small>${sub}</small>${pct?`<i style="width:${pct}%"></i>`:''}</button>`;
 if(!gLg)return`<div class=card><b>Pilih bahasa grammar</b><div class=gpg>`+D.GL.map(l=>{const t=gStat(l[0]);return bt('glg',l[0],esc(l[1]),t.n+' topik · '+t.d+' selesai',t.n?Math.round(t.d/t.n*100):0)}).join('')+`</div></div>`;
 const l=D.GL.find(x=>x[0]==gLg);
 return`<div class=card><div class=gcr><button class=mini data-a=gback>‹ Ganti bahasa</button><b>${esc(l[1])}</b></div><b>Pilih level</b><div class=gpg>`+bt('glv','all','Semua level',gStat(gLg).n+' topik',0)+l[3].map(v=>{const t=gStat(gLg,v);return bt('glv',v,v,t.n+' topik · '+t.d+' selesai',t.n?Math.round(t.d/t.n*100):0)}).join('')+`</div></div>`}
function gFocus(){const P=gp(),i=P.findIndex(g=>g[0]==S.gs),L0=D.GL.find(x=>x[0]==gLg),g=GK[S.gs],lv=g?g[2]:'';
 const nav=`<div class=btns><button data-a=gprev>‹ Grammar sebelumnya</button><button class=pri data-a=gnext style="width:auto;flex:1">Grammar berikutnya ›</button></div>`;
 return`<div class=gfoc><div class=gcr style="flex-wrap:wrap"><button class=mini data-a=gback>‹ Bahasa</button><button class=mini data-a=gtolv>Level</button><button class=mini data-a=glist>☰ Daftar grammar</button></div><small class=gsub>${esc(L0?L0[1]:'')} · ${esc(lv)}${i>=0?' · '+(i+1)+' dari '+P.length:''}</small>`+nav+gcard(S.gs)+nav+`</div>`}
function gram(){gSync();if(!gLg||!gLv)return gPick();if(gFoc&&S.gs&&GK[S.gs])return gFocus();const P=gp(),lv=gLvs(gLg),allL=S.gf.length>=lv.length,L0=D.GL.find(x=>x[0]==gLg);return`<div class=card><div class=gcr><button class=mini data-a=gback>‹ Ganti bahasa</button><b>${esc(L0[1])}</b></div><small class=lbl>Level (ketuk untuk memilih / menambah)</small><div class=chips><button class="chip${allL?' on':''}" data-a=glv data-v=all>Semua</button>`+lv.map(v=>`<button class="chip${!allL&&S.gf.includes(gLg+':'+v)?' on':''}" data-a=glv data-v="${v}">${v}</button>`).join('')+`</div></div>`+aiHub()+gNxtCard()+(()=>{const tf=gTaxFilt()+msel(),n=(S.o.gpri?1:0)+(S.o.gfn?1:0);return tf?dtag('gf')+'<summary>Filter lanjutan'+(n?` (${n} aktif)`:'')+'</summary>'+tf+'</details>':''})()+'<label class=fcl><span><input type=checkbox data-i=gseq'+(S.o.gseq?' checked':'')+'> Belajar grammar tanpa diacak (berurutan sesuai daftar &amp; filter)</span></label>'+(S.o.gseq?(()=>{const i=P.findIndex(g=>g[0]==S.gs);return'<div class=btns><button data-a=gprev>‹ Sebelumnya</button><button class=pri data-a=gnext style="width:auto;flex:2">Grammar berikutnya</button></div>'+(i>=0?'<p class=gsub style="text-align:center">'+(i+1)+' / '+P.length+'</p>':'')})():'<button class=pri data-a=groll>Acak 1 grammar</button>')+'<p></p>'+`<h1>Semua topik (${P.length})</h1>`+
P.slice(0,lim).map(g=>`<div class=row><div data-a=gopen data-k="${esc(g[0])}"><b>${esc(g[4])}</b><br><small>${LN[g[1]]||'Jerman'} ${g[2]}${g[3]?' · '+esc(g[3]):''}${txBdg(g[0])}</small></div><button class="stp stp${st(g[0])}" data-a=cyc data-k="${esc(g[0])}">${STN[st(g[0])]}</button></div>`).join('')+(P.length>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':'')}
let stFeat='';
const STF=[['leech','🪨','Kartu bandel',()=>leechCard()],['eta','⏳','Perkiraan selesai',()=>etaCard()],['fcast','📈','Proyeksi beban',()=>fcastCard()],['gmap','🗺','Peta grammar',()=>gMap()||'<div class=card><small>Belum ada peta grammar.</small></div>']];
function stFeatBar(){let n=0;try{n=lchItems().length}catch(e){}
 return`<div class=stf role=group aria-label="Fitur lain">`+STF.map(([k,i,t])=>`<button class="stfb${stFeat==k?' on':''}" data-a=stf data-v=${k} aria-expanded=${stFeat==k}><span>${i}</span><b>${t}</b>${k=='leech'&&n?`<em>${n}</em>`:''}</button>`).join('')+`</div>`+(stFeat?(STF.find(x=>x[0]==stFeat)||[0,0,0,()=>''])[3]():'')}
function stats(){return kpiCard()+stFeatBar()+fcStatsCard()+heatCard()+actCard()+stats1()}function stats1(){const P=gp(),n=[0,0,0];P.forEach(g=>n[st(g[0])]++);const t=P.length||1;return stats0()+`<div class=card><b>Grammar</b> — ${P.length} topik<div class=bar><i style="width:${n[2]/t*100}%;background:var(--s2)"></i><i style="width:${n[1]/t*100}%;background:var(--s1)"></i></div>Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}</div>`}
function list(){const t=q.toLowerCase();let r=D.C.filter(c=>{const v=vis(c);if(!v)return 0;const k=c[0],ss=[];if(fs!==''&&!Object.keys(v).some(l=>st(ik(k,l))==fs))return 0;
return!t||c[2].toLowerCase().includes(t)||Object.values(v).flat().some(e=>(e[0]+e[1]+(e[4]||'')).toLowerCase().includes(t))});const n=r.length;
return(foc&&K[foc]?`<div class=gsub style="margin:0 0 6px">Dibuka dari bagian lain · <button class="lnk" data-a=wclose>tutup</button></div>`+card(foc,1):'')+
`<div class=sbar><input type=search placeholder="Cari arti, kata, bacaan, atau kalimat buatanmu" value="${esc(q)}" data-i=q><select data-i=fs>${['Semua status',...STN].map((x,i)=>`<option value="${i?i-1:''}"${String(fs)===String(i?i-1:'')?' selected':''}>${x}</option>`).join('')}</select></div><small>${n} kartu${(q||fs!=='')?' · <button class=lnk data-a=lreset>reset filter</button>':''}</small>`+
r.slice(0,lim).map(c=>{const v=vis(c),k=c[0];return`<div class=row><div data-a=wtog data-k="${esc(k)}"><b>${esc(c[2])}</b> <small>${PN[c[1]]}</small><br><small>${Object.entries(v).map(([id,e])=>wd(e[0][0],c[1],'K',id)).join(' · ')}</small>${cxRow(v)}</div><div class=pls>${Object.keys(v).map(l=>{const i=ik(k,l),s=st(i);return`<button class="stp stpl stp${s}" data-a=cyc data-k="${esc(i)}" title="${esc(LN[l])}: ${STN[s]}">${l.toUpperCase()} · ${STN[s]}</button>`}).join('')}</div></div>`+(xo.has(k)?card(k,1):'')}).join('')+(n>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':'')}
function pcard(){const lg=S.legacy,nl=lg?Object.keys(lg.p).length:0,act=[...new Set(S.f.map(x=>String(x).split(':')[0]))];
 return`<div class=card><b>Progres per bahasa</b>`+
 (nl?`<small>${nl} kartu dari progres lama (per kartu) tersimpan sebagai cadangan. Tombol di bawah menyalinnya ke bahasa yang aktif di filter Kata (${act.length?act.map(x=>LN[x]).join(', '):'semua bahasa'}), hanya untuk item yang belum punya status.</small><button data-a=miglg style="width:100%;margin-top:8px">Terapkan progres lama ke bahasa aktif</button>`:'<small>Tidak ada progres lama yang perlu dimigrasi.</small>')+'</div>'}
function set(){return fcSett()+verCard()+vrCard()+vrAppCard()+uiCard()+pcard()+edCard()+gmDataCard()+stoCard()+`<p><small>${ok?'Penyimpanan lokal aktif.':'Penyimpanan lokal tidak tersedia.'} ${Object.keys(S.p).length} kartu bertanda, ${S.lt.h.length} kalimat latihan. Buat cadangan sesekali, karena data browser bisa terhapus.</small></p>`}
/* ===== Flashcard + SRS (algoritma ala Anki / SM-2) ===== */
const FCNUM={gr:[0,100],fmin:[1,4],nl:[0,9999],rl:[0,9999],gi:[1,365],ei:[1,365],se:[130,500],eb:[100,300],hi:[100,200],ni:[0,100],im:[50,200],mx:[1,36500],lch:[2,50],xn:[1,200],xr:[1,500]};
let fcCur=null,fcRevd=false,fcFr='id',fcFrK=null,fcUn=[],fcWait=0;
const fcDay=t=>Math.floor((t-new Date(t).getTimezoneOffset()*60000-144e5)/864e5);VRS.dayFn=fcDay;
const fcSt=(s,d)=>{const a=String(s||'').split(/[\s,;]+/).map(parseFloat).filter(x=>x>0);return a.length?a:d};
const fcRoll=()=>{const d=fcDay(Date.now());if(S.sd.d!==d)S.sd={d,n:0,r:0,x:0,y:0}};
const fresh=()=>({t:0,s:0,e:S.o.se,i:0,d:0,l:0,r:0});
const fcFz=v=>{if(v<3)return v;const d=v<7?1:v<30?Math.max(2,Math.round(v*.15)):Math.max(4,Math.round(v*.05));return Math.max(2,v-d+Math.floor(Math.random()*(2*d+1)))};
function fcFmtD(d){if(d<30)return Math.round(d)+' hr';if(d<365)return(Math.round(d/30*10)/10)+' bln';return(Math.round(d/365*10)/10)+' thn'}
function fcFmt(ms){const m=ms/6e4;if(m<1)return'<1 mnt';if(m<60)return Math.round(m)+' mnt';const h=m/60;if(h<24)return(Math.round(h*10)/10)+' jam';return fcFmtD(h/24)}
/* t: 0 baru, 1 belajar, 2 ulas, 3 belajar ulang | s: langkah | e: ease % | i: interval hari | d: jatuh tempo (ms utk t=1,3; nomor hari utk t=2) | l: lupa | r: jumlah ulasan */
function fcCalc(c,r,now,fz){
 const o=S.o,td=fcDay(now),LS=fcSt(o.ls,[1,10]),RS=fcSt(o.rs,[10]),mx=o.mx,n=c&&c.t?{...c}:fresh();
 n.r=(n.r|0)+1;
 if(n.t!=2){
  const lr=n.t==3,st=lr?RS:LS,len=st.length,cur=n.t==0?0:Math.min(n.s|0,len-1);
  const gr=iv=>{n.t=2;n.s=0;n.i=Math.min(mx,iv);n.d=td+n.i};
  const stay=(idx,min)=>{n.t=lr?3:1;n.s=idx;n.d=now+min*6e4};
  if(r==1)stay(0,st[0]);
  else if(r==2){let m=st[cur];if(cur==0)m=len>1?(st[0]+st[1])/2:Math.min(st[0]*1.5,st[0]+1440);stay(cur,m)}
  else if(r==3){if(cur+1<len)stay(cur+1,st[cur+1]);else gr(lr?Math.max(1,n.i):o.gi)}
  else gr(lr?Math.max(1,n.i)+1:o.ei);
 }else{
  const iv=Math.max(1,n.i|0),late=Math.max(0,td-n.d),m=o.im/100,e=n.e;
  if(r==1){n.l=(n.l|0)+1;n.e=Math.max(130,e-20);n.i=Math.min(mx,Math.max(1,Math.round(iv*o.ni/100)));n.t=3;n.s=0;n.d=now+RS[0]*6e4}
  else{
   const h=Math.max(iv+1,Math.round((iv+(late/4|0))*o.hi/100*m)),g=Math.max(h+1,Math.round((iv+(late/2|0))*e/100*m)),z=Math.max(g+1,Math.round((iv+late)*e/100*o.eb/100*m));
   let v=r==2?h:r==3?g:z;if(fz)v=fcFz(v);
   n.i=Math.min(mx,Math.max(1,v));n.t=2;n.s=0;n.d=td+n.i;
   n.e=r==2?Math.max(130,e-15):r==4?e+15:e;
  }
 }
 return n}
function fcAL(){const ff=S.o.ff,al={};D.L.forEach(l=>{const lv=ff.length?l[4].filter(x=>ff.includes(l[0]+':'+x)):null;if(!ff.length||lv.length)al[l[0]]=lv});return al}
/* v7.19: satu entri per kartu. Kunci kartu = id@bahasa (entri pertama, tidak berubah) atau id@bahasa~n (entri ke-n+1). */
function fcVisE(c,k,al){const v=fcVis(c,al);if(!v)return v;const L=lang(k),i=ent(k),all=c[3][L]||[],e=all[i];if(!v[L]||!e||!v[L].includes(e))return null;const o={};for(const l in v)o[l]=v[l];o[L]=[e];return o}
function fcVis(c,al){al=al||fcAL();const v={},ids=Object.keys(al),o=S.o;let n=0;
 for(const id of ids){const lv=al[id],e=(c[3][id]||[]).filter(x=>!lv||lv.includes(x[3]));if(e.length){v[id]=e;n++}}
 return n&&(o.fm=='and'?n==ids.length:n>=Math.min(o.fmin,ids.length))?v:null}
/* v7.18: petunjuk konteks di sisi depan kartu kosakata (dari kolom “penjelasan konteks singkat”). Kata bahasa target di dalam teks disamarkan.
   Mode otomatis: tampil bila artinya kembar dengan kartu lain di bahasa yang sama atau kartu punya ≥2 kata di bahasa itu. */
let FCX_M=null;
const fcxKey=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
function fcxDup(c,L){if(!FCX_M){FCX_M=new Map();for(const x of D.C){const k0=fcxKey(x[2]);for(const l in x[3]){const k=l+'|'+k0;FCX_M.set(k,(FCX_M.get(k)||0)+1)}}}return(FCX_M.get(L+'|'+fcxKey(c[2]))||0)>1}
function fcxMask(t,L,ens){t=String(t);const cj=L=='zh'||L=='ja',sp=new Set(),stems=[];
 for(const e of ens){if(cj)String(e[1]||'').toLowerCase().split(/[^\p{L}\p{M}]+/u).forEach(x=>{if(x.length>=2)sp.add(x)});
  else String(e[0]||'').toLowerCase().replace(/^(der|die|das|de|het|een|to|sich|zich|the|a|an)\s+/,'').split(/[^\p{L}\p{M}]+/u).forEach(x=>{if(x.length>=3)stems.push(x.slice(0,Math.max(3,Math.ceil(x.length*.7))));else if(x)sp.add(x)})}
 const bl=n=>`<span class="gzb gze gzs" style="--n:${Math.min(Math.max(n,1),6)}">&nbsp;</span>`,re=/([々-〇぀-ヿ㐀-鿿ｦ-ﾟ]+)|([\p{L}\p{M}]+)/gu;let o='',l=0,m;
 while((m=re.exec(t))){o+=esc(t.slice(l,m.index));l=re.lastIndex;
  if(m[1])o+=cj?bl(m[1].length):esc(m[1]);
  else{const w=m[2].toLowerCase(),h=cj?(sp.has(w)||/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(w)):(sp.has(w)||stems.some(s=>w.startsWith(s)));o+=h?bl(w.length):esc(m[2])}}
 return o+esc(t.slice(l))}
function fcxFront(c,L,es){const m=S.o.fcx||'auto';if(m=='off'||!es)return'';const xs=es.filter(e=>e[4]);if(!xs.length)return'';
 if(m=='auto'&&es.length<2&&!fcxDup(c,L))return'';
 return`<div class=fcx><small>💡 Konteks${xs.length>1?' tiap kata':''}</small>${xs.map(e=>`<div>${xs.length>1?'• ':''}${fcxMask(e[4],L,es)}</div>`).join('')}</div>`}
const cxRow=v=>{const xs=Object.entries(v).flatMap(([id,es])=>es.filter(e=>e[4]).map(e=>e));return xs.length?`<div class=cxl>${xs.slice(0,2).map(e=>`<span>${esc(e[0])}: ${esc(e[4])}</span>`).join('')}${xs.length>2?'<span>…</span>':''}</div>`:''};
function fcFront(k){const o=S.o;if(GK[k]||o.fd=='id')return'id';const L=lang(k),v=K[base(k)]&&fcVisE(K[base(k)],k);if(!v||!v[L])return'id';return o.fd=='fo'||Math.random()<.5?L:'id'}
function fcOk(k){const c=S.srs[k];if(c&&c.z)return 0;const o=S.o;
 if(GK[k])return o.deck!='v'&&fcGOk(GK[k]);
 const b=K[base(k)],L=lang(k),v=b&&fcVisE(b,k);return!!v&&!!v[L]&&o.deck!='g'&&(!o.sp.length||o.sp.includes(b[1]))}
function fcPool(){const o=S.o;let a=[];
 if(o.deck!='g')a=fcPoolV();
 if(o.deck!='v')a=a.concat(fcGP().map(g=>g[0]));
 return a.filter(k=>!(S.srs[k]&&S.srs[k].z))}
let fcQC=null;
function fcQ(){fcRoll();const now=Date.now(),td=fcDay(now),o=S.o,sd=S.sd;
 if(!fcQC||fcQC.v!==fcQV||fcQC.td!==td){const R=[],Nw=[],lrn=[];let tm=0;
  for(const k of fcPool()){const c=S.srs[k];if(!c||!c.t){Nw.push(k);continue}
   if(c.t==2){if(c.d<=td)R.push(k);else if(c.d==td+1)tm++}else lrn.push(k)}
  fcQC={v:fcQV,td,R,Nw:fcMixNew(Nw),tm,lrn}}
 const L=[],ah=[];let next=0;
 for(const k of fcQC.lrn){const d=S.srs[k].d;if(d<=now)L.push(k);else if(d<=now+12e5)ah.push(k);else if(!next||d<next)next=d}
 return{L,R:fcQC.R.slice(),Nw:fcQC.Nw.slice(),ah,next,tm:fcQC.tm,nL:Math.max(0,o.nl+(sd.x|0)-sd.n),rL:Math.max(0,o.rl+(sd.y|0)-sd.r)}}
const fcMin=a=>a.reduce((x,y)=>S.srs[x].d<=S.srs[y].d?x:y);
function fcPick(q){const o=S.o;if(q.L.length)return fcMin(q.L);
 const nn=Math.min(q.Nw.length,q.nL),rr=Math.min(q.R.length,q.rL);
 const rp=A=>{const v=A.filter(k=>gmVerN(k)>0),B=v.length?v:A;return B[Math.random()*B.length|0]},pn=()=>{if(o.ord!='rand')return q.Nw[0];if(o.deck=='all'){const G=q.Nw.filter(k=>GK[k]),V=q.Nw.filter(k=>!GK[k]);if(G.length&&V.length){const A=Math.random()<(o.gr==null?25:o.gr)/100?G:V;return rp(A)}}return rp(q.Nw)},pr=()=>q.R[Math.random()*q.R.length|0];
 if(nn&&rr){const useN=o.no=='before'||(o.no=='mix'&&Math.random()<nn/(nn+rr));return useN?pn():pr()}
 if(nn)return pn();if(rr)return pr();if(q.ah.length)return fcMin(q.ah);return null}
function fcSync(k,n){fcQV++;if(!S.o.lk)return;S.p[k]=n.t==2&&n.i>=21?2:1;S.s[k]=1}
function fcFS(k,bulk,force){if(!force&&!S.o.lk)return;const s=st(k),c=S.srs[k],has=c&&c.t,td=fcDay(Date.now()),sp=n=>Math.floor(Math.random()*n),e=S.o.se;
 if(s==0){if(has){if(c.z)S.srs[k]={z:1};else delete S.srs[k]}return}
 if(s==1){
  if(!has)S.srs[k]=Object.assign(c||{},bulk?{t:2,s:0,e,i:2,d:td+sp(3),l:0,r:0}:{t:1,s:0,e,i:0,d:Date.now(),l:0,r:0});
  else if(c.t==2&&c.i>=21){c.i=20;c.d=Math.min(c.d,td+20)}
 }else{
  if(!has)S.srs[k]=Object.assign(c||{},{t:2,s:0,e,i:30,d:td+1+sp(30),l:0,r:0});
  else if(c.t!=2)Object.assign(c,{t:2,s:0,i:Math.max(c.i|0,30),d:td+1+sp(30)});
  else if(c.i<21)c.i=21;
 }}
function fcSyncAll(){let a=0,b=0;
 for(const k in S.p)if(S.p[k]>0&&!(S.srs[k]&&S.srs[k].t)){fcFS(k,1,1);a++}
 for(const k in S.srs){const c=S.srs[k];if(c.t){const v=c.t==2&&c.i>=21?2:1;if(S.p[k]!==v){S.p[k]=v;b++}}}
 return[a,b]}
function fcTag(k){const c=S.srs[k];if(!c||!c.t)return'';if(c.t!=2)return' · belajar';const d=c.d-fcDay(Date.now());return' · ulas '+(d<=0?'hari ini':d==1?'besok':d+' hr')}
function fcAns(r){const k=fcCur;if(!k||!fcRevd)return;fcQV++;fcRoll();const now=Date.now(),td=fcDay(now),c=S.srs[k],had=c&&c.t;
 fcUn.push({k,c:c?{...c}:undefined,sd:{...S.sd},p:S.p[k],td,lg:S.lg[td]?[...S.lg[td]]:undefined});if(fcUn.length>30)fcUn.shift();
 const n=fcCalc(c,r,now,true);if(GK[k])gCap(k,n);S.srs[k]=n;buzz(r==1?[16,40,16]:10);if(r==1&&(n.l|0)==lchN())setTimeout(()=>toast('🪨 Kartu bandel: sudah lupa '+n.l+'×. Tekan “🧠 Mnemonik” untuk prompt khusus kartu ini.'),60);
 if(!had){S.sd.n++;const lg=GK[k]?GK[k][1]:lang(k),w=S.nw[td]||(S.nw[td]={});w[lg]=(w[lg]|0)+1;for(const d in S.nw)if(+d<td-200)delete S.nw[d]}else if(c.t==2)S.sd.r++;
 const L=S.lg[td]||(S.lg[td]=[0,0]);L[0]++;if(r==1)L[1]++;
 for(const d in S.lg)if(+d<td-400)delete S.lg[d];
 fcSync(k,n);fcCur=null;fcRevd=false}
function fcUndo(){const u=fcUn.pop();if(!u)return;fcQV++;if(u.c)S.srs[u.k]=u.c;else{delete S.srs[u.k];const lg=GK[u.k]?GK[u.k][1]:lang(u.k),w=S.nw[u.td];if(w&&w[lg]>0)w[lg]--}S.sd=u.sd;
 if(u.p===undefined)delete S.p[u.k];else S.p[u.k]=u.p;if(u.lg)S.lg[u.td]=u.lg;else delete S.lg[u.td];fcCur=u.k;fcRevd=false;fcFrK=null}
function fcAct(a,x,k){fcQV++;
 if(a=='fcshow'){fcRevd=true;fcAuto()}
 else if(a=='fcans')fcAns(+x);
 else if(a=='fcundo')fcUndo();
 else if(a=='fcxdel'){if(!gmDelSent(k,+x))return}
 else if(a=='fcsusp'){S.srs[k]=Object.assign(S.srs[k]||{},{z:1});fcCur=null}
 else if(a=='fcforget'){delete S.srs[k];if(S.o.lk)delete S.p[k];fcCur=null}
 else if(a=='fcsyncall'){const r=fcSyncAll();toast(r[0]+' status diterapkan ke jadwal kartu, '+r[1]+' status diperbarui dari jadwal kartu.')}
 else if(a=='fcunsusp'){for(const j in S.srs){delete S.srs[j].z;if(!S.srs[j].t)delete S.srs[j]}fcCur=null}
 else if(a=='fcpos'){const sp=S.o.sp.slice();if(x=='all')S.o.sp=[];else{const i=sp.indexOf(x);i<0?sp.push(x):sp.splice(i,1);S.o.sp=sp}fcCur=null}
 else if(a=='fcfl'){const f=S.o.ff.slice(),i=f.indexOf(x);i<0?f.push(x):f.splice(i,1);S.o.ff=f;fcCur=null}
 else if(a=='fcfall'){S.o.ff=[];fcCur=null}
 else if(a=='fcdeck'){S.o.deck=x;fcCur=null}
 else if(a=='fcgall'){S.o.gff=[];fcCur=null}
 else if(a=='fcgl'){const f=S.o.gff.slice(),i=f.indexOf(x);i<0?f.push(x):f.splice(i,1);S.o.gff=f;fcCur=null}
 else if(a=='fcglg'){const xs=D.GL.find(l=>l[0]==x)[3].map(v=>x+':'+v);let f=S.o.gff.slice();f=xs.every(y=>f.includes(y))?f.filter(y=>!xs.includes(y)):f.concat(xs.filter(y=>!f.includes(y)));S.o.gff=f;fcCur=null}
 else if(a=='fcrstf'){S.o.ff=[];S.o.gff=[];S.o.sp=[];S.o.fm='or';S.o.fmin=1;fcCur=null}
 else if(a=='fclg'){const xs=D.L.find(l=>l[0]==x)[4].map(v=>x+':'+v);let f=S.o.ff.slice();f=xs.every(y=>f.includes(y))?f.filter(y=>!xs.includes(y)):f.concat(xs.filter(y=>!f.includes(y)));S.o.ff=f;fcCur=null}
 else if(a=='fcmore')S.sd.x=(S.sd.x|0)+(S.o.xn|0||10);
 else if(a=='fcmoreR')S.sd.y=(S.sd.y|0)+(S.o.xr|0||50);
 else if(a=='fcrst'){if(confirm('Hapus semua jadwal flashcard? (Status Belum/Sedang/Selesai tidak berubah)')){VRS.backup(S,'pre');VRS.force();S.srs={};S.lg={};S.sd={d:-1,n:0,r:0,x:0,y:0};fcUn=[];fcCur=null}}}
function fcSet(i,el){const f=i.slice(3),o=S.o;
 if(FCNUM[f]){const x=parseFloat(el.value);if(isFinite(x))o[f]=Math.min(FCNUM[f][1],Math.max(FCNUM[f][0],x))}
 else if(f=='ls')o.ls=fcSt(el.value,[1,10]).join(' ');
 else if(f=='rs')o.rs=fcSt(el.value,[10]).join(' ');
 else if(f=='lk')o.lk=+el.checked;
 else o[f]=el.value;
 fcCur=null;fcRevd=false}
function fcInfo(c){const b=fcInfo0(c);return b+(c&&!c.z&&(c.l|0)>=lchN()?' · 🪨 bandel':'')}
function fcInfo0(c){if(!c||!c.t)return'Baru';if(c.t==1)return'Belajar';if(c.t==3)return'Belajar ulang';return`Ulas · ${c.i} hr · ease ${c.e}%`+(c.l?` · ${c.l}× lupa`:'')}
function fcBody(k,rev){const g=GK[k];
 if(g){if(gzOn(g)){const pl=typeof gzpRow=='function'?gzpRow(k):null;if(pl)return rev?gzpBack(g,pl)+gzBack(g,k):gzpFront(g,pl);return rev?gzBack(g,k):gzFront(g)}const t=(g[3]?`<div class=gsub>${esc(g[3])}</div>`:'')+`<div class=mean>${esc(g[4])}</div>`;return rev?t+'<hr><div style="text-align:left">'+gbody(g)+gmExBlock(k)+'</div>':t}
 const b=base(k),L=lang(k),c=K[b],v0=fcVisE(c,k)||{},v=v0[L]?{[L]:v0[L]}:v0,f=fcFr,mean=`<div class=mean>${esc(c[2])}</div>`;
 const lc=id=>D.L.find(l=>l[0]==id),ch=(n,col)=>`<span class=fch style="--lc:${col}">${esc(n)}</span>`;
 const blk=(ids,full)=>'<div class=grid>'+D.L.filter(l=>ids.includes(l[0])).map(([id,n,col])=>`<div class=lg style="--lc:${col}"><small>${n}</small>`+v[id].map(e=>`<div class=w>${wd(e[0],c[1],'F',id)}${spk(e[0],id)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}${full?fmx(e,c[1],id):''}${full&&e[2]?`<div class=ex>${esc(e[2])}</div>`:''}${full&&e[4]?`<div class=cx>💡 ${esc(e[4])}</div>`:''}`).join('')+'</div>').join('')+'</div>';
 const vr=typeof gzvRow=='function'?gzvRow(k):null;
 if(rev)return mean+(vr?gzvBack(vr):'')+'<hr>'+blk(Object.keys(v),1)+ggInfo(k)+gmExBlock(k);
 let p,t;
 if(f=='id'||!v[f]){p=mean;t=[ch(LN[L],lc(L)[2])]}
 else{p=`<div class=fcp>${ch(LN[f],lc(f)[2])}`+v[f].map(e=>`<div class=w style="font-size:1.8rem">${wd(e[0],c[1],'F',f)}${spk(e[0],f)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}`).join('')+'</div>';t=[ch('Indonesia','var(--a)')]}
 if(vr)return p+gzvFront(vr);
 return p+`<div class=fchint><small>Ingat dalam:</small>${t.join('')}</div>`+((f=='id'||!v[f])?fcxFront(c,L,v[L]):'')}
const fcN=(f,l,mn,mx)=>`<label class=fcl><span>${l}</span><input type=number inputmode=numeric data-i="fc_${f}" value="${S.o[f]}" min=${mn} max=${mx}></label>`;
const fcS=(f,l,op)=>`<label class=fcl><span>${l}</span><select data-i="fc_${f}" style="width:auto;margin:0">${op.map(([v,t])=>`<option value="${v}"${S.o[f]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
function fcSett(){const o=S.o,sz=Object.values(S.srs).filter(c=>c.z).length;
 return dtag('fs')+'<summary>Pengaturan flashcard</summary><div class=card>'+
 fcS('fd','Sisi depan kartu (kosakata)',[['id','Bahasa Indonesia'],['fo','Bahasa asing (acak)'],['mix','Campur Indonesia & asing']])+
 fcN('nl','Kartu baru per hari',0,9999)+fcN('rl','Maks. ulasan per hari',0,9999)+fcN('xn','Tambahan kartu baru saat target selesai (per ketukan)',1,200)+fcN('xr','Tambahan ulasan saat target selesai (per ketukan)',1,500)+
 fcS('ord','Urutan kartu baru',[['seq','Berurutan'],['rand','Acak']])+
 fcS('no','Kartu baru vs ulasan',[['after','Baru setelah ulasan'],['before','Baru sebelum ulasan'],['mix','Campur']])+
 fcS('gz','Sisi depan kartu grammar (Mandarin, Inggris, Jepang, Jerman &amp; Belanda)',[['cloze','Soal rumpang + fungsi (disarankan)'],['fn','Fungsi saja'],['old','Judul (tampilan lama)']])+
 fcS('gzp','Sumber soal rumpang grammar',[['pl','Pustaka (acak) · cadangan contoh kartu'],['mix','Campur Pustaka &amp; contoh kartu'],['off','Contoh kartu saja']])+
 fcS('gzq','Kalimat Pustaka yang dipakai',[['auto','Bertag AI + terdeteksi otomatis'],['tag','Hanya yang bertag AI']])+
 fcS('gzv','Soal rumpang kartu kosakata dari Pustaka (Jerman/Belanda: artikel + kata benda)',[['on','Aktif (bila ada kalimat Pustaka)'],['off','Mati']])+
 fcS('fcx','Petunjuk konteks di sisi depan kosakata',[['auto','Otomatis (arti kembar / ada beberapa kata)'],['on','Selalu, bila ada'],['off','Jangan tampilkan']])+
 `<label class=fcl><span><input type=checkbox data-i=fc_lk${o.lk?' checked':''}> Integrasikan progres Kartu ↔ Kosakata</span></label><div class=btns><button data-a=fcsyncall>Sinkronkan sekarang</button></div>`+
 dtag('fl')+'<summary>Lanjutan (parameter algoritma)</summary>'+
 `<label class=fcl><span>Langkah belajar (menit)</span><input data-i=fc_ls value="${esc(o.ls)}"></label>`+
 `<label class=fcl><span>Langkah belajar ulang (menit)</span><input data-i=fc_rs value="${esc(o.rs)}"></label>`+
 fcN('gi','Interval lulus (hari)',1,365)+fcN('ei','Interval "Mudah" (hari)',1,365)+fcN('se','Ease awal (%)',130,500)+fcN('eb','Bonus Mudah (%)',100,300)+fcN('hi','Pengali Sulit (%)',100,200)+fcN('ni','Interval setelah lupa (%)',0,100)+fcN('im','Pengubah interval (%)',50,200)+fcN('mx','Interval maksimum (hari)',1,36500)+fcN('lch','Ambang kartu bandel (lupa ≥)',2,50)+'</details>'+
 `<div class=btns>${sz?`<button data-a=fcunsusp>Aktifkan kembali ${sz} kartu ditangguhkan</button>`:''}<button data-a=fcrst>Reset jadwal flashcard</button></div></div></details>`}
function fcDone(q,nn,rr){const now=Date.now();
 if(!fcPool().length)return`<div class="card empty"><b>Tidak ada kartu yang cocok</b>Deck ${DK.find(d=>d[0]==S.o.deck)[1]} dengan filter saat ini tidak punya kartu aktif (kartu yang ditangguhkan tidak dihitung).<div class=btns><button data-a=fcrstf>Reset semua filter</button><button data-a=fcunsusp>Aktifkan lagi yang ditangguhkan</button></div></div>`;
 let h='<div class=card style="text-align:center"><div class=mean>'+(((S.lg[fcDay(Date.now())]||[0])[0]|0)>0?'🎉 ':'')+'Selesai untuk saat ini</div>';
 if(q.next)h+=`<p>Kartu belajar berikutnya muncul sekitar ${fcFmt(q.next-now)} lagi.</p>`;
 h+=`<p><small>Besok: ${q.tm} ulasan terjadwal · Hari ini: ${S.sd.n} baru &amp; ${S.sd.r} ulasan</small></p><div class=btns>`;
 if(q.Nw.length)h+=`<button data-a=fcmore>+${S.o.xn|0||10} kartu baru</button>`;
 if(q.R.length>rr)h+=`<button data-a=fcmoreR>+${S.o.xr|0||50} ulasan</button>`;
 return h+'</div></div>'}
function fcView(){const q=fcQ(),o=S.o,now=Date.now();
 if(!fcCur||!fcOk(fcCur)){fcCur=fcPick(q);fcRevd=false;fcFrK=null;if(fcCur&&String(fcCur).indexOf(SEP)>=0&&!GK[fcCur]&&S.p[fcCur]===undefined){S.p[fcCur]=1;if(ent(fcCur)>0){const k0=base(fcCur)+SEP+lang(fcCur);if(S.p[k0]===undefined)S.p[k0]=1}}}
 if(fcCur&&fcFrK!==fcCur){fcFr=fcFront(fcCur);fcFrK=fcCur;if(typeof gzpRoll=='function')gzpRoll(fcCur)}
 fcWait=fcCur?0:q.next;
 const nn=Math.min(q.Nw.length,q.nL),rr=Math.min(q.R.length,q.rL),ln=q.L.length+(nn+rr?0:q.ah.length);
 let h=fcHero(q,nn,rr)+`<div class=fcc><span class=k1><b>${nn}</b><small>Baru</small></span><span class=k2><b>${ln}</b><small>Belajar</small></span><span class=k3><b>${rr}</b><small>Ulas</small></span></div>`;
 if(fcCur){const k=fcCur,c=S.srs[k],g=GK[k],rev=fcRevd;
  const hd=g?`${LN[g[1]]||'Jerman'} ${g[2]} · Grammar`:PN[K[base(k)][1]]+' · '+(LN[lang(k)]||'');
  h+=`<div class="card fcard"${rev?'':' data-a=fcshow'}><div class=hd><span>${esc(hd)}</span><span class=${c&&c.t?(c.t==2?'k3':'k2'):'k1'}>${fcInfo(c)}</span></div><div class=fcf>${fcBody(k,rev)}</div></div>`;
  h+=rev?`<div class=dock><div class=fcb>${[1,2,3,4].map(r=>{const n=fcCalc(c,r,now,false);return`<button class="fb fb${r}" data-a=fcans data-v=${r}><small>${n.t==2?fcFmtD(n.i):fcFmt(n.d-now)}</small>${['Lagi','Sulit','Baik','Mudah'][r-1]}</button>`}).join('')}</div></div>`:'<div class=dock><button class=pri data-a=fcshow>Tampilkan jawaban</button></div>';
  h+=`<div class=fct><button data-a=fcundo${fcUn.length?'':' disabled'}>Urungkan</button><button data-a=fcsusp data-k="${esc(k)}">Tangguhkan</button>${aiBtn(k,'Kelas AI')}${isLch(k)?`<button class=on data-ai=leech data-k="${esc(k)}">🧠 Mnemonik</button>`:''}${S.lib.some(t=>t.L==(g?g[1]:lang(k)))?`<button data-a=libfind data-k="${esc(k)}">📚 Teks</button>`:''}<button class="${S.ed[g?'g':'v'][g?k:base(k)]?'on':''}" data-a=edit data-k="${esc(g?k:base(k))}" data-v=${g?'g':'v'}>✎ ${S.ed[g?'g':'v'][g?k:base(k)]?'Diedit':'Edit'}</button>${c&&c.t?`<button data-a=fcforget data-k="${esc(k)}">Reset kartu</button>`:''}</div>`}
 else{h+=fcDone(q,nn,rr);fcCelebrate(q,nn,rr)}
 return fcDeckBar()+fcFilt()+h}
function fcStatsCard(){fcRoll();const td=fcDay(Date.now()),P=fcPool(),n={n:0,l:0,y:0,m:0},fc=Array(7).fill(0);
 for(const k of P){const c=S.srs[k];if(!c||!c.t){n.n++;continue}
  if(c.t!=2)n.l++;else{c.i>=21?n.m++:n.y++;const d=c.d-td;if(d<=6)fc[Math.max(0,d)]++}}
 const t=P.length||1,sz=Object.values(S.srs).filter(c=>c.z).length,lg=S.lg[td]||[0,0];let t30=0,a30=0;
 for(let d=td-29;d<=td;d++){const x=S.lg[d];if(x){t30+=x[0];a30+=x[1]}}
 const mv=Math.max(1,...fc),w=x=>x/t*100;
 return`<div class=card><b>Flashcard (SRS)</b> — ${P.length} kartu<div class=bar><i style="width:${w(n.m)}%;background:#1a8a4a"></i><i style="width:${w(n.y)}%;background:#6cc48f"></i><i style="width:${w(n.l)}%;background:var(--s1)"></i></div>Baru ${n.n} · Belajar ${n.l} · Muda ${n.y} · Matang ${n.m}${sz?` · Ditangguhkan ${sz}`:''}<p><small>Hari ini: ${lg[0]} ulasan · 30 hari: ${t30} ulasan${t30?`, ${Math.round((1-a30/t30)*100)}% benar`:''}</small></p></div>`}
document.addEventListener('keydown',e=>{if(tab!='fc'||document.getElementById('edm')||document.getElementById('aim')||e.ctrlKey||e.metaKey||e.altKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 const k=e.key;let go=0;
 if(k=='z'||k=='Z'){fcUndo();go=1}
 else if(fcCur&&!fcRevd&&(k==' '||k=='Enter')){fcRevd=true;fcAuto();go=1}
 else if(fcCur&&fcRevd&&(k==' '||k=='Enter')){fcAns(3);go=1}
 else if(fcCur&&fcRevd&&/^[1-4]$/.test(k)){fcAns(+k);go=1}
 if(go){e.preventDefault();save();render()}});
setInterval(()=>{if(tab=='fc'&&!fcCur&&fcWait&&fcWait<=Date.now()+12e5&&!document.hidden)render()},15000);

{const mf=Object.keys(S.p).concat(Object.keys(S.srs),Object.keys(S.s)).some(k=>k.indexOf(SEP)<0&&K[k]);if(mf){const L=[...new Set(S.f.map(x=>String(x).split(':')[0]))];migKeys(L);save()}}
if(S.o.lk&&!S.o.mig){fcSyncAll();S.o.mig=1;save()}
const ltKnown=(k,L)=>{if(L)k=ik(k,L);return st(k)>0||!!(S.srs[k]&&S.srs[k].t)};

/* === Grammar Tahap 1: rubrik, jadwal dari latihan, kebaruan, Konteks === */
const LT=n=>S.lt[n]||(S.lt[n]={}),GCAP=20,GER=[['B','Bentuk sebelum pola keliru'],['M','Makna keliru'],['N','Nuansa tidak pas'],['T','Tata kata/partikel keliru']];
const GREL0=[['せいで','おかげで','せいで: hasil buruk; おかげで: hasil baik (bisa bernada sindiran).'],['せいで','ために','ために bisa berarti sebab maupun tujuan; せいで khusus sebab dengan hasil buruk.'],['ために','ように','ために: tujuan yang dikendalikan pelaku; ように: keadaan yang ingin dicapai.'],['せいで','ばかりに','ばかりに: satu sebab kecil berakibat buruk, disertai penyesalan.'],['せいで','せいか','せいか: menduga sebab dengan tidak yakin.'],['ばかり','だけ','ばかり: hampir hanya itu (cenderung berlebihan); だけ: hanya / batas jumlah.'],['ばかりか','どころか','ばかりか: tidak hanya A, bahkan B; どころか: bukan A, malah kebalikannya.'],['に対して','について','に対して: terhadap (sasaran/kontras); について: mengenai topik.'],['おかげで','からこそ','おかげで: berkat (fakta); からこそ: justru karena itu (menegaskan alasan).'],['ものの','ながらも','ものの: memang A, tetapi B; ながらも: meskipun A (netral).'],['だけでなく','のみならず','のみならず lebih formal/tulisan; だけでなく umum.'],['にとって','に対して','にとって: bagi (sudut pandang); に対して: terhadap (sasaran).'],['わけにはいかない','わけがない','わけにはいかない: tidak bisa (karena keadaan); わけがない: mustahil.'],['がち','っぽい','がち: cenderung (hal tak diinginkan); っぽい: berkesan / mirip.'],['以上は','からには','keduanya "karena sudah A maka B"; からには menekankan tanggung jawab.'],['ざるを得ない','しかない','ざるを得ない: terpaksa (formal); しかない: tak ada pilihan lain.'],['うちに','最中に','うちに: selagi keadaan masih ada; 最中に: tepat di tengah berlangsung.'],['だけに','だけあって','だけに: karena itu justru; だけあって: sesuai reputasi/kemampuan.'],['わけだ','わけではない','わけだ: berarti / wajar; わけではない: bukan berarti.'],['ことだ','ものだ','ことだ: saran; ものだ: kebenaran umum / kenangan.'],['てならない','てたまらない','てならない: perasaan muncul sendiri; てたまらない: tak tertahankan.'],['くせに','ながらも','くせに: celaan; ながらも: netral.'],['に違いない','に決まっている','に違いない: dugaan kuat dari bukti; に決まっている: pasti.']];
const GT={};D.G.forEach(g=>{if(g[1]=='ja'&&(g[2]=='N3'||g[2]=='N2')&&!GT[g[4]])GT[g[4]]=g});
const GR={};GREL0.forEach(([a,b,n])=>{if(GT[a]&&GT[b]){(GR[GT[a][0]]||(GR[GT[a][0]]=[])).push({o:GT[b][0],n});(GR[GT[b][0]]||(GR[GT[b][0]]=[])).push({o:GT[a][0],n})}});
const gVar=g=>g[4].replace(/[（(][^)）]*[)）]/g,'').split(/\s*[\/／]\s*/).map(x=>x.replace(/[～〜]/g,'').trim()).filter(Boolean);
function gRec(k){const a=LT('a')[k];if(!a||!a.length)return null;let b=0,w=1,t=0;a.slice(-6).reverse().forEach(x=>{b+=w*(x[2]==2?0:x[2]==1?.5:1);t+=w;w*=.8});return b/t}
function gAtt(k,ty,r,er){const a=LT('a')[k]||(LT('a')[k]=[]);a.push([Date.now(),ty,r,er||'']);if(a.length>12)a.shift()}
function gCap(k,n){if(S.o.cp===0||n.t!=2||n.i<=GCAP||(LT('pt')[k]|0)>=2)return;n.i=GCAP;n.d=fcDay(Date.now())+GCAP}
function gSrs(k,m){fcQV++;const c=S.srs[k];if(!c||!c.t||c.z)return;const n=fcCalc(c,m,Date.now(),true);gCap(k,n);S.srs[k]=n;fcSync(k,n)}

/* === v4.3–v4.5 taksonomi grammar (v4.5: + Jerman A1–C1): lihat kartu "Taksonomi grammar" di tab Atur untuk catatan update dan aturan konsistensi === */
const TXG={};for(const k in TX.G)TXG[TX.G[k][0]]=k;
const txT=k=>TX.G[k]?TX.G[k][1].split(' '):[],txL=t=>(TX.T[t]||[0,t])[1],txS=g=>g.startsWith('eo-')||g.startsWith('nl-')||g.startsWith('en-')?g:g.slice(3),txK=s=>TXG[s]||TXG['ja-'+s]||TXG['de-'+s]||TXG['zh-'+s];
(function(){TX.R.forEach(([a,b,ty,n])=>{const x=TXG[a],y=TXG[b];if(!x||!y)return;[[x,y],[y,x]].forEach(([p,q])=>{const l=GR[p]||(GR[p]=[]);if(!l.some(z=>z.o==q))l.push({o:q,n})})})})();
const KM={};(function(){TX.K.forEach((c,i)=>{const m=c[1].map(([s,n])=>[txK(s),n]).filter(x=>x[0]);m.forEach(([a,na])=>{(KM[a]||(KM[a]=[])).push(i);m.forEach(([b,nb])=>{if(a==b)return;const l=GR[a]||(GR[a]=[]);if(!l.some(z=>z.o==b))l.push({o:b,n:txNm(a)+': '+na+' · '+txNm(b)+': '+nb})})})})})();
function cxRel(k){const e=(GR[k]||[]).map(x=>({...x,r:1})),gid=TX.G[k]&&TX.G[k][0];if(!gid)return e;const my=txT(k),have=new Set(e.map(x=>x.o));
 (TX.N[txS(gid)]||[]).forEach(s=>{const o=txK(s);if(!o||have.has(o))return;have.add(o);const sh=txT(o).filter(t=>t.startsWith('fn.')&&my.includes(t)).map(txL);e.push({o,n:'Mirip: berbagi '+(sh.join(', ')||'fungsi')+'.',r:0})});return e}
function txLine(k){const t=txT(k);if(!t.length)return'';const gid=TX.G[k][0],nb=(TX.N[txS(gid)]||[]).map(txK).filter(Boolean).map(o=>GK[o]&&txNm(o));
 return`<div class=gsub style="margin-top:6px">Fungsi: ${t.filter(x=>x.startsWith('fn.')).map(x=>esc(txL(x))).join(' · ')}${txPri(k)?' · Prioritas: '+PRIL[txPri(k)]:''}${t.some(x=>x.startsWith('att.'))?' · Sebelum pola: '+t.filter(x=>x.startsWith('att.')).map(x=>esc(txL(x))).join(', '):''}${t.some(x=>/^(kas|gen|pos|slot|cls|fin|ser|kol|afk)\./.test(x))?' · '+t.filter(x=>/^(kas|gen|pos|slot|cls|fin|ser|kol|afk)\./.test(x)).map(x=>esc(txL(x))).join(', '):''}${nb.length?'<br>Mirip: '+nb.map(esc).join(', '):''}</div>`}
/* === v4.4 taksonomi N5–N1: prioritas, tangga fungsi, kluster, prasyarat, rekomendasi, peta === */
const TXLG=['zh','ja','de','eo','nl','en'],TXLV={zh:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5'],ja:['N5','N4','N3','N2','N1'],de:['A1','A2','B1','B2','C1'],eo:['A1','A2','B1','B2','C1','C2'],nl:['A1','A2','B1','B2','C1','C2'],en:['A1','A2','B1','B2','C1','C2']},TXLN={zh:'Mandarin',ja:'Jepang',de:'Jerman',eo:'Esperanto',nl:'Belanda',en:'Inggris'},PRIL={1:'Inti',2:'Umum',3:'Jarang'};D.GL.forEach(l=>{if(TXLV[l[0]])TXLV[l[0]]=l[3].slice()});
const txLgs=()=>TXLG.filter(l=>!S.gf.length||S.gf.some(x=>x.startsWith(l+':')));
function txNm(k){const g=GK[k];if(g[1]!='de'&&g[1]!='nl'&&g[1]!='en')return(g[1]=='zh'||g[1]=='eo')&&g[4].length>42?g[4].slice(0,40)+'…':g[4];if((g[3]||'').trim()=='Preposisi'){const d=(g[5]||'').replace(/\s+/g,' ').trim();return g[4]+(d?' — '+(d.length>38?d.slice(0,36)+'…':d):'')}
 const c=(g[3]||'').split(' › ').pop().replace(/\s*\$\\rightarrow\$\s*/g,'→').replace(/^[\d.\s&-]+/,'').replace(/\s+/g,' ').trim();return g[4]+(c&&c!=g[4]?' · '+(c.length>30?c.slice(0,28)+'…':c):'')}
const txPri=k=>{const t=txT(k).find(x=>x.startsWith('pri.'));return t=='pri.core'?1:t=='pri.common'?2:t=='pri.rare'?3:0};
const txFn=k=>txT(k).filter(x=>x.startsWith('fn.')),txDom=t=>(TX.T[t]||['',''])[0]||t,txSh=t=>txL(t).replace(/\s*\(.*$/,'');
const lvI=k=>(TXLV[GK[k][1]]||[]).indexOf(GK[k][2]),txIx=(lg,t)=>(TXI[t]||[]).filter(k=>GK[k][1]==lg),txBdg=k=>TX.G[k]?' · '+PRIL[txPri(k)]:'';
const TXI={},PRK={},PRR={};
Object.keys(TX.G).forEach(k=>{if(GK[k])txFn(k).forEach(t=>(TXI[t]||(TXI[t]=[])).push(k))});
Object.keys(TX.P).forEach(a=>{const x=txK(a);if(!x)return;PRK[x]=TX.P[a].map(txK).filter(Boolean);PRK[x].forEach(p=>(PRR[p]||(PRR[p]=[])).push(x))});
function txOk(k){const p=S.o.gpri,f=S.o.gfn;if(!p&&!f)return true;if(!TX.G[k])return false;if(p&&txPri(k)!=+p)return false;if(f&&!txFn(k).some(t=>txDom(t)==f))return false;return true}
function gTax(k){if(!TX.G[k])return'';const fn=txFn(k),t=txT(k),pr=txPri(k),reg=t.find(x=>x.startsWith('reg.')),nu=t.filter(x=>x.startsWith('nu.')),as=t.filter(x=>/^(kas|gen|pos|slot|cls|fin|ser|kol|afk)\./.test(x)),lg=GK[k][1],LV=TXLV[lg]||[];
 const dot=o=>`<i class="dot dot${st(o)}"></i>`,chip=(o,on)=>`<button class="chip${on?' on':''}" data-a=gopen data-k="${esc(o)}">${dot(o)}${esc(txNm(o))} <small>${GK[o][2]}${txBdg(o)}</small></button>`;
 let h=dtag('gtx')+`<summary>Taksonomi · tangga · kluster</summary><div class=gsub style="margin:0 0 8px">Fungsi: ${fn.map(x=>esc(txL(x))).join(' · ')} · Prioritas: ${PRIL[pr]}${reg?' · '+esc(txL(reg)):''}${nu.length?' · '+nu.map(x=>esc(txL(x))).join(', '):''}${as.length?' · '+as.map(x=>esc(txL(x))).join(', '):''}</div>`;
 const L=fn[0],lad=txIx(lg,L).slice().sort((a,b)=>lvI(a)-lvI(b)||txPri(a)-txPri(b));
 if(lad.length>1)h+=`<div class=gsec style="margin-top:6px">Tangga: ${esc(txSh(L))} (${LV[0]} → ${LV[LV.length-1]})</div><div class=chips>${lad.slice(0,30).map(o=>chip(o,o==k)).join('')}</div>`+(lad.length>30?`<small>+${lad.length-30} lagi</small>`:'');
 (KM[k]||[]).forEach(i=>{const c=TX.K[i];h+=`<div class=gsec style="margin-top:10px">Sering tertukar: ${esc(c[0])}</div>`+c[1].map(([s,n])=>[txK(s),n]).filter(x=>x[0]).map(([o,n])=>`<div class=gsub style="margin:3px 0${o==k?';font-weight:650':''}"><b data-a=gopen data-k="${esc(o)}" style="cursor:pointer;text-decoration:underline dotted">${esc(txNm(o))}</b> <small>${GK[o][2]}${o==k?' · ini':''}</small> — ${esc(n)}</div>`).join('')});
 const pk=PRK[k]||[],pb=PRR[k]||[];
 if(pk.length)h+=`<div class=gsec style="margin-top:10px">Kuasai dulu</div><div class=chips>${pk.map(o=>chip(o)).join('')}</div>`;
 if(pb.length)h+=`<div class=gsec style="margin-top:6px">Jadi dasar untuk</div><div class=chips>${pb.slice(0,12).map(o=>chip(o)).join('')}</div>`;
 return h+'</details>'}
function gTaxFilt(){const lgs=txLgs(),cnt={};Object.keys(TX.G).forEach(k=>{if(GK[k]&&lgs.includes(GK[k][1]))new Set(txFn(k).map(txDom)).forEach(d=>(cnt[d]||(cnt[d]=new Set())).add(k))});
 return'<small>Prioritas (per bahasa)</small><div class=chips>'+[['','Semua'],['1','Inti'],['2','Umum'],['3','Jarang']].map(([v,x])=>`<button class="chip${(S.o.gpri||'')==v?' on':''}" data-a=ui data-k=gpri data-v="${v}">${x}</button>`).join('')+'</div><small>Fungsi (per bahasa)</small><select data-i=ui_gfn><option value="">Semua fungsi</option>'+Object.keys(cnt).sort((a,b)=>txSh(a).localeCompare(txSh(b),'id')).map(d=>`<option value="${d}"${S.o.gfn==d?' selected':''}>${esc(txSh(d))} (${cnt[d].size})</option>`).join('')+'</select>'}
/* Rekomendasi: Inti dulu, celah level bawah, lanjutkan yang Sedang, kontinuitas fungsi, pembeda kluster, prasyarat */
function gNxt(n,lg){const LV=TXLV[lg],ks=Object.keys(TX.G).filter(k=>GK[k]&&GK[k][1]==lg);if(!ks.length)return{cur:0,pc:1,list:[]};
 const kn=k=>ltKnown(k),core=l=>ks.filter(k=>GK[k][2]==l&&txPri(k)==1);
 let cur=LV.length-1,pc=1;for(let i=0;i<LV.length;i++){const c=core(LV[i]);if(!c.length)continue;const r=c.filter(kn).length/c.length;if(r<.8){cur=i;pc=r;break}}
 const dm={},tc={};ks.forEach(k=>{if(st(k)==1){const d=txDom(txFn(k)[0]);dm[d]=1}if(kn(k))(KM[k]||[]).forEach(i=>tc[i]=k)});
 const sc={},rs={},bs={};
 ks.forEach((k,ix)=>{if(st(k)==2)return;const li=lvI(k);if(li>cur)return;const pr=txPri(k);let s=pr==1?4:pr==2?2.5:1;const r=[];
  if(li<cur){s+=1.2;r.push('celah di level lebih rendah')}
  if(st(k)==1){s+=1.5;r.push('sedang dipelajari')}
  if(dm[txDom(txFn(k)[0])])s+=.8;
  const ci=(KM[k]||[]).find(i=>tc[i]&&tc[i]!=k);if(ci!=null){s+=.6;r.push('pembeda dengan '+txNm(tc[ci]))}
  const ms=(PRK[k]||[]).filter(p=>!kn(p));if(ms.length){s-=3;r.push('kuasai dulu: '+ms.map(p=>txNm(p)).join(', '));ms.forEach(p=>bs[p]=(bs[p]||0)+1)}
  sc[k]=s-ix*1e-4;rs[k]=r});
 Object.keys(bs).forEach(p=>{if(sc[p]!=null)sc[p]+=bs[p]});
 return{cur,pc,list:Object.keys(sc).sort((a,b)=>sc[b]-sc[a]).slice(0,n).map(k=>({k,r:rs[k]}))}}
function gNxtCard(){return txLgs().map(lg=>{const o=gNxt(5,lg);if(!o.list.length)return'';
 return dtag('gnx'+lg)+`<summary>Rekomendasi berikutnya (${TXLN[lg]})<i class=cnt>${TXLV[lg][o.cur]}</i></summary><small>Fokus level ${TXLV[lg][o.cur]}: ${Math.round(o.pc*100)}% grammar Inti sudah disentuh. Urutan: Inti dulu, celah level bawah, lanjutkan yang Sedang, prasyarat terpenuhi.</small>`+o.list.map(({k,r})=>`<div class=row><div data-a=gopen data-k="${esc(k)}"><b>${esc(txNm(k))}</b><br><small>${GK[k][2]} · ${PRIL[txPri(k)]} · ${esc(txSh(txFn(k)[0]))}${r.length?' · '+esc(r.join(' · ')):''}</small></div><button class="stp stp${st(k)}" data-a=cyc data-k="${esc(k)}">${STN[st(k)]}</button></div>`).join('')+'</details>'}).join('')}
function gMap(){return TXLG.map(gMap1).join('')}
function gMap1(lg){const LV=TXLV[lg],ks=Object.keys(TX.G).filter(k=>GK[k]&&GK[k][1]==lg);if(!ks.length)return'';
 const lv=LV.map(l=>{const a=ks.filter(k=>GK[k][2]==l),c=a.filter(k=>txPri(k)==1);return{l,n:a.length,d:a.filter(k=>st(k)==2).length,s:a.filter(k=>st(k)==1).length,cn:c.length,cd:c.filter(k=>st(k)==2).length,ck:c.filter(ltKnown).length}});
 let h=`<div class=card><b>Peta grammar ${TXLN[lg]}</b> — ${ks.length} pola, ${LV[0]}–${LV[LV.length-1]}`+lv.map(x=>`<div style="margin:10px 0 0"><b>${x.l}</b> <small>${x.d} selesai · ${x.s} sedang · dari ${x.n} · ${x.cn?`Inti ${x.cd}/${x.cn} selesai (${x.ck} tersentuh)`:'tanpa pola Inti'}</small><div class=bar style="margin:4px 0 2px"><i style="width:${x.d/x.n*100}%;background:var(--s2)"></i><i style="width:${x.s/x.n*100}%;background:var(--s1)"></i></div></div>`).join('');
 const seen=new Set(),gaps=[];Object.keys(TXI).forEach(t=>{const a=txIx(lg,t),tk=a.filter(ltKnown);if(!tk.length)return;const hi=Math.max(...tk.map(lvI));if(hi<1)return;const top=tk.find(x=>lvI(x)==hi);a.forEach(k=>{if(seen.has(k)||ltKnown(k)||lvI(k)>=hi||txPri(k)>2)return;seen.add(k);gaps.push({k,t,top})})});
 gaps.sort((a,b)=>txPri(a.k)-txPri(b.k)||lvI(a.k)-lvI(b.k));
 h+='<div class=gsec>Celah di tangga fungsi</div>'+(gaps.length?gaps.slice(0,6).map(({k,t,top})=>`<div class=row><div data-a=gopen data-k="${esc(k)}"><b>${esc(txNm(k))}</b> <small>${GK[k][2]} · ${PRIL[txPri(k)]}</small><br><small>${esc(txSh(t))}: kamu sudah menyentuh ${esc(txNm(top))} (${GK[top][2]}), tetapi ini belum</small></div><button class="stp stp${st(k)}" data-a=cyc data-k="${esc(k)}">${STN[st(k)]}</button></div>`).join('')+(gaps.length>6?`<small>+${gaps.length-6} celah lain</small>`:''):'<small>Belum ada celah terdeteksi (butuh grammar di level '+LV[1]+' atau lebih tinggi yang sudah disentuh).</small>');
 h+='</div>';
 const dm={};ks.forEach(k=>{const d=txDom(txFn(k)[0]),l=GK[k][2];((dm[d]||(dm[d]={}))[l]||(dm[d][l]=[])).push(k)});
 const body=Object.keys(dm).sort((a,b)=>txSh(a).localeCompare(txSh(b),'id')).map(d=>`<tr><th data-a=gmap data-k="${lg}:|${d}" title="${esc(txL(d))}">${esc(txSh(d))}</th>`+LV.map(l=>{const a=dm[d][l]||[];if(!a.length)return'<td>·</td>';const dn=a.filter(k=>st(k)==2).length,sd=a.filter(k=>st(k)==1).length;return`<td class=c data-a=gmap data-k="${lg}:${l}|${d}" style="background:color-mix(in srgb,var(--s2) ${Math.round((dn+sd*.5)/a.length*75)}%,var(--c2))">${dn}/${a.length}</td>`}).join('')+'</tr>').join('');
 return h+dtag('gmap'+lg)+'<summary>Matriks fungsi × level ('+TXLN[lg]+')</summary><table class=gm><thead><tr><th></th>'+LV.map(l=>`<th>${l}</th>`).join('')+'</tr></thead><tbody>'+body+'</tbody></table></details>'}
function txCheck(){const o=[],T=TX.T,gs=Object.keys(TX.G),ids=gs.map(k=>TX.G[k][0]);
 const ck=(ok,m)=>o.push([ok,m]);
 ck(new Set(ids).size==ids.length,'gid unik ('+ids.length+' pola)');
 const nl=gs.filter(k=>!GK[k]);ck(!nl.length,'legacy_id cocok dengan ID di aplikasi'+(nl.length?': '+nl.length+' tidak cocok':''));
 const bt=[];gs.forEach(k=>txT(k).forEach(t=>{if(!T[t])bt.push(t)}));ck(!bt.length,'semua tag terdaftar'+(bt.length?': '+[...new Set(bt)].slice(0,5).join(', '):''));
 const bp=Object.keys(T).filter(t=>T[t][0]&&!T[T[t][0]]);ck(!bp.length,'semua induk tag ada'+(bp.length?': '+bp.slice(0,5).join(', '):''));
 const nf=gs.filter(k=>!txT(k).some(t=>t.startsWith('fn.')));ck(!nf.length,'tiap pola punya fn primary'+(nf.length?': '+nf.length+' pola tanpa fn':''));
 const cnt={};gs.forEach(k=>txT(k).forEach(t=>cnt[t]=(cnt[t]||0)+1));const par=new Set(Object.values(T).map(x=>x[0]));
 const one=Object.keys(cnt).filter(t=>cnt[t]<2&&!par.has(t));ck(!one.length,'tidak ada tag daun yang hanya dipakai 1 pola'+(one.length?': '+one.slice(0,5).join(', '):''));
 const br=TX.R.filter(([a,b])=>!TXG[a]||!TXG[b]||a==b);ck(!br.length,'ujung relasi ada ('+TX.R.length+' pasangan)'+(br.length?': '+br.length+' rusak':''));
 const bn=Object.keys(TX.N).filter(a=>!txK(a)||TX.N[a].some(b=>!txK(b)));ck(!bn.length,'tetangga valid'+(bn.length?': '+bn.length+' rusak':''));
 TXLG.forEach(lg=>{const ja=D.G.filter(g=>g[1]==lg),mi=ja.filter(g=>!TX.G[g[0]]),V=TXLV[lg];ck(!mi.length,'semua grammar '+TXLN[lg]+' di aplikasi bertaksonomi ('+ja.length+' pola, '+V[0]+'–'+V[V.length-1]+')'+(mi.length?': '+mi.length+' belum, mis. '+mi.slice(0,3).map(g=>g[4]).join(', '):''))});
 const xl=TX.K.filter(c=>new Set(c[1].map(([s])=>txK(s)).filter(Boolean).map(k=>GK[k][1])).size>1).map(c=>c[0]);ck(!xl.length,'kluster tidak lintas bahasa'+(xl.length?': '+xl.slice(0,3).join(', '):''));
 const np=gs.filter(k=>!txPri(k));ck(!np.length,'tiap pola punya prioritas (Inti/Umum/Jarang)'+(np.length?': '+np.length+' tanpa':''));
 const bk=[];TX.K.forEach(c=>c[1].forEach(([s])=>{if(!txK(s))bk.push(s)}));ck(!bk.length,'kluster tertukar valid ('+TX.K.length+' kluster)'+(bk.length?': '+bk.length+' id rusak':''));
 const bp2=[];Object.keys(TX.P).forEach(a=>{if(!txK(a))bp2.push(a);TX.P[a].forEach(b=>{if(!txK(b)||b==a)bp2.push(a+'<'+b)})});ck(!bp2.length,'prasyarat valid ('+Object.values(TX.P).reduce((x,y)=>x+y.length,0)+' relasi)'+(bp2.length?': '+bp2.length+' rusak':''));
 const cyc=[];Object.keys(TX.P).forEach(a=>TX.P[a].forEach(b=>{if(lvI(txK(b))>lvI(txK(a)))cyc.push(a+'<'+b);if((TX.P[b]||[]).includes(a))cyc.push(a+'<>'+b)}));ck(!cyc.length,'prasyarat tidak mengarah ke level lebih tinggi / melingkar'+(cyc.length?': '+cyc.length:''));
 const orph=Object.keys(S.srs).filter(k=>k.startsWith('g|')&&!GK[k]).length;ck(!orph,'tidak ada progres grammar yatim'+(orph?': '+orph:''));return o}
function txCard(){return`<div class=card><b>Taksonomi grammar (Mandarin HSK 1–5 · Jepang N5–N1 · Jerman A1–C1 · Esperanto A1–C2 · Belanda A1–C2 · Inggris A1–C2)</b><div style="margin:6px 0">${txCheck().map(([ok,m])=>`<div><small>${ok?'✓':'✗'} ${esc(m)}</small></div>`).join('')}</div><details><summary>Catatan update &amp; aturan konsistensi</summary><div style="font-size:.85rem;line-height:1.5;margin-top:6px"><p><b>v7.6 — bahasa Inggris</b></p><ul><li><b>Kosakata Inggris (EN)</b>: 10.103 entri A1–C2 (dengan IPA di kolom bacaan) digabung ke kartu yang sudah ada; 3.755 kartu baru. Bentuk jamak, 3sg · past · participle · -ing, dan komparatif · superlatif (tabel DXE) bisa disensor.</li><li><b>Grammar Inggris</b>: 623 pola A1–C2, ID progres <code>g|en|A1|judul</code>, gid <code>en-a1-001</code> … <code>en-c2-020</code>, lengkap dengan fungsi, prioritas (Inti 139 · Umum 411 · Jarang 73), register, 5 tetangga, 46 kluster tertukar, 25 pasangan kontras, dan prasyarat.</li><li>Kelas AI, Pustaka (pencocok bentuk kata, suara en-US, deteksi bahasa), penghubung grammar ⇄ Pustaka (kala, pasif, modal, kondisional …), Latihan kalimat, Statistik, dan onboarding kini mendukung Inggris.</li></ul><p><b>v4.8 — kosakata Belanda &amp; bacaan Esperanto</b></p><ul><li><b>Kosakata Belanda (NL)</b>: 4.998 entri A1–B2 digabung ke kartu yang sudah ada (kata berarti sama berbagi kartu dengan bahasa lain; 1.294 kartu baru), lengkap dengan de/het, bentuk jamak, bentuk kata kerja (hij/zij/het · verleden · voltooid), dan komparatif kata sifat (sensor di ⚙ Sensor). Suara nl-NL, Latihan kalimat, Flashcard, Daftar, dan Statistik kini mendukung Belanda.</li><li><b>Bacaan Esperanto</b>: 61 teks per pelajaran (A1–C2) di tab Belajar → Bacaan, dengan terjemahan per kalimat (bisa disensor), suara, penanda sudah dibaca, dan ringkasan di Statistik.</li></ul><p><b>v4.7 — taksonomi grammar Belanda A1–C2</b></p><ul><li>Bahasa Belanda ditambahkan ke tab Grammar (belum ada sebelumnya): 380 pola dari sheet NL (A1 80, A2 84, B1 59, B2 63, C1 51, C2 43), ID progres <code>g|nl|A1|judul</code> (judul kembar diberi <code>#2</code>). Tanda rujukan "(Ref. §…)" dari sumber dibuang. (Kosakata Belanda ditambahkan di v4.8.)</li><li>Seluruh pola bertaksonomi dengan kerangka yang sama dengan Jerman: gid <code>nl-a1-001</code> … <code>nl-c2-043</code>, fungsi (fn), prioritas (Inti 220 · Umum 134 · Jarang 26), register, nuansa. ID pendek tetangga / kluster / prasyarat memakai gid penuh (<code>nl-a1-001</code>) seperti Esperanto; <code>txS</code> menanganinya.</li><li>Pohon fn dipakai bersama: tag lintas bahasa dipakai ulang (sebab, syarat, waktu, pasif, tujuan, perbandingan, Preposisi tuntutan …) dan 30 tag baru khusus Belanda (kata kerja lemah / kuat / tak beraturan, kata bantu zijn / hebben, fungsi <i>er</i>, partikel modal, pertanyaan tak langsung, gender de / het, idiom, variasi regional, surat, dll.). 32 label tag bersama dinetralkan agar cocok untuk Jerman dan Belanda (mis. Perfekt / perfectum, Präteritum / imperfectum).</li><li>Aspek khusus Belanda: <b>Gender</b> (<code>gen.de</code> de-woord, <code>gen.het</code> het-woord, <code>gen.pl</code> jamak), <b>Posisi kata kerja</b> (<code>pos.*</code>, dipakai bersama Jerman), dan sisa <b>Kasus</b> (<code>kas.gen</code>, <code>kas.dat</code> pada C2). Tampil di baris taksonomi kartu grammar.</li><li>43 kluster tertukar (want / omdat / doordat, als / toen, geen / niet / wél, de-woord / het-woord, perfectum / imperfectum, fungsi er, partikel modal …), 30 pasangan kontras / tertukar, 238 relasi prasyarat (tidak ada yang mengarah ke level lebih tinggi atau melingkar).</li><li>Tabel konjugasi Belanda (Ik · Jij / U · Hij / Zij / Het · Wij · Jullie · Zij) tampil sebagai tabel di kartu grammar. Nama pola Belanda di daftar tetangga / kluster ditambah konteks sub-bab (seperti Jerman). Tombol <i>Latih grammar ini</i> disembunyikan untuk bahasa yang belum punya Latihan kalimat.</li><li>Tag fungsi <code>fn.tense.praeteritum</code> tampil sebagai fungsi kedua pada kata kerja lemah / kuat / bantu supaya tangga kala tetap terlihat; pola kata kerja kuat B2 juga membawa <code>fn.verbform.participle</code>.</li></ul><p><b>v4.6 — taksonomi grammar Mandarin HSK 1–5 &amp; Esperanto A1–C2</b></p><ul><li>Seluruh 439 pola Mandarin (HSK 1 86, HSK 2 125, HSK 3 81, HSK 4 76, HSK 5 71) dan 266 pola Esperanto (A1 44, A2 55, B1 60, B2 46, C1 29, C2 32) kini bertaksonomi: gid <code>zh-h1-001</code> … <code>zh-h5-071</code> dan <code>eo-a1-001</code> … <code>eo-c2-032</code>, fungsi (fn), prioritas, register, nuansa. ID progres lama TIDAK berubah.</li><li>Aspek khusus Mandarin: <b>slot</b> (posisi pola dalam kalimat) dan <b>cls</b> (kelas kata / jenis struktur). Aspek khusus Esperanto: <b>fin</b> (akhiran), <b>ser</b> &amp; <b>kol</b> (tabel korelatif), <b>afk</b> (afiks). Tampil di baris taksonomi kartu grammar.</li><li>86 kluster tertukar Mandarin (termasuk kluster <i>Kembar</i> untuk entri HSK 1–2 yang membahas topik sama) dan 42 kluster Esperanto; 31 + 26 pasangan kontras; 149 + 224 relasi prasyarat.</li><li>ID pendek tetangga / kluster / prasyarat untuk Esperanto memakai gid penuh (<code>eo-a1-001</code>) agar tidak bentrok dengan Jerman (<code>a1-001</code>); fungsi <code>txS</code> dan <code>txK</code> menanganinya.</li><li>Mandarin belum punya pola HSK 6 di aplikasi.</li><li>Tag fungsi yang hanya dipakai 1 pola digabung ke tag induknya agar lolos aturan konsistensi (mis. fn.tense.*, fn.wordclass.*, fn.sentence.*); versi lengkap tetap ada di berkas xlsx.</li><li>Filter Prioritas &amp; Fungsi, Rekomendasi, dan Peta grammar kini berlaku untuk empat bahasa. Latihan Konteks tetap khusus pola yang punya contoh kalimat.</li></ul><p><b>v4.5 — taksonomi grammar Jerman A1–C1</b></p><ul><li>Taksonomi Jerman memakai kerangka yang sama dengan Jepang: seluruh 386 pola Jerman di aplikasi (A1 102, A2 93, B1 134, B2 30, C1 27) punya gid <code>de-a1-001</code> … <code>de-c1-027</code>, fungsi (fn), prioritas Inti / Umum / Jarang, dan register. ID progres lama (<code>g|de|A1|judul</code>) TIDAK berubah.</li><li>Pohon fn dipakai bersama: tag lintas bahasa (sebab, syarat, waktu, perintah, izin, keinginan, pasif, tujuan, topik, dasar, pengecualian …) dipakai ulang, ditambah tag khusus Jerman (bentuk kata kerja, kala, kasus &amp; deklinasi, deklinasi kata sifat, kalimat &amp; klausa, tempat &amp; arah, dll.). Preposisi diberi fn menurut maknanya, bukan menurut kata preposisinya.</li><li>Pengganti aspek <i>Sebelum pola</i> untuk Jerman: <b>Kasus</b>, <b>Gender / jamak</b>, <b>Posisi kata kerja</b>; tampil di baris taksonomi kartu grammar.</li><li>52 kluster tertukar (weil / denn, von / durch pada pasif, wegen / trotz / während, mit / durch / mittels …), 23 pasangan kontras (termasuk 9 pasangan Dativ posisi diam vs Akkusativ gerakan), 230 relasi prasyarat.</li><li>Filter Prioritas &amp; Fungsi, kartu Rekomendasi berikutnya, dan Peta grammar kini berlaku per bahasa (Mandarin, Jepang, Jerman, Esperanto). Level Jerman mengikuti daftar level di aplikasi (A1–C1); C2 otomatis ikut bila pola C2 ditambahkan (gid <code>de-c2-nnn</code>).</li><li>Latihan Konteks tetap khusus pola yang punya contoh kalimat (Jepang); pola Jerman belum punya contoh kalimat.</li></ul><p><b>v4.4 — taksonomi grammar N5–N1 + alat progres</b></p><ul><li>Taksonomi diperluas dari N5–N3 (398 pola) ke seluruh grammar Jepang di aplikasi: N5–N1 = 848 pola (N2 197, N1 253 baru). ID progres lama (<code>g|ja|N3|judul</code>) TIDAK berubah.</li><li>Fungsi (fn) diperhalus supaya pola bernuansa beda tidak tercampur: sebab dipecah (umum, alasan lembut, sebab+penilaian, ditekankan, pemicu), penambahan (plus / bukan hanya), daftar (contoh / pasangan), bahkan vs penekanan, hasil akhir vs gagal, serta fungsi baru: kebalikan, tanpa memandang, kecuali / kesampingkan, dasar &amp; kesesuaian, penilaian (wajar / layak), tak mempedulikan, puncak perasaan, nyaris, mencapai tahap, mending, terpaksa, seluruh.</li><li>Facet baru <b>Prioritas</b>: Inti / Umum / Jarang untuk tiap pola (penilaian editor, bukan statistik frekuensi). Register diaudit manual dan ditambah sastra / maskulin / feminin.</li><li><b>Kluster tertukar</b>: 86 kelompok pola yang sering salah pakai (mis. せいで/おかげで/ばかりに/せいか), tiap anggota diberi selisih nuansa. Dipakai sebagai pengecoh di latihan Konteks dan ditampilkan di kartu grammar.</li><li><b>Prasyarat</b>: 162 relasi "kuasai dulu" (mis. させられる ← させる + 受身形), dipakai untuk rekomendasi.</li><li>Kartu grammar: blok <i>Taksonomi · tangga · kluster</i> (fungsi, prioritas, tangga fungsi N5→N1 dengan status tiap pola, kluster, prasyarat; semua bisa diketuk).</li><li>Tab Grammar: filter <i>Prioritas</i> dan <i>Fungsi</i>; kartu <i>Rekomendasi berikutnya</i> (fungsi <code>gNxt</code>): fokus ke level terendah yang Inti-nya belum 80% tersentuh; skor = prioritas + celah level bawah + sedang dipelajari + kontinuitas fungsi + pembeda kluster − prasyarat belum dikuasai (prasyaratnya ikut naik).</li><li>Tab Statistik: kartu <i>Peta grammar Jepang</i> (<code>gMap</code>): progres per level + Inti, <i>celah di tangga fungsi</i> (kamu sudah menyentuh pola level tinggi dalam satu fungsi tetapi pola level bawahnya belum), dan matriks fungsi × level yang bisa diketuk untuk memfilter daftar.</li><li>Data <code>TX</code> kini: T=tag, G=pola→[gid, tag], N=tetangga (848 pola), K=kluster, P=prasyarat, R=relasi tertulis lama. Aturan: induk tag tidak dipakai sebagai daun; tiap pola punya 1 fn primary dan 1 prioritas.</li><li>Kartu pemeriksaan ini ditambah: semua grammar Jepang bertaksonomi, prioritas lengkap, kluster &amp; prasyarat valid, prasyarat tidak melingkar.</li></ul><p><b>v4.3 — taksonomi grammar (Jepang N5–N3)</b></p><ul><li>Data <code>TX</code> (T=tag, G=pola→[gid, tag], N=tetangga, R=relasi) ditanam di script; ID progres lama (<code>g|ja|N3|judul</code>) TIDAK berubah.</li><li>Latihan Konteks: pilihan jawaban = relasi tertulis dulu, lalu tetangga bertag fungsi sama (<code>cxRel</code>).</li><li>Layar Periksa Latihan kalimat menampilkan tag fungsi dan pola mirip.</li><li>Kartu ini memeriksa konsistensi data (<code>txCheck</code>).</li></ul><p><b>v4.2 — Tahap 1</b></p><ul><li>Hasil Latihan kalimat memperbarui jadwal grammar (Tepat→Baik, Hampir→Sulit, Belum tepat→Lagi), hanya jika grammar sudah ada di jadwal.</li><li>Rubrik 4 tanda masalah (B bentuk, M makna, N nuansa, T tata kata); bila ada tanda, Tepat dihitung Hampir. Log 12 percobaan terakhir per pola: <code>S.lt.a</code>.</li><li>Bobot pemilihan grammar dari 6 percobaan terakhir (<code>gRec</code>); hitungan lama dipakai bila belum ada log.</li><li>Batas interval 20 hari (<code>GCAP</code>) sampai ada 2 Produksi Tepat (<code>S.lt.pt</code>); matikan dengan <code>S.o.cp=0</code>.</li><li>Latihan Konteks (Jepang): kunci progres <code>S.lt.x</code> (pasangan tertukar "salah>benar"), <code>S.lt.q</code> (pilihan ditandai ambigu).</li></ul><p><b>Aturan agar pola konsisten saat menambah bahasa/level</b></p><ol><li><b>gid</b>: <code>{bahasa}-{level huruf kecil tanpa spasi}-{nnn}</code> (mis. <code>ja-n3-103</code>, <code>de-b1-045</code>, <code>zh-hsk3-012</code>). Nomor mengikuti urutan sumber saat pertama dibuat; jangan diubah; entri baru ditambah di akhir level. Satu gid ↔ satu <code>legacy_id</code> (ID lama).</li><li><b>Tag</b>: <code>{aspek}.{kelompok}.{daun}</code>, huruf kecil, maksimal 3 tingkat. Aspek: <code>fn</code> fungsi, <code>att</code> bentuk sebelum pola, <code>reg</code> register, <code>nu</code> nuansa. Pakai kembali tag yang ada (sebab, syarat, waktu, dst. berlaku lintas bahasa).</li><li><b>Tag baru</b> hanya bila ≥2 pola memakainya. Tidak boleh ada tag daun dipakai 1 pola; pola unik memakai tag induk. Tag daun yang terlalu umum (&gt;~20 pola) dipecah.</li><li><b>Setiap pola</b>: tepat 1 <code>fn</code> primary (urutan pertama), 0–2 <code>fn</code> secondary. <code>att/reg/nu</code> opsional. Bahasa non-konstruksi (Jerman, Belanda, Esperanto) mengganti <code>att</code> dengan aspek sendiri (Jerman: <code>kas</code> kasus, <code>gen</code> gender / jamak, <code>pos</code> posisi kata kerja; Belanda: <code>gen</code> de / het / jamak, <code>pos</code>, sisa <code>kas</code>; Esperanto: akhiran), tetap pakai <code>fn</code>.</li><li><b>Relasi</b>: tipe <code>contrast</code> (berlawanan) atau <code>confusable</code> (mudah tertukar); satu bahasa, a≠b, tanpa duplikat; catatan = satu kalimat pembeda.</li><li><b>Tetangga</b>: dihitung ulang setiap tag berubah (kemiripan tag berbobot IDF, induk tag ikut dihitung, wajib berbagi ≥1 tag <code>fn</code>, ambil 5 teratas, hanya dalam satu bahasa).</li><li><b>Urutan kerja</b>: ubah tabel (grammar, tags, grammar_tags, grammar_relations) → hitung ulang tetangga → ganti konstanta <code>TX</code> → buka Atur → kartu Taksonomi harus tanpa ✗.</li><li><b>Jangan</b> mengganti judul di sumber tanpa memetakan ulang <code>legacy_id</code>, atau progres lama menjadi yatim.</li></ol><p><b>Batas akurasi</b>: tag <code>fn</code> ditetapkan manual per pola; <code>att/reg/nu</code> masih tebakan aturan kata kunci dan perlu ditinjau. Relasi baru 17 pasangan (+23 dari v4.2 untuk N3–N2). Terjemahan contoh Jepang belum ada.</p></div></details></div>`}
/* ===== Integrasi antar bagian: kalimat latihan <-> kosakata <-> grammar <-> statistik ===== */
const RT=['Belum tepat','Hampir','Tepat'],WI={};D.C.forEach(c=>{(WI[c[1]+'|'+c[2]]||(WI[c[1]+'|'+c[2]]=[])).push(c)});
let SI={w:{},g:{}},xo=new Set,foc='',fk='',ltMsg='',goTop=0,hop=false,goSec='',goSm=0,lastTab='';
function wkey(w,l){for(const c of WI[w[3]+'|'+w[2]]||[])for(const L of l?[l]:Object.keys(c[3]))if((c[3][L]||[]).some(e=>e[0]==w[0]))return c[0];return''}
function sMig(){let ch=0;for(const h of S.lt.h)if(!h.k){h.l=h.l||(GK[h.g]?GK[h.g][1]:'');h.k=h.w.map(w=>wkey(w,h.l)||wkey(w));ch=1}if(ch)save()}
function sBuild(){const w={},g={};for(const h of S.lt.h){(h.k||[]).forEach(k=>{if(k&&!(w[k]&&w[k].includes(h)))(w[k]||(w[k]=[])).push(h)});(g[h.g]||(g[h.g]=[])).push(h)}SI={w,g}}
function actCard(){fcRoll();const td=fcDay(Date.now()),off=new Date().getTimezoneOffset(),cols=[];let sf=0,sl=0;
 for(let i=13;i>=0;i--){const d=td-i,f=(S.lg[d]||[0])[0]|0,l=(S.lt.d[d]||[0])[0]|0;sf+=f;sl+=l;cols.push([d,f,l])}
 let run=0;for(let d=td;;d--){const a=((S.lg[d]||[0])[0]|0)+((S.lt.d[d]||[0])[0]|0);if(a>0)run++;else if(d<td)break}
 const mv=Math.max(1,...cols.map(x=>x[1]+x[2])),px=x=>Math.round(x/mv*54);
 return`<div class=card><b>Aktivitas belajar</b> — ${run} hari beruntun<p><small>14 hari terakhir: ${sf} ulasan kartu · ${sl} soal latihan kalimat</small></p><div class=fcg>${cols.map(([d,f,l])=>`<div><small>${f+l||''}</small>${l?`<i style="height:${px(l)}px;background:#1a8a4a"></i>`:''}${f?`<i style="height:${px(f)}px;background:var(--a);border-radius:${l?'0':'3px 3px 0 0'}"></i>`:''}<small>${new Date(d*864e5+144e5+off*6e4+216e5).getDate()}</small></div>`).join('')}</div><small><span style="color:var(--a)">■</span> Flashcard &nbsp; <span style="color:#1a8a4a">■</span> Latihan kalimat</small></div>`}
document.addEventListener('toggle',e=>{const d=e.target.dataset&&e.target.dataset.d;if(d){e.target.open?DO.add(d):DO.delete(d)}},true);
sMig();
document.addEventListener('click',e=>{let m=e.target.closest&&e.target.closest('.rvl:not(.rv),.mnh:not(.rv),.cz:not(.rv)');if(m){m.classList.add('rv');if(m.dataset.rv)shown.add(m.dataset.rv);e.stopPropagation();e.preventDefault();return}const r=e.target.closest&&e.target.closest('.rom');if(r&&document.body.classList.contains('romh')&&!r.classList.contains('rv')){r.classList.add('rv');e.stopPropagation();e.preventDefault()}},true);
const IC={gm:'<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7 10v4M5 12h4M16 11h.01M18.5 13h.01"/>',fc:'<rect x="3" y="7" width="15" height="12" rx="2"/><path d="M6 4h15v12"/>',gr:'<path d="M4 6h16M4 12h10M4 18h14"/>',list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',stats:'<path d="M5 20V11M12 20V4M19 20v-6"/>',lib:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',set:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'};
function render(){document.querySelectorAll('details[data-d]').forEach(d=>d.open?DO.add(d.dataset.d):DO.delete(d.dataset.d));sBuild();document.body.classList.toggle('romh',!!S.o.rom);const T={gm:['Games',ggView,'Games'],fc:['Kartu',()=>vrPromo()+fcView(),'Kartu'+vrBadge()],gr:['Grammar',gram,'Grammar'],list:['Daftar',list,'Daftar'],lib:['Pustaka',libView,'Pustaka'],stats:['Statistik',stats,'Statistik'],set:['Pengaturan',set,'Atur']};
if(!T[tab])tab='fc';const ch=tab!==lastTab,sy=window.scrollY;lastTab=tab;v.className=ch?'fade':'';
v.innerHTML=vrBanner()+(ok?'':'<div class=warn>Penyimpanan lokal diblokir, progres tidak akan tersimpan. Matikan mode privat atau izinkan penyimpanan situs.</div>')+`<h1>${T[tab][0]}</h1>`+T[tab][1]();
n.innerHTML='<div class=navi>'+Object.entries(T).map(([k,x])=>`<button class="${k==tab?'on':''}" data-a=tab data-v=${k}${k==tab?' aria-current=page':''}><svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg><span>${x[2]||x[0]}</span></button>`).join('')+'</div>';
if(!ch&&sy>0){const de=document.documentElement,pm=de.style.scrollBehavior;de.style.scrollBehavior='auto';window.scrollTo(0,sy);de.style.scrollBehavior=pm}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;fcQV++;const a=b.dataset.a,k=b.dataset.k,x=b.dataset.v,y=scrollY;
if(a.slice(0,2)=='fc'){fcAct(a,x,k)}else if(a.slice(0,2)=='gg'){ggAct(a,x,k)}else if(a.slice(0,3)=='kpi'){kpiAct(a,x)}else if(a.slice(0,3)=='lib'||a=='slh'||a=='sldel'||a=='slmore'||a=='slplay'){if(libAct(a,x,k,b))return}else if(a.slice(0,3)=='lch'){lchAct(a,x)}else if(a.slice(0,3)=='eta'){etaAct(a,x)}else if(a=='tab'){if(x=='gr'&&tab!='gr'){gLg='';gLv=0;gFoc=0;gFresh=1}tab=x;lim=50;goTop=1}else if(a=='set'){e.stopPropagation();S.p[k]=+x;if(!+x)delete S.p[k];fcFS(k)}else if(a=='flip'){shown.has(k)?shown.delete(k):shown.add(k)}
else if(a=='cyc'){const s=(st(k)+1)%3;s?S.p[k]=s:delete S.p[k];fcFS(k)}
else if(a=='fl'){const i=S.f.indexOf(x);i<0?S.f.push(x):S.f.splice(i,1)}else if(a=='fall')S.f=[];else if(a=='gfl'){const i=S.gf.indexOf(x);i<0?S.gf.push(x):S.gf.splice(i,1)}else if(a=='gall'){S.gf=[];S.o.gpri='';S.o.gfn=''}else if(a=='glg'){gFresh=0;gLg=x;gLv=0;S.gf=D.GL.find(l=>l[0]==x)[3].map(v=>x+':'+v);S.o.gpri='';S.o.gfn='';S.gs=0;lim=50;goTop=1}else if(a=='gback'){gLg='';gLv=0;S.gf=[];S.o.gpri='';S.o.gfn='';S.gs=0;goTop=1}else if(a=='glv'){const all=gAll0(gLg);if(x=='all')S.gf=all;else if(S.gf.length>=all.length||!gLv)S.gf=[gLg+':'+x];else{const i=S.gf.indexOf(gLg+':'+x);i<0?S.gf.push(gLg+':'+x):S.gf.splice(i,1);if(!S.gf.length)S.gf=all}if(!gLv){goTop=1}gLv=1;lim=50;S.gs=0}else if(a=='gmap'){const[lp,d]=k.split('|'),[lg,l]=lp.split(':');S.gf=l?[lg+':'+l]:(TXLV[lg]||[]).map(v=>lg+':'+v);S.o.gfn=d;S.o.gpri='';S.gs=0;gFresh=0;tab='gr';goTop=1}else if(a=='groll'){S.gs=choose(gp().filter(g=>g[0]!=S.gs));gFoc=1;goTop=1}else if(a=='glist'){gFoc=0;goTop=1}else if(a=='gtolv'){gFoc=0;gLv=0;goTop=1}
else if(a=='gnext'||a=='gprev'){const P=gp(),n=P.length;if(n){const i=P.findIndex(g=>g[0]==S.gs),d=a=='gnext'?1:-1,j=i<0?(d>0?0:n-1):((i+d)%n+n)%n;S.gs=P[j][0];S.s[S.gs]=1;gFoc=1;goTop=1}}
else if(a=='gopen'){gFresh=0;S.gs=k;tab='gr';gFoc=1;const g0=GK[k];if(g0){const f=g0[1]+':'+g0[2];if(!S.gf.includes(f)){S.gf=[f];S.o.gpri='';S.o.gfn=''}gLg=g0[1];gLv=1}save();render();scrollTo(0,0);return}
else if(a=='stf'){stFeat=stFeat==x?'':x}else if(a=='lreset'){q='';fs='';fk='';lim=50}else if(a=='wopen'){tab='list';q='';fs='';fk='';foc=k;lim=50;goTop=1}else if(a=='wtog'){xo.has(k)?xo.delete(k):xo.add(k)}else if(a=='wclose'){foc=''}
else if(a=='say'){say(k,x);return}else if(a=='edit'){edOpen(x,k);return}else if(a=='edall'){if(!confirm('Kembalikan semua grammar & kosakata yang diedit ke versi asli?'))return;for(const t of['g','v'])for(const id in S.ed[t])edRestore(t,id);S.ed={g:{},v:{}};toast('Semua edit dikembalikan.')}else if(a=='ui'){S.o[k]=x;applyTheme()}else if(a=='sday'){fcSel=+x}else if(a=='srng'){fcRg=+x;fcSel=0}else if(a=='slg'){fcLgF=x;fcSel=0}else if(a=='hday'){heatSel=+x}
else if(a=='more')lim+=50;else if(a=='miglg'){const L=[...new Set(S.f.map(x=>String(x).split(':')[0]))],n=migLegacy(L);toast(n+' item bahasa diperbarui dari progres lama.')}
else if(a=='exp'){gmExpProgress();setTimeout(gmExpLibrary,600);return}else if(a=='expp'){gmExpProgress();return}else if(a=='expl'){gmExpLibrary();return}
else if(a=='rst'){if(!confirm('Hapus semua progres?'))return;VRS.backup(S,'pre');VRS.force();S.p={};S.s={};S.srs={};S.lg={};S.nw={};S.rd={};S.gg={};S.ggd={d:-1,n:0,r:0,x:0};S.gxd=null;ggCur=null;ggRes=null;S.lib.forEach(t=>{t.h=0;t.r=0});S.sl.forEach(t=>{t.d=0});S.lt={h:[],g:{},d:{},a:{},x:{},q:{},pt:{}};xo=new Set;foc='';S.sd={d:-1,n:0,r:0,x:0,y:0};fcUn=[];fcCur=null}
save();render();
if(goSec){const el=document.getElementById(goSec),sm=goSm,id=goSec;goSec='';goSm=0;if(el){el.scrollIntoView({block:'start',behavior:sm?'smooth':'auto'})}else scrollTo(0,goTop?0:y)}else scrollTo(0,goTop?0:y);goTop=0});
document.addEventListener('change',e=>{const i=e.target.dataset.i;if(!i)return;
if(i.slice(0,3)=='fc_')fcSet(i,e.target);else if(i.slice(0,3)=='gg_')ggSet(i,e.target);else if(i.slice(0,3)=='ui_'){S.o[i.slice(3)]=e.target.type=='checkbox'?+e.target.checked:e.target.value;applyTheme()}else if(i=='mode')S.o.mode=e.target.value;else if(i=='minL')S.o.minL=+e.target.value;else if(i=='fs')fs=e.target.value;else if(i=='fk')fk=e.target.value;else if(i=='gseq')S.o.gseq=+e.target.checked;else if(['cv','cgL','cgK','cgF','cpl','cvb','ckp','rdt'].includes(i))S.o[i]=e.target.value;else if(i=='rom')S.o.rom=+e.target.checked;
else if(i=='imp'){gmImpFiles(e.target.files);e.target.value='';return}
save();render()});
document.addEventListener('input',e=>{if(e.target.dataset.i=='q'){q=e.target.value;const p=e.target.selectionStart;render();const el=document.querySelector('[data-i=q]');el.focus();el.setSelectionRange(p,p)}});

/* ===== Vortaro 3.0: prakiraan ulasan, ringkasan, heatmap, tema, suara, perayaan ===== */
const HF=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],BL=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const dDate=d=>new Date(d*864e5+144e5+new Date().getTimezoneOffset()*6e4+216e5);
const dLbl=d=>{const x=dDate(d);return HF[x.getDay()]+', '+x.getDate()+' '+BL[x.getMonth()]};
let fcRg=30,fcLgF='',fcSel=0,heatSel=-1;
const buzz=p=>{if(S.o.hap&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}};
function toast(m){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.className='on';clearTimeout(toast.t);toast.t=setTimeout(()=>{t.className=''},3200)}

/* ---------- tema, aksen, ukuran huruf ---------- */
const ACC={indigo:null,teal:['#0f766e','#2dd4bf'],sky:['#0369a1','#38bdf8'],violet:['#7c3aed','#a78bfa'],rose:['#e11d48','#fb7185'],amber:['#b45309','#fbbf24']};
function applyTheme(){const o=S.o,r=document.documentElement,dk=o.th=='dark'||(o.th!='light'&&matchMedia('(prefers-color-scheme:dark)').matches);
 if(o.th=='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',o.th);
 r.setAttribute('data-fz',o.fz||'m');
 const a=ACC[o.ac];
 if(a){const c=dk?a[1]:a[0];r.style.setProperty('--a',c);r.style.setProperty('--a2','color-mix(in srgb,'+c+(dk?' 22%':' 13%')+',var(--c))')}
 else{r.style.removeProperty('--a');r.style.removeProperty('--a2')}
 try{let m=document.querySelector('meta[name=theme-color]');if(m&&!m.dataset.o)m.dataset.o=m.content;if(m)m.content=getComputedStyle(r).getPropertyValue('--bg').trim()||m.dataset.o}catch(e){}}
try{matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{if(S.o.th=='auto')applyTheme()})}catch(e){}

/* ---------- suara (text-to-speech) ---------- */
const TL={zh:'zh-CN',ja:'ja-JP',de:'de-DE',nl:'nl-NL',en:'en-US',eo:'eo'};let VZ=[];
try{const lv=()=>{VZ=speechSynthesis.getVoices()};lv();speechSynthesis.addEventListener('voiceschanged',lv)}catch(e){}
const canSay=()=>'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
function say(t,l){if(!canSay())return toast('Perangkat ini belum mendukung suara.');
 const code=TL[l];if(!code)return;const r=ttsVoice(l);
 if(!r.v&&VZ.length){return toast('Suara '+(LN[l]||l)+' belum terpasang di perangkat ini.')}
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance((typeof ttsClean=='function'?ttsClean(t,l):String(t)).replace(/[~〜]/g,'').trim());u.lang=r.v?r.v.lang:r.lc;if(r.v)u.voice=r.v;u.rate=ttsRate();speechSynthesis.speak(u)}catch(e){}}
const spk=(t,l)=>S.o.tts&&canSay()&&TL[l]?`<button class=spk data-a=say data-k="${esc(t)}" data-v=${l} title="Dengarkan" aria-label="Dengarkan">🔊</button>`:'';
function fcAuto(){if(!S.o.ttsa||!fcCur||GK[fcCur])return;const L=lang(fcCur),c=K[base(fcCur)],v=c&&fcVisE(c,fcCur);if(v&&v[L]&&v[L][0])say(v[L][0][0],L)}

/* ---------- rentetan & ringkasan ---------- */
function fcStreak(){const td=fcDay(Date.now()),set=new Set();
 for(const d in S.lg)if((S.lg[d][0]|0)>0)set.add(+d);
 for(const d in S.lt.d)if((S.lt.d[d][0]|0)>0)set.add(+d);
 let run=0;for(let d=td;;d--){if(set.has(d))run++;else if(d<td)break}
 const a=[...set].sort((x,y)=>x-y);let best=0,c=0,p=null;
 for(const d of a){c=p!==null&&d==p+1?c+1:1;p=d;if(c>best)best=c}
 return{run,best,days:set.size,today:set.has(td)}}
function fcHero(q,nn,rr){const td=fcDay(Date.now()),done=(S.lg[td]||[0])[0]|0,left=q.L.length+nn+rr,tot=done+left,pct=tot?Math.min(1,done/tot):0,sk=fcStreak(),R=28,C=2*Math.PI*R;
 const msg=left==0?(done?'Target hari ini tercapai 🎉':'Tidak ada kartu yang menunggu'):`${left} kartu lagi · ±${Math.max(1,Math.ceil(left*25/60))} menit`;
 return`<div class=hero><div class=ring><svg viewBox="0 0 64 64" aria-hidden="true"><circle class=tr cx=32 cy=32 r=${R}></circle><circle class=pg cx=32 cy=32 r=${R} style="stroke-dasharray:${C.toFixed(1)};stroke-dashoffset:${(C*(1-pct)).toFixed(1)}"></circle></svg><b>${Math.round(pct*100)}%</b></div><div class=ht><b>${done} dari ${tot} kartu hari ini</b><small>${msg}</small></div><div class=streak title="Hari beruntun belajar">🔥 ${sk.run}<small>hari</small></div></div>`}
function confetti(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const c=document.createElement('canvas');c.className='confetti';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);
 const x=c.getContext('2d'),cl=['#f59e0b','#10b981','#3b82f6','#ef4444','#a855f7','#eab308'];
 const P=Array.from({length:110},()=>({x:innerWidth/2+(Math.random()-.5)*90,y:innerHeight*.6,vx:(Math.random()-.5)*10,vy:-Math.random()*14-4,s:5+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cl[Math.random()*cl.length|0]}));
 let f=0;(function t(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.vy+=.28;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.globalAlpha=Math.max(0,1-f/120);x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});if(++f<130)requestAnimationFrame(t);else c.remove()})()}
function fcCelebrate(q,nn,rr){const td=fcDay(Date.now()),done=(S.lg[td]||[0])[0]|0;
 if(done<1||q.L.length||nn||rr||S.o.cfd===td)return;S.o.cfd=td;save();setTimeout(()=>{confetti();buzz([30,60,30,60,90])},300)}

/* ---------- prakiraan ulasan terjadwal (sampai 30 hari) ---------- */
function fcForecast(N){const td=fcDay(Date.now()),days=Array.from({length:N},()=>({l:0,y:0,m:0,lg:{}}));let late=0;
 for(const k of fcPool()){const c=S.srs[k];if(!c||!c.t)continue;const g=GK[k]?'g':lang(k);if(fcLgF&&fcLgF!=g)continue;
  let i;if(c.t==2){i=Math.max(0,c.d-td);if(c.d<td)late++}else i=Math.max(0,fcDay(c.d)-td);
  if(i>=N)continue;const x=days[i];if(c.t==2){c.i>=21?x.m++:x.y++}else x.l++;x.lg[g]=(x.lg[g]|0)+1}
 days.forEach(x=>{x.t=x.l+x.y+x.m});return{days,late}}
function fcastCard(){const td=fcDay(Date.now()),F=fcForecast(30),rg=fcRg,days=F.days.slice(0,rg);
 const tot=days.reduce((a,x)=>a+x.t,0),avg=tot/rg,mx=Math.max(1,...days.map(x=>x.t)),sel=Math.min(fcSel,rg-1),X=days[sel];
 let busy=0;days.forEach((x,i)=>{if(x.t>days[busy].t)busy=i});
 const rl=S.o.rl|0,over=rl>0&&days.some(x=>x.y+x.m>rl);
 const steps=[1,2,5,10,20,25,50,100,200,250,500,1000,2000],step=steps.find(s=>mx/s<=4)||5000,ym=Math.ceil(mx/step)*step;
 const W=340,H=178,pl=28,pr=4,pt=10,pb=22,cw=(W-pl-pr)/rg,chh=H-pt-pb,Y=v=>pt+chh-v/ym*chh;
 let g='';for(let v=0;v<=ym;v+=step)g+=`<line x1=${pl} x2=${W-pr} y1=${Y(v)} y2=${Y(v)} stroke="var(--b)" stroke-width=${v?.6:1}></line><text x=${pl-5} y=${Y(v)+3} text-anchor=end>${v}</text>`;
 let bars='',lab='';
 days.forEach((x,i)=>{const x0=pl+i*cw,bw=Math.max(2.5,cw*.66),bx=x0+(cw-bw)/2,dd=dDate(td+i),wk=dd.getDay()==0||dd.getDay()==6;
  if(i==sel)bars+=`<rect x=${x0} y=${pt-4} width=${cw} height=${chh+4} rx=4 style="fill:var(--a);opacity:.13"></rect>`;
  let yb=Y(0);
  for(const[k,col]of[['m','var(--s2)'],['y','color-mix(in srgb,var(--s2) 45%,var(--c))'],['l','var(--s1)']]){const hh=x[k]/ym*chh;if(hh>0){yb-=hh;bars+=`<rect x=${bx.toFixed(1)} y=${yb.toFixed(1)} width=${bw.toFixed(1)} height=${hh.toFixed(1)} rx=1.5 style="fill:${col}"></rect>`}}
  bars+=`<rect data-a=sday data-v=${i} x=${x0.toFixed(1)} y=0 width=${cw.toFixed(1)} height=${H-pb+2} style="fill:transparent;cursor:pointer"><title>${dLbl(td+i)}: ${x.t} kartu</title></rect>`;
  if(rg<=14||i%5==0||i==sel)lab+=`<text x=${(x0+cw/2).toFixed(1)} y=${H-7} text-anchor=middle class="${i==0?'td':wk?'wk':''}${i==sel?' sl':''}">${i==0?'Hari ini':dd.getDate()}</text>`});
 let ln=`<line x1=${pl} x2=${W-pr} y1=${Y(avg).toFixed(1)} y2=${Y(avg).toFixed(1)} stroke="var(--a)" stroke-width=1.3 stroke-dasharray="4 3"></line>`;
 if(over)ln+=`<line x1=${pl} x2=${W-pr} y1=${Y(rl).toFixed(1)} y2=${Y(rl).toFixed(1)} stroke="var(--bad)" stroke-width=1.3 stroke-dasharray="2 3"></line>`;
 const svg=`<svg class=fcsvg viewBox="0 0 ${W} ${H}" role=img aria-label="Grafik ulasan terjadwal ${rg} hari">${g}${bars}${ln}${lab}</svg>`;
 let cum=0;for(let i=0;i<=sel;i++)cum+=days[i].t;
 const lgs=Object.entries(X.lg).sort((a,b)=>b[1]-a[1]),lm=Math.max(1,...lgs.map(z=>z[1]));
 const det=`<div class=fdet><div class=fdh><b>${dLbl(td+sel)}${sel==0?' · hari ini':sel==1?' · besok':''}</b><span>${X.t} kartu</span></div>`+
  (X.t?`<small>Belajar ${X.l} · Muda ${X.y} · Matang ${X.m} · kumulatif ${cum}</small>`+lgs.map(([k,n])=>{const l=D.L.find(z=>z[0]==k);return`<div class=lgb style="--lc:${l?l[2]:'var(--m)'}"><em>${l?l[1]:'Grammar'}</em><span class=tr><i style="width:${n/lm*100}%"></i></span><b>${n}</b></div>`}).join(''):'<small>Tidak ada ulasan pada hari ini.</small>')+
  (sel==0&&F.late?`<p class=gsub style="margin:8px 0 0">⚠ ${F.late} kartu sudah lewat jadwal (tercakup di hari ini).</p>`:'')+'</div>';
 const any=Object.values(S.srs).some(c=>c.t);
 const chips=`<div class=chips><button class="chip${fcLgF?'':' on'}" data-a=slg data-v="">Semua</button>`+D.L.map(l=>`<button class="chip${fcLgF==l[0]?' on':''}" data-a=slg data-v=${l[0]}>${l[0].toUpperCase()}</button>`).join('')+`<button class="chip${fcLgF=='g'?' on':''}" data-a=slg data-v=g>Grammar</button></div>`;
 return`<div class=card><b>Ulasan terjadwal</b> — ${rg} hari ke depan`+
  `<div class=seg2>${[7,14,30].map(n=>`<button class="${rg==n?'on':''}" data-a=srng data-v=${n}>${n} hari</button>`).join('')}</div>`+chips+
  (any?`<div class=kpis><div><b>${tot}</b><small>Total</small></div><div><b>${avg>=10?Math.round(avg):avg.toFixed(1)}</b><small>Rata-rata/hari</small></div><div><b>${days[busy].t}</b><small>Tersibuk · ${dDate(td+busy).getDate()} ${BL[dDate(td+busy).getMonth()]}</small></div><div><b>${F.late}</b><small>Terlambat</small></div></div>`+svg+
  `<div class=leg><span><i style="background:var(--s1)"></i>Belajar</span><span><i style="background:color-mix(in srgb,var(--s2) 45%,var(--c))"></i>Muda</span><span><i style="background:var(--s2)"></i>Matang</span><span><i class=ln style="border-color:var(--a)"></i>Rata-rata</span>${over?`<span><i class=ln style="border-color:var(--bad)"></i>Batas ulasan (${rl})</span>`:''}</div>`+det:
  '<div class="card empty" style="margin:0"><b>Belum ada kartu terjadwal</b>Mulai belajar di tab Kartu — jadwal ulasan 30 hari ke depan akan muncul di sini.</div>')+'</div>'}

/* ---------- ringkasan, heatmap konsistensi ---------- */
let kpiOpen='',kpiLim=40,kpiLg='';
function kpiItems(t){const td=fcDay(Date.now()),out=[];
 const keys=t=='mat'?fcPool().filter(k=>{const c=S.srs[k];return c&&c.t==2&&c.i>=21}):Object.keys(S.p).filter(k=>S.p[k]==2);
 for(const k of keys){let ti,sb,lg,tg,id;const c=S.srs[k];
  if(GK[k]){const g=GK[k];lg=g[1];ti=g[4];sb=`${g[2]} · Grammar`;id=k}
  else{const b=base(k),L=lang(k),cd=K[b];if(!cd)continue;lg=L||cd[1];const e=L&&(cd[3][L]||[])[0];ti=e?e[0]+(e[1]?' ('+e[1]+')':''):cd[2];sb=cd[2];id=b}
  const iv=c&&c.t==2?c.i:0,due=c&&c.t==2?c.d-td:null;
  tg=c&&c.t==2?`${iv} hr · ${due<0?'terlambat '+(-due)+' hr':due==0?'ulas hari ini':due==1?'ulas besok':'ulas '+due+' hr lagi'}`:(c&&c.t?'sedang belajar':'ditandai selesai');
  out.push({k,id,g:!!GK[k],lg,ti,sb,iv,tg})}
 return out.sort((x,y)=>y.iv-x.iv||x.lg.localeCompare(y.lg)||x.ti.localeCompare(y.ti))}
function kpiList(){const all=kpiItems(kpiOpen),lgs=[...new Set(all.map(x=>x.lg))],rows=kpiLg?all.filter(x=>x.lg==kpiLg):all,ttl=kpiOpen=='mat'?'Kartu matang (interval ≥ 21 hari)':'Kartu selesai (status Selesai)';
 return`<div class=card style="margin:-6px 0 14px"><div class=hd><span><b>${ttl}</b> · ${all.length}</span><button class=mini data-a=kpi data-v="${kpiOpen}">✕ Tutup</button></div>`+
 (lgs.length>1?`<div class=chips style="margin:6px 0"><button class="chip${kpiLg?'':' on'}" data-a=kpilg data-v="">Semua</button>${lgs.map(l=>`<button class="chip${kpiLg==l?' on':''}" data-a=kpilg data-v=${l}>${esc(LN[l]||l)}</button>`).join('')}</div>`:'')+
 (rows.length?rows.slice(0,kpiLim).map(x=>`<div class=row><div data-a=${x.g?'gopen':'wopen'} data-k="${esc(x.id)}"><b>${esc(x.ti)}</b><br><small>${esc(LN[x.lg]||x.lg)} · ${esc(x.sb)} · ${esc(x.tg)}</small></div></div>`).join('')+(rows.length>kpiLim?'<button data-a=kpimore style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':''):'<small>Belum ada.</small>')+'</div>'}
function kpiAct(a,x){if(a=='kpi'){kpiOpen=kpiOpen==x?'':x;kpiLim=40;kpiLg=''}else if(a=='kpilg'){kpiLg=x;kpiLim=40}else if(a=='kpimore')kpiLim+=40}
function kpiCard(){const td=fcDay(Date.now()),done=(S.lg[td]||[0])[0]|0,sk=fcStreak();let mat=0;
 for(const k of fcPool()){const c=S.srs[k];if(c&&c.t==2&&c.i>=21)mat++}
 const fin=Object.keys(S.p).filter(k=>S.p[k]==2).length;
 return`<div class=kpis>${[['🔥',sk.run,'hari beruntun'],['✅',done,'ulasan hari ini'],['🌳',mat,'kartu matang','mat'],['🏁',fin,'kartu selesai','fin']].map(([i,n,t,k])=>k?`<button class="kpb${kpiOpen==k?' on':''}" data-a=kpi data-v=${k} aria-expanded=${kpiOpen==k}><span>${i}</span><b>${n}</b><small>${t} ▾</small></button>`:`<div><span>${i}</span><b>${n}</b><small>${t}</small></div>`).join('')}</div>`+(kpiOpen?kpiList():'')}
/* ===== v6.0: perkiraan kapan semua kartu tuntas ===== */
const fmtDt=n=>{const d=dDate(fcDay(Date.now())+n);return d.getDate()+' '+BL[d.getMonth()]+' '+d.getFullYear()};
const fmtN=n=>n.toLocaleString('id-ID',{maximumFractionDigits:1});
function etaPool(){if(S.o.fsc!='all')return fcPool();const al={};D.L.forEach(l=>al[l[0]]=null);return fcPoolV(al).concat(D.G.map(g=>g[0])).filter(k=>!(S.srs[k]&&S.srs[k].z))}
const etaLg=k=>GK[k]?GK[k][1]:lang(k);
function etaRng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function etaSim(c0,p,rnd){const now0=Date.now();let c=c0?{...c0}:null;
 for(let day=0;day<500;day++){const base=now0+day*864e5;
  for(let g=0;g<8;g++){const td=fcDay(base);let nn=base;
   if(c){if(c.t==2){if(c.d>td)break}else{if(c.d>=base+864e5)break;nn=Math.max(base,c.d)}}
   c=fcCalc(c,rnd()<p?1:3,nn,false);
   if(c.t==2&&c.i>=21)return day;if(c.t==2)break}}
 return 500}
const etaPct=(a,q)=>a.length?a[Math.min(a.length-1,Math.floor(a.length*q))]:0;
function etaData(){const td=fcDay(Date.now()),P=etaPool(),o=S.o,N={n:0,l:0,y:0,m:0},byL={},inprog=[];
 for(const k of P){const c=S.srs[k],L=etaLg(k),b=byL[L]||(byL[L]={n:0,l:0,y:0,m:0,tot:0,intro:0});b.tot++;
  let s;if(c&&c.t){if(c.t==2&&c.i>=21)s='m';else if(c.t==2)s='y';else s='l';b.intro++;if(s!='m')inprog.push(c)}else if(S.p[k]==2){s='m'}else s='n';
  N[s]++;b[s]++}
 const days=Object.keys(S.lg).map(Number).filter(d=>(S.lg[d][0]|0)>0).sort((x,y)=>x-y),span=days.length?td-days[0]+1:0,introd=N.l+N.y+N.m,lgs=Object.keys(byL);
 let rv=0,lp=0;for(let d=td-29;d<=td;d++){const x=S.lg[d];if(x){rv+=x[0]|0;lp+=x[1]|0}}
 const p=rv>=40?Math.min(.4,Math.max(.03,lp/rv)):.12;
 let r14=0;for(let d=td-13;d<=td;d++)r14+=(S.lg[d]||[0])[0]|0;
 const nwd=Object.keys(S.nw||{}).map(Number).sort((x,y)=>x-y),nsp=nwd.length?Math.min(14,td-nwd[0]+1):0;let nr=0;
 for(let d=td-13;d<=td;d++){const w=S.nw[d];if(w)lgs.forEach(l=>nr+=w[l]|0)}
 const rates={avg:span>=3&&introd?introd/span:null,rec:nsp>=3?nr/nsp:null,cap:+o.nl||0,wi:+o.fwi||0};
 const rnd=etaRng(20260101),nd=[];for(let i=0;i<150;i++)nd.push(etaSim(null,p,rnd));nd.sort((x,y)=>x-y);
 let ip=[];const smp=inprog.length>300?inprog.filter((_,i)=>i%Math.ceil(inprog.length/300)==0):inprog;smp.forEach(c=>ip.push(etaSim(c,p,rnd)));ip.sort((x,y)=>x-y);
 return{P,N,byL,lgs,span,introd,p,rv,r14:r14/14,rates,nsp,newT:etaPct(nd,.8),newMed:etaPct(nd,.5),ipT:etaPct(ip,.9),nIp:inprog.length}}
function etaCalc(E,n,rate){
 const intro=n.n>0&&rate>0?Math.ceil(n.n/rate):0,mat=Math.max(E.ipT,n.n>0?intro+E.newT:0);return{ok:n.n==0||rate>0,intro,mat}}
function etaCard(){const o=S.o,E=etaData(),N=E.N,tot=E.P.length,sn=o.fsn||'avg',R=E.rates;
 const SC=[['avg','Laju rata-rata sejak mulai',R.avg],['rec','Laju 14 hari terakhir',R.rec],['cap','Batas kartu baru harian',R.cap],['wi','Jika kartu baru / hari',R.wi]];
 const sel=SC.find(x=>x[0]==sn&&x[2])||SC.find(x=>x[2])||SC[2],rate=sel[2];
 const sc=`<div class=chips>${[['act','Filter aktif'],['all','Semua bahasa & level']].map(([v,t])=>`<button class="chip${(o.fsc||'act')==v?' on':''}" data-a=etasc data-v=${v}>${t}</button>`).join('')}</div>`;
 const bar=`<div class=bar>${[['m','var(--s2)'],['y','var(--k1)'],['l','var(--s1)']].map(([k,c])=>`<i style="width:${N[k]/(tot||1)*100}%;background:${c}"></i>`).join('')}</div>`;
 if(!tot)return`<div class=card><b>🎯 Perkiraan tuntas</b><p class=gsub>Tidak ada kartu pada cakupan ini. Ubah filter di tab Kartu.</p>${sc}</div>`;
 const res=etaCalc(E,N,rate),lbl=n=>n<=0?'sekarang':fmtDt(n)+' · '+fcFmtD(n);
 let h=`<div class=card><b>🎯 Perkiraan tuntas</b><p class=gsub style="margin:2px 0 8px">Berapa lama lagi semua kartu pada cakupan ini sampai <b>matang</b> (interval ≥ 21 hari) dan berstatus <b>selesai</b>, dihitung dari laju hafalanmu dan jadwal SRS-mu.</p>${sc}<div style="margin-top:8px"></div>`+
  `<div class=gsub style="margin:0 0 4px">${fmtN(tot)} kartu · ${E.lgs.map(l=>esc(LN[l]||l)).join(', ')}${o.fsc=='all'?'':' · ikut Filter flashcard'}</div>${bar}<small>Matang/selesai ${N.m} · Muda ${N.y} · Belajar ${N.l} · Belum ${N.n}</small>`+
  `<div class=gsec style="margin-top:12px">Skenario laju</div><div class=chips>${SC.filter(x=>x[2]||x[0]=='wi').map(x=>`<button class="chip${x[0]==sel[0]?' on':''}" data-a=etasn data-v=${x[0]}>${x[1]}${x[0]=='wi'?'':': '+fmtN(x[2])+'/hr'}</button>`).join('')}</div>`;
 if(sel[0]=='wi')h+=`<div class=chips style="margin-top:6px">${[5,10,20,30,50,100].map(v=>`<button class="chip${+o.fwi==v?' on':''}" data-a=etawi data-v=${v}>${v}/hari</button>`).join('')}</div>`;
 h+=`<div class=kpis style="grid-template-columns:1fr 1fr;margin:10px 0 6px"><div><span>📥</span><b>${N.n?(res.ok?fmtDt(res.intro):'—'):'Selesai'}</b><small>semua kartu sudah dikenalkan${N.n&&res.ok?' ('+fcFmtD(res.intro)+')':''}</small></div><div><span>🌳</span><b>${res.ok?(res.mat<=0?'Sudah':fmtDt(res.mat)):'—'}</b><small>semua matang &amp; selesai${res.ok&&res.mat>0?' ('+fcFmtD(res.mat)+')':''}</small></div></div>`;
 if(!res.ok)h+=`<p class=gsub>Belum ada laju untuk skenario ini (butuh minimal 3 hari belajar). Pilih skenario lain.</p>`;
 // perbandingan skenario
 h+=`<div class=gsec style="margin-top:10px">Perbandingan skenario</div>`+SC.filter(x=>x[2]).map(x=>{const r=etaCalc(E,N,x[2]);return`<div class=row style="padding:8px 0"><div><b>${x[1]}</b> <small>${fmtN(x[2])} kartu baru/hari</small></div><div style="text-align:right"><b>${r.mat<=0?'Sudah':fmtDt(r.mat)}</b><br><small>${r.mat<=0?'':fcFmtD(r.mat)}</small></div></div>`}).join('');
 // per bahasa
 if(E.lgs.length>1){const tI=E.lgs.reduce((s,l)=>s+E.byL[l].intro,0);h+=`<div class=gsec style="margin-top:10px">Per bahasa (laju dibagi menurut porsi belajarmu)</div>`+E.lgs.map(l=>{const b=E.byL[l],sh=tI?Math.max(.05,b.intro/tI):1/E.lgs.length,r=etaCalc(E,{n:b.n},rate*sh);
  return`<div class=row style="padding:8px 0"><div><b>${esc(LN[l]||l)}</b> <small>${b.tot} kartu · matang ${b.m} · muda ${b.y} · belajar ${b.l} · belum ${b.n}</small><div class=bar style="margin:4px 0 0"><i style="width:${b.m/(b.tot||1)*100}%;background:var(--s2)"></i><i style="width:${b.y/(b.tot||1)*100}%;background:var(--k1)"></i><i style="width:${b.l/(b.tot||1)*100}%;background:var(--s1)"></i></div></div><div style="text-align:right"><b>${b.n==0&&E.ipT==0?'Sudah':r.ok?fmtDt(Math.max(r.mat,0)):'—'}</b></div></div>`}).join('')}
 h+=`<details style="margin-top:10px"><summary>Cara menghitung &amp; asumsi</summary><small>Laju hafalan: ${E.span?E.introd+' kartu dikenalkan dalam '+E.span+' hari (≈ '+fmtN(E.introd/E.span)+'/hari)':'belum cukup data'}${E.nsp>=3?`; 14 hari terakhir ≈ ${fmtN(R.rec)} kartu baru/hari`:'; laju 14 hari terakhir tersedia setelah ≥ 3 hari belajar di versi 6'}. Ulasan ≈ ${fmtN(E.r14)}/hari (14 hari). Tingkat lupa ${Math.round(E.p*100)}%${E.rv>=40?' (dari 30 hari terakhir)':' (asumsi, data belum cukup)'}.<br>Waktu matang tiap kartu disimulasikan memakai pengaturan SRS-mu (langkah belajar, interval, ease): kartu baru ≈ ${fcFmtD(E.newMed)} (median), ${fcFmtD(E.newT)} (perkiraan aman, persentil 80). Kartu yang sedang dipelajari (${E.nIp}) disimulasikan dari kondisinya sekarang. Tanggal "semua matang" = waktu kartu terakhir dikenalkan + perkiraan aman. Asumsi: kamu mengerjakan ulasan setiap hari, tidak ada kartu yang ditangguhkan, dan kartu matang tidak lupa lagi. Status Selesai mengikuti matang bila “Sinkron status” aktif.</small></details></div>`;
 return h}
function etaAct(a,x){if(a=='etasc'){S.o.fsc=x}else if(a=='etasn'){S.o.fsn=x}else if(a=='etawi'){S.o.fwi=+x}}
function heatCard(){fcRoll();const td=fcDay(Date.now()),W=14,w0=dDate(td).getDay(),start=td-(W-1)*7-w0,sk=fcStreak();
 const lv=n=>n==0?0:n<10?1:n<30?2:n<60?3:4;let cells='',act=0,tot=0,span=0;
 const sd=heatSel<0||heatSel>td?td:heatSel;
 for(let i=0;i<W*7;i++){const d=start+i;if(d>td){cells+='<i class=hn></i>';continue}span++;
  const f=(S.lg[d]||[0])[0]|0,l=(S.lt.d[d]||[0])[0]|0,n=f+l;if(n){act++;tot+=n}
  cells+=`<button class="hz${lv(n)}${d==sd?' sel':''}" data-a=hday data-v=${d} title="${esc(dLbl(d))}: ${n}" aria-label="${esc(dLbl(d))}: ${n} aktivitas"></button>`}
 const f=(S.lg[sd]||[0])[0]|0,l=(S.lt.d[sd]||[0])[0]|0;
 return`<div class=card><b>Konsistensi belajar</b> — ${W} minggu<div class=heat>${cells}</div><div class=hcap><b>${dLbl(sd)}</b> · ${f} ulasan kartu · ${l} soal latihan</div><div class=kpis style="margin:10px 0 0"><div><b>${sk.run}</b><small>Rentetan kini</small></div><div><b>${sk.best}</b><small>Terbaik</small></div><div><b>${act}/${span}</b><small>Hari aktif</small></div><div><b>${tot}</b><small>Total aktivitas</small></div></div><div class=leg style="margin-top:10px"><span>Sedikit</span>${[0,1,2,3,4].map(n=>`<i class="hz${n}" style="width:12px;height:12px;display:inline-block;border-radius:3px;border:1px solid var(--b)"></i>`).join('')}<span>Banyak</span></div></div>`}

/* ---------- kartu pengaturan tampilan ---------- */
function uiCard(){const o=S.o,seg=(k,op)=>`<div class=seg2>${op.map(([v,t])=>`<button class="${o[k]==v?'on':''}" data-a=ui data-k=${k} data-v=${v}>${t}</button>`).join('')}</div>`,ck=(k,t)=>`<label class=fcl><span><input type=checkbox data-i="ui_${k}"${o[k]?' checked':''}> ${t}</span></label>`;
 return`<div class=card><b>Tampilan &amp; kenyamanan</b><small class=lbl>Tema</small>`+seg('th',[['auto','Otomatis'],['light','Terang'],['dark','Gelap']])+
 `<small class=lbl>Warna aksen</small><div class=swatches>${Object.entries(ACC).map(([n,a])=>`<button class="sw${(o.ac||'indigo')==n?' on':''}" data-a=ui data-k=ac data-v=${n} style="--sw:${a?a[0]:'#4f46e5'}" aria-label="Aksen ${n}" title="${n}"></button>`).join('')}</div>`+
 `<small class=lbl>Ukuran huruf kata</small>`+seg('fz',[['m','Normal'],['l','Besar'],['xl','Sangat besar']])+
 `<small class=lbl>Kecepatan suara 🔊 &amp; pemutar</small>`+seg('ttsr',[['.5','0.5×'],['.7','0.7×'],['.9','0.9×'],['1','1×'],['1.2','1.2×']])+ck('tts','Tampilkan tombol suara 🔊 di samping kata')+ck('ttsa','Ucapkan otomatis saat jawaban dibuka')+ck('hap','Getar halus saat menilai kartu (HP)')+
 `</div>`}

/* ===== Filter deck flashcard (kosakata / grammar / keduanya) ===== */
const DK=[['v','Kosakata'],['g','Grammar'],['all','Keduanya']];
function fcPoolV(al){al=al||fcAL();const o=S.o,a=[];for(const c of D.C){if(o.sp.length&&!o.sp.includes(c[1]))continue;const v=fcVis(c,al);if(v)for(const l in v){const all=c[3][l]||[];v[l].forEach(e=>{const i=all.indexOf(e);a.push(ik(c[0],l)+(i>0?'~'+i:''))})}}return a}
function fcGOk(g){const f=S.o.gff;return!f.length||f.includes(g[1]+':'+g[2])}
function fcGP(){return D.G.filter(fcGOk)}
function fcMixNew(N){const o=S.o;N=gmVerFirst(N);if(o.deck!='all')return N;
 const g=[],v=[];for(const k of N)(GK[k]?g:v).push(k);if(!g.length||!v.length)return N;
 const p=Math.min(1,Math.max(0,(o.gr==null?25:o.gr)/100)),out=[];let gi=0,vi=0,acc=0;
 while(gi<g.length||vi<v.length){acc+=p;if(vi>=v.length||(acc>=1&&gi<g.length)){acc=Math.max(0,acc-1);out.push(g[gi++])}else out.push(v[vi++])}
 return out}
function fcDeckBar(){const o=S.o,nv=fcPoolV().length,ng=fcGP().length,n={v:nv,g:ng,all:nv+ng},f=x=>x.toLocaleString('id-ID');
 return`<div class=deckbar role=tablist aria-label="Deck flashcard">${DK.map(([v,t])=>`<button role=tab aria-selected="${o.deck==v}" class="${o.deck==v?'on':''}" data-a=fcdeck data-v=${v}><span>${t}</span><small>${f(n[v])} kartu</small></button>`).join('')}</div>`}
function fcFilt(){const o=S.o,ff=o.ff,gf=o.gff,dk=o.deck,sv=dk!='g',sg=dk!='v',act=(sv?ff.length:0)+(sg?gf.length:0);
 const chips=(L,lvIdx,cur,aAll,aLg,aOne)=>`<div class=chips><button class="chip${cur.length?'':' on'}" data-a=${aAll}>Semua bahasa</button></div>`+L.map(l=>{const lv=l[lvIdx],all=cur.length&&lv.every(v=>cur.includes(l[0]+':'+v));return`<div><small>${l[1]}</small><div class=chips><button class="chip${all?' on':''}" data-a=${aLg} data-v=${l[0]}>Semua level</button>`+lv.map(v=>{const x=l[0]+':'+v;return`<button class="chip${cur.includes(x)?' on':''}" data-a=${aOne} data-v="${x}">${v}</button>`}).join('')+'</div></div>'}).join('');
 let h=dtag('ff')+`<summary><span>Filter flashcard</span>${act?`<em class=cnt>${act} aktif</em>`:''}</summary><div class=card>`;
 if(sv)h+=`<div class=fsec><b>Kosakata</b>`+chips(D.L,4,ff,'fcfall','fclg','fcfl')+
  fcS('fm','Cara menyaring',[['or','Salah satu (OR)'],['and','Semua bahasa aktif (AND)']])+fcN('fmin','Minimal bahasa per kartu (mode OR)',1,4)+
  ''+
  `<small>Jenis kata</small><div class=chips><button class="chip${o.sp.length?'':' on'}" data-a=fcpos data-v=all>Semua</button>`+['N','A','V','O'].map(p=>`<button class="chip${o.sp.includes(p)?' on':''}" data-a=fcpos data-v=${p}>${PN[p]}</button>`).join('')+'</div></div>';
 if(sg)h+=`<div class=fsec><b>Grammar</b>`+chips(D.GL,3,gf,'fcgall','fcglg','fcgl')+
  (dk=='all'?fcN('gr','Porsi grammar di kartu baru (%)',0,100)+'':'')+'</div>';
 return h+'<div class=btns><button data-a=fcrstf>Reset semua filter</button></div></div></details>'}

/* ===== Edit keterangan grammar & kosakata ===== */
S.ed=S.ed||{};S.ed.g=S.ed.g||{};S.ed.v=S.ed.v||{};
const OG=new Map(),cp=x=>JSON.parse(JSON.stringify(x)),edSrc=(t,id)=>t=='g'?GK[id]:K[id];
let edCtx=null;
function edApply(t,id){const ed=S.ed[t][id],s=edSrc(t,id);if(!ed||!s)return;if(!OG.has(t+id))OG.set(t+id,cp(s));
 if(t=='g'){if(ed.t!=null)s[4]=ed.t;if(ed.f!=null)s[5]=ed.f;if(ed.p!=null)s[6]=ed.p;if(ed.x)s[7]=cp(ed.x);if(ed.n)s[8]=cp(ed.n);if(ed.k)s[9]=cp(ed.k);if(ed.r)s[10]=cp(ed.r)}
 else{if(ed.m!=null)s[2]=ed.m;if(ed.e)for(const l in ed.e){const ar=s[3][l];if(ar)ed.e[l].forEach((x,i)=>{if(ar[i]&&x){ar[i][0]=x[0];ar[i][1]=x[1];ar[i][2]=x[2]}})}}}
function edRestore(t,id){const o=OG.get(t+id),s=edSrc(t,id);if(!o||!s)return;o.forEach((v,i)=>{s[i]=cp(v)})}
function edApplyAll(){for(const t of['g','v'])for(const id in S.ed[t])edApply(t,id)}
edApplyAll();
function edBtn(t,id){const on=!!S.ed[t][id];return`<button class="mini ed${on?' on':''}" data-a=edit data-k="${esc(id)}" data-v=${t} title="${on?'Sudah diedit · ':''}Edit keterangan" aria-label="Edit keterangan">✎${on?' diedit':''}</button>`}
function edOpen(t,id){const s=edSrc(t,id);if(!s)return;edClose();if(!OG.has(t+id))OG.set(t+id,cp(s));edCtx={t,id};
 const I=(k,l,v)=>`<label class=edl>${l}<input data-f="${k}" value="${esc(v)}" autocomplete=off></label>`,
  T=(k,l,v,r,h)=>`<label class=edl>${l}${h?`<small>${h}</small>`:''}<textarea data-f="${k}" rows=${r}>${esc(v)}</textarea></label>`;
 let b,ttl,sub;
 if(t=='g'){ttl='Edit grammar';sub=`${LN[s[1]]||''} ${s[2]}`;
  b=I('t','Judul',s[4])+T('f',s[11]||'Fungsi',s[5],3)+T('p','Pola / rumus',s[6],2)+
   T('x','Contoh',s[7].join('\n\n'),Math.min(14,s[7].length*3+1),'Satu contoh = beberapa baris. Pisahkan antar contoh dengan baris kosong.')+
   T('n',s[12]||'Keterangan',s[8].join('\n'),Math.min(10,s[8].length+2),'Satu poin per baris.')+
   T('k','Kasus khusus',s[9].join('\n'),2,'Satu poin per baris (boleh kosong).')+
   T('r','Rincian (tabel)',(s[10]||[]).map(p=>p[0]+' | '+p[1]).join('\n'),Math.min(10,(s[10]||[]).length+1),'Format: label | isi, satu per baris (boleh kosong).')}
 else{ttl='Edit kosakata';sub=PN[s[1]];b=I('m','Arti (Bahasa Indonesia)',s[2]);
  D.L.filter(l=>s[3][l[0]]).forEach(([lid,n,col])=>{s[3][lid].forEach((e,i)=>{b+=`<fieldset class=edfs style="--lc:${col}"><legend>${n}${s[3][lid].length>1?' '+(i+1):''}</legend>`+I(`e.${lid}.${i}.0`,'Kata',e[0])+I(`e.${lid}.${i}.1`,'Bacaan',e[1]||'')+T(`e.${lid}.${i}.2`,'Keterangan / contoh',e[2]||'',3)+'</fieldset>'})})}
 const m=document.createElement('div');m.id='edm';m.className='edm';
 m.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="${ttl}"><div class=edh><div><b>${ttl}</b><small>${esc(sub)} · ${esc(t=='g'?s[4]:s[2])}</small></div><button class=mini data-e=close aria-label=Tutup>✕</button></div><div class=edb>${b}</div><div class=edf><button data-e=reset${S.ed[t][id]?'':' disabled'}>Kembalikan asli</button><button class=pri data-e=save>Simpan</button></div></div>`;
 document.body.appendChild(m);document.body.style.overflow='hidden';
 const f=m.querySelector('input,textarea');if(f&&!matchMedia('(pointer:coarse)').matches)f.focus()}
function edClose(q){const m=document.getElementById('edm');if(m)m.remove();document.body.style.overflow='';edCtx=null}
function edSave(){if(!edCtx)return;const{t,id}=edCtx,m=document.getElementById('edm'),base=OG.get(t+id);if(!m||!base)return;
 const V=k=>{const el=m.querySelector(`[data-f="${k}"]`);return el?el.value:''},lines=s=>String(s||'').split('\n').map(x=>x.trim()).filter(Boolean),J=JSON.stringify,ed={};
 if(t=='g'){const t1=V('t').trim(),f=V('f').trim(),p=V('p').trim(),
   x=V('x').split(/\n\s*\n/).map(z=>z.split('\n').map(y=>y.trim()).filter(Boolean).join('\n')).filter(Boolean),
   n=lines(V('n')),k=lines(V('k')),r=lines(V('r')).map(l=>{const i=l.indexOf('|');return i<0?[l,'']:[l.slice(0,i).trim(),l.slice(i+1).trim()]});
  if(!t1)return toast('Judul tidak boleh kosong.');
  if(t1!==base[4])ed.t=t1;if(f!==base[5])ed.f=f;if(p!==base[6])ed.p=p;if(J(x)!==J(base[7]))ed.x=x;if(J(n)!==J(base[8]))ed.n=n;if(J(k)!==J(base[9]))ed.k=k;if(J(r)!==J(base[10]||[]))ed.r=r}
 else{const m1=V('m').trim();if(!m1)return toast('Arti tidak boleh kosong.');if(m1!==base[2])ed.m=m1;
  for(const l in base[3]){const o=base[3][l],arr=o.map((e,i)=>{const w=V(`e.${l}.${i}.0`).trim();return[w||e[0],V(`e.${l}.${i}.1`).trim(),V(`e.${l}.${i}.2`).trim()]});
   if(arr.some((x,i)=>x[0]!==o[i][0]||x[1]!==(o[i][1]||'')||x[2]!==(o[i][2]||'')))(ed.e=ed.e||{})[l]=arr}}
 edRestore(t,id);const any=Object.keys(ed).length;if(any)S.ed[t][id]=ed;else delete S.ed[t][id];edApply(t,id);
 edClose();save();render();toast(any?'Perubahan disimpan ✓':'Tidak ada perubahan.')}
function edReset(){if(!edCtx)return;const{t,id}=edCtx;edRestore(t,id);delete S.ed[t][id];edClose();save();render();toast('Dikembalikan ke versi asli.')}
document.addEventListener('click',e=>{const m=document.getElementById('edm');if(!m)return;if(e.target===m){edClose();return}const b=e.target.closest('[data-e]');if(!b)return;const a=b.dataset.e;if(a=='close')edClose();else if(a=='save')edSave();else if(a=='reset')edReset()});
document.addEventListener('keydown',e=>{if(!document.getElementById('edm'))return;if(e.key=='Escape'){edClose()}else if((e.ctrlKey||e.metaKey)&&e.key=='Enter'){e.preventDefault();edSave()}});
function edCard(){const ng=Object.keys(S.ed.g).length,nv=Object.keys(S.ed.v).length;
 return`<div class=card><b>Edit keterangan</b><small>${ng} grammar · ${nv} kosakata sudah diedit.</small>${ng+nv?'<button data-a=edall style="width:100%;margin-top:8px">Kembalikan semua ke asli</button>':''}</div>`}

applyTheme();
try{const _t=new URLSearchParams(location.search).get('tab');if(_t&&['fc','gm','gr','list','lib','stats','set'].includes(_t))tab=_t}catch(e){}

/* ---------- v7.5: pertama kali membuka aplikasi → pilih bahasa, lalu level (boleh lebih dari satu) ---------- */
const onb={step:1,lang:'',lv:new Set()};
function onbFresh(){return!S.o.onb&&!Object.keys(S.p).length&&!Object.keys(S.srs).length&&!S.lib.length&&!S.sl.length&&!S.f.length&&!S.gf.length&&!(S.o.ff||[]).length&&!(S.o.gff||[]).length&&!Object.keys(S.rd||{}).length}
function onbLevels(L){const l=D.L.find(x=>x[0]==L),g=D.GL.find(x=>x[0]==L),vs=l?l[4]:[],gs=g?g[3]:[],all=[...gs];vs.forEach(v=>{if(!all.includes(v))all.push(v)});
 const wc={},gc={};D.C.forEach(c=>{(c[3][L]||[]).forEach(e=>{wc[e[3]]=(wc[e[3]]||0)+1})});D.G.forEach(x=>{if(x[1]==L)gc[x[2]]=(gc[x[2]]||0)+1});
 return all.map(v=>({v,w:vs.includes(v)?(wc[v]||0):0,g:gs.includes(v)?(gc[v]||0):0}))}
function onbHtml(){const h=[];
 if(onb.step==1){h.push(`<div class=onbs>Langkah 1 dari 2</div><h1>Selamat datang di Vortaro 👋</h1><p class=gsub>Bahasa apa yang sedang kamu pelajari?</p><div class=onbg>`+D.L.map(l=>{const n=D.C.filter(c=>(c[3][l[0]]||[]).length).length;return`<button class=onbb data-o=lg data-v="${l[0]}" style="--lc:${l[2]}"><b>${esc(l[1])}</b><small>${n.toLocaleString('id-ID')} kata · ${D.G.filter(g=>g[1]==l[0]).length} grammar</small></button>`}).join('')+`</div>`)}
 else{const L0=D.L.find(x=>x[0]==onb.lang),lv=onbLevels(onb.lang);
  h.push(`<div class=onbs>Langkah 2 dari 2</div><button class=mini data-o=back>‹ Ganti bahasa</button><h1>${esc(L0[1])} — dari level mana?</h1><p class=gsub>Boleh pilih lebih dari satu level.</p><div class=onbg>`+lv.map(x=>`<button class="onbb${onb.lv.has(x.v)?' on':''}" data-o=lv data-v="${esc(x.v)}" style="--lc:${L0[2]}"><b>${esc(x.v)}</b><small>${x.w?x.w.toLocaleString('id-ID')+' kata':''}${x.w&&x.g?' · ':''}${x.g?x.g+' grammar':''}</small></button>`).join('')+`</div><div class=btns style="margin-top:14px"><button data-o=all>${onb.lv.size>=lv.length?'Kosongkan':'Pilih semua'}</button><button class=pri data-o=go${onb.lv.size?'':' disabled'}>Mulai belajar${onb.lv.size?' ('+onb.lv.size+' level)':''}</button></div>`)}
 return`<div class=onbc>${h.join('')}</div>`}
function onbDraw(){const m=document.getElementById('onb');if(m)m.innerHTML=onbHtml()}
function onbFinish(){const L=onb.lang,l=D.L.find(x=>x[0]==L),g=D.GL.find(x=>x[0]==L),lv=[...onb.lv];
 const vf=lv.filter(v=>l&&l[4].includes(v)).map(v=>L+':'+v),gf=lv.filter(v=>g&&g[3].includes(v)).map(v=>L+':'+v);
 S.f=vf;S.o.ff=vf.slice();S.gf=gf;S.o.gff=gf.slice();S.o.pl=L;S.o.onb=1;S.o.lang=L;S.o.plv=[];
 const m=document.getElementById('onb');if(m)m.remove();document.body.style.overflow='';tab='fc';gFresh=1;gLg='';gLv=0;save();render();scrollTo(0,0);toast('Siap! Kartu & grammar disesuaikan ke '+l[1]+' ('+lv.join(', ')+')')}
function onbClick(e){const b=e.target.closest&&e.target.closest('[data-o]');if(!b||b.disabled)return;const a=b.dataset.o,v=b.dataset.v;
 if(a=='lg'){onb.lang=v;onb.step=2;onb.lv=new Set();const lv=onbLevels(v);if(lv[0])onb.lv.add(lv[0].v);onbDraw()}
 else if(a=='back'){onb.step=1;onbDraw()}
 else if(a=='lv'){onb.lv.has(v)?onb.lv.delete(v):onb.lv.add(v);onbDraw()}
 else if(a=='all'){const lv=onbLevels(onb.lang);onb.lv=onb.lv.size>=lv.length?new Set():new Set(lv.map(x=>x.v));onbDraw()}
 else if(a=='go'&&onb.lv.size)onbFinish()}
function onbCheck(){if(S.o.onb)return;if(!onbFresh()){S.o.onb=1;try{save()}catch(e){}return}
 const m=document.createElement('div');m.id='onb';m.className='onb';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.addEventListener('click',onbClick);document.body.appendChild(m);document.body.style.overflow='hidden';onbDraw()}
/* ---------- v7.9: kartu penyimpanan (IndexedDB) ---------- */
const stoMB=n=>(n/1048576).toFixed(n<1048576*10?1:0)+' MB';
function stoCard(){const idb=VRS.mode=='idb',lg=VRS.legacyBytes|0;
 setTimeout(()=>VRS.estimate().then(e=>{const el=document.getElementById('stoq');if(el&&e&&e.quota)el.textContent=' · terpakai situs '+stoMB(e.use)+' dari ±'+stoMB(e.quota)}),0);
 return`<div class=card><div class=hd><span><b>Penyimpanan</b></span><span class=bdg>${idb?'IndexedDB':'localStorage'}</span></div>`+
 `<small>${idb?'Progres & Pustaka disimpan di IndexedDB (tanpa batas 5 MB).':'IndexedDB tidak tersedia di browser ini, jadi memakai localStorage (batas ±5 MB).'} Data: ${stoMB(VRS.bytes|0)}<span id=stoq></span>.</small>`+
 (VRS.err?`<div class=warn style="margin-top:6px">${esc(VRS.err)}</div>`:'')+
 (idb?`<div class=btns style="margin-top:8px"><button class=mini data-sto=bak>Pulihkan dari cadangan…</button></div><small>Cadangan otomatis: kemarin, dua hari lalu, sebelum Hapus/Impor terakhir.</small>`:'')+
 (idb&&lg?`<div class=btns style="margin-top:8px"><button class=mini data-sto=drop>Hapus salinan lama (localStorage, ${stoMB(lg)})</button></div><small>Salinan lama dibiarkan sebagai cadangan setelah migrasi. Hapus kalau data di sini sudah terlihat lengkap.</small>`:'')+`</div>`}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-sto]');if(!b)return;
 if(b.dataset.sto=='bak'){VRS.flush().then(()=>VRS.backups()).then(L=>{if(!L.length){toast('Belum ada cadangan.');return}
  const f=t=>t?new Date(t).toLocaleString('id-ID'):'?',n=prompt('Pilih cadangan (angka):\n'+L.map((x,i)=>(i+1)+') '+x.label+' — '+f(x.t)+' · '+x.cards.toLocaleString('id-ID')+' kartu').join('\n'),'1'),x=L[(n|0)-1];if(!x)return;
  if(!confirm('Pulihkan "'+x.label+'" ('+f(x.t)+', '+x.cards.toLocaleString('id-ID')+' kartu)? Keadaan sekarang disimpan dulu sebagai cadangan "Sebelum pemulihan terakhir".'))return;
  VRS.restore(S,x.key).then(()=>location.reload()).catch(e=>toast('Gagal memulihkan: '+(e&&e.message||e)))});return}
 if(b.dataset.sto=='drop'){if(!confirm('Hapus salinan lama di localStorage? Data aktif di IndexedDB tidak terpengaruh. Pastikan progres & Pustaka sudah lengkap (atau sudah Ekspor).'))return;
  VRS.flush().then(()=>{VRS.dropLegacy();toast('Salinan lama dihapus ✓');render()})}});
/* v7.19.4: gabung dua tab (dipanggil VRS saat rev tersimpan lebih baru dari yang diketahui tab ini) */
VRS.merge=function(o,m){const A=o.srs||{};
 for(const k in A){const a=A[k],b=m.srs[k];if(!a)continue;if(!b||(a.r|0)>(b.r|0)||((a.r|0)==(b.r|0)&&(a.d||0)>(b.d||0))){m.srs[k]=a;if(a.t)fcSync(k,a)}}
 for(const k in(o.p||{})){const v=o.p[k];m.p[k]=k in m.p?Math.max(m.p[k]|0,v|0):v}
 for(const k in(o.s||{}))if(o.s[k])m.s[k]=1;
 for(const d in(o.lg||{})){const a=o.lg[d],b=m.lg[d];if(!b||(a&&a[0]>b[0]))m.lg[d]=a}
 for(const d in(o.nw||{})){const w=m.nw[d]||(m.nw[d]={});for(const l in o.nw[d])w[l]=Math.max(w[l]|0,o.nw[d][l]|0)}
 if(o.sd&&o.sd.d===m.sd.d)for(const x of['n','r','x','y'])m.sd[x]=Math.max(m.sd[x]|0,o.sd[x]|0);
 for(const key of['lib','sl']){const ids=new Set((m[key]||[]).map(t=>t.id));for(const t of(o[key]||[]))if(t&&t.id&&!ids.has(t.id))m[key].push(t)}
 fcQV++};
VRS.onMerged=()=>{fcQV++;try{render()}catch(e){}};
VRS.onRemote=function(o){for(const k in o)S[k]=o[k];if(!Array.isArray(S.lib))S.lib=[];fcCur=null;fcRevd=false;fcUn=[];fcQV++;try{render()}catch(e){}};
try{render();vrInit();onbCheck()}catch(e){window.vrFatal&&vrFatal(e)}
