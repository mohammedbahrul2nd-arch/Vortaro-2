/* Vortaro v7.73 — Tombol back Android + peringatan Lock-in. MANDIRI (hanya memakai API publik app.js lewat klik/penekanan tombol).
   Tombol back tidak pernah menutup aplikasi: ia menutup dialog → mundur satu langkah di layar yang sedang dibuka → kembali ke Kartu →
   di Kartu (akar) hanya menampilkan petunjuk. Bila Lock-in berjalan, di akar muncul peringatan. */
(function(){
var armed=false,away=0,lastRoot=0;
function lkOn(){try{return !!(S.o&&S.o.lkEnd&&S.o.lkEnd>Date.now())}catch(_){return false}}
function msg(t){try{toast(t)}catch(_){}}
function dlgOpen(){return !!document.querySelector('#edm,#lbm,#lpm,#aim')}
function closeDlg(){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))}
function clk(sel){var b=document.querySelector('#v '+sel);if(b){b.click();return true}return false}
function lockDlg(rem){
 var o=document.getElementById('vrbk');if(o)o.remove();
 o=document.createElement('div');o.id='vrbk';o.setAttribute('role','alertdialog');o.setAttribute('aria-modal','true');
 o.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px';
 o.innerHTML='<div class=card style="max-width:360px;width:100%;margin:0"><b>🔒 Lock-in masih berjalan</b><p style="margin:8px 0">Sisa <b>'+rem+'</b>. Keluar dari Vortaro sekarang akan memutus waktu fokusmu.</p><div class=btns><button class=pri data-vbk=stay style="flex:1">Lanjut belajar</button><button data-vbk=stop style="flex:1">Hentikan Lock-in</button></div></div>';
 document.body.appendChild(o)}
function onBack(){
 if(document.getElementById('vrbk')){document.getElementById('vrbk').remove();return}
 var ob=document.querySelector('.vrob');if(ob){var a=ob.querySelector('a');if(a)a.click();else ob.remove();return}
 if(dlgOpen()){closeDlg();return}
 try{if(window.vrDaftar&&vrDaftar.back())return}catch(_){}
 if(clk('[data-a=ggxsrx]')||clk('[data-a=ggxhome]')||clk('[data-a=glist]')||clk('[data-a=gtolv]')||clk('[data-a=gback]')||clk('[data-a=kpi]'))return;
 var cur=document.querySelector('nav [aria-current=page]');
 if(cur&&cur.getAttribute('data-v')!=='fc'){var k=document.querySelector('nav [data-a=tab][data-v=fc]');if(k){k.click();return}}
 /* akar (Kartu) */
 if(lkOn()){var m=0;try{m=lkRem()}catch(_){}lockDlg(typeof lkTx==='function'?lkTx(m):m+' menit');return}
 var n=Date.now();msg('Gunakan tombol Beranda untuk keluar dari Vortaro');lastRoot=n}
/* sentinel riwayat: dipasang setelah sentuhan pertama (Chrome mengabaikan entri riwayat tanpa interaksi pengguna) */
function arm(){if(armed)return;armed=true;try{history.pushState({vr:'top'},'')}catch(_){}}
try{history.replaceState({vr:'base'},'')}catch(_){}
['pointerdown','touchstart','keydown','click'].forEach(function(t){addEventListener(t,arm,{capture:true,passive:true})});
addEventListener('popstate',function(){if(!armed)return;try{history.pushState({vr:'top'},'')}catch(_){}onBack()});
document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-vbk]');if(!b)return;
 var o=document.getElementById('vrbk');if(o)o.remove();
 if(b.dataset.vbk==='stop'){try{lkFinish(1);save();render()}catch(_){}}});
/* peringatan saat halaman akan ditutup/dimuat ulang selagi Lock-in berjalan */
addEventListener('beforeunload',function(e){if(!lkOn())return;e.preventDefault();e.returnValue='Lock-in masih berjalan.';return e.returnValue});
/* meninggalkan aplikasi (ganti aplikasi/layar mati) saat Lock-in berjalan: beri tahu saat kembali */
document.addEventListener('visibilitychange',function(){
 if(document.hidden){away=lkOn()?Date.now():0;return}
 if(away&&lkOn()){var s=Math.round((Date.now()-away)/1000);if(s>=20){var t=s>=60?Math.round(s/60)+' menit':s+' detik';msg('⚠ Kamu meninggalkan Vortaro '+t+' saat Lock-in berjalan')}}away=0});
try{window.vrBack={onBack:onBack,lkOn:lkOn}}catch(_){}
})();
