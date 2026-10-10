/* Vortaro — inti pengingat (dipakai oleh halaman DAN service worker). */
(function(g){
'use strict';
const DB='vortaro-rem',ST='kv';
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(ST);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function get(k){const d=await idb();return new Promise((res,rej)=>{const r=d.transaction(ST).objectStore(ST).get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function put(k,v){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction(ST,'readwrite');t.objectStore(ST).put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
/* hari belajar berganti pukul 04:00 — sama seperti fcDay di aplikasi */
const day=t=>Math.floor((t-new Date(t).getTimezoneOffset()*6e4-144e5)/864e5);
const ymd=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};

/* perkiraan beban hari ini dari snapshot (bisa saja sudah berumur beberapa jam/hari) */
function due(s,now){
 if(!s)return{a:0,b:0,sh:0};
 const sh=day(now)-s.td;
 if(sh<=0)return{a:s.a,b:s.b,sh:0};
 return{a:s.L+Math.min(s.R+s.tm,s.rl),b:Math.min(s.Nw,s.nl),sh};
}
function message(s,now){
 const d=due(s,now),n=d.a+d.b;let body;
 if(n>0){
  const p=[];if(d.a)p.push(d.a+' kartu ulasan');if(d.b)p.push(d.b+' kata baru');
  body=p.join(' + ')+' menunggumu hari ini.';
  const risk=s&&s.streak>0&&((d.sh==0&&!s.studied)||(d.sh==1&&s.studied));
  body+=risk?' Jaga rentetan '+s.streak+' harimu!':' Cukup 5 menit saja.';
 }else body='Semua kartu hari ini sudah beres. Mau tambah kata baru atau latihan kalimat?';
 return{title:'Vortaro · Waktunya hafalan',body,n};
}
/* tentukan apakah ada slot waktu yang perlu dibunyikan sekarang */
function plan(cfg,snap,fired,now){
 if(!cfg||!cfg.on)return null;
 const d=new Date(now),mins=d.getHours()*60+d.getMinutes(),late=cfg.late||360,today=ymd(now);
 let hit=null;
 for(const t of cfg.times||[]){
  if(!/^\d\d:\d\d$/.test(t||''))continue;
  const[h,m]=t.split(':').map(Number),sm=h*60+m;
  if(sm<=mins&&mins-sm<=late&&!fired[today+'@'+t])hit={key:today+'@'+t,t};
 }
 if(!hit)return null;
 const msg=message(snap,now);
 return{key:hit.key,skip:cfg.due!==0&&msg.n<=0,msg};
}
/* cek + tandai sudah dibunyikan; `show` menampilkan notifikasi/banner */
async function check(show){
 const cfg=await get('cfg'),snap=await get('snap');let fired=(await get('fired'))||{};
 const now=Date.now(),p=plan(cfg,snap,fired,now);
 if(!p)return false;
 const today=ymd(now),nf={};for(const k in fired)if(k.startsWith(today+'@'))nf[k]=1;
 nf[p.key]=1;await put('fired',nf);
 if(p.skip)return false;
 await show(p.msg);return true;
}
g.VR={get,put,day,due,message,plan,check};
})(self);
