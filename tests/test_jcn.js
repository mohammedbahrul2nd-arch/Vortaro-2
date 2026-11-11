/* v7.71: game Penghitung Jepang (jcn) — tabel bacaan 1–10 + 何, penilaian (kanji/kana/suara/ketik), sel & soal, integrasi mesin */
const V=require('./load.js');
let n=0;const ok=(c,m)=>{if(!c){console.error('GAGAL:',m);process.exit(1)}n++};
const eq=(a,b,m)=>ok(a===b,`${m}: ${a} != ${b}`);
const main=(id,x)=>V.jcRd(V.JCI[id],x)[0].r;
/* 1. tabel emas: bacaan utama 1..10 dan 何 */
const GOLD={
 hon:'いっぽん,にほん,さんぼん,よんほん,ごほん,ろっぽん,ななほん,はっぽん,きゅうほん,じゅっぽん,なんぼん',
 hiki:'いっぴき,にひき,さんびき,よんひき,ごひき,ろっぴき,ななひき,はっぴき,きゅうひき,じゅっぴき,なんびき',
 hai:'いっぱい,にはい,さんばい,よんはい,ごはい,ろっぱい,ななはい,はっぱい,きゅうはい,じゅっぱい,なんばい',
 fun:'いっぷん,にふん,さんぷん,よんぷん,ごふん,ろっぷん,ななふん,はっぷん,きゅうふん,じゅっぷん,なんぷん',
 ko:'いっこ,にこ,さんこ,よんこ,ごこ,ろっこ,ななこ,はっこ,きゅうこ,じゅっこ,なんこ',
 kai2:'いっかい,にかい,さんがい,よんかい,ごかい,ろっかい,ななかい,はっかい,きゅうかい,じゅっかい,なんがい',
 ken:'いっけん,にけん,さんげん,よんけん,ごけん,ろっけん,ななけん,はっけん,きゅうけん,じゅっけん,なんげん',
 sai:'いっさい,にさい,さんさい,よんさい,ごさい,ろくさい,ななさい,はっさい,きゅうさい,じゅっさい,なんさい',
 nin:'ひとり,ふたり,さんにん,よにん,ごにん,ろくにん,ななにん,はちにん,きゅうにん,じゅうにん,なんにん',
 nichi:'いちにち,ふつか,みっか,よっか,いつか,むいか,なのか,ようか,ここのか,とおか,なんにち',
 tsu:'ひとつ,ふたつ,みっつ,よっつ,いつつ,むっつ,ななつ,やっつ,ここのつ,とお,いくつ',
 nen:'いちねん,にねん,さんねん,よねん,ごねん,ろくねん,しちねん,はちねん,くねん,じゅうねん,なんねん',
 jikan:'いちじかん,にじかん,さんじかん,よじかん,ごじかん,ろくじかん,ななじかん,はちじかん,くじかん,じゅうじかん,なんじかん',
 soku:'いっそく,にそく,さんぞく,よんそく,ごそく,ろくそく,ななそく,はっそく,きゅうそく,じゅっそく,なんぞく',
 satsu:'いっさつ,にさつ,さんさつ,よんさつ,ごさつ,ろくさつ,ななさつ,はっさつ,きゅうさつ,じゅっさつ,なんさつ',
 kagetsu:'いっかげつ,にかげつ,さんかげつ,よんかげつ,ごかげつ,ろっかげつ,ななかげつ,はっかげつ,きゅうかげつ,じゅっかげつ,なんかげつ',
 mai:'いちまい,にまい,さんまい,よんまい,ごまい,ろくまい,ななまい,はちまい,きゅうまい,じゅうまい,なんまい',
 dai:'いちだい,にだい,さんだい,よんだい,ごだい,ろくだい,ななだい,はちだい,きゅうだい,じゅうだい,なんだい',
 to:'いっとう,にとう,さんとう,よんとう,ごとう,ろくとう,ななとう,はっとう,きゅうとう,じゅっとう,なんとう',
 chaku:'いっちゃく,にちゃく,さんちゃく,よんちゃく,ごちゃく,ろくちゃく,ななちゃく,はっちゃく,きゅうちゃく,じゅっちゃく,なんちゃく',
 sara:'ひとさら,ふたさら,さんさら,よんさら,ごさら,ろくさら,ななさら,はちさら,きゅうさら,じゅうさら,なんさら'};
