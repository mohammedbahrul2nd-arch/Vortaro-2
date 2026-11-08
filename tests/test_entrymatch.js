/* v7.40: kalimat Pustaka harus cocok ENTRI kartu. Jalankan: node tests/test_entrymatch.js */
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
const {K}=X;let fails=0;const T=(c,m)=>{if(!c){fails++;console.log('GAGAL:',m)}};
const kj='V:menggantung@ja',ca=K['V:menggantung'];T(ca&&ca[3].ja.length>=3,'kartu menggantung punya >=3 entri ja');
const iK=ca[3].ja.findIndex(e=>e[0]=='掛ける'),iT=ca[3].ja.findIndex(e=>e[0]=='吊るす');
const kK=kj+(iK>0?'~'+iK:''),kT=kj+(iT>0?'~'+iT:'');
S.sl=[{id:'a',L:'ja',f:'紙のカレンダーを壁に掛けました。',r:'',i:'Saya menggantung kalender kertas di dinding.',c:1,tg:[{t:'v',k:kj,n:'掛ける',s:'掛けました',f:''}]},
      {id:'b',L:'ja',f:'洗濯物を庭に吊るしました。',r:'',i:'Saya menggantung cucian di halaman.',c:2,tg:[{t:'v',k:kj,n:'吊るす',s:'吊るしました',f:''}]}];S.lib=[];S.o={gz:'cloze',gzv:'on',gzd:'f'};
const fs_=a=>a.map(x=>x.f);
T(fs_(X.gmCollect(kT,true)).join()=='洗濯物を庭に吊るしました。','entri 吊るす hanya kalimat 吊るす: '+fs_(X.gmCollect(kT,true)));
T(fs_(X.gmCollect(kK,true)).join()=='紙のカレンダーを壁に掛けました。','entri 掛ける hanya kalimat 掛ける: '+fs_(X.gmCollect(kK,true)));
T(X.gmCollect(kj,false).length==2,'mode kartu (tanpa E) tetap gabungan: '+X.gmCollect(kj,false).length);
T(X.gzvCands(kT).every(r=>r.f.includes('吊')),'gzvCands entri 吊るす tidak memuat kalimat lain');
/* zh: 听 vs 听见 */
const kz='V:mendengar@zh',cz=K['V:mendengar'].zh||K['V:mendengar'][3].zh,zl=K['V:mendengar'][3].zh,i1=zl.findIndex(e=>e[0]=='听见'),i0=zl.findIndex(e=>e[0]=='听');
const z1=kz+(i1>0?'~'+i1:''),z0=kz+(i0>0?'~'+i0:'');
S.sl=[{id:'c',L:'zh',f:'老师的话你们都听见了吗？',r:'',i:'Apakah kalian semua mendengar perkataan guru?',c:1,tg:null},{id:'d',L:'zh',f:'我重新听音乐。',r:'',i:'Saya mendengar musik dari awal.',c:2,tg:null}];
X.libSD&&0;
const c1=fs_(X.gmCollect(z1,true)),c0=fs_(X.gmCollect(z0,true));
T(c1.length==1&&c1[0].includes('听见'),'entri 听见 hanya kalimat 听见: '+c1);
T(c0.length==1&&c0[0].includes('重新'),'entri 听 tidak memuat kalimat 听见: '+c0);
/* grammar: In (Akkusativ) vs Dativ */
const gA='g|de|A1|In (Akkusativ): Ke / Ke dalam',gD='g|de|A1|In (Dativ): Di / Di dalam';
if(X.GK[gA]&&X.GK[gD]){S.sl=['Wir gehen in die Schule.','Meine Großeltern wohnen in einem kleinen Dorf.','Das Buch ist im Zimmer.','Er fährt in Berlin.'].map((f,i)=>({id:'g'+i,L:'de',f,r:'',i:'x',c:i,tg:null}));
 const a=fs_(X.gmCollect(gA)),d=fs_(X.gmCollect(gD));
 T(a.includes('Wir gehen in die Schule.')&&!a.includes('Meine Großeltern wohnen in einem kleinen Dorf.')&&!a.includes('Das Buch ist im Zimmer.'),'Akk: '+a);
 T(!d.includes('Wir gehen in die Schule.'),'Dat tidak memuat kalimat Akk: '+d);
 S.sl.push({id:'gt',L:'de',f:'Opa lebt in einem kleinen Haus.',r:'',i:'x',c:9,tg:[{t:'g',k:gD,n:'x',s:'in einem kleinen Haus'}]});T(fs_(X.gmCollect(gD)).includes('Opa lebt in einem kleinen Haus.'),'kalimat bertag grammar tetap lv3');
 T(!a.includes('Er fährt in Berlin.')&&!d.includes('Er fährt in Berlin.'),'tanpa penentu kasus -> bukan lv2')}else T(false,'kartu grammar in tidak ditemukan');
