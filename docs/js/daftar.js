/* Vortaro v7.73 — Daftar bertahap seperti Grammar: pilih bahasa → pilih level → daftar kosakata.
   Pilihan "🔀 Campur" memakai campur.js (mandiri). Berkas ini hanya membangun HTML; app.js memanggil vrDaftar.view() dari list()
   dan, bila gagal, jatuh ke daftar lama. State di sini TIDAK disimpan (selalu mulai dari pilih bahasa). */
(function(){
var P={lg:'',lv:''},CNT=null;
function counts(){
 if(CNT)return CNT;var c={};D.L.forEach(function(l){c[l[0]]={all:0}});
 D.C.forEach(function(card){for(var l in card[3]){if(!c[l])continue;var seen={};card[3][l].forEach(function(e){seen[e[3]]=1});c[l].all++;for(var v in seen)c[l][v]=(c[l][v]||0)+1}});
 return CNT=c}
function learned(l,lv){var n=0;D.C.forEach(function(card){var es=card[3][l];if(!es)return;if(lv&&lv!=='all'&&!es.some(function(e){return e[3]===lv}))return;if(st(ik(card[0],l))===2)n++});return n}
function bt(a,v,t,sub,pct){return'<button class=gpk data-dl='+a+' data-v="'+esc(v)+'"><b>'+t+'</b><small>'+sub+'</small>'+(pct?'<i style="width:'+pct+'%"></i>':'')+'</button>'}
function sbar(withFs){return'<div class=sbar><input type=search placeholder="Cari arti, kata, bacaan, atau kalimat buatanmu" value="'+esc(q)+'" data-i=q>'+
 (withFs?'<select data-i=fs>'+['Semua status'].concat(STN).map(function(x,i){return'<option value="'+(i?i-1:'')+'"'+(String(fs)===String(i?i-1:'')?' selected':'')+'>'+x+'</option>'}).join('')+'</select>':'')+'</div>'}
function row(c,v){var k=c[0],ls=Object.keys(v);
 return'<div class=row><div data-a=wtog data-k="'+esc(k)+'"><b>'+esc(c[2])+'</b> <small>'+PN[c[1]]+'</small><br><small>'+ls.map(function(l){return wd(v[l][0][0],c[1],'K',l)}).join(' · ')+'</small>'+cxRow(v)+'</div><div class=pls>'+
 ls.map(function(l){var i=ik(k,l),s=st(i);return'<button class="stp stpl stp'+s+'" data-a=cyc data-k="'+esc(i)+'" title="'+esc(LN[l])+': '+STN[s]+'">'+l.toUpperCase()+' · '+STN[s]+'</button>'}).join('')+'</div></div>'+(xo.has(k)?card(k,1):'')}
function more(n){return n>lim?'<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>':''}
function view(){
 var h=(foc&&K[foc]?'<div class=gsub style="margin:0 0 6px">Dibuka dari bagian lain · <button class="lnk" data-a=wclose>tutup</button></div>'+card(foc,1):''),t=q.toLowerCase();
 if(!P.lg){ /* tahap 1: pilih bahasa (pencarian global tetap ada) */
  if(q){var r=D.C.map(function(c){var v=vis(c,1);return v?[c,v]:null}).filter(function(x){return x&&(x[0][2].toLowerCase().indexOf(t)>=0||Object.keys(x[1]).some(function(l){return x[1][l].some(function(e){return(e[0]+e[1]+(e[4]||'')).toLowerCase().indexOf(t)>=0})}))});
   return h+sbar(0)+'<small>'+r.length+' kartu · <button class=lnk data-a=lreset>reset pencarian</button></small>'+r.slice(0,lim).map(function(x){return row(x[0],x[1])}).join('')+more(r.length)}
  var cn=counts();
  return h+sbar(0)+'<div class=card><b>Pilih bahasa daftar kata</b><div class=gpg>'+D.L.map(function(l){var n=cn[l[0]].all,d=learned(l[0]);return bt('lg',l[0],esc(l[1]),n+' kata · '+d+' dikuasai',n?Math.round(d/n*100):0)}).join('')+
   bt('lg','mix','🔀 Campur','Semua bahasa disatukan per arti Indonesia',0)+'</div></div>'}
 var mix=P.lg==='mix',L=mix?null:D.L.find(function(x){return x[0]===P.lg});
 if(!mix&&!L){P.lg='';P.lv='';return view()}
 var nm=mix?'🔀 Campur':esc(L[1]);
 if(!P.lv){ /* tahap 2: pilih level */
  var body='';
  if(mix){var M=vrMix.levels();body=bt('lv','all','Semua level',M.all+' entri Indonesia',0)+vrMix.LV.map(function(v){return bt('lv',v,v,M.n[v]+' entri'+(M.sub[v]?' · '+esc(M.sub[v]):''),0)}).join('')}
  else{var cn2=counts()[P.lg];body=bt('lv','all','Semua level',cn2.all+' kata',0)+L[4].map(function(v){var n=cn2[v]||0,d=learned(P.lg,v);return bt('lv',v,esc(v),n+' kata · '+d+' dikuasai',n?Math.round(d/n*100):0)}).join('')}
  return h+'<div class=card><div class=gcr><button class=mini data-dl=top>‹ Ganti bahasa</button><b>'+nm+'</b></div><b>Pilih level</b>'+(mix?'<small class=gsub>Level disetarakan ke A1–C2 (Mandarin HSK dan Jepang JLPT disesuaikan).</small>':'')+'<div class=gpg>'+body+'</div></div>'}
 /* tahap 3: daftar kosakata */
 var lvn=P.lv==='all'?'Semua level':P.lv,top='<div class=card><div class=gcr><button class=mini data-dl=up>‹ Ganti level</button><button class=mini data-dl=top>‹ Bahasa</button><b>'+nm+' · '+esc(lvn)+'</b></div></div>';
 if(mix){var out;try{out=vrMix.view({lv:P.lv,q:q,lim:lim})}catch(e){console.error(e);out='<div class=card>Mode Campur gagal dimuat. Pilih bahasa tunggal atau muat ulang aplikasi.</div>'}return h+top+sbar(0)+out}
 var res=[];D.C.forEach(function(c){var es=c[3][P.lg];if(!es)return;var e2=P.lv==='all'?es:es.filter(function(e){return e[3]===P.lv});if(!e2.length)return;
  if(fs!==''&&st(ik(c[0],P.lg))!=fs)return;
  if(t&&!(c[2].toLowerCase().indexOf(t)>=0||e2.some(function(e){return(e[0]+e[1]+(e[4]||'')).toLowerCase().indexOf(t)>=0})))return;
  var v={};v[P.lg]=e2;res.push([c,v])});
 return h+top+sbar(1)+'<small>'+res.length+' kartu'+((q||fs!=='')?' · <button class=lnk data-a=lreset>reset filter</button>':'')+'</small>'+res.slice(0,lim).map(function(x){return row(x[0],x[1])}).join('')+more(res.length)}
function reset(){P.lg='';P.lv='';q='';fs='';lim=50}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-dl]');if(!b)return;
 var a=b.dataset.dl,v=b.dataset.v;
 if(a==='lg'){P.lg=v;P.lv=''}else if(a==='lv'){P.lv=v}else if(a==='up'){P.lv=''}else if(a==='top'){P.lg='';P.lv=''}else return;
 q='';fs='';lim=50;try{render();window.scrollTo(0,0)}catch(_){}});
/* tombol back Android: satu langkah mundur di dalam Daftar; true bila ada yang ditutup */
function back(){if(typeof tab==='undefined'||tab!=='list')return false;if(foc){foc='';render();return true}if(q&&!P.lg){q='';render();return true}
 if(P.lv){P.lv='';q='';fs='';lim=50;render();return true}if(P.lg){P.lg='';q='';fs='';lim=50;render();return true}return false}
var api={view:view,reset:reset,back:back,_p:P};
try{window.vrDaftar=api}catch(_){}
})();
