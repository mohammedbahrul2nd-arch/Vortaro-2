/* v7.33: laporan kartu di prompt yang belum masuk (gmPromptCards/gmTagReport). Jalankan: node tests/test_tagreport.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);ctx.LT=()=>({});
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\n;this.X={aiGatherLib,aiLibBuild,aiO,gmPromptCards,gmTagReport,libRepHtml,libParseSents,gmResolveTags,gmApplyTags,libFailHtml,gmCollect,gmExBlock,gmExamples,gmRoll,gmVerN,gmVerFirst,gzvCands,gmDelSent,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;

const L='de';
S.o={aiNew:1,ff:[],gff:[],aiLvs:{de:['A1']},aiLL:'de',aiLT:'sent'};S.srs={};S.p={};S.lib=[];S.sl=[];
const c0=X.aiGatherLib(L);const prompt=X.aiLibBuild(c0,'sent');
ok(/KARTU/.test(prompt),'prompt Kelas AI punya bagian KARTU');
const cards=X.gmPromptCards(prompt,L);
ok(cards.length>=3,'kartu terbaca dari prompt: '+cards.length);
const exp=(c0.pw||[]).length+(c0.pg||[]).length+(c0.nw||[]).length+(c0.ng||[]).length;
ok(cards.length>=exp-2,'hampir semua kartu prompt terbaca ('+cards.length+'/'+exp+')');
const V=cards.filter(c=>c.kind=='V'),G=cards.filter(c=>c.kind=='G');
ok(V.length>0,'ada kosakata');
/* susun teks tempel: 1 kalimat dengan tag untuk kartu V pertama, lainnya tidak masuk */
const v1=V[0],w1=v1.name.replace(/^(der|die|das)\s+/i,'');
const gl=X.gmPromptCards.length;
const sn=(n,f,i)=>`[${n}] ${f}\nArti: ${i}`;
const pasted=[sn(1,`${w1} ist hier.`,`${v1.gloss} di sini.`),sn(2,'Zweiter Satz.','Kalimat kedua.'),sn(3,'Dritter Satz.','Kalimat ketiga.'),sn(4,'Vierter Satz.','Kalimat keempat.'),sn(5,'Fünfter Satz.','Kalimat kelima.'),sn(6,'Sechster Satz.','Kalimat keenam.')].join('\n\n')+`\n\nDilewati: ${V[1]?V[1].name:'x'} — tidak natural\n\n=== TAG ===\n[1] V: ${w1} > ${w1}`;
const r=X.libParseSents(pasted,{L});
ok(!r.err,'parse: '+r.err);
const z=X.gmTagReport(r,prompt,pasted,L);
ok(z&&z.n==cards.length,'laporan: jumlah kartu '+(z&&z.n));
ok(z.ok+z.unv.length+z.miss.length==z.n,'ok+unv+miss = n');
ok(z.ok==1&&z.unv.length==0||z.unv.length==1,'kartu bertag dihitung masuk (atau tak terverifikasi): ok='+z.ok+' unv='+z.unv.length);ok(z.miss.length==z.n-1,'sisanya belum masuk: '+z.miss.length);
if(V[1])ok(z.miss.some(m=>m.k==V[1].k&&/dilewati/.test(m.why)),'alasan "dilewati AI" tertangkap');
ok(z.miss.every(m=>m.why&&m.name),'semua punya alasan');
const h=X.libRepHtml(z);ok(h.includes('Laporan prompt')&&h.includes('belum masuk'),'html');
ok(X.gmTagReport(r,'tidak ada daftar',pasted,L)===null,'prompt tanpa daftar -> null');
console.log(fail?'ADA GAGAL '+fail:'test_tagreport: lolos ('+z.ok+' masuk, '+z.unv.length+' unv, '+z.miss.length+' miss dari '+z.n+')');process.exit(fail?1:0);
