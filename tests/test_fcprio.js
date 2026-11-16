/* v7.101.0: flashcard — kartu BARU yang punya contoh kalimat di Pustaka (kosakata terverifikasi per entri / grammar bertag) diutamakan */
/* B4: uji kosakata terverifikasi (tag V: AI) vs terdeteksi otomatis. Jalankan: node tests/test_verified.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\n;this.X={gmHasEx,gmDelCaches,D,gmCollect,gmExBlock,gmExamples,gmRoll,gmVerN,gmVerFirst,gzvCands,gmDelSent,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;
const {K,gmHasEx,gmVerFirst}=X;let A=null,B=null;
for(const i in K){const c=K[i];if(c[1]=='N'&&c[3].de&&c[3].de.length){const w=c[3].de[0][0];if(/^(der|die|das)\s+\p{L}{4,}$/iu.test(w)){if(!A){A=i}else if(!B&&i!=A){B=i;break}}}}
const kA=A+'@de',kB=B+'@de';
const wA=K[A][3].de[0][0],artA=wA.split(/\s+/)[0].toLowerCase(),nounA=wA.replace(/^\S+\s+/,''),glA=String(K[A][2]).split(/[\/~]/)[0].trim().toLowerCase(),swA=artA=='der'?'den '+nounA:artA+' '+nounA;
const gs=X.D.G.filter(g=>g[1]=='de').slice(0,2);const gTag=gs[1][0],gNo=gs[0][0];
S.sl=[{id:'v1',L:'de',f:`Gestern habe ich ${swA} im Park gesehen und mich gefreut.`,r:'',i:'Satu '+glA+'.',c:1,tg:[{t:'v',k:kA,n:nounA,s:swA,f:''},{t:'g',k:gTag,n:'x',s:'x'}]}];
S.lib=[];X.gmDelCaches();
ok(gmHasEx(kA)&&!gmHasEx(kB),'kosakata: bertag V punya contoh, lainnya tidak');
ok(gmHasEx(gTag)&&!gmHasEx(gNo),'grammar: kalimat bertag g punya contoh, lainnya tidak');
const mix=[kB,gNo,kA,gTag],out=gmVerFirst(mix);
ok(out[0]==kA&&out[1]==gTag&&out[2]==kB&&out[3]==gNo,'yang punya contoh di depan, urutan relatif tetap: '+out.join(' | '));
S.sl=[];S.lib=[];X.gmDelCaches();ok(gmVerFirst(mix).join()==mix.join(),'tanpa Pustaka: urutan sama');
console.log(fail?'test_fcprio: '+fail+' GAGAL':'test_fcprio lolos');process.exit(fail?1:0);
