/* Uji rotasi kalimat bawaan kartu grammar (gsrPick/gsrInfo/gsrReset di gram.js). node tests/test_gsr.js */
const fs=require('fs'),path=require('path'),vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'..','docs','js','gram.js'),'utf8');
const a=src.indexOf('function gsrPick'),b=src.indexOf('function gsrReset');const e=src.indexOf('\n',b);
if(a<0||b<0)throw new Error('fungsi gsr tidak ditemukan');
let saves=0;const S={o:{}};
const ctx={S,VRS:{save(){saves++}},Math,Array,Set,Object,gsbFull:()=>true,gsbRows:()=>Array.from({length:13},(_,i)=>i)};
vm.createContext(ctx);vm.runInContext(src.slice(a,e)+';this.X={gsrPick,gsrInfo,gsrReset}',ctx);const X=ctx.X;
let bad=0;const F=m=>{bad++;console.log('GAGAL',m)};
const mk=n=>Array.from({length:n},(_,i)=>({f:'kalimat '+i,w:1}));
const c=mk(13),k='de_A1#0';
let prev=null;
for(let cyc=0;cyc<30;cyc++){
 const seen=new Set();
 for(let i=0;i<13;i++){const p=X.gsrPick(k,c);
  if(seen.has(p.f))F('ulang dalam satu putaran '+p.f+' putaran '+cyc);seen.add(p.f);
  if(i==0&&prev&&p.f===prev)F('kalimat terakhir putaran lama jadi pertama baru');
  if(X.gsrInfo(k).n!==i+1)F('penanda tidak sesuai '+i);prev=p.f}
 if(seen.size!==13)F('tidak semua kalimat tampil putaran '+cyc)}
if(!saves)F('tidak menyimpan');
/* kandidat berubah (kalimat dihapus) → tetap benar */
X.gsrReset(k);const c2=mk(13);X.gsrPick(k,c2);X.gsrPick(k,c2);const c3=c2.slice(2);const s3=new Set();
for(let i=0;i<40;i++){const p=X.gsrPick(k,c3);if(!c3.some(x=>x.f===p.f))F('memilih non-kandidat');s3.add(p.f)}
if(s3.size!==c3.length)F('tidak semua kandidat muncul');
/* satu kandidat saja tidak macet */
X.gsrReset();for(let i=0;i<5;i++){if(X.gsrPick('x',mk(1)).f!=='kalimat 0')F('satu kandidat')}
/* reset satu kartu & semua */
X.gsrPick('a',c);X.gsrPick('b',c);X.gsrReset('a');if(X.gsrInfo('a').n!==0||X.gsrInfo('b').n!==1)F('reset satu kartu');
X.gsrReset();if(X.gsrInfo('b').n!==0)F('reset semua');
/* state rusak */
S.o.gsr={z:'bukan array'};if(!X.gsrPick('z',c))F('state rusak');
console.log('rotasi kalimat bawaan'+(bad?`, ${bad} GAGAL`:' — lulus'));process.exit(bad?1:0);
