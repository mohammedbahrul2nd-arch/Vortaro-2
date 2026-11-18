/* v7.105.0: sorotan terjemahan Indonesia di tag grammar («Gn: asing >> Indonesia»). Jalankan: node tests/test_idhl.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n'+J('ai-class.js')+'\nconst ik=(k,l)=>k+SEP+l;let fcCur=null;\n;this.X={gmHLS,gmTagId,gmTagSf,gmResolveTags,gmApplyTags,libFailHtml,gmCollect,gmExBlock,gmExamples,gmRoll,gmVerN,gmVerFirst,gzvCands,gmDelSent,aiCovCands,aiCoverage,setCur:v=>{fcCur=v},ik,gmDelSent,gmExBlock,gmExamples,gmRoll,GMEXC,libSD,libDocs,gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;
const {GK}=X;const gk=Object.keys(GK).find(k=>GK[k][1]=='de');const title=GK[gk][4];
const f='Ich habe das Buch gelesen.',i='Saya sudah membaca buku itu.';
const mk=(tagLine,tr)=>{const r={sents:[{n:1,f,i:tr==null?i:tr}],warn:[]};X.gmApplyTags(r,'G1 = '+title+'\n'+tagLine,'de');return r};
/* 1. sorotan Indonesia tersimpan */
let r=mk('[1] G1: habe … gelesen >> sudah … membaca');let g=(r.sents[0].tg||[]).find(t=>t.t=='g'&&t.k==gk);
ok(g&&g.s=='habe … gelesen'&&g.id=='sudah … membaca','id tersimpan: '+JSON.stringify(r.sents[0].tg));
ok(!r.warn.some(w=>/Indonesia/.test(w)),'tanpa peringatan bila valid');
/* 2. potongan Indonesia yang tidak ada di baris Arti dibuang, tag asing tetap */
r=mk('[1] G1: habe … gelesen >> sudah … menulis');g=(r.sents[0].tg||[]).find(t=>t.t=='g'&&t.k==gk);
ok(g&&g.s=='habe … gelesen'&&!g.id,'id salah dibuang, tag asing tetap');ok(r.warn.some(w=>/sorotan terjemahan Indonesia/.test(w)),'ada peringatan id dibuang');
/* 3. ">> -" = tanpa padanan; tanpa >> tetap kompatibel */
r=mk('[1] G1: habe … gelesen >> -');g=(r.sents[0].tg||[]).find(t=>t.t=='g'&&t.k==gk);ok(g&&!g.id&&!r.warn.some(w=>/Indonesia/.test(w)),'>> - tidak dihitung salah');
r=mk('[1] G1: habe … gelesen');g=(r.sents[0].tg||[]).find(t=>t.t=='g'&&t.k==gk);ok(g&&g.s=='habe … gelesen'&&!g.id,'format lama (tanpa >>) tetap jalan');
/* 4. huruf besar/kecil boleh beda; tanpa legenda (G: nama = asing >> id) */
r=mk('[1] G1: habe … gelesen >> SUDAH … Membaca');g=(r.sents[0].tg||[]).find(t=>t.t=='g'&&t.k==gk);ok(g&&g.id=='SUDAH … Membaca','huruf besar/kecil tidak masalah');
const r2={sents:[{n:1,f,i}],warn:[]};X.gmApplyTags(r2,'[1] G: '+title+' = habe … gelesen >> sudah … membaca','de');
const g2=(r2.sents[0].tg||[]).find(t=>t.t=='g'&&t.k==gk);ok(g2&&g2.s=='habe … gelesen'&&g2.id=='sudah … membaca','bentuk G: nama = asing >> id: '+JSON.stringify(r2.sents[0].tg));
/* 5. tag V tidak terganggu */
const r3={sents:[{n:1,f,i}],warn:[]};X.gmApplyTags(r3,'[1] V: lesen > gelesen ; G1: habe … gelesen >> sudah … membaca'.replace('G1:','G1:'),'de');
ok((r3.sents[0].tg||[]).some(t=>t.t=='v'),'tag V tetap terbaca di baris yang sama');
/* 6. penyorotan */
ok(typeof X.gmHLS=='function','gmHLS diekspor');
const h=X.gmHLS(i,['sudah … membaca'],'id');ok(h&&h.includes('<mark>sudah</mark>')&&h.includes('<mark>membaca</mark>'),'sorotan Indonesia: '+h);
ok(X.gmTagId(r.sents[0].tg,gk).length==1,'gmTagId');

/* 8. dua grammar berbeda dalam satu kalimat: sorotan tidak tertukar */
{const ks=Object.keys(GK).filter(k=>GK[k][1]=='de'&&!/[;|>]/.test(GK[k][4]));const a=ks[0],b=ks.find(k=>k!=a&&GK[k][4]!=GK[a][4]);
 const f2='Ich habe das Buch gelesen, weil ich Zeit hatte.',i2='Saya sudah membaca buku itu karena saya punya waktu.';
 const r4={sents:[{n:1,f:f2,i:i2}],warn:[]};
 X.gmApplyTags(r4,'G1 = '+GK[a][4]+'\nG2 = '+GK[b][4]+'\n[1] G1: habe … gelesen >> sudah … membaca ; G2: weil >> karena','de');
 const tg=r4.sents[0].tg||[];
 ok(X.gmTagId(tg,a).join('|')=='sudah … membaca','kartu A hanya menyorot miliknya: '+X.gmTagId(tg,a));
 ok(X.gmTagId(tg,b).join('|')=='karena','kartu B hanya menyorot miliknya: '+X.gmTagId(tg,b));
 ok(X.gmTagSf(tg,a).join('|')=='habe … gelesen'&&X.gmTagSf(tg,b).join('|')=='weil','sorotan asing juga terpisah');
 /* satu grammar dua kali + potongan Indonesia bertabrakan di kalimat */
 const r5={sents:[{n:1,f:f2,i:i2}],warn:[]};
 X.gmApplyTags(r5,'G1 = '+GK[a][4]+'\n[1] G1: habe … gelesen >> sudah … membaca ; G1: hatte >> punya','de');
 ok(X.gmTagId(r5.sents[0].tg,a).length==2,'grammar yang sama dua kali: dua sorotan Indonesia');
 /* A salah menunjuk potongan milik B: tetap lolos (hanya diperiksa ada di Arti), tidak bocor ke kartu B */
 const r6={sents:[{n:1,f:f2,i:i2}],warn:[]};
 X.gmApplyTags(r6,'G1 = '+GK[a][4]+'\nG2 = '+GK[b][4]+'\n[1] G1: habe … gelesen >> karena ; G2: weil >> karena','de');
 ok(X.gmTagId(r6.sents[0].tg,b).join('|')=='karena'&&X.gmTagId(r6.sents[0].tg,a).join('|')=='karena','salah tunjuk tidak bocor lintas kartu (tetap terjadi di kartu A sendiri)');
}
/* 7. prompt memuat format >> */
console.log(fail?fail+' gagal':'test_idhl: semua lolos');process.exit(fail?1:0);
