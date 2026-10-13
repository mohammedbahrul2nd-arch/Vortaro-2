/* Vortaro — antarmuka pengingat hafalan + pemasangan aplikasi (halaman utama).
   Dimuat SEBELUM app.js; semua fungsi hanya dipakai saat render, jadi aman. */
let vrMsg=null,vrPS='',vrInst=null,vrT=0,vrBC={at:0,n:0};
const vrSup=()=>'Notification' in window&&'serviceWorker' in navigator;
const vrStand=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const vrIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
function vrCfg(){const r=(S.o&&S.o.rem)||{};return{on:0,times:['19:00','',''],due:1,late:360,...r}}
function vrSet(p){S.o.rem={...vrCfg(),...p};save()}

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();vrInst=e;try{render()}catch(_){}});
window.addEventListener('appinstalled',()=>{vrInst=null;try{render()}catch(_){}});

/* ---------- snapshot beban belajar (dibaca juga oleh service worker) ---------- */
function vrSnapNow(){
 const q=fcQ(),td=fcDay(Date.now());
 let run=0;for(let d=td;;d--){const a=((S.lg[d]||[0])[0]|0)+((S.lt.d[d]||[0])[0]|0);if(a>0)run++;else if(d<td)break}
 const act=((S.lg[td]||[0])[0]|0)+((S.lt.d[td]||[0])[0]|0),L=q.L.length;
 return{ts:Date.now(),td,L,R:q.R.length,Nw:q.Nw.length,tm:q.tm,nl:S.o.nl,rl:S.o.rl,
  a:L+Math.min(q.R.length,q.rL),b:Math.min(q.Nw.length,q.nL),streak:run,studied:act>0};
}
async function vrSnap(){try{vrBC.at=0;await VR.put('snap',vrSnapNow())}catch(e){}}
function vrSnapSoon(){vrBC.at=0;clearTimeout(vrT);vrT=setTimeout(vrSnap,1500)}

/* ---------- sinkronkan pengaturan ke penyimpanan bersama service worker ---------- */
async function vrSync(){
 try{await VR.put('cfg',vrCfg());await vrSnap()}catch(e){}
 vrPS='';
 try{
  const reg=await navigator.serviceWorker.ready,c=vrCfg();
  if(!('periodicSync' in reg)){vrPS='na';return}
  if(c.on&&Notification.permission=='granted'){
   const st=await navigator.permissions.query({name:'periodic-background-sync'});
   if(st.state=='granted'){await reg.periodicSync.register('vortaro-reminder',{minInterval:36e5});vrPS='on'}else vrPS='denied';
  }else{await reg.periodicSync.unregister('vortaro-reminder');vrPS='off'}
 }catch(e){vrPS='na'}
}
async function vrShow(m){
 try{
  const reg=await navigator.serviceWorker.ready;
  await reg.showNotification(m.title,{body:m.body,icon:'icons/icon-192.png',tag:'vortaro-reminder',data:{url:'./?tab=fc'},actions:[{action:'study',title:'Mulai belajar'},{action:'later',title:'Nanti'}]});
 }catch(e){vrMsg=m;render()}
}
/* dipanggil tiap 30 dtk & saat tab kembali aktif */
async function vrTick(){
 const c=vrCfg();if(!c.on)return;
 try{
  await VR.put('cfg',c);
  await VR.check(m=>{
   if(document.hidden&&vrSup()&&Notification.permission=='granted')return vrShow(m);
   vrMsg=m;render();
  });
 }catch(e){}
}
async function vrEnable(){
 let p='unsupported';
 if(vrSup()){p=Notification.permission;if(p=='default'){try{p=await Notification.requestPermission()}catch(e){}}}
 vrSet({on:1});await vrSync();render();
 if(p=='granted')vrTest(true);
}
async function vrTest(quiet){
 const m=VR.message(vrSnapNow(),Date.now());
 if(vrSup()&&Notification.permission=='granted')await vrShow(m);
 else if(!quiet){vrMsg=m;render()}
}
function vrInit(){
 try{
  if(vrSup())navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.go){tab=e.data.go;render();scrollTo(0,0)}});
  setInterval(vrTick,3e4);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){vrBC.at=0;vrTick()}});
  vrSnap();vrTick();
  if(vrCfg().on&&vrSup())vrSync();
 }catch(e){}
}