/* v7.62: kata benda otomatis terverifikasi (asing + jamak, arti Indonesia persis + jamak) */
{const kh='N:hobi@de';S.lib=[];S.o={gz:'cloze',gzv:'on',gzd:'f'};
 S.sl=[['n1','Meine Hobbys sind Wandern und Schwimmen.','Hobi-hobi saya adalah hiking dan renang.'],['n2','Mein Hobby ist Lesen.','Hobiku adalah membaca.'],['n3','Mein Hobby ist Lesen.','Kegemaranku adalah membaca.'],['n4','Ich hobbye gern.','Hobi saya bermain.']].map(([id,f,i])=>({id,L:'de',f,r:'',i,c:1,tg:null}));
 const r={};X.gmCollect(kh,true).forEach(x=>r[x.i]=x);
 T(r['Hobi-hobi saya adalah hiking dan renang.']&&r['Hobi-hobi saya adalah hiking dan renang.'].ver,'jamak asing + jamak Indonesia -> terverifikasi');
 T(r['Hobiku adalah membaca.']&&r['Hobiku adalah membaca.'].ver,'akhiran -ku -> terverifikasi');
 T(r['Kegemaranku adalah membaca.']&&!r['Kegemaranku adalah membaca.'].ver&&r['Kegemaranku adalah membaca.'].lv==2,'arti tak cocok -> hanya terdeteksi otomatis');
 T(!r['Hobi saya bermain.']||!r['Hobi saya bermain.'].ver,'kata kecil/bukan nomina Jerman tidak diverifikasi')}
/* v7.63: semua bahasa + salah jumlah ditolak */
{S.lib=[];S.o={gz:'cloze',gzv:'on',gzd:'f'};
 S.sl=[['m1','Mein Hobby ist Lesen.','Hobi-hobiku adalah membaca.','de'],['z1','老师很好。','Guru itu baik.','zh'],['z2','老师们都很忙。','Guru-guru sangat sibuk.','zh'],['z3','他是我的老师。','Dia adalah dosenku.','zh']].map(([id,f,i,L])=>({id,L,f,r:'',i,c:1,tg:null}));
 const g=(k)=>{const r={};X.gmCollect(k,true).forEach(x=>r[x.i]=x);return r},rd=g('N:hobi@de'),rz=g('N:guru@zh');
 T(rd['Hobi-hobiku adalah membaca.']&&rd['Hobi-hobiku adalah membaca.'].ver,'asing tunggal + terjemahan jamak berulang -> lolos (pola friend~teman-teman)');
 T(rz['Guru itu baik.']&&rz['Guru itu baik.'].ver,'zh tanpa jamak: kata benda persis -> terverifikasi');
 T(rz['Guru-guru sangat sibuk.']&&rz['Guru-guru sangat sibuk.'].ver,'zh + jamak Indonesia -> terverifikasi');
 T(!rz['Dia adalah dosenku.']||!rz['Dia adalah dosenku.'].ver,'zh arti tak cocok -> tidak terverifikasi')}
/* v7.65: empat kombinasi jumlah Inggris-Indonesia semuanya lolos */
{S.lib=[];S.o={gz:'cloze',gzv:'on',gzd:'f'};
 const P=[['A friend helps me.','Seorang teman membantu saya.'],['My friends help me.','Teman-teman saya membantu saya.'],['My friends help me.','Teman saya membantu saya.'],['A friend helps me.','Teman-teman membantu saya.']];
 S.sl=P.map(([f,i],n)=>({id:'e'+n,L:'en',f,r:'',i,c:1,tg:null}));
 const c=X.gmCollect('N:teman@en',true);P.forEach(([f,i])=>{const x=c.find(y=>y.f==f&&y.i==i);T(x&&x.ver,'en jumlah bebas lolos: '+f+' ~ '+i)})}
if(fails){console.log('test_entrymatch GAGAL',fails);process.exit(1)}console.log('test_entrymatch: lolos');
