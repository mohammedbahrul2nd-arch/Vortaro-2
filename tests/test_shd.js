/* Uji Game 4 (Shadowing): srSim/srDiff/srJudgeSim, pool kalimat, pembuat soal shd_<lang>, alur tampilan/penilaian. node tests/test_shd.js */
const V=require('./load.js');
const {srSim,srDiff,srJudgeSim,srShNorm,shPool,shCells,shMake,shSplit,shCls,VG,GXL,GXO,gxSetCur,gxView,gxState,vgSubmit,vgAct,vgNext,gxItems}=V;
let n=0;const T=(c,m)=>{n++;if(!c){console.log('GAGAL',m);process.exitCode=1}};
const LG=['zh','ja','de','nl','en','eo'];
/* 1 srSim */
const E=[['Ich gehe heute ins Kino.','ich gehe heute ins kino','de',100],['Where is the station?','where is the station','en',100],['Mi havas ok krajonojn.','mi havas ok krayonoyn','eo',100],
 ['Ik bind mijn schoenen.','ik bind mijn schoenen','nl',100],['我爱吃包子。','我爱吃包子','zh',100],['寒くなります。','さむくなります','ja',71],['寒くなります。','サムクナリマス','ja',71]];
for(const [a,b,l,v] of E)T(srSim(a,b,l)===v,`srSim ${l} "${b}" = ${srSim(a,b,l)} (harap ${v})`);
T(srSim('Ich gehe heute ins Kino.','ich gehe morgen ins theater','de')<60,'beda jauh rendah');
T(srSim('Ich gehe heute ins Kino.','ich gehe heute ins kina','de')>=80,'satu huruf beda lolos');
T(srSim('a b','','en')===0&&srSim('','a','en')===0,'kosong 0');
T(srSim('Es ist heiß.','es ist heiss','de')>=80,'ß≈ss');
T(srSim('我爱吃包子。','我爱吃饺子','zh')===80,'zh satu karakter beda');
T(srSim("I don't know.",'i dont know','en')===100,'apostrof diabaikan');
/* 2 srDiff */
let d=srDiff('Ich gehe heute ins Kino.','ich gehe morgen ins kino','de');
T(d.parts.map(p=>p.s).join('')=='11011','diff de '+JSON.stringify(d.parts));T(d.extra.join()=='morgen','extra morgen');
d=srDiff('我爱吃包子。','我爱吃饺子','zh');T(d.parts.map(p=>p.s).join('')=='111012','diff zh');T(d.cj,'cj');
d=srDiff('Hello world.','','en');T(d.parts.every(p=>p.s==0),'kosong semua salah');
d=srDiff('Hello world.','hello world','en');T(d.parts.every(p=>p.s==1)&&!d.extra.length,'sempurna');
/* 3 srJudgeSim */
let j=srJudgeSim(['ich gehe morgen ins kino','ich gehe heute ins kino'],'Ich gehe heute ins Kino.','de',80);T(j.ok&&j.got.sim==100,'alternatif terbaik dipakai');
j=srJudgeSim(['halo'],'Ich gehe heute ins Kino.','de',80);T(!j.ok,'salah ditolak');T(!srJudgeSim([],'x y z','en').ok,'tanpa alt');
j=srJudgeSim(['我爱吃饺子'],'我爱吃包子。','zh',90);T(!j.ok,'ketat 90 menolak 80');
/* 4 shSplit / shCls */
T(JSON.stringify(shSplit('我爱吃包子。 (Saya suka makan bakpao.)','zh'))=='{"f":"我爱吃包子。","t":"Saya suka makan bakpao."}','split zh');
T(shSplit('寒くなります。(Menjadi dingin.)','ja').f=='寒くなります。','split ja');
T(shSplit('Ich habe 2 Brüder.','de')==null,'digit ditolak');T(shSplit('ĉevalo – ĝardeno','eo')==null,'daftar kata ditolak');
T(shSplit('我 是 学生。','zh').f=='我是学生。','spasi zh dibuang');
T(shCls(3,'en')=='s'&&shCls(6,'en')=='m'&&shCls(11,'en')=='l'&&shCls(2,'en')==null&&shCls(26,'en')==null,'kelas en');
T(shCls(3,'zh')==null&&shCls(8,'zh')=='s'&&shCls(9,'zh')=='m'&&shCls(17,'zh')=='l','kelas zh');
/* 5 pool, sel, soal */
for(const l of LG){const p=shPool(l);T(p.length>1000,l+' pool '+p.length);T(shPool(l)===p,l+' cache');
 const ks=new Set(p.map(x=>x.k));T(ks.size==p.length,l+' kunci unik');T(p.every(x=>x.k.startsWith('sh|'+l+'|')),l+' awalan');
 T(p.every(x=>x.f&&!/[0-9]/.test(x.f)),l+' tanpa digit');
 const v=VG['shd_'+l];T(v&&v.pre=='sh|'+l+'|'&&GXL.some(z=>z.id=='shd_'+l&&z.lg==l),l+' terdaftar');
 const o=GXO('shd_'+l);T(o.hide=='1'&&o.thr=='80'&&o.dir=='A','default '+l);
 const cs=v.cells(o);T(cs.length>500,l+' sel default '+cs.length);
 for(const m of['s','m','l']){const c=v.cells(Object.assign({},o,{modes:[m]}));T(c.every(x=>x.c==m),l+' kelas '+m)}
 T(v.cells(Object.assign({},o,{modes:[]})).length==0,l+' tanpa mode kosong');
 const lv=[...new Set(p.map(x=>x.lv).filter(Boolean))][0];const cl=v.cells(Object.assign({},o,{modes:['s','m','l'],lv}));T(cl.length>0&&cl.every(x=>x.lv==lv),l+' filter level '+lv);
 T(v.cells(Object.assign({},o,{src:'g',modes:['s','m','l']})).every(x=>x.s=='g'),l+' sumber g');
 for(let i=0;i<60;i++){const c=cs[Math.random()*cs.length|0],q=v.make(c);
  T(q&&q.L==l&&q.dir=='A'&&q.say==c.f&&q.words==c.f&&typeof q.judge=='function'&&q.key.main==c.f,l+' soal');
  const r=q.judge([c.f],'voice');T(r.ok&&r.got.sim==100,l+' jawab benar '+c.f);
  T(q.judge(['zzz qqq'],'voice').ok===false,l+' jawab salah');
  T(q.judge(['ok'],'self').ok&&!q.judge(['no'],'self').ok,l+' swa-nilai');
  const h=q.resHtml({sc:3,heard:c.f,got:r.got,skip:false});T(/shs/.test(h)&&/shd/.test(h)&&/ggxvagain/.test(h),l+' resHtml')}}
