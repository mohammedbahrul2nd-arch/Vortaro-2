/* Vortaro v7.73 — Daftar "Campur": satukan semua bahasa per entri Indonesia (D.C[i][2]).
   MANDIRI: hanya MEMBACA D.C (tidak mengubah database), state sendiri (dibuang saat aplikasi dimuat ulang),
   klik ditangani lewat atribut data-mx sendiri. Dipanggil dari daftar.js dan selalu dibungkus try/catch di sana. */
(function(){
var LV=['A1','A2','B1','B2','C1','C2'];
/* Kesetaraan level ke skala A1-C2 (ubah di sini bila ingin memakai patokan lain). de/eo/nl/en sudah A1-C2. */
var MAP={zh:{'HSK 1':'A1','HSK 2':'A2','HSK 3':'B1','HSK 4':'B2','HSK 5':'C1','HSK 6':'C1','HSK 7-9':'C2'},
 ja:{N5:'A1',N4:'A2',N3:'B1',N2:'B2',N1:'C1'}};
var OPEN=new Set(),OFF=new Set(),lastLv=null,IDX=null,CNT=null;
function esc2(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function cefr(l,v){var m=MAP[l];return m?(m[v]||''):(v||'')}
function norm(s){return String(s==null?'':s).toLowerCase().replace(/\s+/g,' ').trim()}
function langs(){return (typeof D!=='undefined'&&D.L)?D.L:[]}
function build(){
 if(IDX)return IDX;var m=new Map(),C=(typeof D!=='undefined'&&D.C)||[];
 C.forEach(function(c){var key=norm(c[2]);if(!key||!c[3])return;var g=m.get(key);
  if(!g){g={g:String(c[2]),keys:[],e:{}};m.set(key,g)}
  g.keys.push(c[0]);
  for(var l in c[3]){c[3][l].forEach(function(e){var a=g.e[l]||(g.e[l]=[]);
   if(a.some(function(z){return z.w===e[0]&&z.o===e[3]}))return;
   a.push({w:e[0],r:e[1]||'',x:e[2]||'',o:e[3]||'',lv:cefr(l,e[3]),k:c[0]})})}});
 IDX=Array.from(m.values());return IDX}
function levels(){
 if(CNT)return CNT;var n={},t=0;LV.forEach(function(v){n[v]=0});
 build().forEach(function(g){var seen={};for(var l in g.e)g.e[l].forEach(function(z){if(z.lv)seen[z.lv]=1});
  var any=false;for(var v in seen){n[v]=(n[v]||0)+1;any=true}if(any)t++});
 var sub={};LV.forEach(function(v){var p=[];for(var l in MAP)for(var o in MAP[l])if(MAP[l][o]===v)p.push(o);sub[v]=p.join(' · ')});
 CNT={n:n,all:build().length,sub:sub};return CNT}
function visible(g,lv){var out={},has=false;
 langs().forEach(function(L){var id=L[0];if(OFF.has(id)||!g.e[id])return;
  var es=g.e[id].filter(function(z){return lv==='all'||z.lv===lv});if(es.length){out[id]=es;has=true}});
 return has?out:null}
function chips(){var h='<div class=chips style="margin:4px 0 6px"><button class="chip'+(OFF.size?'':' on')+'" data-mx=all>Semua bahasa</button>';
 langs().forEach(function(L){h+='<button class="chip'+(OFF.has(L[0])?'':' on')+'" data-mx=lg data-v="'+esc2(L[0])+'">'+esc2(L[1])+'</button>'});return h+'</div>'}
function lvTxt(l,z){return z.o&&z.lv&&z.o!==z.lv?esc2(z.o)+' ≈ '+esc2(z.lv):esc2(z.o||z.lv)}
function rowHtml(g,idx,v){
 var colr={};langs().forEach(function(L){colr[L[0]]=L[2]||'inherit'});
 var line=langs().filter(function(L){return v[L[0]]}).map(function(L){var id=L[0],es=v[id],more=es.length>1?' <i>+'+(es.length-1)+'</i>':'';
  return'<span><b style="color:'+esc2(colr[id])+'">'+esc2(id.toUpperCase())+'</b> '+esc2(es[0].w)+more+'</span>'}).join(' · ');
 var nl=Object.keys(v).length,open=OPEN.has(String(idx));
 var h='<div class=row><div data-mx=tg data-v="'+idx+'"><b>'+esc2(g.g)+'</b> <small>'+nl+' bahasa</small><br><small>'+line+'</small></div></div>';
 if(open){h+='<div class=card>';
  langs().forEach(function(L){var id=L[0],es=v[id];if(!es)return;
   h+='<div style="margin:0 0 8px"><b style="color:'+esc2(colr[id])+'">'+esc2(L[1])+'</b>';
   es.slice(0,6).forEach(function(z){h+='<div style="margin:4px 0"><span>'+esc2(z.w)+'</span>'+(z.r?' <small>('+esc2(z.r)+')</small>':'')+
    ' <small>· '+lvTxt(id,z)+'</small> <button class=mini data-a=say data-k="'+esc2(z.w)+'" data-v="'+esc2(id)+'" title="Dengarkan" aria-label="Dengarkan">🔊</button> <button class=mini data-a=wopen data-k="'+esc2(z.k)+'" title="Buka kartu & Pustaka terkait">Buka kartu</button>'+
    (z.x?'<br><small>'+esc2(z.x)+'</small>':'')+'</div>'});
   if(es.length>6)h+='<small>+'+(es.length-6)+' lainnya</small>';h+='</div>'});
  h+='</div>'}
 return h}
/* o={lv:'A1'|..|'all', q:'teks cari', lim:50} → HTML daftar */
function view(o){o=o||{};var lv=o.lv||'all',t=norm(o.q),lim=o.lim||50;
 if(lv!==lastLv){OPEN.clear();lastLv=lv}
 var res=[];build().forEach(function(g,i){var v=visible(g,lv);if(!v)return;
  if(t){var ok=norm(g.g).indexOf(t)>=0;if(!ok)for(var l in v){if(v[l].some(function(z){return norm(z.w+' '+z.r+' '+z.x).indexOf(t)>=0})){ok=true;break}}if(!ok)return}
  res.push([g,i,v])});
 var h=chips()+'<small>'+res.length+' entri Indonesia'+(o.q?' · cocok dengan pencarian':'')+'</small>';
 if(!res.length)h+='<div class=card>Tidak ada entri yang cocok. Coba level lain, aktifkan lebih banyak bahasa, atau ubah pencarian.</div>';
 h+=res.slice(0,lim).map(function(r){return rowHtml(r[0],r[1],r[2])}).join('');
 if(res.length>lim)h+='<button data-a=more style="width:100%;margin-top:8px">Tampilkan lebih banyak</button>';
 return h}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-mx]');if(!b)return;
 var inner=e.target.closest('[data-a]');if(inner&&b.contains(inner))return; /* tombol 🔊 / Buka kartu ditangani aplikasi */
 var a=b.dataset.mx,v=b.dataset.v;
 if(a==='tg'){OPEN.has(v)?OPEN['delete'](v):OPEN.add(v)}else if(a==='lg'){OFF.has(v)?OFF['delete'](v):OFF.add(v)}else if(a==='all'){OFF.clear()}else return;
 try{render()}catch(_){}});
var api={view:view,levels:levels,index:build,cefr:cefr,visible:visible,LV:LV,MAP:MAP,_off:OFF,_open:OPEN};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
try{window.vrMix=api}catch(_){}
})();
