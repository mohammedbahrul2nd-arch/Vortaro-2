const SHOW_BELAJAR=false; /* tab Belajar disembunyikan dulu; ubah ke true untuk menampilkannya lagi */
let S={rd:{},p:{},s:{},ses:{},gs:0,f:[],gf:[],srs:{},sd:{d:-1,n:0,r:0,x:0,y:0},lg:{},nw:{},lib:[],sl:[],lt:{h:[],g:{},d:{}},o:{}},ok=true,tab=SHOW_BELAJAR?'ses':'fc',q='',fs='',lim=50,shown=new Set;
try{if(!localStorage.getItem(SK)&&localStorage.getItem('kosakata_v1'))localStorage.setItem(SK,localStorage.getItem('kosakata_v1'));Object.assign(S,JSON.parse(localStorage.getItem(SK)||'{}'));localStorage.setItem(SK+'_t',1);navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){ok=false}
const FCD={nl:20,rl:200,fd:'id',ff:[],fm:'or',fmin:1,deck:'v',ord:'seq',no:'after',ls:'1 10',rs:'10',gi:1,ei:4,se:250,eb:130,hi:120,ni:0,im:100,mx:36500,lk:1,mig:0,sp:[],lch:4,xn:10,xr:50};const LTD={lm:1,pl:'zh',plv:[],pn:1,pa:1,pv:1,po:1,ps:'full',pw:'all',pg:'all',pe:1,lx:1};S.o={hide:0,rom:0,minL:1,mode:'mix',...FCD,...LTD,...S.o};if(!S.o.cv)S.o.cv=S.o.hide?'fo':'none';S.o={cgL:'blur',cgK:'show',cgF:'show',cpl:'blur',cvb:'blur',ckp:'blur',rdt:'blur',...S.o};S.o={th:'auto',ac:'indigo',fz:'m',tts:1,ttsa:0,hap:1,gr:25,ttsr:.9,libMin:4,...S.o};if(!Array.isArray(S.lib))S.lib=[];if(!Array.isArray(S.o.gff))S.o.gff=(S.gf||[]).slice();
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){ok=false}window.vrSnapSoon&&vrSnapSoon()};
const K={};D.C.forEach(c=>K[c[0]]=c);
const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);{const ok=x=>LN[String(x).split(':')[0]];S.f=S.f.filter(ok);S.o.ff=S.o.ff.filter(ok)}D.GL.forEach(l=>{if(!LN[l[0]])LN[l[0]]=l[1]});const GK={};D.G.forEach(g=>GK[g[0]]=g);
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const st=k=>S.p[k]|0;
const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1)},ik=(k,l)=>k+SEP+l;
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
const DO=new Set(),dtag=id=>`<details data-d="${id}"${DO.has(id)?' open':''}>`;
const ART=/^((?:der|die|das)(?:\/(?:der|die|das))*)(\s+)(.+)$/i,ARTN=/^((?:de|het)(?:\/(?:de|het))*)(\s+)(.+)$/i;
function wd(t,pos,ctx,lang,force){const m=pos=='N'&&(lang=='de'?String(t).match(ART):lang=='nl'?String(t).match(ARTN):null);if(!m||force||S.o['cg'+ctx]!='blur')return esc(t);return`<span class=cz>${esc(m[1])}</span>${esc(m[2]+m[3])}`}
function fmx(e,pos,lang,force){if((lang!='de'&&lang!='nl')||!DX)return'';let t,l,md;
 if(lang=='nl'){if(pos=='N'){t=DXN.n[e[0]];l='Bentuk jamak';md=S.o.cpl}else if(pos=='V'){t=DXN.v[e[0]];l='hij/zij/het · verleden · voltooid';md=S.o.cvb}else if(pos=='A'){t=DXN.a[e[0]];l='Komparatif';md=S.o.ckp}else return''}
 else if(pos=='N'){t=DX.n[e[0]];l='Bentuk jamak';md=S.o.cpl}else if(pos=='V'){t=DX.v[e[0]];l='er/sie/es · Präteritum · Perfekt';md=S.o.cvb}else return'';
 if(!t||md=='off')return'';
 return`<div class="r fx"><span class=gl>${l}</span><span class="${md=='blur'&&!force?'cz':''}">${esc(t)}</span></div>`}
const csel=(k,l,op,di)=>`<label class=fcl><span>${l}</span><select data-i="${di||k}" style="width:auto;margin:0">${op.map(([v,t])=>`<option value="${v}"${S.o[k]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
const SH=[['show','Tampil'],['blur','Sensor (blur)']],SH3=[['show','Tampil'],['blur','Sensor (blur)'],['off','Tidak ditampilkan']];
function sensor(){const o=S.o;return`<div class=card><b>Sensor</b><p class=gsub style="margin-top:2px">Semua pengaturan penyensoran ada di sini. Teks yang diblur bisa diketuk untuk melihatnya.</p>`+
 `<div class=gsec>Kosakata (bagian Kata &amp; tab Daftar)</div>`+csel('cv','Sisi yang disensor',[['none','Tidak ada (semua tampil)'],['fo','Bahasa asing (Indonesia jadi soal)'],['id','Bahasa Indonesia (asing jadi soal)']])+
 `<small>Berlaku untuk Acak 4 kata. Ketuk bagian yang diblur untuk membukanya — hanya bagian yang diketuk yang terbuka, bagian lain tetap tersensor.</small>`+
 `<div class=gsec>Romanisasi</div><label class=fcl><span><input type=checkbox data-i=rom${o.rom?' checked':''}> Sembunyikan romanisasi (pinyin/romaji) di semua tab</span></label>`+
 `<div class=gsec>Bahasa Jerman &amp; Belanda</div>`+csel('cgK','Gender (der/die/das · de/het): Kata &amp; Daftar',SH)+csel('cgF','Gender: Kartu',SH)+csel('cgL','Gender: Latihan',SH)+
 csel('cpl','Bentuk jamak kata benda',SH3)+csel('cvb','Bentuk lain kata kerja',SH3)+csel('ckp','Komparatif kata sifat (Belanda)',SH3)+
 `<small>Bentuk jamak ditampilkan di Kata, Daftar, Kartu (sisi jawaban), dan Latihan. Bentuk kata kerja = er/sie/es, Präteritum, Perfekt (Belanda: hij/zij/het, verleden, voltooid). Komparatif kata sifat khusus Belanda. Di Latihan, gender &amp; bentuk lain otomatis terbuka setelah kamu menekan "Periksa".</small>`+
 `<div class=gsec>Latihan kalimat</div><label class=fcl><span><input type=checkbox data-i=lt_lm${o.lm?' checked':''}> Sensor arti Indonesia di bawah kata (ketuk untuk melihat)</span></label>`+
 csel('ps','Tampilan kata',[['full','Kata target + arti'],['id','Hanya arti Indonesia']],'lt_ps')+'</div>'}
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
const fo=S.o.cv=='fo',idm=S.o.cv=='id',rva=(key,on,base)=>{const rk=k+'|'+key;return on?` data-rv="${esc(rk)}" class="${base?base+' ':''}rvl${shown.has(rk)?' rv':''}"`:(base?` class="${base}"`:'')};
return`<div class="card" data-k="${esc(k)}"><div class=hd><span>${PN[c[1]]}</span><span>${dn}/${ls.length} bahasa selesai${edBtn('v',k)}</span></div><div${rva('m',idm,'mean')}>${esc(c[2])}</div><div class=grid>`+
D.L.filter(l=>v[l[0]]).map(([id,n,col])=>{const i=ik(k,id),s=st(i);return`<div class=lg style="--lc:${col}"><small class=lgh>${n}<button class="stp stp${s}" data-a=cyc data-k="${esc(i)}" title="Ketuk untuk mengubah status ${n}">${STN[s]}${fcTag(i)}</button>${aiBtn(i)}</small><div${rva(id,fo)}>`+v[id].map(e=>`<div class=w>${wd(e[0],c[1],'K',id)}${spk(e[0],id)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}${fmx(e,c[1],id)}${e[2]?`<div class=ex>${esc(e[2])}</div>`:''}`).join('')+'</div></div>'}).join('')+
`</div>${fo||idm?'<div class=hint style="display:block">Ketuk bagian yang diblur untuk membukanya satu per satu</div>':''}${wSent(k,full)}</div>`}
function filtBody(){return'<div class=chips><button class="chip'+(S.f.length?'':' on')+'" data-a=fall>Semua bahasa</button></div>'+
D.L.map(l=>`<div><small>${l[1]}</small><div class=chips>`+l[4].map(v=>{const x=l[0]+':'+v;return`<button class="chip${S.f.includes(x)?' on':''}" data-a=fl data-v="${x}">${v}</button>`}).join('')+'</div></div>').join('')}
const fcnt=n=>n?`<em class=cnt>${n} aktif</em>`:''
function filt(){return dtag('f1')+'<summary><span>Filter level &amp; bahasa</span>'+fcnt(S.f.length)+'</summary>'+filtBody()+'</details>'}
function vsetBody(){return'<div class=card>'+msel()+`<small>Minimal bahasa per kartu</small><select data-i=minL>${[1,2,3,4].map(n=>`<option${S.o.minL==n?' selected':''}>${n}</option>`).join('')}</select><small>Sensor/blur (sisi asing atau Indonesia, gender, jamak, dll.) diatur lewat tombol ⚙ Sensor.</small></div>`}
function vset(){return dtag('vs')+'<summary>Pengaturan kosakata</summary>'+vsetBody()+'</details>'}
const SEC_HEAD=(t,s)=>`<div class=sech><h2>${t}</h2><p>${s}</p></div>`;
function kataSec(){const s=S.ses,has=['N','A','V','O'].some(p=>p in s);
 return SEC_HEAD('Kata','Acak 4 kata sekaligus: benda, sifat, kerja, lain-lain')+
 dtag('f1')+'<summary><span>Filter &amp; mode kata</span>'+fcnt(S.f.length)+'</summary>'+filtBody()+vsetBody()+'</details>'+
 '<button class=pri data-a=roll style="margin-bottom:14px">Acak 4 kata</button>'+
 (has?['N','A','V','O'].map(p=>p in s?card(s[p])+(s[p]?`<div class=kact><button data-a=re data-v=${p}>↻ Ganti ${PN[p]}</button><button data-a=ltfw data-k="${esc(s[p])}">✎ Pakai di latihan</button></div>`:''):'').join(''):'<div class="card empty"><b>Belum ada kata</b>Tekan “Acak 4 kata” untuk mulai belajar.</div>')}
function ses(){return`<div class=pills><div><button class=on data-a=jump data-v=k>Kata</button><button data-a=jump data-v=l>Latihan kalimat</button></div></div><div class=cols><section class=sec id=sec-k>${kataSec()}</section><section class=sec id=sec-l>${ltView()}</section></div><section class="sec secb" id=sec-b>${rdView()}</section>`}
function stats0(){let per=D.L.map(l=>[l,[0,0,0]]);const PM={};for(const c of D.C){const v=vis(c);if(!v)continue;for(const l in v){const s=st(ik(c[0],l));(PM[c[1]]||(PM[c[1]]=[0,0,0]))[s]++;per.find(x=>x[0][0]==l)[1][s]++}}
 const bar=(n,t)=>`<div class=bar><i style="width:${n[2]/t*100}%;background:var(--s2)"></i><i style="width:${n[1]/t*100}%;background:var(--s1)"></i></div>`;
 return filt()+vset()+`<div class=card><b>Kosakata per bahasa</b><p class=gsub style="margin:2px 0 8px">Progres dihitung terpisah untuk tiap bahasa pada setiap kata.</p>`+per.filter(x=>x[1][0]+x[1][1]+x[1][2]).map(([l,n])=>{const t=(n[0]+n[1]+n[2])||1;return`<div class=lg style="--lc:${l[2]};margin:8px 0"><small>${l[1]} — ${t} kata</small>${bar(n,t)}Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}</div>`}).join('')+'</div>'+
 ['N','A','V','O'].map(p=>{const P=pool(p),n=PM[p]||[0,0,0],t=(n[0]+n[1]+n[2])||1;
 return`<div class=card><b>${PN[p]}</b> — ${P.length} kartu · ${t} entri bahasa${bar(n,t)}Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}${wUsed(P)}</div>`}).join('')}
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
function gcard(k){const g=GK[k];if(!g)return'<div class=card>Tidak ada grammar untuk filter/mode ini.</div>';const s=st(k);
return`<div class=card><div class=hd><span>${LN[g[1]]||'Jerman'} ${g[2]}${g[3]?' · '+esc(g[3]):''}</span><span><i class="dot dot${s}"></i>${STN[s]}${fcTag(k)}${aiBtn(k)}${S.lib.some(t=>t.L==g[1])?`<button class="mini" data-a=libfind data-k="${esc(k)}" title="Cari teks di Pustaka">📚</button>`:''}${edBtn('g',k)}</span></div><div class=mean>${esc(g[4])}</div>${gbody(g)}${gTax(k)}${gSent(k,1)}<div class="seg">${STN.map((x,i)=>`<button class="sb sb${i}${i==s?' on':''}" data-a=set data-k="${esc(k)}" data-v=${i}>${x}</button>`).join('')}</div></div>`}
let gLg='',gLv=0,gFoc=0;const gAll0=l=>gLvs(l).map(v=>l+':'+v);
const gLvs=l=>(D.GL.find(x=>x[0]==l)||[0,0,0,[]])[3];
function gSync(){if(S.gf.length){const l=S.gf[0].split(':')[0];if(S.gf.some(x=>!x.startsWith(l+':')))S.gf=S.gf.filter(x=>x.startsWith(l+':'));if(gLg!=l){gLg=l;gLv=1}}else if(gLv||gLg){gLg='';gLv=0}}
function gStat(l,v){const a=D.G.filter(g=>g[1]==l&&(!v||g[2]==v));const d=a.filter(g=>st(g[0])==2).length;return{n:a.length,d}}
function gPick(){const bt=(c,v,t,sub,pct)=>`<button class=gpk data-a=${c} data-v="${v}"><b>${t}</b><small>${sub}</small>${pct?`<i style="width:${pct}%"></i>`:''}</button>`;
 if(!gLg)return`<div class=card><b>Pilih bahasa grammar</b><p class=gsub style="margin:2px 0 8px">Langkah 1 dari 2. Setelah itu pilih level, lalu daftar grammar muncul.</p><div class=gpg>`+D.GL.map(l=>{const t=gStat(l[0]);return bt('glg',l[0],esc(l[1]),t.n+' topik · '+t.d+' selesai',t.n?Math.round(t.d/t.n*100):0)}).join('')+`</div></div>`;
 const l=D.GL.find(x=>x[0]==gLg);
 return`<div class=card><div class=gcr><button class=mini data-a=gback>‹ Ganti bahasa</button><b>${esc(l[1])}</b></div><b>Pilih level</b><p class=gsub style="margin:2px 0 8px">Langkah 2 dari 2. Ketuk satu level untuk membuka daftarnya.</p><div class=gpg>`+bt('glv','all','Semua level',gStat(gLg).n+' topik',0)+l[3].map(v=>{const t=gStat(gLg,v);return bt('glv',v,v,t.n+' topik · '+t.d+' selesai',t.n?Math.round(t.d/t.n*100):0)}).join('')+`</div></div>`}
function gFocus(){const P=gp(),i=P.findIndex(g=>g[0]==S.gs),L0=D.GL.find(x=>x[0]==gLg),g=GK[S.gs],lv=g?g[2]:'';
 const nav=`<div class=btns><button data-a=gprev>‹ Grammar sebelumnya</button><button class=pri data-a=gnext style="width:auto;flex:1">Grammar berikutnya ›</button></div>`;
 return`<div class=gfoc><div class=gcr style="flex-wrap:wrap"><button class=mini data-a=gback>‹ Bahasa</button><button class=mini data-a=gtolv>Level</button><button class=mini data-a=glist>☰ Daftar grammar</button></div><small class=gsub>${esc(L0?L0[1]:'')} · ${esc(lv)}${i>=0?' · '+(i+1)+' dari '+P.length:''}</small>`+nav+gcard(S.gs)+nav+`</div>`}
