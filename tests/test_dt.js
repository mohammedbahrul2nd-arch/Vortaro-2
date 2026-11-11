/* v7.70: game Jam & tanggal (dt_<lang>) — putar-balik kata ↔ jam/tanggal, soal semua tingkat × arah × bahasa, hook HTML, SRS, hub */
const V=require('./load.js');
let n=0;const ok=(c,m)=>{if(!c){console.error('GAGAL:',m);process.exit(1)}n++};
const LG=['zh','ja','de','nl','en','eo'],eq=(a,b,m)=>ok(a===b,`${m}: ${a} != ${b}`);
/* 1. jam: semua menit 0:00–23:59, gaya 12 jam (c) dan 24 jam (f) */
for(const l of LG){const cj=l=='zh'||l=='ja';
 for(let h=0;h<24;h++)for(let m=0;m<60;m++){
  for(let r=0;r<2;r++){const s=V.jtSay(h,m,l,'c'),e={h:cj?h:(h%12||12),m,amb:!cj};ok(V.jtJudgeT([s.words],e,l,false).ok,`${l} c ${h}:${m} "${s.words}"`)}
  if(h>=13){const s=V.jtSay(h,m,l,'f');ok(V.jtJudgeT([s.words],{h,m,amb:false},l,true).ok,`${l} f ${h}:${m} "${s.words}"`)}}}
/* 2. jam salah ditolak */
ok(!V.jtJudgeT(['halb drei'],{h:3,m:30,amb:true},'de',false).ok,'halb drei != 3:30');
ok(V.jtJudgeT(['halb drei'],{h:2,m:30,amb:true},'de',false).ok,'halb drei = 2:30');
ok(!V.jtJudgeT(['half drie'],{h:3,m:30,amb:true},'nl',false).ok,'half drie != 3:30');
ok(!V.jtJudgeT(['two thirty'],{h:14,m:30,amb:false},'en',true).ok,'24 jam strict menolak 2:30');
ok(V.jtJudgeT(['14:30'],{h:14,m:30,amb:false},'en',true).ok,'ketik 14:30');
ok(V.jtJudgeT(['下午两点半'],{h:14,m:30,amb:false},'zh',false).ok,'zh 下午两点半');
ok(!V.jtJudgeT(['上午两点半'],{h:14,m:30,amb:false},'zh',false).ok,'zh periode salah');
/* 3. kasus kunci */
eq(V.jtSay(2,30,'de','c').say,'halb drei','de 2:30');eq(V.jtSay(2,45,'de','c').say,'Viertel vor drei','de 2:45');eq(V.jtSay(3,0,'nl','c').say,'drie uur','nl 3:00');
eq(V.jtSay(14,30,'de','f').say,'vierzehn Uhr dreißig','de f');eq(V.jtSay(14,0,'en','f').say,'fourteen hundred','en 14:00');eq(V.jtSay(3,5,'ja','f').say.includes('さんじ'),true,'ja kana');
eq(V.jtSay(4,0,'ja','f').say,'よじ','ja 4時 よじ'.replace('よじ','よじ'));
eq(V.jtSay(9,0,'ja','f').say,'くじ','ja 9時');eq(V.jtSay(9,6,'ja','f').say,'くじろっぷん','ja 6分');eq(V.jtSay(9,10,'ja','f').say,'くじじゅっぷん','ja 10分');
eq(V.jtDateSay({m:3,d:5},'ja').say,'さんがついつか','ja 3月5日');eq(V.jtDateSay({m:4,d:1},'ja').say,'しがつついたち','ja 4月1日');eq(V.jtDateSay({m:7,d:20},'ja').say,'しちがつはつか','ja 7月20日');
eq(V.jtDateSay({m:3,d:5},'zh').say,'三月五号','zh');eq(V.jtDateSay({m:3,d:5,wd:4},'de').say,'Donnerstag, der fünfte März','de');
/* 4. tanggal: putar-balik + tidak ada false-positive */
for(const l of LG){
 for(const y of [1950,2026,2031])for(let m=1;m<=12;m++)for(let d=1;d<=28+(m%2);d++){const wd=V.jtWdIso(y,m,d);
  for(const uk of [0,1])for(const o of [{m,d},{m,d,wd},{y,m,d}]){const s=V.jtDateSay({...o,uk},l);ok(V.jtJudgeD([s.words],o,l).ok,`${l} ${JSON.stringify(o)} "${s.words}"`);
   if(o.d)ok(!V.jtJudgeD([s.words],{...o,d:o.d%28+1},l).ok,`salah ${l} ${s.words}`)}}
 for(let m=1;m<=12;m++){ok(V.jtJudgeD([V.jtDateSay({m},l).words],{m},l).ok,`bulan ${l} ${m}`);ok(V.jtJudgeD([String(m)],{m},l).ok,'nomor bulan');ok(!V.jtJudgeD([String(m%12+1)],{m},l).ok,'nomor bulan salah')}}
