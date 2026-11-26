/* Uji tampilan & soal rumpang kalimat bawaan KOSAKATA (GSK): blok «📘 Contoh kalimat», kandidat rumpang tanpa Pustaka, rotasi. node tests/test_gsk_cloze.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};const noop=()=>{};
const ctx={confirm:()=>true,toast:noop,libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,VRS:{save:noop},esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};";
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('gsk-ja-N3.js')+'\nconst ik=(k,l)=>k+SEP+l;\n;this.X={GSK,gskFull,gskRows,gmCollect,gmExBlock,gzvCands,gzvPick,gzvFront,gzvBack,gsrInfo};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;let bad=0;const F=m=>{bad++;if(bad<25)console.log('GAGAL',m)};
const keys=Object.keys(X.GSK);let withC=0,tot=0,minC=1e9,blocks=0;
for(const k of keys){if(!X.gskFull(k)){F('gskFull salah '+k);continue}
 const rows=X.gmCollect(k,true);if(rows.length!==X.GSK[k].length)F('gmCollect jumlah '+k);
 const c=X.gzvCands(k);tot+=c.length;if(c.length)withC++;
 if(c.length){const p=X.gzvPick(k);if(!p||p.d!=='f'||!p.sp.length)F('gzvPick '+k);else{const a=X.gzvFront(p),b=X.gzvBack(p);if(!/kalimat bawaan/.test(a)||!/Kalimat bawaan/.test(b))F('label '+k);if(/undefined|NaN/.test(a+b))F('teks aneh '+k)}}
 const h=X.gmExBlock(k);if(/📘 Contoh kalimat/.test(h))blocks++;else F('blok contoh hilang '+k)}
/* rotasi: semua kandidat muncul sebelum ada yang berulang */
const rk=keys.find(k=>X.gzvCands(k).length>=5);if(rk){const n=X.gzvCands(rk).length,seen=new Set();for(let i=0;i<n;i++){const p=X.gzvPick(rk);if(seen.has(p.f))F('rotasi ulang '+rk);seen.add(p.f)}}
const pct=Math.round(withC/keys.length*100);if(pct<60)F('cakupan rumpang rendah '+pct+'%');
console.log(`${keys.length} kartu GSK; ${withC} (${pct}%) punya >=1 soal rumpang; rata-rata ${(tot/Math.max(withC,1)).toFixed(1)} soal/kartu; blok contoh ${blocks}`+(bad?`, ${bad} GAGAL`:' — lulus'));process.exit(bad?1:0);
