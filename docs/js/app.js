let S={p:{},s:{},ses:{},gs:0,f:[],gf:[],srs:{},sd:{d:-1,n:0,r:0,x:0,y:0},lg:{},lt:{h:[],g:{},d:{}},o:{}},ok=true,tab='ses',q='',fs='',lim=50,shown=new Set;
try{if(!localStorage.getItem(SK)&&localStorage.getItem('kosakata_v1'))localStorage.setItem(SK,localStorage.getItem('kosakata_v1'));Object.assign(S,JSON.parse(localStorage.getItem(SK)||'{}'));localStorage.setItem(SK+'_t',1);navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){ok=false}
const FCD={nl:20,rl:200,fd:'id',ff:[],fm:'or',fmin:1,deck:'v',ord:'seq',no:'after',ls:'1 10',rs:'10',gi:1,ei:4,se:250,eb:130,hi:120,ni:0,im:100,mx:36500,lk:1,mig:0,sp:[]};const LTD={lm:1,pl:'zh',plv:[],pn:1,pa:1,pv:1,po:1,ps:'full',pw:'all',pg:'all',pe:1,lx:1};S.o={hide:0,rom:0,minL:1,mode:'mix',...FCD,...LTD,...S.o};if(!S.o.cv)S.o.cv=S.o.hide?'fo':'none';S.o={cgL:'blur',cgK:'show',cgF:'show',cpl:'blur',cvb:'blur',...S.o};
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){ok=false}window.vrSnapSoon&&vrSnapSoon()};
const K={};D.C.forEach(c=>K[c[0]]=c);
const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);{const ok=x=>LN[String(x).split(':')[0]];S.f=S.f.filter(ok);S.o.ff=S.o.ff.filter(ok)}const GK={};D.G.forEach(g=>GK[g[0]]=g);
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const st=k=>S.p[k]|0;
const DO=new Set(),dtag=id=>`<details data-d="${id}"${DO.has(id)?' open':''}>`;
const ART=/^((?:der|die|das)(?:\/(?:der|die|das))*)(\s+)(.+)$/i;
function wd(t,pos,ctx,lang,force){const m=pos=='N'&&lang=='de'&&String(t).match(ART);if(!m||force||S.o['cg'+ctx]!='blur')return esc(t);return`<span class=cz>${esc(m[1])}</span>${esc(m[2]+m[3])}`}
function fmx(e,pos,lang,force){if(lang!='de'||!DX)return'';let t,l,md;
 if(pos=='N'){t=DX.n[e[0]];l='Bentuk jamak';md=S.o.cpl}else if(pos=='V'){t=DX.v[e[0]];l='er/sie/es · Präteritum · Perfekt';md=S.o.cvb}else return'';
 if(!t||md=='off')return'';
 return`<div class="r fx"><span class=gl>${l}</span><span class="${md=='blur'&&!force?'cz':''}">${esc(t)}</span></div>`}
