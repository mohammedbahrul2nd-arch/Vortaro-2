/* B3: uji kandidat Kelas AI (aiCovCands) untuk kartu yang baru muncul di flashcard. Jalankan: node tests/test_aicands.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;const SI={w:{},s:{}};const LT=()=>({});\n;this.X={aiPoolV,aiPoolM,aiWordLine,aiLvOf,aiEntW,GK,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X,{K}=X;
/* 7.66: label chip/judul Kelas AI memakai kata ENTRI (kunci ~N), bukan kata pertama kartu */
let n=0,bad=0,sv=null;
for(const id in K){const c=K[id];for(const L in c[3]){const es=c[3][L];es.forEach((e,i)=>{n++;const k=X.ik(id,L)+(i>0?'~'+i:'');if(X.aiEntW(c,L,k)!=e[0]){bad++;if(bad<4)console.log('salah:',k,X.aiEntW(c,L,k),'!=',e[0])}if(L=='de'&&e[0]=='sich vergnügen')sv=k})}}
ok(n>1000,'entri terbaca');ok(bad==0,'label entri = kata entri ('+bad+' salah)');
if(sv){const c=K[X.base(sv)];ok(X.aiEntW(c,'de',sv)=='sich vergnügen','sich vergnügen tampil sebagai dirinya sendiri, bukan '+X.aiEntW(c,'de',sv));console.log('sich vergnügen =',sv)}

/* 7.66: pool kosakata lemah/mahir & baris kata PER ENTRI: entri ke-2 tak boleh hilang atau tampil sebagai kata pertama */
let mk=null;
for(const id in K){const c=K[id];for(const L of ['de','ja','zh','nl','en']){const es=c[3][L];if(es&&es.length>1&&es[0][0]!=es[1][0]){mk={id,L,c,es};break}}if(mk)break}
if(mk){const k1=X.ik(mk.id,mk.L)+'~1';
 S.srs={};S.srs[k1]={t:1,i:0,l:0,d:0};
 const pv=X.aiPoolV(mk.L,'');const it=pv.find(x=>x.k==k1);
 ok(!!it,'entri ke-2 yang lemah masuk pool kosakata lemah');
 if(it){const ln=X.aiWordLine(it.c,mk.L,it);ok(ln.startsWith(mk.es[1][0]+(mk.es[1][1]?' (':' =')),'baris kata pool = kata entri ke-2: '+ln);ok(!ln.includes(mk.es[0][0]+' /'),'tak memuat kata entri ke-1')}
 S.srs={};S.srs[k1]={t:2,i:60,l:0,d:0};S.p={};
 const pm=X.aiPoolM(mk.L,'');ok(pm.W.some(x=>x.k==k1),'entri ke-2 yang mahir masuk pool mahir');
 ok(X.aiLvOf(mk.c,mk.L,k1)==(mk.es[1][3]||''),'level entri ke-2 dipakai');
 S.srs={};console.log('pool per entri:',k1)}
console.log(fail?fail+' GAGAL':'semua lolos');process.exit(fail?1:0);
