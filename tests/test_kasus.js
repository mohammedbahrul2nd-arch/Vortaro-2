/* Uji game Kasus Jerman (kas): node tests/test_kasus.js */
const V=require('./load.js');
const {KS,KSN,GXO,gxItems,ksMake,gxSetCur,gxView,gxAct,gxState,GXL}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
T(GXL.some(m=>m.id=='kas'),'kas di hub');
const o=GXO('kas');T(o.modes.length==9,'sembilan jenis soal default');
const items=gxItems('kas');T(items.length>=700,'jumlah sel '+items.length);
const keys=new Set();
for(const c of items){T(!keys.has(c.k),'kunci ganda '+c.k);keys.add(c.k);
 for(let t=0;t<(c.m=='wp'?6:2);t++){const q=ksMake(c);T(!!q,'make '+c.k);if(!q)continue;
  const b=q.blanks[0];T(b.opts.length>=2&&new Set(b.opts).size==b.opts.length,'opsi unik '+c.k+' '+b.opts);T(b.opts.includes(b.ok[0]),'jawaban ada di opsi '+c.k);
  T(q.parts.length>=2&&typeof q.say=='function'&&q.fullTxt,'struktur '+c.k)}}
/* data: bracket, kasus valid, level valid */
for(const x of KS.I){T(/\[[^\]]+\]/.test(x.s)&&'NADG'.includes(x.c),'id '+x.s);T(['A1','A2','B1','B2','C1'].includes(x.lv),'lv '+x.s)}
for(const x of KS.P)T('ADGW'.includes(x.c)&&x.ex.toLowerCase().includes(x.p),'prep '+x.p);
for(const x of KS.B)T(x.s.includes('{'+x.p+'}')&&'AD'.includes(x.c),'vp '+x.s);
for(const x of KS.W)for(const id of x.ns)T(!!KSN[id],'noun '+id);
/* Wechsel: Wo->Dativ, Wohin->Akk */
for(const x of KS.W)for(const d of['wo','wh'])for(let i=0;i<8;i++){const q=ksMake({k:'t',m:'wp',x,d,lv:x.lv}),a=q.blanks[0].ok[0];
 T(d=='wo'?['dem','der'].includes(a):['den','die','das'].includes(a),'wp '+d+' '+a+' '+x.wo)}
/* filter level */
gxSetCur('kas');gxAct('ggxlv','A1');const a1=gxItems('kas');T(a1.length>0&&a1.length<items.length&&a1.every(c=>c.lv=='A1'),'filter A1 '+a1.length);gxAct('ggxlv','*');
T(/ggxlv/.test(gxView('kas')),'tampilan kas punya level');
console.log('test_kasus',n,'cek');
