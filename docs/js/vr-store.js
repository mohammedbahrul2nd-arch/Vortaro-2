/* Vortaro — penyimpanan IndexedDB (v7.9.0)
   Menggantikan localStorage (batas ±5 MB) untuk progres + Pustaka.
   - boot()  : membuka IndexedDB; bila masih kosong, MENYALIN otomatis data lama dari localStorage.
   - save(S) : simpan tertunda (debounce) + langsung saat tab disembunyikan/ditutup.
   - Data lama di localStorage TIDAK dihapus (jadi cadangan; bisa dihapus manual di Atur).
   - Bila IndexedDB tidak tersedia (mode privat tertentu), otomatis kembali memakai localStorage. */
(function(g){
'use strict';
const DB='vortaro-data',ST='kv',KEY='state',META='meta';
const V={mode:'ls',initial:{},legacyBytes:0,lastSave:0,err:null,onError:null,sk:'vortaro_v1'};

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
  if(typeof cur=='string'){const o=parse(cur);if(o){V.mode='idb';V.initial=o;V.bytes=cur.length;persist();return V}}
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
  V.mode='ls';V.err=String(e&&e.message||e);V.initial=(old&&parse(old))||{};return V;
 }
}
function persist(){try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}}

/* ---- simpan tertunda: banyak save() beruntun → satu penulisan ---- */
let timer=0,dirty=null,busy=Promise.resolve();
function fail(e){V.err=String(e&&e.message||e);if(V.onError)try{V.onError(e)}catch(x){}}
function flush(){
 clearTimeout(timer);timer=0;
 if(!dirty)return busy;
 const S=dirty;dirty=null;let js;
 try{js=JSON.stringify(S)}catch(e){fail(e);return busy}
 V.bytes=js.length;
 if(V.mode=='ls'){try{localStorage.setItem(V.sk,js);V.lastSave=Date.now();V.err=null}catch(e){fail(e)}return busy}
 busy=busy.then(()=>wr(KEY,js)).then(()=>{V.lastSave=Date.now();V.err=null},fail);
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

Object.assign(V,{boot,save,flush,dropLegacy,estimate});
g.VRS=V;
})(window);
