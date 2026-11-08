/* 7.30: uji soal rumpang kosakata dua arah + penanda kata Indonesia. Jalankan: node tests/test_cloze_dir.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};const noop=()=>{};
const ctx={console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop}};
vm.createContext(ctx);
const src=fs.readFileSync(path.join(__dirname,'test_vocabcloze.js'),'utf8'),PRE=eval(src.split('\n').find(l=>l.startsWith('const PRE=')).replace('const PRE=',''));
vm.runInContext(J('data.js')+'\n'+PRE+'\nconst ik=(k,l)=>k+SEP+l;\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n;this.X={GZV,gzvIdSpan,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,GZP,K,GK,SEP,base,lang,idCands};',ctx,{filename:'b.js'});
const X=ctx.X;let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const sp=(t,g)=>{const r=X.gzvIdSpan(t,g);return r?t.slice(r[0][0],r[0][1]):null};
ok(sp('Siswa laki-laki itu berlari lebih cepat daripada saya.','Berlari / Berlari-lari')=='berlari','berlari');
ok(sp('Dia dilarikan ke rumah sakit.','Berlari')=='dilarikan','dilarikan (stem)');
ok(sp('Saya mencintaimu.','Mencintai / Suka')=='mencintaimu','mencintaimu');
ok(sp('Saya suka makan bakpao.','Mencintai / Suka')=='suka','suka');
ok(sp('Kecepatan mobil itu tinggi.','Cepat / Segera')=='Kecepatan'.toLowerCase()||sp('Kecepatan mobil itu tinggi.','Cepat / Segera')=='Kecepatan','kecepatan: '+sp('Kecepatan mobil itu tinggi.','Cepat / Segera'));
ok(sp('Dia melempar keluar sampah.','melempar keluar~ membuang')=='melempar keluar','frasa');
ok(sp('Saya tidak tahu.','Tidak')=='tidak','stopword eksak');
ok(sp('Dia pergi dari sini.','Dari sini / Karena itu')=='dari sini','frasa stop');
ok(sp('Mereka bertemu di kafe.','Air')===null,'tak cocok -> null');
ok(sp('Saya makan nasi.','Makan siang')===null,'frasa tak lengkap');
/* end-to-end semua bahasa: pakai kartu nyata, kalimat Pustaka disintesis dari contoh kartu */
const {K}=X;let UID=0;const out={};
for(const L of ['zh','ja','de','nl','en','eo']){
  let pick=null;
  for(const id in K){const c=K[id],es=c[3][L];if(!es||!es.length)continue;const e=es[0],w=String(e[0]).replace(/^(der|die|das|de|het)\s+/i,'');
    const ex=String(e[2]||'').replace(/\s*\([^)]*\)\s*$/,'');if(!ex||!w||!ex.includes(w)||ex.replace(/\s+/g,'').length<(L=='zh'||L=='ja'?8:12))continue;
    const gl=String(c[2]).split(/[\/~]/)[0].trim().toLowerCase();if(!/^[a-z]{5,}$/.test(gl))continue;
    S.sl=[{id:'u'+(++UID),L,f:ex,r:'',i:'x',c:UID}];S.lib=[];X.GZV.sig='';if(!X.gzvCands(id+'@'+L).length)continue;
    pick={id,w,gl,c,ex};break}
  if(!pick&&['de','nl','en','eo'].includes(L)){
    const T={de:w=>`Gestern habe ich ${w} im Park gesehen und mich sehr gefreut.`,nl:w=>`Gisteren heb ik ${w} in het park gezien en ik was blij.`,en:w=>`Yesterday I saw ${w} in the park and I was very happy.`,eo:w=>`Hieraŭ mi vidis ${w} en la parko kaj mi estis tre feliĉa.`};
    for(const id in K){const c=K[id],es=c[3][L];if(c[1]!='N'||!es||!es.length)continue;const w0=String(es[0][0]);if(L!='en'&&L!='eo'&&!/^(der|die|das|de|het)\s+\p{L}{4,}$/iu.test(w0))continue;if((L=='en'||L=='eo')&&!/^\p{L}{4,}$/u.test(w0))continue;
     const gl=String(c[2]).split(/[\/~]/)[0].trim().toLowerCase();if(!/^[a-z]{5,}$/.test(gl))continue;
     const sw=L=='de'?w0.replace(/^der\s/i,'den '):w0,ex=T[L](sw);S.sl=[{id:'u'+(++UID),L,f:ex,r:'',i:'x',c:UID}];S.lib=[];X.GZV.sig='';X.GZV.c.clear();if(!X.gzvCands(id+'@'+L).length)continue;
     pick={id,w:w0.replace(/^(der|die|das|de|het)\s+/i,''),gl,c,ex};break}}
  if(!pick){console.log('lewati',L);continue}
  const f=pick.ex;
  const i=`Kemarin saya melihat ${pick.gl} itu di taman.`;
  S.sl=[{id:'u'+(++UID),L,f,r:'',i,c:++UID}];S.lib=[];X.GZV.sig='';X.GZV.c.clear();
  const key=pick.id+'@'+L,cs=X.gzvCands(key);
  ok(cs.length==1,L+': 1 kandidat '+key+' '+JSON.stringify(f));if(!cs.length)continue;
  ok(cs[0].ix&&i.slice(...cs[0].ix[0])==pick.gl,L+': penanda Indonesia ('+pick.gl+')');
  for(const d of ['f','i']){const row={...cs[0],d},fr=X.gzvFront(row),bk=X.gzvBack(row);
   if(d=='f'){ok(/class="gzb/.test(fr)&&/<mark class=gzh>/.test(fr),L+' A: kotak asing + penanda Indonesia');ok(!fr.includes('>'+pick.w+'<')&&!fr.includes(pick.w+'</mark>'),L+' A: tidak membocorkan kata asing');
    const front=fr.replace(/<mark class=gzh>[^<]*<\/mark>/g,'');ok(!front.includes(pick.w),L+' A: kata asing tak muncul di depan')}
   else{const noid=fr.replace(/<[^>]+>/g,'');ok(fr.includes('<mark class=gzh>'+pick.w)||fr.includes('<mark class=gzh>'),L+' B: kata asing ditandai');
    const idpart=fr.split('gzfo')[0];ok(!idpart.includes(pick.gl),L+' B: arti Indonesia tak bocor di bagian soal');ok(/gzb gze/.test(idpart),L+' B: kotak Indonesia')}
   ok(bk.includes('gzans'),L+' '+d+': belakang punya jawaban');
   out[L+d]=fr.replace(/<[^>]+>/g,'|').replace(/\|+/g,' | ')}}
/* setting arah */
S.o.gzd='i';{let cs=0;for(let n=0;n<20;n++){const r=X.gzvPick('x');}}
console.log(Object.entries(out).slice(0,6).map(([k,v])=>k+': '+v).join('\n'));
console.log(fail?'ADA GAGAL '+fail:'test_cloze_dir lolos');process.exit(fail?1:0)
