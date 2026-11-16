/* Uji Speaking Cloze (scl_<lang>): node tests/test_scl.js */
const V=require('./load.js');
const {SCD,scParse,scJudge,scMake,scK,scPlan,SCPRE,VG,GXO,GXL,gxItems,gxSetCur,gxView,gxAct,gxState,srShNorm}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
const LG=['zh','ja','de','nl','en','eo'];
/* pembulatan */
T(scK(5,50)==3&&scK(4,50)==2&&scK(5,25)==1&&scK(5,75)==4&&scK(5,100)==5&&scK(5,0)==0&&scK(5,'one')==1&&scK(0,'one')==0,'scK');
for(const l of LG){const A=scParse(l);T(A.length>=40,l+' jumlah '+A.length);T(GXL.some(m=>m.id=='scl_'+l),l+' hub');
 const g='scl_'+l,o=GXO(g);
 for(const it of A){
  T(it.segs.length>=2&&it.segs.every(s=>s.t&&s.r),l+' segmen/peran '+it.full);
  T(it.voc.length>=2,l+' vocab ≥3 '+it.full);T(it.gr.length>=1,l+' grammar '+it.full);
  for(const v of it.voc){T(v.s>=0&&v.s<it.segs.length,l+' indeks segmen '+v.w);const seg=it.segs[v.s].t;
   T(v.acc.some(a=>srShNorm(seg,l).includes(srShNorm(a,l))||srShNorm(seg,l).split(' ').some(w=>w.startsWith(srShNorm(a,l).slice(0,Math.max(3,srShNorm(a,l).length-2))))),l+' kosakata ada di segmen '+v.w+' ← '+seg)}
  /* jawaban sempurna */
  let r=scJudge(it,[it.full],o);T(r.ok&&r.tot>=95&&r.vo==100&&(r.gr==null||r.gr==100),l+' sempurna: '+JSON.stringify([r.tot,r.vo,r.gr,r.st,r.cm])+' '+it.full);
  for(const a of it.alt){r=scJudge(it,[a],o);T(r.ok&&r.vo==100,l+' alternatif diterima '+a+' '+JSON.stringify([r.tot,r.vo,r.gr,r.st,r.cm]))}
  /* tanpa tanda baca / huruf besar */
  r=scJudge(it,[it.full.replace(/[、。，,.?!？！]/g,'').toLowerCase()],o);T(r.ok,l+' toleran tanda baca '+it.full);
  /* salah total */
  r=scJudge(it,['zzz qqq'],o);T(!r.ok&&r.tot<40,l+' ngawur ditolak '+r.tot);
  r=scJudge(it,[],o);T(!r.ok,l+' kosong ditolak');
  /* kata kunci terlewat → vocab turun */
  const k0=it.voc[0],part=it.full.replace(new RegExp(k0.acc[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'');
  if(part!=it.full&&!(l=='ja'&&k0.w=='日本')){r=scJudge(it,[part],o);T(r.vo<100,l+' vocab terlewat terdeteksi '+k0.w)}
 }}
/* rencana clue: persentase, penempatan, struktur selalu ≥1 */
const sh=a=>a.slice();
for(const l of LG)for(const it of scParse(l)){const N=it.voc.length;
 for(const vp of [0,25,50,75,100,'one']){for(const vpl of['in','se','mx'])for(const vin of[0,25,50,75,100]){
  const P=scPlan(it,{vp,vpl,vin,shp:100},sh),k=scK(N,vp);T(P.inl.size+P.sep.length==k,'total clue '+vp+vpl+vin+' '+(P.inl.size+P.sep.length)+'/'+k);
  T(P.extra.length==N-k,'sisa clue');
  if(vpl=='in')T(P.sep.length==0,'inline penuh');if(vpl=='se')T(P.inl.size==0,'separate penuh');
  if(vpl=='mx')T(P.inl.size==Math.round(k*vin/100),'proporsi mixed '+P.inl.size+' vs '+k+'*'+vin)}}
 for(const shp of[1,10,25,50,75,100]){const P=scPlan(it,{vp:50,vpl:'mx',vin:50,shp},sh),m=it.segs.length;T(P.lab.size>=1&&P.lab.size==Math.max(1,Math.min(m,Math.round(m*shp/100))),'label struktur '+shp+' → '+P.lab.size+'/'+m)}}
/* alur UI */
for(const l of LG){const g='scl_'+l;gxSetCur(g);const o=GXO(g);gxAct('ggxvpre','mudah',null);T(o.vp==100&&o.vpl=='in'&&o.gh=='1','preset mudah');
 let h=gxView(g);T(/scf/.test(h)&&/ggxlv/.test(h)&&/ggxvpre/.test(h)&&/scr/.test(h),l+' tampilan');
 const st=gxState();T(st.q&&st.q.it,'soal terbentuk');
 gxAct('ggxvhv',null,null);gxAct('ggxvha',null,null);T(st.q.help.a==1,'bantuan dicatat');
 gxAct('ggxvpre','expert',null);T(o.vp==0&&o.shp==25&&o.gh=='0','preset expert');h=gxView(g);T(/scf/.test(h),'expert tampil');
 gxAct('ggxvpre','sulit',null);T(o.vp=='one'&&o.vpl=='se','preset sulit');gxView(g);
 /* kirim jawaban */
 const q2=gxState().q;V.vgSubmit([q2.it.full],'type');const rs=gxState().r;T(rs&&rs.got&&rs.got.tot>=95,'submit '+(rs&&rs.got&&rs.got.tot));T(/scres/.test(gxView(g)),'hasil tampil');
 gxAct('ggxnext');}
console.log('test_scl',n,'cek');
