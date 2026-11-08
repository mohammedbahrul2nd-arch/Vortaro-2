/* 7.30: verifikasi tag V: = tag AI + padanan arti Indonesia. Jalankan: node tests/test_tagverify.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
let CONF=true;const TS=[];const ctx={confirm:()=>CONF,toast:m=>TS.push(m),libOpenId:'',console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"

vm.runInContext(J('data.js')+'\n'+PRE+'\nconst ik=(k,l)=>k+SEP+l;\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n;this.X={gmCollect,gmVerN,gmResolveTags,gzvCands,gzvIdSpan,gmWordKeys,K};',ctx,{filename:'b.js'});
const X=ctx.X,{K}=X;
const sasu='V:menancapkan~ menyorot@ja',sasuNaiTag=(f,s)=>[{t:'v',k:sasu,ks:[sasu],n:'差す',s,f:''}];
let n=0;const sl=(f,i,tg)=>({id:'q'+(++n),L:'ja',f,r:'',i,c:n,tg});
/* A: tag benar + arti cocok; B: tag salah (さすが) + arti tak cocok; C: tag benar tapi arti Indonesia tak memuat padanan */
S.sl=[sl('窓から日が差している。','Sinar matahari menyorot dari jendela.',sasuNaiTag('て形','差して')),
      sl('さすがですね、本当にすごい。','Memang hebat ya, benar-benar luar biasa.',sasuNaiTag('','さす')),
      sl('窓から日が差している。','Ada cahaya di dalam kamar.',sasuNaiTag('て形','差して'))];
S.lib=[];
const col=X.gmCollect(sasu),by=f=>col.filter(x=>x.f==f);
ok(by('窓から日が差している。').some(x=>x.ver),'A: tag + arti cocok -> terverifikasi');
ok(by('窓から日が差している。').filter(x=>x.ver).length==1,'C: arti tak cocok -> TIDAK terverifikasi (hanya 1 dari 2)');
ok(by('さすがですね、本当にすごい。').every(x=>!x.ver),'B: さすが + arti "memang hebat" tidak terverifikasi');
ok(X.gmVerN(sasu)==1,'gmVerN menghitung hanya yang lolos dua syarat: '+X.gmVerN(sasu));
const cc=X.gzvCands(sasu);ok(cc.every(r=>r.ix),'rumpang: semua kandidat punya padanan Indonesia');ok(!cc.some(r=>r.f.startsWith('さすが')),'rumpang: さすが tidak jadi soal 差す');
/* kosakata non-kata-kerja (benda) + homonim lewat ks */
let id,w;for(const i in K){const c=K[i];if(c[1]=='N'&&c[3].de&&c[3].de.length){const x=c[3].de[0][0];if(/^(der|die|das)\s+\p{L}{4,}$/iu.test(x)&&/^[A-Za-z]{5,}/.test(c[2])){id=i;w=x;break}}}
const nk=id+'@de',noun=w.replace(/^\S+\s+/,''),gl=String(K[id][2]).split(/[\/~]/)[0].trim().toLowerCase();
const sN=`Gestern habe ich ${w} im Park gesehen und mich gefreut.`;
const tagN=[{t:'v',k:nk,ks:[nk],n:noun,s:w,f:''}];
S.sl=[{id:'n1',L:'de',f:sN,r:'',i:'Kemarin saya melihat '+gl+' itu di taman.',c:1,tg:tagN},{id:'n2',L:'de',f:sN+' Und mehr.',r:'',i:'Kemarin saya senang sekali.',c:2,tg:tagN}];
ok(X.gmVerN(nk)==1,'kata benda bertag + arti cocok -> terverifikasi (semua jenis kosakata)');
/* ks: homonim — tag menunjuk dua kartu, hanya yang artinya cocok dihitung */
const other='V:zzz-lain@de';S.sl=[{id:'h1',L:'de',f:sN,r:'',i:'Kemarin saya melihat '+gl+' itu di taman.',c:3,tg:[{t:'v',k:other,ks:[other,nk],n:noun,s:w,f:''}]}];
ok(X.gmVerN(nk)==1,'homonim: kartu dengan arti cocok (ks) ikut terhitung');
/* parser: ks terisi untuk lemma bergandaan, cadangan lewat bentuk di kalimat */
const r=X.gmResolveTags(`[1] V: ${noun} > ${noun}`,'de',k=>k=='1'?sN:null),t=r.map['1']&&r.map['1'][0];
ok(t&&t.k&&Array.isArray(t.ks)&&t.ks.includes(t.k),'gmResolveTags mengisi ks');
/* pencocok Indonesia */
const sp=(t,g)=>{const q=X.gzvIdSpan(t,g,true);return q?t.slice(q[0][0],q[0][1]):null};
ok(sp('Saya membuka payung karena hujan.','Menggunakan payung')=='payung','longgar: padanan inti frasa');
ok(sp('Memang hebat ya.','Menancapkan~ menyorot')===null,'tak cocok -> null');
console.log(fail?'ADA GAGAL '+fail:'test_tagverify: lolos');process.exit(fail?1:0)
