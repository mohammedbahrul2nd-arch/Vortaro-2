/* Daftar kartu + pola + contoh: node tools/gcl_cards.js <lang> "<level>" <dari> <sampai>  (mis. zh "HSK 3" 0 40) */
const V=require('../tests/load.js');
const [lang,lv,a,b]=process.argv.slice(2);
const L=V.D.G.filter(g=>g[1]==lang&&g[2]==lv);
for(let i=+a;i<=+b&&i<L.length;i++){const g=L[i];console.log('#'+i,g[4],'|',String(g[6]||'').split('\n')[0].slice(0,110),'|',(g[7]||[]).slice(0,1).map(x=>x.split('\n').join(' / ').slice(0,90)).join(''))}
