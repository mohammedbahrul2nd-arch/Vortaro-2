/* B3: uji kandidat Kelas AI (aiCovCands) untuk kartu yang baru muncul di flashcard. Jalankan: node tests/test_aicands.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\n;this.X={GK,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;

const {K}=X,GKm=X.GK||{};
/* cari kartu kosakata dgn >=2 entri berbeda tingkat dalam satu bahasa */
let pick=null;
for(const id in K){const c=K[id];for(const L in c[3]){const es=c[3][L];if(es.length>1&&es[0][3]!=es[1][3]&&es[0][0]!=es[1][0]&&['de','nl','ja','zh','en'].includes(L)){pick={id,L,l0:es[0][3],l1:es[1][3]};break}}if(pick)break}
if(!pick){console.log('lewati: tak ada kartu 2-entri beda tingkat');process.exit(0)}
const L=pick.L,kb=X.ik(pick.id,L);console.log('kartu:',kb,pick.l0,'/',pick.l1);
const has=cd=>cd.w.includes(kb)||cd.fw.some(x=>x.k==kb),k2=kb+'~1',has2=cd=>cd.w.includes(k2)||cd.fw.some(x=>x.k==k2);
S.sl=[];S.lib=[];
/* 1. v7.60: kandidat PER ENTRI. Filter hanya tingkat entri ke-2: entri ke-2 (kb~1) jadi kandidat baru, entri ke-1 tidak */
S.o={aiNew:1,ff:[L+':'+pick.l1],gff:[],aiLvs:{}};S.srs={};S.p={};X.setCur(null);
ok(has2(X.aiCovCands(L))&&!has(X.aiCovCands(L)),'tingkat dicek per entri (hanya entri ke-2 dalam filter)');
/* 2. entri ke-2 sudah dijawab (kunci ~1): kartu induk jadi kandidat "sudah disentuh", bukan hilang */
S.srs={[k2]:{t:2,d:1,i:3}};
let cd=X.aiCovCands(L);ok(cd.w.includes(k2)&&cd.pro.has(k2),'entri ke-2 yang dipelajari jadi kandidat entri itu sendiri (bukan kartu induk)');
/* 3. kartu yang sedang tampil selalu jadi kandidat meski di luar filter dan tanpa aiNew */
S.srs={};S.o={ff:[L+':'+(pick.l0=='A1'?'ZZ':'ZZ')],gff:[],aiLvs:{aiLvs:1}};S.o.aiLvs={};
ok(!has2(X.aiCovCands(L)),'tanpa kartu tampil dan di luar filter -> bukan kandidat');
X.setCur(k2);cd=X.aiCovCands(L);ok(has2(cd),'kartu tampil (entri ke-2, belum diungkap) tetap kandidat');
ok(cd.w.filter(k=>k==k2).length+cd.fw.filter(x=>x.k==k2).length==1,'tidak ganda');
/* 4. kartu tampil yang ditangguhkan (z) tidak dipaksa */
S.srs={[kb]:{z:1}};X.setCur(kb);ok(!has(X.aiCovCands(L)),'kartu ditangguhkan tidak jadi kandidat');
/* 5. cache cakupan ikut kartu yang tampil */
S.srs={};S.o={aiNew:1,ff:[],gff:[],aiLvs:{}};X.setCur(null);const a=X.aiCoverage(L);X.setCur(kb);ok(X.aiCoverage(L)!==a,'cache cakupan dibuat ulang saat kartu tampil berganti');
console.log(fail?'ADA GAGAL '+fail:'test_aicands: lolos');process.exit(fail?1:0);
