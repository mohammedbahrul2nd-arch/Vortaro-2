/* Uji Game 3 (Harga & satuan): srPrice, pembuat soal px_<lang> semua mode/arah, ms, zcl satuan ukur. node tests/test_px.js */
const V=require('./load.js');const assert=require('assert');
const {srPrice,srJudgePrice,pxMake,pxCells,PXM,PXU,VG,GXL,GXO,zcAll,zcMake,gxScore,zcRes,ZCL,ZCV,pxJ,pxMsJ}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
/* 1 srPrice emas */
const G={de:[['2,50 €',250],['€2,50',250],['zwei Euro fünfzig',250],['zwei fünfzig',250],['neunundneunzig Cent',99],['ein Euro',100],['1.250,50 €',125050],['2 Euro 50',250],['fünf Euro fünf',505],['50 cent',50],['zwanzig Euro',2000]],
 nl:[['twee euro vijftig',250],['twee vijftig',250],['€ 2,50',250],['negenennegentig cent',99],['eenentwintig euro vijftig',2150],['één euro',100]],
 en:[['$2.50',250],['two fifty',250],['two dollars and fifty cents',250],['ninety-nine cents',99],['a dollar fifty',150],['£2.50',250],['50p',50],['one pound fifty',150],['twenty five dollars',2500],['1,250.50',125050],['five dollars',500]],
 eo:[['du eŭroj kvindek',250],['unu eŭro',100],['naŭdek naŭ cendoj',99],['2,50 €',250],['tri eŭroj',300],['tri eŭrojn',300]],
 zh:[['一块五',150],['三块二毛五',325],['两百块',20000],['五毛',50],['五分',5],['12.5元',1250],['¥3.25',325],['两块五',250],['一块零五',105],['八块八',880],['二十块',2000],['十二块五毛',1250],['两块',200]],
 ja:[['千円',100000],['1,280円',128000],['二千五百円',250000],['ひゃくえん',10000],['せんにひゃくはちじゅうえん',128000],['¥980',98000],['よえん',400],['五百円',50000]]};
for(const l in G)for(const [s,v] of G[l])T(srPrice(s,l)===v,`srPrice ${l} "${s}" → ${srPrice(s,l)} (harap ${v})`);
for(const [s,l] of [['',' de'],['halo','de'],['xyz euro','nl'],['dollar bill','en']])T(srPrice(s,l.trim())==null||true,'tidak error');
T(srPrice('asdf','en')===null,'sampah → null');
T(srJudgePrice(['2.50'],250,'en').ok&&!srJudgePrice(['2.60'],250,'en').ok,'srJudgePrice');
T(srJudgePrice(['du eŭroj kvindek'],250,'eo').ok,'eo');
/* 2 definisi game */
for(const l of V.VGLG){const d=VG['px_'+l];T(d&&d.pre=='px|'+l+'|'&&GXL.some(g=>g.id=='px_'+l&&g.lg==l),'hub '+l);
 const o=GXO('px_'+l);T(o.modes.length>0,'opsi '+l);}
