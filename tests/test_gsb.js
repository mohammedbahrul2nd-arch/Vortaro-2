/* Uji kalimat bawaan kartu grammar (GSB): kartu ada, <=15 kalimat, kunci tepat sekali, sorotan Indonesia ada di arti, tanpa teks aneh. node tests/test_gsb.js */
const fs=require('fs'),path=require('path'),vm=require('vm');const V=require('./load.js');
const dir=path.join(__dirname,'..','docs','js');const GSB={};
const files=fs.readdirSync(dir).filter(f=>/^gsb-.+\.js$/.test(f));
for(const f of files)vm.runInNewContext(fs.readFileSync(path.join(dir,f),'utf8'),{GSB,Object});
const gk={};V.D.G.forEach(g=>gk[g[0]]=g);let bad=0,n=0,full=0;const F=m=>{bad++;console.log('GAGAL',m)};
for(const k in GSB){const g=gk[k];if(!g){F('kartu tak ada '+k);continue}const L=g[1],cj=L=='zh'||L=='ja',a=GSB[k];
 if(a.length>15)F('>15 '+k);if(a.length==15)full++;const seen=new Set();
 for(const [f,r,i,s,d] of a){n++;const t=cj?f.replace(/\s+/g,''):f;
  if(seen.has(f))F('ganda '+f);seen.add(f);
  if(!/[。！？.!?]$/.test(f))F('akhir '+f);
  if(L=='zh'&&(!r||/\?/.test(r.replace(/[?]$/,''))))F('pinyin '+f+' '+r);
  if(L=='zh'&&/[A-Za-z]/.test(f))F('latin '+f);
  let p=0;for(const x of s.split(/\s*…\s*/)){const j=t.indexOf(x);if(j<0||t.indexOf(x,j+1)>=0||j<p){F('kunci '+x+' di '+f);break}p=j+x.length}
  if(d){let q=0;const lo=i.toLowerCase();for(const x of d.split(/\s*…\s*/)){const j=lo.indexOf(x.toLowerCase(),q);if(j<0){F('sorotan '+d+' di '+i);break}q=j+x.length}}
  if(/undefined|NaN|null|\[object/.test(f+r+i))F('teks aneh '+f)}}
console.log(`${files.length} berkas, ${Object.keys(GSB).length} kartu (${full} penuh), ${n} kalimat`+(bad?`, ${bad} GAGAL`:' — lulus'));process.exit(bad?1:0);
