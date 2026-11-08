/* B2: uji hapus kalimat contoh Pustaka di flashcard. Jalankan: node tests/test_delsent.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\nconst ik=(k,l)=>k+SEP+l;\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n;this.X={gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;

const {K}=X;let key,noun,art,id;
for(const i in K){const c=K[i];if(c[1]=='N'&&c[3].de&&c[3].de.length){const w=c[3].de[0][0];if(/^(der|die|das)\s+\p{L}{4,}$/iu.test(w)){id=i;art=w.split(/\s+/)[0].toLowerCase();noun=w.replace(/^\S+\s+/,'');break}}}
key=id+'@de';const sw=art=='der'?'den '+noun:art+' '+noun;
const s1=`Gestern habe ich ${sw} im Park gesehen und mich gefreut.`,s2=`Heute sehe ich ${sw} wieder im Garten und lache.`,s3=`Morgen kaufe ich ${sw} auf dem Markt in der Stadt.`;
S.sl=[{id:'a1',L:'de',f:s1,r:'',i:'Satu.',c:1}];
S.lib=[{id:'L1',L:'de',k:'r',ps:[{f:[s2,s3],i:['Dua.','Tiga.'],r:null,tg:[null,null],sp:['','']}],c:2}];
const rows=()=>{X.GMEXC&&0;X.gmRoll.key='';const v=X.gmExamples(key,10);return v};
let v=rows();ok(v.rows.length==3,'3 kalimat terkumpul: '+v.rows.length);
let h=X.gmExBlock(key);ok((h.match(/data-a=fcxdel/g)||[]).length==3,'3 tombol hapus');
ok(h.includes('data-v=0')&&h.includes('data-k="'+key+'"'),'atribut tombol');
/* batal */
CONF=false;ok(X.gmDelSent(key,0)===false,'batal -> false');ok(S.sl.length==1&&S.lib[0].ps[0].f.length==2,'batal tidak menghapus');
CONF=true;
/* hapus kalimat S.lib (paragraf dua kalimat) */
let idx=X.gmRoll.rows.findIndex(r=>r.f==s3);ok(idx>=0,'s3 ada di baris tampil');
ok(X.gmDelSent(key,idx)===true,'hapus s3');
ok(S.lib[0].ps[0].f.length==1&&S.lib[0].ps[0].f[0]==s2&&S.lib[0].ps[0].i.length==1&&S.lib[0].ps[0].i[0]=='Dua.'&&S.lib[0].ps[0].tg.length==1&&S.lib[0].ps[0].sp.length==1,'larik paralel konsisten');
ok(!S.lib[0].ps[0].r,'r null tetap null');
v=rows();ok(v.rows.length==2&&!v.rows.some(r=>r.f==s3),'cache bersih, s3 tak muncul lagi');
/* hapus S.sl */
h=X.gmExBlock(key);idx=X.gmRoll.rows.findIndex(r=>r.f==s1);
ok(X.gmDelSent(key,idx)&&S.sl.length==0,'hapus dari S.sl');
/* hapus kalimat terakhir -> item Pustaka ikut hilang */
X.gmExBlock(key);idx=X.gmRoll.rows.findIndex(r=>r.f==s2);
ok(X.gmDelSent(key,idx)&&S.lib.length==0,'paragraf & item kosong dibuang');
ok(X.gmExBlock(key)==='','tanpa kalimat -> blok kosong');
/* kartu rumpang yang sedang tampil */
S.sl=[{id:'a1',L:'de',f:s1,r:'',i:'Satu.',c:1},{id:'a2',L:'de',f:s2,r:'',i:'Dua.',c:2}];S.lib=[];
X.GZP.sig='';X.GZP.cur={k:key,row:null,v:null};X.gzpRoll(key);
const cur=X.GZP.cur.v;ok(!!cur,'rumpang aktif');
X.gmExBlock(key);idx=X.gmRoll.rows.findIndex(r=>r.f==cur.f);
if(idx>=0){X.gmDelSent(key,idx);const n=X.gzvRow(key);ok(n&&n.f!=cur.f,'rumpang diganti kalimat lain');ok(S.sl.length==1,'S.sl tinggal 1')}else console.log('lewati: kalimat rumpang tak ada di daftar tampil');
console.log(fail?'ADA GAGAL '+fail:'test_delsent: lolos');process.exit(fail?1:0);
