/* Uji Grammar Cloze (gcl_<lang>): node tests/test_gcl.js
   Naikkan GCMIN setiap selesai mengisi satu bahasa-level (akhirnya 100 untuk semua). */
const V=require('./load.js');
const {D,GCX,GCV,GCLG,GCN,gcGaps,gcValid,gcNorm,gcOpts,gcCells,gcCards,GXX,GXL,GXO,gxScore,gxSetCur,gxView,gxAct,gxState,gxItems,gxFinish}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
const BAD=/undefined|\bnull\b|\bNaN\b|\[object/;
/* ambang cakupan minimum (% kartu bertanya) per bahasa+level — naikkan setiap tahap */
const GCMIN={'zh HSK 1':100,'zh HSK 2':100,'zh HSK 3':100,'ja N5':100,'ja N4':100,'de A1':100,'de A2':100,'en A1':100,'en A2':100,'nl A1':100};
const lvOf=g=>String(g[2]);
/* 1. registrasi */
for(const L of GCLG){const g='gcl_'+L;T(GXX[g]&&GXX[g].pre=='gc|g|'+L+'|','GXX '+g);T(GXL.some(m=>m.id==g&&m.lg==L),'hub '+g);T(Array.isArray(GXX[g].lvl)&&GXX[g].lvl.length>=1,'lvl '+g);T(!BAD.test(GXX[g].note),'note '+g)}
/* 2. cakupan & struktur bank */
const ids=new Map(D.G.map(g=>[g[0],g]));const keys=new Set();let nq=0,nk=0;
for(const id of Object.keys(GCX)){const g=ids.get(id);T(!!g,'kartu tidak ada di D.G: '+id);if(!g)continue;const b=GCX[id],L=g[1];
 T(Array.isArray(b)&&b.length>=2,'minimal 2 soal '+id+' ('+(b&&b.length)+')');
 const seen=new Set();
 b.forEach((q,i)=>{nq++;const ctx=id+' #'+i;T(Array.isArray(q)&&q.length>=4,'bentuk '+ctx);if(!Array.isArray(q))return;
  const [s,a,tr,h,rom,ban]=q,ng=(String(s).match(/___/g)||[]).length;
  T(typeof s=='string'&&ng>=1,'___ '+ctx);T(typeof tr=='string'&&tr.length>3,'terjemah '+ctx);T(typeof h=='string','petunjuk '+ctx);
  T(Array.isArray(a)&&a.length>=1,'jawaban '+ctx);const gp=gcGaps(q);T(gp.length==ng,'jumlah celah '+ctx+' '+gp.length+'/'+ng);
  for(const x of gp){T(x.length>=1&&x.every(z=>typeof z=='string'&&z.trim()&&!/___/.test(z)),'alternatif '+ctx)}
  T(!BAD.test(JSON.stringify(q)),'teks terlarang '+ctx);
  if(L=='zh'){T(typeof rom=='string'&&rom.length>3&&!/\?|___|\{|\}/.test(rom.replace(/\?$/,'')),'pinyin '+ctx+' '+rom)}
  if(ban!=null)T(Array.isArray(ban),'ban '+ctx);
  const key=s+'|'+JSON.stringify(a);T(!seen.has(key),'soal kembar '+ctx);seen.add(key);
  const k='gc|'+id+'|'+i;T(!keys.has(k),'kunci ganda '+k);keys.add(k);nk++})}
for(const L of GCLG){const cs=D.G.filter(g=>g[1]==L);const byLv={};for(const g of cs){(byLv[lvOf(g)]=byLv[lvOf(g)]||[]).push(g)}
 for(const lv in byLv){const c=byLv[lv].filter(g=>GCX[g[0]]&&GCX[g[0]].length).length,pc=100*c/byLv[lv].length,min=GCMIN[L+' '+lv]||0;T(pc>=min,`cakupan ${L} ${lv}: ${pc.toFixed(1)}% < ${min}%`)}}
T(nk==nq&&nq>=2432,'jumlah soal '+nq);
/* 3. sel & pembuatan soal (pilihan + ketik) */
const GXQ={};let made=0;
for(const L of GCLG){const g='gcl_'+L,o=GXO(g);o.ov={};const cells=GXX[g].cells(o);const lv=new Set(GXX[g].lvl);T(GXX[g].lvl.length==GCV[L].length,'konfigurasi level penuh '+g);
 for(const c of cells){T(/^gc\|g\|/.test(c.k)&&c.k.startsWith('gc|g|'+L+'|'),'kunci '+c.k);T(lv.has(c.lv),'level sel '+c.lv)}
 const ks=new Set(cells.map(c=>c.k));T(ks.size==cells.length,'sel unik '+g);
 for(const mode of ['c','t']){o.modes=[mode];
  for(const c of cells){const q=GXX[g].make(c);T(!!q,'make '+c.k);if(!q)continue;made++;
   T(q.typ==(mode=='t'),'mode '+c.k);const nb=q.parts.filter(p=>typeof p=='number').length;T(nb==q.blanks.length&&nb==(c.x.q[0].match(/___/g)||[]).length,'parts/blanks '+c.k);
   T(!/___/.test(q.fullTxt)&&!BAD.test(q.fullTxt+q.expl+q.tr+q.hint+q.rom),'teks hasil '+c.k);
   const gp=gcGaps(c.x.q);
   q.sel=q.blanks.map(()=>new Set());
   q.blanks.forEach((b,i)=>{const vs=new Set(gp[i].map(z=>gcNorm(z,L)));T(b.ok.length==1&&vs.has(gcNorm(b.ok[0],L)),'ok sah '+c.k);
    if(mode=='c'){T(new Set(b.opts).size==b.opts.length&&b.opts.includes(b.ok[0]),'opsi unik/ada kunci '+c.k);T(b.opts.length>=4&&b.opts.length<=6,'jumlah opsi '+b.opts.length+' '+c.k);
     T(b.opts.every(z=>z==b.ok[0]||!vs.has(gcNorm(z,L))),'pengecoh = jawaban sah '+c.k+' '+JSON.stringify(b.opts));
     const ban=(c.x.q[5]||[]).map(z=>gcNorm(z,L));T(b.opts.every(z=>!ban.includes(gcNorm(z,L))),'pengecoh terlarang '+c.k)}
    else T(b.opts.length==0,'ketik tanpa opsi '+c.k)});
   /* jawaban benar → skor 3; salah → 1 */
   if(mode=='c'){q.blanks.forEach((b,i)=>q.sel[i].add(b.ok[0]));T(gxScore(q)==3,'skor benar '+c.k);
    q.sel=q.blanks.map(()=>new Set());q.blanks.forEach((b,i)=>q.sel[i].add(b.opts.find(z=>z!=b.ok[0])));T(gxScore(q)==1,'skor salah '+c.k)}
   else{const good=q.blanks.map((b,i)=>b.alts[b.alts.length-1]);const r=q.judge(good);T(r.every(Boolean)&&gxScore(q)==3,'ketik benar '+c.k+' '+good);
    q.sel=q.blanks.map(()=>new Set());const r2=q.judge(q.blanks.map(()=>'zzqq'));T(r2.every(z=>!z)&&gxScore(q)==1,'ketik salah '+c.k);
    q.sel=q.blanks.map(()=>new Set());const r3=q.judge(q.blanks.map((b,i)=>' '+b.ok[0].toUpperCase()+'. '));T(r3.every(Boolean),'ketik toleran '+c.k+' '+r3)}
   T(typeof q.resHtml()=='string'&&!BAD.test(q.resHtml()),'resHtml '+c.k)}}
 o.modes=['c']}
T(made>=4864,'soal dibuat '+made);
/* 4. normalisasi */
T(gcNorm(' Ich. ','de')=='ich'&&gcNorm('für','de')==gcNorm('fuer','de')&&gcNorm('groß','de')==gcNorm('gross','de'),'norm de');
T(gcNorm('ĉu','eo')==gcNorm('cxu','eo')&&gcNorm('ŝi','eo')==gcNorm('sxi','eo'),'norm eo');
T(gcNorm('我 是','zh')=='我是'&&gcNorm('吗？','zh')=='吗','norm zh');T(gcNorm("Don’t",'en')=="don't",'norm en');
/* 5. alur UI zh (pilihan, ketik, laporan 🚩) */
{const g='gcl_zh',o=GXO(g);o.ov={};o.modes=['c'];gxSetCur(g);let h=gxView(g);const st=gxState();T(st.q&&st.q.g==g,'soal terbentuk');
 T(/gxo/.test(h)&&/gxs zh/.test(h)&&!BAD.test(h),'tampilan pilihan');T(/Cloze grammar/.test(h)&&/💡/.test(h),'petunjuk tampil');
 const q=st.q;q.blanks.forEach((b,i)=>gxAct('ggxpick',String(i),b.ok[0]));let rs=gxState();T(rs.r&&rs.r.sc==3,'pilih benar → 3');h=gxView(g);T(/zcfl/.test(h)&&/🚩/.test(h)&&!BAD.test(h)&&/gxpy/.test(h),'hasil + 🚩 + pinyin');
 /* laporan: terima jawaban lain, tolak, sembunyikan */
 const k=q.k;gxAct('ggxgcf','add','0:zz');T(o.ov[k]&&o.ov[k].add.includes('0:zz'),'tambah jawaban');
 const L0=gcValid(o,k,gcGaps(q.cx.x.q));T(L0[0].includes('zz'),'valid memuat tambahan');
 gxAct('ggxgcf','clr','0:zz');T(!o.ov[k],'batal tambahan');
 gxAct('ggxgcf','skip','');T(o.ov[k]&&o.ov[k].skip==1&&!GXX[g].cells(o).some(c=>c.k==k),'sembunyikan soal');gxAct('ggxgcf','skip','');T(!o.ov[k]&&GXX[g].cells(o).some(c=>c.k==k),'munculkan lagi');
 /* mode ketik */
 o.modes=['t'];gxAct('ggxnext');h=gxView(g);const q2=gxState().q;T(q2.typ&&/gcin0/.test(h)&&/ggxgct/.test(h),'tampilan ketik');
 q2.judge(q2.blanks.map(b=>b.ok[0]));gxFinish();h=gxView(g);T(gxState().r.sc==3&&/Jawabanmu/.test(h),'ketik benar');
 gxAct('ggxnext');gxView(g);const q3=gxState().q;q3.judge(q3.blanks.map(()=>'qqq'));gxFinish();h=gxView(g);T(gxState().r.sc==1&&/qqq/.test(h)&&/juga benar, terima/.test(h),'ketik salah + 🚩 terima');
 gxAct('ggxgcf','add','0:qqq');T(o.ov[q3.k].add.includes('0:qqq'),'laporan ketik');o.ov={};o.modes=['c']}
/* 6. bahasa tanpa bank (kini eo): pesan kosong, bukan galat — ganti bahasa bila de sudah terisi */
{const g='gcl_eo';gxSetCur(g);V.gxClear();const h=gxView(g);T(/Tidak ada soal/.test(h)&&/belum diisi/.test(h)&&!BAD.test(h),'kosong eo')}
/* 7. panjang kalimat (7.91): klasifikasi s/m/l, filter, chip */
{const g='gcl_zh',o=GXO(g);V.gxSetCur&&0;
 T(V.gcLen(['我 是 ___ 。'],'zh')=='s'&&V.gcLen(['我 明天 ___ 学校 学习。'],'zh')=='m'&&V.gcLen(['我 明天 早上 ___ 学校 学习 汉语 和 英语。'],'zh')=='l','gcLen zh');
 T(V.gcLen(['I ___ a student.'],'en')=='s'&&V.gcLen(['She ___ to the market every morning with her brother.'],'en')=='l','gcLen en');
 const all=V.GXX[g].cells(o).length;o.len=['s'];const s1=V.GXX[g].cells(o).length;o.len=['m'];const m1=V.GXX[g].cells(o).length;o.len=['l'];const l1=V.GXX[g].cells(o).length;
 T(s1>0&&m1>0&&l1>0&&s1+m1+l1==all,'filter len membagi semua soal: '+[s1,m1,l1,all]);
 o.len=['s','l'];T(V.GXX[g].cells(o).length==s1+l1,'filter len gabungan');
 o.len=[];T(V.GXX[g].cells(o).length==all,'len kosong = semua');
 T(/Panjang kalimat/.test(V.GXX[g].note)&&/len:s/.test(V.GXX[g].note)&&/len:l/.test(V.GXX[g].note),'chip panjang di pengaturan');
 o.len=['l'];gxSetCur(g);V.gxClear();const h=gxView(g);T(!BAD.test(h),'view len=l bersih');o.len=[]}
console.log('test_gcl',n,'cek,',nq,'soal');
