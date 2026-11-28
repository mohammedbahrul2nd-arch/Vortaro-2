/* Vortaro 7.111.0 — duplikasi kosakata N3 yang sudah ada di N4/N5 dihapus (tools/dedup_n3.py; jangan edit tabel manual).
   Tabel (kunci kartu LAMA):  mv = entri N3 yang dihapus -> kartu N4/N5 tujuan (1–2)
                              rn = kartu yang masih ada tetapi nomor indeks entri jamaknya bergeser (<konsep>@ja~n)
                              cm = konsep yang ikut dibuang -> konsep N4/N5 pengganti (untuk tautan tag Pustaka)
   ddMig(st) memindahkan progres pengguna SEKALI (penanda st.o.dd3): jadwal kartu yang interval-nya PALING JAUH menang
   (dihitung antara kartu N3 dan kartu N4/N5 tujuan), status Belum/Sedang/Selesai = yang tertinggi, tanda «sudah dilihat» digabung.
   Dipanggil: saat aplikasi dibuka (app.js), saat dua tab bergabung (VRS.merge), saat tab lain menimpa (VRS.onRemote), dan saat impor JSON (gmImpData). */
const DD3=/*TABEL*/;
function ddMig(st,flag){
 if(!st||typeof st!='object')return null;
 const mv=DD3.mv,rn=DD3.rn,cm=DD3.cm,R={moved:0,merged:0,renamed:0,ed:0,tags:0},seal=flag!==false;
 let o=st.o;if(o&&typeof o!='object')o=st.o=seal?{}:null;if(!o&&seal)o=st.o={};
 if(o&&o.dd3)return null;
 const has=Object.prototype.hasOwnProperty,own=(m,k)=>!!m&&has.call(m,k);
 const DONE=90;/* = FC_DONE (app.js): sengaja tidak dibaca dari sana karena ddMig dipanggil sebelum konstanta itu dideklarasikan */
 const rank=c=>c&&c.t==2?(c.i|0):c&&c.t?-1:-2;
 const clone=x=>JSON.parse(JSON.stringify(x));
 /* jadwal kartu: interval paling jauh menang; seri -> ulasan terbanyak -> jadwal berikutnya paling jauh -> kartu tujuan (N4/N5) */
 const pick=(t,s)=>{const rt=rank(t),rs=rank(s);if(rs<=-2)return t;if(rt<=-2)return s;
  if(rs!=rt)return rs>rt?s:t;if((s.r|0)!=(t.r|0))return(s.r|0)>(t.r|0)?s:t;return(s.d||0)>(t.d||0)?s:t};
 const srsMerge=(t,s)=>{const w=pick(t,s);if(w===t||!w)return t;const r=clone(w);if(t&&t.z)r.z=1;else delete r.z;return r};
 const touched=new Set(),MV=new Set();
 const bag=(name,merge)=>{const old=st[name];if(!old||typeof old!='object')return;const out={};
  for(const k in old){if(own(mv,k))continue;const nk=own(rn,k)?rn[k]:k;if(nk!==k)R.renamed++;out[nk]=own(out,nk)?merge(out[nk],old[k]):old[k]}
  for(const k in old){if(!own(mv,k))continue;for(const tk of mv[k]){out[tk]=own(out,tk)?merge(out[tk],old[k]):(name=='srs'?(rank(old[k])<=-2?undefined:srsMerge(undefined,old[k])):old[k]);if(out[tk]===undefined)delete out[tk];else touched.add(tk)}MV.add(k)}
  st[name]=out};
 bag('srs',srsMerge);
 bag('p',(a,b)=>Math.max(a|0,b|0));
 bag('s',(a,b)=>a||b?1:a);
 /* status chip = jadwal kartu pemenang (aturan fcSync), bila pengaturan «sinkron jadwal» (o.lk) aktif */
 if(st.srs&&st.p&&o&&o.lk)for(const k of touched){const c=st.srs[k];if(c&&c.t){st.p[k]=c.t==2&&(c.i|0)>=DONE?2:1;if(st.s)st.s[k]=1}}
 R.merged=touched.size;R.moved=MV.size;
 /* kunci tunggal bernilai kartu: kartu terakhir/hari ini, rotasi kalimat, daftar «bukan contoh» */
 if(o){
  const one=k=>own(mv,k)?mv[k][0]:own(rn,k)?rn[k]:k;
  if(typeof o.fcn=='string')o.fcn=one(o.fcn);if(typeof o.fcl=='string')o.fcl=one(o.fcl);
  if(o.hd&&o.hd.c&&typeof o.hd.c=='object'){const c={};for(const k in o.hd.c){const nk=one(k);if(!own(c,nk))c[nk]=o.hd.c[k]}o.hd.c=c}
  if(o.gsr&&typeof o.gsr=='object'){const g={};for(const k in o.gsr){if(own(mv,k))continue;const nk=own(rn,k)?rn[k]:k;g[nk]=o.gsr[k]}
   for(const k in mv)for(const tk of mv[k])delete g[tk];o.gsr=g}   /* rotasi diulang: kalimat bawaan kartu tujuan bisa bertambah */
  if(o.gmNo&&typeof o.gmNo=='object'){const g={},add=(k,a)=>{if(!Array.isArray(a))return;const t=g[k]||(g[k]=[]);a.forEach(x=>{if(!t.includes(x))t.push(x)})};
   for(const k in o.gmNo){if(own(mv,k))continue;add(own(rn,k)?rn[k]:k,o.gmNo[k])}
   for(const k in o.gmNo){if(own(mv,k))for(const tk of mv[k])add(tk,o.gmNo[k])}o.gmNo=g}
 }
 /* edit kosakata (S.ed.v[konsep].e.ja[indeks]): indeks ikut bergeser; edit entri N3 yang dihapus pindah ke kartu tujuan bila slot-nya kosong */
 const ev=st.ed&&st.ed.v;
 if(ev&&typeof ev=='object'){
  const split=k=>{const i=k.indexOf('@ja');return[k.slice(0,i),k.length>i+3?+k.slice(i+4):0]};
  const plan=[];
  for(const cid of Object.keys(ev)){const e=ev[cid]&&ev[cid].e&&ev[cid].e.ja;if(!Array.isArray(e))continue;
   const out=[];e.forEach((x,i)=>{if(x==null)return;const k=cid+'@ja'+(i>0?'~'+i:'');
    if(own(mv,k)){R.ed++;mv[k].forEach(tk=>plan.push([tk,x]))}else{const nk=own(rn,k)?rn[k]:k;if(nk!==k)R.ed++;out[split(nk)[1]]=x}});
   for(let i=0;i<out.length;i++)if(out[i]===undefined)out[i]=null;
   ev[cid].e.ja=out}
  for(const[tk,x]of plan){const[cid,i]=split(tk),r=ev[cid]||(ev[cid]={}),e=r.e||(r.e={}),a=e.ja||(e.ja=[]);while(a.length<=i)a.push(null);if(!a[i])a[i]=x}
  for(const cid of Object.keys(ev)){const r=ev[cid];if(r.e&&r.e.ja&&!r.e.ja.some(Boolean))delete r.e.ja;if(r.e&&!Object.keys(r.e).length)delete r.e;if(!Object.keys(r).length)delete ev[cid]}
  for(const cid in cm)if(ev[cid])delete ev[cid]}   /* konsep yang dibuang: sisa edit (mis. arti) ikut hilang */
 /* tautan tag Pustaka & riwayat latihan ke konsep yang dibuang -> konsep N4/N5 penggantinya */
 const cid2=a=>{const o2=[];for(const x of a){const y=own(cm,x)?cm[x]:[x];for(const z of y)if(!o2.includes(z))o2.push(z)}return o2};
 const fixTag=it=>{if(!it||typeof it!='object')return;let ch=0;
  if(it.k&&own(cm,it.k)){it.k=cm[it.k][0]||'';ch=1}
  if(Array.isArray(it.ks)&&it.ks.some(x=>own(cm,x))){it.ks=cid2(it.ks);ch=1}
  if(ch)R.tags++};
 const tags=a=>{if(Array.isArray(a))a.forEach(fixTag)};
 if(Array.isArray(st.lib))st.lib.forEach(t=>(t&&t.ps||[]).forEach(p=>(p&&p.tg||[]).forEach(tags)));
 if(Array.isArray(st.sl))st.sl.forEach(t=>t&&Array.isArray(t.tg)&&tags(t.tg));
 if(st.lt&&Array.isArray(st.lt.h))st.lt.h.forEach(h=>{if(h&&Array.isArray(h.k)&&h.k.some(x=>own(cm,x))){h.k=cid2(h.k);R.tags++}});
 if(seal)o.dd3=1;
 return R}
