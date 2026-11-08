/* v7.35: game Trennbare Verben Jerman (dtv) — data, soal, pendaftaran */
const fs=require('fs'),path=require('path');
const V=require('./load.js');
let n=0;const ok=(c,m)=>{if(!c){console.error('GAGAL:',m);process.exit(1)}n++};
const A=V.dtAll(),T=A.filter(x=>x.t=='T'),U=A.filter(x=>x.t=='U');
ok(T.length>=150&&U.length>=79&&A.length>=229,`jumlah verba T${T.length} U${U.length}`);
ok(new Set(A.map(x=>x.inf)).size==A.length,'infinitif unik');
const dtW=s=>(s.match(/(?:^|[ ,])\{[^}]+\}[\wäöüÄÖÜß]*/)||[''])[0].replace(/^[ ,]/,'').replace(/[{}]/g,'');
const aux=/^(hat|ist) \S+$/;
A.forEach(x=>{ok(x.inf&&x.pre&&x.ar&&x.perf&&x.zu,'field lengkap: '+x.inf);ok(aux.test(x.perf),'format Perfekt: '+x.inf);ok(x.inf.startsWith(x.pre),'infinitif diawali prefiks: '+x.inf);
 const pp=x.perf.split(' ')[1],r=x.inf.slice(x.pre.length);
 if(x.t=='T'){ok(x.ss.length>=5,'T minimal 5 kalimat: '+x.inf);ok(x.zu==x.pre+'zu'+r,'zu-Inf trennbar: '+x.inf+' '+x.zu);ok(pp.startsWith(x.pre+'ge')||(/^(be|ver|er|ent|emp|ge|zer|miss)|ieren$/.test(r)&&pp.startsWith(x.pre)),'partisip trennbar memuat -ge- (kecuali batang berprefiks tak-bertekanan): '+x.inf);
  x.ss.forEach(t=>{ok(t.s.split('{').length==2&&t.s.split('}').length==2,'satu blank: '+t.s);ok((t.s.match(/\{([^}]+)\}/)||[])[1]==x.pre,'prefiks kalimat = data: '+t.s);ok(t.tr.length>6&&!/[{}]/.test(t.tr),'terjemahan: '+t.s);
   ok(/[.?!]$/.test(t.s),'diakhiri tanda baca: '+t.s);ok(new RegExp('\\{'+x.pre+'\\}[.?!]$|\\{'+x.pre+'\\}[ ,]').test(t.s),'prefiks di akhir klausa: '+t.s)})}
 else{ok(x.ss.length>=4,'U minimal 4 kalimat: '+x.inf);ok(x.zu=='zu '+x.inf,'zu-Inf untrennbar: '+x.inf);ok(!pp.startsWith('ge')||x.pre=='ge','partisip untrennbar tanpa ge-: '+x.inf);ok(['be','emp','ent','er','ge','miss','ver','zer'].includes(x.pre),'prefiks untrennbar baku: '+x.inf);
  x.ss.forEach(t=>{ok(t.s.split('{').length==2&&t.s.split('}').length==2,'U: satu penanda prefiks: '+t.s);const m=(t.s.match(/\{([^}]+)\}/)||[])[1]||'';ok(m.toLowerCase()==x.pre,'U: penanda = prefiks: '+t.s);ok(!/[{}]/.test(t.tr)&&t.tr.length>6,'U: terjemahan: '+t.s);
   ok(/[.?!]$/.test(t.s),'U: diakhiri tanda baca: '+t.s);
   /* kalimat harus klausa utama (V1/V2), bukan anak kalimat: kalau tidak, prefiks trennbar bisa menempel dan jadi jawaban kedua */
   ok(!/\b(dass|weil|wenn|ob|damit|obwohl|bevor|nachdem|während|sobald|falls)\b/i.test(t.s.replace(/\{|\}/g,'')),'U: bukan anak kalimat: '+t.s);
   const w=dtW(t.s);ok(w&&w.toLowerCase().startsWith(x.pre+r[0]),'U: kata verba diawali prefiks+stem: '+t.s)})}});