/* ---------- potongan tampilan ---------- */
function vrBadge(){
 try{
  const now=Date.now();
  if(now-vrBC.at>5e3){const q=fcQ();vrBC={at:now,n:q.L.length+Math.min(q.R.length,q.rL)+Math.min(q.Nw.length,q.nL)}}
  try{if(navigator.setAppBadge){vrBC.n>0?navigator.setAppBadge(vrBC.n):navigator.clearAppBadge()}}catch(e){}
  return vrBC.n>0?`<span class=nb>${vrBC.n>99?'99+':vrBC.n}</span>`:'';
 }catch(e){return ''}
}
function vrBanner(){
 if(!vrMsg)return '';
 return`<div class=vrb><div><b>🔔 ${esc(vrMsg.title)}</b><small>${esc(vrMsg.body)}</small></div><button data-r=go>Mulai</button><button class=x data-r=bx aria-label=Tutup>✕</button></div>`;
}
function vrPromo(){
 const c=vrCfg();
 if(c.on||S.o.remNo)return '';
 return`<div class=card><b>🔔 Pengingat hafalan</b><p class=gsub style="margin:4px 0 8px">Ingin diingatkan setiap hari agar kartu tidak menumpuk? Kamu bisa mengatur jamnya sendiri.</p><div class=btns><button class=pri data-r=promo-on style="flex:2">Aktifkan pengingat</button><button data-r=promo-no>Nanti</button></div></div>`;
}
function vrCard(){
 const c=vrCfg(),perm=vrSup()?Notification.permission:'unsupported',sn=vrSnapNow();
 let st=[];
 if(c.on){
  st.push(perm=='granted'?'✅ Notifikasi sistem diizinkan':perm=='denied'?'⛔ Notifikasi diblokir — izinkan lewat pengaturan situs/aplikasi di browser, lalu aktifkan lagi':perm=='default'?'⏳ Izin notifikasi belum diberikan':(vrIOS()&&!vrStand()?'ℹ️ Di iPhone/iPad: pasang dulu ke Layar Utama, lalu buka dari ikonnya':'ℹ️ Browser ini tidak mendukung notifikasi — pengingat tampil sebagai banner saat aplikasi terbuka'));
  st.push(vrPS=='on'?'✅ Pengingat latar belakang aktif (aplikasi tak perlu dibuka)':vrPS=='denied'||(vrPS==''&&vrSup()&&'periodicSync' in ServiceWorkerRegistration.prototype)?'ℹ️ Pengingat latar belakang menunggu: pasang aplikasi ke layar utama & pakai rutin':'ℹ️ Pengingat latar belakang tidak didukung di perangkat ini — notifikasi muncul saat aplikasi terbuka/di-minimize. Lihat tutorial untuk opsi ntfy.');
 }
 const d=VR.due(sn,Date.now());
 return`<div class=card><b>🔔 Pengingat hafalan</b><p class=gsub style="margin:4px 0 8px">Hari ini: ${d.a} kartu ulasan + ${d.b} kata baru menunggu.</p>`+
 `<button class="${c.on?'':'pri'}" style="width:100%" data-r=toggle>${c.on?'Matikan pengingat':'Aktifkan pengingat'}</button>`+
 (c.on?`<div class=gsec>Jam pengingat</div><div class=vrt>${[0,1,2].map(i=>`<input type=time data-r=t${i} value="${esc(c.times[i]||'')}" aria-label="Jam pengingat ${i+1}">`).join('')}</div><small>Kosongkan kolom untuk menonaktifkan jam itu.</small>`+
 `<label class=fcl><span><input type=checkbox data-r=due${c.due?' checked':''}> Hanya ingatkan jika masih ada kartu yang perlu dikerjakan</span></label>`+
 `<div class=btns><button data-r=test>Kirim notifikasi uji</button></div><ul class=vrs>${st.map(x=>`<li>${x}</li>`).join('')}</ul>`:'')+`</div>`;
}
function vrAppCard(){
 const sa=vrStand();
 return`<div class=card><b>📲 Aplikasi Vortaro</b><p class=gsub style="margin:4px 0 8px">${sa?'Terpasang sebagai aplikasi ✅ — berjalan offline.':'Pasang ke layar utama agar terbuka seperti aplikasi biasa dan bisa dipakai offline.'}</p>`+
 (!sa&&vrInst?`<button class=pri data-r=install style="width:100%;margin-bottom:8px">Pasang Vortaro</button>`:'')+
 (!sa&&!vrInst?`<small>${vrIOS()?'iPhone/iPad (Safari): ketuk Bagikan → “Tambah ke Layar Utama”.':'Chrome Android: menu ⋮ → “Instal aplikasi” / “Tambahkan ke layar utama”.'}</small>`:'')+
 `<div class=btns><button data-r=upd>Cek pembaruan aplikasi</button></div><small style="display:block;margin-top:6px">Vortaro 3.1 · data tersimpan di perangkat ini. Cadangkan progres secara berkala.</small></div>`;
}

/* ---------- penangan event (pakai atribut data-r agar tidak bentrok dengan app.js) ---------- */
document.addEventListener('click',async e=>{
 const b=e.target.closest&&e.target.closest('[data-r]');if(!b||b.tagName=='INPUT')return;
 const a=b.dataset.r;
 if(a=='toggle'){if(vrCfg().on){vrSet({on:0});await vrSync();render()}else await vrEnable()}
 else if(a=='promo-on')await vrEnable();
 else if(a=='promo-no'){S.o.remNo=1;save();render()}
 else if(a=='test')await vrTest();
 else if(a=='go'){vrMsg=null;tab='fc';render();scrollTo(0,0)}
 else if(a=='bx'){vrMsg=null;render()}
 else if(a=='install'&&vrInst){vrInst.prompt();try{await vrInst.userChoice}catch(_){}vrInst=null;render()}
 else if(a=='upd'){try{const r=await navigator.serviceWorker.getRegistration();if(r)await r.update()}catch(_){}location.reload()}
});
document.addEventListener('change',async e=>{
 const a=e.target.dataset&&e.target.dataset.r;if(!a)return;
 const c=vrCfg();
 if(/^t[0-2]$/.test(a)){const t=c.times.slice();t[+a[1]]=e.target.value;vrSet({times:t});await vrSync();render()}
 else if(a=='due'){vrSet({due:e.target.checked?1:0});await vrSync()}
});
