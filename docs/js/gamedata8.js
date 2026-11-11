/* Game 4 — Shadowing (shd_<lang>): dengar kalimat → tirukan → skor kemiripan 0–100 + selisih berwarna.
   Memakai mesin VG (games3.js). Sumber kalimat: contoh kartu (D.C), contoh tata bahasa (D.G), kalimat Pustaka (S.sl).
   Dimuat SETELAH games3.js. */
const SHPRE=l=>'sh|'+l+'|';
const SHMODES={s:'Pendek',m:'Sedang',l:'Panjang'};
const SHSRC={a:'Semua',c:'Kartu',g:'Tata bahasa',p:'Pustaka'};
let SHPOOL={};
const shCJK=l=>l=='zh'||l=='ja';
const shHash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return(h>>>0).toString(36)};
/* panjang kalimat dalam satuan (zh/ja: karakter, lain: kata) → kelas s/m/l; null bila tak layak */
function shCls(n,l){const cj=shCJK(l);if(cj){if(n<4||n>60)return null;return n<=8?'s':n<=16?'m':'l'}
 if(n<3||n>25)return null;return n<=5?'s':n<=10?'m':'l'}
/* pisahkan terjemahan "kalimat (arti)" yang dipakai data zh/ja; kembalikan {f,t} atau null bila tak layak */
function shSplit(raw,l){let s=String(raw||'').replace(/\s+/g,' ').trim(),t='';if(!s)return null;
 const m=s.match(/^(.*?)\s*[(（]([^()（）]*)[)）]\s*$/);
 if(m){if(/[A-Za-z]{3}/.test(m[2])&&m[2].length>=6){s=m[1].trim();t=m[2].trim()}else s=m[1].trim()}
 if(/[(（)）]/.test(s))return null;
 if(/[0-9０-９→=\/|_<>@#]|\.\.\.|…|\s[–—-]\s/.test(s))return null;
 if(shCJK(l)){s=s.replace(/\s+/g,'');if(!/[\u3040-\u30ff\u3400-\u9fff]/.test(s))return null}
 else if(!/\p{L}/u.test(s))return null;
 return{f:s,t}}
function shItem(f,t,r,lv,src,ck,w,l){const u=srShUnits(f,l),c=shCls(u.length,l);if(!c)return null;
 return{f,t:t||'',r:r||'',lv:lv||'',s:src,ck:ck||'',w:w||'',c,l,k:SHPRE(l)+shHash(srShNorm(f,l))}}
function shPool(l){if(SHPOOL[l])return SHPOOL[l];const out=[],seen=new Set(),add=it=>{if(!it||seen.has(it.k))return;seen.add(it.k);out.push(it)};
 try{for(const c of(typeof D!='undefined'&&D.C)||[]){const es=c[3]&&c[3][l];if(!es)continue;
  es.forEach((e,i)=>{if(!e[2])return;const p=shSplit(e[2],l);if(!p)return;
   add(shItem(p.f,p.t,'',e[3],'c',(typeof ik=='function'?ik(c[0],l):c[0]+'@'+l)+(i>0?'~'+i:''),e[0]+(c[2]?' — '+c[2]:''),l))})}}catch(e){}
 try{for(const g of(typeof D!='undefined'&&D.G)||[]){if(g[1]!=l||!g[7])continue;
  for(const ex of g[7]){const ln=String(ex).split('\n').map(z=>z.trim()).filter(Boolean);if(!ln.length)continue;
   const p=shSplit(ln[0],l);if(!p)continue;const tr=ln.length>1?ln[ln.length-1]:'',rom=l=='zh'&&ln.length>2?ln[1]:'';
   add(shItem(p.f,p.t||(tr!=ln[0]?tr:''),rom,g[2],'g','',g[4]||'',l))}}}catch(e){}
 return SHPOOL[l]=out}
/* kalimat Pustaka pengguna (dinamis, tidak di-cache) */
function shLib(l){const a=[];try{for(const x of(typeof S!='undefined'&&S.sl)||[]){if(x.L!=l||!x.f)continue;const p=shSplit(x.f,l);if(!p)continue;const it=shItem(p.f,p.t||x.i||'',x.r||'','','p','','',l);if(it)a.push(it)}}catch(e){}return a}
const shWeak=it=>{try{const c=it.ck&&S.srs&&S.srs[it.ck];return!!c&&(c.t==1||c.t==3)}catch(e){return false}};
function shCells(l,o){const md=new Set(o.modes||[]),src=o.src||'a',lv=o.lv||'';let a=[];
 if(src=='a'||src=='c'||src=='g')a=shPool(l).filter(x=>src=='a'||x.s==src);
 if(src=='a'||src=='p')a=a.concat(shLib(l));
 return a.filter(x=>md.has(x.c)&&(!lv||x.lv==lv)&&(o.weak!='1'||shWeak(x)))}
/* TTS dengan kecepatan sendiri (0,7× / 1×) dan pengulangan */
function shRate(o){const b=typeof ttsRate=='function'?ttsRate():.9;return o.spd=='0.7'?Math.max(.4,b*.7):b}
function shSay(t,l,rate,n){if(typeof canSay!='function'||!canSay()||typeof TL=='undefined'||!TL[l])return;
 const r=typeof ttsVoice=='function'?ttsVoice(l):{};
 if(!r.v&&typeof VZ!='undefined'&&VZ.length)return typeof toast=='function'&&toast('Suara '+(typeof LN!='undefined'&&LN[l]||l)+' belum terpasang di perangkat ini.');
 try{speechSynthesis.cancel();const x=(typeof ttsClean=='function'?ttsClean(t,l):String(t)).replace(/[~〜]/g,'').trim();
  for(let i=0;i<(n||1);i++){const u=new SpeechSynthesisUtterance(x);u.lang=r.v?r.v.lang:r.lc;if(r.v)u.voice=r.v;u.rate=rate;speechSynthesis.speak(u)}}catch(e){}}
function shMake(c){const l=c.l,g='shd_'+l,o=GXO(g),thr=+o.thr||80,rep=Math.max(1,Math.min(3,+o.rep||1));
 const self=o.self=='s'||(l=='eo'&&(!srSupported()||srEoMode()=='off'));
 const q={L:l,dir:'A',cell:'Shadowing'+(c.lv?' · '+c.lv:''),show:'',say:c.f,words:c.f,kind:'sh',hn:'kalimatnya',self,showTxt:o.hide=='0',
  key:{main:c.f,sub:[c.r,c.t].filter(Boolean).join(' · '),tip:(c.s=='c'?'Dari kartu kata ':c.s=='g'?'Dari tata bahasa ':'Dari Pustaka-mu')+(c.w&&c.s!='p'?c.w:'')},
  play:()=>shSay(c.f,l,shRate(o),rep),slow:()=>shSay(c.f,l,Math.max(.4,(typeof ttsRate=='function'?ttsRate():.9)*.7),1)};
 q.htmlA=`<div class=btns><button class=chip data-a=ggxvslow>🐢 Putar lambat (0,7×)</button></div>`;
 q.ph='Ketik apa yang kamu ucapkan';
 q.judge=(a,h)=>h=='self'?{ok:a[0]=='ok',got:{self:1}}:srJudgeSim(a,c.f,l,thr);
 q.resHtml=r=>{const again=`<div class=btns><button class=chip data-a=ggxvagain>🔁 Ulangi (latihan bebas)</button></div>`,gt=r.got||{};
  if(gt.self)return`<div class=shs>Penilaian sendiri: <b>${r.sc==3?'sudah sama':'perlu diulang'}</b></div>${again}`;
  if(r.skip||gt.sim==null)return again;
  const d=srDiff(c.f,gt.alt||r.heard,l),sp=d.cj?'':' ';
  return`<div class=shs><b>${gt.sim}</b>/100 <small>(lulus ≥ ${gt.thr})</small></div><div class=shbar><i style="width:${gt.sim}%"></i></div>`+
   `<div class=shd>${d.parts.map(p=>`<span class="${p.s==1?'shk':p.s==0?'shm':''}">${esc(p.t)}</span>`).join(sp)}</div>`+
   (d.extra.length?`<small>Terdengar tambahan: ${esc(d.extra.join(sp))}</small>`:'')+again};
 return q}
function shExtra(g,o){const l=VG[g].lg,lvs=(((typeof D!='undefined'&&D.L.find(z=>z[0]==l))||[])[4]||[]).slice();shPool(l).forEach(x=>{if(x.lv&&!lvs.includes(x.lv))lvs.push(x.lv)});
 const ch=(f,lab,list)=>`<small>${lab}</small><div class=chips>${list.map(z=>`<button class="chip${String(o[f])==String(z[0])?' on':''}" data-a=ggxvset data-v=${f} data-k="${esc(z[0])}">${z[1]}</button>`).join('')}</div>`;
 return ch('src','Sumber kalimat',Object.entries(SHSRC))+ch('lv','Level',[['','Semua']].concat(lvs.map(z=>[z,esc(z)])))+
  ch('spd','Kecepatan suara',[['1','1×'],['0.7','0,7×']])+ch('rep','Putar berapa kali',[['1','1×'],['2','2×'],['3','3×']])+
  ch('hide','Teks kalimat',[['1','Sembunyikan'],['0','Tampilkan']])+ch('thr','Ketat penilaian',[['70','Longgar'],['80','Sedang'],['90','Ketat']])+
  ch('self','Penilaian',[['a','Otomatis'],['s','Swa-nilai']])+ch('weak','Fokus',[['0','Semua kalimat'],['1','Hanya kata kartu lemah']])}
VGLG.forEach(l=>{VG['shd_'+l]={lg:l,pre:SHPRE(l),modes:SHMODES,noDir:true,extra:shExtra,
 empty:o=>o.weak=='1'?'Belum ada kata kartu lemah yang punya kalimat. Matikan “Hanya kata kartu lemah” di pengaturan.':'Tidak ada kalimat untuk pilihan ini. Pilih level/sumber lain atau tambah kalimat di Pustaka.',
 def:{n:10,r:200,modes:['s','m'],dir:'A',inp:'v',src:'a',lv:'',spd:'1',rep:'1',hide:'1',thr:'80',self:'a',weak:'0'},
 cells:o=>shCells(l,o),make:c=>shMake(c)};
 GXL.push({id:'shd_'+l,ic:'🗣',t:'Shadowing — '+VGLN[l],d:'Dengar kalimat lalu tirukan. Skor kemiripan 0–100 dengan selisih berwarna, kecepatan 0,7× / 1×, kalimat dari kartu, tata bahasa & Pustaka.',tag:l.toUpperCase(),lg:l})});