for(const id in GOLD){const g=GOLD[id].split(',');for(let i=0;i<=10;i++)eq(main(id,(i+1)%11),g[i==10?10:i],id+' '+(i+1))}
/* 1b. nilai emas tahap 2 (v7.72) */
const G2={
 hatsu:'いっぱつ,にはつ,さんぱつ,よんはつ,ごはつ,ろっぱつ,ななはつ,はっぱつ,きゅうはつ,じゅっぱつ,なんぱつ',
 hai2:'いっぱい,にはい,さんぱい,よんはい,ごはい,ろっぱい,ななはい,はっぱい,きゅうはい,じゅっぱい,なんぱい',
 ho2:'いっぽ,にほ,さんぽ,よんほ,ごほ,ろっぽ,ななほ,はっぽ,きゅうほ,じゅっぽ,なんぽ',
 kiro:'いっきろ,にきろ,さんきろ,よんきろ,ごきろ,ろっきろ,ななきろ,はっきろ,きゅうきろ,じゅっきろ,なんきろ',
 en:'いちえん,にえん,さんえん,よえん,ごえん,ろくえん,ななえん,はちえん,きゅうえん,じゅうえん,なんえん',
 endama:'いちえんだま,にえんだま,さんえんだま,よえんだま,ごえんだま,ろくえんだま,ななえんだま,はちえんだま,きゅうえんだま,じゅうえんだま,なんえんだま',
 kyaku:'いっきゃく,にきゃく,さんきゃく,よんきゃく,ごきゃく,ろっきゃく,ななきゃく,はっきゃく,きゅうきゃく,じゅっきゃく,なんきゃく',
 hako:'ひとはこ,ふたはこ,さんはこ,よんはこ,ごはこ,ろくはこ,ななはこ,はちはこ,きゅうはこ,じゅうはこ,なんはこ',
 bin:'ひとびん,ふたびん,さんびん,よんびん,ごびん,ろくびん,ななびん,はちびん,きゅうびん,じゅうびん,なんびん',
 peji:'いっぺーじ,にぺーじ,さんぺーじ,よんぺーじ,ごぺーじ,ろっぺーじ,ななぺーじ,はっぺーじ,きゅうぺーじ,じゅっぺーじ,なんぺーじ',
 ji:'いちじ,にじ,さんじ,よじ,ごじ,ろくじ,ななじ,はちじ,きゅうじ,じゅうじ,なんじ',
 jo2:'いちじょう,にじょう,さんじょう,よじょう,ごじょう,ろくじょう,ななじょう,はちじょう,きゅうじょう,じゅうじょう,なんじょう',
 taba:'ひとたば,ふたたば,さんたば,よんたば,ごたば,ろくたば,ななたば,はちたば,きゅうたば,じゅうたば,なんたば',
 pasento:'いちぱーせんと,にぱーせんと,さんぱーせんと,よんぱーせんと,ごぱーせんと,ろくぱーせんと,ななぱーせんと,はちぱーせんと,きゅうぱーせんと,じゅうぱーせんと,なんぱーせんと'};
for(const id in G2){const g=G2[id].split(',');for(let i=1;i<=11;i++)eq(main(id,i%11),g[i-1],id+' '+i)}
ok(V.jcRd(V.JCI.hai2,3).some(z=>z.r=='さんばい'&&z.t==1),'敗 3 さんばい lazim');
ok(V.jcRd(V.JCI.pasento,1).some(z=>z.r=='いっぱーせんと'&&z.t==2),'% 1 sokuon diperdebatkan');
ok(V.JCC.length>=96,'tahap 2: >=96 penggolong');
for(const g of ['bg','tl','ol','al','uk','lm'])ok(V.JCC.filter(c=>c.g==g).length>=3,'kelompok '+g);
ok(V.JCC.filter(c=>c.g=='bg').length==3&&V.JCC.filter(c=>c.g=='tl').length==6&&V.JCC.filter(c=>c.g=='ol').length==7,'jumlah kelompok bg/tl/ol');
/* kanji: satuan katakana & 頁 */
{const J2=V.jcJudge;ok(J2([V.JCI.metoru],3,'A',['3メートル']).ok&&J2([V.JCI.metoru],3,'A',['三メートル']).ok,'メートル kanji/angka');
 ok(J2([V.JCI.peji],3,'A',['3頁']).ok&&J2([V.JCI.peji],3,'A',['3ページ']).ok,'頁/ページ');
 ok(J2([V.JCI.hatsu],3,'B',['さんぱつ'],'type').ok&&!J2([V.JCI.hatsu],3,'B',['さんばつ'],'type').ok,'発 3 さんぱつ saja');
 ok(J2([V.JCI.en],4,'B',['よえん'],'type').ok&&J2([V.JCI.en],4,'B',['よんえん'],'type').ok,'円 4');}
