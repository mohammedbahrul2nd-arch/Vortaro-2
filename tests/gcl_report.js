/* Laporan cakupan Grammar Cloze: node tests/gcl_report.js [--list] [lang] [level]
   Tanpa --list: tabel cakupan per bahasa/level + total. Dengan --list: juga kartu yang BELUM punya soal (indeks '#n' = urutan kartu di bahasa+level itu, dipakai tools/gcl_src/*.txt). */
const V=require('./load.js');const {D,GCX,GCV,GCLG}=V;
const a=process.argv.slice(2),list=a.includes('--list'),f=a.filter(z=>!z.startsWith('--')),fl=f[0],fv=f[1];
let T=0,C=0,Q=0;const miss=[];
for(const L of GCLG){if(fl&&fl!=L)continue;
 const lv=[...new Set(D.G.filter(g=>g[1]==L).map(g=>String(g[2])))].sort((x,y)=>{const o=GCV[L];return (o.indexOf(x)+1||99)-(o.indexOf(y)+1||99)});
 for(const v of lv){if(fv&&fv!=v&&fv!=v.replace(' ',''))continue;const cs=D.G.filter(g=>g[1]==L&&String(g[2])==v);let c=0,q=0;
  cs.forEach((g,i)=>{const b=GCX[g[0]];if(b&&b.length){c++;q+=b.length}else miss.push([L,v,i,g[0],g[4]])});
  T+=cs.length;C+=c;Q+=q;console.log((L+' '+v).padEnd(10),String(c).padStart(4)+'/'+String(cs.length).padEnd(4),(cs.length?(100*c/cs.length).toFixed(1):'0.0').padStart(6)+'%',String(q).padStart(5)+' soal')}}
console.log('TOTAL'.padEnd(10),String(C).padStart(4)+'/'+String(T).padEnd(4),(T?(100*C/T).toFixed(1):'0.0').padStart(6)+'%',String(Q).padStart(5)+' soal');
if(list){console.log('\nBelum tercakup ('+miss.length+'):');for(const m of miss)console.log(m[0]+' '+m[1]+' #'+m[2]+' '+m[3].split('|').slice(3).join('|'))}