ok(A.reduce((a,x)=>a+x.ss.length,0)>=1060,"total kalimat >= 1060");
ok(new Set(A.flatMap(x=>x.ss.map(t=>t.s))).size==A.reduce((a,x)=>a+x.ss.length,0),'semua kalimat unik');
ok(V.GXO('dtv').modes.join()=='pf,pe,zu,tu','opsi default');
const cells=V.gxItems('dtv');ok(cells.length==4*A.length,'jumlah sel '+cells.length);
ok(new Set(cells.map(c=>c.k)).size==cells.length,'kunci SRS unik');ok(cells.every(c=>c.k.startsWith('dv|')),'prefix dv|');
const seen={pf:0,pe:0,zu:0,tu:0,pfT:0,pfU:0};
for(let r=0;r<800;r++){const q=V.gxNext('dtv');ok(q&&q.g=='dtv','soal terbentuk');const b=q.blanks[0],m=q.k.split('|')[1];seen[m]++;
 ok(b.opts.includes(b.ok[0]),'jawaban ada di opsi: '+q.k);ok(new Set(b.opts).size==b.opts.length,'opsi unik: '+q.k);ok(q.L=='de','TTS de');ok(q.sel.length==1,'sel');
 ok(typeof q.fullTxt=='string'&&q.fullTxt.length>0&&q.expl.length>0,'hasil lengkap');
 if(m=='pf'){ok(q.parts.length==3&&q.parts[1]===0,'bentuk rumpang');ok(q.parts[0]+b.ok[0]+q.parts[2]==q.fullTxt,'kalimat penuh cocok');ok(q.x.ss.some(t=>V.dtFull(t)==q.fullTxt),'kalimat berasal dari daftar');
  const stem=q.x.inf.slice(q.x.pre.length),dis=b.opts.filter(o=>o!=b.ok[0]).map(o=>o.toLowerCase());seen.pfT+=q.x.t=='T'?1:0;seen.pfU+=q.x.t=='U'?1:0;
  ok(dis.every(o=>!A.some(z=>z.inf==o+stem)),'pengecoh bukan verba valid di data: '+q.x.inf);ok(b.opts.length==6,'6 opsi prefiks');
  ok(dis.every(o=>!V.DTA.includes(o)),'tanpa prefiks ambigu trennbar/untrennbar (um-, durch-, über- …): '+q.x.inf);
  if(q.x.t=='U'){ok(dis.filter(o=>V.DTUP.includes(o)).every(o=>V.DTR[stem]&&!V.DTR[stem].includes(o)),'pengecoh untrennbar bukan kata nyata (DTR): '+q.x.inf);ok(dis.filter(o=>V.DTUP.includes(o)).length>=1,'U: minimal 1 pengecoh untrennbar: '+q.x.inf);ok(q.parts[0]===''||/\s$|^$/.test(q.parts[0]),'U: blank di awal kata verba');ok(/^[a-zäöüß]/.test(q.parts[2]),'U: sisa kata verba menempel: '+q.fullTxt)}
  else{ok(dis.every(o=>!(V.DTX[stem]||[]).includes(o)),'T: pengecoh bukan prefiks nyata utk stem produktif (DTX): '+q.x.inf);ok(!V.DTG.includes(q.x.pre)||dis.every(o=>!V.DTG.includes(o)),'T: tanpa pengecoh sekeluarga arah: '+q.x.inf);ok(/[.?!]$/.test(q.parts[2])||/^[ ,]/.test(q.parts[2]),'T: blank di akhir klausa');ok(dis.some(o=>V.DTUP.includes(o)),'T: ada pengecoh untrennbar (campur)')}}
 if(m=='pe'){ok(b.ok[0]==q.x.perf,'kunci Perfekt');ok(b.opts.length>=4&&b.opts.length<=5,'opsi Perfekt: '+b.opts.length);
  ok(b.opts.every(o=>o==q.x.perf||!/^(hat|ist) /.test(o)||o!=('ist '+q.x.perf.split(' ')[1])),'tidak ada pengecoh ist+pp yang mungkin Zustandspassiv')}
 if(m=='zu'){ok(b.ok[0]==q.x.zu,'kunci zu-Inf');ok(b.opts.length>=4&&b.opts.length<=5,'opsi zu: '+b.opts.length)}
 if(m=='tu'){ok(b.opts.join()=='trennbar,untrennbar','dua opsi');ok(b.ok[0]==(q.x.t=='T'?'trennbar':'untrennbar'),'kunci jenis')}}