/* 2. semua penggolong: bacaan hanya hiragana, utama unik per angka, tabel lengkap, kunci unik */
ok(V.JCC.length>=48,'jumlah penggolong '+V.JCC.length);
ok(new Set(V.JCC.map(c=>c.id)).size==V.JCC.length,'id unik');
for(const c of V.JCC){ok(V.JCG[c.g],'kelompok '+c.id);ok(c.ex.length>=2&&c.ex.every(e=>e.length==3&&e[0]&&e[1]&&e[2]),'contoh '+c.id);ok(c.lv>=1&&c.lv<=5,'level '+c.id);
 const seen=new Set();
 for(let i=0;i<=10;i++){const r=V.jcRd(c,i);ok(r.length>=1&&r[0].t==0,`${c.id} ${i} utama`);
  for(const z of r){ok(/^[ぁ-んー]+$/.test(z.r),`${c.id} ${i} hiragana: ${z.r}`)}
  ok(!r.slice(1).some(z=>z.r==r[0].r),`${c.id} ${i} alt unik`);
  if(i)ok(!seen.has(r[0].r),`${c.id} bacaan utama ganda ${r[0].r}`),seen.add(r[0].r);
  const t=V.jcTab(c);ok(t.includes(r[0].r),`tabel ${c.id}`)}}
