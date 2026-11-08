/* Vortaro — penyimpanan IndexedDB (v7.9.0; v7.19.4: revisi + gabung antar-tab + cadangan berputar)
   Menggantikan localStorage (batas ±5 MB) untuk progres + Pustaka.
   - boot()  : membuka IndexedDB; bila masih kosong, MENYALIN otomatis data lama dari localStorage.
   - save(S) : simpan tertunda (debounce) + langsung saat tab disembunyikan/ditutup.
   - Data lama di localStorage TIDAK dihapus (jadi cadangan; bisa dihapus manual di Atur).
   - Bila IndexedDB tidak tersedia (mode privat tertentu), otomatis kembali memakai localStorage. */
(function(g){
'use strict';
const DB='vortaro-data',ST='kv',KEY='state',META='meta';
const V={mode:'ls',initial:{},legacyBytes:0,lastSave:0,err:null,onError:null,sk:'vortaro_v1',rev:0,id:Math.random().toString(36).slice(2),dayFn:null,merge:null,onRemote:null,onMerged:null,lsLast:null,dead:false,forceNext:false};
let bc=null;try{bc=new BroadcastChannel('vortaro-state')}catch(e){}
const post=m=>{try{bc&&bc.postMessage({id:V.id,...m})}catch(e){}};

const open=()=>new Promise((res,rej)=>{
 if(!g.indexedDB)return rej(new Error('IndexedDB tidak tersedia'));
 let r;try{r=indexedDB.open(DB,1)}catch(e){return rej(e)}
 r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(ST))r.result.createObjectStore(ST)};
 r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('IndexedDB diblokir'));
});
let dbp=null;const db=()=>dbp||(dbp=open());
const rd=k=>db().then(d=>new Promise((res,rej)=>{const q=d.transaction(ST).objectStore(ST).get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}));
const wr=(k,v)=>db().then(d=>new Promise((res,rej)=>{const t=d.transaction(ST,'readwrite');t.objectStore(ST).put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('transaksi dibatalkan'))}));

const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const parse=s=>{try{const o=JSON.parse(s);return o&&typeof o=='object'&&!Array.isArray(o)?o:null}catch(e){return null}};

/* data lama di localStorage (termasuk kunci paling lama 'kosakata_v1') */
function legacy(){const s=lsGet(V.sk)||lsGet('kosakata_v1');return s||null}

async function boot(sk){
 if(sk)V.sk=sk;
 const old=legacy();V.legacyBytes=old?old.length:0;
 try{
  const cur=await Promise.race([rd(KEY),new Promise((_,rej)=>setTimeout(()=>rej(new Error('IndexedDB tidak merespons')),10000))]);
  if(typeof cur=='string'){const o=parse(cur);if(o){V.mode='idb';V.initial=o;V.bytes=cur.length;V.rev=(await rd('rev'))|0;persist();return V}}
  /* IndexedDB masih kosong → migrasi otomatis dari localStorage (bila ada) */
  if(old){
   const o=parse(old);
   if(o){await wr(KEY,old);const back=await rd(KEY);
    if(back!==old)throw new Error('verifikasi migrasi gagal');
    await wr(META,{migratedAt:Date.now(),from:'localStorage',bytes:old.length});
    V.mode='idb';V.initial=o;V.bytes=old.length;V.migrated=old.length;persist();return V}
  }
  V.mode='idb';V.initial={};V.bytes=0;persist();return V;      /* pengguna baru */
 }catch(e){
  /* gagal memakai IndexedDB → pakai localStorage seperti sebelumnya */
  V.mode='ls';V.err=String(e&&e.message||e);V.lsLast=old;V.initial=(old&&parse(old))||{};return V;
 }
}
function persist(){try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}}

/* ---- simpan tertunda: banyak save() beruntun → satu penulisan ---- */
let timer=0,dirty=null,busy=Promise.resolve();
function fail(e){V.err=String(e&&e.message||e);if(V.onError)try{V.onError(e)}catch(x){}}
/* satu transaksi readwrite: baca rev tersimpan; bila lebih baru dari yang diketahui tab ini → gabung (bukan timpa);
   sekali per hari (V.dayFn) state lama diputar ke state_prev / state_prev2 */