function gram(){gSync();if(!gLg||!gLv)return gPick();if(gFoc&&S.gs&&GK[S.gs])return gFocus();const P=gp(),lv=gLvs(gLg),allL=S.gf.length>=lv.length,L0=D.GL.find(x=>x[0]==gLg);return`<div class=card><div class=gcr><button class=mini data-a=gback>‹ Ganti bahasa</button><b>${esc(L0[1])}</b></div><small class=lbl>Level (ketuk untuk memilih / menambah)</small><div class=chips><button class="chip${allL?' on':''}" data-a=glv data-v=all>Semua</button>`+lv.map(v=>`<button class="chip${!allL&&S.gf.includes(gLg+':'+v)?' on':''}" data-a=glv data-v="${v}">${v}</button>`).join('')+`</div></div>`+aiHub()+gNxtCard()+(()=>{const tf=gTaxFilt()+msel(),n=(S.o.gpri?1:0)+(S.o.gfn?1:0);return tf?dtag('gf')+'<summary>Filter lanjutan'+(n?` (${n} aktif)`:'')+'</summary>'+tf+'</details>':''})()+'<label class=fcl><span><input type=checkbox data-i=gseq'+(S.o.gseq?' checked':'')+'> Belajar grammar tanpa diacak (berurutan sesuai daftar &amp; filter)</span></label>'+(S.o.gseq?(()=>{const i=P.findIndex(g=>g[0]==S.gs);return'<div class=btns><button data-a=gprev>‹ Sebelumnya</button><button class=pri data-a=gnext style="width:auto;flex:2">Grammar berikutnya</button></div>'+(i>=0?'<p class=gsub style="text-align:center">'+(i+1)+' / '+P.length+'</p>':'')})():'<button class=pri data-a=groll>Acak 1 grammar</button>')+'<p></p>'+`<h1>Semua topik (${P.length})</h1>`+
P.slice(0,lim).map(g=>`<div class=row><div data-a=gopen data-k="${esc(g[0])}"><b>${esc(g[4])}</b><br><small>${LN[g[1]]||'Jerman'} ${g[2]}${g[3]?' · '+esc(g[3]):''}${txBdg(g[0])}</small>${gBdg(g[0])}</div><button class="stp stp${st(g[0])}" data-a=cyc data-k="${esc(g[0])}">${STN[st(g[0])]}</button></div>`).join('')+(P.length>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':'')}
let stFeat='';
const STF=[['leech','🪨','Kartu bandel',()=>leechCard()],['eta','⏳','Perkiraan selesai',()=>etaCard()],['fcast','📈','Proyeksi beban',()=>fcastCard()],['gmap','🗺','Peta grammar',()=>gMap()||'<div class=card><small>Belum ada peta grammar.</small></div>']];
function stFeatBar(){let n=0;try{n=lchItems().length}catch(e){}
 return`<div class=stf role=group aria-label="Fitur lain">`+STF.map(([k,i,t])=>`<button class="stfb${stFeat==k?' on':''}" data-a=stf data-v=${k} aria-expanded=${stFeat==k}><span>${i}</span><b>${t}</b>${k=='leech'&&n?`<em>${n}</em>`:''}</button>`).join('')+`</div>`+(stFeat?(STF.find(x=>x[0]==stFeat)||[0,0,0,()=>''])[3]():'')}
function stats(){return kpiCard()+stFeatBar()+fcStatsCard()+heatCard()+actCard()+stats1()+ltStatsCard()+rdStatsCard()}function stats1(){const P=gp(),n=[0,0,0];P.forEach(g=>n[st(g[0])]++);const t=P.length||1;return stats0()+`<div class=card><b>Grammar</b> — ${P.length} topik<div class=bar><i style="width:${n[2]/t*100}%;background:var(--s2)"></i><i style="width:${n[1]/t*100}%;background:var(--s1)"></i></div>Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}${gUsed(P)}</div>`}
function list(){const t=q.toLowerCase();let r=D.C.filter(c=>{const v=vis(c);if(!v)return 0;const k=c[0],ss=SI.w[k]||[];if(fs!==''&&!Object.keys(v).some(l=>st(ik(k,l))==fs))return 0;
if(fk=='s'&&!ss.length)return 0;if(fk=='n'&&ss.length)return 0;if(fk=='w'&&!ss.some(h=>h.r==0))return 0;
return!t||c[2].toLowerCase().includes(t)||Object.values(v).flat().some(e=>(e[0]+e[1]).toLowerCase().includes(t))||ss.some(h=>h.s.toLowerCase().includes(t))});const n=r.length;
return(foc&&K[foc]?`<div class=gsub style="margin:0 0 6px">Dibuka dari bagian lain · <button class="lnk" data-a=wclose>tutup</button></div>`+card(foc,1):'')+
`<div class=sbar><input type=search placeholder="Cari arti, kata, bacaan, atau kalimat buatanmu" value="${esc(q)}" data-i=q><select data-i=fs>${['Semua status',...STN].map((x,i)=>`<option value="${i?i-1:''}"${String(fs)===String(i?i-1:'')?' selected':''}>${x}</option>`).join('')}</select><select data-i=fk>${[['','Semua kartu'],['s','Punya kalimat latihan'],['n','Belum pernah dibuatkan kalimat'],['w','Pernah salah (belum tepat)']].map(([v,x])=>`<option value="${v}"${fk==v?' selected':''}>${x}</option>`).join('')}</select></div><small>${n} kartu${(q||fs!==''||fk)?' · <button class=lnk data-a=lreset>reset filter</button>':''} · ketuk kata untuk detail · ketuk kode bahasa (ZH, JA, DE, NL, EO) untuk mengubah status per bahasa</small>`+
r.slice(0,lim).map(c=>{const v=vis(c),k=c[0];return`<div class=row><div data-a=wtog data-k="${esc(k)}"><b>${esc(c[2])}</b> <small>${PN[c[1]]}</small>${wBdg(k)}<br><small>${Object.entries(v).map(([id,e])=>wd(e[0][0],c[1],'K',id)).join(' · ')}</small></div><div class=pls>${Object.keys(v).map(l=>{const i=ik(k,l),s=st(i);return`<button class="stp stpl stp${s}" data-a=cyc data-k="${esc(i)}" title="${esc(LN[l])}: ${STN[s]}">${l.toUpperCase()} · ${STN[s]}</button>`}).join('')}</div></div>`+(xo.has(k)?card(k,1):'')}).join('')+(n>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':'')}
function pcard(){const lg=S.legacy,nl=lg?Object.keys(lg.p).length:0,act=[...new Set(S.f.map(x=>String(x).split(':')[0]))];
 return`<div class=card><b>Progres per bahasa</b><p class=gsub style="margin:2px 0 8px">Status & jadwal flashcard kini terpisah untuk tiap bahasa pada kata yang sama (mis. “manusia” Jerman sudah Selesai, Esperanto tetap Belum).</p>`+
 (nl?`<small>${nl} kartu dari progres lama (per kartu) tersimpan sebagai cadangan. Tombol di bawah menyalinnya ke bahasa yang aktif di filter Kata (${act.length?act.map(x=>LN[x]).join(', '):'semua bahasa'}), hanya untuk item yang belum punya status.</small><button data-a=miglg style="width:100%;margin-top:8px">Terapkan progres lama ke bahasa aktif</button>`:'<small>Tidak ada progres lama yang perlu dimigrasi.</small>')+'</div>'}
function set(){return vrCard()+vrAppCard()+uiCard()+sensor()+pcard()+edCard()+txCard()+`<div class=card><button class=pri data-a=exp>Cadangkan progres (unduh JSON)</button><p><input type=file accept=.json data-i=imp></p><button data-a=rst>Hapus semua progres</button></div><p><small>${ok?'Penyimpanan lokal aktif.':'Penyimpanan lokal tidak tersedia.'} ${Object.keys(S.p).length} kartu bertanda, ${S.lt.h.length} kalimat latihan. Buat cadangan sesekali, karena data browser bisa terhapus.</small></p>`}
/* ===== Flashcard + SRS (algoritma ala Anki / SM-2) ===== */
const FCNUM={gr:[0,100],fmin:[1,4],nl:[0,9999],rl:[0,9999],gi:[1,365],ei:[1,365],se:[130,500],eb:[100,300],hi:[100,200],ni:[0,100],im:[50,200],mx:[1,36500],lch:[2,50],xn:[1,200],xr:[1,500]};
let fcCur=null,fcRevd=false,fcFr='id',fcFrK=null,fcUn=[],fcWait=0;
const fcDay=t=>Math.floor((t-new Date(t).getTimezoneOffset()*60000-144e5)/864e5);
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
function fcVis(c,al){al=al||fcAL();const v={},ids=Object.keys(al),o=S.o;let n=0;
 for(const id of ids){const lv=al[id],e=(c[3][id]||[]).filter(x=>!lv||lv.includes(x[3]));if(e.length){v[id]=e;n++}}
 return n&&(o.fm=='and'?n==ids.length:n>=Math.min(o.fmin,ids.length))?v:null}
function fcFront(k){const o=S.o;if(GK[k]||o.fd=='id')return'id';const L=lang(k),v=K[base(k)]&&fcVis(K[base(k)]);if(!v||!v[L])return'id';return o.fd=='fo'||Math.random()<.5?L:'id'}
function fcOk(k){const c=S.srs[k];if(c&&c.z)return 0;const o=S.o;
 if(GK[k])return o.deck!='v'&&fcGOk(GK[k]);
 const b=K[base(k)],L=lang(k),v=b&&fcVis(b);return!!v&&!!v[L]&&o.deck!='g'&&(!o.sp.length||o.sp.includes(b[1]))}
function fcPool(){const o=S.o;let a=[];
 if(o.deck!='g')a=fcPoolV();
 if(o.deck!='v')a=a.concat(fcGP().map(g=>g[0]));
 return a.filter(k=>!(S.srs[k]&&S.srs[k].z))}
function fcQ(){fcRoll();const now=Date.now(),td=fcDay(now),o=S.o,sd=S.sd,L=[],R=[],Nw=[],ah=[];let next=0,tm=0;
 for(const k of fcPool()){const c=S.srs[k];if(!c||!c.t){Nw.push(k);continue}
  if(c.t==2){if(c.d<=td)R.push(k);else if(c.d==td+1)tm++}
  else if(c.d<=now)L.push(k);else if(c.d<=now+12e5)ah.push(k);else if(!next||c.d<next)next=c.d}
 return{L,R,Nw:fcMixNew(Nw),ah,next,tm,nL:Math.max(0,o.nl+(sd.x|0)-sd.n),rL:Math.max(0,o.rl+(sd.y|0)-sd.r)}}
const fcMin=a=>a.reduce((x,y)=>S.srs[x].d<=S.srs[y].d?x:y);
function fcPick(q){const o=S.o;if(q.L.length)return fcMin(q.L);
 const nn=Math.min(q.Nw.length,q.nL),rr=Math.min(q.R.length,q.rL);
 const pn=()=>{if(o.ord!='rand')return q.Nw[0];if(o.deck=='all'){const G=q.Nw.filter(k=>GK[k]),V=q.Nw.filter(k=>!GK[k]);if(G.length&&V.length){const A=Math.random()<(o.gr==null?25:o.gr)/100?G:V;return A[Math.random()*A.length|0]}}return q.Nw[Math.random()*q.Nw.length|0]},pr=()=>q.R[Math.random()*q.R.length|0];
 if(nn&&rr){const useN=o.no=='before'||(o.no=='mix'&&Math.random()<nn/(nn+rr));return useN?pn():pr()}
 if(nn)return pn();if(rr)return pr();if(q.ah.length)return fcMin(q.ah);return null}
function fcSync(k,n){if(!S.o.lk)return;S.p[k]=n.t==2&&n.i>=21?2:1;S.s[k]=1}
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
function fcAns(r){const k=fcCur;if(!k||!fcRevd)return;fcRoll();const now=Date.now(),td=fcDay(now),c=S.srs[k],had=c&&c.t;
 fcUn.push({k,c:c?{...c}:undefined,sd:{...S.sd},p:S.p[k],td,lg:S.lg[td]?[...S.lg[td]]:undefined});if(fcUn.length>30)fcUn.shift();
 const n=fcCalc(c,r,now,true);if(GK[k])gCap(k,n);S.srs[k]=n;buzz(r==1?[16,40,16]:10);if(r==1&&(n.l|0)==lchN())setTimeout(()=>toast('🪨 Kartu bandel: sudah lupa '+n.l+'×. Tekan “🧠 Mnemonik” untuk prompt khusus kartu ini.'),60);
 if(!had){S.sd.n++;const lg=GK[k]?GK[k][1]:lang(k),w=S.nw[td]||(S.nw[td]={});w[lg]=(w[lg]|0)+1;for(const d in S.nw)if(+d<td-200)delete S.nw[d]}else if(c.t==2)S.sd.r++;
 const L=S.lg[td]||(S.lg[td]=[0,0]);L[0]++;if(r==1)L[1]++;
 for(const d in S.lg)if(+d<td-400)delete S.lg[d];
 fcSync(k,n);fcCur=null;fcRevd=false}
function fcUndo(){const u=fcUn.pop();if(!u)return;if(u.c)S.srs[u.k]=u.c;else{delete S.srs[u.k];const lg=GK[u.k]?GK[u.k][1]:lang(u.k),w=S.nw[u.td];if(w&&w[lg]>0)w[lg]--}S.sd=u.sd;
 if(u.p===undefined)delete S.p[u.k];else S.p[u.k]=u.p;if(u.lg)S.lg[u.td]=u.lg;else delete S.lg[u.td];fcCur=u.k;fcRevd=false;fcFrK=null}
function fcAct(a,x,k){
 if(a=='fcshow'){fcRevd=true;fcAuto()}
 else if(a=='fcans')fcAns(+x);
 else if(a=='fcundo')fcUndo();
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
 else if(a=='fcrst'){if(confirm('Hapus semua jadwal flashcard? (Status Belum/Sedang/Selesai tidak berubah)')){S.srs={};S.lg={};S.sd={d:-1,n:0,r:0,x:0,y:0};fcUn=[];fcCur=null}}}
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
 if(g){const t=(g[3]?`<div class=gsub>${esc(g[3])}</div>`:'')+`<div class=mean>${esc(g[4])}</div>`;return rev?t+'<hr><div style="text-align:left">'+gbody(g)+gSent(k,0)+'</div>':t}
 const b=base(k),L=lang(k),c=K[b],v0=fcVis(c)||{},v=v0[L]?{[L]:v0[L]}:v0,f=fcFr,mean=`<div class=mean>${esc(c[2])}</div>`;
 const lc=id=>D.L.find(l=>l[0]==id),ch=(n,col)=>`<span class=fch style="--lc:${col}">${esc(n)}</span>`;
 const blk=(ids,full)=>'<div class=grid>'+D.L.filter(l=>ids.includes(l[0])).map(([id,n,col])=>`<div class=lg style="--lc:${col}"><small>${n}</small>`+v[id].map(e=>`<div class=w>${wd(e[0],c[1],'F',id)}${spk(e[0],id)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}${full?fmx(e,c[1],id):''}${full&&e[2]?`<div class=ex>${esc(e[2])}</div>`:''}`).join('')+'</div>').join('')+'</div>';
 if(rev)return mean+'<hr>'+blk(Object.keys(v),1)+wSent(b,0);
 let p,t;
 if(f=='id'||!v[f]){p=mean;t=[ch(LN[L],lc(L)[2])]}
 else{p=`<div class=fcp>${ch(LN[f],lc(f)[2])}`+v[f].map(e=>`<div class=w style="font-size:1.8rem">${wd(e[0],c[1],'F',f)}${spk(e[0],f)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}`).join('')+'</div>';t=[ch('Indonesia','var(--a)')]}
 return p+`<div class=fchint><small>Ingat dalam:</small>${t.join('')}</div>`}
const fcN=(f,l,mn,mx)=>`<label class=fcl><span>${l}</span><input type=number inputmode=numeric data-i="fc_${f}" value="${S.o[f]}" min=${mn} max=${mx}></label>`;
const fcS=(f,l,op)=>`<label class=fcl><span>${l}</span><select data-i="fc_${f}" style="width:auto;margin:0">${op.map(([v,t])=>`<option value="${v}"${S.o[f]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
function fcSett(){const o=S.o,sz=Object.values(S.srs).filter(c=>c.z).length;
 return dtag('fs')+'<summary>Pengaturan flashcard</summary><div class=card>'+
 fcS('fd','Sisi depan kartu (kosakata)',[['id','Bahasa Indonesia'],['fo','Bahasa asing (acak)'],['mix','Campur Indonesia & asing']])+
 fcN('nl','Kartu baru per hari',0,9999)+fcN('rl','Maks. ulasan per hari',0,9999)+fcN('xn','Tambahan kartu baru saat target selesai (per ketukan)',1,200)+fcN('xr','Tambahan ulasan saat target selesai (per ketukan)',1,500)+
 fcS('ord','Urutan kartu baru',[['seq','Berurutan'],['rand','Acak']])+
 fcS('no','Kartu baru vs ulasan',[['after','Baru setelah ulasan'],['before','Baru sebelum ulasan'],['mix','Campur']])+
 `<label class=fcl><span><input type=checkbox data-i=fc_lk${o.lk?' checked':''}> Integrasikan progres Kartu ↔ Kosakata</span></label><small>Jawaban flashcard otomatis memperbarui status (Selesai = interval ≥ 21 hari). Sebaliknya, mengubah status di Belajar/Daftar/Grammar menyesuaikan jadwal: Selesai → masuk jadwal ulasan, Sedang → masuk belajar, Belum → jadwal kartu direset.</small><div class=btns><button data-a=fcsyncall>Sinkronkan sekarang</button></div>`+
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
 if(!fcCur||!fcOk(fcCur)){fcCur=fcPick(q);fcRevd=false;fcFrK=null}
 if(fcCur&&fcFrK!==fcCur){fcFr=fcFront(fcCur);fcFrK=fcCur}
 fcWait=fcCur?0:q.next;
 const nn=Math.min(q.Nw.length,q.nL),rr=Math.min(q.R.length,q.rL),ln=q.L.length+(nn+rr?0:q.ah.length);
 let h=fcHero(q,nn,rr)+`<div class=fcc><span class=k1><b>${nn}</b><small>Baru</small></span><span class=k2><b>${ln}</b><small>Belajar</small></span><span class=k3><b>${rr}</b><small>Ulas</small></span></div>`;
 if(fcCur){const k=fcCur,c=S.srs[k],g=GK[k],rev=fcRevd;
  const hd=g?`${LN[g[1]]||'Jerman'} ${g[2]} · Grammar`:PN[K[base(k)][1]]+' · '+(LN[lang(k)]||'');
  h+=`<div class="card fcard"${rev?'':' data-a=fcshow'}><div class=hd><span>${esc(hd)}</span><span class=${c&&c.t?(c.t==2?'k3':'k2'):'k1'}>${fcInfo(c)}</span></div><div class=fcf>${fcBody(k,rev)}</div></div>`;
  h+=rev?`<div class=dock><div class=fcb>${[1,2,3,4].map(r=>{const n=fcCalc(c,r,now,false);return`<button class="fb fb${r}" data-a=fcans data-v=${r}><small>${n.t==2?fcFmtD(n.i):fcFmt(n.d-now)}</small>${['Lagi','Sulit','Baik','Mudah'][r-1]}</button>`}).join('')}</div></div>`:'<div class=dock><button class=pri data-a=fcshow>Tampilkan jawaban</button></div>';
  h+=`<div class=fct><button data-a=fcundo${fcUn.length?'':' disabled'}>Urungkan</button><button data-a=fcsusp data-k="${esc(k)}">Tangguhkan</button>${aiBtn(k,'Kelas AI')}${isLch(k)?`<button class=on data-ai=leech data-k="${esc(k)}">🧠 Mnemonik</button>`:''}${S.lib.some(t=>t.L==(g?g[1]:lang(k)))?`<button data-a=libfind data-k="${esc(k)}">📚 Teks</button>`:''}<button class="${S.ed[g?'g':'v'][g?k:base(k)]?'on':''}" data-a=edit data-k="${esc(g?k:base(k))}" data-v=${g?'g':'v'}>✎ ${S.ed[g?'g':'v'][g?k:base(k)]?'Diedit':'Edit'}</button>${c&&c.t?`<button data-a=fcforget data-k="${esc(k)}">Reset kartu</button>`:''}</div>`}
 else{h+=fcDone(q,nn,rr);fcCelebrate(q,nn,rr)}
 return fcDeckBar()+fcFilt()+fcSett()+h+'<p><small>Filter flashcard (kosakata &amp; grammar) terpisah dari tab Belajar dan tab Grammar. Pintasan: Spasi = tampilkan / Baik, 1–4 = nilai, Z = urungkan.</small></p>'}
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
/* ===== Latihan membuat kalimat ===== */
const LTLV={zh:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6'],ja:['N5','N4','N3','N2','N1'],de:['A1','A2','B1','B2','C1'],nl:['A1','A2','B1','B2'],eo:['A1','A2','B1','B2','C1','C2']};
const LTCJ=['Ich','Du','Er/Sie/Es/Man','Wir','Ihr','sie/Sie'];
let ltCur=null,ltNote=[];
const ltKnown=(k,L)=>{if(L)k=ik(k,L);return st(k)>0||!!(S.srs[k]&&S.srs[k].t)};
const ltLang=()=>D.L.find(l=>l[0]==S.o.pl);
function ltPool(p,need){const o=S.o,L=o.pl,lv=o.plv,okl=x=>!lv.length||lv.includes(x),s=[],l=[],a=[];
 for(const c of D.C){if(c[1]!=p)continue;const es=c[3][L];if(!es)continue;a.push([c,es]);const g=es.filter(e=>okl(e[3]));if(g.length){l.push([c,g]);if(o.pw=='all'||(o.pw=='weak'?weakW(c[0],L):ltKnown(c[0],L)))s.push([c,g])}}
 if(s.length>=need)return{a:s};
 if(l.length>=need)return{a:l,n:'Kata sesuai sumber terpilih kurang untuk '+PN[p].toLowerCase()+' — memakai semua kata di level terpilih.'};
 return{a:a,n:'Kata '+PN[p].toLowerCase()+' di level terpilih kurang — memakai semua level.'}}
function ltDraw(p,n,ex){const P=ltPool(p,n),out=[];let arr=P.a.filter(x=>!ex.includes(x[0][0]));if(arr.length<n)arr=P.a;const used=new Set();
 while(out.length<n&&used.size<arr.length){const i=Math.random()*arr.length|0;if(used.has(i))continue;used.add(i);const c=arr[i][0],es=arr[i][1];out.push({k:c[0],p,m:c[2],e:es[Math.random()*es.length|0]})}
 if(P.n&&n)ltNote.push(P.n);return out}
function ltGPool(){const o=S.o,lv=o.plv,base=D.G.filter(g=>g[1]==o.pl&&(!o.pe||g[7].length));
 let a=base.filter(g=>!lv.length||lv.includes(g[2]));
 if(!a.length){a=base;if(base.length)ltNote.push('Tidak ada grammar di level terpilih — memakai semua level.')}
 if(o.pg=='weak'){const kn=a.filter(g=>{const r=gRec(g[0]);if(r!=null)return r>=.3;const s=S.lt.g[g[0]];return s&&s.n>0&&s.ok/s.n<.7});if(kn.length)return kn;ltNote.push('Belum ada grammar yang sering salah — memakai semua grammar.')}
 if(o.pg=='seen'){const kn=a.filter(g=>ltKnown(g[0]));if(kn.length)return kn;ltNote.push('Belum ada grammar yang ditandai Sedang/Selesai — memakai semua grammar.')}
 return a}
function ltPickG(ex){let a=ltGPool();if(a.length>1&&ex)a=a.filter(g=>g[0]!=ex);if(!a.length)return null;
 const wt=g=>{const r=gRec(g[0]);if(r!=null)return .3+r*3;const s=S.lt.g[g[0]];return s?Math.max(.3,1+(s.n-s.ok)*2-s.ok*.5):1},ws=a.map(wt);let r=Math.random()*ws.reduce((x,y)=>x+y,0);
 for(let i=0;i<a.length;i++){r-=ws[i];if(r<=0)return a[i]}return a[a.length-1]}

/* === Grammar Tahap 1: rubrik, jadwal dari latihan, kebaruan, Konteks === */
const LT=n=>S.lt[n]||(S.lt[n]={}),GCAP=20,GER=[['B','Bentuk sebelum pola keliru'],['M','Makna keliru'],['N','Nuansa tidak pas'],['T','Tata kata/partikel keliru']];
const GREL0=[['せいで','おかげで','せいで: hasil buruk; おかげで: hasil baik (bisa bernada sindiran).'],['せいで','ために','ために bisa berarti sebab maupun tujuan; せいで khusus sebab dengan hasil buruk.'],['ために','ように','ために: tujuan yang dikendalikan pelaku; ように: keadaan yang ingin dicapai.'],['せいで','ばかりに','ばかりに: satu sebab kecil berakibat buruk, disertai penyesalan.'],['せいで','せいか','せいか: menduga sebab dengan tidak yakin.'],['ばかり','だけ','ばかり: hampir hanya itu (cenderung berlebihan); だけ: hanya / batas jumlah.'],['ばかりか','どころか','ばかりか: tidak hanya A, bahkan B; どころか: bukan A, malah kebalikannya.'],['に対して','について','に対して: terhadap (sasaran/kontras); について: mengenai topik.'],['おかげで','からこそ','おかげで: berkat (fakta); からこそ: justru karena itu (menegaskan alasan).'],['ものの','ながらも','ものの: memang A, tetapi B; ながらも: meskipun A (netral).'],['だけでなく','のみならず','のみならず lebih formal/tulisan; だけでなく umum.'],['にとって','に対して','にとって: bagi (sudut pandang); に対して: terhadap (sasaran).'],['わけにはいかない','わけがない','わけにはいかない: tidak bisa (karena keadaan); わけがない: mustahil.'],['がち','っぽい','がち: cenderung (hal tak diinginkan); っぽい: berkesan / mirip.'],['以上は','からには','keduanya "karena sudah A maka B"; からには menekankan tanggung jawab.'],['ざるを得ない','しかない','ざるを得ない: terpaksa (formal); しかない: tak ada pilihan lain.'],['うちに','最中に','うちに: selagi keadaan masih ada; 最中に: tepat di tengah berlangsung.'],['だけに','だけあって','だけに: karena itu justru; だけあって: sesuai reputasi/kemampuan.'],['わけだ','わけではない','わけだ: berarti / wajar; わけではない: bukan berarti.'],['ことだ','ものだ','ことだ: saran; ものだ: kebenaran umum / kenangan.'],['てならない','てたまらない','てならない: perasaan muncul sendiri; てたまらない: tak tertahankan.'],['くせに','ながらも','くせに: celaan; ながらも: netral.'],['に違いない','に決まっている','に違いない: dugaan kuat dari bukti; に決まっている: pasti.']];
const GT={};D.G.forEach(g=>{if(g[1]=='ja'&&(g[2]=='N3'||g[2]=='N2')&&!GT[g[4]])GT[g[4]]=g});
const GR={};GREL0.forEach(([a,b,n])=>{if(GT[a]&&GT[b]){(GR[GT[a][0]]||(GR[GT[a][0]]=[])).push({o:GT[b][0],n});(GR[GT[b][0]]||(GR[GT[b][0]]=[])).push({o:GT[a][0],n})}});
const gVar=g=>g[4].replace(/[（(][^)）]*[)）]/g,'').split(/\s*[\/／]\s*/).map(x=>x.replace(/[～〜]/g,'').trim()).filter(Boolean);
function gRec(k){const a=LT('a')[k];if(!a||!a.length)return null;let b=0,w=1,t=0;a.slice(-6).reverse().forEach(x=>{b+=w*(x[2]==2?0:x[2]==1?.5:1);t+=w;w*=.8});return b/t}
function gAtt(k,ty,r,er){const a=LT('a')[k]||(LT('a')[k]=[]);a.push([Date.now(),ty,r,er||'']);if(a.length>12)a.shift()}
function gCap(k,n){if(S.o.cp===0||n.t!=2||n.i<=GCAP||(LT('pt')[k]|0)>=2)return;n.i=GCAP;n.d=fcDay(Date.now())+GCAP}
function gSrs(k,m){const c=S.srs[k];if(!c||!c.t||c.z)return;const n=fcCalc(c,m,Date.now(),true);gCap(k,n);S.srs[k]=n;fcSync(k,n)}

/* === v4.3–v4.5 taksonomi grammar (v4.5: + Jerman A1–C1): lihat kartu "Taksonomi grammar" di tab Atur untuk catatan update dan aturan konsistensi === */
const TXG={};for(const k in TX.G)TXG[TX.G[k][0]]=k;
const txT=k=>TX.G[k]?TX.G[k][1].split(' '):[],txL=t=>(TX.T[t]||[0,t])[1],txS=g=>g.startsWith('eo-')||g.startsWith('nl-')?g:g.slice(3),txK=s=>TXG[s]||TXG['ja-'+s]||TXG['de-'+s]||TXG['zh-'+s];
(function(){TX.R.forEach(([a,b,ty,n])=>{const x=TXG[a],y=TXG[b];if(!x||!y)return;[[x,y],[y,x]].forEach(([p,q])=>{const l=GR[p]||(GR[p]=[]);if(!l.some(z=>z.o==q))l.push({o:q,n})})})})();
const KM={};(function(){TX.K.forEach((c,i)=>{const m=c[1].map(([s,n])=>[txK(s),n]).filter(x=>x[0]);m.forEach(([a,na])=>{(KM[a]||(KM[a]=[])).push(i);m.forEach(([b,nb])=>{if(a==b)return;const l=GR[a]||(GR[a]=[]);if(!l.some(z=>z.o==b))l.push({o:b,n:txNm(a)+': '+na+' · '+txNm(b)+': '+nb})})})})})();
function cxRel(k){const e=(GR[k]||[]).map(x=>({...x,r:1})),gid=TX.G[k]&&TX.G[k][0];if(!gid)return e;const my=txT(k),have=new Set(e.map(x=>x.o));
 (TX.N[txS(gid)]||[]).forEach(s=>{const o=txK(s);if(!o||have.has(o))return;have.add(o);const sh=txT(o).filter(t=>t.startsWith('fn.')&&my.includes(t)).map(txL);e.push({o,n:'Mirip: berbagi '+(sh.join(', ')||'fungsi')+'.',r:0})});return e}
function txLine(k){const t=txT(k);if(!t.length)return'';const gid=TX.G[k][0],nb=(TX.N[txS(gid)]||[]).map(txK).filter(Boolean).map(o=>GK[o]&&txNm(o));
 return`<div class=gsub style="margin-top:6px">Fungsi: ${t.filter(x=>x.startsWith('fn.')).map(x=>esc(txL(x))).join(' · ')}${txPri(k)?' · Prioritas: '+PRIL[txPri(k)]:''}${t.some(x=>x.startsWith('att.'))?' · Sebelum pola: '+t.filter(x=>x.startsWith('att.')).map(x=>esc(txL(x))).join(', '):''}${t.some(x=>/^(kas|gen|pos|slot|cls|fin|ser|kol|afk)\./.test(x))?' · '+t.filter(x=>/^(kas|gen|pos|slot|cls|fin|ser|kol|afk)\./.test(x)).map(x=>esc(txL(x))).join(', '):''}${nb.length?'<br>Mirip: '+nb.map(esc).join(', '):''}</div>`}
/* === v4.4 taksonomi N5–N1: prioritas, tangga fungsi, kluster, prasyarat, rekomendasi, peta === */
const TXLG=['zh','ja','de','eo','nl'],TXLV={zh:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5'],ja:['N5','N4','N3','N2','N1'],de:['A1','A2','B1','B2','C1'],eo:['A1','A2','B1','B2','C1','C2'],nl:['A1','A2','B1','B2','C1','C2']},TXLN={zh:'Mandarin',ja:'Jepang',de:'Jerman',eo:'Esperanto',nl:'Belanda'},PRIL={1:'Inti',2:'Umum',3:'Jarang'};D.GL.forEach(l=>{if(TXLV[l[0]])TXLV[l[0]]=l[3].slice()});
const txLgs=()=>TXLG.filter(l=>!S.gf.length||S.gf.some(x=>x.startsWith(l+':')));
function txNm(k){const g=GK[k];if(g[1]!='de'&&g[1]!='nl')return(g[1]=='zh'||g[1]=='eo')&&g[4].length>42?g[4].slice(0,40)+'…':g[4];if((g[3]||'').trim()=='Preposisi'){const d=(g[5]||'').replace(/\s+/g,' ').trim();return g[4]+(d?' — '+(d.length>38?d.slice(0,36)+'…':d):'')}
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
 return'<small>Prioritas (per bahasa)</small><div class=chips>'+[['','Semua'],['1','Inti'],['2','Umum'],['3','Jarang']].map(([v,x])=>`<button class="chip${(S.o.gpri||'')==v?' on':''}" data-a=ui data-k=gpri data-v="${v}">${x}</button>`).join('')+'</div><small>Fungsi (per bahasa)</small><select data-i=ui_gfn><option value="">Semua fungsi</option>'+Object.keys(cnt).sort((a,b)=>txSh(a).localeCompare(txSh(b),'id')).map(d=>`<option value="${d}"${S.o.gfn==d?' selected':''}>${esc(txSh(d))} (${cnt[d].size})</option>`).join('')+'</select><small>Filter ini berlaku untuk grammar Mandarin, Jepang, Jerman, Esperanto, dan Belanda; bahasa lain tidak tampil bila filter aktif. Daftar fungsi mengikuti bahasa yang dipilih di atas.</small>'}
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
 return h+dtag('gmap'+lg)+'<summary>Matriks fungsi × level ('+TXLN[lg]+')</summary><small>Selesai / total per sel; warna makin hijau makin dikuasai (Sedang dihitung setengah). Ketuk sel atau nama fungsi untuk membuka daftar terfilter.</small><table class=gm><thead><tr><th></th>'+LV.map(l=>`<th>${l}</th>`).join('')+'</tr></thead><tbody>'+body+'</tbody></table></details>'}
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
function txCard(){return`<div class=card><b>Taksonomi grammar (Mandarin HSK 1–5 · Jepang N5–N1 · Jerman A1–C1 · Esperanto A1–C2 · Belanda A1–C2)</b><div style="margin:6px 0">${txCheck().map(([ok,m])=>`<div><small>${ok?'✓':'✗'} ${esc(m)}</small></div>`).join('')}</div><details><summary>Catatan update &amp; aturan konsistensi</summary><div style="font-size:.85rem;line-height:1.5;margin-top:6px"><p><b>v4.8 — kosakata Belanda &amp; bacaan Esperanto</b></p><ul><li><b>Kosakata Belanda (NL)</b>: 4.998 entri A1–B2 digabung ke kartu yang sudah ada (kata berarti sama berbagi kartu dengan bahasa lain; 1.294 kartu baru), lengkap dengan de/het, bentuk jamak, bentuk kata kerja (hij/zij/het · verleden · voltooid), dan komparatif kata sifat (sensor di ⚙ Sensor). Suara nl-NL, Latihan kalimat, Flashcard, Daftar, dan Statistik kini mendukung Belanda.</li><li><b>Bacaan Esperanto</b>: 61 teks per pelajaran (A1–C2) di tab Belajar → Bacaan, dengan terjemahan per kalimat (bisa disensor), suara, penanda sudah dibaca, dan ringkasan di Statistik.</li></ul><p><b>v4.7 — taksonomi grammar Belanda A1–C2</b></p><ul><li>Bahasa Belanda ditambahkan ke tab Grammar (belum ada sebelumnya): 380 pola dari sheet NL (A1 80, A2 84, B1 59, B2 63, C1 51, C2 43), ID progres <code>g|nl|A1|judul</code> (judul kembar diberi <code>#2</code>). Tanda rujukan "(Ref. §…)" dari sumber dibuang. (Kosakata Belanda ditambahkan di v4.8.)</li><li>Seluruh pola bertaksonomi dengan kerangka yang sama dengan Jerman: gid <code>nl-a1-001</code> … <code>nl-c2-043</code>, fungsi (fn), prioritas (Inti 220 · Umum 134 · Jarang 26), register, nuansa. ID pendek tetangga / kluster / prasyarat memakai gid penuh (<code>nl-a1-001</code>) seperti Esperanto; <code>txS</code> menanganinya.</li><li>Pohon fn dipakai bersama: tag lintas bahasa dipakai ulang (sebab, syarat, waktu, pasif, tujuan, perbandingan, Preposisi tuntutan …) dan 30 tag baru khusus Belanda (kata kerja lemah / kuat / tak beraturan, kata bantu zijn / hebben, fungsi <i>er</i>, partikel modal, pertanyaan tak langsung, gender de / het, idiom, variasi regional, surat, dll.). 32 label tag bersama dinetralkan agar cocok untuk Jerman dan Belanda (mis. Perfekt / perfectum, Präteritum / imperfectum).</li><li>Aspek khusus Belanda: <b>Gender</b> (<code>gen.de</code> de-woord, <code>gen.het</code> het-woord, <code>gen.pl</code> jamak), <b>Posisi kata kerja</b> (<code>pos.*</code>, dipakai bersama Jerman), dan sisa <b>Kasus</b> (<code>kas.gen</code>, <code>kas.dat</code> pada C2). Tampil di baris taksonomi kartu grammar.</li><li>43 kluster tertukar (want / omdat / doordat, als / toen, geen / niet / wél, de-woord / het-woord, perfectum / imperfectum, fungsi er, partikel modal …), 30 pasangan kontras / tertukar, 238 relasi prasyarat (tidak ada yang mengarah ke level lebih tinggi atau melingkar).</li><li>Tabel konjugasi Belanda (Ik · Jij / U · Hij / Zij / Het · Wij · Jullie · Zij) tampil sebagai tabel di kartu grammar. Nama pola Belanda di daftar tetangga / kluster ditambah konteks sub-bab (seperti Jerman). Tombol <i>Latih grammar ini</i> disembunyikan untuk bahasa yang belum punya Latihan kalimat.</li><li>Tag fungsi <code>fn.tense.praeteritum</code> tampil sebagai fungsi kedua pada kata kerja lemah / kuat / bantu supaya tangga kala tetap terlihat; pola kata kerja kuat B2 juga membawa <code>fn.verbform.participle</code>.</li></ul><p><b>v4.6 — taksonomi grammar Mandarin HSK 1–5 &amp; Esperanto A1–C2</b></p><ul><li>Seluruh 439 pola Mandarin (HSK 1 86, HSK 2 125, HSK 3 81, HSK 4 76, HSK 5 71) dan 266 pola Esperanto (A1 44, A2 55, B1 60, B2 46, C1 29, C2 32) kini bertaksonomi: gid <code>zh-h1-001</code> … <code>zh-h5-071</code> dan <code>eo-a1-001</code> … <code>eo-c2-032</code>, fungsi (fn), prioritas, register, nuansa. ID progres lama TIDAK berubah.</li><li>Aspek khusus Mandarin: <b>slot</b> (posisi pola dalam kalimat) dan <b>cls</b> (kelas kata / jenis struktur). Aspek khusus Esperanto: <b>fin</b> (akhiran), <b>ser</b> &amp; <b>kol</b> (tabel korelatif), <b>afk</b> (afiks). Tampil di baris taksonomi kartu grammar.</li><li>86 kluster tertukar Mandarin (termasuk kluster <i>Kembar</i> untuk entri HSK 1–2 yang membahas topik sama) dan 42 kluster Esperanto; 31 + 26 pasangan kontras; 149 + 224 relasi prasyarat.</li><li>ID pendek tetangga / kluster / prasyarat untuk Esperanto memakai gid penuh (<code>eo-a1-001</code>) agar tidak bentrok dengan Jerman (<code>a1-001</code>); fungsi <code>txS</code> dan <code>txK</code> menanganinya.</li><li>Mandarin belum punya pola HSK 6 di aplikasi.</li><li>Tag fungsi yang hanya dipakai 1 pola digabung ke tag induknya agar lolos aturan konsistensi (mis. fn.tense.*, fn.wordclass.*, fn.sentence.*); versi lengkap tetap ada di berkas xlsx.</li><li>Filter Prioritas &amp; Fungsi, Rekomendasi, dan Peta grammar kini berlaku untuk empat bahasa. Latihan Konteks tetap khusus pola yang punya contoh kalimat.</li></ul><p><b>v4.5 — taksonomi grammar Jerman A1–C1</b></p><ul><li>Taksonomi Jerman memakai kerangka yang sama dengan Jepang: seluruh 386 pola Jerman di aplikasi (A1 102, A2 93, B1 134, B2 30, C1 27) punya gid <code>de-a1-001</code> … <code>de-c1-027</code>, fungsi (fn), prioritas Inti / Umum / Jarang, dan register. ID progres lama (<code>g|de|A1|judul</code>) TIDAK berubah.</li><li>Pohon fn dipakai bersama: tag lintas bahasa (sebab, syarat, waktu, perintah, izin, keinginan, pasif, tujuan, topik, dasar, pengecualian …) dipakai ulang, ditambah tag khusus Jerman (bentuk kata kerja, kala, kasus &amp; deklinasi, deklinasi kata sifat, kalimat &amp; klausa, tempat &amp; arah, dll.). Preposisi diberi fn menurut maknanya, bukan menurut kata preposisinya.</li><li>Pengganti aspek <i>Sebelum pola</i> untuk Jerman: <b>Kasus</b>, <b>Gender / jamak</b>, <b>Posisi kata kerja</b>; tampil di baris taksonomi kartu grammar.</li><li>52 kluster tertukar (weil / denn, von / durch pada pasif, wegen / trotz / während, mit / durch / mittels …), 23 pasangan kontras (termasuk 9 pasangan Dativ posisi diam vs Akkusativ gerakan), 230 relasi prasyarat.</li><li>Filter Prioritas &amp; Fungsi, kartu Rekomendasi berikutnya, dan Peta grammar kini berlaku per bahasa (Mandarin, Jepang, Jerman, Esperanto). Level Jerman mengikuti daftar level di aplikasi (A1–C1); C2 otomatis ikut bila pola C2 ditambahkan (gid <code>de-c2-nnn</code>).</li><li>Latihan Konteks tetap khusus pola yang punya contoh kalimat (Jepang); pola Jerman belum punya contoh kalimat.</li></ul><p><b>v4.4 — taksonomi grammar N5–N1 + alat progres</b></p><ul><li>Taksonomi diperluas dari N5–N3 (398 pola) ke seluruh grammar Jepang di aplikasi: N5–N1 = 848 pola (N2 197, N1 253 baru). ID progres lama (<code>g|ja|N3|judul</code>) TIDAK berubah.</li><li>Fungsi (fn) diperhalus supaya pola bernuansa beda tidak tercampur: sebab dipecah (umum, alasan lembut, sebab+penilaian, ditekankan, pemicu), penambahan (plus / bukan hanya), daftar (contoh / pasangan), bahkan vs penekanan, hasil akhir vs gagal, serta fungsi baru: kebalikan, tanpa memandang, kecuali / kesampingkan, dasar &amp; kesesuaian, penilaian (wajar / layak), tak mempedulikan, puncak perasaan, nyaris, mencapai tahap, mending, terpaksa, seluruh.</li><li>Facet baru <b>Prioritas</b>: Inti / Umum / Jarang untuk tiap pola (penilaian editor, bukan statistik frekuensi). Register diaudit manual dan ditambah sastra / maskulin / feminin.</li><li><b>Kluster tertukar</b>: 86 kelompok pola yang sering salah pakai (mis. せいで/おかげで/ばかりに/せいか), tiap anggota diberi selisih nuansa. Dipakai sebagai pengecoh di latihan Konteks dan ditampilkan di kartu grammar.</li><li><b>Prasyarat</b>: 162 relasi "kuasai dulu" (mis. させられる ← させる + 受身形), dipakai untuk rekomendasi.</li><li>Kartu grammar: blok <i>Taksonomi · tangga · kluster</i> (fungsi, prioritas, tangga fungsi N5→N1 dengan status tiap pola, kluster, prasyarat; semua bisa diketuk).</li><li>Tab Grammar: filter <i>Prioritas</i> dan <i>Fungsi</i>; kartu <i>Rekomendasi berikutnya</i> (fungsi <code>gNxt</code>): fokus ke level terendah yang Inti-nya belum 80% tersentuh; skor = prioritas + celah level bawah + sedang dipelajari + kontinuitas fungsi + pembeda kluster − prasyarat belum dikuasai (prasyaratnya ikut naik).</li><li>Tab Statistik: kartu <i>Peta grammar Jepang</i> (<code>gMap</code>): progres per level + Inti, <i>celah di tangga fungsi</i> (kamu sudah menyentuh pola level tinggi dalam satu fungsi tetapi pola level bawahnya belum), dan matriks fungsi × level yang bisa diketuk untuk memfilter daftar.</li><li>Data <code>TX</code> kini: T=tag, G=pola→[gid, tag], N=tetangga (848 pola), K=kluster, P=prasyarat, R=relasi tertulis lama. Aturan: induk tag tidak dipakai sebagai daun; tiap pola punya 1 fn primary dan 1 prioritas.</li><li>Kartu pemeriksaan ini ditambah: semua grammar Jepang bertaksonomi, prioritas lengkap, kluster &amp; prasyarat valid, prasyarat tidak melingkar.</li></ul><p><b>v4.3 — taksonomi grammar (Jepang N5–N3)</b></p><ul><li>Data <code>TX</code> (T=tag, G=pola→[gid, tag], N=tetangga, R=relasi) ditanam di script; ID progres lama (<code>g|ja|N3|judul</code>) TIDAK berubah.</li><li>Latihan Konteks: pilihan jawaban = relasi tertulis dulu, lalu tetangga bertag fungsi sama (<code>cxRel</code>).</li><li>Layar Periksa Latihan kalimat menampilkan tag fungsi dan pola mirip.</li><li>Kartu ini memeriksa konsistensi data (<code>txCheck</code>).</li></ul><p><b>v4.2 — Tahap 1</b></p><ul><li>Hasil Latihan kalimat memperbarui jadwal grammar (Tepat→Baik, Hampir→Sulit, Belum tepat→Lagi), hanya jika grammar sudah ada di jadwal.</li><li>Rubrik 4 tanda masalah (B bentuk, M makna, N nuansa, T tata kata); bila ada tanda, Tepat dihitung Hampir. Log 12 percobaan terakhir per pola: <code>S.lt.a</code>.</li><li>Bobot pemilihan grammar dari 6 percobaan terakhir (<code>gRec</code>); hitungan lama dipakai bila belum ada log.</li><li>Batas interval 20 hari (<code>GCAP</code>) sampai ada 2 Produksi Tepat (<code>S.lt.pt</code>); matikan dengan <code>S.o.cp=0</code>.</li><li>Latihan Konteks (Jepang): kunci progres <code>S.lt.x</code> (pasangan tertukar "salah>benar"), <code>S.lt.q</code> (pilihan ditandai ambigu).</li></ul><p><b>Aturan agar pola konsisten saat menambah bahasa/level</b></p><ol><li><b>gid</b>: <code>{bahasa}-{level huruf kecil tanpa spasi}-{nnn}</code> (mis. <code>ja-n3-103</code>, <code>de-b1-045</code>, <code>zh-hsk3-012</code>). Nomor mengikuti urutan sumber saat pertama dibuat; jangan diubah; entri baru ditambah di akhir level. Satu gid ↔ satu <code>legacy_id</code> (ID lama).</li><li><b>Tag</b>: <code>{aspek}.{kelompok}.{daun}</code>, huruf kecil, maksimal 3 tingkat. Aspek: <code>fn</code> fungsi, <code>att</code> bentuk sebelum pola, <code>reg</code> register, <code>nu</code> nuansa. Pakai kembali tag yang ada (sebab, syarat, waktu, dst. berlaku lintas bahasa).</li><li><b>Tag baru</b> hanya bila ≥2 pola memakainya. Tidak boleh ada tag daun dipakai 1 pola; pola unik memakai tag induk. Tag daun yang terlalu umum (&gt;~20 pola) dipecah.</li><li><b>Setiap pola</b>: tepat 1 <code>fn</code> primary (urutan pertama), 0–2 <code>fn</code> secondary. <code>att/reg/nu</code> opsional. Bahasa non-konstruksi (Jerman, Belanda, Esperanto) mengganti <code>att</code> dengan aspek sendiri (Jerman: <code>kas</code> kasus, <code>gen</code> gender / jamak, <code>pos</code> posisi kata kerja; Belanda: <code>gen</code> de / het / jamak, <code>pos</code>, sisa <code>kas</code>; Esperanto: akhiran), tetap pakai <code>fn</code>.</li><li><b>Relasi</b>: tipe <code>contrast</code> (berlawanan) atau <code>confusable</code> (mudah tertukar); satu bahasa, a≠b, tanpa duplikat; catatan = satu kalimat pembeda.</li><li><b>Tetangga</b>: dihitung ulang setiap tag berubah (kemiripan tag berbobot IDF, induk tag ikut dihitung, wajib berbagi ≥1 tag <code>fn</code>, ambil 5 teratas, hanya dalam satu bahasa).</li><li><b>Urutan kerja</b>: ubah tabel (grammar, tags, grammar_tags, grammar_relations) → hitung ulang tetangga → ganti konstanta <code>TX</code> → buka Atur → kartu Taksonomi harus tanpa ✗.</li><li><b>Jangan</b> mengganti judul di sumber tanpa memetakan ulang <code>legacy_id</code>, atau progres lama menjadi yatim.</li></ol><p><b>Batas akurasi</b>: tag <code>fn</code> ditetapkan manual per pola; <code>att/reg/nu</code> masih tebakan aturan kata kunci dan perlu ditinjau. Relasi baru 17 pasangan (+23 dari v4.2 untuk N3–N2). Terjemahan contoh Jepang belum ada.</p></div></details></div>`}
let cx=null;
function cxNew(){const ids=D.G.filter(g=>g[7].length&&cxRel(g[0]).length&&(!S.o.pl||g[1]==S.o.pl)).map(g=>g[0]);if(!ids.length){cx=null;return}
 const ws=ids.map(k=>{const r=gRec(k);return r==null?1:.3+r*3});
 for(let t=0;t<30;t++){let r=Math.random()*ws.reduce((x,y)=>x+y,0),i=0;for(;i<ids.length-1;i++){r-=ws[i];if(r<=0)break}
  const g=GK[ids[i]],V=gVar(g),rel=cxRel(g[0]).filter(x=>!LT('q')[g[0]+'|'+x.o]),oth=[].concat(...rel.map(x=>gVar(GK[x.o])));
  const ex=g[7].filter(s=>V.some(v=>s.includes(v))&&!oth.some(o=>s.includes(o)&&!V.some(v=>o.includes(v))));if(!ex.length||!rel.length)continue;
  const s=ex[Math.random()*ex.length|0],v=V.filter(v=>s.includes(v)).sort((a,b)=>b.length-a.length)[0],p=rel.filter(x=>x.r).sort(()=>Math.random()-.5).concat(rel.filter(x=>!x.r).sort(()=>Math.random()-.5)).slice(0,3);
  const o=[{id:g[0],t:g[4]}].concat(p.map(x=>({id:x.o,t:GK[x.o][4]}))).sort(()=>Math.random()-.5);
  cx={g:g[0],s:s.replace(v,'＿＿＿'),f:s,o,pick:null,res:null};return}
 cx=null}
function cxFin(){if(!cx||!cx.res||cx.done)return;cx.done=1;if(cx.res.amb)return;const ok=cx.res.ok;gAtt(cx.g,'k',ok?2:0);gSrs(cx.g,ok?3:1);if(!ok){const x=LT('x'),k=cx.pick+'>'+cx.g;x[k]=(x[k]|0)+1}}
function cxAct(a,x){if(a=='ltcx'){cxFin();cxNew();goSec='sec-l'}
 else if(a=='ltcxo'){cxFin();cx=null}
 else if(a=='ltcxp'&&cx&&!cx.pick){const o=cx.o[+x];cx.pick=o.id;cx.res={ok:o.id==cx.g}}
 else if(a=='ltcxa'&&cx&&cx.res&&!cx.res.ok){cx.res.amb=1;LT('q')[cx.g+'|'+cx.pick]=1}}
function cxView(){const g=GK[cx.g];let h=`<div class=card><div class=hd><span>Konteks · ${esc(g[2])}</span><button class=mini data-a=ltcxo>✕ Tutup</button></div><div class=gsub>Pilih pola yang paling tepat untuk mengisi kosong:</div><div class=mean style="margin:8px 0">${esc(cx.s)}</div><div class=btns style="flex-direction:column;gap:6px">`;
 cx.o.forEach((o,i)=>{const done=cx.pick!=null,right=o.id==cx.g,me=o.id==cx.pick;h+=`<button data-a=ltcxp data-v=${i}${done?' disabled':''}>${done&&right?'✓ ':done&&me?'✗ ':''}${esc(o.t)}</button>`});
 h+='</div>';
 if(cx.res){h+=`<p>${cx.res.amb?'Ditandai ambigu: tidak dihitung.':cx.res.ok?'<b>Benar.</b>':'<b>Belum tepat.</b> Jawaban: '+esc(g[4])+'.'}</p><p><small>${esc(cx.f)}</small></p>`;
  const rl=cxRel(cx.g).find(x=>x.o==cx.pick)||cxRel(cx.g)[0];if(rl&&!cx.res.ok)h+=`<p><small>Beda: ${esc(rl.n)}</small></p>`;
  h+=`<div class=btns><button class=pri data-a=ltcx>Soal berikutnya</button>${cx.res.ok||cx.res.amb?'':'<button data-a=ltcxa>Jawabanku juga benar (ambigu)</button>'}</div>`}
 return h+'</div>'}
function ltNew(){const o=S.o;ltNote=[];const g=ltPickG(null);let w=[];
 for(const[p,f]of[['N','pn'],['A','pa'],['V','pv'],['O','po']])if(o[f]>0)w=w.concat(ltDraw(p,o[f],[]));
 ltCur={lang:o.pl,g:g?g[0]:null,w,txt:'',rev:0,copied:0,copiedP:0}}
function ltHit(t,e,lang){t=(t||'').toLowerCase();if(!t.trim())return 0;
 const vs=String(e[0]).replace(/\([^)]*\)|（[^）]*）/g,'').split(/[\/／、,;，]/).map(x=>x.replace(/^(der|die|das|sich|ein|eine|de|het|zich|een)\s+/i,'').replace(/[~〜…。.]/g,'').trim().toLowerCase()).filter(Boolean);
 for(const w of vs){const c=[w];
  if(lang=='ja'){if(w.length>1)c.push(w.slice(0,-1));if(w.endsWith('する')&&w.length>2)c.push(w.slice(0,-2))}
  if(lang=='de'||lang=='nl'){if(w.endsWith('en')&&w.length>4)c.push(w.slice(0,-2));else if(w.endsWith('n')&&w.length>3)c.push(w.slice(0,-1))}
  if(lang=='eo'&&/[oaie]$/.test(w)&&w.length>3)c.push(w.slice(0,-1));
  if(c.some(x=>x&&t.includes(x)))return 1}
 return 0}
function ltPrompt(){const c=ltCur,g=GK[c.g],L=ltLang()[1];
 return`Saya sedang belajar bahasa ${L}. Tolong koreksi kalimat buatan saya.\n\nGrammar: ${g[4]} (${g[2]})\n`+(g[5]?`${g[11]||'Fungsi'}: ${g[5]}\n`:'')+(g[6]?`Pola: ${g[6]}\n`:'')+`\nKata yang harus dipakai:\n`+c.w.map(w=>`- ${w.e[0]}${w.e[1]?' ('+w.e[1]+')':''} = ${w.m} [${PN[w.p]}]`).join('\n')+`\n\nKalimat saya:\n${c.txt||'(belum ditulis)'}\n\nMohon beri tahu: (1) apakah sudah benar, (2) versi yang diperbaiki beserta artinya, (3) penjelasan singkat dalam bahasa Indonesia.`}
function ltPromptGen(){const c=ltCur,g=GK[c.g],L=ltLang()[1],o=S.o,rm=o.pl=='zh'?'pinyin':o.pl=='ja'?'romaji':'';
  const kv=(g[10]||[]).filter(p=>p[0]||p[1]);
  return`Saya sedang belajar bahasa ${L}. Tolong buatkan kalimat contoh dalam bahasa ${L} untuk latihan saya.\n\nGrammar: ${g[4]} (${g[2]})\n`+(g[5]?`${g[11]||'Fungsi'}: ${g[5]}\n`:'')+(g[6]?`Pola: ${g[6]}\n`:'')+
  (kv.length?`Tabel/rincian: ${kv.map(p=>p[0]+' = '+p[1]).join('; ')}\n`:'')+
  (g[8].length?`${g[12]||'Keterangan'}:\n${g[8].map(x=>'- '+x).join('\n')}\n`:'')+(g[9].length?`Kasus khusus:\n${g[9].map(x=>'- '+x).join('\n')}\n`:'')+
  (g[7].length?`Contoh dari materi:\n${g[7].slice(0,3).map(e=>'- '+e.split('\n').join(' | ')).join('\n')}\n`:'')+
  `\nKosakata yang harus dipakai:\n`+(c.w.length?c.w.map(w=>`- ${w.e[0]}${w.e[1]?' ('+w.e[1]+')':''} = ${w.m} [${PN[w.p]}]`).join('\n'):'(tidak ada, cukup pakai kosakata umum)')+
  `\n\nPermintaan:\n1. Buat 3 kalimat berbeda yang memakai grammar di atas${c.w.length?' dan SEMUA kosakata di atas (boleh diubah bentuknya bila perlu)':''}.\n2. Sesuaikan tingkat kesulitan dengan level ${g[2]}.\n3. Untuk tiap kalimat tulis: kalimatnya${rm?', '+rm:''}, terjemahan bahasa Indonesia, dan penjelasan singkat bagaimana grammar serta kosakatanya dipakai.\n4. Tulis penjelasan dalam bahasa Indonesia.`}
function ltCopy(t){try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).catch(()=>{});return}}catch(e){}
 const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
function ltAct(a,x,k){const c=ltCur,o=S.o;if(a!='ltrate')ltMsg='';
 if(a.slice(0,4)=='ltcx'){cxAct(a,x);return}
 if(a=='lter'&&c){const e=c.er||'';c.er=e.includes(x)?e.replace(x,''):e+x;return}
 if(a=='ltnew'){ltNew();goSec='sec-l'}
 else if(a=='ltrg'&&c){ltNote=[];const g=ltPickG(c.g);if(g){c.g=g[0];c.rev=0;c.copiedP=0}}
 else if(a=='ltrw'&&c){ltNote=[];let w=[];for(const[p,f]of[['N','pn'],['A','pa'],['V','pv'],['O','po']])if(o[f]>0)w=w.concat(ltDraw(p,o[f],c.w.filter(z=>z.p==p).map(z=>z.k)));c.w=w;c.rev=0;c.copiedP=0}
 else if(a=='ltre'&&c){ltNote=[];const w=c.w[+x];if(w){const n=ltDraw(w.p,1,c.w.filter(z=>z.p==w.p).map(z=>z.k));if(n.length){c.w[+x]=n[0];c.copiedP=0}}}
 else if(a=='ltchk'&&c){c.rev=1;goSec='lt-rev'}
 else if(a=='ltedit'&&c){c.rev=0;goSec='ltTxt'}
 else if(a=='ltcopy'&&c&&c.g){ltCopy(ltPrompt());c.copied=1}
  else if(a=='ltcopyp'&&c&&c.g){ltCopy(ltPromptGen());c.copiedP=1}
 else if(a=='ltrate'&&c&&c.g){let r=+x;const g=GK[c.g],td=fcDay(Date.now()),er=c.er||'';if(r==2&&er)r=1;let up=0;
  const has=c.txt.trim();
  if(has){S.lt.h.push({t:Date.now(),g:c.g,gt:g[4],lv:g[2],l:c.lang,w:c.w.map(w=>[w.e[0],w.e[1],w.m,w.p]),k:c.w.map(w=>w.k),s:c.txt.trim(),r,er});if(S.lt.h.length>1000)S.lt.h=S.lt.h.slice(-1000)}
  const d=S.lt.d[td]||(S.lt.d[td]=[0,0,0]);d[0]++;if(r==2)d[1]++;if(r==1)d[2]++;
  const s=S.lt.g[c.g]||(S.lt.g[c.g]={n:0,ok:0});s.n++;if(r==2)s.ok++;
   if(has){gAtt(c.g,'p',r,er);if(r==2)LT('pt')[c.g]=(LT('pt')[c.g]|0)+1;gSrs(c.g,r==2?3:r==1?2:1)}
  if(r==2&&has&&o.lx)[c.g,...c.w.map(w=>ik(w.k,c.lang))].forEach(z=>{if(z&&!st(z)){S.p[z]=1;S.s[z]=1;fcFS(z);up++}});
  sBuild();ltNew();goSec='sec-l';ltMsg=up?'Status naik ke Sedang: '+up+' item (kata/grammar) karena kalimatmu tepat.':''}
 else if(a=='ltgo'&&GK[k]&&LTLV[GK[k][1]]){const L=GK[k][1];if(o.pl!=L){o.pl=L;o.plv=[]}ltNew();ltCur.g=k;ltCur.rev=0;tab='ses';goSec='sec-l'}
 else if(a=='ltfw'&&K[k]){const cd=K[k],ls=Object.keys(cd[3]).filter(l=>LTLV[l]);if(!ls.length){toast('Bahasa kata ini belum tersedia di Latihan.');return}
  const L=ls.includes(o.pl)?o.pl:ls[0];if(o.pl!=L){o.pl=L;o.plv=[]}ltNew();const es=cd[3][L];
  ltCur.w=ltCur.w.filter(z=>z.k!=k);const w={k,p:cd[1],m:cd[2],e:es[Math.random()*es.length|0]},i=ltCur.w.findIndex(z=>z.p==cd[1]);i<0?ltCur.w.push(w):ltCur.w[i]=w;tab='ses';goSec='sec-l'}
 else if(a=='ltlang'){if(LTLV[x]){o.pl=x;o.plv=[];ltCur=null}}
 else if(a=='ltlv'){const f=o.plv.slice(),i=f.indexOf(x);i<0?f.push(x):f.splice(i,1);o.plv=f;ltCur=null}
 else if(a=='ltlvall'){o.plv=[];ltCur=null}
 else if(a=='ltclr'){if(confirm('Hapus semua riwayat kalimat?')){S.lt.h=[];sBuild()}}}
function ltSet(i,el){const f=i.slice(3),o=S.o;
 if(['pn','pa','pv','po'].includes(f)){const x=parseInt(el.value);if(isFinite(x))o[f]=Math.min(10,Math.max(0,x))}
 else if(f=='lm'){o.lm=+el.checked;return}
 else if(f=='ps'){o.ps=el.value;return}
  else if(f=='pe'||f=='lx')o[f]=+el.checked;
 else{o[f]=el.value;if(f=='pl')o.plv=[]}
 ltCur=null}
const ltN=(f,l)=>`<label class=fcl><span>${l}</span><input type=number inputmode=numeric data-i="lt_${f}" value="${S.o[f]}" min=0 max=10></label>`;
const ltS=(f,l,op)=>`<label class=fcl><span>${l}</span><select data-i="lt_${f}" style="width:auto;margin:0">${op.map(([v,t])=>`<option value="${v}"${S.o[f]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
function ltSett(){const o=S.o,lv=LTLV[o.pl]||[];
 return dtag('lt')+`<summary><span>Pengaturan latihan</span>${o.plv.length?`<em class=cnt>${o.plv.join(', ')}</em>`:''}</summary><div class=card>`+
 `<small>Level (grammar &amp; kosakata)</small><div class=chips><button class="chip${o.plv.length?'':' on'}" data-a=ltlvall>Semua</button>${lv.map(v=>`<button class="chip${o.plv.includes(v)?' on':''}" data-a=ltlv data-v="${v}">${v}</button>`).join('')}</div>`+
 '<small>Jumlah kata per soal (selain grammar), 0–10 per jenis</small>'+ltN('pn','Kata benda')+ltN('pa','Kata sifat')+ltN('pv','Kata kerja')+ltN('po','Kosakata lain')+
 ltS('pw','Sumber kosakata',[['all','Semua kata'],['seen','Hanya yang sudah dipelajari'],['weak','Kata yang lemah']])+
 ltS('pg','Sumber grammar',[['all','Semua grammar'],['seen','Hanya yang sudah dipelajari'],['weak','Grammar yang sering salah']])+
 `<label class=fcl><span><input type=checkbox data-i=lt_pe${o.pe?' checked':''}> Hanya grammar yang punya contoh kalimat</span></label>`+
`<label class=fcl><span><input type=checkbox data-i=lt_lx${o.lx?' checked':''}> Nilai "Tepat" menaikkan status Belum → Sedang (kata &amp; grammar yang dipakai)</span></label>`+
 '<small>Sensor kata/gender/jamak diatur di tab Atur → Sensor. "Sudah dipelajari" = berstatus Sedang/Selesai atau sudah ada di jadwal flashcard. Grammar yang sering salah akan lebih sering muncul. "Lemah" = kalimat terakhir dengan kata itu belum tepat, atau pernah dilupakan di flashcard; grammar lemah = akurasi di bawah 70%.</small></div></details>'}
function ltHist(){const H=S.lt.h,n=H.length;
 return dtag('hist')+`<summary>Riwayat kalimat (${n})</summary><div class=card>`+(n?H.slice(-Math.min(lim,n)).reverse().map(x=>sItem(x,{g:1,w:1,del:1})).join('')+(n>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':'')+'<div class=btns><button data-a=ltclr>Hapus riwayat</button></div>':'<small>Belum ada kalimat tersimpan. Kalimat yang kamu nilai di Latihan akan muncul juga di detail tiap kata dan grammar.</small>')+'</div></details>'}
function gpre(g){const t=g.slice();t[7]=[];t[8]=[];t[9]=[];t[10]=(g[10]||[]).filter(p=>!LTCJ.includes(p[0]));return gbody(t)}
const LTSTEP=['Grammar','Kata','Tulis','Nilai'];
function ltTop(c,Lg,dd){const cur=c&&c.rev?3:2;
 return SEC_HEAD('Latihan kalimat','Buat satu kalimat dengan grammar dan kata di bawah')+
 `<div class=langs role=tablist>${Object.keys(LTLV).map(id=>{const l=D.L.find(z=>z[0]==id);return l?`<button class="${id==S.o.pl?'on':''}" data-a=ltlang data-v=${id} style="--lc:${l[2]}"><i></i>${l[1]}</button>`:''}).join('')}</div>`+
 ltSett()+
 `<ol class=steps>${LTSTEP.map((x,i)=>`<li class="${i<cur?'d':''}${i==cur?' cur':''}">${x}</li>`).join('')}</ol>`+
 `<div class=chipline><span>Hari ini ${dd[0]} soal</span><span>${dd[1]} tepat</span></div>`+(ltMsg?`<div class=okmsg>${esc(ltMsg)}</div>`:'')}
function ltView(){const o=S.o;if(!ltCur||ltCur.lang!=o.pl)ltNew();
 if(cx)return cxView();
 const c=ltCur,g=c.g&&GK[c.g],Lg=ltLang(),dd=S.lt.d[fcDay(Date.now())]||[0,0,0];
 let h=ltTop(c,Lg,dd);
 if(!g)return h+'<div class="card empty"><b>Tidak ada grammar</b>Tidak ada grammar yang cocok dengan pengaturan ini. Ubah level atau sumber grammar di pengaturan.</div>';
 const gs=S.lt.g[c.g];
 h+=`<div class=card><div class=hd><span>${Lg[1]} ${esc(g[2])}${g[3]?' · '+esc(g[3]):''}</span><button class=mini data-a=ltrg>↻ Ganti grammar</button></div><div class=mean>${esc(g[4])}</div>${c.rev?gbody(g)+txLine(c.g):gpre(g)}<div class=gsub style="margin-top:10px">${STN[st(c.g)]}${gs&&gs.n?` · pernah dilatih ${gs.n}× (${Math.round(gs.ok/gs.n*100)}% tepat)`:' · belum pernah dilatih'} · <button class="lnk" data-a=gopen data-k="${esc(c.g)}">buka di Grammar</button></div></div>`;
 h+=`<div class=card><div class=hd><span>Kata yang harus dipakai</span><button class=mini data-a=ltrw>↻ Acak ulang</button></div>`+(c.w.length?c.w.map((w,i)=>{const hit=c.rev?ltHit(c.txt,w.e,o.pl):-1,hid=o.ps=='id'&&!c.rev,nw=(SI.w[w.k]||[]).length;
  return`<div class=ltw><span class=fch style="--lc:var(--m)">${PN[w.p]}</span>${hid?`<span class=w>${esc(w.m)}</span>`:`<span class=w style="color:${Lg[2]}">${wd(w.e[0],w.p,'L',o.pl,c.rev)}</span>${w.e[1]?`<span class="r rom">${esc(w.e[1])}</span>`:''}<small class="${o.lm&&!c.rev?'ltm mnh':''}">${esc(w.m)}</small>`}<span class=bdg>${STN[st(ik(w.k,o.pl))]}${nw?' · ✎'+nw:''}</span><span class=sp>${c.rev?`<b class="${hit?'k3':'k2'}">${hit?'✓ terdeteksi':'? belum terdeteksi'}</b>`:`<button class=mini data-a=ltre data-v=${i} title="Ganti kata ini" aria-label="Ganti kata ini">↻</button>`}<button class=mini data-a=wopen data-k="${esc(w.k)}" title="Detail kata" aria-label="Detail kata">ⓘ</button></span>${hid?'':fmx(w.e,w.p,o.pl,c.rev)}</div>`}).join(''):'<small>Tidak ada kata tambahan (atur jumlah kata di pengaturan).</small>')+(c.rev&&c.w.length?'<small>Deteksi kata hanya perkiraan; bentuk kata yang berubah (konjugasi, partikel) bisa tidak terbaca.</small>':'')+'</div>';
 const nt=[...new Set(ltNote)];if(nt.length)h+=`<p><small>${nt.map(esc).join('<br>')}</small></p>`;
 if(!c.rev){
  h+=`<textarea id=ltTxt rows=3 placeholder="Tulis kalimat dalam bahasa ${Lg[1]} yang memakai grammar dan semua kata di atas">${esc(c.txt)}</textarea><div class=gsub style="margin:4px 2px 10px">Ctrl/⌘ + Enter untuk memeriksa</div>`;
  h+=`<button class=pri data-a=ltchk style="margin:0 0 10px">Periksa &amp; lihat referensi</button><div class=fct><button data-a=ltnew>Soal baru</button><button data-a=ltcopy>${c.copied?'Tersalin ✓':'Salin untuk koreksi AI'}</button><button data-a=ltcopyp>${c.copiedP?'Tersalin ✓':'Prompt buat kalimat'}</button>${o.pl=='ja'?'<button data-a=ltcx>Latihan Konteks</button>':''}</div>`;
 }else{
  h+=`<div class=card id=lt-rev><div class=gsec style="margin:0 0 4px">Kalimatmu</div><div class=gtx style="font-size:1.1rem">${c.txt.trim()?esc(c.txt):'(belum ditulis)'}</div><div class=btns><button data-a=ltedit>Edit lagi</button><button data-a=ltcopy>${c.copied?'Tersalin ✓':'Salin untuk koreksi AI'}</button><button data-a=ltcopyp>${c.copiedP?'Tersalin ✓':'Prompt buat kalimat'}</button></div></div>`;
  const pg=(SI.g[c.g]||[]).slice(-3).reverse(),seen=new Set(pg.map(x=>x.t)),pw=[];
  c.w.forEach(w=>(SI.w[w.k]||[]).slice().reverse().forEach(x=>{if(!seen.has(x.t)&&pw.length<3){seen.add(x.t);pw.push(x)}}));
  if(pg.length)h+=`<div class=card><div class=gsec style="margin-top:0">Kalimatmu sebelumnya dengan grammar ini</div>${pg.map(x=>sItem(x,{w:1})).join('')}</div>`;
  if(pw.length)h+=`<div class=card><div class=gsec style="margin-top:0">Kalimatmu sebelumnya dengan kata-kata ini</div>${pw.map(x=>sItem(x,{g:1,w:1})).join('')}</div>`;
  h+=`<div class=card><div class=gsec style="margin:0 0 6px">Rubrik — tandai yang keliru</div><div class=fct>${GER.map(([t,l])=>`<button data-a=lter data-v=${t} aria-pressed=${(c.er||'').includes(t)}>${(c.er||'').includes(t)?'✗ ':''}${l}</button>`).join('')}</div><small>Bila ada yang ditandai, "Tepat" dihitung "Hampir".</small></div><p><small>Bandingkan dengan contoh dan keterangan di atas, lalu nilai kalimatmu:</small></p><div class=dock><div class=fcb style="grid-template-columns:repeat(3,1fr)"><button class="fb fb1" data-a=ltrate data-v=0>Belum tepat</button><button class="fb fb2" data-a=ltrate data-v=1>Hampir</button><button class="fb fb3" data-a=ltrate data-v=2>Tepat</button></div></div><div class=fct><button data-a=ltnew>Lewati, soal baru</button></div>`}
 return h+ltHist()}
function ltStatsCard(){const d=S.lt.d,td=fcDay(Date.now());let t=0,ok=0,ha=0,w=0,wo=0;
 for(const k in d){const x=d[k];t+=x[0];ok+=x[1];ha+=x[2]|0;if(+k>td-7){w+=x[0];wo+=x[1]}}
 if(!t)return'<div class=card><b>Latihan kalimat</b><p><small>Belum ada latihan. Mulai dari tab Belajar (bagian Latihan kalimat) — hasilnya muncul di sini dan di detail tiap kata &amp; grammar yang dipakai.</small></p></div>';
 const bad=Math.max(0,t-ok-ha),pc=x=>x/t*100,lg={};
 D.G.forEach(g=>{(lg[g[1]]||(lg[g[1]]={n:0,ok:0,u:0,tot:0})).tot++});
 for(const k in S.lt.g){const g=GK[k];if(!g)continue;const s=S.lt.g[k],l=lg[g[1]];l.n+=s.n;l.ok+=s.ok;if(s.n)l.u++}
 const wg=Object.entries(S.lt.g).filter(([k,s])=>GK[k]&&s.n>0&&s.ok<s.n).sort((a,b)=>(b[1].n-b[1].ok)-(a[1].n-a[1].ok)||a[1].ok/a[1].n-b[1].ok/b[1].n).slice(0,5);
 const bw={};S.lt.h.forEach(x=>(x.k||[]).forEach(k=>{if(!k)return;const o=bw[k]||(bw[k]={n:0,b:0});o.n++;if(x.r==0)o.b++}));
 const ww=Object.entries(bw).filter(([k,o])=>o.b>0&&K[k]).sort((a,b)=>b[1].b-a[1].b||b[1].b/b[1].n-a[1].b/a[1].n).slice(0,5);
 return`<div class=card><b>Latihan kalimat</b> — ${t} soal<div class=bar><i style="width:${pc(ok)}%;background:var(--s2)"></i><i style="width:${pc(ha)}%;background:var(--s1)"></i><i style="width:${pc(bad)}%;background:#dc2626"></i></div>Tepat ${ok} · Hampir ${ha} · Belum tepat ${bad}<p><small>7 hari terakhir: ${w} soal${w?`, ${Math.round(wo/w*100)}% tepat`:''} · ${S.lt.h.length} kalimat tersimpan</small></p>`+
 Object.entries(lg).filter(([,l])=>l.n).map(([id,l])=>`<div class=lg style="--lc:${(D.L.find(z=>z[0]==id)||[])[2]||'var(--m)'};margin:6px 0"><small>${esc(LN[id]||id)}</small><div>${l.n} soal · ${Math.round(l.ok/l.n*100)}% tepat · ${l.u}/${l.tot} grammar pernah dilatih</div></div>`).join('')+'</div>'+
 (wg.length?`<div class=card><b>Grammar yang perlu latihan</b>`+wg.map(([k,s])=>{const g=GK[k];return`<div class=row><div data-a=gopen data-k="${esc(k)}"><b>${esc(g[4])}</b><br><small>${esc(LN[g[1]]||'Jerman')} ${esc(g[2])} · ${s.ok}/${s.n} tepat (${Math.round(s.ok/s.n*100)}%)</small></div><button data-a=ltgo data-k="${esc(k)}">Latih</button></div>`}).join('')+'</div>':'')+
 (ww.length?`<div class=card><b>Kata yang sering salah</b>`+ww.map(([k,o])=>{const c=K[k];return`<div class=row><div data-a=wopen data-k="${esc(k)}"><b>${esc(c[2])}</b> <small>${PN[c[1]]}</small><br><small>${o.b}× belum tepat dari ${o.n} kalimat</small></div><button data-a=ltfw data-k="${esc(k)}">Latih</button></div>`}).join('')+'</div>':'')}
document.addEventListener('input',e=>{if(e.target.id=='ltTxt'&&ltCur){ltCur.txt=e.target.value;e.target.style.height='auto';e.target.style.height=Math.max(e.target.scrollHeight+2,96)+'px'}});
document.addEventListener('keydown',e=>{if(e.target.id=='ltTxt'&&ltCur&&(e.ctrlKey||e.metaKey)&&e.key=='Enter'){e.preventDefault();ltCur.txt=e.target.value;ltAct('ltchk');save();render();const el=document.getElementById('lt-rev');el&&el.scrollIntoView({block:'start'});goSec=''}});
/* ===== Integrasi antar bagian: kalimat latihan <-> kosakata <-> grammar <-> statistik ===== */
const RT=['Belum tepat','Hampir','Tepat'],WI={};D.C.forEach(c=>{(WI[c[1]+'|'+c[2]]||(WI[c[1]+'|'+c[2]]=[])).push(c)});
let SI={w:{},g:{}},xo=new Set,foc='',fk='',ltMsg='',goTop=0,hop=false,goSec='',goSm=0,lastTab='';
function wkey(w,l){for(const c of WI[w[3]+'|'+w[2]]||[])for(const L of l?[l]:Object.keys(c[3]))if((c[3][L]||[]).some(e=>e[0]==w[0]))return c[0];return''}
function sMig(){let ch=0;for(const h of S.lt.h)if(!h.k){h.l=h.l||(GK[h.g]?GK[h.g][1]:'');h.k=h.w.map(w=>wkey(w,h.l)||wkey(w));ch=1}if(ch)save()}
function sBuild(){const w={},g={};for(const h of S.lt.h){(h.k||[]).forEach(k=>{if(k&&!(w[k]&&w[k].includes(h)))(w[k]||(w[k]=[])).push(h)});(g[h.g]||(g[h.g]=[])).push(h)}SI={w,g}}
const weakW=(k,L)=>{const a=SI.w[k]||[],c=S.srs[L?ik(k,L):k];return(a.length&&a[a.length-1].r<2)||!!(c&&c.l>0)};
function sItem(h,o){o=o||{};
 return`<div class="sn sn${h.r}"><span class=gl>${RT[h.r]} · ${new Date(h.t).toLocaleDateString('id-ID')}${o.g?` · <button class=lnk data-a=gopen data-k="${esc(h.g)}">${esc(h.gt)} (${esc(h.lv)})</button>`:''}</span><span class="tx${o.rv?' rvl'+(shown.has(o.rv)?' rv':''):''}"${o.rv?` data-rv="${esc(o.rv)}"`:''}>${esc(h.s)}</span>`+
 (o.w?`<div class=snw>${h.w.map((w,i)=>h.k&&h.k[i]?`<button class=lnk data-a=wopen data-k="${esc(h.k[i])}">${esc(w[0])}</button>`:esc(w[0])).join(' · ')}</div>`:'')+
 (o.del?`<button class=lnk data-a=sdel data-t=${h.t} style="font-size:.78rem;color:var(--m)">hapus</button>`:'')+'</div>'}
function wSent(k,full){const a=SI.w[k]||[],act=`<div class=btns><button data-a=ltfw data-k="${esc(k)}">${a.length?'Buat kalimat lagi':'Buat kalimat dengan kata ini'}</button></div>`;
 if(!a.length)return full?`<div class=mys><div class=gsec style="margin-top:0">Kalimat saya</div><small>Belum ada kalimat latihan dengan kata ini.</small>${act}</div>`:'';
 const ok=a.filter(h=>h.r==2).length,rec=a.slice().reverse(),sh=rec.slice(0,full?30:2);
 return`<div class=mys><div class=gsec style="margin-top:0">Kalimat saya · ${a.length} · ${ok} tepat</div>`+sh.map(h=>sItem(h,{g:full,del:full,rv:S.o.cv=='fo'?k+'|s'+h.t:''})).join('')+(!full&&a.length>2?`<button class=lnk data-a=wopen data-k="${esc(k)}">Lihat semua ${a.length} kalimat</button>`:'')+(full?act:'')+'</div>'}
function gSent(k,full){const a=SI.g[k]||[],s=S.lt.g[k],n=s?s.n:0,act=LTLV[(GK[k]||[])[1]]?`<div class=btns><button data-a=ltgo data-k="${esc(k)}">Latih grammar ini</button></div>`:'';
 if(!n&&!a.length)return full?`<div class=mys><div class=gsec style="margin-top:0">Kalimat saya</div><small>Belum pernah dilatih membuat kalimat dengan grammar ini.</small>${act}</div>`:'';
 const sh=a.slice().reverse().slice(0,full?30:2);
 return`<div class=mys><div class=gsec style="margin-top:0">Kalimat saya · ${n}× latihan${n?` · ${Math.round(s.ok/n*100)}% tepat`:''}</div>`+sh.map(h=>sItem(h,{w:1,del:full})).join('')+(!full&&a.length>2?`<button class=lnk data-a=gopen data-k="${esc(k)}">Lihat semua ${a.length} kalimat</button>`:'')+(full?act:'')+'</div>'}
function wBdg(k){const a=SI.w[k];return a?`<span class=bdg title="${a.filter(h=>h.r==2).length} tepat">✎ ${a.length}</span>`:''}
function gBdg(k){const s=S.lt.g[k];return s&&s.n?`<br><small>✎ ${s.n}× latihan · ${Math.round(s.ok/s.n*100)}% tepat</small>`:''}
function wUsed(P){const u=P.filter(c=>SI.w[c[0]]).length;return u?`<br><small>✎ ${u} dari ${P.length} kata pernah dipakai di kalimat latihan</small>`:''}
function gUsed(P){const u=P.filter(g=>(S.lt.g[g[0]]||{}).n>0).length;return u?`<br><small>✎ ${u} dari ${P.length} topik pernah dilatih membuat kalimat</small>`:''}
function sDel(t){const i=S.lt.h.findIndex(x=>x.t==t);if(i<0||!confirm('Hapus kalimat ini? Nilainya juga dikeluarkan dari statistik latihan.'))return;const h=S.lt.h[i];S.lt.h.splice(i,1);
 const s=S.lt.g[h.g];if(s){s.n=Math.max(0,s.n-1);if(h.r==2)s.ok=Math.max(0,s.ok-1)}
 const d=S.lt.d[fcDay(h.t)];if(d){d[0]=Math.max(0,d[0]-1);if(h.r==2)d[1]=Math.max(0,d[1]-1);if(h.r==1)d[2]=Math.max(0,(d[2]|0)-1)}}
function actCard(){fcRoll();const td=fcDay(Date.now()),off=new Date().getTimezoneOffset(),cols=[];let sf=0,sl=0;
 for(let i=13;i>=0;i--){const d=td-i,f=(S.lg[d]||[0])[0]|0,l=(S.lt.d[d]||[0])[0]|0;sf+=f;sl+=l;cols.push([d,f,l])}
 let run=0;for(let d=td;;d--){const a=((S.lg[d]||[0])[0]|0)+((S.lt.d[d]||[0])[0]|0);if(a>0)run++;else if(d<td)break}
 const mv=Math.max(1,...cols.map(x=>x[1]+x[2])),px=x=>Math.round(x/mv*54);
 return`<div class=card><b>Aktivitas belajar</b> — ${run} hari beruntun<p><small>14 hari terakhir: ${sf} ulasan kartu · ${sl} soal latihan kalimat</small></p><div class=fcg>${cols.map(([d,f,l])=>`<div><small>${f+l||''}</small>${l?`<i style="height:${px(l)}px;background:#1a8a4a"></i>`:''}${f?`<i style="height:${px(f)}px;background:var(--a);border-radius:${l?'0':'3px 3px 0 0'}"></i>`:''}<small>${new Date(d*864e5+144e5+off*6e4+216e5).getDate()}</small></div>`).join('')}</div><small><span style="color:var(--a)">■</span> Flashcard &nbsp; <span style="color:#1a8a4a">■</span> Latihan kalimat</small></div>`}
document.addEventListener('toggle',e=>{const d=e.target.dataset&&e.target.dataset.d;if(d){e.target.open?DO.add(d):DO.delete(d)}},true);
sMig();
document.addEventListener('click',e=>{let m=e.target.closest&&e.target.closest('.rvl:not(.rv),.mnh:not(.rv),.cz:not(.rv)');if(m){m.classList.add('rv');if(m.dataset.rv)shown.add(m.dataset.rv);e.stopPropagation();e.preventDefault();return}const r=e.target.closest&&e.target.closest('.rom');if(r&&document.body.classList.contains('romh')&&!r.classList.contains('rv')){r.classList.add('rv');e.stopPropagation();e.preventDefault()}},true);
const IC={ses:'<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H11v15H4.5A1.5 1.5 0 0 0 3 20.5zM21 5.5A1.5 1.5 0 0 0 19.5 4H13v15h6.5a1.5 1.5 0 0 1 1.5 1.5z"/>',fc:'<rect x="3" y="7" width="15" height="12" rx="2"/><path d="M6 4h15v12"/>',gr:'<path d="M4 6h16M4 12h10M4 18h14"/>',list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',stats:'<path d="M5 20V11M12 20V4M19 20v-6"/>',lib:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',set:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'};
function spy(){const l=document.getElementById('sec-l');if(!l||tab!='ses')return;let on='k';for(const x of['l']){const e=document.getElementById('sec-'+x);if(e&&e.getBoundingClientRect().top<innerHeight*.45)on=x}document.querySelectorAll('.pills button').forEach(b=>b.classList.toggle('on',b.dataset.v==on))}
function render(){if(tab=='lt'||tab=='ses')tab=SHOW_BELAJAR?'ses':'fc';document.body.classList.toggle('nobel',!SHOW_BELAJAR);document.querySelectorAll('details[data-d]').forEach(d=>d.open?DO.add(d.dataset.d):DO.delete(d.dataset.d));sBuild();document.body.classList.toggle('romh',!!S.o.rom);const T={ses:['Belajar',ses,'Belajar'],fc:['Kartu',()=>vrPromo()+fcView(),'Kartu'+vrBadge()],gr:['Grammar',gram,'Grammar'],list:['Daftar',list,'Daftar'],lib:['Pustaka',libView,'Pustaka'],stats:['Statistik',stats,'Statistik'],set:['Pengaturan',set,'Atur']};
const ch=tab!==lastTab,sy=window.scrollY;lastTab=tab;v.className=(tab=='ses'?'wide':'')+(ch?' fade':'');
v.innerHTML=vrBanner()+(ok?'':'<div class=warn>Penyimpanan lokal diblokir, progres tidak akan tersimpan. Matikan mode privat atau izinkan penyimpanan situs.</div>')+`<h1>${T[tab][0]}${['stats','set','lib'].includes(tab)?'':`<button class=mini data-a=gosen>⚙ Sensor</button>`}</h1>`+T[tab][1]();
n.innerHTML='<div class=navi>'+Object.entries(T).filter(([k])=>k!='ses'||SHOW_BELAJAR).map(([k,x])=>`<button class="${k==tab?'on':''}" data-a=tab data-v=${k}${k==tab?' aria-current=page':''}><svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg><span>${x[2]||x[0]}</span></button>`).join('')+'</div>';
if(!ch&&sy>0){const de=document.documentElement,pm=de.style.scrollBehavior;de.style.scrollBehavior='auto';window.scrollTo(0,sy);de.style.scrollBehavior=pm}
const ta=document.getElementById('ltTxt');if(ta){ta.style.height='auto';ta.style.height=Math.max(ta.scrollHeight+2,96)+'px'}
spy()}
addEventListener('scroll',()=>{if(!spy.p){spy.p=1;requestAnimationFrame(()=>{spy.p=0;spy()})}},{passive:true});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,k=b.dataset.k,x=b.dataset.v,y=scrollY;
if(a.slice(0,2)=='fc'){fcAct(a,x,k)}else if(a.slice(0,3)=='kpi'){kpiAct(a,x)}else if(a.slice(0,3)=='lib'||a=='slh'||a=='sldel'||a=='slmore'||a=='slplay'){if(libAct(a,x,k,b))return}else if(a.slice(0,3)=='lch'){lchAct(a,x)}else if(a.slice(0,3)=='eta'){etaAct(a,x)}else if(a.slice(0,2)=='lt'){ltAct(a,x,k)}else if(a.slice(0,2)=='rd'){if(rdAct(a,x,k))return}else if(a=='tab'){tab=x;lim=50;goTop=1}else if(a=='jump'){goSec='sec-'+x;goSm=1}else if(a=='set'){e.stopPropagation();S.p[k]=+x;if(!+x)delete S.p[k];fcFS(k)}else if(a=='flip'){shown.has(k)?shown.delete(k):shown.add(k)}
else if(a=='cyc'){const s=(st(k)+1)%3;s?S.p[k]=s:delete S.p[k];fcFS(k)}else if(a=='roll'){shown.clear();S.ses={};['N','A','V','O'].forEach(p=>S.ses[p]=pick(p))}
else if(a=='re'){S.ses[x]=pick(x,S.ses[x])}else if(a=='fl'){const i=S.f.indexOf(x);i<0?S.f.push(x):S.f.splice(i,1)}else if(a=='fall')S.f=[];else if(a=='gfl'){const i=S.gf.indexOf(x);i<0?S.gf.push(x):S.gf.splice(i,1)}else if(a=='gall'){S.gf=[];S.o.gpri='';S.o.gfn=''}else if(a=='glg'){gLg=x;gLv=0;S.gf=D.GL.find(l=>l[0]==x)[3].map(v=>x+':'+v);S.o.gpri='';S.o.gfn='';S.gs=0;lim=50;goTop=1}else if(a=='gback'){gLg='';gLv=0;S.gf=[];S.o.gpri='';S.o.gfn='';S.gs=0;goTop=1}else if(a=='glv'){const all=gAll0(gLg);if(x=='all')S.gf=all;else if(S.gf.length>=all.length||!gLv)S.gf=[gLg+':'+x];else{const i=S.gf.indexOf(gLg+':'+x);i<0?S.gf.push(gLg+':'+x):S.gf.splice(i,1);if(!S.gf.length)S.gf=all}if(!gLv){goTop=1}gLv=1;lim=50;S.gs=0}else if(a=='gmap'){const[lp,d]=k.split('|'),[lg,l]=lp.split(':');S.gf=l?[lg+':'+l]:(TXLV[lg]||[]).map(v=>lg+':'+v);S.o.gfn=d;S.o.gpri='';S.gs=0;tab='gr';goTop=1}else if(a=='groll'){S.gs=choose(gp().filter(g=>g[0]!=S.gs));gFoc=1;goTop=1}else if(a=='glist'){gFoc=0;goTop=1}else if(a=='gtolv'){gFoc=0;gLv=0;goTop=1}
else if(a=='gnext'||a=='gprev'){const P=gp(),n=P.length;if(n){const i=P.findIndex(g=>g[0]==S.gs),d=a=='gnext'?1:-1,j=i<0?(d>0?0:n-1):((i+d)%n+n)%n;S.gs=P[j][0];S.s[S.gs]=1;gFoc=1;goTop=1}}
else if(a=='gopen'){S.gs=k;tab='gr';gFoc=1;const g0=GK[k];if(g0){const f=g0[1]+':'+g0[2];if(!S.gf.includes(f)){S.gf=[f];S.o.gpri='';S.o.gfn=''}gLg=g0[1];gLv=1}save();render();scrollTo(0,0);return}
else if(a=='stf'){stFeat=stFeat==x?'':x}else if(a=='lreset'){q='';fs='';fk='';lim=50}else if(a=='wopen'){tab='list';q='';fs='';fk='';foc=k;lim=50;goTop=1}else if(a=='wtog'){xo.has(k)?xo.delete(k):xo.add(k)}else if(a=='wclose'){foc=''}else if(a=='sdel'){sDel(+b.dataset.t)}
else if(a=='gosen'){tab='set';goTop=1}else if(a=='say'){say(k,x);return}else if(a=='edit'){edOpen(x,k);return}else if(a=='edall'){if(!confirm('Kembalikan semua grammar & kosakata yang diedit ke versi asli?'))return;for(const t of['g','v'])for(const id in S.ed[t])edRestore(t,id);S.ed={g:{},v:{}};toast('Semua edit dikembalikan.')}else if(a=='ui'){S.o[k]=x;applyTheme()}else if(a=='sday'){fcSel=+x}else if(a=='srng'){fcRg=+x;fcSel=0}else if(a=='slg'){fcLgF=x;fcSel=0}else if(a=='hday'){heatSel=+x}
else if(a=='more')lim+=50;else if(a=='miglg'){const L=[...new Set(S.f.map(x=>String(x).split(':')[0]))],n=migLegacy(L);toast(n+' item bahasa diperbarui dari progres lama.')}
else if(a=='exp'){const u=URL.createObjectURL(new Blob([JSON.stringify({v:2,p:S.p,s:S.s,srs:S.srs,lg:S.lg,nw:S.nw,lib:S.lib,sl:S.sl,lt:S.lt,ed:S.ed,rd:S.rd})],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download='progres-kosakata.json';l.click();return}
else if(a=='rst'){if(!confirm('Hapus semua progres?'))return;S.p={};S.s={};S.srs={};S.lg={};S.nw={};S.rd={};S.lib.forEach(t=>{t.h=0;t.r=0});S.sl.forEach(t=>{t.d=0});S.lt={h:[],g:{},d:{},a:{},x:{},q:{},pt:{}};ltCur=null;xo=new Set;foc='';S.sd={d:-1,n:0,r:0,x:0,y:0};fcUn=[];fcCur=null}
save();render();
if(goSec){const el=document.getElementById(goSec),sm=goSm,id=goSec;goSec='';goSm=0;if(el){el.scrollIntoView({block:'start',behavior:sm?'smooth':'auto'});if(id=='ltTxt')el.focus({preventScroll:true})}else scrollTo(0,goTop?0:y)}else scrollTo(0,goTop?0:y);goTop=0});
document.addEventListener('change',e=>{const i=e.target.dataset.i;if(!i)return;
if(i.slice(0,3)=='fc_')fcSet(i,e.target);else if(i.slice(0,3)=='lt_')ltSet(i,e.target);else if(i.slice(0,3)=='ui_'){S.o[i.slice(3)]=e.target.type=='checkbox'?+e.target.checked:e.target.value;applyTheme()}else if(i=='mode')S.o.mode=e.target.value;else if(i=='minL')S.o.minL=+e.target.value;else if(i=='fs')fs=e.target.value;else if(i=='fk')fk=e.target.value;else if(i=='gseq')S.o.gseq=+e.target.checked;else if(['cv','cgL','cgK','cgF','cpl','cvb','ckp','rdt'].includes(i))S.o[i]=e.target.value;else if(i=='rom')S.o.rom=+e.target.checked;
else if(i=='imp'){const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const d=JSON.parse(t);Object.assign(S.p,d.p);Object.assign(S.s,d.s||{});Object.assign(S.srs,d.srs||{});Object.assign(S.lg,d.lg||{});for(const x in (d.nw||{}))S.nw[x]=Object.assign(S.nw[x]||{},d.nw[x]);Object.assign(S.rd,d.rd||{});if(Array.isArray(d.lib)){const m=new Map(S.lib.map(t=>[t.id,t]));d.lib.forEach(t=>{const o=m.get(t.id);if(o){o.h=Math.max(o.h|0,t.h|0);o.r=Math.max(o.r|0,t.r|0)}else{S.lib.push(t);m.set(t.id,t)}});S.lib.sort((a,b)=>b.c-a.c)}if(Array.isArray(d.sl)){const m=new Map(S.sl.map(t=>[t.id,t])),seen=new Set(S.sl.map(t=>t.L+'|'+t.f));d.sl.forEach(t=>{const o=m.get(t.id);if(o)o.d=Math.max(o.d|0,t.d|0);else if(!seen.has(t.L+'|'+t.f)){S.sl.push(t);m.set(t.id,t);seen.add(t.L+'|'+t.f)}});S.sl.sort((a,b)=>b.c-a.c)}if(d.ed){for(const t of['g','v'])Object.assign(S.ed[t],d.ed[t]||{});edApplyAll()}migKeys([...new Set(S.f.map(x=>String(x).split(':')[0]))]);if(d.lt){const m=new Map();(S.lt.h||[]).concat(d.lt.h||[]).forEach(x=>m.set(x.t+'|'+x.s,x));S.lt.h=[...m.values()].sort((a,b)=>a.t-b.t).slice(-1000);sMig();Object.assign(S.lt.g,d.lt.g||{});Object.assign(S.lt.d,d.lt.d||{})}save();render();toast('Progres dipulihkan.')}catch(_){toast('File tidak valid.')}});return}
save();render()});
document.addEventListener('input',e=>{if(e.target.dataset.i=='q'){q=e.target.value;const p=e.target.selectionStart;render();const el=document.querySelector('[data-i=q]');el.focus();el.setSelectionRange(p,p)}});

/* ===== v4.7: Bacaan Esperanto ===== */
let rdLv='',rdOpen='';
const RDL=['A1','A2','B1','B2','C1','C2'],rdId=r=>'r|eo|'+r[0]+'|'+r[1],RDI={};RD.forEach(r=>RDI[rdId(r)]=r);
let rdShow=false;
function rdView(){const P=RD.filter(r=>!rdLv||r[0]==rdLv),dn=P.filter(r=>S.rd[rdId(r)]).length,all=RD.filter(r=>S.rd[rdId(r)]).length;
 const tg=`<button class="rdtog${rdShow?' on':''}" data-a=rdtog aria-expanded=${rdShow}><span>📖 Kumpulan bacaan Esperanto</span><small>${all}/${RD.length} dibaca</small><i>${rdShow?'▲':'▼'}</i></button>`;
 if(!rdShow)return tg;
 let h=tg+`<p class=gsub style="margin:8px 0 6px">Teks Esperanto per pelajaran, dengan terjemahan Indonesia</p>`+
  `<div class=chips><button class="chip${rdLv?'':' on'}" data-a=rdlv data-v="">Semua level</button>${RDL.map(l=>`<button class="chip${rdLv==l?' on':''}" data-a=rdlv data-v=${l}>${l}</button>`).join('')}</div>`+
  csel('rdt','Terjemahan Indonesia',SH)+`<small>${dn}/${P.length} teks sudah dibaca</small><div style="margin-top:8px"></div>`;
 return h+P.map(r=>{const id=rdId(r),o=rdOpen==id;return`<div class=rdt data-a=rdopen data-k="${esc(id)}"><div><b>${esc(r[2])}</b><small>Esperanto ${r[0]} · ${esc(r[3])} · ${r[4].length} kalimat</small></div>${S.rd[id]?'<span class=ok>✓ dibaca</span>':'<span>'+(o?'▲':'▼')+'</span>'}</div>`+(o?rdBody(r,id):'')}).join('')}
function rdBody(r,id){const m=S.o.rdt=='off'?0:S.o.rdt=='blur'?1:2;
 return`<div class=card><div class=rdh><button data-a=rdsay data-k="${esc(id)}">🔊 Dengarkan semua</button><button data-a=rdplay data-k="${esc(id)}">🎧 Pemutar</button><button class="${S.rd[id]?'':'pri'}" data-a=rddone data-k="${esc(id)}">${S.rd[id]?'Tandai belum dibaca':'Tandai sudah dibaca ✓'}</button></div>`+
 r[4].map(([e,i])=>`<div class=rds><div class=eo>${esc(e)}${spk(e,'eo')}</div>${i&&m?`<div class="idn${m==1?' ltm mnh':''}">${esc(i)}</div>`:''}</div>`).join('')+'</div>'}
function rdAct(a,x,k){
 if(a=='rdtog'){rdShow=!rdShow}else if(a=='rdlv'){rdLv=x;rdOpen=''}else if(a=='rdopen'){rdOpen=rdOpen==k?'':k}else if(a=='rddone'){if(S.rd[k])delete S.rd[k];else S.rd[k]=1}
 else if(a=='rdplay'){const r=RDI[k];if(r)lpOpenTemp({id:'rd:'+k,L:'eo',t:r[2],ps:[{f:r[4].map(p=>p[0]),i:r[4].map(p=>p[1]||''),r:null,a:1}]});return 1}
 else if(a=='rdsay'){const r=RDI[k];if(r)say(r[4].map(p=>p[0]).join(' '),'eo');return 1}
 return 0}
function rdStatsCard(){const t=RD.length,d=RD.filter(r=>S.rd[rdId(r)]).length;
 return`<div class=card><b>Bacaan Esperanto</b> — ${d}/${t} teks dibaca<div class=bar><i style="width:${d/(t||1)*100}%;background:var(--s2)"></i></div>`+RDL.map(l=>{const p=RD.filter(r=>r[0]==l),n=p.filter(r=>S.rd[rdId(r)]).length;return`<small>${l}: ${n}/${p.length}</small>`}).join(' · ')+'</div>'}
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
const TL={zh:'zh-CN',ja:'ja-JP',de:'de-DE',nl:'nl-NL',eo:'eo'};let VZ=[];
try{const lv=()=>{VZ=speechSynthesis.getVoices()};lv();speechSynthesis.addEventListener('voiceschanged',lv)}catch(e){}
const canSay=()=>'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
function say(t,l){if(!canSay())return toast('Perangkat ini belum mendukung suara.');
 const code=TL[l];if(!code)return;const r=ttsVoice(l);
 if(!r.v&&VZ.length){return toast('Suara '+(LN[l]||l)+' belum terpasang di perangkat ini.')}
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance((typeof ttsClean=='function'?ttsClean(t,l):String(t)).replace(/[~〜]/g,'').trim());u.lang=r.v?r.v.lang:r.lc;if(r.v)u.voice=r.v;u.rate=ttsRate();speechSynthesis.speak(u)}catch(e){}}
const spk=(t,l)=>S.o.tts&&canSay()&&TL[l]?`<button class=spk data-a=say data-k="${esc(t)}" data-v=${l} title="Dengarkan" aria-label="Dengarkan">🔊</button>`:'';
function fcAuto(){if(!S.o.ttsa||!fcCur||GK[fcCur])return;const L=lang(fcCur),c=K[base(fcCur)],v=c&&fcVis(c);if(v&&v[L]&&v[L][0])say(v[L][0][0],L)}

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
 return`<div class=card><b>Ulasan terjadwal</b> — ${rg} hari ke depan<p class=gsub style="margin:2px 0 10px">Mengikuti filter flashcard · belum termasuk kartu baru. Ketuk batang untuk melihat rincian.</p>`+
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
 return`<div class=card><b>Konsistensi belajar</b> — ${W} minggu<p class=gsub style="margin:2px 0 10px">Makin pekat warna, makin banyak aktivitas hari itu.</p><div class=heat>${cells}</div><div class=hcap><b>${dLbl(sd)}</b> · ${f} ulasan kartu · ${l} soal latihan</div><div class=kpis style="margin:10px 0 0"><div><b>${sk.run}</b><small>Rentetan kini</small></div><div><b>${sk.best}</b><small>Terbaik</small></div><div><b>${act}/${span}</b><small>Hari aktif</small></div><div><b>${tot}</b><small>Total aktivitas</small></div></div><div class=leg style="margin-top:10px"><span>Sedikit</span>${[0,1,2,3,4].map(n=>`<i class="hz${n}" style="width:12px;height:12px;display:inline-block;border-radius:3px;border:1px solid var(--b)"></i>`).join('')}<span>Banyak</span></div></div>`}

/* ---------- kartu pengaturan tampilan ---------- */
function uiCard(){const o=S.o,seg=(k,op)=>`<div class=seg2>${op.map(([v,t])=>`<button class="${o[k]==v?'on':''}" data-a=ui data-k=${k} data-v=${v}>${t}</button>`).join('')}</div>`,ck=(k,t)=>`<label class=fcl><span><input type=checkbox data-i="ui_${k}"${o[k]?' checked':''}> ${t}</span></label>`;
 return`<div class=card><b>Tampilan &amp; kenyamanan</b><small class=lbl>Tema</small>`+seg('th',[['auto','Otomatis'],['light','Terang'],['dark','Gelap']])+
 `<small class=lbl>Warna aksen</small><div class=swatches>${Object.entries(ACC).map(([n,a])=>`<button class="sw${(o.ac||'indigo')==n?' on':''}" data-a=ui data-k=ac data-v=${n} style="--sw:${a?a[0]:'#4f46e5'}" aria-label="Aksen ${n}" title="${n}"></button>`).join('')}</div>`+
 `<small class=lbl>Ukuran huruf kata</small>`+seg('fz',[['m','Normal'],['l','Besar'],['xl','Sangat besar']])+
 `<small class=lbl>Kecepatan suara 🔊 &amp; pemutar</small>`+seg('ttsr',[['.5','0.5×'],['.7','0.7×'],['.9','0.9×'],['1','1×'],['1.2','1.2×']])+ck('tts','Tampilkan tombol suara 🔊 di samping kata')+ck('ttsa','Ucapkan otomatis saat jawaban dibuka')+ck('hap','Getar halus saat menilai kartu (HP)')+
 `<small>Suara memakai mesin teks-ke-ucapan di perangkatmu. Untuk Esperanto dipakai suara Italia bila suara Esperanto tidak tersedia.</small></div>`}

/* ===== Filter deck flashcard (kosakata / grammar / keduanya) ===== */
const DK=[['v','Kosakata'],['g','Grammar'],['all','Keduanya']];
function fcPoolV(al){al=al||fcAL();const o=S.o,a=[];for(const c of D.C){if(o.sp.length&&!o.sp.includes(c[1]))continue;const v=fcVis(c,al);if(v)for(const l in v)a.push(ik(c[0],l))}return a}
function fcGOk(g){const f=S.o.gff;return!f.length||f.includes(g[1]+':'+g[2])}
function fcGP(){return D.G.filter(fcGOk)}
function fcMixNew(N){const o=S.o;if(o.deck!='all')return N;
 const g=[],v=[];for(const k of N)(GK[k]?g:v).push(k);if(!g.length||!v.length)return N;
 const p=Math.min(1,Math.max(0,(o.gr==null?25:o.gr)/100)),out=[];let gi=0,vi=0,acc=0;
 while(gi<g.length||vi<v.length){acc+=p;if(vi>=v.length||(acc>=1&&gi<g.length)){acc=Math.max(0,acc-1);out.push(g[gi++])}else out.push(v[vi++])}
 return out}
function fcDeckBar(){const o=S.o,nv=fcPoolV().length,ng=fcGP().length,n={v:nv,g:ng,all:nv+ng},f=x=>x.toLocaleString('id-ID');
 return`<div class=deckbar role=tablist aria-label="Deck flashcard">${DK.map(([v,t])=>`<button role=tab aria-selected="${o.deck==v}" class="${o.deck==v?'on':''}" data-a=fcdeck data-v=${v}><span>${t}</span><small>${f(n[v])} kartu</small></button>`).join('')}</div>`}
function fcFilt(){const o=S.o,ff=o.ff,gf=o.gff,dk=o.deck,sv=dk!='g',sg=dk!='v',act=(sv?ff.length:0)+(sg?gf.length:0);
 const chips=(L,lvIdx,cur,aAll,aLg,aOne)=>`<div class=chips><button class="chip${cur.length?'':' on'}" data-a=${aAll}>Semua bahasa</button></div>`+L.map(l=>{const lv=l[lvIdx],all=cur.length&&lv.every(v=>cur.includes(l[0]+':'+v));return`<div><small>${l[1]}</small><div class=chips><button class="chip${all?' on':''}" data-a=${aLg} data-v=${l[0]}>Semua level</button>`+lv.map(v=>{const x=l[0]+':'+v;return`<button class="chip${cur.includes(x)?' on':''}" data-a=${aOne} data-v="${x}">${v}</button>`}).join('')+'</div></div>'}).join('');
 let h=dtag('ff')+`<summary><span>Filter flashcard</span>${act?`<em class=cnt>${act} aktif</em>`:''}</summary><div class=card>`;
 if(sv)h+=`<div class=fsec><b>Kosakata</b><small>Bahasa &amp; level yang aktif diizinkan masuk hafalan. Kosong = semua.</small>`+chips(D.L,4,ff,'fcfall','fclg','fcfl')+
  fcS('fm','Cara menyaring',[['or','Salah satu (OR)'],['and','Semua bahasa aktif (AND)']])+fcN('fmin','Minimal bahasa per kartu (mode OR)',1,4)+
  '<small>OR: kartu masuk jika punya padanan di salah satu bahasa aktif, dan hanya bahasa aktif yang perlu diingat. AND: kartu hanya masuk jika punya padanan di semua bahasa aktif.</small>'+
  `<small>Jenis kata</small><div class=chips><button class="chip${o.sp.length?'':' on'}" data-a=fcpos data-v=all>Semua</button>`+['N','A','V','O'].map(p=>`<button class="chip${o.sp.includes(p)?' on':''}" data-a=fcpos data-v=${p}>${PN[p]}</button>`).join('')+'</div></div>';
 if(sg)h+=`<div class=fsec><b>Grammar</b><small>Bahasa &amp; level grammar yang masuk hafalan. Kosong = semua. Filter ini terpisah dari filter di tab Grammar.</small>`+chips(D.GL,3,gf,'fcgall','fcglg','fcgl')+
  (dk=='all'?fcN('gr','Porsi grammar di kartu baru (%)',0,100)+'<small>Khusus deck Keduanya: 25 berarti tiap 4 kartu baru ada 1 grammar, sisanya kosakata.</small>':'')+'</div>';
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
 m.innerHTML=`<div class=eds role=dialog aria-modal=true aria-label="${ttl}"><div class=edh><div><b>${ttl}</b><small>${esc(sub)} · ${esc(t=='g'?s[4]:s[2])}</small></div><button class=mini data-e=close aria-label=Tutup>✕</button></div><div class=edb>${b}<p class=gsub style="margin:12px 0 0">Perubahan tersimpan di perangkat ini dan ikut dalam cadangan progres.</p></div><div class=edf><button data-e=reset${S.ed[t][id]?'':' disabled'}>Kembalikan asli</button><button class=pri data-e=save>Simpan</button></div></div>`;
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
 return`<div class=card><b>Edit keterangan</b><p class=gsub style="margin:2px 0 8px">Ketuk ✎ pada kartu kosakata, grammar, atau flashcard untuk mengubah arti, keterangan, contoh, dan catatan. Hasil edit tersimpan di perangkat ini dan ikut dalam cadangan progres.</p><small>${ng} grammar · ${nv} kosakata sudah diedit.</small>${ng+nv?'<button data-a=edall style="width:100%;margin-top:8px">Kembalikan semua ke asli</button>':''}</div>`}

applyTheme();
try{const _t=new URLSearchParams(location.search).get('tab');if(_t&&['ses','fc','lt','gr','list','lib','stats','set'].includes(_t))tab=_t}catch(e){}
render();vrInit();
