/* v7.34: game Phrasal Verbs Inggris (phv) — data, soal, pendaftaran */
const fs=require('fs'),path=require('path');
const V=require('./load.js');
let n=0;const ok=(c,m)=>{if(!c){console.error('GAGAL:',m);process.exit(1)}n++};
const A=V.phAll();
ok(A.length>=150,'minimal 150 phrasal verb: '+A.length);
ok(A.reduce((a,x)=>a+x.ss.length,0)>=850,"total kalimat >= 850");
ok(new Set(A.map(x=>x.v)).size==A.length,'verba unik');
ok(new Set(A.map(x=>x.ar)).size==A.length,'arti unik (agar opsi tidak ganda)');
A.forEach(x=>{ok(x.v&&x.p&&x.ar&&x.s&&x.tr,'field lengkap: '+x.v);
 ok(x.ss.length>=5,'minimal 5 kalimat per verba: '+x.v+' ('+x.ss.length+')');ok(new Set(x.ss.map(t=>t.s)).size==x.ss.length,'kalimat unik: '+x.v);
 x.ss.forEach(t=>{ok(t.s.split('{').length==2&&t.s.split('}').length==2,'satu blank: '+t.s);ok((t.s.match(/\{([^}]+)\}/)||[])[1]==x.p,'partikel kalimat sama dengan data: '+t.s);ok(t.tr&&t.tr.length>6&&!/[{}]/.test(t.tr),'terjemahan: '+t.s)});
 ok(/\{[^}]+\}/.test(x.s)&&x.s.split('{').length==2,'tepat satu blank: '+x.v);
 ok(x.pt==x.p,'partikel kalimat = partikel data: '+x.v);
 ok(x.v.endsWith(' '+x.p),'verba berakhir dengan partikel: '+x.v);
 ok(!/[{}]/.test(x.tr)&&x.tr.length>8,'terjemahan wajar: '+x.v)});
ok(V.GXO('phv').modes.join()=='pt,ar','opsi default');
const cells=V.gxItems('phv');ok(cells.length==A.length*2,'dua mode per item');
ok(new Set(cells.map(c=>c.k)).size==cells.length,'kunci SRS unik');ok(cells.every(c=>c.k.startsWith('ph|')),'prefix ph|');
V.GXO('phv').modes=['pt'];ok(V.gxItems('phv').length==A.length,'mode pt saja');V.GXO('phv').modes=['ar'];ok(V.gxItems('phv').length==A.length,'mode ar saja');V.GXO('phv').modes=['pt','ar'];
for(let r=0;r<400;r++){const q=V.gxNext('phv');ok(q&&q.g=='phv','soal terbentuk');const b=q.blanks[0];
 ok(b.opts.includes(b.ok[0]),'jawaban ada di opsi');ok(new Set(b.opts).size==b.opts.length,'opsi tanpa duplikat');ok(b.opts.length>=4&&b.opts.length<=6,'jumlah opsi 4-6: '+b.opts.length);
 ok(q.L=='en'&&typeof q.say()=='string','bahasa TTS en');ok(q.sel.length==1,'sel dibuat');
 if(q.cell.includes('partikel')){ok(q.parts.length==3&&q.parts[1]===0,'bentuk rumpang');ok(q.parts[0]+b.ok[0]+q.parts[2]==q.fullTxt,'kalimat penuh cocok: '+q.fullTxt);ok(q.x.ss.some(t=>V.phFull(t)==q.fullTxt),'kalimat berasal dari daftar verba');
  const bad=b.opts.filter(o=>o!=b.ok[0]),vb=q.x.v.slice(0,q.x.v.length-q.x.p.length).trim();
  ok(bad.every(o=>!A.some(z=>z.v==vb+' '+o)),'pengecoh bukan kombinasi valid di data: '+q.x.v);
  ok(!q.x.p.includes(' ')||b.opts.some(o=>o!=q.x.p&&o.includes(' ')),'partikel dua kata punya pengecoh dua kata')}
 else{ok(q.parts.length==1&&/^[^{}]+$/.test(q.parts[0]),'kalimat utuh tanpa blank');ok(b.ok[0]==q.x.ar,'kunci = arti');ok(b.opts.every(o=>A.some(z=>z.ar==o)),'opsi dari data')}}
/* penilaian */
const q=V.gxNext('phv');q.sel[0].add(q.blanks[0].ok[0]);ok(V.gxScore(q)==3,'benar = 3');q.sel[0].clear();q.sel[0].add(q.blanks[0].opts.find(o=>o!=q.blanks[0].ok[0]));ok(V.gxScore(q)==1,'salah = 1');
/* pendaftaran */
const src=f=>fs.readFileSync(path.join(__dirname,'..','docs',f),'utf8');
ok(/id:'phv'[^}]*lg:'en'/.test(src('js/games2.js')),'GXL phv lg en');
ok(/phv:\['ph\|'\]/.test(src('js/games2.js')),'prefix reset ggxrst');ok(/g=='phv'\)h\+=gxChips/.test(src('js/games2.js')),'gxSettings phv');
ok(src('index.html').includes('js/gamedata2.js'),'index.html memuat gamedata2.js');ok(src('sw.js').includes("'js/gamedata2.js'"),'sw.js SHELL memuat gamedata2.js');
ok(src('index.html').indexOf('gamedata2.js')<src('index.html').indexOf('games2.js'),'gamedata2 dimuat sebelum games2');
console.log('test_phv OK',n);
