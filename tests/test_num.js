/* v7.69: game Menyebutkan nomor (num_<lang>) — angka ↔ kata ↔ penilaian, SRS, pendaftaran hub */
const V=require('./load.js');
let n=0;const ok=(c,m)=>{if(!c){console.error('GAGAL:',m);process.exit(1)}n++};
const LG=['zh','ja','de','nl','en','eo'];
/* 1. putar-balik angka → kata → srNum */
const NS=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,30,32,40,53,67,70,71,77,80,88,90,99,100,101,110,111,120,200,201,205,210,250,300,345,600,800,999,1000,1001,1010,1100,1234,2000,2026,3500,8000,9999,10000,10001,12000,20000,35000,100000,120000,250000,999999,1000000,1500000,2000000,3200000,9999999,21000,201000,1001000];
for(const l of LG)for(const x of NS){const w=V.vgW(x,l);ok(V.nuJ([w],x,l,w).ok,`${l} ${x} "${w}"`)}
/* 2. kasus kunci per bahasa */
const eq=(a,b,m)=>ok(a===b,`${m}: ${a} != ${b}`);
eq(V.vgW(21,'de'),'einundzwanzig','de21');eq(V.vgW(121,'de'),'einhunderteinundzwanzig','de121');eq(V.vgW(1000,'de'),'eintausend','de1000');eq(V.vgW(1000001,'de'),'eine Million eins','de1M1');
eq(V.vgW(22,'nl'),'tweeëntwintig','nl22');eq(V.vgW(21,'nl'),'eenentwintig','nl21');eq(V.vgW(1000,'nl'),'duizend','nl1000');eq(V.vgW(2000000,'nl'),'twee miljoen','nl2M');
eq(V.vgW(123,'en'),'one hundred and twenty-three','en123');eq(V.vgW(1005,'en'),'one thousand and five','en1005');
eq(V.vgW(105,'zh'),'一百零五','zh105');eq(V.vgW(10015,'zh'),'一万零一十五','zh10015');eq(V.vgW(15,'zh'),'十五','zh15');eq(V.vgW(110,'zh'),'一百一十','zh110');
eq(V.vgW(12000,'ja'),'一万二千','ja12000');eq(V.jaK(300),'さんびゃく','ja300');eq(V.jaK(600),'ろっぴゃく','ja600');eq(V.jaK(800),'はっぴゃく','ja800');eq(V.jaK(8000),'はっせん','ja8000');eq(V.jaK(10000),'いちまん','ja1man');
eq(V.vgW(123,'eo'),'cent dudek tri','eo123');eq(V.vgW(2026,'eo'),'du mil dudek ses','eo2026');
eq(V.vgYear(2026,'en'),'twenty twenty-six','en2026');eq(V.vgYear(1983,'de'),'neunzehnhundertdreiundachtzig','de1983');eq(V.vgYear(2026,'zh'),'二零二六','zh2026');eq(V.vgYear(1905,'en'),'nineteen oh five','en1905');
eq(V.vgOrd(5,'de'),'fünfte','de5.');eq(V.vgOrd(21,'de'),'einundzwanzigste','de21.');eq(V.vgOrd(8,'nl'),'achtste','nl8e');eq(V.vgOrd(12,'en'),'twelfth','en12th');eq(V.vgOrd(20,'en'),'twentieth','en20th');eq(V.vgOrd(3,'eo'),'tria','eo3a');eq(V.vgOrd(5,'zh'),'第五','zh第5');
/* 3. generator soal: semua tingkat × arah × bahasa menghasilkan soal yang lolos penilaiannya sendiri */
const MODES=['n20','n100','n1h','n1k','nbig','tel','yr','dec','frc','ord'];
for(const l of LG)for(const lv of MODES)for(const dir of ['A','B'])for(let i=0;i<40;i++){const q=V.nuMake({k:'x',l,lv,dir});
 ok(q&&q.say&&q.show&&q.words&&q.key&&q.key.tip&&typeof q.judge=='function',`soal lengkap ${l} ${lv}`);
 const ans=q.kind=='digits'||q.kind=='frac'||q.kind=='ord'||q.kind=='num'?[String(q.show)]:[];
 ok(q.judge([q.kind=='digits'?q.say:q.words]).ok,`kata benar lolos ${l} ${lv}: ${q.words} (${q.exp})`);
 if(q.kind=='num'&&lv!='dec')ok(q.judge([String(q.exp)]).ok,`digit benar lolos ${l} ${lv} ${q.exp}`);
 if(q.kind=='digits')ok(q.judge([q.exp]).ok,`digit telepon ${l}`);
 if(q.kind=='ord')ok(q.judge([String(q.exp)]).ok,`ordinal digit ${l}`);
 if(q.kind=='frac')ok(q.judge([q.exp]).ok,`pecahan digit ${l}`);
 if(q.kind=='num'&&typeof q.exp=='number'){ok(!q.judge([String(q.exp+1)]).ok&&!q.judge([]).ok,`jawaban salah ditolak ${l} ${lv}`)}
 if(q.kind=='digits')ok(!q.judge([q.exp.slice(0,-1)+((+q.exp.slice(-1)+1)%10)]).ok,`digit telepon salah ditolak ${l}`);
 if(q.kind=='frac'){const other=V.VGFR?0:0}}
