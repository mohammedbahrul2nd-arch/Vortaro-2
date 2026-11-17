/* Cek browser (Playwright, butuh server di :8765): Soal AI kalimat natural untuk scl_/shd_ × 6 bahasa × semua level + kerangka Speaking Cloze.
   Jalankan: (cd docs && python3 -m http.server 8765 &) ; node tests/browser_aqsent.js */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{const x=[...document.querySelectorAll('button')].find(b=>/Lewati/.test(b.textContent));if(x)x.click()});await p.waitForTimeout(300);
const R=await p.evaluate(()=>{const out={fail:[],n:0};const ok=(c,m)=>{out.n++;if(!c)out.fail.push(m)};
 aiO();const snap=JSON.stringify([S.o.aiLL,S.o.aiSn,S.o.aiLW,S.o.aiLG,S.o.aiNew,S.o.aiNW,S.o.aiNG,S.o.aiLvs]);
 const SMP={zh:'[1] 我每天早上喝咖啡。\nWǒ měitiān zǎoshang hē kāfēi.\nSaya minum kopi setiap pagi.',ja:'[1] 毎朝コーヒーを飲みます。\nMaiasa kōhī o nomimasu.\nSaya minum kopi setiap pagi.',de:'[1] Ich trinke jeden Morgen Kaffee.\nSaya minum kopi setiap pagi.',nl:'[1] Ik drink elke ochtend koffie.\nSaya minum kopi setiap pagi.',en:'[1] I drink coffee every morning.\nSaya minum kopi setiap pagi.',eo:'[1] Mi trinkas kafon ĉiumatene.\nSaya minum kopi setiap pagi.'};
 for(const fam of ['scl','shd'])for(const L of ['zh','ja','de','nl','en','eo']){const g=fam+'_'+L,v=aqLevels(g);
  for(let cap=0;cap<v.length;cap++){const r=aqSentBuild(g,cap,10,10),t=r.prompt;
   ok(t.includes('ATURAN KHUSUS GAME')&&t.includes('BOLEH KURANG'),'blok natural '+g+cap);
   ok(t.includes('Level yang boleh dipakai: '+v.slice(0,cap+1).join(', ')),'level keras '+g+cap);
   ok(!/\b(undefined|NaN|\[object)\b/.test(t.replace('“null”, “undefined”, “NaN”','')),'bersih '+g+cap);
   ok(r.ctx&&(r.ctx.pw.length+r.ctx.pg.length+r.ctx.nw.length+r.ctx.ng.length)>0,'ada kartu fokus '+g+cap);
   const lv=r.ctx.pw.concat(r.ctx.nw).map(x=>(x.c[3][L]||[])[ent(x.k)||0]).filter(Boolean).map(e=>e[3]);
   ok(lv.every(z=>!z||aiLvAll(L).indexOf(z)<=cap),'kartu fokus ≤ level '+g+cap+' '+lv.filter(z=>aiLvAll(L).indexOf(z)>cap).join())}
  /* impor → Pustaka */
  const n0=S.sl.length;const r=aqSentSave(g,SMP[L],10);ok(!r.err&&r.n==1&&S.sl.length==n0+1,'impor '+g+JSON.stringify(r));
  ok(S.sl[0].L==L&&S.sl[0].i.includes('kopi'),'isi Pustaka '+g);
  const r2=aqSentSave(g,SMP[L],10);ok(r2.n==0&&r2.d==1,'duplikat '+g);S.sl.shift()}
 ok(snap==JSON.stringify([S.o.aiLL,S.o.aiSn,S.o.aiLW,S.o.aiLG,S.o.aiNew,S.o.aiNW,S.o.aiNG,S.o.aiLvs]),'pengaturan Pustaka dikembalikan');
 /* satu arah: tidak ada soal game dari Pustaka */
 ok(!aqList('shd_en').length,'game tidak menerima kalimat Pustaka');
 return out});
console.log(JSON.stringify(R).slice(0,1500));
/* dialog nyata + kerangka Speaking Cloze */
await p.evaluate(()=>{[...document.querySelectorAll('nav#n button, nav#n a')].find(b=>/Games/i.test(b.textContent)).click()});await p.waitForTimeout(400);
await p.evaluate(()=>{document.querySelector('[data-a=ggxopen][data-v=scl_de]').click()});await p.waitForTimeout(500);
await p.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelector('[data-aq=open]').click()});await p.waitForTimeout(800);
const dl=await p.evaluate(()=>{const m=document.getElementById('aqs');return m?{t:m.querySelector('.edh b').textContent,ta:m.querySelector('#aqsTxt').value.length,has:/Cakupan/.test(m.innerText)}:null});console.log('dialog',JSON.stringify(dl));
await p.screenshot({path:process.env.SHOT||'/tmp/aqs.png'});
await p.evaluate(()=>{document.querySelector('[data-aqs=close]').click()});await p.waitForTimeout(200);
await p.evaluate(()=>{gxQ=null;render()});await p.waitForTimeout(500);
const fr=await p.evaluate(()=>{const f=document.querySelector('.scf');return f?{lines:f.querySelectorAll('.scln').length,words:f.querySelectorAll('.scw:not(.scln)').length,red:f.querySelectorAll('.scp-v').length,yel:f.querySelectorAll('.scp-n').length,bad:/undefined|NaN|\[object/.test(document.body.innerText)}:null});console.log('frame',JSON.stringify(fr));
await p.screenshot({path:(process.env.SHOT||'/tmp/aqs.png').replace('.png','-frame.png')});
console.log('ERRS',JSON.stringify(errs));await b.close()})();
