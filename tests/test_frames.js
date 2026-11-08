/* A5: bingkai kalimat soal DE/NL. node tests/test_frames.js */
const X=require('./load.js');let fail=0,n=0;const ok=(c,m)=>{n++;if(!c){fail++;if(fail<20)console.log('GAGAL:',m)}};
const bad=s=>/undefined|NaN|\[object|null/.test(s);
// 1. jumlah, duplikat, format
for(const cs of ['Nom','Akk','Dat','Gen']){
 for(const [nm,L] of [['DEFR',X.DEFR[cs]],['DEPLF',X.DEPLF[cs]]]){
  ok(L.length>=30,`${nm}.${cs} hanya ${L.length}`);
  const t=L.map(f=>f.t);ok(new Set(t).size==t.length,`${nm}.${cs} duplikat`);
  L.forEach(f=>{ok((f.t.match(/\{P\}/g)||[]).length==1,`{P} tak tepat satu: ${f.t}`);ok(!f.t.startsWith('{P}'),`{P} di awal: ${f.t}`);ok(f.g,`tanpa tag: ${f.t}`)})}}
for(const [nm,L,min] of [['NLFR',X.NLFR,40],['NLFRS',X.NLFRS,8],['NLFRZ',X.NLFRZ,8]]){
 ok(L.length>=min,`${nm} hanya ${L.length}`);const t=L.map(f=>f.t);ok(new Set(t).size==t.length,`${nm} duplikat`);
 L.forEach(f=>{ok((f.t.match(/\{P\}/g)||[]).length==1&&!f.t.startsWith('{P}'),`format ${f.t}`)})}
// kesepakatan kata kerja Nom jamak: tak boleh ada ' ist ' / 'steht' / 'kommt' dsb. di NomP
X.DEPLF.Nom.forEach(f=>ok(!/\b(ist|steht|kommt|liegt|wartet|beginnt|wohnt|fehlt|bleibt|war)\b/.test(f.t.replace('Es ist klar,','')),`Nom jamak kata kerja tunggal: ${f.t}`));
X.DEFR.Nom.forEach(f=>ok(!/\b(sind|stehen|kommen|liegen|warten|beginnen|wohnen|fehlen|bleiben|waren)\b/.test(f.t),`Nom tunggal kata kerja jamak: ${f.t}`));
X.NLFRZ.forEach(f=>ok(!/\b(is|staat|ligt|komt|wacht|was)\b/.test(f.t),`NL jamak kata kerja tunggal: ${f.t}`));
X.NLFRS.forEach(f=>ok(!/\b(zijn|staan|liggen|komen|wachten|waren)\b/.test(f.t),`NL tunggal kata kerja jamak: ${f.t}`));
// 2. tanpa pengulangan berturut-turut + bag: tiap putaran memakai semua bingkai sekali
const cellsDE=X.deCells(),cellsNL=X.nlCells();
function run(cells,mk,N){let bad0=0,seq={};
 for(const c of cells){let last=null,rep=0,out=0;for(let i=0;i<N;i++){const q=mk(c);if(!q){out++;continue}
  const s=q.fullTxt&&(typeof q.fullTxt=='function'?q.fullTxt():q.fullTxt);ok(!bad(s),`undefined: ${s}`);ok(!bad(q.expl),`expl: ${q.expl}`);
  if(q.fr&&q.fr===last)rep++;last=q.fr}
  if(rep)bad0++;ok(rep==0,`pengulangan berturut-turut ${rep}x pada ${c.k}`)}return bad0}
run(cellsDE,X.deMake,500);run(cellsNL,X.nlMake,500);
// 3. bag: sebelum semua bingkai terpakai tak ada yang muncul dua kali
{const L=X.DEFR.Akk;const seen=new Set();for(let r=0;r<5;r++){seen.clear();for(let i=0;i<L.length;i++){const f=X.frPick('uji|bag',L);ok(!seen.has(f),'bag: bingkai berulang dalam satu putaran');seen.add(f)}ok(seen.size==L.length,'bag tidak lengkap')}}
// 4. tiap kasus muncul bingkai yang cocok: Dat jamak 'pd'
for(let i=0;i<300;i++){const q=X.deMake({k:'x',m:'pd',t:'add'});if(q)ok(/Dativ|Kasus karena/.test(q.expl)&&/den /.test(q.expl),'expl pd')}
// 5. cakupan: setiap bingkai terpakai dalam 3000 soal
{const used={};for(let i=0;i<3000;i++)for(const c of [{k:'a',m:'ad',cs:'Akk',g:'m'},{k:'b',m:'ad',cs:'Dat',g:'f'},{k:'c',m:'ad',cs:'Gen',g:'f'},{k:'d',m:'ad',cs:'Nom',g:'n'},{k:'e',m:'pa',cs:'Nom'},{k:'f',m:'pa',cs:'Gen'}]){const q=X.deMake(c);if(q)used[q.fr]=1}
 const all=[...X.DEFR.Nom,...X.DEFR.Akk,...X.DEFR.Dat,...X.DEFR.Gen,...X.DEPLF.Nom].map(f=>f.t);const miss=all.filter(t=>!used[t]);ok(miss.length==0,'bingkai tak terpakai: '+miss.slice(0,3))}
console.log(`${n} asersi, ${fail} gagal`);process.exit(fail?1:0);
