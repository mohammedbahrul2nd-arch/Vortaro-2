/* v7.110: tombol «Hapus kalimat» / «Hapus tag soal» pada kartu (soal rumpang yang sedang tampil). Jalankan: node tests/test_fccdel.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\nconst ik=(k,l)=>k+SEP+l;\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n;this.X={gmQRow,gmDelR,gmUntagR,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;

const {K}=X;let key,noun,art,id;
for(const i in K){const c=K[i];if(c[1]=='N'&&c[3].de&&c[3].de.length){const w=c[3].de[0][0];if(/^(der|die|das)\s+\p{L}{4,}$/iu.test(w)){id=i;art=w.split(/\s+/)[0].toLowerCase();noun=w.replace(/^\S+\s+/,'');break}}}
key=id+'@de';const gl0=String(K[id][2]).split(/[\/~]/)[0].trim().toLowerCase();const sw=art=='der'?'den '+noun:art+' '+noun;
const s1=`Gestern habe ich ${sw} im Park gesehen und mich gefreut.`,s2=`Heute sehe ich ${sw} wieder im Garten und lache.`,s3=`Morgen kaufe ich ${sw} auf dem Markt in der Stadt.`;
S.sl=[{id:'a1',L:'de',f:s1,r:'',i:'Satu '+gl0+'.',c:1}];
S.lib=[{id:'L1',L:'de',k:'r',ps:[{f:[s2,s3],i:['Dua '+gl0+'.','Tiga '+gl0+'.'],r:null,tg:[null,null],sp:['','']}],c:2}];

S.sl=[{id:'a1',L:'de',f:s1,r:'',i:'Satu '+gl0+'.',c:1},{id:'a2',L:'de',f:s2,r:'',i:'Dua '+gl0+'.',c:2},{id:'a3',L:'de',f:s3,r:'',i:'Tiga '+gl0+'.',c:3}];S.lib=[];
const roll=()=>{X.GZP.sig='';X.GZP.cur={k:key,row:null,v:null};X.gzpRoll(key);return X.GZP.cur.v};
let cur=roll();ok(!!cur,'rumpang aktif');
ok(X.gmQRow(key)&&X.gmQRow(key).f==cur.f,'gmQRow = soal yang tampil');
ok(X.gmQRow('lain@de')===null,'kartu lain: tidak ada');
/* batal */
CONF=false;ok(X.gmDelR(key,X.gmQRow(key))===false,'batal hapus -> false');ok(S.sl.length==3,'batal tidak menghapus');
/* hapus kalimat soal */
CONF=true;const f0=cur.f;ok(X.gmDelR(key,X.gmQRow(key))===true,'hapus kalimat soal');
ok(S.sl.length==2&&!S.sl.some(x=>x.f==f0),'kalimat itu hilang dari Pustaka');
let n=X.gzvRow(key);ok(n&&n.f!=f0,'soal diganti kalimat lain');
/* kalimat bertag -> lepas tag, kalimat tetap */
const vk=key.replace(/^.*?@/,'')&&key;
const tgSent=S.sl[0];tgSent.tg=[{t:'v',k:key,s:[noun]}];
cur=roll();
ok(cur&&cur.o,'soal bertag punya .o');if(cur&&cur.o){const f1=cur.f,had=S.sl.length;ok(X.gmUntagR(key,X.gmQRow(key))===true,'lepas tag soal');
 ok(S.sl.length==had,'kalimat tetap di Pustaka');
 ok(!(S.o.gmNo&&S.o.gmNo[key]&&0),'ok');
 ok(S.o.gmNo&&S.o.gmNo[key]&&S.o.gmNo[key].includes(f1),'kalimat dicatat sebagai bukan contoh kartu ini');
 n=X.gzvRow(key);ok(!n||n.f!=f1,'soal tidak lagi memakai kalimat itu')}
/* kalimat bawaan (tanpa .o) -> tanpa tombol */
X.GZP.cur={k:key,row:null,v:{f:'x',o:undefined}};ok(X.gmQRow(key)===null,'kalimat tanpa .o -> tanpa tombol');
console.log(fail?'ADA GAGAL '+fail:'test_fccdel: lolos');process.exit(fail?1:0);