eq(V.jtWdIso(2026,3,5),4,'5 Mar 2026 = Kamis');eq(V.jtWdIso(2026,11,11),3,'11 Nov 2026 = Rabu');
ok(V.jtJudgeD(['5/3'],{m:3,d:5},'de').ok&&V.jtJudgeD(['3/5'],{m:3,d:5},'en').ok&&!V.jtJudgeD(['3/5'],{m:3,d:5},'de').ok,'format ketik d/m vs m/d');
ok(V.jtJudgeD(['Do 5/3'],{wd:4,m:3,d:5},'de').ok&&!V.jtJudgeD(['Fr 5/3'],{wd:4,m:3,d:5},'de').ok,'hari + angka');
/* 5. jam & tanggal sekaligus */
for(const l of LG)for(let i=0;i<150;i++){const q=V.jtMake({l,lv:'both',dir:'B'});ok(q.judge([q.words]).ok,`both ${l} ${q.words}`)}
ok(V.jtJudgeBoth(['5/3 14:30'],{t:{h:14,m:30,amb:true},d:{m:3,d:5}},'de').ok&&!V.jtJudgeBoth(['6/3 14:30'],{t:{h:14,m:30,amb:true},d:{m:3,d:5}},'de').ok,'both digit');
/* 6. semua tingkat × arah × bahasa: bentuk soal */
for(const l of LG)for(const lv of Object.keys(V.JTM))for(const dir of ['A','B'])for(let i=0;i<25;i++){const q=V.jtMake({l,lv,dir});
 ok(q&&q.L==l&&q.dir==dir&&q.say&&q.words&&q.show&&q.key&&q.key.main&&q.key.tip&&typeof q.judge=='function',`bentuk ${l} ${lv} ${dir}`);
 ok(q.judge([q.words]).ok,`jawab benar ${l} ${lv} ${dir} "${q.words}"`);ok(!q.judge(['zzz']).ok,'jawab salah');ok(q.ansHtml.includes('<svg')||q.ansHtml.includes('vgcal'),'ansHtml');
 if(dir=='B'&&(q.html))ok(q.html.includes('<svg')||q.html.includes('vgcal'),'html B');
 if(dir=='A')ok(!q.html,'A tidak membocorkan jawaban lewat html')}
for(const l of LG){const q=V.jtMake({l,lv:'hm',dir:'B'});ok(/^\d{1,2}:\d\d$/.test(q.show),'show jam '+q.show)}
ok(V.jtClock(3,0).includes('rotate(90.0 50 50)')&&V.jtClock(3,0).includes('rotate(0 50 50)'),'jam analog 3:00');ok(V.jtCal(2026,3,5).includes('<span class=on>5</span>')&&V.jtCal(2026,2,1).split('<i></i>').length==7,'kalender Mar 2026 / Feb 2026 mulai Minggu');
/* 7. integrasi mesin */
ok(LG.every(l=>V.GXL.some(g=>g.id=='dt_'+l&&g.lg==l)),'GXL memuat dt_*');
const o=V.GXO('dt_ja');ok(o.modes.join()=='h,hm,qh,dt'&&o.dir=='M','GXO default');
const its=V.gxItems('dt_ja');ok(its.length==8&&its.every(x=>x.k.startsWith('jt|ja|')),'gxItems');
V.gxSetCur('dt_de');V.gxClear();let h=V.gxView('dt_de');ok(h.includes('vgin')||h.includes('vgmic'),'view');
let st=V.gxState();ok(st.q&&st.q.g=='dt_de','soal aktif');const q0=st.q;
V.vgSubmit(['xx'],'type');st=V.gxState();ok(st.r&&st.r.sc==1&&V.S.gg[q0.k],'salah → SRS');ok(V.gxView('dt_de').includes('Belum tepat'),'hasil salah');
V.gxAct('ggxnext');V.gxView('dt_de');const q1=V.gxState().q;V.vgSubmit([q1.words],'type');ok(V.gxState().r.sc==3,'benar sc 3');ok(V.gxView('dt_de').includes('Benar'),'hasil benar');
const od=V.GXO('dt_de');od.modes=['h','dt'];od.dir='B';V.gxClear();for(let i=0;i<20;i++){V.gxView('dt_de');const q=V.gxState().q;ok(q.dir=='B','arah B');V.gxClear()}
const hub=V.gxHub();ok(LG.every(l=>hub.includes('data-v=dt_'+l)),'hub memuat dt_*');
console.log(`test_dt: ${n} cek lolos`);
