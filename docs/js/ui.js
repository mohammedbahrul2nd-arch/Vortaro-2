/* Vortaro UI v8: ripple + haptic ringan (tanpa variabel global) */
(function(){document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||b.disabled)return;
var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement('span');s.className='rp';
s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
b.appendChild(s);setTimeout(function(){s.remove()},600);
if(b.closest('nav')&&navigator.vibrate)try{navigator.vibrate(8)}catch(_){}},{passive:true})})();
/* Tahap 3: gestur geser kartu + onboarding sekali tampil */
(function(){var sx,sy,card=null,dx=0,dy=0;
var L=null;function lbl(t,c){if(!t){if(L)L.classList.remove('on');return}if(!L){L=document.createElement('div');L.className='vrsw';document.body.appendChild(L)}L.textContent=t;L.style.background=c;L.classList.add('on')}
function btn(sel){return document.querySelector(sel)}
function dir(x,y){return Math.abs(y)>Math.abs(x)?(y<0?'up':'down'):(x>0?'right':'left')}
var MAP={up:4,down:1,right:3,left:2},COL={up:'#2563eb',down:'#dc2626',right:'#16a34a',left:'#d97706'},ARW={up:'\u2191',down:'\u2193',right:'\u2192',left:'\u2190'};
document.addEventListener('pointerdown',function(e){var c=e.target.closest&&e.target.closest('.fcard');if(!c||e.target.closest('button,a,input'))return;card=c;sx=e.clientX;sy=e.clientY;dx=dy=0},{passive:true});
document.addEventListener('pointermove',function(e){if(!card)return;dx=e.clientX-sx;dy=e.clientY-sy;if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
var rev=!card.hasAttribute('data-a'),far=Math.max(Math.abs(dx),Math.abs(dy))>40;card.style.transition='none';card.style.transform='translate('+dx*.6+'px,'+dy*.6+'px) rotate('+dx/30+'deg)';
if(rev&&far){var d=dir(dx,dy),b=btn('.fb'+MAP[d]),sm=b&&b.querySelector('small');card.style.boxShadow='0 0 0 3px '+COL[d];lbl(ARW[d]+' '+(b&&b.lastChild?b.lastChild.textContent.trim():'')+(sm?' \u00b7 '+sm.textContent:''),COL[d])}
else{card.style.boxShadow=(!rev&&dy<-40)?'0 0 0 3px '+COL.up:'';lbl()}},{passive:true});
function end(){if(!card)return;var c=card,rev=!c.hasAttribute('data-a');card=null;c.style.transition='transform .25s,box-shadow .25s';c.style.transform='';c.style.boxShadow='';lbl();
var ax=Math.abs(dx),ay=Math.abs(dy);if(ax<70&&ay<70)return;
if(!rev){if(dy<-70&&ay>ax){var s=btn('[data-a=fcshow]');s&&s.click()}return}
var bb=btn('.fb'+MAP[dir(dx,dy)]);if(bb){if(navigator.vibrate)try{navigator.vibrate(12)}catch(_){}bb.click()}}
document.addEventListener('pointerup',end,{passive:true});document.addEventListener('pointercancel',end,{passive:true});
/* onboarding */
try{if(localStorage.getItem('vr_onb')||!document.body)return}catch(_){return}
var P=[['📚','Belajar tiap hari','Kartu muncul tepat saat hampir lupa, jadi hafalan awet.'],['👆','Geser untuk menjawab','Ketuk kartu atau geser ke atas untuk membalik. Kiri = Lagi, kanan = Baik, atas = Mudah.'],['🔔','Pasang seperti aplikasi','Tambahkan ke layar utama agar terbuka layar penuh, bahkan tanpa internet.']],i=0,o=document.createElement('div');o.className='vrob';
function draw(){var p=P[i];o.innerHTML='<div class=vrobc><div class=vrobi>'+p[0]+'</div><h2>'+p[1]+'</h2><p>'+p[2]+'</p><div class=vrobd>'+P.map(function(_,j){return'<i'+(j==i?' class=on':'')+'></i>'}).join('')+'</div><button class=pri>'+(i<P.length-1?'Lanjut':'Mulai belajar')+'</button><a>Lewati</a></div>'}
function close(){try{localStorage.setItem('vr_onb','1')}catch(_){}o.classList.add('out');setTimeout(function(){o.remove()},300)}
o.addEventListener('click',function(e){if(e.target.closest('a'))return close();if(e.target.closest('button')){i<P.length-1?(i++,draw()):close()}});
draw();addEventListener('load',function(){setTimeout(function(){document.body.appendChild(o)},400)})})();
/* Tahap B: layar Kartu — yang utama (belajar) tampil dulu; Lock-in + Pengingat dilipat ("Alat belajar"), status diingat */
(function(){var KEY='vr_ui_fold_tools',busy=false;
function get(){try{if(S.o.u_fold!=null)return !!S.o.u_fold;return localStorage.getItem(KEY)==='1'}catch(_){return false}}
function put(o){try{var n=o?1:0;if(S.o.u_fold===n)return;S.o.u_fold=n;save()}catch(_){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function stepper(btns,val,unit,label){var d=document.createElement('div');d.className='vrstep';
d.innerHTML='<button class=mini data-a='+btns[0]+' data-v='+btns[1]+' aria-label="Kurangi '+label+'">\u2212</button><span><b>'+esc(val)+'</b> '+label+'</span><button class=mini data-a='+btns[0]+' data-v='+(-btns[1])+' aria-label="Tambah '+label+'">+</button>';return d}
function tidy(){if(busy)return;var v=document.getElementById('v');if(!v)return;var h=v.querySelector(':scope>h1');
if(!h||h.textContent.trim()!=='Kartu'||v.querySelector(':scope>.vrfold'))return;
var lk=v.querySelector(':scope>#lkbar');if(!lk)return;busy=true;
try{var running=!!lk.querySelector('#lkt'),kids=[].slice.call(v.children),promo=null,i;
for(i=0;i<kids.length;i++){var el=kids[i];if(el.classList.contains('card')&&el.querySelector('[data-r=promo-on]')){promo=el;break}}
var done='';
if(!running){var bs=lk.querySelectorAll('b'),hv=bs[1]?bs[1].textContent:'1',mv=bs[2]?bs[2].textContent:'0',sm=lk.querySelector('small');done=sm?sm.textContent:'';
lk.removeAttribute('style');lk.className='card vrlk';lk.innerHTML='<div class=vrlkt><span>\uD83D\uDD12 <b>Lock-in</b></span><small>Waktu fokus belajar tanpa gangguan</small></div>';
var row=document.createElement('div');row.className='vrlkr';row.appendChild(stepper(['fclkh',-1],hv,'jam','jam'));row.appendChild(stepper(['fclkm',-5],mv,'menit','menit'));lk.appendChild(row);
var go=document.createElement('button');go.className='pri';go.setAttribute('data-a','fclkgo');go.textContent='Mulai Lock-in';lk.appendChild(go);
if(done){var p=document.createElement('small');p.className='vrlkd';p.textContent=done;lk.appendChild(p)}
var f=document.createElement('details');f.className='vrfold';if(get())f.open=true;
f.innerHTML='<summary><span>\uD83E\uDDF0 Alat belajar</span><em>'+(done?esc(done):'Lock-in'+(promo?' \u00b7 Pengingat':''))+'</em>'+(promo?'<i class=vrdot aria-label="Ada yang perlu dilihat"></i>':'')+'</summary>';
var body=document.createElement('div');body.className='vrfb';if(promo)body.appendChild(promo);body.appendChild(lk);f.appendChild(body);
f.addEventListener('toggle',function(){put(f.open)});v.appendChild(f)}
else if(promo){/* Lock-in berjalan: bilah tetap di atas; hanya pengingat dilipat */
var f2=document.createElement('details');f2.className='vrfold';if(get())f2.open=true;f2.innerHTML='<summary><span>\uD83E\uDDF0 Alat belajar</span><em>Pengingat</em><i class=vrdot></i></summary>';
var b2=document.createElement('div');b2.className='vrfb';b2.appendChild(promo);f2.appendChild(b2);f2.addEventListener('toggle',function(){put(f2.open)});v.appendChild(f2)}
}finally{busy=false}}
function boot(){var v=document.getElementById('v');if(!v){return setTimeout(boot,200)}new MutationObserver(function(){tidy()}).observe(v,{childList:true});tidy()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
/* Tahap C: Tampilan & Personalisasi (semua lokal; disimpan di S.o.u_* sehingga ikut cadangan/ekspor) */
(function(){var KEY='vr_ui_fold_tools';
function O(){try{return S.o}catch(_){return null}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function applyU(){var o=O(),r=document.documentElement;if(!o)return;
r.setAttribute('data-vr-dn',o.u_dn==='p'?'p':'n');r.setAttribute('data-vr-md',o.u_md==='s'?'s':'l');
r.setAttribute('data-vr-ab',o.u_ab?'on':'off');r.setAttribute('data-vr-an',o.u_an===0?'off':'on')}
function sal(){var h=new Date().getHours();return h<11?'Selamat pagi':h<15?'Selamat siang':h<18?'Selamat sore':'Selamat malam'}
function fmtHr(t){return String(t).replace(':','.')}
function greet(v,h){var o=O();if(!o||v.querySelector(':scope>.vrgr'))return;var nm=(o.u_nm||'').trim(),hr=o.u_hr||'';if(!nm&&!hr)return;
var p=document.createElement('p');p.className='vrgr';p.innerHTML=(nm?'<b>'+sal()+', '+esc(nm)+' \uD83D\uDC4B</b>':'')+(hr?'<small>Jam belajar favoritmu: '+esc(fmtHr(hr))+'</small>':'');h.insertAdjacentElement('afterend',p)}
function simple(v){var o=O();if(!o||o.u_md!=='s')return;
var fct=v.querySelector(':scope>.fct');if(fct&&!v.querySelector(':scope>.vrmore')){var d=document.createElement('details');d.className='vrmore';d.innerHTML='<summary>Lainnya</summary>';fct.parentNode.insertBefore(d,fct);d.appendChild(fct)}
var ff=v.querySelector(':scope>details[data-d=ff]');if(!ff)return;var fold=v.querySelector(':scope>.vrfold');
if(!fold){fold=document.createElement('details');fold.className='vrfold';try{if(S.o.u_fold!=null?S.o.u_fold:localStorage.getItem(KEY)==='1')fold.open=true}catch(_){}
fold.innerHTML='<summary><span>\uD83E\uDDF0 Alat belajar</span><em>Filter</em></summary><div class=vrfb></div>';
fold.addEventListener('toggle',function(){try{var n=fold.open?1:0;if(S.o.u_fold!==n){S.o.u_fold=n;save()}}catch(_){}});v.appendChild(fold)}
else{var em=fold.querySelector('summary em');if(em&&!/Filter/.test(em.textContent)&&!/selesai|dihentikan/.test(em.textContent))em.textContent+=' \u00b7 Filter'}
fold.querySelector('.vrfb').insertBefore(ff,fold.querySelector('.vrfb').firstChild)}
function seg(k,cur,op){return'<div class=seg2>'+op.map(function(x){return'<button type=button class="'+(cur==x[0]?'on':'')+'" data-vp="'+k+'" data-v="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'}
function ck(k,on,t){return'<label class=fcl><span><input type=checkbox data-vpc="'+k+'"'+(on?' checked':'')+'> '+t+'</span></label>'}
function card(v,h){var o=O();if(!o||v.querySelector('.vrp'))return;var c=document.createElement('div');c.className='card vrp';
c.innerHTML='<b>\u2728 Tampilan &amp; Personalisasi</b><small class=gsub>Semua pilihan tersimpan di perangkat ini saja dan ikut cadangan. Tidak ada fitur yang dihapus.</small>'+
'<small class=lbl>Nama panggilan</small><input type=text maxlength=20 data-vpi=u_nm value="'+esc(o.u_nm||'')+'" placeholder="Mis. Rina" aria-label="Nama panggilan" autocomplete=off>'+
'<small class=lbl>Mode tampilan</small>'+seg('u_md',o.u_md==='s'?'s':'l',[['s','Sederhana'],['l','Lengkap']])+'<small class=gsub>Sederhana: hanya yang utama di depan; Filter, tombol tambahan, dan Alat belajar dilipat ("Lainnya"). Semua tetap bisa dibuka.</small>'+
'<small class=lbl>Kepadatan</small>'+seg('u_dn',o.u_dn==='p'?'p':'n',[['n','Nyaman'],['p','Padat']])+
'<small class=lbl>Target kartu baru per hari</small><div class=vrtg><button type=button class=mini data-vp=nl data-v=-5 aria-label="Kurangi target">\u2212</button><b>'+(o.nl|0)+'</b><button type=button class=mini data-vp=nl data-v=5 aria-label="Tambah target">+</button></div>'+
'<small class=lbl>Jam belajar favorit</small><input type=time data-vpi=u_hr value="'+esc(o.u_hr||'')+'" aria-label="Jam belajar favorit">'+
ck('u_ab',!!o.u_ab,'Tampilkan tombol jawaban (selain usap)')+
'<small class=lbl>Umpan balik</small>'+ck('hap',!!o.hap,'Getar saat menilai kartu')+ck('tts',!!o.tts,'Tombol suara \uD83D\uDD0A di samping kata')+ck('ttsa',!!o.ttsa,'Ucapkan otomatis saat jawaban dibuka')+ck('u_an',o.u_an!==0,'Animasi')+
'<small class=gsub>Warna aksen, tema, dan ukuran huruf ada di kartu "Tampilan &amp; kenyamanan" di bawah.</small><div class=btns><button type=button data-vp=reset>Kembalikan personalisasi</button></div>';
h.insertAdjacentElement('afterend',c)}
function tidyC(){var v=document.getElementById('v');if(!v)return;applyU();var h=v.querySelector(':scope>h1');if(!h)return;var t=h.textContent.trim();
if(t==='Kartu'){greet(v,h);simple(v)}else if(t==='Pengaturan')card(v,h)}
function redo(){var y=scrollY;try{render()}catch(_){}scrollTo(0,y)}
function put(k,val){var o=O();if(!o)return;o[k]=val;try{save()}catch(_){}applyU();if(k==='nl'){try{fcQV++}catch(_){}}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vp]');if(!b)return;var k=b.getAttribute('data-vp'),o=O();if(!o)return;
if(k==='reset'){['u_nm','u_hr','u_md','u_dn','u_ab','u_an'].forEach(function(x){delete o[x]});try{save()}catch(_){}applyU();return redo()}
if(k==='nl'){return put('nl',Math.max(1,Math.min(500,(o.nl|0)+(+b.getAttribute('data-v')))))||redo()}
put(k,b.getAttribute('data-v'));redo()});
document.addEventListener('change',function(e){var t=e.target,o=O();if(!o||!t.dataset)return;
if(t.dataset.vpc){var k=t.dataset.vpc;put(k,k==='u_an'?(t.checked?1:0):(t.checked?1:0));redo()}
else if(t.dataset.vpi){put(t.dataset.vpi,t.value.trim());redo()}});
function boot(){var v=document.getElementById('v');if(!v||!O())return setTimeout(boot,200);new MutationObserver(tidyC).observe(v,{childList:true});tidyC()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
/* Tahap C2: pemakaian lokal (S.o.u_use) -> jalan pintas "paling sering dipakai" di layar Kartu */
(function(){function O(){try{return S.o}catch(_){return null}}
function U(){var o=O();if(!o)return null;var u=o.u_use;if(!u||typeof u!=='object'){u=o.u_use={t:{},l:{}}}if(!u.t)u.t={};if(!u.l)u.l={};return u}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-a]');if(!b)return;var a=b.getAttribute('data-a'),u=U();if(!u)return;
if(a==='tab'){var t=b.getAttribute('data-v');if(t){u.t[t]=(u.t[t]|0)+1}}
else if(a==='fcans'){try{var g=GK[fcCur],l=g?g[1]:lang(fcCur);if(l){u.l[l]=(u.l[l]|0)+1}}catch(_){}}},true);
function shortcuts(v,h){var u=U();if(!u||v.querySelector(':scope>.vrsc'))return;
var top=Object.keys(u.t).filter(function(k){return k!=='fc'&&k!=='set'&&u.t[k]>=2}).sort(function(a,b){return u.t[b]-u.t[a]}).slice(0,2);if(!top.length)return;
var nav=document.querySelector('nav'),d=document.createElement('div');d.className='vrsc';d.setAttribute('aria-label','Jalan pintas');
top.forEach(function(k){var nb=nav&&nav.querySelector('[data-a=tab][data-v='+k+'] span');if(!nb)return;var x=document.createElement('button');x.type='button';x.className='vrscb';x.setAttribute('data-vsc',k);x.textContent=nb.textContent;d.appendChild(x)});
if(!d.children.length)return;var after=v.querySelector(':scope>.vrgr')||h;after.insertAdjacentElement('afterend',d)}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vsc]');if(!b)return;var n=document.querySelector('nav [data-a=tab][data-v='+b.getAttribute('data-vsc')+']');if(n)n.click()});
function run(){var v=document.getElementById('v');if(!v)return;var h=v.querySelector(':scope>h1');if(h&&h.textContent.trim()==='Kartu')shortcuts(v,h)}
function boot(){var v=document.getElementById('v');if(!v||!O())return setTimeout(boot,200);new MutationObserver(run).observe(v,{childList:true});run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
/* Tahap D1: layar Pengaturan — kelompok bisa dilipat (status diingat di S.o.u_sg), kolom cari, ikon */
(function(){var IC=[['Pengaturan flashcard','\u2699\uFE0F'],['Vortaro v','\uD83C\uDD95'],['Pengingat','\uD83D\uDD14'],['Aplikasi Vortaro','\uD83D\uDCF2'],['Tampilan & kenyamanan','\uD83C\uDFA8'],['Progres per bahasa','\uD83C\uDF10'],['Edit keterangan','\u270E'],['Cadangan','\uD83D\uDCBE'],['Penyimpanan','\uD83D\uDDC4\uFE0F']];
function O(){try{return S.o}catch(_){return null}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function icon(t){for(var i=0;i<IC.length;i++)if(t.indexOf(IC[i][0])>=0)return IC[i][1];return'\u25AB\uFE0F'}
function label(t){t=t.replace(/^[^A-Za-z]+/,'');if(t.indexOf('Vortaro v')===0)return'Versi & pembaruan';if(t.indexOf('Penyimpanan')===0)return'Penyimpanan';return t.replace(/\s+/g,' ').slice(0,40)}
function key(t){return label(t).toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18)}
function st(){var o=O();if(!o)return{};if(!o.u_sg||typeof o.u_sg!=='object')o.u_sg={};return o.u_sg}
function wrap(v){var kids=[].slice.call(v.children);
kids.forEach(function(el){if(el.matches('h1,.vrsq,.vrg,p,.warn,.vrb'))return;var isDet=el.tagName==='DETAILS',t;
if(el.matches('.vrp'))t='\u2728 Tampilan & Personalisasi';else if(isDet){var sm=el.querySelector(':scope>summary');t=sm?sm.textContent:'Pengaturan'}else{var b=el.querySelector('b');if(!b)return;t=b.textContent}
var k=el.matches('.vrp')?'personal':(isDet&&el.dataset.d?el.dataset.d:key(t)),lab=el.matches('.vrp')?'Tampilan & Personalisasi':label(t);
if(isDet){el.classList.add('vrg');el.dataset.vk=k;var sm2=el.querySelector(':scope>summary');if(sm2&&!sm2.querySelector('.vrgi')){sm2.innerHTML='<span class=vrgi>'+icon(t)+'</span><span class=vrgl>'+esc(lab)+'</span>'+(sm2.querySelector('.cnt')?sm2.querySelector('.cnt').outerHTML:'')}var s0=st();el.open=s0[k]!=null?!!s0[k]:false;el.addEventListener('toggle',function(){if(el.dataset.sq)return;var s3=st(),n3=el.open?1:0;if(s3[k]!==n3){s3[k]=n3;try{save()}catch(_){}}});return}
var d=document.createElement('details');d.className='vrg';d.dataset.vk=k;var s=st(),op=s[k]!=null?!!s[k]:(k==='personal');if(op)d.open=true;
d.innerHTML='<summary><span class=vrgi>'+(el.matches('.vrp')?'\u2728':icon(t))+'</span><span class=vrgl>'+esc(lab)+'</span></summary>';
el.parentNode.insertBefore(d,el);var body=document.createElement('div');body.className='vrgb';body.appendChild(el);d.appendChild(body);
var fe=el.firstElementChild;if(fe&&fe.tagName==='B')el.classList.add('vrdup');
d.addEventListener('toggle',function(){if(d.dataset.sq)return;var s2=st(),n=d.open?1:0;if(s2[k]!==n){s2[k]=n;try{save()}catch(_){}}})})}
function search(v){var h=v.querySelector(':scope>h1');if(!h||v.querySelector(':scope>.vrsq'))return;
var w=document.createElement('div');w.className='vrsq';w.innerHTML='<input type=search data-vsq placeholder="Cari pengaturan\u2026" aria-label="Cari pengaturan" autocomplete=off><small class=vrsn hidden>Tidak ada pengaturan yang cocok.</small>';h.insertAdjacentElement('afterend',w)}
document.addEventListener('input',function(e){var t=e.target;if(!t.hasAttribute||!t.hasAttribute('data-vsq'))return;var q=t.value.trim().toLowerCase(),v=document.getElementById('v'),gs=v.querySelectorAll(':scope>.vrg'),hit=0;
gs.forEach(function(d){if(!q){if(d.dataset.sq){d.open=d.dataset.po==='1';delete d.dataset.sq}d.hidden=false;hit++;return}
if(!d.dataset.sq){d.dataset.po=d.open?'1':'0';d.dataset.sq='1'}var m=d.textContent.toLowerCase().indexOf(q)>=0;d.hidden=!m;if(m){d.open=true;hit++}});
var n=v.querySelector('.vrsn');if(n)n.hidden=!q||hit>0});
function run(){var v=document.getElementById('v');if(!v||!O())return;var h=v.querySelector(':scope>h1');if(!h||h.textContent.trim()!=='Pengaturan')return;if(v.querySelector(':scope>.vrg'))return;search(v);wrap(v)}
function boot(){var v=document.getElementById('v');if(!v||!O())return setTimeout(boot,200);new MutationObserver(run).observe(v,{childList:true});run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
/* Tahap D2: layar Statistik — heatmap berlabel (hari + bulan) dengan keterangan saat kosong, tombol 2x2 diberi penjelasan */
(function(){var DESC={leech:'Kartu yang terus salah',eta:'Kapan semua kartu tuntas',fcast:'Beban ulasan ke depan',gmap:'Peta topik grammar'},
DAYS=['','Sen','','Rab','','Jum',''];
function mon(t){var m=/,\s*\d+\s+([A-Za-z]+)/.exec(t||'');return m?m[1]:''}
function heat(v){var h=v.querySelector('.heat');if(!h||h.parentNode.classList.contains('vrhw'))return;
var ch=[].slice.call(h.children),cols=Math.ceil(ch.length/7),ms=document.createElement('div');ms.className='vrhm';var prev='',i;
for(i=0;i<cols;i++){var c=ch[i*7],m=c&&c.title?mon(c.title):'',s=document.createElement('span');if(m&&m!==prev){s.textContent=m;prev=m}ms.appendChild(s)}
var dl=document.createElement('div');dl.className='vrhd';dl.setAttribute('aria-hidden','true');DAYS.forEach(function(d){var s=document.createElement('span');s.textContent=d;dl.appendChild(s)});
var w=document.createElement('div');w.className='vrhw';h.parentNode.insertBefore(w,h);
var sp=document.createElement('span');w.appendChild(sp);w.appendChild(ms);w.appendChild(dl);w.appendChild(h);
var on=h.querySelectorAll('button:not(.hz0)').length,p=document.createElement('p');p.className='vrhh'+(on?'':' vrhe');
p.textContent=on?'Ketuk sebuah kotak untuk melihat rincian hari itu.':'Belum ada aktivitas. Selesaikan satu ulasan kartu, lalu kotak hari ini mulai berwarna.';
w.insertAdjacentElement('afterend',p)}
function feat(v){var g=v.querySelector('.stf');if(!g||g.dataset.vd)return;g.dataset.vd='1';
if(!g.previousElementSibling||!g.previousElementSibling.classList.contains('vrcap')){var c=document.createElement('p');c.className='vrcap';c.textContent='Alat analisis \u00b7 ketuk untuk membuka';g.insertAdjacentElement('beforebegin',c)}
[].forEach.call(g.querySelectorAll('.stfb'),function(b){var k=b.getAttribute('data-v'),t=b.querySelector('b'),ic=b.querySelector(':scope>span');if(!t||!DESC[k]||b.querySelector('.vrstt'))return;
var w=document.createElement('span');w.className='vrstt';var s=document.createElement('small');s.textContent=DESC[k];t.parentNode.insertBefore(w,t);w.appendChild(t);w.appendChild(s);if(ic)ic.classList.add('vrsti')})}
function SG(){try{var o=S.o;if(!o.u_sg||typeof o.u_sg!=='object')o.u_sg={};return o.u_sg}catch(_){return {}}}
function fold(v,els,key,lab,ic,dup){if(!els.length)return;var s=SG(),d=document.createElement('details');d.className='vrg';d.dataset.vk=key;if(s[key])d.open=true;
var sm=document.createElement('summary');sm.innerHTML='<span class=vrgi>'+ic+'</span><span class=vrgl></span>';sm.querySelector('.vrgl').textContent=lab;d.appendChild(sm);
var b=document.createElement('div');b.className='vrgb';els[0].parentNode.insertBefore(d,els[0]);els.forEach(function(e){b.appendChild(e);if(dup)e.classList.add('vrdup')});d.appendChild(b);
d.addEventListener('toggle',function(){var s2=SG(),n=d.open?1:0;if(s2[key]!==n){s2[key]=n;try{save()}catch(_){}}})}
function bt(e){var b=e.querySelector(':scope>b');return b?b.textContent.replace(/\s+/g,' ').trim():''}
function group(v){var cs=[].slice.call(v.querySelectorAll(':scope>.card')),kv=[],pos=[],gr=[];
cs.forEach(function(c){var t=bt(c);if(t.indexOf('Kosakata per bahasa')===0)kv.push(c);else if(t.indexOf('Kata ')===0&&/kartu/.test(c.textContent))pos.push(c);else if(t.indexOf('Grammar')===0)gr.push(c)});
if(kv.length)fold(v,kv,'st_lang','Kosakata per bahasa','\uD83C\uDF10',1);
if(pos.length)fold(v,pos,'st_pos','Kosakata per jenis kata','\uD83D\uDDC2\uFE0F',0);
if(gr.length)fold(v,gr,'st_gram','Ringkasan grammar','\uD83D\uDCD6',0)}
function run(){var v=document.getElementById('v');if(!v)return;var h=v.querySelector(':scope>h1');if(!h||h.textContent.trim()!=='Statistik')return;heat(v);feat(v);group(v)}
function boot(){var v=document.getElementById('v');if(!v)return setTimeout(boot,200);new MutationObserver(run).observe(v,{childList:true});run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
/* Tahap D1b: kartu "Versi & pembaruan" — tampilkan juga versi lapisan tampilan (dibaca dari sw.js), agar tidak tampak basi */
(function(){var uv=null,asked=false;
function ask(cb){if(uv!==null)return cb();if(asked)return;asked=true;try{fetch('sw.js').then(function(r){return r.text()}).then(function(t){var m=/VERSION\s*=\s*'([^']+)'/.exec(t);uv=m?m[1]:'';cb()}).catch(function(){uv=''})}catch(_){uv=''}}
function more(){var v=document.getElementById('v');if(!v)return;[].forEach.call(v.querySelectorAll('.hd b'),function(b){if(b.textContent.indexOf('Vortaro v')!==0)return;var c=b.closest('.card');if(!c||c.querySelector('.vrmore'))return;var ul=c.querySelector('ul');if(!ul)return;var li=[].slice.call(ul.children);if(li.length<=3)return;
li.slice(3).forEach(function(x){x.hidden=true});var bt=document.createElement('button');bt.type='button';bt.className='vrmore';bt.textContent='Lihat semua ('+li.length+' catatan)';
bt.addEventListener('click',function(e){e.stopPropagation();var open=bt.dataset.o==='1';li.slice(3).forEach(function(x){x.hidden=open});bt.dataset.o=open?'0':'1';bt.textContent=open?'Lihat semua ('+li.length+' catatan)':'Ringkas'});ul.insertAdjacentElement('afterend',bt)})}
function put(){more();var v=document.getElementById('v');if(!v||!uv)return;var h=v.querySelector(':scope>h1');if(!h||h.textContent.trim()!=='Pengaturan')return;
[].forEach.call(v.querySelectorAll('.hd b'),function(b){if(b.textContent.indexOf('Vortaro v')!==0)return;var hd=b.closest('.hd');if(!hd||hd.parentNode.querySelector('.vrver'))return;
var s=document.createElement('small');s.className='vrver';s.textContent='Isi & fitur v'+b.textContent.replace('Vortaro v','')+' \u00b7 Tampilan v'+uv;hd.insertAdjacentElement('afterend',s)})}
function run(){var v=document.getElementById('v');if(!v)return;var h=v.querySelector(':scope>h1');if(!h||h.textContent.trim()!=='Pengaturan')return;ask(put);put()}
function boot(){var v=document.getElementById('v');if(!v)return setTimeout(boot,200);new MutationObserver(run).observe(v,{childList:true});run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
/* Tahap D3: layar Daftar — header satu baris, chip status ringkas (kode bahasa + penanda), legenda, keadaan kosong */
(function(){var G={'Belum':'\u25CB','Sedang':'\u25D0','Selesai':'\u25CF'};
function chips(v){[].forEach.call(v.querySelectorAll('.pls .stpl:not([data-vd])'),function(b){b.setAttribute('data-vd','1');var m=/^(\S+)\s*\u00b7\s*(\S+)/.exec(b.textContent.trim());if(!m)return;
b.classList.add('vrcp');if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',b.title||b.textContent.trim());b.innerHTML='<b>'+m[1]+'</b><i class=vrch aria-hidden=true>'+(G[m[2]]||'')+'</i>'})}
function head(v){var s=v.querySelector(':scope>.sbar');if(!s||s.classList.contains('vrdh'))return;s.classList.add('vrdh');var i=s.querySelector('input[type=search]');if(i){i.placeholder='Cari kata, arti, atau bacaan';i.setAttribute('aria-label','Cari kartu')}
var sel=s.querySelector('select');if(sel){sel.setAttribute('aria-label','Filter status');if(sel.options[0]&&sel.options[0].text==='Semua status')sel.options[0].text='Semua'}
var c=s.nextElementSibling;if(c&&c.tagName==='SMALL'&&!v.querySelector('.vrls')){var l=document.createElement('small');l.className='vrls';l.innerHTML='\u25CB belum \u00b7 \u25D0 sedang \u00b7 \u25CF selesai \u00b7 ketuk untuk mengubah';c.insertAdjacentElement('afterend',l)}}
function empty(v){if(v.querySelector('.row')||v.querySelector('.vrne'))return;var l=v.querySelector('.vrls')||v.querySelector(':scope>.sbar');if(!l)return;var d=document.createElement('div');d.className='card vrne';
d.innerHTML='<b>Tidak ada kartu yang cocok</b><p class=gsub>Coba kata kunci lain, atau ubah filter status.</p><button type=button class=pri data-a=lreset>Reset pencarian</button>';l.insertAdjacentElement('afterend',d)}
function run(){var v=document.getElementById('v');if(!v)return;var h=v.querySelector(':scope>h1');if(!h||h.textContent.trim()!=='Daftar')return;head(v);chips(v);empty(v)}
function boot(){var v=document.getElementById('v');if(!v)return setTimeout(boot,200);new MutationObserver(run).observe(v,{childList:true});run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();

/* Tahap D4: layar Pustaka — header ringkas, tombol tidak terpecah, chip padat (label pendek), tombol rincian sebaris */
(function(){var SH={'Belum dibaca':'Belum','Sudah dibaca':'Sudah','Belum didengar':'Belum','Sudah didengar':'Sudah','Belum selesai':'Belum','Sudah selesai':'Sudah','Cocok untuk kartu lemahku':'Kartu lemah','Semua status':'Semua'};
function short(b){if(b.getAttribute('data-vd'))return;b.setAttribute('data-vd','1');var n=b.firstChild;if(!n||n.nodeType!==3)return;var t=n.nodeValue.trim();if(SH[t]){if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',t+(b.querySelector('small')?'':''));b.title=t;n.nodeValue=SH[t]+(b.querySelector('small')?' ':'')}}
function chips(v){[].forEach.call(v.querySelectorAll('.chips'),function(c){if(c.querySelector('[data-a=liblg],[data-a=libst],[data-a=libsrt]')){c.classList.add('vrlc');[].forEach.call(c.querySelectorAll('.chip'),short)}})}
function head(v){var c=v.querySelector(':scope>.card');if(!c||c.classList.contains('vrlh')||!c.querySelector('[data-a=libadd]'))return;c.classList.add('vrlh');
var a=c.querySelector('[data-a=libadd]');if(a){var t=a.textContent.trim();a.setAttribute('aria-label',t);a.title=t;a.textContent=t.indexOf('kalimat')>=0?'＋ Tambah kalimat':'＋ Tambah teks'}
var k=c.querySelector('[data-a=libai]');if(k)k.setAttribute('aria-label','Kelas AI');
var p=c.querySelector('p.gsub');if(p&&!p.classList.contains('vrld')){var m=/(\d+ (?:teks|kalimat) · [^.]*)\./.exec(p.textContent);var d=document.createElement('details');d.className='vrdd';var s=document.createElement('summary');s.textContent=m?m[1]:'Tentang bagian ini';d.appendChild(s);p.classList.add('vrld');p.parentNode.insertBefore(d,p);d.appendChild(p)}}
function det(v){[].forEach.call(v.querySelectorAll('.lbd .rdh button:not([data-vd])'),function(b){b.setAttribute('data-vd','1');var t=b.textContent.trim();b.title=t;b.setAttribute('aria-label',t.replace(/^\S+\s/,''));
if(b.dataset.a==='libren')b.textContent='✎ Judul';else if(b.dataset.a==='libmv')b.textContent='⇄ Pindah';else if(b.dataset.a==='libdel')b.textContent='🗑 Hapus'})}
function run(){var v=document.getElementById('v');if(!v)return;var h=v.querySelector(':scope>h1');if(!h||h.textContent.trim()!=='Pustaka')return;head(v);chips(v);det(v)}
function boot(){var v=document.getElementById('v');if(!v)return setTimeout(boot,200);new MutationObserver(run).observe(v,{childList:true,subtree:true});run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()})();
