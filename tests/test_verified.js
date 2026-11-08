/* B4: uji kosakata terverifikasi (tag V: AI) vs terdeteksi otomatis. Jalankan: node tests/test_verified.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\n;this.X={gmCollect,gmExBlock,gmExamples,gmRoll,gmVerN,gmVerFirst,gzvCands,gmDelSent,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;

const {K}=X;let id,art,noun;
for(const i in K){const c=K[i];if(c[1]=='N'&&c[3].de&&c[3].de.length){const w=c[3].de[0][0];if(/^(der|die|das)\s+\p{L}{4,}$/iu.test(w)){id=i;art=w.split(/\s+/)[0].toLowerCase();noun=w.replace(/^\S+\s+/,'');break}}}
const key=id+'@de',gl0=String(K[id][2]).split(/[\/~]/)[0].trim().toLowerCase(),sw=art=='der'?'den '+noun:art+' '+noun;
const sV=`Gestern habe ich ${sw} im Park gesehen und mich gefreut.`,sA=`Heute sehe ich ${sw} wieder im Garten und lache.`,sB=`Morgen kaufe ich ${sw} auf dem Markt in der Stadt.`;
/* tag: sV bertag V: untuk kartu ini; sA tanpa tag; sB bertag kartu LAIN (tidak boleh dihitung) */
S.sl=[{id:'v1',L:'de',f:sV,r:'',i:'Satu '+gl0+'.',c:1,tg:[{t:'v',k:key,n:noun,s:sw,f:''}]}];
S.lib=[{id:'L1',L:'de',k:'r',c:2,ps:[{f:[sA,sB],i:['Dua '+gl0+'.','Tiga '+gl0+'.'],r:null,tg:[null,[{t:'v',k:'zzz@de',n:'x',s:'x',f:''}]],sp:['','']}]}];
const col=X.gmCollect(key);
ok(col.length==3,'3 kalimat terkumpul: '+col.length);
const bf=f=>col.find(x=>x.f==f);
ok(bf(sV).ver===true&&bf(sV).lv==3,'bertag -> ver, lv 3');
ok(bf(sA).ver===false&&bf(sA).lv==2,'otomatis -> bukan ver, lv 2');
ok(bf(sB).ver===false,'tag kartu lain tidak dihitung');
ok(X.gmVerN(key)==1&&X.gmVerN(key+'~1')==1&&X.gmVerN('zzz@de')==0,'gmVerN per kartu (entri ke-2 ikut induk; kunci tanpa kartu tak dihitung)');
ok(X.gmVerN(id)==0,'kunci tanpa @ -> 0');
ok(X.gmVerFirst(['a@de',key,'b@de']).join()==[key,'a@de','b@de'].join(),'kartu terverifikasi ditaruh paling atas, urutan lain stabil');
X.gmRoll.key='';const h=X.gmExBlock(key);
ok(h.includes('1 terverifikasi (bertag AI) · 2 terdeteksi otomatis'),'header dua angka');
ok((h.match(/✓ terverifikasi/g)||[]).length==1,'tanda ✓ hanya pada 1 kalimat');
const gc=X.gzvCands(key);const rv=gc.find(r=>r.f==sV),ra=gc.find(r=>r.f==sA);
if(rv&&ra){ok(rv.ver&&rv.tg&&rv.lv==3&&!ra.ver&&!ra.tg&&ra.lv==2,'kandidat rumpang: ver/tg/lv');ok(rv.w==3*ra.w||rv.w==ra.w*3,'bobot terverifikasi 3x: '+rv.w+' vs '+ra.w)}else ok(false,'kandidat rumpang tidak lengkap '+gc.length);
/* hitungan panel Kelas AI */
S.o={aiNew:1,ff:[],gff:[],aiLvs:{}};
const cv=X.aiCoverage('de');const e=cv.W.concat(cv.F).find(x=>x.k==key);
ok(e&&e.v==1&&e.a>=1&&e.n==e.v,'panel 7.30: n (dihitung) = hanya terverifikasi; a = info saja: '+JSON.stringify(e&&{n:e.n,v:e.v,a:e.a}));
ok(cv.vW>=1,'ringkasan: ada kartu terverifikasi');
/* hapus kalimat bertag dari paragraf (sig tidak berubah) -> hitungan turun */
S.sl=[];S.lib[0].ps[0].tg=[[{t:'v',k:key,n:noun,s:sw,f:''}],null];
X.gmRoll.key='';X.gmExBlock(key);ok(X.gmVerN(key)==1,'tag di paragraf lib terhitung');
const idx=X.gmRoll.rows.findIndex(r=>r.f==sA);
ok(X.gmDelSent(key,idx)&&X.gmVerN(key)==0,'setelah hapus kalimat bertag, cache terverifikasi ikut segar');
console.log(fail?'ADA GAGAL '+fail:'test_verified: lolos');process.exit(fail?1:0);
