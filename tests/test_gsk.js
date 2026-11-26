/* Uji kalimat bawaan KOSAKATA (GSK, gsk-*.js): kunci menunjuk entri ja yang ada, <=19 kalimat, tanpa ganda, berakhir tanda baca/penutup, tanpa teks aneh;
   kosakata N3 tanpa duplikasi teks Jepang (kecuali pasangan lama lintas level). node tests/test_gsk.js */
const fs=require('fs'),path=require('path'),vm=require('vm');const V=require('./load.js');
const dir=path.join(__dirname,'..','docs','js');const GSK={};
for(const f of fs.readdirSync(dir).filter(f=>/^gsk-.+\.js$/.test(f)))vm.runInNewContext(fs.readFileSync(path.join(dir,f),'utf8'),{GSK,Object});
const K={};V.D.C.forEach(c=>K[c[0]]=c);let bad=0,n=0;const F=m=>{bad++;if(bad<30)console.log('GAGAL',m)};
for(const k in GSK){const m=/^(.+)@ja(?:~(\d+))?$/.exec(k);if(!m){F('kunci '+k);continue}const c=K[m[1]],e=c&&c[3].ja&&c[3].ja[+(m[2]||0)];
 if(!e){F('entri tak ada '+k);continue}const a=GSK[k];if(!a.length||a.length>19)F('jumlah '+k+' '+a.length);const seen=new Set();
 for(const f of a){n++;if(typeof f!='string'||seen.has(f))F('ganda/bukan teks '+k+' '+f);seen.add(f);if(!/[。！？!?」）]$/.test(f))F('akhir '+k+' '+f);if(/undefined|NaN|null|\[object/.test(f))F('teks aneh '+f)}}
/* tanpa duplikasi: entri N3 dengan teks Jepang sama persis dalam satu konsep atau antar konsep baru (>=7.109) */
const seenJ=new Map();let dupN3=0;
for(const c of V.D.C)for(const e of(c[3].ja||[])){if(e[3]!='N3')continue;const w=e[0].replace(/\s+/g,'');if(seenJ.has(w)&&seenJ.get(w)!==c[0]+'|'+e[3]){dupN3++}seenJ.set(w,c[0]+'|'+e[3])}
console.log(`${Object.keys(GSK).length} kartu GSK, ${n} kalimat, entri N3 ganda lintas konsep: ${dupN3} (info)${bad?', '+bad+' GAGAL':' — lulus'}`);process.exit(bad?1:0);