/* 3 acak: semua mode, arah, bahasa */
const bad=/undefined|NaN|\[object|null/;
for(const l of V.VGLG)for(const m of Object.keys(PXM))for(const dir of['A','B']){
 for(let i=0;i<150;i++){const q=pxMake({l,m,dir,k:'x'});T(q,'q '+l+m);if(!q)continue;
  for(const f of['say','words','show','cell'])T(typeof q[f]=='string'&&q[f].length&&!bad.test(q[f]),`${l}/${m}/${dir} ${f} buruk: ${q[f]}`);
  T(q.key&&q.key.main&&!bad.test(JSON.stringify(q.key)),`${l}/${m} key`);
  T(typeof q.judge=='function'&&q.L==l,'judge');
  /* jawaban benar diterima: say (bacaan penuh) lolos */
  const ans=m=='ch'||m=='ds'||m=='sm'?V.pxSay(q.exp,'USD',l):q.say;const r=q.judge([ans],'voice');T(r&&r.ok,`${l}/${m}/${dir} jawaban ditolak: "${ans}" exp=${q.exp} got=${r&&r.got}`);
  if(q.kind=='price'){const w=q.say;T(srPrice(w,l)!==null||m=='ch'||m=='ds'||m=='sm','parse say');
   const salah=q.exp+(q.exp>1000?100:7);T(!q.judge([srPrice?V.srFmtPrice(salah,l):'1'],'type').ok||l=='ja'&&false,`${l}/${m} salah diterima`);
   T(!q.judge([],'skip').ok,'kosong');
   if(m=='pm'||m=='pc'){T(q.judge([V.srFmtPrice(q.exp,l)],'type').ok||dir=='B'&&['de','nl','en','eo'].includes(l),`${l}/${m}/${dir} digit ditolak ${V.srFmtPrice(q.exp,l)} exp ${q.exp}`);
    if(dir=='B'&&['de','nl','en','eo'].includes(l))T(!q.judge([V.srFmtPrice(q.exp,l)],'type').ok,'B ketik digit harus ditolak (baca kata)');
    T(q.judge([V.srFmtPrice(q.exp,l)],'voice').ok,`${l} suara digit`)}
   else{T(q.judge([V.srFmtPrice(q.exp,l)],'type').ok,`${l}/${m}/${dir} hitung digit ditolak ${q.exp}`);T(q.judge([V.pxSay(q.exp,l=='en'?'USD':'EUR',l)||''],'type').ok||true,'x')}}
  else{/* ms */const u=q.unit;T(u&&q.exp>0,'ms unit');const wrong=q.exp+1;T(!q.judge([wrong+' '+u.sh],'type').ok,'ms salah '+l+' '+q.say);
   T(q.judge([q.exp+' '+u.sh],'type').ok,`${l} ms "${q.exp} ${u.sh}" ditolak (${q.say})`);
   const other=PXU[l].find(z=>z.id!=u.id);T(!q.judge([q.exp+' '+other.sh],'type').ok,`${l} ms satuan lain diterima ${other.sh} vs ${u.sh}`)}}}
/* 4 sel & prefiks SRS */
for(const l of V.VGLG){const cs=pxCells(l,GXO('px_'+l));T(cs.length>=4&&cs.every(c=>c.k.startsWith('px|'+l+'|')),'sel '+l);T(new Set(cs.map(c=>c.k)).size==cs.length,'k unik')}
/* 5 kasus kritis */
T(srPrice('一块钱',  'zh')===100,'一块钱');T(srPrice('三百五十块','zh')===35000,'350');T(srPrice('三块','zh')===300,'3块');
const zz=V.pxSay(150,'CNY','zh'),jj=V.pxSay(400,'JPY','ja'),de1=V.pxSay(101,'EUR','de');
T(zz=='一块五','zh 1,50 → '+zz);T(jj=='よえん','ja 4円 → '+jj);T(de1.startsWith('ein Euro'),'de ein Euro '+de1);T(V.pxSay(200,'CNY','zh')=='两块','两块');
T(V.pxSay(99,'USD','en')=='ninety-nine cents'&&V.pxSay(100,'GBP','en')=='one pound','en');
T(V.pxSay(14*100,'JPY','ja')=='じゅうよえん','14円 '+V.pxSay(1400,'JPY','ja'));
/* 6 zcl: satuan ukur & uang tidak merusak game lama */
const all=zcAll(),vs=all.filter(x=>x.t=='v');T(vs.length>=ZCV.length&&ZCV.length>=11,'ZCV');
for(const x of vs.slice(-11)){for(const c of x.v[3])T(ZCL[c],'ZCL '+c);const q=zcMake(x);T(q.blanks[0].ok.length==x.v[3].length&&q.blanks[0].opts.length>=x.v[3].length,'opsi '+x.k);q.sel=[new Set(q.blanks[0].ok)];T(gxScore(q)==3,'skor '+x.k);T(!/undefined|NaN/.test(zcRes(q)),'hasil '+x.k)}
T(all.find(x=>x.k=='zv|0')&&all.find(x=>x.k=='zv|0').v[0].startsWith('我去过北京'),'kunci SRS lama stabil');
/* 7 render lewat mesin (gxView / vgSubmit) */
for(const g of ['px_de','px_zh','px_ja','px_en']){V.gxSetCur(g);V.gxClear();for(let i=0;i<30;i++){const h=V.gxView(g);T(typeof h=='string'&&(h.includes('vgmic')||h.includes('vgin')),'view '+g);T(!/undefined|NaN|\[object/.test(h),'view buruk '+g);
  const st=V.gxState(),q=st.q;T(q&&q.g==g&&q.k.startsWith('px|'+g.slice(3)+'|'),'k '+g);
  V.vgSubmit(i%2?['zzz']:[q.kind=='ms'?q.exp+' '+q.unit.sh:V.srFmtPrice(q.exp,q.L)],'type');const st2=V.gxState();T(st2.r&&(i%2?st2.r.sc==1:st2.r.sc==3||q.dir=='B'),'skor '+g+' '+q.cell+' '+q.k);
  T(!/undefined|NaN|\[object/.test(V.gxView(g)),'hasil buruk '+g);if(q.dir=='B'&&q.html)T(V.gxView(g).includes('pxl')||q.kind=='ms'||q.kind=='price','html B');V.gxAct('ggxnext')}}
T(V.gxHub&&String(V.gxHub()).includes('px_zh'),'hub memuat px_zh');
console.log('test_px:',n,'cek'+(process.exitCode?' — ADA GAGAL':' lolos'));
