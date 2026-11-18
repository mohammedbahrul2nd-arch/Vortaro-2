/* Prompt Kelas AI: kealamian kalimat jadi prioritas + tab «Kalimat akurat». Jalankan: node tests/test_ainatural.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
const ctx={confirm:()=>true,toast:noop,libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);ctx.LT=()=>({});ctx.txT=()=>[];ctx.txFn=()=>[];ctx.txL=x=>x;ctx.txPri=()=>0;ctx.PRK={};ctx.PRR={};
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="let SI={w:{},g:{}};const KM={};const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};";
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\nthis.X={K,GK,aiGather,aiGatherLib,aiBuild,aiBuildAcc,aiBuildSent,aiBuildDialog,aiBuildText,aiLibBuild,aiO,AINAT,AIDEST,aiTabsHtml};',ctx)}
catch(e){console.log('MUAT GAGAL:',e.message);process.exit(2)}
const X=ctx.X;
const vk=Object.keys(X.K).find(id=>(X.K[id][3].de||[]).length);const kv=vk+'@de';
const gk=Object.keys(X.GK).find(k=>X.GK[k][1]=='de');
const NAT='PRIORITAS TERTINGGI: KALIMAT NATURAL';
/* kartu lemah buatan supaya ada kosakata prioritas / pembentuk yang BISA muncul bila tidak dilarang */
const others=Object.keys(X.K).filter(id=>id!=vk&&(X.K[id][3].de||[]).length).slice(0,40).map(id=>id+'@de');
S.srs={};others.forEach((k,i)=>S.srs[k]={t:i%2?3:1,d:1,i:1,l:3});
S.o={};
for(const kk of [kv,gk]){
  const isV=kk==kv;
  /* 1. tab Akurat */
  S.o={aiT:'acc',aiSn:10};
  const c=X.aiGather(kk,0);
  const t=X.aiBuild(c);
  ok(t.includes(NAT),'acc: blok natural ada');
  ok(t.includes('MODE KALIMAT AKURAT'),'acc: penanda mode');
  ok(!/\(sering lupa|SUDAH KUKUASAI|belum pernah muncul|contoh terverifikasi di Pustaka|0 contoh|^KARTU PRIORITAS|^KARTU BARU/m.test(t),'acc: tanpa kartu prioritas/baru/mahir/lemah ('+(isV?'kosakata':'grammar')+')');
  if(false){const m=/\(sering lupa|SUDAH KUKUASAI|belum pernah muncul|contoh terverifikasi di Pustaka|0 contoh|^KARTU PRIORITAS|^KARTU BARU/m.exec(t);if(m)console.log('HIT:',JSON.stringify(t.slice(Math.max(0,m.index-120),m.index+120)))}
  ok(/TIDAK ADA daftar pembentuk/.test(t),'acc: pembentuk kosong');
  ok(/paling banyak sampai \[10\]|MAKSIMUM 10/.test(t),'acc: jumlah = maksimum');
  ok(c.words.length>=0 && X.aiGather(kk,0).words.length===c.words.length,'acc: tidak mengubah ctx kartu');
  /* 2. prompt tab lain (kartu) tetap memuat blok natural & jumlah boleh kurang */
  for(const ty of ['sent','dialog','read','listen']){
    S.o={aiT:ty,aiSn:10,aiDn:6,aiP:3};
    const p=X.aiBuild(X.aiGather(kk,0));
    ok(p.includes(NAT),ty+': blok natural');
    ok(!/Sebelum menulis, hitung: tepat/.test(p),ty+': tidak lagi memaksa jumlah tepat');
    ok(/Dilewati/.test(p),ty+': boleh melewati kartu');
  }
  /* 3. Penjelasan lengkap */
  for(const m of ['all','step']){S.o={aiT:'long',aiM:m};const p=X.aiBuild(X.aiGather(kk,0));ok(/KEALAMIAN LEBIH PENTING/.test(p),'long/'+m+': aturan natural')}
}
/* 4. prompt Pustaka (cakupan) */
S.o={aiLL:'de',aiLT:'sent',aiSn:20,aiLW:8,aiLG:3};
const lc=X.aiGatherLib('de',1);
for(const lt of ['sent','dialog','read','listen']){
  const p=X.aiLibBuild(lc,lt);
  ok(p.includes(NAT),'pustaka '+lt+': blok natural');
  ok(/boleh (jauh )?lebih sedikit|boleh lebih pendek|lebih sedikit boleh|boleh berhenti lebih awal|boleh lebih sedikit/.test(p),'pustaka '+lt+': jumlah boleh kurang');
  ok(!/Sebelum menulis, hitung: tepat/.test(p),'pustaka '+lt+': tanpa "hitung tepat"');
}
const ps=X.aiLibBuild(lc,'sent');
ok(!/Tidak boleh ada kalimat tanpa unsur ini/.test(ps)&&!/SETIAP kalimat memuat minimal 1/.test(ps),'pustaka: tidak lagi mewajibkan kartu di tiap kalimat');
/* 4b. format sorotan Indonesia (>>) di tag grammar */
{S.o={aiT:'acc',aiSn:10};const pa=X.aiBuild(X.aiGather(gk,0));ok(/>> \[potongan arti Indonesia\]/.test(pa)&&/SOROTAN BAHASA ASING DAN INDONESIA/.test(pa),'acc grammar: format >> ada');
 for(const lt of ['sent','dialog','read','listen']){const pp=X.aiLibBuild(lc,lt);ok(/>> \[potongan arti Indonesia\]/.test(pp)&&/SOROTAN BAHASA ASING DAN INDONESIA/.test(pp),'pustaka '+lt+': format >> ada')}}
/* 5. tab ada di kedua daftar tab */
ok(X.aiTabsHtml({aiLT:'sent'}).includes('data-v=acc'),'tab Akurat ada di aiTabsHtml');
ok(X.AIDEST.acc&&X.AIDEST.acc.lib==='Pustaka → Kalimat','AIDEST.acc');
/* 6. prompt Cloze & Soal AI (diperiksa dari sumber: modulnya butuh mesin game penuh) */
for(const f of ['ai-cloze.js','ai-gameq.js']){const t=J(f);ok(t.includes(NAT),f+': blok natural');ok(/sampai \$\{(per|N)\} soal/.test(t),f+': jumlah soal = maksimum');ok(!/TEPAT \$\{(per|N)\} (soal|baris)/.test(t.replace(/Kolom[^`]*TEPAT 7 kolom/g,'')),f+': tidak lagi memaksa jumlah tepat')}
if(process.env.SHOW){S.o={aiT:'acc',aiSn:10};console.log(X.aiBuild(X.aiGather(kv,0)))}
console.log(fail?fail+' gagal':'test_ainatural: semua lolos');process.exit(fail?1:0);