/* 3. alternatif lazim / diperdebatkan */
const alts=(id,i)=>V.jcRd(V.JCI[id],i).map(z=>z.r+':'+z.t).join();
eq(alts('hon',8),'はっぽん:0,はちほん:1','本 8');eq(alts('hon',10),'じゅっぽん:0,じっぽん:1','本 10');
eq(alts('wa',3),'さんわ:0,さんば:1,さんぱ:2','羽 3');eq(alts('wa',6),'ろくわ:0,ろっぱ:1','羽 6');
eq(alts('nin',4),'よにん:0,よんにん:2','人 4');eq(alts('nen',7),'しちねん:0,ななねん:1','年 7');eq(alts('nichi',1),'いちにち:0,ついたち:1','日 1');
eq(alts('sai',6),'ろくさい:0,ろっさい:2','歳 6');eq(alts('fun',7),'ななふん:0,しちふん:1','分 7');
/* 4. penilaian */
const J=V.jcJudge,H=V.JCI.hon,HK=V.JCI.hiki,K=V.JCI.kagetsu,T=V.JCI.tsu;
ok(J([H],3,'B',['さんぼん'],'type').ok&&J([H],3,'B',['サンボン'],'type').ok&&J([H],3,'B',['さん ぼん。'],'voice').ok,'B kana');
ok(!J([H],3,'B',['さんほん'],'type').ok&&!J([H],3,'B',['さんぽん'],'voice').ok,'B salah bunyi');
ok(!J([H],3,'B',['3本'],'type').ok&&!J([H],3,'B',['三本'],'type').ok,'B ketik: kanji tidak cukup');
ok(J([H],3,'B',['3本'],'voice').ok&&J([H],3,'B',['三本'],'voice').ok&&J([H],3,'B',['３本'],'voice').ok,'B suara: kanji/angka');
ok(!J([H],3,'B',['4本'],'voice').ok&&!J([H],3,'B',['さんぼんです?x'],'voice').ok,'B angka salah');
ok(J([H],8,'B',['はちほん'],'type').ok&&J([H],8,'B',['はっぽん'],'type').ok,'B alt lazim');
ok(J([H],8,'B',['はちほん'],'type').tier==1&&J([H],8,'B',['はっぽん'],'type').tier==0,'tier alt');
ok(J([H],3,'A',['3本'],'type').ok&&J([H],3,'A',['三本'],'voice').ok&&!J([H],3,'A',['さんぼん'],'voice').ok&&!J([H],3,'A',['3匹'],'voice').ok,'A kanji saja');
ok(J([H],0,'A',['何本'],'type').ok&&J([H],0,'B',['なんぼん'],'type').ok&&!J([H],0,'B',['なんほん'],'type').ok,'何本');
ok(J([K],3,'A',['3ヶ月'],'type').ok&&J([K],3,'A',['３か月'],'type').ok&&J([K],3,'A',['三カ月'],'type').ok&&J([K],3,'A',['3ヵ月'],'type').ok,'ヶ月 varian');
ok(J([T],3,'B',['みっつ'],'type').ok&&J([T],3,'A',['三つ'],'type').ok&&J([T],10,'B',['とお'],'type').ok&&J([T],10,'A',['十'],'voice').ok&&J([T],0,'B',['いくつ'],'type').ok,'つ');
ok(J([V.JCI.sai],5,'A',['5才'],'type').ok&&J([V.JCI.sai],5,'A',['五歳'],'voice').ok&&!J([V.JCI.sai],5,'A',['6才'],'type').ok,'歳 / 才');
ok(J([V.JCI.hon,V.JCI.ko],0,'O',['本'],'type').ok&&J([V.JCI.hon],0,'O',['ほん'],'type').ok&&J([V.JCI.hon],0,'O',['ぼん'],'type').ok&&J([V.JCI.hon],0,'O',['ろっぽん'],'voice').ok&&!J([V.JCI.hon],0,'O',['匹'],'type').ok,'O penggolong');
ok(J([HK],0,'O',['ひき'],'type').ok&&J([HK],0,'O',['びき'],'type').ok&&J([HK],0,'O',['ぴき'],'type').ok,'O varian bunyi');
ok(!J([H],3,'B',[],'type').ok&&!J([H],3,'B',['',' '],'type').ok,'kosong');
ok(J([H],3,'B',['ぶんぼう','さんぼん'],'voice').ok,'alternatif kedua dipakai');
/* putar-balik: semua penggolong × angka × arah */
for(const c of V.JCC)for(let i=0;i<=10;i++){const r=V.jcRd(c,i),kj=V.jcKan(c,i);
 for(const z of r){ok(J([c],i,'B',[z.r],'type').ok,`B ${c.id} ${i} ${z.r}`);ok(J([c],i,'B',[z.r],'voice').ok,`B suara ${c.id} ${i}`);ok(!J([c],i,'A',[z.r],'voice').ok||kj.map(V.jcNorm).includes(V.jcNorm(z.r)),`A tidak menerima kana ${c.id}`)}
 for(const k of kj){ok(J([c],i,'A',[k],'type').ok,`A ${c.id} ${i} ${k}`);ok(J([c],i,'B',[k],'voice').ok,`B-suara kanji ${c.id} ${i}`);if(!r.some(z=>V.jcNorm(z.r)==V.jcNorm(k)))ok(!J([c],i,'B',[k],'type').ok,`B-ketik tolak kanji ${c.id} ${i} ${k}`)}
 const j=i%10+1;if(i&&c.id!='tsu'&&main(c.id,j)!=main(c.id,i))ok(!J([c],i,'B',[main(c.id,j)],'type').ok,`angka salah ditolak ${c.id} ${i}`);
 ok(J([c],0,'O',[c.c],'type').ok&&J([c],0,'O',[c.b],'type').ok,`O ${c.id}`)}