ok(seen.pfU>20&&seen.pfT>20,'pf mencampur trennbar & untrennbar '+JSON.stringify(seen));ok(Object.values(seen).every(c=>c>20),'semua jenis soal muncul '+JSON.stringify(seen));
/* konsistensi tabel DTR dengan data: setiap verba U terdaftar, dan setiap kombinasi prefiks+stem yang ada di data tercatat */
U.forEach(x=>{const st=x.inf.slice(x.pre.length);ok(V.DTR[st]&&V.DTR[st].includes(x.pre),'DTR memuat stem+prefiks: '+x.inf)});
A.forEach(x=>V.DTUP.forEach(p=>{const st=x.inf.slice(p.length);if(x.inf.startsWith(p)&&V.DTR[st]&&A.some(z=>z.inf==x.inf))ok(V.DTR[st].includes(p),'DTR lengkap utk '+x.inf)}));
ok(Object.entries(V.DTR).every(([k,v])=>v.every(p=>V.DTUP.includes(p))),'DTR hanya prefiks untrennbar');
ok(!A.some(x=>x.t=='T'&&V.DTA.includes(x.pre)&&x.pre!='um'),'prefiks ambigu hanya um- di data trennbar');
A.filter(x=>x.t=='T').forEach(x=>{const st=x.inf.slice(x.pre.length);if(V.DTX[st])ok(V.DTX[st].includes(x.pre),'DTX memuat prefiks data: '+x.inf)});
ok(A.filter(x=>x.t=='T').every(x=>{for(let i=0;i<30;i++){const o=V.dtMake({k:'k',m:'pf',x}).blanks[0].opts;if(o.length!=6||new Set(o).size!=6)return false}return true}),'selalu 6 opsi unik (T)');
ok(A.filter(x=>x.t=='U').every(x=>{for(let i=0;i<30;i++){const o=V.dtMake({k:'k',m:'pf',x}).blanks[0].opts;if(o.length!=6||new Set(o).size!=6)return false}return true}),'selalu 6 opsi unik (U)');
const q=V.gxNext('dtv');q.sel[0].add(q.blanks[0].ok[0]);ok(V.gxScore(q)==3,'benar = 3');q.sel[0].clear();q.sel[0].add(q.blanks[0].opts.find(o=>o!=q.blanks[0].ok[0]));ok(V.gxScore(q)==1,'salah = 1');
const src=f=>fs.readFileSync(path.join(__dirname,'..','docs',f),'utf8'),g2=src('js/games2.js');
ok(/id:'dtv'[^}]*lg:'de'/.test(g2),'GXL dtv lg de');ok(/dtv:\['dv\|'\]/.test(g2),'prefix reset ggxrst');ok(/g=='dtv'\)h\+=gxChips/.test(g2),'gxSettings dtv');
ok(src('index.html').includes('js/gamedata3.js')&&src('sw.js').includes("'js/gamedata3.js'"),'index & sw memuat gamedata3.js');
ok(src('index.html').indexOf('gamedata3.js')<src('index.html').indexOf('games2.js'),'gamedata3 sebelum games2');
console.log('test_dtv OK',n);