const commit=(S,force)=>db().then(d=>new Promise((res,rej)=>{
 const t=d.transaction(ST,'readwrite'),st=t.objectStore(ST),g=['rev','state','bakmeta','state_prev'].map(k=>st.get(k));let n=0,nr=0,js='',merged=false;
 t.oncomplete=()=>{V.rev=nr;V.bytes=js.length;post({rev:nr});if(merged&&V.onMerged)try{V.onMerged()}catch(e){}res()};
 t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('transaksi dibatalkan'));
 g.forEach(q=>q.onsuccess=()=>{if(++n<g.length)return;
  const rev=g[0].result|0,old=g[1].result,bm=g[2].result||{};
  if(!force&&rev>V.rev&&typeof old=='string'&&V.merge){const o=parse(old);if(o)try{V.merge(o,S);merged=true}catch(e){}}
  js=JSON.stringify(S);nr=Math.max(rev,V.rev)+1;
  const day=V.dayFn?V.dayFn(Date.now()):0;
  if(typeof old=='string'&&bm.day!==day){if(typeof g[3].result=='string')st.put(g[3].result,'state_prev2');st.put(old,'state_prev');bm.prev2=bm.prev;bm.prev={t:Date.now()};bm.day=day}
  st.put(js,'state');st.put(nr,'rev');st.put(bm,'bakmeta')})}));
function flush(){
 clearTimeout(timer);timer=0;
 if(!dirty||V.dead)return busy;
 const S=dirty;dirty=null;const force=V.forceNext;V.forceNext=false;let js;
 if(V.mode=='ls'){
  try{const cur=localStorage.getItem(V.sk);
   if(!force&&cur&&V.lsLast!=null&&cur!==V.lsLast&&V.merge){const o=parse(cur);if(o){V.merge(o,S);if(V.onMerged)try{V.onMerged()}catch(e){}}}
   js=JSON.stringify(S);V.bytes=js.length;localStorage.setItem(V.sk,js);V.lsLast=js;V.lastSave=Date.now();V.err=null}catch(e){fail(e)}
  return busy}
 busy=busy.then(()=>commit(S,force)).then(()=>{V.lastSave=Date.now();V.err=null},fail);
 return busy;
}
function save(S){dirty=S;if(V.mode=='ls'){flush();return}clearTimeout(timer);timer=setTimeout(flush,300)}

/* tab ditutup / disembunyikan → tulis segera supaya progres terakhir tidak hilang */
addEventListener('visibilitychange',()=>{if(document.visibilityState=='hidden')flush()});
addEventListener('pagehide',flush);

/* hapus salinan lama di localStorage (cadangan sebelum migrasi) */
function dropLegacy(){try{localStorage.removeItem(V.sk);localStorage.removeItem(V.sk+'_t');localStorage.removeItem('kosakata_v1');V.legacyBytes=0;return true}catch(e){return false}}
/* perkiraan pemakaian & kuota penyimpanan situs */
async function estimate(){try{const e=await navigator.storage.estimate();return{use:e.usage||0,quota:e.quota||0}}catch(e){return null}}


