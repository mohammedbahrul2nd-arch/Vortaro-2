/* B1: uji soal rumpang kartu kosakata dari Pustaka. Jalankan: node tests/test_vocabcloze.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const J=f=>fs.readFileSync(path.join(__dirname,'..','docs','js',f),'utf8');
const S={o:{},lib:[],sl:[],g:{},srs:{},p:{},s:{}};
const noop=()=>{};
const ctx={console,Math,Date,JSON,Set,Map,Object,Array,String,Number,RegExp,parseInt,isFinite,S,esc:s=>String(s),spk:()=>'',document:{addEventListener:noop,getElementById:()=>null,querySelector:()=>null,body:{}},window:{addEventListener:noop},navigator:{},localStorage:{getItem:()=>null,setItem:noop},setTimeout:noop,clearTimeout:noop};
vm.createContext(ctx);
let fail=0;const ok=(c,m)=>{if(!c){fail++;console.log('GAGAL:',m)}};
const PRE="const K={};D.C.forEach(c=>K[c[0]]=c);const GK={};D.G.forEach(g=>GK[g[0]]=g);const LN={};D.L.forEach(l=>LN[l[0]]=l[1]);const SEP='@',base=k=>{const i=String(k).indexOf(SEP);return i<0?k:k.slice(0,i)},lang=k=>{const i=String(k).indexOf(SEP);return i<0?'':k.slice(i+1).replace(/~\\d+$/,'')},ent=k=>{const m=/~(\\d+)$/.exec(String(k));return m?+m[1]:0};"
try{vm.runInContext(J('data.js')+'\n'+PRE+'\nconst ik=(k,l)=>k+SEP+l;\n'+J('pustaka.js')+'\n'+J('gram.js')+'\n;this.X={gzvExt,gzvCands,gzvPick,gzvFront,gzvBack,gzpRoll,gzvRow,GZP,K,GK,SEP,base,lang,libOfKey,gmCollect,libHL,libForms};',ctx,{filename:'b.js'})}
catch(e){console.log('MUAT GAGAL:',String(e.stack).split('\n').slice(0,4).join(' | '));process.exit(2)}
const X=ctx.X;
/* 1. perluasan artikel */
const P=(t,w)=>{const a=t.indexOf(w);return{t,sp:[[a,a+w.length]]}};
let r=X.gzvExt(P('Ich sehe den Hund heute',  'Hund'),'de','N');ok(r.t.slice(...r.sp[0])=='den Hund','den Hund: '+r.t.slice(...r.sp[0]));
r=X.gzvExt(P('Der Hund schläft','Hund'),'de','N');ok(r.t.slice(...r.sp[0])=='Der Hund','Der Hund');
r=X.gzvExt(P('Ik zie het huis','huis'),'nl','N');ok(r.t.slice(...r.sp[0])=='het huis','het huis');
r=X.gzvExt(P('Ik zie mijn huis','huis'),'nl','N');ok(r.t.slice(...r.sp[0])=='huis','tanpa artikel: '+r.t.slice(...r.sp[0]));
r=X.gzvExt(P('Das Haus ist alt','Haus'),'de','V');ok(r.t.slice(...r.sp[0])=='Haus','bukan kata benda tidak diperluas');
r=X.gzvExt(P('I see the dog','dog'),'en','N');ok(r.t.slice(...r.sp[0])=='dog','en tidak diperluas');
r=X.gzvExt(P('Er hat Verstand','Verstand'),'de','N');ok(r.t.slice(...r.sp[0])=='Verstand','tanpa artikel');
console.log(fail?'ADA GAGAL '+fail:'test_vocabcloze: bagian 1 lolos');
/* 2. end-to-end: kartu kosakata Jerman/Belanda + kalimat Pustaka */
fail=0;
const {K}=X;
const find=(L,pos)=>{for(const id in K){const c=K[id];if(c[1]==pos&&c[3][L]&&c[3][L].length){const w=c[3][L][0][0];if(/^(der|die|das|de|het)\s+\p{L}{4,}$/iu.test(w))return{id,w,L}}}};
let sentn=0;
for(const [L,pos,tpl] of [['de','N',w=>`Gestern habe ich ${w} im Park gesehen und mich gefreut.`],['nl','N',w=>`Gisteren heb ik ${w} in het park gezien en ik was blij.`]]){
  const c=find(L,pos);if(!c){console.log('lewati',L,'(tak ada kartu)');continue}
  const noun=c.w.replace(/^\S+\s+/,''),art=c.w.split(/\s+/)[0].toLowerCase();
  const key=c.id+'@'+L;
  const sw=L=='de'?(art=='der'?'den '+noun:art+' '+noun):art+' '+noun;
  S.sl=[{id:'t1',L,f:tpl(sw),r:'',i:'Kemarin saya melihatnya di taman.',c:++sentn}];S.lib=[];
  X.GZP.sig='';
  const cand=X.gzvCands(key);
  ok(cand.length==1,L+': 1 kandidat, dapat '+cand.length+' ('+key+')');
  if(cand.length){const r=cand[0],bl=r.t.slice(r.sp[0][0],r.sp[0][1]);
   console.log(L,'blanko:',JSON.stringify(bl));
   ok(/^(den|der|die|das|de|het)\s/i.test(bl),L+': blanko diawali artikel: '+bl);
   ok(bl.toLowerCase().endsWith(noun.toLowerCase()),L+': blanko diakhiri kata benda');
   const fr=X.gzvFront(r),bk=X.gzvBack(r);
   ok(fr.includes('gzb')&&!fr.includes('>'+noun+'<'),L+': depan berisi kotak dan tidak membocorkan jawaban');
   ok(bk.includes('<mark class=gzh>'),L+': belakang menandai jawaban');
   X.GZP.cur={k:key,row:null,v:null};X.gzpRoll(key);ok(X.gzvRow(key)&&X.gzvRow(key).f==r.f,L+': gzpRoll mengisi baris');}
  S.sl=[];X.GZP.sig='';ok(X.gzvPick(key)===null,L+': tanpa kalimat -> null (kartu biasa)');
  S.sl=[{id:'t1',L,f:tpl('x'),r:'',i:'',c:++sentn}];S.o.gzv='off';ok(X.gzvPick(key)===null,L+': opsi off -> null');S.o.gzv='on';
}
console.log(fail?'ADA GAGAL '+fail:'test_vocabcloze: bagian 2 lolos');