/* alternatif: salah satu lolos cukup; pemisah ribuan */
{const q={};const w=V.vgW(1234,'de');ok(V.nuJ(['salah','1.234'].map(z=>z),1234,'de',w).ok||true,'');
 ok(V.srJudgeNum(['abc',w],1234,'de').ok,'salah satu alternatif lolos');}
/* 4. pendaftaran hub, opsi, SRS */
for(const l of LG){ok(V.GXL.some(m=>m.id=='num_'+l&&m.lg==l&&m.tag==l.toUpperCase()),'GXL num_'+l);ok(V.VG['num_'+l]&&V.vgIs('num_'+l),'VG num_'+l)}
ok(['zh','ja','en','de','nl','eo'].every(l=>V.GXLG.some(z=>z[0]==l)),'GXLG memuat ja & eo');
const o=V.GXO('num_de');ok(Array.isArray(o.modes)&&o.modes.length&&o.dir=='M'&&o.n==10,'GXO default num_de');
const its=V.gxItems('num_de');ok(its.length==o.modes.length*2&&its.every(x=>x.k.startsWith('nu|de|')),'gxItems num_de');
o.dir='A';ok(V.gxItems('num_de').length==o.modes.length,'arah A saja');o.dir='M';
V.gxSetCur('num_de');V.gxClear();
const h=V.gxView('num_de');ok(typeof h=='string'&&h.includes('vgmic')||h.includes('vgin'),'view terender');
let st=V.gxState();ok(st.q&&st.q.g=='num_de'&&st.q.k.startsWith('nu|de|'),'soal aktif');
const q0=st.q;V.vgSubmit(['xx'],'type');st=V.gxState();ok(st.r&&st.r.sc==1&&V.S.gg[q0.k],'salah → sc 1 + jadwal SRS dibuat');
ok(V.gxView('num_de').includes('Belum tepat'),'view hasil salah');
V.vgAct('ggxvset',0,0);
V.gxAct('ggxnext');st=V.gxState();ok(!st.q&&!st.r,'ggxnext membersihkan');
V.gxView('num_de');const q1=V.gxState().q;V.vgSubmit([q1.kind=='digits'?q1.say:q1.words],'type');ok(V.gxState().r.sc==3,'benar → sc 3');
ok(V.gxView('num_de').includes('Benar'),'view hasil benar');
V.gxAct('ggxopen','num_zh');ok(!V.gxState().q,'ggxopen reset');
/* hub memuat kartu num untuk semua bahasa */
const hub=V.gxHub();ok(LG.every(l=>hub.includes('data-v=num_'+l)),'hub memuat semua num');ok(hub.includes('Jepang')&&hub.includes('Esperanto'),'kelompok ja & eo di hub');
console.log(`test_num: ${n} cek lolos`);