const csel=(k,l,op,di)=>`<label class=fcl><span>${l}</span><select data-i="${di||k}" style="width:auto;margin:0">${op.map(([v,t])=>`<option value="${v}"${S.o[k]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
const SH=[['show','Tampil'],['blur','Sensor (blur)']],SH3=[['show','Tampil'],['blur','Sensor (blur)'],['off','Tidak ditampilkan']];
function sensor(){const o=S.o;return`<div class=card><b>Sensor</b><p class=gsub style="margin-top:2px">Semua pengaturan penyensoran ada di sini. Teks yang diblur bisa diketuk untuk melihatnya.</p>`+
 `<div class=gsec>Kosakata (tab Kata &amp; Daftar)</div>`+csel('cv','Sisi yang disensor',[['none','Tidak ada (semua tampil)'],['fo','Bahasa asing (Indonesia jadi soal)'],['id','Bahasa Indonesia (asing jadi soal)']])+
 `<small>Berlaku untuk Acak 4 kata. Ketuk kartu untuk membuka sisi yang disensor.</small>`+
 `<div class=gsec>Romanisasi</div><label class=fcl><span><input type=checkbox data-i=rom${o.rom?' checked':''}> Sembunyikan romanisasi (pinyin/romaji) di semua tab</span></label>`+
 `<div class=gsec>Bahasa Jerman</div>`+csel('cgK','Gender (der/die/das): Kata &amp; Daftar',SH)+csel('cgF','Gender: Kartu',SH)+csel('cgL','Gender: Latihan',SH)+
 csel('cpl','Bentuk jamak kata benda',SH3)+csel('cvb','Bentuk lain kata kerja',SH3)+
 `<small>Bentuk jamak ditampilkan di Kata, Daftar, Kartu (sisi jawaban), dan Latihan. Bentuk kata kerja = er/sie/es, Präteritum, Perfekt. Di Latihan, gender &amp; bentuk lain otomatis terbuka setelah kamu menekan "Periksa".</small>`+
 `<div class=gsec>Latihan kalimat</div><label class=fcl><span><input type=checkbox data-i=lt_lm${o.lm?' checked':''}> Sensor arti Indonesia di bawah kata (ketuk untuk melihat)</span></label>`+
 csel('ps','Tampilan kata',[['full','Kata target + arti'],['id','Hanya arti Indonesia']],'lt_ps')+'</div>'}
function vis(c,all){const v={};let n=0;for(const[id,,,]of D.L){const e=(c[3][id]||[]).filter(x=>all||!S.f.length||S.f.includes(id+':'+x[3]));if(e.length){v[id]=e;n++}}return all?(n?v:null):(n>=S.o.minL&&n?v:null)}
const pool=p=>D.C.filter(c=>c[1]==p&&vis(c));
const ORD={new:[0],rev:[1,2,0],mix:[0,1,2]};
function choose(P){const m=S.o.mode;if(m=='new')P=P.filter(c=>!st(c[0])&&!S.s[c[0]]);else if(m=='rev')P=P.filter(c=>st(c[0])||S.s[c[0]]);
for(const s of ORD[m]){const g=P.filter(c=>st(c[0])==s);if(g.length){const r=g[Math.random()*g.length|0][0];S.s[r]=1;return r}}return null}
const pick=(p,ex)=>choose(pool(p).filter(c=>c[0]!=ex)),gp=()=>D.G.filter(g=>!S.gf.length||S.gf.includes(g[1]+':'+g[2]));
const msel=()=>'<small>Mode belajar</small><select data-i=mode>'+[['mix','Campur (prioritas Belum)'],['new','Hafalan baru'],['rev','Mengingat kembali']].map(([v,x])=>`<option value=${v}${S.o.mode==v?' selected':''}>${x}</option>`).join('')+'</select>';
function card(k,full){const c=K[k],v=c&&vis(c,full);if(!v)return'<div class=card>Tidak ada kata yang cocok dengan filter saat ini.</div>';const s=st(k);
return`<div class="card${shown.has(k)?' show':''}${S.o.cv=='fo'?' hidm':''}${S.o.cv=='id'?' hidd':''}" data-a=flip data-k="${esc(k)}"><div class=hd><span>${PN[c[1]]}</span><span>${STN[s]}${fcTag(k)}</span></div><div class=mean>${esc(c[2])}</div><div class=grid>`+
D.L.filter(l=>v[l[0]]).map(([id,n,col])=>`<div class="lg${S.o.cv=='fo'?' hid':''}" style="--lc:${col}"><small>${n}</small>`+v[id].map(e=>`<div class=w>${wd(e[0],c[1],'K',id)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}${fmx(e,c[1],id)}${e[2]?`<div class=ex>${esc(e[2])}</div>`:''}`).join('')+'</div>').join('')+
`</div>${wSent(k,full)}<div class=btns>${STN.map((n,i)=>`<button class="sb sb${i}${i==s?' on':''}" data-a=set data-k="${esc(k)}" data-v=${i}>${n}</button>`).join('')}</div></div>`}
function filt(){return dtag('f1')+'<summary>Filter level &amp; bahasa'+(S.f.length?` (${S.f.length} aktif)`:'')+'</summary><div class=chips><button class="chip'+(S.f.length?'':' on')+'" data-a=fall>Semua</button></div>'+
D.L.map(l=>`<div><small>${l[1]}</small><div class=chips>`+l[4].map(v=>{const x=l[0]+':'+v;return`<button class="chip${S.f.includes(x)?' on':''}" data-a=fl data-v="${x}">${v}</button>`}).join('')+'</div></div>').join('')+
'</details>'}
function vset(){return dtag('vs')+'<summary>Pengaturan kosakata</summary><div class=card>'+msel()+`<small>Minimal bahasa per kartu</small><select data-i=minL>${[1,2,3,4].map(n=>`<option${S.o.minL==n?' selected':''}>${n}</option>`).join('')}</select><small>Sensor/blur (sisi asing atau Indonesia, gender, jamak, dll.) diatur di tab Atur → Sensor.</small></div></details>`}
function ses(){const s=S.ses;return filt()+vset()+'<button class=pri data-a=roll>Acak 4 kata: Benda, Sifat, Kerja, Lain</button><p></p>'+['N','A','V','O'].map(p=>p in s?card(s[p])+`<button data-a=re data-v=${p} style="width:100%;margin:-4px 0 12px">Ganti ${PN[p]}</button>`:'').join('')||''}
function stats0(){return filt()+vset()+['N','A','V','O'].map(p=>{const P=pool(p),n=[0,0,0];P.forEach(c=>n[st(c[0])]++);const t=P.length||1;
return`<div class=card><b>${PN[p]}</b> — ${P.length} kartu<div class=bar><i style="width:${n[2]/t*100}%;background:var(--s2)"></i><i style="width:${n[1]/t*100}%;background:var(--s1)"></i></div>Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}${wUsed(P)}</div>`}).join('')}
function gbody(g){const L=t=>`<div class=gsec>${t}</div>`,kv=g[10]||[],CJ=['Ich','Du','Er/Sie/Es/Man','Wir','Ihr','sie/Sie'],cj=kv.filter(p=>CJ.includes(p[0])),isC=cj.length>=3,rest=isC?kv.filter(p=>!CJ.includes(p[0])):kv;let h='';
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
return`<div class=card><div class=hd><span>${LN[g[1]]||'Jerman'} ${g[2]}${g[3]?' · '+esc(g[3]):''}</span><span>${STN[s]}${fcTag(k)}</span></div><div class=mean>${esc(g[4])}</div>${gbody(g)}${gSent(k,1)}<div class=btns>${STN.map((x,i)=>`<button class="sb sb${i}${i==s?' on':''}" data-a=set data-k="${esc(k)}" data-v=${i}>${x}</button>`).join('')}</div></div>`}
function gram(){const P=gp();return dtag('gf')+'<summary>Filter grammar'+(S.gf.length?` (${S.gf.length} aktif)`:'')+'</summary><div class=chips><button class="chip'+(S.gf.length?'':' on')+'" data-a=gall>Semua</button></div>'+D.GL.map(l=>`<small>${l[1]}</small><div class=chips>`+l[3].map(v=>{const x=l[0]+':'+v;return`<button class="chip${S.gf.includes(x)?' on':''}" data-a=gfl data-v="${x}">${v}</button>`}).join('')+'</div>').join('')+msel()+'</details><label class=fcl><span><input type=checkbox data-i=gseq'+(S.o.gseq?' checked':'')+'> Belajar grammar tanpa diacak (berurutan sesuai daftar &amp; filter)</span></label>'+(S.o.gseq?(()=>{const i=P.findIndex(g=>g[0]==S.gs);return'<div class=btns><button data-a=gprev>‹ Sebelumnya</button><button class=pri data-a=gnext style="width:auto;flex:2">Grammar berikutnya</button></div>'+(i>=0?'<p class=gsub style="text-align:center">'+(i+1)+' / '+P.length+'</p>':'')})():'<button class=pri data-a=groll>Acak 1 grammar</button>')+'<p></p>'+(S.gs===0?'':gcard(S.gs))+`<h1>Semua topik (${P.length})</h1>`+
P.slice(0,lim).map(g=>`<div class=row><div data-a=gopen data-k="${esc(g[0])}"><b>${esc(g[4])}</b><br><small>${LN[g[1]]||'Jerman'} ${g[2]}${g[3]?' · '+esc(g[3]):''}</small>${gBdg(g[0])}</div><button data-a=cyc data-k="${esc(g[0])}">${STN[st(g[0])]}</button></div>`).join('')+(P.length>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':'')}
function stats(){return stats1()+actCard()+fcStatsCard()+ltStatsCard()}function stats1(){const P=gp(),n=[0,0,0];P.forEach(g=>n[st(g[0])]++);const t=P.length||1;return stats0()+`<div class=card><b>Grammar</b> — ${P.length} topik<div class=bar><i style="width:${n[2]/t*100}%;background:var(--s2)"></i><i style="width:${n[1]/t*100}%;background:var(--s1)"></i></div>Belum ${n[0]} · Sedang ${n[1]} · Selesai ${n[2]}${gUsed(P)}</div>`}
function list(){const t=q.toLowerCase();let r=D.C.filter(c=>{const v=vis(c);if(!v)return 0;const k=c[0],ss=SI.w[k]||[];if(fs!==''&&st(k)!=fs)return 0;
if(fk=='s'&&!ss.length)return 0;if(fk=='n'&&ss.length)return 0;if(fk=='w'&&!ss.some(h=>h.r==0))return 0;
return!t||c[2].toLowerCase().includes(t)||Object.values(v).flat().some(e=>(e[0]+e[1]).toLowerCase().includes(t))||ss.some(h=>h.s.toLowerCase().includes(t))});const n=r.length;
return(foc&&K[foc]?`<div class=gsub style="margin:0 0 6px">Dibuka dari tab lain · <button class="lnk" data-a=wclose>tutup</button></div>`+card(foc,1):'')+
`<input type=search placeholder="Cari arti, kata, bacaan, atau kalimat buatanmu" value="${esc(q)}" data-i=q><select data-i=fs>${['Semua status',...STN].map((x,i)=>`<option value="${i?i-1:''}"${fs==(i?i-1:'')?' selected':''}>${x}</option>`).join('')}</select><select data-i=fk>${[['','Semua kartu'],['s','Punya kalimat latihan'],['n','Belum pernah dibuatkan kalimat'],['w','Pernah salah (belum tepat)']].map(([v,x])=>`<option value="${v}"${fk==v?' selected':''}>${x}</option>`).join('')}</select><small>${n} kartu · ketuk kata untuk melihat detail &amp; kalimatmu</small>`+
r.slice(0,lim).map(c=>{const v=vis(c),k=c[0];return`<div class=row><div data-a=wtog data-k="${esc(k)}"><b>${esc(c[2])}</b> <small>${PN[c[1]]}</small>${wBdg(k)}<br><small>${Object.entries(v).map(([id,e])=>wd(e[0][0],c[1],'K',id)).join(' · ')}</small></div><button data-a=cyc data-k="${esc(k)}">${STN[st(k)]}</button></div>`+(xo.has(k)?card(k,1):'')}).join('')+(n>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':'')}
function set(){return vrCard()+vrAppCard()+sensor()+`<div class=card><button class=pri data-a=exp>Cadangkan progres (unduh JSON)</button><p><input type=file accept=.json data-i=imp></p><button data-a=rst>Hapus semua progres</button></div><p><small>${ok?'Penyimpanan lokal aktif.':'Penyimpanan lokal tidak tersedia.'} ${Object.keys(S.p).length} kartu bertanda, ${S.lt.h.length} kalimat latihan. Buat cadangan sesekali, karena data browser bisa terhapus.</small></p>`}
/* ===== Flashcard + SRS (algoritma ala Anki / SM-2) ===== */
const FCNUM={fmin:[1,4],nl:[0,9999],rl:[0,9999],gi:[1,365],ei:[1,365],se:[130,500],eb:[100,300],hi:[100,200],ni:[0,100],im:[50,200],mx:[1,36500]};
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
function fcFront(k){const o=S.o;if(GK[k]||o.fd=='id')return'id';const v=K[k]&&fcVis(K[k]);if(!v)return'id';const L=Object.keys(v),f=L[Math.random()*L.length|0];return o.fd=='fo'||Math.random()<.5?f:'id'}
function fcOk(k){const c=S.srs[k];if(c&&c.z)return 0;const o=S.o;
 if(GK[k])return o.deck!='v'&&gp().includes(GK[k]);
 const v=K[k];return!!v&&o.deck!='g'&&!!fcVis(v)&&(!o.sp.length||o.sp.includes(v[1]))}
function fcPool(){const o=S.o,al=fcAL();let a=[];
 if(o.deck!='g')a=D.C.filter(c=>(!o.sp.length||o.sp.includes(c[1]))&&fcVis(c,al)).map(c=>c[0]);
 if(o.deck!='v')a=a.concat(gp().map(g=>g[0]));
 return a.filter(k=>!(S.srs[k]&&S.srs[k].z))}
function fcQ(){fcRoll();const now=Date.now(),td=fcDay(now),o=S.o,sd=S.sd,L=[],R=[],Nw=[],ah=[];let next=0,tm=0;
 for(const k of fcPool()){const c=S.srs[k];if(!c||!c.t){Nw.push(k);continue}
  if(c.t==2){if(c.d<=td)R.push(k);else if(c.d==td+1)tm++}
  else if(c.d<=now)L.push(k);else if(c.d<=now+12e5)ah.push(k);else if(!next||c.d<next)next=c.d}
 return{L,R,Nw,ah,next,tm,nL:Math.max(0,o.nl+(sd.x|0)-sd.n),rL:Math.max(0,o.rl+(sd.y|0)-sd.r)}}
const fcMin=a=>a.reduce((x,y)=>S.srs[x].d<=S.srs[y].d?x:y);
function fcPick(q){const o=S.o;if(q.L.length)return fcMin(q.L);
 const nn=Math.min(q.Nw.length,q.nL),rr=Math.min(q.R.length,q.rL);
 const pn=()=>o.ord=='rand'?q.Nw[Math.random()*q.Nw.length|0]:q.Nw[0],pr=()=>q.R[Math.random()*q.R.length|0];
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
 const n=fcCalc(c,r,now,true);S.srs[k]=n;
 if(!had)S.sd.n++;else if(c.t==2)S.sd.r++;
 const L=S.lg[td]||(S.lg[td]=[0,0]);L[0]++;if(r==1)L[1]++;
 for(const d in S.lg)if(+d<td-400)delete S.lg[d];
 fcSync(k,n);fcCur=null;fcRevd=false}
function fcUndo(){const u=fcUn.pop();if(!u)return;if(u.c)S.srs[u.k]=u.c;else delete S.srs[u.k];S.sd=u.sd;
 if(u.p===undefined)delete S.p[u.k];else S.p[u.k]=u.p;if(u.lg)S.lg[u.td]=u.lg;else delete S.lg[u.td];fcCur=u.k;fcRevd=false;fcFrK=null}
function fcAct(a,x,k){
 if(a=='fcshow')fcRevd=true;
 else if(a=='fcans')fcAns(+x);
 else if(a=='fcundo')fcUndo();
 else if(a=='fcsusp'){S.srs[k]=Object.assign(S.srs[k]||{},{z:1});fcCur=null}
 else if(a=='fcforget'){delete S.srs[k];if(S.o.lk)delete S.p[k];fcCur=null}
 else if(a=='fcsyncall'){const r=fcSyncAll();alert(r[0]+' status diterapkan ke jadwal kartu, '+r[1]+' status diperbarui dari jadwal kartu.')}
 else if(a=='fcunsusp'){for(const j in S.srs){delete S.srs[j].z;if(!S.srs[j].t)delete S.srs[j]}fcCur=null}
 else if(a=='fcpos'){const sp=S.o.sp.slice();if(x=='all')S.o.sp=[];else{const i=sp.indexOf(x);i<0?sp.push(x):sp.splice(i,1);S.o.sp=sp}fcCur=null}
 else if(a=='fcfl'){const f=S.o.ff.slice(),i=f.indexOf(x);i<0?f.push(x):f.splice(i,1);S.o.ff=f;fcCur=null}
 else if(a=='fcfall'){S.o.ff=[];fcCur=null}
 else if(a=='fclg'){const xs=D.L.find(l=>l[0]==x)[4].map(v=>x+':'+v);let f=S.o.ff.slice();f=xs.every(y=>f.includes(y))?f.filter(y=>!xs.includes(y)):f.concat(xs.filter(y=>!f.includes(y)));S.o.ff=f;fcCur=null}
 else if(a=='fcmore')S.sd.x=(S.sd.x|0)+10;
 else if(a=='fcmoreR')S.sd.y=(S.sd.y|0)+50;
 else if(a=='fcrst'){if(confirm('Hapus semua jadwal flashcard? (Status Belum/Sedang/Selesai tidak berubah)')){S.srs={};S.lg={};S.sd={d:-1,n:0,r:0,x:0,y:0};fcUn=[];fcCur=null}}}
function fcSet(i,el){const f=i.slice(3),o=S.o;
 if(FCNUM[f]){const x=parseFloat(el.value);if(isFinite(x))o[f]=Math.min(FCNUM[f][1],Math.max(FCNUM[f][0],x))}
 else if(f=='ls')o.ls=fcSt(el.value,[1,10]).join(' ');
 else if(f=='rs')o.rs=fcSt(el.value,[10]).join(' ');
 else if(f=='lk')o.lk=+el.checked;
 else o[f]=el.value;
 fcCur=null;fcRevd=false}
function fcInfo(c){if(!c||!c.t)return'Baru';if(c.t==1)return'Belajar';if(c.t==3)return'Belajar ulang';return`Ulas · ${c.i} hr · ease ${c.e}%`+(c.l?` · ${c.l}× lupa`:'')}
function fcBody(k,rev){const g=GK[k];
 if(g){const t=(g[3]?`<div class=gsub>${esc(g[3])}</div>`:'')+`<div class=mean>${esc(g[4])}</div>`;return rev?t+'<hr><div style="text-align:left">'+gbody(g)+gSent(k,0)+'</div>':t}
 const c=K[k],v=fcVis(c),L=Object.keys(v),f=fcFr,mean=`<div class=mean>${esc(c[2])}</div>`;
 const blk=(ids,full)=>'<div class=grid>'+D.L.filter(l=>ids.includes(l[0])).map(([id,n,col])=>`<div class=lg style="--lc:${col}"><small>${n}</small>`+v[id].map(e=>`<div class=w>${wd(e[0],c[1],'F',id)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}${full?fmx(e,c[1],id):''}${full&&e[2]?`<div class=ex>${esc(e[2])}</div>`:''}`).join('')+'</div>').join('')+'</div>';
 if(rev)return mean+'<hr>'+blk(L,1)+wSent(k,0);
 const lc=id=>D.L.find(l=>l[0]==id),ch=(n,col)=>`<span class=fch style="--lc:${col}">${esc(n)}</span>`;
 let p,t;
 if(f=='id'||!v[f]){p=mean;t=L.map(id=>ch(LN[id],lc(id)[2]))}
 else{p=`<div class=fcp>${ch(LN[f],lc(f)[2])}`+v[f].map(e=>`<div class=w style="font-size:1.8rem">${wd(e[0],c[1],'F',f)}</div>${e[1]?`<div class="r rom">${esc(e[1])}</div>`:''}`).join('')+'</div>';
  t=[ch('Indonesia','var(--a)'),...L.filter(id=>id!=f).map(id=>ch(LN[id],lc(id)[2]))]}
 return p+`<div class=fchint><small>Ingat dalam:</small>${t.join('')}</div>`}
const fcN=(f,l,mn,mx)=>`<label class=fcl><span>${l}</span><input type=number inputmode=numeric data-i="fc_${f}" value="${S.o[f]}" min=${mn} max=${mx}></label>`;
const fcS=(f,l,op)=>`<label class=fcl><span>${l}</span><select data-i="fc_${f}" style="width:auto;margin:0">${op.map(([v,t])=>`<option value="${v}"${S.o[f]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
function fcFilt(){const o=S.o,ff=o.ff;
 return dtag('ff')+`<summary>Filter bahasa &amp; level flashcard${ff.length?` (${ff.length} aktif)`:''}</summary><div class=card><small>Bahasa/level yang aktif = diizinkan masuk hafalan. Kosong = semua bahasa.</small><div class=chips><button class="chip${ff.length?'':' on'}" data-a=fcfall>Semua</button></div>`+
 D.L.map(l=>{const all=ff.length&&l[4].every(v=>ff.includes(l[0]+':'+v));return`<div><small>${l[1]}</small><div class=chips><button class="chip${all?' on':''}" data-a=fclg data-v=${l[0]}>Semua level</button>`+l[4].map(v=>{const x=l[0]+':'+v;return`<button class="chip${ff.includes(x)?' on':''}" data-a=fcfl data-v="${x}">${v}</button>`}).join('')+'</div></div>'}).join('')+
 fcS('fm','Cara menyaring',[['or','Salah satu (OR)'],['and','Semua bahasa aktif (AND)']])+fcN('fmin','Minimal bahasa per kartu (mode OR)',1,4)+
 '<small>OR: kartu masuk jika punya padanan di salah satu bahasa aktif, dan hanya bahasa aktif yang perlu diingat. AND: kartu hanya masuk jika punya padanan di semua bahasa aktif.</small></div></details>'}
function fcSett(){const o=S.o,sz=Object.values(S.srs).filter(c=>c.z).length;
 return dtag('fs')+'<summary>Pengaturan flashcard</summary><div class=card>'+
 fcS('deck','Deck',[['v','Kosakata'],['g','Grammar'],['all','Keduanya']])+
 fcS('fd','Sisi depan kartu',[['id','Bahasa Indonesia'],['fo','Bahasa asing (acak)'],['mix','Campur Indonesia & asing']])+
 `<small>Jenis kata (kosakata)</small><div class=chips><button class="chip${o.sp.length?'':' on'}" data-a=fcpos data-v=all>Semua</button>`+['N','A','V','O'].map(p=>`<button class="chip${o.sp.includes(p)?' on':''}" data-a=fcpos data-v=${p}>${PN[p]}</button>`).join('')+'</div>'+
 fcN('nl','Kartu baru per hari',0,9999)+fcN('rl','Maks. ulasan per hari',0,9999)+
 fcS('ord','Urutan kartu baru',[['seq','Berurutan'],['rand','Acak']])+
 fcS('no','Kartu baru vs ulasan',[['after','Baru setelah ulasan'],['before','Baru sebelum ulasan'],['mix','Campur']])+
 `<label class=fcl><span><input type=checkbox data-i=fc_lk${o.lk?' checked':''}> Integrasikan progres Kartu ↔ Kosakata</span></label><small>Jawaban flashcard otomatis memperbarui status (Selesai = interval ≥ 21 hari). Sebaliknya, mengubah status di tab Kosakata/Grammar menyesuaikan jadwal: Selesai → masuk jadwal ulasan, Sedang → masuk belajar, Belum → jadwal kartu direset.</small><div class=btns><button data-a=fcsyncall>Sinkronkan sekarang</button></div>`+
 dtag('fl')+'<summary>Lanjutan (parameter algoritma)</summary>'+
 `<label class=fcl><span>Langkah belajar (menit)</span><input data-i=fc_ls value="${esc(o.ls)}"></label>`+
 `<label class=fcl><span>Langkah belajar ulang (menit)</span><input data-i=fc_rs value="${esc(o.rs)}"></label>`+
 fcN('gi','Interval lulus (hari)',1,365)+fcN('ei','Interval "Mudah" (hari)',1,365)+fcN('se','Ease awal (%)',130,500)+fcN('eb','Bonus Mudah (%)',100,300)+fcN('hi','Pengali Sulit (%)',100,200)+fcN('ni','Interval setelah lupa (%)',0,100)+fcN('im','Pengubah interval (%)',50,200)+fcN('mx','Interval maksimum (hari)',1,36500)+'</details>'+
 `<div class=btns>${sz?`<button data-a=fcunsusp>Aktifkan kembali ${sz} kartu ditangguhkan</button>`:''}<button data-a=fcrst>Reset jadwal flashcard</button></div></div></details>`}
function fcDone(q,nn,rr){const now=Date.now();
 if(!fcPool().length)return'<div class=card>Tidak ada kartu yang cocok dengan filter/deck saat ini.</div>';
 let h='<div class=card style="text-align:center"><div class=mean>Selesai untuk saat ini</div>';
 if(q.next)h+=`<p>Kartu belajar berikutnya muncul sekitar ${fcFmt(q.next-now)} lagi.</p>`;
 h+=`<p><small>Besok: ${q.tm} ulasan terjadwal · Hari ini: ${S.sd.n} baru &amp; ${S.sd.r} ulasan</small></p><div class=btns>`;
 if(q.Nw.length)h+='<button data-a=fcmore>+10 kartu baru</button>';
 if(q.R.length>rr)h+='<button data-a=fcmoreR>+50 ulasan</button>';
 return h+'</div></div>'}
function fcView(){const q=fcQ(),o=S.o,now=Date.now();
 if(!fcCur||!fcOk(fcCur)){fcCur=fcPick(q);fcRevd=false;fcFrK=null}
 if(fcCur&&fcFrK!==fcCur){fcFr=fcFront(fcCur);fcFrK=fcCur}
 fcWait=fcCur?0:q.next;
 const nn=Math.min(q.Nw.length,q.nL),rr=Math.min(q.R.length,q.rL),ln=q.L.length+(nn+rr?0:q.ah.length);
 let h=`<div class=fcc><span class=k1><b>${nn}</b><small>Baru</small></span><span class=k2><b>${ln}</b><small>Belajar</small></span><span class=k3><b>${rr}</b><small>Ulas</small></span></div>`;
 if(fcCur){const k=fcCur,c=S.srs[k],g=GK[k],rev=fcRevd;
  const hd=g?`${LN[g[1]]||'Jerman'} ${g[2]} · Grammar`:PN[K[k][1]];
  h+=`<div class="card fcard"${rev?'':' data-a=fcshow'}><div class=hd><span>${esc(hd)}</span><span class=${c&&c.t?(c.t==2?'k3':'k2'):'k1'}>${fcInfo(c)}</span></div><div class=fcf>${fcBody(k,rev)}</div></div>`;
  h+=rev?`<div class=fcb>${[1,2,3,4].map(r=>{const n=fcCalc(c,r,now,false);return`<button class="fb fb${r}" data-a=fcans data-v=${r}><small>${n.t==2?fcFmtD(n.i):fcFmt(n.d-now)}</small>${['Lagi','Sulit','Baik','Mudah'][r-1]}</button>`}).join('')}</div>`:'<button class=pri data-a=fcshow style="margin-bottom:12px">Tampilkan jawaban</button>';
  h+=`<div class=fct><button data-a=fcundo${fcUn.length?'':' disabled'}>Urungkan</button><button data-a=fcsusp data-k="${esc(k)}">Tangguhkan</button>${c&&c.t?`<button data-a=fcforget data-k="${esc(k)}">Reset kartu</button>`:''}</div>`}
 else h+=fcDone(q,nn,rr);
 return fcFilt()+fcSett()+h+'<p><small>Filter flashcard terpisah dari tab Kosakata; filter grammar diatur di tab Grammar. Pintasan: Spasi = tampilkan / Baik, 1–4 = nilai, Z = urungkan.</small></p>'}
function fcStatsCard(){fcRoll();const td=fcDay(Date.now()),P=fcPool(),n={n:0,l:0,y:0,m:0},fc=Array(7).fill(0);
 for(const k of P){const c=S.srs[k];if(!c||!c.t){n.n++;continue}
  if(c.t!=2)n.l++;else{c.i>=21?n.m++:n.y++;const d=c.d-td;if(d<=6)fc[Math.max(0,d)]++}}
 const t=P.length||1,sz=Object.values(S.srs).filter(c=>c.z).length,lg=S.lg[td]||[0,0];let t30=0,a30=0;
 for(let d=td-29;d<=td;d++){const x=S.lg[d];if(x){t30+=x[0];a30+=x[1]}}
 const mv=Math.max(1,...fc),w=x=>x/t*100;
 return`<div class=card><b>Flashcard (SRS)</b> — ${P.length} kartu<div class=bar><i style="width:${w(n.m)}%;background:#1a8a4a"></i><i style="width:${w(n.y)}%;background:#6cc48f"></i><i style="width:${w(n.l)}%;background:var(--s1)"></i></div>Baru ${n.n} · Belajar ${n.l} · Muda ${n.y} · Matang ${n.m}${sz?` · Ditangguhkan ${sz}`:''}<p><small>Hari ini: ${lg[0]} ulasan · 30 hari: ${t30} ulasan${t30?`, ${Math.round((1-a30/t30)*100)}% benar`:''}</small></p><small>Ulasan terjadwal 7 hari ke depan</small><div class=fcg>${fc.map((x,i)=>`<div><small>${x}</small><i style="height:${Math.round(x/mv*40)+2}px"></i><small>${i?'+'+i:'Hr ini'}</small></div>`).join('')}</div></div>`}
document.addEventListener('keydown',e=>{if(tab!='fc'||e.ctrlKey||e.metaKey||e.altKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 const k=e.key;let go=0;
 if(k=='z'||k=='Z'){fcUndo();go=1}
 else if(fcCur&&!fcRevd&&(k==' '||k=='Enter')){fcRevd=true;go=1}
 else if(fcCur&&fcRevd&&(k==' '||k=='Enter')){fcAns(3);go=1}
 else if(fcCur&&fcRevd&&/^[1-4]$/.test(k)){fcAns(+k);go=1}
 if(go){e.preventDefault();save();render()}});
setInterval(()=>{if(tab=='fc'&&!fcCur&&fcWait&&fcWait<=Date.now()+12e5&&!document.hidden)render()},15000);

if(S.o.lk&&!S.o.mig){fcSyncAll();S.o.mig=1;save()}
/* ===== Latihan membuat kalimat ===== */
const LTLV={zh:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6'],ja:['N5','N4','N3','N2','N1'],de:['A1','A2','B1','B2','C1'],eo:['A1','A2','B1','B2','C1','C2']};
const LTCJ=['Ich','Du','Er/Sie/Es/Man','Wir','Ihr','sie/Sie'];
let ltCur=null,ltNote=[];
const ltKnown=k=>st(k)>0||!!(S.srs[k]&&S.srs[k].t);
const ltLang=()=>D.L.find(l=>l[0]==S.o.pl);
function ltPool(p,need){const o=S.o,L=o.pl,lv=o.plv,okl=x=>!lv.length||lv.includes(x),s=[],l=[],a=[];
 for(const c of D.C){if(c[1]!=p)continue;const es=c[3][L];if(!es)continue;a.push([c,es]);const g=es.filter(e=>okl(e[3]));if(g.length){l.push([c,g]);if(o.pw=='all'||(o.pw=='weak'?weakW(c[0]):ltKnown(c[0])))s.push([c,g])}}
 if(s.length>=need)return{a:s};
 if(l.length>=need)return{a:l,n:'Kata sesuai sumber terpilih kurang untuk '+PN[p].toLowerCase()+' — memakai semua kata di level terpilih.'};
 return{a:a,n:'Kata '+PN[p].toLowerCase()+' di level terpilih kurang — memakai semua level.'}}
function ltDraw(p,n,ex){const P=ltPool(p,n),out=[];let arr=P.a.filter(x=>!ex.includes(x[0][0]));if(arr.length<n)arr=P.a;const used=new Set();
 while(out.length<n&&used.size<arr.length){const i=Math.random()*arr.length|0;if(used.has(i))continue;used.add(i);const c=arr[i][0],es=arr[i][1];out.push({k:c[0],p,m:c[2],e:es[Math.random()*es.length|0]})}
 if(P.n&&n)ltNote.push(P.n);return out}
function ltGPool(){const o=S.o,lv=o.plv,base=D.G.filter(g=>g[1]==o.pl&&(!o.pe||g[7].length));
 let a=base.filter(g=>!lv.length||lv.includes(g[2]));
 if(!a.length){a=base;if(base.length)ltNote.push('Tidak ada grammar di level terpilih — memakai semua level.')}
 if(o.pg=='weak'){const kn=a.filter(g=>{const s=S.lt.g[g[0]];return s&&s.n>0&&s.ok/s.n<.7});if(kn.length)return kn;ltNote.push('Belum ada grammar yang sering salah — memakai semua grammar.')}
 if(o.pg=='seen'){const kn=a.filter(g=>ltKnown(g[0]));if(kn.length)return kn;ltNote.push('Belum ada grammar yang ditandai Sedang/Selesai — memakai semua grammar.')}
 return a}
function ltPickG(ex){let a=ltGPool();if(a.length>1&&ex)a=a.filter(g=>g[0]!=ex);if(!a.length)return null;
 const wt=g=>{const s=S.lt.g[g[0]];return s?Math.max(.3,1+(s.n-s.ok)*2-s.ok*.5):1},ws=a.map(wt);let r=Math.random()*ws.reduce((x,y)=>x+y,0);
 for(let i=0;i<a.length;i++){r-=ws[i];if(r<=0)return a[i]}return a[a.length-1]}
function ltNew(){const o=S.o;ltNote=[];const g=ltPickG(null);let w=[];
 for(const[p,f]of[['N','pn'],['A','pa'],['V','pv'],['O','po']])if(o[f]>0)w=w.concat(ltDraw(p,o[f],[]));
 ltCur={lang:o.pl,g:g?g[0]:null,w,txt:'',rev:0,copied:0,copiedP:0}}
function ltHit(t,e,lang){t=(t||'').toLowerCase();if(!t.trim())return 0;
 const vs=String(e[0]).replace(/\([^)]*\)|（[^）]*）/g,'').split(/[\/／、,;，]/).map(x=>x.replace(/^(der|die|das|sich|ein|eine)\s+/i,'').replace(/[~〜…。.]/g,'').trim().toLowerCase()).filter(Boolean);
 for(const w of vs){const c=[w];
  if(lang=='ja'){if(w.length>1)c.push(w.slice(0,-1));if(w.endsWith('する')&&w.length>2)c.push(w.slice(0,-2))}
  if(lang=='de'){if(w.endsWith('en')&&w.length>4)c.push(w.slice(0,-2));else if(w.endsWith('n')&&w.length>3)c.push(w.slice(0,-1))}
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
 if(a=='ltnew')ltNew();
 else if(a=='ltrg'&&c){ltNote=[];const g=ltPickG(c.g);if(g){c.g=g[0];c.rev=0;c.copiedP=0}}
 else if(a=='ltrw'&&c){ltNote=[];let w=[];for(const[p,f]of[['N','pn'],['A','pa'],['V','pv'],['O','po']])if(o[f]>0)w=w.concat(ltDraw(p,o[f],c.w.filter(z=>z.p==p).map(z=>z.k)));c.w=w;c.rev=0;c.copiedP=0}
 else if(a=='ltre'&&c){ltNote=[];const w=c.w[+x];if(w){const n=ltDraw(w.p,1,c.w.filter(z=>z.p==w.p).map(z=>z.k));if(n.length){c.w[+x]=n[0];c.copiedP=0}}}
 else if(a=='ltchk'&&c)c.rev=1;
 else if(a=='ltedit'&&c)c.rev=0;
 else if(a=='ltcopy'&&c&&c.g){ltCopy(ltPrompt());c.copied=1}
  else if(a=='ltcopyp'&&c&&c.g){ltCopy(ltPromptGen());c.copiedP=1}
 else if(a=='ltrate'&&c&&c.g){const r=+x,g=GK[c.g],td=fcDay(Date.now());let up=0;
  const has=c.txt.trim();
  if(has){S.lt.h.push({t:Date.now(),g:c.g,gt:g[4],lv:g[2],l:c.lang,w:c.w.map(w=>[w.e[0],w.e[1],w.m,w.p]),k:c.w.map(w=>w.k),s:c.txt.trim(),r});if(S.lt.h.length>1000)S.lt.h=S.lt.h.slice(-1000)}
  const d=S.lt.d[td]||(S.lt.d[td]=[0,0,0]);d[0]++;if(r==2)d[1]++;if(r==1)d[2]++;
  const s=S.lt.g[c.g]||(S.lt.g[c.g]={n:0,ok:0});s.n++;if(r==2)s.ok++;
  if(r==2&&has&&o.lx)[c.g,...c.w.map(w=>w.k)].forEach(z=>{if(z&&!st(z)){S.p[z]=1;S.s[z]=1;fcFS(z);up++}});
  sBuild();ltNew();ltMsg=up?'Status naik ke Sedang: '+up+' item (kata/grammar) karena kalimatmu tepat.':''}
 else if(a=='ltgo'&&GK[k]){const L=GK[k][1];if(o.pl!=L){o.pl=L;o.plv=[]}ltNew();ltCur.g=k;ltCur.rev=0;tab='lt';goTop=1}
 else if(a=='ltfw'&&K[k]){const cd=K[k],ls=Object.keys(cd[3]).filter(l=>LTLV[l]);if(!ls.length){alert('Bahasa kata ini belum tersedia di Latihan.');return}
  const L=ls.includes(o.pl)?o.pl:ls[0];if(o.pl!=L){o.pl=L;o.plv=[]}ltNew();const es=cd[3][L];
  ltCur.w=ltCur.w.filter(z=>z.k!=k);const w={k,p:cd[1],m:cd[2],e:es[Math.random()*es.length|0]},i=ltCur.w.findIndex(z=>z.p==cd[1]);i<0?ltCur.w.push(w):ltCur.w[i]=w;tab='lt';goTop=1}
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
 return dtag('lt')+`<summary>Pengaturan latihan · ${ltLang()[1]}</summary><div class=card>`+
 ltS('pl','Bahasa',[['zh','Mandarin'],['ja','Jepang'],['de','Jerman'],['eo','Esperanto']])+
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
function ltView(){const o=S.o;if(!ltCur||ltCur.lang!=o.pl)ltNew();
 const c=ltCur,g=c.g&&GK[c.g],Lg=ltLang(),dd=S.lt.d[fcDay(Date.now())]||[0,0,0];
 let h=ltSett()+`<div class=gsub style="margin:0 0 8px">${Lg[1]} · hari ini ${dd[0]} soal, ${dd[1]} tepat</div>`+(ltMsg?`<div class=gsub style="margin:0 0 8px;color:var(--s2)">${esc(ltMsg)}</div>`:'');
 if(!g)return h+'<div class=card>Tidak ada grammar yang cocok dengan pengaturan ini. Ubah level atau sumber grammar di pengaturan.</div>';
 const gs=S.lt.g[c.g];
 h+=`<div class=card><div class=hd><span>${Lg[1]} ${esc(g[2])}${g[3]?' · '+esc(g[3]):''}</span><button class=mini data-a=ltrg>Ganti grammar</button></div><div class=mean>${esc(g[4])}</div>${c.rev?gbody(g):gpre(g)}<div class=gsub style="margin-top:8px">${STN[st(c.g)]}${gs&&gs.n?` · pernah dilatih ${gs.n}× (${Math.round(gs.ok/gs.n*100)}% tepat)`:' · belum pernah dilatih'} · <button class="lnk" data-a=gopen data-k="${esc(c.g)}">buka di Grammar</button></div></div>`;
 h+=`<div class=card><div class=hd><span>Kata yang harus dipakai</span><button class=mini data-a=ltrw>Acak ulang</button></div>`+(c.w.length?c.w.map((w,i)=>{const hit=c.rev?ltHit(c.txt,w.e,o.pl):-1,hid=o.ps=='id'&&!c.rev,nw=(SI.w[w.k]||[]).length;
  return`<div class=ltw><span class=fch style="--lc:var(--m)">${PN[w.p]}</span>${hid?`<span class=w>${esc(w.m)}</span>`:`<span class=w style="color:${Lg[2]}">${wd(w.e[0],w.p,'L',o.pl,c.rev)}</span>${w.e[1]?`<span class="r rom">${esc(w.e[1])}</span>`:''}<small class="${o.lm&&!c.rev?'ltm mnh':''}">${esc(w.m)}</small>`}<span class=bdg>${STN[st(w.k)]}${nw?' · ✎'+nw:''}</span><span class=sp>${c.rev?`<b class="${hit?'k3':'k2'}">${hit?'✓ terdeteksi':'? belum terdeteksi'}</b>`:`<button class=mini data-a=ltre data-v=${i}>↻</button>`}<button class=mini data-a=wopen data-k="${esc(w.k)}" title="Detail kata">ⓘ</button></span>${hid?'':fmx(w.e,w.p,o.pl,c.rev)}</div>`}).join(''):'<small>Tidak ada kata tambahan (atur jumlah kata di pengaturan).</small>')+(c.rev&&c.w.length?'<small>Deteksi kata hanya perkiraan; bentuk kata yang berubah (konjugasi, partikel) bisa tidak terbaca.</small>':'')+'</div>';
 const nt=[...new Set(ltNote)];if(nt.length)h+=`<p><small>${nt.map(esc).join('<br>')}</small></p>`;
 if(!c.rev){
  h+=`<textarea id=ltTxt rows=3 placeholder="Tulis kalimat dalam bahasa ${Lg[1]} yang memakai grammar dan semua kata di atas">${esc(c.txt)}</textarea>`;
  h+=`<button class=pri data-a=ltchk style="margin:8px 0">Periksa &amp; lihat referensi</button><div class=fct><button data-a=ltnew>Soal baru</button><button data-a=ltcopy>${c.copied?'Tersalin ✓':'Salin untuk dikoreksi AI'}</button></div><button data-a=ltcopyp style="width:100%;margin-top:6px">${c.copiedP?'Prompt tersalin ✓':'Salin prompt untuk membuat kalimat di AI'}</button>`;
 }else{
  h+=`<div class=card><div class=gsec style="margin:0 0 4px">Kalimatmu</div><div class=gtx>${c.txt.trim()?esc(c.txt):'(belum ditulis)'}</div><div class=btns><button data-a=ltedit>Edit lagi</button><button data-a=ltcopy>${c.copied?'Tersalin ✓':'Salin untuk dikoreksi AI'}</button></div><button data-a=ltcopyp style="width:100%;margin-top:6px">${c.copiedP?'Prompt tersalin ✓':'Salin prompt untuk membuat kalimat di AI'}</button></div>`;
  const pg=(SI.g[c.g]||[]).slice(-3).reverse(),seen=new Set(pg.map(x=>x.t)),pw=[];
  c.w.forEach(w=>(SI.w[w.k]||[]).slice().reverse().forEach(x=>{if(!seen.has(x.t)&&pw.length<3){seen.add(x.t);pw.push(x)}}));
  if(pg.length)h+=`<div class=card><div class=gsec style="margin-top:0">Kalimatmu sebelumnya dengan grammar ini</div>${pg.map(x=>sItem(x,{w:1})).join('')}</div>`;
  if(pw.length)h+=`<div class=card><div class=gsec style="margin-top:0">Kalimatmu sebelumnya dengan kata-kata ini</div>${pw.map(x=>sItem(x,{g:1,w:1})).join('')}</div>`;
  h+=`<p><small>Bandingkan dengan contoh dan keterangan di atas, lalu nilai kalimatmu:</small></p><div class=fcb style="grid-template-columns:repeat(3,1fr)"><button class="fb fb1" data-a=ltrate data-v=0>Belum tepat</button><button class="fb fb2" data-a=ltrate data-v=1>Hampir</button><button class="fb fb3" data-a=ltrate data-v=2>Tepat</button></div><div class=fct><button data-a=ltnew>Lewati, soal baru</button></div>`}
 return h+ltHist()}
function ltStatsCard(){const d=S.lt.d,td=fcDay(Date.now());let t=0,ok=0,ha=0,w=0,wo=0;
 for(const k in d){const x=d[k];t+=x[0];ok+=x[1];ha+=x[2]|0;if(+k>td-7){w+=x[0];wo+=x[1]}}
 if(!t)return'<div class=card><b>Latihan kalimat</b><p><small>Belum ada latihan. Mulai dari tab Latihan — hasilnya muncul di sini dan di detail tiap kata &amp; grammar yang dipakai.</small></p></div>';
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
document.addEventListener('input',e=>{if(e.target.id=='ltTxt'&&ltCur)ltCur.txt=e.target.value});
/* ===== Integrasi antar bagian: kalimat latihan <-> kosakata <-> grammar <-> statistik ===== */
const RT=['Belum tepat','Hampir','Tepat'],WI={};D.C.forEach(c=>{(WI[c[1]+'|'+c[2]]||(WI[c[1]+'|'+c[2]]=[])).push(c)});
let SI={w:{},g:{}},xo=new Set,foc='',fk='',ltMsg='',goTop=0,hop=false;
function wkey(w,l){for(const c of WI[w[3]+'|'+w[2]]||[])for(const L of l?[l]:Object.keys(c[3]))if((c[3][L]||[]).some(e=>e[0]==w[0]))return c[0];return''}
function sMig(){let ch=0;for(const h of S.lt.h)if(!h.k){h.l=h.l||(GK[h.g]?GK[h.g][1]:'');h.k=h.w.map(w=>wkey(w,h.l)||wkey(w));ch=1}if(ch)save()}
function sBuild(){const w={},g={};for(const h of S.lt.h){(h.k||[]).forEach(k=>{if(k&&!(w[k]&&w[k].includes(h)))(w[k]||(w[k]=[])).push(h)});(g[h.g]||(g[h.g]=[])).push(h)}SI={w,g}}
const weakW=k=>{const a=SI.w[k]||[],c=S.srs[k];return(a.length&&a[a.length-1].r<2)||!!(c&&c.l>0)};
function sItem(h,o){o=o||{};
 return`<div class="sn sn${h.r}"><span class=gl>${RT[h.r]} · ${new Date(h.t).toLocaleDateString('id-ID')}${o.g?` · <button class=lnk data-a=gopen data-k="${esc(h.g)}">${esc(h.gt)} (${esc(h.lv)})</button>`:''}</span><span class=tx>${esc(h.s)}</span>`+
 (o.w?`<div class=snw>${h.w.map((w,i)=>h.k&&h.k[i]?`<button class=lnk data-a=wopen data-k="${esc(h.k[i])}">${esc(w[0])}</button>`:esc(w[0])).join(' · ')}</div>`:'')+
 (o.del?`<button class=lnk data-a=sdel data-t=${h.t} style="font-size:.78rem;color:var(--m)">hapus</button>`:'')+'</div>'}
function wSent(k,full){const a=SI.w[k]||[],act=`<div class=btns><button data-a=ltfw data-k="${esc(k)}">${a.length?'Buat kalimat lagi':'Buat kalimat dengan kata ini'}</button></div>`;
 if(!a.length)return full?`<div class=mys><div class=gsec style="margin-top:0">Kalimat saya</div><small>Belum ada kalimat latihan dengan kata ini.</small>${act}</div>`:'';
 const ok=a.filter(h=>h.r==2).length,rec=a.slice().reverse(),sh=rec.slice(0,full?30:2);
 return`<div class=mys><div class=gsec style="margin-top:0">Kalimat saya · ${a.length} · ${ok} tepat</div>`+sh.map(h=>sItem(h,{g:full,del:full})).join('')+(!full&&a.length>2?`<button class=lnk data-a=wopen data-k="${esc(k)}">Lihat semua ${a.length} kalimat</button>`:'')+(full?act:'')+'</div>'}
function gSent(k,full){const a=SI.g[k]||[],s=S.lt.g[k],n=s?s.n:0,act=`<div class=btns><button data-a=ltgo data-k="${esc(k)}">Latih grammar ini</button></div>`;
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
document.addEventListener('click',e=>{let m=e.target.closest&&e.target.closest('.mnh:not(.rv),.cz:not(.rv)');if(m&&m.classList.contains('cz')&&m.closest('.hid')&&!m.closest('.show'))m=null;if(m){m.classList.add('rv');e.stopPropagation();e.preventDefault();return}const r=e.target.closest&&e.target.closest('.rom');if(r&&document.body.classList.contains('romh')&&!r.classList.contains('rv')){r.classList.add('rv');e.stopPropagation();e.preventDefault()}},true);
function render(){document.querySelectorAll('details[data-d]').forEach(d=>d.open?DO.add(d.dataset.d):DO.delete(d.dataset.d));sBuild();document.body.classList.toggle('romh',!!S.o.rom);const T={ses:['Kosakata',ses,'Kata'],fc:['Kartu',()=>vrPromo()+fcView(),'Kartu'+vrBadge()],lt:['Latihan',ltView,'Latihan'],gr:['Grammar',gram,'Grammar'],list:['Daftar',list,'Daftar'],stats:['Statistik',stats,'Stat'],set:['Setelan',set,'Atur']};
v.innerHTML=vrBanner()+(ok?'':'<div class=warn>Penyimpanan lokal diblokir, progres tidak akan tersimpan. Matikan mode privat atau izinkan penyimpanan situs.</div>')+`<h1>${T[tab][0]}${['stats','set'].includes(tab)?'':`<button class=mini data-a=gosen>⚙ Sensor</button>`}</h1>`+T[tab][1]();
n.innerHTML=Object.entries(T).map(([k,x])=>`<button class="${k==tab?'on':''}" data-a=tab data-v=${k}>${x[2]||x[0]}</button>`).join('')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,k=b.dataset.k,x=b.dataset.v,y=scrollY;
if(a.slice(0,2)=='fc'){fcAct(a,x,k)}else if(a.slice(0,2)=='lt'){ltAct(a,x,k)}else if(a=='tab'){tab=x;lim=50}else if(a=='set'){e.stopPropagation();S.p[k]=+x;if(!+x)delete S.p[k];fcFS(k)}else if(a=='flip'){shown.has(k)?shown.delete(k):shown.add(k)}
else if(a=='cyc'){const s=(st(k)+1)%3;s?S.p[k]=s:delete S.p[k];fcFS(k)}else if(a=='roll'){shown.clear();S.ses={};['N','A','V','O'].forEach(p=>S.ses[p]=pick(p))}
else if(a=='re'){S.ses[x]=pick(x,S.ses[x])}else if(a=='fl'){const i=S.f.indexOf(x);i<0?S.f.push(x):S.f.splice(i,1)}else if(a=='fall')S.f=[];else if(a=='gfl'){const i=S.gf.indexOf(x);i<0?S.gf.push(x):S.gf.splice(i,1)}else if(a=='gall')S.gf=[];else if(a=='groll'){S.gs=choose(gp().filter(g=>g[0]!=S.gs))}
else if(a=='gnext'||a=='gprev'){const P=gp(),n=P.length;if(n){const i=P.findIndex(g=>g[0]==S.gs),d=a=='gnext'?1:-1,j=i<0?(d>0?0:n-1):((i+d)%n+n)%n;S.gs=P[j][0];S.s[S.gs]=1}}
else if(a=='gopen'){S.gs=k;tab='gr';save();render();scrollTo(0,0);return}
else if(a=='wopen'){tab='list';q='';fs='';fk='';foc=k;lim=50;goTop=1}else if(a=='wtog'){xo.has(k)?xo.delete(k):xo.add(k)}else if(a=='wclose'){foc=''}else if(a=='sdel'){sDel(+b.dataset.t)}
else if(a=='gosen'){tab='set';goTop=1}
else if(a=='more')lim+=50;
else if(a=='exp'){const u=URL.createObjectURL(new Blob([JSON.stringify({v:2,p:S.p,s:S.s,srs:S.srs,lg:S.lg,lt:S.lt})],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download='progres-kosakata.json';l.click();return}
else if(a=='rst'){if(!confirm('Hapus semua progres?'))return;S.p={};S.s={};S.srs={};S.lg={};S.lt={h:[],g:{},d:{}};ltCur=null;xo=new Set;foc='';S.sd={d:-1,n:0,r:0,x:0,y:0};fcUn=[];fcCur=null}
save();render();scrollTo(0,goTop?0:y);goTop=0});
document.addEventListener('change',e=>{const i=e.target.dataset.i;if(!i)return;
if(i.slice(0,3)=='fc_')fcSet(i,e.target);else if(i.slice(0,3)=='lt_')ltSet(i,e.target);else if(i=='mode')S.o.mode=e.target.value;else if(i=='minL')S.o.minL=+e.target.value;else if(i=='fs')fs=e.target.value;else if(i=='fk')fk=e.target.value;else if(i=='gseq')S.o.gseq=+e.target.checked;else if(['cv','cgL','cgK','cgF','cpl','cvb'].includes(i))S.o[i]=e.target.value;else if(i=='rom')S.o.rom=+e.target.checked;
else if(i=='imp'){const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const d=JSON.parse(t);Object.assign(S.p,d.p);Object.assign(S.s,d.s||{});Object.assign(S.srs,d.srs||{});Object.assign(S.lg,d.lg||{});if(d.lt){const m=new Map();(S.lt.h||[]).concat(d.lt.h||[]).forEach(x=>m.set(x.t+'|'+x.s,x));S.lt.h=[...m.values()].sort((a,b)=>a.t-b.t).slice(-1000);sMig();Object.assign(S.lt.g,d.lt.g||{});Object.assign(S.lt.d,d.lt.d||{})}save();render();alert('Progres dipulihkan.')}catch(_){alert('File tidak valid.')}});return}
save();render()});
document.addEventListener('input',e=>{if(e.target.dataset.i=='q'){q=e.target.value;const p=e.target.selectionStart;render();const el=document.querySelector('[data-i=q]');el.focus();el.setSelectionRange(p,p)}});
try{const _t=new URLSearchParams(location.search).get('tab');if(_t&&['ses','fc','lt','gr','list','stats','set'].includes(_t))tab=_t}catch(e){}
render();vrInit();
