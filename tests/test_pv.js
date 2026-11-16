/* Uji game Preposisi Verba & Adjektiva (pve/pvd/pvn): node tests/test_pv.js */
const V=require('./load.js');
const {PV,PVID,PVPOOL,pvValid,pvMake,PVM,GXO,gxItems,gxSetCur,gxView,gxAct,GXL}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
const MIN={en:80,de:80,nl:80};
for(const g of Object.keys(PVID)){const L=PVID[g],D=PV[L];
 T(GXL.some(m=>m.id==g&&m.lg==L),g+' di hub');T(D.length>=MIN[L],g+' jumlah '+D.length);
 T(D.filter(x=>x.t=='v').length>=15&&D.filter(x=>x.t=='a').length>=15,g+' v dan a cukup');
 const lvs=new Set(D.map(x=>x.lv));T(['A1','A2','B1','B2'].every(l=>lvs.has(l)),g+' level A1–B2');
 const seen=new Set();
 for(const x of D){T(x.s.split('~').length==2,g+' tepat satu blank '+x.s);T(!seen.has(x.k+'|'+x.p),g+' baris ganda '+x.k+x.p);seen.add(x.k+'|'+x.p);
  T(PVPOOL[L].includes(x.p)&&x.alts.every(a=>PVPOOL[L].includes(a)),g+' preposisi ada di pool '+x.k+' '+x.alts);
  T(['v','a'].includes(x.t)&&['A1','A2','B1','B2'].includes(x.lv)&&x.tr.length>3,g+' field '+x.k)}
 const it=gxItems(g);T(it.length==D.length,g+' sel = baris '+it.length);const ks=new Set();
 for(const c of it){T(!ks.has(c.k),g+' kunci ganda '+c.k);ks.add(c.k);T(c.k.startsWith(g+'|'),'prefiks SRS '+c.k);
  for(let t=0;t<20;t++){const q=pvMake(L,g)(c),b=q.blanks[0],val=pvValid(L,c.x.k);
   T(b.opts.length>=5&&b.opts.length<=6&&new Set(b.opts).size==b.opts.length,g+' 5–6 opsi unik '+c.k+' '+b.opts);
   T(b.opts.includes(b.ok[0])&&val.has(b.ok[0]),g+' jawaban valid & ada '+c.k);
   for(const p of b.opts)if(p!=b.ok[0]){T(!val.has(p),g+' pengecoh valid! '+c.k+' '+p);T(!c.x.ban.includes(p),g+' pengecoh terlarang '+c.k+' '+p);T(PVPOOL[L].includes(p),g+' pengecoh dari pool')}
   T(q.parts.length==3&&q.tr&&q.fullTxt==q.parts[0]+b.ok[0]+q.parts[2],g+' kalimat '+c.k)}}
 /* filter mode & level */
 gxSetCur(g);const o=GXO(g);T(o.modes.length==2,g+' dua jenis soal');
 gxAct('ggxlv','A1');const a1=gxItems(g);T(a1.length>0&&a1.length<D.length&&a1.every(c=>c.lv=='A1'),g+' filter A1 '+a1.length);gxAct('ggxlv','*');
 T(/ggxlv/.test(gxView(g)),g+' tampilan punya level')}
/* pengecoh benar-benar mengecualikan semua pola kata yang sama (look at/for/after, sprechen über/mit) */
for(const [L,k] of [['en','look'],['de','sprechen'],['de','sich freuen'],['nl','denken'],['nl','vragen'],['nl','bekend']]){const val=pvValid(L,k);T(val.size>=2,L+' '+k+' multi pola');
 for(const x of PV[L].filter(y=>y.k==k))for(let i=0;i<50;i++){const q=pvMake(L,'pv'+L[0])({k:'t',m:x.t,x,lv:x.lv}),ob=q.blanks[0].opts;T(ob.filter(p=>val.has(p)).length==1,L+' '+k+' hanya satu opsi valid '+ob)}}
console.log('test_pv',n,'cek');