/* 6 sumber Pustaka & kartu lemah */
V.S.sl=[{id:'1',L:'de',f:'Ich lerne jeden Tag Deutsch.',r:'',i:'Saya belajar bahasa Jerman setiap hari.'},{id:'2',L:'en',f:'Hi',r:'',i:''}];
let o=Object.assign({},GXO('shd_de'),{src:'p',modes:['s','m','l']});let c=shCells('de',o);T(c.length==1&&c[0].s=='p'&&c[0].t.startsWith('Saya'),'sumber Pustaka');
const ck=shPool('de').find(x=>x.ck).ck;V.S.srs={[ck]:{t:1}};o=Object.assign({},GXO('shd_de'),{weak:'1',modes:['s','m','l']});c=shCells('de',o);T(c.length>0&&c.every(x=>x.ck==ck),'kartu lemah');
V.S.srs={};T(shCells('de',o).length==0,'tanpa lemah kosong');V.S.sl=[];
/* 7 alur tampilan & penilaian */
for(const l of['de','zh','eo','ja','nl','en']){V.S.gg={};V.gxSetCur('shd_'+l);V.gxClear();let h=V.gxView('shd_'+l);T(typeof h=='string'&&h.length>200,l+' view');T(/vgmic|ggxvself|vgin/.test(h),l+' kontrol jawab');
 T(!/Arah soal/.test(h),l+' tanpa arah');T(/Sumber kalimat/.test(h)&&/Kecepatan suara/.test(h)&&/Putar lambat/.test(h),l+' pengaturan & lambat');
 let st=V.gxState();const q=st.q;T(q&&q.g=='shd_'+l&&q.k.startsWith('sh|'+l+'|')&&q.peek===false,l+' soal aktif, teks tersembunyi');
 T(!h.includes(q.words),l+' teks target tidak bocor sebelum jawab');
 V.vgSubmit([q.words],'voice');st=V.gxState();T(st.r.sc==3&&V.S.gg[q.k],l+' benar → SRS');h=V.gxView('shd_'+l);T(/Benar/.test(h)&&/shbar/.test(h)&&/ggxvagain/.test(h)&&h.includes(q.words.replace(/&/g,'&')),l+' hasil benar');
 V.vgAct('ggxvagain');st=V.gxState();T(!st.r&&st.q===q,l+' ulangi tanpa ganti soal');
 const before=JSON.stringify(V.S.gg[q.k]);V.vgSubmit(['zzz'],'voice');T(JSON.stringify(V.S.gg[q.k])==before,l+' latihan bebas tidak ubah jadwal');
 V.gxAct('ggxnext');V.gxView('shd_'+l);const q2=V.gxState().q;V.vgSubmit(['sama sekali beda xyz'],'type');T(V.gxState().r.sc==1&&/Belum tepat/.test(V.gxView('shd_'+l)),l+' salah → sc 1')}
/* swa-nilai (eo tanpa STT di uji, atau opsi) */
{V.S.gg={};const o=GXO('shd_de');o.self='s';V.gxSetCur('shd_de');V.gxClear();let h=V.gxView('shd_de');T(/ggxvself/.test(h)&&!/vgmic/.test(h)&&!/id=vgin/.test(h),'swa-nilai: tombol sudah/perlu ulang');
 V.vgAct('ggxvself',null,'ok');T(V.gxState().r.sc==3,'swa-nilai ok → 3');h=V.gxView('shd_de');T(/Penilaian sendiri/.test(h),'hasil swa-nilai');
 V.gxAct('ggxnext');V.gxView('shd_de');V.vgAct('ggxvself',null,'no');T(V.gxState().r.sc==1,'swa-nilai tidak → 1');o.self='a'}
{const o=GXO('shd_eo');T(shMake(shPool('eo').find(x=>x.c=='s')).self===true,'eo tanpa STT → swa-nilai otomatis')}
/* opsi tampil teks & kosong */
{const o=GXO('shd_en');o.hide='0';V.gxSetCur('shd_en');V.gxClear();V.gxView('shd_en');T(V.gxState().q.peek===true,'tampilkan teks → peek');o.hide='1';
 o.weak='1';V.gxClear();T(/Belum ada kata kartu lemah/.test(V.gxView('shd_en')),'pesan kosong kartu lemah');o.weak='0'}
/* aksi ggxvset */
{V.gxSetCur('shd_de');V.gxAct('ggxvset','spd','0.7');T(GXO('shd_de').spd=='0.7','ggxvset spd');V.gxAct('ggxvset','spd','1')}
console.log(n+' cek selesai');