/* 5. benda bersama beberapa penggolong */
ok(V.JCOBJ['りんご'].includes('ko')&&V.JCOBJ['りんご'].includes('tsu'),'りんご 個/つ');
/* 6. sel & soal */
const all=V.jcCells({modes:['rd','cnt','obj','nan'],dir:'M'});ok(all.length>0&&new Set(all.map(c=>c.k)).size==all.length&&all.every(c=>c.k.startsWith('jc|')),'kunci sel unik');
eq(V.jcCells({modes:['cnt'],dir:'A'}).length,0,'cnt tidak punya arah A');eq(V.jcCells({modes:['fr']}).length,0,'tanpa jenis soal → kosong');
const fr=V.jcCells({modes:['rd','fr'],dir:'M'}),full=V.jcCells({modes:['rd'],dir:'M'});ok(fr.length<full.length&&fr.length>0,'filter sering');
const ir=V.jcCells({modes:['rd','irr'],dir:'M'});ok(ir.length<full.length&&!ir.some(c=>c.cn=='mai'||c.cn=='dai')&&ir.some(c=>c.cn=='hon'),'filter tak beraturan');
const gr=V.jcCells({modes:['rd','g_hw'],dir:'B'});ok(gr.length==4&&gr.every(c=>c.dir=='B'),'filter kelompok hewan (4 penggolong)');
for(const cell of all)for(let r=0;r<3;r++){const q=V.jcMake(cell);ok(q&&q.L=='ja'&&q.say&&q.words&&q.key.main&&typeof q.judge=='function'&&q.ansHtml.includes('jctab'),'soal '+cell.k);
 ok(q.dir==cell.dir,'arah');if(cell.md=='cnt'||cell.md=='obj'){ok(q.noBig&&q.html.includes('jcem'),'html benda '+cell.k)}
 /* jawaban benar dari kunci lolos; arah A tidak membocorkan jawaban lewat html */
 if(cell.dir=='A')ok(!q.html,'A tanpa html');
 const c=V.JCI[cell.cn];
 if(cell.md=='rd'||cell.md=='nan'){const e=q.exp;ok(q.judge(cell.dir=='A'?V.jcKan(c,e.n):[q.say],'type').ok,'jawaban benar '+cell.k)}
 else if(cell.md=='cnt'){ok(q.judge([q.say],'type').ok,'cnt jawaban benar '+cell.k)}
 else ok(q.judge([c.c],'type').ok&&q.judge([c.b],'voice').ok,'obj jawaban benar '+cell.k)}
/* 7. integrasi mesin */
ok(V.GXL.some(g=>g.id=='jcn'&&g.lg=='ja'),'GXL memuat jcn');ok(V.VG.jcn.pre=='jc|','pre');
const o=V.GXO('jcn');ok(o.modes.join()=='rd,cnt,obj,fr'&&o.dir=='M','GXO default '+o.modes.join());
const its=V.gxItems('jcn');ok(its.length>0&&its.every(x=>x.k.startsWith('jc|')),'gxItems');
V.gxSetCur('jcn');V.gxClear();let h=V.gxView('jcn');ok(h.includes('vgin')||h.includes('vgmic'),'view');
ok(h.includes('Kelompok: Hewan'),'chip kelompok');ok(h.includes('Hanya yang sering'),'chip sering');
let st=V.gxState();ok(st.q&&st.q.g=='jcn','soal aktif');const q0=st.q;
V.vgSubmit(['xx'],'type');st=V.gxState();ok(st.r&&st.r.sc==1&&V.S.gg[q0.k],'salah → SRS');ok(V.gxView('jcn').includes('Belum tepat')&&V.gxView('jcn').includes('jctab'),'hasil salah + tabel');
V.gxAct('ggxnext');V.gxView('jcn');const q1=V.gxState().q;
const c1=V.JCI[q1.exp.c];V.vgSubmit(q1.exp.md=='obj'?[c1.c]:q1.dir=='A'?V.jcKan(c1,q1.exp.n):[q1.say],'type');ok(V.gxState().r.sc==3,'benar sc 3 ('+q1.cell+')');ok(V.gxView('jcn').includes('Benar'),'hasil benar');
const od=V.GXO('jcn');od.modes=['rd'];od.dir='A';V.gxClear();for(let i=0;i<15;i++){V.gxView('jcn');const q=V.gxState().q;ok(q.dir=='A'&&!q.html,'arah A');V.gxClear()}
ok(V.gxHub().includes('data-v=jcn'),'hub memuat jcn');
console.log(`test_jcn: ${n} cek lolos`);