/* ---- sinkron antar-tab ---- */
const isDirty=()=>!!(dirty||timer);
async function pull(force){
 if(V.mode!='idb'||V.dead)return;
 try{const rev=(await rd('rev'))|0;if(!force&&rev<=V.rev)return;if(isDirty()&&!force)return;
  const cur=await rd('state'),o=typeof cur=='string'&&parse(cur);if(!o||(isDirty()&&!force))return;
  if(force){clearTimeout(timer);timer=0;dirty=null}
  V.rev=rev;V.bytes=cur.length;if(V.onRemote)V.onRemote(o)}catch(e){}
}
if(bc)bc.onmessage=e=>{const m=e.data||{};if(m.id===V.id)return;pull(!!m.restore)};
addEventListener('storage',e=>{if(V.mode!='ls'||e.key!==V.sk||!e.newValue||isDirty())return;const o=parse(e.newValue);if(o){V.lsLast=e.newValue;if(V.onRemote)V.onRemote(o)}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible')pull()});
/* timpa mentah pada penulisan berikutnya (untuk Hapus semua / impor / pemulihan) */
function force(){V.forceNext=true}

/* ---- cadangan ---- */
/* backup('pre'): simpan state SEKARANG (sebelum tindakan merusak) ke state_pre */
function backup(S,tag){if(V.mode!='idb')return Promise.resolve();let js;try{js=JSON.stringify(S)}catch(e){return Promise.resolve()}
 return busy=busy.then(()=>db().then(d=>new Promise((res,rej)=>{const t=d.transaction(ST,'readwrite'),st=t.objectStore(ST),q=st.get('bakmeta');
  q.onsuccess=()=>{const bm=q.result||{};st.put(js,'state_'+tag);bm[tag]={t:Date.now()};st.put(bm,'bakmeta')};t.oncomplete=()=>res();t.onerror=()=>rej(t.error)}))).catch(fail)}
const BK=[['prev','Kemarin (cadangan harian)'],['prev2','Dua hari lalu'],['pre','Sebelum Hapus/Impor terakhir'],['undo','Sebelum pemulihan terakhir']];
async function backups(){if(V.mode!='idb')return[];const bm=(await rd('bakmeta'))||{},out=[];
 for(const[k,l]of BK){const s=await rd('state_'+k);if(typeof s!='string')continue;const o=parse(s);if(!o)continue;
  out.push({key:k,label:l,t:(bm[k]&&bm[k].t)||0,cards:Object.keys(o.srs||{}).length,bytes:s.length})}
 return out}
/* restore: state sekarang (termasuk yang belum tersimpan) → state_undo; lalu tulis cadangan sebagai state; muat ulang halaman */
async function restore(S,key){if(V.mode!='idb')throw new Error('Hanya untuk IndexedDB');
 const cur=JSON.stringify(S);await busy;V.dead=true;clearTimeout(timer);timer=0;dirty=null;
 const d=await db();
 await new Promise((res,rej)=>{const t=d.transaction(ST,'readwrite'),st=t.objectStore(ST),g=[st.get('state_'+key),st.get('rev'),st.get('bakmeta')];let n=0;
  t.oncomplete=()=>res();t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('dibatalkan'));
  g.forEach(q=>q.onsuccess=()=>{if(++n<3)return;const tg=g[0].result;if(typeof tg!='string'||!parse(tg)){V.dead=false;try{t.abort()}catch(e){}return}
   const bm=g[2].result||{};st.put(cur,'state_undo');bm.undo={t:Date.now()};st.put(bm,'bakmeta');st.put(tg,'state');st.put((g[1].result|0)+1,'rev')})}).catch(e=>{V.dead=false;throw e});
 post({restore:1});return true}

Object.assign(V,{boot,save,flush,dropLegacy,estimate,force,backup:(S,t)=>backup(S,t),backups,restore,pull});
g.VRS=V;
})(window);

/* v7.29.1: layar pemulihan bila aplikasi gagal dimuat (alih-alih layar kosong) */
(function(g){
let shown=false;
g.vrFatal=function(e){
 if(shown)return;shown=true;
 const m=String(e&&(e.stack||e.message)||e||'galat tak dikenal').slice(0,600).replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
 const v=document.getElementById('v')||document.body;
 v.innerHTML='<div style="padding:20px;font:15px/1.5 system-ui,sans-serif;max-width:560px;margin:auto"><h2 style="margin:0 0 8px">Vortaro gagal dimuat</h2><p>Datamu <b>tidak dihapus</b>. Coba langkah ini berurutan:</p><p><button id=fx1 style="padding:10px 14px;margin:4px 0">1. Muat ulang</button><br><button id=fx2 style="padding:10px 14px;margin:4px 0">2. Bersihkan cache aplikasi &amp; muat ulang</button><br><button id=fx3 style="padding:10px 14px;margin:4px 0">3. Unduh cadangan data (JSON)</button></p><pre style="white-space:pre-wrap;font-size:12px;opacity:.7;background:#8881;padding:8px;border-radius:6px">'+m+'</pre></div>';
 const $=i=>document.getElementById(i);
 $('fx1').onclick=()=>location.reload();
 $('fx2').onclick=async()=>{try{const rs=await navigator.serviceWorker.getRegistrations();for(const r of rs)await r.unregister()}catch(x){}try{for(const k of await caches.keys())await caches.delete(k)}catch(x){}location.reload()};
 $('fx3').onclick=()=>{try{const d=g.VRS&&VRS.initial&&Object.keys(VRS.initial).length?VRS.initial:JSON.parse(localStorage.getItem('vortaro_v1')||'{}');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));a.download='vortaro-cadangan.json';a.click()}catch(x){alert('Gagal: '+x.message)}}
};
/* tangkap galat yang membuat layar tetap kosong */
g.addEventListener('error',ev=>{setTimeout(()=>{const v=document.getElementById('v');if(v&&!v.innerHTML.trim())g.vrFatal(ev.error||ev.message)},1500)});
g.addEventListener('unhandledrejection',ev=>{setTimeout(()=>{const v=document.getElementById('v');if(v&&!v.innerHTML.trim())g.vrFatal(ev.reason)},1500)});
})(window);
