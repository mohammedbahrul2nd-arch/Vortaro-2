/* Uji level seragam (v7.79): node tests/test_levels.js */
const V=require('./load.js');
const {GXL,GXO,gxItems,VG,gxSetCur,gxAct,gxView,gxState}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
const all=GXL.map(m=>m.id);
/* 1 game item: filter lvs */
for(const g of ['zcl','phv','dtv','jcn']){const o=GXO(g);o.lvs=[];const full=gxItems(g).length;T(full>0,g+' penuh');
 const cell=gxItems(g)[0];gxSetCur(g);
 const lv0=(g=='zcl'?null:null);
 gxAct('ggxlv',(g=='jcn'?'N5':g=='zcl'?'HSK 1':'A1'));
 const a=gxItems(g).length;T(a<=full,g+' filter menyempit ('+a+'/'+full+')');
 gxAct('ggxlv','*');T(gxItems(g).length==full,g+' Semua mengembalikan');}
/* 2 preset jenis soal */
for(const g of all.filter(x=>/^(num|dt|px)_/.test(x))){const o=GXO(g);gxSetCur(g);const m0=o.modes.slice();
 gxAct('ggxlv','3');T(o.modes.length>=m0.length,g+' tambah level B2');
 gxAct('ggxlv','3');T(o.modes.length>0,g+' tak pernah kosong');
 o.modes=m0.slice();gxAct('ggxlv','0');T(o.modes.length>0,g+' level 0 aman');o.modes=m0.slice()}
/* 3 tampilan memuat chip level */
for(const g of ['zcl','phv','dtv','jcn','num_ja','dt_de','px_zh']){gxSetCur(g);gxState();const h=gxView(g);T(/ggxlv/.test(h),g+' ada chip level')}
/* 4 v7.85: mode px halus punya level & muncul di preset */
{const X=V.GXML&&V.GXML.px;T(X&&X.pf==2&&X.qt==2&&X.dd==3&&X.kg==2&&X.sp==3&&X.up==2&&X.tx==3,'GXML px pf/qt/dd');
 for(const l of V.VGLG){const o=GXO('px_'+l);gxSetCur('px_'+l);const m0=o.modes.slice();
  for(const m of Object.keys(V.PXM))T(X&&X[m]!=null||!(m in V.PXM),'level mode px '+m);
  o.modes=[];gxAct('ggxlv','2');T(o.modes.includes('pf')&&o.modes.includes('qt')&&o.modes.includes('kg')&&o.modes.includes('up'),'preset level 2 memuat pf/qt '+l);
  o.modes=[];gxAct('ggxlv','3');T(o.modes.includes('dd')&&o.modes.includes('sp')&&o.modes.includes('tx'),'preset level 3 memuat dd '+l);o.modes=m0.slice()}}
console.log('selesai',n,'cek');
