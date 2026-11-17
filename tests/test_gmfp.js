/* v7.103: uji anti salah-deteksi contoh Pustaka (universal). B4: uji (tag V: AI) vs terdeteksi otomatis. Jalankan: node tests/test_verified.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\n;this.X={S,gmSpec,gmLv,gmRec,gmSupSib,D,gmGloss,gzvIdSpan,gmDelCaches,gmExBlock,gmExamples,gmRoll,gmVerN,gmVerFirst,gzvCands,gmDelSent,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).slice(0,300));process.exit(2)}
const X=ctx.X;

/* [bahasa, kartu, kalimat, terjemahan, diharapkan cocok?] */
const T=[
['ja','g|ja|N3|ないと','皆さんは明日来ないということです。','',0],['ja','g|ja|N3|ないと','先生は行かないといっていた。','',0],['ja','g|ja|N3|ないと','早く寝ないといけない。','',1],
['ja','g|ja|N3|それとも','今日だけ行かなくてもいいのはどうですか。','',0],['ja','g|ja|N3|それとも','コーヒー、それとも紅茶？','',1],
['ja','V:masuk@ja','シャツを折ってかばんに入れます。','',0],['ja','V:masuk@ja','部屋に入ります。','',1],['ja','V:masuk@ja','彼は家に入った。','',1],
['nl','V:menuliskan@nl','De schrijver schrijft bij de uitgang op het papier.','',0],['nl','V:menuliskan@nl','Waarom schrijf jij het nieuwe woord niet in je schrift?','',0],
['nl','V:menuliskan@nl','Ik schrijf het adres op.','',1],['nl','V:menuliskan@nl','Wil je dit even opschrijven?','',1],['nl','V:menuliskan@nl','Hij schreef alles op, en ging weg.','',1],['nl','V:menuliskan@nl','Hij schreef alles op','',1]];
let n=0;
for(const [L,key,f,i,want] of T){X.S.sl=[{id:'s'+(n++),L,f,r:'',i,c:0,d:0}];X.gmDelCaches&&X.gmDelCaches();const r=X.gmCollect(key,true);ok(!!r.length==!!want,key+' | '+f+' | harapan '+want+' dapat '+r.length)}
/* sorot terjemahan: kata generik ("Tempat") tidak disorot dari arti pola */
ok(X.gzvIdSpan('Tempat kerja baru berjarak lima menit dari apartemenku.','Tempat asal',true)===null,'sorot Tempat generik');
ok(!!X.gzvIdSpan('Dia datang dari Jakarta.','Dari',true),'sorot Dari tetap jalan');
console.log(fail?'test_gmfp: '+fail+' GAGAL':'test_gmfp lolos ('+T.length+' kasus)');process.exit(fail?1:0)
